/**
 * 【示例·图标与样式规范】生成项目的「活样式手册」+ 图标浏览器。
 *  三区:通用图标网格(官方图形 vendored 快照 106 图形×2权重)/ 标签与选项 / 按钮状态提示。
 *  素材来源:DeepSeek Harness · MIT(vendored 于 src/design/icons-data.ts,不 import 官方包)。
 *  抄范式:WbIcon sprite 引用(theme.ts mountIconSprite 挂载)+ 官方素材与自有主题类并用。
 */
import { useMemo, useState, type ReactNode } from 'react'
import { WbIcon } from '../icons'
import { ICON_GLYPH_NAMES } from '../design/icons-data'

type Weight = 'regular' | 'medium'

const GLYPHS = ICON_GLYPH_NAMES

/** 常用图形的中文名(未收录的显示键名;可自行补全)。 */
const LABELS: Record<string, string> = {
  'new-chat-outline': '新对话', 'cordis-plugin-outline': '插件', 'search-outline': '搜索',
  'globe-outline': '浏览器', 'settings-outline': '设置', 'panel-left-outline': '侧栏',
  'ellipsis-outline': '更多', 'plus-outline': '添加', 'check-outline': '确认',
  'copy-outline': '复制', 'refresh-outline': '刷新', 'share-outline': '分享',
  'edit-outline': '编辑', 'trash-outline': '删除', 'warning-outline': '警告',
  'user-outline': '用户', 'users-outline': '用户组', 'paper-plane-outline': '发送',
  'stop-fill': '停止', 'paperclip-outline': '附件', 'download-outline': '下载',
  'play-outline': '播放', 'pause-outline': '暂停', 'fullscreen-outline': '全屏',
  'code-outline': '代码', 'api-outline': '接口', 'project-add-outline': '新建项目',
  'folder-open-outline': '打开目录', 'folder-close': '文件夹', 'save-outline': '保存',
  'branch-outline': '分支', 'link-outline': '链接', 'think-outline': '思考',
  'browse-outline': '浏览', 'loading-outline': '加载中', 'like-outline': '赞同',
  'dislike-outline': '反对', 'close-outline': '关闭', 'right-up-outline': '外链',
  'light-outline': '浅色', 'dark-outline': '深色', 'followsystem-outline': '跟随系统',
  'deliver-doc': '送达', 'agent-preset-outline': '智能体', 'enhance-outline': '增强',
  'context-injection-outline': '上下文', 'tree-corner': '树形', 'database-outline': '数据库',
  'data-outline': '数据', 'plan-outline': '计划', 'goal-outline': '目标',
  'skill-outline': '技能', 'inspect-outline': '检查', 'upload-outline': '上传',
  'archive-outline': '归档', 'alarm-clock-outline': '提醒', 'checklist-outline': '清单',
  'info-outline': '信息', 'question-outline': '疑问', 'mail-read-outline': '已读',
  'mail-unread-outline': '未读', 'chevron-down-outline': '展开', 'chevron-up-outline': '收起',
  'chevron-left-outline': '上一步', 'chevron-right-outline': '下一步',
}

/** 点击图标后展开的用法条:glyph 名 + 两行可复制代码。 */
function IconDetail({ glyph, weight, size, onClose }: { glyph: string; weight: Weight; size: number; onClose: () => void }): ReactNode {
  const snippet = `import { WbIcon } from '../icons'\n\n<WbIcon glyph="${glyph}" weight="${weight}" size={${size}} />`
  return (
    <div className="wb-card" style={{ margin: '12px 0', borderColor: 'var(--wb-accent)' }}>
      <div className="wb-row" style={{ justifyContent: 'space-between' }}>
        <div className="wb-row">
          <span style={{ color: 'var(--wb-ink2)' }}><WbIcon glyph={glyph} weight={weight} size={26} /></span>
          <div>
            <div style={{ fontWeight: 650 }}>{LABELS[glyph] ?? glyph}</div>
            <div className="wb-sub">{glyph} · {weight}</div>
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
  const [weight, setWeight] = useState<Weight>('regular')
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
          <div className="wb-sub">共 {GLYPHS.length} 种图形 · 普通 1px / 强调 1.3px · 官方图形 vendored 快照(DeepSeek Harness,MIT)</div>
        </div>
        <div className="wb-row" style={{ marginLeft: 'auto' }}>
          <input className="wb-input" placeholder="搜索图标名称" value={q} onChange={e => setQ(e.target.value)} style={{ width: 180 }} />
        </div>
      </div>
      <div className="wb-body">
        <div className="wb-row" style={{ marginBottom: 12 }}>
          {(['regular', 'medium'] as Weight[]).map(w => (
            <button key={w} className={'wb-chip' + (weight === w ? ' on' : '')} onClick={() => setWeight(w)}>
              {w === 'regular' ? '普通 1px' : '强调 1.3px'}
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
            {shown.map(g => (
              <button key={g} className="wbex-icon-cell" onClick={() => setSelected(g)}>
                <WbIcon glyph={g} weight={weight} size={size} />
                <span>{LABELS[g] ?? g}</span>
              </button>
            ))}
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
          <div className="wb-sub" style={{ marginBottom: 8 }}>可点击胶囊(wb-chip + useState,选中由类名驱动)</div>
          <div className="wb-row">
            {['全部', '进行中', '已完成'].map((t, i) => <ChipExample key={t} label={t} defaultOn={i === 0} />)}
          </div>
        </div>

        <div className="wb-sec"><span className="wb-sec-no">02</span><span className="wb-sec-title">按钮、状态与提示(悬停、选中、禁用都有明确反馈)</span></div>
        <div className="wb-card">
          <div className="wb-row" style={{ marginBottom: 14 }}>
            <button className="wb-btn primary">开始分析</button>
            <button className="wb-btn ghost">查看详情</button>
            <button className="wb-btn primary" disabled>暂不可用</button>
          </div>
          <div className="wb-row" style={{ marginBottom: 14, gap: 18 }}>
            {(['ok', 'info', 'warn', 'err', 'idle'] as const).map(s => (
              <span key={s} className="wb-row" style={{ gap: 6 }}>
                <span className={`wb-dot ${s}`} />
                <span className="wb-sub">{{ ok: '已完成', info: '进行中', warn: '待确认', err: '失败', idle: '空闲' }[s]}</span>
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

function ChipExample({ label, defaultOn }: { label: string; defaultOn: boolean }): ReactNode {
  const [on, setOn] = useState(defaultOn)
  return (
    <button className={'wb-chip' + (on ? ' on' : '')} onClick={() => setOn(!on)}>{label}</button>
  )
}
