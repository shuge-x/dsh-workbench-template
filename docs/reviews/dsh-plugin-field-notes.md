# DSH 插件实战记录：从零写一个插件并跑通全流程

> 这份文档记录**真实动手**的过程与踩到的坑。所有错误信息、诊断文案、行号都来自真实运行，不是复述文档。
>
> **环境**：DSH Desktop `0.2.2-rc.5`（`app.asar`），profile `desktop`（`~/.dsh/profiles/desktop`），Node v24.13.0，pnpm 11.24.0
> **源码参考**：官方仓库 `deepseek-harness` @ `d98f5d6851`（`0.2.3-alpha.1`）
> **插件源码**：`dsh-session-inspector/`（本次评审的实战产物，未入本仓库）
> **配套文档**：[插件开发机制](./dsh-plugin-development-mechanism.md)、[插件 ↔ 会话联动](./dsh-plugin-session-linkage.md)、[创造模式原理解析](./dsh-creator-mode-analysis.md)

---

## 0. 这次做了什么

**插件 `dsh-session-inspector`**：在右侧栏加一个 tab，实时显示当前会话的统计（轮次 / 步骤 / 工具调用 / 工具错误 / 消息数 / 最近工具名）。

它刻意同时踩了插件开发的**全部关键机制**：

| 机制 | 用在哪 |
|:--|:--|
| 双面包（Host + Client） | Host 半边注册投影；Client 半边注册侧栏 tab |
| Session Projection（写侧） | Host 半边把会话事件日志折叠成统计 |
| `useProjection`（读侧） | Client 半边读**已算好的**值，不自己折叠事件 |
| Slot 注册 | `sidebar.right.pane.tab` + `.title`（keyed / session scope） |
| Locale | 自有命名空间 `sessionInspector` |
| Tool 注册 | 一个探针工具，用来验证投影真的在流动 |
| fork / resume 语义 | `inheritedEventCount` 守卫 |

**结果**：279 行代码，**零构建步骤**（纯 JS 手写产物形态），装进真实 profile 并在运行中的 Desktop 实例里验证通过。

---

## 1. 五个真实错误

### 错误 1：`Cannot find package 'zod'` —— link 安装的依赖解析陷阱

**症状**：

```json
{
  "stage": "enable", "target": "dsh-session-inspector", "enabled": true, "changed": true,
  "application": "failed",
  "error": {
    "code": "operation-error",
    "diagnostic": "dsh: warning: 1 entry did not activate\ndsh-session-inspector (dsh-session-inspector): failed to import: Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'zod' imported from /Volumes/NVME980/shuge-harness/session-inspector/index.js"
  }
}
```

注意：**`pnpm add` 成功了**（日志里 `+ dsh-session-inspector 0.1.0 <- ../../../../../Volumes/...`），但**插件激活失败**。

**根因**：`install_bundle` 对一个本地目录做的是 **`link:` 安装**（profile 的 `package.json` 里是 `"dsh-session-inspector": "link:/Volumes/..."`）。

Node 解析 ESM 的裸模块说明符时，**以模块自身的真实路径（realpath）向上查找 `node_modules`**。我的插件真实路径在 `/Volumes/NVME980/shuge-harness/session-inspector/`，向上依次找：

```
/Volumes/NVME980/shuge-harness/session-inspector/node_modules   ✗
/Volumes/NVME980/shuge-harness/node_modules                       ✗
/Volumes/NVME980/node_modules                                    ✗
/Volumes/node_modules                                            ✗
/node_modules                                                    ✗
```

**profile 的 `node_modules` 完全不在这条路径上** —— 依赖解析**绕过了 profile**。

**对照实验**（这是定案的关键）：

| 插件 | 安装方式 | 运行时依赖 | 结果 |
|:--|:--|:--|:--|
| `dsh-video-workbench` | `link:` | **零**（只 import `node:fs` 等内置模块） | ✅ 正常 |
| `dsh-context` | **registry**（`dsh-context@0.87.0`） | `zod` | ✅ 正常 |
| `dsh-session-inspector`（我） | `link:` | `zod` | ❌ **失败** |

