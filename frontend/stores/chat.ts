import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  audioUrl?: string
  isVoice: boolean
  transcription?: string
  duration?: number | null
  metadata?: string | null
  createdAt: Date | string
}

export interface ProposedTask {
  title: string
  description?: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  duration: number
  scheduledAt: string
  deadline?: string
}

export interface ProposedRoutine {
  title: string
  description?: string
  frequency: 'DAILY' | 'WEEKLY' | 'WEEKDAYS' | 'WEEKENDS' | 'CUSTOM'
  time?: string
  daysOfWeek?: string[]
  duration: number
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
}

export const useChatStore = defineStore('chat', () => {
  const chatMessages = ref<ChatMessage[]>([])
  const isLoading = ref(false)
  const isRecording = ref(false)
  const error = ref<string | null>(null)

  const sendTextMessage = async (message: string) => {
    if (!message.trim()) return

    isLoading.value = true
    error.value = null

    try {
      const config = useRuntimeConfig()
      const { useAuthStore } = await import('./auth')
      const authStore = useAuthStore()

      if (!authStore.isLoggedIn) {
        authStore.initialize()
      }

      if (!authStore.token) {
        throw new Error('Non authentifié. Veuillez vous connecter.')
      }

      const response = await fetch(`${config.public.apiBaseUrl}/ai/chat/text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authStore.token}`,
        },
        body: JSON.stringify({ message }),
      })

      if (!response.ok) {
        if (response.status === 401) {
          authStore.logout()
          throw new Error('Session expirée. Veuillez vous reconnecter.')
        }
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Failed to send message: ${response.status}`)
      }

      const data = await response.json()

      // Reload history to get both user and assistant messages
      await loadHistory()

      return data.data
    } catch (err: any) {
      console.error('Error sending text message:', err)
      error.value = err.message || 'Erreur lors de l\'envoi du message'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const sendVoiceMessage = async (audioBlob: Blob, filename: string = 'recording.webm', durationSeconds?: number) => {
    isLoading.value = true
    error.value = null

    try {
      const config = useRuntimeConfig()
      const { useAuthStore } = await import('./auth')
      const authStore = useAuthStore()

      if (!authStore.isLoggedIn) {
        authStore.initialize()
      }

      if (!authStore.token) {
        throw new Error('Non authentifié. Veuillez vous connecter.')
      }

      const formData = new FormData()
      formData.append('audio', audioBlob, filename)
      if (durationSeconds !== undefined && durationSeconds > 0) {
        console.log('[ChatStore] Adding duration to FormData:', durationSeconds)
        formData.append('duration', durationSeconds.toString())
      } else {
        console.warn('[ChatStore] No valid duration provided:', durationSeconds)
      }

      const response = await fetch(`${config.public.apiBaseUrl}/ai/chat/voice`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        if (response.status === 401) {
          authStore.logout()
          throw new Error('Session expirée. Veuillez vous reconnecter.')
        }
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Failed to send voice message: ${response.status}`)
      }

      const data = await response.json()

      // Reload history to get both user and assistant messages
      await loadHistory()

      return data.data
    } catch (err: any) {
      console.error('Error sending voice message:', err)
      error.value = err.message || 'Erreur lors de l\'envoi du message vocal'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const loadHistory = async (limit: number = 50) => {
    isLoading.value = true
    error.value = null

    try {
      const config = useRuntimeConfig()
      const { useAuthStore } = await import('./auth')
      const authStore = useAuthStore()

      if (!authStore.isLoggedIn) {
        authStore.initialize()
      }

      if (!authStore.token) {
        throw new Error('Non authentifié. Veuillez vous connecter.')
      }

      const response = await fetch(
        `${config.public.apiBaseUrl}/ai/chat/history?limit=${limit}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        }
      )

      if (!response.ok) {
        if (response.status === 401) {
          authStore.logout()
          throw new Error('Session expirée. Veuillez vous reconnecter.')
        }
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Failed to load history: ${response.status}`)
      }

      const data = await response.json()
      // Sort messages by creation date (oldest first)
      const messages = (data.data || []).sort((a: ChatMessage, b: ChatMessage) => {
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()
        return dateA - dateB
      })
      chatMessages.value = messages

      return chatMessages.value
    } catch (err: any) {
      console.error('Error loading history:', err)
      error.value = err.message || 'Erreur lors du chargement de l\'historique'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const clearChat = async () => {
    isLoading.value = true
    error.value = null
    try {
      const config = useRuntimeConfig()
      const { useAuthStore } = await import('./auth')
      const authStore = useAuthStore()

      if (!authStore.isLoggedIn) {
        authStore.initialize()
      }

      if (!authStore.token) {
        throw new Error('Non authentifié. Veuillez vous connecter.')
      }

      const response = await fetch(`${config.public.apiBaseUrl}/ai/chat/clear-history`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          authStore.logout()
          throw new Error('Session expirée. Veuillez vous reconnecter.')
        }
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Failed to clear history: ${response.status}`)
      }

      // Clear local messages only after successful API call
      chatMessages.value = []
    } catch (err: any) {
      console.error('Error clearing chat:', err)
      error.value = err.message || 'Erreur lors de l\'effacement de l\'historique'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const lastMessage = computed(() => {
    return chatMessages.value.length > 0 ? chatMessages.value[chatMessages.value.length - 1] : null
  })

  const hasMessages = computed(() => {
    return chatMessages.value.length > 0
  })

  const validatePlanning = async (messageId: string) => {
    isLoading.value = true
    error.value = null
    try {
      const config = useRuntimeConfig()
      const { useAuthStore } = await import('./auth')
      const authStore = useAuthStore()

      if (!authStore.isLoggedIn) {
        authStore.initialize()
      }

      if (!authStore.token) {
        throw new Error('Non authentifié. Veuillez vous connecter.')
      }

      const response = await fetch(`${config.public.apiBaseUrl}/ai/chat/validate-planning`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authStore.token}`,
        },
        body: JSON.stringify({ messageId }),
      })

      if (!response.ok) {
        if (response.status === 401) {
          authStore.logout()
          throw new Error('Session expirée. Veuillez vous reconnecter.')
        }
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Failed to validate planning: ${response.status}`)
      }

      const data = await response.json()
      
      // Reload history to get updated metadata
      await loadHistory()

      return data.data
    } catch (err: any) {
      console.error('Error validating planning:', err)
      error.value = err.message || 'Erreur lors de la validation du planning'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const getProposedTasks = (message: ChatMessage): ProposedTask[] | null => {
    console.log('[ChatStore] getProposedTasks called for message:', message.id, 'metadata:', message.metadata)
    if (!message.metadata) {
      console.log('[ChatStore] No metadata found')
      return null
    }
    try {
      const metadata = JSON.parse(message.metadata)
      console.log('[ChatStore] Parsed metadata:', metadata)
      const tasks = metadata.proposedTasks || null
      console.log('[ChatStore] Extracted tasks:', tasks)
      return tasks
    } catch (error) {
      console.error('[ChatStore] Error parsing metadata:', error)
      return null
    }
  }

  const getProposedRoutines = (message: ChatMessage): ProposedRoutine[] | null => {
    if (!message.metadata) {
      return null
    }
    try {
      const metadata = JSON.parse(message.metadata as string)
      return metadata.proposedRoutines || null
    } catch (error) {
      console.error('[ChatStore] Error parsing metadata for routines:', error)
      return null
    }
  }

  const isPlanningValidated = (message: ChatMessage): boolean => {
    if (!message.metadata) return false
    try {
      const metadata = JSON.parse(message.metadata)
      return metadata.validated === true
    } catch {
      return false
    }
  }

  return {
    chatMessages,
    isLoading,
    isRecording,
    error,
    sendTextMessage,
    sendVoiceMessage,
    loadHistory,
    clearChat,
    lastMessage,
    hasMessages,
    validatePlanning,
    getProposedTasks,
    getProposedRoutines,
    isPlanningValidated,
  }
})

