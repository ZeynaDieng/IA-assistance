import { Injectable, ExecutionContext } from '@nestjs/common'
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler'
import { Request } from 'express'

@Injectable()
export class AiRateLimitGuard extends ThrottlerGuard {
  protected async getTracker(req: Request): Promise<string> {
    // Use user ID if authenticated, otherwise use IP address
    const userId = (req as any).user?.id
    return userId ? `ai:user:${userId}` : `ai:ip:${req.ip}`
  }

  protected async throwThrottlingException(
    context: ExecutionContext,
    throttlerLimitDetail: any
  ): Promise<void> {
    throw new ThrottlerException(
      'Too many AI requests. Please wait a moment before trying again.'
    )
  }
}

