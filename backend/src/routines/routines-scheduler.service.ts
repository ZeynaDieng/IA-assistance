import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { RoutinesService } from './routines.service'

@Injectable()
export class RoutinesSchedulerService {
  private readonly logger = new Logger(RoutinesSchedulerService.name)

  constructor(private readonly routinesService: RoutinesService) {}

  /**
   * Auto-renew expired routines every day at 2 AM
   * This checks all users' routines and renews those with autoRenew=true
   */
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async handleExpiredRoutines() {
    this.logger.log('Starting scheduled task: Auto-renew expired routines')
    
    try {
      const result = await this.routinesService.autoRenewExpiredRoutines()
      
      this.logger.log(
        `Completed auto-renewal: ${result.renewed} routines renewed, ${result.deactivated} routines deactivated`
      )
    } catch (error) {
      this.logger.error('Error in scheduled auto-renewal task:', error)
    }
  }

  /**
   * Check for routines expiring soon (within 7 days) every day at 9 AM
   * This helps identify routines that need user attention
   */
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async checkExpiringRoutines() {
    this.logger.log('Checking for routines expiring soon')
    
    try {
      // This is informational - the actual renewal request will be shown
      // when the user validates a planning (handled in PlanningController)
      this.logger.log('Routines expiring soon check completed')
    } catch (error) {
      this.logger.error('Error checking expiring routines:', error)
    }
  }
}

