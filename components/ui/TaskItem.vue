<template>
  <div
    :class="[
      'group relative overflow-hidden bg-white p-5 rounded-3xl',
      'shadow-sm border border-gray-50 transition-all',
      'active:scale-95',
      completed && 'opacity-50',
      className
    ]"
    @click="handleClick"
  >
    <div class="flex items-center gap-4 relative z-10">
      <!-- Checkbox -->
      <button
        :class="[
          'w-6 h-6 rounded-full border-2 flex items-center justify-center',
          'transition-colors flex-shrink-0',
          completed
            ? 'bg-success border-success'
            : 'border-gray-300 hover:border-primary'
        ]"
        @click.stop="handleToggle"
      >
        <Check
          v-if="completed"
          :size="14"
          class="text-white"
        />
      </button>
      
      <!-- Content -->
      <div class="flex-1 min-w-0">
        <h4
          :class="[
            'font-bold',
            completed ? 'line-through text-gray-400' : 'text-gray-800'
          ]"
        >
          {{ title }}
        </h4>
        <div class="flex items-center gap-3 mt-1">
          <span class="text-xs text-gray-400 flex items-center gap-1">
            <Clock :size="12" />
            {{ time }}
          </span>
          <span class="text-xs text-gray-400">{{ duration }}</span>
          <span
            :class="[
              'px-2 py-0.5 rounded-md text-xs font-medium',
              priorityClasses[priority]
            ]"
          >
            {{ priorityLabel }}
          </span>
        </div>
      </div>
      
      <!-- Priority Indicator -->
      <div
        :class="[
          'w-2 h-2 rounded-full flex-shrink-0',
          priorityDotClasses[priority]
        ]"
      />
    </div>
    
    <!-- Swipe Actions Hint (Glassmorphism) -->
    <div
      :class="[
        'absolute inset-y-0 right-0 w-16',
        'bg-gradient-to-l from-red-50 to-transparent',
        'flex items-center justify-end px-4',
        'opacity-0 group-hover:opacity-100 transition-opacity'
      ]"
    >
      <Trash2 :size="18" class="text-red-400" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Check, Clock, Trash2 } from 'lucide-vue-next'

interface Props {
  title: string
  time: string
  duration: string
  priority?: 'high' | 'medium' | 'low'
  completed?: boolean
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  priority: 'low',
  completed: false,
  className: ''
})

const emit = defineEmits<{
  click: []
  toggle: []
  delete: []
}>()

const priorityClasses = {
  high: 'bg-red-50 text-red-500',
  medium: 'bg-yellow-50 text-yellow-500',
  low: 'bg-purple-50 text-purple-500'
}

const priorityDotClasses = {
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-primary'
}

const priorityLabel = {
  high: 'Urgent',
  medium: 'Moyen',
  low: 'Normal'
}[props.priority]

const handleClick = () => {
  emit('click')
}

const handleToggle = () => {
  emit('toggle')
}
</script>

