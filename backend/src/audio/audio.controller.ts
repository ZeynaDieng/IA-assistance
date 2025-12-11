import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Param,
  Get,
  HttpCode,
  HttpStatus
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { AudioService } from './audio.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'

@Controller('audio')
@UseGuards(JwtAuthGuard)
export class AudioController {
  constructor(private readonly audioService: AudioService) {}

  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  async uploadAudio(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any
  ) {
    const result = await this.audioService.uploadAudio(file, user.id)
    return {
      success: true,
      data: result
    }
  }

  @Get(':id')
  async getAudioLog(@Param('id') id: string, @CurrentUser() user: any) {
    const audioLog = await this.audioService.getAudioLog(id, user.id)
    return {
      success: true,
      data: audioLog
    }
  }
}
