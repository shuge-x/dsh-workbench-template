/**
 * 工作台脚手架核心:从 skeleton/ 复制并完成改名。
 * 三个入口共用:根目录 CLI(scaffold.mjs)、HTTP 路由(/api/scaffold)、agent 工具(wbs_scaffold)。
 */
import { copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, isAbsolute, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

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
 * 生成工作台项目。返回 { ok, target, name, id, port, files, nextSteps } 或 { error }。
 */
export function scaffoldProject({ target, name, id } = {}) {
  const checked = validateScaffoldArgs({ target, name, id })
  if (checked.error !== undefined) return { error: checked.error }
  const { target: t, name: n, id: i } = checked
  if (!existsSync(join(SKELETON_DIR, 'package.json'))) {
    return { error: `骨架目录缺失:${SKELETON_DIR}` }
  }

  mkdirSync(t, { recursive: true })
  cpSync(SKELETON_DIR, t, { recursive: true })
  // 规范随行:playbook 快照进生成项目(guard 报错与 AGENTS.md 都引用它,必须就地可查)
  const playbookSrc = join(SKELETON_DIR, '..', 'docs', 'dsh-plugin-playbook.md')
  if (existsSync(playbookSrc)) {
    mkdirSync(join(t, 'docs'), { recursive: true })
    copyFileSync(playbookSrc, join(t, 'docs', 'dsh-plugin-playbook.md'))
  }

  replaceIn(join(t, 'package.json'), [['dsh-myworkbench', n]])
  replaceIn(join(t, 'cordis.patch.yml'), [['dsh-myworkbench', n], ['my-workbench', i]])
  replaceIn(join(t, 'index.js'), [
    ['dsh-myworkbench', n],
    ['myworkbench', i],
  ])
  replaceIn(join(t, 'src', 'client.tsx'), [['dsh-myworkbench', n], ['my-workbench', i]])

  const files = listFiles(t).filter(f => f !== 'node_modules')
  return {
    ok: true,
    target: t,
    name: n,
    id: i,
    files,
    nextSteps: [
      `cd ${t}`,
      'npm install && npm run build',
      // 首次必需:全新 profile 是 base 模板,先初始化出 web 壳(坑 #7);profile 名直接用插件 id,避免 <profile> 占位符被原样复制
      `npx @deepseek-ai/dsh --profile ${i} --from-default-profile web --port 3124`,
      `npx @deepseek-ai/dsh plugin --profile ${i} add ${t}`,
      `npx @deepseek-ai/dsh --profile ${i} --no-open --port 3123`,
    ],
  }
}
