import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateRoutineDto } from './dto/create-routine.dto'
import { UpdateRoutineDto } from './dto/update-routine.dto'

@Injectable()
export class RoutinesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Find all routines for a user
   */
  async findAll(userId: string, includeInactive = false) {
    const where: any = {
      userId
    }

    if (!includeInactive) {
      where.isActive = true
    }

    return this.prisma.routine.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  /**
   * Find one routine by ID
   */
  async findOne(id: string, userId: string) {
    const routine = await this.prisma.routine.findFirst({
      where: {
        id,
        userId
      }
    })

    if (!routine) {
      throw new NotFoundException('Routine not found')
    }

    return routine
  }

  /**
   * Create a new routine
   */
  async create(userId: string, createRoutineDto: CreateRoutineDto) {
    // Validate daysOfWeek for WEEKLY and CUSTOM frequencies
    if (
      (createRoutineDto.frequency === 'WEEKLY' ||
        createRoutineDto.frequency === 'CUSTOM') &&
      (!createRoutineDto.daysOfWeek || createRoutineDto.daysOfWeek.length === 0)
    ) {
      throw new BadRequestException(
        'daysOfWeek is required for WEEKLY and CUSTOM frequencies'
      )
    }

    // Calculate expiration date (1 month from now)
    const expiresAt = new Date()
    expiresAt.setMonth(expiresAt.getMonth() + 1)

    // Prepare data for Prisma
    // Note: daysOfWeek must always be an array (can be empty)
    const routineData: any = {
      title: createRoutineDto.title,
      description: createRoutineDto.description || null,
      frequency: createRoutineDto.frequency,
      time: createRoutineDto.time || null,
      daysOfWeek: createRoutineDto.daysOfWeek || [], // Always provide an array
      duration: createRoutineDto.duration,
      priority: createRoutineDto.priority,
      userId,
      isActive: createRoutineDto.isActive ?? true,
      expiresAt,
      autoRenew: createRoutineDto.autoRenew ?? true // Default to auto-renew
    }

    console.log('[RoutinesService] Creating routine with data:', JSON.stringify(routineData, null, 2))

    try {
      return await this.prisma.routine.create({
        data: routineData
      })
    } catch (error: any) {
      console.error('[RoutinesService] Error creating routine:', error)
      throw new BadRequestException(
        `Failed to create routine: ${error.message || 'Unknown error'}`
      )
    }
  }

  /**
   * Update a routine
   */
  async update(id: string, userId: string, updateRoutineDto: UpdateRoutineDto) {
    // Verify routine belongs to user
    const routine = await this.findOne(id, userId)

    // Validate daysOfWeek if frequency is being updated to WEEKLY or CUSTOM
    if (
      updateRoutineDto.frequency === 'WEEKLY' ||
      updateRoutineDto.frequency === 'CUSTOM'
    ) {
      if (
        !updateRoutineDto.daysOfWeek ||
        updateRoutineDto.daysOfWeek.length === 0
      ) {
        // If frequency is being changed, require daysOfWeek
        if (updateRoutineDto.frequency !== routine.frequency) {
          throw new BadRequestException(
            'daysOfWeek is required for WEEKLY and CUSTOM frequencies'
          )
        }
      }
    }

    return this.prisma.routine.update({
      where: { id },
      data: updateRoutineDto
    })
  }

  /**
   * Delete a routine
   */
  async remove(id: string, userId: string) {
    // Verify routine belongs to user
    await this.findOne(id, userId)

    return this.prisma.routine.delete({
      where: { id }
    })
  }

  /**
   * Toggle routine active status
   */
  async toggleActive(id: string, userId: string) {
    const routine = await this.findOne(id, userId)

    return this.prisma.routine.update({
      where: { id },
      data: {
        isActive: !routine.isActive
      }
    })
  }

  /**
   * Generate tasks from active routines for a specific date
   * Only includes routines that haven't expired yet
   */
  async generateTasksFromRoutines(userId: string, targetDate: Date) {
    const now = new Date()
    const activeRoutines = await this.prisma.routine.findMany({
      where: {
        userId,
        isActive: true,
        expiresAt: {
          gte: now // Only include routines that haven't expired
        }
      }
    })

    const generatedTasks = []

    for (const routine of activeRoutines) {
      const shouldGenerate = this.shouldGenerateForDate(routine, targetDate)

      if (shouldGenerate) {
        // Calculate scheduled time
        const scheduledAt = this.calculateScheduledTime(routine, targetDate)

        generatedTasks.push({
          title: routine.title,
          description: routine.description,
          priority: routine.priority,
          duration: routine.duration,
          scheduledAt,
          routineId: routine.id
        })
      }
    }

    return generatedTasks
  }

  /**
   * Check if a routine should generate a task for the given date
   */
  private shouldGenerateForDate(routine: any, date: Date): boolean {
    const dayOfWeek = date.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const dayName = this.getDayName(dayOfWeek)

    switch (routine.frequency) {
      case 'DAILY':
        return true

      case 'WEEKDAYS':
        return dayOfWeek >= 1 && dayOfWeek <= 5 // Monday to Friday

      case 'WEEKENDS':
        return dayOfWeek === 0 || dayOfWeek === 6 // Saturday or Sunday

      case 'WEEKLY':
      case 'CUSTOM':
        if (!routine.daysOfWeek || routine.daysOfWeek.length === 0) {
          return false
        }
        return routine.daysOfWeek.includes(dayName)

      default:
        return false
    }
  }

  /**
   * Calculate scheduled time for a routine on a given date
   */
  private calculateScheduledTime(routine: any, date: Date): Date {
    const scheduledAt = new Date(date)

    if (routine.time) {
      const [hours, minutes] = routine.time.split(':').map(Number)
      scheduledAt.setHours(hours, minutes, 0, 0)
    } else {
      // Distribute routines intelligently instead of all at 8:00
      // Use a hash-based approach to spread routines across the day
      const titleHash = routine.title.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)
      // Spread between 9:00 and 18:00 (avoiding 8:00 default)
      const hour = 9 + (titleHash % 9) // 9:00 to 17:00
      const minute = (titleHash % 4) * 15 // 0, 15, 30, or 45
      scheduledAt.setHours(hour, minute, 0, 0)
      console.log(`[RoutinesService] No time specified for routine "${routine.title}", distributed to ${hour}:${minute.toString().padStart(2, '0')}`)
    }

    return scheduledAt
  }

  /**
   * Get day name from day of week number
   */
  private getDayName(dayOfWeek: number): string {
    const days = [
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY'
    ]
    return days[dayOfWeek]
  }

  /**
   * Get routines that are about to expire (within next 7 days)
   */
  async findRoutinesExpiringSoon(userId: string, daysAhead: number = 7) {
    const now = new Date()
    const expirationThreshold = new Date()
    expirationThreshold.setDate(expirationThreshold.getDate() + daysAhead)

    return this.prisma.routine.findMany({
      where: {
        userId,
        isActive: true,
        expiresAt: {
          gte: now,
          lte: expirationThreshold
        },
        renewalAskedAt: null // Only routines where we haven't asked yet
      },
      orderBy: {
        expiresAt: 'asc'
      }
    })
  }

  /**
   * Renew a routine (extend expiration by 1 month)
   */
  async renewRoutine(id: string, userId: string) {
    const routine = await this.findOne(id, userId)
    
    const newExpiresAt = new Date(routine.expiresAt)
    newExpiresAt.setMonth(newExpiresAt.getMonth() + 1)

    return this.prisma.routine.update({
      where: { id },
      data: {
        expiresAt: newExpiresAt,
        renewalAskedAt: null // Reset the flag
      }
    })
  }

  /**
   * Mark that renewal has been asked for this routine
   */
  async markRenewalAsked(id: string, userId: string) {
    await this.findOne(id, userId)

    return this.prisma.routine.update({
      where: { id },
      data: {
        renewalAskedAt: new Date()
      }
    })
  }

  /**
   * Auto-renew all expired routines that have autoRenew enabled
   */
  async autoRenewExpiredRoutines(userId?: string) {
    const now = new Date()
    const where: any = {
      isActive: true,
      autoRenew: true,
      expiresAt: {
        lt: now // Expired routines
      }
    }

    if (userId) {
      where.userId = userId
    }

    const expiredRoutines = await this.prisma.routine.findMany({
      where
    })

    const renewedRoutines = []

    for (const routine of expiredRoutines) {
      const newExpiresAt = new Date(routine.expiresAt)
      newExpiresAt.setMonth(newExpiresAt.getMonth() + 1)

      const renewed = await this.prisma.routine.update({
        where: { id: routine.id },
        data: {
          expiresAt: newExpiresAt,
          renewalAskedAt: null
        }
      })

      renewedRoutines.push(renewed)
      console.log(`[RoutinesService] Auto-renewed routine "${routine.title}" until ${newExpiresAt.toISOString()}`)
    }

    // Deactivate routines that have expired and don't have autoRenew
    const expiredWithoutAutoRenew = await this.prisma.routine.findMany({
      where: {
        ...where,
        autoRenew: false
      }
    })

    for (const routine of expiredWithoutAutoRenew) {
      await this.prisma.routine.update({
        where: { id: routine.id },
        data: {
          isActive: false
        }
      })
      console.log(`[RoutinesService] Deactivated expired routine "${routine.title}" (autoRenew: false)`)
    }

    return {
      renewed: renewedRoutines.length,
      deactivated: expiredWithoutAutoRenew.length
    }
  }

  /**
   * Deactivate a routine (user can do this anytime)
   */
  async deactivate(id: string, userId: string) {
    const routine = await this.findOne(id, userId)

    return this.prisma.routine.update({
      where: { id },
      data: {
        isActive: false
      }
    })
  }
}

