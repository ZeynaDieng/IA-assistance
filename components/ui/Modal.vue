<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="handleClose"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="handleClose"
        />
        
        <!-- Modal Content -->
        <div
          :class="[
            'relative w-full max-w-md rounded-3xl',
            'bg-white shadow-2xl z-10',
            'max-h-[90vh] overflow-y-auto',
            darkMode && 'dark:bg-gray-800',
            className
          ]"
        >
          <!-- Header -->
          <div
            v-if="title || $slots.header"
            class="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700"
          >
            <h3
              v-if="title"
              class="text-xl font-bold"
            >
              {{ title }}
            </h3>
            <slot name="header" />
            
            <button
              v-if="closable"
              class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              @click="handleClose"
            >
              <X :size="20" class="text-gray-500" />
            </button>
          </div>
          
          <!-- Body -->
          <div class="p-6">
            <slot />
          </div>
          
          <!-- Footer -->
          <div
            v-if="$slots.footer"
            class="p-6 border-t border-gray-100 dark:border-gray-700"
          >
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'

interface Props {
  modelValue: boolean
  title?: string
  closable?: boolean
  darkMode?: boolean
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  closable: true,
  darkMode: false,
  className: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const handleClose = () => {
  if (props.closable) {
    emit('update:modelValue', false)
    emit('close')
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.9);
  opacity: 0;
}
</style>

