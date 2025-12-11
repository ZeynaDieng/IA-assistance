import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

export interface UpdatePreferencesDto {
  workHoursStart?: string
  workHoursEnd?: string
  preferredTaskDuration?: number
  energyMorning?: 'LOW' | 'MEDIUM' | 'HIGH'
  energyAfternoon?: 'LOW' | 'MEDIUM' | 'HIGH'
  energyEvening?: 'LOW' | 'MEDIUM' | 'HIGH'
  timezone?: string
  language?: 'fr' | 'en'
  
  // Pause déjeuner
  lunchBreakStart?: string
  lunchBreakEnd?: string
  lunchBreakEnabled?: boolean
  
  // Buffer entre tâches
  taskBufferMinutes?: number
  
  // Jours de travail
  workDays?: string[]
  
  // Préférences de rappels
  reminderBeforeTask?: number
  reminderForUrgent?: number
  reminderForEarlyTasks?: boolean
  
  // Durées par catégorie
  categoryDurations?: Record<string, number>
  
  // Préférences de planification avancées
  autoScheduleTasks?: boolean
  maxTasksPerDay?: number | null
  preferMorningTasks?: boolean
  allowTaskOverlap?: boolean
}

@Injectable()
export class UserPreferencesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get or create user preferences
   */
  async getOrCreatePreferences(userId: string) {
    let preferences = await this.prisma.userPreferences.findUnique({
      where: { userId },
    })

    if (!preferences) {
      preferences = await this.prisma.userPreferences.create({
        data: {
          userId,
          workHoursStart: '09:00',
          workHoursEnd: '17:00',
          preferredTaskDuration: 30,
          energyMorning: 'MEDIUM',
          energyAfternoon: 'MEDIUM',
          energyEvening: 'LOW',
          timezone: 'Africa/Dakar',
          language: 'fr',
          lunchBreakStart: '12:00',
          lunchBreakEnd: '13:00',
          lunchBreakEnabled: true,
          taskBufferMinutes: 15,
          workDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
          reminderBeforeTask: 15,
          reminderForUrgent: 45,
          reminderForEarlyTasks: true,
          categoryDurations: {},
          autoScheduleTasks: true,
          maxTasksPerDay: null,
          preferMorningTasks: false,
          allowTaskOverlap: false,
          assistantName: 'Zeii',
          voiceResponseEnabled: true,
        },
      })
    } else {
      // Migrate "Sama" to "Zeii" if needed
      if (preferences.assistantName === 'Sama') {
        preferences = await this.prisma.userPreferences.update({
          where: { userId },
          data: { assistantName: 'Zeii' },
        })
      }
    }

    return preferences
  }

  /**
   * Update user preferences
   */
  async updatePreferences(userId: string, data: UpdatePreferencesDto) {
    const existing = await this.prisma.userPreferences.findUnique({
      where: { userId },
    })

    if (existing) {
      return this.prisma.userPreferences.update({
        where: { userId },
        data,
      })
    }

    return this.prisma.userPreferences.create({
      data: {
        userId,
        assistantName: 'Zeii',
        voiceResponseEnabled: true,
        ...data,
      },
    })
  }
}

