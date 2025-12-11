# SamaPlanner - Design System Vue 3

**Design System complet pour Vue 3 + Nuxt 3 + TailwindCSS**

Basé sur l'identité visuelle extraite du prototype React.

---

## 🎨 1. Tokens de Couleur

### Couleurs Principales

```javascript
// tailwind.config.js
colors: {
  primary: {
    DEFAULT: '#6C3EF1',    // Violet Profond - Buttons, accents
    dark: '#5829D6',       // Hover states
    darker: '#4F26CD',     // Active states
    light: '#8B5CF6',      // Light variants
  },
  secondary: {
    DEFAULT: '#0D0F33',    // Bleu Nuit - Backgrounds, dark mode
    light: '#1A1D4D',      // Lighter variant
    dark: '#0A0C26',       // Darker variant
  },
  success: {
    DEFAULT: '#4ADE80',    // Vert Validation
    dark: '#3BC670',
  },
}
```

### Palette Grays

```javascript
gray: {
  50: '#F9FAFB',   // Lightest backgrounds
  100: '#F1F1F5',  // Light backgrounds
  200: '#E5E7EB',  // Borders
  300: '#D1D5DB',  // Disabled states
  400: '#9CA3AF',  // Placeholders
  500: '#6B7280',  // Secondary text
  600: '#4B5563',  // Muted text
  700: '#374151',  // Dark mode borders
  800: '#1F2937',  // Dark backgrounds
  900: '#111827',  // Darkest
}
```

### Couleurs Fonctionnelles

```javascript
priority: {
  high: '#EF4444',     // Red
  medium: '#F59E0B',   // Orange
  low: '#6C3EF1',      // Primary purple
  completed: '#4ADE80' // Green
}
```

---

## 🌈 2. Gradients

### Gradients Principaux

```css
/* Primary Gradient */
.bg-gradient-primary {
  background: linear-gradient(to bottom right, #6C3EF1, #4F26CD);
}

/* Secondary Gradient */
.bg-gradient-secondary {
  background: linear-gradient(to bottom right, #0D0F33, #1A1D4D);
}

/* Button Gradient */
.bg-gradient-button {
  background: linear-gradient(135deg, #6C3EF1 0%, #5829D6 100%);
}

/* Card Gradient */
.bg-gradient-card {
  background: linear-gradient(135deg, rgba(108, 62, 241, 0.1) 0%, rgba(13, 15, 51, 0.1) 100%);
}
```

---

## 📐 3. Espacements (Spacing)

### Scale de 4px

```javascript
spacing: {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
}
```

---

## ⚪ 4. Border Radius

```javascript
borderRadius: {
  'none': '0',
  'sm': '0.5rem',    // 8px
  'DEFAULT': '0.75rem', // 12px
  'md': '1rem',      // 16px
  'lg': '1.25rem',   // 20px
  'xl': '1.5rem',    // 24px
  '2xl': '2rem',     // 32px
  '3xl': '2.5rem',   // 40px
  'full': '9999px',
}
```

---

## 🌑 5. Ombres (Shadows)

```javascript
boxShadow: {
  'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  'purple': '0 10px 15px -3px rgba(108, 62, 241, 0.3), 0 4px 6px -2px rgba(108, 62, 241, 0.2)',
  'purple-lg': '0 20px 25px -5px rgba(108, 62, 241, 0.4), 0 10px 10px -5px rgba(108, 62, 241, 0.3)',
}
```

---

## 🧊 6. Glassmorphism

```css
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.glass-dark {
  background: rgba(31, 41, 55, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

---

## ✒️ 7. Typographie

### Famille de Police

```javascript
fontFamily: {
  sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
  mono: ['Menlo', 'Monaco', 'Courier New', 'monospace'],
}
```

### Tailles & Poids

```javascript
fontSize: {
  'xs': ['0.75rem', { lineHeight: '1rem' }],      // 12px
  'sm': ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
  'base': ['1rem', { lineHeight: '1.5rem' }],     // 16px
  'lg': ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
  'xl': ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
  '2xl': ['1.5rem', { lineHeight: '2rem' }],      // 24px
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
  '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
  '5xl': ['3rem', { lineHeight: '1' }],           // 48px
}

fontWeight: {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
}
```

---

## ✨ 8. Animations

### Transitions de Base

```javascript
transitionProperty: {
  'all': 'all',
  'colors': 'background-color, border-color, color, fill, stroke',
  'opacity': 'opacity',
  'transform': 'transform',
}

