import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Inject,
  forwardRef
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskDto } from './dto/update-task.dto'
import { PaginatedResult } from '../common/dto/pagination.dto'
import { NotificationsService } from '../notifications/notifications.service'

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => NotificationsService))
    private notificationsService?: NotificationsService
  ) {}

  /**
   * Find all tasks for a user with optional filters and pagination
   */
  async findAll(
    userId: string,
    filters?: {
      date?: Date
      status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED'
      startDate?: Date
      endDate?: Date
    },
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResult<any>> {
    const where: any = {
      userId
    }

    if (filters?.date) {
      const startOfDay = new Date(filters.date)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(filters.date)
      endOfDay.setHours(23, 59, 59, 999)

      console.log('[TasksService] Filtering by date:', {
        inputDate: filters.date,
        startOfDay: startOfDay.toISOString(),
        endOfDay: endOfDay.toISOString()
      })

      where.scheduledAt = {
        gte: startOfDay,
        lte: endOfDay
      }
    }

    if (filters?.startDate && filters?.endDate) {
      where.scheduledAt = {
        gte: filters.startDate,
        lte: filters.endDate
      }
    }

    if (filters?.status) {
      where.status = filters.status
    }

    const skip = (page - 1) * limit

    // Get total count and data in parallel
    const [data, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        select: {
          id: true,
          title: true,
          description: true,
          priority: true,
          duration: true,
          scheduledAt: true,
          deadline: true,
          status: true,
          completedAt: true,
          createdAt: true,
          updatedAt: true,
          planning: {
            select: {
              id: true,
              date: true
            }
          }
        },
        orderBy: {
          scheduledAt: 'asc'
        },
        skip,
        take: limit
      }),
      this.prisma.task.count({ where })
    ])

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  /**
   * Find one task by ID
   */
  async findOne(id: string, userId: string) {
    const task = await this.prisma.task.findFirst({
      where: {
        id,
        userId
      },
      include: {
        planning: {
          select: {
            id: true,
            date: true
          }
        },
        reminders: {
          where: {
            status: 'PENDING'
          }
        }
      }
    })

    if (!task) {
      throw new NotFoundException('Task not found')
    }

    return task
  }

  /**
   * Create a new task
   */
  async create(createTaskDto: CreateTaskDto, userId: string) {
    const task = await this.prisma.task.create({
      data: {
        ...createTaskDto,
        scheduledAt: new Date(createTaskDto.scheduledAt),
        deadline: createTaskDto.deadline ? new Date(createTaskDto.deadline) : null,
        userId,
        status: 'PENDING'
      }
    })

    // Create reminder for the task if notifications service is available
    if (this.notificationsService) {
      try {
        await this.notificationsService.createReminder(
          task.id,
          userId,
          task.scheduledAt
        )
      } catch (error) {
        console.error('[TasksService] Failed to create reminder:', error)
        // Don't fail task creation if reminder creation fails
      }
    }

    return task
  }

  /**
   * Update a task
   */
  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    // Verify ownership
    const existingTask = await this.findOne(id, userId)

    const updateData: any = {}
    let scheduledAtChanged = false

    if (updateTaskDto.title !== undefined) {
      updateData.title = updateTaskDto.title
    }
    if (updateTaskDto.description !== undefined) {
      updateData.description = updateTaskDto.description
    }
    if (updateTaskDto.priority !== undefined) {
      updateData.priority = updateTaskDto.priority
    }
    if (updateTaskDto.duration !== undefined) {
      updateData.duration = updateTaskDto.duration
    }
    if (updateTaskDto.scheduledAt !== undefined) {
      updateData.scheduledAt = new Date(updateTaskDto.scheduledAt)
      scheduledAtChanged = true
    }
    if (updateTaskDto.deadline !== undefined) {
      updateData.deadline = updateTaskDto.deadline
        ? new Date(updateTaskDto.deadline)
        : null
    }

    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: updateData
    })

    // If scheduledAt changed, cancel old reminders and create new one
    if (scheduledAtChanged && this.notificationsService) {
      try {
        // Cancel existing pending reminders
        await this.prisma.reminder.updateMany({
          where: {
            taskId: id,
            status: 'PENDING'
          },
          data: {
            status: 'CANCELLED'
          }
        })

        // Create new reminder with updated scheduledAt
        await this.notificationsService.createReminder(
          id,
          userId,
          updatedTask.scheduledAt
        )
      } catch (error) {
        console.error('[TasksService] Failed to update reminder:', error)
        // Don't fail task update if reminder update fails
      }
    }

    return updatedTask
  }

  /**
   * Mark task as completed
   */
  async complete(id: string, userId: string) {
    // Verify ownership
    const task = await this.findOne(id, userId)

    // Cancel pending reminders
    await this.prisma.reminder.updateMany({
      where: {
        taskId: id,
        status: 'PENDING'
      },
      data: {
        status: 'CANCELLED'
      }
    })

    return this.prisma.task.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date()
      }
    })
  }

  /**
   * Postpone a task to a new date
   */
  async postpone(id: string, newDate: Date, userId: string) {
    // Verify ownership
    await this.findOne(id, userId)

    return this.prisma.task.update({
      where: { id },
      data: {
        scheduledAt: newDate,
        status: 'POSTPONED'
      }
    })
  }

  /**
   * Delete a task
   */
  async delete(id: string, userId: string) {
    // Verify ownership
    await this.findOne(id, userId)

    // Delete reminders (cascade)
    await this.prisma.reminder.deleteMany({
      where: { taskId: id }
    })

    // Delete task
    await this.prisma.task.delete({
      where: { id }
    })

    return { success: true }
  }
}

