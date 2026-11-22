# dsh-workbench-template · dsh 工作台标准模板与生成器

> **装一次,输入路径,得到一个符合 dsh 规范、AI 可接手、可直接运行的工作台项目。**
> 它不是工作台,是工作台的源头:标准骨架、AI 手册、9 页范式示例、五件套门禁都在体内。

## 安装

**插件中心**:添加插件 → 输入 `dsh-workbench-template`(npm,即将上线)或 GitHub 仓库地址。

**CLI**:

```sh
# GitHub 安装(公开仓库)
npx @deepseek-ai/dsh plugin --profile <你的profile> add github:shuge-x/dsh-workbench-template
# 本地目录安装
npx @deepseek-ai/dsh plugin --profile <你的profile> add /path/to/dsh-workbench-template
```

## 使用

启动 dsh 后,侧边栏出现「**新建工作台**」:

1. 输入目标路径(如 `/Volumes/xxx/my-idea`)——插件 id 与包名自动推导,可改
2. 点「生成项目」→ 得到完整项目:标准骨架 + AI 手册(AGENTS.md)+ 9 页范式示例 + guard 门禁 + start.sh
3. 按结果页给出的命令启动;开发时把项目目录交给 ClaudeCode/Codex/OpenCode,粘贴结果页的「首次会话提示词」即可

完整文档见生成项目内的 `AGENTS.md`(AI 手册)与 `docs/EXAMPLES.md`(范式索引与红线)。

## 更新与卸载

```sh
npx @deepseek-ai/dsh plugin --profile <你的profile> update dsh-workbench-template@latest   # 更新
```

卸载:插件中心 → 本插件 → 卸载。生成出的项目与数据不受影响。

## 这套体系是什么

本仓库是 **dsh 工作台样板工程的可发布形态**:骨架唯一源 + guard 门禁(红线/边界/元数据/随行/包禁令/token 纪律/tsc/冒烟/语法)+ AI 手册
+ 官方规范随行(生成项目自带 dsh-doc)+ 治理框架(三层规则金字塔 + 偏离登记册)+ 官方图形 vendored。
完整的「重数据 BI 示范」(单店经营:SQLite 35 万行 + agent 工具 + AI 流式解读)见
[dsh-workbench-sample](https://github.com/shuge-x/dsh-workbench-sample)。

> **代际声明**:sample 冻结于 v0.4.0-sample(tll- 代际),其代码含**已被官方禁用的旧机制**
> (import Harness Client 图标包)。它只作历史教学参照,机制与范式以本仓 skeleton/ 为现行唯一源;
> 两边冲突时按 AGENTS.md 的裁决程序走(平台事实赢)。

## 开发本仓库

```sh
npm install
npm run guard && npm run smoke && npm run build   # 五件套门禁
./start.sh                                        # 起一个实例看效果
```

兼容 `@deepseek-ai/dsh` 0.2.x。License: MIT。
