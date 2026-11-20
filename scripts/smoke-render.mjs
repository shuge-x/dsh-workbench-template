/**
 * 渲染冒烟门禁:逐个页面组件 renderToString,抓 esbuild/tsc 都抓不住的「渲染即崩」
 * (坑 #15 的运行时形态:未导入标识符、props 契约错误、渲染期空指针)。
 *
 * 原理:临时生成一个入口,对 src/pages/*.tsx 与 src/examples/*Page*.tsx 的每个
 * 导出组件(名字以 Page/Panel 结尾)renderToString;官方图标包用 stub 替身
 * (冒烟只验我们的代码,图标契约由 vendor.d.ts + 浏览器实测守)。
 * 约定:页面组件命名以 Page 结尾(见 AGENTS.md 工作流)。
 */
import { readdirSync, writeFileSync, mkdtempSync, rmSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import esbuild from 'esbuild'

const repo = dirname(dirname(fileURLToPath(import.meta.url)))
let failures = 0
// react/react-dom 由 peerDependencies 自动安装;缺省环境(未 npm install 的骨架源)优雅跳过
if (!existsSync(join(repo, 'node_modules/react-dom/package.json'))) {
  console.log('[smoke] 跳过(react-dom 未安装;npm install 后自动启用)')
  process.exit(0)
}
const fail = (msg) => { console.error(`[smoke] ✗ ${msg}`); failures += 1 }

// 官方包替身:契约面与 src/vendor.d.ts 一致(渲染为空节点)
const stub = `
export const ICON_SYMBOLS = {}
export const ICON_REGULAR_STROKE = 1
export const ICON_MEDIUM_STROKE = 1.3
const Nil = () => null
export const IconProjectAddOutlineRegular = Nil
export const FileTypeIcon = Nil
export const StateDot = Nil
export const Pill = Nil
`

const tmp = mkdtempSync(join(tmpdir(), 'wb-smoke-'))
const stubPath = join(tmp, 'stub.mjs')
writeFileSync(stubPath, stub)

// 收集页面文件 → 生成入口
const groups = [
  ['pages', join(repo, 'src/pages'), readdirSync(join(repo, 'src/pages')).filter(f => f.endsWith('.tsx'))],
  ['examples', join(repo, 'src/examples'), existsSafe(join(repo, 'src/examples')) ? readdirSync(join(repo, 'src/examples')).filter(f => /^.*Page\.tsx$/.test(f)) : []],
]
function existsSafe(p) { try { readdirSync(p); return true } catch { return false } }

const imports = []
const calls = []
for (const [label, dir, files] of groups) {
  for (const f of files) {
    const abs = join(dir, f)
    const mod = 'm' + imports.length
    imports.push(`import * as ${mod} from ${JSON.stringify(abs)}`)
    calls.push(`  check(${mod}, ${JSON.stringify(`${label}/${f}`)})`)
  }
}
const entry = `
import { renderToString } from 'react-dom/server'
import { createElement } from 'react'
${imports.join('\n')}

function check(mod, label) {
  for (const [name, value] of Object.entries(mod)) {
    if (typeof value !== 'function' || !/(Page|Panel)$/.test(name)) continue
    try {
      const html = renderToString(createElement(value, {}))
      if (!html || html.length < 10) throw new Error('渲染输出为空')
      console.log('[smoke] ✓ ' + label + ' :: ' + name)
    } catch (e) {
      console.error('[smoke] ✗ ' + label + ' :: ' + name + ' — ' + String(e && e.message || e))
      process.exitCode = 1
    }
  }
}
${calls.join('\n')}
`
const entryPath = join(tmp, 'entry.tsx')
writeFileSync(entryPath, entry)

try {
  await esbuild.build({
    absWorkingDir: repo,
    nodePaths: [join(repo, 'node_modules')],
    entryPoints: [entryPath],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    outfile: join(tmp, 'bundle.cjs'),
    jsx: 'automatic',
    alias: { '@deepseek-ai/dsh-client-ui-primitives': stubPath },
    logLevel: 'silent',
  })
  createRequire(import.meta.url)(join(tmp, 'bundle.cjs'))
  } catch (e) {
    const detail = Array.isArray(e?.errors) ? e.errors.map(x => x.text).slice(0, 6).join(' | ') : String(e?.message ?? e).split('\n')[0]
    fail('冒烟构建/执行失败: ' + detail)
  } finally {
  rmSync(tmp, { recursive: true, force: true })
}

if (failures > 0) { console.error('[smoke] 冒烟未过,发布阻断'); process.exit(1) }
console.log('[smoke] 全部页面渲染通过')
