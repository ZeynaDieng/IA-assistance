<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-primary dark:text-white">Planning Suggéré</h2>
      <p class="text-gray-500 dark:text-gray-400 text-sm">
        {{ tasks.length }} tâche{{ tasks.length > 1 ? 's' : '' }} identifiée{{ tasks.length > 1 ? 's' : '' }} par l'IA
      </p>
    </div>
    
    <!-- Timeline -->
    <div class="relative">
      <!-- Timeline Line -->
      <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/20" />
      
      <!-- Tasks -->
      <div class="space-y-6">
        <div
          v-for="(task, index) in tasks"
          :key="task.id || index"
          :class="[
            'relative pl-20 pb-6',
            'animate-slide-up'
          ]"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <!-- Time Dot -->
          <div class="absolute left-6 top-2">
            <div class="w-4 h-4 rounded-full bg-primary border-4 border-white dark:border-gray-800 shadow-lg" />
          </div>
          
          <!-- Task Card -->
          <Card
            variant="default"
            hoverable
            class="cursor-pointer"
            @click="handleTaskClick(task)"
          >
            <div class="flex gap-4">
              <!-- Priority Indicator -->
              <div
                :class="[
                  'w-1 rounded-full flex-shrink-0',
                  priorityClasses[task.priority || 'low']
                ]"
              />
              
              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start mb-1">
                  <h4 class="font-bold text-gray-800 dark:text-white truncate">
                    {{ task.title }}
                  </h4>
                  <span
                    :class="[
                      'text-xs font-bold px-2 py-1 rounded-lg flex-shrink-0 ml-2',
                      'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    ]"
                  >
                    {{ formatTime(task.scheduledAt) }}
                  </span>
                </div>
                
                <p
                  v-if="task.description"
                  class="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2"
                >
                  {{ task.description }}
                </p>
                
                <div class="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                  <span class="flex items-center gap-1">
                    <Clock :size="12" />
                    {{ task.duration }}min
                  </span>
                  <span
                    :class="[
                      'px-2 py-0.5 rounded-md',
                      priorityBadgeClasses[task.priority || 'low']
                    ]"
                  >
                    {{ priorityLabels[task.priority || 'low'] }}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
    
    <!-- Actions -->
    <div class="pt-4 bg-gradient-to-t from-white dark:from-gray-800 via-white dark:via-gray-800 to-transparent sticky bottom-0">
      <div class="flex gap-4">
        <Button
          variant="ghost"
          class="flex-1"
          @click="handleModify"
        >
          Modifier
        </Button>
        <Button
          variant="success"
          class="flex-1"
          :icon="Check"
          @click="handleValidate"
        >
          Valider ma journée
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Clock, Check } from 'lucide-vue-next'
import Card from '~/components/ui/Card.vue'
import Button from '~/components/ui/Button.vue'

interface Task {
  id?: string
  title: string
  description?: string
  priority?: 'high' | 'medium' | 'low' | 'urgent'
  duration: number
  scheduledAt: string | Date
  deadline?: string | Date
}

interface Props {
  tasks: Task[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'task-click': [task: Task]
  validate: []
  modify: []
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

const formatTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

const handleTaskClick = (task: Task) => {
  emit('task-click', task)
}

const handleValidate = () => {
  emit('validate')
}

const handleModify = () => {
  emit('modify')
}
</script>

