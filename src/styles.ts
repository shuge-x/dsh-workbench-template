/**
 * BI 界面样式(单文件注入,类名前缀 tll-)。
 * 色板取自参考截图:暖米底、深松绿、赭金衬线数字。
 */
export const BI_CSS = String.raw`
.tll-page {
  --tll-bg: #f3f1ea;
  --tll-card: #fcfbf7;
  --tll-card2: #f6f4ec;
  --tll-line: #e6e2d5;
  --tll-line2: #d9d4c3;
  --tll-ink: #22301f;
  --tll-ink2: #6f7a6b;
  --tll-ink3: #a0a698;
  --tll-green: #1e3a2a;
  --tll-green-2: #2a4734;
  --tll-gold: #b3854d;
  --tll-gold-2: #c9a36a;
  --tll-down: #c05e21;
  --tll-up: #2e7d4f;
  --tll-serif: Georgia, 'Noto Serif SC', 'Songti SC', 'SimSun', serif;
  height: 100%;
  overflow-y: auto;
  background: var(--tll-bg);
  color: var(--tll-ink);
  font-size: 13px;
  line-height: 1.55;
}
.tll-page * { box-sizing: border-box; }
:where(.tll-page) button { font: inherit; color: inherit; background: none; border: none; cursor: pointer; padding: 0; }
.tll-page a { color: inherit; text-decoration: none; cursor: pointer; }

/* ===== 门店页头 ===== */
.tll-topbar { display: flex; align-items: center; gap: 14px; padding: 16px 28px 8px; }
.tll-backbtn { width: 34px; height: 34px; border-radius: 50%; background: #ebe8dd; border: 1px solid var(--tll-line2); display: flex; align-items: center; justify-content: center; color: var(--tll-ink2); flex: none; }
.tll-store-main { min-width: 0; }
.tll-store-row1 { display: flex; align-items: center; gap: 10px; }
.tll-store-name { font-size: 19px; font-weight: 650; letter-spacing: .2px; white-space: nowrap; }
.tll-chip-status { font-size: 11px; color: var(--tll-up); border: 1px solid #bcd3c2; background: #eef4ee; border-radius: 5px; padding: 1px 7px; white-space: nowrap; }
.tll-toplink { font-size: 12px; color: var(--tll-ink2); display: inline-flex; align-items: center; gap: 4px; white-space: nowrap; }
.tll-toplink:hover { color: var(--tll-ink); }
.tll-store-row2 { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--tll-ink2); margin-top: 3px; }
.tll-store-row2 .sep { color: var(--tll-ink3); }
.tll-topactions { margin-left: auto; display: flex; align-items: center; gap: 10px; }
.tll-btn-ghost { display: inline-flex; align-items: center; gap: 7px; padding: 8px 15px; border-radius: 10px; background: #f0ede2; border: 1px solid var(--tll-line2); font-size: 13px; font-weight: 500; }
.tll-btn-ghost:hover { background: #eae6d8; }
.tll-iconbtn { width: 32px; height: 32px; border-radius: 9px; display: inline-flex; align-items: center; justify-content: center; color: var(--tll-ink2); border: 1px solid transparent; }
.tll-iconbtn:hover, .tll-iconbtn.on { background: #eceade; color: var(--tll-ink); }
.tll-gobtn { width: 36px; height: 36px; border-radius: 50%; background: var(--tll-green); color: #f2efe4; display: flex; align-items: center; justify-content: center; }

/* ===== 主页签(数据诊断 / AI解读) ===== */
.tll-maintabs { display: flex; align-items: center; gap: 24px; padding: 6px 28px 0; border-bottom: 1px solid var(--tll-line); }
.tll-maintab { display: inline-flex; align-items: center; gap: 7px; padding: 10px 2px 12px; font-size: 14.5px; color: var(--tll-ink2); border-bottom: 2px solid transparent; margin-bottom: -1px; }
.tll-maintab.on { color: var(--tll-ink); font-weight: 650; border-bottom-color: var(--tll-ink); }
.tll-period { margin-left: auto; display: flex; align-items: center; gap: 10px; font-size: 12px; color: var(--tll-ink2); padding-bottom: 10px; }
.tll-select { display: inline-flex; align-items: center; gap: 8px; background: #f6f4ea; border: 1px solid var(--tll-line2); border-radius: 9px; padding: 6px 12px; font-size: 12.5px; color: var(--tll-ink); }

/* ===== 子页签 ===== */
.tll-subtabs { display: flex; align-items: center; gap: 6px; padding: 14px 28px 4px; }
.tll-subtab { padding: 8px 18px; border-radius: 10px; font-size: 14px; color: var(--tll-ink2); }
.tll-subtab:hover { color: var(--tll-ink); background: #eceadb; }
.tll-subtab.on { background: var(--tll-green); color: #f4f1e6; font-weight: 550; }
.tll-subtabs .right { margin-left: auto; display: flex; align-items: center; gap: 10px; }

/* ===== 通用卡片 / 区块标题 ===== */
.tll-body { padding: 4px 28px 48px; }
.tll-card { background: var(--tll-card); border: 1px solid var(--tll-line); border-radius: 14px; }
.tll-crumbrow { padding: 24px 2px 0; }
.tll-crumb { font-size: 12px; color: var(--tll-ink3); display: flex; gap: 8px; align-items: center; }
.tll-titlerow { display: flex; align-items: center; gap: 16px; margin-top: 6px; padding-bottom: 16px; border-bottom: 1px solid var(--tll-line); }
.tll-title { font-size: 27px; font-weight: 700; letter-spacing: .3px; }
.tll-bignum { margin-left: auto; font-family: var(--tll-serif); font-size: 46px; line-height: 1; color: var(--tll-gold-2); font-weight: 500; }
.tll-ai-btn { display: inline-flex; align-items: center; gap: 8px; background: var(--tll-green); color: #f2efe2; font-size: 13px; font-weight: 550; border-radius: 10px; padding: 10px 16px; }
.tll-ai-btn:hover { background: var(--tll-green-2); }
.tll-sec { display: flex; align-items: baseline; gap: 10px; margin: 28px 2px 14px; padding-bottom: 10px; border-bottom: 1px solid var(--tll-line); }
.tll-sec-no { font-family: var(--tll-serif); font-style: italic; font-size: 19px; color: var(--tll-gold); }
.tll-sec-title { font-size: 16.5px; font-weight: 650; }

/* ===== 经营总览:hero + 指标网格 ===== */
.tll-hero-wrap { display: grid; grid-template-columns: 440px 1fr; background: var(--tll-card); border: 1px solid var(--tll-line); border-radius: 16px; overflow: hidden; }
.tll-hero { position: relative; background: radial-gradient(130% 110% at 100% 115%, #2c4c37 0%, #22402e 42%, #1b3526 100%); color: #f3f0e4; padding: 22px 24px 20px; display: flex; flex-direction: column; overflow: hidden; }
.tll-hero .cap { font-size: 12px; color: rgba(243, 240, 228, .62); display: flex; gap: 8px; }
.tll-hero .cap .lit { opacity: .55; }
.tll-hero .label { margin-top: 26px; font-size: 13px; color: rgba(243, 240, 228, .8); display: flex; justify-content: space-between; align-items: center; }
.tll-hero .value { font-size: 36px; font-weight: 700; letter-spacing: .4px; margin-top: 6px; }
.tll-hero .foot { margin-top: auto; display: flex; align-items: flex-end; justify-content: space-between; padding-top: 22px; }
.tll-hero .delta { font-size: 12.5px; color: var(--tll-gold-2); }
.tll-hero .delta .base { color: rgba(243, 240, 228, .55); margin-left: 7px; font-size: 11.5px; }
.tll-hero .ring { position: absolute; right: -46px; bottom: -60px; width: 200px; height: 200px; border-radius: 50%; border: 1px solid rgba(201, 163, 106, .28); box-shadow: 0 0 0 26px rgba(201, 163, 106, .06) inset; }
.tll-hero .ring.r2 { right: 20px; bottom: -110px; width: 160px; height: 160px; border-color: rgba(201, 163, 106, .18); }
.tll-metrics { display: grid; grid-template-columns: repeat(6, 1fr); }
.tll-metric { grid-column: span 2; position: relative; padding: 17px 20px 15px; border-left: 1px solid var(--tll-line); border-top: 1px solid var(--tll-line); display: flex; flex-direction: column; min-height: 118px; }
.tll-metrics .tll-metric:nth-child(-n+3) { border-top: none; }
.tll-metric .lb { font-size: 12px; color: var(--tll-ink2); display: flex; justify-content: space-between; align-items: center; }
.tll-metric .lb .go { color: var(--tll-ink3); }
.tll-metric .val { font-size: 27px; font-weight: 700; margin-top: 8px; letter-spacing: .2px; }
.tll-metric .val .unit { font-size: 12px; font-weight: 400; color: var(--tll-ink2); margin-left: 5px; }
.tll-metric .foot { margin-top: auto; display: flex; align-items: flex-end; gap: 8px; }
.tll-delta { font-size: 11.5px; font-weight: 550; display: inline-flex; align-items: center; gap: 3px; }
.tll-delta.down { color: var(--tll-down); }
.tll-delta.up { color: var(--tll-up); }
.tll-metric .base { font-size: 10.5px; color: var(--tll-ink3); }
.tll-spark { position: absolute; right: 16px; bottom: 16px; opacity: .9; }

/* ===== 概况横条 ===== */
.tll-band { display: flex; align-items: center; gap: 40px; background: var(--tll-card); border: 1px solid var(--tll-line); border-radius: 14px; padding: 15px 24px; margin-top: 16px; }
.tll-band .head { display: flex; align-items: center; gap: 12px; min-width: 168px; }
.tll-band .head .ico { width: 38px; height: 38px; border-radius: 50%; background: var(--tll-card2); border: 1px solid var(--tll-line2); color: var(--tll-green); display: flex; align-items: center; justify-content: center; }
.tll-band .head .t { font-size: 14px; font-weight: 650; }
.tll-band .head .p { font-size: 11.5px; color: var(--tll-ink3); margin-top: 1px; }
.tll-band .item .lb { font-size: 11.5px; color: var(--tll-ink2); }
.tll-band .item .v { font-size: 21px; font-weight: 700; margin-top: 2px; letter-spacing: .2px; }
.tll-band .go { margin-left: auto; font-size: 12.5px; color: var(--tll-ink2); display: inline-flex; align-items: center; gap: 6px; }
.tll-band .go:hover { color: var(--tll-ink); }

/* ===== 趋势与信号 ===== */
.tll-2col { display: grid; grid-template-columns: minmax(0, 1fr) 400px; gap: 16px; margin-top: 4px; }
.tll-panel { padding: 20px 22px; }
.tll-panel .phead { display: flex; align-items: flex-start; gap: 10px; }
.tll-panel .pt { font-size: 15.5px; font-weight: 650; }
.tll-panel .pc { font-size: 12px; color: var(--tll-ink2); margin-top: 3px; }
.tll-panel .pright { margin-left: auto; display: flex; align-items: center; gap: 12px; }
.tll-legend { display: flex; align-items: center; gap: 16px; font-size: 11.5px; color: var(--tll-ink2); margin: 14px 0 4px; }
.tll-legend .dot { width: 14px; height: 3px; border-radius: 2px; display: inline-block; margin-right: 6px; vertical-align: middle; }
.tll-sig-item { display: flex; gap: 12px; padding: 14px 0; border-top: 1px solid var(--tll-line); }
.tll-sig-item:first-of-type { border-top: none; }
.tll-sig-no { font-family: var(--tll-serif); font-style: italic; font-size: 15px; color: var(--tll-gold); flex: none; padding-top: 1px; }
.tll-sig-hl { font-size: 13.5px; font-weight: 650; line-height: 1.5; }
.tll-sig-dt { font-size: 12.5px; color: var(--tll-ink2); margin-top: 6px; line-height: 1.6; }

/* ===== 销售表现:日历热力 ===== */
.tll-cal-legend { display: flex; align-items: center; gap: 18px; padding: 2px 2px 14px; font-size: 12px; color: var(--tll-ink2); }
.tll-cal-legend .sw { width: 12px; height: 12px; border-radius: 3.5px; display: inline-block; margin-right: 7px; vertical-align: -1.5px; }
.tll-cal { display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px 12px; }
.tll-cal-h { font-size: 12.5px; color: var(--tll-ink2); text-align: center; padding: 8px 0; }
.tll-cal-h.we { background: #f2edda; border: 1px solid #ddd2a8; border-radius: 9px; color: #7c6f42; font-weight: 550; }
.tll-cell { position: relative; border-radius: 11px; padding: 10px 12px 9px; min-height: 118px; display: flex; flex-direction: column; }
.tll-cell.below { background: #ece4d1; }
.tll-cell.above { background: #dde4d6; }
.tll-cell.weekend { background: #ccd7c9; box-shadow: inset 0 3px 0 #83977f; }
.tll-cell .d { font-family: var(--tll-serif); font-size: 16px; color: #3c4a3c; display: flex; justify-content: space-between; }
.tll-cell .we { font-size: 10.5px; color: #63745f; }
.tll-cell .amt { font-size: 16.5px; font-weight: 700; color: #21372a; margin-top: 12px; letter-spacing: .2px; }
.tll-cell .row { display: flex; justify-content: space-between; align-items: baseline; margin-top: 5px; font-size: 11px; }
.tll-cell .row .cmp { color: #71806c; font-size: 10.5px; }
.tll-cell .orders { margin-top: auto; font-size: 11px; color: #55654f; }
.tll-cell .tag { position: absolute; left: 10px; bottom: 24px; font-size: 10.5px; background: rgba(252, 251, 247, .92); border: 1px solid rgba(34, 48, 31, .14); border-radius: 5px; padding: 1px 7px; color: #3c4a3c; }
.tll-cell.empty { visibility: hidden; }

/* ===== 盈利能力 ===== */
.tll-headline3 { display: grid; grid-template-columns: repeat(3, 1fr); background: var(--tll-card); border: 1px solid var(--tll-line); border-radius: 14px; overflow: hidden; }
.tll-headline3 .cell { padding: 20px 26px 22px; border-left: 1px solid var(--tll-line); position: relative; }
.tll-headline3 .cell:first-child { border-left: none; }
.tll-headline3 .lb { font-size: 12.5px; color: var(--tll-ink2); display: flex; justify-content: space-between; }
.tll-headline3 .lb .go { color: var(--tll-ink3); }
.tll-headline3 .v { font-family: var(--tll-serif); font-size: 30px; font-weight: 600; margin-top: 12px; letter-spacing: .3px; }
.tll-income-card { padding: 24px 26px; }
.tll-inc-row { display: flex; justify-content: space-between; align-items: flex-end; padding: 14px 0; }
.tll-inc-row .lb { font-size: 13.5px; color: var(--tll-ink); }
.tll-inc-row .lb .sub { display: block; font-size: 11.5px; color: var(--tll-ink3); margin-top: 3px; }
.tll-inc-row .v { font-size: 23px; font-weight: 650; }
.tll-inc-row.big .v { font-size: 34px; font-weight: 700; }
.tll-inc-div { border-top: 1px solid var(--tll-line); margin: 2px 0; }
.tll-inc-note { font-size: 11.5px; color: var(--tll-ink3); padding: 10px 0 2px; }
.tll-final { margin-top: 14px; background: radial-gradient(120% 140% at 100% 120%, #2c4c37 0%, #22402e 45%, #1b3526 100%); color: #f3f0e4; border-radius: 12px; padding: 18px 22px; display: flex; justify-content: space-between; align-items: center; }
.tll-final .lb { font-size: 13px; }
.tll-final .v { font-size: 26px; font-weight: 700; }
.tll-cost-row { display: grid; grid-template-columns: 150px 1fr 96px; align-items: center; gap: 14px; padding: 13px 0; }
.tll-cost-row .lb { font-size: 12.5px; color: var(--tll-ink2); }
.tll-cost-row .track { height: 9px; border-radius: 999px; background: #eae7da; overflow: hidden; }
.tll-cost-row .fill { height: 100%; border-radius: 999px; background: #5d7a63; }
.tll-cost-row .fill.gold { background: linear-gradient(90deg, #c9a36a, #b3854d); }
.tll-cost-row .v { font-size: 13px; font-weight: 600; text-align: right; font-variant-numeric: tabular-nums; }

/* ===== 成本核验 ===== */
.tll-status-band { display: flex; align-items: stretch; background: var(--tll-card2); border: 1px solid var(--tll-line); border-radius: 14px; overflow: hidden; margin-bottom: 18px; }
.tll-status-band .name { flex: none; width: 190px; display: flex; align-items: center; padding: 0 22px; font-size: 15px; font-weight: 650; background: #efecdf; border-right: 1px solid var(--tll-line); }
.tll-status-cell { flex: 1; display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 16px 26px; border-left: 1px solid var(--tll-line); }
.tll-status-cell .lb { font-size: 12.5px; color: var(--tll-ink2); }
.tll-status-cell .n { font-family: var(--tll-serif); font-size: 30px; font-weight: 600; }
.tll-status-cell.on { background: var(--tll-green); }
.tll-status-cell.on .lb { color: rgba(243, 240, 228, .72); }
.tll-status-cell.on .n { color: #f3f0e4; }
.tll-table-tools { display: flex; align-items: center; gap: 12px; padding: 2px 2px 16px; }
.tll-search { display: flex; align-items: center; gap: 8px; background: #fff; border: 1px solid var(--tll-line2); border-radius: 10px; padding: 8px 12px; width: 240px; color: var(--tll-ink3); }
.tll-search input { border: none; outline: none; background: none; font: inherit; color: var(--tll-ink); width: 100%; }
.tll-pill-btn { display: inline-flex; align-items: center; gap: 8px; border: 1px solid var(--tll-line2); background: #fff; border-radius: 10px; padding: 8px 14px; font-size: 12.5px; color: var(--tll-ink); }
.tll-pill-btn:hover { background: var(--tll-card2); }
.tll-cols-link { margin-left: auto; font-size: 12.5px; color: var(--tll-ink2); display: inline-flex; gap: 6px; align-items: center; }
.tll-table { width: 100%; border-collapse: collapse; }
.tll-table th { font-size: 12px; font-weight: 550; color: var(--tll-ink2); text-align: left; padding: 10px 14px; border-bottom: 1px solid var(--tll-line2); white-space: nowrap; }
.tll-table th .sort { display: inline-flex; flex-direction: column; margin-left: 5px; vertical-align: middle; color: var(--tll-ink3); }
.tll-table td { padding: 14px; border-bottom: 1px solid var(--tll-line); font-size: 13px; white-space: nowrap; }
.tll-table tr:hover td { background: #f8f6ee; }
.tll-table .plink { display: inline-flex; align-items: center; gap: 6px; color: var(--tll-ink); font-weight: 500; }
.tll-table .plink .go { color: var(--tll-ink3); }
.tll-table .num { font-variant-numeric: tabular-nums; }

/* ===== 占位页 ===== */
.tll-empty { min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; color: var(--tll-ink2); }
.tll-empty .orb { width: 74px; height: 74px; border-radius: 50%; background: radial-gradient(120% 120% at 30% 20%, #2c4c37, #1b3526); display: flex; align-items: center; justify-content: center; color: var(--tll-gold-2); }
.tll-empty .t { font-size: 16px; font-weight: 650; color: var(--tll-ink); }
.tll-empty .c { font-size: 12.5px; }
.tll-note-card { margin-top: 16px; background: #f2edda; border: 1px solid #ddd2a8; border-radius: 12px; padding: 14px 18px; font-size: 12.5px; color: #6d5f33; line-height: 1.7; }

/* ===== 经营地图 ===== */
.tll-map-page { display: flex; flex-direction: column; overflow: hidden; }
.tll-map-toolbar { display: flex; align-items: center; gap: 10px; padding: 10px 28px 12px; flex-wrap: nowrap; }
.tll-map-metrictabs { display: flex; align-items: center; gap: 18px; margin-right: 6px; }
.tll-map-metric { font-size: 14px; color: var(--tll-ink2); padding: 6px 2px 8px; border-bottom: 2px solid transparent; }
.tll-map-metric.on { color: var(--tll-ink); font-weight: 650; border-bottom-color: var(--tll-ink); }
.tll-map-statband { display: flex; align-items: center; gap: 34px; padding: 12px 28px; background: var(--tll-card); border-top: 1px solid var(--tll-line); border-bottom: 1px solid var(--tll-line); }
.tll-map-statband .item { display: flex; align-items: baseline; gap: 10px; white-space: nowrap; }
.tll-map-statband .lb { font-size: 12px; color: var(--tll-ink2); }
.tll-map-statband .v { font-size: 17px; font-weight: 700; }
.tll-map-statband .right { margin-left: auto; display: flex; align-items: center; gap: 16px; white-space: nowrap; }
.tll-map-statband .warn { font-size: 12px; color: var(--tll-down); }
.tll-map-statband .go { font-size: 12.5px; color: var(--tll-ink2); display: inline-flex; align-items: center; gap: 4px; }
.tll-map-statband .go:hover { color: var(--tll-ink); }
.tll-map-grid { flex: 1; min-height: 520px; display: grid; grid-template-columns: minmax(0, 1fr) 470px; gap: 16px; padding: 16px 28px 20px; }
.tll-map-card { display: flex; flex-direction: column; overflow: hidden; }
.tll-map-cardhead { display: flex; align-items: center; gap: 10px; padding: 14px 18px 12px; }
.tll-map-canvas { position: relative; flex: 1; min-height: 0; background: #d9e0e5; overflow: hidden; }
.tll-map-canvas svg { width: 100%; height: 100%; display: block; cursor: grab; touch-action: none; }
.tll-map-canvas svg:active { cursor: grabbing; }
.tll-map-prov { cursor: pointer; }
.tll-map-prov:hover { filter: brightness(0.95); }
.tll-map-zoom { position: absolute; top: 14px; right: 14px; display: flex; flex-direction: column; gap: 6px; }
.tll-map-zoom button { width: 34px; height: 34px; border-radius: 9px; background: #fcfbf7; border: 1px solid var(--tll-line2); font-size: 19px; line-height: 1; color: var(--tll-ink); box-shadow: 0 1px 3px rgba(34,48,31,.1); }
.tll-map-zoom button:hover { background: #fff; }
.tll-map-scale { position: absolute; left: 16px; bottom: 14px; display: flex; flex-direction: column; gap: 3px; align-items: flex-start; }
.tll-map-scale .km { font-size: 11px; color: #4c584c; background: rgba(252,251,247,.85); border-radius: 4px; padding: 0 6px; }
.tll-map-scale .bar { display: block; width: 120px; height: 5px; border-top: 2px solid #4c584c; border-left: 2px solid #4c584c; border-right: 2px solid #4c584c; }
.tll-map-legend { position: absolute; left: 50%; transform: translateX(-50%); bottom: 14px; display: flex; align-items: center; gap: 18px; background: rgba(252,251,247,.95); border: 1px solid var(--tll-line); border-radius: 10px; padding: 8px 16px; font-size: 12px; color: var(--tll-ink2); box-shadow: 0 2px 8px rgba(34,48,31,.08); white-space: nowrap; }
.tll-map-dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 6px; vertical-align: -1px; }
.tll-map-nlabel { position: absolute; transform: translate(-50%, -50%); font-size: 11px; color: #9aa39b; pointer-events: none; white-space: nowrap; text-shadow: 0 1px 2px rgba(252,251,247,.8); }
.tll-map-plabel { position: absolute; transform: translate(-50%, -50%); font-size: 11.5px; color: #2c3a2e; background: rgba(252,251,247,.94); border: 1px solid rgba(34,48,31,.18); border-radius: 5px; padding: 1px 7px; pointer-events: none; white-space: nowrap; box-shadow: 0 1px 3px rgba(34,48,31,.08); }
.tll-map-hint { position: absolute; left: 50%; transform: translateX(-50%); bottom: -3px; font-size: 11px; color: #77836f; white-space: nowrap; }
.tll-map-attribution { position: absolute; left: 16px; bottom: 46px; font-size: 10.5px; color: #6b766b; background: rgba(252,251,247,.85); border-radius: 4px; padding: 1px 7px; }
.tll-rank-card { display: flex; flex-direction: column; overflow: hidden; }
.tll-rank-tabs { display: flex; align-items: center; gap: 20px; padding: 0 18px; border-bottom: 1px solid var(--tll-line); }
.tll-rank-tab { font-size: 13.5px; color: var(--tll-ink2); padding: 6px 2px 9px; border-bottom: 2px solid transparent; margin-bottom: -1px; }
.tll-rank-tab.on { color: var(--tll-ink); font-weight: 650; border-bottom-color: var(--tll-ink); }
.tll-rank-head { display: grid; grid-template-columns: minmax(0, 1fr) 110px 84px; gap: 10px; padding: 10px 18px 8px; font-size: 12px; color: var(--tll-ink2); }
.tll-rank-head span:nth-child(2), .tll-rank-head span:nth-child(3) { text-align: right; }
.tll-rank-rows { flex: 1; overflow-y: auto; min-height: 0; }
.tll-rank-row { display: grid; grid-template-columns: 30px minmax(0, 1fr) 110px 84px; gap: 10px; align-items: center; width: 100%; text-align: left; padding: 12px 18px; border-bottom: 1px solid var(--tll-line); background: none; }
.tll-rank-row:hover { background: #f7f5ec; }
.tll-rank-row.sel { background: #eef0e4; box-shadow: inset 3px 0 0 var(--tll-green); }
.tll-rank-row .ico { width: 30px; height: 30px; border-radius: 8px; background: var(--tll-card2); border: 1px solid var(--tll-line); color: var(--tll-ink2); display: flex; align-items: center; justify-content: center; }
.tll-rank-row .nm { min-width: 0; }
.tll-rank-row .nm b { display: block; font-size: 13.5px; font-weight: 650; }
.tll-rank-row .nm i { display: block; font-style: normal; font-size: 11px; color: var(--tll-ink3); margin-top: 1px; }
.tll-rank-row .amt { text-align: right; font-weight: 650; font-size: 13.5px; font-variant-numeric: tabular-nums; }
.tll-rank-row .yoy { text-align: right; font-size: 12.5px; font-weight: 600; font-variant-numeric: tabular-nums; }
.tll-rank-row .yoy.down { color: var(--tll-down); }
.tll-rank-row .yoy.up { color: var(--tll-up); }
.tll-rank-foot { display: flex; align-items: center; gap: 12px; padding: 10px 18px; border-top: 1px solid var(--tll-line); font-size: 12px; color: var(--tll-ink2); }
.tll-rank-foot .note { margin-left: auto; font-size: 11px; color: var(--tll-ink3); }

/* ===== 轻提示 ===== */
.tll-toast { position: fixed; left: 50%; transform: translateX(-50%); bottom: 40px; z-index: 60; background: rgba(30, 58, 42, .95); color: #f2efe2; font-size: 12.5px; border-radius: 10px; padding: 10px 18px; box-shadow: 0 8px 28px rgba(20,30,20,.3); }

/* ===== 数据查询 ===== */
.tll-q-page { --tll-accent: #256b46; }
.tll-q-tabs { display: flex; align-items: center; gap: 22px; padding: 12px 28px 0; border-bottom: 1px solid var(--tll-line); }
.tll-q-tab { font-size: 14px; color: var(--tll-ink2); padding: 8px 2px 11px; border-bottom: 2.5px solid transparent; margin-bottom: -1px; }
.tll-q-tab.on { color: var(--tll-accent); font-weight: 650; border-bottom-color: var(--tll-accent); }
.tll-q-tabs .right { margin-left: auto; display: flex; align-items: center; gap: 10px; padding-bottom: 8px; }
.tll-q-records { position: absolute; right: 0; top: 38px; background: #fff; border: 1px solid var(--tll-line2); border-radius: 10px; box-shadow: 0 8px 24px rgba(34,48,31,.12); padding: 6px; width: 300px; z-index: 30; }
.tll-q-record { display: block; width: 100%; text-align: left; font-size: 12.5px; color: var(--tll-ink); padding: 8px 10px; border-radius: 7px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tll-q-record:hover { background: var(--tll-card2); }
.tll-q-builder { margin: 16px 28px 0; padding: 14px 18px 6px; }
.tll-q-row1 { display: flex; align-items: center; gap: 12px; padding-bottom: 12px; }
.tll-q-saved-toggle { display: inline-flex; align-items: center; gap: 5px; font-size: 13px; color: var(--tll-ink2); }
.tll-q-saved-toggle:hover { color: var(--tll-ink); }
.tll-q-row1-right { margin-left: auto; display: flex; align-items: center; gap: 10px; }
.tll-q-row1-right .lb { font-size: 12.5px; color: var(--tll-ink2); }
.tll-q-go { display: inline-flex; align-items: center; gap: 7px; background: var(--tll-accent); color: #f2f6f0; font-size: 13.5px; font-weight: 600; border-radius: 10px; padding: 9px 20px; }
.tll-q-go:hover { filter: brightness(1.06); }
.tll-q-saved { display: flex; flex-wrap: wrap; gap: 8px; padding: 0 0 12px 22px; }
.tll-q-saved-item { font-size: 12.5px; color: var(--tll-accent); background: #eef4ee; border: 1px solid #cfe0d2; border-radius: 8px; padding: 5px 12px; }
.tll-q-saved-item:hover { background: #e4efe4; }
.tll-q-row { display: flex; align-items: flex-start; gap: 14px; padding: 7px 0; }
.tll-q-row .lb { flex: none; width: 62px; font-size: 12.5px; color: var(--tll-ink2); padding-top: 7px; }
.tll-q-row .chips { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.tll-q-chip { display: inline-flex; align-items: center; gap: 7px; background: #fff; border: 1px solid var(--tll-line2); border-radius: 8px; padding: 6px 8px 6px 12px; font-size: 12.5px; font-weight: 550; }
.tll-q-chip-x { color: var(--tll-ink3); display: inline-flex; padding: 2px; border-radius: 4px; }
.tll-q-chip-x:hover { color: var(--tll-down); background: var(--tll-card2); }
.tll-q-add { border: 1px dashed var(--tll-line2); border-radius: 8px; padding: 6px 13px; font-size: 12.5px; color: var(--tll-accent); background: none; }
.tll-q-add:hover { background: #eef4ee; border-color: #b9d2bd; }
.tll-q-result { margin: 16px 28px 0; padding: 14px 18px 18px; min-height: 420px; }
.tll-q-result-head { display: flex; align-items: center; padding-bottom: 10px; }
.tll-q-result-head .t { font-size: 15px; font-weight: 650; }
.tll-q-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 70px 0 60px; }
.tll-q-empty .tbl { display: grid; grid-template-columns: 46px 26px 34px; gap: 4px; margin-bottom: 10px; opacity: .8; }
.tll-q-empty .tbl span { height: 8px; border-radius: 2px; background: #e8e5da; }
.tll-q-empty .t { font-size: 19px; font-weight: 700; color: var(--tll-ink); }
.tll-q-empty .c { font-size: 12.5px; color: var(--tll-ink2); }
.tll-q-table-wrap { overflow: auto; max-height: 480px; border: 1px solid var(--tll-line); border-radius: 10px; }
.tll-q-table-wrap .tll-table th { background: var(--tll-card2); position: sticky; top: 0; z-index: 1; }
.tll-q-table-wrap .tll-table td { padding: 11px 14px; font-variant-numeric: tabular-nums; }
/* 分组方式弹窗 */
.tll-q-mask { position: fixed; inset: 0; z-index: 40; background: rgba(38, 46, 38, .08); display: flex; align-items: flex-start; justify-content: center; }
.tll-q-modal { margin-top: 15vh; width: 660px; max-width: calc(100vw - 48px); background: #fff; border-radius: 14px; box-shadow: 0 18px 60px rgba(20, 30, 20, .22); padding: 0 0 8px; }
.tll-q-modal-head { display: flex; align-items: center; padding: 16px 18px 10px; }
.tll-q-modal-head .t { font-size: 16.5px; font-weight: 700; }
.tll-q-modal-head .x { margin-left: auto; color: var(--tll-ink3); padding: 4px; border-radius: 6px; display: inline-flex; }
.tll-q-modal-head .x:hover { color: var(--tll-ink); background: var(--tll-card2); }
.tll-q-modal-sub { display: flex; align-items: baseline; gap: 10px; padding: 2px 18px 12px; }
.tll-q-modal-sub .t { font-size: 14.5px; font-weight: 650; }
.tll-q-modal-sub .c { font-size: 12px; color: var(--tll-ink3); }
.tll-q-seetotal { margin-left: auto; font-size: 12.5px; font-weight: 600; color: var(--tll-accent); background: #fff; border: 1px solid #b9d2bd; border-radius: 8px; padding: 6px 15px; }
.tll-q-seetotal.on, .tll-q-seetotal:hover { background: #eef4ee; }
.tll-q-cats { display: flex; gap: 4px; background: var(--tll-card2); border-radius: 10px; padding: 4px; margin: 0 18px; }
.tll-q-cat { position: relative; flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 7px; font-size: 13px; color: var(--tll-ink2); padding: 9px 4px; border-radius: 8px; }
.tll-q-cat:hover { color: var(--tll-ink); }
.tll-q-cat.on { background: #fff; color: var(--tll-accent); font-weight: 650; box-shadow: 0 1px 4px rgba(34,48,31,.1); }
.tll-q-cat .dot { position: absolute; top: 7px; right: 9px; width: 5px; height: 5px; border-radius: 50%; background: var(--tll-accent); }
.tll-q-opts { display: flex; flex-wrap: wrap; gap: 12px; padding: 16px 18px 6px; }
.tll-q-opt { flex: 1 1 170px; border: 1px solid var(--tll-line2); background: #fff; border-radius: 10px; padding: 13px 10px; font-size: 13.5px; color: var(--tll-ink); }
.tll-q-opt:hover { border-color: #b9d2bd; background: #f6faf6; }
.tll-q-opt.on { border-color: var(--tll-accent); background: #eef4ee; color: var(--tll-accent); font-weight: 600; }
.tll-q-chosen { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; padding: 12px 18px 2px; }
.tll-q-chosen .lb { font-size: 13px; font-weight: 650; margin-right: 4px; }
.tll-q-chosen-chip { display: inline-flex; align-items: center; gap: 7px; background: #eef4ee; border: 1px solid #cfe0d2; border-radius: 7px; padding: 5px 8px 5px 10px; font-size: 12.5px; color: var(--tll-accent); }
.tll-q-chosen-chip b { font-weight: 650; margin-right: 2px; }
.tll-q-chosen-chip button { display: inline-flex; color: var(--tll-accent); opacity: .65; padding: 1px; border-radius: 3px; }
.tll-q-chosen-chip button:hover { opacity: 1; }
.tll-q-chosen .none { font-size: 12px; color: var(--tll-ink3); }
.tll-q-modal-note { padding: 4px 18px 0; font-size: 12px; color: var(--tll-ink3); }
.tll-q-modal-foot { display: flex; align-items: center; margin-top: 14px; padding: 12px 18px; border-top: 1px solid var(--tll-line); }
.tll-q-modal-foot .note { font-size: 12px; color: var(--tll-ink3); }
.tll-q-done { margin-left: auto; background: var(--tll-accent); color: #f2f6f0; font-size: 13.5px; font-weight: 600; border-radius: 9px; padding: 9px 22px; }
.tll-q-done:hover { filter: brightness(1.06); }
`
