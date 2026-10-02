/**
 * The warning icon beside Settings at the sidebar foot.
 *
 * Rendered only while the unarchived ordinary-Session count is past the
 * threshold. It is a status indicator, not a control: the sidebar slot hands
 * every occupant only the column's own state, so this component asks the
 * framework's standard selector hooks for the two snapshots it needs and keeps
 * no state of its own.
 *
 * @module dsh-unarchived-watch/client/WarningBadge
 */
import { useSyncExternalStore } from 'react'
import { Tooltip } from '@deepseek-ai/dsh-client-ui-primitives'
import { countUnarchived, shouldWarn } from '../count.js'
import { WarningIcon } from './WarningIcon.js'
import type { SnapshotSelectorHook, Translate } from './types.js'
import type { ThresholdSource } from './threshold.js'

/** Composed props of a `sidebar.footer.action` occupant. */
export interface WarningBadgeProps {
  /** Whether the sidebar renders wide content (false = 56px rail). */
  readonly wide: boolean
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
 * Render the warning icon when the count is past the threshold.
 * @param props - composed Settings/sidebar slot props plus this plugin's inject face.
 * @returns the indicator, or null while nothing needs attention.
 */
export function WarningBadge({ useSessions, useWorkspaces, threshold, t }: WarningBadgeProps) {
  // The third argument is React's server/hydration reader; it is the same
  // snapshot function, which keeps this component renderable outside a live
  // shell (the client render test relies on it).
  const limit = useSyncExternalStore(threshold.subscribe, threshold.getSnapshot, threshold.getSnapshot)
  const archived = useWorkspaces((state: any) => state.archivedSessionIds)
  const count = useSessions((state: any) => countUnarchived(state, archived))
  if (!shouldWarn(count, limit)) return null
  const label = t('badge.aria', { count, threshold: limit })
  return (
    // The shell's own tooltip, portaled out of the sidebar's clipping column so
    // the bubble is never cut off at the foot of the rail. Hover and keyboard
    // focus both raise it; the anchor keeps its own accessible name.
    <Tooltip label={label} side="top" delayMs={200} portal>
      <span className="uw-badge" role="status" aria-label={label} data-unarchived-count={count}>
        <WarningIcon />
        <span className="uw-badge-count" aria-hidden="true">
          {count}
        </span>
      </span>
    </Tooltip>
  )
}
