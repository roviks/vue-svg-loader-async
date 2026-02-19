/**
 * Extend this interface in your project to enable full type-safe icon names
 * with autocomplete in <Icon name="..." />.
 *
 * Create a file in your project (e.g. src/icon.d.ts):
 *
 * @example
 * import type { IconName as GeneratedIconName } from './components/icon/generated/types'
 *
 * declare module '@rovik/vue-svg-icons' {
 *   interface IconRegistry {
 *     [K in GeneratedIconName]: true
 *   }
 * }
 */
export interface IconRegistry {}

/**
 * Resolved icon name type.
 * Falls back to `string` when IconRegistry is not augmented.
 * Becomes a union of your icon names once you augment IconRegistry.
 */
export type IconName = keyof IconRegistry extends never
  ? string
  : keyof IconRegistry

/**
 * Props for the Icon component
 */
export interface IconProps {
  /**
   * Icon name with category prefix (e.g., 'common/home', 'social/twitter').
   * Type-safe with autocomplete once you augment IconRegistry.
   */
  name: IconName

  /**
   * Icon size (width and height)
   * Can be a number (pixels) or a CSS string (e.g., '2rem', '100%')
   * @default 24
   */
  size?: number | string

  /**
   * Icon color
   * For single-color icons, this will be applied directly
   * For multicolor icons, use cssVars prop for more control
   * @default 'currentColor'
   */
  color?: string

  /**
   * Accessible label for the icon
   * Used as aria-label when the icon is not decorative
   */
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

  /**
   * Additional CSS classes to apply to the icon wrapper
   */
  class?: string

  /**
   * Custom viewBox value (overrides the default from metadata)
   */
  viewBox?: string
}
