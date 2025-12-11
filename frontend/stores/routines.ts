import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Routine {
  id: string
  title: string
  description?: string
  frequency: 'DAILY' | 'WEEKLY' | 'WEEKDAYS' | 'WEEKENDS' | 'CUSTOM'
  time?: string // HH:mm
  daysOfWeek?: string[]
  duration: number // minutes
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  isActive: boolean
  expiresAt?: string // ISO date string
  autoRenew?: boolean
  renewalAskedAt?: string // ISO date string
  createdAt: string
  updatedAt: string
}

export const useRoutinesStore = defineStore('routines', () => {
  const routines = ref<Routine[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const loadRoutines = async (includeInactive = false) => {
    loading.value = true
    error.value = null

    try {
      const config = useRuntimeConfig()
      const authStore = useAuthStore()

      const response = await fetch(
        `${config.public.apiBaseUrl}/routines?includeInactive=${includeInactive}`,
        {
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        }
      )

      if (!response.ok) {
        throw new Error('Failed to load routines')
      }

      const data = await response.json()
      routines.value = data.data || []
    } catch (err: any) {
      error.value = err.message
      console.error('[RoutinesStore] Error loading routines:', err)
    } finally {
      loading.value = false
    }
  }

  const createRoutine = async (routineData: Omit<Routine, 'id' | 'createdAt' | 'updatedAt'>) => {
    loading.value = true
    error.value = null

    try {
      const config = useRuntimeConfig()
      const authStore = useAuthStore()

      const response = await fetch(`${config.public.apiBaseUrl}/routines`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`
        },
        body: JSON.stringify(routineData)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to create routine')
      }

      const data = await response.json()
      const newRoutine = data.data

      routines.value.push(newRoutine)
      return newRoutine
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateRoutine = async (id: string, updates: Partial<Routine>) => {
    loading.value = true
    error.value = null

    try {
      const config = useRuntimeConfig()
      const authStore = useAuthStore()

      const response = await fetch(`${config.public.apiBaseUrl}/routines/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`
        },
        body: JSON.stringify(updates)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to update routine')
      }

      const data = await response.json()
      const updatedRoutine = data.data

      const index = routines.value.findIndex(r => r.id === id)
      if (index !== -1) {
        routines.value[index] = updatedRoutine
      }

      return updatedRoutine
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteRoutine = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const config = useRuntimeConfig()
      const authStore = useAuthStore()

      const response = await fetch(`${config.public.apiBaseUrl}/routines/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete routine')
      }

      routines.value = routines.value.filter(r => r.id !== id)
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const toggleActive = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const config = useRuntimeConfig()
      const authStore = useAuthStore()

      const response = await fetch(`${config.public.apiBaseUrl}/routines/${id}/toggle`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to toggle routine')
      }

      const data = await response.json()
      const updatedRoutine = data.data

      const index = routines.value.findIndex(r => r.id === id)
      if (index !== -1) {
        routines.value[index] = updatedRoutine
      }

      return updatedRoutine
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deactivate = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const config = useRuntimeConfig()
      const authStore = useAuthStore()

      const response = await fetch(`${config.public.apiBaseUrl}/routines/${id}/deactivate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to deactivate routine')
      }

      const data = await response.json()
      const updatedRoutine = data.data

      const index = routines.value.findIndex(r => r.id === id)
      if (index !== -1) {
        routines.value[index] = updatedRoutine
      }

      return updatedRoutine
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const generateTasks = async (date?: Date) => {
    loading.value = true
    error.value = null

    try {
      const config = useRuntimeConfig()
      const authStore = useAuthStore()

      const dateStr = date ? date.toISOString().split('T')[0] : undefined
      const url = dateStr
        ? `${config.public.apiBaseUrl}/routines/generate-tasks?date=${dateStr}`
        : `${config.public.apiBaseUrl}/routines/generate-tasks`

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to generate tasks from routines')
      }

      const data = await response.json()
      return data.data.tasks || []
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const activeRoutines = computed(() => routines.value.filter(r => r.isActive))

  return {
    routines,
    loading,
    error,
    activeRoutines,
    loadRoutines,
    createRoutine,
    updateRoutine,
    deleteRoutine,
    toggleActive,
    deactivate,
    generateTasks
  }
})

