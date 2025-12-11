import {
  Injectable,
  BadRequestException,
  InternalServerErrorException
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import * as fs from 'fs/promises'
import * as path from 'path'

@Injectable()
export class AudioService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads', 'audio')
  private readonly maxFileSize = 10 * 1024 * 1024 // 10MB
  private readonly allowedMimeTypes = [
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/x-wav',
    'audio/mp4',
    'audio/m4a',
    'audio/webm',
    'audio/ogg'
  ]

  constructor(private prisma: PrismaService) {
    // Ensure upload directory exists
    this.ensureUploadDirectory()
  }

  private async ensureUploadDirectory() {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true })
    } catch (error) {
      console.error('Error creating upload directory:', error)
    }
  }

  /**
   * Validate audio file
   */
  private validateAudioFile(file: Express.Multer.File): void {
    // Check file exists
    if (!file) {
      throw new BadRequestException('No audio file provided')
    }

    // Check file size
    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `File size exceeds maximum allowed size of ${this.maxFileSize / 1024 / 1024}MB`
      )
    }

    // Check MIME type
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${this.allowedMimeTypes.join(', ')}`
      )
    }

    // Check file is not empty
    if (file.size === 0) {
      throw new BadRequestException('Audio file is empty')
    }
  }

  /**
   * Calculate audio duration (simplified - in production, use a proper audio library)
   */
  private async calculateDuration(filePath: string): Promise<number> {
    // This is a placeholder - in production, use a library like 'node-ffprobe' or 'ffmpeg'
    // For now, return a default duration
    // TODO: Implement proper audio duration calculation
    return 60 // Default 60 seconds
  }

  /**
   * Upload audio file and create AudioLog
   */
  async uploadAudio(
    file: Express.Multer.File,
    userId: string
  ): Promise<{ audioLogId: string; fileUrl: string }> {
    try {
      // Validate file
      this.validateAudioFile(file)

      // Generate unique filename
      const fileExtension = path.extname(file.originalname)
      const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(7)}${fileExtension}`
      const filePath = path.join(this.uploadDir, uniqueFilename)

      // Save file to disk
      await fs.writeFile(filePath, file.buffer)

      // Calculate duration (placeholder)
      const duration = await this.calculateDuration(filePath)

      // Create file URL
      const fileUrl = `/uploads/audio/${uniqueFilename}`

      // Create AudioLog in database
      const audioLog = await this.prisma.audioLog.create({
        data: {
          userId,
          fileUrl,
          duration,
          transcription: null
        }
      })

      return {
        audioLogId: audioLog.id,
        fileUrl
      }
    } catch (error) {
      // Clean up file if it was created
      if (file) {
        const filePath = path.join(
          this.uploadDir,
          `${Date.now()}-${Math.random().toString(36).substring(7)}${path.extname(file.originalname)}`
        )
        try {
          await fs.unlink(filePath)
        } catch {
          // Ignore cleanup errors
        }
      }

      if (error instanceof BadRequestException) {
        throw error
      }

      throw new InternalServerErrorException(
        `Failed to upload audio: ${error.message}`
      )
    }
  }

  /**
   * Get audio log by ID
   */
  async getAudioLog(audioLogId: string, userId: string) {
    const audioLog = await this.prisma.audioLog.findFirst({
      where: {
        id: audioLogId,
        userId
      }
    })

    if (!audioLog) {
      throw new BadRequestException('Audio log not found')
    }

    return audioLog
  }

  /**
   * Update transcription in AudioLog
   */
  async updateTranscription(
    audioLogId: string,
    transcription: string,
    userId: string
  ) {
    // Verify ownership
    await this.getAudioLog(audioLogId, userId)

    return this.prisma.audioLog.update({
      where: { id: audioLogId },
      data: { transcription }
    })
  }
}

