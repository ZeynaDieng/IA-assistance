import { Module, forwardRef } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PrismaModule } from '../prisma/prisma.module'
import { RoutinesModule } from '../routines/routines.module'
import { RoutinesService } from '../routines/routines.service'
import { WhisperService } from './whisper.service'
import { WhisperLocalService } from './whisper-local.service'
import { GptService } from './gpt.service'
import { ChatService } from './chat.service'
import { FeedbackService } from './feedback.service'
import { AiContextService } from './ai-context.service'
import { ExtractionValidator } from './extraction-validator.service'
import { AiController } from './ai.controller'
import { ChatController } from './chat.controller'
import { PrismaService } from '../prisma/prisma.service'

@Module({
  imports: [ConfigModule, PrismaModule, forwardRef(() => RoutinesModule)],
  controllers: [AiController, ChatController],
  providers: [
    FeedbackService,
    AiContextService,
    ExtractionValidator,
    WhisperService,
    WhisperLocalService,
    {
      provide: GptService,
      useFactory: (
        configService: ConfigService,
        prisma: PrismaService,
        aiContextService: AiContextService,
        extractionValidator: ExtractionValidator
      ) => {
        return new GptService(configService, prisma, aiContextService, extractionValidator)
      },
      inject: [ConfigService, PrismaService, AiContextService, ExtractionValidator],
    },
    {
      provide: ChatService,
      useFactory: (
        prisma: PrismaService,
        gptService: GptService,
        whisperService: WhisperService,
        whisperLocalService: WhisperLocalService,
        aiContextService: AiContextService,
        routinesService: RoutinesService
      ) => {
        return new ChatService(prisma, gptService, whisperService, whisperLocalService, aiContextService, routinesService)
      },
      inject: [PrismaService, GptService, WhisperService, WhisperLocalService, AiContextService, RoutinesService],
    },
  ],
  exports: [
    WhisperService,
    WhisperLocalService,
    GptService,
    ChatService,
    FeedbackService,
    AiContextService,
    ExtractionValidator,
  ],
})
export class AiModule {}

