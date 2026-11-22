# 整改复核报告

> **复核对象**：`dsh-workbench-template` 整改提交 `5aec552`（基线 `5e7f22d`）
> **复核方**：评审提示词的作者（即本报告作者）
> **复核方式**：只读检查 + **在整改后的实际仓库上重新执行 guard / pack / scaffold 端到端**，不采信整改方自述
> **结论**：**整改成立。8 条采纳项全部落地且验证通过；2 条不采纳项我复核后确认我错了。另有 2 处遗留问题需补。**

---

## 0. 总裁定

| 项 | 整改方裁定 | 我的复核结论 |
|:--|:--|:--|
| §1.1 link 安装依赖绕过 profile | ✅ 采纳 | ✅ **成立**，证据吻合 |
| §1.2 projection fork 守卫 | ✅ 采纳 | ✅ **成立**，且已进红线 |
| §1.3 展示元数据缺失 | ✅ 采纳 | ✅ **成立**，但**图标内容我原建议是错的** |
| §1.4 row.config key 形态 | ✅ 采纳（保留+注释） | ✅ **成立** |
| §1.5 `main` 无 `useProjection` | ✅ 采纳 | ✅ **成立** |
| §1.6 `guide` 省略陷阱 | ✅ 采纳 | ✅ **成立**，已进红线 |
| §1.7 `inject` 语义 | ✅ 采纳（仅文档化） | ✅ **成立**，且它的"不占位"判断比我的好 |
| §1.8 `required` 报错文案 | ✅ 采纳 | ✅ **成立** |
| §1.9 探针工具模式 | ✅ 采纳 | ✅ **成立** |
| icon.svg 直接复制根仓版 | ❌ 不采纳 | 🔴 **我错了 —— 整改方正确** |
| sync-shared 镜像机制 | ❌ 不采纳 | 🔴 **我错了 —— 整改方正确** |

**整改方的复核质量高于我的评审。** 它不仅坐实了我对的部分，还**用反证推翻了我两处基于错误前提的建议**，且反证成立。

---

## 1. 我错的两处（认账）

### 1.1 icon.svg：我建议"直接复制根仓版"是错的

**我的建议**（原提示词 §2.1 步骤 3）：*"复制根仓库的 `icon.svg`（505 字节）到 `skeleton/icon.svg`"*

**整改方的反证**：旧版 icon 三连违反官方 `artwork.md`。

**我复核了官方规范原文，逐条坐实**（`skeleton/docs/official/dsh-doc/references/artwork.md`）：

| artwork.md 原文 | 旧 icon 的实际写法 | 违反 |
|:--|:--|:--|
| `:14` *"Use `width="36" height="36" viewBox="0 0 36 36"`"* | `viewBox="0 0 64 64"` | ❌ |
| `:14` *"Plugin Manager chooses display sizes and draws the surrounding tile, so **do not draw a tile or background** in the SVG"* | `<rect width="64" height="64" rx="14" fill="#3a53c8"/>` + 渐变底板 | ❌ |
| `:22` *"**Draw lettering as paths rather than `<text>`** so browser font substitution cannot change it"* | `<text ... font-family="PingFang SC" ...>W</text>` | ❌ |

**旧 icon 三条全中。** 我当时只看了"根仓有个 icon.svg 可以复制"，**没有核对它是否合规** —— 这是评审方法上的疏漏：我把"存在"当成了"可用"。

**整改方的新 icon 合规**：

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" fill="none">
  <!-- 官方 artwork.md 合规:36×36 viewBox;字标用路径不用 <text>;不画底板(Plugin Manager 自绘瓷砖) -->
  <path d="M8.5 10L13.5 26L18 14.5L22.5 26L27.5 10" stroke="#4f6ef0" stroke-width="3.2"
        stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

36×36 viewBox ✓、纯路径 ✓、无底板 ✓、无 `<text>` ✓。

