# dsh-workbench-template 修改提示词

> **给执行方（另一个开发会话）**：这是一份可以直接使用的修改任务书。按 §0 的范围约束、§1 的发现清单、§2 的修改项、§3 的验收清单执行。
>
> **给审阅方**：§1 是逐条实测发现（每条都附证据与源码/运行时依据），§2 是按优先级排好的修改项，§3 是可机械执行的验收标准。
>
> **分析基线**：
> - 被审项目：本仓库（`dsh-workbench-template` v0.1.0，git HEAD `5e7f22d`）
> - DSH 运行时：Desktop `0.2.2-rc.5`（`/Applications/DeepSeek Harness.app/Contents/Resources/app.asar/dsh/`）
> - DSH 源码参考：官方仓库 `deepseek-harness` @ `d98f5d6851`（`0.2.3-alpha.1`）
> - 对照实践：本次在同机真实安装并运行了一个 DSH 插件（`dsh-session-inspector`），踩到 5 个真实错误，详见
>   本次评审方的实战记录《DSH 插件实战记录》（同批归档，未入本仓库）
>
> **重要前置**：本次分析**没有修改被审项目的任何文件**。所有结论均来自只读检查 + 在本机 DSH 运行时上的 introspection。

---

## 0. 任务范围与硬约束

### 0.1 要做什么

对 `dsh-workbench-template` 做一轮**机制对齐 + 完整性补齐**：

1. **机制对齐**：把本次实战新验证到的 DSH 机制（本地 link 安装的依赖解析陷阱、fork 守卫、probe 工具模式）补进模板与手册。
2. **完整性补齐**：修掉模板自身的展示元数据缺口（`locale/`、`icon.svg`、`files` 漏项）。
3. **门禁补齐**：把"能静态检查的机制约束"加进 `scripts/guard.mjs`，让下一次 AI 不再重犯。

### 0.2 不要做什么（重要）

| 禁止 | 原因 |
|:--|:--|
| ❌ **不要改动 `skeleton/docs/official/dsh-doc/` 下的任何文件** | 那是官方规范快照，由 `npm run sync-official` 从 GitHub 抓取覆盖。手改会被下次同步覆盖 |
| ❌ **不要改动 `skeleton/src/examples/`、`skeleton/src/design/`、`skeleton/src/theme.ts`** | 它们是"共享资产"，由 `scripts/sync-shared.mjs` 从本仓库根单向同步，guard 逐字节比对。手改会破坏同步 |
| ❌ **不要引入新的运行时依赖**（`dependencies`） | 见 §1.1 —— 依赖解析是本项目的结构性约束，加依赖会引入失败模式 |
| ❌ **不要改动 `skeleton/package.json` 的 `peerDependencies`** | 那里是"运行时由宿主提供"的声明，改了会破坏 §1.1 的解法 |
| ❌ **不要重写 `skeleton/src/pages/ConfigPage.tsx`** | 它是 `plugins.row.config` 的参考实现，工作正常 |
| ❌ **不要在本轮引入 session projection** | 见 §2.5 —— 这是"需要独立立项"的变更，不应混进本轮 |

### 0.3 提交要求

- 一个提交做完 §2 的所有 P0/P1 项；P2 可单独提交。
- 提交前 `npm run guard && npm run build && npm run smoke` 全绿。
- 提交信息里引用本提示词的 §2 编号（例：`fix(skeleton): 补 locale/meta 元数据与 icon(#2-1)`），方便回溯。

---

## 1. 实测发现清单

> 每条都标注了**证据等级**：
> - 🔴 **实测复现** —— 我真的触发了它
> - 🟡 **源码确认** —— 我读了源码确认，但未在本机触发
> - 🟢 **运行时确认** —— 我在本机 DSH 运行时查到了契约

### 1.1 🔴 本地 link 安装的依赖解析绕过 profile

**现象**：

```
plugin_manager install_bundle /abs/path/to/plugin
→ pnpm 成功（+ my-plugin 0.1.0 <- ../../../../../abs/path/to/plugin）
→ 但插件激活失败：
   dsh: warning: 1 entry did not activate
   my-plugin (my-plugin): failed to import: Error [ERR_MODULE_NOT_FOUND]:
   Cannot find package 'zod' imported from /abs/path/to/plugin/index.js
```

**根因**：`install_bundle` 对本地目录做的是 **`link:` 安装**。Node 解析 ESM 裸模块说明符时，以模块自身的**真实路径（realpath）**向上查找 `node_modules`：

