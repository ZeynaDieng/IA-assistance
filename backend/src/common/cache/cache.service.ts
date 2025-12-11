import { Injectable, Inject } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | undefined> {
    return this.cacheManager.get<T>(key)
  }

  /**
   * Set value in cache with optional TTL (in seconds)
   */
  async set(key: string, value: any, ttl?: number): Promise<void> {
    const ttlMs = ttl ? ttl * 1000 : undefined
    await this.cacheManager.set(key, value, ttlMs)
  }

  /**
   * Delete value from cache
   */
  async del(key: string): Promise<void> {
    await this.cacheManager.del(key)
  }

  /**
   * Clear all cache
   * Note: cache-manager v5 doesn't have reset(), so we'll skip this for now
   * In production with Redis, you can implement pattern-based deletion
   */
  async reset(): Promise<void> {
    // cache-manager v5 doesn't support reset()
    // This would need to be implemented differently with Redis
    // For now, we'll leave it as a no-op
    console.warn('Cache reset not supported in cache-manager v5')
  }

  /**
   * Get or set pattern: if key exists, return cached value, otherwise execute callback and cache result
   */
  async getOrSet<T>(
    key: string,
    callback: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = await this.get<T>(key)
    if (cached !== undefined) {
      return cached
    }

    const value = await callback()
    await this.set(key, value, ttl)
    return value
  }

  /**
   * Cache user data (TTL: 1 hour)
   */
  async cacheUser(userId: string, userData: any): Promise<void> {
    await this.set(`user:${userId}`, userData, 3600)
  }

  /**
   * Get cached user data
   */
  async getCachedUser(userId: string): Promise<any | undefined> {
    return this.get(`user:${userId}`)
  }

  /**
   * Cache tasks for a date (TTL: 5 minutes)
   */
  async cacheTasks(userId: string, date: string, tasks: any[]): Promise<void> {
    await this.set(`tasks:${userId}:${date}`, tasks, 300)
  }

  /**
   * Get cached tasks for a date
   */
  async getCachedTasks(userId: string, date: string): Promise<any[] | undefined> {
    return this.get(`tasks:${userId}:${date}`)
  }

  /**
   * Cache planning for a date (TTL: 5 minutes)
   */
  async cachePlanning(userId: string, date: string, planning: any): Promise<void> {
    await this.set(`planning:${userId}:${date}`, planning, 300)
  }

  /**
   * Get cached planning for a date
   */
  async getCachedPlanning(userId: string, date: string): Promise<any | undefined> {
    return this.get(`planning:${userId}:${date}`)
  }

  /**
   * Invalidate user-related cache
   */
  async invalidateUserCache(userId: string): Promise<void> {
    // Note: This is a simplified version. In production with Redis, you might want to use pattern matching
    // For now, we'll invalidate common keys
    const keys = [
      `user:${userId}`,
    ]
    await Promise.all(keys.map(key => this.del(key)))
  }

  /**
   * Invalidate tasks cache for a user
   */
  async invalidateTasksCache(userId: string, date?: string): Promise<void> {
    if (date) {
      await this.del(`tasks:${userId}:${date}`)
    } else {
      // Invalidate all task caches for user (simplified - in production use pattern matching)
      await this.del(`tasks:${userId}:*`)
    }
  }

  /**
   * Invalidate planning cache for a user
   */
  async invalidatePlanningCache(userId: string, date?: string): Promise<void> {
    if (date) {
      await this.del(`planning:${userId}:${date}`)
    } else {
      await this.del(`planning:${userId}:*`)
    }
  }
}

