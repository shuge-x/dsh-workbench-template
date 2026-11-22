# dsh 插件开发实战手册(Playbook)

> 来源:dsh 工作台样板(dsh-plugin-workbench-sample)从零到端到端闭环的完整开发经验。
> 基于 **dsh 0.2.1-rc.5**(npm 安装版)实测。目标读者:要在 dsh 上开发新工作台/垂直产品的团队。
> 结论先行:**用插件机制,不要 fork dsh,也不要急着自建前端**。页面组件保持零 dsh 依赖,迁移后路永远留着。
>
> **本手册的定位**:样板仓库(skeleton/ + 本手册)是长期资产;主项目(甜啦啦)是 dsh 能力的验证场与参考实现。
> dsh 升级时,先在样板仓库验证并更新本手册,下游工作台按 §12 记录升级——验证成本只在样板处发生一次。

---

## 1. 架构决策:四种路线怎么选

| 路线 | 适合 | 代价 |
|---|---|---|
| **dsh 插件**(本手册/脚手架) | 垂直产品/工作台,聊天+BI+工具一体;要长期演进与治理资产(guard/设计库/手册) | 耦合插件 API(锁版本可控);client 插件文档较薄,需读源码 |
| **官方 Creator 模式**(id: cordis) | 装饰级小件:面板小卡、单页小工具,一句话一次性交付,不打算长期演进 | 一次性线:无治理资产、无门禁、规模天花板低;产出沙盒单目录、insert-only,session 路线 B 例外(见下) |
| **会话路线 B**(Creator 的 session 路径) | 工作台级 + 会话联动一体的应用(video-workbench 已实证:1842 行 host + ffmpeg 导出 + 会话联动面板) | 无模板资产起步,规范靠 AI 自觉;适合原型验证,成熟后可回迁模板体系 |
| Fork dsh 源码 | ❌ 基本总是错的 | dsh 迭代快(developer preview),跟不完 |
| Runtime agent(SDK/ACP 驱动自建前端) | 多租户 SaaS、深度嵌入自有系统、UI 要彻底自主 | 整个壳(聊天流/会话/终端/文件面板/审批)自建,以月计 |

**选型判据**(按序问):要长期演进/要门禁与设计库吗 → 模板脚手架;只是装饰级小件、
一句话交付即弃 → Creator 模式;要跟会话深度联动且规模到工作台级 → 路线 B 起步,
长大回迁模板(把会话联动面板照 examples 范式落进骨架)。

**关键判断依据**:dsh 官方 Web 壳已经提供聊天、会话管理、工作区文件、终端、浏览器、审批、插件管理——占产品 UI 的 80%。插件只需做自己那 20%(品牌 + 导航 + 业务页面 + 数据工具)。

**迁移保险**(从第一天就要做):
- 页面组件**零 dsh 依赖**(只 import react + 自有模块),dsh 耦合收敛到一个 ~50 行的注册层
- 数据层收敛到独立 `service/` 目录(纯 Node,零依赖),将来接真数据源或迁自建后端整体平移
- `engines.dsh` 锁兼容范围(如 `>=0.2.0 <0.3`),升级不兼容时明确拒绝加载,而不是渲染出半坏的 UI

---

## 2. 插件包结构:一个包扮演三个角色

官方把 Host 包 / Client 包 / Bundle 包拆成三个;实测**单包三角色**更快,天然隔离:

```
my-workbench/
├── package.json          # ① dsh.bundle(可安装) ② dsh.client(浏览器半区声明) ③ main=Node 半区入口
├── cordis.patch.yml      # bundle 补丁:把本包插入 Loader
├── index.js              # Host 半区:数据服务 + agent 工具注册
├── client.js             # 构建产物:浏览器闭包工厂 bundle(勿手改)
├── build.mjs             # esbuild 构建脚本(见 §4)
├── service/              # 数据层(纯 Node 零依赖,可独立搬走)
│   ├── db.mjs / seed.mjs / api.mjs
└── src/
    ├── client.tsx        # ★ 唯一的 dsh 耦合点:插槽注册(~50 行)
    ├── api.ts            # 页面 → 数据服务的 fetch 封装(带静态兜底)
    ├── styles.ts         # 全量样式,单文件注入,tll- 前缀
    └── pages/…           # 页面组件:零 dsh 依赖,只 import react/自有模块
```

`package.json` 关键字段(全部实测必要):

```jsonc
{
  "name": "dsh-myworkbench",
  "type": "module",
  "main": "index.js",
  "files": ["index.js", "client.js", "cordis.patch.yml", "service"],  // ★ service 必须在,否则发包后 Host 半区挂
  "scripts": { "build": "node build.mjs", "watch": "node build.mjs --watch", "prepack": "node build.mjs" },
  "dsh": {
    "bundle": { "patch": "./cordis.patch.yml" },   // 角色①:可安装 bundle
    "client": { "platform": "web" }                // 角色②:client 半区声明
  },
  "exports": { ".": "./index.js", "./client": "./client.js", "./package.json": "./package.json" },
  "engines": { "dsh": ">=0.2.0 <0.3" },             // ★ 锁版本;不满足时安装/启动明确拒绝
  "peerDependencies": { "react": "^18.2.0", "@deepseek-ai/dsh-tools": "*" }
}
```

