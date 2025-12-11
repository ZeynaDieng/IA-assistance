import { Module, Global } from '@nestjs/common'
import { MetricsService } from './metrics.service'
import { LoggerService } from '../logger/logger.service'

@Global()
@Module({
  providers: [MetricsService, LoggerService],
  exports: [MetricsService, LoggerService],
})
export class MetricsModule {}

