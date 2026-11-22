/**
 * 官方规范随行:把 dsh 官方 AI 手册(dsh-doc 技能,SKILL.md + references/ + templates/)
 * 抓进目标目录,让生成项目自带与运行版本对齐的官方规范,而不是依赖 AI 记忆或代码内固化。
 *
 * 来源优先级(官方「以运行版为准」):
 *   ① dsh-v<运行版本> tag —— 本机 `dsh --version` 探测,构建哈希不构成 tag,取其前缀
 *   ② master —— 本地构建领先于任何 tag,或版本探测失败时
 *   ③ 目标目录既有内容 —— 骨架内置快照(带 VERSION.txt 版本戳);抓取失败不清空,
 *      快照可能过期,VERSION.txt 如实标注来源与日期(降级声明,不冒充最新)
 *
 * 用途:
 *   - scaffoldProject 生成项目后刷新 <项目>/docs/official/dsh-doc/(网络可用即升级到最新)
 *   - 手动刷新骨架内置快照:node service/fetch-official.mjs skeleton/docs/official/dsh-doc
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { execFileSync } from 'node:child_process'

const REPO = 'deepseek-ai/deepseek-harness'
const DOC_BASE = 'packages/preset/agent-preset/skills/dsh-doc'
const TIMEOUT_MS = 30_000

/** 探测本机 dsh 版本(用于版本对齐 tag);失败返回 null(不阻塞,直接走 master)。 */
function detectDshVersion(dshBin) {
  try {
    const out = execFileSync(dshBin ?? 'dsh', ['--version'], { encoding: 'utf8', timeout: 5_000, stdio: ['ignore', 'pipe', 'ignore'] })
    const m = String(out).match(/(\d+\.\d+\.\d+[-+][^\s]*)/)
    return m ? m[1] : null
  } catch {
    return null
  }
}

/** 解析候选 ref:版本 tag 前缀(如 dsh-v0.2.2-rc.5)→ master。 */
function resolveRefs(version) {
  const refs = []
  if (version) {
    const prefix = version.match(/^(\d+\.\d+\.\d+(?:-[0-9A-Za-z.]+)?)/)?.[1]
    if (prefix) refs.push(`dsh-v${prefix}`)
  }
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

/**
 * 抓取官方文档到 targetDir。
 * 返回 { ok:true, ref, files } 或 { ok:false, reason };失败不清理既有内容、不抛异常
 * (脚手架不因网络受阻,快照兜底继续工作)。
 */
export async function fetchOfficialDocs(targetDir, { dshBin, log = () => {} } = {}) {
  const version = detectDshVersion(dshBin)
  const refs = resolveRefs(version)
  for (const ref of refs) {
    try {
      const files = await listDocFiles(ref)
      if (files.length === 0) throw new Error('文件清单为空')
      for (const rel of files) {
        const text = await fetchText(`https://raw.githubusercontent.com/${REPO}/${ref}/${DOC_BASE}/${rel}`)
        const dest = join(targetDir, rel)
        mkdirSync(dirname(dest), { recursive: true })
        writeFileSync(dest, text)
      }
      writeFileSync(join(targetDir, 'VERSION.txt'),
        `source: ${REPO}@${ref}${version ? ` (本机 dsh ${version})` : ''}\nfetched: ${new Date().toISOString().slice(0, 10)}\nfiles: ${files.length}\n`)
      log(`官方规范随行:${ref} · ${files.length} 个文件`)
      return { ok: true, ref, files: files.length }
    } catch (e) {
      log(`来源 ${ref} 不可达(${e.message})`)
    }
  }
  return { ok: false, reason: `所有来源不可达(${refs.join(' → ')});保留目录既有快照` }
}

// CLI 入口:node service/fetch-official.mjs <targetDir> [--dsh <bin>]
// 退出码恒 0:快照兜底是设计内行为,不算失败
if (process.argv[1]?.endsWith('fetch-official.mjs')) {
  const target = process.argv[2]
  if (!target || target.startsWith('--')) {
    console.error('用法:node service/fetch-official.mjs <targetDir> [--dsh <bin>]')
    process.exit(2)
  }
  const dshIdx = process.argv.indexOf('--dsh')
  const dshBin = dshIdx >= 0 ? process.argv[dshIdx + 1] : undefined
  const out = await fetchOfficialDocs(resolve(target), { dshBin, log: m => console.log(`  ${m}`) })
  console.log(out.ok ? `✓ 官方规范已更新:${out.ref} · ${out.files} 个文件` : `△ 未升级:${out.reason}(既有快照继续生效,见其 VERSION.txt)`)
}