`dsh-context` 内部**没有** `node_modules`，但它能解析 zod —— 因为它是 registry 安装，pnpm 用 `nodeLinker: hoisted` 把依赖平铺在 `profile/node_modules/`，而它自己**物理位于** `profile/node_modules/dsh-context/`，向上查找正好命中 `profile/node_modules/zod`。

**三种解法**：

| 方案 | 做法 | 评价 |
|:--|:--|:--|
| **A. 零依赖** | 只用 Node 内置模块；Client 侧的 `require('react')` 走平台基线，不算依赖 | ✅ 最稳，但需要 zod 时不可行 |
| **B. 插件目录建 `node_modules`** | `mkdir node_modules && ln -s <profile>/node_modules/zod node_modules/zod` | ✅ 立即可行，但**不可移植**（换机器/换 profile 就断） |
| **C. 插件目录跑 `pnpm install`** | 生成真实的 `node_modules` | ✅ 标准做法，但需要网络/缓存 |

**本次采用 B**（验证用），**生产应采用 C**。

**给插件作者的结论**：

> **本地 link 插件的运行时依赖必须能从插件自己的真实路径解析。** 依赖写进 `package.json` 不会让 pnpm 帮你装到插件目录里 —— pnpm 只在 profile 里装，而 profile 不在插件的查找路径上。

### 错误 2：`cannot get property "sessionProjections" without inject`

**症状**：

```json
{
  "application": "failed",
  "error": {
    "code": "operation-error",
    "diagnostic": "dsh: warning: 1 entry did not activate\ndsh-session-inspector (dsh-session-inspector): Error: cannot get property \"sessionProjections\" without inject"
  }
}
```

**根因**：函数插件（`export function apply(ctx)`）**必须显式导出 `inject`**：

```js
export const inject = ['sessionProjections', 'tools']
```

类插件则用 `static inject = [...]`。

**这个错误信息本身就在教你正确的做法** —— 它直接告诉你缺什么。

**为什么容易漏**：文档里 `inject` 常常出现在类插件的例子里，而函数插件的例子里可能没写全。而且这个错误**只在运行到那一行时才抛** —— 意味着模块 import 成功了、插件启动了，然后才炸。

### 错误 3：`stateSchema` 必须是真有 `parse()` 的对象

我最初手写了一个"看起来像 schema"的普通对象：

```js
const stateSchema = { turns: 'number', steps: 'number', ... }   // ✗
```

**源码契约**（`packages/session/session-projection/src/index.ts:216-220`）：

```ts
interface ErasedDefinition {
  key: string
  stateSchema: { parse(value: unknown): unknown }
  init(header: SessionHeader, inheritedEventCount: SessionLogOffset): unknown
  apply(state: unknown, event: SessionEvent): unknown
  wire: {
    viewSchema: { parse(value: unknown): unknown }
    view(state: unknown): unknown
    summary: boolean
  } | undefined
  stateVersion: number
}
```

擦除后的类型**只要求有 `parse(value): unknown`** —— 但那是**类型层面的最小要求**，不是可以手搓的邀请。`stateSchema.parse` 在冷读路径被调用（`:676`、`:738`），`viewSchema.parse` 在每次值离开 Host 前被调用（`:680`、`:750`、`:927`、`:954`）。

**结论**：用真 zod。官方 `packages/session/session-stats/src/projection.ts:26` 也是 `import { z } from 'zod'`。

### 错误 4：`guide` 省略 → tab 无法从 UI 打开

`ctx.sidebarRightTabs.register({ id, kind, title })` 成功了，但 **tab 在界面上找不到**。

**源码**（`packages/client/ui-sidebar-right/src/client/tab-registry.ts:138`）：

```ts
/** Entry boxes for the guide page. Omit to stay off it. */
readonly guide?: readonly SidebarRightGuideEntry[]
```

**`guide` 省略 = 不上 guide 页 = 没有入口可以打开这个 tab**。`SidebarRightGuideEntry` 需要 `id` / `order` / `title`（`title` 是 thunk，随语言变化）。

官方范例（`packages/client/ui-sidebar-terminal/src/client/index.ts:72-75`）：

```ts
ctx.effect(() => ctx.sidebarRightTabs.register({
  id, kind: 'terminal', multiple: true, priority: 'builtin', title: () => t('title'),
  guide: [{ id: 'new', order: 20, title: () => t('new'), description: () => t('description'), icon: PluginArtworkTerminal }],
}), 'ui-sidebar-terminal.type')
```

