import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Task {
  id: string
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  duration: number // minutes
  scheduledAt: Date | string
  deadline?: Date | string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED'
  completedAt?: Date | string
  createdAt: Date | string
  updatedAt: Date | string
}

export const useTasksStore = defineStore('tasks', () => {
  // State
  const tasks = ref<Task[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const todayTasks = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return tasks.value.filter(task => {
      const taskDate = new Date(task.scheduledAt)
      taskDate.setHours(0, 0, 0, 0)
      return taskDate.getTime() === today.getTime()
    })
  })

  const completedTasks = computed(() => {
    return tasks.value.filter(task => task.status === 'COMPLETED')
  })

  const pendingTasks = computed(() => {
    return tasks.value.filter(task => task.status === 'PENDING' || task.status === 'IN_PROGRESS')
  })

  const completionRate = computed(() => {
    if (tasks.value.length === 0) return 0
    return Math.round((completedTasks.value.length / tasks.value.length) * 100)
  })

  // Actions
  const loadTasks = async (filters?: { date?: string; status?: string }) => {
    loading.value = true
    error.value = null

    try {
      const config = useRuntimeConfig()
      const { useAuthStore } = await import('./auth')
      const authStore = useAuthStore()
      
      let url = `${config.public.apiBaseUrl}/tasks`
      const params = new URLSearchParams()
      
      if (filters?.date) params.append('date', filters.date)
      if (filters?.status) params.append('status', filters.status)
      
      if (params.toString()) {
        url += `?${params.toString()}`
      }

      console.log('[TasksStore] Loading tasks with URL:', url)
      console.log('[TasksStore] Filters:', filters)

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('[TasksStore] Failed to load tasks:', response.status, errorText)
        
        // Retry logic for rate limiting
        if (response.status === 429) {
          console.warn('[TasksStore] Rate limit exceeded, retrying in 2 seconds...')
          await new Promise(resolve => setTimeout(resolve, 2000))
          
          // Retry once
          const retryResponse = await fetch(url, {
            headers: {
              'Authorization': `Bearer ${authStore.token}`
            }
          })
          
          if (retryResponse.ok) {
            const retryData = await retryResponse.json()
            const retryTasksArray = Array.isArray(retryData) ? retryData : (retryData.data || retryData.tasks || [])
            this.tasks = retryTasksArray
            console.log('[TasksStore] Tasks loaded successfully after retry')
            return
          } else {
            // If retry also fails, wait a bit more and try one more time
            console.warn('[TasksStore] Retry failed, waiting 3 more seconds...')
            await new Promise(resolve => setTimeout(resolve, 3000))
            
            const finalRetryResponse = await fetch(url, {
              headers: {
                'Authorization': `Bearer ${authStore.token}`
              }
            })
            
            if (finalRetryResponse.ok) {
              const finalRetryData = await finalRetryResponse.json()
              const finalRetryTasksArray = Array.isArray(finalRetryData) ? finalRetryData : (finalRetryData.data || finalRetryData.tasks || [])
              this.tasks = finalRetryTasksArray
              console.log('[TasksStore] Tasks loaded successfully after final retry')
              return
            }
          }
        }
        
        throw new Error(`Failed to load tasks: ${response.status}`)
      }

      const data = await response.json()
      console.log('[TasksStore] Raw response data:', data)
      
      // Backend returns: { success: true, data: tasks[] }
      const tasksArray = Array.isArray(data) ? data : (data.data || data.tasks || [])
      
      console.log('[TasksStore] Tasks array:', tasksArray.length, 'tasks')
      if (tasksArray.length > 0) {
        console.log('[TasksStore] First task sample:', tasksArray[0])
      }
      
      tasks.value = tasksArray.map((task: any) => ({
        ...task,
        scheduledAt: new Date(task.scheduledAt),
        deadline: task.deadline ? new Date(task.deadline) : undefined,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        completed: task.status === 'COMPLETED'
      }))
      
      console.log('[TasksStore] Mapped tasks:', tasks.value.length)
    } catch (err: any) {
      error.value = err.message
      console.error('[TasksStore] Error loading tasks:', err)
    } finally {
      loading.value = false
    }
  }

  const getTask = async (id: string): Promise<Task | null> => {
    try {
      const config = useRuntimeConfig()
      const { useAuthStore } = await import('./auth')
      const authStore = useAuthStore()
      
      console.log('[TasksStore] Fetching task with ID:', id)
      
      const response = await fetch(`${config.public.apiBaseUrl}/tasks/${id}`, {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      })

      if (!response.ok) {
        if (response.status === 404) {
          console.warn('[TasksStore] Task not found (404):', id)
          return null
        }
        const errorText = await response.text()
        console.error('[TasksStore] Failed to fetch task:', response.status, errorText)
        throw new Error(`Failed to load task: ${response.status}`)
      }

      const data = await response.json()
      console.log('[TasksStore] Task response:', data)
      
      // Backend returns: { success: true, data: task }
      const taskData = data.data || data
      
      if (!taskData) {
        console.error('[TasksStore] No task data in response:', data)
        return null
      }
      
      return {
        ...taskData,
        scheduledAt: new Date(taskData.scheduledAt),
        deadline: taskData.deadline ? new Date(taskData.deadline) : undefined,
        createdAt: new Date(taskData.createdAt),
        updatedAt: new Date(taskData.updatedAt),
        completedAt: taskData.completedAt ? new Date(taskData.completedAt) : undefined
      }
    } catch (err: any) {
      console.error('[TasksStore] Error loading task:', err)
      return null
    }
  }

  const createTask = async (taskData: Partial<Task>): Promise<Task> => {
    try {
      const config = useRuntimeConfig()
      const { useAuthStore } = await import('./auth')
      const authStore = useAuthStore()
      
      const response = await fetch(`${config.public.apiBaseUrl}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`
        },
        body: JSON.stringify(taskData)
      })

      if (!response.ok) {
        throw new Error('Failed to create task')
      }

      const data = await response.json()
      // Backend returns: { success, data: { task } } or { task }
      const taskData = data.data?.task || data.task || data
      const newTask = {
        ...taskData,
        scheduledAt: new Date(taskData.scheduledAt),
        deadline: taskData.deadline ? new Date(taskData.deadline) : undefined,
        createdAt: new Date(taskData.createdAt),
        updatedAt: new Date(taskData.updatedAt)
      }
      
      tasks.value.push(newTask)
      return newTask
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  const updateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
    try {
      const config = useRuntimeConfig()
      const { useAuthStore } = await import('./auth')
      const authStore = useAuthStore()
      
      const response = await fetch(`${config.public.apiBaseUrl}/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`
        },
        body: JSON.stringify(updates)
      })

      if (!response.ok) {
        throw new Error('Failed to update task')
      }

      const data = await response.json()
      const updatedTask = {
        ...data.task,
        scheduledAt: new Date(data.task.scheduledAt),
        deadline: data.task.deadline ? new Date(data.task.deadline) : undefined,
        createdAt: new Date(data.task.createdAt),
        updatedAt: new Date(data.task.updatedAt)
      }
      
      const index = tasks.value.findIndex(t => t.id === id)
      if (index !== -1) {
        tasks.value[index] = updatedTask
      }
      
      return updatedTask
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  const completeTask = async (id: string): Promise<Task> => {
    try {
      const config = useRuntimeConfig()
      const { useAuthStore } = await import('./auth')
      const authStore = useAuthStore()
      
      const response = await fetch(`${config.public.apiBaseUrl}/tasks/${id}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to complete task')
      }

      const data = await response.json()
      // Backend returns: { success, data: { task } } or { task }
      const taskData = data.data?.task || data.task || data
      const updatedTask = {
        ...taskData,
        scheduledAt: new Date(taskData.scheduledAt),
        completedAt: taskData.completedAt ? new Date(taskData.completedAt) : undefined,
        createdAt: new Date(taskData.createdAt),
        updatedAt: new Date(taskData.updatedAt)
      }
      
      const index = tasks.value.findIndex(t => t.id === id)
      if (index !== -1) {
        tasks.value[index] = updatedTask
      }
      
      return updatedTask
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  const postponeTask = async (id: string, newDate: Date): Promise<Task> => {
    try {
      const config = useRuntimeConfig()
      const { useAuthStore } = await import('./auth')
      const authStore = useAuthStore()
      
      const response = await fetch(`${config.public.apiBaseUrl}/tasks/${id}/postpone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`
        },
        body: JSON.stringify({ newDate: newDate.toISOString() })
      })

      if (!response.ok) {
        throw new Error('Failed to postpone task')
      }

      const data = await response.json()
      // Backend returns: { success, data: { task } } or { task }
      const taskData = data.data?.task || data.task || data
      const updatedTask = {
        ...taskData,
        scheduledAt: new Date(taskData.scheduledAt),
        createdAt: new Date(taskData.createdAt),
        updatedAt: new Date(taskData.updatedAt)
      }
      
      const index = tasks.value.findIndex(t => t.id === id)
      if (index !== -1) {
        tasks.value[index] = updatedTask
      }
      
      return updatedTask
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  const deleteTask = async (id: string): Promise<void> => {
    try {
      const config = useRuntimeConfig()
      const { useAuthStore } = await import('./auth')
      const authStore = useAuthStore()
      
      const response = await fetch(`${config.public.apiBaseUrl}/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete task')
      }

      tasks.value = tasks.value.filter(t => t.id !== id)
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  return {
    // State
    tasks,
    loading,
    error,
    // Getters
    todayTasks,
    completedTasks,
    pendingTasks,
    completionRate,
    // Actions
    loadTasks,
    getTask,
    createTask,
    updateTask,
    completeTask,
    postponeTask,
    deleteTask
  }
})

