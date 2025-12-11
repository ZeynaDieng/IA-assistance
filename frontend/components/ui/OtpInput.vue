<template>
  <div class="w-full">
    <label
      v-if="label"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
    >
      {{ label }}
    </label>
    
    <div class="flex justify-center gap-3">
      <input
        v-for="i in 4"
        :key="i"
        :ref="el => { if (el) inputRefs[i - 1] = el as HTMLInputElement }"
        type="text"
        inputmode="numeric"
        maxlength="1"
        :value="otpArray[i - 1]"
        :class="[
          'w-14 h-14 text-center text-2xl font-bold rounded-2xl border-2 transition-all',
          'focus:border-primary focus:ring-2 focus:ring-primary/20',
          'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700',
          'text-gray-900 dark:text-white outline-none',
          error && 'border-red-400'
        ]"
        @input="handleInput(i - 1, $event)"
        @keydown="handleKeydown(i - 1, $event)"
        @paste="handlePaste"
      />
    </div>
    
    <p v-if="error" class="text-sm text-red-500 mt-2 text-center">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue: string
  label?: string
  error?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  complete: [value: string]
}>()

const inputRefs = ref<(HTMLInputElement | null)[]>([])
const otpArray = ref<string[]>(['', '', '', ''])

const handleInput = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value.replace(/\D/g, '') // Only digits
  
  if (value) {
    otpArray.value[index] = value
    updateModelValue()
    
    // Move to next input
    if (index < 3 && inputRefs.value[index + 1]) {
      inputRefs.value[index + 1]?.focus()
    } else if (index === 3) {
      target.blur()
    }
  } else {
    otpArray.value[index] = ''
    updateModelValue()
  }
}

const handleKeydown = (index: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace' && !otpArray.value[index] && index > 0) {
    inputRefs.value[index - 1]?.focus()
  }
}

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const pastedData = event.clipboardData?.getData('text').replace(/\D/g, '').slice(0, 4) || ''
  
  for (let i = 0; i < 4; i++) {
    otpArray.value[i] = pastedData[i] || ''
  }
  
  updateModelValue()
  
  if (pastedData.length === 4) {
    inputRefs.value[3]?.focus()
  }
}

const updateModelValue = () => {
  const value = otpArray.value.join('')
  emit('update:modelValue', value)
  
  if (value.length === 4) {
    emit('complete', value)
  }
}

watch(() => props.modelValue, (newValue) => {
  if (newValue !== otpArray.value.join('')) {
    for (let i = 0; i < 4; i++) {
      otpArray.value[i] = newValue[i] || ''
    }
  }
}, { immediate: true })
</script>

