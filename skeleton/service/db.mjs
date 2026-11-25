/**
 * 数据库层骨架:SQLite(node:sqlite),版本化表结构迁移 + 首启造数(确定性)。
 */
import { homedir } from 'node:os'
import { DatabaseSync } from 'node:sqlite'
import { copyFileSync, mkdirSync, existsSync, readFileSync, realpathSync } from 'node:fs'
import { dirname, join, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { seed } from './seed.mjs'

const here = dirname(fileURLToPath(import.meta.url))       // .../<包名>/service
const PKG_DIR = dirname(here)                              // 包根
const PKG_NAME = JSON.parse(readFileSync(join(PKG_DIR, 'package.json'), 'utf8')).name
const DB_FILE = 'workbench.db'

/**
 * 数据目录按优先级解析:
 *  1. WB_DATA_DIR 环境变量:显式覆盖(测试用)
 *  2. <profile 根>/data/<包名>/:随 profile 存活、重启不丢、永不随包打包(升级/重装替换包目录不碰数据)。
 *     profile 根取自宿主根上下文的 ctx.baseUrl(file://…/profiles/<名>/),由 index.js 的 apply() 经
 *     configureDataDir() 传入。**不要改用环境变量**:DSH_PROFILE / DSH_PROFILE_DIR 只出现在宿主发起的
 *     shell 调用里,Host 进程自己的环境里没有(0.2.2-rc.5 真机探针实测,见 playbook §11)
 *  3. $DSH_PROFILE_DIR 若存在(在宿主的 shell 调用里直接跑 service 层时)→ 其下 data/<包名>/
 *  4. 独立运行、没有 profile → ~/.dsh/data/<包名>/
 */
let profileDataDir = null

/** 把宿主给的 ctx.baseUrl 换成 profile 下的数据目录;只在它确实指向包目录之外的位置时采纳。 */
export function configureDataDir({ baseUrl } = {}) {
  if (typeof baseUrl !== 'string' || !baseUrl.startsWith('file:')) return
  let root
  try { root = fileURLToPath(baseUrl) } catch { return }
  // 两侧都用真实路径比较:Node 加载模块时已解析符号链接,profile 或项目经符号链接访问时才不会误判。
  // 目录尚不存在时 realpath 会抛错,那就按原样比较(不应发生:宿主先建 profile 目录才装插件)
  try { root = realpathSync(root) } catch { /* 保留未解析的路径 */ }
  if (root === PKG_DIR || root.startsWith(PKG_DIR + sep)) return // 没有 profile 时它可能就是包目录:数据不能落回包里
  profileDataDir = join(root, 'data', PKG_NAME)
}

export function resolveDataDir() {
  if (process.env.WB_DATA_DIR) return process.env.WB_DATA_DIR
  if (profileDataDir !== null) return profileDataDir
  const base = process.env.DSH_PROFILE_DIR ? join(process.env.DSH_PROFILE_DIR, 'data') : join(homedir(), '.dsh', 'data')
  return join(base, PKG_NAME)
}

/**
 * 旧位置(只读):新位置还没有库时,从这里复制一份过去(db + wal/shm 同行),旧位置原样保留。
 *  - ~/.dsh/data/<包名>/:曾经的回退位置——环境变量在 Host 进程里读不到,数据实际一直落在这里
 *  - <包根>/data/:最早的落点,会随包打包
 */
const LEGACY_DATA_DIRS = [join(homedir(), '.dsh', 'data', PKG_NAME), join(PKG_DIR, 'data')]

function migrateLegacyData(dbPath) {
  if (existsSync(dbPath)) return // 新位置已有库:不覆盖
  for (const dir of LEGACY_DATA_DIRS) {
    const old = join(dir, DB_FILE)
    if (old === dbPath || !existsSync(old)) continue
    mkdirSync(dirname(dbPath), { recursive: true })
    copyFileSync(old, dbPath)
    for (const suffix of ['-wal', '-shm']) {
      if (existsSync(old + suffix)) copyFileSync(old + suffix, dbPath + suffix)
    }
    return
  }
}

/**
 * 表结构迁移(AGENTS.md 默认策略 4)。每一步是幂等 DDL,按数组顺序执行;PRAGMA user_version 记录已执行到第几步。
 * 业务加表 / 改表 = 往末尾**追加**一步;不要改已发布的步骤,也不要在别处另写 CREATE TABLE。
 * 第 1 步(演示表)必须是 CREATE TABLE IF NOT EXISTS:本机制引入之前建的库 user_version 是 0,但表已经存在。
 */
const MIGRATIONS = [
  (db) => db.exec(`
    CREATE TABLE IF NOT EXISTS demo_orders (
      id INTEGER PRIMARY KEY,
      date TEXT NOT NULL,
      region TEXT NOT NULL,
      amount REAL NOT NULL
    );
  `),
]

function migrate(db) {
  const { user_version: current } = db.prepare('PRAGMA user_version').get()
  for (let version = current; version < MIGRATIONS.length; version += 1) {
    db.exec('BEGIN')
    try {
      MIGRATIONS[version](db)
      db.exec(`PRAGMA user_version = ${version + 1}`)
      db.exec('COMMIT')
    } catch (error) {
      db.exec('ROLLBACK')
      throw error // 不删库:失败的可能是带着用户数据的既有库,留给人来修
    }
  }
}

let db = null

export function getDb() {
  if (db !== null) return db
  const dataDir = resolveDataDir()
  const dbPath = join(dataDir, DB_FILE)
  migrateLegacyData(dbPath)
  mkdirSync(dataDir, { recursive: true })
  db = new DatabaseSync(dbPath)
  db.exec('PRAGMA journal_mode = WAL')
  migrate(db)
  if (db.prepare('SELECT COUNT(*) AS n FROM demo_orders').get().n === 0) {
    try {
      seed(db)
    } catch (error) {
      // 只回滚、不删库:库里可能已经有业务数据。回滚后演示表仍为空,下次启动会重试
      try { db.exec('ROLLBACK') } catch { /* 没有打开的事务时忽略 */ }
      console.warn(`[wb-data] 演示数据造数失败,下次启动重试(业务数据不受影响):${error.message}`)
    }
  }
  return db
}