transitionDuration: {
  '75': '75ms',
  '100': '100ms',
  '150': '150ms',
  '200': '200ms',
  '300': '300ms',
  '500': '500ms',
  '700': '700ms',
  '1000': '1000ms',
}

transitionTimingFunction: {
  'DEFAULT': 'cubic-bezier(0.4, 0, 0.2, 1)',
  'in': 'cubic-bezier(0.4, 0, 1, 1)',
  'out': 'cubic-bezier(0, 0, 0.2, 1)',
  'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
}
```

### Animations Personnalisées

```javascript
keyframes: {
  'fade-in': {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
  'slide-up': {
    '0%': { transform: 'translateY(20px)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' },
  },
  'slide-down': {
    '0%': { transform: 'translateY(-20px)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' },
  },
  'scale-in': {
    '0%': { transform: 'scale(0.9)', opacity: '0' },
    '100%': { transform: 'scale(1)', opacity: '1' },
  },
  'pulse-slow': {
    '0%, 100%': { opacity: '1' },
    '50%': { opacity: '0.5' },
  },
}

animation: {
  'fade-in': 'fade-in 0.3s ease-out',
  'slide-up': 'slide-up 0.3s ease-out',
  'slide-down': 'slide-down 0.3s ease-out',
  'scale-in': 'scale-in 0.2s ease-out',
  'pulse-slow': 'pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
}
```

---

## 🎯 9. États Interactifs

### Hover States

```css
.hover-lift {
  transition: transform 0.2s ease;
}
.hover-lift:hover {
  transform: translateY(-2px);
}

.hover-scale {
  transition: transform 0.2s ease;
}
.hover-scale:hover {
  transform: scale(1.05);
}
```

### Active States

```css
.active-scale:active {
  transform: scale(0.95);
}
```

### Focus States

```css
.focus-ring {
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.focus-ring:focus {
  outline: 2px solid #6C3EF1;
  outline-offset: 2px;
}
```

---

## 📱 10. Mobile-First Breakpoints

```javascript
screens: {
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1536px',
}
```

### Safe Areas (iOS)

```css
.safe-top {
  padding-top: env(safe-area-inset-top);
}
.safe-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
.safe-left {
  padding-left: env(safe-area-inset-left);
}
.safe-right {
  padding-right: env(safe-area-inset-right);
}
```

---

## 🎨 11. Composants Patterns

### Button Styles

```vue
<!-- Primary Button -->
<button class="px-6 py-4 bg-gradient-to-r from-primary to-primary-dark rounded-2xl text-white font-medium shadow-purple transition-all hover:scale-105 active:scale-95">
  Button Text
</button>

<!-- Secondary Button -->
<button class="px-6 py-4 bg-secondary rounded-2xl text-white font-medium shadow-lg transition-all hover:bg-secondary-light active:scale-95">
  Button Text
</button>

<!-- Outline Button -->
<button class="px-6 py-4 border-2 border-primary rounded-2xl text-primary font-medium bg-transparent transition-all hover:bg-primary/5 active:scale-95">
  Button Text
</button>
```

### Card Styles

```vue
<!-- Default Card -->
<div class="p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-md border border-gray-100 dark:border-gray-700">
  Card Content
</div>

<!-- Glass Card -->
<div class="p-6 glass rounded-3xl shadow-xl">
  Card Content
</div>

<!-- Elevated Card -->
<div class="p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700">
  Card Content
</div>
```

### Input Styles

```vue
<input 
  type="text"
  class="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors outline-none"
  placeholder="Placeholder text"
/>
```

---

## 🌙 12. Dark Mode

### Classes Dark Mode

```vue
<!-- Light/Dark variants -->
<div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  Content
</div>

<!-- Border variants -->
<div class="border border-gray-200 dark:border-gray-700">
  Content
</div>
```

### Toggle Dark Mode

Utiliser `@vueuse/core` :

```typescript
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
```

---

## ✅ 13. Checklist d'Implémentation

- [x] Couleurs définies dans tailwind.config.js
- [x] Gradients configurés
- [x] Border radius étendus
- [x] Shadows personnalisées
- [x] Animations définies
- [x] Typographie configurée
- [x] Glassmorphism styles
- [x] Mobile-first breakpoints
- [x] Safe areas iOS
- [x] Dark mode support
- [x] États interactifs (hover, active, focus)

---

**Ce Design System garantit la cohérence visuelle sur toute l'application SamaPlanner.**

