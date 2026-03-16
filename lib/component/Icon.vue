<script setup lang="ts">
import type { IconProps } from './icon.types'
import { useIcon } from './useIcon';

const props = withDefaults(defineProps<IconProps>(), {
  size: 24,
  color: 'currentColor',
  decorative: false
})

const {
  IconComponent, 
  ariaAttrs, 
  iconStyles, 
  metadata
} = useIcon(props);
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
