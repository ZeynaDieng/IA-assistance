import { Injectable, ExecutionContext } from '@nestjs/common'
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler'
import { Request } from 'express'
import { Reflector } from '@nestjs/core'

@Injectable()
export class RateLimitGuard extends ThrottlerGuard {
  constructor(
    options: any,
    storageService: any,
    reflector: Reflector
  ) {
    super(options, storageService, reflector)
  }

  protected async getTracker(req: Request): Promise<string> {
    // Use user ID if authenticated, otherwise use IP address
    const userId = (req as any).user?.id
    return userId ? `user:${userId}` : req.ip
  }

  protected async throwThrottlingException(
    context: ExecutionContext,
    throttlerLimitDetail: any
  ): Promise<void> {
    throw new ThrottlerException('Too many requests, please try again later')
  }
}

