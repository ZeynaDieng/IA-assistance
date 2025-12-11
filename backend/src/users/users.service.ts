import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get user profile
   */
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        phoneNumber: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            tasks: {
              where: {
                status: 'COMPLETED'
              }
            },
            plannings: true,
            audioLogs: true
          }
        }
      }
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  /**
   * Get user statistics
   */
  async getStatistics(userId: string) {
    const [
      totalTasks,
      completedTasks,
      pendingTasks,
      totalPlannings,
      totalRecordings
    ] = await Promise.all([
      this.prisma.task.count({
        where: { userId }
      }),
      this.prisma.task.count({
        where: {
          userId,
          status: 'COMPLETED'
        }
      }),
      this.prisma.task.count({
        where: {
          userId,
          status: 'PENDING'
        }
      }),
      this.prisma.planning.count({
        where: { userId }
      }),
      this.prisma.audioLog.count({
        where: { userId }
      })
    ])

    // Calculate completion rate
    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    // Get current streak (consecutive days with completed tasks)
    const currentStreak = await this.calculateCurrentStreak(userId)

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      totalPlannings,
      totalRecordings,
      completionRate,
      currentStreak
    }
  }

  /**
   * Calculate current streak of completed tasks
   */
  private async calculateCurrentStreak(userId: string): Promise<number> {
    let streak = 0
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    while (true) {
      const startOfDay = new Date(currentDate)
      const endOfDay = new Date(currentDate)
      endOfDay.setHours(23, 59, 59, 999)

      const completedTasksToday = await this.prisma.task.count({
        where: {
          userId,
          status: 'COMPLETED',
          completedAt: {
            gte: startOfDay,
            lte: endOfDay
          }
        }
      })

      if (completedTasksToday > 0) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }

    return streak
  }
}

