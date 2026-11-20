/** 内联 SVG 图标(线条风格)。 */
import type { JSX } from 'react'

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

