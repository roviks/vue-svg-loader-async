import { readFileSync } from 'node:fs'
import type { Plugin } from 'vite'
import type { Config as SVGOConfig } from 'svgo'
import { optimizeSvg } from './svg-optimizer'
import type { SvgInlinePluginOptions } from './types'

/**
 * Default SVGO config (fallback)
 */
function getDefaultSvgoConfig(): SVGOConfig {
  return {
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            cleanupIds: false,
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
}

/**
 * Vite plugin to inline SVG files as Vue components
 */
export function svgInlinePlugin(options: SvgInlinePluginOptions = {}): Plugin {
  const {
    enforceCurrentColor = true,
    useCssVariables = true
  } = options

  let svgoConfig: SVGOConfig

  return {
    name: 'vite-plugin-svg-inline',

    async configResolved() {
      // Load SVGO config when Vite config is resolved
      // Try to load from consumer's project root
      if (options.svgoConfig) {
        svgoConfig = options.svgoConfig
      } else {
        try {
          // Try to load svgo.config.js from consumer's project root
          const configPath = process.cwd() + '/svgo.config.js'
          const config = await import(configPath)
          svgoConfig = config.default || {}
        } catch {
          // Use default config
          svgoConfig = getDefaultSvgoConfig()
        }
      }
    },

    async transform(_code, id) {
      // Only process files with ?inline query parameter
      if (!id.endsWith('.svg?inline')) {
        return null
      }

      // Get the actual file path (remove query parameter)
      const filePath = id.replace(/\?inline$/, '')

      try {
        // Read SVG file
        const svgContent = readFileSync(filePath, 'utf-8')

        // Optimize SVG and apply color strategies
        const { optimized } = await optimizeSvg(
          svgContent,
          svgoConfig,
          { enforceCurrentColor, useCssVariables }
        )

        // Extract SVG content (remove <svg> wrapper to get inner content)
        const svgMatch = optimized.match(/<svg[^>]*>([\s\S]*)<\/svg>/)
        const innerSvg = svgMatch ? svgMatch[1] : optimized

        // Extract SVG attributes
        const svgTagMatch = optimized.match(/<svg([^>]*)>/)
        const svgAttrs = svgTagMatch ? svgTagMatch[1] : ''

        // Generate icon name from file path
        const iconName = filePath
          .split('/')
          .slice(-2)
          .join('-')
          .replace('.svg', '')
          .replace(/[^a-zA-Z0-9-]/g, '')

        // Generate Vue component as a string template
        const componentCode = `
import { defineComponent, h } from 'vue';

export default defineComponent({
  name: 'Icon${iconName.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')}',
  props: {
    size: {
      type: [Number, String],
      default: '1em'
    },
    color: {
      type: String,
      default: 'currentColor'
    }
  },
  setup(props, { attrs }) {
    return () => h(
      'svg',
      {
        ...attrs,
        ${svgAttrs
          .trim()
          .split(/\s+/)
          .filter(attr => attr && !attr.startsWith('aria-') && !attr.startsWith('focusable'))
          .map(attr => {
            const [key, ...valueParts] = attr.split('=')
            const value = valueParts.join('=').replace(/^["']|["']$/g, '')
            return `'${key}': '${value}'`
          })
          .join(',\n        ')},
        width: typeof props.size === 'number' ? props.size + 'px' : props.size,
        height: typeof props.size === 'number' ? props.size + 'px' : props.size,
        color: props.color,
        'aria-hidden': 'true',
        focusable: 'false'
      },
      { innerHTML: ${JSON.stringify(innerSvg)} }
    );
  }
});
`

        return {
          code: componentCode,
          map: null
        }
      } catch (error) {
        this.error(`Failed to process SVG file: ${filePath}\n${error}`)
        return null
      }
    }
  }
}
