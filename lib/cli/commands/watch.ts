import { resolve } from 'node:path'
import chokidar from 'chokidar'
import { logger } from '../utils/logger.js'
import { generateCommand } from './generate.js'

interface WatchOptions {
  iconsDir?: string
  outputDir?: string
}

export async function watchCommand(options: WatchOptions): Promise<void> {
  const iconsDir = resolve(process.cwd(), options.iconsDir || './src/assets/icons')

  logger.info(`\n👀 Watching for changes in ${iconsDir}...\n`)

  // Generate initial types
  await generateCommand(options)

  // Watch for changes
  const watcher = chokidar.watch('**/*.svg', {
    cwd: iconsDir,
    persistent: true,
    ignoreInitial: true
  })

  let generating = false

  const regenerate = async () => {
    if (generating) return
    generating = true

    try {
      await generateCommand(options)
    } finally {
      generating = false
    }
  }

  watcher
    .on('add', (path) => {
      logger.success(`New icon: ${path}`)
      regenerate()
    })
    .on('unlink', (path) => {
      logger.warning(`Removed: ${path}`)
      regenerate()
    })
    .on('change', (path) => {
      logger.info(`Modified: ${path}`)
      regenerate()
    })

  logger.dim('Press Ctrl+C to stop watching\n')
}
