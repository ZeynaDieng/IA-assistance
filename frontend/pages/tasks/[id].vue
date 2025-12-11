<template>
  <div
    class="min-h-screen flex flex-col bg-white dark:bg-[#0D0F33] transition-colors duration-300 pb-safe-bottom"
  >
    <!-- Loading State -->
    <div
      v-if="loading && !task"
      class="flex-1 flex items-center justify-center"
    >
      <Loader2 :size="48" class="animate-spin text-primary" />
    </div>

    <!-- Task Details -->
    <div v-else-if="task" class="flex-1 overflow-y-auto">
      <div class="px-4 pt-6 pb-24">
        <!-- Status Badge -->
        <div class="mb-6">
          <span
            :class="[
              'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium',
              task.status === 'COMPLETED' || task.status === 'completed'
                ? 'bg-success/10 text-success dark:bg-success/20'
                : task.status === 'IN_PROGRESS'
                ? 'bg-primary/10 text-primary dark:bg-primary/20'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
            ]"
          >
            <Check
              v-if="task.status === 'COMPLETED' || task.status === 'completed'"
              :size="16"
            />
            <span v-else class="w-2 h-2 rounded-full bg-current"></span>
            {{
              task.status === 'COMPLETED' || task.status === 'completed'
                ? 'Complétée'
                : task.status === 'IN_PROGRESS'
                ? 'En cours'
                : 'À faire'
            }}
          </span>
        </div>

        <!-- Title -->
        <div class="mb-6">
          <h1
            :class="[
              'text-3xl font-bold mb-2',
              task.status === 'COMPLETED' || task.status === 'completed'
                ? 'line-through text-gray-400 dark:text-gray-500'
                : 'text-gray-900 dark:text-white',
            ]"
          >
            {{ task.title }}
          </h1>
          <p
            v-if="task.description"
            class="text-gray-600 dark:text-gray-300 leading-relaxed"
          >
            {{ task.description }}
          </p>
        </div>

        <!-- Info Cards -->
        <div class="space-y-3 mb-6">
          <!-- Time & Duration -->
          <div
            class="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700"
          >
            <div class="grid grid-cols-2 gap-4">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0"
                >
                  <Clock :size="18" class="text-primary" />
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                    Horaire
                  </p>
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">
                    {{ formatTime(task.scheduledAt) }}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0"
                >
                  <Timer :size="18" class="text-primary" />
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                    Durée
                  </p>
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">
                    {{
                      typeof task.duration === 'number'
                        ? task.duration
                        : parseInt(task.duration) || 0
                    }}
                    min
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Priority & Deadline -->
          <div
            class="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0"
                >
                  <Flag :size="18" class="text-primary" />
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                    Priorité
                  </p>
                  <span
                    :class="[
                      'px-3 py-1 rounded-lg text-xs font-medium',
                      priorityBadgeClasses[getPriorityKey(task.priority)] ||
                        priorityBadgeClasses['low'],
                    ]"
                  >
                    {{
                      priorityLabels[getPriorityKey(task.priority)] || 'Normal'
                    }}
                  </span>
                </div>
              </div>

              <div v-if="task.deadline" class="flex items-center gap-3">
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-0.5 text-right">
                    Deadline
                  </p>
                  <p
                    class="text-sm font-semibold text-gray-900 dark:text-white text-right"
                  >
                    {{ formatDate(task.deadline) }}
                  </p>
                </div>
                <div
                  class="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0"
                >
                  <Calendar :size="18" class="text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="space-y-3">
          <Button
            v-if="task.status !== 'COMPLETED' && task.status !== 'completed'"
            variant="success"
            size="lg"
            :icon="Check"
            @click="handleComplete"
            :loading="actionLoading"
            class="w-full"
          >
            Marquer comme complétée
          </Button>

          <div class="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="lg"
              :icon="Edit3"
              @click="handleEdit"
              :disabled="actionLoading"
              class="w-full"
            >
              Modifier
            </Button>

            <Button
              variant="outline"
              size="lg"
              :icon="Calendar"
              @click="handlePostpone"
              :disabled="actionLoading"
              class="w-full"
            >
              Reporter
            </Button>
          </div>

          <Button
            variant="ghost"
            size="lg"
            :icon="Trash2"
            @click="handleDelete"
            :disabled="actionLoading"
            class="w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            Supprimer
          </Button>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else
      class="flex-1 flex flex-col items-center justify-center p-6 text-center"
    >
      <div
        class="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4"
      >
        <AlertCircle :size="40" class="text-red-500" />
      </div>
      <h3 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">
        Tâche introuvable
      </h3>
      <p class="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
        Cette tâche n'existe pas ou a été supprimée.
      </p>
      <Button variant="primary" @click="router.push('/tasks')">
        Retour aux tâches
      </Button>
    </div>

    <!-- Postpone Modal -->
    <Modal
      :visible="showPostponeModal"
      @update:visible="showPostponeModal = $event"
      title="Reporter la tâche"
    >
      <div class="space-y-4">
        <p class="text-sm text-gray-600 dark:text-gray-300">
          Choisissez une nouvelle date pour cette tâche :
        </p>
        <input
          v-model="postponeDate"
          type="date"
          :min="new Date().toISOString().split('T')[0]"
          class="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <input
          v-model="postponeTime"
          type="time"
          class="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <div class="flex gap-3 pt-2">
          <Button
            variant="ghost"
            class="flex-1"
            @click="showPostponeModal = false"
          >
            Annuler
          </Button>
          <Button
            variant="primary"
            class="flex-1"
            @click="confirmPostpone"
            :loading="actionLoading"
          >
            Confirmer
          </Button>
        </div>
      </div>
    </Modal>

    <!-- Edit Modal -->
    <Modal
      :visible="showEditModal"
      @update:visible="showEditModal = $event"
      title="Modifier la tâche"
    >
      <div class="space-y-4">
        <div>
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Titre
          </label>
          <input
            v-model="editForm.title"
            type="text"
            class="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Titre de la tâche"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Description
          </label>
          <textarea
            v-model="editForm.description"
            rows="3"
            class="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            placeholder="Description (optionnel)"
          ></textarea>
        </div>
        <div class="flex gap-3 pt-2">
          <Button
            variant="ghost"
            class="flex-1"
            @click="showEditModal = false"
          >
            Annuler
          </Button>
          <Button
            variant="primary"
            class="flex-1"
            @click="confirmEdit"
            :loading="actionLoading"
          >
            Enregistrer
          </Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue'
