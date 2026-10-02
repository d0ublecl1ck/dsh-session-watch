/**
 * Pure counting, grouping, and age rules for the unarchived-session board.
 *
 * No framework, no DOM: the browser half (through the client bundle) and the
 * Node tests both import this module, so the definition of "unarchived
 * Session" lives in exactly one place.
 *
 * Counting rules (the ordinary-session scope):
 * - archived Sessions are excluded — that is the whole point of the warning;
 * - subagent child Sessions are excluded, they are part of a parent's work;
 * - blank Sessions are excluded, they are the reusable "New Session" seat
 *   rather than a conversation.
 *
 * @module dsh-unarchived-watch/count
 */

/** Threshold used when configuration is absent or malformed. */
export const DEFAULT_THRESHOLD = 10

/** The row fields this module reads (a structural subset of SessionSummary). */
export interface SessionRowLike {
  readonly parentId?: unknown
  readonly origin?: unknown
  readonly blank?: unknown
  readonly title?: unknown
  readonly displayTitle?: unknown
  readonly cwd?: unknown
  readonly updatedAt?: unknown
  readonly running?: unknown
}

/** The list fields this module reads (a structural subset of SessionListState). */
export interface SessionListLike {
  readonly ids: readonly unknown[]
  readonly byId: Readonly<Record<string, SessionRowLike | undefined>>
}

/** One Workspace registry row, as far as grouping needs it. */
export interface WorkspaceItemLike {
  readonly workspaceId: string
  readonly title?: unknown
  readonly path?: unknown
  readonly sessionIds?: readonly unknown[]
}

/** The Workspace registry slice this module reads. */
export interface WorkspaceListLike {
  readonly items?: readonly WorkspaceItemLike[]
}

/** One ordinary unarchived Session, reduced to what the board renders. */
export interface UnarchivedRow {
  readonly sessionId: string
  readonly title: string
  readonly cwd: string | undefined
  readonly updatedAt: number
  readonly running: boolean
}

/**
 * One group on the board. `workspaceId` is undefined for the leftover bucket —
 * unarchived Sessions the registry does not account to any Workspace.
 */
export interface UnarchivedGroup {
  readonly workspaceId: string | undefined
  readonly key: string
  readonly label: string
  readonly path: string | undefined
  readonly rows: readonly UnarchivedRow[]
}

/**
 * Select the ordinary unarchived Sessions, in list order.
 * @param list - the Session list snapshot, or anything shaped like it.
 * @param archivedIds - the registry-global archive set.
 * @returns the selected ids with their rows.
 */
function selectRows(
  list: SessionListLike | undefined | null,
  archivedIds: readonly unknown[] | undefined | null,
): { id: string; row: SessionRowLike }[] {
  if (list === undefined || list === null || !Array.isArray(list.ids)) return []
  const archived = new Set<string>()
  for (const id of archivedIds ?? []) archived.add(String(id))
  const byId = list.byId ?? {}
  const selected: { id: string; row: SessionRowLike }[] = []
  for (const raw of list.ids) {
    const id = String(raw)
    const row = byId[id]
    if (row === undefined || row === null) continue
    if (row.blank === true) continue
    if (row.origin === 'subagent' || row.parentId !== undefined) continue
    if (archived.has(id)) continue
    selected.push({ id, row })
  }
  return selected
}

/** Best available human label for one row: projected title, then id. */
function titleOf(row: SessionRowLike, fallback: string): string {
  for (const candidate of [row.displayTitle, row.title]) {
    if (typeof candidate === 'string' && candidate !== '') return candidate
  }
  return fallback
}

/**
 * Count the ordinary Sessions that are not in the archive set.
 * @param list - the Session list snapshot, or anything shaped like it.
 * @param archivedIds - the registry-global archive set.
 * @returns the number of unarchived ordinary Sessions.
 */
export function countUnarchived(
  list: SessionListLike | undefined | null,
  archivedIds: readonly unknown[] | undefined | null,
): number {
  return selectRows(list, archivedIds).length
}

