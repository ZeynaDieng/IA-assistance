import { Injectable } from '@nestjs/common'
import { ExtractionResult, ExtractedTask, ExtractedRoutine } from './gpt.service'

@Injectable()
export class ExtractionValidator {
  /**
   * Validate and correct extraction to ensure no tasks/routines were invented
   */
  async validateAndCorrect(
    extraction: ExtractionResult,
    transcription: string
  ): Promise<{
    extraction: ExtractionResult
    issues: string[]
    corrected: boolean
  }> {
    const issues: string[] = []
    const correctedTasks: ExtractedTask[] = []
    const correctedRoutines: ExtractedRoutine[] = []

    // Normalize transcription for comparison
    const transcriptionLower = transcription.toLowerCase()
    const transcriptionWords = this.extractWords(transcriptionLower)

    // Validate tasks
    for (const task of extraction.tasks) {
      const taskTitleLower = task.title.toLowerCase()
      const taskWords = this.extractWords(taskTitleLower)

      // Check if task is mentioned in transcription
      const isMentioned = this.isTaskMentioned(taskTitleLower, transcriptionLower, taskWords, transcriptionWords)

      if (!isMentioned) {
        issues.push(`Tâche "${task.title}" non mentionnée dans la transcription`)
        // Skip this task (don't add to correctedTasks)
        continue
      }

      // Task is valid, keep it
      correctedTasks.push(task)
    }

    // Validate routines
    for (const routine of extraction.routines) {
      const routineTitleLower = routine.title.toLowerCase()
      const routineWords = this.extractWords(routineTitleLower)

      // Check if routine is mentioned with repetition keywords
      const isRoutineMentioned = this.isRoutineMentioned(
        routineTitleLower,
        transcriptionLower,
        routineWords,
        transcriptionWords,
        routine.frequency
      )

      if (!isRoutineMentioned) {
        issues.push(`Routine "${routine.title}" non mentionnée ou sans indication de répétition`)
        // Skip this routine
        continue
      }

      // Routine is valid, keep it
      correctedRoutines.push(routine)
    }

    const corrected = issues.length > 0

    return {
      extraction: {
        tasks: correctedTasks,
        routines: correctedRoutines,
      },
      issues,
      corrected,
    }
  }

  /**
   * Extract words from text (remove punctuation, split)
   */
  private extractWords(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2) // Filter out very short words
  }

  /**
   * Check if a task is mentioned in transcription
   */
  private isTaskMentioned(
    taskTitle: string,
    transcription: string,
    taskWords: string[],
    transcriptionWords: string[]
  ): boolean {
    // Direct match
    if (transcription.includes(taskTitle)) {
      return true
    }

    // Check if most task words are in transcription
    const matchingWords = taskWords.filter((word) => transcriptionWords.includes(word))
    const matchRatio = matchingWords.length / Math.max(taskWords.length, 1)

    // If 70% of words match, consider it mentioned
    if (matchRatio >= 0.7) {
      return true
    }

    // Check for semantic similarity (simple keyword matching)
    const keywords = this.extractKeywords(taskTitle)
    const keywordMatches = keywords.filter((keyword) => transcription.includes(keyword))

    // If at least one important keyword matches, consider it mentioned
    if (keywordMatches.length > 0 && keywordMatches.length >= keywords.length * 0.5) {
      return true
    }

    return false
  }

  /**
   * Check if a routine is mentioned with repetition indication
   */
  private isRoutineMentioned(
    routineTitle: string,
    transcription: string,
    routineWords: string[],
    transcriptionWords: string[],
    frequency: string
  ): boolean {
    // First check if the activity is mentioned
    const activityMentioned = this.isTaskMentioned(routineTitle, transcription, routineWords, transcriptionWords)

    if (!activityMentioned) {
      return false
    }

    // Check for repetition keywords
    const repetitionKeywords = [
      'tous les jours',
      'chaque jour',
      'tous les',
      'chaque',
      'régulièrement',
      'souvent',
      'habituellement',
      'routine',
      'habitude',
      'toujours',
      'lundi',
      'mardi',
      'mercredi',
      'jeudi',
      'vendredi',
      'samedi',
      'dimanche',
      'semaine',
      'weekend',
      'week-end',
    ]

    const hasRepetitionKeyword = repetitionKeywords.some((keyword) => transcription.includes(keyword))

    // If frequency is DAILY, check for daily keywords
    if (frequency === 'DAILY' && !hasRepetitionKeyword) {
      // Check if it's a common daily activity (like "se lever", "petit-déjeuner")
      const dailyActivityKeywords = ['lever', 'réveil', 'petit-déjeuner', 'déjeuner', 'dîner', 'coucher']
      const isDailyActivity = dailyActivityKeywords.some((keyword) => routineTitle.includes(keyword))

      if (isDailyActivity) {
        return true // Common daily activities are assumed to be routines
      }
    }

    return hasRepetitionKeyword
  }

  /**
   * Extract important keywords from task title
   */
  private extractKeywords(text: string): string[] {
    // Remove common stop words
    const stopWords = [
      'le',
      'la',
      'les',
      'un',
      'une',
      'des',
      'de',
      'du',
      'et',
      'ou',
      'pour',
      'avec',
      'sur',
      'dans',
      'par',
      'à',
      'mon',
      'ma',
      'mes',
      'ton',
      'ta',
      'tes',
      'son',
      'sa',
      'ses',
    ]

    const words = this.extractWords(text)
    return words.filter((word) => !stopWords.includes(word) && word.length > 3)
  }

  /**
   * Post-process extraction with user context
   */
  postProcessWithContext(
    extraction: ExtractionResult,
    context: {
      preferredTaskDuration?: number
      averageDurationByCategory?: Record<string, number>
      preferredTimes?: Record<string, string>
    }
  ): ExtractionResult {
    const processedTasks = extraction.tasks.map((task) => {
      // Fill missing duration
      if (!task.duration || task.duration <= 0) {
        if (task.category && context.averageDurationByCategory?.[task.category]) {
          task.duration = context.averageDurationByCategory[task.category]
        } else if (context.preferredTaskDuration) {
          task.duration = context.preferredTaskDuration
        } else {
          task.duration = 30 // Default
        }
      }

      // Fill missing suggestedTime if pattern exists
      if (!task.suggestedTime && task.category && context.preferredTimes?.[task.category]) {
        task.suggestedTime = context.preferredTimes[task.category]
      }

      return task
    })

    return {
      tasks: processedTasks,
      routines: extraction.routines,
    }
  }
}

