/** 内联 SVG 图标:线条风格对齐 dsh 壳(1.5 描边、圆角)。 */
import type { CSSProperties, JSX } from 'react'

export interface IconProps {
  size?: number
  color?: string
  style?: CSSProperties
}

function svg(path: JSX.Element, size = 16, color = 'currentColor', style?: CSSProperties): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={style}
    >
      {path}
    </svg>
  )
}

export const IconCopy = (p: IconProps) =>
  svg(<><rect x="9" y="9" width="11" height="11" rx="1.5" /><path d="M5 15V5a1.5 1.5 0 011.5-1.5H15" /></>, p.size, 'currentColor', p.style)

export const IconFolderPlus = (p: IconProps) =>
  svg(<><path d="M3.5 6.5A1.5 1.5 0 015 5h4.2l1.8 2H19a1.5 1.5 0 011.5 1.5v9A1.5 1.5 0 0119 19H5a1.5 1.5 0 01-1.5-1.5z" /><path d="M12 10.5v5" /><path d="M9.5 13h5" /></>, p.size, 'currentColor', p.style)
