import { ref, onUnmounted } from 'vue'

export function useTTS() {
  const isSpeaking = ref(false)
  const isSupported = ref(false)

  // Check if TTS is supported
  if (typeof window !== 'undefined') {
    isSupported.value = 'speechSynthesis' in window
  }

  const speak = (text: string, options?: {
    lang?: string
    rate?: number
    pitch?: number
    volume?: number
  }) => {
    if (!isSupported.value) {
      console.warn('Speech Synthesis is not supported in this browser')
      return
    }

    // Stop any ongoing speech
    stop()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = options?.lang || 'fr-FR'
    utterance.rate = options?.rate || 1.0
    utterance.pitch = options?.pitch || 1.0
    utterance.volume = options?.volume || 1.0

    utterance.onstart = () => {
      isSpeaking.value = true
    }

    utterance.onend = () => {
      isSpeaking.value = false
    }

    utterance.onerror = (error) => {
      console.error('TTS Error:', error)
      isSpeaking.value = false
    }

    window.speechSynthesis.speak(utterance)
  }

  const stop = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      isSpeaking.value = false
    }
  }

  const pause = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause()
    }
  }

  const resume = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume()
    }
  }

  // Cleanup on unmount
  onUnmounted(() => {
    stop()
  })

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    isSupported,
  }
}

