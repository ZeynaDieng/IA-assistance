<template>
  <div
    class="min-h-screen flex flex-col bg-white dark:bg-[#0D0F33] transition-colors duration-300 pb-safe-bottom"
  >
    <!-- Header -->
    <div class="px-4 pt-safe-top pb-4 flex items-center gap-3">
      <button
        class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95 transition-all"
        @click="router.back()"
        aria-label="Retour"
      >
        <X :size="18" class="text-gray-600 dark:text-gray-400" />
      </button>
      <h1 class="text-xl font-bold text-gray-900 dark:text-white">
        Transcription
      </h1>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto px-4 pb-24">
      <!-- Transcription Text -->
      <div
        class="p-4 rounded-xl mb-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
      >
        <div v-if="isEditing" class="space-y-3">
          <textarea
            v-model="editedTranscription"
            class="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none min-h-[120px]"
            placeholder="Modifiez votre transcription..."
            @input="handleTextareaResize"
            ref="textareaRef"
          />
          <div class="flex items-center justify-between">
            <span class="text-xs text-gray-500 dark:text-gray-400">
              {{ editedTranscription.length }} caractères
            </span>
            <div class="flex gap-2">
              <button
                class="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-95 transition-all"
                @click="cancelEdit"
              >
                Annuler
              </button>
              <button
                class="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 active:scale-95 transition-all"
                @click="saveEdit"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
        <div v-else>
          <p
            v-if="transcription"
            class="text-base leading-relaxed text-gray-900 dark:text-white mb-3"
          >
            "{{ transcription }}"
          </p>
          <div
            v-else
            class="flex flex-col items-center justify-center py-12 text-gray-400"
          >
            <Loader2 :size="32" class="animate-spin mb-3" />
            <p>Chargement de la transcription...</p>
          </div>
        </div>
      </div>

      <!-- Detected Tasks Preview -->
      <div v-if="detectedTasks.length > 0" class="mb-4">
        <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
          Tâches détectées ({{ detectedTasks.length }})
        </h3>
        <div class="space-y-2">
          <div
            v-for="(task, index) in detectedTasks"
            :key="index"
            class="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-start gap-3"
          >
            <div
              :class="[
                'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                getPriorityColor(task.priority)
              ]"
            >
              <Check :size="16" class="text-white" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white mb-1">
                {{ task.title }}
              </p>
              <div class="flex items-center gap-2 flex-wrap">
                <span
                  v-if="task.duration"
                  class="text-xs px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                >
                  {{ task.duration }} min
                </span>
                <span
                  v-if="task.priority"
                  :class="[
                    'text-xs px-2 py-1 rounded-lg',
                    getPriorityBadgeClass(task.priority)
                  ]"
                >
                  {{ getPriorityLabel(task.priority) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Detected Routines -->
      <div v-if="detectedRoutines.length > 0" class="mb-4">
        <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
          Routines détectées ({{ detectedRoutines.length }})
        </h3>
        <div class="space-y-2">
          <div
            v-for="(routine, index) in detectedRoutines"
            :key="index"
            class="p-4 rounded-xl bg-primary/10 dark:bg-primary/20 border border-primary/20 flex items-start justify-between gap-3"
          >
            <div class="flex-1">
              <p class="font-medium text-primary dark:text-primary mb-1">
                {{ routine.title }}
              </p>
              <p class="text-xs text-gray-600 dark:text-gray-400 mb-2">
                {{ formatRoutineFrequency(routine) }}
                <span v-if="routine.time"> à {{ routine.time }}</span>
              </p>
              <p
                v-if="routine.description"
                class="text-xs text-gray-500 dark:text-gray-500"
              >
                {{ routine.description }}
              </p>
            </div>
            <button
              @click="handleCreateRoutine(routine)"
              class="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 active:scale-95 transition-all flex-shrink-0"
            >
              Créer
            </button>
          </div>
        </div>
      </div>

      <!-- Retry Status (Rate Limit) -->
      <div
        v-if="planningStore.retryStatus?.waiting"
        class="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl"
      >
        <div class="flex items-center gap-3 mb-2">
          <Loader2 :size="20" class="animate-spin text-yellow-600 dark:text-yellow-400" />
          <span class="font-medium text-yellow-800 dark:text-yellow-300 text-sm">
            Limite de traitement atteinte
          </span>
        </div>
        <p class="text-sm text-yellow-700 dark:text-yellow-400">
          Réessai automatique dans {{ planningStore.retryStatus.retryAfter }} seconde{{ planningStore.retryStatus.retryAfter > 1 ? 's' : '' }}...
        </p>
      </div>

      <!-- Actions -->
      <div class="space-y-3">
        <button
          class="w-full p-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95 transition-all flex items-center justify-center gap-2"
          @click="handleEdit"
          :disabled="!transcription || generating || planningStore.retryStatus?.waiting"
        >
          <Edit3 :size="18" />
          {{ isEditing ? 'Modifier le texte' : 'Modifier le texte' }}
        </button>

        <button
          class="w-full p-4 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md"
          :disabled="!transcription || generating || planningStore.retryStatus?.waiting"
          @click="handleGenerate"
        >
          <Loader2
            v-if="generating || planningStore.retryStatus?.waiting"
            :size="18"
            class="animate-spin"
          />
          <Play v-else :size="18" />
          {{
            planningStore.retryStatus?.waiting
              ? `Attente... (${planningStore.retryStatus.retryAfter}s)`
              : generating
              ? 'Génération en cours...'
              : 'Générer le Planning'
          }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { X, Edit3, Play, Loader2, Check } from 'lucide-vue-next'
import { useAudioStore } from '~/stores/audio'
import { usePlanningStore } from '~/stores/planning'
import { useRoutinesStore } from '~/stores/routines'
import { useToast } from '~/composables/useToast'

const router = useRouter()
const audioStore = useAudioStore()
const planningStore = usePlanningStore()
const routinesStore = useRoutinesStore()
const { success, error } = useToast()

const transcription = ref('')
const editedTranscription = ref('')
const isEditing = ref(false)
const generating = ref(false)
const detectedRoutines = ref<any[]>([])
const detectedTasks = ref<any[]>([])
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const formatRoutineFrequency = (routine: any): string => {
  switch (routine.frequency) {
    case 'DAILY':
      return 'Tous les jours'
    case 'WEEKDAYS':
      return 'En semaine'
    case 'WEEKENDS':
      return 'Weekend'
    case 'WEEKLY':
    case 'CUSTOM':
      if (routine.daysOfWeek && routine.daysOfWeek.length > 0) {
        const dayNames: Record<string, string> = {
          MONDAY: 'Lun',
          TUESDAY: 'Mar',
          WEDNESDAY: 'Mer',
          THURSDAY: 'Jeu',
          FRIDAY: 'Ven',
          SATURDAY: 'Sam',
          SUNDAY: 'Dim',
        }
        return routine.daysOfWeek.map((d: string) => dayNames[d] || d).join(', ')
      }
      return 'Personnalisé'
    default:
      return routine.frequency || 'Personnalisé'
  }
}

const getPriorityColor = (priority?: string) => {
  switch (priority?.toUpperCase()) {
    case 'HIGH':
    case 'URGENT':
      return 'bg-red-500'
    case 'MEDIUM':
      return 'bg-yellow-500'
    case 'LOW':
      return 'bg-primary'
    default:
      return 'bg-gray-400'
  }
}

const getPriorityBadgeClass = (priority?: string) => {
  switch (priority?.toUpperCase()) {
    case 'HIGH':
    case 'URGENT':
      return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
    case 'MEDIUM':
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
    case 'LOW':
      return 'bg-primary/20 text-primary'
    default:
      return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
  }
}

const getPriorityLabel = (priority?: string) => {
  switch (priority?.toUpperCase()) {
    case 'HIGH':
      return 'Élevée'
    case 'URGENT':
      return 'Urgente'
    case 'MEDIUM':
      return 'Moyenne'
    case 'LOW':
      return 'Basse'
    default:
      return priority || 'Normale'
  }
}

const handleEdit = () => {
  if (!transcription.value) return
  isEditing.value = true
  editedTranscription.value = transcription.value
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.focus()
      handleTextareaResize()
    }
  })
}

