/**
 * Plugin client pour initialiser le dark mode au démarrage
 * S'exécute avant le montage de l'application pour éviter le flash
 */
export default defineNuxtPlugin(() => {
  if (typeof window === 'undefined') return

  const THEME_MODE_KEY = 'samaplanner-theme-mode'
  const STORAGE_KEY = 'samaplanner-theme'

  // Récupérer le mode sauvegardé
  const savedMode = localStorage.getItem(THEME_MODE_KEY) || 'light'
  const savedTheme = localStorage.getItem(STORAGE_KEY)

  // Fonction pour vérifier si on est dans les heures sombres (18h-6h)
  function isTimeBasedDark(): boolean {
    const hour = new Date().getHours()
    return hour >= 18 || hour < 6
  }

  // Fonction pour vérifier la préférence système
  function prefersDarkMode(): boolean {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  // Déterminer si on doit activer le dark mode
  let shouldBeDark = false

  if (savedMode === 'auto') {
    shouldBeDark = prefersDarkMode() || isTimeBasedDark()
  } else if (savedMode === 'dark') {
    shouldBeDark = true
  } else if (savedTheme === 'dark') {
    // Fallback pour l'ancien système
    shouldBeDark = true
  }

  // Appliquer immédiatement sur l'élément HTML
  if (shouldBeDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})

