/** 侧边栏品牌位(深浅主题安全:文字用 currentColor 继承壳主题)。 */
import type { ReactNode } from 'react'

export function BrandMark({ size }: { size?: number }): ReactNode {
  const s = size ?? 26
  return (
    <span style={{
      width: s, height: s, borderRadius: s * 0.3, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #7c9aff 0%, #4f6ef0 100%)', color: '#fff',
      fontWeight: 800, fontSize: s * 0.52, flex: 'none', lineHeight: 1,
    }}>W</span>
  )
}

export function BrandName(): ReactNode {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 3, whiteSpace: 'nowrap', fontWeight: 700, fontSize: 15 }}>
      <span style={{ color: '#4f6ef0' }}>工作台</span>
      <span style={{ color: 'currentColor' }}>Demo</span>
    </span>
  )
}