```
/abs/path/to/plugin/node_modules     ✗
/abs/path/node_modules               ✗
/abs/node_modules                    ✗
/node_modules                        ✗
```

**profile 的 `node_modules` 完全不在这条路径上** —— 依赖解析绕过了 profile。

**对照实验**（同机实测）：

| 插件 | 安装方式 | 运行时依赖 | 结果 |
|:--|:--|:--|:--|
| `dsh-video-workbench` | `link:` | **零**（只 import `node:fs` 等内置模块） | ✅ 正常 |
| `dsh-context` | **registry**（`dsh-context@0.87.0`） | `zod` | ✅ 正常 |
| 本地 link 插件 | `link:` | `zod` | ❌ **失败** |

`dsh-context` 内部**没有** `node_modules` 仍能解析 zod —— 因为 registry 安装时 pnpm 用 `nodeLinker: hoisted` 把依赖平铺在 `profile/node_modules/`，而它自己**物理位于** `profile/node_modules/dsh-context/`，向上查找正好命中。

**对本项目的意义**：

`skeleton/index.js:14` 有**静态** import：

```js
import Schema from '@deepseek-ai/schemastery'
```

`@deepseek-ai/schemastery` 在 `peerDependencies`（**不在** `dependencies`）。

**当前是安全的**，因为：
1. `skeleton/start.sh:12` 在装插件前先 `npm install --silent` —— 在**插件自己的目录**里装出真实 `node_modules`，静态 import 能解析。
2. `peerDependencies` 在 npm 7+ 会被自动安装。

**但存在一个未覆盖的路径**：`docs/dsh-plugin-playbook.md:87-88` 给的手工流程是：

```sh
npx @deepseek-ai/dsh plugin --profile workbench add /path/to/my-workbench
```

**这条路径不跑 `npm install`**。若用户在一个**刚 clone、没装过依赖**的目录上直接执行，会命中上面的 `ERR_MODULE_NOT_FOUND`。

**另外两处事实**（供决策参考）：
- `@deepseek-ai/schemastery` 在 npm 上是公开的（`npm view` → `3.19.0`），能装。
- `@deepseek-ai/dsh-tools` 在 npm 上是 `0.0.1-rc.1` —— **远低于**本机运行的 `0.2.2-rc.5`。所以 `dsh-tools` **不该**被 npm 装成真实依赖；`skeleton/index.js` 的动态 import + try/catch 兜底（坑 #9）是**正确**的，本轮不要动它。

### 1.2 🔴 Session projection 的 fork 守卫缺失（模板未覆盖此机制）

**背景**：`skeleton/` 目前**完全不使用** session projection（数据走自己的 SQLite + webServer 路由）。playbook §11 的机制验证清单里也没有 projection 这一行。

**但它是一个高危机制**，我在本次实战里踩了：

一个只发起过 **1 次**工具调用的 `subagent_fork` 会话，读到的投影是：

```json
{ "turns": 10, "steps": 130, "toolCalls": 166, "messages": 159 }
```

**没有任何报错。数字看着合理，只是偏大。**

根因（源码确认，`packages/session/session-projection/src/index.ts`）：

| 事实 | 行号 |
|:--|:--|
| `drive()` 对**每一个**提交事件调用 `apply` | `:887-947` |
| cell 首次构建时从 **seq 0** 开始折叠，父会话整个历史都被喂进 `apply` | `session.snapshotEvents(0, event.seq)` |
| 注册表**只把 `inheritedEventCount` 传给 `init()`**，**从不自己跳过继承前缀** | `:303`、`:739`、`:833` |

正确写法（官方 `packages/interaction/action-cards/src/projection.ts:100-104` 的形态）：

```js
init: (_header, inheritedEventCount) => ({ inheritedEventCount, /* 初始状态 */ }),
apply: (state, event) => {
  if (event.seq < state.inheritedEventCount) return state   // ★ 必须
  // ...
}
```

**且 `stateVersion` 必须 bump** —— 守卫是折叠语义的一部分：

> *"Bump when state fields or fold semantics change."* —— `index.ts:126-132`

**危险等级**：这类 bug **不报错**，只会给出偏大的数字。它会一直留在插件里，直到某个用户 fork 一个会话才发现。

### 1.3 🟢 展示元数据不完整（`host-plugin.md` 明文要求）

