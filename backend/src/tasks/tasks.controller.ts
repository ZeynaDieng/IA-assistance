import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ValidationPipe
} from '@nestjs/common'
import { SkipThrottle } from '@nestjs/throttler'
import { TasksService } from './tasks.service'
import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskDto } from './dto/update-task.dto'
import { PostponeTaskDto } from './dto/postpone-task.dto'
import { PaginationDto } from '../common/dto/pagination.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @SkipThrottle()
  async findAll(
    @CurrentUser() user: any,
    @Query() query: any
  ) {
    // Extract pagination params
    const pagination: PaginationDto = {
      page: query.page ? parseInt(query.page, 10) : 1,
      limit: query.limit ? parseInt(query.limit, 10) : 20
    }
    
    // Extract filter params
    const date = query.date
    const status = query.status
    const startDate = query.startDate
    const endDate = query.endDate
    const filters: any = {}

    if (date) {
      filters.date = new Date(date)
      console.log('[TasksController] Filtering by date:', date, '->', filters.date)
    }

    if (status) {
      filters.status = status
    }

    if (startDate && endDate) {
      filters.startDate = new Date(startDate)
      filters.endDate = new Date(endDate)
    }

    console.log('[TasksController] Finding tasks for user:', user.id, 'with filters:', filters)

    const result = await this.tasksService.findAll(
      user.id,
      filters,
      pagination.page || 1,
      pagination.limit || 20
    )

    console.log('[TasksController] Found', result.data.length, 'tasks')

    return {
      success: true,
      ...result
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    const task = await this.tasksService.findOne(id, user.id)
    return {
      success: true,
      data: task
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(ValidationPipe) createTaskDto: CreateTaskDto,
    @CurrentUser() user: any
  ) {
    const task = await this.tasksService.create(createTaskDto, user.id)
    return {
      success: true,
      data: task
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: any
  ) {
    const task = await this.tasksService.update(id, updateTaskDto, user.id)
    return {
      success: true,
      data: task
    }
  }

  @Post(':id/complete')
  @HttpCode(HttpStatus.OK)
  async complete(@Param('id') id: string, @CurrentUser() user: any) {
    const task = await this.tasksService.complete(id, user.id)
    return {
      success: true,
      data: task
    }
  }

  @Post(':id/postpone')
  @HttpCode(HttpStatus.OK)
  async postpone(
    @Param('id') id: string,
    @Body(ValidationPipe) body: PostponeTaskDto,
    @CurrentUser() user: any
  ) {
    const task = await this.tasksService.postpone(
      id,
      new Date(body.newDate),
      user.id
    )
    return {
      success: true,
      data: task
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    await this.tasksService.delete(id, user.id)
    return {
      success: true,
      message: 'Task deleted successfully'
    }
  }
}

