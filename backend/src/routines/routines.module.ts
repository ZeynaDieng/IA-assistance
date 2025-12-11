import { Module } from '@nestjs/common'
import { RoutinesService } from './routines.service'
import { RoutinesController } from './routines.controller'
import { RoutinesSchedulerService } from './routines-scheduler.service'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [RoutinesController],
  providers: [RoutinesService, RoutinesSchedulerService],
  exports: [RoutinesService]
})
export class RoutinesModule {
  // Export RoutinesService for PlanningModule
}

