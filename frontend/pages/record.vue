<template>
  <div
    class="min-h-screen flex flex-col bg-white dark:bg-[#0D0F33] transition-colors duration-300 pb-safe-bottom"
  >
    <!-- Header -->
    <div class="px-4 pt-safe-top pb-4 flex items-center gap-3">
      <button
        class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95 transition-all"
        @click="handleCancel"
        aria-label="Retour"
      >
        <X :size="18" class="text-gray-600 dark:text-gray-400" />
      </button>
      <h1 class="text-xl font-bold text-gray-900 dark:text-white">
        Enregistrement
      </h1>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col items-center justify-center px-6 pb-24">
      <!-- Timer -->
      <div
        v-if="isRecording"
        class="mb-12 text-center"
      >
        <div class="text-6xl font-mono font-bold tracking-widest text-gray-900 dark:text-white mb-3">
          {{ formatTime(timer) }}
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ isPaused ? 'En pause' : 'Enregistrement en cours...' }}
        </p>
      </div>

      <!-- Idle State -->
      <div
        v-else
        class="mb-12 text-center"
      >
        <div class="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
          <Mic :size="32" class="text-gray-400 dark:text-gray-500" />
        </div>
        <p class="text-lg text-gray-600 dark:text-gray-300 font-medium">
          Prêt à enregistrer
        </p>
      </div>

      <!-- Upload Progress -->
      <div
        v-if="uploading"
        class="w-full max-w-sm mb-8"
      >
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-600 dark:text-gray-400">Upload en cours...</span>
          <span class="text-sm font-medium text-gray-900 dark:text-white">{{ uploadProgress }}%</span>
        </div>
        <div class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            class="h-full bg-primary rounded-full transition-all duration-300"
            :style="{ width: `${uploadProgress}%` }"
          />
        </div>
      </div>

      <!-- Control Buttons -->
      <div class="flex items-center gap-4">
        <!-- Cancel Button -->
        <button
          v-if="!isRecording && !uploading"
          class="w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95 transition-all"
          @click="handleCancel"
          aria-label="Annuler"
        >
          <X :size="24" class="text-gray-600 dark:text-gray-400" />
        </button>

        <!-- Main Record Button -->
        <button
          :class="[
            'relative w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95',
            isRecording
              ? 'bg-red-500 shadow-red-500/30 hover:bg-red-600'
              : 'bg-primary shadow-primary/30 hover:bg-primary/90',
            uploading && 'opacity-50 cursor-not-allowed'
          ]"
          @click="handleToggle"
          :disabled="uploading"
          aria-label="Enregistrer"
        >
          <component
            :is="isRecording ? Square : Mic"
            :size="28"
            class="text-white"
          />
        </button>

        <!-- Pause/Resume Button -->
        <button
          v-if="isRecording"
          class="w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95 transition-all"
          @click="handlePause"
          aria-label="Pause"
        >
          <component
            :is="isPaused ? Play : Pause"
            :size="24"
            class="text-gray-600 dark:text-gray-400"
          />
        </button>
      </div>

      <!-- Error Message -->
      <div
        v-if="error"
        class="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl max-w-sm"
      >
        <p class="text-sm text-red-800 dark:text-red-300 text-center">
          {{ error }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { Mic, Square, X, Pause, Play } from 'lucide-vue-next'
import { useAudioStore } from '~/stores/audio'

const router = useRouter()
const audioStore = useAudioStore()

const isRecording = ref(false)
const isPaused = ref(false)
const timer = ref(0)
const uploading = ref(false)
const uploadProgress = ref(0)
const error = ref<string | null>(null)
let intervalId: NodeJS.Timeout | null = null

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

const handleToggle = async () => {
  if (isRecording.value) {
    await stopRecording()
  } else {
    await startRecording()
  }
}

const startRecording = async () => {
  try {
    error.value = null
    await audioStore.startRecording()
    isRecording.value = true
    isPaused.value = false
    timer.value = 0
    
    intervalId = setInterval(() => {
      if (!isPaused.value) {
        timer.value++
        if (timer.value >= 120) {
          stopRecording()
        }
      }
    }, 1000)
  } catch (err: any) {
    console.error('Error starting recording:', err)
    error.value = err.message || 'Erreur lors du démarrage de l\'enregistrement'
    if (err.name === 'NotAllowedError') {
      error.value = 'Permission microphone refusée. Veuillez autoriser l\'accès au microphone.'
    } else if (err.name === 'NotFoundError') {
      error.value = 'Aucun microphone trouvé. Veuillez connecter un microphone.'
    }
  }
}

const stopRecording = async () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
  
  try {
    uploading.value = true
    uploadProgress.value = 0
    
    const result = await audioStore.stopRecording()
    isRecording.value = false
    isPaused.value = false
    
    // Upload audio with progress callback
    try {
      const audioLogId = await audioStore.uploadAudio(result, (progress) => {
        uploadProgress.value = progress
      })
      uploadProgress.value = 100
      
      // Store audioLogId for processing page
      if (audioLogId) {
        localStorage.setItem('current_audio_log_id', audioLogId)
      }
      
      // Navigate to processing
      setTimeout(() => {
        router.push('/processing')
      }, 500)
    } catch (uploadError: any) {
      console.error('Error uploading audio:', uploadError)
      error.value = uploadError.message || 'Erreur lors de l\'upload de l\'audio'
      uploading.value = false
      uploadProgress.value = 0
    }
  } catch (err: any) {
    console.error('Error stopping recording:', err)
    error.value = err.message || 'Erreur lors de l\'arrêt de l\'enregistrement'
    uploading.value = false
    uploadProgress.value = 0
  }
}

const handleCancel = () => {
  if (isRecording.value) {
    audioStore.cancelRecording()
  }
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
  router.push('/home')
}

const handlePause = () => {
  if (isPaused.value) {
    // Resume
    isPaused.value = false
    audioStore.resumeRecording()
  } else {
    // Pause
    isPaused.value = true
    audioStore.pauseRecording()
  }
}

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
  if (isRecording.value) {
    audioStore.cancelRecording()
  }
})

useHead({
  title: 'Enregistrement - Zeii'
})
</script>