const cancelEdit = () => {
  isEditing.value = false
  editedTranscription.value = ''
}

const saveEdit = () => {
  if (!editedTranscription.value.trim()) {
    error('La transcription ne peut pas être vide')
    return
  }
  transcription.value = editedTranscription.value.trim()
  audioStore.transcription = transcription.value
  isEditing.value = false
  success('Transcription modifiée')
}

const handleTextareaResize = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`
  }
}

const handleCreateRoutine = async (routine: any) => {
  try {
    const routineData: any = {
      title: routine.title,
      description: routine.description || undefined,
      frequency: routine.frequency,
      time: routine.time || undefined,
      daysOfWeek:
        routine.daysOfWeek && Array.isArray(routine.daysOfWeek)
          ? routine.daysOfWeek
          : [],
      duration: routine.duration,
      priority: routine.priority || 'MEDIUM',
      isActive: true,
    }

    await routinesStore.createRoutine(routineData)

    detectedRoutines.value = detectedRoutines.value.filter((r) => r !== routine)

    success('Routine créée avec succès !')
  } catch (err: any) {
    console.error('Error creating routine:', err)
    error('Erreur lors de la création de la routine')
  }
}

const handleGenerate = async () => {
  if (!transcription.value) return

  generating.value = true
  planningStore.retryStatus = null

  try {
    const result = await planningStore.extractTasks(transcription.value)

    planningStore.retryStatus = null

    if (result.routines && result.routines.length > 0) {
      detectedRoutines.value = result.routines
    }

    if (result.tasks && result.tasks.length > 0) {
      detectedTasks.value = result.tasks
    }

    router.push('/planning')
  } catch (err: any) {
    console.error('Error generating planning:', err)

    if (err.message && !err.message.includes('Limite de traitement')) {
      planningStore.retryStatus = null
    }

    error(err.message || 'Erreur lors de la génération du planning. Veuillez réessayer.')
  } finally {
    generating.value = false
  }
}

onMounted(async () => {
  if (audioStore.transcription) {
    transcription.value = audioStore.transcription
  } else {
    const audioLogId = localStorage.getItem('current_audio_log_id')
    if (audioLogId) {
      try {
        const trans = await audioStore.transcribeAudio(audioLogId)
        if (trans) {
          transcription.value = trans
        }
      } catch (err) {
        console.error('Error fetching transcription:', err)
      }
    }
  }

  if (transcription.value) {
    try {
      const result = await planningStore.extractTasks(transcription.value)
      if (result.routines && result.routines.length > 0) {
        detectedRoutines.value = result.routines
      }
      if (result.tasks && result.tasks.length > 0) {
        detectedTasks.value = result.tasks
      }
    } catch (err: any) {
      if (err.message && !err.message.includes('Limite de traitement')) {
        console.error('Error extracting routines:', err)
      }
    }
  }
})

useHead({
  title: 'Transcription - Zeii',
})
</script>
