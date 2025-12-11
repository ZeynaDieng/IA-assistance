<template>
  <Teleport to="body">
    <Transition name="slide-up">
      <div
        v-if="visible"
        class="fixed inset-0 z-modal flex items-end"
        @click.self="handleBackdropClick"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="handleBackdropClick"
        />

        <!-- Bottom Sheet -->
        <div
          :class="[
            'relative w-full bg-white dark:bg-gray-800 rounded-t-3xl shadow-xl z-modal',
            'max-h-[90vh] overflow-hidden flex flex-col',
            'safe-bottom'
          ]"
          @click.stop
        >
          <!-- Drag Handle -->
          <div class="flex justify-center pt-3 pb-2">
            <div class="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
          </div>

          <!-- Header -->
          <div v-if="title || $slots.header" class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <slot name="header">
              <h3 v-if="title" class="text-lg font-bold text-gray-900 dark:text-white">
                {{ title }}
              </h3>
            </slot>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto px-4 py-4">
            <slot />
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="px-4 py-3 border-t border-gray-200 dark:border-gray-700 safe-bottom">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch, onMounted, onUnmounted } from 'vue'

interface Props {
  visible: boolean
  title?: string
  dismissible?: boolean
  closeOnBackdrop?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  dismissible: true,
  closeOnBackdrop: true
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  close: []
}>()

const handleBackdropClick = () => {
  if (props.closeOnBackdrop && props.dismissible) {
    close()
  }
}

const close = () => {
  emit('update:visible', false)
  emit('close')
}

// Handle escape key
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.visible && props.dismissible) {
    close()
  }
}

// Prevent body scroll when open
watch(() => props.visible, (isVisible) => {
  if (isVisible) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all var(--transition-spring);
}

.slide-up-enter-from {
  opacity: 0;
}

.slide-up-enter-from > div:last-child {
  transform: translateY(100%);
}

.slide-up-leave-to {
  opacity: 0;
}

.slide-up-leave-to > div:last-child {
  transform: translateY(100%);
}
</style>

