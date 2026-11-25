# design/ — 设计语言库

每个 `.md` 是一套完整的设计语言(designmd.ai 格式:YAML tokens + 哲学 + Do/Don't)。
各套设计的取值另有**运行时包**(`src/design/variants.ts`),由切换器即时应用——**换设计不需要改 `src/theme.ts`**。

## 库存

| 文件 | 语言 | 适用 |
|---|---|---|
| `DESIGN.md` | 工作台中性(默认) | 数据/管理类工作台——暖米色画布、松墨文字、蓝色强调 |
| `DESIGN-terminal.md` | 开发者暗色终端风 | toolbox / 日志 / API 调试——深炭底、等宽、终端绿 |
| `DESIGN-paper.md` | 纸感编辑器风 | 写作 / 笔记 / 文档审阅——暖纸底、衬线阅读、极简界面 |
| `DESIGN-drafito.md` | 商店绿(用户珍藏) | 电商/订阅商店——白画布、祖母绿信号色、药丸按钮、会员卡签名组件;含完整暗色主题与响应式全档 |

> **关于 DESIGN-drafito.md**:原文一字未改收录(用户珍藏)。注意它使用**自己的 token 命名**
> (colors.primary / ink / surface / store-panel…,而非 wb- 的 bg/card/ink-2)。往 `src/design/variants.ts` 写它的覆盖包时
> 按语义映射:bg→`--wb-bg`、surface→`--wb-card`、surface-2→`--wb-card-2`、border→`--wb-line`、
> ink / ink-2 / ink-3→`--wb-ink` / `--wb-ink2` / `--wb-ink3`、primary→`--wb-accent`、success/warning/danger→`--wb-ok/warn/err`。
> 语义一一对应,可放心翻译。

## 换设计

**随时切换(用户操作,零改动)**:页面顶栏的切换器 `DesignSwitcher`(`src/design/switcher.tsx`)在各变体间即时切换——
覆盖包以 `html[data-wb-variant="<id>"]` 为作用域,localStorage 记住选择。
固件不预置页面,所以这个组件默认没有被挂载;第一个业务页面的顶栏右侧要放 `<DesignSwitcher />`(AGENTS.md 工作流第 2 步)。

**改默认设计(一次性决定)**:

1. 从本目录选一份变体,用它覆盖项目根目录的 `DESIGN.md`(契约文档——AI 写 UI 时读的就是它)
2. `src/design/switcher.tsx` 里把 `DEFAULT_VARIANT` 改成该变体的 id(只有这一处)
3. `npm run build` → 刷新浏览器。`src/theme.ts` 不用动:它是所有变体共享的基线 token 与组件类

**调整某套设计本身的取值**:改 `src/design/variants.ts` 里该变体的覆盖包(运行时生效),并同步对应的
`DESIGN-<风格>.md` 的 YAML(契约)。两处同源配对——只改一处,文档与实现就漂移了。

## 加一套新设计(两个文件同源配对)

1. 新建 `DESIGN-<风格名>.md`:复制任一现有变体,改 YAML 与正文(契约)
2. 在 `src/design/variants.ts` 的 `VARIANTS` 里加一个运行时包 `{ id, label, css }`,css 以
   `html[data-wb-variant="<id>"] .wb-page { … }` 为作用域覆盖 token(机器)
3. **token 名保持稳定**(bg / card / line / ink / ink2 / accent / 语义色)——变的只有值与少量结构覆盖;
   变体只在 `.wb-page` 上覆盖变量,所以页面与示例源码都不用改
4. 补充进上表

## 纪律

- 示例面板与 examples 源码是**范式**(结构与行为),`DESIGN.md` 是**视觉**(颜色/字排/密度)——两层独立
- 换 `DESIGN.md` 不改 examples 源码;示例的渲染效果会自然跟随当前生效的变体取值
- YAML 里 `{token.refs}` 引用一律不写死裸值
- `src/theme.ts` 里凡是会随设计变的取值(颜色、圆角、数字 / 序号字体、行悬停、焦点环)一律写 `var(--wb-*)`,
  不写死——写死的值在切换设计语言时不会变(曾因此只换得了颜色)。新增 token 时先在基线块(`.<前缀>-page`)
  给默认值,变体包里再覆盖;guard 的「设计语言完整性」检查会拦下漏掉的
- `src/styles.ts`(页面级公共样式)不重定义 token、不覆盖 `theme.ts` 的组件类——两处写了同一个选择器时,
  排在后面的会悄悄盖掉主题
