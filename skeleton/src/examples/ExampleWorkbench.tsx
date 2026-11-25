/**
 * 「示例工作台」面板容器:9 个示例页 = 内部页签(顺带演示页签布局范式)。
 * 页头说明条声明示例定位:内容为虚构业务,重点是 dsh 范式;删除方式见 docs/EXAMPLES.md。
 * 示例专用样式(wbex-)随面板注入;页面公共词汇来自 src/theme.ts。
 */
import { useState, type ReactNode } from 'react'
import { WbIcon } from '../icons'
import type { DshClientContext } from '../shim'
import { OverviewPage } from './OverviewPage'
import { ListPage } from './ListPage'
import { DetailPage } from './DetailPage'
import { ChartPage } from './ChartPage'
import { FormPage } from './FormPage'
import { StatesPage } from './StatesPage'
import { IconsPage } from './IconsPage'
import { MapPage } from './MapPage'
import { StreamAiPage } from './StreamAiPage'
import { EXAMPLES_CSS } from './styles'
import { attachSessionLinkageTab } from './SessionLinkageTab'

const TABS: { key: string; label: string; page: () => ReactNode }[] = [
  { key: 'overview', label: '总览', page: OverviewPage },
  { key: 'list', label: '列表', page: ListPage },
  { key: 'detail', label: '详情', page: DetailPage },
  { key: 'chart', label: '图表', page: ChartPage },
  { key: 'form', label: '表单', page: FormPage },
  { key: 'states', label: '四态', page: StatesPage },
  { key: 'icons', label: '图标规范', page: IconsPage },
  { key: 'map', label: '地图', page: MapPage },
  { key: 'stream', label: '流式 AI', page: StreamAiPage },
]

export const EXAMPLES_META = {
  panelId: 'wb-examples',
  title: '示例·工作台',
  order: -4,
}

/** 示例区唯一入口:注入示例样式 + 注册主面板与侧边栏。删除示例时连 import 一起删(见 EXAMPLES.md)。
 *  pkg 由 client.tsx 传入(其字面量会被 scaffold 改成真包名)——示例槽位 key 按包名派生,
 *  防止多个工作台插件同时开示例时撞 keyed 槽(坑 #16 同类)。 */
export function attachExamples(ctx: DshClientContext, pkg = 'dsh-myworkbench'): void {
  const panelId = `${pkg}-examples`
  ctx.effect(() => {
    const style = document.createElement('style')
    style.dataset.wbExamples = 'examples'
    style.textContent = EXAMPLES_CSS
    document.head.append(style)
    return () => { style.remove() }
  }, 'wb-examples: styles')

  attachSessionLinkageTab(ctx, pkg) // 会话联动 tab(右侧栏;红线 #10:guide 必给)

  ctx.slots.inject('main', () => ctx.slots.register({ name: 'main', key: panelId }, ExamplePanel))
  ctx.slots.inject('sidebar.panellist', () => ctx.slots.register(
    { name: 'sidebar.panellist', id: panelId, order: EXAMPLES_META.order, label: EXAMPLES_META.title },
    (props: { size?: number }) => <WbIcon glyph="project-add-outline" size={props.size ?? 16} />,
  ))
}

function ExamplePanel(): ReactNode {
  const [tab, setTab] = useState(TABS[0].key)
  const Current = TABS.find(t => t.key === tab)?.page ?? TABS[0].page
  return (
    <div>
      <div className="wbex-banner">
        示例工作台:内容均为虚构数据,目的是展示 dsh 工作台的页面范式与样式规范。
        学习入口见 docs/EXAMPLES.md;整体删除示例的方式也在那里(两行代码 + 一个目录)。
      </div>
      <div className="wb-tabs">
        {TABS.map(t => (
          <button key={t.key} className={'wb-tab' + (tab === t.key ? ' on' : '')} onClick={() => setTab(t.key)}>{t.label}</button>
        ))}
      </div>
      <Current />
    </div>
  )
}