import {
  Clock,
  Check,
  Edit3,
  Calendar,
  Trash2,
  AlertCircle,
  Loader2,
  Timer,
  Flag,
} from 'lucide-vue-next'
import Button from '~/components/ui/Button.vue'
import Modal from '~/components/ui/Modal.vue'
import { useTasksStore } from '~/stores/tasks'
import { useToast } from '~/composables/useToast'
import { useConfirm } from '~/composables/useConfirm'

const route = useRoute()
const router = useRouter()
const tasksStore = useTasksStore()
const { showToast, success, error: showError } = useToast()
const { confirm } = useConfirm()

const task = ref<any>(null)
const loading = ref(true)
const actionLoading = ref(false)
const showPostponeModal = ref(false)
const showEditModal = ref(false)
const postponeDate = ref('')
const postponeTime = ref('')
const editForm = ref({
  title: '',
  description: '',
})

// Update route meta for header (handled by layout)
watchEffect(() => {
  if (!route.meta) {
    route.meta = {}
  }
  if (task.value) {
    route.meta.headerTitle = task.value.title
    route.meta.headerShowBack = true
  }
})

const priorityBadgeClasses: Record<string, string> = {
  urgent: 'bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400',
  high: 'bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400',
  medium: 'bg-yellow-50 text-yellow-500 dark:bg-yellow-900/20 dark:text-yellow-400',
  low: 'bg-purple-50 text-purple-500 dark:bg-purple-900/20 dark:text-purple-400',
  // Backend enum values
  URGENT: 'bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400',
  HIGH: 'bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400',
  MEDIUM: 'bg-yellow-50 text-yellow-500 dark:bg-yellow-900/20 dark:text-yellow-400',
  LOW: 'bg-purple-50 text-purple-500 dark:bg-purple-900/20 dark:text-purple-400'
}

const priorityLabels: Record<string, string> = {
  urgent: 'Urgent',
  high: 'Urgent',
  medium: 'Moyen',
  low: 'Normal',
  // Backend enum values
  URGENT: 'Urgent',
  HIGH: 'Urgent',
  MEDIUM: 'Moyen',
  LOW: 'Normal'
}

// Normalize priority to lowercase for consistent display
const getPriorityKey = (priority: string | undefined): string => {
  if (!priority) return 'low'
  return priority.toLowerCase()
}

const formatTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

