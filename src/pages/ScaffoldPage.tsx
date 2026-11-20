/** 新建工作台:页面化脚手架 — 输入目标路径,自动从骨架生成一个可运行的 dsh 插件项目。 */
import { useState, type ReactNode } from 'react'
import { postScaffold, type ApiScaffoldResult } from '../api'
import { IconCopy } from '../icons'

export function ScaffoldPage(): ReactNode {
  const [target, setTarget] = useState('')
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [idEdited, setIdEdited] = useState(false)
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<ApiScaffoldResult | null>(null)

  // 目标路径变化时:从目录名自动推导插件 id(用户手动改过 id 则不覆盖)
  const sanitize = (v: string): string => v.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '')
  const onTargetChange = (v: string): void => {
    setTarget(v)
    if (!idEdited) {
      const base = sanitize(v.split('/').filter(Boolean).pop() ?? '')
      setId(base)
      setName(base === '' ? '' : (base.startsWith('dsh-') ? base : 'dsh-' + base))
    }
  }
  // id 填写时自动推导包名:包名 = id(id 已以 dsh- 开头则不重复叠加,生态惯例 dsh-media-desk)
  const onIdChange = (v: string): void => {
    setId(v)
    setIdEdited(true)
    if (name === '' || name === (id.startsWith('dsh-') ? id : 'dsh-' + id)) {
      setName(v === '' ? '' : (sanitize(v).startsWith('dsh-') ? sanitize(v) : 'dsh-' + sanitize(v)))
    }
  }

  const submit = (): void => {
    if (busy || target.trim() === '') return
    setBusy(true)
    setResult(null)
    void postScaffold({ target: target.trim(), name: name.trim() || 'dsh-myworkbench', id: id.trim() || 'myworkbench' })
      .then(res => { setResult(res ?? { error: '数据服务不可达' }) })
      .finally(() => { setBusy(false) })
  }

  const err = result?.error
  const ok = result?.ok === true

  // 首次会话提示词:任意 AI 开发工具(ClaudeCode/Codex/OpenCode/dsh)加载生成目录后的第一句话。
  const firstPrompt = ok && result !== null ? [
    `这是一个刚生成的 dsh 工作台插件项目(路径 ${result.target},包名 ${result.name},插件 id ${result.id})。`,
    '请先按顺序阅读并遵守:',
    '1. AGENTS.md —— 项目身份、红线、开发工作流',
    '2. docs/EXAMPLES.md —— 范式索引与红线映射表',
    '3. src/examples/ —— 9 个示例页源码(渲染效果:把 src/client.tsx 的 SHOW_EXAMPLES 置 true)',
    '',
    '然后实现我的需求:【在这里写下你的业务需求】',
    '约束:页面范式照 examples 抄,不改 examples/ 与 theme.ts;主代码不 import 示例区;',
    '每个新页面注册进 src/client.tsx 的 PANELS 并带 .wb-page 根容器;',
    '每次改完跑 npm run guard && npm run build,全绿才算完成。',
  ].join('\n') : ''

  return (
    <div className="tll-page">
      <div className="tll-topbar" style={{ paddingBottom: 0 }}>
        <div className="tll-store-main">
          <div className="tll-store-row1"><span className="tll-store-name">新建工作台</span></div>
          <div className="tll-store-row2"><span>输入目标路径,从内置骨架生成一个可运行的 dsh 插件项目(含数据服务与示例页面)</span></div>
        </div>
      </div>
      <div className="tll-body" style={{ maxWidth: 860 }}>
        <div className="tll-card" style={{ padding: '20px 22px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '14px 14px', alignItems: 'center' }}>
            <span style={{ fontSize: 12.5, color: 'var(--tll-ink2)' }}>目标路径 *</span>
            <input
              className="tll-search" style={{ width: '100%' }}
              placeholder="/Volumes/NVME980/shuge-pai/my-new-workbench(目录必须不存在)"
              value={target} onChange={e => { onTargetChange(e.target.value) }}
            />
            <span style={{ fontSize: 12.5, color: 'var(--tll-ink2)' }}>插件 id</span>
            <input
              className="tll-search" style={{ width: '100%' }} placeholder="取自目录名,如 ai-toolbox(可改)"
              value={id} onChange={e => { onIdChange(e.target.value) }}
            />
            <span style={{ fontSize: 12.5, color: 'var(--tll-ink2)' }}>包名</span>
            <input
              className="tll-search" style={{ width: '100%' }} placeholder="dsh-myworkbench"
              value={name} onChange={e => { setName(e.target.value) }}
            />
          </div>
          <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="tll-ai-btn" onClick={submit} style={{ opacity: busy || target.trim() === '' ? 0.55 : 1 }}>
              {busy ? '生成中…' : '生成项目'}
            </button>
            {err !== undefined && err !== null && <span style={{ color: 'var(--tll-down)', fontSize: 12.5 }}>✗ {err}</span>}
          </div>
        </div>

        {ok && result !== null && (
          <div className="tll-card" style={{ padding: '20px 22px', marginTop: 16 }}>
            <div style={{ fontSize: 15.5, fontWeight: 650, marginBottom: 6 }}>
              ✓ 已生成 {String(result.files?.length ?? 0)} 个文件
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--tll-ink2)', marginBottom: 12 }}>
              包名 {result.name} · 插件 id {result.id} · 端口 {result.port}
            </div>
            <div style={{ position: 'relative' }}>
              <pre style={{
                background: 'var(--tll-card2)', border: '1px solid var(--tll-line)', borderRadius: 10,
                padding: '12px 14px', fontSize: 12, lineHeight: 1.7, overflow: 'auto', margin: 0,
              }}>{result.nextSteps?.map(s => '$ ' + s).join('\n')}</pre>
              <button
                className="tll-pill-btn" style={{ position: 'absolute', top: 8, right: 8 }}
                onClick={() => { void navigator.clipboard?.writeText((result.nextSteps ?? []).map(s => '$ ' + s).join('\n')) }}
              >复制</button>
            </div>
            <div style={{ fontSize: 12, color: 'var(--tll-ink3)', marginTop: 10 }}>
              安装运行:先跑上面的命令;项目自带 <b>AGENTS.md</b>(AI 手册)与 docs/EXAMPLES.md(范式索引)——
              ClaudeCode / Codex / OpenCode 加载目录即自动生效。
            </div>

            <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px dashed var(--tll-line)' }}>
              <div className="tll-row" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 13.5, fontWeight: 650 }}>AI 开发:首次会话提示词</span>
                <span style={{ fontSize: 12, color: 'var(--tll-ink2)' }}>加载目录后粘贴给 AI(替换最后一行的业务需求)</span>
                <button
                  className="tll-pill-btn" style={{ marginLeft: 'auto' }}
                  onClick={() => { void navigator.clipboard?.writeText(firstPrompt).catch(() => {}) }}
                >复制提示词</button>
              </div>
              <pre style={{
                background: 'var(--tll-card2)', border: '1px solid var(--tll-line)', borderRadius: 10,
                padding: '12px 14px', fontSize: 12, lineHeight: 1.7, overflow: 'auto', margin: 0,
                whiteSpace: 'pre-wrap',
              }}>{firstPrompt}</pre>
            </div>
          </div>
        )}
      </div>
      <div style={{ display: 'none' }}><IconCopy size={12} /></div>
    </div>
  )
}
