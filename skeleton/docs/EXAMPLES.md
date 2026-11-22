# EXAMPLES — 示例区使用与边界说明

> 示例区(src/examples/)展示的是 **dsh 工作台的页面范式与样式规范**。
> 内容均为虚构数据——**抄范式,不抄剧情**;业务内容是你自己的事,但结构不要偏离 dsh 规范。

## 学习动线(AI 开发照此走)

1. 先读下面这张「红线映射表」——这是不偏离 dsh 的底线;
2. 按意图查示例页:打开「示例·工作台」面板看到真实渲染效果,再对照源码;
3. 抄的是范式(结构/状态处理/样式用法),写进 `src/pages/` 你的业务页;
4. 完整的真实工作台参考:样板项目 dsh-workbench-sample(单店经营面板 = 全部范式组装后的样子)。

## 红线映射表(每条红线都有示例页演示正确做法)

| 红线(dsh 合规要求) | 演示它的示例 | 说明 |
|---|---|---|
| 页面根容器必须是 `.wb-page`(样式作用域根) | 全部 7 页 | 缺失则外壳按钮默认样式漏入(坑 #14) |
| 可选参数省略 `required` 字段,禁止 `required: false` | FormPage 的提交注释 | 坑 #1:写了直接 JsonSchemaError 注册被拒 |
| 数据走同源前缀路由(`/wb-api/*`),零 CORS、零 sidecar 端口 | api.ts + FormPage 注释 | Host 半区 webServer prefix(借鉴 dsh-media-desk) |
| 图标用官方图形 vendored 快照(WbIcon 按 glyph 引用 sprite);先到图标规范页搜索,没有贴合图形才自绘(放 src/icons.tsx 并注明) | IconsPage + theme.ts 的 mountIconSprite | 素材 vendored 于 src/design/icons-data.ts(官方 MIT);禁 import Harness Client 包(practices.md);currentColor 自动适配主题 |
| effect 必须可清理(样式/表/sprite) | theme.ts / ExampleWorkbench 的 ctx.effect | 卸载残留会造成幽灵样式与重复 id |
| SVG 内不放文字(会被 viewBox 放大) | OverviewPage / ChartPage 的 HTML 覆盖层 | 坑 #2 |
| 页面四态(加载/空/错/无权限)必须备齐 | StatesPage | 用户判断「页面是不是坏了」全靠这些态 |
| 主代码禁止 import 示例区 | guard.mjs 机器强制 | 示例可整体删除,主代码零残留 |
| 客户端打包零业务依赖(react 之外全走 external) | build.mjs 的 external 表 | 官方包运行时由平台提供 |

## 示例页索引(按意图查)

| 你要做的东西 | 看哪页 | 抄哪些范式 |
|---|---|---|
| 门面/仪表盘页 | `OverviewPage.tsx` | KPI 卡网格、SVG 折线、信号列表、语义徽章 |
| 带筛选的表格页 | `ListPage.tsx` | 受控筛选、表格悬停、状态映射、分页、空结果态 |
| 记录详情页 | `DetailPage.tsx` | 页头 chips、键值对、占比条、页签分区 |
| 图表分析页 | `ChartPage.tsx` | 折线+柱状零依赖画法、图例、周期切换 |
| 表单/设置页 | `FormPage.tsx` | 表单结构、校验前置、提交中禁用、成功/失败反馈 |
| 数据加载状态 | `StatesPage.tsx` | 骨架屏、空态给动作、错误带重试、无权限说明 |
| 找图标/查样式 | `IconsPage.tsx` | 官方图形浏览器(106×2 权重)、标签胶囊、按钮三态 |
| 会话联动(右侧栏 tab + 投影) | `SessionLinkageTab.tsx` + `service/session-stats.mjs` | 两阶段注册 / guide 必给(红线 #10)/ useProjection 读成品值 / fork 守卫 / 探针工具 wb_session_stats |
| 区域地图页 | `MapPage.tsx` | Web Mercator 投影、SVG 区域着色、HTML 覆盖层标签(坑 #2)、点击联动 |
| AI 流式输出页 | `StreamAiPage.tsx` | POST SSE 解析 data: 帧、逐字渲染+光标、AbortController 中止、显式降级 |

## Host 侧配套(/ai-stream)

StreamAiPage 依赖 `index.js` 的 `POST /ai-stream` 路由与 `service/ai.mjs`(流式内核,业务化时改提示词)。
这两个是 **Host 业务能力**,删除示例后依然保留可用;不需要 AI 能力时一并移除即可。

## 示例面板的显示与隐藏

示例区源码常驻 `src/examples/`(供 AI 阅读),但默认**不注册**进侧栏(业务侧栏只放你的面板)。
要看渲染效果:把 `src/client.tsx` 的 `SHOW_EXAMPLES` 改为 `true`;学完即可改回或彻底删除(见下)。

## 整体删除示例(两行 + 一个目录)

1. 删 `src/examples/` 目录;
2. 删 `src/client.tsx` 里的两行:`import { attachExamples } from './examples'` 与 `attachExamples(ctx)`;
3. `npm run build && npm run guard` 应全绿——有任何报错说明主代码耦合了示例(这正是 guard 的职责)。

`src/theme.ts` 是共享资产,**不随示例删除**——它是你的设计系统起点。

---

素材来源: DeepSeek Harness · MIT · Copyright © 2026 DeepSeek
