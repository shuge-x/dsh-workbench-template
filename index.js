/**
 * dsh-workbench-template — Host 半区。
 *
 * 本插件只有一个功能:把标准工作台骨架(skeleton/)盖章成新项目。
 * Host 半区仅承载该能力的路由与 agent 工具;数据服务由生成出的项目各自提供。
 */
import { scaffoldProject } from './service/scaffold.mjs'

const PREFIX = '/wbt-api'

const routes = {
  'GET /health': () => ({ ok: true, service: 'workbench-template', time: new Date().toISOString() }),
  'POST /scaffold': scaffoldProject,
}

/** dsh 插件入口。 */
export const inject = ['tools', 'webServer', 'connection']

export function apply(ctx) {
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
        let raw = ''
        if (req.method === 'POST') {
          for await (const c of req) raw += c
          if (raw !== '') { try { req.params = JSON.parse(raw) } catch { /* ignore */ } }
        }
        const params = { ...(url.searchParams ? Object.fromEntries(url.searchParams) : {}), ...(req.params ?? {}) }
        const out = await fn(params, res)
        if (out === undefined) return
        res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' })
        res.end(JSON.stringify(out))
      } catch (error) {
        console.error('[wbt]', error)
        if (!res.headersSent) res.writeHead(500, { 'content-type': 'application/json; charset=utf-8' })
        res.end(JSON.stringify({ error: String(error?.message ?? error) }))
      }
    },
  }), 'workbench-template: /wbt-api routes')

  // agent 工具:让对话里也能盖章项目
  let defineTool
  try { ({ defineTool } = await import('@deepseek-ai/dsh-tools')) } catch { /* standalone */ }
  if (defineTool) {
    const tool = defineTool({
      name: 'wbt_scaffold',
      description: '在指定目录创建一个新的 dsh 工作台插件项目(从内置骨架复制并改名,含 AI 手册与 9 页范式示例)。目标目录不能已存在。',
      parameters: {
        target: { type: 'string', required: true, description: '目标目录绝对路径(必须不存在)' },
        name: { type: 'string', description: '包名,默认 dsh-<id>;须为 dsh- 开头的小写字母数字连字符(生态惯例,如 dsh-media-desk)' },
        id: { type: 'string', description: '插件 id,默认取目录名' },
      },
      output: { schema: { type: 'string' }, render: (_args, value) => [{ type: 'text', text: value }] },
      async execute(args) { return JSON.stringify(await scaffoldProject(args)) },
    })
    ctx.effect(() => ctx.tools.register(tool), 'workbench-template: tools')
  }
}
