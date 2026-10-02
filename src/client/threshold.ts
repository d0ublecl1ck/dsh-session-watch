/**
 * The live threshold: one observable over the plugin's own config namespace.
 *
 * The config form belongs to the settings provider; this module only projects
 * it into the two things the badge and the Settings row need — a synchronous
 * `getSnapshot` for `useSyncExternalStore`, and a `set` that publishes the
 * accepted value instead of waiting for the Host round-trip to re-render.
 *
 * @module dsh-unarchived-watch/client/threshold
 */
import { normalizeThreshold } from '../count.js'
import type { ConfigFormLike } from './types.js'

/** Observable threshold handed to the badge and the Settings row. */
export interface ThresholdSource {
  /** @returns the current threshold, never undefined. */
  getSnapshot(): number
  /** @param listener - change callback. @returns the unsubscribe function. */
  subscribe(listener: () => void): () => void
  /** @param value - next threshold. @returns whether the Host accepted the write. */
  set(value: number): Promise<boolean>
  /** Release the config-form subscription (client fiber dispose). */
  dispose(): void
}

/** Read one threshold off the form view, falling back to the default. */
function read(form: ConfigFormLike): number {
  try {
    return normalizeThreshold(form.getSnapshot()?.value?.threshold)
  } catch {
    return normalizeThreshold(undefined)
  }
}

/**
 * Create the live threshold source.
 * @param form - the plugin entry's config form.
 * @returns the observable threshold and its disposer.
 */
export function createThresholdSource(form: ConfigFormLike): ThresholdSource {
  let current = read(form)
  const listeners = new Set<() => void>()

  const publish = (next: number): void => {
    if (next === current) return
    current = next
    for (const listener of [...listeners]) listener()
  }

  const unsubscribe = form.subscribe(() => {
    publish(read(form))
  })

  return {
    getSnapshot: () => current,
    subscribe: (listener) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    set: async (value) => {
      const next = normalizeThreshold(value)
      // Publish first: the badge must react to the click, not to the round-trip.
      publish(next)
      let accepted = false
      try {
        accepted = await form.set('threshold', next)
      } catch {
        accepted = false
      }
      // A refused write leaves the Host's value in force; never keep showing ours.
      if (!accepted) publish(read(form))
      return accepted
    },
    dispose: () => {
      unsubscribe()
      listeners.clear()
    },
  }
}
