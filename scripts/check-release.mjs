#!/usr/bin/env node
/**
 * Release readiness check for this bundle.
 *
 * Offline on purpose: no network, no credentials, no build. It answers the
 * questions a release keeps getting wrong by hand — is the manifest complete,
 * is `lib/` newer than `src/`, does the browser bundle still only require the
 * shell's platform modules, and does the host entry keep the named-export
 * contract the Loader needs.
 *
 * Every failure names the file and the fix. Usage: `npm run check-release`.
 *
 * @module dsh-unarchived-watch/scripts/check-release
 */
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const failures = []
const passes = []
const fail = (message) => failures.push(message)
const pass = (message) => passes.push(message)
const read = (path) => readFileSync(join(root, path), 'utf8')
const exists = (path) => existsSync(join(root, path))

/** SHA-256 of every build input, keyed by repo-relative path. */
function sourceHashes() {
  const hashes = {}
  const record = (absolute) => {
    hashes[relative(root, absolute)] = createHash('sha256').update(readFileSync(absolute)).digest('hex')
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
  return hashes
}

/** The Web shell's platform module table (see dsh-web-frontend `staticModules`). */
const PLATFORM_MODULES = new Set([
  'react',
  'react/jsx-runtime',
  'react-dom',
  'react-dom/client',
  '@deepseek-ai/cordis',
  '@deepseek-ai/dsh-client-store',
  '@deepseek-ai/dsh-client-ui-slots',
  '@deepseek-ai/dsh-client-ui-primitives',
  '@deepseek-ai/dsh-client-ui-dockkit',
])

// 1. Manifest completeness.
const pkg = JSON.parse(read('package.json'))
if (typeof pkg.name !== 'string' || !pkg.name.startsWith('dsh-')) fail('package.json: name must keep the dsh- prefix')
else pass('name: ' + pkg.name + '@' + pkg.version)
if (!/^\d+\.\d+\.\d+$/.test(String(pkg.version))) fail('package.json: version must be plain semver')
for (const file of pkg.files ?? []) if (!exists(file)) fail('package.json files lists a missing path: ' + file)
const patch = pkg.dsh?.bundle?.patch
if (typeof patch !== 'string' || !exists(patch)) fail('package.json: dsh.bundle.patch is missing or points at nothing (a package without it installs as a plain dependency)')
else if (!(pkg.files ?? []).some((file) => file.includes('cordis.patch.yml'))) fail('package.json files must include cordis.patch.yml, or a published tarball drops the layer')
else pass('bundle patch: ' + patch)
if (pkg.dsh?.client?.platform !== 'web') fail('package.json: dsh.client.platform must be "web"')
if (!Array.isArray(pkg.dsh?.client?.inject) || pkg.dsh.client.inject.length === 0) fail('package.json: dsh.client.inject must list the client modules this half registers into')
if (typeof pkg.repository?.url !== 'string' || !pkg.repository.url.includes('github.com')) fail('package.json: repository.url is required for a publishable package')
else pass('repository: ' + pkg.repository.url)

// 2. Entry points actually exist and are exported.
const entry = typeof pkg.main === 'string' ? pkg.main : pkg.exports?.['.']?.default
const clientEntry = pkg.exports?.['./client']?.default ?? pkg.exports?.['./client']
if (typeof entry !== 'string' || !exists(entry)) fail('package.json: main/exports["."] does not resolve to a file')
if (typeof clientEntry !== 'string' || !exists(clientEntry)) fail('package.json: exports["./client"] does not resolve to a file')
for (const doc of ['README.md', 'README.en.md', 'CHANGELOG.md', 'LICENSE', 'AGENTS.md']) {
  if (!exists(doc)) fail('missing release document: ' + doc)
}

// 3. Host entry contract (the Loader folds a module that also has export default).
if (typeof entry === 'string' && exists(entry)) {
  const source = read(entry)
  if (/^\s*export\s+default\b/m.test(source)) fail(entry + ': export default folds the module and drops inject metadata (postmortem 0001)')
  for (const marker of ['export const name', 'export const Config', 'export function apply']) {
    if (!source.includes(marker)) fail(entry + ': missing ' + marker)
  }
  pass('host entry: named name/Config/apply, no default export')
}

// 4. Browser bundle: correct module id, and no dependency outside the platform table.
if (typeof clientEntry === 'string' && exists(clientEntry)) {
  const bundle = read(clientEntry)
  if (!bundle.includes('"id": "' + pkg.name + '"') && !bundle.includes("id: '" + pkg.name + "'") && !bundle.includes('id: "' + pkg.name + '"')) {
    fail(clientEntry + ': window.__ModuleLoader__.load id must equal the package name')
  }
  const required = new Set([...bundle.matchAll(/require\("([^"]+)"\)/g)].map((match) => match[1]))
  for (const specifier of required) {
    if (!PLATFORM_MODULES.has(specifier)) fail(clientEntry + ': requires "' + specifier + '", which the shell\'s module table does not provide (inline it instead)')
  }
  pass('client bundle: id=' + pkg.name + ', requires ' + [...required].sort().join(', '))
}

// 5. Build provenance: the shipping failure this project actually hits is a
//    lib/ nobody rebuilt after editing src/. mtime cannot tell that on a fresh
//    clone, so compare content hashes recorded at build time.
if (!exists('lib/build-manifest.json')) fail('lib/build-manifest.json is missing; run npm run build')
else {
  const recorded = JSON.parse(read('lib/build-manifest.json')).sources ?? {}
  const current = sourceHashes()
  const drift = []
  for (const [path, hash] of Object.entries(current)) {
    if (recorded[path] === undefined) drift.push('new: ' + path)
    else if (recorded[path] !== hash) drift.push('changed: ' + path)
  }
  for (const path of Object.keys(recorded)) if (current[path] === undefined) drift.push('removed: ' + path)
  if (drift.length > 0) {
    fail('lib/ was built from a different source tree; run npm run build (' + drift.slice(0, 5).join(', ') + ')')
  } else pass('lib/ matches the recorded source hashes (' + Object.keys(recorded).length + ' inputs)')
}

// 6. Report.
for (const line of passes) process.stdout.write('PASS ' + line + '\n')
for (const line of failures) process.stdout.write('FAIL ' + line + '\n')
if (failures.length === 0) {
  process.stdout.write('\nrelease-ready: ' + pkg.name + '@' + pkg.version + '\n')
  process.exit(0)
}
process.stdout.write('\nnot release-ready (' + failures.length + ' problem(s))\n')
process.exit(1)
