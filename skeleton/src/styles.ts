/** 工作台骨架样式(wb- 前缀;改名时全局替换 wb- → 你的前缀)。 */
export const CSS = String.raw`
.wb-page {
  --wb-bg: #f3f1ea;
  --wb-card: #fcfbf7;
  --wb-line: #e6e2d5;
  --wb-ink: #22301f;
  --wb-ink2: #6f7a6b;
  --wb-accent: #4f6ef0;
  height: 100%;
  overflow-y: auto;
  background: var(--wb-bg);
  color: var(--wb-ink);
  font-size: 13px;
  line-height: 1.55;
}
.wb-page * { box-sizing: border-box; }
:where(.wb-page) button { font: inherit; color: inherit; background: none; border: none; cursor: pointer; padding: 0; }
.wb-topbar { display: flex; align-items: center; gap: 14px; padding: 18px 28px 10px; }
.wb-title { font-size: 19px; font-weight: 650; }
.wb-body { padding: 8px 28px 40px; }
.wb-card { background: var(--wb-card); border: 1px solid var(--wb-line); border-radius: 14px; padding: 18px 20px; }
.wb-card .t { font-size: 15.5px; font-weight: 650; margin-bottom: 10px; }
.wb-table { width: 100%; border-collapse: collapse; }
.wb-table th { text-align: left; font-size: 12px; color: var(--wb-ink2); padding: 8px 12px; border-bottom: 1px solid var(--wb-line); }
.wb-table td { padding: 10px 12px; border-bottom: 1px solid var(--wb-line); font-variant-numeric: tabular-nums; }
.wb-empty { padding: 60px 0; text-align: center; color: var(--wb-ink2); }
`
