# Design System SamaPlanner

**Basé sur le prototype React fourni**

---

## 🎨 Identité Visuelle

### Philosophie
- **Modern Minimalist** avec touches de **Glassmorphism**
- **Mobile-First** : Design optimisé pour mobile
- **Couleurs vibrantes** : Violet profond (#6C3EF1) et Bleu nuit (#0D0F33)
- **Animations fluides** : Transitions douces et naturelles
- **Arrondis généreux** : Interface douce et accueillante

---

## 🎨 Palette de Couleurs

### Couleurs Principales

```javascript
PRIMARY: {
  main: '#6C3EF1',      // Violet Profond
  dark: '#5829D6',      // Violet Foncé (hover)
  darker: '#4F26CD',   // Violet Très Foncé
  light: '#6C3EF1/10',  // Violet Clair (backgrounds)
  gradient: 'from-[#6C3EF1] to-[#4F26CD]' // Gradient violet
}

SECONDARY: {
  main: '#0D0F33',      // Bleu Nuit
  light: '#1A1D4D',     // Bleu Nuit Clair (hover)
  dark: '#0A0C26'       // Bleu Nuit Très Foncé
}

SUCCESS: {
  main: '#4ADE80',      // Vert Validation
  dark: '#3BC670',      // Vert Foncé (hover)
  light: '#4ADE80/10'   // Vert Clair (backgrounds)
}

NEUTRAL: {
  white: '#FFFFFF',
  gray50: '#F1F1F5',
  gray100: '#F9FAFB',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827'
}

TEXT: {
  main: '#1F2937',      // Texte principal
  light: '#9CA3AF',     // Texte secondaire
  white: '#FFFFFF'      // Texte sur fond sombre
}

PRIORITY: {
  high: '#EF4444',       // Rouge (urgent)
  medium: '#F59E0B',     // Orange (moyen)
  low: '#6C3EF1',        // Violet (normal)
  completed: '#4ADE80'  // Vert (complété)
}
```

### Gradients

```javascript
GRADIENTS: {
  primary: 'bg-gradient-to-br from-[#6C3EF1] to-[#4F26CD]',
  primaryHorizontal: 'bg-gradient-to-r from-[#6C3EF1] to-[#4F26CD]',
  dark: 'bg-gradient-to-br from-[#6C3EF1] to-[#0D0F33]',
  glass: 'bg-white/10 backdrop-blur-md',
  glassDark: 'bg-gray-800/90 backdrop-blur-lg'
}
```

---

## 📐 Espacements (Spacing)

```javascript
SPACING: {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem'     // 64px
}
```

**Utilisation Tailwind :** `p-4`, `p-6`, `p-8`, `gap-4`, `gap-6`, etc.

---

## 🔲 Arrondis (Border Radius)

```javascript
RADIUS: {
  sm: '0.5rem',     // rounded-lg (8px)
  md: '1rem',       // rounded-xl (16px)
  lg: '1.25rem',    // rounded-2xl (20px)
  xl: '1.5rem',     // rounded-3xl (24px)
  full: '9999px'    // rounded-full
}
```

**Utilisation :**
- Boutons : `rounded-2xl`
- Cards : `rounded-3xl`
- Inputs : `rounded-2xl`
- Avatars : `rounded-full`
- Petits éléments : `rounded-xl`

---

## 🌑 Ombres (Shadows)

```javascript
SHADOWS: {
  sm: 'shadow-sm',           // Ombres légères
  md: 'shadow-md',           // Ombres moyennes
  lg: 'shadow-lg',           // Ombres importantes
  xl: 'shadow-xl',           // Ombres très importantes
  '2xl': 'shadow-2xl',       // Ombres énormes
  colored: 'shadow-[#6C3EF1]/30',  // Ombres colorées violet
  coloredLg: 'shadow-lg shadow-purple-500/40', // Ombres colorées grandes
  inner: 'shadow-inner'      // Ombres internes
}
```

**Ombres spéciales :**
- Bouton primaire : `shadow-lg shadow-purple-500/20`
- FAB (Floating Action Button) : `shadow-lg shadow-purple-500/40`
- Cards : `shadow-sm` ou `shadow-lg`
- Glassmorphism : `shadow-2xl`

---

## ✨ Glassmorphism

```javascript
GLASS: {
  light: 'bg-white/10 backdrop-blur-md border border-white/20',
  medium: 'bg-white/20 backdrop-blur-lg border border-white/30',
  dark: 'bg-gray-800/90 backdrop-blur-lg border border-white/20',
  colored: 'bg-[#6C3EF1]/10 backdrop-blur-md border border-[#6C3EF1]/20'
}
```

**Utilisation :**
- Bottom Navigation : `bg-white/90 backdrop-blur-lg`
- Modals : `bg-white/95 backdrop-blur-xl`
- Overlays : `bg-black/50 backdrop-blur-sm`

---

## 📝 Typographie

### Famille de Police
- **Font Family** : `font-sans` (system-ui, -apple-system, sans-serif)
- **Font Weight** :
  - Normal : `font-normal` (400)
  - Medium : `font-medium` (500)
  - Bold : `font-bold` (700)

### Tailles

```javascript
TEXT_SIZES: {
  xs: 'text-xs',      // 12px
  sm: 'text-sm',      // 14px
  base: 'text-base',  // 16px
  lg: 'text-lg',      // 18px
  xl: 'text-xl',      // 20px
  '2xl': 'text-2xl',  // 24px
  '3xl': 'text-3xl',  // 30px
  '4xl': 'text-4xl',  // 36px
  '5xl': 'text-5xl'   // 48px
}
```

### Hiérarchie

- **H1** : `text-3xl font-bold` (30px, bold)
- **H2** : `text-2xl font-bold` (24px, bold)
- **H3** : `text-xl font-bold` (20px, bold)
- **Body** : `text-base` (16px, normal)
- **Small** : `text-sm text-gray-500` (14px, gris)
- **Caption** : `text-xs text-gray-400` (12px, gris clair)

---

## 🎭 Animations

### Transitions

```javascript
TRANSITIONS: {
  base: 'transition-all duration-300',
  fast: 'transition-all duration-150',
  slow: 'transition-all duration-500',
  colors: 'transition-colors duration-300',
  transform: 'transition-transform duration-300'
}
```

### Animations CSS

```javascript
ANIMATIONS: {
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  ping: 'animate-ping',
  bounce: 'animate-bounce',
  fadeIn: 'animate-fade-in',      // Custom
  slideUp: 'animate-slide-up',    // Custom
  scaleIn: 'animate-scale-in'     // Custom
}
```

### Interactions

- **Hover** : `hover:scale-105`, `hover:bg-[#5829D6]`
- **Active** : `active:scale-95`
- **Focus** : `focus:outline-none focus:ring-2 focus:ring-[#6C3EF1]`

---

## 🎯 Composants Clés

### Zones Tactiles (Mobile-First)

```javascript
TOUCH_TARGETS: {
  minimum: 'min-h-[44px] min-w-[44px]',  // Apple HIG
  recommended: 'min-h-[48px] min-w-[48px]', // Material Design
  button: 'px-6 py-4',                    // Boutons standards
  icon: 'w-10 h-10',                      // Icônes tactiles
  fab: 'w-14 h-14'                        // Floating Action Button
}
```

### États Visuels

```javascript
STATES: {
  default: 'opacity-100',
  hover: 'hover:opacity-90',
  active: 'active:opacity-75',
  disabled: 'opacity-50 cursor-not-allowed',
  loading: 'opacity-60 pointer-events-none'
}
```

---

## 📱 Breakpoints (Mobile-First)

```javascript
BREAKPOINTS: {
  mobile: '< 640px',      // Par défaut (mobile-first)
  tablet: '640px - 1024px',
  desktop: '> 1024px'
}
```

**Utilisation Tailwind :**
- Mobile : Pas de préfixe (par défaut)
- Tablet : `md:` (640px+)
- Desktop : `lg:` (1024px+)

---

## 🎨 Variantes de Composants

### Button Variants

1. **Primary** : `bg-[#6C3EF1] text-white hover:bg-[#5829D6]`
2. **Secondary** : `bg-[#0D0F33] text-white hover:bg-[#1A1D4D]`
3. **Success** : `bg-[#4ADE80] text-[#0D0F33] hover:bg-[#3BC670]`
4. **Outline** : `border-2 border-[#6C3EF1] text-[#6C3EF1] bg-transparent`
5. **Ghost** : `bg-transparent text-gray-500 hover:bg-gray-100`
6. **Glass** : `bg-white/10 backdrop-blur-md border border-white/20`

### Card Variants

1. **Default** : `bg-white rounded-3xl shadow-sm border border-gray-100`
2. **Elevated** : `bg-white rounded-3xl shadow-lg`
3. **Glass** : `bg-white/10 backdrop-blur-md rounded-3xl border border-white/20`
4. **Colored** : `bg-[#6C3EF1] text-white rounded-3xl shadow-lg`

### Input Variants

1. **Default** : `bg-gray-50 border border-gray-200 rounded-2xl`
2. **Focused** : `focus:border-[#6C3EF1] focus:ring-2 focus:ring-[#6C3EF1]/20`
3. **Error** : `border-red-400 bg-red-50`
4. **Success** : `border-[#4ADE80] bg-green-50`

---

## 🎬 Patterns d'Animation

### Loading States

```javascript
LOADING: {
  spinner: 'animate-spin border-4 border-[#6C3EF1]/20 border-t-[#6C3EF1]',
  pulse: 'animate-pulse bg-gray-200',
  skeleton: 'animate-pulse bg-gray-100 rounded'
}
```

### Micro-interactions

- **Tap** : `active:scale-95`
- **Hover** : `hover:scale-105`
- **Swipe** : Transitions CSS avec `transform: translateX()`
- **Pull to Refresh** : Animation de rotation + translation

---

## 📐 Layout Patterns

### Container

```javascript
CONTAINER: {
  mobile: 'w-full px-6',
  tablet: 'md:px-8',
  desktop: 'lg:max-w-6xl lg:mx-auto'
}
```

### Grid

```javascript
GRID: {
  '2cols': 'grid grid-cols-2 gap-4',
  '3cols': 'grid grid-cols-3 gap-4',
  '7cols': 'grid grid-cols-7 gap-2'  // Pour calendrier
}
```

### Flex

```javascript
FLEX: {
  center: 'flex items-center justify-center',
  between: 'flex items-center justify-between',
  start: 'flex items-start',
  column: 'flex flex-col'
}
```

---

## 🎨 Effets Visuels Spéciaux

### Blur Effects

```javascript
BLUR: {
  sm: 'blur-sm',
  md: 'blur-md',
  lg: 'blur-lg',
  xl: 'blur-xl',
  '2xl': 'blur-2xl',
  '3xl': 'blur-3xl'
}
```

### Gradients Backgrounds

```javascript
BACKGROUNDS: {
  primary: 'bg-gradient-to-br from-[#6C3EF1] to-[#4F26CD]',
  dark: 'bg-gradient-to-br from-[#6C3EF1] to-[#0D0F33]',
  light: 'bg-gradient-to-br from-white to-gray-50',
  overlay: 'bg-black/50 backdrop-blur-sm'
}
```

### Decorative Elements

- **Orbs** : `w-64 h-64 bg-[#6C3EF1] rounded-full blur-[100px] opacity-20`
- **Waves** : `w-[500px] h-[500px] bg-[#6C3EF1]/5 rounded-full blur-3xl`
- **Rings** : `border border-[#6C3EF1]/20 rounded-full animate-spin`

---

## 🎯 Tokens Tailwind à Configurer

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6C3EF1',
          dark: '#5829D6',
          darker: '#4F26CD',
          light: '#6C3EF1',
        },
        secondary: {
          DEFAULT: '#0D0F33',
          light: '#1A1D4D',
          dark: '#0A0C26',
        },
        success: {
          DEFAULT: '#4ADE80',
          dark: '#3BC670',
        },
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'colored': '0 10px 15px -3px rgba(108, 62, 241, 0.3)',
        'colored-lg': '0 20px 25px -5px rgba(108, 62, 241, 0.4)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
}
```

---

## 📱 Mobile-First Guidelines

### Safe Areas (iOS)

```javascript
SAFE_AREAS: {
  top: 'pt-safe-top',      // Pour notch
  bottom: 'pb-safe-bottom', // Pour home indicator
  left: 'pl-safe-left',
  right: 'pr-safe-right'
}
```

### Touch Gestures

- **Swipe Right** : Valider (tâche complétée)
- **Swipe Left** : Supprimer/Reporter
- **Long Press** : Menu contextuel
- **Pull Down** : Refresh
- **Tap** : Action principale

---

## 🎨 Dark Mode Support

```javascript
DARK_MODE: {
  background: 'dark:bg-[#0D0F33]',
  text: 'dark:text-white',
  card: 'dark:bg-gray-800',
  border: 'dark:border-gray-700',
  input: 'dark:bg-gray-800 dark:border-gray-700'
}
```

---

**Ce Design System doit être utilisé de manière cohérente sur TOUS les écrans de SamaPlanner.**
