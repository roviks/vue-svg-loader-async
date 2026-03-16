import { resolve } from 'node:path'
import { existsSync } from 'node:fs'
import { logger } from '../utils/logger.js'
import { generateTypes } from '../utils/generate-types.js'

interface GenerateOptions {
  iconsDir?: string
  outputDir?: string
}

export async function generateCommand(options: GenerateOptions): Promise<void> {
  const iconsDir = resolve(process.cwd(), options.iconsDir || './src/assets/icons')
  const outputDir = resolve(process.cwd(), options.outputDir || './src/components/icon/generated')

  logger.info('\n🔄 Generating icon types...\n')

  if (!existsSync(iconsDir)) {
    logger.error(`Icons directory not found: ${iconsDir}`)
    logger.dim(`  Run 'npx vue-svg-icons init' to set up\n`)
    process.exit(1)
  }

  try {
    const iconCount = await generateTypes(iconsDir, outputDir)

    if (iconCount === 0) {
      logger.warning(`No SVG icons found in ${iconsDir}`)
      logger.dim(`  Add some .svg files and run this command again\n`)
    } else {
      logger.success(`Generated types for ${iconCount} icons`)
      logger.dim(`  Output: ${outputDir}/types.ts\n`)
    }
  } catch (error: any) {
    logger.error(`Failed to generate types: ${error.message}`)
    process.exit(1)
  }
}
