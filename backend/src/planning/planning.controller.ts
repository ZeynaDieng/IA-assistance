import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  BadRequestException
} from '@nestjs/common'
import { PlanningService } from './planning.service'
import { GeneratePlanningDto } from './dto/generate-planning.dto'
import { ValidatePlanningDto } from './dto/validate-planning.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { RoutinesService } from '../routines/routines.service'

@Controller('planning')
@UseGuards(JwtAuthGuard)
export class PlanningController {
  constructor(
    private readonly planningService: PlanningService,
    private readonly routinesService: RoutinesService
  ) {}

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  async generatePlanning(
    @Body(ValidationPipe) body: GeneratePlanningDto,
    @CurrentUser() user: any
  ) {
    try {
      // Validate tasks array (can be empty if routines will generate tasks)
      if (!body.tasks || !Array.isArray(body.tasks)) {
        throw new BadRequestException("tasks must be an array")
      }
      
      // Allow empty array - routines will be included automatically
      // The backend will check if we have any tasks after including routines

      const targetDate = body.date ? new Date(body.date) : new Date()

      // Validate targetDate
      if (isNaN(targetDate.getTime())) {
        throw new BadRequestException(`Invalid date provided: ${body.date}`)
      }

      console.log(`[PlanningController] Generating planning for ${body.tasks.length} punctual task(s) on ${targetDate.toISOString().split('T')[0]} (routines will be included automatically)`)

      // Convert tasks to proper format with validation
      const tasks = body.tasks.map((task, index) => {
        // Validate duration
        let duration: number;
        if (typeof task.duration === 'number') {
          duration = Math.round(task.duration);
        } else if (typeof task.duration === 'string') {
          duration = parseInt(task.duration, 10);
        } else {
          throw new BadRequestException(`Invalid duration type for task ${index + 1} "${task.title}": ${typeof task.duration}`);
        }

        if (isNaN(duration) || duration <= 0 || duration > 1440) {
          throw new BadRequestException(`Invalid duration for task "${task.title}": ${task.duration} (must be between 1 and 1440 minutes)`);
        }

        // Validate suggestedTime format (HH:mm)
        let suggestedTime: string | undefined = undefined;
        if (task.suggestedTime) {
          if (typeof task.suggestedTime !== 'string') {
            console.warn(`Invalid suggestedTime type for task "${task.title}": ${typeof task.suggestedTime}, ignoring`);
          } else {
            const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
            if (timeRegex.test(task.suggestedTime)) {
              suggestedTime = task.suggestedTime;
            } else {
              console.warn(`Invalid suggestedTime format for task "${task.title}": ${task.suggestedTime}, expected HH:mm format, ignoring`);
            }
          }
        }

        // Validate deadline
        let deadline: Date | undefined = undefined;
        if (task.deadline) {
          const deadlineDate = new Date(task.deadline);
          if (isNaN(deadlineDate.getTime())) {
            console.warn(`Invalid deadline format for task "${task.title}": ${task.deadline}, ignoring`);
          } else {
            deadline = deadlineDate;
          }
        }

        // Validate priority
        if (!["LOW", "MEDIUM", "HIGH", "URGENT"].includes(task.priority)) {
          throw new BadRequestException(`Invalid priority for task "${task.title}": ${task.priority}`);
        }

        return {
          title: task.title,
          description: task.description,
          priority: task.priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
          duration,
          deadline,
          suggestedTime,
          category: task.category,
          dependsOn: task.dependsOn,
          requiresFocus: task.requiresFocus === true,
          location: task.location,
          energyLevel: (task.energyLevel && ["LOW", "MEDIUM", "HIGH"].includes(task.energyLevel))
            ? task.energyLevel as 'LOW' | 'MEDIUM' | 'HIGH'
            : undefined,
        }
      })

      const includeRoutines = body.includeRoutines !== false; // Default to true
      
      const plannedTasks = await this.planningService.generatePlanning(
        tasks,
        user.id,
        targetDate,
        includeRoutines
      )

      // Validate that all tasks have scheduledAt
      for (const task of plannedTasks) {
        if (!task.scheduledAt || !(task.scheduledAt instanceof Date)) {
          throw new Error(`Task "${task.title}" has invalid scheduledAt: ${task.scheduledAt}`)
        }
        if (isNaN(task.scheduledAt.getTime())) {
          throw new Error(`Task "${task.title}" has invalid scheduledAt date: ${task.scheduledAt}`)
        }
      }

      return {
        success: true,
        data: {
          date: targetDate.toISOString().split('T')[0], // Return date only (YYYY-MM-DD)
          tasks: plannedTasks.map((task) => ({
            ...task,
            scheduledAt: task.scheduledAt.toISOString(),
            deadline: task.deadline?.toISOString()
          }))
        }
      }
    } catch (error: any) {
      console.error('Error in generatePlanning:', error)
      throw error
    }
  }

  @Post('validate')
  @HttpCode(HttpStatus.CREATED)
  async validatePlanning(
    @Body(ValidationPipe) body: ValidatePlanningDto,
    @CurrentUser() user: any
  ) {
    try {
      console.log('[PlanningController] validatePlanning called with:', {
        userId: user.id,
        date: body.date,
        tasksCount: body.tasks?.length || 0,
        audioLogId: body.audioLogId,
        routineRenewals: body.routineRenewals
      })

      // Check for routines that are expiring soon
      const expiringRoutines = await this.routinesService.findRoutinesExpiringSoon(
        user.id,
        7 // 7 days ahead
      )

      // If there are expiring routines and user hasn't provided renewal decisions
      if (expiringRoutines.length > 0 && !body.routineRenewals) {
        return {
          success: false,
          requiresRenewalDecision: true,
          data: {
            expiringRoutines: expiringRoutines.map((r) => ({
              id: r.id,
              title: r.title,
              expiresAt: r.expiresAt.toISOString(),
              autoRenew: r.autoRenew
            })),
            message: 'Certaines routines expirent bientôt. Souhaitez-vous les renouveler ?'
          }
        }
      }

      // Process routine renewals if provided
      if (body.routineRenewals && Array.isArray(body.routineRenewals)) {
        for (const renewal of body.routineRenewals) {
          if (renewal.shouldRenew) {
            await this.routinesService.renewRoutine(renewal.routineId, user.id)
            console.log(`[PlanningController] Renewed routine ${renewal.routineId}`)
          } else {
            // Mark that we asked (so we don't ask again) but don't renew
            await this.routinesService.markRenewalAsked(renewal.routineId, user.id)
            console.log(`[PlanningController] User declined to renew routine ${renewal.routineId}`)
          }
        }
      }

      const date = new Date(body.date)

      // Convert tasks to proper format
      const tasks = body.tasks.map((task) => ({
        title: task.title,
        description: task.description,
        priority: task.priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
        duration: parseInt(task.duration, 10),
        scheduledAt: new Date(task.scheduledAt),
        deadline: task.deadline ? new Date(task.deadline) : undefined
      }))

      console.log('[PlanningController] Converted tasks:', tasks.length)

      const result = await this.planningService.validatePlanning(
        {
          date,
          tasks,
          audioLogId: body.audioLogId
        },
        user.id
      )

      console.log('[PlanningController] Planning validated successfully:', {
        planningId: result.planning.id,
        tasksCreated: result.tasks.length
      })

      return {
        success: true,
        data: {
          planning: result.planning,
          tasks: result.tasks
        }
      }
    } catch (error: any) {
      console.error('[PlanningController] Error validating planning:', error)
      throw error
    }
  }
}

