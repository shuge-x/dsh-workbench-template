/**
 * 卸载服务:把某个「由本生成器创建、已登记进当前 profile」的项目从 profile 中移除。
 *
 * 安全边界(刻意为之,见 ScaffoldPage 说明):
 *  - 只移除 profile 登记(dependencies 条目 + dsh.profile.bundles 条目),不删项目目录
 *  - 拒绝卸载本插件自身
 *  - 输入路径必须能匹配到 profile 里的登记(按 link 目标或目录名),否则明确告知无需卸载
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { dirname, join, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const PKG_ROOT = dirname(dirname(fileURLToPath(import.meta.url))) // .../dsh-workbench-template
const PKG_NAME = JSON.parse(readFileSync(join(PKG_ROOT, 'package.json'), 'utf8')).name

/** 从插件安装位置向上推导 profile 目录(兼容 link: 与 pnpm git 两种安装布局)。 */
function findProfileDir() {
  let dir = PKG_ROOT
  for (let i = 0; i < 8; i += 1) {
    const marker = join(dir, 'package.json')
    if (existsSync(marker)) {
      try {
        const p = JSON.parse(readFileSync(marker, 'utf8'))
        if (p?.dsh?.profile) return dir
      } catch { /* 不是可解析的 package.json,继续向上 */ }
    }
    const parent = dirname(dir)
    if (parent === dir) return null
    dir = parent
  }
  return null
}

const norm = (p) => resolve(p).replace(new RegExp(sep === '\\' ? '\\\\' : sep + '$'), '')

/**
 * @typedef {object} UninstallResult
 * @property {boolean} found
 * @property {string} [key]
 * @property {string} [removedDependency]
 * @property {string} [removedBundle]
 * @property {string} [profileDir]
 * @property {string[]} hints
 * @property {string} [error]
 */
/** @returns {Promise<UninstallResult>} */

/** 主入口:按项目路径卸载 profile 登记。 */
export function uninstallByPath({ path } = {}) {
  const hints = []
  const profileDir = findProfileDir()
  if (profileDir === null) return { found: false, hints, error: '无法定位 profile 目录(本插件可能未通过 profile 安装)' }

  const pkgPath = join(profileDir, 'package.json')
  const profile = JSON.parse(readFileSync(pkgPath, 'utf8'))
  const deps = profile.dependencies ?? {}
  const target = norm(String(path ?? ''))

  // 匹配登记项:link 目标与路径一致,或依赖键名与目录名一致
  let key = null
  for (const [k, spec] of Object.entries(deps)) {
    if (typeof spec !== 'string' || !spec.startsWith('link:')) continue
    const linked = norm(resolve(join(profileDir, spec.slice(5))))
    if (linked === target || dirname(linked) === target || norm(dirname(linked)) === target) { key = k; break }
    if (k === target.split(sep).pop()) { key = k; break }
  }
  if (key === null) {
    hints.push('该路径没有登记在当前 profile 中(可能从未安装预览,或已卸载)——无需任何操作。')
    return { found: false, hints, profileDir }
  }
  if (key === PKG_NAME) {
    return { found: true, key, hints, error: '不能卸载生成器自身(本页面会随之消失);请在插件中心手动操作' }
  }

  // 1) 从 dsh.profile.bundles 移除登记
  const bundles = profile.dsh?.profile?.bundles ?? []
  const before = bundles.length
  profile.dsh.profile.bundles = bundles.filter(b => b !== key)
  const removedBundle = before !== profile.dsh.profile.bundles.length ? key : undefined
  writeFileSync(pkgPath, JSON.stringify(profile, null, 2) + '\n')

  // 2) pnpm remove 依赖(会保留 dsh.profile.bundles 等自定义字段)
  const rm = spawnSync('pnpm', ['remove', key], { cwd: profileDir, encoding: 'utf8', timeout: 120000 })
  if (rm.status !== 0) {
    return { found: true, key, profileDir, hints, error: `pnpm remove 失败:${String(rm.stderr ?? rm.stdout ?? '').slice(-300)}` }
  }

  hints.push(`已从 profile(${profileDir})移除登记:依赖 ${key}` + (removedBundle ? ' + bundles 条目' : ''))
  hints.push('正在运行的 dsh 实例需重启后完全生效(或让 AI 助手重启);浏览器刷新即可看到面板消失。')
  hints.push('你的项目目录本身没有被删除——代码与数据仍在。确认不要了请自行执行:')
  hints.push(`rm -rf ${target}`)
  hints.push('重新启用:随时可再走一次「新建工作台」,或在插件中心重新登记。')
  return { found: true, key, removedDependency: key, removedBundle, profileDir, hints }
}
