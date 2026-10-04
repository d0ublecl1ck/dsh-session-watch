window.__ModuleLoader__.load({
  id: "dsh-session-watch",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.ts
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);

// src/count.ts
var DEFAULT_THRESHOLD = 10;
var METRICS = ["running", "unread", "pending", "idle", "unarchived", "archived"];
function isOrdinary(row) {
  if (row.blank === true) return false;
  if (row.origin === "subagent") return false;
  if (row.parentId !== void 0) return false;
  return true;
}
function activityBucket(status, row) {
  if (status?.pendingInteraction !== void 0) return "pending";
  const running = status?.running ?? row.running;
  if (running === true) return "running";
  if (status?.completionUnread === true) return "unread";
  return "idle";
}
function zeroCounts() {
  return { running: 0, unread: 0, pending: 0, idle: 0, unarchived: 0, archived: 0 };
}
function countSessions(list, archivedIds, statuses) {
  if (list === void 0 || list === null || !Array.isArray(list.ids)) return zeroCounts();
  const archived = /* @__PURE__ */ new Set();
  for (const id of archivedIds ?? []) archived.add(String(id));
  const byId = list.byId ?? {};
  const counts = zeroCounts();
  for (const raw of list.ids) {
    const id = String(raw);
    const row = byId[id];
    if (row === void 0 || row === null) continue;
    if (!isOrdinary(row)) continue;
    if (archived.has(id)) {
      counts.archived += 1;
      continue;
    }
    counts.unarchived += 1;
    const status = typeof statuses?.get === "function" ? statuses.get(id) : void 0;
    counts[activityBucket(status, row)] += 1;
  }
  return counts;
}
function normalizeThreshold(value) {
  const parsed = typeof value === "number" ? value : Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(parsed)) return DEFAULT_THRESHOLD;
  const whole = Math.trunc(parsed);
  return whole >= 1 ? whole : DEFAULT_THRESHOLD;
}
function shouldWarn(count, threshold) {
  return count > normalizeThreshold(threshold);
}

// src/config.ts
var PLUGIN_ID = "session-watch";
var METRIC_FIELD = {
  running: "showRunning",
  unread: "showUnread",
  pending: "showPending",
  idle: "showIdle",
  unarchived: "showUnarchived",
  archived: "showArchived"
};
var DEFAULT_VISIBILITY = {
  running: true,
  unread: true,
  pending: true,
  idle: true,
  unarchived: true,
  archived: true
};
function normalizeVisibility(value) {
  const source = value ?? {};
  const result = {};
  for (const metric of METRICS) {
    const raw = source[METRIC_FIELD[metric]];
    result[metric] = typeof raw === "boolean" ? raw : DEFAULT_VISIBILITY[metric];
  }
  return result;
}
var VARIANTS = ["chips", "meter"];
var DEFAULT_VARIANT = "chips";
function normalizeVariant(value) {
  const candidate = String(value ?? "");
  return VARIANTS.includes(candidate) ? candidate : DEFAULT_VARIANT;
}
function visibleMetrics(visibility) {
  return METRICS.filter((metric) => visibility[metric]);
}

