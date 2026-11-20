/**
 * 【示例·总览页】工作台的门面页型:KPI 卡网格 + 折线趋势 + 信号列表。
 * 抄范式:wb-grid4 KPI / wb-sec 区块标题 / SVG 折线零依赖画法 / wb-pill 语义徽章。
 * 内容是虚构数据——重点看结构:顶部页签条 + 分区滚动,根容器 wb-page(红线 #14)。
 */
import type { ReactNode } from 'react'
import { overview } from './data'

/** 零依赖折线图:归一化到 viewBox,标签用 HTML 覆盖层(SVG 文字会被 viewBox 放大,坑 #2)。 */
function Trend({ months, current, last }: { months: string[]; current: number[]; last: number[] }): ReactNode {
  const w = 560; const h = 150; const pad = 8
  const max = Math.max(...current, ...last) * 1.08
  const pt = (arr: number[], i: number): string =>
    `${pad + (i * (w - pad * 2)) / (arr.length - 1)},${h - pad - (arr[i] / max) * (h - pad * 2)}`
  const path = (arr: number[]): string => arr.map((_, i) => `${i === 0 ? 'M' : 'L'}${pt(arr, i)}`).join(' ')
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 150, display: 'block' }}>
        <path d={path(last)} fill="none" stroke="#c07a2b" strokeWidth="2" />
        <path d={path(current)} fill="none" stroke="#22301f" strokeWidth="2" />
        {current.map((v, i) => <circle key={i} cx={pt(current, i).split(',')[0]} cy={pt(current, i).split(',')[1]} r="3" fill="#22301f" />)}
      </svg>
      <div className="wb-row" style={{ justifyContent: 'space-between', padding: '4px 2px 0' }}>
        {months.map(m => <span key={m} className="wb-sub">{m}</span>)}
      </div>
    </div>
  )
}

export function OverviewPage(): ReactNode {
  return (
    <div className="wb-page">
      <div className="wb-topbar">
        <div>
          <div className="wb-title">经营总览</div>
          <div className="wb-sub">示例数据 · 报告期 2026-09 · 演示「KPI 卡 + 趋势 + 信号」的门面结构</div>
        </div>
        <div className="wb-row" style={{ marginLeft: 'auto' }}>
          <span className="wb-chip">虚构门店</span>
          <button className="wb-btn ghost">导出</button>
          <button className="wb-btn primary">生成解读</button>
        </div>
      </div>
      <div className="wb-body">
        <div className="wb-grid4">
          {overview.kpis.map(k => (
            <div key={k.label} className="wb-card wb-kpi">
              <div className="l">{k.label}</div>
              <div className="v wb-num">{k.value}</div>
              <span className={k.delta >= 0 ? 'wb-up' : 'wb-down'}>{k.delta >= 0 ? '+' : ''}{(k.delta * 100).toFixed(1)}%</span>
              <span className="wb-sub"> {k.note}</span>
            </div>
          ))}
        </div>

        <div className="wb-sec"><span className="wb-sec-no">01</span><span className="wb-sec-title">趋势对照</span></div>
        <div className="wb-card">
          <div className="wb-row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
            <div className="wb-legend">
              <span><i style={{ background: '#22301f' }} />本期</span>
              <span><i style={{ background: '#c07a2b' }} />去年同月</span>
            </div>
            <span className="wb-sub">人民币元</span>
          </div>
          <Trend months={overview.trend.months} current={overview.trend.current} last={overview.trend.last} />
        </div>

        <div className="wb-sec"><span className="wb-sec-no">02</span><span className="wb-sec-title">值得关注的信号</span></div>
        <div className="wb-grid2">
          {overview.signals.map(s => (
            <div key={s.no} className="wb-card">
              <div className="wb-row" style={{ alignItems: 'flex-start', gap: 10 }}>
                <span className="wb-sec-no">{s.no}</span>
                <div>
                  <div style={{ fontWeight: 600 }}>{s.head}</div>
                  <div className="wb-sub" style={{ marginTop: 4 }}>{s.detail}</div>
                  <span className={'wb-pill ' + s.tone} style={{ marginTop: 8 }}>{s.tone === 'ok' ? '机会' : '风险'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
