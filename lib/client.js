window.__ModuleLoader__.load({
  id: "dsh-unarchived-watch",
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

// src/client/locales.ts
var zh = {
  "badge.aria": "\u672A\u5F52\u6863\u4F1A\u8BDD {count} \u4E2A\uFF0C\u5DF2\u8D85\u8FC7\u9608\u503C {threshold} \u4E2A",
  "row.title": "\u672A\u5F52\u6863\u4F1A\u8BDD\u63D0\u9192",
  "row.description": "\u672A\u5F52\u6863\u4F1A\u8BDD\u8D85\u8FC7\u8BE5\u6570\u91CF\u65F6\uFF0C\u5728\u4FA7\u8FB9\u680F\u5E95\u90E8\u663E\u793A\u8B66\u544A\u56FE\u6807\u3002\u5F53\u524D {count} \u4E2A\u672A\u5F52\u6863\uFF0C\u9608\u503C {threshold} \u4E2A\u3002",
  "row.inputLabel": "\u672A\u5F52\u6863\u4F1A\u8BDD\u9608\u503C",
  "row.saveFailed": "\u4FDD\u5B58\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5",
  "section.nav": "\u672A\u5F52\u6863\u4F1A\u8BDD",
  "section.title": "\u672A\u5F52\u6863\u4F1A\u8BDD",
  "section.summary": "\u5F53\u524D {count} \u4E2A\u672A\u5F52\u6863\u666E\u901A\u4F1A\u8BDD\uFF0C\u9608\u503C\u4E3A {threshold} \u4E2A\u3002",
  "section.over": "\u5DF2\u8D85\u8FC7\u9608\u503C\uFF0C\u4FA7\u8FB9\u680F\u5E95\u90E8\u4F1A\u4EAE\u8D77\u8B66\u544A\u56FE\u6807\u3002",
  "section.under": "\u672A\u8D85\u8FC7\u9608\u503C\uFF0C\u4FA7\u8FB9\u680F\u4E0D\u4EAE\u706F\u3002",
  "section.rule": "\u53E3\u5F84\uFF1A\u53EA\u6570\u666E\u901A\u4F1A\u8BDD \u2014\u2014 \u5DF2\u5F52\u6863\u3001\u5B50\u4EE3\u7406\u5B50\u4F1A\u8BDD\u4E0E\u7A7A\u767D\u65B0\u5EFA\u4F1A\u8BDD\u90FD\u4E0D\u8BA1\u5165\u3002",
  "section.empty": "\u6CA1\u6709\u672A\u5F52\u6863\u7684\u666E\u901A\u4F1A\u8BDD\u3002",
  "section.ungrouped": "\u672A\u5F52\u5C5E\u5DE5\u4F5C\u533A",
  "section.running": "\u8FD0\u884C\u4E2D",
  "section.age.minute": "{count} \u5206\u949F\u524D",
  "section.age.hour": "{count} \u5C0F\u65F6\u524D",
  "section.age.day": "{count} \u5929\u524D",
  "section.count": "{count} \u4E2A"
};
var en = {
  "badge.aria": "{count} unarchived sessions, above the threshold of {threshold}",
  "row.title": "Unarchived session warning",
  "row.description": "Show a warning icon at the sidebar foot once unarchived sessions exceed this number. Currently {count} unarchived, threshold {threshold}.",
  "row.inputLabel": "Unarchived session threshold",
  "row.saveFailed": "Could not save; try again",
  "section.nav": "Unarchived sessions",
  "section.title": "Unarchived sessions",
  "section.summary": "{count} unarchived ordinary sessions right now, threshold {threshold}.",
  "section.over": "Past the threshold: the sidebar foot shows the warning icon.",
  "section.under": "Below the threshold: the sidebar stays dark.",
  "section.rule": "Scope: ordinary sessions only \u2014 archived, subagent, and blank sessions are not counted.",
  "section.empty": "No unarchived ordinary sessions.",
  "section.ungrouped": "No workspace",
  "section.running": "Running",
  "section.age.minute": "{count} min ago",
  "section.age.hour": "{count} h ago",
  "section.age.day": "{count} d ago",
  "section.count": "{count}"
};

// src/client/styles.ts
var CSS = `
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
`;
var PLUGIN_ID = "dsh-unarchived-watch";
var installed;
function injectStyles() {
  if (installed !== void 0 && installed.isConnected) return installed;
  const style = document.createElement("style");
  style.setAttribute("data-plugin", PLUGIN_ID);
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

// src/count.ts
var DEFAULT_THRESHOLD = 10;
function selectRows(list, archivedIds) {
  if (list === void 0 || list === null || !Array.isArray(list.ids)) return [];
  const archived = /* @__PURE__ */ new Set();
  for (const id of archivedIds ?? []) archived.add(String(id));
  const byId = list.byId ?? {};
  const selected = [];
  for (const raw of list.ids) {
    const id = String(raw);
    const row = byId[id];
    if (row === void 0 || row === null) continue;
    if (row.blank === true) continue;
    if (row.origin === "subagent" || row.parentId !== void 0) continue;
    if (archived.has(id)) continue;
    selected.push({ id, row });
  }
  return selected;
}
function titleOf(row, fallback) {
  for (const candidate of [row.displayTitle, row.title]) {
    if (typeof candidate === "string" && candidate !== "") return candidate;
  }
  return fallback;
}
function countUnarchived(list, archivedIds) {
  return selectRows(list, archivedIds).length;
}
function collectUnarchived(list, archivedIds) {
  return selectRows(list, archivedIds).map(({ id, row }) => ({
    sessionId: id,
    title: titleOf(row, id),
    cwd: typeof row.cwd === "string" && row.cwd !== "" ? row.cwd : void 0,
    updatedAt: typeof row.updatedAt === "number" && Number.isFinite(row.updatedAt) ? row.updatedAt : 0,
    running: row.running === true
  }));
}
function groupUnarchived(rows, workspaces) {
  const groups = [];
  const claimed = /* @__PURE__ */ new Set();
  for (const item of workspaces?.items ?? []) {
    if (item === void 0 || item === null) continue;
    const members = new Set((item.sessionIds ?? []).map(String));
    const chosen = rows.filter((row) => members.has(row.sessionId) && !claimed.has(row.sessionId));
    if (chosen.length === 0) continue;
    for (const row of chosen) claimed.add(row.sessionId);
    groups.push({
      workspaceId: typeof item.workspaceId === "string" ? item.workspaceId : void 0,
      key: String(item.workspaceId),
      label: typeof item.title === "string" ? item.title : "",
      path: typeof item.path === "string" ? item.path : void 0,
      rows: chosen
    });
  }
  const leftovers = rows.filter((row) => !claimed.has(row.sessionId));
  if (leftovers.length > 0) {
    groups.push({ workspaceId: void 0, key: "", label: "", path: void 0, rows: leftovers });
  }
  return groups;
}
function describeAge(updatedAt, now) {
  const minutes = Math.max(0, Math.floor((now - updatedAt) / 6e4));
  if (minutes < 60) return { unit: "minute", value: minutes };
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return { unit: "hour", value: hours };
  return { unit: "day", value: Math.floor(hours / 24) };
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

// src/client/threshold.ts
function read(form) {
  try {
    return normalizeThreshold(form.getSnapshot()?.value?.threshold);
  } catch {
    return normalizeThreshold(void 0);
  }
}
function createThresholdSource(form) {
  let current = read(form);
  const listeners = /* @__PURE__ */ new Set();
  const publish = (next) => {
    if (next === current) return;
    current = next;
    for (const listener of [...listeners]) listener();
  };
  const unsubscribe = form.subscribe(() => {
    publish(read(form));
  });
  return {
    getSnapshot: () => current,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    set: async (value) => {
      const next = normalizeThreshold(value);
      publish(next);
      let accepted = false;
      try {
        accepted = await form.set("threshold", next);
      } catch {
        accepted = false;
      }
      if (!accepted) publish(read(form));
      return accepted;
    },
    dispose: () => {
      unsubscribe();
      listeners.clear();
    }
  };
}

// src/client/ThresholdRow.tsx
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
function ThresholdRow({ useSessions, useWorkspaces, threshold, t }) {
  const current = (0, import_react.useSyncExternalStore)(threshold.subscribe, threshold.getSnapshot, threshold.getSnapshot);
  const archived = useWorkspaces((state) => state.archivedSessionIds);
  const count = useSessions((state) => countUnarchived(state, archived));
  const [draft, setDraft] = (0, import_react.useState)(String(current));
  const [failed, setFailed] = (0, import_react.useState)(false);
  (0, import_react.useEffect)(() => {
    setDraft(String(current));
    setFailed(false);
  }, [current]);
  const commit = () => {
    const parsed = Number.parseInt(draft, 10);
    if (!Number.isFinite(parsed) || parsed < 1 || parsed === current) {
      setDraft(String(current));
      setFailed(false);
      return;
    }
    void threshold.set(parsed).then((accepted) => {
      setFailed(!accepted);
      if (!accepted) setDraft(String(current));
    });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "uw-row", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "uw-row-text", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "uw-row-title", children: t("row.title") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "uw-row-desc", children: t("row.description", { count, threshold: current }) }),
      failed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "uw-row-error", children: t("row.saveFailed") }) : null
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "uw-row-control", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "uw-sr-only", children: t("row.inputLabel") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "input",
        {
          className: "uw-input",
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
  ] });
}

