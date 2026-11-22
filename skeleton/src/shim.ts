/**
 * 本插件用到的 dsh 客户端上下文的最小类型面。
 * 真实类型来自 @deepseek-ai/dsh-client-ui-slots 等 monorepo 包;
 * 这里只声明我们消费的表面,避免为类型检查拉起整个 monorepo。
 */

export interface DshSlotRegistration {
  /** 目标插槽名(如 'main' / 'sidebar.panellist')。 */
  name: string
  /** keyed 插槽的键(主面板 id)。 */
  key?: string
  /** 列表插槽条目 id(侧边栏面板 id)。 */
  id?: string
  /** 列表排序,小的在前,相同保持注册顺序。 */
  order?: number
  /** 列表条目显示文案。 */
  label?: string | (() => string)
  /** 本条目使用的 locale 命名空间(注册后正文/标题经 props.t 取词)。 */
  locale?: string
  /** 提供给组件的注入面。 */
  inject?: () => unknown
  children?: Record<string, unknown>
}

export interface DslSlots {
  /** 等目标插槽可用后注册条目;factory 返回注册返回值(可迭代 disposable)。 */
  inject(slot: string, factory: () => unknown): unknown
  register(options: DshSlotRegistration, component: unknown): unknown
}

export interface DshLocale {
  register(ns: string, dict: Record<string, Record<string, string>>): void
  /** 绑定命名空间,返回 t(key, vars?) 取词函数(随壳语言切换)。 */
  bind(ns: string): (key: string, vars?: Record<string, unknown>) => string
}

/** sidebarRightTabs.register 的定义面(消费的最小契约;红线 #10:guide 省略 = tab 注册成功但界面上打不开)。 */
export interface SidebarRightGuideEntry {
  /** 引导页内的稳定入口身份。 */
  id: string
  /** 胶囊排序(小者在前;官方 guide 页约定)。 */
  order?: number
  /** 胶囊标题(当前语言)。 */
  title: () => string
  /** 标题下的一行说明。 */
  description?: () => string
  /** 胶囊图形(图标组件;缺省用引导页占位)。 */
  icon?: (props: { size?: number }) => unknown
}

export interface SidebarRightTabDef {
  /** tab 系统里的实现身份(包名是天然取值),同时是正文/标题席位的 key。 */
  id: string
  /** 类型判别符:openTab 以它命名页类型。 */
  kind: string
  /** tab chip 的初始文字(打开时捕获)。 */
  title: (address: string) => string
  /** 引导页入口;缺省不上引导页(官方 "Omit to stay off it")。 */
  guide?: readonly SidebarRightGuideEntry[]
  /** 切 tab / 切会话 / 收起期间保留正文;默认 false(后台会话不挂载)。 */
  keepMounted?: boolean
}

export interface SidebarRightOpenTab {
  sessionId: string
  tabId: string
  kind: string
  contentId: string
}

/** sidebar.right.pane.tab 正文的注入面:sessionId 按会话注入;useProjection 读 Host 折叠的成品值(key = 投影注册键)。 */
export interface PaneTabProps {
  sessionId?: string
  useProjection: (key: string) => unknown
}

export interface DshClientContext {
  slots: DslSlots
  locale: DshLocale
  /** 右侧栏 tab 类型注册表(两阶段注册的阶段一;与插件同生共死)。 */
  sidebarRightTabs?: {
    register(def: SidebarRightTabDef): () => void
  }
  /** 右侧栏导航控制器:openTab/close 作用于屏幕上会话;openTabs 是已开 tab 元数据快照源。 */
  sidebarRight?: {
    openTab(kind: string, options?: Record<string, unknown>): void
    close(tabId: string): void
    openTabs: { getSnapshot(): readonly SidebarRightOpenTab[] }
  }
  effect(fn: () => (() => void) | void, name?: string): void
}
