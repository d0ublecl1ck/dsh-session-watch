/**
 * dsh-unarchived-watch — host entry.
 *
 * The host half carries no counting: the number of unarchived Sessions is
 * derived in the browser from the Session list and the Workspace archive set
 * the shell already publishes. What the host half owns is the plugin's
 * preference — the warning threshold — as a volatile Config field. dsh-settings
 * projects exactly those fields into the Settings namespace named by this
 * row's id, which is what the client half reads and writes.
 *
 * @module dsh-unarchived-watch
 */
import z from '@deepseek-ai/schemastery';
/** Stable cordis plugin name (the bundle row's `name` resolves to this package). */
export declare const name = "unarchived-watch";
/** The plugin's preference surface: the one number this plugin adds. */
export interface Config {
    /** Warn once the unarchived Session count exceeds this value. */
    threshold: number;
}
/**
 * Row config. `volatile` is what makes the field live-editable from the
 * Settings page: dsh-settings only projects volatile fields into a namespace.
 */
export declare const Config: z<Schemastery.ObjectS<NoInfer<{
    threshold: z<number, number, "volatile-defined">;
}>>, Schemastery.ObjectT<NoInfer<{
    threshold: z<number, number, "volatile-defined">;
}>>, "plain">;
/** No host-side behavior: the browser half does the counting and the drawing. */
export declare function apply(): void;
