import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { svgInlinePlugin } from '@rovik/vue-svg-icons/plugin'

export default defineConfig({
  plugins: [
    vue(),
    svgInlinePlugin({
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
