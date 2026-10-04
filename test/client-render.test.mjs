// Render test for the two registered components, driven through the real
// registration path: mount the built client half, take the components it
// registered, and render them with the framework's standard selectors faked.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { mount, sessionRows, standardHooks, statusMap, translate } from './harness.mjs'

/** Render one registered component with the props the framework composes. */
function renderRegistered(mounted, name, extra, locale = 'zh') {
  const entry = mounted.registrations.find((candidate) => candidate.options.name === name)
  assert.notEqual(entry, undefined, name + ' must be registered')
  const face = entry.options.inject()
  const props = {
    wide: true,
    config: face.config,
    t: translate(mounted, locale),
    ...extra,
  }
  return renderToStaticMarkup(createElement(entry.component, props))
}

/**
 * The fixture shared by the readout tests: six ordinary Sessions split across
 * every metric, plus one subagent child and one blank seat that must not count.
 */
function fixture() {
  const list = sessionRows(8, {
    'session-6': { parentId: 'session-0' },
    'session-7': { blank: true },
  })
  const statuses = statusMap(
    ['session-0', { running: true }],
    ['session-1', { running: true, pendingInteraction: { kind: 'approval' } }],
    ['session-2', { running: false, completionUnread: true }],
    ['session-3', { running: false, completionUnread: false }],
    ['session-4', {}],
    ['session-5', {}],
  )
  const archived = ['session-4', 'session-5']
  return { list, statuses, archived }
}

test('the chips readout shows every visible metric with its own count', () => {
  const mounted = mount()
  const { list, statuses, archived } = fixture()
  const markup = renderRegistered(mounted, 'sidebar.footer.action', standardHooks(list, archived, [], statuses))
  assert.match(markup, /data-variant="chips"/)
  for (const metric of ['running', 'unread', 'pending', 'idle', 'unarchived', 'archived']) {
    assert.match(markup, new RegExp('data-metric="' + metric + '"'), 'the ' + metric + ' chip is rendered')
  }
  assert.match(markup, /data-metric="running"[^>]*>[\s\S]*?sw-chip-count">1</)
  assert.match(markup, /data-metric="pending"[^>]*>[\s\S]*?sw-chip-count">1</)
  assert.match(markup, /data-metric="unread"[^>]*>[\s\S]*?sw-chip-count">1</)
  assert.match(markup, /data-metric="idle"[^>]*>[\s\S]*?sw-chip-count">1</)
  assert.match(markup, /data-metric="unarchived"[^>]*>[\s\S]*?sw-chip-count">4</)
  assert.match(markup, /data-metric="archived"[^>]*>[\s\S]*?sw-chip-count">2</)
})

test('only the enabled metrics are rendered', () => {
  const mounted = mount({ value: { showIdle: false, showArchived: false } })
  const { list, statuses, archived } = fixture()
  const markup = renderRegistered(mounted, 'sidebar.footer.action', standardHooks(list, archived, [], statuses))
  assert.doesNotMatch(markup, /data-metric="idle"/)
  assert.doesNotMatch(markup, /data-metric="archived"/)
  assert.match(markup, /data-metric="running"/)
})

test('hiding every metric renders nothing at all', () => {
  const mounted = mount({
    value: {
      showRunning: false,
      showUnread: false,
      showPending: false,
      showIdle: false,
      showUnarchived: false,
      showArchived: false,
    },
  })
  const { list, statuses, archived } = fixture()
  const markup = renderRegistered(mounted, 'sidebar.footer.action', standardHooks(list, archived, [], statuses))
  assert.equal(markup, '')
})

test('the unarchived metric turns warning-coloured past the threshold', () => {
  const above = mount({ threshold: 3 })
  const { list, statuses, archived } = fixture()
  const warned = renderRegistered(above, 'sidebar.footer.action', standardHooks(list, archived, [], statuses))
  assert.match(warned, /data-metric="unarchived" data-warn="true"/)
  assert.match(warned, /未归档 4 个，已超过阈值 3 个/)

  const below = mount({ threshold: 10 })
  const quiet = renderRegistered(below, 'sidebar.footer.action', standardHooks(list, archived, [], statuses))
  assert.match(quiet, /data-metric="unarchived"([^>]*)>/)
  assert.doesNotMatch(quiet, /data-metric="unarchived" data-warn="true"/)
})

test('the collapsed rail shows one mark with the unarchived count', () => {
  const mounted = mount()
  const { list, statuses, archived } = fixture()
  const markup = renderRegistered(mounted, 'sidebar.footer.action', {
    wide: false,
    ...standardHooks(list, archived, [], statuses),
  })
  assert.match(markup, /class="sw-rail"/)
  assert.match(markup, /class="sw-rail-count"[^>]*>4</)
  assert.doesNotMatch(markup, /sw-chip/)
})

test('the meter layout renders the bar and the same legend numbers', () => {
  const mounted = mount({ variant: 'meter' })
  const { list, statuses, archived } = fixture()
  const markup = renderRegistered(mounted, 'sidebar.footer.action', standardHooks(list, archived, [], statuses))
  assert.match(markup, /data-variant="meter"/)
  assert.match(markup, /class="sw-meter-bar"/)
  assert.match(markup, /class="sw-meter-seg" data-metric="running"/)
  assert.match(markup, /data-metric="unarchived"[^>]*>[\s\S]*?sw-chip-count">4</)
})

test('the settings row offers every toggle, every layout, and the threshold input', () => {
  const mounted = mount({ threshold: 7, variant: 'grid' })
  const { list, statuses, archived } = fixture()
  const markup = renderRegistered(mounted, 'settings.general.item', standardHooks(list, archived, [], statuses))
  assert.match(markup, /Session Watch 状态显示/)
  for (const metric of ['running', 'unread', 'pending', 'idle', 'unarchived', 'archived']) {
    assert.match(markup, new RegExp('class="sw-toggle" data-metric="' + metric + '"'))
  }
  assert.equal((markup.match(/type="checkbox"/g) ?? []).length, 6, 'one checkbox per metric')
  for (const label of ['胶囊', '比例条']) {
    assert.match(markup, new RegExp(label), 'the ' + label + ' layout control is offered')
  }
  assert.equal((markup.match(/sw-variant[" ]/g) ?? []).length, 2, 'exactly the two offered layouts render')
  assert.match(markup, /<input[^>]*type="number"/)
  assert.match(markup, /<input[^>]*value="7"/)
  assert.match(markup, /未归档会话阈值/)
})

test('the settings row localizes to English when the dictionary is bound', () => {
  const mounted = mount({ threshold: 7 })
  const markup = renderRegistered(mounted, 'settings.general.item', standardHooks(sessionRows(2)), 'en')
  assert.match(markup, /Session Watch readout/)
  assert.match(markup, /Unarchived session threshold/)
})
