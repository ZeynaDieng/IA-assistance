import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus
} from '@nestjs/common'
import { RoutinesService } from './routines.service'
import { CreateRoutineDto } from './dto/create-routine.dto'
import { UpdateRoutineDto } from './dto/update-routine.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'

@Controller('routines')
@UseGuards(JwtAuthGuard)
export class RoutinesController {
  constructor(private readonly routinesService: RoutinesService) {}

  @Get()
  async findAll(
    @CurrentUser() user: any,
    @Query('includeInactive') includeInactive?: string
  ) {
    const routines = await this.routinesService.findAll(
      user.id,
      includeInactive === 'true'
    )

    return {
      success: true,
      data: routines
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    const routine = await this.routinesService.findOne(id, user.id)

    return {
      success: true,
      data: routine
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createRoutineDto: CreateRoutineDto,
    @CurrentUser() user: any
  ) {
    try {
      console.log('[RoutinesController] Creating routine:', JSON.stringify(createRoutineDto, null, 2))
      const routine = await this.routinesService.create(user.id, createRoutineDto)

      return {
        success: true,
        data: routine
      }
    } catch (error: any) {
      console.error('[RoutinesController] Error creating routine:', error)
      throw error
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRoutineDto: UpdateRoutineDto,
    @CurrentUser() user: any
  ) {
    const routine = await this.routinesService.update(
      id,
      user.id,
      updateRoutineDto
    )

    return {
      success: true,
      data: routine
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    await this.routinesService.remove(id, user.id)
    return {
      success: true
    }
  }

  @Post(':id/toggle')
  async toggleActive(@Param('id') id: string, @CurrentUser() user: any) {
    const routine = await this.routinesService.toggleActive(id, user.id)

    return {
      success: true,
      data: routine
    }
  }

  @Post('generate-tasks')
  @HttpCode(HttpStatus.OK)
  async generateTasks(
    @CurrentUser() user: any,
    @Query('date') date?: string
  ) {
    const targetDate = date ? new Date(date) : new Date()
    const tasks = await this.routinesService.generateTasksFromRoutines(
      user.id,
      targetDate
    )

    return {
      success: true,
      data: {
        date: targetDate.toISOString().split('T')[0],
        tasks
      }
    }
  }

  @Get('expiring-soon')
  async findExpiringSoon(
    @CurrentUser() user: any,
    @Query('daysAhead') daysAhead?: string
  ) {
    const days = daysAhead ? parseInt(daysAhead, 10) : 7
    const routines = await this.routinesService.findRoutinesExpiringSoon(
      user.id,
      days
    )

    return {
      success: true,
      data: routines
    }
  }

  @Post(':id/renew')
  async renewRoutine(
    @Param('id') id: string,
    @CurrentUser() user: any
  ) {
    const routine = await this.routinesService.renewRoutine(id, user.id)

    return {
      success: true,
      data: routine
    }
  }

  @Post(':id/mark-renewal-asked')
  async markRenewalAsked(
    @Param('id') id: string,
    @CurrentUser() user: any
  ) {
    const routine = await this.routinesService.markRenewalAsked(id, user.id)

    return {
      success: true,
      data: routine
    }
  }

  @Post(':id/deactivate')
  async deactivate(
    @Param('id') id: string,
    @CurrentUser() user: any
  ) {
    const routine = await this.routinesService.deactivate(id, user.id)

    return {
      success: true,
      data: routine
    }
  }
}

