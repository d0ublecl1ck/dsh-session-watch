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
/** Stable cordis plugin name (the bundle row's name resolves to this package). */
export declare const name = "session-watch";
/** The plugin's preference surface: what to show, and when unarchived is too many. */
export interface Config {
    /** Warn once the unarchived Session count exceeds this value. */
    threshold: number;
    /** Layout family used by the sidebar readout. */
    variant: string;
    /** Whether the running metric appears in the readout. */
    showRunning: boolean;
    /** Whether the unread metric appears in the readout. */
    showUnread: boolean;
    /** Whether the pending metric appears in the readout. */
    showPending: boolean;
    /** Whether the idle metric appears in the readout. */
    showIdle: boolean;
    /** Whether the unarchived metric appears in the readout. */
    showUnarchived: boolean;
    /** Whether the archived metric appears in the readout. */
    showArchived: boolean;
}
/**
 * Row config. volatile is what makes a field live-editable from the Settings
 * page: dsh-settings only projects volatile fields into a namespace.
 */
export declare const Config: z<Schemastery.ObjectS<NoInfer<{
    threshold: z<number, number, "volatile-defined">;
    variant: z<string, string, "volatile-defined">;
    showRunning: z<boolean, boolean, "volatile-defined">;
    showUnread: z<boolean, boolean, "volatile-defined">;
    showPending: z<boolean, boolean, "volatile-defined">;
    showIdle: z<boolean, boolean, "volatile-defined">;
    showUnarchived: z<boolean, boolean, "volatile-defined">;
    showArchived: z<boolean, boolean, "volatile-defined">;
}>>, Schemastery.ObjectT<NoInfer<{
    threshold: z<number, number, "volatile-defined">;
    variant: z<string, string, "volatile-defined">;
    showRunning: z<boolean, boolean, "volatile-defined">;
    showUnread: z<boolean, boolean, "volatile-defined">;
    showPending: z<boolean, boolean, "volatile-defined">;
    showIdle: z<boolean, boolean, "volatile-defined">;
    showUnarchived: z<boolean, boolean, "volatile-defined">;
    showArchived: z<boolean, boolean, "volatile-defined">;
}>>, "plain">;
/** No host-side behavior: the browser half does the counting and the drawing. */
export declare function apply(): void;
