/**
 * Pure counting rules for the unarchived-session warning.
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