`cordis.patch.yml`(一个插件行,Host 与 Client 半区共用):

```yaml
- insert:
    - id: my-workbench
      name: dsh-myworkbench
```

---

## 3. 安装与运行(npm 版 dsh,无需源码)

```sh
# 开发:把插件目录链入 profile(首次会以 base 模板建 profile,需再重置为 web 模板)
cd /path/to/my-workbench && npm install   # ★ 先装依赖:link 安装时 Node 按插件真实路径向上找 node_modules,profile 的不在路上(坑 #17)
npx @deepseek-ai/dsh plugin --profile workbench add /path/to/my-workbench
npx @deepseek-ai/dsh --profile workbench --from-default-profile web   # 重置为 web 模板(会清依赖,再 add 一次)
npx @deepseek-ai/dsh plugin --profile workbench add /path/to/my-workbench

# 启动(注意:没有 "web" 子命令,profile 本身就是 web 应用)
npx @deepseek-ai/dsh --profile workbench --no-open --port 3123
# 日志打印带 ?token=… 的访问地址;换端口可避开默认 3080
```

- 迭代循环:**client.js 重建后刷新浏览器即可**(修订号变化走 HMR/重取);Host 半区(index.js/service)改动需重启 dsh
- `dsh --profile <name> --dump-config` 可验证 bundle 层是否生效(找 `# == dsh-plugin-…` 注释)
- 插件管理 UI(侧边栏「插件」)会显示已安装 bundle 及启用开关

---

## 4. Client bundle:闭包工厂格式(esbuild 复刻)

dsh 的浏览器 bundle 是**闭包工厂**:外层注册、内层 CJS、外部依赖不打包,运行时经注入的 `require` 从壳的模块表解析。
用 esbuild 的 banner/footer 即可复刻官方 tsdown 预设的单文件等价产物,无需 monorepo:

```js
// build.mjs 核心
await build({
  entryPoints: ['src/client.tsx'], bundle: true, format: 'cjs', platform: 'browser',
  target: 'es2022', jsx: 'automatic', outfile: 'client.js',
  banner: { js: `window.__ModuleLoader__.load({ id: ${JSON.stringify(pkg.name)}, factory: (require) => {\nvar module = { exports: {} }; var exports = module.exports;` },
  footer: { js: `return module.exports; } });` },
  external: [/* 见下方种子表 */],
})
```

**种子表**(运行时保证可 require 的模块,源码位置 `packages/client/web/src/platform.ts`):
`react`、`react/jsx-runtime`、`react-dom`、`react-dom/client`、`@deepseek-ai/cordis`、`zod`、
`@tanstack/react-virtual`、`@deepseek-ai/dsh-client-store`、`@deepseek-ai/dsh-client-ui-slots`、
`@deepseek-ai/dsh-client-ui-primitives`、`@deepseek-ai/dsh-client-ui-dockkit`。

### `dsh.client.inject` 的确切语义

