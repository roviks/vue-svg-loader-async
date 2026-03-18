import { existsSync } from 'node:fs'
import { resolve, join } from 'node:path'
import type { Plugin, ViteDevServer } from 'vite'
import svgLoader from 'vite-svg-loader'
import type { CreateSvgPluginParams } from './types.js'
import { createTypeGenerator } from '../cli/utils/generate-types.js'
import type { Logger } from '../cli/utils/logger.js'

function createPluginLogger(): Logger {
  return {
    success: (msg) => console.log(msg),
    error: (msg) => console.error(msg),
    warning: (msg) => console.warn(msg),
    info: (msg) => console.log(msg),
    dim: (msg) => console.log(msg)
  }
}

const VIRTUAL_MODULE_ID = 'virtual:vue-svg-icons/generated'
const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID
const DEBOUNCE_DELAY_MS = 200

function debounce<T extends (...args: Parameters<T>) => void>(fn: T, delay: number): T {
  let timer: ReturnType<typeof setTimeout> | undefined
  return ((...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }) as T
}

export function createSvgPlugin(params: CreateSvgPluginParams = {}): Plugin[] {
  const logger = createPluginLogger()
  const generator = createTypeGenerator({ logger })

  let resolvedIconsDir: string | null = null
  let resolvedOutputDir: string | null = null
  let isGenerating = false

  async function runGenerateTypes(server?: ViteDevServer) {
    if (!resolvedIconsDir || !resolvedOutputDir || isGenerating) return
    if (!existsSync(resolvedIconsDir)) return

    isGenerating = true
    try {
      const count = await generator.generate(resolvedIconsDir, resolvedOutputDir)
      logger.info(`[vue-svg-icons] Generated types for ${count} icons`)
      server?.ws.send({ type: 'full-reload' })
    } catch (e) {
      logger.error(`[vue-svg-icons] Failed to generate types: ${e}`)
    } finally {
      isGenerating = false
    }
  }

  const customPlugin: Plugin = {
    name: 'vite-plugin-svg-inline',
    enforce: 'pre',

    config() {
      return {
        optimizeDeps: {
          exclude: ['@rovik/vue-svg-icons']
        }
      }
    },

    resolveId(source, importer) {
      if (source === VIRTUAL_MODULE_ID) {
        return RESOLVED_VIRTUAL_MODULE_ID
      }

      if (!resolvedIconsDir) return

      const queryIdx = source.indexOf('?')
      const sourcePath = queryIdx >= 0 ? source.slice(0, queryIdx) : source
      const query = queryIdx >= 0 ? source.slice(queryIdx) : ''

      if (
        importer?.includes('vue-svg-icons') &&
        sourcePath.startsWith('./assets/icons/') &&
        sourcePath.endsWith('.svg')
      ) {
        const iconName = sourcePath
          .replace('./assets/icons/', '')
          .replace('.svg', '')
        return resolve(resolvedIconsDir, `${iconName}.svg`) + query
      }

      if (
        sourcePath.includes('vue-svg-icons') &&
        sourcePath.includes('/assets/icons/') &&
        sourcePath.endsWith('.svg')
      ) {
        const idx = sourcePath.indexOf('/assets/icons/')
        const iconRelative = sourcePath.slice(idx + '/assets/icons/'.length)
        return resolve(resolvedIconsDir, iconRelative) + query
      }
    },

    load(id) {
      if (id !== RESOLVED_VIRTUAL_MODULE_ID) return

      const importIconFn = resolvedIconsDir
        ? `export function importIcon(name) {
  return import(/* @vite-ignore */ \`${resolvedIconsDir}/\${name}.svg\`)
}`
        : `export function importIcon(name) {
  return Promise.reject(new Error('[vue-svg-icons] No iconsDir configured'))
}`

      if (resolvedOutputDir) {
        const generatedFile = join(resolvedOutputDir, 'types.ts')
        return `export * from ${JSON.stringify(generatedFile)}\n${importIconFn}`
      }

      return `export const ICON_METADATA = {}\nexport const ICON_NAMES = []\nexport const ICON_CATEGORIES = {}\n${importIconFn}`
    },

    async configResolved(config) {
      if (params.iconsDir) {
        resolvedIconsDir = resolve(config.root, params.iconsDir)
        resolvedOutputDir = resolve(
          config.root,
          params.outputDir ?? './src/components/icon/generated'
        )
      }
    },

    async buildStart() {
      await runGenerateTypes()
    },

    configureServer(server) {
      runGenerateTypes(server)

      if (!resolvedIconsDir) return

      const debouncedRegenerate = debounce(() => runGenerateTypes(server), DEBOUNCE_DELAY_MS)

      server.watcher.on('add', (file) => {
        if (file.startsWith(resolvedIconsDir!) && file.endsWith('.svg')) {
          logger.success(`[vue-svg-icons] New icon: ${file.split('/').pop()}`)
          debouncedRegenerate()
        }
      })
      server.watcher.on('unlink', (file) => {
        if (file.startsWith(resolvedIconsDir!) && file.endsWith('.svg')) {
          logger.warning(`[vue-svg-icons] Removed: ${file.split('/').pop()}`)
          debouncedRegenerate()
        }
      })
      server.watcher.on('change', (file) => {
        if (file.startsWith(resolvedIconsDir!) && file.endsWith('.svg')) {
          debouncedRegenerate()
        }
      })
    }
  }

  return [svgLoader(params.svgLoaderOptions), customPlugin]
}
