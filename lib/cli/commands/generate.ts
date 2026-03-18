import { resolve } from 'node:path'
import { existsSync } from 'node:fs'
import { createLogger } from '../utils/logger.js'
import { createTypeGenerator } from '../utils/generate-types.js'

export interface GenerateCommandParams {
  iconsDir?: string
  outputDir?: string
}

export function createGenerateCommand() {
  const logger = createLogger()
  const generator = createTypeGenerator({ logger })

  return async function generateCommand(params: GenerateCommandParams): Promise<void> {
    const iconsDir = resolve(process.cwd(), params.iconsDir || './src/assets/icons')
    const outputDir = resolve(process.cwd(), params.outputDir || './src/components/icon/generated')

    logger.info('Generating icon types...')

    if (!existsSync(iconsDir)) {
      logger.error(`Icons directory not found: ${iconsDir}`)
      logger.dim(`  Run 'npx vue-svg-icons init' to set up\n`)
      process.exit(1)
    }

    try {
      const iconCount = await generator.generate(iconsDir, outputDir)

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
}
