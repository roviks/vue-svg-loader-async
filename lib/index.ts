// Main library entry point

// Re-export component
export { default as Icon } from './component/Icon.vue'
export type { IconProps, IconName, IconRegistry } from './component/types'

// Re-export plugin (users can also import from '@yourscope/vue-svg-icons/plugin')
export { svgInlinePlugin } from './plugin/index'
export type { SvgInlinePluginOptions } from './plugin/types'
