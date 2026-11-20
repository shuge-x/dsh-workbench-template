/**
 * 示例区专属样式(wbex- 前缀,随示例面板注入)。
 * 只放示例自己用的东西;跨页面公共词汇在 src/theme.ts(用户拥有,示例不得回灌)。
 */
export const EXAMPLES_CSS = String.raw`
.wbex-banner {
  font-size: 12px; color: var(--wb-ink2);
  background: var(--wb-card); border-bottom: 1px solid var(--wb-line);
  padding: 9px 28px;
}
.wbex-icon-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(88px, 1fr)); gap: 6px; }
.wbex-icon-cell {
  display: flex; flex-direction: column; align-items: center; gap: 7px;
  padding: 13px 4px 10px; border-radius: 10px; color: var(--wb-ink);
  border: 1px solid transparent;
}
.wbex-icon-cell svg { color: var(--wb-ink); }
.wbex-icon-cell span { font-size: 11px; color: var(--wb-ink2); }
.wbex-icon-cell:hover { background: var(--wb-bg); border-color: var(--wb-line); }
.wbex-file-row { display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 10px; }
.wbex-file-cell { display: flex; flex-direction: column; align-items: center; padding: 12px 4px; border-radius: 10px; }
.wbex-file-cell:hover { background: var(--wb-bg); }
.wbex-map-layout { display: grid; grid-template-columns: 1fr 260px; gap: 14px; align-items: start; }
.wbex-map-label {
  position: absolute; transform: translate(-50%, -50%);
  display: flex; flex-direction: column; align-items: center; gap: 1px;
  font-size: 11px; color: var(--wb-ink); pointer-events: none;
}
.wbex-map-label b { font-weight: 650; }
.wbex-map-label .wb-num { font-size: 10.5px; color: var(--wb-ink2); }
`
