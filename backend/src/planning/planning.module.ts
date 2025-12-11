import { Module, forwardRef } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { AiModule } from '../ai/ai.module'
import { NotificationsModule } from '../notifications/notifications.module'
import { RoutinesModule } from '../routines/routines.module'
import { UsersModule } from '../users/users.module'
import { PlanningService } from './planning.service'
import { PlanningController } from './planning.controller'

@Module({
  imports: [
    PrismaModule,
    AiModule,
    NotificationsModule,
    forwardRef(() => RoutinesModule),
    UsersModule
  ],
  controllers: [PlanningController],
  providers: [PlanningService],
  exports: [PlanningService]
})
export class PlanningModule {}

// Note: PlanningController needs RoutinesService, which is already imported via RoutinesModule
// We need to make sure RoutinesService is exported from RoutinesModule

