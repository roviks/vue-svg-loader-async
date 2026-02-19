# @rovik/vue-svg-icons

> Type-safe SVG icon system for Vue 3 with automatic optimization and theming

[![npm version](https://img.shields.io/npm/v/@rovik/vue-svg-icons.svg)](https://www.npmjs.com/package/@rovik/vue-svg-icons)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Transform your SVG icons into a type-safe, optimized icon system for Vue 3. Get autocomplete, automatic optimization with SVGO, CSS theming, and full accessibility support out of the box.

## ✨ Features

- 🔒 **Type-Safe** - Full TypeScript support with autocomplete for all your icon names
- ⚡ **Zero Runtime Overhead** - SVGs optimized and transformed at build time
- 🎨 **CSS Theming** - Single-color icons use `currentColor`, multicolor icons support CSS variables
- ♿ **Accessible** - Proper ARIA attributes and semantic HTML built-in
- 🔥 **Hot Module Replacement** - Icon changes reflected instantly during development
- 📦 **Tree-Shakeable** - Only bundle the icons you actually use
- 🎯 **Cache-Busting** - Automatic content hashing for optimal caching

## 📦 Installation

```bash
npm install @rovik/vue-svg-icons
```

**Peer Dependencies:**
- Vue 3.5+
- Vite 5.x, 6.x, or 7.x

## 🚀 Quick Start

### 1. Initialize

Run the interactive setup wizard:

```bash
npx vue-svg-icons init
```

This will:
- Create your icons directory
- Set up type generation
- Create `svgo.config.js` for SVG optimization
- Generate initial TypeScript types

### 2. Add Icons

Add your SVG files to the icons directory (default: `./src/assets/icons/`):

```bash
./src/assets/icons/
├── common/
│   ├── home.svg
│   ├── user.svg
│   └── settings.svg
├── social/
│   ├── twitter.svg
│   └── github.svg
└── arrows/
    └── chevron-right.svg
```

### 3. Configure Vite

Add the plugin to your `vite.config.ts`:

```typescript
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
  ]
})
```

### 4. Use in Components

```vue
<script setup lang="ts">
import { Icon } from '@rovik/vue-svg-icons'
</script>

<template>
  <!-- Type-safe with autocomplete! -->
  <Icon name="common/home" />

  <!-- Custom size -->
  <Icon name="social/twitter" :size="32" />

  <!-- Custom color -->
  <Icon name="arrows/chevron-right" color="#3B82F6" />

  <!-- CSS units -->
  <Icon name="common/user" size="2rem" />

  <!-- Accessible -->
  <Icon name="common/settings" label="Open settings" />
</template>
```

## 📖 API Reference

### Icon Component Props

```typescript
interface IconProps {
  // Icon name (category/name format) - Type-safe with autocomplete
  name: IconName

  // Size in pixels or CSS unit (default: 24)
  size?: number | string

  // Color (default: 'currentColor')
  color?: string

  // Accessible label (for screen readers)
  label?: string

  // Whether icon is purely decorative (default: false)
  decorative?: boolean

  // CSS variables for multicolor icons
  cssVars?: Record<string, string>

  // Additional CSS classes
  class?: string

  // Custom viewBox (overrides default)
  viewBox?: string
}
```

### Vite Plugin Options

```typescript
interface SvgInlinePluginOptions {
  // Directory containing your SVG icons
  iconsDir?: string  // default: './src/assets/icons'

  // Output directory for generated types
  outputDir?: string  // default: './src/components/icon/generated'

  // Custom SVGO configuration
  svgoConfig?: SVGOConfig

  // Convert single-color icons to currentColor (default: true)
  enforceCurrentColor?: boolean

  // Use CSS variables for multicolor icons (default: true)
  useCssVariables?: boolean
}
```

### CLI Commands

```bash
# Initialize project (interactive)
npx vue-svg-icons init

# Generate types from icons
npx vue-svg-icons generate

# Watch mode (auto-regenerate on changes)
npx vue-svg-icons watch

# Custom directories
npx vue-svg-icons generate --icons-dir ./assets/svg --output-dir ./types
```

## 🎨 Theming

### Single-Color Icons

Icons with one color automatically use `currentColor`, making them easy to theme:

```vue
<template>
  <!-- Inherits text color -->
  <div class="text-blue-500">
    <Icon name="common/home" />
  </div>

  <!-- Explicit color -->
  <Icon name="common/home" color="#FF0000" />

  <!-- Dark mode -->
  <Icon name="common/home" class="text-gray-800 dark:text-gray-200" />
</template>
```

### Multicolor Icons

Icons with multiple colors use CSS variables with fallbacks:

```vue
<script setup lang="ts">
const brandColors = {
  'color-1': '#1DA1F2',  // Twitter blue
  'color-2': '#FFFFFF'   // White
}
</script>

<template>
  <!-- Default colors -->
  <Icon name="social/twitter" :size="48" />

  <!-- Custom colors via prop -->
  <Icon name="social/twitter" :size="48" :cssVars="brandColors" />

  <!-- Custom colors via CSS -->
  <Icon name="social/twitter" :size="48" class="custom-twitter" />
</template>

<style>
.custom-twitter {
  --icon-color-1: #1DA1F2;
  --icon-color-2: #FFFFFF;
}

.dark .custom-twitter {
  --icon-color-1: #60A5FA;  /* Lighter blue for dark mode */
  --icon-color-2: #E5E7EB;
}
</style>
```

## ♿ Accessibility

The Icon component handles accessibility automatically:

```vue
<template>
  <!-- Non-decorative: includes role="img" and aria-label -->
  <Icon name="common/home" label="Home page" />

  <!-- Decorative: includes aria-hidden="true" and role="presentation" -->
  <Icon name="common/settings" decorative />

  <!-- In a button (icon should be decorative) -->
  <button>
    <Icon name="common/home" decorative />
    <span>Home</span>
  </button>
</template>
```

## ⚙️ SVG Optimization

The library uses SVGO for optimization. Customize by creating `svgo.config.js`:

```javascript
export default {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          cleanupIds: false,        // Keep IDs for complex icons
          removeViewBox: false,     // Required for responsive scaling
          convertColors: {
            currentColor: true      // Preserve currentColor
          }
        }
      }
    },
    // Add custom plugins
    'removeXMLNS',
    'convertStyleToAttrs',
    'mergePaths'
  ]
}
```

## 🔥 Hot Module Replacement

Icon changes are automatically detected during development:

```bash
# Start dev server
npm run dev

# Add/modify/delete SVG files in your icons directory
# Types regenerate automatically ✨
```

## 📚 Examples

### Responsive Sizing

```vue
<template>
  <!-- Relative to font size -->
  <p style="font-size: 16px">
    Lightning fast <Icon name="general/zap" size="1em" /> performance
  </p>

  <!-- CSS units -->
  <Icon name="common/home" size="2rem" />
  <Icon name="common/home" size="10vh" />
</template>
```

### Dynamic Icons

```vue
<script setup lang="ts">
import type { IconName } from '@rovik/vue-svg-icons'

const status = ref<'success' | 'error' | 'warning'>('success')

const statusIcon = computed<IconName>(() => {
  const icons: Record<typeof status.value, IconName> = {
    success: 'notification/success',
    error: 'notification/error',
    warning: 'notification/warning'
  }
  return icons[status.value]
})
</script>

<template>
  <Icon :name="statusIcon" />
</template>
```

### Button with Icon

```vue
<template>
  <button class="btn">
    <Icon name="common/home" decorative />
    <span>Home</span>
  </button>
</template>

<style scoped>
.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
```

## 🏗️ How It Works

1. **Build Time**: The Vite plugin scans your icons directory and generates TypeScript types
2. **Transform**: SVG imports with `?inline` query are transformed into optimized Vue components
3. **Runtime**: Icons are lazy-loaded on demand using Vue's `defineAsyncComponent`
4. **Type Safety**: Generated types provide autocomplete and compile-time validation

## 📄 License

MIT © Rovik

## 🙏 Credits

Built with:
- [Vue 3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [SVGO](https://github.com/svg/svgo)
- [TypeScript](https://www.typescriptlang.org/)

---

**Made with ❤️ for the Vue community**
