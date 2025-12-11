<template>
  <div
    ref="cardRef"
    :class="[
      'relative overflow-hidden bg-white dark:bg-gray-800 rounded-3xl',
      'shadow-sm border border-gray-50 dark:border-gray-700',
      'transition-transform active:scale-95',
      className
    ]"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <!-- Swipe Actions Background -->
    <div
      :class="[
        'absolute inset-y-0 right-0 flex items-center px-6 transition-transform duration-300',
        swipeOffset > 0 ? 'translate-x-0' : 'translate-x-full'
      ]"
      :style="{ transform: `translateX(${swipeOffset}px)` }"
    >
      <!-- Right Action (Swipe Left) -->
      <div
        v-if="swipeOffset < -50"
        class="flex items-center gap-2 text-red-500"
      >
        <Trash2 :size="20" />
        <span class="font-medium text-sm">Supprimer</span>
      </div>
    </div>
    
    <!-- Card Content -->
    <div
      :style="{ transform: `translateX(${swipeOffset}px)` }"
      class="relative z-10 transition-transform duration-300"
    >
      <slot />
    </div>
    
    <!-- Left Action Hint (Swipe Right) -->
    <div
      v-if="showLeftAction"
      :class="[
        'absolute inset-y-0 left-0 w-16',
        'bg-gradient-to-r from-success/20 to-transparent',
        'flex items-center justify-start pl-4 opacity-0 group-hover:opacity-100 transition-opacity',
        swipeOffset > 50 && 'opacity-100'
      ]"
    >
      <Check :size="18" class="text-success" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Check, Trash2 } from 'lucide-vue-next'

interface Props {
  showLeftAction?: boolean
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  showLeftAction: true,
  className: ''
})

const emit = defineEmits<{
  'swipe-right': []
  'swipe-left': []
}>()

const cardRef = ref<HTMLElement | null>(null)
const swipeOffset = ref(0)
const touchStartX = ref(0)
const touchStartY = ref(0)
const isDragging = ref(false)

const SWIPE_THRESHOLD = 100
const MAX_SWIPE = 120

const handleTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
  isDragging.value = true
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return
  
  const deltaX = e.touches[0].clientX - touchStartX.value
  const deltaY = Math.abs(e.touches[0].clientY - touchStartY.value)
  
  // Only allow horizontal swipe
  if (deltaY > Math.abs(deltaX)) {
    return
  }
  
  // Limit swipe distance
  swipeOffset.value = Math.max(-MAX_SWIPE, Math.min(MAX_SWIPE, deltaX))
}

const handleTouchEnd = () => {
  if (!isDragging.value) return
  
  isDragging.value = false
  
  if (Math.abs(swipeOffset.value) > SWIPE_THRESHOLD) {
    if (swipeOffset.value > 0) {
      // Swipe right
      emit('swipe-right')
    } else {
      // Swipe left
      emit('swipe-left')
    }
  }
  
  // Reset position
  swipeOffset.value = 0
}

onMounted(() => {
  // Prevent default touch behaviors that might interfere
  if (cardRef.value) {
    cardRef.value.addEventListener('touchmove', (e) => {
      if (isDragging.value) {
        e.preventDefault()
      }
    }, { passive: false })
  }
})
</script>

