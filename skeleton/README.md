# 工作台插件骨架

可运行的 dsh web 插件最小骨架(2 个面板 + 内嵌数据服务 + 2 个 agent 工具)。

**不要在本目录直接开发** — 用上一级的脚手架复制一份:

```sh
node ../scaffold.mjs ../my-new-workbench --name dsh-plugin-mynewwb --id mynewwb --port 3801
cd ../my-new-workbench && npm install && npm run build
```

安装与启动、插件机制细节、踩坑清单见 `../docs/dsh-plugin-playbook.md`。

## 结构

```
├── package.json          # bundle + dsh.client + Node 入口(单包三角色)
├── cordis.patch.yml      # 把本包插入 dsh Loader
├── index.js              # Host 半区:数据服务(3801)+ agent 工具(wb_*)
├── build.mjs             # esbuild → client.js(闭包工厂格式)
├── service/              # 数据层:SQLite(node:sqlite),首启自动建库造数
└── src/
    ├── client.tsx        # ★ 唯一的 dsh 耦合点:插槽注册(品牌/面板/侧边栏)
    ├── pages/            # 面板组件(零 dsh 依赖,只吃 props 与 api.ts)
    ├── api.ts            # 页面 → 数据服务 fetch
    └── styles.ts         # wb- 前缀样式,单文件注入
```

## 开发循环

- 改 `src/` → `npm run build` → 浏览器刷新
- 改 `index.js` / `service/` → 重启 dsh

## 示例区

生成的项目自带 `src/examples/`(「示例·工作台」面板,7 个范式页)。学习入口与红线见 **docs/EXAMPLES.md**;整体删除示例 = 删目录 + client.tsx 两行,guard 会验证零耦合。

## 加载到 AI 开发工具(第一次会话怎么说)

本目录自带 **AGENTS.md**(AI 操作手册:身份/红线/工作流)与 **docs/EXAMPLES.md**(范式索引)。
ClaudeCode 会经 CLAUDE.md 自动读 AGENTS.md;Codex / OpenCode 原生读 AGENTS.md。

| 工具 | 加载方式 |
|---|---|
| ClaudeCode | `cd <本项目> && claude`(CLAUDE.md → AGENTS.md 自动生效) |
| Codex | `cd <本项目> && codex`(自动读 AGENTS.md) |
| OpenCode | `cd <本项目> && opencode`(自动读 AGENTS.md) |
| dsh 会话 | 先把插件装进 profile 并启动(上面的命令),在会话里直接提业务需求,agent 可用 wb_* 数据工具 |

**首次会话提示词(复制后把最后一行换成你的业务需求):**

```
这是一个刚生成的 dsh 工作台插件项目。请先完成「入职」,暂时不要写任何代码:
1. 读完 AGENTS.md —— 项目身份、红线、开发工作流
2. 读完 docs/EXAMPLES.md 与 src/examples/ 的 9 个示例页源码(渲染效果:把 src/client.tsx 的 SHOW_EXAMPLES 置 true)
3. 用几句话向我复述:这个目录是什么、有哪些既定约束、你准备按什么工作流开发;然后向我提出你需要澄清的问题

我会在下一条消息里给出需求描述。开发约束(全程适用):
页面范式照 examples 抄,不改 examples/ 与 theme.ts;主代码不 import 示例区;
每个新页面注册进 src/client.tsx 的 PANELS 并带 .wb-page 根容器;
每次改完跑 npm run guard && npm run build,全绿才算完成。
```
