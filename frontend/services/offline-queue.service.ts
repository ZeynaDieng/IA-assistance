interface QueuedAction {
  id: string
  type: 'CREATE_TASK' | 'UPDATE_TASK' | 'DELETE_TASK' | 'COMPLETE_TASK' | 'POSTPONE_TASK' | 'CREATE_PLANNING' | 'UPDATE_PLANNING'
  payload: any
  timestamp: number
  retries: number
  status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED'
  error?: string
}

const DB_NAME = 'samaplanner_offline_queue'
const DB_VERSION = 1
const STORE_NAME = 'actions'

export class OfflineQueueService {
  private db: IDBDatabase | null = null
  private isOnline: boolean = navigator.onLine

  constructor() {
    this.init()
    this.setupOnlineListener()
  }

  /**
   * Initialize IndexedDB
   */
  private async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => {
        console.error('[OfflineQueue] Failed to open IndexedDB:', request.error)
        reject(request.error)
      }

      request.onsuccess = () => {
        this.db = request.result
        console.log('[OfflineQueue] IndexedDB initialized')
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
          store.createIndex('timestamp', 'timestamp', { unique: false })
          store.createIndex('status', 'status', { unique: false })
        }
      }
    })
  }

  /**
   * Setup online/offline listeners
   */
  private setupOnlineListener(): void {
    window.addEventListener('online', () => {
      console.log('[OfflineQueue] Connection restored')
      this.isOnline = true
      this.processQueue()
    })

    window.addEventListener('offline', () => {
      console.log('[OfflineQueue] Connection lost')
      this.isOnline = false
    })
  }

  /**
   * Add an action to the queue
   */
  async enqueue(action: Omit<QueuedAction, 'id' | 'timestamp' | 'retries' | 'status'>): Promise<string> {
    if (!this.db) {
      await this.init()
    }

    const queuedAction: QueuedAction = {
      id: `${action.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...action,
      timestamp: Date.now(),
      retries: 0,
      status: 'PENDING',
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.add(queuedAction)

      request.onsuccess = () => {
        console.log('[OfflineQueue] Action queued:', queuedAction.id)
        resolve(queuedAction.id)

        // Try to process immediately if online
        if (this.isOnline) {
          this.processQueue()
        }
      }

      request.onerror = () => {
        console.error('[OfflineQueue] Failed to queue action:', request.error)
        reject(request.error)
      }
    })
  }

  /**
   * Get all pending actions
   */
  async getPendingActions(): Promise<QueuedAction[]> {
    if (!this.db) {
      await this.init()
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const index = store.index('status')
      const request = index.getAll('PENDING')

      request.onsuccess = () => {
        const actions = request.result.sort((a, b) => a.timestamp - b.timestamp)
        resolve(actions)
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }

  /**
   * Update action status
   */
  private async updateActionStatus(id: string, status: QueuedAction['status'], error?: string): Promise<void> {
    if (!this.db) {
      await this.init()
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const getRequest = store.get(id)

      getRequest.onsuccess = () => {
        const action = getRequest.result
        if (!action) {
          reject(new Error('Action not found'))
          return
        }

        action.status = status
        if (error) {
          action.error = error
        }
        if (status === 'PROCESSING') {
          action.retries += 1
        }

        const updateRequest = store.put(action)
        updateRequest.onsuccess = () => resolve()
        updateRequest.onerror = () => reject(updateRequest.error)
      }

      getRequest.onerror = () => reject(getRequest.error)
    })
  }

  /**
   * Remove action from queue
   */
  async removeAction(id: string): Promise<void> {
    if (!this.db) {
      await this.init()
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Process the queue
   */
  async processQueue(): Promise<void> {
    if (!this.isOnline) {
      console.log('[OfflineQueue] Skipping queue processing - offline')
      return
    }

    const pendingActions = await this.getPendingActions()
    if (pendingActions.length === 0) {
      return
    }

    console.log(`[OfflineQueue] Processing ${pendingActions.length} pending actions`)

    for (const action of pendingActions) {
      // Skip if already retried too many times
      if (action.retries >= 3) {
        await this.updateActionStatus(action.id, 'FAILED', 'Max retries exceeded')
        continue
      }

      try {
        await this.updateActionStatus(action.id, 'PROCESSING')
        await this.executeAction(action)
        await this.updateActionStatus(action.id, 'SUCCESS')
        await this.removeAction(action.id)
        console.log(`[OfflineQueue] Action ${action.id} processed successfully`)
      } catch (error: any) {
        console.error(`[OfflineQueue] Failed to process action ${action.id}:`, error)
        await this.updateActionStatus(action.id, 'PENDING', error.message)

        // Exponential backoff: wait before retrying
        const delay = Math.min(1000 * Math.pow(2, action.retries), 16000)
        setTimeout(() => this.processQueue(), delay)
      }
    }
  }

  /**
   * Execute an action
   */
  private async executeAction(action: QueuedAction): Promise<void> {
    const config = useRuntimeConfig()
    const { useAuthStore } = await import('~/stores/auth')
    const authStore = useAuthStore()

    if (!authStore.token) {
      throw new Error('Not authenticated')
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authStore.token}`,
    }

    let url = ''
    let method = 'POST'
    let body: any = null

    switch (action.type) {
      case 'CREATE_TASK':
        url = `${config.public.apiBaseUrl}/tasks`
        method = 'POST'
        body = action.payload
        break

      case 'UPDATE_TASK':
        url = `${config.public.apiBaseUrl}/tasks/${action.payload.id}`
        method = 'PATCH'
        body = { ...action.payload }
        delete body.id
        break

      case 'DELETE_TASK':
        url = `${config.public.apiBaseUrl}/tasks/${action.payload.id}`
        method = 'DELETE'
        break

      case 'COMPLETE_TASK':
        url = `${config.public.apiBaseUrl}/tasks/${action.payload.id}/complete`
        method = 'POST'
        break

      case 'POSTPONE_TASK':
        url = `${config.public.apiBaseUrl}/tasks/${action.payload.id}/postpone`
        method = 'POST'
        body = { newDate: action.payload.newDate }
        break

      default:
        throw new Error(`Unknown action type: ${action.type}`)
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }))
      throw new Error(error.message || `HTTP ${response.status}`)
    }
  }

  /**
   * Get queue status
   */
  async getQueueStatus(): Promise<{ pending: number; failed: number }> {
    if (!this.db) {
      await this.init()
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const statusIndex = store.index('status')

      const pendingRequest = statusIndex.count('PENDING')
      const failedRequest = statusIndex.count('FAILED')

      let pending = 0
      let failed = 0

      pendingRequest.onsuccess = () => {
        pending = pendingRequest.result
        failedRequest.onsuccess = () => {
          failed = failedRequest.result
          resolve({ pending, failed })
        }
        failedRequest.onerror = () => reject(failedRequest.error)
      }

      pendingRequest.onerror = () => reject(pendingRequest.error)
    })
  }
}

// Export singleton instance
export const offlineQueueService = new OfflineQueueService()

