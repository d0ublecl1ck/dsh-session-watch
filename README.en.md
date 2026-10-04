<sub>🌐 <a href="README.md">中文</a> · <b>English</b></sub>

<div align="center">

# dsh-session-watch

> *「One row at the sidebar foot, all six Session states in sight.」*

![DSH plugin](https://img.shields.io/badge/DSH-plugin-blueviolet)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![no state writes](https://img.shields.io/badge/session%20or%20archive%20writes-none-brightgreen)

**A dashboard for Session state: running / unread / pending / idle / unarchived / archived at a glance. Which metrics show, which layout, and what counts as too many all live in Settings. It never archives, deletes, persists, or reaches the network.**

[Why](#why) · [How the six counts work](#how-the-six-counts-work) · [Two layouts](#two-layouts) · [Quick start](#quick-start) · [Settings](#settings) · [Safety](#safety) · [Files](#files) · [Verification](#verification)

</div>

---

## Why

The DSH sidebar answers "which Session is where"; it does not answer "what is on my plate right now".

So you keep scrolling back to remember: how many are still running? Which one finished while I was away? Which is waiting for my approval? The previous version of this plugin watched a single dimension and only lit a warning past a threshold — too little information.

dsh-session-watch puts six numbers at the sidebar foot, always on, live, and prunable:

| Count | Meaning | Source |
|---|---|---|
| Running | the Session's Agent is working | `running` from the official Session UI status |
| Unread | stopped while you were elsewhere and not yet acknowledged | `completionUnread` from the same status |
| Pending | an approval / plan review / question awaits you | `pendingInteraction` from the same status |
| Idle | unarchived Sessions that are none of the above | derived |
| Unarchived | ordinary Sessions outside the archive set | official Session list + Workspace archive set |
| Archived | ordinary Sessions inside the archive set | same |

**Self-contained**: it reads only the three snapshots the shell already publishes (`useSessions` / `useSessionStatus` / `useWorkspaces`). No other plugin is involved, and it reads no one else's data.

## How the six counts work

- **Scope**: ordinary Sessions only — subagent children (they are part of a parent's work) and blank New Session seats are excluded.
- **Archive axis**: an ordinary Session is either unarchived or archived, never both.
- **Activity axis**: unarchived ordinary Sessions fold into exactly one of `pending > running > unread > idle` by that precedence. The four activity numbers therefore **always sum to** the unarchived count — a Session that is running while it waits for your approval is never counted twice.
- When the status stream has not established `running` yet, the Session list row's own running flag is the fallback.

There is one implementation of the rules: [`src/count.ts`](src/count.ts), shared by the readout and the Settings row, with every boundary pinned by unit tests.

## Two layouts

| Layout | Form | Good for |
|---|---|---|
| Chips `chips` (default) | one "icon + number" pill per metric | keeping the numbers permanently in view, colour-coded |
| Meter `meter` | a stacked proportion bar over running/unread/pending/idle, with the full numbers below | seeing the distribution at a glance |

Collapsed to the 56px rail, both fold into one mark plus the unarchived count; hover or keyboard focus raises the full readout (six names and numbers).

## Quick start

```sh
# 1) from npm
dsh plugin --profile web add dsh-session-watch

# 2) straight from GitHub (lib/ is committed; no build approval needed)
dsh plugin --profile web add github:d0ublecl1ck/dsh-session-watch
```

Then reload the window (Cmd+R). Afterwards you can just ask:

```text
How many sessions are running right now? Hide "idle" and keep running, unread, and pending.
```

The preference also lives in the profile's `cordis.patch.yml` — note that **the row id is the settings namespace**:

```yaml
- id: session-watch
  name: dsh-session-watch
  config:
    threshold: 20
    variant: meter
    showIdle: false
```

## Settings

Settings → General → **Session Watch readout**:

- **Layout**: chips or meter, applied immediately.
- **Shown metrics**: one switch per count; a hidden metric takes no space in the sidebar.
- **Unarchived warning threshold**: above this number the unarchived metric turns warning-coloured; default 10.

Every field is a volatile member of this plugin's own config namespace; a change goes through the Host settings transport into the profile patch.

## Safety

- **No session or archive state writes**: no `archiveSession` / `unarchiveSession` / delete call. The only write is the preference you change yourself.
- **No network**: the client only reads snapshots the shell already publishes.
- **No persistence**: no files, no `localStorage` keys, no storage domain of its own.
- **No silent miscount**: the six numbers have one implementation, shared by the Settings row and the sidebar readout.
- **Degrades cleanly**: when the Host serves no config namespace for this plugin, the Settings row is not registered (the readout still runs on the default preference).

## Files

```text
src/index.ts                      host half: name / Config / apply (every preference field is volatile)
src/config.ts                     the six metrics, Config field names, visibility defaults, layout list
src/count.ts                      pure rules: countSessions (six), countUnarchived, threshold normalization
src/client/index.ts               browser half: registers the readout and the Settings row
src/client/StatusWatch.tsx        the sidebar-foot readout (chips / meter / rail)
src/client/SettingsRow.tsx        the Settings row (switches + layout + threshold)
src/client/config-source.ts       projects the config form into a subscribable preference
src/client/use-counts.ts          reads the six counts off the three standard hooks
src/client/summary.ts             metric names and the one-line summary
src/client/icons.tsx              six metric glyphs plus the rail mark
src/client/styles.ts              injected sw-* styles (one injection, removed on fiber dispose)
scripts/build.mjs                 tsc + esbuild + the __ModuleLoader__ wrapper
scripts/check-release.mjs         offline release check (manifest, contracts, externals, freshness)
scripts/replay-count.mjs          replays an instance's own facts through this plugin's counting
test/                             31 node:test cases (rules, module contract, SSR renders)
cordis.patch.yml                  bundle layer: inserts the row whose id is session-watch
```

## Verification

```sh
npm run verify        # typecheck + build + 31 tests + check-release
```

- **31/31 unit tests**: `test/count.test.mjs` (the six rules, the partition invariant, boundaries), `test/client-contract.test.mjs` (module id, inject, both registrations, config write mapping), `test/client-render.test.mjs` (`react-dom/server` renders of both layouts and the Settings row).
- **Release check**: `npm run check-release` blocks a stale `lib/` after editing `src/`, an `export default` that folds away `inject`, a browser bundle requiring a module outside the shell's platform seed, and a tarball that would drop `cordis.patch.yml`.
- **Instance replay**: `scripts/replay-count.mjs` runs an instance's Session list and `storages/workspace.json` through the same counting code (running falls back to the row flag; unread and pending are live client-side state and read as zero offline — read them in the sidebar).

## License

[MIT](LICENSE)
