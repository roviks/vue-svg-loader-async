import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      tsconfigPath: 'tsconfig.node.json',
      include: ['lib/**/*.ts', 'lib/**/*.vue'],
      exclude: ['lib/cli/bin/**/*', 'lib/cli/commands/**/*', 'lib/cli/templates/**/*', 'lib/cli/utils/logger.ts']
    })
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'lib/index.ts'),
        'plugin/index': resolve(__dirname, 'lib/plugin/index.ts'),
        'component/index': resolve(__dirname, 'lib/component/index.ts'),
        'component/types': resolve(__dirname, 'lib/component/types.ts')
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'js' : 'cjs'}`
    },
    rollupOptions: {
      external: [
        'vue',
        'vite',
        'vite-svg-loader',
        'fs',
        'path',
        'node:fs',
        'node:path',
        'node:url',
        'node:child_process',
        'virtual:vue-svg-icons/generated'
      ],
      output: {
        globals: {
          vue: 'Vue'
        },
        preserveModules: true,
        preserveModulesRoot: 'lib'
      }
    },
    outDir: 'dist',
    emptyOutDir: true
  }
})
