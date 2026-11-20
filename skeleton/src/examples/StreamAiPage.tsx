/**
 * 【示例·流式 AI 页】SSE 逐字输出的完整消费端范式。
 * 抄范式:POST SSE / fetch ReadableStream 解析 data: 帧 / 逐字渲染 + 光标 /
 * AbortController 可中止 / 模型不可用时显式错误态(降级也是范式)。
 * 对应 Host 路由:/ai-stream(见 index.js,流式内核 service/ai.mjs 的 streamChat);
 * 全链路真模型版(经营数据 → 解读)见样板项目 dsh-workbench-sample 单店经营的「AI 解读」页签。
 */
import { useRef, useState, type ReactNode } from 'react'
import { BASE } from '../api'

export function StreamAiPage(): ReactNode {
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [model, setModel] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const stop = (): void => { abortRef.current?.abort(); abortRef.current = null }

  const generate = (): void => {
    if (busy) return
    setBusy(true); setText(''); setError(null); setModel(null)
    const ac = new AbortController()
    abortRef.current = ac
    void (async () => {
      try {
        const res = await fetch(`${BASE}/ai-stream`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ ask: '用三句话介绍这个工作台示例里最值得学的三个范式' }),
          signal: ac.signal,
        })
        if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`)
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            try {
              const payload = JSON.parse(line.slice(6)) as { type?: string; text?: string; model?: string; error?: string }
              if (payload.type === 'delta' && payload.text) setText(prev => prev + payload.text)
              if (payload.model) setModel(payload.model)
              if (payload.error) setError(payload.error)
            } catch { /* 忽略不成帧的行 */ }
          }
        }
      } catch (e) {
        if ((e as Error).name !== 'AbortError') setError(String((e as Error).message ?? e))
      } finally {
        setBusy(false)
        abortRef.current = null
      }
    })()
  }

  return (
    <div className="wb-page">
      <div className="wb-topbar">
        <div>
          <div className="wb-title">AI 流式解读</div>
          <div className="wb-sub">示例:SSE 逐字输出 + 可中止 + 显式降级(Host 侧 /ai-stream 直调当前模型)</div>
        </div>
        <div className="wb-row" style={{ marginLeft: 'auto' }}>
          {!busy
            ? <button className="wb-btn primary" onClick={generate}>生成解读</button>
            : <button className="wb-btn ghost" onClick={stop}>停止</button>}
        </div>
      </div>
      <div className="wb-body">
        <div className="wb-card" style={{ minHeight: 220 }}>
          {error !== null && (
            <div className="wb-empty">
              <div className="wb-error">✗ {error}</div>
              <div className="wb-sub">实例未配置模型 Key 时会到这里——显式报错、不吐假数据,这本身就是范式。</div>
              <button className="wb-btn ghost" onClick={generate}>重试</button>
            </div>
          )}
          {error === null && text === '' && busy && <div className="wb-loading"><i style={{ width: '45%' }} /><i style={{ width: '80%' }} /></div>}
          {error === null && text === '' && !busy && (
            <div className="wb-empty"><div>点「生成解读」,模型输出将逐字出现在这里。</div></div>
          )}
          {error === null && text !== '' && (
            <div>
              {model !== null && (
                <div className="wb-sub" style={{ marginBottom: 10 }}>来源:模型直调,流式输出({model})</div>
              )}
              <div style={{ whiteSpace: 'pre-wrap', fontSize: 13.5, lineHeight: 1.8 }}>
                {text}{busy && <span style={{ opacity: .5 }}>▍</span>}
              </div>
            </div>
          )}
        </div>
        <div className="wb-note" style={{ marginTop: 14 }}>
          Host 侧要点:路由自写响应(dispatch 返回 undefined 不包 JSON)→ text/event-stream 逐段转发
          streamChat 增量;业务数据的真模型解读见样板「单店经营 → AI 解读」。
        </div>
      </div>
    </div>
  )
}
