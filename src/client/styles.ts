/**
 * Injected page styles for the readout and the Settings row. One
 * <style data-plugin> element owns every sw- class and the client fiber
 * removes it on dispose; colors come from the shell's own tokens so both
 * surfaces follow the active theme.
 *
 * @module dsh-session-watch/client/styles
 */

const CSS = `
/* Metric colors: one family per state, taken from the shell's semantic
   tokens where the shell has one, and reusing the sidebar's own label ramp
   for the archive metrics so they stay quiet. */
.sw-chip[data-metric="running"], .sw-legend[data-metric="running"], .sw-toggle[data-metric="running"] { --sw-ink: var(--dsw-alias-state-business-primary, #4d6bfe); }
.sw-chip[data-metric="unread"], .sw-legend[data-metric="unread"], .sw-toggle[data-metric="unread"] { --sw-ink: var(--dsw-alias-state-error-primary, #e5484d); }
.sw-chip[data-metric="pending"], .sw-legend[data-metric="pending"], .sw-toggle[data-metric="pending"] { --sw-ink: var(--dsw-alias-state-warn-primary, #f5a623); }
.sw-chip[data-metric="idle"], .sw-legend[data-metric="idle"], .sw-toggle[data-metric="idle"] { --sw-ink: var(--dsw-alias-label-tertiary, #98a2b3); }
.sw-chip[data-metric="unarchived"], .sw-legend[data-metric="unarchived"], .sw-toggle[data-metric="unarchived"] { --sw-ink: var(--dsw-alias-label-secondary, #667085); }
.sw-chip[data-metric="archived"], .sw-legend[data-metric="archived"], .sw-toggle[data-metric="archived"] { --sw-ink: var(--dsw-alias-label-tertiary, #98a2b3); }

/* The warning state is the one accent the unarchived metric can borrow. */
.sw-chip[data-warn="true"], .sw-legend[data-warn="true"] { --sw-ink: var(--dsw-alias-state-warn-primary, #f5a623); }

.sw-watch, .sw-meter, .sw-rail {
  display: inline-flex;
  align-items: center;
  flex: none;
  color: var(--dsw-alias-label-secondary, #667085);
  font-variant-numeric: tabular-nums;
}

/* Layout A: colored icon + number pills. */
.sw-watch { gap: 3px; }

.sw-chip {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  height: 22px;
  padding: 0 6px;
  border-radius: 11px;
  background: var(--dsw-alias-bg-layer-2, rgba(127, 127, 127, 0.12));
  color: var(--sw-ink, var(--dsw-alias-label-secondary, #667085));
}

.sw-chip svg, .sw-legend svg, .sw-toggle-swatch svg { display: block; }

.sw-chip-count {
  font-size: 11px;
  font-weight: 620;
  line-height: 1;
  color: var(--sw-ink, inherit);
}

.sw-chip[data-warn="true"] { background: var(--dsw-alias-state-warn-tertiary, rgba(245, 166, 35, 0.16)); }

/* Layout B: a thick stacked meter with a compact legend. */
.sw-meter { flex-direction: column; align-items: stretch; gap: 4px; min-width: 148px; }

.sw-meter-bar {
  display: flex;
  width: 100%;
  height: 6px;
  overflow: hidden;
  border-radius: 3px;
  background: var(--dsw-alias-bg-layer-2, rgba(127, 127, 127, 0.12));
}

.sw-meter-seg { min-width: 0; transition: flex-grow 160ms var(--ds-ease-in-out, ease-out); }
.sw-meter-seg[data-metric="running"] { background: var(--dsw-alias-state-business-primary, #4d6bfe); }
.sw-meter-seg[data-metric="unread"] { background: var(--dsw-alias-state-error-primary, #e5484d); }
.sw-meter-seg[data-metric="pending"] { background: var(--dsw-alias-state-warn-primary, #f5a623); }
.sw-meter-seg[data-metric="idle"] { background: var(--dsw-alias-state-idle-primary, #d0d5dd); }
.sw-meter-seg[data-empty="true"] { flex: 1 1 auto; }

.sw-meter-legend { display: flex; align-items: center; gap: 8px; }
.sw-legend { display: inline-flex; align-items: center; gap: 3px; color: var(--sw-ink); }

/* The collapsed rail: one mark plus the unarchived count. */
.sw-rail {
  position: relative;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: var(--dsw-alias-label-secondary, #667085);
}

.sw-rail-count {
  position: absolute;
  top: -2px;
  inset-inline-end: -4px;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 8px;
  border: 2px solid var(--dsw-specific-sidebar-fill, transparent);
  background: var(--dsw-alias-label-secondary, #667085);
  color: var(--dsw-alias-label-primary-inverted, #fff);
  font-size: 10px;
  font-weight: 620;
  line-height: 1;
}

.sw-rail[data-warn="true"] { color: var(--dsw-alias-state-warn-primary, #f5a623); }
.sw-rail[data-warn="true"] .sw-rail-count { background: var(--dsw-alias-state-warn-primary, #f5a623); }

/* The Settings row. */
.sw-row {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 0;
}

.sw-row-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.sw-row-title { font-size: 13px; line-height: 18px; color: var(--dsw-alias-label-primary, inherit); }
.sw-row-desc { font-size: 12px; line-height: 16px; color: var(--dsw-alias-label-tertiary, GrayText); }
.sw-row-error { font-size: 12px; line-height: 16px; color: var(--dsw-alias-state-error-primary, #e5484d); }

.sw-row-controls { display: flex; flex-direction: column; gap: 12px; }

.sw-variants { display: inline-flex; gap: 4px; }
.sw-variant {
  padding: 3px 10px;
  border: 1px solid var(--dsw-alias-border-l2, currentColor);
  border-radius: 999px;
  background: transparent;
  color: var(--dsw-alias-label-secondary, inherit);
  font: inherit;
  font-size: 12px;
  line-height: 16px;
  cursor: pointer;
}
.sw-variant:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(127, 127, 127, 0.1)); }
.sw-variant-on {
  border-color: transparent;
  background: var(--dsw-alias-state-business-primary, #4d6bfe);
  color: var(--dsw-alias-label-primary-inverted, #fff);
}
.sw-variant:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary, currentColor); outline-offset: 1px; }

.sw-toggles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 4px 12px;
  margin: 0;
  padding: 0;
  border: 0;
}

.sw-field-label { font-size: 12px; line-height: 16px; color: var(--dsw-alias-label-tertiary, GrayText); padding: 0; }
.sw-field-hint { font-size: 11px; line-height: 14px; color: var(--dsw-alias-label-tertiary, GrayText); }
.sw-field { display: flex; flex-direction: column; gap: 2px; }

.sw-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  font-size: 12.5px;
  line-height: 18px;
  color: var(--dsw-alias-label-primary, inherit);
  cursor: pointer;
}
.sw-toggle input { accent-color: var(--dsw-alias-state-business-primary, #4d6bfe); margin: 0; }
.sw-toggle-swatch { display: inline-flex; color: var(--sw-ink, inherit); }
.sw-toggle-label { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.sw-toggle-count {
  margin-inline-start: auto;
  padding-inline-start: 6px;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  color: var(--sw-ink, inherit);
}
.sw-toggle-count[data-warn="true"] { color: var(--dsw-alias-state-warn-primary, #f5a623); }

.sw-input {
  width: 84px;
  box-sizing: border-box;
  padding: 4px 8px;
  border: 1px solid var(--dsw-alias-border-l2, currentColor);
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-2, transparent);
  color: var(--dsw-alias-label-primary, inherit);
  font-family: inherit;
  font-size: 13px;
  line-height: 18px;
  text-align: end;
  font-variant-numeric: tabular-nums;
}

.sw-input:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary, currentColor); outline-offset: -1px; }

.sw-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
`

/** Stable data-plugin marker and the stylesheet's identity. */
const PLUGIN_ID = 'dsh-session-watch'

let installed: HTMLStyleElement | undefined

/**
 * Inject the stylesheet once per document.
 * @returns the attached style element.
 */
export function injectStyles(): HTMLStyleElement {
  if (installed !== undefined && installed.isConnected) return installed
  const style = document.createElement('style')
  style.setAttribute('data-plugin', PLUGIN_ID)
  style.textContent = CSS
  document.head.appendChild(style)
  installed = style
  return style
}

/** Remove the stylesheet (client fiber dispose). */
export function removeStyles(): void {
  if (installed === undefined) return
  installed.remove()
  installed = undefined
}
