# AGENTS.md — dsh-workbench-template 仓库纪律

> 本仓库是 **dsh 工作台标准模板与生成器**(可发布插件)。它不是工作台,是工作台的源头:
> 装进任意 dsh,输入路径,盖章出一个标准、AI 可接手、可直接运行的工作台项目。

## 功能边界(刻意单一)

插件只做一件事:**生成器**。侧栏一个入口「新建工作台」,输入路径 → 盖章 `skeleton/` →
交付自带 AI 手册(AGENTS.md)、9 页范式示例、guard 门禁、start.sh 的完整项目。
不加业务页面、不加数据服务、不加演示——示范与参考在 [dsh-workbench-sample](https://github.com/shuge-x/dsh-workbench-sample)。

## 结构与唯一源

```
skeleton/     ★ 骨架唯一源(无镜像机制——它就住在家里)
src/          本插件自身 Client(仅新建工作台面板)
index.js + service/scaffold.mjs   Host:生成器路由 + wbt_scaffold 工具
scripts/      guard(红线/边界/tsc/渲染冒烟)+ smoke-render
start.sh      一键启动本插件实例
```

- **改 skeleton 直接改**(它在本仓库根,无副本无漂移);`npm run guard && npm run build` 全绿后提交
- guard 检查:坑#1/#14、主代码边界、tsc 引用、渲染冒烟(本仓库 UI 用 tll- 前缀,生成项目用 wb- 前缀)
- client.js 是**预构建产物,必须随提交**——GitHub 安装不走构建(pnpm 默认拦 git 依赖的构建脚本)
- `@deepseek-ai/dsh-*` 系列包只允许出现在 peerDependencies(运行时由 dsh 宿主/profile 提供);
  本仓库自身安装用 npm(其 peer 链含未公开包,pnpm 直装会撞 dsh-type-meta)

## 验证与发布

- 本地验证:`npm run build && npm run guard && npm run smoke` + 浏览器实测(生成一个测试项目走通)
- 发布:git push 即发布(GitHub 安装拉最新 main);版本节奏用 git tag(v0.1.0 起)
- 升级 dsh:按 docs/dsh-plugin-playbook.md §12 SOP;注意 plugins.row.config 契约变化记录

## 已知开放问题

- 配置表单 page 视图在本环境不渲染(官方 describe 镜像装配行为,内置插件同样)——本插件无配置表单,不受影响
- locale en 双向切换已验证(在骨架示范中)
