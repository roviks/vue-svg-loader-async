import type { IconName as GeneratedIconName } from './components/icon/generated/types'

declare module '@rovik/vue-svg-icons' {
  interface IconRegistry {
    [K in GeneratedIconName]: true
  }
}
