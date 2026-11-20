#!/usr/bin/env node
/**
 * 构建 dsh 客户端插件 bundle。
 *
 * dsh 的 client bundle 是闭包工厂格式:bundle 调用
 *   window.__ModuleLoader__.load({ id, factory: (require) => { ... return module.exports; } })
 * 外部依赖(react 等)不打包,运行时经注入的 require 从壳的模块表解析
 * (种子表含 react / react-jsx-runtime / ui-slots / ui-primitives 等)。
 * 工厂包装用 esbuild 的 banner/footer 完成,--watch 下同样生效。
 */
import { build } from 'esbuild'
import { readFile, stat } from 'node:fs/promises'

const pkg = JSON.parse(await readFile(new URL('./package.json', import.meta.url), 'utf8'))
const ID = pkg.name
const watch = process.argv.includes('--watch')

const banner =
  `window.__ModuleLoader__.load({ id: ${JSON.stringify(ID)}, factory: (require) => {\n` +
  `var module = { exports: {} }; var exports = module.exports;`
const footer = `return module.exports; } });`

await build({
  entryPoints: ['src/client.tsx'],
  bundle: true,
  format: 'cjs',
  platform: 'browser',
  target: 'es2022',
  jsx: 'automatic',
  outfile: 'client.js',
  legalComments: 'none',
  banner: { js: banner },
  footer: { js: footer },
  // 种子表内的模块保持外部引用,运行时由壳注入的 require 解析。
  external: [
    'react',
    'react/jsx-runtime',
    'react-dom',
    'react-dom/client',
    '@deepseek-ai/cordis',
    '@deepseek-ai/dsh-client-store',
    '@deepseek-ai/dsh-client-ui-slots',
    '@deepseek-ai/dsh-client-ui-primitives',
    '@deepseek-ai/dsh-client-ui-dockkit',
  ],
  ...(watch
    ? {
        watch: {
          onRebuild(error) {
            if (error) console.error('[build] failed', error.message)
            else console.log('[build] rebuilt', new Date().toLocaleTimeString())
          },
        },
      }
    : {}),
})

if (!watch) {
  const info = await stat('client.js')
  console.log(`[build] client.js (${(info.size / 1024).toFixed(1)} KiB)`)
}
