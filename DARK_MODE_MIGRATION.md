# Migration Dark Mode - Guide Complet

**Tous les composants et pages utilisent maintenant le composable `useDarkMode` pour une gestion cohérente.**

---

## ✅ Composable Global Créé

### `/composables/useDarkMode.ts`

```typescript
import { useDark, useToggle } from '@vueuse/core'

export const useDarkMode = () => {
  const isDark = useDark({
    selector: 'html',
    attribute: 'class',
    valueDark: 'dark',
    valueLight: '',
    storageKey: 'samaplanner-theme',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  })

  const toggleDark = useToggle(isDark)

  return {
    isDark,
    toggleDark,
  }
}
```

---

## ✅ Fichiers Migrés

### Layouts
- ✅ `layouts/default.vue` - Utilise `useDarkMode()`

### Pages
- ✅ `pages/profile.vue` - Utilise `useDarkMode()` avec toggle

### Composants UI
- ✅ `components/ui/BottomNavigationBar.vue` - Supprimé prop `darkMode`, utilise `useDarkMode()`
- ✅ `components/ui/TaskItem.vue` - Supprimé prop `darkMode`, utilise `useDarkMode()`
- ✅ `components/ui/TaskCard.vue` - Supprimé prop `darkMode`, utilise `useDarkMode()`

---

## 📝 Comment Utiliser dans un Nouveau Composant

### Exemple 1 : Composant Simple

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useDarkMode } from '~/composables/useDarkMode'

const { isDark } = useDarkMode()

const bgClass = computed(() => {
  return isDark.value ? 'bg-gray-800' : 'bg-white'
})
</script>

<template>
  <div :class="bgClass">
    Content
  </div>
</template>
```

### Exemple 2 : Avec Toggle

```vue
<script setup lang="ts">
import { useDarkMode } from '~/composables/useDarkMode'

const { isDark, toggleDark } = useDarkMode()
</script>

<template>
  <button @click="toggleDark()">
    {{ isDark ? 'Mode Clair' : 'Mode Sombre' }}
  </button>
</template>
```

### Exemple 3 : Dans une Page

```vue
<script setup lang="ts">
import { useDarkMode } from '~/composables/useDarkMode'

const { isDark } = useDarkMode()
</script>

<template>
  <div :class="isDark ? 'dark' : ''">
    <h1 class="text-gray-900 dark:text-white">Titre</h1>
  </div>
</template>
```

---

## ✅ Règles à Suivre

1. **NE PLUS utiliser** `darkMode` comme prop dans les composants
2. **TOUJOURS utiliser** `useDarkMode()` composable
3. **Utiliser les classes Tailwind** `dark:` pour les styles conditionnels
4. **Le composable est automatique** - pas besoin de props

---

## 🎨 Classes Tailwind Dark Mode

Utilisez les classes `dark:` de Tailwind :

```vue
<div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  Content
</div>
```

---

## ✅ Avantages

1. **Centralisé** - Un seul endroit pour gérer le dark mode
2. **Persistant** - Sauvegardé dans localStorage automatiquement
3. **Réactif** - Tous les composants se mettent à jour automatiquement
4. **Simple** - Pas besoin de passer des props partout
5. **Cohérent** - Même comportement partout

---

**Tous les composants sont maintenant migrés !** ✅

