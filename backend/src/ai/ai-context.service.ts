import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { FeedbackService } from './feedback.service'

export interface UserContext {
  preferences: {
    workHoursStart?: string
    workHoursEnd?: string
    preferredTaskDuration?: number
    energyMorning?: 'LOW' | 'MEDIUM' | 'HIGH'
    energyAfternoon?: 'LOW' | 'MEDIUM' | 'HIGH'
    energyEvening?: 'LOW' | 'MEDIUM' | 'HIGH'
    timezone?: string
    language?: string
    categoryDurations?: Record<string, number>
    lunchBreakEnabled?: boolean
    lunchBreakStart?: string
    lunchBreakEnd?: string
    workDays?: string[]
    assistantName?: string
    voiceResponseEnabled?: boolean
  }
  recentTasks: Array<{
    title: string
    category?: string
    duration: number
    priority: string
    scheduledAt: Date
  }>
  routines: Array<{
    title: string
    frequency: string
    time?: string
    duration: number
    priority: string
  }>
  patterns: {
    commonTasks: string[]
    averageDurationByCategory: Record<string, number>
    preferredTimes: Record<string, string>
    commonCategories: string[]
  }
  learnedPatterns: {
    taskNaming: Map<string, string>
    preferredDurations: Map<string, number>
    preferredTimes: Map<string, string[]>
  }
}

@Injectable()
export class AiContextService {
  constructor(
    private prisma: PrismaService,
    private feedbackService: FeedbackService
  ) {}

  /**
   * Get comprehensive user context for AI prompts
   */
  async getUserContext(userId: string): Promise<UserContext> {
    // Get user preferences
    const preferences = await this.getUserPreferences(userId)

    // Get recent tasks (last 30 days)
    const recentTasks = await this.prisma.task.findMany({
      where: {
        userId,
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        title: true,
        duration: true,
        priority: true,
        scheduledAt: true,
      },
    })

    // Get active routines
    const routines = await this.prisma.routine.findMany({
      where: {
        userId,
        isActive: true,
      },
      select: {
        title: true,
        frequency: true,
        time: true,
        duration: true,
        priority: true,
      },
    })

    // Analyze patterns
    const patterns = this.analyzePatterns(recentTasks)

    // Get learned patterns from feedback
    const learnedPatterns = await this.feedbackService.getUserCorrectionHistory(userId)

    return {
      preferences,
      recentTasks: recentTasks.map((t) => ({
        title: t.title,
        duration: t.duration,
        priority: t.priority,
        scheduledAt: t.scheduledAt,
      })),
      routines: routines.map((r) => ({
        title: r.title,
        frequency: r.frequency,
        time: r.time || undefined,
        duration: r.duration,
        priority: r.priority,
      })),
      patterns,
      learnedPatterns: {
        taskNaming: new Map(Array.from(learnedPatterns.commonTaskNames.entries()).map(([k, v]) => [k, v.toString()])),
        preferredDurations: learnedPatterns.preferredDurations,
        preferredTimes: learnedPatterns.preferredTimes,
      },
    }
  }

  /**
   * Get user preferences
   */
  async getUserPreferences(userId: string): Promise<UserContext['preferences']> {
    const prefs = await this.prisma.userPreferences.findUnique({
      where: { userId },
    })

    if (!prefs) {
      // Return defaults
      return {
        workHoursStart: '09:00',
        workHoursEnd: '17:00',
        preferredTaskDuration: 30,
        energyMorning: 'MEDIUM',
        energyAfternoon: 'MEDIUM',
        energyEvening: 'LOW',
        timezone: 'Africa/Dakar',
        language: 'fr',
        assistantName: 'Zeii',
        voiceResponseEnabled: true,
      }
    }

    return {
      workHoursStart: prefs.workHoursStart || undefined,
      workHoursEnd: prefs.workHoursEnd || undefined,
      preferredTaskDuration: prefs.preferredTaskDuration || undefined,
      energyMorning: (prefs.energyMorning as any) || undefined,
      energyAfternoon: (prefs.energyAfternoon as any) || undefined,
      energyEvening: (prefs.energyEvening as any) || undefined,
      timezone: prefs.timezone || undefined,
      language: prefs.language || undefined,
      categoryDurations: (prefs.categoryDurations as Record<string, number>) || undefined,
      lunchBreakEnabled: prefs.lunchBreakEnabled || undefined,
      lunchBreakStart: prefs.lunchBreakStart || undefined,
      lunchBreakEnd: prefs.lunchBreakEnd || undefined,
      workDays: (prefs.workDays as string[]) || undefined,
      assistantName: prefs.assistantName || 'Zeii',
      voiceResponseEnabled: prefs.voiceResponseEnabled ?? true,
    }
  }

