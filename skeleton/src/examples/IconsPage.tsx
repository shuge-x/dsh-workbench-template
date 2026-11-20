/**
 * 【示例·图标与样式规范】生成项目的「活样式手册」+ 图标浏览器。
 *  四区:通用图标网格(官方 97+ 图形)/ 标签与选项 / 文件类型图标 / 按钮状态提示。
 *  素材来源: DeepSeek Harness · MIT(官方包 @deepseek-ai/dsh-client-ui-primitives,零拷贝)。
 *  抄范式:官方图标组件 + sprite 挂载(theme.ts 的 mountIconSprite)/ 官方组件与自有主题类并用。
 */
import { useMemo, useState, type ComponentType, type ReactNode } from 'react'
import * as Primitives from '@deepseek-ai/dsh-client-ui-primitives'
import { FileTypeIcon, StateDot, Pill } from '@deepseek-ai/dsh-client-ui-primitives'
import { FILE_SAMPLES } from './data'

type IconComp = ComponentType<{ size?: number }>
type Weight = 'Regular' | 'Medium'

/** 从官方包根导出里自发现全部产品图标(名称规范:Icon<Glyph><Weight>)。 */
const ALL_ICONS = Object.entries(Primitives)
  .filter(([k]) => /^Icon[A-Za-z0-9]+(Regular|Medium)$/.test(k))
  .map(([key]) => {
    const m = key.match(/^Icon([A-Za-z0-9]+?)(Regular|Medium)$/)!
    return { key, glyph: m[1].replace(/Outline$/, ''), weight: m[2] as Weight }
  })

const GLYPHS = [...new Set(ALL_ICONS.map(i => i.glyph))].sort()

/** 常用图形的中文名(未收录的显示键名;可自行补全)。 */
const LABELS: Record<string, string> = {
  NewChat: '新对话', CordisPlugin: '插件', Search: '搜索', Globe: '浏览器', Settings: '设置',
  PanelLeft: '侧栏', Ellipsis: '更多', Plus: '添加', Check: '确认', Copy: '复制', Refresh: '刷新',
  Share: '分享', Edit: '编辑', Trash: '删除', Warning: '警告', User: '用户', Users: '用户组',
  PaperPlane: '发送', StopFill: '停止', Paperclip: '附件', Download: '下载', Play: '播放',
  Pause: '暂停', Fullscreen: '全屏', Code: '代码', Api: '接口', ProjectAdd: '新建项目',
  FolderOpen: '打开目录', FolderClose: '文件夹', Save: '保存', Branch: '分支', Link: '链接',
  Think: '思考', Browse: '浏览', Loading: '加载中', Like: '赞同', Dislike: '反对', Close: '关闭',
  RightUp: '外链', Light: '浅色', Dark: '深色', Followsystem: '跟随系统', DeliverDoc: '送达',
  AgentPreset: '智能体', Enhance: '增强', ContextInjection: '上下文', TreeCorner: '树形',
}

function pick(glyph: string, weight: Weight): { key: string; Comp: IconComp } | null {
  const order: Weight[] = [weight, weight === 'Regular' ? 'Medium' : 'Regular']
  for (const w of order) {
    const hit = ALL_ICONS.find(i => i.glyph === glyph && i.weight === w)
    if (hit) return { key: hit.key, Comp: Primitives[hit.key] as IconComp }
  }
  return null
}

/** 点击图标后展开的用法条:组件名 + 两行可复制代码。 */
function IconDetail({ glyph, weight, size, onClose }: { glyph: string; weight: Weight; size: number; onClose: () => void }): ReactNode {
  const hit = pick(glyph, weight)
  if (hit === null) return null
  const snippet = `import { ${hit.key} } from '@deepseek-ai/dsh-client-ui-primitives'\n\n<${hit.key} size={${size}} />`
  return (
    <div className="wb-card" style={{ margin: '12px 0', borderColor: 'var(--wb-accent)' }}>
      <div className="wb-row" style={{ justifyContent: 'space-between' }}>
        <div className="wb-row">
          <span style={{ color: 'var(--wb-ink2)' }}><hit.Comp size={26} /></span>
          <div>
            <div style={{ fontWeight: 650 }}>{LABELS[glyph] ?? glyph}</div>
            <div className="wb-sub">{hit.key}</div>
          </div>
        </div>
        <div className="wb-row">
          <button className="wb-btn ghost" onClick={() => { void navigator.clipboard?.writeText(snippet).catch(() => {}) }}>复制用法</button>
          <button className="wb-btn ghost" onClick={onClose}>关闭</button>
        </div>
      </div>
      <pre style={{ margin: '10px 0 0', fontSize: 11.5, background: 'var(--wb-bg)', borderRadius: 8, padding: '10px 12px', whiteSpace: 'pre-wrap' }}>{snippet}</pre>
    </div>
  )
}

