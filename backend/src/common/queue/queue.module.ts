import { Module, DynamicModule } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PrismaModule } from '../../prisma/prisma.module'
import { AiModule } from '../../ai/ai.module'
import { AudioProcessor } from './audio.processor'
import { AiProcessor } from './ai.processor'

@Module({})
export class QueueModule {
  static forRoot(): DynamicModule {
    const redisUrl = process.env.REDIS_URL
    const isDevelopment = process.env.NODE_ENV !== 'production'

    // If Redis is not available, return a minimal module without queue functionality
    if (!redisUrl) {
      if (isDevelopment) {
        console.warn('⚠️  Redis not configured. Queue functionality (audio/AI processing) will be disabled.')
        console.warn('   To enable queues, set REDIS_URL environment variable or install Redis locally.')
      } else {
        throw new Error('REDIS_URL is required in production environment')
      }

      return {
        module: QueueModule,
        imports: [PrismaModule, AiModule],
        providers: [],
        exports: [],
      }
    }

    // Redis is available, configure BullMQ normally
    return {
      module: QueueModule,
      imports: [
        BullModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            return {
              connection: {
                url: redisUrl,
              },
            }
          },
        }),
        BullModule.registerQueue(
          {
            name: 'audio-processing',
          },
          {
            name: 'ai-processing',
          }
        ),
        PrismaModule,
        AiModule,
      ],
      providers: [AudioProcessor, AiProcessor],
      exports: [BullModule],
    }
  }
}
