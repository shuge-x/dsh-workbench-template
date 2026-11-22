# AGENTS.md — AI 开发手册

> 给任何加载本目录的 AI 开发工具(ClaudeCode / Codex / OpenCode / dsh 会话)。
> 本项目由 dsh 工作台脚手架生成:**页面范式照示例抄,业务内容是你的需求——抄范式,不抄剧情。**

## 项目身份与结构地图

这是一个 dsh web 插件(工作台),双半区。
**定位:插件固件**——机制与知识全量(design 库/门禁/请求层/数据服务/AI 手册),页面与信息架构零预置:
开工时由 AI 依据用户需求设计(哪些面板、要不要首页),照 examples 范式实现后在此注册。

```
index.js            Host 半区:webServer 前缀路由 /wb-api/*(同源数据服务)+ agent 工具(wb_*)
                    + Config(Schemastery:apply(ctx, config) 第二参消费,值经 profile cordis.yml 持久化,HMR 热重载)
                    · 配置的 UI 表单不是自动的:需注册 plugins.row.config 插槽自绘表单
                      (契约:form.getSnapshot/set/subscribe,view='summary'|'page';
                       参考实现:样板仓库主分支 main:src/pages/ConfigPage.tsx)
service/            数据层:api.mjs(查询函数)/ db.mjs(SQLite)/ seed.mjs(首启造数)
                    + session-stats.mjs(会话联动固件:projection + 探针工具 wb_session_stats)
src/client.tsx      Client 半区唯一 dsh 耦合点:PANELS 注册面板 + locale 字典注册(esbuild 单文件 bundle)
src/locales.ts      本地化命名空间(zh/en 键一致);页面经 inject face 的 t() 取词
src/theme.ts        设计系统实现:wb- tokens + 基础组件类 + 官方图标 sprite 挂载(共享资产)
design/             ★ 设计语言库:多套 DESIGN 变体(默认工作台中性 / 终端风 / 纸感),
                    换肤 = 选一份覆盖根目录 DESIGN.md + 让 AI 按其 tokens 更新 theme.ts
src/api.ts          前端请求层:同源 fetch 封装(get/post/stream)
src/pages/          ★ 你的业务页面(主代码,长期演进;首页起步页刻意空白,业务从零填充)
src/examples/       示例区:9 个范式页 + 会话联动 tab(教学代码)。源码常驻供 AI 阅读,但默认不注册进侧栏
                    ——要看渲染效果把 src/client.tsx 的 SHOW_EXAMPLES 置 true;可整体删除
docs/EXAMPLES.md    范式索引 + 红线映射表(AI 开发先读它)
docs/official/      官方规范随行:dsh-doc 技能全文(SKILL.md 入口 + references/ 17 篇 + templates/)。
                    生成时按本机 dsh 版本对齐抓取;抓不到时落骨架快照——以 VERSION.txt 标注的
                    来源与日期为准,它可能过期,机制疑问以运行中的 dsh 实际行为为最终事实
scripts/guard.mjs   门禁:红线机器检查,发布前必过
```

## 必读顺序

