<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    @click.self="handleClose"
  >
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
          Routines expirant bientôt
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Certaines routines expirent dans les 7 prochains jours. Souhaitez-vous les renouveler ?
        </p>
      </div>

      <!-- Routines List -->
      <div class="p-6 space-y-4">
        <div
          v-for="routine in routines"
          :key="routine.id"
          class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900 dark:text-white">
                {{ routine.title }}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Expire le {{ formatExpirationDate(routine.expiresAt) }}
              </p>
            </div>
            <span
              v-if="routine.autoRenew"
              class="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-md"
            >
              Auto-renouvellement
            </span>
          </div>

          <!-- Toggle -->
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">
              Renouveler pour 1 mois supplémentaire ?
            </span>
            <button
              @click="toggleRenewal(routine.id)"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                renewalDecisions[routine.id] 
                  ? 'bg-primary' 
                  : 'bg-gray-200 dark:bg-gray-700'
              ]"
            >
              <span
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  renewalDecisions[routine.id] ? 'translate-x-6' : 'translate-x-1'
                ]"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
        <Button variant="ghost" @click="handleClose" class="flex-1">
          Ignorer
        </Button>
        <Button variant="success" @click="handleConfirm" class="flex-1">
          Confirmer
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import Button from '~/components/ui/Button.vue'

interface Routine {
  id: string
  title: string
  expiresAt: string
  autoRenew: boolean
}

interface Props {
  visible: boolean
  routines: Routine[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  confirm: [decisions: Array<{ routineId: string; shouldRenew: boolean }>]
}>()

const renewalDecisions = reactive<Record<string, boolean>>({})

watch(() => props.routines, (newRoutines) => {
  // Initialize decisions: default to autoRenew value or true
  newRoutines.forEach(routine => {
    if (!(routine.id in renewalDecisions)) {
      renewalDecisions[routine.id] = routine.autoRenew ?? true
    }
  })
}, { immediate: true })

const toggleRenewal = (routineId: string) => {
  renewalDecisions[routineId] = !renewalDecisions[routineId]
}

const formatExpirationDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  } catch {
    return dateStr
  }
}

const handleClose = () => {
  emit('update:visible', false)
}

const handleConfirm = () => {
  const decisions = props.routines.map(routine => ({
    routineId: routine.id,
    shouldRenew: renewalDecisions[routine.id] ?? routine.autoRenew ?? true
  }))
  
  emit('confirm', decisions)
  emit('update:visible', false)
}
</script>

