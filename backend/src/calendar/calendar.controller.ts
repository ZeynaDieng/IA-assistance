import { Controller, Get, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { RoutinesService } from '../routines/routines.service'

@Controller('calendar')
@UseGuards(JwtAuthGuard)
export class CalendarController {
  constructor(
    private prisma: PrismaService,
    private routinesService: RoutinesService
  ) {}

  @Get('month')
  @HttpCode(HttpStatus.OK)
  async getMonthTasks(
    @CurrentUser() user: any,
    @Query('year') year?: string,
    @Query('month') month?: string
  ) {
    const targetYear = year ? parseInt(year, 10) : new Date().getFullYear()
    const targetMonth = month ? parseInt(month, 10) - 1 : new Date().getMonth()

    const startDate = new Date(targetYear, targetMonth, 1)
    const endDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59, 999)

    // Get all saved tasks for the month
    const savedTasks = await this.prisma.task.findMany({
      where: {
        userId: user.id,
        scheduledAt: {
          gte: startDate,
          lte: endDate
        }
      },
      select: {
        id: true,
        scheduledAt: true,
        priority: true,
        status: true
      }
    })

    // Generate tasks from active routines for each day of the month
    const routineTasks: Array<{ scheduledAt: Date; priority: string }> = []
    const currentDate = new Date(startDate)
    
    while (currentDate <= endDate) {
      const tasksFromRoutines = await this.routinesService.generateTasksFromRoutines(
        user.id,
        new Date(currentDate)
      )
      
      // Map routine tasks to match the format
      tasksFromRoutines.forEach(task => {
        routineTasks.push({
          scheduledAt: task.scheduledAt,
          priority: task.priority || 'MEDIUM'
        })
      })
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Combine saved tasks and routine tasks
    const allTasks = [
      ...savedTasks.map(t => ({ scheduledAt: new Date(t.scheduledAt), priority: t.priority })),
      ...routineTasks
    ]

    // Group tasks by day
    const tasksByDay: Record<number, { count: number; highestPriority: string }> = {}

    allTasks.forEach((task) => {
      const day = new Date(task.scheduledAt).getDate()
      if (!tasksByDay[day]) {
        tasksByDay[day] = { count: 0, highestPriority: 'LOW' }
      }

      tasksByDay[day].count++

      // Determine highest priority
      const priorityOrder = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 }
      if (
        priorityOrder[task.priority] >
        priorityOrder[tasksByDay[day].highestPriority]
      ) {
        tasksByDay[day].highestPriority = task.priority
      }
    })

    return {
      success: true,
      data: {
        year: targetYear,
        month: targetMonth + 1,
        tasksByDay
      }
    }
  }

  @Get('day')
  @HttpCode(HttpStatus.OK)
  async getDayTasks(
    @CurrentUser() user: any,
    @Query('date') date: string
  ) {
    const targetDate = new Date(date)
    const startOfDay = new Date(targetDate)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(targetDate)
    endOfDay.setHours(23, 59, 59, 999)

    // Get saved tasks for the day
    const savedTasks = await this.prisma.task.findMany({
      where: {
        userId: user.id,
        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      orderBy: {
        scheduledAt: 'asc'
      }
    })

    // Only return saved tasks - routine tasks should be created as actual tasks
    // when the user validates a planning, not displayed as temporary tasks
    const allTasks = savedTasks.sort((a, b) => {
      return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    })

    return {
      success: true,
      data: {
        date: targetDate.toISOString(),
        tasks: allTasks
      }
    }
  }
}

