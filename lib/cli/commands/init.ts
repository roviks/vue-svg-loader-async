import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import prompts from 'prompts'
import { logger } from '../utils/logger.js'
import { generateTypes } from '../utils/type-generator.js'

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
      name: 'createSvgoConfig',
      message: 'Create default svgo.config.js?',
      initial: true
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

  // Create icons directory
  if (answers.createIconsDir && !existsSync(iconsDir)) {
    mkdirSync(iconsDir, { recursive: true })
    logger.success(`Created icons directory: ${iconsDir}`)
  }

  // Create output directory
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
    logger.success(`Created output directory: ${outputDir}`)
  }

  // Create svgo.config.js
  if (answers.createSvgoConfig) {
    const svgoConfigPath = resolve(process.cwd(), 'svgo.config.js')
    if (!existsSync(svgoConfigPath)) {
      const svgoConfig = `export default {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          cleanupIds: false,
          removeViewBox: false,
          convertColors: {
            currentColor: true
          }
        }
      }
    },
    'removeXMLNS',
    {
      name: 'removeAttrs',
      params: { attrs: ['class', 'data-name', 'data-*'] }
    },
    {
      name: 'addAttributesToSVGElement',
      params: {
        attributes: [
          { 'aria-hidden': 'true' },
          { focusable: 'false' }
        ]
      }
    },
    'convertStyleToAttrs',
    'mergePaths',
    'removeEmptyContainers',
    'sortAttrs'
  ]
}
`
      writeFileSync(svgoConfigPath, svgoConfig, 'utf-8')
      logger.success('Created svgo.config.js')
    } else {
      logger.warning('svgo.config.js already exists, skipping')
    }
  }

  // Generate initial types
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
