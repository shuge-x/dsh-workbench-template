#!/usr/bin/env python3
"""体系合规核对(维护者工具,python3,不随包发布):只查「规范有没有用对」,不评判开发质量。

用法: python3 scripts/compliance-audit.py <开发完的生成项目> <基线目录>
基线 = 同一模板提交生成、未经改动的项目(或模板仓的 skeleton/):凡「不得改动」的资产
      (examples/、theme.ts、build.mjs),逐文件与基线比对。取基线:
        git archive <生成项目时所用的模板提交> | tar -x -C /tmp/tpl
        node /tmp/tpl/scaffold.mjs /tmp/baseline --name <同包名> --id <同 id>

检查项:首次提示词与手册明确要求的(切换器挂载 / PANELS 注册 / 根容器);红线(Harness Client 包 /
glyph 名 / SVG 文字 / theme 与 examples 未动 / external 表 / 参数契约 / 注册纪律 / inject 声明);
默认策略(SHOW_EXAMPLES / 零运行时依赖 / 元数据 / 展示身份 / 无开发提示 / token 纪律 / 四态 / 迁移机制);
品牌位(不得注册);门禁与构建。

注意:它是启发式的。「四态」「无开发提示」靠关键词判断,可能误报——命中后要看一眼原文再下结论
(2026-11-25 实测:常量名 TODO_CSS 曾被当成开发提示,已修)。「未开发」的固件会在「切换器 / PANELS /
展示身份 / 四态」上报 ✗,那是尚未开工的标记,不是违规。
"""
import json
import os
import re
import subprocess
import sys

P, SK = os.path.abspath(sys.argv[1]), os.path.abspath(sys.argv[2])
rows = []


def add(ok, item, detail=''):
    rows.append((ok, item, detail))


def read(rel, root=P):
    try:
        return open(os.path.join(root, rel), encoding='utf8').read()
    except FileNotFoundError:
        return None


def walk(rel, root=P):
    """目录下全部文件的相对路径(递归、排序)。"""
    out, base = [], os.path.join(root, rel)
    if not os.path.isdir(base):
        return out
    for d, _, fs in os.walk(base):
        for f in fs:
            out.append(os.path.relpath(os.path.join(d, f), root))
    return sorted(out)


PKG_NAME = (json.loads(read('package.json') or '{}').get('name') or '')


def strip_comments(src):
    """去掉块注释与行注释(避开 URL 里的 //)——注释里的字样不算代码。"""
    src = re.sub(r'/\*.*?\*/', '', src, flags=re.S)
    return re.sub(r"(?<![:\"'])//[^\n]*", '', src)


def diff_lines(a, b):
    """与基线逐行比对同名文件,返回 (基线被改/删的行数, 新增的行数);基线没有该文件时返回 None。"""
    import difflib
    base = read(a, SK)
    if base is None:
        return None
    if a == 'src/theme.ts' and PKG_NAME:
        base = base.replace(f"'{PKG_NAME}'", "'dsh-myworkbench'")  # 两侧都还原脚手架改过的包名
    cur = read(b, P) or ''
    if b == 'src/theme.ts' and PKG_NAME:
        cur = cur.replace(f"'{PKG_NAME}'", "'dsh-myworkbench'")
    bl, cl = base.splitlines(), cur.splitlines()
    rem = add_ = 0
    for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, bl, cl, autojunk=False).get_opcodes():
        if tag in ('replace', 'delete'):
            rem += i2 - i1
        if tag in ('replace', 'insert'):
            add_ += j2 - j1
    return rem, add_


# ConfigPage 渲染在插件管理页里,不算业务页面(guard 同样豁免它)
pages = [f for f in walk('src/pages') if f.endswith('.tsx') and os.path.basename(f) != 'ConfigPage.tsx']
client = read('src/client.tsx') or ''
glyphs = set(re.findall(r'^  "([a-z0-9-]+)": \{', read('src/design/icons-data.ts') or '', re.M))

# ── 首次提示词与工作流明确要求的 ──
sw_pages = [f for f in pages if '<DesignSwitcher' in (read(f) or '')]
add(bool(sw_pages), '切换器:第一个业务页面顶栏挂载 <DesignSwitcher />', ', '.join(sw_pages) or '没有任何页面挂载')
sw_ok = all(re.search(r"from\s+'(\.\./design/switcher|\.\./design/switcher\.tsx)'", read(f) or '') for f in sw_pages) if sw_pages else False
add(sw_ok, '切换器:从 src/design/switcher 导入(不是复制一份)', '' if not sw_pages or sw_ok else '有页面用了 <DesignSwitcher> 但导入路径不对')

panels = re.search(r'^const PANELS[^\n]*\[\n(.*?)^\]', client, re.S | re.M)
live = [l for l in (panels.group(1).splitlines() if panels else []) if l.strip() and not l.strip().startswith('//')]
add(len(live) > 0, '面板:在 client.tsx 的 PANELS 注册', f'{len(live)} 条')
ids = re.findall(r"id:\s*['\"]([^'\"]+)['\"]", '\n'.join(live))
add(len(ids) == len(set(ids)), '面板:id 不重复', ' '.join(ids))
add(bool(ids) and all(re.match(r'^[a-z0-9-]+-', x) for x in ids), '面板:id 带包名前缀(主面板槽的 key 不能重复)', ' '.join(ids))

