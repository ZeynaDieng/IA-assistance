<template>
  <div class="w-full">
    <label
      v-if="label"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <!-- PIN Dots Indicator -->
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
    <div class="grid grid-cols-3 gap-4 mb-8">
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
    
    <!-- Helper Text -->
    <p
      v-if="helper && !error"
      class="text-sm text-gray-500 text-center mb-4"
    >
      {{ helper }}
    </p>
    
    <!-- Confirm Button (when PIN complete) -->
    <Button
      v-if="pin.length === 4 && showConfirm"
      variant="primary"
      :icon="Lock"
      :disabled="disabled || !isValid"
      @click="handleConfirm"
    >
      {{ confirmText }}
    </Button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { X, Lock } from 'lucide-vue-next'
import Button from '~/components/ui/Button.vue'

interface Props {
  modelValue: string
  label?: string
  error?: string
  helper?: string
  required?: boolean
  disabled?: boolean
  showConfirm?: boolean
  confirmText?: string
}

const props = withDefaults(defineProps<Props>(), {
  showConfirm: true,
  confirmText: 'Confirmer le PIN',
  required: false,
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  confirm: [pin: string]
}>()

const pin = ref(props.modelValue || '')

const isValid = computed(() => {
  // PIN must be 4 digits and not all the same
  if (pin.value.length !== 4) return false
  if (/^(\d)\1{3}$/.test(pin.value)) return false // Not all same digits
  return true
})

const addDigit = (digit: string) => {
  if (pin.value.length < 4) {
    pin.value += digit
    emit('update:modelValue', pin.value)
  }
}

const removeDigit = () => {
  if (pin.value.length > 0) {
    pin.value = pin.value.slice(0, -1)
    emit('update:modelValue', pin.value)
  }
}

const handleConfirm = () => {
  if (isValid.value) {
    emit('confirm', pin.value)
  }
}

// Watch external changes
watch(() => props.modelValue, (newValue) => {
  pin.value = newValue || ''
}, { immediate: true })
</script>

