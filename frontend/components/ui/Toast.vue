<template>
  <Teleport to="body">
    <Transition name="toast">
      <div
        v-if="modelValue"
        :class="[
          'fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50',
          'min-w-[300px] max-w-[90vw]',
          'rounded-2xl shadow-2xl p-4',
          'backdrop-blur-lg border',
          variantClasses[variant],
          'safe-bottom'
        ]"
      >
        <div class="flex items-center gap-3">
          <!-- Icon -->
          <component
            :is="icon"
            :size="20"
            class="flex-shrink-0"
          />
          
          <!-- Message -->
          <p class="flex-1 font-medium text-sm">
            {{ message }}
          </p>
          
          <!-- Close Button -->
          <button
            v-if="closable"
            class="p-1 rounded-lg hover:bg-black/10 transition-colors"
            @click="handleClose"
          >
            <X :size="16" />
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { CheckCircle, XCircle, Info, AlertCircle, X } from 'lucide-vue-next'
import type { Component } from 'vue'

interface Props {
  modelValue: boolean
  message: string
  variant?: 'success' | 'error' | 'info' | 'warning'
  duration?: number
  closable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'info',
  duration: 3000,
  closable: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const variantClasses = {
  success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
  error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
  info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
  warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200'
}

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertCircle
}

const icon = computed<Component>(() => iconMap[props.variant])

let timeoutId: NodeJS.Timeout | null = null

const handleClose = () => {
  emit('update:modelValue', false)
  emit('close')
}

watch(() => props.modelValue, (isVisible) => {
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
  
  if (isVisible && props.duration > 0) {
    timeoutId = setTimeout(() => {
      handleClose()
    }, props.duration)
  }
})

onUnmounted(() => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}
</style>