### 错误 5（**真 bug**）：fork 继承的历史被计进自己的统计

这是最有价值的一个 —— **它不会报错，只会给错误的数字**。

**症状**：我用 `subagent_fork`（继承父会话历史）测试，工具返回：

```json
{
  "sessionId": "48b1c9e3-b270-4e0d-a227-07a19201dcef",
  "turns": 10, "steps": 130, "toolCalls": 166, "toolErrors": 0, "messages": 159,
  "lastToolName": "session_inspector_stats"
}
```

那个 fork **只发起过 1 次工具调用**（就是 `session_inspector_stats` 本身），却报 166 次。

**根因**：注册表**不会替投影过滤继承前缀**。

- `drive()` 对**每一个**提交事件调用 `apply`（`packages/session/session-projection/src/index.ts:887-947`）
- cell 首次构建时从 **seq 0** 开始折叠（`session.snapshotEvents(0, event.seq)`）—— 父会话的整个历史都被喂进 `apply`
- 注册表**只把 `inheritedEventCount` 传给 `init()`**，**从不自己跳过继承前缀**

**正确写法**（对比官方 `packages/interaction/action-cards/src/projection.ts:100-104`）：

```js
init: (_header, inheritedEventCount) => ({ inheritedEventCount, turns: 0, ... }),
apply: (state, event) => {
  // Fork-inherited events are the parent's history, not this Session's.
  if (event.seq < state.inheritedEventCount) return state;
  ...
}
```

**而且 `stateVersion` 必须 bump**（我 1 → 2），因为守卫是折叠语义的一部分：

```js
/**
 * Non-negative persisted-cache invalidation version. Bump when state fields or fold
 * semantics change...
 */
stateVersion: 2,
```

**修复后复测**（同一个 fork 路径）：

```json
{
  "sessionId": "2b0590c4-e94c-49d3-b6c1-0cc56eed1d33",
  "turns": 1, "steps": 1, "toolCalls": 1, "toolErrors": 0, "messages": 4,
  "lastToolName": "session_inspector_stats"
}
```

**全部归 1** —— 现在只算 fork 自己的了。

> **这类 bug 的危险在于它静默。** 数字看着合理，只是偏大。**每个写 projection 的插件都必须自己加这个守卫。**

---

## 2. 验证方法：让插件自己可观测

**问题**：插件写完了，怎么确认它真的工作？没有浏览器控制权。

**解法**：给插件注册一个**探针工具**，把投影的值暴露给 agent 侧。

```js
ctx.tools.register({
  name: 'session_inspector_stats',
  description: 'Read the session-inspector projection for the current session: ...',
  parameters: { type: 'object', additionalProperties: false, properties: {} },
  output: {
    schema: { type: 'object', additionalProperties: true },
    render: (_args, value) => [{ type: 'text', text: JSON.stringify(value, null, 2) }],
  },
  isConcurrencySafe: () => true,
  async execute(_args, exec) {
    const agent = exec.agent
    if (agent === undefined) return { error: 'no-agent' }
    const state = handle.stateOf(agent.session)
    return { sessionId: agent.session.id, turns: state.turns, /* ... */ }
  },
})
```

**这个模式值得单独推荐**：

> **插件作者应该给自己留一个探针工具。** 它把"只能靠肉眼看 UI 验证"变成"agent 可以直接断言数值对不对"，而且**零额外依赖**。

**验证结果**：

| 检查 | 手段 | 结果 |
|:--|:--|:--|
| 插件行激活 | `plugin_manager` 返回 `application: applied` | ✅ |
| 行已注册 | `cordis_inspect_query(Config.listConfigs, name=...)` → `include:dsh-session-inspector` | ✅ |
| **Host 半边活着** | 探针工具出现在 `Tool.listTools` 里 | ✅ |
| **投影真的在折叠** | 探针工具返回真实数字（toolCalls=1 对应唯一一次调用） | ✅ |
| **Client 半边活着** | `Slots.listSubTree(root='sidebar.right.pane.tab')` 的 occupants 里有 `{registrant: "dsh-session-inspector", active: true}` | ✅ |
| **title 也注册了** | `Slots.listSubTree(root='sidebar.right.pane.tab.title')` 同样有 | ✅ |
| **fork 语义正确** | fork 里 toolCalls=1 而非 166 | ✅ |
| 界面上真的看得见 | 需要浏览器 —— **未验证** | ⚠️ |

