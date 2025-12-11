import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAudioStore = defineStore('audio', () => {
  const isRecording = ref(false)
  const audioBlob = ref<Blob | null>(null)
  const transcription = ref<string>('')
  const duration = ref(0)
  const mediaRecorder = ref<MediaRecorder | null>(null)
  const audioChunks = ref<Blob[]>([])
  const retryStatus = ref<{ waiting: boolean; retryAfter?: number } | null>(null)
  const currentStream = ref<MediaStream | null>(null)

  const startRecording = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      })

      currentStream.value = stream

      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })

      audioChunks.value = []
      duration.value = 0 // Reset duration
      const startTime = Date.now()
      
      // Store start time on the recorder for later use
      ;(recorder as any).startTime = startTime

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.value.push(event.data)
        }
      }

      recorder.onstop = async () => {
        audioBlob.value = new Blob(audioChunks.value, { type: 'audio/webm' })
        
        // Calculate duration from recording time
        const endTime = Date.now()
        const recordedDuration = Math.round((endTime - startTime) / 1000) // Duration in seconds
        duration.value = recordedDuration
        
        console.log('[AudioStore] Calculated duration from recording time:', recordedDuration, 'seconds')
        
        // Also try to get duration from audio blob if available (more accurate)
        if (audioBlob.value) {
          try {
            const audioUrl = URL.createObjectURL(audioBlob.value)
            const audio = new Audio(audioUrl)
            await new Promise((resolve) => {
              const timeout = setTimeout(() => {
                URL.revokeObjectURL(audioUrl)
                console.log('[AudioStore] Timeout loading audio metadata, using calculated duration:', recordedDuration)
                resolve(null)
              }, 2000)
              
              audio.onloadedmetadata = () => {
                clearTimeout(timeout)
                if (!isNaN(audio.duration) && audio.duration > 0 && isFinite(audio.duration)) {
                  const blobDuration = Math.round(audio.duration)
                  console.log('[AudioStore] Got duration from audio metadata:', blobDuration, 'seconds')
                  duration.value = blobDuration
                } else {
                  console.log('[AudioStore] Invalid audio duration, using calculated:', recordedDuration)
                }
                URL.revokeObjectURL(audioUrl)
                resolve(null)
              }
              
              audio.onerror = () => {
                clearTimeout(timeout)
                URL.revokeObjectURL(audioUrl)
                console.log('[AudioStore] Error loading audio metadata, using calculated duration:', recordedDuration)
                resolve(null)
              }
            })
          } catch (error) {
            // If metadata loading fails, use the calculated duration
            console.warn('[AudioStore] Exception loading audio metadata, using calculated duration:', recordedDuration, error)
          }
        }
        
        console.log('[AudioStore] Final duration value:', duration.value, 'seconds')
        stream.getTracks().forEach(track => track.stop())
        currentStream.value = null
      }

      mediaRecorder.value = recorder
      recorder.start()
      isRecording.value = true
    } catch (error) {
      console.error('Error starting recording:', error)
      if (currentStream.value) {
        currentStream.value.getTracks().forEach(track => track.stop())
        currentStream.value = null
      }
      throw error
    }
  }

  const stopRecording = async (): Promise<Blob> => {
    if (mediaRecorder.value && isRecording.value) {
      mediaRecorder.value.stop()
      isRecording.value = false
      
      // Wait for blob to be created and duration to be calculated
      // The onstop handler is async and will calculate duration
      let attempts = 0
      while (attempts < 50) { // Wait up to 5 seconds (50 * 100ms)
        await new Promise(resolve => setTimeout(resolve, 100))
        if (audioBlob.value) {
          // Wait a bit more for duration calculation if it's still 0
          if (duration.value > 0 || attempts > 10) {
            console.log('[AudioStore] stopRecording - duration:', duration.value, 'blob size:', audioBlob.value.size)
            return audioBlob.value
          }
        }
        attempts++
      }
      
      if (audioBlob.value) {
        console.log('[AudioStore] stopRecording - timeout, returning blob with duration:', duration.value)
        return audioBlob.value
      }
    }
    throw new Error('No recording to stop')
  }

  const cancelRecording = () => {
    if (mediaRecorder.value) {
      if (mediaRecorder.value.state === 'recording' || mediaRecorder.value.state === 'paused') {
        mediaRecorder.value.stop()
      }
      mediaRecorder.value = null
    }
    if (currentStream.value) {
      currentStream.value.getTracks().forEach(track => track.stop())
      currentStream.value = null
    }
    isRecording.value = false
    audioChunks.value = []
    audioBlob.value = null
  }

  const pauseRecording = () => {
    if (mediaRecorder.value && mediaRecorder.value.state === 'recording') {
      mediaRecorder.value.pause()
    }
  }

  const resumeRecording = () => {
    if (mediaRecorder.value && mediaRecorder.value.state === 'paused') {
      mediaRecorder.value.resume()
    }
  }

  const uploadAudio = async (blob: Blob, onProgress?: (progress: number) => void): Promise<string> => {
    const formData = new FormData()
    formData.append('file', blob, 'recording.webm')

    const config = useRuntimeConfig()
    const { useAuthStore } = await import('./auth')
    const authStore = useAuthStore()
    
    // Ensure auth is initialized
    if (!authStore.isLoggedIn) {
      authStore.initialize()
    }
    
    // Check if token exists
    if (!authStore.token) {
      throw new Error('Non authentifié. Veuillez vous connecter.')
    }
    
    // Use XMLHttpRequest for progress tracking
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = Math.round((e.loaded / e.total) * 100)
          onProgress(progress)
        }
      })
      
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText)
            const audioLogId = data.data?.audioLogId || data.audioLogId
            if (onProgress) onProgress(100)
            resolve(audioLogId)
          } catch (error) {
            reject(new Error('Invalid response from server'))
          }
        } else {
          if (xhr.status === 401) {
            authStore.logout()
            reject(new Error('Session expirée. Veuillez vous reconnecter.'))
          } else {
            try {
              const errorData = JSON.parse(xhr.responseText)
              reject(new Error(errorData.message || `Upload failed: ${xhr.status}`))
            } catch {
              reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`))
            }
          }
        }
      })
      
      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'))
      })
      
      xhr.open('POST', `${config.public.apiBaseUrl}/audio/upload`)
      xhr.setRequestHeader('Authorization', `Bearer ${authStore.token}`)
      xhr.send(formData)
    })

    if (!response.ok) {
      if (response.status === 401) {
        // Token invalid or expired, clear auth and redirect
        authStore.logout()
        throw new Error('Session expirée. Veuillez vous reconnecter.')
      }
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Upload failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    // Backend returns: { success: true, data: { audioLogId, fileUrl } }
    return data.data?.audioLogId || data.audioLogId
  }

  const transcribeAudio = async (audioLogId: string, retryCount = 0): Promise<string> => {
    const config = useRuntimeConfig()
    const { useAuthStore } = await import('./auth')
    const authStore = useAuthStore()
    
    // Ensure auth is initialized
    if (!authStore.isLoggedIn) {
      authStore.initialize()
    }
    
    // Check if token exists
    if (!authStore.token) {
      throw new Error('Non authentifié. Veuillez vous connecter.')
    }
    
    const response = await fetch(`${config.public.apiBaseUrl}/ai/transcribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({ audioLogId })
    })

    if (!response.ok) {
      if (response.status === 401) {
        authStore.logout()
        throw new Error('Session expirée. Veuillez vous reconnecter.')
      }
      
      // Handle rate limit (429) with automatic retry
      if (response.status === 429) {
        const errorData = await response.json().catch(() => ({}))
        const retryAfter = errorData.retryAfter || 60
        
        // Auto-retry once after waiting (max 1 retry to avoid infinite loops)
        if (retryCount === 0) {
          console.log(`⏳ Limite de traitement atteinte. Retry automatique dans ${retryAfter}s...`)
          
          // Update retry status for UI (start with initial value)
          const totalWait = (retryAfter + 5) * 1000 // +5s buffer for safety
          let remainingSeconds = Math.ceil(totalWait / 1000)
          retryStatus.value = { waiting: true, retryAfter: remainingSeconds }
          
          // Wait with progress updates every second
          const interval = 1000 // Update every second
          let elapsed = 0
          
          while (elapsed < totalWait) {
            await new Promise(resolve => setTimeout(resolve, interval))
            elapsed += interval
            remainingSeconds = Math.ceil((totalWait - elapsed) / 1000)
            retryStatus.value = { waiting: true, retryAfter: remainingSeconds }
          }
          
          // Clear retry status before retrying
          retryStatus.value = null
          
          // Retry the transcription
          return transcribeAudio(audioLogId, retryCount + 1)
        }
        
        // If retry also fails, throw error
        throw new Error(
          `Limite de traitement atteinte. Notre serveur nécessite un peu de temps avant de traiter une nouvelle demande.\n\n⏰ Veuillez réessayer dans ${retryAfter} seconde${retryAfter > 1 ? 's' : ''}.\n\n💡 Astuce: Pour éviter cette limite, espacer vos enregistrements de quelques minutes.`
        )
      }
      
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Transcription failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    // Backend returns: { success: true, data: { transcription } }
    const transcriptionText = data.data?.transcription || data.transcription
    transcription.value = transcriptionText
    return transcriptionText
  }

  return {
    isRecording,
    audioBlob,
    transcription,
    duration,
    retryStatus,
    startRecording,
    stopRecording,
    cancelRecording,
    uploadAudio,
    transcribeAudio
  }
})

