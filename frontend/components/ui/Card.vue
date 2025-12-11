<template>
  <div 
    :class="['p-4 rounded-2xl shadow-sm', variantClasses[variant], className, hoverable && 'cursor-pointer card-lift']"
    @click="hoverable && $emit('click')"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'primary' | 'glass' | 'colored' | 'elevated'
  className?: string
  hoverable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  className: '',
  hoverable: false
})

defineEmits<{
  click: []
}>()

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-primary text-white shadow-purple-500/20 relative overflow-hidden'
    case 'colored':
      return 'bg-gradient-to-br from-primary to-secondary text-white shadow-purple-500/20 relative overflow-hidden'
    case 'glass':
      return 'bg-white/10 backdrop-blur-md border border-white/20 text-white'
    case 'elevated':
      return 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-lg'
    case 'default':
    default:
      return 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700'
  }
})
</script>

