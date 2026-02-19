import type { Config as SVGOConfig } from 'svgo'

export interface SvgInlinePluginOptions {
  /**
   * SVGO configuration for SVG optimization
   */
  svgoConfig?: SVGOConfig

  /**
   * Whether to enforce currentColor for single-color icons
   * @default true
   */
  enforceCurrentColor?: boolean

  /**
   * Whether to use CSS variables for multicolor icons
   * @default true
   */
  useCssVariables?: boolean
}

export interface SvgMetadata {
  /**
   * ViewBox attribute value
   */
  viewBox: string

  /**
   * Width from viewBox
   */
  width: number

  /**
   * Height from viewBox
   */
  height: number

  /**
   * Unique colors found in the SVG
   */
  colors: string[]

  /**
   * Whether the icon has multiple colors
   */
  hasMultipleColors: boolean

  /**
   * Number of unique colors
   */
  colorCount: number
}

export interface OptimizeSvgResult {
  /**
   * Optimized SVG content
   */
  optimized: string

  /**
   * SVG metadata
   */
  metadata: SvgMetadata
}
