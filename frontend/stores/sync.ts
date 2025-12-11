import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { offlineQueueService } from '~/services/offline-queue.service'
import { cacheService } from '~/services/cache.service'

interface SyncStatus {
  isSyncing: boolean
  lastSyncTime: number | null
  pendingActions: number
  failedActions: number
  conflicts: Array<{
    id: string
    type: string
    localData: any
    serverData: any
    timestamp: number
  }>
}

export const useSyncStore = defineStore('sync', () => {
  const status = ref<SyncStatus>({
    isSyncing: false,
    lastSyncTime: null,
    pendingActions: 0,
    failedActions: 0,
    conflicts: [],
  })

  const isOnline = ref(navigator.onLine)

  /**
   * Update online status
   */
  const updateOnlineStatus = () => {
    isOnline.value = navigator.onLine
    if (isOnline.value && status.value.pendingActions > 0) {
      sync()
    }
  }

  /**
   * Update queue status
   */
  const updateQueueStatus = async () => {
    try {
      const queueStatus = await offlineQueueService.getQueueStatus()
      status.value.pendingActions = queueStatus.pending
      status.value.failedActions = queueStatus.failed
    } catch (error) {
      console.error('[SyncStore] Failed to update queue status:', error)
    }
  }

  /**
   * Sync pending actions
   */
  const sync = async () => {
    if (!isOnline.value || status.value.isSyncing) {
      return
    }

    status.value.isSyncing = true

    try {
      // Process queue
      await offlineQueueService.processQueue()

      // Update status
      await updateQueueStatus()
      status.value.lastSyncTime = Date.now()

      // Clear expired cache
      cacheService.clearExpired()
    } catch (error) {
      console.error('[SyncStore] Sync failed:', error)
    } finally {
      status.value.isSyncing = false
    }
  }

  /**
   * Resolve conflict by using server data (last write wins)
   */
  const resolveConflict = (conflictId: string, useServerData: boolean = true) => {
    const conflictIndex = status.value.conflicts.findIndex((c) => c.id === conflictId)
    if (conflictIndex === -1) {
      return
    }

    const conflict = status.value.conflicts[conflictIndex]

    if (useServerData) {
      // Use server data (last write wins)
      console.log('[SyncStore] Resolving conflict with server data:', conflictId)
      // Invalidate local cache to force refresh from server
      cacheService.invalidateTasksCache(conflict.localData.userId)
    } else {
      // Retry with local data
      console.log('[SyncStore] Retrying with local data:', conflictId)
      // Re-queue the action
      offlineQueueService.enqueue({
        type: conflict.type as any,
        payload: conflict.localData,
      })
    }

    // Remove conflict
    status.value.conflicts.splice(conflictIndex, 1)
  }

  /**
   * Add a conflict
   */
  const addConflict = (conflict: SyncStatus['conflicts'][0]) => {
    status.value.conflicts.push(conflict)
  }

  /**
   * Clear all conflicts
   */
  const clearConflicts = () => {
    status.value.conflicts = []
  }

  /**
   * Initialize sync store
   */
  const initialize = () => {
    // Setup online/offline listeners
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    // Initial status update
    updateQueueStatus()

    // Periodic sync check (every 30 seconds)
    const syncInterval = setInterval(() => {
      if (isOnline.value && status.value.pendingActions > 0) {
        sync()
      }
      updateQueueStatus()
    }, 30000)

    // Cleanup function (will be called when store is destroyed)
    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
      clearInterval(syncInterval)
    }
  }

  return {
    status: computed(() => status.value),
    isOnline: computed(() => isOnline.value),
    sync,
    resolveConflict,
    addConflict,
    clearConflicts,
    updateQueueStatus,
    initialize,
  }
})

