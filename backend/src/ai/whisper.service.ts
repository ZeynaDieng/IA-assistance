import { Injectable, BadRequestException, HttpException, HttpStatus } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../prisma/prisma.service'
import axios from 'axios'
import * as fs from 'fs/promises'
import * as path from 'path'
import FormData from 'form-data'

@Injectable()
export class WhisperService {
  private readonly groqApiKey: string
  private readonly groqApiUrl = 'https://api.groq.com/openai/v1/audio/transcriptions'
  private readonly openaiApiKey: string
  private readonly openaiApiUrl = 'https://api.openai.com/v1/audio/transcriptions'

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService
  ) {
    this.groqApiKey = this.configService.get<string>('GROQ_API_KEY') || ''
    this.openaiApiKey = this.configService.get<string>('OPENAI_API_KEY') || ''
    
    if (!this.groqApiKey && !this.openaiApiKey) {
      console.warn('⚠️  Aucune clé API configurée (GROQ_API_KEY ou OPENAI_API_KEY)')
    } else {
      if (this.groqApiKey) {
        console.log('✓ GROQ_API_KEY configurée pour Whisper')
      }
      if (this.openaiApiKey) {
        console.log('✓ OPENAI_API_KEY configurée pour Whisper (fallback)')
      }
    }
  }

  /**
   * Transcribe audio file using Groq Whisper API
   */
  /**
   * Transcribe audio with automatic fallback between Groq and OpenAI
   */
  private async transcribeWithApi(
    fileBuffer: Buffer,
    fileName: string
  ): Promise<string> {
    const formData = new FormData()
    formData.append('file', fileBuffer, {
      filename: fileName,
      contentType: 'audio/mpeg'
    })
    formData.append('model', 'whisper-large-v3')
    formData.append('language', 'fr')
    formData.append('response_format', 'json')

    // Try Groq first
    if (this.groqApiKey) {
      try {
        const response = await axios.post(
          this.groqApiUrl,
          formData,
          {
            headers: {
              ...formData.getHeaders(),
              Authorization: `Bearer ${this.groqApiKey}`
            },
            timeout: 60000
          }
        )
        console.log('[WhisperService] ✓ Transcription Groq réussie')
        return response.data.text
      } catch (error: any) {
        // If rate limit (429) or other error, try OpenAI as fallback
        if (error.response?.status === 429 || error.response?.status >= 500) {
          console.warn(
            `[WhisperService] ⚠️ Groq erreur ${error.response?.status || 'unknown'}, bascule sur OpenAI...`
          )
          if (this.openaiApiKey) {
            // Fallback to OpenAI
            try {
              // Create new form data for OpenAI
              const openaiFormData = new FormData()
              openaiFormData.append('file', fileBuffer, {
                filename: fileName,
                contentType: 'audio/mpeg'
              })
              openaiFormData.append('model', 'whisper-1')
              openaiFormData.append('language', 'fr')
              openaiFormData.append('response_format', 'json')

              const response = await axios.post(
                this.openaiApiUrl,
                openaiFormData,
                {
                  headers: {
                    ...openaiFormData.getHeaders(),
                    Authorization: `Bearer ${this.openaiApiKey}`
                  },
                  timeout: 60000
                }
              )
              console.log('[WhisperService] ✓ Transcription OpenAI réussie (fallback)')
              return response.data.text
            } catch (openaiError: any) {
              // If OpenAI also fails, throw the original Groq error
              throw new BadRequestException(
                `Service temporairement indisponible. Erreur Groq: ${error.response?.status || 'unknown'}, Erreur OpenAI: ${openaiError.response?.status || 'unknown'}`
              )
            }
          } else {
            // No OpenAI fallback available, throw Groq error
            throw new BadRequestException(
              `Limite de traitement atteinte. Veuillez réessayer dans quelques instants.`
            )
          }
        } else {
          // Not a rate limit error, throw it
          throw error
        }
      }
    }

    // If no Groq key, try OpenAI directly
    if (this.openaiApiKey) {
      try {
        const openaiFormData = new FormData()
        openaiFormData.append('file', fileBuffer, {
          filename: fileName,
          contentType: 'audio/mpeg'
        })
        openaiFormData.append('model', 'whisper-1')
        openaiFormData.append('language', 'fr')
        openaiFormData.append('response_format', 'json')

        const response = await axios.post(
          this.openaiApiUrl,
          openaiFormData,
          {
            headers: {
              ...openaiFormData.getHeaders(),
              Authorization: `Bearer ${this.openaiApiKey}`
            },
            timeout: 60000
          }
        )
        console.log('[WhisperService] ✓ Transcription OpenAI réussie')
        return response.data.text
      } catch (error: any) {
        throw new BadRequestException(
          `Erreur lors de la transcription: ${error.response?.status || 'unknown'}`
        )
      }
    }

    throw new BadRequestException('Service de transcription non configuré. Veuillez contacter le support.')
  }

  async transcribeAudio(
    audioLogId: string,
    userId: string
  ): Promise<string> {
    if (!this.groqApiKey && !this.openaiApiKey) {
      throw new BadRequestException('Service de transcription non configuré. Veuillez contacter le support.')
    }

    // Get audio log
    const audioLog = await this.prisma.audioLog.findFirst({
      where: {
        id: audioLogId,
        userId
      }
    })

    if (!audioLog) {
      throw new BadRequestException('Audio log not found')
    }

    // If already transcribed, return existing transcription
    if (audioLog.transcription) {
      return audioLog.transcription
    }

    try {
      // Get file path
      const filePath = path.join(
        process.cwd(),
        audioLog.fileUrl.replace(/^\//, '')
      )

      // Read file
      const fileBuffer = await fs.readFile(filePath)
      const fileName = path.basename(filePath)

      // Call transcription API with automatic fallback
      const transcription = await this.transcribeWithApi(fileBuffer, fileName)

      // Update audio log with transcription
      await this.prisma.audioLog.update({
        where: { id: audioLogId },
        data: { transcription }
      })

      // Update audio log with transcription
      await this.prisma.audioLog.update({
        where: { id: audioLogId },
        data: { transcription }
      })

      return transcription
    } catch (error: any) {
      console.error('Error transcribing audio:', error)

      // Handle specific error types
      if (error.response?.status === 401) {
        throw new BadRequestException('Clé API invalide. Veuillez contacter le support.')
      }

      // Re-throw BadRequestException from transcribeWithApi (already handled fallback)
      if (error instanceof BadRequestException) {
        throw error
      }

      throw new BadRequestException(
        `Failed to transcribe audio: ${error.message}`
      )
    }
  }
}

