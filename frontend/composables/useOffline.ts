import { ref, computed, onMounted, onUnmounted } from 'vue'
import { offlineQueueService } from '~/services/offline-queue.service'

/**
 * Composable for offline functionality
 */
export function useOffline() {
  const isOnline = ref(navigator.onLine)
  const queueStatus = ref({ pending: 0, failed: 0 })

  /**
   * Update online status
   */
  const updateOnlineStatus = () => {
    isOnline.value = navigator.onLine
    if (isOnline.value) {
      // Process queue when coming back online
      offlineQueueService.processQueue()
    }
  }

  /**
   * Update queue status
   */
  const updateQueueStatus = async () => {
    try {
      queueStatus.value = await offlineQueueService.getQueueStatus()
    } catch (error) {
      console.error('[useOffline] Failed to get queue status:', error)
    }
  }

  /**
   * Queue an action for offline processing
   */
  const queueAction = async (
    type: 'CREATE_TASK' | 'UPDATE_TASK' | 'DELETE_TASK' | 'COMPLETE_TASK' | 'POSTPONE_TASK' | 'CREATE_PLANNING' | 'UPDATE_PLANNING',
    payload: any
  ) => {
    try {
      const id = await offlineQueueService.enqueue({ type, payload })
      await updateQueueStatus()
      return id
    } catch (error) {
      console.error('[useOffline] Failed to queue action:', error)
      throw error
    }
  }

  /**
   * Process the queue manually
   */
  const processQueue = async () => {
    try {
      await offlineQueueService.processQueue()
      await updateQueueStatus()
    } catch (error) {
      console.error('[useOffline] Failed to process queue:', error)
    }
  }

  // Setup listeners
  onMounted(() => {
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
    updateQueueStatus()

    // Update queue status periodically
    const interval = setInterval(updateQueueStatus, 5000)
    onUnmounted(() => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
      clearInterval(interval)
    })
  })

  return {
    isOnline: computed(() => isOnline.value),
    queueStatus: computed(() => queueStatus.value),
    queueAction,
    processQueue,
    updateQueueStatus,
  }
}

