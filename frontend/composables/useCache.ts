import { cacheService } from '~/services/cache.service'

/**
 * Composable for cache operations
 */
export function useCache() {
  /**
   * Get or set pattern: if key exists in cache, return cached value, otherwise execute callback and cache result
   */
  const getOrSet = async <T>(
    key: string,
    callback: () => Promise<T>,
    ttl?: number
  ): Promise<T> => {
    const cached = cacheService.get<T>(key)
    if (cached !== null) {
      return cached
    }

    const value = await callback()
    cacheService.set(key, value, ttl)
    return value
  }

  /**
   * Cache tasks for a date
   */
  const cacheTasks = (userId: string, date: string, tasks: any[]) => {
    cacheService.cacheTasks(userId, date, tasks)
  }

  /**
   * Get cached tasks for a date
   */
  const getCachedTasks = (userId: string, date: string) => {
    return cacheService.getCachedTasks(userId, date)
  }

  /**
   * Cache planning for a date
   */
  const cachePlanning = (userId: string, date: string, planning: any) => {
    cacheService.cachePlanning(userId, date, planning)
  }

  /**
   * Get cached planning for a date
   */
  const getCachedPlanning = (userId: string, date: string) => {
    return cacheService.getCachedPlanning(userId, date)
  }

  /**
   * Cache user info
   */
  const cacheUser = (userId: string, userData: any) => {
    cacheService.cacheUser(userId, userData)
  }

  /**
   * Get cached user info
   */
  const getCachedUser = (userId: string) => {
    return cacheService.getCachedUser(userId)
  }

  /**
   * Invalidate cache
   */
  const invalidate = (key: string) => {
    cacheService.delete(key)
  }

  /**
   * Invalidate tasks cache
   */
  const invalidateTasks = (userId: string, date?: string) => {
    cacheService.invalidateTasksCache(userId, date)
  }

  /**
   * Clear all cache
   */
  const clearAll = () => {
    cacheService.clearAll()
  }

  /**
   * Clear expired cache
   */
  const clearExpired = () => {
    cacheService.clearExpired()
  }

  return {
    getOrSet,
    cacheTasks,
    getCachedTasks,
    cachePlanning,
    getCachedPlanning,
    cacheUser,
    getCachedUser,
    invalidate,
    invalidateTasks,
    clearAll,
    clearExpired,
  }
}

