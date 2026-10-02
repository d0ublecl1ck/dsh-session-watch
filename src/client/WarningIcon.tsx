/**
 * Warning triangle. The product icon set ships its own glyphs, but this plugin
 * draws its one icon at the same weight (a 16px current-color outline with a
 * 1px stroke) so the bundle stays free of an icon dependency.
 *
 * @module dsh-unarchived-watch/client/WarningIcon
 */

/**
 * Render the warning triangle.
 * @param props.size - requested square edge in pixels.
 * @returns the icon element (decorative; the surrounding element owns the label).
 */
export function WarningIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M7.13 2.4a1 1 0 0 1 1.74 0l5.34 9.53A1 1 0 0 1 13.34 13.4H2.66a1 1 0 0 1-.87-1.47z" />
      <path d="M8 6.1v3.1" />
      <path d="M8 11.35h.01" />
    </svg>
  )
}
