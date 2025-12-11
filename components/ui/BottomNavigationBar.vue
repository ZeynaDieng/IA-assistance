<template>
  <nav
    :class="[
      'fixed bottom-6 left-6 right-6 h-16 rounded-2xl',
      'backdrop-blur-lg shadow-2xl flex justify-around items-center',
      'border border-white/20 z-50',
      darkMode ? 'bg-gray-800/90' : 'bg-white/90',
      'pb-safe-bottom'
    ]"
  >
    <!-- Navigation Items -->
    <button
      v-for="item in items"
      :key="item.id"
      :class="[
        'p-2 rounded-xl transition-all relative',
        activeTab === item.id
          ? 'bg-primary/10 text-primary'
          : 'text-gray-400 hover:text-gray-600'
      ]"
      @click="handleTabChange(item.id)"
    >
      <component :is="item.icon" :size="24" />
      
      <!-- Active Indicator -->
      <div
        v-if="activeTab === item.id"
        class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
      />
    </button>
    
    <!-- Floating Action Button (FAB) -->
    <button
      v-if="fab"
      :class="[
        'mb-8 w-14 h-14 bg-primary rounded-full',
        'shadow-lg shadow-purple-500/40 flex items-center justify-center',
        'text-white transform hover:scale-110 transition-transform',
        'active:scale-95'
      ]"
      @click="handleFabClick"
    >
      <component :is="fab.icon" :size="24" />
    </button>
  </nav>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

interface NavigationItem {
  id: string
  icon: Component
  label?: string
}

interface Props {
  items: NavigationItem[]
  activeTab: string
  fab?: {
    icon: Component
    onClick?: () => void
  }
  darkMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  darkMode: false
})

const emit = defineEmits<{
  'update:activeTab': [tab: string]
  'fab-click': []
}>()

const handleTabChange = (tabId: string) => {
  emit('update:activeTab', tabId)
}

const handleFabClick = () => {
  if (props.fab?.onClick) {
    props.fab.onClick()
  }
  emit('fab-click')
}
</script>

