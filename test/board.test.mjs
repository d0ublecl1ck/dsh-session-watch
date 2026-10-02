// Unit tests for the board's pure half: row collection, Workspace grouping,
// and age buckets. Imported from lib/ — the same artifact the browser bundle
// inlines — so these tests fail if the build is stale.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  collectUnarchived,
  countUnarchived,
  describeAge,
  groupUnarchived,
} from '../lib/count.js'

/** Build a Session list snapshot from [id, row] pairs. */
function list(...rows) {
  const ids = []
  const byId = {}
  for (const [id, row] of rows) {
    ids.push(id)
    byId[id] = row
  }
  return { ids, byId }
}

test('collectUnarchived keeps host list order and prefers displayTitle', () => {
  const rows = collectUnarchived(
    list(
      ['a', { title: 'raw a', displayTitle: 'shown a', updatedAt: 5, cwd: '/w/a', running: true }],
      ['b', { title: 'shown b', updatedAt: 7 }],
      ['c', { updatedAt: 9 }],
    ),
    [],
  )
  assert.deepEqual(rows.map((row) => row.sessionId), ['a', 'b', 'c'])
  assert.equal(rows[0].title, 'shown a')
  assert.equal(rows[1].title, 'shown b')
  assert.equal(rows[2].title, 'c', 'a row without any title falls back to its id')
  assert.equal(rows[0].cwd, '/w/a')
  assert.equal(rows[0].running, true)
  assert.equal(rows[1].cwd, undefined)
  assert.equal(rows[1].running, false)
  assert.equal(rows[0].updatedAt, 5)
})

test('collectUnarchived applies the same exclusions as the counter', () => {
  const rows = collectUnarchived(
    list(
      ['keep', {}],
      ['archived', {}],
      ['child', { parentId: 'keep' }],
      ['subagent', { origin: 'subagent' }],
      ['blank', { blank: true }],
    ),
    ['archived'],
  )
  assert.deepEqual(rows.map((row) => row.sessionId), ['keep'])
  assert.equal(rows.length, countUnarchived(
    list(
      ['keep', {}],
      ['archived', {}],
      ['child', { parentId: 'keep' }],
      ['subagent', { origin: 'subagent' }],
      ['blank', { blank: true }],
    ),
    ['archived'],
  ), 'the board and the badge must agree on the total')
})

test('collectUnarchived tolerates malformed rows and snapshots', () => {
  assert.deepEqual(collectUnarchived(undefined, []), [])
  const rows = collectUnarchived(
    {
      ids: ['ok', 'missing', 'badtime'],
      byId: { ok: {}, missing: undefined, badtime: { updatedAt: 'nope' } },
    },
    [],
  )
  assert.deepEqual(rows.map((row) => row.sessionId), ['ok', 'badtime'])
  assert.equal(rows[1].updatedAt, 0, 'an unusable timestamp degrades to 0, not NaN')
})

test('groupUnarchived follows registry order and parks leftovers last', () => {
  const rows = collectUnarchived(
    list(['s1', {}], ['s2', {}], ['s3', {}], ['s4', {}]),
    [],
  )
  const groups = groupUnarchived(rows, {
    items: [
      { workspaceId: 'w1', title: 'alpha', path: '/w/alpha', sessionIds: ['s2', 's1'] },
      { workspaceId: 'w2', title: 'empty', path: '/w/empty', sessionIds: [] },
      { workspaceId: 'w3', title: 'beta', path: '/w/beta', sessionIds: ['s3'] },
    ],
  })
  assert.deepEqual(groups.map((group) => group.label), ['alpha', 'beta', ''])
  assert.deepEqual(groups[0].rows.map((row) => row.sessionId), ['s1', 's2'], 'rows keep host order inside a group')
  assert.equal(groups[0].path, '/w/alpha')
  assert.deepEqual(groups[1].rows.map((row) => row.sessionId), ['s3'])
  assert.deepEqual(groups[2].rows.map((row) => row.sessionId), ['s4'])
  assert.equal(groups[2].workspaceId, undefined)
  assert.equal(groups[2].key, '')
})

test('groupUnarchived never drops a row, with or without a registry', () => {
  const rows = collectUnarchived(list(['s1', {}], ['s2', {}]), [])
  for (const workspaces of [undefined, null, {}, { items: [] }]) {
    const groups = groupUnarchived(rows, workspaces)
    assert.equal(groups.length, 1)
    assert.equal(groups[0].rows.length, 2)
  }
  const overlapping = groupUnarchived(rows, {
    items: [
      { workspaceId: 'w1', title: 'one', sessionIds: ['s1'] },
      { workspaceId: 'w2', title: 'two', sessionIds: ['s1', 's2'] },
    ],
  })
  assert.deepEqual(overlapping.map((group) => group.rows.length), [1, 1], 'a row belongs to the first claiming workspace only')
})

test('describeAge buckets minutes, hours, and days', () => {
  const now = 1_000_000_000
  assert.deepEqual(describeAge(now - 30_000, now), { unit: 'minute', value: 0 })
  assert.deepEqual(describeAge(now - 5 * 60_000, now), { unit: 'minute', value: 5 })
  assert.deepEqual(describeAge(now - 90 * 60_000, now), { unit: 'hour', value: 1 })
  assert.deepEqual(describeAge(now - 25 * 3_600_000, now), { unit: 'day', value: 1 })
  assert.deepEqual(describeAge(now + 60_000, now), { unit: 'minute', value: 0 }, 'a future timestamp never goes negative')
})