// src/client/locales.ts
var zh = {
  "metric.running": "\u8FD0\u884C\u4E2D",
  "metric.unread": "\u672A\u8BFB",
  "metric.pending": "\u5F85\u5904\u7406",
  "metric.idle": "\u95F2\u7F6E",
  "metric.unarchived": "\u672A\u5F52\u6863",
  "metric.archived": "\u5DF2\u5F52\u6863",
  "watch.aria": "\u4F1A\u8BDD\u72B6\u6001\uFF1A{summary}",
  "watch.summaryItem": "{label} {count} \u4E2A",
  "watch.summaryJoin": "\uFF0C",
  "watch.railHint": "\u4F1A\u8BDD\u72B6\u6001 \xB7 {unarchived} \u4E2A\u672A\u5F52\u6863",
  "watch.warn": "\u672A\u5F52\u6863 {count} \u4E2A\uFF0C\u5DF2\u8D85\u8FC7\u9608\u503C {threshold} \u4E2A",
  "watch.empty": "\u6CA1\u6709\u8981\u663E\u793A\u7684\u8BA1\u6570\u9879",
  "row.title": "Session Watch \u72B6\u6001\u663E\u793A",
  "row.description": "\u4FA7\u8FB9\u680F\u5E95\u90E8\u663E\u793A\u54EA\u4E9B\u4F1A\u8BDD\u8BA1\u6570\u3002\u5F53\u524D\uFF1A{summary}",
  "row.showLabel": "\u663E\u793A\u9879\u76EE",
  "row.variantLabel": "\u7248\u5F0F",
  "row.variant.chips": "\u80F6\u56CA",
  "row.variant.meter": "\u6BD4\u4F8B\u6761",
  "row.thresholdLabel": "\u672A\u5F52\u6863\u544A\u8B66\u9608\u503C",
  "row.thresholdHint": "\u672A\u5F52\u6863\u8D85\u8FC7\u8BE5\u6570\u91CF\u65F6\uFF0C\u672A\u5F52\u6863\u8BA1\u6570\u8FDB\u5165\u544A\u8B66\u8272\u3002",
  "row.inputLabel": "\u672A\u5F52\u6863\u4F1A\u8BDD\u9608\u503C",
  "row.saveFailed": "\u4FDD\u5B58\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5"
};
var en = {
  "metric.running": "Running",
  "metric.unread": "Unread",
  "metric.pending": "Pending",
  "metric.idle": "Idle",
  "metric.unarchived": "Unarchived",
  "metric.archived": "Archived",
  "watch.aria": "Session status: {summary}",
  "watch.summaryItem": "{label} {count}",
  "watch.summaryJoin": ", ",
  "watch.railHint": "Session status \xB7 {unarchived} unarchived",
  "watch.warn": "Unarchived {count}, above the threshold of {threshold}",
  "watch.empty": "No metric is shown",
  "row.title": "Session Watch readout",
  "row.description": "Choose which Session counts the sidebar foot shows. Currently: {summary}",
  "row.showLabel": "Shown metrics",
  "row.variantLabel": "Layout",
  "row.variant.chips": "Chips",
  "row.variant.meter": "Meter",
  "row.thresholdLabel": "Unarchived warning threshold",
  "row.thresholdHint": "The unarchived count turns warning-coloured above this number.",
  "row.inputLabel": "Unarchived session threshold",
  "row.saveFailed": "Could not save; try again"
};

// src/client/styles.ts
var CSS = `
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
`;
var PLUGIN_ID2 = "dsh-session-watch";
var installed;
function injectStyles() {
  if (installed !== void 0 && installed.isConnected) return installed;
  const style = document.createElement("style");
  style.setAttribute("data-plugin", PLUGIN_ID2);
  style.textContent = CSS;
  document.head.appendChild(style);
  installed = style;
  return style;
}
function removeStyles() {
  if (installed === void 0) return;
  installed.remove();
  installed = void 0;
}

