<template>
  <div class="h-full flex flex-col p-4 bg-gray-50/50 dark:bg-gray-900/50 safe-top safe-bottom overflow-hidden">
    <!-- Planning List -->
    <div class="flex-1 overflow-y-auto pb-24">
      <!-- Header (exact React style) -->
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-[#6C3EF1]">Planning Suggéré</h2>
        <p class="text-gray-500 text-sm">
          {{ generating || planningStore.loading ? 'Génération en cours...' : `${generatedTasks.length} tâche${generatedTasks.length > 1 ? 's' : ''} identifiée${generatedTasks.length > 1 ? 's' : ''} par l'IA` }}
        </p>
        <!-- Dates concernées -->
        <div v-if="!generating && !planningStore.loading && planningDates.length > 0" class="mt-2 flex flex-wrap gap-2">
          <span class="text-xs text-gray-400 dark:text-gray-500">Période :</span>
          <span
            v-for="(date, index) in planningDates"
            :key="date.toISOString()"
            class="text-xs font-medium bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 px-2 py-1 rounded-md"
          >
            {{ formatDateHeader(date) }}{{ index < planningDates.length - 1 ? ',' : '' }}
          </span>
        </div>
      </div>
      
      <!-- Loading State -->
      <div v-if="generating || planningStore.loading" class="flex flex-col items-center justify-center py-12">
        <div class="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p class="text-gray-500">{{ planningStore.error || 'Génération du planning...' }}</p>
      </div>
      
      <!-- Tasks List grouped by date (exact React style) -->
      <div v-if="!generating && !planningStore.loading && generatedTasks.length > 0" class="space-y-4 pb-4">
        <!-- Group by date -->
        <div
          v-for="group in tasksByDate"
          :key="group.date.toISOString()"
          class="space-y-4"
        >
          <!-- Date Header -->
          <div class="sticky top-0 z-10 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-sm py-2 -mx-2 px-2">
            <h3 class="text-lg font-bold text-gray-700 dark:text-gray-300">
              {{ formatDateHeader(group.date) }}
            </h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ group.tasks.length }} tâche{{ group.tasks.length > 1 ? 's' : '' }}
            </p>
          </div>
          
          <!-- Tasks for this date -->
          <div
            v-for="(task, index) in group.tasks"
            :key="task.id || `${group.date.toISOString()}-${index}`"
            class="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex gap-3 card-lift press-animation cursor-pointer"
            @click="handleTaskClick(task)"
          >
          <div
            :class="[
              'w-1 rounded-full flex-shrink-0',
              task.priority === 'high' || task.priority === 'urgent' 
                ? 'bg-red-400' 
                : task.priority === 'medium' 
                  ? 'bg-yellow-400' 
                  : 'bg-[#6C3EF1]'
            ]"
          />
          <div class="flex-1">
            <div class="flex justify-between items-start mb-1">
              <h4 class="font-bold text-gray-800 dark:text-white">{{ task.title }}</h4>
              <span class="text-xs font-bold bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg">
                {{ formatTime(task.scheduledAt) }}
              </span>
            </div>
            <div v-if="task.description" class="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {{ task.description }}
            </div>
            <div class="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
              <span class="flex items-center gap-1">
                <Clock :size="12" />
                {{ task.duration }}min
              </span>
              <span
                :class="[
                  'px-2 py-0.5 rounded-md',
                  task.priority === 'HIGH' || task.priority === 'high' || task.priority === 'URGENT' || task.priority === 'urgent'
                    ? 'bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400'
                    : 'bg-purple-50 text-purple-500 dark:bg-purple-900/20 dark:text-purple-400'
                ]"
              >
                {{ (task.priority === 'HIGH' || task.priority === 'high' || task.priority === 'URGENT' || task.priority === 'urgent') ? 'Urgent' : 'Normal' }}
              </span>
            </div>
          </div>
          </div>
        </div>
      </div>
      
      <!-- Actions (exact React style) -->
      <div v-if="!generating && !planningStore.loading && generatedTasks.length > 0" class="pt-4 bg-gradient-to-t from-white dark:from-gray-800 via-white dark:via-gray-800 to-transparent sticky bottom-0">
        <Button variant="success" :icon="Check" @click="handleValidate" :loading="validating" class="w-full">
          Valider ma journée
        </Button>
      </div>
      
      <!-- Routine Renewal Dialog -->
      <RoutineRenewalDialog
        v-model:visible="showRenewalDialog"
        :routines="expiringRoutines"
        @confirm="handleRenewalConfirm"
      />
      
      <!-- Empty State -->
      <div v-if="!generating && !planningStore.loading && generatedTasks.length === 0" class="flex flex-col items-center justify-center py-12 text-gray-500">
        <p>Aucune tâche générée</p>
        <Button variant="ghost" @click="router.push('/record')" class="mt-4">
          Enregistrer à nouveau
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Clock, Check } from 'lucide-vue-next'
import Header from '~/components/features/Header.vue'
import Button from '~/components/ui/Button.vue'
import RoutineRenewalDialog from '~/components/features/RoutineRenewalDialog.vue'
import { usePlanningStore } from '~/stores/planning'
import { useToast } from '~/composables/useToast'
import { computed, ref, onMounted } from 'vue'

