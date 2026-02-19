<script setup lang="ts">
import { computed, defineAsyncComponent, type Component } from 'vue'
import { ICON_METADATA } from './generated/types'
import type { IconProps } from './types'

const props = withDefaults(defineProps<IconProps>(), {
  size: 24,
  color: 'currentColor',
  decorative: false
})

// Dynamically import the SVG as a Vue component
// Path will be resolved by consumer's project
const IconComponent = computed<Component>(() => {
  return defineAsyncComponent(() =>
    import(/* @vite-ignore */ `./assets/icons/${props.name}.svg?inline`)
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
    'aria-label': props.label || `${props.name} icon`
  }
})
</script>

<template>
  <span
    class="icon-wrapper"
    :class="props.class"
    :style="iconStyles"
    v-bind="ariaAttrs"
  >
    <component
      :is="IconComponent"
      :viewBox="props.viewBox || metadata?.viewBox"
      preserveAspectRatio="xMidYMid meet"
    />
  </span>
</template>

<style scoped>
.icon-wrapper {
  line-height: 1;
}

.icon-wrapper :deep(svg) {
  width: 100%;
  height: 100%;
}
</style>
