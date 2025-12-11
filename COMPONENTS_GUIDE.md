# Guide des Composants UI - SamaPlanner

**Composants Vue 3 basés sur le Design System extrait du prototype React**

---

## 📁 Structure des Composants

```
components/
├── ui/                    # Composants UI de base (Design System)
│   ├── Logo.vue
│   ├── Button.vue
│   ├── Card.vue
│   ├── Input.vue
│   ├── BottomNavigationBar.vue
│   ├── TaskItem.vue
│   ├── ProgressBar.vue
│   ├── Modal.vue
│   └── VoiceRecorder.vue
├── features/              # Composants spécifiques aux fonctionnalités
│   ├── AudioRecorder.vue
│   ├── PlanningList.vue
│   ├── CalendarGrid.vue
│   ├── PinInput.vue
│   └── OtpDisplay.vue
└── layout/                # Composants de layout
    ├── Header.vue
    ├── SectionContainer.vue
    └── EmptyState.vue
```

---

## 🎨 Composants UI de Base

### Logo

```vue
<Logo size="lg" variant="light" />
```

**Props:**
- `size`: `'sm' | 'md' | 'lg'` (défaut: `'md'`)
- `variant`: `'light' | 'dark'` (défaut: `'dark'`)
- `className`: string (classes CSS additionnelles)

---

### Button

```vue
<Button 
  variant="primary" 
  size="md"
  :loading="false"
  :icon="Mic"
  @click="handleClick"
>
  Enregistrer
</Button>
```

