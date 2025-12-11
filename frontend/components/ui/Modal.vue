<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="visible"
        class="fixed inset-0 z-modal flex items-center justify-center p-4"
        @click.self="handleBackdropClick"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="handleBackdropClick"
        />

        <!-- Modal -->
        <div
          :class="[
            'relative w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-xl z-modal',
            'max-h-[90vh] overflow-hidden flex flex-col',
            size === 'sm' && 'max-w-sm',
            size === 'lg' && 'max-w-lg',
            size === 'xl' && 'max-w-xl'
          ]"
          @click.stop
        >
          <!-- Header -->
          <div v-if="title || $slots.header" class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <slot name="header">
              <div class="flex items-center justify-between">
                <h3 v-if="title" class="text-lg font-bold text-gray-900 dark:text-white">
                  {{ title }}
                </h3>
                <button
                  v-if="dismissible"
                  class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors press-animation"
                  @click="close"
                >
                  <X :size="20" class="text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </slot>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto px-4 py-4">
            <slot />
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { watch, onMounted, onUnmounted } from 'vue'

interface Props {
  visible: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  dismissible?: boolean
  closeOnBackdrop?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-base);
}

.fade-enter-active > div:last-child,
.fade-leave-active > div:last-child {
  transition: transform var(--transition-spring), opacity var(--transition-base);
}

.fade-enter-from {
  opacity: 0;
}

.fade-enter-from > div:last-child {
  transform: scale(0.95) translateY(20px);
  opacity: 0;
}

.fade-leave-to {
  opacity: 0;
}

.fade-leave-to > div:last-child {
  transform: scale(0.95) translateY(20px);
  opacity: 0;
}
</style>