**`useProjection` 的读法**（从 `Slots.listSubTree` 的 `standardProps` 里读到的）：

```json
"useProjection: UseProjection",
"useSession: SessionSnapshotSelector",
"sessionId: SessionId"
```

`useProjection(key)` 是 **key 地址的裸 observable face**（`packages/api/session-controller/src/client/sessions/projection-store.ts:100-113`）：

> *"Key-addressed bare observable face (the useProjection resolution path). Always defined — absence is an `undefined` snapshot, never a missing face, so a component may subscribe before the key ever carries a value."*

**一个 key 从未被 Host 发布过时，读到的是 `undefined` —— 是值，不是错误。** 这让组件可以先订阅、后等值。

**"零客户端代码"的官方说法**（`projection-store.ts:12`）：

> *"a domain ships projection support with zero client code"*

**这就是整条链路的设计意图**：Host 折叠 → `wire.view` → 客户端按 key 读成品值。**客户端从不折叠会话事件。**

---

## 3. 完整插件源码

### 3.1 目录结构（零构建步骤）

```
session-inspector/
├── package.json         # dsh.bundle.patch + dsh.client 声明 + zod 依赖
├── cordis.patch.yml     # insert 一行
├── index.js             # Host 半边：投影 + 探针工具（148 行）
├── client.js            # Client 半边：侧栏 tab（131 行）
├── icon.svg
└── locale/{en,zh}.json  # meta.title / meta.description
```

**没有 `src/`、没有 `lib/`、没有构建配置。** `index.js` 和 `client.js` 直接就是出货形态。

> **这是 DSH 插件开发的一个真实优势**：如果不需要 JSX 和 TypeScript，**一个 DSH 插件可以零构建工具**。官方模板 `templates/decoration/` 也是这个形态。

### 3.2 `package.json`

```json
{
  "name": "dsh-session-inspector",
  "version": "0.1.0",
  "private": true,
  "description": "Session inspector: a right-sidebar tab showing live per-session statistics derived from the session event log.",
  "type": "module",
  "icon": "icon.svg",
  "main": "index.js",
  "exports": {
    ".": "./index.js",
    "./client": "./client.js",
    "./package.json": "./package.json",
    "./locale/*.json": "./locale/*.json"
  },
  "files": ["icon.svg", "locale/*.json", "index.js", "client.js", "cordis.patch.yml"],
  "engines": { "dsh": ">=0.2.2-rc.1" },
  "dsh": {
    "bundle": { "patch": "./cordis.patch.yml" },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-ui-sidebar-right",
        "@deepseek-ai/dsh-client-locale"
      ]
    }
  },
  "dependencies": { "zod": "^4.6.6" }
}
```

**四个字段的必要性**：

| 字段 | 缺了会怎样 |
|:--|:--|
| `exports["./client"]` | Client 半边**扫描失败**：*"declares dsh.client but exports no './client' bundle"* |
| `dsh.bundle.patch` | 不被识别为 bundle → `listBundles()` 报 `not-bundle` |
| `dsh.client.platform: "web"` | 只有 `'web'` 会成为 client row，其它值直接被跳过 |
| `files` | 发布闭包；**本地 link 安装不裁剪**（`files` 只对打包/发布生效） |

### 3.3 `cordis.patch.yml`

```yaml
- insert:
    - id: dsh-session-inspector
      name: dsh-session-inspector
```

**一行就够**。`config` 省略。

### 3.4 Host 半边（`index.js`）