// src/client/UnarchivedSection.tsx
var import_react2 = require("react");
var import_jsx_runtime2 = require("react/jsx-runtime");
function UnarchivedSection({ useSessions, useWorkspaces, threshold, t }) {
  const limit = (0, import_react2.useSyncExternalStore)(threshold.subscribe, threshold.getSnapshot, threshold.getSnapshot);
  const sessions = useSessions((state) => state);
  const workspaces = useWorkspaces((state) => state);
  const rows = (0, import_react2.useMemo)(
    () => collectUnarchived(sessions, workspaces?.archivedSessionIds),
    [sessions, workspaces]
  );
  const groups = (0, import_react2.useMemo)(() => groupUnarchived(rows, workspaces), [rows, workspaces]);
  const over = shouldWarn(rows.length, limit);
  const now = Date.now();
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "uw-section", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "uw-section-head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "uw-section-title", children: t("section.title") }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "uw-section-summary", children: t("section.summary", { count: rows.length, threshold: limit }) }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: over ? "uw-section-state" : "uw-section-state uw-section-state-under", children: t(over ? "section.over" : "section.under") }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "uw-section-rule", children: t("section.rule") })
    ] }),
    groups.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "uw-section-empty", children: t("section.empty") }) : null,
    groups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("section", { className: "uw-group", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "uw-group-head", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "uw-group-title", children: group.label === "" ? t("section.ungrouped") : group.label }),
        group.path === void 0 ? null : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "uw-group-path", children: group.path }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "uw-group-count", children: t("section.count", { count: group.rows.length }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("ul", { className: "uw-group-list", children: group.rows.map((row) => {
        const age = describeAge(row.updatedAt, now);
        return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("li", { className: "uw-item", children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "uw-item-title", title: row.title, children: row.title }),
          row.running ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "uw-item-running", children: t("section.running") }) : null,
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "uw-item-meta", children: t("section.age." + age.unit, { count: age.value }) })
        ] }, row.sessionId);
      }) })
    ] }, group.key === "" ? "__ungrouped" : group.key))
  ] });
}

