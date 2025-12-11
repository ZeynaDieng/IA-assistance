import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { Injectable } from '@nestjs/common'
import { GptService } from '../../ai/gpt.service'

export interface AiProcessingJob {
  transcription: string
  userId: string
}

@Processor('ai-processing')
@Injectable()
export class AiProcessor extends WorkerHost {
  constructor(private readonly gptService: GptService) {
    super()
  }

  async process(job: Job<AiProcessingJob>): Promise<any> {
    const { transcription, userId } = job.data

    try {
      // Process AI extraction
      const result = await this.gptService.extractTasks(transcription, userId)

      return result
    } catch (error) {
      console.error(`[AiProcessor] Error processing job ${job.id}:`, error)
      throw error
    }
  }
}

