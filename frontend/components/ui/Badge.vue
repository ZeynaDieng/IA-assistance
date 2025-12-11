<template>
  <span
    :class="[
      'inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium',
      variantClasses[variant],
      sizeClasses[size],
      className
    ]"
  >
    <component :is="icon" v-if="icon" :size="12" />
    <slot></slot>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'

interface Props {
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'gray'
  size?: 'sm' | 'md'
  icon?: Component
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md'
})

const variantClasses = {
  primary: 'bg-purple-50 text-purple-500 dark:bg-purple-900/20 dark:text-purple-400',
  success: 'bg-green-50 text-green-500 dark:bg-green-900/20 dark:text-green-400',
  warning: 'bg-yellow-50 text-yellow-500 dark:bg-yellow-900/20 dark:text-yellow-400',
  error: 'bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400',
  info: 'bg-blue-50 text-blue-500 dark:bg-blue-900/20 dark:text-blue-400',
  gray: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
}

const sizeClasses = {
  sm: 'text-xs px-1.5 py-0.5',
  md: 'text-xs px-2 py-1'
}
</script>

