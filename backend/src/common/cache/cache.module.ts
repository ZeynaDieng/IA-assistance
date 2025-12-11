import { Module } from '@nestjs/common'
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { CacheService } from './cache.service'

@Module({
  imports: [
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL')
        const isDevelopment = configService.get<string>('NODE_ENV') !== 'production'

        // For now, use in-memory cache
        // Redis can be added later with proper configuration
        // In production, you can configure Redis by setting REDIS_URL
        return {
          ttl: 300, // 5 minutes default TTL
          max: 1000, // maximum number of items in cache
        }
      },
      inject: [ConfigService],
    }),
  ],
  providers: [CacheService],
  exports: [CacheService, NestCacheModule],
})
export class CacheModule {}

