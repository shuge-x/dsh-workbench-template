/** 查询函数骨架:HTTP 路由与 agent 工具共用。按领域重写这里的函数即可。 */
import { getDb } from './db.mjs'

const r2 = (v) => Math.round(v * 100) / 100

/** 按区域汇总(最近 7 天)。 */
export function regionSummary() {
  const db = getDb()
  const rows = db.prepare(`
    SELECT region, COUNT(*) AS orders, SUM(amount) AS amount
    FROM demo_orders GROUP BY region ORDER BY amount DESC`).all()
  return rows.map(r => ({ region: r.region, orders: r.orders, amount: r2(r.amount) }))
}

/** 最新一天与总量。 */
export function latest() {
  const db = getDb()
  const row = db.prepare('SELECT MAX(date) date, SUM(amount) amount FROM demo_orders').get()
  return { date: row.date, amount: r2(row.amount ?? 0) }
}