**官方要求**（`packages/preset/agent-preset/skills/dsh-doc/references/host-plugin.md`）：

> *"Complete this checklist before installation: Write a recognizable title and a description of the capability in `locale/en.json` under `meta.title` and `meta.description`… Create an original icon… Export `./locale/*.json` and `./icon`; retain existing runtime exports. **Keep the patch, locales, the detail document's directory, icon, and every runtime file in `files`**"*

**模板现状**：

| 项 | 现状 | 官方要求 |
|:--|:--|:--|
| `skeleton/locale/` 目录 | **不存在** | 必须有 `locale/en.json`（含 `meta.title` / `meta.description`） |
| `skeleton/icon.svg` | **不存在**（根仓库有 `icon.svg`，但骨架目录里没有） | 必须有 icon（SVG/PNG/JPEG/WebP，≤256 KiB） |
| `skeleton/package.json` 的 `files` | `["index.js", "client.js", "cordis.patch.yml", "service"]` | 必须含 `locale/*.json`、`icon.svg` |
| `skeleton/package.json` 的 `exports` | `{"."`, `"./client"`, `"./package.json"`} | 应含 `"./locale/*.json"`、`"./icon"` |
| `skeleton/docs/DETAIL.md` | 不存在（只有 `EXAMPLES.md` 和 `official/`） | 可选（`meta.detail`），但推荐 |

**后果**：生成出来的项目在 Plugins 页上**没有标题、没有描述、用默认占位图**。官方原文：*"Missing fields of a package-root plugin fall back to `package.json` `name` and `description`, and missing images use the panel's default artwork."*

**根仓库已有 `icon.svg`（505 字节）** —— 骨架目录漏了它。`service/scaffold.mjs:63-66` 的改名逻辑也没有覆盖 icon（不需要改，但 `files`/`exports` 需要补）。

### 1.4 🟡 `plugins.row.config` 的 key 形态可以收敛

**运行时实测**（`cordis_inspect_query(Slots.listSubTree, root='plugins.row.config')`）：

> *"The configuration of one row a bundle declares, keyed by `<package name>#<row id>` **with the row id as the bundle's patch declares it**"*

`skeleton/cordis.patch.yml` 里声明的 row id 是 **`my-workbench`**（不是 `include:my-workbench`）。

**模板现状**（`skeleton/src/client.tsx:69-70`）注册了**两个** key：

```tsx
for (const key of ['dsh-myworkbench#include:my-workbench', 'dsh-myworkbench#my-workbench']) {
```

**评估**：两个都注册是**防御性**做法，代价是多占一个 cell。官方描述明确说 key 形式是 `<package name>#<row id>`，即 **`dsh-myworkbench#my-workbench`**。带 `include:` 的那个大概率不匹配任何 dispatch。

**建议**：保留两个但**加注释说明主用哪个**，或收敛为一个。**不建议直接删** —— 官方描述可能不含所有 dispatch 变体，删掉有风险。**倾向：保留 + 注释**。

### 1.5 🟢 `main` 插槽没有 `useProjection`，`sidebar.right.pane.tab` 有

**运行时实测**（`Slots.listSubTree` 的 `standardProps`）：

| 插槽 | `standardProps` 里有 `useProjection` 吗 |
|:--|:--|
| `main` | **❌ 没有** |
| `sidebar.right.pane.tab` | ✅ 有 |
| `plugins.row.config` | ❌ 没有 |

**含义**：一个主面板（`main`）的工作台**拿不到** `useProjection` 这条读投影的通道。若将来主面板要显示会话派生数据，得走别的路径（`ctx.sessions` / `useSessions` 家族）。

**这不影响当前模板**（它不用 projection），但**应该记进 playbook §11 的机制验证清单**，标注为"⛔ 主面板无此 prop"。

### 1.6 🟢 模板未覆盖 tab 类型注册（`sidebarRightTabs` + `guide`）

模板只用了三个插槽：`sidebar.brand.mark` / `sidebar.brand.name` / `main` / `sidebar.panellist` / `plugins.row.config`。

**没有** `ctx.sidebarRightTabs.register(...)`（注册 tab 类型）。

**这个机制有个高危陷阱**（我踩了）：

```ts
ctx.sidebarRightTabs.register({
  id, kind, title,
  // ⚠️ 省略 guide → tab 注册成功但界面上打不开
})
```

