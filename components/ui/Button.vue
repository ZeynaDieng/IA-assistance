<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'relative overflow-hidden rounded-2xl font-medium transition-all duration-300',
      'active:scale-95 flex items-center justify-center gap-2',
      'px-6 py-4 w-full shadow-lg hover:shadow-xl',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'min-h-[44px]', // Touch target minimum
      variantClasses[variant],
      sizeClasses[size],
      className
    ]"
    @click="handleClick"
  >
    <!-- Loading Spinner -->
    <svg
      v-if="loading"
      class="animate-spin h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    
    <!-- Icon -->
    <component
      v-if="icon && !loading"
      :is="icon"
      :size="20"
      class="flex-shrink-0"
    />
    
    <!-- Content -->
    <span v-if="!loading">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'glass'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  icon?: Component
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  className: ''
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const variantClasses = {
  primary: 'bg-primary text-white hover:bg-primary-dark',
  secondary: 'bg-secondary text-white hover:bg-secondary-light',
  outline: 'border-2 border-primary text-primary bg-transparent hover:bg-primary/5',
  ghost: 'bg-transparent text-gray-500 hover:bg-gray-100 shadow-none',
  success: 'bg-success text-secondary hover:bg-success-dark',
  glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20'
}

const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-4 text-base',
  lg: 'px-8 py-5 text-lg'
}

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>
