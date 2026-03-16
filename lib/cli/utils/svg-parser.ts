export function extractViewBox(svgContent: string): string {
  const viewBoxMatch = svgContent.match(/viewBox=["']([^"']+)["']/)
  return viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24'
}

export function parseViewBox(viewBox: string): { width: number; height: number } {
  const parts = viewBox.split(/\s+/)
  return {
    width: parseFloat(parts[2] || '24'),
    height: parseFloat(parts[3] || '24')
  }
}

export function extractColors(svgContent: string): string[] {
  const colors = new Set<string>()

  const fillMatches = svgContent.matchAll(/fill=["']([^"']+)["']/g)
  for (const match of fillMatches) {
    const color = match[1]
    if (color && color !== 'none' && color !== 'currentColor') {
      colors.add(color)
    }
  }

  const strokeMatches = svgContent.matchAll(/stroke=["']([^"']+)["']/g)
  for (const match of strokeMatches) {
    const color = match[1]
    if (color && color !== 'none' && color !== 'currentColor') {
      colors.add(color)
    }
  }

  return Array.from(colors)
}