// src/client/WarningBadge.tsx
var import_react3 = require("react");
var import_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");

// src/client/WarningIcon.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
function WarningIcon({ size = 16 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      focusable: "false",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M7.13 2.4a1 1 0 0 1 1.74 0l5.34 9.53A1 1 0 0 1 13.34 13.4H2.66a1 1 0 0 1-.87-1.47z" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M8 6.1v3.1" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M8 11.35h.01" })
      ]
    }
  );
}

// src/client/WarningBadge.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
function WarningBadge({ useSessions, useWorkspaces, threshold, t }) {
  const limit = (0, import_react3.useSyncExternalStore)(threshold.subscribe, threshold.getSnapshot, threshold.getSnapshot);
  const archived = useWorkspaces((state) => state.archivedSessionIds);
  const count = useSessions((state) => countUnarchived(state, archived));
  if (!shouldWarn(count, limit)) return null;
  const label = t("badge.aria", { count, threshold: limit });
  return (
    // The shell's own tooltip, portaled out of the sidebar's clipping column so
    // the bubble is never cut off at the foot of the rail. Hover and keyboard
    // focus both raise it; the anchor keeps its own accessible name.
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_dsh_client_ui_primitives.Tooltip, { label, side: "top", delayMs: 200, portal: true, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { className: "uw-badge", role: "status", "aria-label": label, "data-unarchived-count": count, children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(WarningIcon, {}),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "uw-badge-count", "aria-hidden": "true", children: count })
    ] }) })
  );
}

// src/client/index.ts
var NS = "unarchived-watch";
var inject = ["slots", "locale", "configForms", "sessions", "workspaces", "uiSession", "uiWorkspace"];
function apply(ctx) {
  ctx.effect(() => {
    const style = injectStyles();
    return () => {
      style.remove();
      removeStyles();
    };
  }, "unarchived-watch: styles");
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), "unarchived-watch: dictionaries");
  const t = ctx.locale.bind(NS);
  const threshold = createThresholdSource(ctx.configForms.get(NS));
  ctx.effect(() => () => threshold.dispose(), "unarchived-watch: threshold source");
  ctx.slots.inject(
    "sidebar.footer.action",
    () => ctx.slots.register(
      {
        name: "sidebar.footer.action",
        id: NS,
        order: 920,
        inject: () => ({ threshold, t })
      },
      WarningBadge
    )
  );
  ctx.effect(
    () => ctx.configForms.whileServed(
      [NS],
      () => ctx.slots.inject(
        "settings.general.item",
        () => ctx.slots.register(
          {
            name: "settings.general.item",
            id: NS,
            order: 16,
            inject: () => ({ threshold, t })
          },
          ThresholdRow
        )
      )
    ),
    "unarchived-watch: settings row"
  );
  ctx.effect(
    () => ctx.configForms.whileServed(
      [NS],
      () => ctx.slots.inject(
        "settings.section",
        () => ctx.slots.register(
          {
            name: "settings.section",
            id: NS,
            order: 30,
            label: () => t("section.nav"),
            inject: () => ({ threshold, t })
          },
          UnarchivedSection
        )
      )
    ),
    "unarchived-watch: settings section"
  );
}
//# sourceMappingURL=client.js.map
    return module.exports;
  }
});

//# sourceMappingURL=client.js.map