> **我的教训**：评审"补齐缺失文件"这类建议时，必须同时核对**内容规范**，不能只核对存在性。

### 1.2 sync-shared.mjs：我对它做了未经验证的断言

**我原提示词 §0.2 / §3 的表述**：

> *"它们是"共享资产"，由 `scripts/sync-shared.mjs` 从本仓库根单向同步，guard 逐字节比对"*

**整改方的反证**：该脚本实为休眠机制，方向还写反了；真跑必 ENOENT 崩溃。

**我复核了评审基线 `5e7f22d` 的实际代码，三条反证全部成立**：

**(a) 方向确实反了**。脚本头注释与 `pairs` 数组：

```js
const pairs = [
  ['skeleton/src/theme.ts', 'src/theme.ts'],      // skeleton → 根仓
  ['skeleton/src/vendor.d.ts', 'src/vendor.d.ts'],
  ...
]
```

**方向是 skeleton → 根仓**，我写成"从根仓单向同步"，**说反了**。

**(b) guard 无任何比对逻辑**。我在两个 guard 里搜 `compare` / `逐字节` / `一致`：

```
根 guard   scripts/guard.mjs        → 只命中"主代码禁止 import src/examples"(边界检查)，无镜像比对
骨架 guard skeleton/scripts/guard.mjs → 无任何命中
```

**我说的"guard 逐字节比对"是不存在的机制。**

**(c) 真跑必崩**。`skeleton/src/vendor.d.ts` **不存在**（骨架早已删除它），而 `pairs` 仍含这一项 → `copyFileSync` 必然 ENOENT。

**更关键的是：这条机制本身就是坏的**。整改方指出根仓 `src/` 是**生成器自己的 ScaffoldPage 应用**，`import` 的是 `styles.ts`，**根本不消费 `theme/examples`** —— 也就是说这个"同步"即使能跑，拷过去的东西也没有消费者。

**根仓 `AGENTS.md:15` 其实早就写对了**：*"skeleton/ ★ 骨架唯一源（**无镜像机制**——它就住在家里）"*。

> **我的教训**：我引用 playbook §11 的表格文字作为事实，**没有回到代码验证**。那张表本身在描述一个已失效的机制 —— 而整改方正是靠"读代码而不是读文档"发现的。
>
> **这与整个项目自己的裁决程序第 1 步一致**：*"核实：读与运行版本对齐的官方规范 + 必要时查运行中 dsh 的实际行为"* —— 我对这一条的执行不到位。

---

## 2. 8 条采纳项的落地复核

我**没有采信自述**，而是在整改后的实际仓库上重跑：

### 2.1 机械验证（我实跑的结果）

```
$ cd skeleton && node scripts/guard.mjs
[guard] ✓ 工具参数无 required: false(坑 #1)
[guard] ✓ 页面根容器 .wb-page 齐全(0 个,坑 #14)
[guard] ✓ 主代码未耦合示例区(边界)
[guard] ✓ 官方规范随行在位(docs/official/dsh-doc/)
[guard] ✓ src/ 无 Harness Client 包 import(practices.md 禁令)
[guard] ✓ 展示元数据齐全(locale meta + icon + files/exports 闭包)     ← 新增
[guard] ✓ 未使用 session projection(...)                              ← 新增
[guard] ✓ 静态引用检查通过(tsc --noEmit)
[guard] ✓ 渲染冒烟通过(10 个组件)
[guard] ✓ Host 半区语法检查通过(node --check,5 个文件)
[guard] 全部通过

$ cd .. && node scripts/guard.mjs
[guard] 全部通过                                     ← 根仓也绿

$ cd skeleton && npm pack --dry-run
npm notice 339B icon.svg
npm notice 202B locale/en.json
npm notice 188B locale/zh.json
npm notice total files: 12                          ← 元数据确实进了闭包

$ node scaffold.mjs /tmp/wbt-verify2 --name dsh-verify2 --id verify2
✓ 已生成 /tmp/wbt-verify2
  官方规范:snapshot(抓取未升级:所有来源不可达(master);保留目录既有快照)
$ ls /tmp/wbt-verify2/locale /tmp/wbt-verify2/icon.svg
  en.json  zh.json  icon.svg                          ← 端到端落地
$ grep dsh-verify2 /tmp/wbt-verify2/cordis.patch.yml
  - id: verify2 / name: dsh-verify2                   ← 改名正确
```

