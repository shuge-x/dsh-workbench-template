/**
 * 工程门禁(骨架版; stamped 项目自带)。
 *  坑 #1  defineTool 可选参数 required:false → JsonSchemaError
 *  坑 #14 页面组件缺 .wb-page 根容器 → 样式作用域全失效
 *  边界    src/pages 主代码禁止 import src/examples(示例必须可整体删除)
 *  坑 #22  Host 半区用了没 import 的标识符 → node --check 查不出,激活时才炸且整个 Host entry 失败
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { join } from 'node:path'

/** 递归收集目录下全部文件(Host 半区扫描必须递归:service 子目录里的代码同样受检)。 */
function walkFiles(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walkFiles(p, acc)
    else acc.push(p)
  }
  return acc
}

let failures = 0
const fail = (msg) => { console.error(`[guard] ✗ ${msg}`); failures += 1 }
const ok = (msg) => console.log(`[guard] ✓ ${msg}`)
const warn = (msg) => console.warn(`[guard] ⚠ ${msg}(不阻断,但建议修)`)

// 依赖未安装时,后面的 tsc / Host 半区引用检查 / 渲染冒烟只能跳过——跳过得来的「通过」不算数,直接拦下并说明原因
if (!existsSync('node_modules')) {
  fail('依赖未安装:先 npm install(tsc、Host 半区引用检查、渲染冒烟都靠它;没有它们时的「通过」不算数)')
}