// src/client/config-source.ts
function read(form) {
  let value = {};
  try {
    value = form.getSnapshot()?.value ?? {};
  } catch {
    value = {};
  }
  return {
    threshold: normalizeThreshold(value.threshold),
    variant: normalizeVariant(value.variant),
    visibility: normalizeVisibility(value)
  };
}
function sameVisibility(left, right) {
  for (const metric of METRICS) if (left[metric] !== right[metric]) return false;
  return true;
}
function sameConfig(left, right) {
  return left.threshold === right.threshold && left.variant === right.variant && sameVisibility(left.visibility, right.visibility);
}
function createConfigSource(form) {
  let current = read(form);
  const listeners = /* @__PURE__ */ new Set();
  const publish = (next) => {
    if (sameConfig(next, current)) return;
    current = next;
    for (const listener of [...listeners]) listener();
  };
  const unsubscribe = form.subscribe(() => {
    publish(read(form));
  });
  const write = async (field, value) => {
    let accepted = false;
    try {
      accepted = await form.set(field, value);
    } catch {
      accepted = false;
    }
    if (!accepted) publish(read(form));
    return accepted;
  };
  return {
    getSnapshot: () => current,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    setThreshold: (value) => {
      const next = normalizeThreshold(value);
      publish({ ...current, threshold: next });
      return write("threshold", next);
    },
    setVisible: (metric, visible) => {
      publish({ ...current, visibility: { ...current.visibility, [metric]: visible } });
      return write(METRIC_FIELD[metric], visible);
    },
    setVariant: (variant) => {
      publish({ ...current, variant });
      return write("variant", variant);
    },
    dispose: () => {
      unsubscribe();
      listeners.clear();
    }
  };
}

// src/client/SettingsRow.tsx
var import_react = require("react");

// src/client/summary.ts
function metricValue(counts, metric) {
  return counts[metric];
}
function metricLabel(t, metric) {
  return t("metric." + metric);
}
function summaryText(t, counts, visibility) {
  const shown = visibleMetrics(visibility);
  if (shown.length === 0) return t("watch.empty");
  const parts = shown.map(
    (metric) => t("watch.summaryItem", { label: metricLabel(t, metric), count: counts[metric] })
  );
  return parts.join(t("watch.summaryJoin"));
}
function unarchivedWarns(counts, threshold) {
  return shouldWarn(counts.unarchived, threshold);
}
var ALL_METRICS = METRICS;

// src/client/icons.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function frame(size) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.3,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    focusable: false
  };
}
function MetricIcon({ metric, size = 13 }) {
  if (metric === "running") {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { ...frame(size), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5.4 3.6 12.2 8l-6.8 4.4z" }) });
  }
  if (metric === "unread") {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { ...frame(size), children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "8", cy: "8", r: "5" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "8", cy: "8", r: "1.7", fill: "currentColor", stroke: "none" })
    ] });
  }
  if (metric === "pending") {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { ...frame(size), children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "8", cy: "8", r: "5.2" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M8 5.1v3.1" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M8 10.6h.01" })
    ] });
  }
  if (metric === "idle") {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { ...frame(size), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M9.9 2.9a5.7 5.7 0 1 0 3.2 8.9 4.6 4.6 0 0 1-3.2-8.9z" }) });
  }
  if (metric === "unarchived") {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { ...frame(size), children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M2.6 9.1 4.3 4.2a1 1 0 0 1 .94-.68h5.52a1 1 0 0 1 .94.68l1.7 4.9" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M2.6 9.1h3.1l.65 1.5h3.3l.65-1.5h3.1v3a1 1 0 0 1-1 1H3.6a1 1 0 0 1-1-1z" })
    ] });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { ...frame(size), children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M2.1 3.3h11.8v2.2H2.1z" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3 5.5h10v6.2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M6.4 8.7h3.2" })
  ] });
}
function WatchIcon({ size = 16 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { ...frame(size), children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "8", cy: "8", r: "5.4" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M8 5.4V8l1.9 1.2" })
  ] });
}

// src/client/use-counts.ts
var EMPTY_STATUSES = /* @__PURE__ */ new Map();
function useSessionCounts({ useSessions, useSessionStatus, useWorkspaces }) {
  const useStatus = typeof useSessionStatus === "function" ? useSessionStatus : (selector) => selector(EMPTY_STATUSES);
  const archived = useWorkspaces((state) => state.archivedSessionIds);
  const statuses = useStatus((state) => state);
  return {
    running: useSessions((state) => countSessions(state, archived, statuses).running),
    unread: useSessions((state) => countSessions(state, archived, statuses).unread),
    pending: useSessions((state) => countSessions(state, archived, statuses).pending),
    idle: useSessions((state) => countSessions(state, archived, statuses).idle),
    unarchived: useSessions((state) => countSessions(state, archived, statuses).unarchived),
    archived: useSessions((state) => countSessions(state, archived, statuses).archived)
  };
}

