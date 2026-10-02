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
export const DEFAULT_THRESHOLD = 10;
/**
 * Select the ordinary unarchived Sessions, in list order.
 * @param list - the Session list snapshot, or anything shaped like it.
 * @param archivedIds - the registry-global archive set.
 * @returns the selected ids with their rows.
 */
function selectRows(list, archivedIds) {
    if (list === undefined || list === null || !Array.isArray(list.ids))
        return [];
    const archived = new Set();
    for (const id of archivedIds ?? [])
        archived.add(String(id));
    const byId = list.byId ?? {};
    const selected = [];
    for (const raw of list.ids) {
        const id = String(raw);
        const row = byId[id];
        if (row === undefined || row === null)
            continue;
        if (row.blank === true)
            continue;
        if (row.origin === 'subagent' || row.parentId !== undefined)
            continue;
        if (archived.has(id))
            continue;
        selected.push({ id, row });
    }
    return selected;
}
/** Best available human label for one row: projected title, then id. */
function titleOf(row, fallback) {
    for (const candidate of [row.displayTitle, row.title]) {
        if (typeof candidate === 'string' && candidate !== '')
            return candidate;
    }
    return fallback;
}
/**
 * Count the ordinary Sessions that are not in the archive set.
 * @param list - the Session list snapshot, or anything shaped like it.
 * @param archivedIds - the registry-global archive set.
 * @returns the number of unarchived ordinary Sessions.
 */
export function countUnarchived(list, archivedIds) {
    return selectRows(list, archivedIds).length;
}
/**
 * Reduce the ordinary unarchived Sessions to renderable rows.
 * @param list - the Session list snapshot.
 * @param archivedIds - the registry-global archive set.
 * @returns rows in host list order.
 */
export function collectUnarchived(list, archivedIds) {
    return selectRows(list, archivedIds).map(({ id, row }) => ({
        sessionId: id,
        title: titleOf(row, id),
        cwd: typeof row.cwd === 'string' && row.cwd !== '' ? row.cwd : undefined,
        updatedAt: typeof row.updatedAt === 'number' && Number.isFinite(row.updatedAt) ? row.updatedAt : 0,
        running: row.running === true,
    }));
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
export function groupUnarchived(rows, workspaces) {
    const groups = [];
    const claimed = new Set();
    for (const item of workspaces?.items ?? []) {
        if (item === undefined || item === null)
            continue;
        const members = new Set((item.sessionIds ?? []).map(String));
        const chosen = rows.filter((row) => members.has(row.sessionId) && !claimed.has(row.sessionId));
        if (chosen.length === 0)
            continue;
        for (const row of chosen)
            claimed.add(row.sessionId);
        groups.push({
            workspaceId: typeof item.workspaceId === 'string' ? item.workspaceId : undefined,
            key: String(item.workspaceId),
            label: typeof item.title === 'string' ? item.title : '',
            path: typeof item.path === 'string' ? item.path : undefined,
            rows: chosen,
        });
    }
    const leftovers = rows.filter((row) => !claimed.has(row.sessionId));
    if (leftovers.length > 0) {
        groups.push({ workspaceId: undefined, key: '', label: '', path: undefined, rows: leftovers });
    }
    return groups;
}
/**
 * Bucket a timestamp into minutes / hours / days for display.
 * @param updatedAt - epoch milliseconds of the Session's last activity.
 * @param now - epoch milliseconds to compare against.
 * @returns the largest whole unit that fits.
 */
export function describeAge(updatedAt, now) {
    const minutes = Math.max(0, Math.floor((now - updatedAt) / 60000));
    if (minutes < 60)
        return { unit: 'minute', value: minutes };
    const hours = Math.floor(minutes / 60);
    if (hours < 24)
        return { unit: 'hour', value: hours };
    return { unit: 'day', value: Math.floor(hours / 24) };
}
/**
 * Normalize a configured threshold to a positive integer.
 * @param value - raw config value or a number typed into the Settings row.
 * @returns the threshold, or {@link DEFAULT_THRESHOLD} when unusable.
 */
export function normalizeThreshold(value) {
    const parsed = typeof value === 'number' ? value : Number.parseInt(String(value ?? ''), 10);
    if (!Number.isFinite(parsed))
        return DEFAULT_THRESHOLD;
    const whole = Math.trunc(parsed);
    return whole >= 1 ? whole : DEFAULT_THRESHOLD;
}
/**
 * Whether the count is past the threshold. Strictly greater: "超过 10 个" means
 * the eleventh Session is the first warning.
 * @param count - unarchived ordinary Session count.
 * @param threshold - configured threshold.
 * @returns whether the warning icon belongs on screen.
 */
export function shouldWarn(count, threshold) {
    return count > normalizeThreshold(threshold);
}
//# sourceMappingURL=count.js.map