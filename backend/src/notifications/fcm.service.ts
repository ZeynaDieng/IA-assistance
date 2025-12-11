import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as admin from 'firebase-admin'

@Injectable()
export class FcmService {
  private readonly logger = new Logger(FcmService.name)
  private firebaseApp: admin.app.App | null = null

  constructor(private configService: ConfigService) {
    this.initializeFirebase()
  }

  /**
   * Initialize Firebase Admin SDK
   */
  private initializeFirebase() {
    const serviceAccount = this.configService.get<string>('FIREBASE_SERVICE_ACCOUNT')
    const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID')

    if (!serviceAccount && !projectId) {
      this.logger.warn('Firebase credentials not configured. Push notifications will be disabled.')
      return
    }

    try {
      if (serviceAccount) {
        // Use service account JSON
        const serviceAccountJson = JSON.parse(serviceAccount)
        this.firebaseApp = admin.initializeApp({
          credential: admin.credential.cert(serviceAccountJson),
          projectId: serviceAccountJson.project_id,
        })
      } else if (projectId) {
        // Use default credentials (for Google Cloud environments)
        this.firebaseApp = admin.initializeApp({
          projectId,
        })
      }

      this.logger.log('Firebase Admin SDK initialized')
    } catch (error) {
      this.logger.error('Failed to initialize Firebase Admin SDK:', error)
    }
  }

  /**
   * Send push notification to a device
   */
  async sendNotification(
    deviceToken: string,
    title: string,
    body: string,
    data?: Record<string, any>
  ): Promise<boolean> {
    if (!this.firebaseApp) {
      this.logger.warn('Firebase not initialized. Cannot send notification.')
      return false
    }

    try {
      const message: admin.messaging.Message = {
        token: deviceToken,
        notification: {
          title,
          body,
        },
        data: data ? this.stringifyData(data) : undefined,
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            channelId: 'samaplanner_notifications',
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
            },
          },
        },
      }

      const response = await admin.messaging().send(message)
      this.logger.log(`Notification sent successfully: ${response}`)
      return true
    } catch (error: any) {
      this.logger.error(`Failed to send notification: ${error.message}`, error.stack)
      
      // Handle invalid token
      if (error.code === 'messaging/invalid-registration-token' || 
          error.code === 'messaging/registration-token-not-registered') {
        this.logger.warn(`Invalid or unregistered token: ${deviceToken}`)
        // Token should be removed from database
      }
      
      return false
    }
  }

  /**
   * Send notification to multiple devices
   */
  async sendMulticast(
    deviceTokens: string[],
    title: string,
    body: string,
    data?: Record<string, any>
  ): Promise<admin.messaging.BatchResponse> {
    if (!this.firebaseApp) {
      this.logger.warn('Firebase not initialized. Cannot send notifications.')
      throw new Error('Firebase not initialized')
    }

    try {
      const message: admin.messaging.MulticastMessage = {
        tokens: deviceTokens,
        notification: {
          title,
          body,
        },
        data: data ? this.stringifyData(data) : undefined,
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            channelId: 'samaplanner_notifications',
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
            },
          },
        },
      }

      const response = await admin.messaging().sendEachForMulticast(message)
      this.logger.log(`Sent ${response.successCount} notifications, ${response.failureCount} failed`)
      return response
    } catch (error: any) {
      this.logger.error(`Failed to send multicast notification: ${error.message}`, error.stack)
      throw error
    }
  }

  /**
   * Send task reminder notification
   */
  async sendTaskReminder(
    deviceToken: string,
    taskTitle: string,
    scheduledAt: Date
  ): Promise<boolean> {
    const timeStr = scheduledAt.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    })

    return this.sendNotification(
      deviceToken,
      'Rappel de tâche',
      `${taskTitle} à ${timeStr}`,
      {
        type: 'task_reminder',
        scheduledAt: scheduledAt.toISOString(),
      }
    )
  }

  /**
   * Convert data object to string format (FCM requires string values)
   */
  private stringifyData(data: Record<string, any>): Record<string, string> {
    const stringData: Record<string, string> = {}
    for (const [key, value] of Object.entries(data)) {
      stringData[key] = typeof value === 'string' ? value : JSON.stringify(value)
    }
    return stringData
  }

  /**
   * Check if Firebase is initialized
   */
  isInitialized(): boolean {
    return this.firebaseApp !== null
  }
}

