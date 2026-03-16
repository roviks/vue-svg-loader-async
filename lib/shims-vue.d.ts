declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, object>
  export default component
}

declare module 'virtual:vue-svg-icons/generated' {
  export type { IconCategory, IconName, IconMetadata } from './component/generated/types'
  export const ICON_METADATA: Record<string, import('./component/generated/types').IconMetadata>
  export const ICON_NAMES: readonly string[]
  export const ICON_CATEGORIES: Record<string, readonly string[]>
  export function importIcon(name: string): Promise<{ default: import('vue').Component }>
}
