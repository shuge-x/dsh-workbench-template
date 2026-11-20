/**
 * 【示例·图表页】折线 + 柱状 + 图例 + 周期切换。
 * 抄范式:零依赖 SVG 图(折线/柱)/ 归一化与坐标轴留白 / 切换周期不换组件只换数据。
 * 大量文字别放进 SVG(viewBox 会把 fontSize 放大,坑 #2);轴标签用 HTML 覆盖层。
 */
import { useState, type ReactNode } from 'react'
import { chart } from './data'

function LineChart(): ReactNode {
  const { months, series } = chart.lines
  const w = 640; const h = 190; const pad = 10
  const max = Math.max(...series.flatMap(s => s.data)) * 1.08
  const x = (i: number): number => pad + (i * (w - pad * 2)) / (months.length - 1)
  const y = (v: number): number => h - pad - (v / max) * (h - pad * 2)
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 190, display: 'block' }}>
        {[0.25, 0.5, 0.75].map(g => (
          <line key={g} x1={pad} x2={w - pad} y1={h - pad - g * (h - pad * 2)} y2={h - pad - g * (h - pad * 2)} stroke="var(--wb-line)" strokeDasharray="4 4" />
        ))}
        {series.map(s => (
          <path key={s.name} d={s.data.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(v)}`).join(' ')}
            fill="none" stroke={s.color} strokeWidth="2" />
        ))}
      </svg>
      <div className="wb-row" style={{ justifyContent: 'space-between', padding: '2px 2px 0' }}>
        {months.map(m => <span key={m} className="wb-sub">{m}</span>)}
      </div>
    </div>
  )
}

function BarChart(): ReactNode {
  const max = Math.max(...chart.bars.map(b => b.value))
  return (
    <div className="wb-row" style={{ alignItems: 'flex-end', gap: 18, height: 190, padding: '0 6px' }}>
      {chart.bars.map(b => (
        <div key={b.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
          <span className="wb-sub wb-num">¥{b.value.toLocaleString()}</span>
          <div style={{ width: '100%', maxWidth: 64, height: `${(b.value / max) * 82}%`, background: 'var(--wb-accent)', borderRadius: '6px 6px 0 0', opacity: .85 }} />
          <span className="wb-sub">{b.label}</span>
        </div>
      ))}
    </div>
  )
}

export function ChartPage(): ReactNode {
  const [period, setPeriod] = useState(chart.periods[0])
  return (
    <div className="wb-page">
      <div className="wb-topbar">
        <div>
          <div className="wb-title">图表分析</div>
          <div className="wb-sub">示例:折线(时间趋势)+ 柱状(构成对比),零图表库依赖</div>
        </div>
        <div className="wb-row" style={{ marginLeft: 'auto' }}>
          {chart.periods.map(p => (
            <button key={p} className={'wb-chip' + (period === p ? ' on' : '')} onClick={() => setPeriod(p)}>{p}</button>
          ))}
        </div>
      </div>
      <div className="wb-body">
        <div className="wb-sec"><span className="wb-sec-no">01</span><span className="wb-sec-title">收入趋势({period})</span></div>
        <div className="wb-card">
          <div className="wb-legend" style={{ marginBottom: 8 }}>
            {chart.lines.series.map(s => <span key={s.name}><i style={{ background: s.color }} />{s.name}</span>)}
          </div>
          <LineChart />
        </div>
        <div className="wb-sec"><span className="wb-sec-no">02</span><span className="wb-sec-title">成本构成</span></div>
        <div className="wb-card"><BarChart /></div>
        <div className="wb-note">真实项目数据量大时再引图表库;演示与轻量场景,手写 SVG 足够且零依赖。</div>
      </div>
    </div>
  )
}
