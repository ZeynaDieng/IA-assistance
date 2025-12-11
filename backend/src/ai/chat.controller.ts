import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Query,
  BadRequestException,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { existsSync, mkdirSync } from 'fs'
import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { ChatService } from './chat.service'
import { SendTextDto } from './dto/chat-message.dto'
import { diskStorage } from 'multer'
import { extname } from 'path'
import * as crypto from 'crypto'

class SendTextMessageDto {
  @IsString()
  @IsNotEmpty()
  message: string
}

class GetHistoryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number | string
}

@Controller('ai/chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('text')
  async sendTextMessage(
    @CurrentUser() user: any,
    @Body() dto: SendTextMessageDto
  ) {
    try {
      const result = await this.chatService.sendTextMessage(user.id, dto.message)
      return {
        success: true,
        data: result,
      }
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to send message')
    }
  }

  @Post('voice')
  @UseInterceptors(
    FileInterceptor('audio', {
      storage: diskStorage({
        destination: './uploads/chat',
        filename: (req, file, cb) => {
          const randomName = crypto.randomBytes(16).toString('hex')
          const ext = extname(file.originalname)
          cb(null, `${randomName}${ext}`)
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max
      },
      fileFilter: (req, file, cb) => {
        const allowedMimes = [
          'audio/webm',
          'audio/mpeg',
          'audio/mp3',
          'audio/wav',
          'audio/ogg',
          'audio/opus',
        ]
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true)
        } else {
          cb(
            new BadRequestException(
              'Invalid file type. Allowed: webm, mp3, wav, ogg, opus'
            ),
            false
          )
        }
      },
    })
  )
  async sendVoiceMessage(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any
  ) {
    if (!file) {
      throw new BadRequestException('Audio file is required')
    }

    try {
      // Duration comes from FormData, accessible via req.body (Multer parses FormData)
      const duration = req.body?.duration ? parseInt(req.body.duration, 10) : undefined
      console.log('[ChatController] Received voice message with duration:', duration, 'seconds')
      const result = await this.chatService.sendVoiceMessage(user.id, file, duration)
      return {
        success: true,
        data: result,
      }
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to process voice message')
    }
  }

  @Get('history')
  async getHistory(
    @CurrentUser() user: any,
    @Query() query: any
  ) {
    try {
      // Parse limit manually to handle string conversion
      let limit = 50
      if (query.limit) {
        const parsedLimit = parseInt(query.limit, 10)
        if (!isNaN(parsedLimit) && parsedLimit > 0) {
          limit = parsedLimit
        }
      }
      const messages = await this.chatService.getConversationHistory(user.id, limit)
      return {
        success: true,
        data: messages,
      }
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to get history')
    }
  }

  @Post('validate-planning')
  async validatePlanning(
    @CurrentUser() user: any,
    @Body() body: { messageId: string }
  ) {
    try {
      if (!body.messageId) {
        throw new BadRequestException('messageId is required')
      }
      const result = await this.chatService.validatePlanning(user.id, body.messageId)
      return {
        success: true,
        data: result,
      }
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to validate planning')
    }
  }

  @Post('extract-from-message')
  async extractFromMessage(
    @CurrentUser() user: any,
    @Body() body: { messageId: string; content: string }
  ) {
    try {
      if (!body.messageId || !body.content) {
        throw new BadRequestException('messageId and content are required')
      }
      const result = await this.chatService.extractTasksFromMessage(user.id, body.messageId, body.content)
      return {
        success: true,
        data: result,
      }
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to extract tasks')
    }
  }

  @Post('clear-history')
  async clearHistory(@CurrentUser() user: any) {
    try {
      await this.chatService.clearHistory(user.id)
      return {
        success: true,
        message: 'Conversation history cleared successfully',
      }
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to clear history')
    }
  }
}

