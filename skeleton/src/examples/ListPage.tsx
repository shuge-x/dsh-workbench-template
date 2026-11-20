/**
 * 【示例·列表页】筛选行 + 表格 + 分页:工作台第二常见的页型。
 * 抄范式:受控筛选(useState)/ 表格悬停 / 状态徽章映射 / 空结果态。
 */
import { useMemo, useState, type ReactNode } from 'react'
import { roster } from './data'

const PAGE_SIZE = 4

export function ListPage(): ReactNode {
  const [region, setRegion] = useState('全部')
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(0)

  const regions = ['全部', ...new Set(roster.map(r => r.region))]
  const filtered = useMemo(() =>
    roster.filter(r =>
      (region === '全部' || r.region === region)
      && (keyword === '' || r.name.includes(keyword) || r.id.toLowerCase().includes(keyword.toLowerCase())),
    ), [region, keyword])
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pages - 1)
  const rows = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE)

  return (
    <div className="wb-page">
      <div className="wb-topbar">
        <div>
          <div className="wb-title">门店列表</div>
          <div className="wb-sub">示例:筛选受控 + 表格 + 分页 + 空结果态</div>
        </div>
      </div>
      <div className="wb-body">
        <div className="wb-row" style={{ marginBottom: 14 }}>
          <select className="wb-select" value={region} onChange={e => { setRegion(e.target.value); setPage(0) }}>
            {regions.map(r => <option key={r}>{r}</option>)}
          </select>
          <input className="wb-input" placeholder="搜门店名 / 编号" value={keyword}
            onChange={e => { setKeyword(e.target.value); setPage(0) }} style={{ width: 220 }} />
          <span className="wb-sub">{filtered.length} 家</span>
        </div>

        <div className="wb-card" style={{ padding: '4px 8px' }}>
          {rows.length === 0 ? (
            <div className="wb-empty">
              <div>没有匹配的门店</div>
              <button className="wb-btn ghost" onClick={() => { setKeyword(''); setRegion('全部') }}>清空筛选</button>
            </div>
          ) : (
            <table className="wb-table">
              <thead>
                <tr><th>编号</th><th>门店</th><th>大区</th><th>负责人</th><th>状态</th><th style={{ textAlign: 'right' }}>本期实收</th></tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.id}>
                    <td className="wb-sub">{r.id}</td>
                    <td style={{ fontWeight: 600 }}>{r.name}</td>
                    <td>{r.region}</td>
                    <td>{r.owner}</td>
                    <td><span className={'wb-pill ' + r.status}>{r.label}</span></td>
                    <td className="wb-num" style={{ textAlign: 'right' }}>¥{r.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="wb-row" style={{ justifyContent: 'flex-end', marginTop: 12 }}>
          <button className="wb-btn ghost" disabled={safePage === 0} onClick={() => setPage(safePage - 1)}>上一页</button>
          <span className="wb-sub">{safePage + 1} / {pages}</span>
          <button className="wb-btn ghost" disabled={safePage >= pages - 1} onClick={() => setPage(safePage + 1)}>下一页</button>
        </div>
      </div>
    </div>
  )
}
