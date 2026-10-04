#!/usr/bin/env node
/**
 * Replay a DSH instance's own facts through this plugin's counting code.
 *
 * Offline and read-only: it takes two files that already exist on any machine
 * running DSH — the session/list result and <DSH home>/storages/workspace.json
 * — and prints the archive split and the activity split the sidebar readout
 * would show. That is how the numbers in README.md were produced, and how
 * anyone can reproduce them against their own instance.
 *
 * The running metric falls back to each list row's own running flag. The unread
 * and pending metrics are live client-side UI status, which no persisted file
 * carries, so this replay always reports them as zero — read them from the
 * sidebar itself.
 *
 * Usage:
 *   node scripts/replay-count.mjs --sessions <file> --workspace <workspace.json> [--threshold <n>]
 *
 * @module dsh-session-watch/scripts/replay-count
 */
import { existsSync, readFileSync } from 'node:fs'

const HERE = new URL('../lib/count.js', import.meta.url)

/** Read one --flag value pair. */
function arg(name) {
  const index = process.argv.indexOf('--' + name)
  return index === -1 ? undefined : process.argv[index + 1]
}

const sessionsPath = arg('sessions')
const workspacePath = arg('workspace')
const thresholdArg = arg('threshold')
if (sessionsPath === undefined || workspacePath === undefined) {
  process.stderr.write('usage: node scripts/replay-count.mjs --sessions <file> --workspace <workspace.json> [--threshold <n>]\n')
  process.exit(2)
}
for (const path of [sessionsPath, workspacePath]) {
  if (!existsSync(path)) {
    process.stderr.write('no such file: ' + path + '\n')
    process.exit(2)
  }
}

const { countSessions, normalizeThreshold, shouldWarn } = await import(HERE.href)

const listed = JSON.parse(readFileSync(sessionsPath, 'utf8'))
const items = Array.isArray(listed) ? listed : (listed.items ?? [])
const registry = JSON.parse(readFileSync(workspacePath, 'utf8'))
const global = registry.global ?? {}
const archived = global.archivedSessionIds ?? []

const ids = []
const byId = {}
for (const item of items) {
  const id = String(item.sessionId ?? item.id)
  ids.push(id)
  byId[id] = {
    blank: item.blank,
    parentId: item.parentSessionId ?? item.parentId,
    origin: item.origin,
    running: item.running,
  }
}

const counts = countSessions({ ids, byId }, archived)
const threshold = normalizeThreshold(thresholdArg)

process.stdout.write('sessions rows        ' + ids.length + '\n')
process.stdout.write('archived ids         ' + archived.length + '\n')
for (const metric of ['running', 'unread', 'pending', 'idle', 'unarchived', 'archived']) {
  process.stdout.write((metric + '            ').slice(0, 21) + counts[metric] + '\n')
}
process.stdout.write('threshold            ' + threshold + '\n')
process.stdout.write('unarchived warn      ' + (shouldWarn(counts.unarchived, threshold) ? 'on' : 'off') + '\n')
