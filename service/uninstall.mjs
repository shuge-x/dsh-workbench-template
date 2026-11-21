/**
 * 卸载服务:跨 profile 扫描与卸载——把某个生成项目的登记从 profile 中移除。
 *
 * 能力:
 *  - scanRegistrations({ path }):扫描 ~/.dsh/profiles/* 全部 profile,找出登记了该路径
 *    (link 目标匹配、目录名匹配)或其目录名的条目;link 目标已不存在的标记为「失效」
 *    (项目改名/移动后会留下失效登记,正是最常见的清理需求)
 *  - uninstallFromProfile({ profile, key }):从指定 profile 移除一条登记
 *
 * 安全边界:
 *  - 只移除 profile 登记(dependencies 条目 + dsh.profile.bundles 条目),不删项目目录
 *  - 正在运行本插件的当前 profile 里,拒绝移除本插件自身(否则本页面会消失)
 */
import { existsSync, readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { homedir } from 'node:os'
import { dirname, join, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const PKG_ROOT = dirname(dirname(fileURLToPath(import.meta.url))) // .../dsh-workbench-template
const PKG_NAME = JSON.parse(readFileSync(join(PKG_ROOT, 'package.json'), 'utf8')).name
const PROFILES_ROOT = join(homedir(), '.dsh', 'profiles')

const norm = (p) => resolve(p).replace(new RegExp(sep === '\\' ? '\\\\' : sep + '$'), '')

/** 从插件安装位置向上推导当前 profile 目录(兼容 link: 与 pnpm git 两种布局);找不到返回 null。 */
function findProfileDir() {
  let dir = PKG_ROOT
  for (let i = 0; i < 8; i += 1) {
    const marker = join(dir, 'package.json')
    if (existsSync(marker)) {
      try {
        const p = JSON.parse(readFileSync(marker, 'utf8'))
        if (p?.dsh?.profile) return dir
      } catch { /* 继续向上 */ }
    }
    const parent = dirname(dir)
    if (parent === dir) return null
    dir = parent
  }
  return null
}

/** 扫描全部 profile,返回登记了该路径/目录名的条目列表。 */
export function scanRegistrations({ path } = {}) {
  const target = norm(String(path ?? ''))
  const base = (target.split(sep).pop() ?? '').toLowerCase()
  const out = []
  if (!existsSync(PROFILES_ROOT) || base === '') return out
  for (const name of readdirSync(PROFILES_ROOT)) {
    const dir = join(PROFILES_ROOT, name)
    const pkgPath = join(dir, 'package.json')
    if (!existsSync(pkgPath)) continue
    let p
    try { p = JSON.parse(readFileSync(pkgPath, 'utf8')) } catch { continue }
    const deps = p.dependencies ?? {}
    const bundles = p.dsh?.profile?.bundles ?? []
    for (const [k, spec] of Object.entries(deps)) {
      if (typeof spec !== 'string') continue
      const isLink = spec.startsWith('link:')
      const linkPath = isLink ? norm(resolve(dir, spec.slice(5))) : undefined
      const matchesPath = linkPath !== undefined && (linkPath === target || dirname(linkPath) === target)
      const matchesName = k.toLowerCase().includes(base)
      if (!matchesPath && !matchesName) continue
      out.push({
        profile: name,
        key: k,
        linkTarget: isLink ? spec.slice(5) : undefined,
        stale: isLink && !existsSync(linkPath),
        hasBundle: bundles.includes(k),
      })
    }
  }
  return out
}

/** 从指定 profile 移除一条登记(依赖 + bundles 条目)。 */
export function uninstallFromProfile({ profile, key } = {}) {
  const hints = []
  if (!/^[a-z0-9][a-z0-9-]*$/.test(String(profile ?? ''))) {
    return { ok: false, hints, error: `profile 名不合法:${profile}` }
  }
  const profileDir = join(PROFILES_ROOT, profile)
  const pkgPath = join(profileDir, 'package.json')
  if (!existsSync(pkgPath)) return { ok: false, hints, error: `profile 不存在:${profile}` }
  if (profile === 'desktop') return { ok: false, hints, error: 'desktop 是保留 profile,请在其界面内操作' }

  const profileData = JSON.parse(readFileSync(pkgPath, 'utf8'))
  if (!(key in (profileData.dependencies ?? {}))) {
    return { ok: true, hints: [`profile ${profile} 中已无 ${key} 的登记(可能已卸载)`] }
  }
  // 正在运行本插件的当前 profile:拒绝移除生成器自身(否则本页面会消失)
  const current = findProfileDir()
  if (key === PKG_NAME && current !== null && norm(current) === norm(profileDir)) {
    return { ok: false, hints, error: '不能从当前正在运行本插件的 profile 卸载生成器自身(页面会消失)' }
  }

  // 1) bundles 条目移除
  const bundles = profileData.dsh?.profile?.bundles ?? []
  const before = bundles.length
  profileData.dsh.profile.bundles = bundles.filter(b => b !== key)
  const removedBundle = before !== profileData.dsh.profile.bundles.length ? key : undefined
  writeFileSync(pkgPath, JSON.stringify(profileData, null, 2) + '\n')

  // 2) pnpm remove 依赖
  const rm = spawnSync('pnpm', ['remove', key], { cwd: profileDir, encoding: 'utf8', timeout: 120000 })
  if (rm.status !== 0) {
    return { ok: false, hints, error: `pnpm remove 失败:${String(rm.stderr ?? rm.stdout ?? '').slice(-300)}` }
  }

  hints.push(`已从 profile「${profile}」移除登记:依赖 ${key}` + (removedBundle ? ' + bundles 条目' : ''))
  if (removedBundle) hints.push('该 profile 的实例重启后,侧栏面板即消失(浏览器刷新可见)。')
  hints.push('你的项目目录本身没有被删除——代码与数据仍在,是否删除由你决定。')
  return { ok: true, removedBundle, hints }
}
