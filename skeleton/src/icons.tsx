/** 内联 SVG 图标:自绘线条图标 + 官方图形 sprite 引用(vendored)。 */
import type { JSX } from 'react'
import { ICON_GLYPHS } from './design/icons-data'

export interface IconProps { size?: number }

function svg(path: JSX.Element, size = 16): JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {path}
    </svg>
  )
}

export const IconHome = (p: IconProps) =>
  svg(<><path d="M4 11l8-7 8 7" /><path d="M6 9.5V20h12V9.5" /></>, p.size)

/**
 * 官方图形 sprite 引用(theme.ts mountIconSprite 挂载,符号 id = wb-icon-<glyph>-<weight>)。
 * glyph 名见 src/design/icons-data.ts(如 'search-outline');regular 1px / medium 1.3px 强调。
 * 未收录的 glyph 渲染占位圈——先到「示例·图标与样式规范」查名,不要凭想象写。
 */
export function WbIcon({ glyph, weight = 'regular', size = 16 }: IconProps & { glyph: string; weight?: 'regular' | 'medium' }): JSX.Element {
  const set = ICON_GLYPHS[glyph]
  if (set === undefined) return svg(<circle cx="12" cy="12" r="8" />, size)
  const doc = set[weight]
  const viewBox = doc.match(/viewBox="([^"]+)"/)?.[1] ?? '0 0 16 16'
  return (
    <svg width={size} height={size} viewBox={viewBox} fill="none" aria-hidden="true">
      <use href={`#wb-icon-${glyph}-${weight}`} />
    </svg>
  )
}


