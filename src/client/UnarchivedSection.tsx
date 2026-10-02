/**
 * The `unarchived-watch` Settings page: what is piling up, and where.
 *
 * This is the board the warning icon points at. It reads only the shell's own
 * published snapshots through the standard selector hooks — the same two the
 * badge reads — so the page and the icon can never disagree about the number.
 * It owns no state and writes nothing: archiving stays where the product keeps
 * it, in the sidebar's own row actions.
 *
 * @module dsh-unarchived-watch/client/UnarchivedSection
 */
import { useMemo, useSyncExternalStore } from 'react'
import { collectUnarchived, describeAge, groupUnarchived, shouldWarn } from '../count.js'
import type { SnapshotSelectorHook, Translate } from './types.js'
import type { ThresholdSource } from './threshold.js'

/** Composed props of a `settings.section` occupant. */
export interface UnarchivedSectionProps {
  /** Selector hook over the Session list. */
  readonly useSessions: SnapshotSelectorHook
  /** Selector hook over the Workspace registry (archive set, groups, paths). */
  readonly useWorkspaces: SnapshotSelectorHook
  /** Live threshold owned by this plugin's config namespace. */
  readonly threshold: ThresholdSource
  /** Bound translate function for the `unarchived-watch` namespace. */
  readonly t: Translate
}

/**
 * Render the board: one summary line, the scope rule, then one block per
 * Workspace.
 * @param props - composed Settings slot props plus this plugin's inject face.
 * @returns the settings page body.
 */
export function UnarchivedSection({ useSessions, useWorkspaces, threshold, t }: UnarchivedSectionProps) {
  const limit = useSyncExternalStore(threshold.subscribe, threshold.getSnapshot, threshold.getSnapshot)
  // Both snapshots are selected whole on purpose: they are stable objects per
  // store revision, where a derived array would be a fresh value on every read.
  const sessions = useSessions((state: any) => state)
  const workspaces = useWorkspaces((state: any) => state)
  const rows = useMemo(
    () => collectUnarchived(sessions, workspaces?.archivedSessionIds),
    [sessions, workspaces],
  )
  const groups = useMemo(() => groupUnarchived(rows, workspaces), [rows, workspaces])
  const over = shouldWarn(rows.length, limit)
  const now = Date.now()
  return (
    <div className="uw-section">
      <div className="uw-section-head">
        <span className="uw-section-title">{t('section.title')}</span>
        <span className="uw-section-summary">{t('section.summary', { count: rows.length, threshold: limit })}</span>
        <span className={over ? 'uw-section-state' : 'uw-section-state uw-section-state-under'}>
          {t(over ? 'section.over' : 'section.under')}
        </span>
        <span className="uw-section-rule">{t('section.rule')}</span>
      </div>
      {groups.length === 0 ? <p className="uw-section-empty">{t('section.empty')}</p> : null}
      {groups.map((group) => (
        <section className="uw-group" key={group.key === '' ? '__ungrouped' : group.key}>
          <div className="uw-group-head">
            <span className="uw-group-title">
              {group.label === '' ? t('section.ungrouped') : group.label}
            </span>
            {group.path === undefined ? null : <span className="uw-group-path">{group.path}</span>}
            <span className="uw-group-count">{t('section.count', { count: group.rows.length })}</span>
          </div>
          <ul className="uw-group-list">
            {group.rows.map((row) => {
              const age = describeAge(row.updatedAt, now)
              return (
                <li className="uw-item" key={row.sessionId}>
                  <span className="uw-item-title" title={row.title}>
                    {row.title}
                  </span>
                  {row.running ? <span className="uw-item-running">{t('section.running')}</span> : null}
                  <span className="uw-item-meta">{t('section.age.' + age.unit, { count: age.value })}</span>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
