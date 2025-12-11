import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { ExtractionResult } from './gpt.service'

export interface UserCorrections {
  tasksAdded?: Array<{
    title: string
    description?: string
    priority: string
    duration: number
    suggestedTime?: string
  }>
  tasksRemoved?: string[] // IDs ou titres des tâches supprimées
  tasksModified?: Array<{
    id: string
    title?: string
    priority?: string
    duration?: number
    suggestedTime?: string
    changes: Record<string, any>
  }>
  routinesAdded?: Array<{
    title: string
    frequency: string
    duration: number
  }>
  routinesRemoved?: string[] // IDs ou titres des routines supprimées
}

export interface AiFeedbackData {
  userId: string
  transcription: string
  originalExtraction: ExtractionResult
  userCorrections: UserCorrections
  feedbackType: 'task_added' | 'task_removed' | 'task_modified' | 'routine_added' | 'routine_removed' | 'multiple'
  errorType?: 'invented_task' | 'invented_routine' | 'wrong_priority' | 'wrong_time' | 'wrong_duration' | 'other'
  notes?: string
}

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}

  /**
   * Save user feedback on AI extraction
   */
  async saveFeedback(data: AiFeedbackData): Promise<void> {
    try {
      await this.prisma.aiFeedback.create({
        data: {
          userId: data.userId,
          transcription: data.transcription,
          originalExtraction: data.originalExtraction as any,
          userCorrections: data.userCorrections as any,
          feedbackType: data.feedbackType,
          errorType: data.errorType,
          notes: data.notes,
          processed: false,
        },
      })

      console.log(`[FeedbackService] Feedback saved for user ${data.userId}, type: ${data.feedbackType}`)
    } catch (error) {
      console.error('[FeedbackService] Error saving feedback:', error)
      throw error
    }
  }

  /**
   * Get recent feedback for analysis
   */
  async getRecentFeedback(
    userId?: string,
    limit: number = 50,
    errorType?: string
  ): Promise<any[]> {
    const where: any = {
      processed: false,
    }

    if (userId) {
      where.userId = userId
    }

    if (errorType) {
      where.errorType = errorType
    }

    return this.prisma.aiFeedback.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    })
  }

  /**
   * Analyze common errors from feedback
   */
  async analyzeCommonErrors(userId?: string): Promise<{
    inventedTasks: number
    inventedRoutines: number
    wrongPriority: number
    wrongTime: number
    wrongDuration: number
    total: number
    patterns: Array<{ error: string; count: number; examples: string[] }>
  }> {
    const feedbacks = await this.getRecentFeedback(userId, 100)

    const analysis = {
      inventedTasks: 0,
      inventedRoutines: 0,
      wrongPriority: 0,
      wrongTime: 0,
      wrongDuration: 0,
      total: feedbacks.length,
      patterns: [] as Array<{ error: string; count: number; examples: string[] }>,
    }

    const errorCounts = new Map<string, number>()
    const errorExamples = new Map<string, string[]>()

    for (const feedback of feedbacks) {
      const errorType = feedback.errorType || 'other'

      // Count errors
      if (errorType === 'invented_task') analysis.inventedTasks++
      if (errorType === 'invented_routine') analysis.inventedRoutines++
      if (errorType === 'wrong_priority') analysis.wrongPriority++
      if (errorType === 'wrong_time') analysis.wrongTime++
      if (errorType === 'wrong_duration') analysis.wrongDuration++

      // Track patterns
      const count = errorCounts.get(errorType) || 0
      errorCounts.set(errorType, count + 1)

      const examples = errorExamples.get(errorType) || []
      if (examples.length < 3) {
        examples.push(feedback.transcription.substring(0, 100))
        errorExamples.set(errorType, examples)
      }
    }

    // Build patterns array
    for (const [error, count] of errorCounts.entries()) {
      analysis.patterns.push({
        error,
        count,
        examples: errorExamples.get(error) || [],
      })
    }

    return analysis
  }

  /**
   * Mark feedback as processed
   */
  async markAsProcessed(feedbackId: string): Promise<void> {
    await this.prisma.aiFeedback.update({
      where: { id: feedbackId },
      data: { processed: true },
    })
  }

  /**
   * Get user's correction history for learning
   */
  async getUserCorrectionHistory(userId: string): Promise<{
    commonTaskNames: Map<string, number>
    preferredDurations: Map<string, number>
    preferredTimes: Map<string, string[]>
    categoryMappings: Map<string, string>
  }> {
    const feedbacks = await this.getRecentFeedback(userId, 200)

    const commonTaskNames = new Map<string, number>()
    const preferredDurations = new Map<string, number>()
    const preferredTimes = new Map<string, string[]>()
    const categoryMappings = new Map<string, string>()

    for (const feedback of feedbacks) {
      const corrections = feedback.userCorrections as any

      // Track added tasks (user corrections)
      if (corrections.tasksAdded) {
        for (const task of corrections.tasksAdded) {
          const count = commonTaskNames.get(task.title.toLowerCase()) || 0
          commonTaskNames.set(task.title.toLowerCase(), count + 1)

          if (task.duration) {
            const avgDuration =
              (preferredDurations.get(task.title.toLowerCase()) || 0 + task.duration) / 2
            preferredDurations.set(task.title.toLowerCase(), avgDuration)
          }

          if (task.suggestedTime) {
            const times = preferredTimes.get(task.title.toLowerCase()) || []
            if (!times.includes(task.suggestedTime)) {
              times.push(task.suggestedTime)
              preferredTimes.set(task.title.toLowerCase(), times)
            }
          }
        }
      }

      // Track modified tasks (user preferences)
      if (corrections.tasksModified) {
        for (const task of corrections.tasksModified) {
          if (task.duration) {
            preferredDurations.set(task.title?.toLowerCase() || '', task.duration)
          }
          if (task.suggestedTime) {
            const times = preferredTimes.get(task.title?.toLowerCase() || '') || []
            if (!times.includes(task.suggestedTime)) {
              times.push(task.suggestedTime)
              preferredTimes.set(task.title?.toLowerCase() || '', times)
            }
          }
        }
      }
    }

    return {
      commonTaskNames,
      preferredDurations,
      preferredTimes,
      categoryMappings,
    }
  }
}

