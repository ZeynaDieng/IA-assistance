<template>
  <div class="h-full flex flex-col pt-20 safe-top safe-bottom overflow-hidden">
    <!-- Header -->
    <Header
      title="Mes Routines"
      :show-back="false"
    />
    
    <!-- Content -->
    <div class="flex-1 overflow-y-auto p-4 pb-24">
      <!-- Add Routine Button -->
      <Button
        variant="primary"
        :icon="Plus"
        class="mb-6"
        @click="showCreateModal = true"
      >
        Nouvelle Routine
      </Button>

      <!-- Loading State -->
      <div v-if="routinesStore.loading && routinesStore.routines.length === 0" class="flex flex-col items-center justify-center py-12">
        <Loader2 :size="48" class="animate-spin text-primary mb-4" />
        <p class="text-gray-500 dark:text-gray-400">Chargement des routines...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="routinesStore.routines.length === 0" class="flex flex-col items-center justify-center py-12">
        <Calendar :size="64" class="text-gray-300 dark:text-gray-600 mb-4" />
        <p class="text-gray-500 dark:text-gray-400 text-center mb-2">Aucune routine</p>
        <p class="text-gray-400 dark:text-gray-500 text-sm text-center">Créez votre première routine pour automatiser vos habitudes</p>
      </div>

      <!-- Routines List -->
      <div v-else class="space-y-4">
        <div
          v-for="routine in routinesStore.routines"
          :key="routine.id"
          class="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <h3 class="font-bold text-lg dark:text-white">{{ routine.title }}</h3>
                <span
                  :class="[
                    'px-2 py-1 rounded-lg text-xs font-medium',
                    routine.isActive
                      ? 'bg-success/20 text-success'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  ]"
                >
                  {{ routine.isActive ? 'Active' : 'Inactive' }}
                </span>
              </div>
              <p v-if="routine.description" class="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {{ routine.description }}
              </p>
              <div class="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span class="flex items-center gap-1">
                  <Repeat :size="14" />
                  {{ formatFrequency(routine) }}
                </span>
                <span v-if="routine.time" class="flex items-center gap-1">
                  <Clock :size="14" />
                  {{ routine.time }}
                </span>
                <span class="flex items-center gap-1">
                  <Timer :size="14" />
                  {{ routine.duration }} min
                </span>
                <span v-if="routine.expiresAt" class="flex items-center gap-1">
                  <Calendar :size="14" />
                  Expire le {{ formatExpirationDate(routine.expiresAt) }}
                </span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="handleToggleActive(routine.id)"
                class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                :title="routine.isActive ? 'Désactiver' : 'Activer'"
              >
                <Power
                  :size="20"
                  :class="routine.isActive ? 'text-success' : 'text-gray-400'"
                />
              </button>
              <button
                v-if="routine.isActive"
                @click="handleDeactivate(routine.id)"
                class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Désactiver définitivement"
              >
                <Power :size="20" class="text-orange-400" />
              </button>
              <button
                @click="handleEdit(routine)"
                class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Modifier"
              >
                <Edit3 :size="20" class="text-gray-400" />
              </button>
              <button
                @click="handleDelete(routine.id)"
                class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Supprimer"
              >
                <Trash2 :size="20" class="text-red-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <RoutineModal
      v-if="showCreateModal || editingRoutine"
      :routine="editingRoutine"
      @close="handleCloseModal"
      @save="handleSaveRoutine"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, Calendar, Loader2, Repeat, Clock, Timer, Power, Edit3, Trash2 } from 'lucide-vue-next'

const formatExpirationDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const expDate = new Date(date)
    expDate.setHours(0, 0, 0, 0)
    
    const diffTime = expDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) {
      return `expiré`
    } else if (diffDays === 0) {
      return `aujourd'hui`
    } else if (diffDays === 1) {
      return `demain`
    } else if (diffDays <= 7) {
      return `dans ${diffDays} jours`
    }
    
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    })
  } catch {
    return dateStr
  }
}
// Header is handled by default layout
import Button from '~/components/ui/Button.vue'
import RoutineModal from '~/components/features/RoutineModal.vue'
import { useRoutinesStore, type Routine } from '~/stores/routines'
import { useConfirm } from '~/composables/useConfirm'
import { useToast } from '~/composables/useToast'

const router = useRouter()
const routinesStore = useRoutinesStore()

const showCreateModal = ref(false)
const editingRoutine = ref<Routine | null>(null)

const formatFrequency = (routine: Routine): string => {
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
          SUNDAY: 'Dim'
        }
        return routine.daysOfWeek.map(d => dayNames[d] || d).join(', ')
      }
      return 'Personnalisé'
    default:
      return routine.frequency
  }
}

const handleToggleActive = async (id: string) => {
  try {
    await routinesStore.toggleActive(id)
  } catch (error) {
    console.error('Error toggling routine:', error)
  }
}

const handleDeactivate = async (id: string) => {
  const { confirm } = useConfirm()
  const confirmed = await confirm({
    message: 'Voulez-vous désactiver cette routine ? Elle ne générera plus de tâches automatiquement.',
    title: 'Désactiver la routine',
    variant: 'warning'
  })
  
  if (!confirmed) {
    return
  }

  try {
    await routinesStore.deactivate(id)
    const { success } = useToast()
    success('Routine désactivée avec succès')
  } catch (error: any) {
    console.error('Error deactivating routine:', error)
    const { error: showError } = useToast()
    showError(error.message || 'Erreur lors de la désactivation')
  }
}

const handleEdit = (routine: Routine) => {
  editingRoutine.value = routine
}

const handleDelete = async (id: string) => {
  const { confirm } = useConfirm()
  const confirmed = await confirm({
    message: 'Êtes-vous sûr de vouloir supprimer cette routine ?',
    title: 'Supprimer la routine',
    variant: 'warning'
  })
  
  if (!confirmed) {
    return
  }

  try {
    await routinesStore.deleteRoutine(id)
  } catch (error) {
    console.error('Error deleting routine:', error)
  }
}

const handleCloseModal = () => {
  showCreateModal.value = false
  editingRoutine.value = null
}

const handleSaveRoutine = async (routineData: any) => {
  try {
    if (editingRoutine.value) {
      await routinesStore.updateRoutine(editingRoutine.value.id, routineData)
    } else {
      await routinesStore.createRoutine(routineData)
    }
    handleCloseModal()
  } catch (error) {
    console.error('Error saving routine:', error)
  }
}

onMounted(async () => {
  await routinesStore.loadRoutines(true) // Load all routines including inactive
})

useHead({
  title: 'Routines - Zeii'
})
</script>