  /**
   * Analyze patterns from recent tasks
   */
  private analyzePatterns(
    tasks: Array<{
      title: string
      category?: string | null
      duration: number
      priority: string
      scheduledAt: Date
    }>
  ): UserContext['patterns'] {
    // Common tasks (by title frequency)
    const taskCounts = new Map<string, number>()
    for (const task of tasks) {
      const title = task.title.toLowerCase()
      taskCounts.set(title, (taskCounts.get(title) || 0) + 1)
    }
    const commonTasks = Array.from(taskCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([title]) => title)

    // Average duration by category
    const categoryDurations = new Map<string, number[]>()
    for (const task of tasks) {
      if (task.category) {
        const durations = categoryDurations.get(task.category) || []
        durations.push(task.duration)
        categoryDurations.set(task.category, durations)
      }
    }
    const averageDurationByCategory: Record<string, number> = {}
    for (const [category, durations] of categoryDurations.entries()) {
      const avg = durations.reduce((a, b) => a + b, 0) / durations.length
      averageDurationByCategory[category] = Math.round(avg)
    }

    // Preferred times (most common scheduled times)
    const timeCounts = new Map<string, number>()
    for (const task of tasks) {
      const hour = task.scheduledAt.getHours()
      const timeSlot = `${hour.toString().padStart(2, '0')}:00`
      timeCounts.set(timeSlot, (timeCounts.get(timeSlot) || 0) + 1)
    }
    const preferredTime = Array.from(timeCounts.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || '09:00'

    // Common categories
    const categoryCounts = new Map<string, number>()
    for (const task of tasks) {
      if (task.category) {
        categoryCounts.set(task.category, (categoryCounts.get(task.category) || 0) + 1)
      }
    }
    const commonCategories = Array.from(categoryCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([category]) => category)

    return {
      commonTasks,
      averageDurationByCategory,
      preferredTimes: { default: preferredTime },
      commonCategories,
    }
  }

  /**
   * Build contextual prompt section from user context
   */
  buildContextualPrompt(context: UserContext): string {
    let prompt = '\n==========================================================\n'
    prompt += '🧠 CONTEXTE UTILISATEUR (Mémoire & Préférences)\n'
    prompt += '==========================================================\n\n'

    // Work hours
    if (context.preferences.workHoursStart && context.preferences.workHoursEnd) {
      prompt += `Heures de travail habituelles : ${context.preferences.workHoursStart} - ${context.preferences.workHoursEnd}\n`
    }

    // Energy patterns
    if (
      context.preferences.energyMorning ||
      context.preferences.energyAfternoon ||
      context.preferences.energyEvening
    ) {
      prompt += `Pattern énergétique : `
      if (context.preferences.energyMorning) {
        prompt += `Matin ${context.preferences.energyMorning}, `
      }
      if (context.preferences.energyAfternoon) {
        prompt += `Après-midi ${context.preferences.energyAfternoon}, `
      }
      if (context.preferences.energyEvening) {
        prompt += `Soir ${context.preferences.energyEvening}`
      }
      prompt += '\n'
    }

    // Routines actives
    if (context.routines.length > 0) {
      prompt += `\nRoutines actives de l'utilisateur :\n`
      for (const routine of context.routines.slice(0, 5)) {
        prompt += `- "${routine.title}" (${routine.frequency}`
        if (routine.time) {
          prompt += ` à ${routine.time}`
        }
        prompt += `, ${routine.duration}min)\n`
      }
    }

    // Tâches fréquentes
    if (context.patterns.commonTasks.length > 0) {
      prompt += `\nTâches fréquentes de l'utilisateur : ${context.patterns.commonTasks.slice(0, 5).join(', ')}\n`
    }

    // Durées moyennes par catégorie
    if (Object.keys(context.patterns.averageDurationByCategory).length > 0) {
      prompt += `\nDurées moyennes par catégorie (basées sur l'historique) :\n`
      for (const [category, duration] of Object.entries(context.patterns.averageDurationByCategory)) {
        prompt += `- ${category}: ${duration} minutes\n`
      }
    }

    // Durées préférées par catégorie (from preferences)
    if (context.preferences.categoryDurations && Object.keys(context.preferences.categoryDurations).length > 0) {
      prompt += `\nDurées préférées par catégorie (paramètres utilisateur) :\n`
      for (const [category, duration] of Object.entries(context.preferences.categoryDurations)) {
        prompt += `- ${category}: ${duration} minutes\n`
      }
      prompt += `Utilise ces durées préférées en priorité pour les catégories correspondantes.\n`
    }

    // Patterns appris des corrections
    if (context.learnedPatterns.preferredDurations.size > 0) {
      prompt += `\nDurées préférées apprises des corrections :\n`
      for (const [task, duration] of Array.from(context.learnedPatterns.preferredDurations.entries()).slice(0, 5)) {
        prompt += `- "${task}": ${Math.round(duration)} minutes\n`
      }
    }

    prompt += '\n==========================================================\n'
    prompt += 'INSTRUCTIONS POUR UTILISER CE CONTEXTE :\n'
    prompt += '1. Utilise les heures de travail pour placer les tâches (entre workHoursStart et workHoursEnd)\n'
    prompt += '2. Respecte les routines existantes (ne les recrée pas)\n'
    prompt += '3. Utilise les durées moyennes si durée absente, sinon utilise preferredTaskDuration\n'
    prompt += '4. Harmonise avec les préférences énergétiques :\n'
    prompt += '   - Tâches HIGH energy → placer dans les périodes avec énergie HIGH\n'
    prompt += '   - Tâches MEDIUM energy → placer dans les périodes avec énergie MEDIUM ou HIGH\n'
    prompt += '   - Tâches LOW energy → peuvent être placées dans n\'importe quelle période\n'
    prompt += '5. Utilise les patterns appris des corrections précédentes\n'
    prompt += '==========================================================\n\n'

    return prompt
  }
}