const router = useRouter()
const planningStore = usePlanningStore()

const generating = ref(false)
const validating = ref(false)
const showRenewalDialog = ref(false)
const expiringRoutines = ref<any[]>([])
const pendingRenewalDecisions = ref<Array<{ routineId: string; shouldRenew: boolean }>>([])

// Sort tasks chronologically and group by date
const generatedTasks = computed(() => {
  if (planningStore.generatedPlanning?.tasks) {
    const tasks = [...planningStore.generatedPlanning.tasks]
    // Ensure chronological order
    return tasks.sort((a, b) => {
      const timeA = new Date(a.scheduledAt).getTime()
      const timeB = new Date(b.scheduledAt).getTime()
      return timeA - timeB
    })
  }
  return []
})

// Group tasks by date for intelligent display
const tasksByDate = computed(() => {
  const grouped = new Map<string, any[]>()
  
  generatedTasks.value.forEach(task => {
    const taskDate = new Date(task.scheduledAt)
    const dateKey = taskDate.toISOString().split('T')[0] // YYYY-MM-DD
    
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, [])
    }
    grouped.get(dateKey)!.push(task)
  })
  
  // Convert to array and sort dates
  return Array.from(grouped.entries())
    .map(([date, tasks]) => ({
      date: new Date(date),
      tasks: tasks.sort((a, b) => {
        const timeA = new Date(a.scheduledAt).getTime()
        const timeB = new Date(b.scheduledAt).getTime()
        return timeA - timeB
      })
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
})

// Get unique dates in the planning
const planningDates = computed(() => {
  return tasksByDate.value.map(group => group.date)
})

// Format date intelligently (aujourd'hui, demain, date complète)
const formatDateIntelligently = (date: Date): string => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const taskDate = new Date(date)
  taskDate.setHours(0, 0, 0, 0)
  
  if (taskDate.getTime() === today.getTime()) {
    return "Aujourd'hui"
  }
  
  if (taskDate.getTime() === tomorrow.getTime()) {
    return "Demain"
  }
  
  // For other dates, show full date
  return taskDate.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })
}

// Format date header (shorter version for headers)
const formatDateHeader = (date: Date): string => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const taskDate = new Date(date)
  taskDate.setHours(0, 0, 0, 0)
  
  if (taskDate.getTime() === today.getTime()) {
    return "Aujourd'hui"
  }
  
  if (taskDate.getTime() === tomorrow.getTime()) {
    return "Demain"
  }
  
  // Show date in format: "Lundi 15 janvier"
  return taskDate.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })
}

