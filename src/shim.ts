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
  /** 提供给组件的注入面。 */
  inject?: () => unknown
  children?: Record<string, unknown>
}

export interface DslSlots {
  /** 等目标插槽可用后注册条目;factory 返回注册返回值(可迭代 disposable)。 */
  inject(slot: string, factory: () => unknown): unknown
  register(options: DshSlotRegistration, component: unknown): unknown
}

export interface DshClientContext {
  slots: DslSlots
  layout: {
    /** 跳转到主面板;'conversation' 为保留键(聊天)。 */
    selectPanel(id: string): void
  }
  effect(fn: () => (() => void) | void, name?: string): void
}