**自述与实测完全一致。** 且"抓取未升级 → 保留快照"这条降级路径我在这次实跑里**亲眼触发了**（GitHub 匿名 API 不可达），印证了整改方所说的"从设计内变成实证过"。

### 2.2 逐条对照

| 评审项 | 落地位置（我核对过 diff） | 复核 |
|:--|:--|:--|
| §1.3 元数据 | `skeleton/locale/{en,zh}.json` + `skeleton/icon.svg` 新建；两侧 `files`/`exports` 补 `locale/*.json` + `./icon` | ✅ 含根仓生成器自身（此前也不合规） |
| §2.2-b link 坑 | playbook §3 加 `cd ... && npm install` ★；§7 新增坑 #17 | ✅ |
| §2.3 §11 三行 | 新增 session projection / 右侧栏 tab 类型 / 探针工具三行 | ✅ projection 行含 `⚠️ main 插槽没有 useProjection`（我提的 §1.5） |
| §2.4 红线 9/10 | `skeleton/AGENTS.md` 增 9、10 两条 | ✅ |
| §2.5 inject 语义 | playbook §4 新增小节 | ✅ **且不采纳我的"加占位"建议是对的** —— JSON 无注释，空数组是噪音 |
| §2.6 坑 #18/#19 | playbook §7 | ✅ #19 附带 artwork.md 的图标规范 |
| §2.7 key 注释 | `skeleton/src/client.tsx` | ✅ 措辞比我建议的更准确（"实测二者都能命中"） |
| §2.8 §8 第 9 步 | playbook §8 | ✅ |
| §2.9 guard 三增 | `skeleton/scripts/guard.mjs` +44 行 | ✅ 见下 |
| §2.10 scaffold 自检 | `service/scaffold.mjs` +7 行 | ✅ |
| §2.11 README | `skeleton/README.md` | ✅ 且顺手修了残留的旧命名示例 |

### 2.3 guard 三增的实现优于我的提案

我的提案是"扫 `src/` 下有没有 `sessionProjections.register`"。整改方实现：

```js
const projFiles = []
const scan = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) scan(p)
    else if (/\.(tsx?|m?js)$/.test(name)) {
      const s = readFileSync(p, 'utf8')
      if (/sessionProjections\s*\.\s*register/.test(s)) {
        if (!/inheritedEventCount/.test(s)) fail(`${p} 注册了 session projection 但没有 inheritedEventCount 守卫(...)`)
        else projFiles.push(p)
      }
    }
  }
}
```

比我的版本：递归扫描 ✓、正则更精确（避开 `sessionProjections` 的其它提及）✓、带"未使用"分支避免误报 ✓、失败文案说明了后果 ✓。

---

## 3. 两处遗留问题（建议补，不阻断）

### 3.1 🟡 playbook §11 的「共享资产镜像」行仍指向已删除的机制

整改方**删除了** `scripts/sync-shared.mjs`，并在 playbook §9 修正了"五件套"措辞 —— 但 **§11 表格第 358 行没同步**：

```
| **共享资产镜像**(skeleton 唯一源) | ✅ | `scripts/sync-shared.mjs` + guard 镜像检查 |
  theme/examples/EXAMPLES.md 由 skeleton 单向同步;guard 逐字节比对,漂移阻断;主代码 import 示例区直接 fail(边界) |
```

