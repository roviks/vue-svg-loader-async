export interface IconRegistry {}

export type IconName = keyof IconRegistry extends never
  ? string
  : keyof IconRegistry

export interface IconProps {
  name: IconName

  size?: number | string

  color?: string

  label?: string

  /**
   * Whether the icon is purely decorative (no semantic meaning)
   * If true, adds aria-hidden="true" and role="presentation"
   * If false, adds role="img" and aria-label
   * @default false
   */
  decorative?: boolean

  /**
   * Custom CSS variables for multicolor icons
   * Keys map to --icon-{key} CSS variables
   * Example: { 'color-1': '#FF0000', 'color-2': '#00FF00' }
   */
  cssVars?: Record<string, string>

  class?: string

  viewBox?: string
}
