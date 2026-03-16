# @rovik/vue-svg-icons

> Type-Safe система SVG-иконок для Vue 3 с автоматической оптимизацией и темизацией

[![npm version](https://img.shields.io/npm/v/@rovik/vue-svg-icons.svg)](https://www.npmjs.com/package/@rovik/vue-svg-icons)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Автодополнение, автоматическая оптимизация через SVGO, CSS-темизация и полная поддержка доступности из коробки.

## ✨ Возможности

- 🔒 **Type-Safe** — полная поддержка TypeScript с автодополнением для всех имён иконок
- ⚡ **Нулевые накладные расходы** — SVG оптимизируются и преобразуются на этапе сборки
- 🎨 **CSS-темизация** — одноцветные иконки используют `currentColor`, многоцветные поддерживают CSS-переменные
- ♿ **Доступность** — встроенные ARIA-атрибуты и семантический HTML
- 🔥 **HMR** — изменения иконок мгновенно отражаются в процессе разработки

## 📦 Установка

```bash
npm install @rovik/vue-svg-icons
```

**Peer-зависимости:**
- Vue 3.5+
- Vite 5.x, 6.x или 7.x

## 🚀 Быстрый старт

### 1. Инициализация

Запустите интерактивный мастер настройки:

```bash
npx vue-svg-icons init
```

Это создаст:
- Директорию для иконок
- Настройку генерации типов
- `svgo.config.js` для оптимизации SVG
- Начальные TypeScript-типы

### 2. Добавьте иконки

Поместите SVG-файлы в директорию иконок (по умолчанию: `./src/assets/icons/`):

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

### 3. Настройте Vite

Добавьте плагин в `vite.config.ts`:

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

### 4. Используйте в компонентах

```vue
<script setup lang="ts">
import { Icon } from '@rovik/vue-svg-icons'
</script>

<template>
  <!-- Типобезопасно с автодополнением! -->
  <Icon name="common/home" />

  <!-- Кастомный размер -->
  <Icon name="social/twitter" :size="32" />

  <!-- Кастомный цвет -->
  <Icon name="arrows/chevron-right" color="#3B82F6" />

  <!-- CSS-единицы -->
  <Icon name="common/user" size="2rem" />

  <!-- Доступность -->
  <Icon name="common/settings" label="Открыть настройки" />
</template>
```

## 📖 Справочник API

### Пропсы компонента Icon

```typescript
interface IconProps {
  // Имя иконки (формат category/name) — типобезопасно с автодополнением
  name: IconName

  // Размер в пикселях или CSS-единицах (по умолчанию: 24)
  size?: number | string

  // Цвет (по умолчанию: 'currentColor')
  color?: string

  // Метка для скринридеров
  label?: string

  // Является ли иконка декоративной (по умолчанию: false)
  decorative?: boolean

  // CSS-переменные для многоцветных иконок
  cssVars?: Record<string, string>

  // Дополнительные CSS-классы
  class?: string

  // Кастомный viewBox (переопределяет значение по умолчанию)
  viewBox?: string
}
```

### Опции Vite-плагина

```typescript
interface SvgInlinePluginOptions {
  // Директория с SVG-иконками
  iconsDir?: string  // по умолчанию: './src/assets/icons'

  // Директория для генерируемых типов
  outputDir?: string  // по умолчанию: './src/components/icon/generated'

  // Кастомная конфигурация SVGO
  svgoConfig?: SVGOConfig

  // Конвертировать одноцветные иконки в currentColor (по умолчанию: true)
  enforceCurrentColor?: boolean

  // Использовать CSS-переменные для многоцветных иконок (по умолчанию: true)
  useCssVariables?: boolean
}
```

### CLI-команды

```bash
# Инициализация проекта (интерактивно)
npx vue-svg-icons init

# Генерация типов из иконок
npx vue-svg-icons generate

# Режим слежения (автоматическая перегенерация при изменениях)
npx vue-svg-icons watch

# Кастомные директории
npx vue-svg-icons generate --icons-dir ./assets/svg --output-dir ./types
```

## 🎨 Темизация

### Одноцветные иконки

Иконки с одним цветом автоматически используют `currentColor`, что упрощает темизацию:

```vue
<template>
  <!-- Наследует цвет текста -->
  <div class="text-blue-500">
    <Icon name="common/home" />
  </div>

  <!-- Явный цвет -->
  <Icon name="common/home" color="#FF0000" />

  <!-- Тёмная тема -->
  <Icon name="common/home" class="text-gray-800 dark:text-gray-200" />
</template>
```

### Многоцветные иконки

Иконки с несколькими цветами используют CSS-переменные с fallback-значениями:

```vue
<script setup lang="ts">
const brandColors = {
  'color-1': '#1DA1F2',  // Синий Twitter
  'color-2': '#FFFFFF'   // Белый
}
</script>

<template>
  <!-- Цвета по умолчанию -->
  <Icon name="social/twitter" :size="48" />

  <!-- Кастомные цвета через пропс -->
  <Icon name="social/twitter" :size="48" :cssVars="brandColors" />

  <!-- Кастомные цвета через CSS -->
  <Icon name="social/twitter" :size="48" class="custom-twitter" />
</template>

<style>
.custom-twitter {
  --icon-color-1: #1DA1F2;
  --icon-color-2: #FFFFFF;
}

.dark .custom-twitter {
  --icon-color-1: #60A5FA;  /* Светло-синий для тёмной темы */
  --icon-color-2: #E5E7EB;
}
</style>
```

## ♿ Доступность

Компонент Icon автоматически управляет доступностью:

```vue
<template>
  <!-- Не декоративная: добавляет role="img" и aria-label -->
  <Icon name="common/home" label="Главная страница" />

  <!-- Декоративная: добавляет aria-hidden="true" и role="presentation" -->
  <Icon name="common/settings" decorative />

  <!-- В кнопке (иконка должна быть декоративной) -->
  <button>
    <Icon name="common/home" decorative />
    <span>Главная</span>
  </button>
</template>
```

## ⚙️ Оптимизация SVG

Библиотека использует SVGO для оптимизации. Настройте через `svgo.config.js`:

```javascript
export default {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          cleanupIds: false,        // Сохранять ID для сложных иконок
          removeViewBox: false,     // Обязательно для адаптивного масштабирования
          convertColors: {
            currentColor: true      // Сохранять currentColor
          }
        }
      }
    },
    // Дополнительные плагины
    'removeXMLNS',
    'convertStyleToAttrs',
    'mergePaths'
  ]
}
```

## 🔥 Hot Module Replacement

Изменения иконок автоматически обнаруживаются в процессе разработки:

```bash
# Запустите dev-сервер
npm run dev

# Добавляйте/изменяйте/удаляйте SVG-файлы в директории иконок
# Типы перегенерируются автоматически ✨
```

## 📚 Примеры

### Адаптивный размер

```vue
<template>
  <!-- Относительно размера шрифта -->
  <p style="font-size: 16px">
    Молниеносная <Icon name="general/zap" size="1em" /> производительность
  </p>

  <!-- CSS-единицы -->
  <Icon name="common/home" size="2rem" />
  <Icon name="common/home" size="10vh" />
</template>
```

### Динамические иконки

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

### Кнопка с иконкой

```vue
<template>
  <button class="btn">
    <Icon name="common/home" decorative />
    <span>Главная</span>
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

## 🏗️ Как это работает

1. **Сборка**: Vite-плагин сканирует директорию иконок и генерирует TypeScript-типы
2. **Трансформация**: SVG-импорты с запросом `?inline` преобразуются в оптимизированные Vue-компоненты
3. **Runtime**: Иконки загружаются лениво по требованию через `defineAsyncComponent` Vue
4. **Типобезопасность**: Сгенерированные типы обеспечивают автодополнение и валидацию на этапе компиляции

## 📄 Лицензия

MIT © Rovik

## 🙏 Благодарности

Создано с использованием:
- [Vue 3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [SVGO](https://github.com/svg/svgo)
- [TypeScript](https://www.typescriptlang.org/)

---

**Сделано с ❤️ для сообщества Vue**
