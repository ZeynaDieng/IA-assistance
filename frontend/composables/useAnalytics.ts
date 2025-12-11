interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  timestamp?: number
}

/**
 * Analytics composable for tracking user events
 */
export function useAnalytics() {
  const isEnabled = ref(true) // Can be controlled by user preference

  /**
   * Track an event
   */
  const track = (eventName: string, properties?: Record<string, any>) => {
    if (!isEnabled.value) {
      return
    }

    const event: AnalyticsEvent = {
      name: eventName,
      properties: {
        ...properties,
        timestamp: Date.now(),
        url: typeof window !== 'undefined' ? window.location.href : '',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      },
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', event)
    }

    // Send to analytics service (Google Analytics, Plausible, etc.)
    // For now, we'll use a simple fetch to a backend endpoint
    if (typeof window !== 'undefined') {
      // Skip analytics in development to avoid rate limiting issues
      if (process.env.NODE_ENV === 'development') {
        return
      }
      
      const config = useRuntimeConfig()
      
      // Send to backend analytics endpoint (if available)
      // Use a small delay to batch requests and avoid rate limiting
      setTimeout(() => {
        fetch(`${config.public.apiBaseUrl}/analytics/track`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        }).catch((error) => {
          // Silently fail - analytics should not break the app
          console.warn('[Analytics] Failed to track event:', error)
        })
      }, 100) // Small delay to batch requests
    }
  }

  /**
   * Track page view
   */
  const trackPageView = (pageName: string, properties?: Record<string, any>) => {
    track('page_view', {
      page: pageName,
      ...properties,
    })
  }

  /**
   * Track user action
   */
  const trackAction = (action: string, properties?: Record<string, any>) => {
    track('user_action', {
      action,
      ...properties,
    })
  }

  /**
   * Track error
   */
  const trackError = (error: Error, context?: Record<string, any>) => {
    track('error', {
      error_message: error.message,
      error_stack: error.stack,
      ...context,
    })
  }

  /**
   * Track funnel step
   */
  const trackFunnel = (funnelName: string, step: string, properties?: Record<string, any>) => {
    track('funnel_step', {
      funnel: funnelName,
      step,
      ...properties,
    })
  }

  /**
   * Enable/disable analytics
   */
  const setEnabled = (enabled: boolean) => {
    isEnabled.value = enabled
    if (typeof window !== 'undefined') {
      localStorage.setItem('analytics_enabled', enabled.toString())
    }
  }

  // Load preference from localStorage
  onMounted(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('analytics_enabled')
      if (saved !== null) {
        isEnabled.value = saved === 'true'
      }
    }
  })

  return {
    track,
    trackPageView,
    trackAction,
    trackError,
    trackFunnel,
    setEnabled,
    isEnabled: computed(() => isEnabled.value),
  }
}

