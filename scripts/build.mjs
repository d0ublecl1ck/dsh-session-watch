// Build entry: tsc for the host half (and the shared counter the Node tests
// import), then esbuild + the DSH module-loader wrapper for the browser half.
//
// The client bundle keeps React and the shared platform modules external (the
// Web shell's module table provides them) and inlines everything else, then
// wraps the CJS output in `window.__ModuleLoader__.load({ id, factory })`.
import { execSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as esbuild from 'esbuild'

const root = dirname(dirname(fileURLToPath(import.meta.url)))

// 1) Host half + the shared counter: ESM with declarations and sourcemaps.
execSync('npx tsc -p tsconfig.json', { cwd: root, stdio: 'inherit' })

// 2) Client half.
const tmp = join(root, '.tmp')
mkdirSync(tmp, { recursive: true })
await esbuild.build({
  entryPoints: [join(root, 'src/client/index.ts')],
  outfile: join(tmp, 'client.js'),
  bundle: true,
  format: 'cjs',
  platform: 'browser',
  target: ['es2020'],
  // Exactly the Web shell's platform module table: everything else is inlined.
  external: [
    'react',
    'react/jsx-runtime',
    'react-dom',
    'react-dom/client',
    '@deepseek-ai/cordis',
    '@deepseek-ai/dsh-client-store',
    '@deepseek-ai/dsh-client-ui-slots',
    '@deepseek-ai/dsh-client-ui-primitives',
  ],
  jsx: 'automatic',
  sourcemap: true,
  logLevel: 'info',
})

// 3) Wrap into the DSH browser module-loader contract. The id must equal the
//    package name, or the browser half never mounts.
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
const bundle = readFileSync(join(tmp, 'client.js'), 'utf8')
const wrapped = [
  'window.__ModuleLoader__.load({',
  `  id: ${JSON.stringify(pkg.name)},`,
  '  factory: (require) => {',
  '    var module = { exports: {} };',
  '    var exports = module.exports;',
  "    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });",
  bundle.trim(),
  '    return module.exports;',
  '  }',
  '});',
  '',
  '//# sourceMappingURL=client.js.map',
].join('\n')

mkdirSync(join(root, 'lib'), { recursive: true })
writeFileSync(join(root, 'lib/client.js'), wrapped)
const map = join(tmp, 'client.js.map')
if (existsSync(map)) copyFileSync(map, join(root, 'lib/client.js.map'))

// 4) Record what this build was made from. mtimes do not survive a fresh
//    clone; content hashes do, so check-release can tell a built-and-committed
//    lib/ from a lib/ that nobody rebuilt after editing src/.
const sources = {}
const record = (absolute) => {
  sources[relative(root, absolute)] = createHash('sha256').update(readFileSync(absolute)).digest('hex')
}
const walk = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) walk(path)
    else record(path)
  }
}
walk(join(root, 'src'))
record(join(root, 'scripts/build.mjs'))
writeFileSync(
  join(root, 'lib/build-manifest.json'),
  JSON.stringify({ package: pkg.name, version: pkg.version, sources }, null, 2) + '\n',
)
