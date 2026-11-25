/**
 * 设计变体运行时包:每套设计语言的机器形态(与 design/ 目录的 DESIGN-*.md 契约一一对应)。
 *
 * 结构:css 以 html[data-wb-variant="<id>"] 为作用域——切换 = 在 <html> 上设置
 * data 属性,纯 CSS 即时生效,零构建;localStorage 记住选择(DesignSwitcher)。
 *
 * 纪律:加一套设计 = 加一份 design/DESIGN-<名>.md(契约)+ 在这里加一个运行时包(机器),
 * 两者同源配对;变量名跨设计保持稳定,变的只有值与少量结构覆盖。
 */
export interface DesignVariant {
  id: string
  label: string
  /** 覆盖规则;空串 = 基线本身(默认设计的落地即 THEME_CSS) */
  css: string
}

export const VARIANTS: DesignVariant[] = [
  {
    id: 'wb',
    label: '工作台中性(默认)',
    css: '',
  },
  {
    id: 'terminal',
    label: '开发者暗色终端',
    css: `
html[data-wb-variant="terminal"] .wb-page {
  --wb-bg: #0d1117;
  --wb-card: #161b22;
  --wb-card-2: #21262d;
  --wb-row-hover: var(--wb-card-2);
  --wb-line: #30363d;
  --wb-ink: #e6edf3;
  --wb-ink2: #8b949e;
  --wb-ink3: #6e7681;
  --wb-accent: #3fb950;
  --wb-ok: #3fb950;
  --wb-warn: #d29922;
  --wb-err: #f85149;
  --wb-focus-ring: 0 0 0 4px rgba(63, 185, 80, .25);
  --wb-radius-card: 8px;
  --wb-radius-btn: 8px;
  --wb-font-num: ui-monospace, 'SF Mono', Menlo, monospace;
  --wb-sec-color: #3fb950;
  --wb-sec-font: ui-monospace, 'SF Mono', Menlo, monospace;
}
html[data-wb-variant="terminal"] .wb-sec-no { font-size: 14px; letter-spacing: 0; }
html[data-wb-variant="terminal"] .wb-num,
html[data-wb-variant="terminal"] .wb-kpi .v { font-family: var(--wb-font-num); letter-spacing: 0; }
`,
  },
  {
    id: 'paper',
    label: '纸感编辑器',
    css: `
html[data-wb-variant="paper"] .wb-page {
  --wb-bg: #faf7f2;
  --wb-card: #fffdf8;
  --wb-card-2: #f3efe4;
  --wb-row-hover: var(--wb-card-2);
  --wb-line: #e8e2d6;
  --wb-ink: #2b2b26;
  --wb-ink2: #6b6a5f;
  --wb-ink3: #a09e8f;
  --wb-accent: #8a6d3b;
  --wb-ok: #00845d;
  --wb-warn: #b6770a;
  --wb-err: #a13c3c;
  --wb-focus-ring: 0 0 0 4px rgba(138, 109, 59, .18);
  --wb-radius-card: 0px;
  --wb-radius-btn: 2px;
  --wb-font-num: Georgia, 'Times New Roman', serif;
  --wb-sec-color: #8a6d3b;
  --wb-sec-font: Georgia, 'Times New Roman', serif;
}
html[data-wb-variant="paper"] .wb-card { border: none; background: transparent; padding: 12px 0; }
html[data-wb-variant="paper"] .wb-page { line-height: 1.9; }
html[data-wb-variant="paper"] .wb-sec { margin: 2.4em 0 1em; }
html[data-wb-variant="paper"] .wb-btn { font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif; }
html[data-wb-variant="paper"] .wb-sec-no { font-size: 13px; }
`,
  },
  {
    id: 'drafito',
    label: '商店绿',
    css: `
html[data-wb-variant="drafito"] .wb-page {
  --wb-bg: #ffffff;
  --wb-card: #ffffff;
  --wb-card-2: #f0f3f1;
  --wb-row-hover: var(--wb-card-2);
  --wb-line: #e6eae7;
  --wb-ink: #1d2824;
  --wb-ink2: #59645e;
  --wb-ink3: #717b75;
  --wb-accent: #008d63;
  --wb-ok: #00845d;
  --wb-warn: #b6770a;
  --wb-err: #dc2626;
  --wb-focus-ring: 0 0 0 4px rgba(0, 141, 99, .15);
  --wb-radius-card: 19.2px;
  --wb-radius-btn: 9999px;
  --wb-font-num: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif;
  --wb-sec-color: #cbd4ce;
  --wb-sec-font: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif;
}
html[data-wb-variant="drafito"] .wb-sec-no { font-size: 26px; font-weight: 500; }
html[data-wb-variant="drafito"] .wb-btn.primary { box-shadow: 0 2px 8px -3px rgba(0, 141, 99, .4); }
`,
  },
]

export const VARIANT_IDS = VARIANTS.map(v => v.id)
export const variantById = (id: string): DesignVariant | undefined => VARIANTS.find(v => v.id === id)
