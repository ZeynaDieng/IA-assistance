import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { UsersService } from './users.service'
import { UserPreferencesService } from './user-preferences.service'
import { UsersController } from './users.controller'

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, UserPreferencesService],
  exports: [UsersService, UserPreferencesService]
})
export class UsersModule {}

