/**
 * 设计切换器:变体样式注入 + 供页面顶栏放置的选择控件。
 *
 * 机制:全部变体的覆盖 CSS 一次性注入(以 html[data-wb-variant="<id>"] 为作用域),
 * 切换 = 在 <html> 上设置 data 属性——纯 CSS 即时生效,零构建;localStorage 记住选择。
 * 边界:切换器渲染在**插件自己的页面顶栏里**(首页右上角),只控制本插件覆盖的页面;
 * 不做全局悬浮控件(不出现在插件之外的页面上)。
 */
import { useEffect, useState, type ReactNode } from 'react'
import { VARIANTS } from './variants'

const KEY = 'wb-design'

function readSaved(): string {
  try {
    const v = localStorage.getItem(KEY) ?? 'wb'
    return VARIANTS.some(x => x.id === v) ? v : 'wb'
  } catch {
    return 'wb'
  }
}

/** 变体覆盖 CSS 文本(供 client.tsx 与 THEME_CSS 一并注入)。 */
export const VARIANT_CSS = VARIANTS.map(v => v.css).join('\n')

/** 应用已保存(或给定)的设计变体:设置 <html> 的 data 属性。 */
export function applyVariant(id?: string): void {
  const saved = (() => {
    try { return localStorage.getItem(KEY) ?? undefined } catch { return undefined }
  })()
  document.documentElement.dataset.wbVariant = id ?? saved ?? 'wb'
}

/** 设计切换控件:放在页面顶栏里(右上角)。只控制本插件覆盖的页面。 */
export function DesignSwitcher(): ReactNode {
  const [id, setId] = useState(readSaved)

  useEffect(() => {
    document.documentElement.dataset.wbVariant = id
    try { localStorage.setItem(KEY, id) } catch { /* 隐私模式忽略 */ }
  }, [id])

  return (
    <select
      aria-label="切换设计语言"
      value={id}
      onChange={e => setId(e.target.value)}
      style={{
        appearance: 'none', cursor: 'pointer', marginLeft: 'auto', flexShrink: 0,
        font: '500 12px/1 -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif',
        padding: '7px 12px', borderRadius: 8,
        border: '1px solid var(--wb-line)', background: 'var(--wb-card)', color: 'var(--wb-ink)',
      }}
    >
      {VARIANTS.map(v => (
        <option key={v.id} value={v.id}>◐ {v.label}</option>
      ))}
    </select>
  )
}
