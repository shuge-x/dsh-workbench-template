/**
 * 工作台骨架 — client 半区(唯一的 dsh 耦合点)。
 * 改名点:CSS 前缀 wb-、面板 id( wb-home )、品牌文案。
 *
 * 注册分两段:
 *  - PANELS:你的业务面板(主代码,长期演进)——侧栏默认只有你的面板
 *  - attachExamples:示例工作台(教学代码)。源码常驻 src/examples 供 AI 阅读,
 *    但默认不注册进侧栏;要看渲染效果把 SHOW_EXAMPLES 置 true,彻底删除见 docs/EXAMPLES.md
 */
import type { ReactNode } from 'react'
import type { DshClientContext } from './shim'
import { THEME_CSS, mountIconSprite } from './theme'
import { VARIANT_CSS, applyVariant } from './design/switcher'
import { dicts, NS_HOME } from './locales'
import { CSS } from './styles'
import { BrandMark, BrandName } from './brand'
import { ConfigPage } from './pages/ConfigPage'
import { IconHome } from './icons'
import { attachExamples } from './examples' // ← 示例区唯一 import;删除示例时连本行一起删

/** 示例面板开关:默认关(业务侧栏只放你的面板);要看渲染效果改 true。 */
const SHOW_EXAMPLES = false

// sidebarRightTabs/sidebarRight 供示例区的会话联动 tab 使用(SHOW_EXAMPLES 门内);
// faces 在壳里常驻,声明在前不等待、用到才消费(坑 #20:消费哪个就声明哪个)
export const inject = ['slots', 'locale', 'sidebarRightTabs', 'sidebarRight']

/**
 * 面板注册表:按业务需求增删行(页面范式照 src/examples/ 抄,注册模式见本文件与 AGENTS.md)。
 * 固件不预置任何面板——信息架构是开工 AI 与用户的设计决定。
 */
const PANELS: { id: string; title: string; order: number; Icon: (p: { size?: number }) => ReactNode; page: () => ReactNode }[] = [
  // 示例:{ id: 'wb-home', title: '首页', order: -20, Icon: IconHome, page: HomePage }
]

export function apply(ctx: DshClientContext): void {
  // 设计系统 + 页面级样式:一次性注入,随插件卸载
  ctx.effect(() => {
    const style = document.createElement('style')
    style.dataset.wbPlugin = 'dsh-myworkbench'
    style.textContent = THEME_CSS + VARIANT_CSS + CSS
    document.head.append(style)
    return () => { style.remove() }
  }, 'myworkbench: styles')
  mountIconSprite(ctx)
  applyVariant() // 应用已保存的设计变体(html data 属性);切换控件在首页顶栏内
  // 本地化:注册命名空间字典;页面经 inject face 拿 t(改动语言在壳设置里即时生效)
  ctx.effect(() => ctx.locale.register(NS_HOME, dicts[NS_HOME]!), 'myworkbench: locale')

  // 品牌位(可选;不需要就删掉这两行)
  ctx.slots.inject('sidebar.brand.mark', () => ctx.slots.register({ name: 'sidebar.brand.mark' }, BrandMark))
  ctx.slots.inject('sidebar.brand.name', () => ctx.slots.register({ name: 'sidebar.brand.name' }, BrandName))

  // 主面板 + 侧边栏入口(同一 id)
  for (const p of PANELS) {
    const PanelIcon = p.Icon
    ctx.slots.inject('main', () => ctx.slots.register(
      { name: 'main', key: p.id, inject: () => ({ t: ctx.locale.bind(NS_HOME) }) },
      p.page,
    ))
    ctx.slots.inject('sidebar.panellist', () => ctx.slots.register(
      { name: 'sidebar.panellist', id: p.id, order: p.order, label: p.title },
      (props: { size?: number }) => <PanelIcon size={props.size ?? 16} />,
    ))
  }

  if (SHOW_EXAMPLES) attachExamples(ctx) // ← 示例区唯一调用;彻底删除时删本行与上面的 import(见 docs/EXAMPLES.md)

  // 插件行配置页:插件管理页里本插件行出现「配置」控件;保存写回 profile patch,HMR 热重载生效。
  // 键 = 包名#row id(row id 见 cordis.patch.yml;官方描述为 `<package name>#<row id>`,
  // 故主用第二个;带 include: 的形态一并注册以兼容可能的 dispatch 变体,实测二者都能命中)。
  for (const key of ['dsh-myworkbench#include:my-workbench', 'dsh-myworkbench#my-workbench']) {
    ctx.slots.inject('plugins.row.config', () => ctx.slots.register(
      { name: 'plugins.row.config', key },
      (props: { view?: 'summary' | 'page'; form?: unknown }) => (
        <ConfigPage view={props.view} form={props.form as never} />
      ),
    ))
  }
}
