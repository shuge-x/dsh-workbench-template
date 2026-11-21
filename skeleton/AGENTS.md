# AGENTS.md — AI 开发手册

> 给任何加载本目录的 AI 开发工具(ClaudeCode / Codex / OpenCode / dsh 会话)。
> 本项目由 dsh 工作台脚手架生成:**页面范式照示例抄,业务内容是你的需求——抄范式,不抄剧情。**

## 项目身份与结构地图

这是一个 dsh web 插件(工作台),双半区:

```
index.js            Host 半区:webServer 前缀路由 /wb-api/*(同源数据服务)+ agent 工具(wb_*)
                    + Config(Schemastery:apply(ctx, config) 第二参消费,值经 profile cordis.yml 持久化,HMR 热重载)
                    · 配置的 UI 表单不是自动的:需注册 plugins.row.config 插槽自绘表单
                      (契约:form.getSnapshot/set/subscribe,view='summary'|'page';
                       参考实现:样板仓库主分支 main:src/pages/ConfigPage.tsx)
service/            数据层:api.mjs(查询函数)/ db.mjs(SQLite)/ seed.mjs(首启造数)
src/client.tsx      Client 半区唯一 dsh 耦合点:PANELS 注册面板 + locale 字典注册(esbuild 单文件 bundle)
src/locales.ts      本地化命名空间(zh/en 键一致);页面经 inject face 的 t() 取词
src/theme.ts        设计系统:wb- tokens + 基础组件类 + 官方图标 sprite 挂载(共享资产)
src/api.ts          前端请求层:同源 fetch 封装(get/post/stream)
src/pages/          ★ 你的业务页面(主代码,长期演进;首页起步页刻意空白,业务从零填充)
src/examples/       示例区:9 个范式页(教学代码)。源码常驻供 AI 阅读,但默认不注册进侧栏
                    ——要看渲染效果把 src/client.tsx 的 SHOW_EXAMPLES 置 true;可整体删除
docs/EXAMPLES.md    范式索引 + 红线映射表(AI 开发先读它)
scripts/guard.mjs   门禁:红线机器检查,发布前必过
```

## 红线(违反 = guard 阻断或运行时崩)

1. 每个页面组件根节点必须是 `<div className="wb-page">`——样式作用域根,缺失则外壳样式漏入(坑 #14)
2. `defineTool` 可选参数**整个省略 `required` 字段**,禁止写 `required: false`(坑 #1,注册被拒)
3. **主代码(src/pages)禁止 import src/examples**——示例必须可整体删除(guard 边界检查)
4. `src/theme.ts` 是共享资产:只用不删;要加词汇在尾部追加,不改动既有类
5. 图标优先用官方包 `@deepseek-ai/dsh-client-ui-primitives`(sprite 已由 theme.ts 挂载)——先到「示例·工作台 → 图标规范」搜合适的官方图形;确实没有才自绘,放进 src/icons.tsx 并注明用途。禁止整段拷贝 dsh 官方 SVG 源码。
   「没有贴合图形」的判断依据:grep 官方包的图形键名 `grep -oE '"[a-z0-9-]+"' node_modules/@deepseek-ai/dsh-client-ui-primitives/lib/types/../../*/artwork* 2>/dev/null || node -e "console.log(Object.keys(require('fs').readFileSync(0,'utf8')?'':{}))"——更简单:在 Icon<Glyph><Weight> 命名规则下枚举候选名逐一试引入;判断前至少看完 96 个图形名,不许只凭想象下结论
6. SVG 里不放文字(会被 viewBox 放大,坑 #2)——标签用 HTML 覆盖层
7. 所有 `ctx.effect` 必须返回清理函数(样式/表/ sprite 卸载残留 = 幽灵样式)
8. `build.mjs` 的 external 表不要动:react 与 `@deepseek-ai/*` 运行时由平台提供,打包进去必崩

## 开发工作流(加一个页面的标准路径)

1. 读 `docs/EXAMPLES.md` 红线映射表,按意图挑示例页(总览/列表/详情/图表/表单/四态/图标)
2. 新建 `src/pages/XxxPage.tsx`,范式照对应示例页抄,内容换成业务
3. 在 `src/client.tsx` 的 `PANELS` 数组注册(id + 标题 + 图标 + page)
4. 要真数据:`service/api.mjs` 加查询函数 → `index.js` 的 `routes` 加路由 → `src/api.ts` 加 fetch → 页面调用
5. 每个取数页面**四态备齐**:加载(骨架屏)/ 空态(给下一步动作)/ 错误(带重试)/ 无权限(明确提示)
6. 完成门禁:`npm run guard && npm run build` 全绿才算完成

## 默认策略(直接按默认执行,不要作为澄清问题提出)

以下决策已由项目所有者预先拍板。除非用户明确要求改变,按默认执行即可,不要再询问:

1. **示例面板是给人看的,AI 不主动开启**:AI 的验证靠源码 + DOM 断言(精确值),
   最终视觉验收由用户完成。仅当用户明确要求对照渲染,或诊断视觉偏差确有必要时,
   说明理由后临时把 `src/client.tsx` 的 SHOW_EXAMPLES 置 true;阶段结束回滚为 false。
2. **真机预览**:可直接运行项目根目录的 `./start.sh` 起实例做渲染验证
   (默认 profile 与端口;端口被占会自动后移,无需干预)。
3. **文案语言**:默认 zh-only 快速迭代;`src/locales.ts` 双语机制保留,
   需要时再补 en 键位(键需一致)。
4. **数据与 AI 能力**:骨架自带的 SQLite/service 与 /ai-stream 保留但默认闲置;
   业务确实需要时再启用或业务化,不要提前改造。
   数据落 `<profile根>/data/<包名>/`(升级/重装不丢);表结构演进用
   PRAGMA user_version 记版本并写迁移步骤,不要裸改 CREATE TABLE。

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
