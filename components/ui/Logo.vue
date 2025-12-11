<template>
  <div 
    :class="[
      'flex items-center gap-2',
      size === 'lg' && 'scale-125',
      className
    ]"
  >
    <!-- Logo Icon -->
    <div class="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-darker shadow-lg">
      <!-- Animated Pulse Ring -->
      <div class="absolute w-6 h-3 border-2 border-white rounded-full opacity-50 animate-pulse" />
      <!-- Microphone Bars -->
      <div class="w-1 h-4 bg-white rounded-full mx-0.5" />
      <div class="w-1 h-6 bg-white rounded-full mx-0.5" />
      <div class="w-1 h-3 bg-white rounded-full mx-0.5" />
    </div>
    
    <!-- Logo Text -->
    <div class="flex flex-col">
      <span 
        :class="[
          'font-bold tracking-tight leading-none text-lg',
          variant === 'light' ? 'text-white' : 'text-primary'
        ]"
      >
        SamaPlanner
      </span>
      <span 
        :class="[
          'text-[10px] uppercase tracking-widest',
          variant === 'light' ? 'text-white/70' : 'text-gray-500'
        ]"
      >
        Assistant Vocal
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'light' | 'dark'
  className?: string
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'dark',
  className: ''
})
</script>
