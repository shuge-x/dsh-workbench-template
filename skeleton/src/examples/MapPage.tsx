/**
 * 【示例·地图页】区域经营地图的完整范式:投影 → 路径 → HTML 覆盖层标签 → 交互。
 * 抄范式:Web Mercator 投影公式 / SVG 多边形按值着色 / 标签用 HTML 覆盖层(SVG 文字会被
 * viewBox 放大,坑 #2)/ 悬停高亮 + 点击选中侧栏详情。
 * 轮廓是虚构的抽象区域;真实地理版(中国 GeoJSON)见样板项目 dsh-workbench-sample 的经营地图。
 */
import { useState, type ReactNode } from 'react'
import { mapData } from './data'

const W = 800; const H = 560

/** Web Mercator(西经..东经, 南纬..北纬)→ [0,1] 归一化;真实地图用同一公式。 */
function mercator(lon: number, lat: number): [number, number] {
  const x = (lon + 180) / 360
  const rad = (lat * Math.PI) / 180
  const y = (1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2
  return [x, y]
}

/** 把虚构经纬度窗口(100..135E, 15..50N)映射到本画布。 */
function project(lon: number, lat: number): [number, number] {
  const [nx, ny] = mercator(lon, lat)
  const x = ((nx - (100 + 180) / 360) / ((135 + 180) / 360 - (100 + 180) / 360)) * W
  const y = ((ny - (1 - Math.log(Math.tan((50 * Math.PI) / 180) + 1 / Math.cos((50 * Math.PI) / 180)) / Math.PI) / 2)
    / ((1 - Math.log(Math.tan((15 * Math.PI) / 180) + 1 / Math.cos((15 * Math.PI) / 180)) / Math.PI) / 2
      - (1 - Math.log(Math.tan((50 * Math.PI) / 180) + 1 / Math.cos((50 * Math.PI) / 180)) / Math.PI) / 2)) * H
  return [x, y]
}

const max = Math.max(...mapData.regions.map(r => r.value))

export function MapPage(): ReactNode {
  const [selected, setSelected] = useState<string | null>('r1')
  const [hover, setHover] = useState<string | null>(null)
  const sel = mapData.regions.find(r => r.id === selected) ?? null

  return (
    <div className="wb-page">
      <div className="wb-topbar">
        <div>
          <div className="wb-title">区域经营地图</div>
          <div className="wb-sub">示例:抽象区域 + Web Mercator 散点投影 + 覆盖层标签 + 点击联动(虚构数据)</div>
        </div>
        <div className="wb-legend" style={{ marginLeft: 'auto' }}>
          <span><i style={{ background: 'var(--wb-accent)', opacity: .95 }} />高</span>
          <span><i style={{ background: 'var(--wb-accent)', opacity: .55 }} />中</span>
          <span><i style={{ background: 'var(--wb-accent)', opacity: .25 }} />低</span>
        </div>
      </div>
      <div className="wb-body wbex-map-layout">
        <div className="wb-card" style={{ position: 'relative', padding: 0, overflow: 'hidden' }}>
          <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block', background: 'var(--wb-bg)' }}>
            {mapData.regions.map(r => (
              <path key={r.id} d={r.path}
                fill={'var(--wb-accent)'}
                fillOpacity={hover === r.id ? 0.9 : 0.2 + (r.value / max) * 0.6}
                stroke={selected === r.id ? 'var(--wb-ink)' : 'var(--wb-card)'}
                strokeWidth={selected === r.id ? 3 : 1.5}
                onMouseEnter={() => setHover(r.id)}
                onMouseLeave={() => setHover(null)}
                onClick={() => setSelected(r.id)}
                style={{ cursor: 'pointer', transition: 'fill-opacity .15s' }} />
            ))}
            {/* 门店散点:真投影公式投影的虚构经纬度 */}
            {mapData.stores.map(s => {
              const [x, y] = project(s.lon, s.lat)
              return <circle key={s.name} cx={x} cy={y} r={6} fill="var(--wb-warn)" stroke="var(--wb-card)" strokeWidth={2} />
            })}
          </svg>
          {/* HTML 覆盖层标签:按区域质心百分比定位(坑 #2:文字不进 SVG) */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {mapData.regions.map(r => {
              const pts = r.path.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? []
              const cx = pts.filter((_, i) => i % 2 === 0).reduce((a, b) => a + b, 0) / (pts.length / 2)
              const cy = pts.filter((_, i) => i % 2 === 1).reduce((a, b) => a + b, 0) / (pts.length / 2)
              return (
                <div key={r.id} className="wbex-map-label" style={{ left: `${(cx / W) * 100}%`, top: `${(cy / H) * 100}%` }}>
                  <b>{r.name}</b>
                  <span className="wb-num">¥{(r.value / 1000).toFixed(1)}k</span>
                </div>
              )
            })}
          </div>
        </div>

        <div>
          {sel !== null ? (
            <div className="wb-card">
              <div style={{ fontWeight: 650, fontSize: 15 }}>{sel.name}</div>
              <div className="wb-kv" style={{ marginTop: 10 }}>
                <span className="k">本期实收</span><span className="wb-num">¥{sel.value.toLocaleString()}</span>
                <span className="k">门店数</span><span className="wb-num">{sel.stores}</span>
                <span className="k">同比</span>
                <span className={sel.yoy >= 0 ? 'wb-up' : 'wb-down'}>{sel.yoy >= 0 ? '+' : ''}{(sel.yoy * 100).toFixed(1)}%</span>
              </div>
              <div className="wb-row" style={{ marginTop: 12 }}>
                <button className="wb-btn ghost">看门店列表</button>
                <button className="wb-btn primary">区域解读</button>
              </div>
            </div>
          ) : (
            <div className="wb-card"><div className="wb-empty"><div>点击任一区域查看详情</div></div></div>
          )}
          <div className="wb-note" style={{ marginTop: 12 }}>
            悬停高亮 + 点击选中 + 右栏联动是地图页的基本交互;真实地理版(中国 GeoJSON 裁剪、跨经线拆环、区域排行)
            见样板项目 dsh-workbench-sample 的「经营地图」面板。
          </div>
        </div>
      </div>
    </div>
  )
}
