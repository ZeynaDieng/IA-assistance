<template>
  <button
    :class="[
      'aspect-square flex flex-col items-center justify-center rounded-xl text-sm relative',
      'transition-all active:scale-95',
      dayClasses,
      className
    ]"
    @click="$emit('click')"
  >
    <span>{{ day }}</span>
    
    <!-- Task Indicators -->
    <div
      v-if="hasTasks"
      class="absolute bottom-1 flex gap-0.5"
    >
      <div
        v-for="(indicator, idx) in taskIndicators"
        :key="idx"
        :class="[
          'w-1 h-1 rounded-full',
          indicatorClasses[indicator.priority]
        ]"
      />
    </div>
    
    <!-- Selected Ring -->
    <div
      v-if="selected"
      class="absolute inset-0 rounded-xl ring-2 ring-primary ring-offset-2"
    />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface TaskIndicator {
  priority: 'high' | 'medium' | 'low'
}

interface Props {
  day: number
  isToday?: boolean
  selected?: boolean
  hasTasks?: boolean
  taskIndicators?: TaskIndicator[]
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  isToday: false,
  selected: false,
  hasTasks: false,
  taskIndicators: () => []
})

defineEmits<{
  click: []
}>()

const indicatorClasses = {
  high: 'bg-red-400',
  medium: 'bg-yellow-400',
  low: 'bg-primary'
}

const dayClasses = computed(() => {
  if (props.isToday) {
    return 'bg-primary text-white shadow-lg shadow-purple-500/30'
  }
  
  if (props.selected && !props.isToday) {
    return 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 ring-2 ring-primary'
  }
  
  return 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
})
</script>

