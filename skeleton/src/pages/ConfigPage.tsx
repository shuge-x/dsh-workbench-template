/**
 * 插件行配置页:注册到 plugins.row.config(键 = 包名#include:<insert id> 与 包名#<insert id> 两个都注册)。
 * 插件管理页里本插件行会出现「配置」控件,打开即此表单;
 * 保存经 form.set 写回 profile patch,Host 半区 HMR 热重载生效(字段对应 index.js 的 Config)。
 * 样式用 wb-(theme.ts 常驻注入),不依赖示例区。
 */
import { useEffect, useState, type ReactNode } from 'react'

/** 插件管理页供给的配置表单面(0.2.2-rc.1 裁剪契约:state 快照 + mutate 原子写)。
 *  旧版(rc.5)的 getSnapshot/subscribe/set 已被取代——升级时对照 ui-settings config-form-types.ts。 */
export interface ConfigPageForm {
  readonly state: {
    status: 'loading' | 'ready' | 'unavailable'
    value: Record<string, unknown> | undefined
    revision: number | undefined
    writable: boolean
  }
  readonly mutate: (
    ops: readonly { op: 'set'; path: string[]; value: unknown }[],
    expectedRevision?: number,
  ) => Promise<boolean>
}

type Draft = { brandName: string; aiPreamble: string }

const FIELDS: { key: keyof Draft; label: string; placeholder: string; multiline?: boolean }[] = [
  { key: 'brandName', label: '工作台名称', placeholder: 'My Workbench(AI 提示词自我介绍用)' },
  { key: 'aiPreamble', label: 'AI 回答风格前言', placeholder: '可按部署定制口吻;留空用默认', multiline: true },
]

export function ConfigPage({ view, form }: { view?: 'summary' | 'page'; form?: ConfigPageForm }): ReactNode {
  const snap = form?.state
  const [draft, setDraft] = useState<Draft | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const v = snap?.value
    if (v !== undefined) {
      setDraft({ brandName: String(v.brandName ?? ''), aiPreamble: String(v.aiPreamble ?? '') })
    }
  }, [snap?.revision]) // eslint-disable-line react-hooks/exhaustive-deps

  // 摘要视图:插件列表行内的一个占位说明
  if (view === 'summary' || form === undefined) {
    return <span style={{ color: 'var(--wb-ink2)', fontSize: 12 }}>演示参数:工作台名称 / AI 回答风格前言</span>
  }
  if (snap === undefined || snap.status !== 'ready') {
    return <span style={{ color: 'var(--wb-ink3)', fontSize: 12 }}>配置加载中…</span>
  }

  const save = async (): Promise<void> => {
    if (draft === null || form === undefined) return
    // 一次原子 mutation 写全部字段;revision 围栏防并发覆盖
    const accepted = await form.mutate(
      Object.entries(draft).map(([field, value]) => ({ op: 'set' as const, path: [field], value })),
      snap?.revision,
    )
    if (!accepted) return
    setSaved(true)
    window.setTimeout(() => { setSaved(false) }, 2500)
  }

  const field = (f: { key: keyof Draft; label: string; placeholder: string; multiline?: boolean }): ReactNode => (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12, fontSize: 12, color: 'var(--wb-ink2)' }}>
      {f.label}
      {f.multiline
        ? (
            <textarea
              className="wb-input" rows={2} style={{ resize: 'vertical' }}
              value={draft?.[f.key] ?? ''} placeholder={f.placeholder}
              onChange={e => { setDraft(d => (d === null ? d : { ...d, [f.key]: e.target.value })) }}
            />
          )
        : (
            <input
              className="wb-input" style={{ width: '100%' }}
              value={draft?.[f.key] ?? ''} placeholder={f.placeholder}
              onChange={e => { setDraft(d => (d === null ? d : { ...d, [f.key]: e.target.value })) }}
            />
          )}
    </label>
  )

  return (
    <div style={{ maxWidth: 560 }}>
      {FIELDS.map(f => field(f))}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
        <button className="wb-btn primary" style={{ opacity: snap.writable === false ? 0.5 : 1 }} onClick={() => { void save() }}>
          保存
        </button>
        {saved && <span style={{ fontSize: 12, color: 'var(--wb-ok)' }}>✓ 已保存,插件热重载后生效</span>}
        {snap.writable === false && <span style={{ fontSize: 12, color: 'var(--wb-ink3)' }}>当前层不可写</span>}
      </div>
    </div>
  )
}
