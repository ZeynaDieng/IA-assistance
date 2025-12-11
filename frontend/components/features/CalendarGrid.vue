<template>
  <div class="w-full">
    <!-- Month Header -->
    <div class="flex justify-between items-center mb-6">
      <button
        class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        @click="previousMonth"
      >
        <ChevronLeft :size="20" class="text-gray-600 dark:text-gray-300" />
      </button>
      
      <h2 class="text-xl font-bold text-gray-900 dark:text-white capitalize">
        {{ monthYear }}
      </h2>
      
      <button
        class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        @click="nextMonth"
      >
        <ChevronRight :size="20" class="text-gray-600 dark:text-gray-300" />
      </button>
    </div>
    
    <!-- Week Days Header -->
    <div class="grid grid-cols-7 gap-2 mb-4">
      <div
        v-for="day in weekDays"
        :key="day"
        class="text-center text-xs font-bold text-gray-400 dark:text-gray-500 py-2"
      >
        {{ day }}
      </div>
    </div>
    
    <!-- Calendar Grid -->
    <div class="grid grid-cols-7 gap-2">
      <!-- Empty cells for days before month start -->
      <div
        v-for="i in startDay"
        :key="`empty-${i}`"
        class="aspect-square"
      />
      
      <!-- Days -->
      <button
        v-for="day in daysInMonth"
        :key="day"
        :class="[
          'aspect-square flex flex-col items-center justify-center rounded-2xl text-sm font-medium relative',
          'transition-all active:scale-95',
          isToday(day) && 'bg-primary text-white shadow-md',
          !isToday(day) && 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-700',
          selectedDay === day && !isToday(day) && 'ring-2 ring-primary bg-primary/5 dark:bg-primary/10'
        ]"
        @click="handleDayClick(day)"
      >
        <span>{{ day }}</span>
        
        <!-- Task Indicator -->
        <div
          v-if="hasTasks(day)"
          :class="[
            'w-1.5 h-1.5 rounded-full mt-1',
            getHighestPriority(day) === 'high' || getHighestPriority(day) === 'urgent'
              ? 'bg-red-500'
              : 'bg-success'
          ]"
        />
      </button>
    </div>
    
    <!-- Selected Day Tasks Panel -->
    <div
      v-if="selectedDay"
      class="mt-6 bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
    >
      <h3 class="text-base font-bold mb-4 text-gray-900 dark:text-white">
        {{ formatSelectedDateTitle() }}
      </h3>
      
      <div
        v-if="selectedDayTasks.length > 0"
        class="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-5 px-5"
      >
        <button
          v-for="task in selectedDayTasks"
          :key="task.id"
          class="flex-shrink-0 w-64 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-primary/30 dark:hover:border-primary/30 hover:shadow-md transition-all text-left"
          @click="$emit('task-clicked', task)"
        >
          <div class="flex flex-col gap-3">
            <!-- Time Badge -->
            <div
              class="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex flex-col items-center justify-center"
            >
              <span class="text-xs font-bold text-primary">
                {{ formatTime(task.scheduledAt).split(':')[0] }}
              </span>
              <span class="text-[10px] text-primary/70">
                {{ formatTime(task.scheduledAt).split(':')[1] }}
              </span>
            </div>
            
            <!-- Task Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2 mb-1">
                <h4 class="text-sm font-bold text-gray-900 dark:text-white line-clamp-2">
                  {{ task.title }}
                </h4>
                <div
                  :class="[
                    'w-2 h-2 rounded-full flex-shrink-0 mt-1',
                    getTaskPriorityClass(task.priority)
                  ]"
                />
              </div>
              <p
                v-if="task.description"
                class="text-xs text-gray-500 dark:text-gray-400 line-clamp-3"
              >
                {{ task.description }}
              </p>
            </div>
          </div>
        </button>
      </div>
      
      <div v-else class="text-center py-12">
        <div
          class="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3"
        >
          <Calendar :size="32" class="text-gray-400 dark:text-gray-600" />
        </div>
        <p class="text-gray-600 dark:text-gray-300 font-medium mb-1">
          Aucune tâche
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Aucune tâche prévue pour ce jour
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-vue-next'

