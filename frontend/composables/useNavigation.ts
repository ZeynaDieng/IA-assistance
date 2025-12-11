/**
 * useNavigation - Flutter-like navigation with slide transitions
 * Provides smooth navigation with direction-aware animations
 */

import { useRouter, useRoute } from 'vue-router'
import { ref, watch, readonly } from 'vue'

export interface NavigationOptions {
  direction?: 'forward' | 'back' | 'replace'
  transition?: 'slide' | 'fade' | 'scale'
}

const navigationHistory = ref<string[]>([])
const isNavigating = ref(false)

export function useNavigation() {
  const router = useRouter()
  const route = useRoute()

  // Track navigation history
  watch(
    () => route.path,
    (newPath, oldPath) => {
      if (oldPath && newPath !== oldPath) {
        // Determine if we're going back
        const backIndex = navigationHistory.value.lastIndexOf(newPath)
        if (backIndex !== -1 && backIndex < navigationHistory.value.length - 1) {
          // Going back
          navigationHistory.value = navigationHistory.value.slice(0, backIndex + 1)
        } else {
          // Going forward
          navigationHistory.value.push(newPath)
        }
      }
    },
    { immediate: true }
  )

  /**
   * Navigate with smooth transition
   */
  const navigate = async (to: string, options: NavigationOptions = {}) => {
    if (isNavigating.value) return

    const { direction = 'forward', transition = 'slide' } = options

    isNavigating.value = true

    try {
      // Add transition class to body
      document.body.classList.add(`transition-${transition}`)
      if (direction === 'back') {
        document.body.classList.add('transition-back')
      }

      if (direction === 'replace') {
        await router.replace(to)
      } else {
        await router.push(to)
      }

      // Remove transition class after animation
      setTimeout(() => {
        document.body.classList.remove(`transition-${transition}`, 'transition-back')
        isNavigating.value = false
      }, 300)
    } catch (error) {
      document.body.classList.remove(`transition-${transition}`, 'transition-back')
      isNavigating.value = false
      throw error
    }
  }

  /**
   * Navigate back with animation
   */
  const goBack = async () => {
    if (navigationHistory.value.length > 1) {
      await navigate(navigationHistory.value[navigationHistory.value.length - 2], {
        direction: 'back',
        transition: 'slide'
      })
    } else {
      await router.back()
    }
  }

  /**
   * Navigate forward
   */
  const goForward = async (to: string) => {
    await navigate(to, {
      direction: 'forward',
      transition: 'slide'
    })
  }

  /**
   * Replace current route
   */
  const replace = async (to: string) => {
    await navigate(to, {
      direction: 'replace',
      transition: 'fade'
    })
  }

  return {
    navigate,
    goBack,
    goForward,
    replace,
    isNavigating: readonly(isNavigating),
    history: readonly(navigationHistory)
  }
}

