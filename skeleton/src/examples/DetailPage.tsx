/**
 * 【示例·详情页】主档头 + 键值对 + 构成占比条:点进某条记录后的页型。
 * 抄范式:页头 chips / wb-kv 键值对 / 占比横条(纯 div 实现)/ 返回动作。
 */
import { useState, type ReactNode } from 'react'
import { detail } from './data'

export function DetailPage(): ReactNode {
  const [tab, setTab] = useState<'档案' | '构成'>('档案')

  return (
    <div className="wb-page">
      <div className="wb-topbar">
        <button className="wb-btn ghost" onClick={() => setTab(tab)}>← 返回</button>
        <div>
          <div className="wb-title" style={{ fontSize: 16 }}>{detail.title}</div>
          <div className="wb-row" style={{ marginTop: 6 }}>
            {detail.chips.map(c => <span key={c} className="wb-chip on">{c}</span>)}
          </div>
        </div>
        <div className="wb-row" style={{ marginLeft: 'auto' }}>
          <button className="wb-btn ghost">编辑</button>
          <button className="wb-btn primary">生成本期报告</button>
        </div>
      </div>

      <div className="wb-tabs">
        {(['档案', '构成'] as const).map(t => (
          <button key={t} className={'wb-tab' + (tab === t ? ' on' : '')} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>
      <div className="wb-body">
        {tab === '档案' ? (
          <div className="wb-grid2">
            <div className="wb-card">
              <div className="wb-sec" style={{ margin: '0 0 12px' }}><span className="wb-sec-no">01</span><span className="wb-sec-title">基础档案</span></div>
              <div className="wb-kv">
                {detail.kv.map(([k, v]) => <span key={k} style={{ display: 'contents' }}><span className="k">{k}</span><span className="wb-num">{v}</span></span>)}
              </div>
            </div>
            <div className="wb-card">
              <div className="wb-sec" style={{ margin: '0 0 12px' }}><span className="wb-sec-no">02</span><span className="wb-sec-title">操作记录</span></div>
              <div className="wb-kv">
                <span className="k">最近报告</span><span className="wb-num">2026-09-30</span>
                <span className="k">生成方式</span><span>模型直调</span>
                <span className="k">核验状态</span><span className="wb-pill ok">已通过</span>
              </div>
              <div className="wb-note" style={{ marginTop: 14 }}>详情页只做「看」;动作按钮触发的应是明确反馈(见表单页的提交范式)。</div>
            </div>
          </div>
        ) : (
          <div className="wb-card">
            <div className="wb-sec" style={{ margin: '0 0 14px' }}><span className="wb-sec-no">03</span><span className="wb-sec-title">成本构成(占比条)</span></div>
            {detail.costs.map(c => (
              <div key={c.label} style={{ marginBottom: 12 }}>
                <div className="wb-row" style={{ justifyContent: 'space-between' }}>
                  <span>{c.label}</span>
                  <span className="wb-num">{c.value} · {(c.share * 100).toFixed(0)}%</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: 'var(--wb-line)', marginTop: 5 }}>
                  <div style={{ width: `${c.share * 100}%`, height: '100%', borderRadius: 4, background: 'var(--wb-accent)' }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