export function IconsPage(): ReactNode {
  const [weight, setWeight] = useState<Weight>('Regular')
  const [size, setSize] = useState(20)
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState<string | null>(null)

  const shown = useMemo(() => GLYPHS.filter(g => {
    const label = LABELS[g] ?? ''
    return q === '' || label.includes(q) || g.toLowerCase().includes(q.toLowerCase())
  }), [q])

  return (
    <div className="wb-page">
      <div className="wb-topbar">
        <div>
          <div className="wb-title">图标与样式规范</div>
          <div className="wb-sub">共 {GLYPHS.length} 种图形 · 普通 1px / 强调 1.3px · 素材来源 DeepSeek Harness(MIT)</div>
        </div>
        <div className="wb-row" style={{ marginLeft: 'auto' }}>
          <input className="wb-input" placeholder="搜索图标名称" value={q} onChange={e => setQ(e.target.value)} style={{ width: 180 }} />
        </div>
      </div>
      <div className="wb-body">
        <div className="wb-row" style={{ marginBottom: 12 }}>
          {(['Regular', 'Medium'] as Weight[]).map(w => (
            <button key={w} className={'wb-chip' + (weight === w ? ' on' : '')} onClick={() => setWeight(w)}>
              {w === 'Regular' ? '普通 1px' : '强调 1.3px'}
            </button>
          ))}
          <select className="wb-select" value={size} onChange={e => setSize(Number(e.target.value))}>
            {[16, 20, 24].map(s => <option key={s} value={s}>{s}px</option>)}
          </select>
          <span className="wb-sub">{shown.length} 项 · 点击图标看用法</span>
        </div>

        {selected !== null && <IconDetail glyph={selected} weight={weight} size={size} onClose={() => setSelected(null)} />}

        <div className="wb-card" style={{ padding: 14 }}>
          <div className="wbex-icon-grid">
            {shown.map(g => {
              const hit = pick(g, weight)
              if (hit === null) return null
              return (
                <button key={g} className="wbex-icon-cell" onClick={() => setSelected(g)}>
                  <hit.Comp size={size} />
                  <span>{LABELS[g] ?? g}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="wb-sec"><span className="wb-sec-no">01</span><span className="wb-sec-title">标签与选项</span></div>
        <div className="wb-card">
          <div className="wb-sub" style={{ marginBottom: 8 }}>尺寸标签(wb-chip,选中态 .on)</div>
          <div className="wb-row" style={{ marginBottom: 12 }}>
            <span className="wb-chip">本地文件</span>
            <span className="wb-chip on">当前版本</span>
            <span className="wb-chip">只读</span>
            <span className="wb-chip">可选</span>
          </div>
          <div className="wb-sub" style={{ marginBottom: 8 }}>语义状态(wb-pill ok/warn/err/info)</div>
          <div className="wb-row" style={{ marginBottom: 12 }}>
            <span className="wb-pill ok">已完成</span>
            <span className="wb-pill warn">待确认</span>
            <span className="wb-pill err">执行失败</span>
            <span className="wb-pill info">分析中</span>
          </div>
          <div className="wb-sub" style={{ marginBottom: 8 }}>可点击胶囊(官方 Pill,选中由 active 驱动)</div>
          <div className="wb-row">
            {['全部', '进行中', '已完成'].map((t, i) => <PillExample key={t} label={t} defaultOn={i === 0} />)}
          </div>
        </div>

        <div className="wb-sec"><span className="wb-sec-no">02</span><span className="wb-sec-title">文件类型图标(官方 FileTypeIcon,按扩展名自动分类)</span></div>
        <div className="wb-card">
          <div className="wbex-file-row">
            {FILE_SAMPLES.map(name => (
              <div key={name} className="wbex-file-cell">
                <FileTypeIcon path={name} size={30} />
                <div className="wb-sub" style={{ marginTop: 6 }}>{name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="wb-sec"><span className="wb-sec-no">03</span><span className="wb-sec-title">按钮、状态与提示(悬停、选中、禁用都有明确反馈)</span></div>
        <div className="wb-card">
          <div className="wb-row" style={{ marginBottom: 14 }}>
            <button className="wb-btn primary">开始分析</button>
            <button className="wb-btn ghost">查看详情</button>
            <button className="wb-btn primary" disabled>暂不可用</button>
          </div>
          <div className="wb-row" style={{ marginBottom: 14, gap: 18 }}>
            {(['done', 'ongoing', 'warning', 'error', 'idle'] as const).map(s => (
              <span key={s} className="wb-row" style={{ gap: 6 }}>
                <StateDot state={s} />
                <span className="wb-sub">{{ done: '已完成', ongoing: '进行中', warning: '待确认', error: '失败', idle: '空闲' }[s]}</span>
              </span>
            ))}
          </div>
          <div className="wb-row">
            <span className="wb-sub">复制回复</span>
            <span className="wb-kbd">Ctrl</span>
            <span className="wb-kbd">C</span>
          </div>
        </div>
        <div className="wb-note">主题色/间距等 token 见 src/theme.ts;页面级布局样式写在页面文件里,不回灌 theme。</div>
      </div>
    </div>
  )
}

function PillExample({ label, defaultOn }: { label: string; defaultOn: boolean }): ReactNode {
  const [on, setOn] = useState(defaultOn)
  return <Pill active={on} onClick={() => setOn(!on)}>{label}</Pill>
}
