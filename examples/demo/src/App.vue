<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '../../../dist'

const isDark = ref(false)
const selectedSize = ref(24)
const selectedColor = ref('#3B82F6')

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark')
}
</script>

<template>
  <div :class="{ dark: isDark }" class="app-container">
    <div class="demo-wrapper">
      <header class="demo-header">
        <h1>
          <Icon name="common/home" :size="32" decorative />
          Vue SVG Icons Demo
        </h1>
        <button @click="toggleTheme" class="theme-toggle">
          <Icon :name="isDark ? 'common/sun' : 'common/moon'" decorative />
          {{ isDark ? 'Light' : 'Dark' }} Mode
        </button>
      </header>

      <main class="demo-content">
        <section class="demo-section">
          <h2>Basic Usage</h2>
          <div class="icon-grid">
            <div class="icon-card">
              <Icon name="common/sun" />
              <span>Home</span>
            </div>
            <div class="icon-card">
              <Icon name="common/user" />
              <span>User</span>
            </div>
            <div class="icon-card">
              <Icon name="common/settings" />
              <span>Settings</span>
            </div>
            <div class="icon-card">
              <Icon name="common/user" />
              <span>User</span>
            </div>
          </div>
        </section>

        <section class="demo-section">
          <h2>Size Control</h2>
          <div class="controls">
            <label>
              Size: {{ selectedSize }}px
              <input
                type="range"
                v-model.number="selectedSize"
                min="16"
                max="128"
                step="8"
              />
            </label>
          </div>
          <div class="icon-display">
            <Icon name="common/home" :size="selectedSize" />
          </div>
        </section>

        <section class="demo-section">
          <h2>Color Control</h2>
          <div class="controls">
            <label>
              Color:
              <input type="color" v-model="selectedColor" />
              {{ selectedColor }}
            </label>
          </div>
          <div class="icon-display">
            <Icon name="common/home" :size="48" :color="selectedColor" />
          </div>
        </section>

        <section class="demo-section">
          <h2>CSS Units</h2>
          <div class="icon-grid">
            <div class="icon-card">
              <Icon name="common/home" size="1em" />
              <span>1em</span>
            </div>
            <div class="icon-card">
              <Icon name="common/home" size="2rem" />
              <span>2rem</span>
            </div>
            <div class="icon-card">
              <Icon name="common/home" size="48px" />
              <span>48px</span>
            </div>
          </div>
        </section>

        <section class="demo-section">
          <h2>currentColor Theming</h2>
          <div class="themed-boxes">
            <div class="themed-box blue">
              <Icon name="common/home" :size="32" />
              <span>Blue Theme</span>
            </div>
            <div class="themed-box green">
              <Icon name="common/home" :size="32" />
              <span>Green Theme</span>
            </div>
            <div class="themed-box purple">
              <Icon name="common/home" :size="32" />
              <span>Purple Theme</span>
            </div>
          </div>
        </section>

        <section class="demo-section">
          <h2>Accessibility</h2>
          <div class="accessibility-examples">
            <div class="example">
              <h3>Semantic Icon (with label)</h3>
              <Icon name="common/home" label="Go to home page" :size="32" />
              <code>label="Go to home page"</code>
            </div>
            <div class="example">
              <h3>Decorative Icon (in button)</h3>
              <button class="demo-button">
                <Icon name="common/home" decorative />
                <span>Home</span>
              </button>
              <code>decorative</code>
            </div>
          </div>
        </section>

        <section class="demo-section instructions">
          <h2>Add Your Own Icons</h2>
          <ol>
            <li>Add SVG files to <code>src/assets/icons/</code></li>
            <li>Organize in subdirectories (e.g., <code>common/</code>, <code>social/</code>)</li>
            <li>Types will auto-generate on save</li>
            <li>Use with full autocomplete: <code>&lt;Icon name="category/icon" /&gt;</code></li>
          </ol>
        </section>
      </main>

      <footer class="demo-footer">
        <p>
          Built with
          <a href="https://github.com/anthropics/rovik/vue-svg-icons" target="_blank">
            @rovik/vue-svg-icons
          </a>
        </p>
      </footer>
    </div>
  </div>
</template>

<style scoped>


.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  padding: 2rem;
  transition: all 0.3s ease;
}

.demo-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  background: var(--color-bg);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.demo-header {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: var(--color-text-primary);
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.demo-header h1 {
  margin: 0;
  font-size: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.theme-toggle {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: var(--color-text-primary);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  transition: background 0.2s;
}

.theme-toggle:hover {
  background: rgba(255, 255, 255, 0.3);
}

.demo-content {
  padding: 2rem;
}

.demo-section {
  margin-bottom: 3rem;
}

.demo-section h2 {
  color: var(--color-primary);
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
}

.icon-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem;
  color: var(--color-text-primary);
  background: var(--color-card-bg);
  border-radius: 8px;
  justify-content: center;
  border: 2px solid var(--color-card-border);
  transition: all 0.2s;
}

.icon-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

.icon-card span {
  font-size: 0.875rem;
  color: #64748b;
}

.controls {
  margin-bottom: 1.5rem;
}

.controls label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-weight: 500;
}

.controls input[type="range"] {
  width: 100%;
  max-width: 400px;
}

.controls input[type="color"] {
  width: 60px;
  height: 40px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.icon-display {
  display: flex;
  justify-content: center;
  padding: 2rem;
  background: var(--color-card-bg);
  color: var(--color-text-primary);
  border-radius: 8px;
}

.themed-boxes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.themed-box {
  padding: 2rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  font-weight: 500;
}

.themed-box.blue {
  background: #dbeafe;
  color: #1e40af;
}

.themed-box.green {
  background: #dcfce7;
  color: #166534;
}

.themed-box.purple {
  background: #f3e8ff;
  color: #6b21a8;
}

.accessibility-examples {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.example {
  padding: 1.5rem;
  background: var(--color-card-bg);
  border-radius: 8px;
  color: var(--color-text-primary);
  border-left: 4px solid var(--color-primary);
}

.example h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1rem;
  color: var(--color-text-primary);
}

.example code {
  display: block;
  margin-top: 1rem;
  padding: 0.5rem;
  background: var(--color-card-bg);
  border-radius: 4px;
  color: var(--color-text-primary);
  font-size: 0.875rem;
}
.demo-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--color-primary);
  color: var(--color-text-primary);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
}

.demo-button:hover {
  background: #5568d3;
}

.instructions {
  background: #fef3c7;
  padding: 2rem;
  border-radius: 8px;
  border-left: 4px solid #f59e0b;
}

.instructions h2 {
  color: #92400e;
  margin-top: 0;
}

.instructions ol {
  margin: 0;
  padding-left: 1.5rem;
}

.instructions li {
  margin-bottom: 0.5rem;
  color: #78350f;
}

.instructions code {
  background: #fed7aa;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.demo-footer {
  background: var(--color-card-bg);
  padding: 1.5rem;
  text-align: center;
  color: var(--color-text-primary);
}

.demo-footer a {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
}


.demo-footer a:hover {
  text-decoration: underline;
}
</style>
