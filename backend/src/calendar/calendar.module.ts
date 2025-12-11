import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { RoutinesModule } from '../routines/routines.module'
import { CalendarController } from './calendar.controller'

@Module({
  imports: [PrismaModule, RoutinesModule],
  controllers: [CalendarController],
  providers: [],
  exports: []
})
export class CalendarModule {}

