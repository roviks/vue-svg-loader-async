import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, parse } from 'node:path'
import { extractViewBox, parseViewBox, extractColors } from './svg-parser.js'
import type { Logger } from './logger.js'

export interface IconInfo {
  name: string
  category: string
  viewBox: string
  width: number
  height: number
  colors: string[]
  colorCount: number
  hasMultipleColors: boolean
}

export interface CreateIconScannerParams {
  logger: Logger
}

export interface IconScanner {
  scan: (dir: string, baseDir?: string) => IconInfo[]
}

export function createIconScanner({ logger }: CreateIconScannerParams): IconScanner {
  function scan(dir: string, baseDir: string = dir): IconInfo[] {
    const icons: IconInfo[] = []
    const entries = readdirSync(dir)

    for (const entry of entries) {
      const fullPath = join(dir, entry)
      const stat = statSync(fullPath)

      if (stat.isDirectory()) {
        icons.push(...scan(fullPath, baseDir))
      } else if (entry.endsWith('.svg')) {
        try {
          const svgContent = readFileSync(fullPath, 'utf-8')
          const relativePath = relative(baseDir, fullPath)
          const { dir: categoryPath, name: fileName } = parse(relativePath)

          const category = categoryPath || 'default'
          const iconName = categoryPath ? `${categoryPath}/${fileName}` : fileName

          const viewBox = extractViewBox(svgContent)
          const { width, height } = parseViewBox(viewBox)
          const colors = extractColors(svgContent)
          const colorCount = colors.length
          const hasMultipleColors = colorCount > 1

          icons.push({
            name: iconName,
            category,
            viewBox,
            width,
            height,
            colors,
            colorCount,
            hasMultipleColors
          })
        } catch (error) {
          logger.warning(`Failed to process ${fullPath}: ${error}`)
        }
      }
    }

    return icons
  }

  return { scan }
}