**三个问题**：
1. 引用了**已删除的** `scripts/sync-shared.mjs`
2. 仍宣称"guard 逐字节比对"——**这个机制从来不存在**（两个 guard 都没有）
3. 状态标 `✅ 已实证`，但它实证的是一个**失效**的机制

**建议**：改成

```
| **共享资产镜像** | ⛔ 已退役 | — | 原 `scripts/sync-shared.mjs` 是休眠机制(方向 skeleton→根仓,且含已删除的 src/vendor.d.ts,真跑必 ENOENT),根 guard 亦无逐字节比对;**skeleton/ 本身即唯一源**,不需镜像。根 AGENTS.md 已如此表述 |
```

> **这一行正是当初误导我的地方** —— 整改方在正文里已修正，但表格漏了。留着会让下一个读者（包括下一个 AI）重复我的错误。

### 3.2 🟡 guard 的 projection 检查漏扫 Host 半边

**我实测确认的盲区**：

我把一个**没有 fork 守卫**的 projection 塞进 `skeleton/index.js`（Host 半边）：

```js
ctx.sessionProjections.register({ key: 'x', stateVersion: 1, stateSchema: {}, init: () => ({}), apply: (s,e) => s })
```

guard 输出仍是：

```
[guard] ✓ 未使用 session projection(如引入:init 必须存 inheritedEventCount,apply 首行按 seq 短路)
[guard] 全部通过
```

**原因**：检查只 `scan('src')`，而 **projection 天然注册在 Host 半边**（`index.js` / `service/`），Client 半边不注册它。

**建议**（一行改动）：

```js
// 在 scan('src') 之外，把 Host 半边也纳入扫描
if (existsSync('src')) scan('src')
for (const f of ['index.js', ...readdirSync('service').filter(x => x.endsWith('.mjs'))]) {
  // 复用同一段判定
}
```

> 这不影响当前（骨架不用 projection），但**这个检查的语义承诺是"如引入即生效"** —— 而引入的位置恰好是它看不见的地方。

---

## 4. 值得记录的一点：整改方的复核方法

它推翻我两处建议的方式，是**回到代码和官方规范原文**，不是引用我的提示词：

| 我的主张 | 它的反证方式 | 结果 |
|:--|:--|:--|
| "直接复制根仓 icon.svg" | 读 `artwork.md:14/22` 原文，逐条比对旧 icon 的三个特征 | 我错 |
| "sync-shared 单向同步 + guard 逐字节比对" | 读脚本的 `pairs` 数组、搜两个 guard 的比对逻辑、查 `skeleton/src/vendor.d.ts` 是否存在 | 我错 |

**这正是本项目自己定的裁决程序第 1 步**（*"核实：读与运行版本对齐的官方规范 + 必要时查运行中 dsh 的实际行为"*）。

**我的评审反而是它批评的那种**：我引用了 playbook §11 的表格文字就当事实，没回代码。

---

## 5. 最终评价

| 维度 | 评价 |
|:--|:--|
| **整改完整性** | 8 条采纳项全部落地，位置与我建议的一致（部分更优） |
| **验证真实性** | 自述与我实跑结果**完全吻合**，无夸大 |
| **反证质量** | 2 处推翻均有源码/规范原文支撑，且**结论正确** |
| **不采纳的判断** | 2 处都正确，且都比我的建议好（重画合规图标 vs 复制违规图标；删除死机制 vs 留着它） |
| **遗留问题** | 2 处，均为文档/检查覆盖的小口子，不阻断 |

**判定：整改成立，可以合入。**

**建议补的两处**（各 1 行 / 1 段）：
1. playbook §11「共享资产镜像」行 —— 指向已删除机制，且宣称了不存在的 guard 比对
2. guard 的 projection 扫描范围 —— 漏了 Host 半边，而那正是 projection 的实际注册处

---

**本次复核未修改被审项目任何文件**（`git status` 干净）。§3.2 的盲区验证通过临时改 `index.js` 后立即还原（已用 `git diff` 确认无残留）。
