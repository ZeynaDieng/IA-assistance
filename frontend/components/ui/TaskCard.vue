<template>
  <div
    :class="[
      'p-4 rounded-2xl shadow-sm border transition-all',
      'card-lift press-animation',
      cardClasses.container,
      className
    ]"
    @click="$emit('click')"
  >
    <div class="flex items-center gap-4">
      <!-- Priority Indicator -->
      <div
        :class="[
          'w-1 h-full rounded-full flex-shrink-0',
          priorityClasses[priority]
        ]"
      />
      
      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div class="flex justify-between items-start mb-1">
          <h4 :class="['font-bold text-lg', cardClasses.title]">
            {{ title }}
          </h4>
          <span
            v-if="time"
            :class="[
              'text-xs font-medium px-2 py-1 rounded-lg flex-shrink-0 ml-2',
              'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            ]"
          >
            {{ time }}
          </span>
        </div>
        
        <p
          v-if="description"
          :class="['text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2']"
        >
          {{ description }}
        </p>
        
        <div class="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
          <span v-if="duration" class="flex items-center gap-1">
            <Clock :size="12" />
            {{ duration }}min
          </span>
          <span
            :class="[
              'px-2 py-0.5 rounded-md',
              priorityBadgeClasses[priority]
            ]"
          >
            {{ priorityLabels[priority] }}
          </span>
        </div>
      </div>
      
      <!-- Checkbox -->
      <button
        :class="[
          'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0',
          cardClasses.checkbox
        ]"
        @click.stop="$emit('toggle')"
      >
        <Check v-if="completed" :size="14" class="text-white" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Check, Clock } from 'lucide-vue-next'
import { computed } from 'vue'
import { useDarkMode } from '~/composables/useDarkMode'

interface Props {
  title: string
  description?: string
  time?: string
  duration?: number
  priority?: 'high' | 'medium' | 'low' | 'urgent'
  completed?: boolean
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  priority: 'low',
  completed: false
})

const { isDark } = useDarkMode()

defineEmits<{
  click: []
  toggle: []
}>()

const priorityClasses = {
  urgent: 'bg-red-500',
  high: 'bg-red-400',
  medium: 'bg-yellow-400',
  low: 'bg-primary'
}

const priorityBadgeClasses = {
  urgent: 'bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400',
  high: 'bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400',
  medium: 'bg-yellow-50 text-yellow-500 dark:bg-yellow-900/20 dark:text-yellow-400',
  low: 'bg-purple-50 text-purple-500 dark:bg-purple-900/20 dark:text-purple-400'
}

const priorityLabels = {
  urgent: 'Urgent',
  high: 'Urgent',
  medium: 'Normal',
  low: 'Normal'
}

const cardClasses = computed(() => {
  const baseBg = isDark.value ? 'bg-gray-800' : 'bg-white'
  const baseBorder = isDark.value ? 'border-gray-700' : 'border-gray-100'
  const completedOpacity = props.completed ? 'opacity-50' : ''

  return {
    container: `${baseBg} ${baseBorder} ${completedOpacity}`,
    checkbox: props.completed ? 'bg-success border-success' : 'border-gray-300',
    title: props.completed ? 'line-through text-gray-400' : 'text-gray-800 dark:text-white',
  }
})
</script>

