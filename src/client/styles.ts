/**
 * Injected page styles for the warning badge and the Unarchived sessions
 * settings page. One `<style data-plugin>` element owns every `uw-` class and
 * the client fiber removes it on dispose; colors come from the shell's own
 * tokens so both surfaces follow the active theme.
 *
 * @module dsh-unarchived-watch/client/styles
 */

const CSS = `
/* The sidebar-foot seat: the same 28px round geometry the shipped footer
   control uses, so the icon sits on the row without shifting it. */
.uw-badge {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 28px;
  height: 28px;
  color: var(--dsw-alias-state-warn-primary, #f59e0b);
}

.uw-badge svg { display: block; }

.uw-badge-count {
  position: absolute;
  top: -2px;
  inset-inline-end: -6px;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 8px;
  border: 2px solid var(--dsw-specific-sidebar-fill, transparent);
  background: var(--dsw-alias-state-warn-primary, #f59e0b);
  color: var(--dsw-alias-label-primary-inverted, #fff);
  font-size: 10px;
  font-weight: 620;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  pointer-events: none;
}

/* The Settings row for the threshold. */
.uw-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 0;
}

.uw-row-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.uw-row-title {
  font-size: 13px;
  line-height: 18px;
  color: var(--dsw-alias-label-primary, inherit);
}

.uw-row-desc {
  font-size: 12px;
  line-height: 16px;
  color: var(--dsw-alias-label-tertiary, GrayText);
}

.uw-row-error {
  font-size: 12px;
  line-height: 16px;
  color: var(--dsw-alias-state-error-primary, #e5484d);
}

.uw-row-control { flex: none; }

.uw-input {
  width: 76px;
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

.uw-input:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary, currentColor);
  outline-offset: -1px;
}

.uw-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

/* The Settings page: summary on top, one block per Workspace below. */
.uw-section {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 4px 0 24px;
}

.uw-section-head {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.uw-section-title {
  font-size: 15px;
  line-height: 22px;
  font-weight: 600;
  color: var(--dsw-alias-label-primary, inherit);
}

.uw-section-summary {
  font-size: 13px;
  line-height: 20px;
  color: var(--dsw-alias-label-secondary, inherit);
}

.uw-section-state {
  font-size: 12px;
  line-height: 18px;
  color: var(--dsw-alias-state-warn-primary, #f59e0b);
}

.uw-section-state-under { color: var(--dsw-alias-label-tertiary, GrayText); }

.uw-section-rule,
.uw-section-empty {
  font-size: 12px;
  line-height: 18px;
  color: var(--dsw-alias-label-tertiary, GrayText);
}

.uw-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.uw-group-head {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 4px 0 2px;
}

.uw-group-title {
  font-size: 13px;
  line-height: 18px;
  font-weight: 600;
  color: var(--dsw-alias-label-primary, inherit);
}

.uw-group-path {
  min-width: 0;
  font-size: 12px;
  line-height: 18px;
  color: var(--dsw-alias-label-tertiary, GrayText);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.uw-group-count {
  margin-inline-start: auto;
  flex: none;
  font-size: 12px;
  line-height: 18px;
  color: var(--dsw-alias-label-tertiary, GrayText);
  font-variant-numeric: tabular-nums;
}

.uw-group-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.uw-item {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-2, transparent);
}

.uw-item-title {
  flex: 1;
  min-width: 0;
  font-size: 13px;
  line-height: 18px;
  color: var(--dsw-alias-label-primary, inherit);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.uw-item-running {
  flex: none;
  font-size: 11px;
  line-height: 18px;
  color: var(--dsw-alias-state-success-primary, #2ea043);
}

.uw-item-meta {
  flex: none;
  font-size: 12px;
  line-height: 18px;
  color: var(--dsw-alias-label-tertiary, GrayText);
  font-variant-numeric: tabular-nums;
}
`

/** Stable `data-plugin` marker and the stylesheet's identity. */
const PLUGIN_ID = 'dsh-unarchived-watch'

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
