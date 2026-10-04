/**
 * Structural view of the client services and framework hooks this plugin uses.
 *
 * The bundle is installed with link: and resolves its own imports, so the
 * client half deliberately does not import the official packages for types:
 * every shape below is the part of the real contract this plugin actually
 * touches. That keeps the runtime dependency surface at React plus React's
 * own platform modules.
 *
 * @module dsh-session-watch/client/types
 */

/** Translate one dictionary key, with optional named template params. */
export type Translate = (key: string, params?: Record<string, unknown>) => string

/** Selector hook over an observable snapshot (the framework's standard seat). */
export interface SnapshotSelectorHook {
  /** @param selector - projection over the current snapshot. @returns the selected value. */
  <Selected>(selector: (state: any) => Selected, equal?: (left: Selected, right: Selected) => boolean): Selected
}

/** One plugin entry's live config form, as ctx.configForms.get(id) returns it. */
export interface ConfigFormLike {
  /** @returns the current redacted view of the entry's volatile fields. */
  getSnapshot(): ConfigFormSnapshot
  /** @param listener - change callback. @returns the unsubscribe function. */
  subscribe(listener: () => void): () => void
  /** @param field - volatile field name. @param value - next value. @returns whether the Host accepted the write. */
  set(field: string, value: unknown): Promise<boolean>
}

/** The slice of a config form view this plugin reads. */
export interface ConfigFormSnapshot {
  /** The namespace's resolved value, holding every volatile field. */
  readonly value?: Readonly<Record<string, unknown>> | undefined
  /** Whether the active profile accepts form writes. */
  readonly writable?: boolean | undefined
}

/** The settings service face: per-namespace forms and namespace-gated registration. */
export interface ConfigFormsService {
  /** @param entryId - Host plugin row id, which is also the settings namespace. @returns that entry's form. */
  get(entryId: string): ConfigFormLike
  /**
   * @param namespaces - namespaces this registration follows.
   * @param register - runs once one of them is served; returns its disposer.
   * @returns the disposer ending the watch and any live registration.
   */
  whileServed(namespaces: readonly string[], register: (served: ReadonlySet<string>) => (() => void) | void): () => void
}

/** The locale service face: dictionary registration and namespace binding. */
export interface LocaleService {
  /** @param ns - namespace. @param dicts - simplified-Chinese and English dictionaries. @returns the disposer. */
  register(ns: string, dicts: { readonly zh: Record<string, string>; readonly en: Record<string, string> }): () => void
  /** @param ns - namespace. @returns the bound translate function. */
  bind(ns: string): Translate
}

/** One slot registration: the entry key plus the registrant's private inject face. */
export interface SlotRegistration {
  readonly name: string
  readonly id: string
  readonly order?: number
  /** Display text where the owner projects one (nav rows): re-read on every projection. */
  readonly label?: string | (() => string)
  readonly locale?: string
  readonly inject?: () => Record<string, unknown>
}

/** The slots service face used by this plugin. */
export interface SlotsService {
  /**
   * Wait for one slot declaration, then run the callback for each declaration lifetime.
   * @param key - declared slot key.
   * @param callback - registers the contribution; returns its disposer.
   * @returns idempotent disposer for the wait and the active effect.
   */
  inject(key: string, callback: () => (() => void) | void): () => void
  /** @param options - registration key and inject face. @param component - the React component. @returns the disposer. */
  register(options: SlotRegistration, component: unknown): () => void
}

/** The client root context slice this plugin uses. */
export interface ClientContext {
  /** @param callback - setup returning its disposer. @param label - effect label for tracing. */
  effect(callback: () => (() => void) | void, label?: string): unknown
  readonly slots: SlotsService
  readonly locale: LocaleService
  readonly configForms: ConfigFormsService
  /** @param name - service name. @returns the service or undefined. */
  get(name: string): unknown
}
