interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number // Time to live in milliseconds
}

export class CacheService {
  private static readonly PREFIX = 'samaplanner_cache_'
  private static readonly TASKS_PREFIX = 'tasks_'
  private static readonly PLANNINGS_PREFIX = 'plannings_'
  private static readonly USER_PREFIX = 'user_'

  /**
   * Set a value in cache with TTL
   */
  set<T>(key: string, value: T, ttl: number = 3600000): void {
    // Default TTL: 1 hour
    const item: CacheItem<T> = {
      data: value,
      timestamp: Date.now(),
      ttl,
    }

    try {
      localStorage.setItem(
        `${CacheService.PREFIX}${key}`,
        JSON.stringify(item)
      )
    } catch (error) {
      console.warn('[CacheService] Failed to set cache:', error)
      // If storage is full, clear expired items and try again
      this.clearExpired()
      try {
        localStorage.setItem(
          `${CacheService.PREFIX}${key}`,
          JSON.stringify(item)
        )
      } catch (retryError) {
        console.error('[CacheService] Failed to set cache after cleanup:', retryError)
      }
    }
  }

  /**
   * Get a value from cache
   */
  get<T>(key: string): T | null {
    try {
      const itemStr = localStorage.getItem(`${CacheService.PREFIX}${key}`)
      if (!itemStr) {
        return null
      }

      const item: CacheItem<T> = JSON.parse(itemStr)

      // Check if item is expired
      if (Date.now() - item.timestamp > item.ttl) {
        this.delete(key)
        return null
      }

      return item.data
    } catch (error) {
      console.warn('[CacheService] Failed to get cache:', error)
      return null
    }
  }

  /**
   * Delete a value from cache
   */
  delete(key: string): void {
    try {
      localStorage.removeItem(`${CacheService.PREFIX}${key}`)
    } catch (error) {
      console.warn('[CacheService] Failed to delete cache:', error)
    }
  }

  /**
   * Clear all expired items
   */
  clearExpired(): void {
    try {
      const keys = Object.keys(localStorage)
      const now = Date.now()

      keys.forEach((key) => {
        if (key.startsWith(CacheService.PREFIX)) {
          try {
            const itemStr = localStorage.getItem(key)
            if (itemStr) {
              const item: CacheItem<any> = JSON.parse(itemStr)
              if (now - item.timestamp > item.ttl) {
                localStorage.removeItem(key)
              }
            }
          } catch (error) {
            // Invalid item, remove it
            localStorage.removeItem(key)
          }
        }
      })
    } catch (error) {
      console.warn('[CacheService] Failed to clear expired cache:', error)
    }
  }

  /**
   * Clear all cache
   */
  clearAll(): void {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach((key) => {
        if (key.startsWith(CacheService.PREFIX)) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.warn('[CacheService] Failed to clear all cache:', error)
    }
  }

  /**
   * Cache tasks for a date (TTL: 5 minutes)
   */
  cacheTasks(userId: string, date: string, tasks: any[]): void {
    const key = `${CacheService.TASKS_PREFIX}${userId}_${date}`
    this.set(key, tasks, 300000) // 5 minutes
  }

  /**
   * Get cached tasks for a date
   */
  getCachedTasks(userId: string, date: string): any[] | null {
    const key = `${CacheService.TASKS_PREFIX}${userId}_${date}`
    return this.get<any[]>(key)
  }

  /**
   * Invalidate tasks cache for a user
   */
  invalidateTasksCache(userId: string, date?: string): void {
    if (date) {
      const key = `${CacheService.TASKS_PREFIX}${userId}_${date}`
      this.delete(key)
    } else {
      // Invalidate all task caches for user
      const keys = Object.keys(localStorage)
      keys.forEach((key) => {
        if (
          key.startsWith(
            `${CacheService.PREFIX}${CacheService.TASKS_PREFIX}${userId}_`
          )
        ) {
          localStorage.removeItem(key)
        }
      })
    }
  }

  /**
   * Cache planning for a date (TTL: 5 minutes)
   */
  cachePlanning(userId: string, date: string, planning: any): void {
    const key = `${CacheService.PLANNINGS_PREFIX}${userId}_${date}`
    this.set(key, planning, 300000) // 5 minutes
  }

  /**
   * Get cached planning for a date
   */
  getCachedPlanning(userId: string, date: string): any | null {
    const key = `${CacheService.PLANNINGS_PREFIX}${userId}_${date}`
    return this.get<any>(key)
  }

  /**
   * Cache user info (TTL: 24 hours)
   */
  cacheUser(userId: string, userData: any): void {
    const key = `${CacheService.USER_PREFIX}${userId}`
    this.set(key, userData, 86400000) // 24 hours
  }

  /**
   * Get cached user info
   */
  getCachedUser(userId: string): any | null {
    const key = `${CacheService.USER_PREFIX}${userId}`
    return this.get<any>(key)
  }

  /**
   * Invalidate user cache
   */
  invalidateUserCache(userId: string): void {
    const key = `${CacheService.USER_PREFIX}${userId}`
    this.delete(key)
  }

  /**
   * Cache last 3 plannings (TTL: 24 hours)
   */
  cachePlannings(userId: string, plannings: any[]): void {
    const key = `${CacheService.PLANNINGS_PREFIX}${userId}_recent`
    this.set(key, plannings.slice(0, 3), 86400000) // 24 hours, keep only last 3
  }

  /**
   * Get cached recent plannings
   */
  getCachedPlannings(userId: string): any[] | null {
    const key = `${CacheService.PLANNINGS_PREFIX}${userId}_recent`
    return this.get<any[]>(key)
  }
}

// Export singleton instance
export const cacheService = new CacheService()

