/**
 * Plugin Nuxt pour initialiser la synchronisation au démarrage de l'application
 */
export default defineNuxtPlugin(() => {
  const syncStore = useSyncStore()
  
  // Initialize sync on app startup
  syncStore.initialize()
  
  console.log('🔄 Sync initialized:', {
    isOnline: syncStore.isOnline,
    pendingActions: syncStore.status.pendingActions,
    failedActions: syncStore.status.failedActions,
  })
})

