export interface SvgInlinePluginOptions {
  iconsDir?: string
  
  outputDir?: string

  /**
   * Options passed through to vite-svg-loader.
   * @see https://github.com/jpkleemans/vite-svg-loader#options
   */
  svgLoaderOptions?: Record<string, unknown>
}
