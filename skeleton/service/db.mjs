/** 数据库层骨架:SQLite(node:sqlite),首启自动建表 + 造数(确定性)。 */
import { DatabaseSync } from 'node:sqlite'
import { copyFileSync, mkdirSync, rmSync, existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { seed } from './seed.mjs'

const here = dirname(fileURLToPath(import.meta.url))       // .../<包名>/service
const PKG_ROOT = dirname(here)                              // 包根
const PKG_NAME = JSON.parse(readFileSync(join(PKG_ROOT, 'package.json'), 'utf8')).name

/** 从包根向上找 profile 根(package.json 带 dsh.profile 标记);独立运行返回 null。
 *  兼容 link:(realpath=项目目录,向上无 profile)与 pnpm git(.pnpm 布局,向上有)两种安装形态。 */
function findProfileRoot() {
  let dir = PKG_ROOT
  for (let i = 0; i < 10; i += 1) {
    const marker = join(dir, 'package.json')
    if (existsSync(marker)) {
      try {
        const p = JSON.parse(readFileSync(marker, 'utf8'))
        if (p?.dsh?.profile) return dir
      } catch { /* 继续向上 */ }
    }
    const parent = dirname(dir)
    if (parent === dir) return null
    dir = parent
  }
  return null
}

/**
 * 数据目录:优先 <profile根>/data/<包名>/——跟随 profile 的稳定位置,
 * 插件升级/重装(node_modules 包目录被替换)不触碰数据。
 * profile 之外独立运行时回退到包内 data/(当前行为)。
 */
const legacyDir = join(here, 'data')                      // 旧位置:包内(github/npm 安装升级时会被替换)
const profileRoot = findProfileRoot()
export const DATA_DIR = profileRoot ? join(profileRoot, 'data', PKG_NAME) : legacyDir
export const DB_PATH = join(DATA_DIR, 'data.db')

// 一次性迁移:旧位置有库、新位置没有 → 整体搬移(含 WAL/SHM)。
// 场景:项目先以 link 方式运行(数据在包内),后来改用 github/npm 分发安装——升级不丢库。
if (profileRoot && existsSync(join(legacyDir, 'data.db')) && !existsSync(DB_PATH)) {
  mkdirSync(DATA_DIR, { recursive: true })
  copyFileSync(join(legacyDir, 'data.db'), DB_PATH)
  for (const suffix of ['-wal', '-shm']) {
    if (existsSync(join(legacyDir, 'data.db') + suffix)) copyFileSync(join(legacyDir, 'data.db') + suffix, DB_PATH + suffix)
  }
}

let db = null

export function getDb() {
  if (db !== null) return db
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