它只列**包名依赖边**,仅作 preflight 展示与 HMR diff 信息,**不排序激活**——激活顺序由
Cordis fiber 的 service `inject` 等待决定(官方 client/AGENTS.md:"informational only … they
do not sequence entry activation or apply order")。所以:插件对象里的
`inject: ['slots','locale']` 才是"等这些服务就位"的声明;`dsh.client.inject` 是"等这些包先到"。
**纪律**:将来引入任何 `@deepseek-ai/dsh-client-*` 实现(非 import type)时必须加进
`dsh.client.inject`;只用类型则不需要。骨架当前零 client 包运行时依赖,故不声明。
其余 dsh 包即使出现在 `dsh.client.inject` 也只是到达顺序约束;**只用类型不 import 实现**的话,运行时外部依赖可以只有 react 两项(本项目实测如此)。

> 包资源(asset)路由 `/plugins/<pkg>/assets/*` 只支持图片(svg/png/webp/jpg)。JSON/GeoJSON 一类数据直接打进 bundle(esbuild 原生 import JSON)。

---

## 5. UI 插槽注册:client.tsx 全部职责

浏览器侧是一个 cordis 内核,页面 = 往插槽注册 React 组件。**一次只写这 50 行**:

```tsx
import type { ReactNode } from 'react'
import type { DshClientContext } from './shim'   // 自己声明的最小类型面

export const inject = ['slots']                  // ★ 浏览器侧需要的服务名(不是包名)

export function apply(ctx: DshClientContext): void {
  // ① 样式:一次性 <style> 注入,随插件卸载
  ctx.effect(() => { const s = document.createElement('style'); s.textContent = CSS; document.head.append(s); return () => s.remove() }, 'wb: styles')

  // ② 品牌替换(可选)
  ctx.slots.inject('sidebar.brand.mark', () => ctx.slots.register({ name: 'sidebar.brand.mark' }, BrandMark))
  ctx.slots.inject('sidebar.brand.name', () => ctx.slots.register({ name: 'sidebar.brand.name' }, BrandName))

  // ③ 主面板(keyed,key 即面板 id)+ 侧边栏入口(同一 id)
  for (const p of PANELS) {
    ctx.slots.inject('main', () => ctx.slots.register({ name: 'main', key: p.id }, p.component))
    ctx.slots.inject('sidebar.panellist', () => ctx.slots.register(
      { name: 'sidebar.panellist', id: p.id, order: p.order, label: p.title },
      (props: { size?: number }) => <p.Icon size={props.size ?? 16} />))
  }
}
```

要点:
- `ctx.slots.inject(插槽名, 工厂)` 会等插槽声明方(ui-layout / ui-sidebar)就绪后再注册,直接在 apply 里裸 register 反而可能时序失败
- 官方参照实现(**升级时 diff 这些文件即可知道 API 是否变化**):
  - 插槽核心 `packages/client/ui-slots`
  - 侧边栏合同 `packages/client/ui-sidebar/src/client/contract/slots.ts`(brand.mark / brand.name / panellist / panellist.actions / workspaces / settings / footer.action)
  - 主面板声明 `packages/client/ui-layout/src/client/index.ts`(main 为 keyed,'conversation' 是保留键)
  - 最佳范例 `packages/client/ui-plugin-manager/src/client/index.ts`(官方自己就是这么注册的)
- `sidebar.panellist` 的 `order` 决定排序(官方插件 manager=0、schedule=10;想排在它们前面用负数)
- 已知边界:BI 模式下想用业务子导航**替换**侧边栏「工作区」区域,受限于 `sidebar.workspaces` 是 single 插槽(官方 ui-workspace 占用),v1 不要碰

---

## 6. Host 半区:数据服务 + agent 工具

### 6.1 数据服务:webServer 前缀路由(推荐形态)

Host 半区跑在 dsh 的 Node 进程里,把 HTTP 路由**直接挂到 dsh 主 web 服务**(同源;借鉴社区插件 dsh-media-desk):

```js
export const inject = ['tools', 'webServer', 'connection']

export function apply(ctx) {
  getDb()                                          // 首启自动建库+造数
  ctx.effect(() => ctx.webServer.register({
    kind: 'prefix',
    path: '/wb-api',
    handler: async (req, res) => {
      const rejection = ctx.get('connection')?.requestRejection?.({ headers: req.headers }) ?? 403
      if (rejection) { res.writeHead(rejection); res.end(JSON.stringify({ error: '未授权' })); return }
      // …按 method+path 分发到 service 层函数;POST 读 body;GET 读 searchParams
    },
  }), 'wb: routes')
}
```

为什么优于独立端口 sidecar(两种都跑通过后的结论):
- **同源**:浏览器 fetch 不需要 CORS 白名单,web 壳换端口零影响
- **复用壳鉴权**:`connection.requestRejection` 一行挡住未授权请求(sidecar 方案默认无鉴权,是真实隐患)
- **无端口分配问题**:多工作台并存只靠各自路由前缀(/wb-api、/wbs-api…)区分
- 仍要注意:prefix 路由的 handler 是裸 Node req/res,POST body 要自己读;SQLite 用 `node:sqlite`(Node 24 内置);
  造数失败删库重试;确定性 PRNG;`service/` 保持零依赖可独立测试

> 多工作台并存约定:每个插件的数据服务用独立端口(如 3777、3801…),CORS 白名单含各自的 web 壳端口;
> 同一台机器同时跑多个 dsh profile 时,web 端口也要错开。

### 6.2 agent 工具(defineTool)

```js
let defineTool
try { ({ defineTool } = await import('@deepseek-ai/dsh-tools')) } catch { /* 独立运行时跳过 */ }

export function apply(ctx) {
  // …数据服务…
  if (defineTool === undefined) return
  const tools = [ /* defineTool({ name, description, parameters, output, execute }) */ ]
  ctx.effect(() => {
    const disposers = tools.map(t => ctx.tools.register(t))
    return () => { for (const d of disposers) d() }
  }, 'wb: tools')
}
```

- `inject = ['tools']` 让框架等工具注册表就绪
- 工具 `execute` 直接调用 service 层查询函数——**agent 与 BI 页面同一数据源**,零重复
- 工具描述(description)决定模型何时用它:写清用途、数据覆盖范围、以及"数据是模拟环境,不要向用户声称实时真实"之类的披露要求(实测模型会遵守)
- 提供一个"模糊查找"工具(如门店名→编号),模型会先查再查数,行为自然

---

## 7. 踩坑清单(每条都真实付出过时间)

| # | 坑 | 正确姿势 |
|---|---|---|
| 1 | 工具可选参数写 `required: false` → `JsonSchemaError: parameters.store.required must be true when present`,注册被拒(**新增工具时最易复犯,本项目犯过三次**) | 可选参数**整个省略** `required` 字段;每次加完工具 grep 一次 `required: false` |
| 2 | SVG 内 `fontSize=11` 被放大成 8000px 巨型字形,页面出现神秘色块 | viewBox 单位≠屏幕像素;**标签/文字用 HTML 覆盖层**(百分比定位),SVG 只画路径;描边宽度按 `px × viewBox宽/像素宽` 换算 |
| 3 | CSS reset `.page button { padding:0 }` 盖掉了组件类 | reset 用 `:where(.page) button` 降零优先级 |
| 4 | 世界地图跨 180° 经线的国家(俄罗斯/斐济)渲染拉丝 | 预处理阶段拆环(经度跳变处切分),并按视野裁剪国家集合 |
| 5 | `package.json` files 漏掉 `service/` → 发包后 Host 半区 import 失败 | files 收全;`npm pack` 后必须装进新 profile 实测启动 |
| 6 | `dsh --profile x web` 报 too many arguments | 没有 `web` 子命令:`dsh --profile x --port …` |
| 7 | `dsh plugin add` 初建的 profile 是 base 模板,没有 web 壳;**且 add 中途崩溃后重试会显示 Already up to date 而跳过 bundle 登记**,留下 pending/无法解析的残废 profile | 先 `--from-default-profile web` 重置再 add;若 add 崩溃,恢复 = 检查 profile 的 package.json(dependencies 与 dsh.profile.bundles 都须用**包名**,不能用目录名)补齐后跑 `dsh plugin --profile <名> install`;或删 profile 重来 |
| 8 | 首启造数失败留下半成品库,之后永远跳过造数 | 造数 try/catch → 回滚 + 删库文件 + 抛错重试 |
| 9 | `dsh-tools` 顶层 import 让独立运行(node index.js)直接崩 | 动态 import + try/catch,失败则跳过工具注册 |
| 10 | 版本漂移风险 | `engines.dsh` 锁范围 + 升级时 diff 官方包的插槽用法 |
| 11 | web 壳换端口后,页面 fetch 数据服务全部空态(CORS 拦截) | Host 数据服务的 CORS 白名单必须覆盖**每个** web 壳端口;多工作台并存时各自登记,或用环境变量注入 |
| 12 | 想让插件"替用户向会话发提示词"——没有公开 API(提交权归用户,Input 触发器包只管 / 菜单) | 标准做法:生成带上下文的提示词 → `clipboard.writeText` → `ctx.layout.selectPanel('conversation')` 跳转,用户粘贴发送;按钮文案如实说"已复制" |
| 13 | 并发 AI 会话共享同一工作目录时,曾出现单文件静默损坏(冒号被批量替换),提交后才在构建中暴露 | 多会话/多代理**不要共享同一工作目录**;git 提交前跑一次构建作门禁(esbuild 语法检查能抓住这类损坏) |
| 14 | 页面组件**丢失 `.tll-page` 根容器** → reset(`.tll-page :where(button)`)与页面级样式全部落空,dsh 外壳的按钮默认描边/内边距漏入,tab 变"裸盒子"。曾因重写页面组件(接真数据)时丢掉包装层,带病运行多个版本 | 每个主面板组件根节点**必须是 `<div className="tll-page">`**(样式作用域根);重写页面时先保住根容器;断言:`document.querySelectorAll('.tll-page').length === 1` |
| 15 | **用了没 import 的标识符**(`Pill is not defined`)——esbuild 不做引用检查,构建全绿但页面渲染即崩,整面板被卸载 | 新页面写完立刻逐页签 DOM 断言(浏览器实测);或引入 `tsc --noEmit` 做静态引用检查;这是 #17 类错误的又一变体 |
| 16 | **多插件共存互拆 sprite**:图标 sprite 的幂等守卫若用全局属性名(不带包名),两个工作台插件共存时后挂者跳过挂载、先卸载者的清理把共享 sprite 一起拆掉——后者图标全灭且无报错 | 文档级挂载物(sprite 等)一律**按包名命名空间化**:`data-<前缀>-icon-sprite-<包名>`,守卫只认自己的属性、卸载只拆自己挂的;theme.ts 的 PKG 常量由 scaffold 自动改名 |
| 17 | **本地 link 安装的依赖解析绕过 profile** → `Cannot find package 'x' imported from /path/to/plugin/index.js`(pnpm 步骤成功,但插件激活失败 `1 entry did not activate`) | `install_bundle` 对本地目录做 `link:` 安装,Node 按 ESM 的 **realpath** 向上找 `node_modules`,profile 的不在路上(同机实测:零依赖 link 插件 ✅ / registry 安装带依赖 ✅ / link 安装带依赖 ❌)。**先在插件目录 `npm install`**(start.sh 已自动做);registry 安装无此问题(pnpm 平铺进 profile)。`@deepseek-ai/dsh-tools` 在 npm 上(0.0.1-rc.1)远低于运行时,勿装成真实依赖——动态 import + try/catch(坑 #9)是正解 |
| 18 | `defineTool` 可选参数写 `required: false` → 真实错误文案是 `JsonSchemaError: parameters.store.required must be true when present` | 可选参数**整个省略** `required` 字段;guard 已检查并带上这句原文,新增工具后 grep 一次 |
| 19 | 生成的插件在 Plugins 页**没有标题/描述/图标**(缺 `locale/*.json` 的 `meta.title`/`meta.description` 与 `icon.svg`) | `files` 必须含 `locale/*.json` 与 `icon.svg`;`exports` 必须导出 `./locale/*.json` 与 `./icon`(官方 host-plugin.md 清单);缺失时官方回落到 package.json 的 name/description 与默认占位图。图标按 artwork.md 画:36×36 viewBox、字标用路径不用 `<text>`、不画底板 |
| 20 | 函数插件漏 `export const inject = [...]` → `cannot get property "sessionProjections" without inject`;**import 成功、插件启动后才炸**(运行到那一行才抛) | 消费哪个 face 就在 `inject` 里声明哪个(`['slots','locale','sessionProjections','tools']`);错误文案本身会教你缺什么。类插件用 `static inject = [...]`(实战出处:dsh-plugin-field-notes.md 错误 2) |

---

## 8. 验证工作流

1. **service 层先行**:`node -e "import('./service/api.mjs')…"` 直测每个查询函数的返回形状(不等 UI)
2. **boot 验证**:重启后 grep 日志(数据服务就绪 / 已注册 N 个工具 / JsonSchemaError);
   本地 link 插件的改动用 `plugin_manager set_bundle <名> enabled=false` → `enabled=true` 关开重载,
   每次 `application` 结果明确可见(field-notes §4)
3. **页面断言**:优先 **DOM evaluate 断言**(取 `.hero .value` 文本、表格行数、首个单元格)而非截图——大数据 SVG 页面截图像素管线可能出伪影,DOM 永远是真值
4. **打包验证**:`npm pack` → `dsh plugin --profile <临时> add ./x.tgz` → 起一次看日志 → 清理
5. **agent 闭环**:`curl`/直测工具函数 → 看注册日志 → 配 Key 后在聊天里问一个必须用工具才能答的问题(如"XX店昨天卖了多少")
6. **明暗双主题**(官方 verification.md 硬项):页面在默认(wb)与暗色变体(terminal)下各过一轮 DOM 断言——wb- tokens 偏离登记册声明了明暗由 DESIGN.md 自担,实测即兑现方式
7. **UX 评审**(官方要求 expert review):AI 按 DESIGN.md Do/Don't 自查空态/焦点/对比度/禁用态;最终视觉验收归用户
8. **认证访问**:验证页面一律走日志里带 token 的地址(start.sh 会直接打印),不猎 token、不配免认证
9. **状态自检**(探针工具):若插件维护了内部状态(计数、缓存、投影),注册一个"读状态"的工具,
   让 agent 直接断言数值——而不是靠肉眼看 UI。数值偏大但看着合理 = fork 守卫或继承边界出了问题
   (§11 session projection 行的静默坑就是这么抓出来的)
10. **诚实边界**(官方 plugin-development.md:"installation and slot registration alone do not
    establish what the user sees"):注册成功 ≠ 用户看得见。introspection 能证明"注册成功+数值正确",
    "用户真的看到"必须浏览器实测——报告验证结论时把这两层分开说(field-notes §6)

---

## 治理:规则裁决与偏离登记(三层金字塔)

官方 dsh-doc 成体系后,它和我们自己的规范/门禁/红线会撞车——撞车时靠程序裁决,不靠临场感觉。
生成项目的 AGENTS.md 里有生效版(必读第一位就是官方规范);这里是框架说明与登记台账的出处。

**三层定序**:

| 层 | 内容 | 地位 |
|---|---|---|
| ① 平台事实 | 官方 dsh-doc(与运行版本对齐)+ 运行中 dsh 的实际行为 | 机制与禁令的最终来源,不可协商 |
| ② 项目规范 | AGENTS.md 红线/默认策略 + EXAMPLES.md + 本 playbook | 与①对齐处是引用;独有发现自主维护;**有意偏离必须声明式入册** |
| ③ 执行门禁 | guard 五件套 + tsc + smoke | ①② 中可静态检查的子集,防回归 |

**裁决四步**(①与②冲突时):核实(读版本对齐的官方规范,注意快照 VERSION.txt 可能过期)→
分类(平台强制 → 对齐官方改实践;风格选择 → 声明式偏离入册;判据 = 违反是否破坏机制或伤害他人)→
落地(实践修复 + 门禁化一次提交)→ 传播(AGENTS.md 与 playbook 同步,防复发)。

**登记实例**(生效版在生成项目 AGENTS.md「偏离登记册」):

| 条目 | 偏离 | 理由 | 代价 | 复查触发器 |
|---|---|---|---|---|
| wb- 设计 tokens | 不消费宿主 `--dsw-alias-*`,自持 wb-* 体系 | 独立风格产品面 + 多设计语言切换全靠自有 token | 宿主明暗切换不跟随,明暗由 DESIGN.md 自担(dsh 验证清单要求明暗双主题实测) | dsh 大版本升级 / ui-plugin.md 主题规则变更 |

反面教材(裁决程序发明前的糊涂账):红线 #5 曾要求 import 官方图标包挂 sprite——后来核实
practices.md「插件不得 require/load Harness Client 包」才反转成 vendored 方案;早入册早免疫。

**裁决程序实例(2026-11-22 首次完整走通)**:外部评审(dsh-workbench-template-review-prompt.md,9 条发现)
→ 整改(8 条采纳,2 条以官方规范原文反证推翻:icon 照抄违反 artwork.md 三条、sync-shared 是
休眠死机制)→ 评审方独立复核认账两处、反抓整改两处遗留(§11 残留行、projection 检查漏扫 Host 半区)
→ 全部闭合(9581418)。经验:①评审与整改互核时,裁决程序第 1 步「回代码/官方原文核实」双方都要做,
引用转述不算证据;②整改方修措辞时要 grep 机制名而非只 grep 措辞。

---

## 9. 新工作台落地清单(脚手架 + AI 手册,勿手抄)

**本仓库的 `skeleton/` 是唯一源**:空白起步首页 + 9 页范式示例(「示例·工作台」面板,`SHOW_EXAMPLES` 开关)+
AGENTS.md(AI 手册)+ docs/EXAMPLES.md(范式索引与红线)+ guard 门禁(红线/边界/元数据/随行/包禁令/token 纪律/tsc/冒烟/语法)+ start.sh。
**代际声明**:dsh-workbench-sample(v0.4.0-sample,tll- 代)冻结为历史教学参照,其代码含已被官方禁用的
旧机制(import Harness Client 图标包)——不得作为现行范式抄;机制与范式以 skeleton/ 为准(README 同款声明)。
三种起跑方式:

```sh
# ① CLI(推荐)
node scaffold.mjs /path/to/new-wb --name dsh-<id> --id <id>
# ② 页面化:样板侧边栏「新建工作台」输入路径,结果页有可直接复制的命令块与首次提示词
# ③ 聊天:让 agent 调 wbs_scaffold 工具
```

生成后(结果页命令块可直接整段复制,profile 名 = 插件 id):

```sh
cd /path/to/new-wb && npm install && npm run build
npx @deepseek-ai/dsh --profile <id> --from-default-profile web --port 3124   # 首次:补 web 壳(坑 #7;3080 被占时须带 --port)
npx @deepseek-ai/dsh plugin --profile <id> add /path/to/new-wb
npx @deepseek-ai/dsh --profile <id> --no-open --port 3123
# 以后重启:项目根目录 ./start.sh [profile] [port]
```

**AI 开发动线**:首次提示词(结果页可复制)→ AI 读 AGENTS.md / EXAMPLES.md → 按 9 页范式实现业务 →
每次改动 npm run guard && npm run build 全绿 → 交付说明。
实战记录:两次(dsh-test、dsh-test-2)从生成到页面交付 13~23 分钟,红线全守。

## 11. 机制验证清单(dsh 能力 × 实证状态)

> 新工作台选型前先看这张表:✅ 已实证可直接抄(参照列指出参考实现位置);⬜ 未验证(用了要自己试);⛔ 有边界。

| dsh 能力 | 状态 | 参考实现 | 要点 |
|---|---|---|---|
| bundle 安装(目录链接 / tgz / npm 包名) | ✅ | 全部 | `files` 必须含 `service/`;`engines.dsh` 锁版本 |
| client 闭包工厂 bundle(esbuild 单文件) | ✅ | `build.mjs` | 运行时外部依赖只有 react/jsx-runtime(种子表 §4) |
| 主面板 `main`(keyed) | ✅ | `src/client.tsx` | key=面板 id;`inject` 可向组件传 navigate 等回调 |
| 侧边栏入口 `sidebar.panellist` | ✅ | `src/client.tsx` | order 负数可排在官方「插件」前;自动进「更多」菜单 |
| 品牌替换 `sidebar.brand.mark/name` | ✅ | `src/brand.tsx` | 文字用 currentColor 适配深浅主题 |
| 面板跳转 `layout.selectPanel` | ✅ | 经营分析落地页 | `'conversation'` 保留键可跳聊天 |
| 会话注入提示词 | ⛔ | — | 无公开 API(提交权归用户);用"复制提示词+跳转会话"替代(#12) |
| agent 工具 `defineTool` | ✅ | `index.js` | 可选参数省略 required;描述写数据范围与披露要求 |
| **webServer 前缀路由**(同源 HTTP,推荐) | ✅ | `index.js` | `ctx.webServer.register({kind:'prefix', path:'/wbs-api', handler})` + `connection.requestRejection` 鉴权;零 CORS、零端口分配;**借鉴社区插件 dsh-media-desk** |
| ~~HTTP sidecar 独立端口~~ | ⛔ 已被上项替代 | — | 曾用 127.0.0.1:3777;缺点:CORS 白名单、端口分配、无鉴权。仅当目标 dsh 无 webServer 服务时考虑 |
| SQLite(node:sqlite) | ✅ | `service/` | 造数失败删库重试;确定性 PRNG |
| 插件管理 UI 识别 | ✅ | 插件页 | bundle 描述展示、启用开关 |
| client.js rev/HMR | ✅ | — | client 改动刷新即生效;Host 改动需重启 |
| npm pack 分发 | ✅ | prepack 钩子 | 装入全新 profile 实测通过 |
| **ctx.llm Host 直调模型** | ✅ | `service/ai.mjs` | `ctx.get('agentDefaultModel').currentSelection()` 取选型 → `llm.prepareCall(...).stream()` 流式;不可用时显式降级(借鉴 dsh-media-desk);已用于「AI 解读」页 |
| **SSE 流式到页面**(逐字输出) | ✅ | `index.js` `/ai-read-stream` + `src/api.ts` `fetchAiReadStream` | 路由自写响应(dispatch 返回 undefined 不包 JSON)→ `text/event-stream` 逐段转发 streamChat 增量;页面 ReadableStream 解析 `data:` 帧 |
| **官方图标系统**(vendored + sprite) | ✅ | `skeleton/src/design/icons-data.ts` + theme.ts mountIconSprite + `WbIcon` | 官方图形**vendored 进包**(`npm run vendor-icons` 提取,106 glyph × 2 权重);symbol id = `<前缀>-icon-<glyph>-<weight>`(随项目前缀改名),sprite 挂载按包名命名空间化(坑 #16)防共存互拆;插件不得 import Harness Client 包(practices.md) |
| **skeleton 唯一源**(镜像机制已退役) | ✅ | — | 根仓 src/ 是生成器自己的 ScaffoldPage 应用,**不消费** theme/examples——无同步无比对(旧 `sync-shared.mjs` 方向描述失实、pairs 含已删文件、真跑必崩,2026-11-22 退役);防漂移靠唯一源纪律:改 skeleton 即改源。主代码 import 示例区直接 fail(guard 边界) |
| **tsc 静态引用检查**(guard 内置) | ✅ | `tsconfig.json`(lenient) | esbuild 不查标识符引用(坑 #15);骨架零 client 包运行时依赖后,自维护类型面(vendor.d.ts)已随之退役 |
| **插件数据目录**(升级不丢数据) | ✅ | `skeleton/service/db.mjs` | 数据落 `<profile根>/data/<包名>/`(向上找 dsh.profile 标记推导)——GitHub/npm 安装的包目录在 update 时会被整体替换,数据放包内=升级即清空;link 安装回退包内。表结构演进用 PRAGMA user_version + 迁移步骤,勿裸改 CREATE TABLE |
| **session projection**(会话派生状态) | ✅(骨架固件;fork 场景由实战 session-inspector 双向实证) | `skeleton/service/session-stats.mjs` + 官方 action-cards | Host 半区 `ctx.sessionProjections.register({key,stateVersion,stateSchema,init,apply,wire})`;`apply` 纯+同步,不关心的事件返回同一引用;`state` 必须 plain JSON;**fork 守卫必须加**:`init` 存下 `inheritedEventCount`,`apply` 首行 `if (event.seq < state.inheritedEventCount) return state`(否则 fork 会话把父历史算成自己的,静默偏大不报错);改折叠语义必须 bump `stateVersion`;客户端 `useProjection(key)` 读成品值不折叠事件;`stateSchema`/`viewSchema` 必须是真 zod(擦除契约只要 `parse()`,但手搓假 schema 在冷读/导出路径炸);key 从未发布时 `useProjection` 读到 `undefined`——是值不是错误,组件可先订阅后等值;⚠️ `main` 插槽的 `standardProps` **没有** `useProjection`(只有 `sidebar.right.pane.tab` 等有,cordis_inspect 实测) |
| **右侧栏 tab 类型**(`sidebarRightTabs`) | ✅(骨架示例 + 工具箱双实证) | `skeleton/src/examples/SessionLinkageTab.tsx` | `ctx.sidebarRightTabs.register({id,kind,title,guide})` 注册**类型**,再往 `sidebar.right.pane.tab` / `.title` 两个 keyed 槽注册 body/title(key = type 的 id);⚠️ **`guide` 省略 = 不上 guide 页 = 界面打不开**(官方源码注 "Omit to stay off it",注册仍报 success) |
| **探针工具**(自检模式) | ✅ 建议采用 | 本仓 `wbt_scaffold` / `wbt_uninstall` | 给插件注册一个"读内部状态"的工具,让 agent 直接断言数值而非肉眼看 UI——能抓出静默 bug(数值看着合理但偏大);见 §8 第 9 条 |
| **零构建双面包**(纯 JS 手写产物形态) | ✅ | 实战 `dsh-session-inspector`(279 行)+ 官方 `templates/decoration` | 无 src/lib/构建配置,`index.js`/`client.js` 直接是出货形态;client 侧无 JSX 转换,用 `React.createElement`;不需要 TS/JSX 时这是最短路径(实战出处:dsh-plugin-field-notes.md §3) |
| **本地插件重载手法**(`set_bundle` 关→开) | ✅ | 实战验证 | 比 `install_bundle` 更可控(不重跑 pnpm),每次 `application` 结果明确可见;本地 link 插件改代码后 关→开 触发 Loader 重算(实战出处:field-notes §4) |
| **图标命名:npm 镜像与运行时不同步** | 🔶 | 实测(dsh-ai-toolbox) | npm 发布包 62 个唯一图形 vs 运行时 seed 表 96+,命名不一致——选图标以**运行时实测**为准(在浏览器里枚举),npm 文档仅参考 |
| **V8 新版 SyntaxError 不带 position** | 🔶 | dev-toolbox JsonFormatter | Node 24/V8 新版错误对象无 position 字段,行号反推失效——兜底方案:递归下降结构扫描器(只定位不建值) |
| **插件级 Config + locale**(示范已入骨架) | ✅ | `skeleton/index.js`(Config)+ `skeleton/src/locales.ts` | Config=Schema.object → apply(ctx, config) 第二参;locale=inject 'locale' + ctx.locale.register/bind 经 inject face 下发 t;**配置表单 UI 需自绘**(plugins.row.config 插槽,契约见 AGENTS.md) |
| `shell.overlay` / `shell.bottom` 插槽 | ✅ | 封板线 main:src/client.tsx(P1-3) | 加法插槽,不替换官方内容;skeleton 未示范(例子够用) |
| `rightbar` 插槽 | ⬜ 未验证 | — | 右侧栏需求时验证 |
| schedule 自动化 | ⬜ 未验证(有起点) | 官方 `ui-schedule` 源码:inject 含 `remote.schedule` | 定时刷新/报告候选;插件侧理论可行(注入 remote.schedule),未实测——需要时立专项验证 |
| 子代理 / PTC 模式 | ⬜ 未验证 | — | 复杂多步任务时验证 |
| 深色主题完整适配 | 🔶 部分 | `src/brand.tsx` | BI 页为独立浅色面板(可接受);壳内元素需跟随主题变量 |

## 12. dsh 版本适配记录(升级 SOP + 台账)

**升级 SOP**(dsh 发新版时按此执行):
1. 隔离环境起 `npx dsh@<新版>`(不动现有 profile)
2. 放开本仓库 `engines.dsh` 范围 → 跑完整验证工作流(§8:构建 / 页面 DOM 断言 / 工具直测 / agent 闭环)
3. diff 官方包的插槽与工具用法:`ui-plugin-manager`、`ui-schedule`、`plugin-market-bundle`(§5 列出)
4. 变化写入下表台账 + 修订手册与 skeleton
5. 下游工作台按台账各自升级;体系资产两条命令跟进:`npm run vendor-icons`(重提取官方图形)+
   `npm run sync-official`(刷官方规范快照),再重新生成一项目跑端到端验收

**调研台账**(平台事实核实,未构成变化也记录):
- **官方 storage service**(2026-11-22,对 dsh-v0.2.3-alpha.1 文档):practices.md 提到
  "keep plugin-owned data in a storage service found through inspection"——**存在但无公开文档面**
  (须经 inspection 发现,属官方实验面,同段明示 Session 对实验包记录只做 best-effort 迁移)。
  结论:骨架自持 SQLite + 数据目录标准(WB_DATA_DIR → DSH_PROFILE_DIR/data → ~/.dsh/data)不与之冲突,
  继续自持;待官方把 storage service 文档化为公开面后再评估迁移(届时按裁决程序:平台事实赢)。

| dsh 版本 | 日期 | 变化 | 样板动作 |
|---|---|---|---|
| 0.2.1-rc.5 | 2026-11-03 | 初始验证基线 | 首版 skeleton + 手册;8 工具 / 5 面板 / 数据服务全链路验证通过 |
| 0.2.2-rc.1 | 2026-11-08 | npx 缓存静默升级(非主动升级)。**破坏性变化:plugins.row.config 的 form 面改为裁剪形态 `{ state, mutate(ops, revision) }`**(rc.5 的 getSnapshot/subscribe/set 被取代,op 形状 `{op:'set',path:['字段'],value}`);且本环境实测内置插件(如子智能体)的配置表单同样不渲染。根因定位到机制层:表单绑定条件是 ui-settings 的 describe 镜像(snapshot.view.namespaces)包含该插件 ns——镜像由设置页的 describe 读喂入,插件管理页自身不触发读取;**结论:非样板缺陷,系官方子系统装配行为,待 dsh 后续版本复查**(契约按官方 config-form-types.ts 已对齐) | 隐式全量验证:9 页示例 / 双门禁(guard+tsc+冒烟) / Config+locale / SSE 流式 / 两次 AI 实战(dsh-test、dsh-test-2)均在本版通过;engines 范围 >=0.2.0 <0.3 兼容,无需修订 |

---

## 10. 升级与迁移策略

- **升级**:`engines.dsh` 拒绝→ 改范围 → diff 官方包的插槽/工具用法(ui-plugin-manager、ui-schedule、plugin-market-bundle)→ 三页回归
- **走向 runtime 模式的触发条件**(满足任一):多租户 SaaS、接入公司统一账号/权限、dsh 插槽 API 破坏性变更适配成本超过自建
- **迁移成本**(现在的架构已预留):页面组件零依赖直接平移;`service/` 整体平移;唯一的重写点是 client.tsx 那 50 行注册层(换成自建前端的路由/导航)