// 坑 #1 + 坑 #21
const hostFiles = ['index.js', ...walkFiles('service').filter(f => /\.(m?js|ts)$/.test(f))] // 只读源码:service 下可能混有数据文件
for (const f of hostFiles) {
  if (!statSync(f).isFile()) continue
  const src = readFileSync(f, 'utf8')
  if (src.includes('required: false')) {
    fail(`${f} 含 required: false(坑 #1:可选参数整个省略 required 字段;真实错误:JsonSchemaError: parameters.store.required must be true when present)`)
  }
  if (/parameters:\s*\{\s*["']?type["']?\s*:\s*['"]/.test(src)) {
    fail(`${f} 的 defineTool parameters 疑似 JSON Schema 全对象(坑 #21:parameters 是逐属性映射,无参工具用 parameters: {};全对象形态会让整个 Host entry 激活失败)`)
  }
}
if (failures === 0) ok('工具参数契约(坑 #1 无 required: false / 坑 #21 无 JSON Schema 全对象)')

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

// 官方规范随行:AGENTS.md 必读第一位,被删了 AI 就失去地面真值
if (existsSync(join('docs', 'official', 'dsh-doc', 'SKILL.md'))) {
  ok('官方规范随行在位(docs/official/dsh-doc/)')
} else {
  fail('docs/official/dsh-doc/SKILL.md 缺失——官方规范随行被删(AGENTS.md 必读第一位)')
}

// 红线(官方 practices.md / verification.md):插件不得 require/load Harness Client 包
// (无预警变更,组件一抛错槽位即白屏)。素材走 vendored(src/design/icons-data.ts),
// 类型自持 shim.ts——src/ 里出现 @deepseek-ai/dsh-client-* import 一律阻断
function walkSrc(dir, hits) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walkSrc(p, hits)
    else if (/\.(tsx?|m?js)$/.test(name) && /from\s+['"]@deepseek-ai\/dsh-client/.test(readFileSync(p, 'utf8'))) hits.push(p)
  }
  return hits
}
if (existsSync('src')) {
  const hits = walkSrc('src', [])
  for (const p of hits) fail(`${p} import 了 Harness Client 包(官方 practices.md 禁令;素材 vendored、类型 shim 自持)`)
  if (hits.length === 0) ok('src/ 无 Harness Client 包 import(practices.md 禁令)')
}

// 展示元数据(官方 host-plugin.md 清单):Plugins 页读 locale/*.json 的 meta.title/description
// 与 icon;缺失时回落到 package.json name/description 与默认占位图(坑 #19)
{
  for (const f of ['locale/en.json', 'locale/zh.json', 'icon.svg']) {
    if (!existsSync(f)) fail(`缺 ${f}(Plugins 页的标题/描述/图标;官方 host-plugin.md 要求)`)
  }
  let pkg
  try { pkg = JSON.parse(readFileSync('package.json', 'utf8')) } catch { pkg = undefined }
  if (pkg) {
    const files = pkg.files ?? []
    for (const pattern of ['locale/*.json', 'icon.svg']) {
      if (!files.includes(pattern)) fail(`package.json 的 files 漏了 ${pattern}(host-plugin.md:打包闭包必须含 locale 与 icon)`)
    }
    if (pkg.exports?.['./icon'] === undefined) fail('package.json 的 exports 漏了 ./icon(host-plugin.md 要求导出)')
    if (pkg.exports?.['./locale/*.json'] === undefined) fail('package.json 的 exports 漏了 ./locale/*.json(host-plugin.md 要求导出)')
    // 依赖不变量(坑 #17):link 安装时依赖必须能从插件自己的真实路径解析——dependencies
    // 非空会让 npm install 缺席的装法直接 ERR_MODULE_NOT_FOUND。骨架零 dependencies 是设计约束
    const deps = Object.keys(pkg.dependencies ?? {})
    if (deps.length > 0) {
      warn(`dependencies 非空(${deps.join(' ')}):link 安装时 Node 按插件真实路径找 node_modules,`
        + '没跑过 npm install 的目录会激活失败(坑 #17);运行时能力交给宿主 external 或 peer + start.sh 安装')
    }
    // 展示身份仍是模板占位(提醒,不阻断):交付前应换成业务身份——AGENTS.md 工作流第 7 步
    if (String(pkg.description ?? '').includes('骨架,复制后全局改名')) {
      warn('package.json 的 description 还是模板占位文案——交付前换成业务描述(AGENTS.md 工作流第 7 步)')
    }
    if (failures === 0) ok('展示元数据齐全(locale meta + icon + files/exports 闭包)')
  }
}

// session projection 的 fork 守卫(坑:fork 会话把父会话历史算成自己的,静默偏大不报错):
// 注册了 projection 的文件必须含 inheritedEventCount 守卫(init 存下 + apply 首行短路)。
// projection 经 ctx.sessionProjections 注册,天然发生在 **Host 半区**(index.js/service)——
// 两半都扫,只扫 src/ 会漏掉真正的注册点(评审实测盲区)
{
  const projFiles = []
  const check = (p) => {
    const s = readFileSync(p, 'utf8')
    if (/sessionProjections\s*\.\s*register/.test(s)) {
      if (!/inheritedEventCount/.test(s)) fail(`${p} 注册了 session projection 但没有 inheritedEventCount 守卫(缺了会静默错:fork 会话把父历史算成自己的)`)
      else projFiles.push(p)
    }
  }
  for (const f of ['index.js', ...walkFiles('service')]) {
    if (/\.(mjs|js|ts|tsx)$/.test(f)) check(f)
  }
  if (existsSync('src')) {
    const scan = (dir) => {
      for (const name of readdirSync(dir)) {
        const p = join(dir, name)
        if (statSync(p).isDirectory()) scan(p)
        else if (/\.(tsx?|m?js)$/.test(name)) check(p)
      }
    }
    scan('src')
  }
  if (projFiles.length === 0) ok('未使用 session projection(如引入:init 必须存 inheritedEventCount,apply 首行按 seq 短路)')
  else ok(`session projection fork 守卫在位(${projFiles.length} 处)`)
}

// token 纪律(warn 级):业务页面裸写 hex 颜色 → 设计变体(terminal/paper/商店绿)换不动它,
// AGENTS.md 验证清单的明暗双主题实测会在这里漏。token 定义处与示例区不查(教学代码可示范配色)
if (existsSync('src/pages')) {
  const HEX = /(?<!&)#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/g
  for (const f of readdirSync('src/pages').filter(f => f.endsWith('.tsx'))) {
    const found = readFileSync(join('src/pages', f), 'utf8').match(HEX)
    if (found) warn(`${f} 裸写颜色 ${[...new Set(found)].join(' ')}——改用 var(--wb-*) token,否则变体换肤与明暗实测会漏`)
  }
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
  fail('typescript 未安装,tsc 静态引用检查被跳过(坑 #15):npm install 后重跑')
}

// 坑 #22 Host 半区未定义标识符:node --check 只查语法。「用了没 import 的标识符」「import 了不存在的
// 导出名」「相对路径写错」都要到激活时才炸,而且是整个 Host entry 一起失败(数据服务/工具/投影全没了)。
// 用 tsc 的 checkJs 查 index.js 与 service/(tsconfig.host.json),只拦激活必炸的几类诊断;
// 宽松 JS 的其余类型推断噪音不拦;裸包名解析不到也不拦(运行时包由宿主提供)。
const hostTsconfig = join('tsconfig.host.json')
if (existsSync(tscBin) && existsSync(hostTsconfig)) {
  let out = ''
  try {
    execSync(`node ${JSON.stringify(tscBin)} -p ${JSON.stringify(hostTsconfig)}`, { stdio: 'pipe' })
  } catch (e) {
    out = String(e.stdout ?? '') + String(e.stderr ?? '')
  }
  if (/TS2688: Cannot find type definition file for 'node'/.test(out)) {
    fail('@types/node 未安装,Host 半区引用检查被跳过(坑 #22):npm install 后重跑')
  } else {
    const bad = out.split('\n').filter((l) => /error TS(2304|2552|2305|2614|2724):/.test(l) || /TS2307: Cannot find module '\.{1,2}\//.test(l))
    for (const l of bad.slice(0, 8)) fail('Host 半区引用错误(坑 #22,激活时会炸): ' + l.trim())
    if (bad.length === 0) ok('Host 半区引用检查通过(未定义标识符 / 不存在的导出 / 相对路径)')
  }
} else if (!existsSync(hostTsconfig)) {
  fail('缺 tsconfig.host.json,Host 半区引用检查被跳过(坑 #22):从骨架恢复该文件')
}

// 渲染冒烟:逐页面组件 renderToString(坑 #15 的运行时形态,渲染即崩)
// 依赖未安装时冒烟脚本连 esbuild 都 import 不到;原因已在开头说明,这里不再叠一条「运行失败」
if (existsSync('node_modules')) try {
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
const jsFiles = ['index.js', ...walkFiles('service').filter(f => f.endsWith('.mjs'))]
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
