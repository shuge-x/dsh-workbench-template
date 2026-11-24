/**
 * 官方规范随行:把 dsh 官方 AI 手册(dsh-doc 技能,SKILL.md + references/ + templates/)
 * 抓进目标目录,让生成项目自带与运行版本对齐的官方规范,而不是依赖 AI 记忆或代码内固化。
 *
 * 来源优先级(官方「以运行版为准」):
 *   ① dsh-v<运行版本> tag —— 版本探测见 detectDshVersion;构建哈希不构成 tag,取其前缀
 *   ② master —— 本地构建领先于任何 tag,或版本探测失败时
 *   ③ 目标目录既有内容 —— 骨架内置快照(带 VERSION.txt 版本戳);抓取失败不清空,
 *      快照可能过期,VERSION.txt 如实标注来源、版本与日期(降级声明,不冒充最新)
 *
 * 用途:
 *   - scaffoldProject 生成项目后刷新 <项目>/docs/official/dsh-doc/(按运行版本对齐)
 *   - 刷新骨架内置快照(服务离线兜底的任何用户,故取最新而非本机版本):
 *     npm run sync-official   即 node service/fetch-official.mjs <dir> --latest
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { execFileSync } from 'node:child_process'

const REPO = 'deepseek-ai/deepseek-harness'
const DOC_BASE = 'packages/preset/agent-preset/skills/dsh-doc'
const TIMEOUT_MS = 30_000
const VERSION_RE = /\d+\.\d+\.\d+(?:-[0-9A-Za-z.]+)?/ // 预发布段止于第二个连字符(其后是构建哈希)

/**
 * semver 优先级比较(升序)。只覆盖 dsh 实际用到的形态 X.Y.Z[-pre[.N]]。
 * 0.2.1-rc.5 < 0.2.2-rc.5 < 0.2.3-alpha.1 < 0.2.3(正式版高于同核心号的预发布版)
 */
function cmpSemver(a, b) {
  const parse = (v) => { const [core, pre] = v.split('+')[0].split('-'); return { c: core.split('.').map(Number), p: pre ? pre.split('.') : [] } }
  const { c: ac, p: ap } = parse(a)
  const { c: bc, p: bp } = parse(b)
  for (let i = 0; i < 3; i++) if (ac[i] !== bc[i]) return (ac[i] ?? 0) - (bc[i] ?? 0)
  if (ap.length === 0 || bp.length === 0) return bp.length - ap.length
  for (let i = 0; i < Math.max(ap.length, bp.length); i++) {
    if (ap[i] === undefined) return -1
    if (bp[i] === undefined) return 1
    if (ap[i] !== bp[i]) return /^\d+$/.test(ap[i]) && /^\d+$/.test(bp[i]) ? Number(ap[i]) - Number(bp[i]) : (ap[i] < bp[i] ? -1 : 1)
  }
  return 0
}

/**
 * npm 的 npx 缓存里缓存的 dsh 版本,取最高版。
 * start.sh 用 `npx @deepseek-ai/dsh`——裸包名取满足范围的最新缓存版,所以最高版即实际会运行的;
 * 显式钉过旧版本的机器请用 DSH_VERSION 指明。缓存布局是 npm 的实现细节,读不到就返回 null。
 */
function detectNpxCacheVersion() {
  let root
  try {
    const cache = execFileSync('npm', ['config', 'get', 'cache'], { encoding: 'utf8', timeout: 5_000, stdio: ['ignore', 'pipe', 'ignore'] }).trim()
    root = join(cache, '_npx')
  } catch {
    return null
  }
  let hashes
  try { hashes = readdirSync(root) } catch { return null }
  const versions = new Set()
  for (const h of hashes) {
    try {
      const v = JSON.parse(readFileSync(join(root, h, 'node_modules', '@deepseek-ai', 'dsh', 'package.json'), 'utf8')).version
      if (typeof v === 'string' && /^\d+\.\d+\.\d+/.test(v)) versions.add(v)
    } catch { /* 该缓存目录不含 dsh */ }
  }
  return [...versions].sort(cmpSemver).at(-1) ?? null
}

/**
 * 探测本机 dsh 版本,返回 { version, via } 或 null。
 * 顺序:DSH_VERSION 环境变量(显式指定)> `dsh --version`(dsh 在 PATH 上)> npx 缓存。
 * 只靠前两级时,用 npx 跑 dsh 的机器(骨架 start.sh 即如此)会永远落到 master,对齐就成了空话。
 */
function detectDshVersion(dshBin) {
  const env = (process.env.DSH_VERSION ?? '').match(VERSION_RE)
  if (env) return { version: env[0], via: 'DSH_VERSION' }
  try {
    const out = execFileSync(dshBin ?? 'dsh', ['--version'], { encoding: 'utf8', timeout: 5_000, stdio: ['ignore', 'pipe', 'ignore'] })
    const m = String(out).match(VERSION_RE)
    if (m) return { version: m[0], via: 'dsh --version' }
  } catch { /* 不在 PATH:继续 */ }
  const cached = detectNpxCacheVersion()
  return cached ? { version: cached, via: 'npx 缓存' } : null
}

/** 解析候选 ref:版本 tag(如 dsh-v0.2.2-rc.5)→ master。 */
function resolveRefs(version) {
  const refs = []
  const m = (version ?? '').match(VERSION_RE)
  if (m) refs.push(`dsh-v${m[0]}`)
  refs.push('master')
  return refs
}

async function fetchText(url) {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: process.env.GITHUB_TOKEN ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {},
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.text()
}

