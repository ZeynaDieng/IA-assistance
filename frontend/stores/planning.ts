import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Task } from './tasks'

export interface Planning {
  id: string
  date: Date | string
  generatedAt: Date | string
  validatedAt?: Date | string
  status: 'DRAFT' | 'VALIDATED' | 'ARCHIVED'
  tasks: Task[]
  createdAt: Date | string
  updatedAt: Date | string
}

export const usePlanningStore = defineStore('planning', () => {
  // State
  const currentPlanning = ref<Planning | null>(null)
  const generatedPlanning = ref<Planning | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const retryStatus = ref<{ waiting: boolean; retryAfter?: number } | null>(null)

  // Actions
  const generatePlanning = async (transcription: string, date: Date): Promise<Planning> => {
    loading.value = true
    error.value = null

    try {
      // Step 1: Extract tasks and routines
      const result = await extractTasks(transcription)
      const tasks = result.tasks || []
      const routines = result.routines || []
      
      console.log('[PlanningStore] Extraction result:', { tasksCount: tasks.length, routinesCount: routines.length })
      
      // Create detected routines if any (they will be included in planning)
      if (routines.length > 0) {
        console.log('[PlanningStore] Routines détectées, création en cours...', routines)
        const { useRoutinesStore } = await import('~/stores/routines')
        const routinesStore = useRoutinesStore()
        
        // Create detected routines automatically
        for (const routine of routines) {
          try {
            const routineData: any = {
              title: routine.title,
              description: routine.description || undefined,
              frequency: routine.frequency,
              time: routine.time || undefined,
              daysOfWeek: routine.daysOfWeek && Array.isArray(routine.daysOfWeek) ? routine.daysOfWeek : [],
              duration: routine.duration,
              priority: routine.priority || 'MEDIUM',
              isActive: true
            }
            await routinesStore.createRoutine(routineData)
            console.log(`[PlanningStore] ✓ Routine créée: ${routine.title}`)
          } catch (err: any) {
            // If routine already exists, that's fine - continue
            if (err.message?.includes('already exists') || err.message?.includes('déjà')) {
              console.log(`[PlanningStore] Routine "${routine.title}" existe déjà, ignorée`)
            } else {
              console.warn(`[PlanningStore] Échec création routine "${routine.title}":`, err.message)
            }
            // Continue even if one routine fails
          }
        }
      }
      
      // Check if we have any tasks to plan
      if (tasks.length === 0 && routines.length === 0) {
        throw new Error('Aucune tâche ou routine détectée dans votre message. Veuillez réessayer avec un message plus clair.')
      }
      
      // Step 2: Generate planning from extracted tasks
      // Les routines actives seront automatiquement incluses par le backend
      // Le paramètre includeRoutines est true par défaut dans le backend
      const planning = await generatePlanningFromTasks(tasks, date)
      
      generatedPlanning.value = planning
      return planning
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const extractTasks = async (transcription: string, retryCount = 0): Promise<{ tasks: any[]; routines: any[] }> => {
    const config = useRuntimeConfig()
    const authStore = useAuthStore()
    
    // Validate transcription
    if (!transcription || typeof transcription !== 'string') {
      throw new Error('La transcription est requise et doit être une chaîne de caractères')
    }

    console.log('[PlanningStore] Extracting tasks from transcription (length:', transcription.length, ')')

    const response = await fetch(`${config.public.apiBaseUrl}/ai/extract-tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({ transcription })
    })

    if (!response.ok) {
      // Handle rate limit (429) with automatic retry
      if (response.status === 429) {
        const errorData = await response.json().catch(() => ({}))
        let retryAfter = errorData.retryAfter || 60
        
        // Limit maximum wait time to 120 seconds (2 minutes) to avoid very long waits
        const MAX_RETRY_WAIT = 120
        const actualRetryAfter = Math.min(retryAfter, MAX_RETRY_WAIT)
        
        // Auto-retry once after waiting (max 1 retry to avoid infinite loops)
        if (retryCount === 0 && actualRetryAfter <= MAX_RETRY_WAIT) {
          console.log(`⏳ Limite de traitement atteinte. Retry automatique dans ${actualRetryAfter}s...`)
          
          // Update retry status for UI
          retryStatus.value = { waiting: true, retryAfter: actualRetryAfter }
          
          // Wait with progress updates every second
          const totalWait = (actualRetryAfter + 5) * 1000 // +5s buffer
          const interval = 1000 // Update every second
          let elapsed = 0
          
          while (elapsed < totalWait) {
            await new Promise(resolve => setTimeout(resolve, interval))
            elapsed += interval
            const remaining = Math.ceil((totalWait - elapsed) / 1000)
            retryStatus.value = { waiting: true, retryAfter: remaining }
          }
          
          retryStatus.value = null
          return extractTasks(transcription, retryCount + 1)
        }
        
        // If wait time is too long or retry already failed, throw error with helpful message
        const minutes = Math.ceil(retryAfter / 60)
        throw new Error(
          `Limite de traitement atteinte.\n\n⏰ Le service nécessite un délai de ${minutes} minute${minutes > 1 ? 's' : ''} avant de pouvoir traiter une nouvelle demande.\n\n💡 Pour éviter cette limite :\n• Espacez vos enregistrements de quelques minutes\n• Attendez ${minutes} minute${minutes > 1 ? 's' : ''} puis réessayez\n• Réduisez la longueur de vos messages vocaux`
        )
      }
      
      const errorData = await response.json().catch(() => ({}))
      console.error('[PlanningStore] Extract tasks error:', errorData)
      
      // Extract more detailed error message
      let errorMessage = 'Failed to extract tasks'
      if (errorData.message) {
        errorMessage = errorData.message
      } else if (errorData.error) {
        errorMessage = Array.isArray(errorData.error) 
          ? errorData.error.join(', ')
          : errorData.error
      } else if (response.status === 400) {
        errorMessage = 'Erreur de validation. Veuillez vérifier votre transcription.'
      }
      
      throw new Error(errorMessage)
    }

    const data = await response.json()
    // Backend returns: { success: true, data: { tasks, routines } }
    const result = {
      tasks: data.data?.tasks || data.tasks || [],
      routines: data.data?.routines || []
    }
    
    console.log(`[PlanningStore] Extracted ${result.tasks.length} tasks and ${result.routines.length} routines`)
    return result
  }

  const generatePlanningFromTasks = async (tasks: any[], date: Date): Promise<Planning> => {
    const config = useRuntimeConfig()
    const authStore = useAuthStore()
    
    // Determine target date from task deadlines if available
    let targetDate = date
    const taskDeadlines = tasks
      .filter(task => task.deadline)
      .map(task => new Date(task.deadline))
      .filter(d => !isNaN(d.getTime()))
    
    if (taskDeadlines.length > 0) {
      // Use earliest deadline as target date
      taskDeadlines.sort((a, b) => a.getTime() - b.getTime())
      const earliestDeadline = taskDeadlines[0]
      targetDate = new Date(earliestDeadline)
      targetDate.setHours(0, 0, 0, 0)
      console.log('[PlanningStore] Using earliest task deadline as target date:', targetDate.toISOString().split('T')[0])
    }
    
    // Allow empty tasks array - backend will include routine tasks automatically
    // Even if no punctual tasks, routines will generate tasks for the date
    if (!tasks) {
      tasks = []
    }

    // Validate and format tasks before sending
    const requestBody = {
      tasks: tasks.map((task, index) => {
        // Validate duration
        let duration: number;
        if (typeof task.duration === 'number') {
          duration = Math.round(task.duration);
        } else if (typeof task.duration === 'string') {
          duration = parseInt(task.duration, 10);
        } else {
          throw new Error(`Invalid duration type for task ${index + 1} "${task.title}": ${typeof task.duration}`);
        }

        if (isNaN(duration) || duration <= 0 || duration > 1440) {
          throw new Error(`Invalid duration for task "${task.title}": ${task.duration} (must be between 1 and 1440 minutes)`);
        }

        // Validate suggestedTime format
        let suggestedTime: string | null = null;
        if (task.suggestedTime) {
          if (typeof task.suggestedTime !== 'string') {
            console.warn(`Invalid suggestedTime type for task "${task.title}", ignoring`);
          } else {
            const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
            if (timeRegex.test(task.suggestedTime)) {
              suggestedTime = task.suggestedTime;
            } else {
              console.warn(`Invalid suggestedTime format for task "${task.title}": ${task.suggestedTime}, expected HH:mm, ignoring`);
            }
          }
        }

        return {
          title: task.title,
          description: task.description || null,
          priority: task.priority,
          duration: String(duration), // Backend expects string but validates as number
          deadline: task.deadline || null,
          suggestedTime
        };
      }),
      date: targetDate.toISOString().split('T')[0], // Send calculated target date
      includeRoutines: true // Always include routine tasks in planning
    }

    console.log('[PlanningStore] Sending planning request:', { tasksCount: requestBody.tasks.length, date: requestBody.date })

    const response = await fetch(`${config.public.apiBaseUrl}/planning/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = errorData.message || `Failed to generate planning: ${response.status} ${response.statusText}`
      console.error('Planning generation error:', errorData)
      throw new Error(errorMessage)
    }

    const data = await response.json()
    // Backend returns: { success: true, data: { date, tasks } }
    const planningData = data.data || data
    
    return {
      id: `temp-${Date.now()}`,
      date: new Date(planningData.date),
      generatedAt: new Date(),
      status: 'DRAFT' as const,
      tasks: planningData.tasks.map((task: any) => ({
        id: `temp-task-${Date.now()}-${Math.random()}`,
        title: task.title,
        description: task.description,
        priority: task.priority,
        duration: task.duration,
        scheduledAt: new Date(task.scheduledAt),
        deadline: task.deadline ? new Date(task.deadline) : undefined,
        status: 'PENDING' as const
      })),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  const validatePlanning = async (tasks: Task[], options?: { routineRenewals?: Array<{ routineId: string; shouldRenew: boolean }> }): Promise<Planning | { requiresRenewalDecision: boolean; expiringRoutines: any[] }> => {
    if (!generatedPlanning.value) {
      throw new Error('No planning to validate')
    }

    loading.value = true
    error.value = null

    try {
      const config = useRuntimeConfig()
      const { useAuthStore } = await import('./auth')
      const authStore = useAuthStore()
      
      const planningDate = generatedPlanning.value.date instanceof Date 
        ? generatedPlanning.value.date 
        : new Date(generatedPlanning.value.date)
      
      const requestBody = {
        date: planningDate.toISOString().split('T')[0],
        tasks: tasks.map(task => ({
          title: task.title,
          description: task.description,
          priority: (typeof task.priority === 'string' ? task.priority.toUpperCase() : task.priority) as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
          duration: (typeof task.duration === 'string' ? parseInt(task.duration, 10) : task.duration).toString(),
          scheduledAt: typeof task.scheduledAt === 'string' 
            ? task.scheduledAt 
            : task.scheduledAt.toISOString(),
          deadline: task.deadline ? (typeof task.deadline === 'string' ? task.deadline : task.deadline.toISOString()) : undefined
        })),
        audioLogId: localStorage.getItem('current_audio_log_id') || undefined,
        routineRenewals: options?.routineRenewals || undefined
      }

      console.log('[PlanningStore] Sending validatePlanning request:', {
        date: requestBody.date,
        tasksCount: requestBody.tasks.length,
        tasks: requestBody.tasks
      })

      const response = await fetch(`${config.public.apiBaseUrl}/planning/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('[PlanningStore] Validation failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        })
        throw new Error(errorData.message || `Failed to validate planning: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log('[PlanningStore] Validation response received:', data)

      // Check if renewal decision is required
      if (!data.success && data.requiresRenewalDecision) {
        // Return special response indicating renewal is needed
        return {
          requiresRenewalDecision: true,
          expiringRoutines: data.data?.expiringRoutines || []
        }
      }
      
      // Backend returns: { success: true, data: { planning, tasks } }
      const planningData = data.data?.planning || data.planning
      
      if (!planningData) {
        console.error('[PlanningStore] Invalid response structure:', data)
        throw new Error('Invalid response from server: planning data missing')
      }

      const tasksCreated = data.data?.tasks || data.tasks || []
      console.log(`[PlanningStore] Planning validated successfully: ${tasksCreated.length} tasks created`)
      
      // Map tasks to ensure they have the correct structure and IDs from database
      const mappedTasks = tasksCreated.map((task: any) => ({
        id: task.id, // Real ID from database
        title: task.title,
        description: task.description || undefined,
        priority: task.priority?.toLowerCase() || task.priority, // Normalize priority
        duration: typeof task.duration === 'number' ? task.duration : parseInt(task.duration, 10),
        scheduledAt: new Date(task.scheduledAt),
        deadline: task.deadline ? new Date(task.deadline) : undefined,
        status: task.status || 'PENDING',
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt)
      }))
      
      console.log(`[PlanningStore] Mapped ${mappedTasks.length} tasks with IDs:`, mappedTasks.map(t => ({ id: t.id, title: t.title })))
      
      const validatedPlanning = {
        ...planningData,
        date: new Date(planningData.date),
        validatedAt: new Date(planningData.validatedAt),
        createdAt: new Date(planningData.createdAt),
        updatedAt: new Date(planningData.updatedAt),
        tasks: mappedTasks
      }
      
      currentPlanning.value = validatedPlanning
      generatedPlanning.value = null
      
      // Also update tasks in tasksStore so they're available for navigation
      const { useTasksStore } = await import('./tasks')
      const tasksStore = useTasksStore()
      // Reload tasks to get the newly created ones
      await tasksStore.loadTasks()
      
      return validatedPlanning
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const getPlanning = async (date: Date): Promise<Planning | null> => {
    try {
      const config = useRuntimeConfig()
      const { useAuthStore } = await import('./auth')
      const authStore = useAuthStore()
      
      const dateStr = date.toISOString().split('T')[0]
      const response = await fetch(`${config.public.apiBaseUrl}/planning?date=${dateStr}`, {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      })

      if (response.status === 404) {
        return null
      }

      if (!response.ok) {
        throw new Error('Failed to load planning')
      }

      const data = await response.json()
      return {
        ...data.planning,
        date: new Date(data.planning.date),
        generatedAt: new Date(data.planning.generatedAt),
        validatedAt: data.planning.validatedAt ? new Date(data.planning.validatedAt) : undefined,
        createdAt: new Date(data.planning.createdAt),
        updatedAt: new Date(data.planning.updatedAt)
      }
    } catch (err) {
      console.error('Error loading planning:', err)
      return null
    }
  }

  return {
    // State
    currentPlanning,
    generatedPlanning,
    loading,
    error,
    retryStatus,
    // Actions
    generatePlanning,
    validatePlanning,
    getPlanning,
    extractTasks
  }
})