AI 接手本项目:① 读 `docs/official/dsh-doc/SKILL.md`(官方规范入口;references/ 17 篇按任务查——插件机制、UI 规则、工具设计、版本升级都在里面,**优先级高于本文件**:这里只是官方规则的投影与项目化)→ ② 读本文件(行为红线与默认策略)→ ③ 读 `DESIGN.md`(视觉契约与 Do/Don't)→ ④ 读 `docs/EXAMPLES.md`(范式索引)→ ⑤ 按 src/examples/ 源码抄范式。写 UI 前必读 DESIGN.md 的 Do/Don't。

**规范源分层**:在 dsh 会话内开发时,以会话原生的 dsh-doc skill(随宿主版本,最新)为最优先;
`docs/official/` 随行快照服务**外部**工具(ClaudeCode/Codex 等),可能滞后于你的会话——
两边说法不一致时,回到裁决程序第 1 步:核实运行中 dsh 的实际行为定夺,不猜任何一方。

## 规则层级与裁决程序

项目规则分三层;冲突时按下表定序,不靠临场感觉:

| 层 | 内容 | 地位 |
|---|---|---|
| ① 平台事实 | docs/official/ 官方规范 + 运行中 dsh 的实际行为 | 机制与禁令的最终来源,不可协商 |
| ② 项目规范 | 本文件(红线/默认策略)+ docs/EXAMPLES.md + docs/dsh-plugin-playbook.md | 与①对齐处是引用;独有发现自主维护;**有意偏离必须声明式入册**(见下) |
| ③ 执行门禁 | scripts/guard.mjs + tsc + smoke | ①② 中可静态检查的子集,防回归 |

**裁决程序**(①与②冲突时,四步走完,不许跳):

1. **核实**:读与运行版本对齐的官方规范(docs/official/,先看 VERSION.txt 是否过期)+ 必要时查运行中 dsh 的实际行为,确认现行规则原文
2. **分类**:平台强制(违反会破坏机制或伤害他人——装载失败、样式泄漏、页面崩溃、升级即断)→ **对齐官方**,改实践;风格选择(官方未禁止,仅路径不同——自有设计 tokens、命名惯例、示例组织)→ **声明式偏离**,入册即可,不必改
3. **落地**:实践修复 + 门禁化(能静态检查的进 guard),一次提交完成
4. **传播**:新坑/新规同步写进本文件与 playbook,防复发

### 偏离登记册(有意偏离官方规则或生态惯例之处;新增偏离走裁决程序第 2 步)

| 条目 | 偏离内容 | 理由 | 代价(自知) | 复查触发器 |
|---|---|---|---|---|
| wb- 设计 tokens | 不消费宿主 `--dsw-alias-*` 主题变量,自持 wb-* token 体系 | 工作台是独立风格产品面,需要跨宿主版本稳定的自有视觉契约(DESIGN.md);多套设计语言(变体)全靠自有 token 切换 | 宿主明暗主题切换时本插件页面不跟随;明暗对比由 DESIGN.md 的 token 自行承担(dsh 验证清单要求明暗双主题实测) | dsh 大版本升级、或官方 ui-plugin.md 主题规则变更时复查 |

## 红线(违反 = guard 阻断或运行时崩)

1. 每个页面组件根节点必须是 `<div className="wb-page">`——样式作用域根,缺失则外壳样式漏入(坑 #14)
2. `defineTool` 可选参数**整个省略 `required` 字段**,禁止写 `required: false`(坑 #1,注册被拒)
3. **主代码(src/pages)禁止 import src/examples**——示例必须可整体删除(guard 边界检查)
4. `src/theme.ts` 是共享资产:只用不删;要加词汇在尾部追加,不改动既有类
5. 图标用官方图形库的 vendored 快照(src/design/icons-data.ts,MIT,theme.ts 已挂 sprite)——**禁止 import `@deepseek-ai/dsh-client-*` 任何 Harness Client 包**(官方 practices.md 明令插件不得 require/load:无预警变更,组件一抛错槽位即白屏)。用法:`WbIcon`(src/icons.tsx)按 glyph 名引用;先到「示例·工作台 → 图标规范」按中文名或键名搜合适图形(106 图形 × 2 权重,键名见 icons-data.ts),确实没有才自绘,放进 src/icons.tsx 并注明用途。官方出新版后由模板仓库 `npm run vendor-icons` 重提取,项目内不手改数据文件。
6. SVG 里不放文字(会被 viewBox 放大,坑 #2)——标签用 HTML 覆盖层
7. 所有 `ctx.effect` 必须返回清理函数(样式/表/ sprite 卸载残留 = 幽灵样式)
8. `build.mjs` 的 external 表不要动:react 与 `@deepseek-ai/*` 运行时由平台提供,打包进去必崩
9. 若使用 session projection:`init` 必须接收并存下 `inheritedEventCount`,`apply` 首行必须
   `if (event.seq < state.inheritedEventCount) return state`——否则 fork 出的会话会把父会话的
   历史算成自己的,**这类错误不报错,只会让数字偏大**(官方 action-cards projection 即此形态)。
   改动折叠语义时必须 bump `stateVersion`
10. 注册右侧栏 tab 类型(`sidebarRightTabs.register`)必须给 `guide` 条目——官方 tab-registry
    明注 "Omit to stay off it":省略 `guide` = 不上 guide 页 = 注册成功但界面上打不开

## 开发工作流(加一个页面的标准路径)

1. 读 `docs/EXAMPLES.md` 红线映射表,按意图挑示例页(总览/列表/详情/图表/表单/四态/图标)
2. 新建 `src/pages/XxxPage.tsx`,范式照对应示例页抄,内容换成业务
3. 在 `src/client.tsx` 的 `PANELS` 数组注册(id + 标题 + 图标 + page)
4. 要真数据:`service/api.mjs` 加查询函数 → `index.js` 的 `routes` 加路由 → `src/api.ts` 加 fetch → 页面调用
5. 每个取数页面**四态备齐**:加载(骨架屏)/ 空态(给下一步动作)/ 错误(带重试)/ 无权限(明确提示)
6. 完成门禁:`npm run guard && npm run build` 全绿才算完成
7. 交付前验证清单(对齐官方 docs/official/dsh-doc/references/verification.md,硬项不是可选项):
   - 起实例用 `./start.sh`(自动打印带 token 的地址,不要自己猎 token);
     看日志确认无槽位注册报错、无 slot entry 崩溃
   - **明暗双主题各过一轮**:默认(wb)与暗色变体(terminal)下分别做页面 DOM 断言
     ——wb- tokens 偏离登记册已声明明暗由 DESIGN.md 自担,实测就是兑现方式
     (切换器在页面顶栏,属用户操作;AI 验证可在代码里临时 applyVariant('terminal') 后还原)
   - UX 自查一轮:按 DESIGN.md 的 Do/Don't 过空态/焦点/对比度/禁用态(官方要求 expert review 的落地形态);最终视觉验收归用户

## 默认策略(直接按默认执行,不要作为澄清问题提出)

以下决策已由项目所有者预先拍板。除非用户明确要求改变,按默认执行即可,不要再询问:

1. **示例面板是给人看的,AI 不主动开启**:AI 的验证靠源码 + DOM 断言(精确值),
   最终视觉验收由用户完成。仅当用户明确要求对照渲染,或诊断视觉偏差确有必要时,
   说明理由后临时把 `src/client.tsx` 的 SHOW_EXAMPLES 置 true;阶段结束回滚为 false。
   设计切换器:内置在首页顶栏右上角——**那是用户的操作,AI 不代切**(用户要求时可以)。
2. **真机预览**:可直接运行项目根目录的 `./start.sh` 起实例做渲染验证
   (默认 profile 与端口;端口被占会自动后移,无需干预)。
3. **文案语言**:默认 zh-only 快速迭代;`src/locales.ts` 双语机制保留,
   需要时再补 en 键位(键需一致)。
4. **数据与 AI 能力**:骨架自带的 SQLite/service 与 /ai-stream 保留但默认闲置;
   业务确实需要时再启用或业务化,不要提前改造。
   数据落 `<profile根>/data/<包名>/`(升级/重装不丢);表结构演进用
   PRAGMA user_version 记版本并写迁移步骤,不要裸改 CREATE TABLE。
5. **业务页面不放开发提示**:面向开发者的指引(如「加工具请进 registry」)
   写在 AGENTS.md / README 里,不渲染进业务页面——业务页面只呈现给最终用户的内容。

## 命令

```bash
npm run guard        # 红线门禁(可选项缺失/边界/根容器)
npm run build        # esbuild 打包 client.js
npm run watch        # 监听构建
npm run prepack      # guard + build(发包前自动跑)
```

## 验证与运行

- **client.js(src/)改动**:dsh 实例不重启,浏览器刷新即生效(rev 机制)
- **Host(index.js/service/)改动**:需重启 dsh 实例
- **预览(推荐)**:项目根目录 `./start.sh`——自动完成 构建/初始化 profile(首次)/插件登记/启动(启动后终端被占用属正常)
  或手动三步:① `npx @deepseek-ai/dsh --profile <名字> --from-default-profile web --port 3124`(首次补 web 壳,会前台起服务;3080 被占时必须带 --port)
  ② 启动实例 ③ **另一终端** `npx @deepseek-ai/dsh plugin --profile <名字> add <本项目>`(热登记,无需停服务)→ 刷新浏览器
- **client.js(src/)改动**:dsh 实例不重启,浏览器刷新即生效(rev 机制)
- **Host(index.js/service/)改动**:需重启 dsh 实例

## 参考文档与项目

`docs/dsh-plugin-playbook.md` —— 15 个真实踩坑 + 机制验证清单 + dsh 升级 SOP(**生成时已随项目附带**,guard 报错时先查 §7)。
完整真实工作台(全部范式组装后的样子)见样板项目 **dsh-workbench-sample**(单店经营面板)。