/**
 * 递归列出 dsh-doc 下全部文件(清单动态派生,不固化在代码里)。
 * 用 contents API 逐目录行走——整仓 recursive 树接口响应数 MB 且常超时,弃用;
 * 目录数 ~10,每响应数 KB。设 GITHUB_TOKEN 可把匿名 60 次/时限提到 5000 次/时。
 */
async function listDocFiles(ref, dir = '', acc = []) {
  const url = `https://api.github.com/repos/${REPO}/contents/${DOC_BASE}${dir ? `/${dir}` : ''}?ref=${ref}`
  const entries = JSON.parse(await fetchText(url))
  if (!Array.isArray(entries)) throw new Error('目录响应异常')
  for (const e of entries) {
    if (e.type === 'file') acc.push(dir ? `${dir}/${e.name}` : e.name)
    else if (e.type === 'dir') await listDocFiles(ref, dir ? `${dir}/${e.name}` : e.name, acc)
  }
  return acc
}

/** 目标目录是不是我们自己盖过章的 dsh-doc 目录(快照或上一次抓取落下的)。 */
function isManagedDocDir(dir) {
  const skill = join(dir, 'SKILL.md')
  return existsSync(skill) && readFileSync(skill, 'utf8').includes('name: dsh-doc')
}

/**
 * 抓取一个来源的全部文件并写版本戳;成功返回文件数,失败抛错。
 * 全部文件先取进内存、整份到手才动磁盘:中途失败不留半套文件。
 * 目标是我们盖过章的目录时先清空再写——换版本抓取时,上一版独有的文件
 * (如 0.2.3 才有的 references/dsh-version.md)不能混进新版本;不是我们的目录则只写入不清空。
 */
async function fetchRef(ref, targetDir, stamp) {
  const files = await listDocFiles(ref)
  if (files.length === 0) throw new Error('文件清单为空')
  const docs = []
  for (const rel of files) docs.push([rel, await fetchText(`https://raw.githubusercontent.com/${REPO}/${ref}/${DOC_BASE}/${rel}`)])
  if (isManagedDocDir(targetDir)) {
    for (const name of readdirSync(targetDir)) rmSync(join(targetDir, name), { recursive: true, force: true })
  }
  for (const [rel, text] of docs) {
    const dest = join(targetDir, rel)
    mkdirSync(dirname(dest), { recursive: true })
    writeFileSync(dest, text)
  }
  writeFileSync(join(targetDir, 'VERSION.txt'), `source: ${REPO}@${ref}\n${stamp}\nfetched: ${new Date().toISOString().slice(0, 10)}\nfiles: ${files.length}\n`)
  return files.length
}

/**
 * 抓取官方文档到 targetDir。
 *   latest: true 跳过版本探测,只取 master(刷骨架内置快照用)
 * 返回 { ok:true, ref, files, version, via } 或 { ok:false, reason, detail };
 * 失败不清理既有内容、不抛异常(脚手架不因网络受阻,快照兜底继续工作)。
 */
export async function fetchOfficialDocs(targetDir, { dshBin, version: pinned, latest = false, log = () => {} } = {}) {
  const detected = latest ? null : (pinned ? { version: pinned, via: '指定' } : detectDshVersion(dshBin))
  const refs = latest ? ['master'] : resolveRefs(detected?.version)
  const stamp = detected ? `local dsh: ${detected.version}(探测方式:${detected.via})`
    : latest ? 'local dsh: 未探测(快照取最新版,不按本机版本对齐)' : 'local dsh: 未探测到版本,落到 master'
  const failures = []
  for (const ref of refs) {
    // 每个来源试两次:瞬时网络抖动不该让项目落到过期快照
    for (let attempt = 1; ; attempt++) {
      try {
        const files = await fetchRef(ref, targetDir, stamp)
        log(`官方规范随行:${ref} · ${files} 个文件${detected ? `(本机 dsh ${detected.version},经${detected.via})` : ''}`)
        return { ok: true, ref, files, version: detected?.version ?? null, via: detected?.via ?? null }
      } catch (e) {
        failures.push(`${ref}:${e.message}`) // 逐条原因带回给调用方:配额(403)该设 GITHUB_TOKEN,超时则重试即可
        log(`来源 ${ref} 不可达(${e.message})`)
        if (attempt >= 2) break
        await new Promise(wake => setTimeout(wake, 1000))
      }
    }
  }
  return { ok: false, reason: `所有来源不可达(${refs.join(' → ')});保留目录既有快照`, detail: failures.join('; ') }
}

// CLI 入口:node service/fetch-official.mjs <targetDir> [--dsh <bin>] [--version <v>] [--latest]
// 退出码恒 0:快照兜底是设计内行为,不算失败
if (process.argv[1]?.endsWith('fetch-official.mjs')) {
  const target = process.argv[2]
  const flag = (name) => { const i = process.argv.indexOf(name); return i >= 0 ? process.argv[i + 1] : undefined }
  if (!target || target.startsWith('--')) {
    console.error('用法:node service/fetch-official.mjs <targetDir> [--dsh <bin>] [--version <v>] [--latest]')
    process.exit(2)
  }
  const out = await fetchOfficialDocs(resolve(target), {
    dshBin: flag('--dsh'),
    pinned: flag('--version'),
    latest: process.argv.includes('--latest'),
    log: (m) => console.log(`  ${m}`),
  })
  console.log(out.ok ? `✓ 官方规范已更新:${out.ref} · ${out.files} 个文件` : `△ 未升级:${out.reason}(既有快照继续生效,见其 VERSION.txt)`)
}
