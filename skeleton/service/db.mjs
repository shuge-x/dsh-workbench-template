/** 数据库层骨架:SQLite(node:sqlite),首启自动建表 + 造数(确定性)。 */
import { homedir } from 'node:os'
import { DatabaseSync } from 'node:sqlite'
import { copyFileSync, mkdirSync, rmSync, existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { seed } from './seed.mjs'

const here = dirname(fileURLToPath(import.meta.url))       // .../<包名>/service
const PKG_DIR = dirname(here)                              // 包根
const PKG_NAME = JSON.parse(readFileSync(join(PKG_DIR, 'package.json'), 'utf8')).name

/**
 * 数据目录(优先级,与 ai-writing-workbench 会话的标准实现一致):
 *  1. <前缀>_DATA_DIR 环境变量显式覆盖(测试用)
 *  2. $DSH_PROFILE_DIR/data/<包名>/ —— profile 用户数据区(官方 env,随 profile 存活、
 *     重启不丢、永不随包打包;插件升级/重装替换包目录不触碰数据)
 *  3. 无 profile(独立运行)回退 ~/.dsh/data/<包名>/
 * 旧位置(包目录内 service/data/)的一次性搬迁见 LEGACY_MIGRATE。
 */
function resolveDataDir() {
  const envOverride = process.env.WB_DATA_DIR
  if (envOverride) return envOverride
  const base = process.env.DSH_PROFILE_DIR
    ? join(process.env.DSH_PROFILE_DIR, 'data')
    : join(homedir(), '.dsh', 'data')
  return join(base, PKG_NAME)
}

export const DATA_DIR = resolveDataDir()
export const DB_PATH = join(DATA_DIR, 'workbench.db')

/** 老位置(包目录内 service/data/):首启自动搬迁,搬完即弃,包目录不再产生运行时数据。 */
const LEGACY_DATA_DIR = join(PKG_DIR, 'data')

/** 一次性搬迁老库(db + wal/shm 同行);新库已存在则不动,避免覆盖。 */
function migrateLegacyData() {
  const old = join(LEGACY_DATA_DIR, 'workbench.db')
  if (!existsSync(old) || existsSync(DB_PATH)) return
  mkdirSync(DATA_DIR, { recursive: true })
  copyFileSync(old, DB_PATH)
  for (const suffix of ['-wal', '-shm']) {
    if (existsSync(old + suffix)) copyFileSync(old + suffix, DB_PATH + suffix)
  }
}

let db = null

export function getDb() {
  if (db !== null) return db
  migrateLegacyData()
  mkdirSync(DATA_DIR, { recursive: true })
  db = new DatabaseSync(DB_PATH)
  db.exec('PRAGMA journal_mode = WAL')
  createSchema(db)
  if (db.prepare('SELECT COUNT(*) AS n FROM demo_orders').get().n === 0) {
    try {
      seed(db)
    } catch (error) {
      // 造数失败:删掉半成品库,下次启动重造
      try { db.exec('ROLLBACK') } catch { /* 无事务时忽略 */ }
      db.close()
      db = null
      for (const suffix of ['', '-wal', '-shm']) rmSync(DB_PATH + suffix, { force: true })
      throw error
    }
  }
  return db
}

function createSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS demo_orders (
      id INTEGER PRIMARY KEY,
      date TEXT NOT NULL,
      region TEXT NOT NULL,
      amount REAL NOT NULL
    );
  `)
}
