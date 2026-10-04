// Contract test for the built browser half: the module id, the exported
// apply/inject face, and the two registrations apply() performs.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { loadClientModule, mount, pkg, prepare } from './harness.mjs'

const NS = 'session-watch'

test('the browser module registers under the package name', () => {
  const { captured } = loadClientModule()
  assert.equal(captured.id, pkg.name)
  assert.equal(pkg.name, 'dsh-session-watch')
})

test('the factory exports apply and the service inject list', () => {
  const { exports } = prepare()
  assert.equal(typeof exports.apply, 'function')
  assert.ok(Array.isArray(exports.inject))
  for (const service of ['slots', 'locale', 'configForms', 'sessions', 'uiSession', 'workspaces']) {
    assert.ok(exports.inject.includes(service), 'inject must declare ' + service)
  }
})

test('applying registers the sidebar readout, the settings row, and both dictionaries', () => {
  const mounted = mount()

  assert.equal(mounted.page.appended.length, 1, 'one stylesheet is injected')
  assert.equal(mounted.page.appended[0].attributes['data-plugin'], pkg.name)

  assert.deepEqual(
    mounted.locales.map((entry) => entry.ns),
    [NS],
  )
  assert.deepEqual(Object.keys(mounted.locales[0].dicts), ['zh', 'en'])
  assert.deepEqual(
    Object.keys(mounted.locales[0].dicts.zh).sort(),
    Object.keys(mounted.locales[0].dicts.en).sort(),
    'the English dictionary must mirror the Chinese key set',
  )

  const sidebar = mounted.registrations.find((entry) => entry.options.name === 'sidebar.footer.action')
  const settings = mounted.registrations.find((entry) => entry.options.name === 'settings.general.item')
  const section = mounted.registrations.find((entry) => entry.options.name === 'settings.section')
  assert.notEqual(sidebar, undefined, 'the sidebar footer readout is registered')
  assert.notEqual(settings, undefined, 'the settings row is registered')
  assert.equal(section, undefined, 'the settings page must not be registered: the row is the only settings surface')
  assert.equal(sidebar.options.id, NS)
  assert.equal(settings.options.id, NS)
  assert.equal(typeof sidebar.component, 'function')
  assert.equal(typeof settings.component, 'function')

  const face = sidebar.options.inject()
  assert.equal(face.config.getSnapshot().threshold, 10)
  assert.equal(face.config.getSnapshot().variant, 'chips')
  assert.equal(typeof face.config.setThreshold, 'function')
  assert.equal(typeof face.config.setVisible, 'function')
  assert.equal(typeof face.config.setVariant, 'function')
  assert.equal(typeof face.t, 'function')
})

test('the config source writes the Config field that matches a metric', async () => {
  const mounted = mount()
  const face = mounted.registrations.find((entry) => entry.options.name === 'sidebar.footer.action').options.inject()
  face.config.setVisible('idle', false)
  face.config.setVariant('meter')
  face.config.setThreshold(20)
  await Promise.resolve()
  await Promise.resolve()
  assert.deepEqual(mounted.writes, [
    ['showIdle', false],
    ['variant', 'meter'],
    ['threshold', 20],
  ])
})

test('a deployment without the archive namespace still shows the sidebar readout', () => {
  const mounted = mount({ serveNamespace: false })
  const names = mounted.registrations.map((entry) => entry.options.name)
  assert.deepEqual(names, ['sidebar.footer.action'])
})

test('the readout stays an injectable list occupant', () => {
  const sidebar = mount().registrations.find((entry) => entry.options.name === 'sidebar.footer.action')
  assert.equal(typeof sidebar.options.order, 'number')
  assert.equal(typeof sidebar.options.inject, 'function')
  assert.equal(typeof sidebar.options.inject().config.getSnapshot(), 'object')
})
