import { ref, onUnmounted } from 'vue'

export function useSpeechRecognition() {
  const isListening = ref(false)
  const isSupported = ref(false)
  const transcript = ref('')
  const error = ref<string | null>(null)

  let recognition: any = null

  // Check if Speech Recognition is supported
  if (typeof window !== 'undefined') {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    isSupported.value = !!SpeechRecognition

    if (isSupported.value) {
      recognition = new SpeechRecognition()
      recognition.lang = 'fr-FR'
      recognition.continuous = false
      recognition.interimResults = false

      recognition.onstart = () => {
        isListening.value = true
        error.value = null
      }

      recognition.onresult = (event: any) => {
        transcript.value = event.results[0][0].transcript
      }

      recognition.onerror = (event: any) => {
        console.error('Speech Recognition Error:', event.error)
        error.value = event.error
        isListening.value = false

        // Common errors
        if (event.error === 'no-speech') {
          error.value = 'Aucune parole détectée'
        } else if (event.error === 'audio-capture') {
          error.value = 'Microphone non disponible'
        } else if (event.error === 'not-allowed') {
          error.value = 'Permission microphone refusée'
        } else {
          error.value = `Erreur: ${event.error}`
        }
      }

      recognition.onend = () => {
        isListening.value = false
      }
    }
  }

  const start = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!isSupported.value || !recognition) {
        reject(new Error('Speech Recognition is not supported'))
        return
      }

      transcript.value = ''
      error.value = null

      recognition.onresult = (event: any) => {
        const result = event.results[0][0].transcript
        transcript.value = result
        resolve(result)
      }

      recognition.onerror = (event: any) => {
        let errorMsg: string
        
        // Handle different error types
        switch (event.error) {
          case 'no-speech':
            errorMsg = 'Aucune parole détectée'
            break
          case 'audio-capture':
            errorMsg = 'Microphone non disponible'
            break
          case 'not-allowed':
            errorMsg = 'Permission microphone refusée'
            break
          case 'network':
            // Network error - Web Speech API requires internet
            errorMsg = 'Erreur réseau - Web Speech API non disponible'
            break
          case 'aborted':
            errorMsg = 'Reconnaissance interrompue'
            break
          default:
            errorMsg = `Erreur: ${event.error}`
        }
        
        error.value = errorMsg
        // Don't reject for network errors - let the fallback handle it
        if (event.error === 'network') {
          // For network errors, reject with a specific error that can be caught
          reject(new Error('Web Speech API network error - use fallback'))
        } else {
          reject(new Error(errorMsg))
        }
      }

      try {
        recognition.start()
      } catch (err: any) {
        reject(new Error(err.message || 'Failed to start recognition'))
      }
    })
  }

  const stop = () => {
    if (recognition && isListening.value) {
      recognition.stop()
      isListening.value = false
    }
  }

  // Cleanup on unmount
  onUnmounted(() => {
    stop()
  })

  return {
    start,
    stop,
    isListening,
    isSupported,
    transcript,
    error,
  }
}

