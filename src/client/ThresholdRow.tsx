/**
 * The Settings row that edits the warning threshold.
 *
 * Contributed into `settings.general.item` — the additive seat for a single
 * preference that needs no page of its own. The row draws its own label,
 * current value, and write path, because that slot's owner projects none of
 * them.
 *
 * @module dsh-unarchived-watch/client/ThresholdRow
 */
import { useEffect, useState, useSyncExternalStore } from 'react'
import { countUnarchived } from '../count.js'
import type { SnapshotSelectorHook, Translate } from './types.js'
import type { ThresholdSource } from './threshold.js'

/** Composed props of a `settings.general.item` occupant. */
export interface ThresholdRowProps {
  /** Selector hook over the Session list. */
  readonly useSessions: SnapshotSelectorHook
  /** Selector hook over the Workspace registry (the archive set). */
  readonly useWorkspaces: SnapshotSelectorHook
  /** Live threshold owned by this plugin's config namespace. */
  readonly threshold: ThresholdSource
  /** Bound translate function for the `unarchived-watch` namespace. */
  readonly t: Translate
}

/**
 * Render the threshold editor with the current unarchived count beside it.
 * @param props - composed Settings slot props plus this plugin's inject face.
 * @returns the preference row.
 */
export function ThresholdRow({ useSessions, useWorkspaces, threshold, t }: ThresholdRowProps) {
  const current = useSyncExternalStore(threshold.subscribe, threshold.getSnapshot, threshold.getSnapshot)
  const archived = useWorkspaces((state: any) => state.archivedSessionIds)
  const count = useSessions((state: any) => countUnarchived(state, archived))
  const [draft, setDraft] = useState(String(current))
  const [failed, setFailed] = useState(false)

  // The accepted value is the authority: an outside write (profile patch, the
  // plugin card) must reach the input.
  useEffect(() => {
    setDraft(String(current))
    setFailed(false)
  }, [current])

  const commit = (): void => {
    const parsed = Number.parseInt(draft, 10)
    if (!Number.isFinite(parsed) || parsed < 1 || parsed === current) {
      setDraft(String(current))
      setFailed(false)
      return
    }
    void threshold.set(parsed).then((accepted) => {
      setFailed(!accepted)
      if (!accepted) setDraft(String(current))
    })
  }

  return (
    <div className="uw-row">
      <div className="uw-row-text">
        <span className="uw-row-title">{t('row.title')}</span>
        <span className="uw-row-desc">{t('row.description', { count, threshold: current })}</span>
        {failed ? <span className="uw-row-error">{t('row.saveFailed')}</span> : null}
      </div>
      <label className="uw-row-control">
        <span className="uw-sr-only">{t('row.inputLabel')}</span>
        <input
          className="uw-input"
          type="number"
          min={1}
          step={1}
          inputMode="numeric"
          value={draft}
          onChange={(event) => setDraft(event.currentTarget.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key !== 'Enter') return
            event.preventDefault()
            commit()
          }}
        />
      </label>
    </div>
  )
}
