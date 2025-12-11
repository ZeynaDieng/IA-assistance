/**
 * Plugin Nuxt pour initialiser l'authentification au démarrage de l'application
 * Restaure le token et l'utilisateur depuis localStorage
 */
export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()
  
  // Initialize auth on app startup
  authStore.initialize()
  
  console.log('🔐 Auth initialized:', {
    isLoggedIn: authStore.isLoggedIn,
    hasToken: !!authStore.token,
    hasUser: !!authStore.user
  })
})

