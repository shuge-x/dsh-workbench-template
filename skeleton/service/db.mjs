/** 数据库层骨架:SQLite(node:sqlite),首启自动建表 + 造数(确定性)。 */
import { DatabaseSync } from 'node:sqlite'
import { mkdirSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { seed } from './seed.mjs'

export const DATA_DIR = join(dirname(fileURLToPath(import.meta.url)), 'data')
export const DB_PATH = join(DATA_DIR, 'workbench.db')

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