/**
 * Reduce the ordinary unarchived Sessions to renderable rows.
 * @param list - the Session list snapshot.
 * @param archivedIds - the registry-global archive set.
 * @returns rows in host list order.
 */
export function collectUnarchived(
  list: SessionListLike | undefined | null,
  archivedIds: readonly unknown[] | undefined | null,
): UnarchivedRow[] {
  return selectRows(list, archivedIds).map(({ id, row }) => ({
    sessionId: id,
    title: titleOf(row, id),
    cwd: typeof row.cwd === 'string' && row.cwd !== '' ? row.cwd : undefined,
    updatedAt: typeof row.updatedAt === 'number' && Number.isFinite(row.updatedAt) ? row.updatedAt : 0,
    running: row.running === true,
  }))
}

/**
 * Group rows by Workspace in registry order, with the leftovers last.
 *
 * A Session the registry does not account to any Workspace (or accounts to a
 * Workspace that no longer exists) still has to be visible: dropping it would
 * make the board disagree with the badge's own total.
 *
 * @param rows - rows from {@link collectUnarchived}.
 * @param workspaces - the Workspace registry snapshot.
 * @returns groups in registry order plus at most one leftover group.
 */
export function groupUnarchived(
  rows: readonly UnarchivedRow[],
  workspaces: WorkspaceListLike | undefined | null,
): UnarchivedGroup[] {
  const groups: UnarchivedGroup[] = []
  const claimed = new Set<string>()
  for (const item of workspaces?.items ?? []) {
    if (item === undefined || item === null) continue
    const members = new Set((item.sessionIds ?? []).map(String))
    const chosen = rows.filter((row) => members.has(row.sessionId) && !claimed.has(row.sessionId))
    if (chosen.length === 0) continue
    for (const row of chosen) claimed.add(row.sessionId)
    groups.push({
      workspaceId: typeof item.workspaceId === 'string' ? item.workspaceId : undefined,
      key: String(item.workspaceId),
      label: typeof item.title === 'string' ? item.title : '',
      path: typeof item.path === 'string' ? item.path : undefined,
      rows: chosen,
    })
  }
  const leftovers = rows.filter((row) => !claimed.has(row.sessionId))
  if (leftovers.length > 0) {
    groups.push({ workspaceId: undefined, key: '', label: '', path: undefined, rows: leftovers })
  }
  return groups
}

/** Coarse age bucket for one board row; the component owns the wording. */
export interface RowAge {
  readonly unit: 'minute' | 'hour' | 'day'
  readonly value: number
}

/**
 * Bucket a timestamp into minutes / hours / days for display.
 * @param updatedAt - epoch milliseconds of the Session's last activity.
 * @param now - epoch milliseconds to compare against.
 * @returns the largest whole unit that fits.
 */
export function describeAge(updatedAt: number, now: number): RowAge {
  const minutes = Math.max(0, Math.floor((now - updatedAt) / 60000))
  if (minutes < 60) return { unit: 'minute', value: minutes }
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return { unit: 'hour', value: hours }
  return { unit: 'day', value: Math.floor(hours / 24) }
}

/**
 * Normalize a configured threshold to a positive integer.
 * @param value - raw config value or a number typed into the Settings row.
 * @returns the threshold, or {@link DEFAULT_THRESHOLD} when unusable.
 */
export function normalizeThreshold(value: unknown): number {
  const parsed = typeof value === 'number' ? value : Number.parseInt(String(value ?? ''), 10)
  if (!Number.isFinite(parsed)) return DEFAULT_THRESHOLD
  const whole = Math.trunc(parsed)
  return whole >= 1 ? whole : DEFAULT_THRESHOLD
}

/**
 * Whether the count is past the threshold. Strictly greater: "超过 10 个" means
 * the eleventh Session is the first warning.
 * @param count - unarchived ordinary Session count.
 * @param threshold - configured threshold.
 * @returns whether the warning icon belongs on screen.
 */
export function shouldWarn(count: number, threshold: number): boolean {
  return count > normalizeThreshold(threshold)
}
