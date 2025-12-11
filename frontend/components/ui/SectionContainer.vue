<template>
  <div 
    :class="[
      'w-full',
      paddingClasses,
      containerClasses,
      className
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  safeTop?: boolean
  safeBottom?: boolean
  scrollable?: boolean
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  padding: 'md',
  safeTop: true,
  safeBottom: true,
  scrollable: false
})

const paddingClasses = computed(() => {
  const classes: Record<string, string> = {
    none: '',
    sm: 'px-4 py-3',
    md: 'px-6 py-4',
    lg: 'px-8 py-6',
    xl: 'px-10 py-8'
  }
  return classes[props.padding] || classes.md
})

const containerClasses = computed(() => {
  let classes = ''
  
  if (props.safeTop) classes += ' safe-top'
  if (props.safeBottom) classes += ' safe-bottom'
  if (props.scrollable) classes += ' overflow-y-auto'
  
  return classes.trim()
})
</script>

