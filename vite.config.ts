import { fileURLToPath, URL } from 'node:url'
import { execSync } from 'node:child_process'

import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { svgInlinePlugin } from './src/plugins/vite-plugin-svg-inline'

/**
 * Vite plugin to automatically regenerate icon types when SVG files change
 */
function iconTypeGeneratorPlugin(): Plugin {
  let isGenerating = false

  const generateTypes = () => {
    if (isGenerating) return

    isGenerating = true
    try {
      console.log('\x1b[36m%s\x1b[0m', '🔄 Regenerating icon types...')
      execSync('tsx scripts/generate-icon-metadata.ts', {
        stdio: 'inherit',
        cwd: process.cwd()
      })
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', '❌ Failed to generate icon types:', error)
    } finally {
      isGenerating = false
    }
  }

  return {
    name: 'icon-type-generator',

    // Watch for SVG file changes and regenerate types
    configureServer(server) {
      const iconsPath = '/src/assets/icons/'

      server.watcher.on('add', (file) => {
        if (file.includes(iconsPath) && file.endsWith('.svg')) {
          console.log('\x1b[32m%s\x1b[0m', `✨ New icon detected: ${file.split('/').pop()}`)
          generateTypes()
          // Trigger full reload to update Icon component imports
          server.ws.send({ type: 'full-reload' })
        }
      })

      server.watcher.on('unlink', (file) => {
        if (file.includes(iconsPath) && file.endsWith('.svg')) {
          console.log('\x1b[33m%s\x1b[0m', `🗑️  Icon removed: ${file.split('/').pop()}`)
          generateTypes()
          server.ws.send({ type: 'full-reload' })
        }
      })

      server.watcher.on('change', (file) => {
        if (file.includes(iconsPath) && file.endsWith('.svg')) {
          console.log('\x1b[36m%s\x1b[0m', `📝 Icon modified: ${file.split('/').pop()}`)
          generateTypes()
        }
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    svgInlinePlugin(),
    iconTypeGeneratorPlugin(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Group icons by category for better caching
          if (id.includes('assets/icons/common')) return 'icons-common'
          if (id.includes('assets/icons/currencies')) return 'icons-currencies'
          if (id.includes('assets/icons/flags')) return 'icons-flags'
          if (id.includes('assets/icons/media-and-devices')) return 'icons-media'
          if (id.includes('assets/icons/')) return 'icons-other'
        }
      }
    }
  }
})