官方源码（`packages/client/ui-sidebar-right/src/client/tab-registry.ts:138`）：

> *"Entry boxes for the guide page. **Omit to stay off it.**"*

`guide` 省略 = 不上 guide 页 = **没有入口可以打开这个 tab**。注册**成功**、`application: applied`，但用户永远看不到。

**模板本身不受影响**（它不走 tab 类型路线），但 playbook §5「UI 插槽注册」应当补上这条，避免下游 AI 自行扩展时踩坑。

### 1.7 🟢 `dsh.client.inject` 缺省的风险

**模板现状**：

```json
"client": { "platform": "web" }
```

**没有 `inject`**。

**官方语义**（`packages/client/AGENTS.md:163`）：

> *"`inject` … they **do not sequence entry activation or apply order**. Activation order is Cordis fiber inject waiting on **services**."*

所以 `inject` 只影响**模块表到达顺序**。模板的客户端代码依赖 `ctx.slots` / `ctx.locale` / `ctx.effect` —— 这些是 **Cordis service**，由插件对象里的 `inject: ['slots', 'locale']`（`skeleton/src/client.tsx:21`）等待，**不依赖 `dsh.client.inject`**。

**评估**：当前**安全**。但官方包（如 `packages/client/ui-subagent/package.json`）都列了完整的 `dsh.client.inject`。若将来骨架引入 `dsh-client-ui-conversation` 之类，**必须**同时加进 `dsh.client.inject`。

**建议**：在 `skeleton/package.json` 加一行注释或空数组占位，并在 playbook §4 说明这个字段的**确切**语义（只管到达顺序，不管激活顺序）。

### 1.8 🟢 `defineTool` 的 `required` 规则已有门禁，但可补正错误文案

模板的 `scripts/guard.mjs` 已检查坑 #1（`required: false`）。**这是好实践**。

但门禁的失败提示可以更精确 —— 真实错误文案是：

```
JsonSchemaError: parameters.store.required must be true when present
```

建议在 guard 的提示里带上这句原文，让 AI 搜得到。

### 1.9 🟢 缺少"探针工具"模式

**本次实战最有价值的模式**：给插件注册一个探针工具，把内部状态暴露给 agent 侧，让 agent 能**直接断言数值对不对**，而不是靠肉眼看 UI。

**它抓出了 §1.2 那个静默 bug** —— 一个只报错误数字、不会报错的 bug。

**模板现状**：`skeleton/index.js` 有 2 个业务工具（`wb_region_summary` / `wb_latest`），但**没有**一个"读插件内部状态"的探针。

**建议**：不一定要在骨架里放探针（它没有 projection 状态），但**应该把"探针工具"作为一条模式写进 playbook**，并在 §8 验证工作流里加一步："用一个探针工具断言内部状态"。

---

## 2. 修改项（按优先级）

### P0 — 必须做（会导致生成物不合规或用户踩坑）

#### 2.1 补齐骨架的展示元数据（§1.3）

**改 `skeleton/`**：

1. 新建 `skeleton/locale/en.json`：

```json
{
  "meta": {
    "title": "Workbench",
    "description": "A dsh web workbench plugin: a main panel with its own sidebar entry, backed by a same-origin HTTP data service and optional agent tools."
  }
}
```

2. 新建 `skeleton/locale/zh.json`：

```json
{
  "meta": {
    "title": "工作台",
    "description": "基于 dsh web 的工作台插件：带侧边栏入口的主面板，配同源 HTTP 数据服务与可选的 agent 工具。"
  }
}
```

3. **复制根仓库的 `icon.svg` 到 `skeleton/icon.svg`**（根仓库已有，505 字节）。

4. 改 `skeleton/package.json`：

```jsonc
"exports": {
  ".": "./index.js",
  "./client": "./client.js",
  "./package.json": "./package.json",
  "./locale/*.json": "./locale/*.json",
  "./icon": "./icon.svg"
},
"files": [
  "index.js",
  "client.js",
  "cordis.patch.yml",
  "service",
  "locale/*.json",
  "icon.svg"
]
```

5. **改 `service/scaffold.mjs` 的改名逻辑**：`meta.title` / `meta.description` 里含包名时应随包名改。当前 `locale/*.json` 的文案不含包名（"Workbench" / "工作台"），所以**不需要**替换 —— 但要在 `scaffold.mjs` 加一条注释说明"locale 文案不含包名，故不参与替换；若将来加入包名需同步加 replaceIn"。

