<template>
  <div class="w-full">
    <!-- Label -->
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <!-- Input Container -->
    <div
      :class="[
        'flex items-center p-4 rounded-2xl border transition-colors',
        'focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20',
        error ? 'border-red-400 bg-red-50' : 'bg-gray-50 border-gray-200',
        darkMode ? 'dark:bg-gray-800 dark:border-gray-700' : '',
        className
      ]"
    >
      <!-- Icon Left -->
      <component
        v-if="iconLeft"
        :is="iconLeft"
        :size="20"
        :class="[
          'flex-shrink-0 mr-3',
          error ? 'text-red-500' : 'text-primary'
        ]"
      />
      
      <!-- Input -->
      <input
        :id="inputId"
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        :disabled="disabled"
        :maxlength="maxlength"
        :class="[
          'bg-transparent outline-none w-full font-medium',
          'placeholder:text-gray-400',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          inputClass
        ]"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      
      <!-- Icon Right -->
      <component
        v-if="iconRight"
        :is="iconRight"
        :size="20"
        class="flex-shrink-0 ml-3 text-gray-400"
      />
    </div>
    
    <!-- Error Message -->
    <p
      v-if="error"
      class="mt-2 text-sm text-red-500"
    >
      {{ error }}
    </p>
    
    <!-- Helper Text -->
    <p
      v-if="helper && !error"
      class="mt-2 text-sm text-gray-500"
    >
      {{ helper }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'

interface Props {
  modelValue: string | number
  type?: string
  label?: string
  placeholder?: string
  error?: string
  helper?: string
  required?: boolean
  disabled?: boolean
  maxlength?: number
  iconLeft?: Component
  iconRight?: Component
  darkMode?: boolean
  className?: string
  inputClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  darkMode: false,
  className: '',
  inputClass: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}
</script>

