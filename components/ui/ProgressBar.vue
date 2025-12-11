<template>
  <div class="w-full">
    <!-- Progress Bar Container -->
    <div
      :class="[
        'w-full bg-gray-100 rounded-full h-2 overflow-hidden',
        darkMode && 'dark:bg-gray-700',
        className
      ]"
    >
      <!-- Progress Fill -->
      <div
        :class="[
          'h-2 rounded-full transition-all duration-500 ease-out',
          'shadow-[0_0_10px_#6C3EF1]',
          variantClasses[variant]
        ]"
        :style="{ width: `${Math.min(100, Math.max(0, percentage))}%` }"
      />
    </div>
    
    <!-- Label (optional) -->
    <div
      v-if="showLabel"
      class="flex justify-between items-center mt-2"
    >
      <span class="text-sm text-gray-600 dark:text-gray-400">
        {{ label }}
      </span>
      <span
        :class="[
          'font-bold text-primary',
          sizeClasses[size]
        ]"
      >
        {{ percentage }}%
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  percentage: number
  variant?: 'primary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  label?: string
  darkMode?: boolean
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  showLabel: false,
  darkMode: false,
  className: ''
})

const variantClasses = {
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-yellow-500',
  danger: 'bg-red-500'
}

const sizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base'
}
</script>

