<sub>🌐 <a href="README.md">中文</a> · <b>English</b></sub>

<div align="center">

# dsh-unarchived-watch

> *「By the eleventh unarchived session, the sidebar foot lights a yellow warning for you.」*

![DSH plugin](https://img.shields.io/badge/DSH-plugin-blueviolet)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![no archive writes](https://img.shields.io/badge/session%20or%20archive%20writes-none-brightgreen)

**A dashboard light for unarchived-session backlog: it lights up when you cross the threshold. It never archives, deletes, or persists anything.**

[Why](#why) · [Measured example](#measured-example) · [Quick start](#quick-start) · [Safety](#safety) · [Files](#files) · [Verification](#verification)

</div>

---

## Why

Archiving in DSH is a **manual** action, and nothing reminds you that it is time.

So it always happens the same way: a few weeks of opening new sessions, then one day the sidebar takes forever to scroll, and you spend half an hour hunting, archiving, and wishing you had kept up.

This plugin turns "time to clean up" into a **passive signal**: once unarchived ordinary sessions pass your threshold (10 by default), a yellow warning triangle appears at the sidebar foot with the current count as a badge; the Settings threshold row carries the same count.

**It tells you; it does not act for you.** Archiving stays in the sidebar's own row actions — the plugin takes over no state at all.

## Measured example

Real replay on a local instance (DSH Desktop, 2026-10-02 11:16), not a fabricated sample:

```text
Session list              125 rows
ordinary sessions          63     (48 subagent children + 14 blank sessions excluded)
archived among them        34
-> unarchived ordinary     29
-> threshold               10
-> sidebar                 lit, badge 29
```

During the same session the archive set grew from 11 to 38 (27 sessions were archived in between) and the count followed from **54 down to 29** — live, with no refresh.

## Quick start

```sh
# 1) from npm
dsh plugin --profile web add dsh-unarchived-watch

# 2) straight from GitHub (no build approval needed: lib/ is committed)
dsh plugin --profile web add github:d0ublecl1ck/dsh-unarchived-watch
```

Then reload the window (Cmd+R). Afterwards you can just ask:

```text
How many sessions are unarchived right now? Set the threshold to 20.
```

The threshold also lives in the profile's `cordis.patch.yml` — note that **the row id is the settings namespace**:

```yaml
- id: unarchived-watch
  name: dsh-unarchived-watch
  config:
    threshold: 20
```

## What you get

| Where | What | When |
|---|---|---|
| Sidebar foot | yellow warning triangle + count badge | unarchived ordinary sessions **strictly greater than** the threshold |
| Hover / keyboard focus | tooltip: `{count} unarchived sessions, above the threshold of {threshold}` | while the icon is visible |
| Settings → General | "Unarchived session warning" row: input + current count | while the Host serves this plugin's config |

## Safety

- **No session or archive state writes**: no `archiveSession`, `unarchiveSession`, or delete call anywhere. The plugin's only write is the threshold you change yourself — it goes through the Host settings transport into the profile's `cordis.patch.yml`, which is configuration, not session state.
- **No network**: the client only reads snapshots the shell already publishes (`useSessions` / `useWorkspaces`).
- **No persistence**: no files, no `localStorage` keys, no storage domain of its own.
- **No silent miscount**: the badge and the Settings row share one implementation in `src/count.ts`, with the counting scope pinned by unit tests.
- **Stops instead of guessing**: when the Host serves no config namespace for this plugin, the row and the board are not registered (the icon still works with the default threshold).

## Files

```text
src/index.ts                    host half: name / Config / apply only (threshold is volatile)
src/count.ts                    pure counting scope
src/client/index.ts             browser half: registers badge and the settings row
src/client/WarningBadge.tsx     sidebar-foot icon + count badge + the shell's Tooltip
src/client/ThresholdRow.tsx     threshold input row
scripts/check-release.mjs       offline release check (manifest, contracts, externals, freshness)
test/                           22 node:test cases (scope, module contract, SSR renders)
```

## Verification

```sh
npm run verify        # typecheck + build + 22 tests + check-release
```

`npm run check-release` blocks the four release accidents this project has hit or could hit: a stale `lib/` after editing `src/`, an `export default` that folds away `inject`, a browser bundle requiring a module outside the shell's platform seed, and a tarball that would drop `cordis.patch.yml`.

Known boundary: the unit tests cover what the components render; the final slot mount in the browser needs a page reload to confirm.

## License

[MIT](LICENSE)
