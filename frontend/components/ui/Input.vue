<template>
  <div>
    <label 
      v-if="label" 
      :for="inputId"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-red-500" aria-label="requis">*</span>
    </label>
    <div 
      :class="['flex items-center p-4 rounded-xl border transition-colors', containerClass, error && 'border-red-400']"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined"
    >
      <component 
        :is="iconLeft || icon" 
        v-if="iconLeft || icon" 
        :class="['mr-3', iconClass]" 
        :size="20"
        aria-hidden="true"
      />
      <span v-if="prefix" :class="['font-bold mr-2', prefixClass]" aria-hidden="true">{{ prefix }}</span>
      <input
        :id="inputId"
        :type="type"
        :placeholder="placeholder"
        :maxlength="maxLength"
        :value="modelValue"
        :required="required"
        :aria-required="required"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined"
        :aria-label="ariaLabel || (label ? undefined : placeholder)"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        :class="['bg-transparent outline-none w-full font-medium focus:ring-2 focus:ring-primary focus:ring-offset-2', inputClass]"
      />
    </div>
    <p 
      v-if="error" 
      :id="`${inputId}-error`"
      class="text-sm text-red-500 mt-1" 
      role="alert"
      aria-live="polite"
    >
      {{ error }}
    </p>
    <p 
      v-if="helper && !error" 
      :id="`${inputId}-helper`"
      class="text-sm text-gray-500 dark:text-gray-400 mt-1"
    >
      {{ helper }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'

interface Props {
  modelValue?: string | number
  type?: string
  placeholder?: string
  maxLength?: string | number
  icon?: Component
  iconLeft?: Component
  prefix?: string
  center?: boolean
  label?: string
  error?: string
  helper?: string
  required?: boolean
  ariaLabel?: string
  inputId?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  center: false,
  required: false,
  inputId: () => `input-${Math.random().toString(36).substr(2, 9)}`
})

defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const containerClass = computed(() => {
  return 'dark:border-gray-700 dark:bg-gray-800 border-gray-200 bg-gray-50 focus-within:border-primary'
})

const iconClass = computed(() => {
  return 'text-primary'
})

const prefixClass = computed(() => {
  return 'text-textMain dark:text-white'
})

const inputClass = computed(() => {
  return {
    'text-center tracking-[1em] text-3xl': props.center,
    'text-textMain dark:text-white': !props.center,
  }
})
</script>

