/**
 * 【示例·会话联动】右侧栏 tab 范式(官方一等公民模式)。
 *
 * 两阶段注册:阶段一 sidebarRightTabs.register({id,kind,title,guide}) 注册「类型」;
 * 阶段二往 sidebar.right.pane.tab / .title 两个 keyed 槽注册正文/标题(key = 阶段一的 id,
 * session 作用域——切会话各读各的,不串)。
 * 正文经 props.useProjection(key) 读 Host **折叠好的**成品值(key = 投影注册键
 * 'wbSessionStats',定义在 service/session-stats.mjs)——客户端从不折叠会话事件;
 * key 尚未有值时读到 undefined 是**值**不是错误,组件可先订阅后等数据。
 *
 * ⚠️ 红线 #10:guide 省略 = tab 注册成功但界面上打不开(官方 "Omit to stay off it")。
 * 验证纪律(诚实边界):注册成功 ≠ 用户看得见——真机断言 tab 可见,数值与探针工具
 * wb_session_stats 一致才算数;两者不一致先怀疑 key 不匹配或 fork 守卫缺失。
 */
import type { ReactNode } from 'react'
import { WbIcon } from '../icons'
import type { DshClientContext, PaneTabProps } from '../shim'

const TAB_ID = 'wb-session-linkage'
const TAB_KIND = 'my-workbench/session-linkage' // my-workbench 由 scaffold 改名为插件 id
const NS = 'wbSessionLinkage'
// 与 service/session-stats.mjs 的 SESSION_STATS_KEY 配对(两端各写字面量,保持一致即可)
const STATS_KEY = 'wbSessionStats'

const dict = {
  zh: {
    title: '示例·会话', turns: '轮次', steps: '步骤', toolCalls: '工具调用',
    toolErrors: '工具错误', messages: '消息数', lastToolName: '最近工具',
    sessionId: '会话', loading: '等待投影数据…(发起一次对话或工具调用后出现)',
    hint: '数据来自 Host 的 session projection(wbSessionStats),客户端只读成品值。',
  },
  en: {
    title: 'Session', turns: 'Turns', steps: 'Steps', toolCalls: 'Tool calls',
    toolErrors: 'Tool errors', messages: 'Messages', lastToolName: 'Last tool',
    sessionId: 'Session', loading: 'Waiting for projection… (starts after a turn or tool call)',
    hint: 'Values come from the Host session projection (wbSessionStats); the client only reads folded results.',
  },
}

/** 统计视图(view 字段 = service/session-stats.mjs 的 wire.view 输出)。 */
interface SessionStatsView {
  turns?: number
  steps?: number
  toolCalls?: number
  toolErrors?: number
  messages?: number
  lastToolName?: string | null
}

function LinkageRow({ label, value }: { label: string; value: ReactNode }): ReactNode {
  return (
    <div className="wb-row" style={{ justifyContent: 'space-between', padding: '5px 0' }}>
      <span className="wb-sub">{label}</span>
      <span style={{ fontWeight: 650, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
    </div>
  )
}

/** tab 正文:useProjection 读成品值;undefined = 尚无值(先订阅后等数据,不是错误)。 */
export function LinkageBody(props: PaneTabProps & { t?: (key: string) => string }): ReactNode {
  const t = props.t ?? ((k: string) => (dict as Record<string, Record<string, string>>).zh[k]!)
  const stats = props.useProjection(STATS_KEY) as SessionStatsView | undefined
  return (
    <div className="wb-page" style={{ padding: 0 }}>
      <div className="wb-card" style={{ margin: '10px 0' }}>
        {stats === undefined ? (
          <div className="wb-sub" style={{ opacity: 0.75 }}>{t('loading')}</div>
        ) : (
          <>
            <LinkageRow label={t('turns')} value={stats.turns ?? 0} />
            <LinkageRow label={t('steps')} value={stats.steps ?? 0} />
            <LinkageRow label={t('toolCalls')} value={stats.toolCalls ?? 0} />
            <LinkageRow label={t('toolErrors')} value={stats.toolErrors ?? 0} />
            <LinkageRow label={t('messages')} value={stats.messages ?? 0} />
            <LinkageRow label={t('lastToolName')} value={stats.lastToolName ?? '—'} />
          </>
        )}
        <div className="wb-sub" style={{ marginTop: 10, fontSize: 11 }}>
          {props.sessionId !== undefined && props.sessionId !== '' && (
            <div style={{ marginBottom: 6 }}>{t('sessionId')}: <span style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 11 }}>{props.sessionId.slice(0, 8)}…</span></div>
          )}
          {t('hint')}
        </div>
      </div>
    </div>
  )
}

/** tab 标题(locale: NS 注册后经 props.t 取词,随壳语言切换)。 */
export function LinkageTitle(props: { t?: (key: string) => string }): ReactNode {
  const t = props.t ?? ((k: string) => (dict as Record<string, Record<string, string>>).zh[k]!)
  return <><WbIcon glyph="new-chat-outline" size={14} /> {t('title')}</>
}

/** 会话联动 tab 的完整注册(由 attachExamples 调用,随 SHOW_EXAMPLES 开关同生共死)。 */
export function attachSessionLinkageTab(ctx: DshClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, dict), 'wb-examples: linkage locale')
  const t = ctx.locale.bind(NS)

  // 阶段一:tab 类型(guide 必给——红线 #10)
  ctx.effect(() => ctx.sidebarRightTabs?.register({
    id: TAB_ID,
    kind: TAB_KIND,
    title: () => t('title'),
    guide: [{
      id: 'linkage',
      order: 90,
      title: () => t('title'),
      description: () => t('hint'),
      icon: (p?: { size?: number }) => WbIcon({ glyph: 'new-chat-outline', size: p?.size ?? 16 }),
    }],
  }), 'wb-examples: linkage tab type')

  // 阶段二:正文 + 标题(key = 阶段一 id;session 作用域,切会话各读各的投影值)
  ctx.effect(() => ctx.slots.inject('sidebar.right.pane.tab', () => ctx.slots.register(
    { name: 'sidebar.right.pane.tab', key: TAB_ID, locale: NS },
    LinkageBody,
  )) as () => void, 'wb-examples: linkage body')
  ctx.effect(() => ctx.slots.inject('sidebar.right.pane.tab.title', () => ctx.slots.register(
    { name: 'sidebar.right.pane.tab.title', key: TAB_ID, locale: NS },
    LinkageTitle,
  )) as () => void, 'wb-examples: linkage title')

  // 自动打开 + 卸载清理(顺序符合卸载纪律:正文订阅随 pane.tab 席位注销终止,再关自己 kind 的 tab)
  ctx.effect(() => {
    try { ctx.sidebarRight?.openTab(TAB_KIND) } catch { /* 无屏幕会话时跳过;引导页入口仍可打开 */ }
    return () => {
      try {
        for (const tab of ctx.sidebarRight?.openTabs.getSnapshot() ?? []) {
          if (tab.kind === TAB_KIND) ctx.sidebarRight?.close(tab.tabId)
        }
      } catch { /* 卸载竞态,忽略 */ }
    }
  }, 'wb-examples: linkage auto-open/cleanup')
}
