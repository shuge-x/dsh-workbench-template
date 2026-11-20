/**
 * @deepseek-ai/dsh-client-ui-primitives 的最小类型面。
 * 运行时由 dsh 平台提供(bundle 里标 external),这里的类型以**浏览器实测契约**为准;
 * npm 上的 .d.ts 与运行时不同步(如 Regular/Medium 命名、StateDot 的 idle 态),勿替换成包类型。
 * dsh 升级后按 runtime 实测结果同步本文件(见 playbook §12)。
 */
declare module '@deepseek-ai/dsh-client-ui-primitives' {
  import type { ComponentType, ReactNode } from 'react'

  export interface IconProps { size?: number; className?: string }
  export type IconComponent = ComponentType<IconProps>

  /** 图标符号表:id(dsw-icon-*)→ svg 内联标记;由 theme 的 mountIconSprite 挂进文档。 */
  export const ICON_SYMBOLS: Readonly<Record<string, string>>
  export const ICON_REGULAR_STROKE: number
  export const ICON_MEDIUM_STROKE: number

  /** 产品图标按 Icon<Glyph><Weight>(Regular/Medium)命名,运行时实测 96+ 图形×2 档;
   *  网格发现用命名空间索引,个别具名组件在此声明。 */
  export const IconProjectAddOutlineRegular: IconComponent
  export const FileTypeIcon: ComponentType<{ path?: string; kind?: string; size?: number }>
  export const StateDot: ComponentType<{ state: 'done' | 'warning' | 'ongoing' | 'error' | 'idle'; size?: number }>
  export const Pill: ComponentType<{ active?: boolean; className?: string; children?: ReactNode; onClick?: () => void }>
}
