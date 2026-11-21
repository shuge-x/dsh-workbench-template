window.__ModuleLoader__.load({ id: "dsh-workbench-template", factory: (require) => {
var module = { exports: {} }; var exports = module.exports;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client.tsx
var client_exports = {};
__export(client_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(client_exports);

// src/styles.ts
var BI_CSS = String.raw`
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
`;

// src/brand.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function BrandMark({ size }) {
  const s = size ?? 26;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "span",
    {
      style: {
        width: s,
        height: s,
        borderRadius: s * 0.3,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #4f6ef0 0%, #3a53c8 100%)",
        color: "#fff",
        fontWeight: 800,
        fontSize: s * 0.5,
        fontFamily: "'PingFang SC', sans-serif",
        flex: "none",
        boxShadow: "0 1px 3px rgba(58,83,200,.35)",
        lineHeight: 1
      },
      children: "W"
    }
  );
}
function BrandName() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { display: "inline-flex", alignItems: "baseline", gap: 3, whiteSpace: "nowrap", fontWeight: 700, fontSize: 15.5, letterSpacing: 0.3 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: "#4f6ef0" }, children: "dsh" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: "currentColor" }, children: "\u5DE5\u4F5C\u53F0\u6A21\u677F" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: "9", height: "9", viewBox: "0 0 10 10", style: { position: "relative", top: -6 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5 0l1.1 3.1L9 5 6.1 6.4 5 9.5 3.9 6.4 1 5l2.9-1.9z", fill: "#4f6ef0" }) })
  ] });
}

// src/pages/ScaffoldPage.tsx
var import_react = require("react");

