/**
 * Client half: the sidebar-foot warning icon and the Settings row that edits
 * its threshold.
 *
 * Both surfaces read the same two shell snapshots through the framework's
 * standard selectors — the Session list (`useSessions`) and the Workspace
 * archive set (`useWorkspaces`) — so the count is always the one the sidebar
 * itself would render. The threshold is this plugin's own config namespace,
 * reached through `ctx.configForms`; the Settings row is registered only while
 * the Host actually serves that namespace.
 *
 * @module dsh-unarchived-watch/client
 */
import { en, zh } from './locales.js'
import { injectStyles, removeStyles } from './styles.js'
import { createThresholdSource } from './threshold.js'
import { ThresholdRow } from './ThresholdRow.js'
import { UnarchivedSection } from './UnarchivedSection.js'
import { WarningBadge } from './WarningBadge.js'
import type { ClientContext } from './types.js'

/** Dictionary namespace, config namespace, and both slot entry ids. */
const NS = 'unarchived-watch'

/** Services required before this plugin mounts. */
export const inject = ['slots', 'locale', 'configForms', 'sessions', 'workspaces', 'uiSession', 'uiWorkspace']

/**
 * Mount the browser half.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => {
    const style = injectStyles()
    return () => {
      style.remove()
      removeStyles()
    }
  }, 'unarchived-watch: styles')

  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'unarchived-watch: dictionaries')

  const t = ctx.locale.bind(NS)
  const threshold = createThresholdSource(ctx.configForms.get(NS))
  ctx.effect(() => () => threshold.dispose(), 'unarchived-watch: threshold source')

  // The indicator is unconditional: it simply renders nothing until the count
  // is past the threshold, so the sidebar foot never reflows on a config edit.
  ctx.slots.inject('sidebar.footer.action', () =>
    ctx.slots.register(
      {
        name: 'sidebar.footer.action',
        id: NS,
        order: 920,
        inject: () => ({ threshold, t }),
      },
      WarningBadge,
    ),
  )

  // The preference row follows the Host's own namespace: a deployment that
  // never served it shows no trace of the row.
  ctx.effect(
    () =>
      ctx.configForms.whileServed([NS], () =>
        ctx.slots.inject('settings.general.item', () =>
          ctx.slots.register(
            {
              name: 'settings.general.item',
              id: NS,
              order: 16,
              inject: () => ({ threshold, t }),
            },
            ThresholdRow,
          ),
        ),
      ),
    'unarchived-watch: settings row',
  )

  // The board the icon points at: an ordinary Settings page beside the shipped
  // sections. Same namespace gate as the row, so it appears exactly when the
  // Host actually serves this plugin's config.
  ctx.effect(
    () =>
      ctx.configForms.whileServed([NS], () =>
        ctx.slots.inject('settings.section', () =>
          ctx.slots.register(
            {
              name: 'settings.section',
              id: NS,
              order: 30,
              label: () => t('section.nav'),
              inject: () => ({ threshold, t }),
            },
            UnarchivedSection,
          ),
        ),
      ),
    'unarchived-watch: settings section',
  )
}
