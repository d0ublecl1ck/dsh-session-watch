// Render test for the two registered components, driven through the real
// registration path: mount the built client half, take the components it
// registered, and render them with the framework's standard selectors faked.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { mount, sessionRows, standardHooks, translate } from './harness.mjs'

/** Render one registered component with the props the framework composes. */
function renderRegistered(mounted, name, extra) {
  const entry = mounted.registrations.find((candidate) => candidate.options.name === name)
  assert.notEqual(entry, undefined, name + ' must be registered')
  const face = entry.options.inject()
  const props = {
    wide: true,
    threshold: face.threshold,
    t: translate(mounted),
    ...extra,
  }
  return renderToStaticMarkup(createElement(entry.component, props))
}

test('the badge stays hidden while the count is at the threshold', () => {
  const mounted = mount()
  const list = sessionRows(10)
  const markup = renderRegistered(mounted, 'sidebar.footer.action', standardHooks(list, []))
  assert.equal(markup, '', 'ten unarchived sessions with a threshold of ten show nothing')
})

test('the badge appears strictly above the threshold', () => {
  const mounted = mount()
  const list = sessionRows(11)
  const markup = renderRegistered(mounted, 'sidebar.footer.action', standardHooks(list, []))
  assert.match(markup, /data-unarchived-count="11"/)
  assert.match(markup, /role="status"/)
  assert.match(markup, /未归档会话 11 个，已超过阈值 10 个/)
  assert.match(markup, /<svg/)
})

test('archived and subagent sessions do not push the badge over the line', () => {
  const mounted = mount()
  // 12 ordinary rows, of which 2 are archived and 1 is a subagent child.
  const list = sessionRows(12, { 'session-11': { parentId: 'session-0' } })
  const hooks = standardHooks(list, ['session-9', 'session-10'])
  const markup = renderRegistered(mounted, 'sidebar.footer.action', hooks)
  assert.equal(markup, '', '12 rows minus 2 archived minus 1 child is 9, below ten')
})

test('the settings row shows the accepted threshold, the live count, and the input', () => {
  const mounted = mount({ threshold: 7 })
  const list = sessionRows(9)
  const markup = renderRegistered(mounted, 'settings.general.item', standardHooks(list, []))
  assert.match(markup, /未归档会话提醒/)
  assert.match(markup, /当前 9 个未归档，阈值 7 个/)
  assert.match(markup, /<input[^>]*type="number"/)
  assert.match(markup, /<input[^>]*value="7"/)
  assert.match(markup, /未归档会话阈值/)
})

test('the settings row localizes to English when the dictionary is bound', () => {
  const mounted = mount({ threshold: 7 })
  const list = sessionRows(9)
  const entry = mounted.registrations.find((candidate) => candidate.options.name === 'settings.general.item')
  const face = entry.options.inject()
  const markup = renderToStaticMarkup(createElement(entry.component, {
    wide: true,
    threshold: face.threshold,
    t: translate(mounted, 'en'),
    ...standardHooks(list, []),
  }))
  assert.match(markup, /Unarchived session warning/)
  assert.match(markup, /Currently 9 unarchived, threshold 7/)
})
