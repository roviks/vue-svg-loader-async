import { existsSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import prompts from 'prompts'
import { logger } from '../utils/logger.js'
import { generateTypes } from '../utils/generate-types.js'

export async function initCommand(): Promise<void> {
  logger.info('\n🎨 Vue SVG Icons - Project Setup\n')

  const answers = await prompts([
    {
      type: 'text',
      name: 'iconsDir',
      message: 'Where are your SVG icons located?',
      initial: './src/assets/icons'
    },
    {
      type: 'text',
      name: 'outputDir',
      message: 'Where should we generate types?',
      initial: './src/components/icon/generated'
    },
    {
      type: 'confirm',
      name: 'createIconsDir',
      message: "Create icons directory if it doesn't exist?",
      initial: true
    }
  ])

  if (!answers.iconsDir) {
    logger.error('Setup cancelled\n')
    process.exit(0)
  }

  const iconsDir = resolve(process.cwd(), answers.iconsDir)
  const outputDir = resolve(process.cwd(), answers.outputDir)

  if (answers.createIconsDir && !existsSync(iconsDir)) {
    mkdirSync(iconsDir, { recursive: true })
    logger.success(`Created icons directory: ${iconsDir}`)
  }

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
    logger.success(`Created output directory: ${outputDir}`)
  }

  try {
    await generateTypes(iconsDir, outputDir)
    logger.success('Setup complete!\n')

    logger.info('Next steps:')
    logger.dim(`  1. Add your SVG icons to: ${answers.iconsDir}`)
    logger.dim(`  2. Import: import { Icon } from '@rovik/vue-svg-icons'`)
    logger.dim(`  3. Use: <Icon name="your-icon" />\n`)
  } catch (error: any) {
    logger.error(`Error generating initial types: ${error.message}`)
    process.exit(1)
  }
}
