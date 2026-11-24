/**
 * 工作台脚手架核心:从 skeleton/ 复制并完成改名。
 * 三个入口共用:根目录 CLI(scaffold.mjs)、HTTP 路由(/api/scaffold)、agent 工具(wbs_scaffold)。
 */
import { copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { basename, dirname, isAbsolute, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { fetchOfficialDocs } from './fetch-official.mjs'

/** 骨架目录(包根下的 skeleton/)。 */
export const SKELETON_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'skeleton')

/** 校验并规范化参数;返回 { error } 或 { target, name, id, port }。 */
export function validateScaffoldArgs({ target, name, id, port } = {}) {
  if (target === undefined || String(target).trim() === '') return { error: '缺少目标路径 target' }
  const t = resolve(String(target).trim())
  if (!isAbsolute(t)) return { error: '目标路径必须是绝对路径' }
  if (existsSync(t)) return { error: `目标目录已存在:${t}` }
  const parent = dirname(t)
  if (!existsSync(parent)) return { error: `父目录不存在:${parent}` }

  const nameStr = String(name ?? '').trim()
  const idStr = String(id ?? '').trim()
  if (!/^dsh-[a-z0-9][a-z0-9-]*$/.test(nameStr)) {
    return { error: `包名不合法:${nameStr}(须为 dsh- 开头的小写字母数字连字符,生态惯例如 dsh-media-desk)` }
  }
  if (!/^[a-z][a-z0-9-]*$/.test(idStr)) {
    return { error: `插件 id 不合法:${idStr}(须为小写字母开头的字母数字连字符)` }
  }
  return { target: t, name: nameStr, id: idStr }
}

/**
 * 骨架目录里的本地产物不进生成项目:依赖目录与 .DS_Store 在任何层级都跳过;构建产物
 * (client.js)、锁文件、遗留数据目录只在骨架根上跳过。它们不入库,但在本机存在——
 * 不拦的话每个生成项目都会背上几百个文件的 node_modules,生成的文件清单也会虚高。
 */
function copyFromSkeleton(src) {
  const rel = relative(SKELETON_DIR, src)
  if (rel === '') return true // 骨架根自身
  const base = basename(src)
  if (base === 'node_modules' || base === '.DS_Store') return false
  return !(dirname(rel) === '.' && /^(?:client\.js|package-lock\.json|data)$/.test(base))
}

function replaceIn(file, pairs) {
  let s = readFileSync(file, 'utf8')
  for (const [from, to] of pairs) s = s.split(from).join(to)
  writeFileSync(file, s)
}

function listFiles(dir, base = dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) listFiles(p, base, acc)
    else acc.push(p.slice(base.length + 1))
  }
  return acc
}

/**
 * 生成工作台项目。返回 { ok, target, name, id, officialDocs, files, nextSteps } 或 { error }。
 */
export async function scaffoldProject({ target, name, id } = {}) {
  const checked = validateScaffoldArgs({ target, name, id })
  if (checked.error !== undefined) return { error: checked.error }
  const { target: t, name: n, id: i } = checked
  if (!existsSync(join(SKELETON_DIR, 'package.json'))) {
    return { error: `骨架目录缺失:${SKELETON_DIR}` }
  }

  mkdirSync(t, { recursive: true })
  cpSync(SKELETON_DIR, t, { recursive: true, filter: copyFromSkeleton })
  // 规范随行:playbook 快照进生成项目(guard 报错与 AGENTS.md 都引用它,必须就地可查)
  const playbookSrc = join(SKELETON_DIR, '..', 'docs', 'dsh-plugin-playbook.md')
  if (existsSync(playbookSrc)) {
    mkdirSync(join(t, 'docs'), { recursive: true })
    const playbookDst = join(t, 'docs', 'dsh-plugin-playbook.md')
    copyFileSync(playbookSrc, playbookDst)
    // 手册是以模板仓库视角写的:进了生成项目,`skeleton/xxx` 路径就是本项目的 `xxx`(项目即骨架的拷贝)。
    // 不处理的话,开发 AI 照着「参考实现: skeleton/src/…」找不到文件
    const raw = readFileSync(playbookDst, 'utf8')
    const h1End = raw.indexOf('\n')
    const note = '\n> 本手册随项目附带自 dsh 工作台模板仓库。文中说的 skeleton 指本项目的来源——**本项目就是骨架的一份拷贝**\n'
      + '> (路径与示例里的包名已按本项目改写)。\n'
    writeFileSync(playbookDst, raw.slice(0, h1End) + note + raw.slice(h1End).split('`skeleton/').join('`'))
    replaceIn(playbookDst, [['dsh-myworkbench', n]]) // 示例里的骨架占位包名 → 本项目真名
  }

  replaceIn(join(t, 'package.json'), [['dsh-myworkbench', n]])
  replaceIn(join(t, 'cordis.patch.yml'), [['dsh-myworkbench', n], ['my-workbench', i]])
  replaceIn(join(t, 'index.js'), [
    ['dsh-myworkbench', n],
    ['myworkbench', i],
  ])
  replaceIn(join(t, 'src', 'client.tsx'), [['dsh-myworkbench', n], ['my-workbench', i]])
  // theme.ts 的 PKG 常量(sprite 命名空间化用)也随包名改
  replaceIn(join(t, 'src', 'theme.ts'), [['dsh-myworkbench', n]])
  // locale/*.json(meta.title/description)文案不含包名,故不参与替换;
  // 将来若在展示元数据里加入包名,须在这里同步加 replaceIn

  // 生成后自检:展示元数据必须随骨架齐全(缺了 Plugins 页无标题无图标,坑 #19)
  for (const f of ['locale/en.json', 'locale/zh.json', 'icon.svg']) {
    if (!existsSync(join(t, f))) return { error: `生成结果缺少 ${f}(骨架展示元数据不完整,请检查 skeleton/)` }
  }

  // 官方规范随行:骨架已内置快照(docs/official/dsh-doc/,随上面 cpSync 一起落地),
  // 这里尝试从 GitHub 升级到与本机 dsh 版本对齐的官方版;失败保留快照(VERSION.txt 如实标注)
  const officialDocs = await fetchOfficialDocs(join(t, 'docs', 'official', 'dsh-doc'), {})
  const officialDocsNote = officialDocs.ok
    ? `fetched ${officialDocs.ref}(${officialDocs.files} 个文件${officialDocs.version ? `;本机 dsh ${officialDocs.version}` : ''})`
    // 落到快照时把逐条失败原因带出来:配额(403)该设 GITHUB_TOKEN,超时/抖动重跑即可
    : `snapshot(抓取未升级:${officialDocs.reason};原因:${officialDocs.detail ?? '未知'})`

  const files = listFiles(t)
  return {
    ok: true,
    target: t,
    name: n,
    id: i,
    officialDocs: officialDocsNote,
    files,
    nextSteps: [
      `cd ${t}`,
      '把目录交给 AI 开发工具(ClaudeCode/Codex/OpenCode),按 AGENTS.md 开始开发(官方规范已随行于 docs/official/,必读第一位)',
      './start.sh   # 可选:在 dsh 里预览运行(自动构建/登记/启动)',
    ],
  }
}
