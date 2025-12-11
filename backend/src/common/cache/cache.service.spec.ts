import { Test, TestingModule } from '@nestjs/testing'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { CacheService } from './cache.service'

describe('CacheService', () => {
  let service: CacheService
  let cacheManager: any

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    reset: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile()

    service = module.get<CacheService>(CacheService)
    cacheManager = module.get(CACHE_MANAGER)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('get', () => {
    it('should get value from cache', async () => {
      const key = 'test-key'
      const value = { data: 'test' }

      mockCacheManager.get.mockResolvedValue(value)

      const result = await service.get(key)

      expect(result).toEqual(value)
      expect(mockCacheManager.get).toHaveBeenCalledWith(key)
    })
  })

  describe('set', () => {
    it('should set value in cache', async () => {
      const key = 'test-key'
      const value = { data: 'test' }
      const ttl = 300

      mockCacheManager.set.mockResolvedValue(undefined)

      await service.set(key, value, ttl)

      expect(mockCacheManager.set).toHaveBeenCalledWith(key, value, ttl * 1000)
    })
  })

  describe('getOrSet', () => {
    it('should return cached value if exists', async () => {
      const key = 'test-key'
      const cachedValue = { data: 'cached' }
      const callback = jest.fn()

      mockCacheManager.get.mockResolvedValue(cachedValue)

      const result = await service.getOrSet(key, callback)

      expect(result).toEqual(cachedValue)
      expect(callback).not.toHaveBeenCalled()
    })

    it('should execute callback and cache result if not cached', async () => {
      const key = 'test-key'
      const newValue = { data: 'new' }
      const callback = jest.fn().mockResolvedValue(newValue)

      mockCacheManager.get.mockResolvedValue(undefined)
      mockCacheManager.set.mockResolvedValue(undefined)

      const result = await service.getOrSet(key, callback)

      expect(result).toEqual(newValue)
      expect(callback).toHaveBeenCalled()
      expect(mockCacheManager.set).toHaveBeenCalled()
    })
  })
})