```js
import { z } from 'zod'

const stateSchema = z.object({
  inheritedEventCount: z.number(),
  turns: z.number(), steps: z.number(), toolCalls: z.number(),
  toolErrors: z.number(), messages: z.number(),
  lastToolName: z.string().nullable(),
})
const viewSchema = z.object({ /* 同上但不含 inheritedEventCount */ })

const sessionStatsProjection = {
  key: 'sessionInspectorStats',
  stateVersion: 2,                       // 守卫改变了折叠语义 → bump
  stateSchema,
  init: (_header, inheritedEventCount) => ({ inheritedEventCount, turns: 0, /* ... */ }),
  apply: (state, event) => {
    if (event.seq < state.inheritedEventCount) return state   // ★ fork 守卫
    switch (event.type) {
      case 'turn/start':  return { ...state, turns: state.turns + 1 }
      case 'step/start':  return { ...state, steps: state.steps + 1 }
      case 'tool/call':   return { ...state, toolCalls: state.toolCalls + 1,
                                   lastToolName: typeof event.data.name === 'string'
                                     ? event.data.name : state.lastToolName }
      case 'tool/result': return event.data.isError === true
                                   ? { ...state, toolErrors: state.toolErrors + 1 } : state
      case 'user/message':
      case 'assistant/message': return { ...state, messages: state.messages + 1 }
      default: return state              // ★ 不关心 → 同引用
    }
  },
  wire: { viewSchema, view: state => ({ /* 只带要给人看的字段 */ }), summary: false },
}

export const inject = ['sessionProjections', 'tools']

export async function apply(ctx) {
  const handle = await ctx.sessionProjections.register(sessionStatsProjection)
  ctx.tools.register({ /* 探针工具 */ })
}
```

**四个必须遵守的契约**（每一条都在这次实战里被验证或差点踩到）：

| 契约 | 违反后果 |
|:--|:--|
| `apply` 对不关心的事件**返回同一引用** | 下游白做功（`Object.is` 是变更门的依据） |
| `apply` **纯且同步** | 异步单元撕裂载体的一致性切面 |
| `state` 是 **plain JSON** | 持久化缓存前提 |
| **fork 守卫** | 继承的历史被算成自己的（静默错误） |

### 3.5 Client 半边（`client.js`）

```js
window.__ModuleLoader__.load({
  id: 'dsh-session-inspector',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    const TAB_ID = 'dsh-session-inspector';
    const TAB_KIND = 'sessioninspector';
    const NS = 'sessionInspector';

    const en = { title: 'Session', turns: 'Turns', /* ... */ };
    const zh = { title: '会话', turns: '轮次', /* ... */ };

    function InspectorBody(props) {
      const stats = props.useProjection('sessionStats');   // ★ 读成品值
      if (stats === undefined) {
        return h('div', { style: { opacity: 0.7, padding: '8px 0' } }, props.t('loading'));
      }
      return h('div', { /* ... */ },
        h(Stat, { label: props.t('turns'), value: stats.turns ?? 0 }),
        // ...
      );
    }

    return {
      inject: ['slots', 'locale', 'sidebarRight', 'sidebarRightTabs'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'session-inspector.copy');
        const t = ctx.locale.bind(NS);

        ctx.effect(() => ctx.sidebarRightTabs.register({
          id: TAB_ID, kind: TAB_KIND, multiple: false, priority: 'extension',
          title: () => t('title'),
          guide: [{ id: 'session-inspector', order: 90, title: () => t('title'), description: () => t('turns') }],
        }), 'session-inspector.tab-type');

        ctx.effect(() => ctx.slots.inject('sidebar.right.pane.tab', () => ctx.slots.register({
          name: 'sidebar.right.pane.tab', key: TAB_ID, locale: NS,
        }, InspectorBody)), 'session-inspector.tab-body');

        ctx.effect(() => ctx.slots.inject('sidebar.right.pane.tab.title', () => ctx.slots.register({
          name: 'sidebar.right.pane.tab.title', key: TAB_ID, locale: NS,
        }, InspectorTitle)), 'session-inspector.tab-title');
      },
    };
  },
});
```

**Client 半边的五个要点**：

| 要点 | 说明 |
|:--|:--|
| `id` **必须等于包名** | 它同时是模块表 key、Loader entry 名、graph row id、样式 owner |
| `React` 来自 `require('react')` | 平台基线模块，**不是**全局；**没有 JSX 转换**，只能用 `React.createElement` |
| `factory` 里**不能有副作用** | 注册、样式、监听、定时器全部放进 `apply` |
| `ctx.slots.inject(key, () => ctx.slots.register(...))` | **不能**裸 `register` —— slot 未声明时会抛错 |
| `useProjection(key)` | 读 Host 算好的值；**客户端不折叠会话事件** |

