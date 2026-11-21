# design/ — 设计语言库

每个 `.md` 是一套完整的设计语言(designmd.ai 格式:YAML tokens + 哲学 + Do/Don't)。
**骨架零改动**:换设计 = 换一份 md + 让 AI 按其 tokens 更新 theme.ts。

## 库存

| 文件 | 语言 | 适用 |
|---|---|---|
| `DESIGN.md` | 工作台中性(默认) | 数据/管理类工作台——暖米色画布、松墨文字、蓝色强调 |
| `DESIGN-terminal.md` | 开发者暗色终端风 | toolbox / 日志 / API 调试——深炭底、等宽、终端绿 |
| `DESIGN-paper.md` | 纸感编辑器风 | 写作 / 笔记 / 文档审阅——暖纸底、衬线阅读、极简界面 |
| `DESIGN-drafito.md` | 商店绿(用户珍藏) | 电商/订阅商店——白画布、祖母绿信号色、药丸按钮、会员卡签名组件;含完整暗色主题与响应式全档 |

> **关于 DESIGN-drafito.md**:原文一字未改收录(用户珍藏)。注意它使用**自己的 token 命名**
> (colors.primary / ink / surface / store-panel…,而非 wb- 的 bg/card/ink-2)——AI 更新 theme.ts 时
> 按语义映射:bg→bg、ink→ink、primary→accent、line→border、surface→card。语义一一对应,可放心翻译。

## 换设计(三步,AI 可代办)

1. 从本目录选一份变体,复制其内容覆盖项目根目录的 `DESIGN.md`
2. 让 AI 按该变体的 YAML tokens 更新 `src/theme.ts` 的对应值(token 名不变,只换值)
3. `npm run build` → 刷新浏览器

## 加一套新设计

1. 复制任一现有变体为 `DESIGN-<风格名>.md`,改 YAML 与正文
2. **token 名保持稳定**(bg/card/line/ink/ink-2/accent/语义色)——变的只有值;
   theme.ts 的变量名不变,所以任何设计语言都能无痕接入
3. 补充进上表

## 纪律

- 示例面板与 examples 源码是**范式**(结构与行为),DESIGN.md 是**视觉**(颜色/字排/密度)——两层独立
- 换 DESIGN.md 不改 examples 源码;示例的渲染效果会自然跟随 theme.ts 的新值
- YAML 里 `{token.refs}` 引用一律不写死裸值
