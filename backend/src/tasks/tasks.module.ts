import { Module, forwardRef } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { TasksService } from './tasks.service'
import { TasksController } from './tasks.controller'
import { NotificationsModule } from '../notifications/notifications.module'

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => NotificationsModule)
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService]
})
export class TasksModule {}