// src/client/SettingsRow.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
function SettingsRow({ useSessions, useSessionStatus, useWorkspaces, config, t }) {
  const watch = (0, import_react.useSyncExternalStore)(config.subscribe, config.getSnapshot, config.getSnapshot);
  const counts = useSessionCounts({ useSessions, useSessionStatus, useWorkspaces });
  const [draft, setDraft] = (0, import_react.useState)(String(watch.threshold));
  const [failed, setFailed] = (0, import_react.useState)(false);
  (0, import_react.useEffect)(() => {
    setDraft(String(watch.threshold));
    setFailed(false);
  }, [watch.threshold]);
  const commit = () => {
    const parsed = Number.parseInt(draft, 10);
    if (!Number.isFinite(parsed) || parsed < 1 || parsed === watch.threshold) {
      setDraft(String(watch.threshold));
      setFailed(false);
      return;
    }
    void config.setThreshold(parsed).then((accepted) => {
      setFailed(!accepted);
      if (!accepted) setDraft(String(watch.threshold));
    });
  };
  const summary = summaryText(t, counts, watch.visibility);
  const warn = counts.unarchived > watch.threshold;
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "sw-row", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "sw-row-text", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "sw-row-title", children: t("row.title") }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "sw-row-desc", children: t("row.description", { summary }) }),
      failed ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "sw-row-error", children: t("row.saveFailed") }) : null
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "sw-row-controls", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "sw-variants", role: "radiogroup", "aria-label": t("row.variantLabel"), children: VARIANTS.map((variant) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        "button",
        {
          type: "button",
          role: "radio",
          "aria-checked": watch.variant === variant,
          className: watch.variant === variant ? "sw-variant sw-variant-on" : "sw-variant",
          onClick: () => {
            void config.setVariant(variant);
          },
          children: t("row.variant." + variant)
        },
        variant
      )) }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("fieldset", { className: "sw-toggles", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("legend", { className: "sw-field-label", children: t("row.showLabel") }),
        ALL_METRICS.map((metric) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("label", { className: "sw-toggle", "data-metric": metric, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "input",
            {
              type: "checkbox",
              checked: watch.visibility[metric],
              onChange: (event) => {
                void config.setVisible(metric, event.currentTarget.checked);
              }
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "sw-toggle-swatch", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(MetricIcon, { metric }) }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "sw-toggle-label", children: metricLabel(t, metric) }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "span",
            {
              className: "sw-toggle-count",
              "data-warn": metric === "unarchived" && warn ? "true" : void 0,
              children: metricValue(counts, metric)
            }
          )
        ] }, metric))
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("label", { className: "sw-field", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "sw-field-label", children: t("row.thresholdLabel") }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "sw-field-hint", children: t("row.thresholdHint") }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "sw-sr-only", children: t("row.inputLabel") }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "input",
          {
            className: "sw-input",
            type: "number",
            min: 1,
            step: 1,
            inputMode: "numeric",
            value: draft,
            onChange: (event) => setDraft(event.currentTarget.value),
            onBlur: commit,
            onKeyDown: (event) => {
              if (event.key !== "Enter") return;
              event.preventDefault();
              commit();
            }
          }
        )
      ] })
    ] })
  ] });
}

