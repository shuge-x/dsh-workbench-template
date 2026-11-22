/**
 * 设计系统(共享资产,用户拥有):tokens + 基础组件类 + 官方图标 sprite 挂载。
 *
 * 分工约定(见 docs/EXAMPLES.md):
 *  - 本文件只放「跨页面复用的词汇」——页面级布局样式写在各页面自己的文件里
 *  - 图标用官方图形库的 vendored 快照(src/design/icons-data.ts,MIT)——官方明令插件
 *    不得 require/load Harness Client 包(practices.md),故素材进包、不进依赖;
 *    sprite 由 mountIconSprite 统一挂载,符号前缀 wb-icon- 防与宿主撞 id
 *  - 客户端样式改动零散无效时,先检查是不是忘了根容器 wb-page(坑 #14)
 *
 * 改名点:CSS 前缀 wb- → 你的前缀(含 sprite 前缀 wb-icon-)。
 */
import { ICON_GLYPHS } from './design/icons-data'
import type { DshClientContext } from './shim'

export const THEME_CSS = String.raw`
.wb-page {
  --wb-bg: #f3f1ea;
  --wb-card: #fcfbf7;
  --wb-line: #e6e2d5;
  --wb-ink: #22301f;
  --wb-ink2: #6f7a6b;
  --wb-ink3: #9aa294;
  --wb-accent: #4f6ef0;
  --wb-ok: #2e7d4f;
  --wb-warn: #b7791f;
  --wb-err: #c0392b;
  --wb-idle: #9aa294;
  height: 100%;
  overflow-y: auto;
  background: var(--wb-bg);
  color: var(--wb-ink);
  font-size: 13px;
  line-height: 1.55;
}
.wb-page * { box-sizing: border-box; }
.wb-page :where(button) { font: inherit; color: inherit; background: none; border: none; cursor: pointer; padding: 0; }
.wb-page :where(a) { color: inherit; text-decoration: none; }

/* ---- 页面骨架 ---- */
.wb-topbar { display: flex; align-items: center; gap: 14px; padding: 18px 28px 10px; }
.wb-title { font-size: 19px; font-weight: 650; }
.wb-sub { font-size: 12px; color: var(--wb-ink2); }
.wb-body { padding: 8px 28px 40px; }
.wb-row { display: flex; align-items: center; gap: 10px; }
.wb-note { font-size: 12px; color: var(--wb-ink2); background: var(--wb-card); border: 1px dashed var(--wb-line); border-radius: 10px; padding: 8px 14px; margin: 4px 0 14px; }

/* ---- 区块标题:衬线序号 + 标题 ---- */
.wb-sec { display: flex; align-items: baseline; gap: 10px; margin: 22px 0 12px; }
.wb-sec-no { font-family: Georgia, 'Times New Roman', serif; font-size: 17px; color: var(--wb-warn); }
.wb-sec-title { font-size: 15px; font-weight: 650; }

/* ---- 卡片与网格 ---- */
.wb-card { background: var(--wb-card); border: 1px solid var(--wb-line); border-radius: 14px; padding: 16px 18px; }
.wb-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.wb-grid3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.wb-grid4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }

/* ---- KPI:大数字 + 环比 ---- */
.wb-kpi .l { font-size: 12px; color: var(--wb-ink2); }
.wb-kpi .v { font-family: Georgia, 'Times New Roman', serif; font-size: 24px; font-weight: 600; margin: 4px 0 2px; }
.wb-num { font-family: Georgia, 'Times New Roman', serif; font-variant-numeric: tabular-nums; }
.wb-up { color: var(--wb-ok); font-size: 12px; }
.wb-down { color: var(--wb-err); font-size: 12px; }

/* ---- 标签与胶囊 ---- */
.wb-chip { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; border: 1px solid var(--wb-line); border-radius: 999px; padding: 2px 10px; color: var(--wb-ink2); background: var(--wb-card); }
.wb-chip.on { border-color: var(--wb-ink); color: var(--wb-ink); font-weight: 550; }
.wb-pill { display: inline-flex; align-items: center; font-size: 11.5px; border-radius: 999px; padding: 2px 9px; }
.wb-pill.ok { color: var(--wb-ok); background: rgba(46,125,79,.12); }
.wb-pill.warn { color: var(--wb-warn); background: rgba(183,121,31,.13); }
.wb-pill.err { color: var(--wb-err); background: rgba(192,57,43,.12); }
.wb-pill.info { color: var(--wb-accent); background: rgba(79,110,240,.11); }

/* ---- 按钮:三态齐全(悬停/选中/禁用) ---- */
.wb-btn { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; border-radius: 10px; padding: 7px 16px; transition: opacity .15s ease; }
.wb-btn.primary { background: var(--wb-ink); color: var(--wb-bg); }
.wb-btn.primary:hover { opacity: .85; }
.wb-btn.ghost { border: 1px solid var(--wb-line); color: var(--wb-ink); }
.wb-btn.ghost:hover { border-color: var(--wb-ink2); }
.wb-btn:disabled { opacity: .45; cursor: not-allowed; }

/* ---- 状态点与键位 ---- */
.wb-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; }
.wb-dot.ok { background: var(--wb-ok); }
.wb-dot.warn { background: var(--wb-warn); }
.wb-dot.err { background: var(--wb-err); }
.wb-dot.info { background: var(--wb-accent); }
.wb-dot.idle { background: var(--wb-idle); }
.wb-kbd { font-size: 11px; border: 1px solid var(--wb-line); border-bottom-width: 2px; border-radius: 6px; padding: 1px 7px; color: var(--wb-ink2); background: var(--wb-card); }

/* ---- 表格 ---- */
.wb-table { width: 100%; border-collapse: collapse; }
.wb-table th { text-align: left; font-size: 12px; color: var(--wb-ink2); padding: 8px 12px; border-bottom: 1px solid var(--wb-line); }
.wb-table td { padding: 9px 12px; border-bottom: 1px solid var(--wb-line); }
.wb-table tr:hover td { background: rgba(0,0,0,.025); }

/* ---- 页签 ---- */
.wb-tabs { display: flex; gap: 4px; border-bottom: 1px solid var(--wb-line); padding: 0 28px; }
.wb-tab { padding: 9px 14px 11px; font-size: 13.5px; color: var(--wb-ink2); border-bottom: 2px solid transparent; margin-bottom: -1px; }
.wb-tab:hover { color: var(--wb-ink); }
.wb-tab.on { color: var(--wb-ink); font-weight: 600; border-bottom-color: var(--wb-ink); }

/* ---- 四态:加载/空态/错误/无权限 ---- */
.wb-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: var(--wb-ink2); padding: 46px 0; }
.wb-loading { display: flex; flex-direction: column; gap: 10px; padding: 20px 0; }
.wb-loading i { display: block; height: 13px; border-radius: 6px; background: linear-gradient(90deg, var(--wb-line) 25%, var(--wb-card) 50%, var(--wb-line) 75%); background-size: 200% 100%; animation: wb-shimmer 1.2s infinite; }
@keyframes wb-shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }
.wb-error { color: var(--wb-err); font-size: 12.5px; }

/* ---- 表单 ---- */
.wb-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
.wb-field label { font-size: 12px; color: var(--wb-ink2); }
.wb-input, .wb-select { font: inherit; color: var(--wb-ink); background: var(--wb-card); border: 1px solid var(--wb-line); border-radius: 9px; padding: 7px 12px; outline: none; }
.wb-input:focus, .wb-select:focus { border-color: var(--wb-accent); }

/* ---- 键值对 ---- */
.wb-kv { display: grid; grid-template-columns: max-content 1fr; gap: 7px 18px; font-size: 12.5px; }
.wb-kv .k { color: var(--wb-ink2); }

/* ---- 图例 ---- */
.wb-legend { display: flex; gap: 14px; font-size: 12px; color: var(--wb-ink2); }
.wb-legend i { display: inline-block; width: 14px; height: 3px; border-radius: 2px; margin-right: 5px; vertical-align: middle; }
`