for f in pages:
    s = read(f) or ''
    root_ok = 'className="wb-page"' in s
    add(root_ok, f'根容器:{f} 根节点是 .wb-page', '' if root_ok else '未见 className="wb-page"')

# ── 红线 ──
bad_imports = [f for f in walk('src') if re.search(r"from\s+['\"]@deepseek-ai/dsh-client", read(f) or '')]
add(not bad_imports, '红线 5:src/ 无 Harness Client 包 import', ' '.join(bad_imports))
used = set(re.findall(r'glyph=[{"\']\s*["\']?([a-z0-9-]+)', '\n'.join(read(f) or '' for f in pages)))
unknown = sorted(used - glyphs)
add(not unknown, '红线 5:WbIcon 的 glyph 名都存在于 icons-data.ts', ('未知: ' + ' '.join(unknown)) if unknown else f'用到 {len(used)} 个')
svg_text = [f for f in pages if re.search(r'<text[\s>]', read(f) or '')]
add(not svg_text, '红线 6:SVG 里没有 <text>', ' '.join(svg_text))

ex_changed = []
for f in walk('src/examples', SK):
    d = diff_lines(f, f)
    if d is None or d != (0, 0) or read(f) is None:
        ex_changed.append(f)
extra_ex = [f for f in walk('src/examples') if read(f, SK) is None]
add(not ex_changed and not extra_ex, '首次提示词:examples/ 未被改动', ' '.join(ex_changed + extra_ex) or f'{len(walk("src/examples"))} 个文件与基线一致')

th = diff_lines('src/theme.ts', 'src/theme.ts')
add(th is not None and th[0] == 0, '红线 4:theme.ts 既有内容未被改动(只允许尾部追加)', f'基线行被改/删 {th[0]} 行,新增 {th[1]} 行' if th else 'theme.ts 不见了')

bd = diff_lines('build.mjs', 'build.mjs')
add(bd is not None and bd == (0, 0), '红线 8:build.mjs(external 表)未动', '' if bd == (0, 0) else f'-{bd[0]} +{bd[1]}')

host_src = strip_comments('\n'.join(read(f) or '' for f in ['index.js'] + walk('service')))
add('required: false' not in host_src, '红线 2:没有 required: false(坑 #1)')
poison = [f for f in ['index.js'] + walk('service') if re.search(r"parameters:\s*\{\s*[\"']?type[\"']?\s*:\s*[\"']", read(f) or '')]
add(not poison, '红线 2:parameters 是逐属性映射(坑 #21)', ' '.join(poison))

cross = [f for f in pages if re.search(r"from\s+['\"][./]*(examples|src/examples)", read(f) or '')]
add(not cross, '红线 3:业务页面不 import 示例区', ' '.join(cross))

# ── 注册纪律 ──
client_code = strip_comments(client)
brand = sorted(set(f for f in ['src/client.tsx'] + walk('src') if re.search(r"slots\.(inject|register)\(\s*['\"]sidebar\.brand\.", strip_comments(read(f) or ''))))
add(not brand, '坑 #28:没有往侧栏品牌位(sidebar.brand.*)注册——会让热更新后插件停在卸载态', ' '.join(brand))
direct = re.findall(r'ctx\.tools\.register\(', host_src)
add(len(direct) <= 1, '红线 7:工具注册走统一的 effect + disposer(不散落裸注册)', f'ctx.tools.register 出现 {len(direct)} 处(应为 1 处,在统一注册块里)')
faces = set(re.findall(r"ctx\.(sessionProjections|sidebarRightTabs|sidebarRight|llm|tools|webServer|connection|slots|locale)\b", host_src))
inject = re.search(r"export const inject = \[(.*?)\]", host_src, re.S)
declared = set(re.findall(r"'([A-Za-z]+)'", inject.group(1))) if inject else set()
missing = sorted(faces - declared)
add(not missing, '坑 #20:Host 半区用到的 ctx 面都在 inject 里声明', ('未声明: ' + ' '.join(missing)) if missing else ' '.join(sorted(faces)))
cinject = re.search(r"export const inject = \[(.*?)\]", client, re.S)
cfaces = set(re.findall(r"ctx\.(sidebarRightTabs|sidebarRight)\b", '\n'.join(read(f) or '' for f in walk('src') if not f.startswith('src/examples/'))))
cdec = set(re.findall(r"'([A-Za-z]+)'", cinject.group(1))) if cinject else set()
add(not (cfaces - cdec), '坑 #20:Client 半区用到的 ctx 面都在 inject 里声明', ' '.join(sorted(cfaces - cdec)) or '无需额外声明')

