<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="$emit('close')">
    <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold dark:text-white">
          {{ routine ? 'Modifier la routine' : 'Nouvelle routine' }}
        </h2>
        <button
          @click="$emit('close')"
          class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <X :size="20" class="text-gray-400" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium mb-2 dark:text-gray-300">
            Titre *
          </label>
          <Input
            v-model="formData.title"
            placeholder="Ex: Boire de l'eau"
            required
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium mb-2 dark:text-gray-300">
            Description
          </label>
          <textarea
            v-model="formData.description"
            class="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            rows="3"
            placeholder="Description optionnelle"
          />
        </div>

        <!-- Frequency -->
        <div>
          <label class="block text-sm font-medium mb-2 dark:text-gray-300">
            Fréquence *
          </label>
          <select
            v-model="formData.frequency"
            class="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            required
            @change="handleFrequencyChange"
          >
            <option value="DAILY">Tous les jours</option>
            <option value="WEEKDAYS">En semaine (Lun-Ven)</option>
            <option value="WEEKENDS">Weekend (Sam-Dim)</option>
            <option value="WEEKLY">Hebdomadaire (jours spécifiques)</option>
            <option value="CUSTOM">Personnalisé</option>
          </select>
        </div>

        <!-- Days of Week (for WEEKLY and CUSTOM) -->
        <div v-if="formData.frequency === 'WEEKLY' || formData.frequency === 'CUSTOM'">
          <label class="block text-sm font-medium mb-2 dark:text-gray-300">
            Jours de la semaine *
          </label>
          <div class="grid grid-cols-7 gap-2">
            <button
              v-for="day in weekDays"
              :key="day.value"
              type="button"
              @click="toggleDay(day.value)"
              :class="[
                'p-3 rounded-xl text-sm font-medium transition-colors',
                formData.daysOfWeek?.includes(day.value)
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              ]"
            >
              {{ day.label }}
            </button>
          </div>
        </div>

        <!-- Time -->
        <div>
          <label class="block text-sm font-medium mb-2 dark:text-gray-300">
            Heure (optionnel)
          </label>
          <Input
            v-model="formData.time"
            type="time"
            placeholder="HH:mm"
          />
        </div>

        <!-- Duration -->
        <div>
          <label class="block text-sm font-medium mb-2 dark:text-gray-300">
            Durée (minutes) *
          </label>
          <Input
            v-model.number="formData.duration"
            type="number"
            min="1"
            placeholder="30"
            required
          />
        </div>

        <!-- Priority -->
        <div>
          <label class="block text-sm font-medium mb-2 dark:text-gray-300">
            Priorité *
          </label>
          <select
            v-model="formData.priority"
            class="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            required
          >
            <option value="LOW">Basse</option>
            <option value="MEDIUM">Moyenne</option>
            <option value="HIGH">Élevée</option>
            <option value="URGENT">Urgente</option>
          </select>
        </div>

        <!-- Actions -->
        <div class="flex gap-4 pt-4">
          <Button
            type="button"
            variant="ghost"
            class="flex-1"
            @click="$emit('close')"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="primary"
            class="flex-1"
            :disabled="!isFormValid"
          >
            {{ routine ? 'Modifier' : 'Créer' }}
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { X } from 'lucide-vue-next'
import Input from '~/components/ui/Input.vue'
import Button from '~/components/ui/Button.vue'
import type { Routine } from '~/stores/routines'

interface Props {
  routine?: Routine | null
}

const props = withDefaults(defineProps<Props>(), {
  routine: null
})

const emit = defineEmits<{
  close: []
  save: [data: any]
}>()

const weekDays = [
  { value: 'MONDAY', label: 'L' },
  { value: 'TUESDAY', label: 'M' },
  { value: 'WEDNESDAY', label: 'M' },
  { value: 'THURSDAY', label: 'J' },
  { value: 'FRIDAY', label: 'V' },
  { value: 'SATURDAY', label: 'S' },
  { value: 'SUNDAY', label: 'D' }
]

const formData = ref({
  title: '',
  description: '',
  frequency: 'DAILY' as 'DAILY' | 'WEEKLY' | 'WEEKDAYS' | 'WEEKENDS' | 'CUSTOM',
  time: '',
  daysOfWeek: [] as string[],
  duration: 30,
  priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
  isActive: true
})

// Initialize form with routine data if editing
watch(() => props.routine, (routine) => {
  if (routine) {
    formData.value = {
      title: routine.title,
      description: routine.description || '',
      frequency: routine.frequency,
      time: routine.time || '',
      daysOfWeek: routine.daysOfWeek || [],
      duration: routine.duration,
      priority: routine.priority,
      isActive: routine.isActive
    }
  } else {
    // Reset form
    formData.value = {
      title: '',
      description: '',
      frequency: 'DAILY',
      time: '',
      daysOfWeek: [],
      duration: 30,
      priority: 'MEDIUM',
      isActive: true
    }
  }
}, { immediate: true })

const isFormValid = computed(() => {
  if (!formData.value.title || !formData.value.duration) {
    return false
  }

  if ((formData.value.frequency === 'WEEKLY' || formData.value.frequency === 'CUSTOM') &&
      (!formData.value.daysOfWeek || formData.value.daysOfWeek.length === 0)) {
    return false
  }

  return true
})

const toggleDay = (day: string) => {
  if (!formData.value.daysOfWeek) {
    formData.value.daysOfWeek = []
  }

  const index = formData.value.daysOfWeek.indexOf(day)
  if (index === -1) {
    formData.value.daysOfWeek.push(day)
  } else {
    formData.value.daysOfWeek.splice(index, 1)
  }
}

const handleFrequencyChange = () => {
  // Clear daysOfWeek when frequency changes to non-weekly
  if (formData.value.frequency !== 'WEEKLY' && formData.value.frequency !== 'CUSTOM') {
    formData.value.daysOfWeek = []
  }
}

const handleSubmit = () => {
  if (!isFormValid.value) {
    return
  }

  const data = { ...formData.value }
  
  // Clean up data based on frequency
  if (data.frequency !== 'WEEKLY' && data.frequency !== 'CUSTOM') {
    data.daysOfWeek = undefined
  }

  if (!data.time) {
    data.time = undefined
  }

  if (!data.description) {
    data.description = undefined
  }

  emit('save', data)
}
</script>

