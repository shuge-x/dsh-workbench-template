/**
 * dsh-workbench-template — Client 半区(与 dsh 的唯一耦合点)。
 *
 * 单面板:「新建工作台」——输入路径,把标准骨架盖章成新项目。
 * 页面范式(布局/四态/图标)的完整教学在 src/examples/(由骨架盖章进生成项目),
 * 本插件自身保持最小:一个面板 + 一个表单。
 */
import type { ReactNode } from 'react'
import type { DshClientContext } from './shim'
import { BI_CSS } from './styles'
import { ScaffoldPage } from './pages/ScaffoldPage'
import { IconFolderPlus } from './icons'

export const inject = ['slots']

const PANELS: { id: string; title: string; order: number; Icon: (p: { size?: number }) => ReactNode; page: () => ReactNode }[] = [
  { id: 'wt-scaffold', title: '新建工作台', order: -20, Icon: IconFolderPlus, page: ScaffoldPage },
]

export function apply(ctx: DshClientContext): void {
  // 样式:一次性注入,随插件卸载
  ctx.effect(() => {
    const style = document.createElement('style')
    style.dataset.wtPlugin = 'dsh-workbench-template'
    style.textContent = BI_CSS
    document.head.append(style)
    return () => { style.remove() }
  }, 'workbench-template: styles')

  // 不往 sidebar.brand.* 注册:默认 web 组合下被官方品牌包占用,注册了不显示,且会让热更新后插件停在卸载态(坑 #28)

  for (const p of PANELS) {
    const PanelIcon = p.Icon
    ctx.slots.inject('main', () => ctx.slots.register({ name: 'main', key: p.id }, p.page))
    ctx.slots.inject('sidebar.panellist', () => ctx.slots.register(
      { name: 'sidebar.panellist', id: p.id, order: p.order, label: p.title },
      (props: { size?: number }) => <PanelIcon size={props.size ?? 16} />,
    ))
  }
}
