import { IsString, IsNotEmpty, IsOptional } from 'class-validator'

export class SendTextDto {
  @IsString()
  @IsNotEmpty()
  message: string
}

export class SendVoiceDto {
  // File will be handled by multer
}

export class ChatMessageDto {
  id: string
  role: 'user' | 'assistant'
  content: string
  audioUrl?: string
  isVoice: boolean
  transcription?: string
  createdAt: Date
}