const handleTaskClick = (task: any) => {
  // If task has a temporary ID (not validated yet), show details in toast
  // Temporary IDs start with "temp-task-"
  if (!task.id || task.id.startsWith('temp-task-') || task.id.startsWith('temp-')) {
    // Task from planning not yet validated - show details in toast
    console.log('[PlanningPage] Task not validated yet, showing details:', task)
    const { info } = useToast()
    
    const taskDetails = [
      `📋 ${task.title}`,
      `⏰ Horaire: ${formatTime(task.scheduledAt)}`,
      `⏳ Durée: ${task.duration} minutes`,
      `🎯 Priorité: ${task.priority || 'MEDIUM'}`,
      task.description ? `📝 ${task.description}` : null,
      task.deadline ? `📅 Deadline: ${formatDate(task.deadline)}` : null
    ].filter(Boolean).join('\n')
    
    info(taskDetails, 6000)
    return
  }
  
  // Task is validated and has a real ID - navigate to task details
  router.push(`/tasks/${task.id}`)
}

const formatDate = (date: Date | string | undefined): string => {
  if (!date) return '--'
  try {
    const d = typeof date === 'string' ? new Date(date) : date
    if (isNaN(d.getTime())) {
      return '--'
    }
    return d.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return '--'
  }
}

const handleValidate = async () => {
  if (!generatedTasks.value.length) {
    const { warning } = useToast()
    warning('Aucune tâche à valider')
    return
  }
  
  try {
    validating.value = true
    console.log('[PlanningPage] Validating planning with tasks:', generatedTasks.value)
    
    const result = await planningStore.validatePlanning(generatedTasks.value, {
      routineRenewals: pendingRenewalDecisions.value.length > 0 ? pendingRenewalDecisions.value : undefined
    })
    
    // Check if renewal decision is required
    if (result && typeof result === 'object' && 'requiresRenewalDecision' in result && result.requiresRenewalDecision) {
      expiringRoutines.value = result.expiringRoutines || []
      showRenewalDialog.value = true
      validating.value = false
      return
    }
    
    console.log('[PlanningPage] Planning validated successfully, navigating to tasks')
    
    // Clear audio log ID
    localStorage.removeItem('current_audio_log_id')
    
    // Small delay to ensure backend has processed everything
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Navigate to tasks
    router.push('/tasks')
  } catch (error: any) {
    console.error('[PlanningPage] Error validating planning:', error)
    const { error: showError } = useToast()
    showError(error.message || 'Erreur lors de la validation du planning')
  } finally {
    validating.value = false
  }
}

const handleRenewalConfirm = async (decisions: Array<{ routineId: string; shouldRenew: boolean }>) => {
  pendingRenewalDecisions.value = decisions
  // Retry validation with renewal decisions
  await handleValidate()
}

const formatTime = (date: Date | string | undefined): string => {
  if (!date) return '--:--'
  try {
    const d = typeof date === 'string' ? new Date(date) : date
    if (isNaN(d.getTime())) {
      console.warn('[PlanningPage] Invalid date for formatTime:', date)
      return '--:--'
    }
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  } catch (error) {
    console.error('[PlanningPage] Error formatting time:', error, date)
    return '--:--'
  }
}

onMounted(async () => {
  // If no planning generated yet, generate it from transcription
  if (!planningStore.generatedPlanning) {
    const { useAudioStore } = await import('~/stores/audio')
    const audioStore = useAudioStore()
    
    if (audioStore.transcription) {
      generating.value = true
      try {
        await planningStore.generatePlanning(audioStore.transcription, new Date())
      } catch (error: any) {
        console.error('Error generating planning:', error)
        const { error: showError } = useToast()
        showError(error.message || 'Erreur lors de la génération du planning')
        router.push('/home')
      } finally {
        generating.value = false
      }
    } else {
      // No transcription available, redirect to home
      router.push('/home')
    }
  }
})

useHead({
  title: 'Planning - Zeii'
})
</script>

