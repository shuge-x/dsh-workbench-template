/**
 * 【示例·表单页】输入/选择/校验/提交/反馈的完整闭环(纯前端 mock,不调业务路由)。
 * 抄范式:wb-field 表单结构 / 提交中禁用 + 按钮态 / 成功与失败两种反馈 / 校验前置。
 */
import { useState, type ReactNode } from 'react'
import { form } from './data'

type Feedback = { kind: 'ok' | 'err'; text: string } | null

export function FormPage(): ReactNode {
  const [store, setStore] = useState(form.stores[0])
  const [metric, setMetric] = useState(form.metrics[0])
  const [threshold, setThreshold] = useState('50000')
  const [notify, setNotify] = useState(true)
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState<Feedback>(null)

  const submit = (): void => {
    const n = Number(threshold)
    if (!Number.isFinite(n) || n <= 0) {
      setFeedback({ kind: 'err', text: '阈值必须是正数(校验前置,不发请求)' })
      return
    }
    setBusy(true)
    setFeedback(null)
    // mock 提交:示例区不 fetch 业务路由;接真后端时把这段换成 await fetch(...)
    window.setTimeout(() => {
      setBusy(false)
      setFeedback({ kind: 'ok', text: `已保存:${store} 的「${metric}」预警阈值 ¥${n.toLocaleString()}${notify ? ',并开启通知' : ''}` })
    }, 900)
  }

  return (
    <div className="wb-page">
      <div className="wb-topbar">
        <div>
          <div className="wb-title">预警设置</div>
          <div className="wb-sub">示例:表单闭环——校验前置、提交中禁用、明确反馈</div>
        </div>
      </div>
      <div className="wb-body" style={{ maxWidth: 560 }}>
        <div className="wb-card">
          <div className="wb-field">
            <label>门店</label>
            <select className="wb-select" value={store} onChange={e => setStore(e.target.value)}>
              {form.stores.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="wb-field">
            <label>监控指标</label>
            <select className="wb-select" value={metric} onChange={e => setMetric(e.target.value)}>
              {form.metrics.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div className="wb-field">
            <label>预警阈值(元)</label>
            <input className="wb-input" value={threshold} onChange={e => setThreshold(e.target.value)} placeholder="如 50000" />
          </div>
          <div className="wb-field">
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--wb-ink)', fontSize: 13 }}>
              <input type="checkbox" checked={notify} onChange={e => setNotify(e.target.checked)} />
              触发时通知运营专员
            </label>
          </div>
          <div className="wb-row">
            <button className="wb-btn primary" disabled={busy} onClick={submit}>
              {busy ? '保存中…' : '保存设置'}
            </button>
            <button className="wb-btn ghost" disabled={busy} onClick={() => { setFeedback(null); setThreshold('50000') }}>重置</button>
          </div>
          {feedback !== null && (
            <div className="wb-row" style={{ marginTop: 14, gap: 8 }}>
              <span className={'wb-pill ' + (feedback.kind === 'ok' ? 'ok' : 'err')}>{feedback.kind === 'ok' ? '成功' : '失败'}</span>
              <span style={{ fontSize: 12.5 }}>{feedback.text}</span>
            </div>
          )}
        </div>
        <div className="wb-note" style={{ marginTop: 14 }}>
          真实提交走同源数据服务(见 api.ts 的 post);可选参数直接省略 required 字段,别写 required: false(坑 #1)。
        </div>
      </div>
    </div>
  )
}
