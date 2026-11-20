/**
 * 共享资产镜像同步:skeleton 是唯一源 → 拷贝到样板本体(src/ 与 docs/)。
 *  - skeleton/src/theme.ts        → src/theme.ts        设计系统
 *  - skeleton/src/examples/       → src/examples/       7 个示例页
 *  - skeleton/docs/EXAMPLES.md    → docs/EXAMPLES.md    示例索引与红线
 * 改示例只改 skeleton 一处,然后跑本脚本;guard 会检查两侧一致性,漂移即阻断。
 */
import { copyFileSync, mkdirSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const pairs = [
  ['skeleton/src/theme.ts', 'src/theme.ts'],
  ['skeleton/src/vendor.d.ts', 'src/vendor.d.ts'],
  ['skeleton/scripts/smoke-render.mjs', 'scripts/smoke-render.mjs'],
  ['skeleton/start.sh', 'start.sh'],
  ['skeleton/docs/EXAMPLES.md', 'docs/EXAMPLES.md'],
]
for (const [from, to] of pairs) {
  mkdirSync(dirname(join(root, to)), { recursive: true })
  copyFileSync(join(root, from), join(root, to))
  console.log(`[sync] ${from} → ${to}`)
}
const exSrc = join(root, 'skeleton/src/examples')
const exDst = join(root, 'src/examples')
mkdirSync(exDst, { recursive: true })
for (const f of readdirSync(exSrc)) {
  copyFileSync(join(exSrc, f), join(exDst, f))
  console.log(`[sync] skeleton/src/examples/${f} → src/examples/${f}`)
}
console.log('[sync] 完成(源=skeleton,改示例请改 skeleton 后重跑)')
