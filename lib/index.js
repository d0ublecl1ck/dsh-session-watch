/**
 * dsh-session-watch — host entry.
 *
 * The host half carries no counting: every number is derived in the browser
 * from the snapshots the shell already publishes (the Session list, the Session
 * UI status stream, and the Workspace archive set). What the host half owns is
 * the plugin's preference surface — the unarchived warning threshold and one
 * visibility switch per metric — as volatile Config fields. dsh-settings
 * projects exactly those fields into the Settings namespace named by this row's
 * id, which is what the client half reads and writes.
 *
 * @module dsh-session-watch
 */
import z from '@deepseek-ai/schemastery';
import { DEFAULT_VARIANT, DEFAULT_VISIBILITY } from './config.js';
import { DEFAULT_THRESHOLD } from './count.js';
/** Stable cordis plugin name (the bundle row's name resolves to this package). */
export const name = 'session-watch';
/**
 * Row config. volatile is what makes a field live-editable from the Settings
 * page: dsh-settings only projects volatile fields into a namespace.
 */
export const Config = z.object({
    threshold: z.number().step(1).min(1).default(DEFAULT_THRESHOLD).volatile(),
    variant: z.string().default(DEFAULT_VARIANT).volatile(),
    showRunning: z.boolean().default(DEFAULT_VISIBILITY.running).volatile(),
    showUnread: z.boolean().default(DEFAULT_VISIBILITY.unread).volatile(),
    showPending: z.boolean().default(DEFAULT_VISIBILITY.pending).volatile(),
    showIdle: z.boolean().default(DEFAULT_VISIBILITY.idle).volatile(),
    showUnarchived: z.boolean().default(DEFAULT_VISIBILITY.unarchived).volatile(),
    showArchived: z.boolean().default(DEFAULT_VISIBILITY.archived).volatile(),
});
/** No host-side behavior: the browser half does the counting and the drawing. */
export function apply() { }
//# sourceMappingURL=index.js.map