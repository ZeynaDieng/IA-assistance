import { Controller, Get, Post, Param, Delete, Body, UseGuards, Query, ValidationPipe } from '@nestjs/common'
import { NotificationsService } from './notifications.service'
import { RegisterDeviceDto } from './dto/register-device.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getReminders(
    @CurrentUser() user: any,
    @Query('status') status?: 'PENDING' | 'SENT' | 'CANCELLED'
  ) {
    const reminders = await this.notificationsService.getUserReminders(
      user.id,
      status
    )
    return {
      success: true,
      data: reminders
    }
  }

  @Post('device/register')
  async registerDevice(
    @CurrentUser() user: any,
    @Body(ValidationPipe) dto: RegisterDeviceDto
  ) {
    await this.notificationsService.registerDeviceToken(
      user.id,
      dto.token,
      dto.deviceId,
      dto.platform
    )
    return {
      success: true,
      message: 'Device registered successfully'
    }
  }

  @Delete(':id')
  async cancelReminder(@Param('id') id: string, @CurrentUser() user: any) {
    await this.notificationsService.cancelReminder(id, user.id)
    return {
      success: true,
      message: 'Reminder cancelled'
    }
  }
}

