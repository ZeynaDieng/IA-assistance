import { Controller, Get, Put, Body, UseGuards, ValidationPipe } from '@nestjs/common'
import { SkipThrottle } from '@nestjs/throttler'
import { UsersService } from './users.service'
import { UserPreferencesService, UpdatePreferencesDto } from './user-preferences.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly preferencesService: UserPreferencesService
  ) {}

  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    const profile = await this.usersService.getProfile(user.id)
    return {
      success: true,
      data: profile
    }
  }

  @Get('statistics')
  async getStatistics(@CurrentUser() user: any) {
    const statistics = await this.usersService.getStatistics(user.id)
    return {
      success: true,
      data: statistics
    }
  }

  @Get('preferences')
  async getPreferences(@CurrentUser() user: any) {
    const preferences = await this.preferencesService.getOrCreatePreferences(user.id)
    return {
      success: true,
      data: preferences
    }
  }

  @Put('preferences')
  @SkipThrottle()
  async updatePreferences(
    @CurrentUser() user: any,
    @Body(ValidationPipe) data: UpdatePreferencesDto
  ) {
    const preferences = await this.preferencesService.updatePreferences(user.id, data)
    return {
      success: true,
      data: preferences,
      message: 'Préférences mises à jour avec succès'
    }
  }
}