// src/client/StatusWatch.tsx
var import_react2 = require("react");
var import_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
var import_jsx_runtime3 = require("react/jsx-runtime");
var ACTIVITY = ["running", "unread", "pending", "idle"];
function StatusWatch({
  wide,
  useSessions,
  useSessionStatus,
  useWorkspaces,
  config,
  t
}) {
  const watch = (0, import_react2.useSyncExternalStore)(config.subscribe, config.getSnapshot, config.getSnapshot);
  const counts = useSessionCounts({ useSessions, useSessionStatus, useWorkspaces });
  const shown = visibleMetrics(watch.visibility);
  if (shown.length === 0) return null;
  const warn = unarchivedWarns(counts, watch.threshold);
  const summary = summaryText(t, counts, watch.visibility);
  const label = warn ? t("watch.warn", { count: counts.unarchived, threshold: watch.threshold }) + t("watch.summaryJoin") + summary : t("watch.aria", { summary });
  if (!wide) {
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_dsh_client_ui_primitives.Tooltip, { label, side: "top", delayMs: 200, portal: true, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: "sw-rail", role: "status", "aria-label": label, "data-warn": warn ? "true" : void 0, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(WatchIcon, {}),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "sw-rail-count", "aria-hidden": "true", children: counts.unarchived })
    ] }) });
  }
  const body = watch.variant === "meter" ? renderMeter(counts, shown, warn) : renderChips(counts, shown, warn);
  return (
    // The shell's own tooltip is portaled out of the sidebar's clipping column,
    // so the full metric names survive even in the 56px rail. Hover and
    // keyboard focus both raise it; the readout keeps its own accessible name.
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_dsh_client_ui_primitives.Tooltip, { label, side: "top", delayMs: 200, portal: true, children: body })
  );
}
function warnOf(metric, warn) {
  return metric === "unarchived" && warn ? "true" : void 0;
}
function renderChips(counts, shown, warn) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "sw-watch", "data-variant": "chips", role: "status", children: shown.map((metric) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: "sw-chip", "data-metric": metric, "data-warn": warnOf(metric, warn), children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(MetricIcon, { metric }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "sw-chip-count", children: counts[metric] })
  ] }, metric)) });
}
function renderMeter(counts, shown, warn) {
  const activity = ACTIVITY.filter((metric) => shown.includes(metric));
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: "sw-meter", "data-variant": "meter", role: "status", children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "sw-meter-bar", "aria-hidden": "true", children: activity.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "sw-meter-seg", "data-metric": "idle", "data-empty": "true" }) : activity.map((metric) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      "span",
      {
        className: "sw-meter-seg",
        "data-metric": metric,
        style: { flexGrow: Math.max(0, counts[metric]) }
      },
      metric
    )) }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "sw-meter-legend", children: shown.map((metric) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: "sw-legend", "data-metric": metric, "data-warn": warnOf(metric, warn), children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(MetricIcon, { metric }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "sw-chip-count", children: counts[metric] })
    ] }, metric)) })
  ] });
}

// src/client/index.ts
var inject = ["slots", "locale", "configForms", "sessions", "uiSession", "workspaces", "uiWorkspace"];
function apply(ctx) {
  ctx.effect(() => {
    const style = injectStyles();
    return () => {
      style.remove();
      removeStyles();
    };
  }, "session-watch: styles");
  ctx.effect(() => ctx.locale.register(PLUGIN_ID, { zh, en }), "session-watch: dictionaries");
  const t = ctx.locale.bind(PLUGIN_ID);
  const config = createConfigSource(ctx.configForms.get(PLUGIN_ID));
  ctx.effect(() => () => config.dispose(), "session-watch: config source");
  ctx.slots.inject(
    "sidebar.footer.action",
    () => ctx.slots.register(
      {
        name: "sidebar.footer.action",
        id: PLUGIN_ID,
        order: 920,
        inject: () => ({ config, t })
      },
      StatusWatch
    )
  );
  ctx.effect(
    () => ctx.configForms.whileServed(
      [PLUGIN_ID],
      () => ctx.slots.inject(
        "settings.general.item",
        () => ctx.slots.register(
          {
            name: "settings.general.item",
            id: PLUGIN_ID,
            order: 16,
            inject: () => ({ config, t })
          },
          SettingsRow
        )
      )
    ),
    "session-watch: settings row"
  );
}
//# sourceMappingURL=client.js.map
    return module.exports;
  }
});

//# sourceMappingURL=client.js.map