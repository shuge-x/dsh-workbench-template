/**
 * 工作台插件 — Host 半区(骨架)。
 *
 * 职责:
 *  1. 通过 dsh 的 webServer 服务挂载 /wb-api/* 前缀路由(同源,复用 web 壳鉴权,无 CORS)
 *  2. 注册 agent 工具(wb_*,与页面共用 service 层)
 *
 * 注意:HTTP 接口依赖 dsh 的 webServer;`node index.js` 独立运行时仅供 service 层函数测试。
 * 改名点:路由前缀 wb-api / 工具名 wb_* / cordis.patch.yml 的 id 与包名。
 */
import { regionSummary, latest } from './service/api.mjs'
import { getDb } from './service/db.mjs'
import { streamChat } from './service/ai.mjs'
import { registerSessionStats, sessionStatsProbe, SESSION_STATS_KEY } from './service/session-stats.mjs'
import Schema from '@deepseek-ai/schemastery'

/**
 * 插件配置(Schemastery 校验;插件管理页可改,改动经 HMR 热重载生效)。
 * 字段要"真实被用"——下面 /ai-stream 的 system 提示词即由 brandName + aiPreamble 组成。
 */
export const Config = Schema.object({
  brandName: Schema.string().default('My Workbench').description('工作台名称(AI 提示词自我介绍用)'),
  aiPreamble: Schema.string().default('回答保持简明,不编造数据。').description('AI 回答风格前言'),
})

// dsh-tools 只在 dsh 宿主内可解析;独立运行时跳过工具注册
let defineTool
try { ({ defineTool } = await import('@deepseek-ai/dsh-tools')) } catch { /* standalone */ }

const PREFIX = '/wb-api'


/** dsh 插件入口。 */
// 坑 #20:消费哪个 face 就必须在这里声明哪个——漏了会在运行到那一行时才抛
// 'cannot get property "sessionProjections" without inject'(import 成功、插件启动后才炸)
export const inject = ['tools', 'webServer', 'connection', 'sessionProjections']

export async function apply(ctx, config) {
  getDb() // 首启自动建库造数

const routes = {
  'GET /health': () => ({ ok: true, service: 'myworkbench-data', time: new Date().toISOString() }),
  'GET /region-summary': regionSummary,
  'GET /latest': latest,
  // SSE 流式 AI(示例页 StreamAiPage 的数据源;业务化时把提示词换成你的场景)
  'POST /ai-stream': async (params, res) => {
    res.writeHead(200, {
      'content-type': 'text/event-stream; charset=utf-8',
      'cache-control': 'no-cache',
      connection: 'keep-alive',
    })
    try {
      for await (const chunk of streamChat(ctx, {
        system: `你是${config?.brandName ?? '这个工作台'}的运营助手。${config?.aiPreamble ?? ''}`,
        user: String(params.ask ?? '简单介绍一下这个工作台能做什么。'),
      })) {
        res.write(`data: ${JSON.stringify(chunk)}\n\n`)
      }
    } catch (error) {
      res.write(`data: ${JSON.stringify({ error: String(error?.message ?? error) })}\n\n`)
    }
    res.write('data: {"type":"end"}\n\n')
    res.end()
  },
}


  // HTTP 路由:挂到 dsh 主 web 服务(同源;鉴权复用 web 壳的 connection)。
  ctx.effect(() => ctx.webServer.register({
    kind: 'prefix',
    path: PREFIX,
    handler: async (req, res) => {
      try {
        const connection = ctx.get('connection')
        const rejection = typeof connection?.requestRejection === 'function'
          ? connection.requestRejection({ headers: req.headers })
          : 403
        if (rejection) {
          res.writeHead(rejection, { 'content-type': 'application/json; charset=utf-8' })
          res.end(JSON.stringify({ error: '未授权' }))
          return
        }
        const url = new URL(req.url, 'http://local')
        const path = url.pathname.startsWith(PREFIX) ? url.pathname.slice(PREFIX.length) : url.pathname
        const fn = routes[`${req.method} ${path}`]
        if (fn === undefined) {
          res.writeHead(404, { 'content-type': 'application/json; charset=utf-8' })
          res.end(JSON.stringify({ error: 'no route' }))
          return
        }
        const params = { ...Object.fromEntries(url.searchParams) }
        if (req.method === 'POST') {
          let raw = ''
          for await (const c of req) raw += c
          if (raw !== '') { try { Object.assign(params, JSON.parse(raw)) } catch { /* ignore */ } }
        }
        const out = await fn(params, res)
        if (out === undefined) return // SSE 等自写响应的路由,已经 end()
        res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' })
        res.end(JSON.stringify(out))
      } catch (error) {
        console.error('[wb-data]', error)
        if (!res.headersSent) res.writeHead(500, { 'content-type': 'application/json; charset=utf-8' })
        res.end(JSON.stringify({ error: String(error?.message ?? error) }))
      }
    },
  }), 'myworkbench: /wb-api routes')

  console.log('[wb-data] /wb-api 路由已挂载(同源)')

  // 会话联动固件:session projection(机制详见 service/session-stats.mjs 头注释;
  // 客户端读取示范在 src/examples/SessionLinkageTab.tsx,SHOW_EXAMPLES 开启后右侧栏可见)
  const statsHandle = await registerSessionStats(ctx)
  console.log(`[wb-data] 会话统计投影已注册(${SESSION_STATS_KEY},fork 守卫在位)`)

  // agent 工具。
  if (defineTool === undefined) {
    console.warn('[wb-data] @deepseek-ai/dsh-tools 不可解析,跳过 agent 工具注册(独立运行模式)')
    return
  }
  const tools = [...wbTools(), sessionStatsProbe(defineTool, statsHandle)]
  ctx.effect(() => {
    const disposers = tools.map(t => ctx.tools.register(t))
    console.log(`[wb-data] 已注册 ${tools.length} 个 agent 工具(含会话统计探针 wb_session_stats)`)
    return () => { for (const d of disposers) d() }
  }, 'myworkbench: tools')
}

/** agent 工具集(骨架含 2 个;注意:可选参数必须省略 required 字段,写 required:false 会被拒)。 */
export function wbTools() {
  return [
    defineTool({
      name: 'wb_region_summary',
      description: '查询工作台演示数据:按区域汇总的订单金额(最近 7 天)。回答"各区域情况/对比"时使用。数据是演示环境。',
      parameters: {},
      output: { schema: { type: 'string' }, render: (_args, value) => [{ type: 'text', text: value }] },
      async execute() { return JSON.stringify(await regionSummary()) },
    }),
    defineTool({
      name: 'wb_latest',
      description: '查询数据里最新一天的日期与总量,用于确认数据范围。',
      parameters: {},
      output: { schema: { type: 'string' }, render: (_args, value) => [{ type: 'text', text: value }] },
      async execute() { return JSON.stringify(await latest()) },
    }),
  ]
}
