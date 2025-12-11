import { Module, forwardRef } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from '../prisma/prisma.module'
import { UsersModule } from '../users/users.module'
import { NotificationsService } from './notifications.service'
import { NotificationsController } from './notifications.controller'
import { FcmService } from './fcm.service'

@Module({
  imports: [
    PrismaModule,
    ScheduleModule,
    ConfigModule,
    forwardRef(() => UsersModule)
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, FcmService],
  exports: [NotificationsService, FcmService]
})
export class NotificationsModule {}

