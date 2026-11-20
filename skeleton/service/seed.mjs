/** 确定性造数骨架:3 个区域 × 最近 7 天的演示订单。 */
export function seed(db) {
  const ins = db.prepare('INSERT INTO demo_orders (date, region, amount) VALUES (?,?,?)')
  const regions = ['华东', '华北', '华南']
  db.exec('BEGIN')
  for (let d = 6; d >= 0; d--) {
    const date = new Date(Date.now() - d * 86400000).toISOString().slice(0, 10)
    for (const region of regions) {
      const base = 1000 + (region.length * 137) // 确定性:无随机也可
      ins.run(date, region, base + d * 13)
    }
  }
  db.exec('COMMIT')
}