const formatDate = (date: Date | string | undefined): string => {
  if (!date) return 'Non défini'
  try {
    const d = typeof date === 'string' ? new Date(date) : date
    if (isNaN(d.getTime())) {
      console.warn('[TaskDetail] Invalid date for formatDate:', date)
      return 'Date invalide'
    }
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch (error) {
    console.error('[TaskDetail] Error formatting date:', error, date)
    return 'Date invalide'
  }
}

const handleComplete = async () => {
  if (!task.value) return

  try {
    actionLoading.value = true
    await tasksStore.completeTask(task.value.id)
    // Reload task to get updated data
    const updatedTask = await tasksStore.getTask(task.value.id)
    if (updatedTask) {
      task.value = updatedTask
    }
    success('Tâche marquée comme complétée !')
    // Navigate back after a short delay
    setTimeout(() => {
      router.back()
    }, 1000)
  } catch (err: any) {
    console.error('Error completing task:', err)
    showError(err.message || 'Erreur lors de la complétion de la tâche')
  } finally {
    actionLoading.value = false
  }
}

const handleEdit = () => {
  if (!task.value) return
  editForm.value = {
    title: task.value.title,
    description: task.value.description || '',
  }
  showEditModal.value = true
}

const confirmEdit = async () => {
  if (!task.value) return

  try {
    actionLoading.value = true
    await tasksStore.updateTask(task.value.id, {
      title: editForm.value.title,
      description: editForm.value.description || undefined,
    })
    // Reload task
    const updatedTask = await tasksStore.getTask(task.value.id)
    if (updatedTask) {
      task.value = updatedTask
    }
    success('Tâche modifiée avec succès !')
    showEditModal.value = false
  } catch (err: any) {
    console.error('Error updating task:', err)
    showError(err.message || 'Erreur lors de la modification de la tâche')
  } finally {
    actionLoading.value = false
  }
}

const handlePostpone = () => {
  if (!task.value) return
  const scheduledDate = new Date(task.value.scheduledAt)
  postponeDate.value = scheduledDate.toISOString().split('T')[0]
  postponeTime.value = scheduledDate.toTimeString().slice(0, 5)
  showPostponeModal.value = true
}

const confirmPostpone = async () => {
  if (!task.value || !postponeDate.value || !postponeTime.value) return

  try {
    actionLoading.value = true
    const [hours, minutes] = postponeTime.value.split(':').map(Number)
    const newDate = new Date(postponeDate.value)
    newDate.setHours(hours, minutes, 0, 0)

    await tasksStore.postponeTask(task.value.id, newDate)
    // Reload task
    const updatedTask = await tasksStore.getTask(task.value.id)
    if (updatedTask) {
      task.value = updatedTask
    }
    success('Tâche reportée avec succès !')
    showPostponeModal.value = false
  } catch (err: any) {
    console.error('Error postponing task:', err)
    showError(err.message || 'Erreur lors du report de la tâche')
  } finally {
    actionLoading.value = false
  }
}

const handleDelete = async () => {
  if (!task.value) return

  const confirmed = await confirm({
    message: 'Êtes-vous sûr de vouloir supprimer cette tâche ?',
    title: 'Supprimer la tâche',
    variant: 'warning',
  })

  if (confirmed) {
    try {
      actionLoading.value = true
      await tasksStore.deleteTask(task.value.id)
      success('Tâche supprimée avec succès !')
      setTimeout(() => {
        router.back()
      }, 500)
    } catch (err: any) {
      console.error('Error deleting task:', err)
      showError(err.message || 'Erreur lors de la suppression de la tâche')
      actionLoading.value = false
    }
  }
}

onMounted(async () => {
  const taskId = route.params.id as string
  
  console.log('[TaskDetail] Loading task with ID:', taskId)
  
  try {
    // First, try to find task in store (already loaded)
    const existingTask = tasksStore.tasks.find(t => t.id === taskId)
    if (existingTask) {
      console.log('[TaskDetail] Found task in store:', existingTask.title)
      task.value = existingTask
      loading.value = false
      return
    }
    
    // If not found in store, try to load all tasks first (maybe they weren't loaded yet)
    if (tasksStore.tasks.length === 0) {
      console.log('[TaskDetail] Store is empty, loading all tasks first')
      await tasksStore.loadTasks()
      
      const taskAfterLoad = tasksStore.tasks.find(t => t.id === taskId)
      if (taskAfterLoad) {
        console.log('[TaskDetail] Found task after loading all tasks:', taskAfterLoad.title)
        task.value = taskAfterLoad
        loading.value = false
        return
      }
    }
    
    // If still not found, load directly from API
    console.log('[TaskDetail] Task not in store, loading from API')
    const loadedTask = await tasksStore.getTask(taskId)
    if (loadedTask) {
      console.log('[TaskDetail] Loaded task from API:', loadedTask.title)
      task.value = loadedTask
    } else {
      // Task not found
      console.warn('[TaskDetail] Task not found with ID:', taskId)
      task.value = null
    }
  } catch (error: any) {
    console.error('[TaskDetail] Error loading task:', error)
    task.value = null
  } finally {
    loading.value = false
  }
})

useHead({
  title: 'Détail Tâche - Zeii'
})
</script>

