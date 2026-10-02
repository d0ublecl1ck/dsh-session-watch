#!/usr/bin/env node
/**
 * Replay a DSH instance's own facts through this plugin's counting code.
 *
 * Offline and read-only: it takes two files that already exist on any machine
 * running DSH — the `session/list` result and `<DSH home>/storages/workspace.json`
 * — and prints exactly what the sidebar badge and the Settings board would show.
 * That is how the numbers in README.md were produced, and how anyone can
 * reproduce them against their own instance.
 *
 * Usage:
 *   node scripts/replay-count.mjs --sessions <file> --workspace <workspace.json> [--threshold <n>]
 *
 * @module dsh-unarchived-watch/scripts/replay-count
 */
import { existsSync, readFileSync } from 'node:fs'

const HERE = new URL('../lib/count.js', import.meta.url)

/** Read one `--flag value` pair. */
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

const { collectUnarchived, countUnarchived, groupUnarchived, normalizeThreshold, shouldWarn } = await import(HERE.href)

const listed = JSON.parse(readFileSync(sessionsPath, 'utf8'))
const items = Array.isArray(listed) ? listed : (listed.items ?? [])
const registry = JSON.parse(readFileSync(workspacePath, 'utf8'))
const global = registry.global ?? {}
const table = registry.tables?.workspaces ?? {}
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
    displayTitle: item.projections?.values?.title ?? item.title,
    cwd: item.cwd,
    updatedAt: item.updatedAt,
    running: item.running,
  }
}

const state = { ids, byId }
const rows = collectUnarchived(state, archived)
const count = countUnarchived(state, archived)
const workspaces = {
  items: (global.workspaceIds ?? []).map((workspaceId) => ({
    workspaceId,
    title: table[workspaceId]?.title,
    path: table[workspaceId]?.path,
    sessionIds: table[workspaceId]?.sessionIds ?? [],
  })),
}
const groups = groupUnarchived(rows, workspaces)
const threshold = normalizeThreshold(thresholdArg)

process.stdout.write('sessions rows        ' + ids.length + '\n')
process.stdout.write('archived ids         ' + archived.length + '\n')
process.stdout.write('unarchived ordinary  ' + count + '\n')
process.stdout.write('threshold            ' + threshold + '\n')
process.stdout.write('sidebar light        ' + (shouldWarn(count, threshold) ? 'on' : 'off') + '\n')
process.stdout.write('groups               ' + groups.length + '\n')
for (const group of groups) {
  process.stdout.write('  ' + String(group.rows.length).padStart(3) + '  ' + (group.label === '' ? '(no workspace)' : group.label) + '\n')
}
if (rows.length !== count) {
  process.stderr.write('INCONSISTENT: the board has ' + rows.length + ' rows but the badge counts ' + count + '\n')
  process.exit(1)
}