6. **改 `skeleton/package.json` 的 `files`** —— 注意 `service/` 已在列表里（坑 #5 的教训），别弄丢。

**验收**：
```bash
cd <生成的项目>
npm pack --dry-run   # 输出里必须出现 locale/en.json、locale/zh.json、icon.svg
node -e "console.log(require('./package.json').exports)"
```

#### 2.2 修 `start.sh` 与手工流程的依赖缺口（§1.1）

**两个动作**：

**(a) `skeleton/start.sh` 已做对**（第 17-20 行 `npm install`）。保留。

**(b) `docs/dsh-plugin-playbook.md` §3 的手工流程补一步 `npm install`**：

当前：
```sh
# 开发:把插件目录链入 profile(首次会以 base 模板建 profile,需再重置为 web 模板)
npx @deepseek-ai/dsh plugin --profile workbench add /path/to/my-workbench
```

改为：
```sh
# 开发:把插件目录链入 profile(首次会以 base 模板建 profile,需再重置为 web 模板)
cd /path/to/my-workbench && npm install        # ★ 先装依赖:link 安装时插件的 node_modules 必须在它自己的目录里
npx @deepseek-ai/dsh plugin --profile workbench add /path/to/my-workbench
```

**并在 §7 踩坑清单加一条**（编号接在现有 #16 之后）：

| # | 坑 | 正确姿势 |
|---|---|---|
| 17 | **本地 link 安装的依赖解析绕过 profile** → `Cannot find package 'x' imported from /path/to/plugin/index.js`（pnpm 步骤成功，但插件激活失败） | `install_bundle` 对本地目录做的是 `link:` 安装，Node 按插件**真实路径**向上找 `node_modules`，profile 的 `node_modules` 不在这条路上。**先在插件目录跑 `npm install`**；或把依赖降到零（只用 Node 内置模块）。registry 安装无此问题（pnpm 会把依赖平铺进 profile） |

#### 2.3 playbook §11 机制验证清单补三行（§1.5 / §1.6 / §1.2）

在 `docs/dsh-plugin-playbook.md` 的 §11 表格里补：

| dsh 能力 | 状态 | 参考实现 | 要点 |
|---|---|---|---|
| **session projection**（会话派生状态） | ⬜ 未验证 | — | Host 半区 `ctx.sessionProjections.register({key,stateVersion,stateSchema,init,apply,wire})`；`apply` 必须纯+同步，对不关心的事件**返回同一引用**；**`state` 必须 plain JSON**；**`apply` 必须加 fork 守卫** `if (event.seq < state.inheritedEventCount) return state`（否则 fork 出的会话会把父会话历史算成自己的，**静默出错**）；客户端经 `useProjection(key)` 读成品值，**客户端不折叠会话事件**；⚠️ **`main` 插槽的 `standardProps` 没有 `useProjection`**（只有 `sidebar.right.pane.tab` 等有） |
| **右侧栏 tab 类型**（`sidebarRightTabs`） | ⬜ 未验证 | — | `ctx.sidebarRightTabs.register({id,kind,title,guide})` 注册**类型**，再往 `sidebar.right.pane.tab` / `.title` 两个 keyed 槽注册 body/title（**key 必须等于 type 的 id**）；⚠️ **`guide` 省略 = 不上 guide 页 = 界面上打不开**（注册仍报 success） |
| **探针工具**（自检模式） | ✅ 建议采用 | 本仓库 `wbt_scaffold` / `wbt_uninstall` | 给插件注册一个"读内部状态"的工具，让 agent 能直接断言数值对不对，而不是靠肉眼看 UI；**这类工具能抓出静默 bug**（数值看着合理但偏大） |

#### 2.4 骨架 AGENTS.md 补两条红线（§1.2 / §1.6）

在 `skeleton/AGENTS.md` 的「红线」章节追加：

```
9. 若使用 session projection:`init` 必须接收并存下 `inheritedEventCount`,`apply` 首行必须
   `if (event.seq < state.inheritedEventCount) return state`——否则 fork 出的会话会把父会话的
   历史算成自己的。**这类错误不报错,只会让数字偏大。**改动折叠语义时必须 bump `stateVersion`。
10. 注册右侧栏 tab 类型时必须给 `guide` 条目——省略 `guide` 会让 tab 注册成功但界面上打不开。
```