// src/api.ts
var BASE = "/wbt-api";
async function post(path, body) {
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
var postScaffold = (payload) => post("/scaffold", payload);

// src/icons.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
function svg(path, size = 16, color = "currentColor", style) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: color,
      strokeWidth: "1.7",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      style,
      children: path
    }
  );
}
var IconCopy = (p) => svg(/* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("rect", { x: "9", y: "9", width: "11", height: "11", rx: "1.5" }),
  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M5 15V5a1.5 1.5 0 011.5-1.5H15" })
] }), p.size, "currentColor", p.style);
var IconFolderPlus = (p) => svg(/* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M3.5 6.5A1.5 1.5 0 015 5h4.2l1.8 2H19a1.5 1.5 0 011.5 1.5v9A1.5 1.5 0 0119 19H5a1.5 1.5 0 01-1.5-1.5z" }),
  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M12 10.5v5" }),
  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M9.5 13h5" })
] }), p.size, "currentColor", p.style);

// src/pages/ScaffoldPage.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
function ScaffoldPage() {
  const [target, setTarget] = (0, import_react.useState)("");
  const [id, setId] = (0, import_react.useState)("");
  const [name, setName] = (0, import_react.useState)("");
  const [idEdited, setIdEdited] = (0, import_react.useState)(false);
  const [busy, setBusy] = (0, import_react.useState)(false);
  const [result, setResult] = (0, import_react.useState)(null);
  const sanitize = (v) => v.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
  const onTargetChange = (v) => {
    setTarget(v);
    if (!idEdited) {
      const base = sanitize(v.split("/").filter(Boolean).pop() ?? "");
      setId(base);
      setName(base === "" ? "" : base.startsWith("dsh-") ? base : "dsh-" + base);
    }
  };
  const onIdChange = (v) => {
    setId(v);
    setIdEdited(true);
    if (name === "" || name === (id.startsWith("dsh-") ? id : "dsh-" + id)) {
      setName(v === "" ? "" : sanitize(v).startsWith("dsh-") ? sanitize(v) : "dsh-" + sanitize(v));
    }
  };
  const submit = () => {
    if (busy || target.trim() === "") return;
    setBusy(true);
    setResult(null);
    void postScaffold({ target: target.trim(), name: name.trim() || "dsh-myworkbench", id: id.trim() || "myworkbench" }).then((res) => {
      setResult(res ?? { error: "\u6570\u636E\u670D\u52A1\u4E0D\u53EF\u8FBE" });
    }).finally(() => {
      setBusy(false);
    });
  };
  const err = result?.error;
  const ok = result?.ok === true;
  const [uninstallPath, setUninstallPath] = (0, import_react.useState)("");
  const [scanBusy, setScanBusy] = (0, import_react.useState)(false);
  const [found, setFound] = (0, import_react.useState)(null);
  const [selected, setSelected] = (0, import_react.useState)([]);
  const [uninstallBusy, setUninstallBusy] = (0, import_react.useState)(false);
  const [uninstallOutcomes, setUninstallOutcomes] = (0, import_react.useState)(null);
  const scan = () => {
    if (scanBusy || uninstallPath.trim() === "") return;
    setScanBusy(true);
    setFound(null);
    setUninstallOutcomes(null);
    void (async () => {
      try {
        const res = await fetch(`${BASE}/uninstall-scan`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ path: uninstallPath.trim() })
        });
        if (!res.ok) {
          setFound([]);
          return;
        }
        const data = await res.json();
        setFound(Array.isArray(data) ? data : []);
      } catch {
        setFound([]);
      } finally {
        setScanBusy(false);
      }
    })();
  };
  const uninstallSelected = () => {
    if (uninstallBusy || selected.length === 0) return;
    setUninstallBusy(true);
    setUninstallOutcomes(null);
    void (async () => {
      try {
        const res = await fetch(`${BASE}/uninstall`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ path: uninstallPath.trim(), profiles: selected })
        });
        if (res.status === 404) {
          setUninstallOutcomes([{ profile: "\u2014", key: "\u2014", ok: false, error: "\u5F53\u524D\u8FD0\u884C\u7684\u5B9E\u4F8B\u662F\u65E7\u7248\u672C,\u7F3A\u5C11\u5378\u8F7D\u63A5\u53E3\u2014\u2014\u91CD\u542F\u5B9E\u4F8B\u540E\u91CD\u8BD5" }]);
          return;
        }
        if (!res.ok) {
          setUninstallOutcomes([{ profile: "\u2014", key: "\u2014", ok: false, error: `HTTP ${res.status}` }]);
          return;
        }
        setUninstallOutcomes(await res.json());
        setFound(null);
      } catch {
        setUninstallOutcomes([{ profile: "\u2014", key: "\u2014", ok: false, error: "\u6570\u636E\u670D\u52A1\u4E0D\u53EF\u8FBE(\u5B9E\u4F8B\u672A\u542F\u52A8\u6216\u7F51\u7EDC\u5F02\u5E38)" }]);
      } finally {
        setUninstallBusy(false);
      }
    })();
  };
  const firstPrompt = ok && result !== null ? [
    `\u8FD9\u662F\u4E00\u4E2A\u521A\u751F\u6210\u7684 dsh \u5DE5\u4F5C\u53F0\u63D2\u4EF6\u9879\u76EE(\u8DEF\u5F84 ${result.target},\u5305\u540D ${result.name},\u63D2\u4EF6 id ${result.id})\u3002`,
    "\u8BF7\u5148\u6309\u987A\u5E8F\u9605\u8BFB\u5E76\u9075\u5B88:",
    "1. AGENTS.md \u2014\u2014 \u9879\u76EE\u8EAB\u4EFD\u3001\u7EA2\u7EBF\u3001\u5F00\u53D1\u5DE5\u4F5C\u6D41",
    "2. docs/EXAMPLES.md \u2014\u2014 \u8303\u5F0F\u7D22\u5F15\u4E0E\u7EA2\u7EBF\u6620\u5C04\u8868",
    "3. src/examples/ \u2014\u2014 9 \u4E2A\u793A\u4F8B\u9875\u6E90\u7801(\u6E32\u67D3\u6548\u679C:\u628A src/client.tsx \u7684 SHOW_EXAMPLES \u7F6E true)",
    "",
    "\u7136\u540E\u5B9E\u73B0\u6211\u7684\u9700\u6C42:\u3010\u5728\u8FD9\u91CC\u5199\u4E0B\u4F60\u7684\u4E1A\u52A1\u9700\u6C42\u3011",
    "\u7EA6\u675F:\u9875\u9762\u8303\u5F0F\u7167 examples \u6284,\u4E0D\u6539 examples/ \u4E0E theme.ts;\u4E3B\u4EE3\u7801\u4E0D import \u793A\u4F8B\u533A;",
    "\u6BCF\u4E2A\u65B0\u9875\u9762\u6CE8\u518C\u8FDB src/client.tsx \u7684 PANELS \u5E76\u5E26 .wb-page \u6839\u5BB9\u5668;",
    "\u6BCF\u6B21\u6539\u5B8C\u8DD1 npm run guard && npm run build,\u5168\u7EFF\u624D\u7B97\u5B8C\u6210\u3002"
  ].join("\n") : "";
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "tll-page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "tll-topbar", style: { paddingBottom: 0 }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "tll-store-main", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "tll-store-row1", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "tll-store-name", children: "\u65B0\u5EFA\u5DE5\u4F5C\u53F0" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "tll-store-row2", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: "\u8F93\u5165\u76EE\u6807\u8DEF\u5F84,\u4ECE\u5185\u7F6E\u9AA8\u67B6\u751F\u6210\u4E00\u4E2A\u53EF\u8FD0\u884C\u7684 dsh \u63D2\u4EF6\u9879\u76EE(\u542B\u6570\u636E\u670D\u52A1\u4E0E\u793A\u4F8B\u9875\u9762)" }) })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "tll-body", style: { maxWidth: 860 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "tll-card", style: { padding: "20px 22px" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "120px 1fr", gap: "14px 14px", alignItems: "center" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { fontSize: 12.5, color: "var(--tll-ink2)" }, children: "\u76EE\u6807\u8DEF\u5F84 *" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "input",
            {
              className: "tll-search",
              style: { width: "100%" },
              placeholder: "/Volumes/NVME980/shuge-pai/my-new-workbench(\u76EE\u5F55\u5FC5\u987B\u4E0D\u5B58\u5728)",
              value: target,
              onChange: (e) => {
                onTargetChange(e.target.value);
              }
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { fontSize: 12.5, color: "var(--tll-ink2)" }, children: "\u63D2\u4EF6 id" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "input",
            {
              className: "tll-search",
              style: { width: "100%" },
              placeholder: "\u53D6\u81EA\u76EE\u5F55\u540D,\u5982 ai-toolbox(\u53EF\u6539)",
              value: id,
              onChange: (e) => {
                onIdChange(e.target.value);
              }
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { fontSize: 12.5, color: "var(--tll-ink2)" }, children: "\u5305\u540D" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "input",
            {
              className: "tll-search",
              style: { width: "100%" },
              placeholder: "dsh-myworkbench",
              value: name,
              onChange: (e) => {
                setName(e.target.value);
              }
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { marginTop: 18, display: "flex", alignItems: "center", gap: 12 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: "tll-ai-btn", onClick: submit, style: { opacity: busy || target.trim() === "" ? 0.55 : 1 }, children: busy ? "\u751F\u6210\u4E2D\u2026" : "\u751F\u6210\u9879\u76EE" }),
          err !== void 0 && err !== null && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { style: { color: "var(--tll-down)", fontSize: 12.5 }, children: [
            "\u2717 ",
            err
          ] })
        ] })
      ] }),
      ok && result !== null && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "tll-card", style: { padding: "20px 22px", marginTop: 16 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { fontSize: 15.5, fontWeight: 650, marginBottom: 6 }, children: [
          "\u2713 \u5DF2\u751F\u6210 ",
          String(result.files?.length ?? 0),
          " \u4E2A\u6587\u4EF6"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { fontSize: 12.5, color: "var(--tll-ink2)", marginBottom: 12 }, children: [
          "\u5305\u540D ",
          result.name,
          " \xB7 \u63D2\u4EF6 id ",
          result.id,
          " \xB7 \u7AEF\u53E3 ",
          result.port
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { marginTop: 16, paddingTop: 14, borderTop: "1px dashed var(--tll-line)" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { fontSize: 13.5, fontWeight: 650, marginBottom: 8 }, children: "\u4E3B\u8DEF\u5F84:\u4EA4\u7ED9 AI \u5F00\u53D1" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { fontSize: 12.5, color: "var(--tll-ink2)", lineHeight: 1.9, marginBottom: 10 }, children: [
            "\u2460 \u7528 ClaudeCode / Codex / OpenCode \u6253\u5F00\u9879\u76EE\u76EE\u5F55",
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("br", {}),
            "\u2461 \u7C98\u8D34\u4E0B\u65B9\u300C\u9996\u6B21\u4F1A\u8BDD\u63D0\u793A\u8BCD\u300D\u2014\u2014\u6784\u5EFA\u3001\u95E8\u7981\u3001\u5F00\u53D1\u8FED\u4EE3\u5168\u90E8\u7531 AI \u6309 AGENTS.md \u6267\u884C,\u4F60\u4E0D\u9700\u8981\u624B\u52A8\u6572\u547D\u4EE4",
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("br", {}),
            "\u2462 \u60F3\u5728\u6D4F\u89C8\u5668\u91CC\u770B\u6548\u679C:\u76F4\u63A5\u8BA9 AI \u8FD0\u884C ",
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("code", { children: "./start.sh" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { fontSize: 13.5, fontWeight: 650 }, children: "\u9996\u6B21\u4F1A\u8BDD\u63D0\u793A\u8BCD" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { fontSize: 12, color: "var(--tll-ink2)" }, children: "\u52A0\u8F7D\u76EE\u5F55\u540E\u7C98\u8D34\u7ED9 AI(\u66FF\u6362\u6700\u540E\u4E00\u884C\u7684\u4E1A\u52A1\u9700\u6C42)" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
              "button",
              {
                className: "tll-pill-btn",
                style: { marginLeft: "auto" },
                onClick: () => {
                  void navigator.clipboard?.writeText(firstPrompt).catch(() => {
                  });
                },
                children: "\u590D\u5236\u63D0\u793A\u8BCD"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("pre", { style: {
            background: "var(--tll-card2)",
            border: "1px solid var(--tll-line)",
            borderRadius: 10,
            padding: "12px 14px",
            fontSize: 12,
            lineHeight: 1.7,
            overflow: "auto",
            margin: 0,
            whiteSpace: "pre-wrap"
          }, children: firstPrompt })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { marginTop: 16, paddingTop: 14, borderTop: "1px dashed var(--tll-line)" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { fontSize: 13.5, fontWeight: 650 }, children: "\u53EF\u9009:\u81EA\u5DF1\u5728 dsh \u91CC\u9884\u89C8\u8FD0\u884C" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { fontSize: 12, color: "var(--tll-ink2)" }, children: "\u4E00\u6761\u547D\u4EE4,\u81EA\u52A8\u5B8C\u6210 \u6784\u5EFA/\u521D\u59CB\u5316/\u767B\u8BB0/\u542F\u52A8;\u542F\u52A8\u540E\u7EC8\u7AEF\u88AB\u5360\u7528\u5C5E\u6B63\u5E38,\u4E5F\u53EF\u8BA9 AI \u4EE3\u8DD1" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
              "button",
              {
                className: "tll-pill-btn",
                style: { marginLeft: "auto" },
                onClick: () => {
                  void navigator.clipboard?.writeText(`cd ${result.target ?? ""} && ./start.sh`).catch(() => {
                  });
                },
                children: "\u590D\u5236"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("pre", { style: {
            background: "var(--tll-card2)",
            border: "1px solid var(--tll-line)",
            borderRadius: 10,
            padding: "12px 14px",
            fontSize: 12,
            lineHeight: 1.7,
            margin: 0
          }, children: `cd ${result.target ?? ""} && ./start.sh` })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "tll-card", style: { padding: "16px 20px", marginTop: 16 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { fontSize: 13.5, fontWeight: 650, marginBottom: 4 }, children: "\u5378\u8F7D\u5DF2\u751F\u6210\u7684\u9879\u76EE" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { fontSize: 12, color: "var(--tll-ink3)", marginBottom: 10 }, children: "\u8F93\u5165\u751F\u6210\u9879\u76EE\u7684\u8DEF\u5F84,\u626B\u63CF\u5B83\u5728\u6240\u6709 profile \u91CC\u7684\u767B\u8BB0(\u542B\u9879\u76EE\u6539\u540D/\u79FB\u52A8\u7559\u4E0B\u7684\u5931\u6548\u767B\u8BB0),\u6309\u9700\u79FB\u9664\u3002 \u53EA\u52A8\u767B\u8BB0,\u4E0D\u5220\u76EE\u5F55\u2014\u2014\u4F60\u7684\u4EE3\u7801\u4E0E\u6570\u636E\u4FDD\u7559\u3002" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "120px 1fr auto", gap: 12, alignItems: "center" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { fontSize: 12.5, color: "var(--tll-ink2)" }, children: "\u9879\u76EE\u8DEF\u5F84" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "input",
            {
              className: "tll-search",
              style: { width: "100%" },
              placeholder: "/Volumes/NVME980/shuge-harness/dsh-writer-desk",
              value: uninstallPath,
              onChange: (e) => {
                setUninstallPath(e.target.value);
                setFound(null);
                setUninstallOutcomes(null);
              }
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: "tll-ai-btn", style: { opacity: scanBusy || uninstallPath.trim() === "" ? 0.55 : 1 }, onClick: scan, children: scanBusy ? "\u626B\u63CF\u4E2D\u2026" : "\u626B\u63CF" })
        ] }),
        found !== null && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { marginTop: 12 }, children: found.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { fontSize: 12.5, color: "var(--tll-ink2)" }, children: "\u6240\u6709 profile \u91CC\u90FD\u6CA1\u6709\u8BE5\u8DEF\u5F84\u7684\u767B\u8BB0\u2014\u2014\u65E0\u9700\u5378\u8F7D\u3002" }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { fontSize: 12.5, color: "var(--tll-ink2)", marginBottom: 6 }, children: [
            "\u627E\u5230 ",
            found.length,
            " \u6761\u767B\u8BB0:"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }, children: found.map((r) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { style: { display: "flex", alignItems: "center", gap: 8, fontSize: 12.5 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
              "input",
              {
                type: "checkbox",
                checked: selected.includes(r.profile),
                onChange: (e) => {
                  setSelected((s) => e.target.checked ? [...s, r.profile] : s.filter((x) => x !== r.profile));
                }
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("b", { children: r.profile }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { style: { color: "var(--tll-ink2)" }, children: [
              r.key,
              r.linkTarget ? ` \u2192 ${r.linkTarget}` : ""
            ] }),
            r.stale && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "tll-pill", style: { color: "var(--tll-down)", background: "rgba(192,57,43,.1)" }, children: "\u5931\u6548(\u76EE\u5F55\u5DF2\u4E0D\u5B58\u5728)" })
          ] }, r.profile)) }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: "tll-ai-btn", style: { opacity: uninstallBusy || selected.length === 0 ? 0.55 : 1 }, onClick: uninstallSelected, children: uninstallBusy ? "\u5378\u8F7D\u4E2D\u2026" : `\u5378\u8F7D\u9009\u4E2D\u7684 ${selected.length} \u6761` })
        ] }) }),
        uninstallOutcomes !== null && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { marginTop: 12, fontSize: 12.5, lineHeight: 1.9 }, children: uninstallOutcomes.map((o) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { marginBottom: 8 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { style: { color: o.ok ? "var(--tll-up)" : "var(--tll-down)", fontWeight: 600 }, children: [
            o.ok ? "\u2713" : "\u2717",
            " ",
            o.profile
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { style: { color: "var(--tll-ink2)" }, children: [
            " \u2014 ",
            o.error ?? (o.hints ?? []).join(" ")
          ] })
        ] }, o.profile)) })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { display: "none" }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(IconCopy, { size: 12 }) }),
    "      ",
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { display: "none" }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(IconCopy, { size: 12 }) })
  ] });
}

// src/client.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
var inject = ["slots"];
var PANELS = [
  { id: "wt-scaffold", title: "\u65B0\u5EFA\u5DE5\u4F5C\u53F0", order: -20, Icon: IconFolderPlus, page: ScaffoldPage }
];
function apply(ctx) {
  ctx.effect(() => {
    const style = document.createElement("style");
    style.dataset.wtPlugin = "dsh-workbench-template";
    style.textContent = BI_CSS;
    document.head.append(style);
    return () => {
      style.remove();
    };
  }, "workbench-template: styles");
  ctx.slots.inject("sidebar.brand.mark", () => ctx.slots.register({ name: "sidebar.brand.mark" }, BrandMark));
  ctx.slots.inject("sidebar.brand.name", () => ctx.slots.register({ name: "sidebar.brand.name" }, BrandName));
  for (const p of PANELS) {
    const PanelIcon = p.Icon;
    ctx.slots.inject("main", () => ctx.slots.register({ name: "main", key: p.id }, p.page));
    ctx.slots.inject("sidebar.panellist", () => ctx.slots.register(
      { name: "sidebar.panellist", id: p.id, order: p.order, label: p.title },
      (props) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(PanelIcon, { size: props.size ?? 16 })
    ));
  }
}
return module.exports; } });