/**
 * 官方图形 sprite 挂载:vendored 数据(src/design/icons-data.ts,官方 artwork 物化)解析进
 * <symbol id="wb-icon-<glyph>-<weight>">。WbIcon(src/icons.tsx)以 <use> 引用,文档里必须有
 * 符号表才渲染得出。壳不保证挂,插件自挂幂等一份(卸载时移除)。
 */
export function mountIconSprite(ctx: DshClientContext): void {
  ctx.effect(() => {
    if (document.querySelector('[data-wb-icon-sprite]')) return
    const NS = 'http://www.w3.org/2000/svg'
    const svg = document.createElementNS(NS, 'svg')
    svg.setAttribute('data-wb-icon-sprite', '')
    svg.setAttribute('aria-hidden', 'true')
    svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden'
    const parser = new DOMParser()
    for (const [glyph, weights] of Object.entries(ICON_GLYPHS)) {
      for (const weight of ['regular', 'medium'] as const) {
        const root = parser.parseFromString(weights[weight], 'image/svg+xml').documentElement
        const symbol = document.createElementNS(NS, 'symbol')
        symbol.id = `wb-icon-${glyph}-${weight}`
        for (const { name, value } of [...root.attributes]) {
          if (!['width', 'height', 'xmlns', 'class', 'aria-hidden'].includes(name)) symbol.setAttribute(name, value)
        }
        symbol.append(...[...root.childNodes].map(node => document.importNode(node, true)))
        svg.append(symbol)
      }
    }
    document.body.prepend(svg)
    return () => { svg.remove() }
  }, 'wb: icon sprite')
}
