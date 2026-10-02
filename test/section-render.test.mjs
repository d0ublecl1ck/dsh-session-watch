// Render test for the Settings page ("the board"), driven through the real
// registration path like the other client render tests: mount the built client
// half, take the section component it registered, render it with the
// framework's standard selectors faked over real-shaped snapshots.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { mount, standardHooks, translate } from './harness.mjs'

/** Render the registered \`settings.section\` component with fake snapshots. */
function renderSection(mounted, { list, archived = [], items = [] }) {
  const entry = mounted.registrations.find((candidate) => candidate.options.name === 'settings.section')
  assert.notEqual(entry, undefined, 'the settings page must be registered')
  const face = entry.options.inject()
  return renderToStaticMarkup(
    createElement(entry.component, {
      threshold: face.threshold,
      t: translate(mounted),
      ...standardHooks(list, archived, items),
    }),
  )
}

/** A Session list snapshot built around the real clock. */
function snapshot() {
  const now = Date.now()
  return {
    ids: ['s1', 's2', 's3', 's4', 'child', 'blank', 'archived'],
    byId: {
      s1: { displayTitle: '账单对齐', updatedAt: now - 5 * 60000, running: true },
      s2: { displayTitle: '分组限额', updatedAt: now - 3 * 3600000 },
      s3: { displayTitle: '键位重排', updatedAt: now - 30 * 3600000 },
      s4: { displayTitle: '临时排查', updatedAt: now - 60000 },
      child: { displayTitle: '子代理会话', parentId: 's1' },
      blank: { displayTitle: '新会话', blank: true },
      archived: { displayTitle: '已归档会话' },
    },
  }
}

const ITEMS = [
  { workspaceId: 'w1', title: 'add_account', path: '/Users/me/add_account', sessionIds: ['s1', 's2'] },
]

test('the board states the count, the threshold, and whether the light is on', () => {
  const markup = renderSection(mount({ threshold: 2 }), { list: snapshot(), archived: ['archived'], items: ITEMS })
  assert.match(markup, /未归档会话/)
  assert.match(markup, /当前 4 个未归档普通会话，阈值为 2 个。/)
  assert.match(markup, /已超过阈值，侧边栏底部会亮起警告图标。/)
  assert.match(markup, /口径：只数普通会话 —— 已归档、子代理子会话与空白新建会话都不计入。/)
})

test('the board says the light is off while the count is under the threshold', () => {
  const markup = renderSection(mount({ threshold: 10 }), { list: snapshot(), archived: ['archived'], items: ITEMS })
  assert.match(markup, /未超过阈值，侧边栏不亮灯。/)
  assert.doesNotMatch(markup, /已超过阈值/)
})

test('the board groups by workspace and parks unaccounted rows last', () => {
  const markup = renderSection(mount({ threshold: 100 }), { list: snapshot(), archived: ['archived'], items: ITEMS })
  const alpha = markup.indexOf('add_account')
  const ungrouped = markup.indexOf('未归属工作区')
  assert.ok(alpha >= 0, 'the workspace group renders with its title')
  assert.ok(ungrouped > alpha, 'the leftover bucket follows the registry groups')
  assert.ok(markup.includes('/Users/me/add_account'), 'the group shows the workspace path')
  // s1 and s3 are the running / old rows: one group plus one leftover bucket, four rows total.
  assert.equal((markup.match(/class="uw-item"/g) ?? []).length, 4)
  assert.equal((markup.match(/class="uw-group"/g) ?? []).length, 2)
  assert.match(markup, /运行中/)
  assert.match(markup, /5 分钟前/)
  assert.match(markup, /3 小时前/)
  assert.match(markup, /1 天前/)
})

test('the board excludes archived, subagent, and blank rows from its rows', () => {
  const markup = renderSection(mount({ threshold: 100 }), { list: snapshot(), archived: ['archived'], items: ITEMS })
  assert.doesNotMatch(markup, /已归档会话/)
  assert.doesNotMatch(markup, /子代理会话/)
  assert.doesNotMatch(markup, /新会话/)
})

test('the board renders its empty state when nothing is left to count', () => {
  const list = { ids: ['archived', 'blank'], byId: { archived: {}, blank: { blank: true } } }
  const markup = renderSection(mount(), { list, archived: ['archived'] })
  assert.match(markup, /没有未归档的普通会话。/)
  assert.equal((markup.match(/class="uw-item"/g) ?? []).length, 0)
})
