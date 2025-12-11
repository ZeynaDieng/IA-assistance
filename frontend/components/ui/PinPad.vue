<template>
  <div class="w-full">
    <!-- PIN Display Dots -->
    <div class="flex justify-center gap-4 mb-8">
      <div
        v-for="i in 4"
        :key="i"
        :class="[
          'w-4 h-4 rounded-full transition-all duration-200',
          pin.length >= i ? 'bg-primary scale-110' : 'bg-gray-200 dark:bg-gray-700'
        ]"
      />
    </div>
    
    <!-- Numeric Keypad -->
    <div class="grid grid-cols-3 gap-4 mb-6">
      <button
        v-for="num in 9"
        :key="num"
        :disabled="pin.length >= 4 || disabled"
        :class="[
          'h-16 rounded-2xl text-2xl font-medium transition-all',
          'active:scale-95',
          disabled || pin.length >= 4
            ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
            : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white'
        ]"
        @click="addDigit(num.toString())"
      >
        {{ num }}
      </button>
      
      <!-- Empty space -->
      <div />
      
      <!-- Zero -->
      <button
        :disabled="pin.length >= 4 || disabled"
        :class="[
          'h-16 rounded-2xl text-2xl font-medium transition-all',
          'active:scale-95',
          disabled || pin.length >= 4
            ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
            : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white'
        ]"
        @click="addDigit('0')"
      >
        0
      </button>
      
      <!-- Delete -->
      <button
        :disabled="pin.length === 0 || disabled"
        :class="[
          'h-16 rounded-2xl flex items-center justify-center transition-all',
          'active:scale-95',
          disabled || pin.length === 0
            ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
            : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
        ]"
        @click="removeDigit"
      >
        <X :size="24" />
      </button>
    </div>
    
    <!-- Error Message -->
    <p
      v-if="error"
      class="text-sm text-red-500 text-center mb-4"
    >
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { X } from 'lucide-vue-next'

interface Props {
  modelValue: string
  disabled?: boolean
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  complete: [value: string]
}>()

const pin = ref(props.modelValue || '')

const addDigit = (digit: string) => {
  if (pin.value.length < 4) {
    pin.value += digit
    emit('update:modelValue', pin.value)
    
    if (pin.value.length === 4) {
      emit('complete', pin.value)
    }
  }
}

const removeDigit = () => {
  if (pin.value.length > 0) {
    pin.value = pin.value.slice(0, -1)
    emit('update:modelValue', pin.value)
  }
}

watch(() => props.modelValue, (newValue) => {
  pin.value = newValue || ''
}, { immediate: true })
</script>

