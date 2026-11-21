/** 新建工作台:页面化脚手架 — 输入目标路径,自动从骨架生成一个可运行的 dsh 插件项目。 */
import { useState, type ReactNode } from 'react'
import { BASE, post, postScaffold, type ApiScaffoldResult } from '../api'
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

  // 卸载:输入路径 → 扫描全部 profile 的登记(含失效)→ 选择 → 热移除
  type Registration = { profile: string; key: string; linkTarget?: string; stale: boolean; hasBundle: boolean }
  type UninstallOutcome = { profile: string; key: string; ok: boolean; hints?: string[]; error?: string }
  const [uninstallPath, setUninstallPath] = useState('')
  const [scanBusy, setScanBusy] = useState(false)
  const [found, setFound] = useState<Registration[] | null>(null)
  const [selected, setSelected] = useState<string[]>([])
  const [uninstallBusy, setUninstallBusy] = useState(false)
  const [uninstallOutcomes, setUninstallOutcomes] = useState<UninstallOutcome[] | null>(null)

  const scan = (): void => {
    if (scanBusy || uninstallPath.trim() === '') return
    setScanBusy(true); setFound(null); setUninstallOutcomes(null)
    void (async () => {
      try {
        const res = await fetch(`${BASE}/uninstall-scan`, {
          method: 'POST', headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ path: uninstallPath.trim() }),
        })
        if (!res.ok) { setFound([]); return }
        const data = (await res.json()) as Registration[]
        setFound(Array.isArray(data) ? data : [])
      } catch { setFound([]) } finally { setScanBusy(false) }
    })()
  }

  const uninstallSelected = (): void => {
    if (uninstallBusy || selected.length === 0) return
    setUninstallBusy(true); setUninstallOutcomes(null)
    void (async () => {
      try {
        const res = await fetch(`${BASE}/uninstall`, {
          method: 'POST', headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ path: uninstallPath.trim(), profiles: selected }),
        })
        if (res.status === 404) {
          setUninstallOutcomes([{ profile: '—', key: '—', ok: false, error: '当前运行的实例是旧版本,缺少卸载接口——重启实例后重试' }])
          return
        }
        if (!res.ok) { setUninstallOutcomes([{ profile: '—', key: '—', ok: false, error: `HTTP ${res.status}` }]); return }
        const data = (await res.json()) as { results?: UninstallOutcome[] }
        setUninstallOutcomes(Array.isArray(data) ? data : (data.results ?? []))
        setFound(null)
      } catch {
        setUninstallOutcomes([{ profile: '—', key: '—', ok: false, error: '数据服务不可达(实例未启动或网络异常)' }])
      } finally { setUninstallBusy(false) }
    })()
  }

  // 首次会话提示词 = 入职引导:让 AI 了解背景与约束,然后主动向用户要需求。
  // 需求由用户在第二次对话自然给出——提示词整段复制即用,不含任何占位符。
  const firstPrompt = ok && result !== null ? [
    `这是一个刚生成的 dsh 工作台插件项目(路径 ${result.target},包名 ${result.name},插件 id ${result.id})。`,
    '请先完成「入职」,暂时不要写任何代码:',
    '1. 读完 AGENTS.md —— 项目身份、红线、开发工作流',
    '2. 读完 docs/EXAMPLES.md 与 src/examples/ 的 9 个示例页源码(渲染效果:把 src/client.tsx 的 SHOW_EXAMPLES 置 true)',
    '3. 用几句话向我复述:这个目录是什么、有哪些既定约束、你准备按什么工作流开发;然后向我提出你需要澄清的问题',
    '',
    '我会在下一条消息里给出需求描述。开发约束(全程适用):',
    '页面范式照 examples 抄,不改 examples/ 与 theme.ts;主代码不 import 示例区;',
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
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px dashed var(--tll-line)' }}>
              <div style={{ fontSize: 13.5, fontWeight: 650, marginBottom: 8 }}>主路径:交给 AI 开发</div>
              <div style={{ fontSize: 12.5, color: 'var(--tll-ink2)', lineHeight: 1.9, marginBottom: 10 }}>
                ① 用 ClaudeCode / Codex / OpenCode 打开项目目录<br />
                ② 粘贴下方「首次会话提示词」——构建、门禁、开发迭代全部由 AI 按 AGENTS.md 执行,你不需要手动敲命令<br />
                ③ 想在浏览器里看效果:直接让 AI 运行 <code>./start.sh</code>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 13.5, fontWeight: 650 }}>首次会话提示词</span>
                <span style={{ fontSize: 12, color: 'var(--tll-ink2)' }}>复制即用,无需修改——粘贴后 AI 会读手册并向你要需求</span>
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

            <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px dashed var(--tll-line)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 13.5, fontWeight: 650 }}>可选:自己在 dsh 里预览运行</span>
                <span style={{ fontSize: 12, color: 'var(--tll-ink2)' }}>一条命令,自动完成 构建/初始化/登记/启动;启动后终端被占用属正常,也可让 AI 代跑</span>
                <button
                  className="tll-pill-btn" style={{ marginLeft: 'auto' }}
                  onClick={() => { void navigator.clipboard?.writeText(`cd ${result.target ?? ''} && ./start.sh`).catch(() => {}) }}
                >复制</button>
              </div>
              <pre style={{
                background: 'var(--tll-card2)', border: '1px solid var(--tll-line)', borderRadius: 10,
                padding: '12px 14px', fontSize: 12, lineHeight: 1.7, margin: 0,
              }}>{`cd ${result.target ?? ''} && ./start.sh`}</pre>
            </div>
          </div>
        )}

        <div className="tll-card" style={{ padding: '16px 20px', marginTop: 16 }}>
          <div style={{ fontSize: 13.5, fontWeight: 650, marginBottom: 4 }}>卸载已生成的项目</div>
          <div style={{ fontSize: 12, color: 'var(--tll-ink3)', marginBottom: 10 }}>
            输入生成项目的路径,扫描它在所有 profile 里的登记(含项目改名/移动留下的失效登记),按需移除。
            只动登记,不删目录——你的代码与数据保留。
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 12.5, color: 'var(--tll-ink2)' }}>项目路径</span>
            <input
              className="tll-search" style={{ width: '100%' }}
              placeholder="/Volumes/NVME980/shuge-harness/dsh-writer-desk"
              value={uninstallPath} onChange={e => { setUninstallPath(e.target.value); setFound(null); setUninstallOutcomes(null) }}
            />
            <button className="tll-ai-btn" style={{ opacity: scanBusy || uninstallPath.trim() === '' ? 0.55 : 1 }} onClick={scan}>
              {scanBusy ? '扫描中…' : '扫描'}
            </button>
          </div>

          {found !== null && uninstallOutcomes === null && (
            <div style={{ marginTop: 12 }}>
              {found.length === 0
                ? <div style={{ fontSize: 12.5, color: 'var(--tll-ink2)' }}>所有 profile 里都没有该路径的登记——无需卸载。</div>
                : (
                    <>
                      <div style={{ fontSize: 12.5, color: 'var(--tll-ink2)', marginBottom: 6 }}>找到 {found.length} 条登记:</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                        {found.map(r => (
                          <label key={r.profile} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5 }}>
                            <input type="checkbox" checked={selected.includes(r.profile)}
                              onChange={e => { setSelected(s => e.target.checked ? [...s, r.profile] : s.filter(x => x !== r.profile)) }} />
                            <b>{r.profile}</b>
                            <span style={{ color: 'var(--tll-ink2)' }}>{r.key}{r.linkTarget ? ` → ${r.linkTarget}` : ''}</span>
                            {r.stale && <span className="tll-pill" style={{ color: 'var(--tll-down)', background: 'rgba(192,57,43,.1)' }}>失效(目录已不存在)</span>}
                          </label>
                        ))}
                      </div>
                      {selected.length > 0 && (
                        <div style={{ background: 'var(--tll-card2)', border: '1px solid var(--tll-line)', borderRadius: 10, padding: '10px 14px', marginBottom: 12 }}>
                          <div style={{ fontSize: 12.5, fontWeight: 650, marginBottom: 6 }}>执行后将涉及以下内容(先看清楚,再确认):</div>
                          <div style={{ fontSize: 12, lineHeight: 1.9, color: 'var(--tll-ink2)' }}>
                            {selected.map(profile => (
                              <div key={profile} style={{ marginBottom: 6 }}>
                                <div><b style={{ color: 'var(--tll-ink)' }}>~/.dsh/profiles/{profile}/package.json</b> — 移除 dependencies 登记与 bundles 条目</div>
                                <div><b style={{ color: 'var(--tll-ink)' }}>~/.dsh/profiles/{profile}/node_modules/</b> — 移除对应符号链接</div>
                              </div>
                            ))}
                            <div>✓ 不变:项目目录本身(代码与数据全部保留,是否删除由你决定)</div>
                            <div>✓ 生效方式:该 profile 的实例重启后面板消失;浏览器刷新即可看到</div>
                          </div>
                        </div>
                      )}
                      <button className="tll-ai-btn" style={{ opacity: uninstallBusy || selected.length === 0 ? 0.55 : 1 }} onClick={uninstallSelected}>
                        {uninstallBusy ? '卸载中…' : `确认卸载选中的 ${selected.length} 条`}
                      </button>
                    </>
                  )}
            </div>
          )}

          {uninstallOutcomes !== null && (
            <div style={{ marginTop: 12, fontSize: 12.5, lineHeight: 1.9 }}>
              {uninstallOutcomes.map(o => (
                <div key={o.profile} style={{ marginBottom: 8 }}>
                  <span style={{ color: o.ok ? 'var(--tll-up)' : 'var(--tll-down)', fontWeight: 600 }}>
                    {o.ok ? '✓' : '✗'} {o.profile}
                  </span>
                  <span style={{ color: 'var(--tll-ink2)' }}> — {o.error ?? (o.hints ?? []).join(' ')}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div style={{ display: 'none' }}><IconCopy size={12} /></div>      <div style={{ display: 'none' }}><IconCopy size={12} /></div>
    </div>
  )
}
