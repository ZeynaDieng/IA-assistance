<template>
  <div class="flex items-center gap-2">
    <!-- Hours Picker -->
    <div class="relative flex-1" ref="hoursContainer">
      <div
        class="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all"
        @click.stop="toggleHoursPicker"
      >
        <div class="px-3 py-3 text-sm font-medium text-gray-900 dark:text-white cursor-pointer flex items-center justify-between">
          <span>{{ String(hours).padStart(2, '0') }}h</span>
          <svg
            class="w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform"
            :class="{ 'rotate-180': showHoursPicker }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      <Transition name="dropdown">
        <div
          v-if="showHoursPicker"
          class="absolute top-full left-0 right-0 z-[100] mt-1 max-h-48 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg custom-scrollbar"
          @click.stop
        >
          <div
            v-for="h in hourOptions"
            :key="h"
            @click="selectHour(h)"
            :class="[
              'px-3 py-2.5 text-sm cursor-pointer transition-colors',
              hours === h
                ? 'bg-primary text-white font-medium'
                : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
            ]"
          >
            {{ String(h).padStart(2, '0') }}h
          </div>
        </div>
      </Transition>
    </div>

    <span class="text-gray-400 dark:text-gray-500 font-medium text-lg">:</span>

    <!-- Minutes Picker -->
    <div class="relative flex-1" ref="minutesContainer">
      <div
        class="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all"
        @click.stop="toggleMinutesPicker"
      >
        <div class="px-3 py-3 text-sm font-medium text-gray-900 dark:text-white cursor-pointer flex items-center justify-between">
          <span>{{ String(minutes).padStart(2, '0') }}</span>
          <svg
            class="w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform"
            :class="{ 'rotate-180': showMinutesPicker }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      <Transition name="dropdown">
        <div
          v-if="showMinutesPicker"
          class="absolute top-full left-0 right-0 z-[100] mt-1 max-h-48 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg custom-scrollbar"
          @click.stop
        >
          <div
            v-for="m in minuteOptions"
            :key="m"
            @click="selectMinute(m)"
            :class="[
              'px-3 py-2.5 text-sm cursor-pointer transition-colors',
              minutes === m
                ? 'bg-primary text-white font-medium'
                : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
            ]"
          >
            {{ String(m).padStart(2, '0') }}
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'

interface Props {
  modelValue: string // Format: "HH:mm"
  step?: number // Step for minutes (default: 5)
}

const props = withDefaults(defineProps<Props>(), {
  step: 5
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'change': [value: string]
}>()

const showHoursPicker = ref(false)
const showMinutesPicker = ref(false)
const hoursContainer = ref<HTMLElement | null>(null)
const minutesContainer = ref<HTMLElement | null>(null)

// Hours: 0-23
const hourOptions = Array.from({ length: 24 }, (_, i) => i)

// Minutes: 0-59 with step (default: every 5 minutes)
const minuteOptions = computed(() => {
  const options: number[] = []
  for (let i = 0; i < 60; i += props.step) {
    options.push(i)
  }
  return options
})

const hours = computed(() => {
  if (!props.modelValue) return 9
  const [h] = props.modelValue.split(':')
  return parseInt(h, 10) || 9
})

const minutes = computed(() => {
  if (!props.modelValue) return 0
  const [, m] = props.modelValue.split(':')
  const parsed = parseInt(m, 10) || 0
  // Round to nearest step
  const step = props.step
  return Math.round(parsed / step) * step
})

const toggleHoursPicker = () => {
  showHoursPicker.value = !showHoursPicker.value
  if (showHoursPicker.value) {
    showMinutesPicker.value = false
  }
}

const toggleMinutesPicker = () => {
  showMinutesPicker.value = !showMinutesPicker.value
  if (showMinutesPicker.value) {
    showHoursPicker.value = false
  }
}

const selectHour = (h: number) => {
  const newValue = `${String(h).padStart(2, '0')}:${String(minutes.value).padStart(2, '0')}`
  emit('update:modelValue', newValue)
  emit('change', newValue)
  showHoursPicker.value = false
}

const selectMinute = (m: number) => {
  const newValue = `${String(hours.value).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  emit('update:modelValue', newValue)
  emit('change', newValue)
  showMinutesPicker.value = false
}

const closePickers = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (
    hoursContainer.value &&
    !hoursContainer.value.contains(target) &&
    minutesContainer.value &&
    !minutesContainer.value.contains(target)
  ) {
    showHoursPicker.value = false
    showMinutesPicker.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closePickers)
})

onUnmounted(() => {
  document.removeEventListener('click', closePickers)
})
</script>

<style scoped>
/* Custom scrollbar */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.7);
}

.dark .custom-scrollbar {
  scrollbar-color: rgba(75, 85, 99, 0.5) transparent;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(75, 85, 99, 0.5);
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(75, 85, 99, 0.7);
}

/* Dropdown transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
