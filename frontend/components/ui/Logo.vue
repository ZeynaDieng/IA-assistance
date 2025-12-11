<template>
  <div :class="['flex items-center gap-3', size === 'lg' ? 'gap-4' : '']">
    <!-- Icon Container -->
    <div
      :class="[
        'relative flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-darker shadow-md',
        size === 'lg' ? 'w-12 h-12' : 'w-10 h-10'
      ]"
    >
      <!-- Chat/Message Icon - Simple and Clean -->
      <svg
        :class="[
          'text-white',
          size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'
        ]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    </div>
    
    <!-- Text -->
    <div class="flex flex-col">
      <span
        :class="[
          'font-bold tracking-tight leading-none',
          size === 'lg' ? 'text-xl' : 'text-lg',
          colorClass
        ]"
      >
        {{ name }}
      </span>
      <span
        :class="[
          'uppercase tracking-wider',
          size === 'lg' ? 'text-xs' : 'text-[10px]',
          subColorClass
        ]"
      >
        {{ tagline }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'md' | 'lg'
  variant?: 'light' | 'dark'
  name?: string
  tagline?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'light',
  name: 'Zeii',
  tagline: 'Assistant IA'
})

const colorClass = computed(() => props.variant === 'light' ? 'text-white' : 'text-primary')
const subColorClass = computed(() => props.variant === 'light' ? 'text-white/70' : 'text-gray-500')
</script>

