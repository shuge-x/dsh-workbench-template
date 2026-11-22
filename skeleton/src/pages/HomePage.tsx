/**
 * 首页起步页:空白门户 — 业务内容从零填充,不预置任何演示表格与描述。
 * 页面范式(布局/取数/四态/图标)照 src/examples/ 抄,红线见 docs/EXAMPLES.md;
 * 本文件刻意保持最小:根容器 wb-page(红线 #14)+ 顶栏标题,其余是白纸。
 */
import type { ReactNode } from 'react'

type T = (key: string) => string

export function HomePage({ t }: { t?: T } = {}): ReactNode {
  return (
    <div className="wb-page">
      <div className="wb-topbar">
        <span className="wb-title">{t ? t('homeTitle') : '首页'}</span>
        <DesignSwitcher />
      </div>
      <div className="wb-body" />
    </div>
  )
}
