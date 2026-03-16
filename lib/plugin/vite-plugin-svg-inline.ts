import { existsSync } from 'node:fs'
import { resolve, join } from 'node:path'

const VIRTUAL_MODULE_ID = 'virtual:vue-svg-icons/generated'
const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID
import type { Plugin, ViteDevServer } from 'vite'
import svgLoader from 'vite-svg-loader'
import type { SvgInlinePluginOptions } from './types.js'
import { generateTypes } from '../cli/utils/generate-types.js'

export function svgInlinePlugin(options: SvgInlinePluginOptions = {}): Plugin[] {
  let resolvedIconsDir: string | null = null
  let resolvedOutputDir: string | null = null
  let isGenerating = false

  async function runGenerateTypes(server?: ViteDevServer) {
    if (!resolvedIconsDir || !resolvedOutputDir || isGenerating) return
    if (!existsSync(resolvedIconsDir)) return

    isGenerating = true
    try {
      const count = await generateTypes(resolvedIconsDir, resolvedOutputDir)
      console.log(`\x1b[36m[vue-svg-icons]\x1b[0m Generated types for ${count} icons`)
      server?.ws.send({ type: 'full-reload' })
    } catch (e) {
      console.error('\x1b[31m[vue-svg-icons]\x1b[0m Failed to generate types:', e)
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
  return import(\`${resolvedIconsDir}/\${name}.svg\`)
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
      if (options.iconsDir) {
        resolvedIconsDir = resolve(config.root, options.iconsDir)
        resolvedOutputDir = resolve(
          config.root,
          options.outputDir ?? './src/components/icon/generated'
        )
      }
    },

    async buildStart() {
      await runGenerateTypes()
    },

    configureServer(server) {
      runGenerateTypes(server)

      if (!resolvedIconsDir) return

      server.watcher.on('add', (file) => {
        if (file.startsWith(resolvedIconsDir!) && file.endsWith('.svg')) {
          console.log(`\x1b[32m[vue-svg-icons]\x1b[0m New icon: ${file.split('/').pop()}`)
          runGenerateTypes(server)
        }
      })
      server.watcher.on('unlink', (file) => {
        if (file.startsWith(resolvedIconsDir!) && file.endsWith('.svg')) {
          console.log(`\x1b[33m[vue-svg-icons]\x1b[0m Removed: ${file.split('/').pop()}`)
          runGenerateTypes(server)
        }
      })
      server.watcher.on('change', (file) => {
        if (file.startsWith(resolvedIconsDir!) && file.endsWith('.svg')) {
          runGenerateTypes(server)
        }
      })
    }
  }

  return [svgLoader(options.svgLoaderOptions), customPlugin]
}
