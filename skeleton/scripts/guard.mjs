/**
 * 工程门禁(骨架版; stamped 项目自带)。
 *  坑 #1  defineTool 可选参数 required:false → JsonSchemaError
 *  坑 #14 页面组件缺 .wb-page 根容器 → 样式作用域全失效
 *  边界    src/pages 主代码禁止 import src/examples(示例必须可整体删除)
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { join } from 'node:path'

let failures = 0
const fail = (msg) => { console.error(`[guard] ✗ ${msg}`); failures += 1 }
const ok = (msg) => console.log(`[guard] ✓ ${msg}`)

// 坑 #1
const hostFiles = ['index.js', ...readdirSync('service').map(f => join('service', f))]
for (const f of hostFiles) {
  if (statSync(f).isFile() && readFileSync(f, 'utf8').includes('required: false')) {
    fail(`${f} 含 required: false(坑 #1:可选参数整个省略 required 字段)`)
  }
}
if (failures === 0) ok('工具参数无 required: false(坑 #1)')

// 坑 #14
// ConfigPage 等插槽视图渲染在插件管理页里,不是主面板,不要求页根
// 固件态:src/pages 可为空(零面板固件)——目录缺失时跳过页面级检查
if (!existsSync('src/pages')) {
  ok('固件态:无已注册页面(开工 AI 按 AGENTS.md 工作流创建)')
} else {
  const pageFiles = readdirSync('src/pages').filter(f => f.endsWith('.tsx') && f !== 'ConfigPage.tsx')
  for (const f of pageFiles) {
    const src = readFileSync(join('src/pages', f), 'utf8')
    if (!/className=\{?["'`]wb-page[\s"'`\}]/.test(src) && !src.includes('wb-page')) {
      fail(`${f} 缺 .wb-page 根容器(坑 #14)`)
    }
  }
  if (failures === 0) ok(`页面根容器 .wb-page 齐全(${pageFiles.length} 个,坑 #14)`)
}

// 边界:主代码不得 import 示例区
if (existsSync('src/examples')) {
  const own = existsSync('src/pages') ? readdirSync('src/pages').filter(f => f.endsWith('.tsx')) : []
  for (const f of own) {
    if (/from\s+['"].*(examples|\/examples)/.test(readFileSync(join('src/pages', f), 'utf8'))) {
      fail(`${f} import 了示例区——主代码与示例必须零耦合(删示例要能全绿)`)
    }
  }
  if (failures === 0) ok('主代码未耦合示例区(边界)')
}

// 静态引用检查:esbuild 不查标识符引用(坑 #15:`Pill is not defined` 构建全绿、渲染即崩)
const tscBin = join('node_modules', '.bin', 'tsc')
if (existsSync(tscBin)) {
  try {
    execSync(`node ${JSON.stringify(tscBin)} --noEmit`, { stdio: 'pipe' })
    ok('静态引用检查通过(tsc --noEmit)')
  } catch (e) {
    const out = String(e.stdout ?? '') + String(e.stderr ?? '')
    const lines = out.split('\n').filter((l) => l.includes('error TS')).slice(0, 8)
    for (const l of lines) fail('tsc: ' + l.trim())
    if (lines.length === 0) fail('tsc --noEmit 失败(手动跑 tsc --noEmit 看详情)')
  }
} else {
  ok('跳过 tsc 静态检查(未安装 typescript,装上后自动启用)')
}

// 渲染冒烟:逐页面组件 renderToString(坑 #15 的运行时形态,渲染即崩)
try {
  const out = execSync(`node ${JSON.stringify(join('scripts', 'smoke-render.mjs'))}`, { stdio: 'pipe', cwd: process.cwd() }).toString()
  const pass = out.split('\n').filter((l) => l.includes('✓')).length
  ok('渲染冒烟通过(' + pass + ' 个组件)')
} catch (e) {
  const out = String(e.stdout ?? '')
  const errs = out.split('\n').filter((l) => l.includes('✗'))
  for (const l of errs.slice(0, 6)) fail('smoke: ' + l.trim())
  if (errs.length === 0) fail('smoke: 运行失败(手动跑 node scripts/smoke-render.mjs 看详情)')
}

// 语法检查:index.js 与 service/*.mjs 是纯 JS——TS 语法(type 注解)混入会在宿主装载时才炸(构建不查它们)
const jsFiles = ['index.js', ...readdirSync('service').map(f => join('service', f)).filter(f => f.endsWith('.mjs'))]
for (const f of jsFiles) {
  try {
    execSync(`node --check ${JSON.stringify(f)}`, { stdio: 'pipe' })
  } catch (e) {
    const out = String(e.stderr ?? e.message ?? '')
    fail(`语法错误 ${f}: ${out.split('\n').slice(0, 3).join(' | ')}`)
  }
}
if (failures === 0) ok(`Host 半区语法检查通过(node --check,${jsFiles.length} 个文件)`)

if (failures > 0) {
  console.error(`[guard] ${failures} 项未过,发布阻断(规范见 docs/EXAMPLES.md 与 docs/dsh-plugin-playbook.md §7)`)
  process.exit(1)
}
console.log('[guard] 全部通过')
