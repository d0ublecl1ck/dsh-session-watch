// Contract test for the built browser half: the module id, the exported
// `apply`/`inject` face, and the two registrations apply() performs.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { loadClientModule, mount, pkg, prepare } from './harness.mjs'

test('the browser module registers under the package name', () => {
  const { captured } = loadClientModule()
  assert.equal(captured.id, pkg.name)
})

test('the factory exports apply and the service inject list', () => {
  const { exports } = prepare()
  assert.equal(typeof exports.apply, 'function')
  assert.ok(Array.isArray(exports.inject))
  for (const service of ['slots', 'locale', 'configForms', 'sessions', 'workspaces']) {
    assert.ok(exports.inject.includes(service), 'inject must declare ' + service)
  }
})

test('applying registers the sidebar icon, the settings row, and both dictionaries', () => {
  const mounted = mount()

  assert.equal(mounted.page.appended.length, 1, 'one stylesheet is injected')
  assert.equal(mounted.page.appended[0].attributes['data-plugin'], pkg.name)

  assert.deepEqual(
    mounted.locales.map((entry) => entry.ns),
    ['unarchived-watch'],
  )
  assert.deepEqual(Object.keys(mounted.locales[0].dicts), ['zh', 'en'])

  const sidebar = mounted.registrations.find((entry) => entry.options.name === 'sidebar.footer.action')
  const settings = mounted.registrations.find((entry) => entry.options.name === 'settings.general.item')
  const section = mounted.registrations.find((entry) => entry.options.name === 'settings.section')
  assert.notEqual(sidebar, undefined, 'the sidebar footer action is registered')
  assert.notEqual(settings, undefined, 'the settings row is registered')
  assert.notEqual(section, undefined, 'the settings page is registered')
  assert.equal(sidebar.options.id, 'unarchived-watch')
  assert.equal(settings.options.id, 'unarchived-watch')
  assert.equal(section.options.id, 'unarchived-watch')
  assert.equal(typeof sidebar.component, 'function')
  assert.equal(typeof settings.component, 'function')
  assert.equal(typeof section.component, 'function')
  // The fake locale binder returns the key verbatim; the real one resolves it.
  assert.equal(section.options.label(), 'section.nav')

  const face = sidebar.options.inject()
  assert.equal(face.threshold.getSnapshot(), 10)
  assert.equal(typeof face.t, 'function')
  assert.equal(typeof settings.options.inject().threshold.set, 'function')
})

test('a deployment without the archive namespace still shows the sidebar icon', () => {
  const mounted = mount({ serveNamespace: false })
  const names = mounted.registrations.map((entry) => entry.options.name)
  assert.deepEqual(names, ['sidebar.footer.action'])
})

test('the icon stays a list occupant with its own order and entry key', () => {
  const sidebar = mount().registrations.find((entry) => entry.options.name === 'sidebar.footer.action')
  assert.equal(sidebar.options.order, 920)
  assert.equal(typeof sidebar.options.inject, 'function')
})
