import type { Config as SvgoConfig } from 'svgo'

export interface SvgLoaderOptions {
  svgoConfig?: SvgoConfig
  svgo?: boolean
  defaultImport?: 'url' | 'raw' | 'component'
}

export interface CreateSvgPluginParams {
  /**
   * Directory containing SVG icon files.
   */
  iconsDir?: string

  /**
   * Output directory for generated TypeScript types.
   */
  outputDir?: string

  /**
   * Options passed through to vite-svg-loader.
   * @see https://github.com/jpkleemans/vite-svg-loader#options
   */
  svgLoaderOptions?: SvgLoaderOptions
}
