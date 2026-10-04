/**
 * Shared harness for the tests that exercise the *built* browser half:
 * load lib/client.js in its own realm, instantiate the factory with a real
 * react, and mount it against a fake client context.
 *
 * The DSH module loader only cares about three things in lib/client.js: the
 * module id equals the package name, the factory returns an apply, and the
 * returned inject list names the services apply touches. A wrong id or a
 * swallowed inject fails silently in the browser, so these helpers mount
 * the real artifact instead of a re-implementation of it.
 */
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'
import { createElement } from 'react'

export const root = dirname(dirname(fileURLToPath(import.meta.url)))
export const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))

/** Minimal DOM stand-in for the injected stylesheet. */
export function fakeDocument() {
  const appended = []
  return {
    appended,
    createElement() {
      return {
        attributes: {},
        textContent: '',
        isConnected: true,
        setAttribute(name, value) {
          this.attributes[name] = value
        },
        remove() {},
      }
    },
    head: {
      appendChild(node) {
        appended.push(node)
      },
    },
  }
}

/**
 * Load lib/client.js in its own realm and return the captured module-loader
 * record plus the sandbox, so callers can hand the bundle the page globals it
 * reads (document) before running it.
 */
export function loadClientModule() {
  const source = readFileSync(join(root, 'lib/client.js'), 'utf8')
  let captured
  const sandbox = {
    window: {
      __ModuleLoader__: {
        load(record) {
          captured = record
        },
      },
    },
    Symbol,
    Object,
    console,
  }
  vm.createContext(sandbox)
  vm.runInContext(source, sandbox, { filename: 'lib/client.js' })
  assert.notEqual(captured, undefined, 'lib/client.js must call window.__ModuleLoader__.load')
  return { captured, sandbox }
}

/**
 * Stand-ins for the Web shell's platform module table. The shell serves the
 * real modules in the browser; the tests only need the shapes the bundle calls,
 * so the tooltip stand-in echoes the label it was handed into the markup.
 */
const PLATFORM_MODULES = {
  '@deepseek-ai/dsh-client-ui-primitives': {
    Tooltip: ({ label, children }) =>
      createElement('span', { 'data-tooltip': typeof label === 'function' ? label() : label }, children),
  },
}

/** Run the factory with a real react (plus the platform stand-ins). */
export function instantiate(captured) {
  const require = createRequire(join(root, 'lib', 'noop.js'))
  return captured.factory((specifier) =>
    Object.hasOwn(PLATFORM_MODULES, specifier) ? PLATFORM_MODULES[specifier] : require(specifier),
  )
}

/** Load the artifact and instantiate it, keeping the sandbox for globals. */
export function prepare() {
  const { captured, sandbox } = loadClientModule()
  return { exports: instantiate(captured), sandbox }
}

/** Collect every registration a fake client context receives. */
export function fakeContext(page, options = {}) {
  const registrations = []
  const injects = []
  const locales = []
  const effects = []
  const writes = []
  const value = {
    threshold: options.threshold ?? 10,
    variant: options.variant ?? 'chips',
    ...(options.value ?? {}),
  }
  const ctx = {
    effect(callback, label) {
      effects.push(label)
      const disposer = callback()
      return () => {
        if (typeof disposer === 'function') disposer()
      }
    },
    slots: {
      inject(key, callback) {
        injects.push(key)
        const disposer = callback()
        return () => {
          if (typeof disposer === 'function') disposer()
        }
      },
      register(options_, component) {
        registrations.push({ options: options_, component })
        return () => {}
      },
    },
    locale: {
      register(ns, dicts) {
        locales.push({ ns, dicts })
        return () => {}
      },
      bind() {
        return (key) => key
      },
    },
    configForms: {
      get() {
        return {
          getSnapshot: () => ({ value }),
          subscribe: () => () => {},
          set: async (field, next) => {
            writes.push([field, next])
            return options.acceptWrites === false ? false : true
          },
        }
      },
      whileServed(namespaces, register) {
        if (options.serveNamespace === false) return () => {}
        const disposer = register(new Set(namespaces))
        return () => {
          if (typeof disposer === 'function') disposer()
        }
      },
    },
    get: () => undefined,
  }
  return { ctx, registrations, injects, locales, effects, writes }
}

/**
 * Mount the built client half and return everything it registered.
 * @param options - threshold / variant / visibility / serveNamespace overrides for the fake Host.
 */
export function mount(options = {}) {
  const page = fakeDocument()
  const { exports, sandbox } = prepare()
  const fake = fakeContext(page, options)
  // The bundle reads the page's document from its own realm, not the test's.
  sandbox.document = page
  exports.apply(fake.ctx)
  return { ...fake, page, exports }
}

/** Build a translate function over the registered dictionary of one locale. */
export function translate(mounted, locale = 'zh') {
  const dicts = mounted.locales[0].dicts[locale]
  return (key, params) =>
    String(dicts[key]).replace(/\{(\w+)\}/g, (_, name) => (params && name in params ? String(params[name]) : '{' + name + '}'))
}

/** Build a Session list snapshot of count ordinary rows. */
export function sessionRows(count, variants = {}) {
  const ids = []
  const byId = {}
  for (let index = 0; index < count; index += 1) {
    const id = 'session-' + String(index)
    ids.push(id)
    byId[id] = variants[id] ?? {}
  }
  return { ids, byId }
}

/** Build a Session status map from [id, status] pairs. */
export function statusMap(...rows) {
  return new Map(rows)
}

/** Fake standard selector hooks over a Session list, statuses, and a Workspace registry. */
export function standardHooks(list, archived = [], items = [], statuses = new Map()) {
  const workspaces = { archivedSessionIds: archived, items }
  return {
    useSessions: (selector) => selector(list),
    useSessionStatus: (selector) => selector(statuses),
    useWorkspaces: (selector) => selector(workspaces),
  }
}
