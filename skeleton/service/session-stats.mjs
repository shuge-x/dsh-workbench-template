/**
 * 会话联动固件:session projection(官方一等公民模式)+ 探针工具。
 *
 * 机制:Host 半区把会话事件日志折叠成统计(轮次/步骤/工具调用/最近工具名),
 * 客户端经 useProjection(key) 读**已算好的**成品值——客户端从不折叠会话事件。
 * 参考实现:官方 packages/interaction/action-cards;实战 dsh-session-inspector(field-notes)。
 *
 * 四个必须遵守的契约(违反后果见 docs/dsh-plugin-playbook.md §11):
 *  - apply 对不关心的事件**返回同一引用**(Object.is 是变更门的依据)
 *  - apply **纯且同步**
 *  - state 是 **plain JSON**(持久化缓存前提)
 *  - **fork 守卫**:init 存下 inheritedEventCount,apply 首行按 seq 短路——否则 fork 出的
 *    会话把父会话历史算成自己的,**静默偏大不报错**;改折叠语义必须 bump stateVersion
 *
 * zod 取舍:官方推荐 stateSchema 用真 zod;本骨架守零依赖约束(坑 #17:dependencies 非空
 * 会让 link 安装在未 npm install 的目录上激活失败),故用最小「真校验器」——parse 逐字段
 * 校验并抛错,不是占位假 schema。业务解除零依赖约束后优先换 z.object({...})。
 */

/** 构造最小真校验器:逐字段校验,不符即抛(满足 ErasedDefinition 的 parse(value) 契约)。 */
function requireFields(spec) {
  return {
    parse(value) {
      if (value === null || typeof value !== 'object') throw new Error('projection state 必须是对象')
      for (const [key, type] of Object.entries(spec)) {
        const v = value[key]
        if (type === 'number' && (typeof v !== 'number' || !Number.isFinite(v))) throw new Error(`state.${key} 应为有限数字`)
        if (type === 'string|null' && v !== null && typeof v !== 'string') throw new Error(`state.${key} 应为字符串或 null`)
      }
      return value
    },
  }
}

const stateSchema = requireFields({
  inheritedEventCount: 'number',
  turns: 'number', steps: 'number', toolCalls: 'number', toolErrors: 'number',
  messages: 'number', lastToolName: 'string|null',
})
// view 是给人看的出口,只带展示字段(不带 inheritedEventCount);viewSchema.parse 在每次值离开 Host 前被调用
const viewSchema = requireFields({
  turns: 'number', steps: 'number', toolCalls: 'number', toolErrors: 'number',
  messages: 'number', lastToolName: 'string|null',
})

export const SESSION_STATS_KEY = 'wbSessionStats'

export function sessionStatsProjection() {
  return {
    key: SESSION_STATS_KEY,
    stateVersion: 1,
    stateSchema,
    init: (_header, inheritedEventCount) => ({
      inheritedEventCount, turns: 0, steps: 0, toolCalls: 0, toolErrors: 0, messages: 0, lastToolName: null,
    }),
    apply: (state, event) => {
      // ★ fork 守卫:继承事件是父会话的历史,不算本会话的
      if (event.seq < state.inheritedEventCount) return state
      switch (event.type) {
        case 'turn/start': return { ...state, turns: state.turns + 1 }
        case 'step/start': return { ...state, steps: state.steps + 1 }
        case 'tool/call':
          return {
            ...state,
            toolCalls: state.toolCalls + 1,
            lastToolName: typeof event.data?.name === 'string' ? event.data.name : state.lastToolName,
          }
        case 'tool/result':
          return event.data?.isError === true ? { ...state, toolErrors: state.toolErrors + 1 } : state
        case 'user/message':
        case 'assistant/message':
          return { ...state, messages: state.messages + 1 }
        default:
          return state // 不关心的事件:同一引用
      }
    },
    wire: {
      viewSchema,
      view: (state) => ({
        turns: state.turns, steps: state.steps, toolCalls: state.toolCalls,
        toolErrors: state.toolErrors, messages: state.messages, lastToolName: state.lastToolName,
      }),
      summary: false,
    },
  }
}

/**
 * 注册会话统计投影 + 探针工具(wb_session_stats)。
 * 探针让 agent 直接断言统计数值——"数字偏大但看着合理"这类静默错肉眼看不出来,
 * 它抓的就是 §11 projection 行那个静默坑。defineTool 缺省(独立运行)时只注册投影。
 * 返回投影 handle(stateOf(session) 供其他 Host 代码读状态)。
 */
export async function registerSessionStats(ctx, defineTool) {
  const handle = await ctx.sessionProjections.register(sessionStatsProjection())
  if (defineTool !== undefined) {
    ctx.tools.register(defineTool({
      name: 'wb_session_stats',
      description: 'Read this workbench session-stats projection for the CURRENT session (turns/steps/tool calls/messages). Probe tool: assert the projection folds correctly — numbers silently too large usually mean a missing fork guard.',
      parameters: { type: 'object', additionalProperties: false, properties: {} },
      output: {
        schema: { type: 'object', additionalProperties: true },
        render: (_args, value) => [{ type: 'text', text: JSON.stringify(value, null, 2) }],
      },
      isConcurrencySafe: () => true,
      async execute(_args, exec) {
        const session = exec?.agent?.session
        if (session === undefined) return { error: 'no-session(探针只在会话内可读;宿主直测无会话上下文)' }
        const state = handle.stateOf(session)
        return { sessionId: session.id, ...state }
      },
    }))
  }
  return handle
}
