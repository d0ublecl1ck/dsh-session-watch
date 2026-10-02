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
  "row.saveFailed": "\u4FDD\u5B58\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5"
};
var en = {
  "badge.aria": "{count} unarchived sessions, above the threshold of {threshold}",
  "row.title": "Unarchived session warning",
  "row.description": "Show a warning icon at the sidebar foot once unarchived sessions exceed this number. Currently {count} unarchived, threshold {threshold}.",
  "row.inputLabel": "Unarchived session threshold",
  "row.saveFailed": "Could not save; try again"
};

// src/client/styles.ts
var CSS = `
/* The sidebar-foot seat: the same 28px round geometry the shipped footer
   control uses, so the icon sits on the row without shifting it. */
.uw-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 28px;
  height: 28px;
  color: var(--dsw-alias-state-warn-primary, #f59e0b);
}

.uw-badge svg { display: block; }

/* The Settings row: label and copy on the start edge, the input at the end. */
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
function countUnarchived(list, archivedIds) {
  if (list === void 0 || list === null || !Array.isArray(list.ids)) return 0;
  const archived = /* @__PURE__ */ new Set();
  for (const id of archivedIds ?? []) archived.add(String(id));
  const byId = list.byId ?? {};
  let count = 0;
  for (const raw of list.ids) {
    const id = String(raw);
    const row = byId[id];
    if (row === void 0 || row === null) continue;
    if (row.blank === true) continue;
    if (row.origin === "subagent" || row.parentId !== void 0) continue;
    if (archived.has(id)) continue;
    count += 1;
  }
  return count;
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

// src/client/WarningBadge.tsx
var import_react2 = require("react");
var import_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");

// src/client/WarningIcon.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
function WarningIcon({ size = 16 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
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
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M7.13 2.4a1 1 0 0 1 1.74 0l5.34 9.53A1 1 0 0 1 13.34 13.4H2.66a1 1 0 0 1-.87-1.47z" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M8 6.1v3.1" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M8 11.35h.01" })
      ]
    }
  );
}

// src/client/WarningBadge.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
function WarningBadge({ useSessions, useWorkspaces, threshold, t }) {
  const limit = (0, import_react2.useSyncExternalStore)(threshold.subscribe, threshold.getSnapshot, threshold.getSnapshot);
  const archived = useWorkspaces((state) => state.archivedSessionIds);
  const count = useSessions((state) => countUnarchived(state, archived));
  if (!shouldWarn(count, limit)) return null;
  const label = t("badge.aria", { count, threshold: limit });
  return (
    // The shell's own tooltip, portaled out of the sidebar's clipping column so
    // the bubble is never cut off at the foot of the rail. Hover and keyboard
    // focus both raise it; the anchor keeps its own accessible name.
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_dsh_client_ui_primitives.Tooltip, { label, side: "top", delayMs: 200, portal: true, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "uw-badge", role: "status", "aria-label": label, "data-unarchived-count": count, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(WarningIcon, {}) }) })
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
}
//# sourceMappingURL=client.js.map
    return module.exports;
  }
});

//# sourceMappingURL=client.js.map