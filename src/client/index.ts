/**
 * Client half: the sidebar-foot Session Watch readout and the Settings row that
 * chooses what it shows.
 *
 * Both surfaces read the same three shell snapshots through the framework's
 * standard selectors — the Session list (useSessions), the unified Session UI
 * status (useSessionStatus), and the Workspace archive set (useWorkspaces) — so
 * every number is the one the sidebar itself would render. The preference is
 * this plugin's own config namespace, reached through ctx.configForms; the
 * Settings row is registered only while the Host actually serves that
 * namespace.
 *
 * @module dsh-session-watch/client
 */
import { PLUGIN_ID } from '../config.js'
import { en, zh } from './locales.js'
import { injectStyles, removeStyles } from './styles.js'
import { createConfigSource } from './config-source.js'
import { SettingsRow } from './SettingsRow.js'
import { StatusWatch } from './StatusWatch.js'
import type { ClientContext } from './types.js'

/** Services required before this plugin mounts. */
export const inject = ['slots', 'locale', 'configForms', 'sessions', 'uiSession', 'workspaces', 'uiWorkspace']

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
  }, 'session-watch: styles')

  ctx.effect(() => ctx.locale.register(PLUGIN_ID, { zh, en }), 'session-watch: dictionaries')

  const t = ctx.locale.bind(PLUGIN_ID)
  const config = createConfigSource(ctx.configForms.get(PLUGIN_ID))
  ctx.effect(() => () => config.dispose(), 'session-watch: config source')

  // The readout is unconditional: it renders nothing only when every metric is
  // hidden, so the sidebar foot never reflows on a config edit.
  ctx.slots.inject('sidebar.footer.action', () =>
    ctx.slots.register(
      {
        name: 'sidebar.footer.action',
        id: PLUGIN_ID,
        order: 920,
        inject: () => ({ config, t }),
      },
      StatusWatch,
    ),
  )

  // The preference row follows the Host's own namespace: a deployment that
  // never served it shows no trace of the row.
  ctx.effect(
    () =>
      ctx.configForms.whileServed([PLUGIN_ID], () =>
        ctx.slots.inject('settings.general.item', () =>
          ctx.slots.register(
            {
              name: 'settings.general.item',
              id: PLUGIN_ID,
              order: 16,
              inject: () => ({ config, t }),
            },
            SettingsRow,
          ),
        ),
      ),
    'session-watch: settings row',
  )
}
