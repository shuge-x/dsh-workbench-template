/** 侧边栏品牌位:dsh 工作台模板(替换 dsh 默认品牌)。 */
import type { ReactNode } from 'react'

/** 品牌图形位(expanded 行 + collapsed 轨)。 */
export function BrandMark({ size }: { size?: number }): ReactNode {
  const s = size ?? 26
  return (
    <span
      style={{
        width: s, height: s, borderRadius: s * 0.3, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #4f6ef0 0%, #3a53c8 100%)', color: '#fff',
        fontWeight: 800, fontSize: s * 0.5, fontFamily: "'PingFang SC', sans-serif", flex: 'none',
        boxShadow: '0 1px 3px rgba(58,83,200,.35)', lineHeight: 1,
      }}
    >W</span>
  )
}

/** 品牌名位(expanded 行,图形右侧)。 */
export function BrandName(): ReactNode {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 3, whiteSpace: 'nowrap', fontWeight: 700, fontSize: 15.5, letterSpacing: .3 }}>
      <span style={{ color: '#4f6ef0' }}>dsh</span>
      <span style={{ color: 'currentColor' }}>工作台模板</span>
      <svg width="9" height="9" viewBox="0 0 10 10" style={{ position: 'relative', top: -6 }}>
        <path d="M5 0l1.1 3.1L9 5 6.1 6.4 5 9.5 3.9 6.4 1 5l2.9-1.9z" fill="#4f6ef0" />
      </svg>
    </span>
  )
}
