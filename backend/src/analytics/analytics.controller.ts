import { Controller, Post, Body } from '@nestjs/common'
import { AnalyticsService } from './analytics.service'
import { SkipThrottle } from '@nestjs/throttler'

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('track')
  @SkipThrottle()
  async track(
    @Body() event: { name: string; properties?: Record<string, any> }
  ) {
    // Track event (anonymous or authenticated)
    // The userId can be included in properties if the user is authenticated
    await this.analyticsService.track(event.name, event.properties)
    return { success: true }
  }
}
