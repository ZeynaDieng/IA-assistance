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
import { Throttle } from '@nestjs/throttler'
import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator'
import { WhisperService } from './whisper.service'
import { GptService } from './gpt.service'
import { FeedbackService, UserCorrections } from './feedback.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'

class TranscribeDto {
  @IsString()
  @IsNotEmpty()
  audioLogId: string
}

class ExtractTasksDto {
  @IsString()
  @IsNotEmpty()
  transcription: string
}

class FeedbackDto {
  @IsString()
  @IsNotEmpty()
  transcription: string

  @IsObject()
  @IsNotEmpty()
  originalExtraction: any

  @IsObject()
  @IsNotEmpty()
  userCorrections: UserCorrections

  @IsString()
  @IsNotEmpty()
  feedbackType: string

  @IsString()
  @IsOptional()
  errorType?: string

  @IsString()
  @IsOptional()
  notes?: string
}

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(
    private readonly whisperService: WhisperService,
    private readonly gptService: GptService,
    private readonly feedbackService: FeedbackService
  ) {}

  @Post('transcribe')
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute for AI endpoints
  @HttpCode(HttpStatus.OK)
  async transcribeAudio(
    @Body(ValidationPipe) body: TranscribeDto,
    @CurrentUser() user: any
  ) {
    const transcription = await this.whisperService.transcribeAudio(
      body.audioLogId,
      user.id
    )
    return {
      success: true,
      data: {
        transcription
      }
    }
  }

  @Post('extract-tasks')
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute for AI endpoints
  @HttpCode(HttpStatus.OK)
  async extractTasks(
    @Body(ValidationPipe) body: ExtractTasksDto,
    @CurrentUser() user: any
  ) {
    try {
      console.log('[AiController] extractTasks called, transcription length:', body.transcription?.length || 0)
      
      if (!body.transcription || typeof body.transcription !== 'string') {
        throw new BadRequestException('transcription is required and must be a string')
      }

      // Pass userId for memory mode (routines context)
      const result = await this.gptService.extractTasks(body.transcription, user.id)
      
      console.log('[AiController] Extraction successful:', { 
        tasksCount: result.tasks.length, 
        routinesCount: result.routines.length 
      })
      
      return {
        success: true,
        data: {
          tasks: result.tasks,
          routines: result.routines || []
        }
      }
    } catch (error: any) {
      console.error('[AiController] Error in extractTasks:', error)
      throw error
    }
  }

  @Post('feedback')
  @HttpCode(HttpStatus.CREATED)
  async submitFeedback(
    @Body(ValidationPipe) body: FeedbackDto,
    @CurrentUser() user: any
  ) {
    try {
      await this.feedbackService.saveFeedback({
        userId: user.id,
        transcription: body.transcription,
        originalExtraction: body.originalExtraction,
        userCorrections: body.userCorrections,
        feedbackType: body.feedbackType as any,
        errorType: body.errorType as any,
        notes: body.notes,
      })

      return {
        success: true,
        message: 'Feedback enregistré avec succès. Merci pour votre contribution !',
      }
    } catch (error: any) {
      console.error('[AiController] Error saving feedback:', error)
      throw new BadRequestException('Erreur lors de l\'enregistrement du feedback')
    }
  }
}

