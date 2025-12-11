<template>
  <button 
    :class="[baseStyle, variants[variant], className, disabled && 'opacity-50 cursor-not-allowed']" 
    :disabled="disabled || loading"
    :aria-label="ariaLabel || undefined"
    :aria-busy="loading"
    :aria-disabled="disabled || loading"
    :tabindex="disabled || loading ? -1 : 0"
    @click="handleClick"
    @keydown.enter="handleClick"
    @keydown.space.prevent="handleClick"
  >
    <Loader2 v-if="loading" :size="20" class="animate-spin" aria-hidden="true" />
    <component :is="icon" v-else-if="icon" :size="20" aria-hidden="true" />
    <span v-if="loading" class="sr-only">Chargement en cours</span>
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import type { Component } from 'vue'

interface Props {
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'glass'
  className?: string
  icon?: Component
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  disabled?: boolean
  loading?: boolean
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  className: '',
  size: 'md',
  fullWidth: true,
  disabled: false,
  loading: false
})

const baseStyle = computed(() => {
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3',
    lg: 'px-6 py-4 text-lg'
  }
  return `relative overflow-hidden rounded-xl font-medium transition-all duration-200 press-animation flex items-center justify-center gap-2 ${sizeClasses[props.size]} ${props.fullWidth ? 'w-full' : ''} shadow-md hover:shadow-lg`
})

const variants = {
  primary: 'bg-primary text-white hover:bg-[#5829D6]',
  secondary: 'bg-secondary text-white hover:bg-[#1A1D4D]',
  outline: 'border-2 border-primary text-primary bg-transparent hover:bg-primary/5',
  ghost: 'bg-transparent text-gray-500 hover:bg-gray-100 shadow-none',
  success: 'bg-success text-secondary hover:bg-[#3BC670]',
  glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20'
}

const handleClick = () => {
  if (!props.disabled && !props.loading && props.onClick) {
    props.onClick()
  }
}
</script>

