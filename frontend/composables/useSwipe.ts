import { ref, onMounted, onUnmounted } from 'vue'

export const useSwipe = (element: Ref<HTMLElement | null>) => {
  const swipeStartX = ref(0)
  const swipeStartY = ref(0)
  const swipeOffset = ref(0)
  const isDragging = ref(false)
  const direction = ref<'left' | 'right' | null>(null)

  const SWIPE_THRESHOLD = 50

  const handleTouchStart = (e: TouchEvent) => {
    swipeStartX.value = e.touches[0].clientX
    swipeStartY.value = e.touches[0].clientY
    isDragging.value = true
    direction.value = null
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging.value) return

    const deltaX = e.touches[0].clientX - swipeStartX.value
    const deltaY = Math.abs(e.touches[0].clientY - swipeStartY.value)

    // Only allow horizontal swipe
    if (deltaY > Math.abs(deltaX)) {
      return
    }

    swipeOffset.value = deltaX

    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      direction.value = deltaX > 0 ? 'right' : 'left'
    }
  }

  const handleTouchEnd = (): 'left' | 'right' | null => {
    if (!isDragging.value) return null

    isDragging.value = false
    const result = direction.value
    swipeOffset.value = 0
    direction.value = null

    return result
  }

  onMounted(() => {
    if (element.value) {
      element.value.addEventListener('touchstart', handleTouchStart)
      element.value.addEventListener('touchmove', handleTouchMove)
      element.value.addEventListener('touchend', handleTouchEnd)
    }
  })

  onUnmounted(() => {
    if (element.value) {
      element.value.removeEventListener('touchstart', handleTouchStart)
      element.value.removeEventListener('touchmove', handleTouchMove)
      element.value.removeEventListener('touchend', handleTouchEnd)
    }
  })

  return {
    swipeOffset,
    isDragging,
    direction,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  }
}

