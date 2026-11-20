#!/usr/bin/env node
/**
 * 工作台脚手架 CLI:从 skeleton/ 复制一个可运行的新插件并完成改名。
 * 核心逻辑在 service/scaffold.mjs(与 HTTP 路由、agent 工具共用)。
 *
 * 用法:
 *   node scaffold.mjs <目标目录> [--name dsh-plugin-xxx] [--id xxx]
 */
import { scaffoldProject } from './service/scaffold.mjs'

const args = process.argv.slice(2)
const target = args[0]
if (target === undefined || target.startsWith('--')) {
  console.error('用法: node scaffold.mjs <目标目录> [--name dsh-plugin-xxx] [--id xxx]')
  process.exit(2)
}
const opt = (flag, dflt) => {
  const i = args.indexOf(flag)
  return i >= 0 ? args[i + 1] : dflt
}

const out = scaffoldProject({
  target,
  name: opt('--name', 'dsh-myworkbench'),
  id: opt('--id', 'myworkbench'),
})

if (out.error !== undefined) {
  console.error(`✗ ${out.error}`)
  process.exit(1)
}
console.log(`✓ 已生成 ${out.target}`)
console.log(`  包名:${out.name}   插件 id:${out.id}`)
console.log('下一步:')
for (const step of out.nextSteps) console.log('  ' + step)
console.log('详细经验见 docs/dsh-plugin-playbook.md')
