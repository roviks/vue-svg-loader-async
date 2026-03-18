import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { createIconScanner } from './icon-scanner.js'
import type { Logger } from './logger.js'

export interface CreateTypeGeneratorParams {
  logger: Logger
}

export interface TypeGenerator {
  generate: (iconsDir: string, outputDir: string) => Promise<number>
}

export function createTypeGenerator({ logger }: CreateTypeGeneratorParams): TypeGenerator {
  const scanner = createIconScanner({ logger })

  async function generate(iconsDir: string, outputDir: string): Promise<number> {
    const icons = scanner.scan(iconsDir)
    const sortedIcons = icons.sort((a, b) => a.name.localeCompare(b.name))
    const categories = Array.from(new Set(icons.map(icon => icon.category))).sort()

    const iconNames = sortedIcons.map(icon => `  | '${icon.name}'`).join('\n')
    const iconCategories = categories.map(cat => `  | '${cat}'`).join('\n')

    const iconMetadataEntries = sortedIcons.map(icon => {
      return `  '${icon.name}': {
    name: '${icon.name}',
    category: '${icon.category}',
    viewBox: '${icon.viewBox}',
    width: ${icon.width},
    height: ${icon.height},
    hasMultipleColors: ${icon.hasMultipleColors},
    colorCount: ${icon.colorCount}
  }`
    }).join(',\n')

    const iconNamesArray = sortedIcons.map(icon => `  '${icon.name}'`).join(',\n')

    const iconCategoriesEntries = categories.map(category => {
      const categoryIcons = sortedIcons
        .filter(icon => icon.category === category)
        .map(icon => `'${icon.name}'`)
        .join(', ')
      return `  '${category}': [${categoryIcons}]`
    }).join(',\n')

    const fileContent = `/**
 * THIS IS A GENERATED FILE. DO NOT EDIT!
 *
 * Total icons: ${sortedIcons.length}
 * Total categories: ${categories.length}
 */

export type IconCategory =
${iconCategories};

export type IconName =
${iconNames};

export interface IconMetadata {
  name: IconName;
  category: IconCategory;
  viewBox: string;
  width: number;
  height: number;
  hasMultipleColors: boolean;
  colorCount: number;
}

export const ICON_METADATA: Record<IconName, IconMetadata> = {
${iconMetadataEntries}
};

export const ICON_NAMES = [
${iconNamesArray}
] as const;

export const ICON_CATEGORIES: Record<IconCategory, readonly IconName[]> = {
${iconCategoriesEntries}
};
`

    const registryKeys = sortedIcons.map(icon => `    '${icon.name}': true`).join('\n')

    const declarationContent = `/**
 * THIS IS A GENERATED FILE. DO NOT EDIT!
 *
 */

export {}

declare module '@rovik/vue-svg-icons' {
  interface IconRegistry {
${registryKeys}
  }
}
`

    mkdirSync(outputDir, { recursive: true })
    writeFileSync(join(outputDir, 'types.ts'), fileContent, 'utf-8')
    writeFileSync(join(outputDir, 'icon-registry.d.ts'), declarationContent, 'utf-8')

    return sortedIcons.length
  }

  return { generate }
}