---

## 4. 完整操作序列

```bash
# 1. 写文件（4 个源码文件 + 2 个 locale + 1 个 icon）

# 2. 语法自检
node --check index.js && node --check client.js

# 3. 安装（会跑 pnpm）
plugin_manager install_bundle /abs/path/to/session-inspector
#   → application: "failed"，diagnostic: Cannot find package 'zod'

# 4. 修依赖解析（本地 link 专用）
mkdir -p node_modules && ln -sfn ~/.dsh/profiles/<profile>/node_modules/zod node_modules/zod

# 5. 重新加载（关→开触发 Loader 重算）
plugin_manager set_bundle dsh-session-inspector enabled=false   # → applied
plugin_manager set_bundle dsh-session-inspector enabled=true    # → applied

# 6. 验证
cordis_inspect_query(Config.listConfigs, name='dsh-session-inspector')
cordis_inspect_query(Tool.listTools)              # 找 session_inspector_stats
cordis_inspect_query(Slots.listSubTree, root='sidebar.right.pane.tab')   # 找 registrant
```

**`set_bundle` 关→开是本地插件的重载手法** —— 比 `install_bundle` 更可控（不会重跑 pnpm），且能明确看到每一次 `application` 结果。

---

## 5. 这次实战给文档补上的东西

| 发现 | 补进哪份文档 |
|:--|:--|
| link 安装的依赖解析绕过 profile | [机制文档 §7.2](#72-双面插件的边界) + 本文错误 1 |
| `inject` 缺失的确切错误文案 | [机制文档 §3.2](#32-tools) + 本文错误 2 |
| `stateSchema`/`viewSchema` 的真实契约 | [联动文档 §3](#3-读侧session-projection--唯一正确的-per-session-状态载体) |
| `guide` 省略 = tab 打不开 | [机制文档 §4.6](#46-ctxslots----client-侧-ui-扩展点) + 本文错误 4 |
| **fork 守卫是必须的** | [联动文档 §3.4](#34-inheritedeventcount--fork-的精确切点) + 本文错误 5 |
| `useProjection` 的读取语义 | [联动文档 §3.7](#37-wireview--客户端的出口) |
| **探针工具模式** | [机制文档 §7.3](#73-开发前必查的清单) |
| 零构建步骤的插件形态 | [机制文档 §7.2](#72-双面插件的边界) |
| `application: applied` 的含义 | [机制文档 §1.3](#13-fiberphase-状态机) |

---

## 6. 留给后续的三件事

| # | 事项 | 状态 |
|:--|:--|:--|
| 1 | 界面上真的能看到 tab | ⚠️ **未验证** —— 需要浏览器控制权；运行时 introspection 只能证明"注册成功" |
| 2 | 依赖解析改用方案 C（插件目录 `pnpm install`） | 待办 —— 方案 B 的软链不可移植 |
| 3 | 卸载后验证残留清理 | 待办 —— `remove_bundle` 后确认投影单元离场、slot 贡献撤销 |

**第 1 项的诚实边界**（来自 `references/plugin-development.md`）：

> *"Report verification limits; **installation and slot registration alone do not establish what the user sees**."*

我证明了**注册成功**和**数值正确**，但**没有证明用户看得见**。这两者不是一回事。

---

## 7. 给下一个插件作者的三句话

1. **先查 slot，再写代码。** `cordis_inspect_query(Slots.listSubTree, root='<slot>')` 会告诉你 kind、scope、`replaceRisk`、`keyDomain` 和已占用的 key。116 个 slot 猜不出来。

2. **给插件留一个探针工具。** 让 agent 能直接断言"我的投影算对了"，而不是靠肉眼看 UI。

3. **fork 守卫不是可选的。** 每个自己写 projection 的插件都要 `if (event.seq < state.inheritedEventCount) return state` —— 否则它会静默地报告父会话的历史作为自己的，而且**不报错**。

---

**未修改 DSH 仓库任何文件。** 唯一的外部改动是本机 `desktop` profile 里新增了 `dsh-session-inspector` 这个 bundle（可用 `plugin_manager remove_bundle dsh-session-inspector` 移除）。
