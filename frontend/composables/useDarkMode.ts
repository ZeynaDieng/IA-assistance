/**
 * Composable global pour gérer le dark mode dans toute l'application
 * Utilise VueUse useDark avec persistance dans localStorage
 * Supporte le mode automatique basé sur l'heure et la luminosité
 */
import { useDark, usePreferredDark, useMediaQuery } from '@vueuse/core'
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const STORAGE_KEY = 'samaplanner-theme'
const THEME_MODE_KEY = 'samaplanner-theme-mode'

type ThemeMode = 'light' | 'dark' | 'auto'

/**
 * Dark mode composable - Utilisez ceci dans tous les composants et pages
 * @example
 * const { isDark, toggleDark, themeMode, setThemeMode } = useDarkMode()
 */
export const useDarkMode = () => {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  
  // Get saved theme mode or default to 'light'
  // Check if already initialized by plugin
  const getInitialMode = (): ThemeMode => {
    if (typeof window === 'undefined') return 'light'
    const saved = localStorage.getItem(THEME_MODE_KEY) as ThemeMode
    if (saved && ['light', 'dark', 'auto'].includes(saved)) {
      return saved
    }
    // Fallback to old storage key
    const oldTheme = localStorage.getItem(STORAGE_KEY)
    if (oldTheme === 'dark') return 'dark'
    if (oldTheme === 'light') return 'light'
    return 'light'
  }

  const savedMode = ref<ThemeMode>(getInitialMode())

  // Use VueUse useDark for automatic HTML class management
  const isDarkManual = useDark({
    selector: 'html',
    attribute: 'class',
    valueDark: 'dark',
    valueLight: '',
    storageKey: STORAGE_KEY,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  })

  // Computed dark mode based on mode
  const isDark = computed(() => {
    if (savedMode.value === 'auto') {
      // Auto mode: use system preference or time-based
      return prefersDark.value || isTimeBasedDark()
    }
    return savedMode.value === 'dark'
  })

  // Sync isDarkManual with computed isDark
  watch(isDark, (dark) => {
    if (typeof document !== 'undefined') {
      const html = document.documentElement
      if (dark) {
        html.classList.add('dark')
        isDarkManual.value = true
      } else {
        html.classList.remove('dark')
        isDarkManual.value = false
      }
    }
  }, { immediate: true, flush: 'post' })

  /**
   * Check if current time is in dark hours (18:00 - 06:00)
   */
  function isTimeBasedDark(): boolean {
    const hour = new Date().getHours()
    return hour >= 18 || hour < 6
  }

  /**
   * Set theme mode
   */
  const setThemeMode = (mode: ThemeMode) => {
    savedMode.value = mode
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_MODE_KEY, mode)
    }

    // Apply immediately
    if (mode === 'auto') {
      const shouldBeDark = prefersDark.value || isTimeBasedDark()
      if (shouldBeDark) {
        document.documentElement.classList.add('dark')
        isDarkManual.value = true
      } else {
        document.documentElement.classList.remove('dark')
        isDarkManual.value = false
      }
    } else {
      isDarkManual.value = mode === 'dark'
    }
  }

  /**
   * Toggle dark mode
   */
  const toggleDark = () => {
    if (savedMode.value === 'auto') {
      // Switch to manual mode based on current state
      const currentDark = document.documentElement.classList.contains('dark')
      setThemeMode(currentDark ? 'light' : 'dark')
    } else {
      const newMode = isDark.value ? 'light' : 'dark'
      setThemeMode(newMode)
    }
  }

  /**
   * Update theme based on time (for auto mode)
   */
  let timeCheckInterval: NodeJS.Timeout | null = null

  onMounted(() => {
    // Initialize theme on mount
    if (savedMode.value === 'auto') {
      const shouldBeDark = prefersDark.value || isTimeBasedDark()
      if (shouldBeDark) {
        document.documentElement.classList.add('dark')
        isDarkManual.value = true
      } else {
        document.documentElement.classList.remove('dark')
        isDarkManual.value = false
      }
    }

    // Check time every minute for auto mode
    if (savedMode.value === 'auto') {
      timeCheckInterval = setInterval(() => {
        const shouldBeDark = prefersDark.value || isTimeBasedDark()
        const currentlyDark = document.documentElement.classList.contains('dark')
        
        if (shouldBeDark !== currentlyDark) {
          if (shouldBeDark) {
            document.documentElement.classList.add('dark')
            isDarkManual.value = true
          } else {
            document.documentElement.classList.remove('dark')
            isDarkManual.value = false
          }
        }
      }, 60000) // Check every minute
    }
  })

  onUnmounted(() => {
    if (timeCheckInterval) {
      clearInterval(timeCheckInterval)
    }
  })

  return {
    isDark,
    toggleDark,
    themeMode: computed(() => savedMode.value),
    setThemeMode,
    isAuto: computed(() => savedMode.value === 'auto'),
  }
}