interface Task {
  id: string
  title: string
  scheduledAt: string | Date
  priority?: 'high' | 'medium' | 'low' | 'urgent'
}

interface Props {
  tasks?: Task[]
  initialDate?: Date
  selectedDateTasks?: Task[] // Tasks for the selected date (from parent)
}

const props = withDefaults(defineProps<Props>(), {
  tasks: () => [],
  initialDate: () => new Date(),
  selectedDateTasks: () => []
})

const emit = defineEmits<{
  'day-selected': [date: Date]
  'month-changed': [date: Date]
  'task-clicked': [task: Task]
}>()

const currentDate = ref(new Date(props.initialDate))
const selectedDay = ref<number | null>(null)

const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

const monthYear = computed(() => {
  return currentDate.value.toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric'
  })
})

const daysInMonth = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  return new Date(year, month + 1, 0).getDate()
})

const startDay = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  return new Date(year, month, 1).getDay() === 0 ? 6 : new Date(year, month, 1).getDay() - 1
})

const isToday = (day: number): boolean => {
  const today = new Date()
  return (
    day === today.getDate() &&
    currentDate.value.getMonth() === today.getMonth() &&
    currentDate.value.getFullYear() === today.getFullYear()
  )
}

const hasTasks = (day: number): boolean => {
  const date = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth(),
    day
  )
  return props.tasks.some(task => {
    const taskDate = typeof task.scheduledAt === 'string' ? new Date(task.scheduledAt) : task.scheduledAt
    return (
      taskDate.getDate() === date.getDate() &&
      taskDate.getMonth() === date.getMonth() &&
      taskDate.getFullYear() === date.getFullYear()
    )
  })
}

const getHighestPriority = (day: number): string => {
  const date = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth(),
    day
  )
  const dayTasks = props.tasks.filter(task => {
    const taskDate = typeof task.scheduledAt === 'string' ? new Date(task.scheduledAt) : task.scheduledAt
    return (
      taskDate.getDate() === date.getDate() &&
      taskDate.getMonth() === date.getMonth() &&
      taskDate.getFullYear() === date.getFullYear()
    )
  })
  
  if (dayTasks.length === 0) return 'low'
  
  const priorities = dayTasks.map(t => t.priority || 'low')
  if (priorities.includes('urgent')) return 'urgent'
  if (priorities.includes('high')) return 'high'
  return 'low'
}

const selectedDayTasks = computed(() => {
  if (!selectedDay.value) return []
  
  // Use tasks passed from parent if available, otherwise filter from props.tasks
  if (props.selectedDateTasks && props.selectedDateTasks.length > 0) {
    return props.selectedDateTasks
  }
  
  const date = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth(),
    selectedDay.value
  )
  
  return props.tasks.filter(task => {
    const taskDate = typeof task.scheduledAt === 'string' ? new Date(task.scheduledAt) : task.scheduledAt
    return (
      taskDate.getDate() === date.getDate() &&
      taskDate.getMonth() === date.getMonth() &&
      taskDate.getFullYear() === date.getFullYear()
    )
  })
})

const formatTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

const formatSelectedDateTitle = (): string => {
  if (!selectedDay.value) return ''
  
  const date = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth(),
    selectedDay.value
  )
  
  const today = new Date()
  const isTodayDate = (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
  
  if (isTodayDate) {
    return 'Aujourd\'hui'
  }
  
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })
}

const getTaskPriorityClass = (priority?: string): string => {
  const p = (priority || 'low').toLowerCase()
  if (p === 'urgent' || p === 'high') return 'bg-red-400'
  if (p === 'medium') return 'bg-yellow-400'
  return 'bg-primary'
}

const previousMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1
  )
  selectedDay.value = null
  emit('month-changed', currentDate.value)
}

const nextMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  )
  selectedDay.value = null
  emit('month-changed', currentDate.value)
}

const handleDayClick = (day: number) => {
  selectedDay.value = selectedDay.value === day ? null : day
  
  if (selectedDay.value) {
    const date = new Date(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth(),
      day
    )
    emit('day-selected', date)
  }
}
</script>