**Variants:**
- `primary`: Violet (#6C3EF1)
- `secondary`: Bleu nuit (#0D0F33)
- `success`: Vert (#4ADE80)
- `outline`: Bordure violette, fond transparent
- `ghost`: Transparent, texte gris
- `glass`: Glassmorphism (backdrop-blur)

**Props:**
- `variant`: Variant du bouton
- `size`: `'sm' | 'md' | 'lg'`
- `loading`: boolean (affiche spinner)
- `disabled`: boolean
- `icon`: Component (icône Lucide)
- `type`: `'button' | 'submit' | 'reset'`

---

### Card

```vue
<Card variant="default" hoverable>
  <h3>Titre</h3>
  <p>Contenu</p>
</Card>
```

**Variants:**
- `default`: Fond blanc, ombre légère
- `elevated`: Fond blanc, ombre importante
- `glass`: Glassmorphism
- `colored`: Fond violet avec texte blanc
- `dark`: Fond gris foncé

**Props:**
- `variant`: Variant de la carte
- `hoverable`: boolean (effet hover + click)

---

### Input

```vue
<Input
  v-model="phoneNumber"
  label="Numéro de téléphone"
  placeholder="77 000 00 00"
  :icon-left="Smartphone"
  :required="true"
  :error="errorMessage"
/>
```

**Props:**
- `modelValue`: string | number (v-model)
- `type`: string (text, tel, email, etc.)
- `label`: string
- `placeholder`: string
- `error`: string (message d'erreur)
- `helper`: string (texte d'aide)
- `required`: boolean
- `disabled`: boolean
- `iconLeft`: Component
- `iconRight`: Component
- `darkMode`: boolean

---

### BottomNavigationBar

```vue
<BottomNavigationBar
  :items="navItems"
  v-model:active-tab="activeTab"
  :fab="{ icon: Mic, onClick: startRecording }"
/>
```

**Props:**
- `items`: Array<{ id: string, icon: Component, label?: string }>
- `activeTab`: string (id de l'onglet actif)
- `fab`: { icon: Component, onClick?: Function } (Floating Action Button)
- `darkMode`: boolean

**Exemple d'utilisation:**
```vue
<script setup>
import { Home, Calendar, BarChart2, User, Mic } from 'lucide-vue-next'

const navItems = [
  { id: 'home', icon: Home },
  { id: 'calendar', icon: Calendar },
  { id: 'stats', icon: BarChart2 },
  { id: 'profile', icon: User }
]

const activeTab = ref('home')
</script>
```

---

### TaskItem

```vue
<TaskItem
  title="Réunion équipe marketing"
  time="09:30"
  duration="1h"
  priority="high"
  :completed="false"
  @click="openTask"
  @toggle="toggleTask"
/>
```

**Props:**
- `title`: string
- `time`: string
- `duration`: string
- `priority`: `'high' | 'medium' | 'low'`
- `completed`: boolean

**Events:**
- `click`: Clic sur la tâche
- `toggle`: Toggle de la checkbox
- `delete`: Suppression (swipe left)

---

### ProgressBar

```vue
<ProgressBar
  :percentage="85"
  variant="primary"
  :show-label="true"
  label="Tâches complétées"
/>
```

**Props:**
- `percentage`: number (0-100)
- `variant`: `'primary' | 'success' | 'warning' | 'danger'`
- `size`: `'sm' | 'md' | 'lg'`
- `showLabel`: boolean
- `label`: string

---

### Modal

```vue
<Modal
  v-model="isOpen"
  title="Confirmer la suppression"
  :closable="true"
>
  <p>Êtes-vous sûr de vouloir supprimer cette tâche ?</p>
  
  <template #footer>
    <div class="flex gap-4">
      <Button variant="ghost" @click="isOpen = false">Annuler</Button>
      <Button variant="primary" @click="confirmDelete">Supprimer</Button>
    </div>
  </template>
</Modal>
```

**Props:**
- `modelValue`: boolean (v-model)
- `title`: string
- `closable`: boolean
- `darkMode`: boolean

**Slots:**
- `default`: Contenu du modal
- `header`: En-tête personnalisé
- `footer`: Pied de page (boutons)

---

### VoiceRecorder

```vue
<VoiceRecorder
  :max-duration="120"
  @start="handleStart"
  @stop="handleStop"
  @max-duration-reached="handleMaxDuration"
/>
```

**Props:**
- `maxDuration`: number (secondes, défaut: 120)

**Events:**
- `start`: Début d'enregistrement
- `stop`: Fin d'enregistrement (passe la durée)
- `max-duration-reached`: Durée max atteinte

---

## 🎯 Exemples d'Utilisation par Écran

### Page d'Accueil (Home)

```vue
<template>
  <div class="h-full flex flex-col relative">
    <!-- Header -->
    <Header />
    
    <!-- Main Action -->
    <div class="flex-1 flex flex-col items-center justify-center">
      <VoiceRecorder @stop="handleRecordingStop" />
    </div>
    
    <!-- Quick Stats -->
    <div class="p-6 grid grid-cols-2 gap-4">
      <Card variant="default">
        <div class="text-success mb-2"><Check :size="24" /></div>
        <div class="text-2xl font-bold">85%</div>
        <div class="text-xs text-gray-400">Tâches hier</div>
      </Card>
      <Card variant="default">
        <div class="text-primary mb-2"><BarChart2 :size="24" /></div>
        <div class="text-2xl font-bold">4.8</div>
        <div class="text-xs text-gray-400">Score Org.</div>
      </Card>
    </div>
  </div>
</template>
```

### Page de Tâches (Tasks)

```vue
<template>
  <div class="space-y-4 pb-24">
    <!-- Header -->
    <div class="flex justify-between items-end mb-2">
      <div>
        <h1 class="text-3xl font-bold">Lundi 14</h1>
        <p class="text-gray-400">4 tâches restantes</p>
      </div>
      <div class="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center">
        <span class="font-bold text-primary">85%</span>
      </div>
    </div>
    
    <!-- Progress Bar -->
    <ProgressBar :percentage="85" :show-label="false" />
    
    <!-- Tasks List -->
    <TaskItem
      v-for="task in tasks"
      :key="task.id"
      :title="task.title"
      :time="task.time"
      :duration="task.duration"
      :priority="task.priority"
      :completed="task.completed"
      @click="openTask(task)"
      @toggle="toggleTask(task)"
    />
  </div>
</template>
```

### Page d'Authentification (Phone)

```vue
<template>
  <div class="h-full flex flex-col p-8 pt-16">
    <h2 class="text-2xl font-bold mb-2">Quel est ton numéro ?</h2>
    <p class="text-gray-500 mb-8 text-sm">
      Nous sécurisons ton compte via ce numéro. Aucun SMS ne sera envoyé.
    </p>
    
    <div class="space-y-6">
      <Input
        v-model="phoneNumber"
        type="tel"
        placeholder="77 000 00 00"
        :icon-left="Smartphone"
      />
      
      <Button @click="handleSubmit">Continuer</Button>
    </div>
  </div>
</template>
```

### Page OTP

```vue
<template>
  <div class="h-full flex flex-col p-8 pt-16">
    <h2 class="text-2xl font-bold mb-2">Vérification Interne</h2>
    <p class="text-gray-500 mb-8 text-sm">
      Pour simplifier l'accès, voici votre code de sécurité généré localement.
    </p>
    
    <!-- OTP Display -->
    <Card variant="colored" class="mb-8 text-center animate-bounce">
      <span class="text-sm uppercase tracking-widest opacity-80 font-bold">
        Ton Code
      </span>
      <div class="text-5xl font-mono font-bold mt-2 tracking-widest">
        {{ generatedOtp }}
      </div>
    </Card>
    
    <div class="space-y-6">
      <Input
        v-model="otp"
        type="text"
        placeholder="Entrer le code ici"
        :maxlength="4"
        class="text-center text-3xl tracking-[1em]"
      />
      
      <Button variant="primary" :icon="ShieldCheck" @click="handleVerify">
        Valider
      </Button>
    </div>
  </div>
</template>
```

---

## 🎨 Styles Globaux à Ajouter

### Dans `assets/css/main.css` ou `app.vue`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply font-sans antialiased;
  }
}

@layer utilities {
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

---

## 📱 Safe Areas (iOS)

Pour supporter les safe areas iOS (notch, home indicator):

```vue
<template>
  <div class="h-full pt-safe-top pb-safe-bottom">
    <!-- Contenu -->
  </div>
</template>
```

---

## 🌙 Dark Mode

Tous les composants supportent le dark mode via la classe `dark:` de Tailwind.

Pour activer le dark mode:
```vue
<script setup>
const darkMode = ref(false)

watch(darkMode, (value) => {
  if (value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})
</script>
```

---

## 🎯 Prochaines Étapes

1. Créer les composants features spécifiques (AudioRecorder, PlanningList, etc.)
2. Créer les pages Nuxt 3 complètes
3. Implémenter les animations et transitions
4. Ajouter les gestes tactiles (swipe, long press)
5. Tester sur appareils mobiles réels

---

**Tous les composants respectent le Design System extrait du prototype React.**

