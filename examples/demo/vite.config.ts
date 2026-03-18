import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgPlugin } from '@rovik/vue-svg-icons/plugin'

export default defineConfig({
  plugins: [
    vue(),
    createSvgPlugin({
      iconsDir: './src/assets/icons',
      outputDir: './src/components/icon/generated'
    })
  ],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
