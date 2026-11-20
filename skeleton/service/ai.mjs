/**
 * Host 半区直调模型(借鉴 dsh-media-desk / 样板项目的 callModel 模式)。
 * 用 dsh 当前默认模型选型(ctx.agentDefaultModel + ctx.llm),不单独配置密钥;
 * 模型不可用时抛错,由路由以 SSE error 帧告知页面(显式降级)。
 */

/** 从 cordis 上下文读取当前模型选型;不可用时返回 null。 */
export function modelInfo(ctx) {
  try {
    const selection = ctx.get('agentDefaultModel')?.currentSelection()
    if (!ctx.get('llm') || !selection?.provider || !selection?.model) return null
    return { provider: selection.provider, model: selection.model }
  } catch {
    return null
  }
}

/** 流式内核:逐段 yield {type:'delta',text},结束 yield {type:'done',model};失败抛错。 */
export async function* streamChat(ctx, { system, user, maxTokens = 4000, signal } = {}) {
  const info = modelInfo(ctx)
  if (info === null) throw new Error('当前没有可用模型(未配置 API Key 或模型未选择)')
  const llm = ctx.get('llm')
  const call = await llm.prepareCall(
    { provider: info.provider, model: info.model, maxTokens },
    signal,
  )
  for await (const chunk of call.stream({
    ...call.config,
    system,
    messages: [{ role: 'user', content: [{ type: 'text', text: user }], source: { kind: 'wb-plugin' } }],
    signal,
  })) {
    if (chunk.type === 'text-delta') yield { type: 'delta', text: chunk.text }
    else if (chunk.type === 'finish' && ['error', 'aborted'].includes(chunk.reason?.kind)) {
      throw new Error(chunk.reason?.failure?.message ?? '模型调用失败')
    }
  }
  yield { type: 'done', model: info.model }
}

/** 收集完整文本(非流式场景用)。 */
export async function callModel(ctx, opts = {}) {
  let text = ''
  let model = ''
  for await (const c of streamChat(ctx, opts)) {
    if (c.type === 'delta') text += c.text
    else model = c.model
  }
  return { text, model }
}
