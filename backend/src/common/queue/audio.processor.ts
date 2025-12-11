import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { Injectable } from '@nestjs/common'
import { WhisperService } from '../../ai/whisper.service'

export interface AudioProcessingJob {
  audioLogId: string
  userId: string
}

@Processor('audio-processing')
@Injectable()
export class AudioProcessor extends WorkerHost {
  constructor(private readonly whisperService: WhisperService) {
    super()
  }

  async process(job: Job<AudioProcessingJob>): Promise<string> {
    const { audioLogId, userId } = job.data

    try {
      // Process audio transcription
      const transcription = await this.whisperService.transcribeAudio(
        audioLogId,
        userId
      )

      return transcription
    } catch (error) {
      console.error(`[AudioProcessor] Error processing job ${job.id}:`, error)
      throw error
    }
  }
}

