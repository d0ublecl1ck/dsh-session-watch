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
export declare const DEFAULT_THRESHOLD = 10;
/** The row fields this module reads (a structural subset of SessionSummary). */
export interface SessionRowLike {
    readonly parentId?: unknown;
    readonly origin?: unknown;
    readonly blank?: unknown;
}
/** The list fields this module reads (a structural subset of SessionListState). */
export interface SessionListLike {
    readonly ids: readonly unknown[];
    readonly byId: Readonly<Record<string, SessionRowLike | undefined>>;
}
/**
 * Count the ordinary Sessions that are not in the archive set.
 * @param list - the Session list snapshot, or anything shaped like it.
 * @param archivedIds - the registry-global archive set.
 * @returns the number of unarchived ordinary Sessions.
 */
export declare function countUnarchived(list: SessionListLike | undefined | null, archivedIds: readonly unknown[] | undefined | null): number;
/**
 * Normalize a configured threshold to a positive integer.
 * @param value - raw config value or a number typed into the Settings row.
 * @returns the threshold, or {@link DEFAULT_THRESHOLD} when unusable.
 */
export declare function normalizeThreshold(value: unknown): number;
/**
 * Whether the count is past the threshold. Strictly greater: "超过 10 个" means
 * the eleventh Session is the first warning.
 * @param count - unarchived ordinary Session count.
 * @param threshold - configured threshold.
 * @returns whether the warning icon belongs on screen.
 */
export declare function shouldWarn(count: number, threshold: number): boolean;
