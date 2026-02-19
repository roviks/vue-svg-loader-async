<script setup lang="ts">
import { computed, defineAsyncComponent, type Component } from 'vue'
import { ICON_METADATA } from './icon/generated/types'
import type { IconName } from '@rovik/vue-svg-icons'

export interface IconProps {
  name: IconName
  size?: number | string
  color?: string
  label?: string
  decorative?: boolean
  cssVars?: Record<string, string>
  class?: string
  viewBox?: string
}

const props = withDefaults(defineProps<IconProps>(), {
  size: 24,
  color: 'currentColor',
  decorative: false
})

// Dynamically import the SVG as a Vue component
const IconComponent = computed<Component>(() => {
  return defineAsyncComponent(() =>
    import(/* @vite-ignore */ `../assets/icons/${props.name}.svg?inline`)
  )
})

// Get metadata for the current icon (if available)
const metadata = computed(() => ICON_METADATA?.[props.name] || null)

// Compute styles for the icon wrapper
const iconStyles = computed(() => {
  const styles: Record<string, string> = {
    width: typeof props.size === 'number' ? `${props.size}px` : props.size,
    height: typeof props.size === 'number' ? `${props.size}px` : props.size,
    color: props.color,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: '0'
  }

  // Add CSS variables for multicolor icons
  if (props.cssVars && metadata.value?.hasMultipleColors) {
    Object.entries(props.cssVars).forEach(([key, value]) => {
      styles[`--icon-${key}`] = value
    })
  }

  return styles
})

// Compute accessibility attributes
const ariaAttrs = computed(() => {
  if (props.decorative) {
    return {
      'aria-hidden': true,
      role: 'presentation'
    }
  }

  return {
    role: 'img',
    'aria-label': props.label || props.name
  }
})

// Compute viewBox - use custom viewBox if provided, otherwise use metadata
const computedViewBox = computed(() => {
  if (props.viewBox) {
    return props.viewBox
  }
  return metadata.value?.viewBox || '0 0 24 24'
})
</script>

<template>
  <span
    :class="['icon-wrapper', props.class]"
    :style="iconStyles"
    v-bind="ariaAttrs"
  >
    <Suspense>
      <component
        :is="IconComponent"
        :viewBox="computedViewBox"
        class="icon-svg"
      />
      <template #fallback>
        <span class="icon-loading" />
      </template>
    </Suspense>
  </span>
</template>

<style scoped>
.icon-wrapper {
  position: relative;
}

.icon-svg {
  width: 100%;
  height: 100%;
  fill: currentColor;
}

.icon-loading {
  display: inline-block;
  width: 100%;
  height: 100%;
  background: currentColor;
  opacity: 0.1;
  border-radius: 2px;
}
</style>
