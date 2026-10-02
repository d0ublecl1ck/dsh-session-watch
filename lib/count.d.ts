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
export declare const DEFAULT_THRESHOLD = 10;
/** The row fields this module reads (a structural subset of SessionSummary). */
export interface SessionRowLike {
    readonly parentId?: unknown;
    readonly origin?: unknown;
    readonly blank?: unknown;
    readonly title?: unknown;
    readonly displayTitle?: unknown;
    readonly cwd?: unknown;
    readonly updatedAt?: unknown;
    readonly running?: unknown;
}
/** The list fields this module reads (a structural subset of SessionListState). */
export interface SessionListLike {
    readonly ids: readonly unknown[];
    readonly byId: Readonly<Record<string, SessionRowLike | undefined>>;
}
/** One Workspace registry row, as far as grouping needs it. */
export interface WorkspaceItemLike {
    readonly workspaceId: string;
    readonly title?: unknown;
    readonly path?: unknown;
    readonly sessionIds?: readonly unknown[];
}
/** The Workspace registry slice this module reads. */
export interface WorkspaceListLike {
    readonly items?: readonly WorkspaceItemLike[];
}
/** One ordinary unarchived Session, reduced to what the board renders. */
export interface UnarchivedRow {
    readonly sessionId: string;
    readonly title: string;
    readonly cwd: string | undefined;
    readonly updatedAt: number;
    readonly running: boolean;
}
/**
 * One group on the board. `workspaceId` is undefined for the leftover bucket —
 * unarchived Sessions the registry does not account to any Workspace.
 */
export interface UnarchivedGroup {
    readonly workspaceId: string | undefined;
    readonly key: string;
    readonly label: string;
    readonly path: string | undefined;
    readonly rows: readonly UnarchivedRow[];
}
/**
 * Count the ordinary Sessions that are not in the archive set.
 * @param list - the Session list snapshot, or anything shaped like it.
 * @param archivedIds - the registry-global archive set.
 * @returns the number of unarchived ordinary Sessions.
 */
export declare function countUnarchived(list: SessionListLike | undefined | null, archivedIds: readonly unknown[] | undefined | null): number;
/**
 * Reduce the ordinary unarchived Sessions to renderable rows.
 * @param list - the Session list snapshot.
 * @param archivedIds - the registry-global archive set.
 * @returns rows in host list order.
 */
export declare function collectUnarchived(list: SessionListLike | undefined | null, archivedIds: readonly unknown[] | undefined | null): UnarchivedRow[];
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
export declare function groupUnarchived(rows: readonly UnarchivedRow[], workspaces: WorkspaceListLike | undefined | null): UnarchivedGroup[];
/** Coarse age bucket for one board row; the component owns the wording. */
export interface RowAge {
    readonly unit: 'minute' | 'hour' | 'day';
    readonly value: number;
}
/**
 * Bucket a timestamp into minutes / hours / days for display.
 * @param updatedAt - epoch milliseconds of the Session's last activity.
 * @param now - epoch milliseconds to compare against.
 * @returns the largest whole unit that fits.
 */
export declare function describeAge(updatedAt: number, now: number): RowAge;
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