# ── 默认策略 ──
se = re.search(r'const SHOW_EXAMPLES = (true|false)', client)
add(bool(se and se.group(1) == 'false'), '策略 1:SHOW_EXAMPLES 交付时为 false(临时开启后已回滚)', se.group(1) if se else '?')
pkg = json.loads(read('package.json'))
add('dependencies' not in pkg or not pkg['dependencies'], '依赖不变量:没有新增运行时 dependencies', str(pkg.get('dependencies') or '无'))
for k in ['locale/*.json', 'icon.svg']:
    add(k in pkg.get('files', []), f'元数据:files 含 {k}')
add(pkg.get('exports', {}).get('./icon') is not None and pkg.get('exports', {}).get('./locale/*.json') is not None, '元数据:exports 含 ./icon 与 ./locale/*.json')

# 手册自身指向的东西(骨架缺陷会在这里现形,不算开发问题)
add(read('DESIGN.md') is not None, '手册:必读第 ③ 步指向的根目录 DESIGN.md 存在', '' if read('DESIGN.md') is not None else '骨架缺陷:生成时就没有')

# 展示身份(工作流第 7 步):交付时应换成业务身份
try:
    zh_meta = (json.loads(read('locale/zh.json') or '{}').get('meta') or {})
except Exception:
    zh_meta = {}
ident = []
if '骨架,复制后全局改名' in str(pkg.get('description') or ''):
    ident.append('package.json description 仍是占位')
if zh_meta.get('title') == '工作台':
    ident.append('locale/zh.json meta.title 仍是「工作台」')
add(not ident, '展示身份:已换成业务身份(locale meta / 包描述)', ' ; '.join(ident) or f'标题「{zh_meta.get("title")}」')

hints = []
for f in pages:
    s = strip_comments(read(f) or '')
    for kw in ['registry', 'AGENTS', 'AI 开发', '范式', '示例区', 'SHOW_EXAMPLES', '待实现', 'TODO']:
        kwpat = r'(?<![A-Za-z_])TODO(?![A-Za-z_])' if kw == 'TODO' else re.escape(kw)  # 不把 TODO_CSS 这类标识符当成提示
        if re.search(r"""[>"'`]([^"'`<>]*""" + kwpat + r"""[^"'`<>]*)[<"'`]""", s):
            hints.append(f'{f}:{kw}')
add(not hints, '策略 5:业务页面不渲染开发提示', ' '.join(hints) or '未见')
raw = []
for f in pages:
    found = re.findall(r'(?<!&)#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b', read(f) or '')
    if found:
        raw.append(f'{f}:{" ".join(sorted(set(found)))}')
add(not raw, 'token 纪律:业务页面不裸写颜色', ' '.join(raw) or '未见')

# ── 四态(只查有没有,不查好坏;关键词启发式)──
tp = '\n'.join(read(f) or '' for f in pages)
for name, pat in [('加载', r'骨架|skeleton|加载中|loading'), ('空态', r'空态|暂无|还没有|没有待办'), ('错误+重试', r'重试|retry'), ('无权限', r'无权限|没有权限|未授权|无权')]:
    add(bool(re.search(pat, tp, re.I)), f'四态:{name}')

# ── 数据层策略 ──
db = read('service/db.mjs') or ''
add(bool(re.search(r'user_version', db)), '策略 4:表结构演进经 PRAGMA user_version(非裸改 CREATE TABLE)', '' if 'user_version' in db else 'service/db.mjs 未提及 user_version')
ddl = len(re.findall(r'CREATE TABLE', db))
ddl0 = len(re.findall(r'CREATE TABLE', read('service/db.mjs', SK) or ''))
add(ddl >= ddl0, '策略 4:既有建表语句未被删改(只增不减)', f'CREATE TABLE 基线 {ddl0} → 现在 {ddl}')
idx = read('index.js') or ''
add('configureDataDir' in idx, '策略 4:数据目录经 ctx.baseUrl 定位(不靠环境变量,坑 #23)', '' if 'configureDataDir' in idx else 'index.js 没有调用 configureDataDir')

# ── 门禁与构建 ──
for cmd, label in [(['npm', 'run', 'guard', '--silent'], 'npm run guard'), (['npm', 'run', 'build', '--silent'], 'npm run build')]:
    if not os.path.isdir(os.path.join(P, 'node_modules')):
        add(False, label, 'node_modules 不存在(尚未安装依赖)')
        continue
    r = subprocess.run(cmd, cwd=P, capture_output=True, text=True)
    out = (r.stdout + r.stderr).strip().splitlines()
    fails = [l for l in out if '✗' in l or '⚠' in l]
    add(r.returncode == 0, f'{label}(退出码 {r.returncode})', ' | '.join(x.strip()[:110] for x in fails) if fails else '')

bad = [r for r in rows if not r[0]]
w = max(len(r[1]) for r in rows)
for ok, item, detail in rows:
    print(f"  {'✓' if ok else '✗'} {item:{w}s}  {detail[:150]}")
print(f"\n合规核对:{len(rows) - len(bad)}/{len(rows)} 项符合" + (f";不符合 {len(bad)} 项" if bad else ''))