**注意**：第 9 条只在骨架引入 projection 后才相关，但**先写进红线**是安全的 —— 它是"如果用就必须这样"的约束。

### P1 — 建议做（提升质量与防复发）

#### 2.5 playbook §4 补 `dsh.client.inject` 的确切语义（§1.7）

`docs/dsh-plugin-playbook.md` §4 已经有"种子表"说明。在其后补一段：

```markdown
### `dsh.client.inject` 的确切语义

它**只影响模块表的到达顺序**(被注入包的 factory 必须先于本 row 物化到达),
**不排序激活**——激活顺序由 Cordis fiber 的 service `inject` 等待决定。
所以:插件对象里的 `inject: ['slots','locale']` 才是"等这些服务就位"的声明;
`dsh.client.inject` 是"等这些包先到"。

引入 `@deepseek-ai/dsh-client-*` 实现时必须加进 `dsh.client.inject`;
只用类型(import type)则不需要。
```

#### 2.6 playbook §7 补两条坑（§1.8 / §1.3）

| # | 坑 | 正确姿势 |
|---|---|---|
| 18 | `defineTool` 可选参数写 `required: false` → 真实错误文案是 `JsonSchemaError: parameters.store.required must be true when present` | 可选参数**整个省略** `required` 字段;guard 已在检查,新增工具后 grep 一次 |
| 19 | 生成的插件在 Plugins 页**没有标题/描述/图标**(缺 `locale/*.json` 的 `meta.title`/`meta.description` 与 `icon.svg`) | `files` 必须含 `locale/*.json` 与 `icon.svg`;`exports` 必须导出 `./locale/*.json` 与 `./icon`;缺失时官方回落到 `package.json` 的 name/description 与默认占位图 |

#### 2.7 `plugins.row.config` 的 key 加注释（§1.4）

`skeleton/src/client.tsx:69`：

