import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      include: ['lib/**/*.ts', 'lib/**/*.vue'],
      exclude: ['lib/cli/**/*']
    })
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'lib/index.ts'),
        'plugin/index': resolve(__dirname, 'lib/plugin/index.ts'),
        'component/index': resolve(__dirname, 'lib/component/index.ts')
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        const ext = format === 'es' ? 'js' : 'cjs'
        return `${entryName}.${ext}`
      }
    },
    rollupOptions: {
      external: [
        'vue',
        'vite',
        'svgo',
        'fs',
        'path',
        'node:fs',
        'node:path',
        'node:url',
        'node:child_process'
      ],
      output: {
        globals: {
          vue: 'Vue'
        },
        preserveModules: false
      }
    },
    outDir: 'dist',
    emptyOutDir: true
  }
})
