import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { AudioModule } from './audio/audio.module'
import { AiModule } from './ai/ai.module'
import { TasksModule } from './tasks/tasks.module'
import { PlanningModule } from './planning/planning.module'
import { CalendarModule } from './calendar/calendar.module'
import { NotificationsModule } from './notifications/notifications.module'
import { RoutinesModule } from './routines/routines.module'
import { AnalyticsModule } from './analytics/analytics.module'
import { PrismaModule } from './prisma/prisma.module'
import { CacheModule } from './common/cache/cache.module'
import { QueueModule } from './common/queue/queue.module'
import { MetricsModule } from './common/metrics/metrics.module'
import { RateLimitGuard } from './common/guards/rate-limit.guard'
import { MetricsInterceptor } from './common/interceptors/metrics.interceptor'
import { APP_INTERCEPTOR } from '@nestjs/core'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          // Default rate limit: 200 requests per minute per IP (increased for better UX)
          ttl: 60000, // 1 minute in milliseconds
          limit: 200,
        },
        {
          // User-specific rate limit: 1000 requests per minute per user
          name: 'user',
          ttl: 60000,
          limit: 1000,
        },
        {
          // AI endpoints rate limit: 10 requests per minute
          name: 'ai',
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    CacheModule,
    QueueModule.forRoot(),
    MetricsModule,
    AuthModule,
    UsersModule,
    AudioModule,
    AiModule,
    TasksModule,
    PlanningModule,
    CalendarModule,
    NotificationsModule,
    RoutinesModule,
    AnalyticsModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RateLimitGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },
  ],
})
export class AppModule {}

