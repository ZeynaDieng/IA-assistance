import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { FcmService } from './fcm.service'
import { Cron, CronExpression } from '@nestjs/schedule'
import { UserPreferencesService } from '../users/user-preferences.service'

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name)
  
  constructor(
    private prisma: PrismaService,
    private fcmService: FcmService,
    @Inject(forwardRef(() => UserPreferencesService))
    private userPreferencesService?: UserPreferencesService
  ) {}

  /**
   * Create reminder for a task
   */
  async createReminder(
    taskId: string,
    userId: string,
    scheduledAt: Date
  ): Promise<any> {
    // Verify task belongs to user
    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        userId
      }
    })

    if (!task) {
      throw new Error('Task not found')
    }

    // Load user preferences for reminder timing
    let reminderBeforeTask = 15
    let reminderForUrgent = 45
    let reminderForEarlyTasks = true

    if (this.userPreferencesService) {
      try {
        const preferences = await this.userPreferencesService.getOrCreatePreferences(userId)
        reminderBeforeTask = preferences.reminderBeforeTask || 15
        reminderForUrgent = preferences.reminderForUrgent || 45
        reminderForEarlyTasks = preferences.reminderForEarlyTasks !== false // Default true
      } catch (error) {
        this.logger.warn(`Failed to load user preferences for reminders, using defaults: ${error}`)
      }
    }

    // Intelligent reminder timing based on task priority and time
    let reminderTime = new Date(scheduledAt)
    const taskHour = scheduledAt.getHours()
    const taskPriority = task.priority

    // URGENT tasks: use reminderForUrgent minutes before
    if (taskPriority === 'URGENT') {
      reminderTime.setMinutes(reminderTime.getMinutes() - reminderForUrgent)
    }
    // Tasks before 10h: reminder the evening before at 20h (if enabled)
    else if (taskHour < 10 && reminderForEarlyTasks) {
      reminderTime = new Date(scheduledAt)
      reminderTime.setDate(reminderTime.getDate() - 1)
      reminderTime.setHours(20, 0, 0, 0)
    }
    // Tasks after 18h: reminder in the morning at 8h
    else if (taskHour >= 18) {
      reminderTime = new Date(scheduledAt)
      reminderTime.setHours(8, 0, 0, 0)
    }
    // Default: use reminderBeforeTask minutes before
    else {
      reminderTime.setMinutes(reminderTime.getMinutes() - reminderBeforeTask)
    }

    // Don't create reminder if it's in the past
    if (reminderTime < new Date()) {
      return null
    }

    return this.prisma.reminder.create({
      data: {
        userId,
        taskId,
        scheduledAt: reminderTime,
        status: 'PENDING'
      }
    })
  }

  /**
   * Create reminders for multiple tasks
   */
  async createRemindersForTasks(
    tasks: Array<{ id: string; userId: string; scheduledAt: Date }>
  ): Promise<any[]> {
    const reminders = await Promise.all(
      tasks
        .map((task) =>
          this.createReminder(task.id, task.userId, task.scheduledAt)
        )
        .filter(Boolean)
    )

    return reminders.filter((r) => r !== null)
  }

  /**
   * Send pending reminders (called by cron job)
   * This runs every minute to check for pending reminders
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async sendPendingReminders() {
    const now = new Date()
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000)

    // Find reminders that should be sent (within next 5 minutes)
    const pendingReminders = await this.prisma.reminder.findMany({
      where: {
        status: 'PENDING',
        scheduledAt: {
          gte: now,
          lte: fiveMinutesFromNow
        }
      },
      include: {
        task: {
          select: {
            id: true,
            title: true,
            scheduledAt: true,
            priority: true
          }
        },
        user: {
          select: {
            id: true,
            phoneNumber: true
          }
        }
      }
    })

    // Mark reminders as sent
    // In production, you would send push notifications, SMS, etc.
    for (const reminder of pendingReminders) {
      await this.prisma.reminder.update({
        where: { id: reminder.id },
        data: {
          status: 'SENT',
          sentAt: new Date()
        }
      })

      // Send push notification if FCM is available
      if (this.fcmService.isInitialized()) {
        try {
          const tokens = await this.getUserFcmTokens(reminder.user.id)
          if (tokens.length > 0) {
            // Send to all user devices
            for (const token of tokens) {
              await this.fcmService.sendTaskReminder(
                token,
                reminder.task.title,
                reminder.task.scheduledAt
              )
            }
            this.logger.log(
              `📬 Push notification sent for task "${reminder.task.title}" to user ${reminder.user.phoneNumber}`
            )
          } else {
            this.logger.log(
              `📬 No device tokens found for user ${reminder.user.phoneNumber}`
            )
          }
        } catch (error) {
          this.logger.error(`Failed to send push notification: ${error}`)
        }
      } else {
        this.logger.log(
          `📬 Reminder sent to user ${reminder.user.phoneNumber} for task: ${reminder.task.title}`
        )
      }
    }

    return pendingReminders.length
  }

  /**
   * Get user's reminders
   */
  async getUserReminders(userId: string, status?: 'PENDING' | 'SENT' | 'CANCELLED') {
    const where: any = { userId }
    if (status) {
      where.status = status
    }

    return this.prisma.reminder.findMany({
      where,
      include: {
        task: {
          select: {
            id: true,
            title: true,
            scheduledAt: true,
            priority: true
          }
        }
      },
      orderBy: {
        scheduledAt: 'asc'
      }
    })
  }

  /**
   * Cancel a reminder
   */
  async cancelReminder(reminderId: string, userId: string) {
    const reminder = await this.prisma.reminder.findFirst({
      where: {
        id: reminderId,
        userId,
        status: 'PENDING'
      }
    })

    if (!reminder) {
      throw new Error('Reminder not found or already sent')
    }

    return this.prisma.reminder.update({
      where: { id: reminderId },
      data: {
        status: 'CANCELLED'
      }
    })
  }

  /**
   * Register device token for push notifications
   */
  async registerDeviceToken(
    userId: string,
    token: string,
    deviceId?: string,
    platform?: string
  ) {
    // Check if token already exists
    const existing = await this.prisma.deviceToken.findUnique({
      where: { token }
    })

    if (existing) {
      // Update if belongs to different user or update metadata
      if (existing.userId !== userId) {
        return this.prisma.deviceToken.update({
          where: { token },
          data: {
            userId,
            deviceId,
            platform,
          }
        })
      }
      // Update metadata if same user
      return this.prisma.deviceToken.update({
        where: { token },
        data: {
          deviceId,
          platform,
        }
      })
    }

    // Create new token
    return this.prisma.deviceToken.create({
      data: {
        userId,
        token,
        deviceId,
        platform,
      }
    })
  }

  /**
   * Get user's FCM tokens
   */
  async getUserFcmTokens(userId: string): Promise<string[]> {
    const tokens = await this.prisma.deviceToken.findMany({
      where: { userId },
      select: { token: true }
    })
    return tokens.map(t => t.token)
  }
}

