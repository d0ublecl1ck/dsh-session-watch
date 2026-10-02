// Unit tests for the shared counter. Imported from lib/ — the same artifact the
// browser bundle inlines — so these tests fail if the build is stale.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  DEFAULT_THRESHOLD,
  countUnarchived,
  normalizeThreshold,
  shouldWarn,
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

test('counts every ordinary Session when nothing is archived', () => {
  const sessions = list(['a', {}], ['b', { title: 'x' }])
  assert.equal(countUnarchived(sessions, []), 2)
})

test('excludes archived Sessions by id', () => {
  const sessions = list(['a', {}], ['b', {}], ['c', {}])
  assert.equal(countUnarchived(sessions, ['b']), 2)
})

test('excludes subagent child Sessions by parentId or origin', () => {
  const sessions = list(['main', {}], ['child', { parentId: 'main' }], ['origin', { origin: 'subagent' }])
  assert.equal(countUnarchived(sessions, []), 1)
})

test('excludes blank New Session seats', () => {
  const sessions = list(['real', {}], ['blank', { blank: true }])
  assert.equal(countUnarchived(sessions, []), 1)
})

test('still counts a Session whose row carries no flags at all', () => {
  // The archive filter is the only exclusion that depends on other state; a
  // row without parentId/origin/blank must not be dropped by accident.
  const sessions = list(['a', {}])
  assert.equal(countUnarchived(sessions, ['other-id']), 1)
})

test('a blank Session that is also archived is still excluded once', () => {
  const sessions = list(['blank', { blank: true }])
  assert.equal(countUnarchived(sessions, ['blank']), 0)
})

test('ids without a matching row are skipped instead of miscounted', () => {
  const sessions = { ids: ['known', 'ghost'], byId: { known: {} } }
  assert.equal(countUnarchived(sessions, []), 1)
})

test('non-string archive ids and list ids compare as strings', () => {
  const sessions = list(['42', {}], ['43', {}])
  assert.equal(countUnarchived(sessions, [42]), 1)
})

test('missing or malformed snapshots count as zero rather than throwing', () => {
  assert.equal(countUnarchived(undefined, []), 0)
  assert.equal(countUnarchived(null, null), 0)
  assert.equal(countUnarchived({ ids: undefined, byId: {} }, []), 0)
})

test('normalizeThreshold keeps positive integers and rejects the rest', () => {
  assert.equal(normalizeThreshold(7), 7)
  assert.equal(normalizeThreshold('12'), 12)
  assert.equal(normalizeThreshold(3.9), 3)
  assert.equal(normalizeThreshold(0), DEFAULT_THRESHOLD)
  assert.equal(normalizeThreshold(-4), DEFAULT_THRESHOLD)
  assert.equal(normalizeThreshold('abc'), DEFAULT_THRESHOLD)
  assert.equal(normalizeThreshold(undefined), DEFAULT_THRESHOLD)
  assert.equal(normalizeThreshold(Number.NaN), DEFAULT_THRESHOLD)
})

test('the warning starts strictly above the threshold', () => {
  assert.equal(shouldWarn(10, 10), false)
  assert.equal(shouldWarn(11, 10), true)
  assert.equal(shouldWarn(0, 10), false)
  // "超过 10 个" with no usable config falls back to the shipped default.
  assert.equal(shouldWarn(11, 0), true)
  assert.equal(shouldWarn(10, 0), false)
})

test('the shipped default threshold is 10', () => {
  assert.equal(DEFAULT_THRESHOLD, 10)
})