```tsx
// 键 = 包名#insert id(insert id 见 cordis.patch.yml;官方描述为 `<package name>#<row id>`,
// 故主用后者;带 include: 的形态一并注册以兼容不同 dispatch 变体)。
for (const key of ['dsh-myworkbench#include:my-workbench', 'dsh-myworkbench#my-workbench']) {
```

**不要删掉其中一个**（官方描述可能不含所有 dispatch 变体）。

#### 2.8 playbook §8 验证工作流加一步（探针工具）

在 `docs/dsh-plugin-playbook.md` §8 的列表里加一条：

```markdown
8. **状态自检**:若插件维护了内部状态(计数、缓存、投影),注册一个"读状态"的探针工具,
   让 agent 直接断言数值——而不是靠肉眼看 UI。数值偏大但看着合理 = fork 守卫或
   继承边界出了问题。
```

### P2 — 可以做（增强）

#### 2.9 guard 增补可静态检查的机制约束

`skeleton/scripts/guard.mjs` 增加：

**(a) 展示元数据完整性**：

```js
// 展示元数据:Plugins 页读 locale/*.json 的 meta.title/meta.description 与 icon(坑 #19)
const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
for (const f of ['locale/en.json', 'locale/zh.json', 'icon.svg']) {
  if (!existsSync(f)) fail(`缺 ${f}(Plugins 页的标题/描述/图标;files 与 exports 也要含)`)
}
const files = pkg.files ?? []
for (const f of ['locale/en.json', 'icon.svg']) {
  if (!files.some(x => x.startsWith(f.replace(/\.json$/, '*.json')))) fail(`package.json 的 files 漏了 ${f}`)
}
if (!pkg.exports?.['./icon']) fail('package.json 的 exports 漏了 ./icon')
if (!pkg.exports?.['./locale/*.json']) fail('package.json 的 exports 漏了 ./locale/*.json')
```

**(b) projection 的 fork 守卫**（若骨架将来引入 projection）：

```js
// session projection 的 fork 守卫:漏了会让 fork 会话把父会话历史算成自己的(静默)
const projFiles = existsSync('src') ? readdirSync('src').filter(f => f.endsWith('.ts') || f.endsWith('.tsx')) : []
for (const f of projFiles) {
  const s = readFileSync(join('src', f), 'utf8')
  if (/sessionProjections\.register/.test(s) && !/inheritedEventCount/.test(s)) {
    fail(`${f} 注册了 session projection 但没有 inheritedEventCount 守卫(漏了会静默错)`)
  }
}
```

**注意**：如果本轮不引入 projection，(b) 就是空转 —— 但留着无害，且将来引入时自动生效。

**(c) `required: false` 的 guard 提示补上真实错误文案**（§1.8）：

```js
fail(`${f} 含 required: false(坑 #1:可选参数整个省略 required 字段;真实错误:JsonSchemaError: parameters.store.required must be true when present)`)
```

#### 2.10 `service/scaffold.mjs` 的 `files`/`exports` 一致性

`scaffold.mjs` 目前只做改名替换，不校验结构。建议加一个**生成后自检**：

```js
// 生成后自检:展示元数据必须齐全(否则 Plugins 页无标题无图标)
for (const f of ['locale/en.json', 'locale/zh.json', 'icon.svg']) {
  if (!existsSync(join(t, f))) return { error: `生成结果缺少 ${f}` }
}
```

放在 `cpSync` + `replaceIn` 之后、`fetchOfficialDocs` 之前。

#### 2.11 骨架 `README.md` 补一句依赖安装说明

`skeleton/README.md` 的安装步骤里加：

```markdown
> **首次安装前先 `npm install`**：本地 link 安装时，插件的依赖必须在**它自己的目录**里
> （Node 按真实路径向上找 `node_modules`，profile 的 `node_modules` 不在这条路上）。
> `start.sh` 会自动做这一步。
```

---

## 3. 验收清单

### 3.1 机械验收（可脚本化）

```bash
# ① 门禁全绿
npm run guard && npm run build && npm run smoke
#    期望:guard 全部通过（含新增的元数据检查）

# ② 展示元数据齐全
ls skeleton/locale/en.json skeleton/locale/zh.json skeleton/icon.svg
node -e "
const p=require('./skeleton/package.json');
const need=['locale/*.json','icon.svg'];
console.log('files:', p.files);
console.log('exports:', Object.keys(p.exports));
"

# ③ 打包闭包完整
cd skeleton && npm pack --dry-run 2>&1 | grep -E "locale|icon\.svg"
#    期望:locale/en.json、locale/zh.json、icon.svg 都在 tarball 清单里

# ④ 改名后仍完整
cd /tmp && rm -rf wbt-verify && node /path/to/dsh-workbench-template/scaffold.mjs /tmp/wbt-verify --name dsh-verify --id verify
ls /tmp/wbt-verify/locale /tmp/wbt-verify/icon.svg
grep -c "dsh-verify" /tmp/wbt-verify/cordis.patch.yml

# ⑤ 文档同步（改了 skeleton 就要同步根仓库）
npm run sync-shared
git status --short          # 期望:同步脚本相关的镜像文件有变更
```

### 3.2 语义验收（需要人/AI 判断）

| # | 检查 | 怎么验 |
|:--|:--|:--|
| 1 | 生成的项目在 Plugins 页**有标题、有描述、有图标** | 起实例 → Plugins 页看该 bundle |
| 2 | 生成的项目**不报** `Cannot find package` | 直接 `dsh plugin add` 一个**没跑过 `npm install`** 的目录 → 期望失败信息可读（见 §2.2-b 的提示），或按新文档先 `npm install` |
| 3 | playbook §11 新增三行与运行时一致 | 用 `cordis_inspect_query(Slots.listSubTree)` 复核 `useProjection` 的可见范围 |
| 4 | 骨架 AGENTS.md 的红线 9/10 与官方规范一致 | 对照 `skeleton/docs/official/dsh-doc/references/practices.md` 与 `host-plugin.md` |
| 5 | 改动没有破坏"共享资产"同步 | `npm run sync-shared` 后 `git diff` 只应命中预期文件；`skeleton/src/examples/`、`design/`、`theme.ts` **零改动** |

### 3.3 回归验收（改完必须重跑）

```bash
npm run guard          # 红线门禁
npm run build          # esbuild 产物
npm run smoke          # 渲染冒烟
npm run sync-shared    # 共享资产单向同步
git diff --stat skeleton/src/examples skeleton/src/design skeleton/src/theme.ts   # 期望:空
```

---

## 4. 不要碰的地方（再强调一次）

| 路径 | 原因 |
|:--|:--|
| `skeleton/docs/official/dsh-doc/**` | 官方规范快照，由 `npm run sync-official` 覆盖 |
| `skeleton/src/examples/**` | 示例区，共享资产，`scripts/sync-shared.mjs` 单向同步 |
| `skeleton/src/design/**` | 设计语言库，共享资产 |
| `skeleton/src/theme.ts` | 共享资产（只用不删，加词汇在尾部追加） |
| `skeleton/src/pages/ConfigPage.tsx` | `plugins.row.config` 的参考实现，工作正常 |
| `skeleton/index.js` 的 `defineTool` 动态 import + try/catch | 坑 #9 的正解，`@deepseek-ai/dsh-tools` 在 npm 上版本远低于运行时，不能改成静态 import |
| `skeleton/package.json` 的 `peerDependencies` | §1.1 的解法依赖它 |

---

## 5. 一页摘要（给快速阅读）

**这个项目做得好的地方**（本轮**不要动**）：

- ✅ 三层规则金字塔 + 裁决程序 + 偏离登记册 —— 治理框架成熟
- ✅ 16 条坑清单，每条都写清了"真实付出过时间"
- ✅ guard 门禁把可静态检查的红线机器化
- ✅ 共享资产单向同步 + 逐字节比对，防漂移
- ✅ 官方规范随行（`docs/official/`）+ 版本戳 + 来源分层
- ✅ `defineTool` 动态 import 兜底、`ctx.effect` 清理、sprite 命名空间化 —— 都是对的

**本轮要修的**（按优先级）：

| 优先级 | 项 | 依据 |
|:--|:--|:--|
| P0 | 骨架缺 `locale/{en,zh}.json`（meta.title/description）与 `icon.svg`；`files`/`exports` 漏项 | §1.3，官方 `host-plugin.md` 明文要求 |
| P0 | playbook §3 手工流程缺 `npm install`；§7 缺 link 依赖解析坑 | §1.1，实测复现 |
| P0 | §11 机制清单缺 projection / tab 类型 / 探针工具三行 | §1.2 §1.6 §1.9 |
| P0 | 骨架 AGENTS.md 缺 fork 守卫与 `guide` 两条红线 | §1.2 §1.6 |
| P1 | §4 补 `dsh.client.inject` 的确切语义 | §1.7 |
| P1 | §7 补两条坑（`required` 错误文案、元数据缺失） | §1.8 §1.3 |
| P1 | `plugins.row.config` 的 key 加注释 | §1.4 |
| P1 | §8 验证工作流加"状态自检"一步 | §1.9 |
| P2 | guard 增补元数据 / projection 守卫 / 错误文案检查 | §2.9 |
| P2 | `scaffold.mjs` 生成后自检 | §2.10 |
| P2 | 骨架 README 补依赖安装说明 | §2.11 |

**一句话**：**这个项目的机制认知已经相当到位（16 条坑都是真金白银），本轮的增量主要是「官方 `host-plugin.md` 要求的展示元数据」和「本地 link 安装 + session projection 这两块新机制的补齐」。**

---

## 附：本次分析的证据清单

| 证据 | 手段 |
|:--|:--|
| `Cannot find package 'zod'` | 真实 `plugin_manager install_bundle` + `set_bundle` 重载 |
| `cannot get property "sessionProjections" without inject` | 同上（真实错误文案） |
| `useProjection` 在 `sidebar.right.pane.tab` 有、`main` 没有 | `cordis_inspect_query(Slots.listSubTree)` 实时读 |
| `plugins.row.config` 的 key 语义 | 同上 |
| `main` 的 `keyDomain: already taken: conversation` | 同上 |
| fork 守卫缺失导致 `toolCalls: 166` | 真实 `subagent_fork` + 探针工具调用 |
| 修复后 `toolCalls: 1` | 同路径复测 |
| `KNOWN_SESSION_EVENT_TYPES` 与未知类型拒绝 | `packages/core/session/src/known-event-types.ts`、`packages/session/session-format-v3-to-v4/src/validation.ts:58-63` |
| `@deepseek-ai/schemastery` 在 npm 上是 `3.19.0`、`@deepseek-ai/dsh-tools` 是 `0.0.1-rc.1` | `npm view` |
| 骨架静态 import `@deepseek-ai/schemastery` | `skeleton/index.js:14` |
| 骨架无 `locale/`、无 `icon.svg`、`files` 漏项 | `ls` + `package.json` |
| `dsh-video-workbench` 零依赖所以 link 安装正常 | `package.json` + `grep '^import'` |
| `dsh-context` 是 registry 安装所以依赖可解析 | profile `package.json` + `node_modules` 布局 |

---

**分析方未修改被审项目任何文件。**
