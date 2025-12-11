import { ref, onMounted } from 'vue'

/**
 * Composable for push notifications using Firebase Cloud Messaging
 */
export function usePushNotifications() {
  const isSupported = ref(false)
  const permission = ref<NotificationPermission>('default')
  const fcmToken = ref<string | null>(null)
  const isSubscribed = ref(false)

  /**
   * Check if push notifications are supported
   */
  const checkSupport = () => {
    if (typeof window === 'undefined') {
      return false
    }

    return (
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window
    )
  }

  /**
   * Request notification permission
   */
  const requestPermission = async (): Promise<boolean> => {
    if (!checkSupport()) {
      console.warn('[PushNotifications] Push notifications not supported')
      return false
    }

    try {
      const result = await Notification.requestPermission()
      permission.value = result
      return result === 'granted'
    } catch (error) {
      console.error('[PushNotifications] Failed to request permission:', error)
      return false
    }
  }

  /**
   * Get FCM token from service worker
   */
  const getFcmToken = async (): Promise<string | null> => {
    if (!checkSupport() || !('serviceWorker' in navigator)) {
      return null
    }

    try {
      const registration = await navigator.serviceWorker.ready

      // Request permission first
      if (permission.value !== 'granted') {
        const granted = await requestPermission()
        if (!granted) {
          return null
        }
      }

      // Get FCM token (this would require Firebase SDK)
      // For now, we'll use a placeholder
      // In production, you would use Firebase SDK to get the token
      const token = await getTokenFromServiceWorker(registration)
      fcmToken.value = token
      isSubscribed.value = !!token

      return token
    } catch (error) {
      console.error('[PushNotifications] Failed to get FCM token:', error)
      return null
    }
  }

  /**
   * Register device token with backend
   */
  const registerDevice = async (token: string, deviceId?: string, platform?: string) => {
    try {
      const config = useRuntimeConfig()
      const { useAuthStore } = await import('~/stores/auth')
      const authStore = useAuthStore()

      if (!authStore.token) {
        throw new Error('Not authenticated')
      }

      const response = await fetch(`${config.public.apiBaseUrl}/notifications/device/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`,
        },
        body: JSON.stringify({
          token,
          deviceId,
          platform: platform || detectPlatform(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to register device')
      }

      return true
    } catch (error) {
      console.error('[PushNotifications] Failed to register device:', error)
      return false
    }
  }

  /**
   * Initialize push notifications
   */
  const initialize = async () => {
    if (!checkSupport()) {
      return
    }

    // Check current permission
    permission.value = Notification.permission

    // Get token and register
    const token = await getFcmToken()
    if (token) {
      await registerDevice(token)
    }
  }

  /**
   * Helper to get token from service worker
   * This is a placeholder - in production, use Firebase SDK
   */
  const getTokenFromServiceWorker = async (
    registration: ServiceWorkerRegistration
  ): Promise<string | null> => {
    // Placeholder - in production, you would:
    // 1. Import Firebase SDK
    // 2. Initialize Firebase
    // 3. Get messaging instance
    // 4. Get token using getToken()
    
    // For now, return null (will be implemented with Firebase SDK)
    return null
  }

  /**
   * Detect platform
   */
  const detectPlatform = (): 'ios' | 'android' | 'web' => {
    if (typeof window === 'undefined') {
      return 'web'
    }

    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera

    if (/android/i.test(userAgent)) {
      return 'android'
    }

    if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      return 'ios'
    }

    return 'web'
  }

  // Initialize on mount
  onMounted(() => {
    isSupported.value = checkSupport()
    if (isSupported.value) {
      initialize()
    }
  })

  return {
    isSupported: computed(() => isSupported.value),
    permission: computed(() => permission.value),
    fcmToken: computed(() => fcmToken.value),
    isSubscribed: computed(() => isSubscribed.value),
    requestPermission,
    getFcmToken,
    registerDevice,
    initialize,
  }
}

