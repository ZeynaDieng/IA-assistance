export default defineNuxtPlugin(async (nuxtApp) => {
  const { $i18n } = nuxtApp
  const { useAuthStore } = await import('~/stores/auth')
  const authStore = useAuthStore()
  
  // Initialize auth to check if user is logged in
  authStore.initialize()
  
  // Load user preferences and set language
  if (authStore.isLoggedIn) {
    try {
      const config = useRuntimeConfig()
      const response = await fetch(
        `${config.public.apiBaseUrl}/users/preferences`,
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        }
      )

      if (response.ok) {
        const data = await response.json()
        if (data.data?.language) {
          // Set the language from user preferences
          await $i18n.setLocale(data.data.language)
        }
      }
    } catch (error) {
      console.error('[i18n] Error loading user preferences:', error)
    }
  }
})

