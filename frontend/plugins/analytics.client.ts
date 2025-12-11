/**
 * Plugin Nuxt pour initialiser l'analytics au démarrage de l'application
 */
export default defineNuxtPlugin(() => {
  const analytics = useAnalytics()
  const route = useRoute()
  const router = useRouter()

  // Track initial page view
  analytics.trackPageView(route.path)

  // Track page views on route changes
  router.afterEach((to) => {
    analytics.trackPageView(to.path, {
      route: to.name,
      params: to.params,
    })
  })

  // Track errors globally
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      analytics.trackError(
        new Error(event.message),
        {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        }
      )
    })

    window.addEventListener('unhandledrejection', (event) => {
      analytics.trackError(
        new Error(event.reason?.message || 'Unhandled promise rejection'),
        {
          reason: event.reason,
        }
      )
    })
  }

  console.log('📊 Analytics initialized')
})

