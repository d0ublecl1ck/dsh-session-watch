/**
 * Ambient declarations for the Web shell's platform module table.
 *
 * The browser half resolves these specifiers from the shell at run time, and
 * this repository deliberately does not depend on the official packages for
 * types. This file must stay a global script (no top-level imports/exports):
 * inside a module, `declare module` would be read as an augmentation of an
 * unresolvable module and fail to compile.
 */

declare module '@deepseek-ai/dsh-client-ui-primitives' {
  /** One tooltip bubble attached to a single anchor element. */
  export function Tooltip(props: {
    readonly label: string | (() => string)
    readonly side?: 'right' | 'bottom' | 'top'
    readonly align?: 'center' | 'end'
    readonly delayMs?: number
    readonly disabled?: boolean
    readonly portal?: boolean
    readonly maxWidth?: number
    readonly children: import('react').ReactElement
  }): import('react').ReactElement
}
