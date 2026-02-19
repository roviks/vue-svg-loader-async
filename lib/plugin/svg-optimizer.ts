import { optimize, type Config as SVGOConfig } from 'svgo'
import {
  analyzeSvg,
  replaceWithCurrentColor,
  replaceWithCssVariables
} from './svg-parser'
import type { OptimizeSvgResult, SvgInlinePluginOptions } from './types'

/**
 * Optimize SVG content using SVGO and apply color strategies
 */
export async function optimizeSvg(
  svgContent: string,
  svgoConfig: SVGOConfig,
  options: Pick<SvgInlinePluginOptions, 'enforceCurrentColor' | 'useCssVariables'> = {}
): Promise<OptimizeSvgResult> {
  const {
    enforceCurrentColor = true,
    useCssVariables = true
  } = options

  // Step 1: Apply SVGO optimization
  const result = optimize(svgContent, svgoConfig)
  let optimizedSvg = result.data

  // Step 2: Analyze colors in optimized SVG
  const metadata = analyzeSvg(optimizedSvg)

  // Step 3: Apply color strategy based on analysis
  if (enforceCurrentColor && metadata.colorCount === 1) {
    // Single color icon: replace with currentColor
    optimizedSvg = replaceWithCurrentColor(optimizedSvg)
  } else if (useCssVariables && metadata.hasMultipleColors) {
    // Multicolor icon: use CSS variables
    optimizedSvg = replaceWithCssVariables(optimizedSvg, metadata.colors)
  }

  return {
    optimized: optimizedSvg,
    metadata
  }
}
