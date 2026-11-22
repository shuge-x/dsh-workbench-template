#!/usr/bin/env node
/**
 * 图标 vendored 提取:把官方 ICON_ARTWORK×权重物化成 skeleton/src/design/icons-data.ts。
 *
 * 为什么不直接 import @deepseek-ai/dsh-client-ui-primitives:
 *   practices.md 明令插件不得 require/load Harness Client 包(无预警变更,抛错即白屏)。
 *   官方认可的替代路径是拷贝素材并改自有前缀——本脚本即该路径的机器化:
 *   跑一次得纯数据快照(带来源戳),挂载时以 wb-icon- 前缀落 symbol id,不与宿主撞车。
 *
 * 用法:node scripts/vendor-icons.mjs [harness源码根]
 *   默认源 = /Volumes/NVME980/ai-code/github/deepseek-harness;刷新官方版本后重跑一次即可。
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const TEMPLATE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(TEMPLATE_ROOT, 'skeleton', 'src', 'design', 'icons-data.ts')
const HARNESS_ROOT = process.argv[2] ?? '/Volumes/NVME980/ai-code/github/deepseek-harness'
const ARTWORK = join(HARNESS_ROOT, 'packages/client/ui-primitives/src/icons/artwork.ts')

const m = await import(`file://${ARTWORK}`)
const symbols = m.ICON_SYMBOLS // id(dsw-icon-<glyph>-<weight>)→ svg 文档
const ids = Object.keys(symbols)

// 按 glyph 分组 { regular, medium }(官方每组恒两权重;212 = 106×2,若失衡显式失败)
const glyphs = {}
for (const [id, doc] of Object.entries(symbols)) {
  const hit = id.match(/^dsw-icon-(.+)-(regular|medium)$/)
  if (hit === null) throw new Error(`符号 id 不合预期:${id}`)
  const [, glyph, weight] = hit
  ;(glyphs[glyph] ??= {}).regular ??= null
  ;(glyphs[glyph] ??= {}).medium ??= null
  glyphs[glyph][weight] = doc
}
const names = Object.keys(glyphs).sort()
for (const g of names) {
  if (glyphs[g].regular === null || glyphs[g].medium === null) throw new Error(`glyph ${g} 权重缺失:非 regular+medium 成对`)
}

// 来源戳:git 提交 + tag(有 tag 用 tag,无 tag 用短哈希)
let source
try {
  const sha = execFileSync('git', ['-C', HARNESS_ROOT, 'rev-parse', '--short=10', 'HEAD'], { encoding: 'utf8' }).trim()
  const tag = execFileSync('git', ['-C', HARNESS_ROOT, 'describe', '--tags', '--exact-match'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
  source = `deepseek-harness@${tag} (${sha})`
} catch {
  source = `deepseek-harness@${execFileSync('git', ['-C', HARNESS_ROOT, 'rev-parse', '--short=10', 'HEAD'], { encoding: 'utf8' }).trim()}`
}

const lines = []
lines.push(`/**
 * 官方图标符号表(vendored 数据快照,勿手改)。
 *
 * 来源:${source} · packages/client/ui-primitives/src/icons/artwork.ts(DeepSeek Harness,MIT)
 * 提取:${names.length} 个 glyph × 2 权重(regular 1px / medium 1.3px),由 scripts/vendor-icons.mjs 物化。
 *
 * 为什么 vendored 而非 import @deepseek-ai/dsh-client-ui-primitives:
 *   官方 practices.md 明令插件不得 require/load Harness Client 包(无预警变更,组件一抛错槽位即白屏)。
 *   官方认可替代路径 = 拷贝素材 + 改自有前缀;本文件是素材,挂载方(theme.ts mountIconSprite)
 *   以 wb-icon-<glyph>-<weight> 落 symbol id,不与宿主 ui-theme 挂的同名 sprite 撞 id。
 * 刷新:官方出新版本后,在模板仓库跑 npm run vendor-icons 重提取。
 */`)
lines.push(`export const ICONS_VENDOR_SOURCE = ${JSON.stringify(source)}`)
lines.push('')
lines.push(`/** glyph → { regular, medium } 完整 SVG 文档(挂载时解析进 <symbol>)。 */`)
lines.push(`export const ICON_GLYPHS: Record<string, { regular: string; medium: string }> = {`)
for (const g of names) {
  lines.push(`  ${JSON.stringify(g)}: {`)
  lines.push(`    regular: ${JSON.stringify(glyphs[g].regular)},`)
  lines.push(`    medium: ${JSON.stringify(glyphs[g].medium)},`)
  lines.push(`  },`)
}
lines.push('}')
lines.push('')
lines.push(`/** 全部 glyph 名(排序后),供图标浏览器枚举。 */`)
lines.push(`export const ICON_GLYPH_NAMES = Object.keys(ICON_GLYPHS)`)
lines.push('')

writeFileSync(OUT, lines.join('\n'))
console.log(`✓ ${OUT}`)
console.log(`  来源:${source}`)
console.log(`  glyphs:${names.length}(symbols:${ids.length}) · ${(readFileSync(OUT).length / 1024).toFixed(0)} KB`)
