<!-- 本文件随骨架原样进入每个生成项目,所以按「生成项目」的视角书写;模板仓库 skeleton/ 目录里的就是它。 -->

# 工作台插件项目

基于 dsh web 的工作台插件,由 dsh 工作台脚手架生成。它是一份**固件**:机制与知识全量
(AI 手册、门禁、设计语言库、请求层、数据服务、会话联动),**页面零预置**——做哪几个面板由你按业务需求设计,
交给 AI 开发工具照 `AGENTS.md` 实现。

## 快速开始

```sh
npm install      # 仅首次:本地 link 安装时,依赖必须在插件自己的目录里(坑 #17);./start.sh 也会自动做
./start.sh       # 构建 → 初始化 profile(首次)→ 登记插件 → 启动 → 激活判定
```

`./start.sh` 的**最后一行才是启动结论**:

- `[start] ✓ 插件 Host 半区已激活` —— 启动成功,访问地址在上一行
- `[start] ✗ 插件 Host 半区激活失败` —— 脚本以非零退出,并打印 diagnostic 与抛错位置。
  **地址能打开不代表插件活着**:此时数据服务、agent 工具、投影全部不可用,按提示修完重跑

实例在后台运行,日志在 `/tmp/dsh-<profile>.log`。停止实例:`kill $(lsof -nP -iTCP:<端口> -sTCP:LISTEN -t)`。
这个脚本是给你人工控制实例用的;交给 AI 开发时,它用不用不受限制(见 `AGENTS.md` 默认策略 2)。

## 结构

```
├── AGENTS.md            ★ AI 开发手册:身份 / 红线 / 规则层级与裁决 / 工作流(CLAUDE.md 自动转到这里)
├── DESIGN.md            ★ 视觉契约(design/ 里选中的那套设计语言)
├── index.js             Host 半区:同源数据服务 /wb-api/* + agent 工具(wb_*)+ 配置 + 会话统计投影
├── service/             数据层:SQLite / 查询 / 首启造数 / 会话联动固件 session-stats.mjs
├── cordis.patch.yml     把本包登记进 dsh
├── locale/  icon.svg    展示元数据:Plugins 页的标题 / 描述 / 图标
├── build.mjs            esbuild → client.js(闭包工厂格式)
├── start.sh             一键起实例(结尾给出激活判定)
├── scripts/             guard.mjs 门禁 / activation-verdict.sh 激活判定 / smoke-render.mjs 渲染冒烟
├── docs/
│   ├── official/        官方规范随行(dsh-doc 全文,按运行版本对齐;来源与日期看 VERSION.txt)
│   ├── EXAMPLES.md      范式索引 + 红线映射
│   └── dsh-plugin-playbook.md   实战手册:踩坑 / 机制验证清单 / 规则裁决 / 升级
├── design/              设计语言库(各 DESIGN-*.md 契约)
└── src/
    ├── client.tsx       ★ 唯一的 dsh 耦合点:PANELS 注册面板(初始为空)
    ├── pages/           ★ 你的业务页面(初始只有 ConfigPage)
    ├── examples/        示例区:9 个范式页 + 会话联动 tab(默认不注册,可整体删除)
    ├── theme.ts         设计系统基线:wb- tokens + 组件类 + 图标 sprite
    ├── design/          设计语言的机器形态:variants.ts / switcher.tsx / icons-data.ts
    ├── icons.tsx        WbIcon(官方图形)+ 自绘图标
    └── api.ts  locales.ts  shim.ts  styles.ts
```

## 开发

页面写在 `src/pages/`,在 `src/client.tsx` 的 `PANELS` 注册。每次改完跑 `npm run guard && npm run build`,
全绿才算完成——`guard` 不只查语法:红线、边界、展示元数据、Harness Client 包禁令、Host 半区引用、
渲染冒烟都在里面。

- 改 `src/`(client.js):`npm run build` 后壳的热更新会自动换上新插件,不用刷新(页面里的临时状态会重置)
- 改 `index.js` / `service/`(Host 半区):新代码不会自动生效——重跑 `./start.sh`(同 profile 会自动重启旧实例),
  或经插件管理器对本插件 disable → enable;以激活判定为准

## 示例区

`src/examples/` 是 9 个范式页加一个会话联动 tab(「示例·工作台」),源码常驻供 AI 阅读,默认不注册进侧栏。
要看渲染效果:把 `src/client.tsx` 的 `SHOW_EXAMPLES` 置为 `true`。学习入口与红线见 **docs/EXAMPLES.md**;
示例可整体删除(删目录 + `src/client.tsx` 里的 import 与调用),guard 会验证主代码零耦合。

## 加载到 AI 开发工具(第一次会话怎么说)

本目录自带 **AGENTS.md**(AI 手册:身份 / 红线 / 规则层级与裁决 / 工作流)与 **docs/EXAMPLES.md**(范式索引)。
ClaudeCode 经 CLAUDE.md 自动读 AGENTS.md;Codex / OpenCode 原生读 AGENTS.md。

| 工具 | 加载方式 |
|---|---|
| ClaudeCode | `cd <本项目> && claude` |
| Codex | `cd <本项目> && codex` |
| OpenCode | `cd <本项目> && opencode` |
| dsh 会话 | 先 `./start.sh` 起实例,在会话里直接提业务需求;agent 可用 wb_* 数据工具与探针 wb_session_stats |

**首次会话提示词**(复制即用。用生成器页面生成的项目,结果页上的是同一份,只是首行多了路径与包名):

```text
这是一个刚生成的 dsh 工作台插件项目。
请先完成「入职」,暂时不要写任何代码:
1. 读 docs/official/dsh-doc/SKILL.md —— 官方规范随行入口(优先级最高;references/ 按任务查,机制有疑问时以运行中 dsh 的实际行为为准)
2. 读完 AGENTS.md —— 项目身份、红线、规则层级与裁决程序、默认策略、开发工作流
3. 读完 DESIGN.md —— 视觉契约(设计语言、Do/Don't);设计语言可在运行时切换——切换器组件在 src/design/switcher.tsx,需要你挂到第一个业务页面的顶栏(AGENTS.md 工作流第 2 步)
4. 读完 docs/EXAMPLES.md 与 src/examples/ 的 9 个示例页源码(渲染效果:把 src/client.tsx 的 SHOW_EXAMPLES 置 true)
5. 用几句话向我复述:这个目录是什么、有哪些既定约束、你准备按什么工作流开发;然后向我提出你需要澄清的问题

我会在下一条消息里给出需求描述。开发约束(全程适用):
页面范式照 examples 抄,不改 examples/ 与 theme.ts;主代码不 import 示例区;
图标用 WbIcon 按 glyph 名引用(先到「示例·工作台 → 图标规范」搜),禁止 import @deepseek-ai/dsh-client-* 任何包;
第一个业务页面的顶栏右侧放 <DesignSwitcher />,让用户能即时切换设计语言;
每个新页面注册进 src/client.tsx 的 PANELS 并带 .wb-page 根容器;
每次改完跑 npm run guard && npm run build,全绿才算完成;交付前按 AGENTS.md 验证清单走明暗双主题与 UX 自查。
```
