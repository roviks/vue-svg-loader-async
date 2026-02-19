import type { SvgMetadata } from './types'

/**
 * Extract viewBox dimensions from SVG content
 */
export function extractViewBox(svgContent: string): string {
  const viewBoxMatch = svgContent.match(/viewBox=["']([^"']+)["']/)
  return viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24'
}

/**
 * Parse viewBox string to get width and height
 */
export function parseViewBox(viewBox: string): { width: number; height: number } {
  const parts = viewBox.split(/\s+/)
  return {
    width: parseFloat(parts[2] || '24'),
    height: parseFloat(parts[3] || '24')
  }
}

/**
 * Extract unique colors from SVG content (fill and stroke attributes)
 */
export function extractColors(svgContent: string): string[] {
  const colors = new Set<string>()

  // Match fill attributes
  const fillMatches = svgContent.matchAll(/fill=["']([^"']+)["']/g)
  for (const match of fillMatches) {
    const color = match[1]
    if (color && color !== 'none' && color !== 'currentColor') {
      colors.add(color)
    }
  }

  // Match stroke attributes
  const strokeMatches = svgContent.matchAll(/stroke=["']([^"']+)["']/g)
  for (const match of strokeMatches) {
    const color = match[1]
    if (color && color !== 'none' && color !== 'currentColor') {
      colors.add(color)
    }
  }

  return Array.from(colors)
}

/**
 * Replace fixed colors with currentColor for single-color icons
 */
export function replaceWithCurrentColor(svgContent: string): string {
  let result = svgContent

  // Replace fill colors (except none)
  result = result.replace(/fill=["'](?!none|currentColor)[^"']*["']/g, 'fill="currentColor"')

  // Replace stroke colors (except none)
  result = result.replace(/stroke=["'](?!none|currentColor)[^"']*["']/g, 'stroke="currentColor"')

  return result
}

/**
 * Replace colors with CSS variables for multicolor icons
 */
export function replaceWithCssVariables(svgContent: string, colors: string[]): string {
  let result = svgContent

  colors.forEach((color, index) => {
    const varName = `var(--icon-color-${index + 1}, ${color})`
    // Escape special regex characters in color
    const escapedColor = color.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

    // Replace fill
    result = result.replace(
      new RegExp(`fill=["']${escapedColor}["']`, 'g'),
      `fill="${varName}"`
    )

    // Replace stroke
    result = result.replace(
      new RegExp(`stroke=["']${escapedColor}["']`, 'g'),
      `stroke="${varName}"`
    )
  })

  return result
}

/**
 * Analyze SVG and extract metadata
 */
export function analyzeSvg(svgContent: string): SvgMetadata {
  const viewBox = extractViewBox(svgContent)
  const { width, height } = parseViewBox(viewBox)
  const colors = extractColors(svgContent)
  const colorCount = colors.length
  const hasMultipleColors = colorCount > 1

  return {
    viewBox,
    width,
    height,
    colors,
    colorCount,
    hasMultipleColors
  }
}
