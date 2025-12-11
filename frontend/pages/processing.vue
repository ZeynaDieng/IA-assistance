<template>
  <div
    class="min-h-screen flex flex-col bg-white dark:bg-[#0D0F33] transition-colors duration-300 pb-safe-bottom"
  >
    <!-- Header -->
    <div class="px-4 pt-safe-top pb-4 flex items-center gap-3">
      <button
        class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95 transition-all"
        @click="handleCancel"
        aria-label="Annuler"
      >
        <X :size="18" class="text-gray-600 dark:text-gray-400" />
      </button>
      <h1 class="text-xl font-bold text-gray-900 dark:text-white">
        Traitement en cours
      </h1>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col items-center justify-center px-6 pb-24">
      <!-- Progress Indicator -->
      <div class="w-full max-w-sm mb-8">
        <!-- Progress Steps -->
        <div class="flex items-center justify-between mb-6">
          <div
            v-for="(step, index) in steps"
            :key="index"
            class="flex flex-col items-center flex-1"
          >
            <div
              :class="[
                'w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all',
                step.completed
                  ? 'bg-primary text-white'
                  : step.active
                  ? 'bg-primary/20 text-primary border-2 border-primary'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
              ]"
            >
              <component
                :is="step.completed ? Check : step.active ? Loader2 : Circle"
                :size="20"
                :class="step.active && !step.completed ? 'animate-spin' : ''"
              />
            </div>
            <span
              :class="[
                'text-xs text-center',
                step.active || step.completed
                  ? 'text-gray-900 dark:text-white font-medium'
                  : 'text-gray-400 dark:text-gray-500'
              ]"
            >
              {{ step.label }}
            </span>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
          <div
            class="h-full bg-primary rounded-full transition-all duration-500"
            :style="{ width: `${progress}%` }"
          />
        </div>

        <!-- Progress Percentage -->
        <div class="text-center">
          <span class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ Math.round(progress) }}%
          </span>
        </div>
      </div>

      <!-- Status Message -->
      <div class="text-center mb-8">
        <p class="text-lg text-gray-900 dark:text-white font-medium mb-2">
          {{ currentStepMessage }}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ currentStepDescription }}
        </p>
      </div>

      <!-- Loading Animation -->
      <div class="w-32 h-32 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-8">
        <Loader2 :size="48" class="text-primary animate-spin" />
      </div>

      <!-- Cancel Button -->
      <button
        class="px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95 transition-all"
        @click="handleCancel"
      >
        Annuler
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { X, Loader2, Check, Circle } from 'lucide-vue-next'
import { useAudioStore } from '~/stores/audio'
import { useToast } from '~/composables/useToast'

const router = useRouter()
const audioStore = useAudioStore()

const progress = ref(0)
const currentStep = ref<'upload' | 'transcribe' | 'analyze'>('upload')
let progressInterval: NodeJS.Timeout | null = null
let audioLogId: string | null = null

const steps = computed(() => [
  {
    label: 'Upload',
    completed: currentStep.value !== 'upload',
    active: currentStep.value === 'upload',
  },
  {
    label: 'Transcription',
    completed: currentStep.value === 'analyze',
    active: currentStep.value === 'transcribe',
  },
  {
    label: 'Analyse',
    completed: false,
    active: currentStep.value === 'analyze',
  },
])

const currentStepMessage = computed(() => {
  switch (currentStep.value) {
    case 'upload':
      return 'Upload de l\'audio...'
    case 'transcribe':
      return 'Transcription en cours...'
    case 'analyze':
      return 'Analyse terminée !'
    default:
      return 'Traitement en cours...'
  }
})

const currentStepDescription = computed(() => {
  switch (currentStep.value) {
    case 'upload':
      return 'Votre enregistrement est en cours d\'upload'
    case 'transcribe':
      return 'Conversion de votre voix en texte'
    case 'analyze':
      return 'Redirection vers la transcription...'
    default:
      return 'Veuillez patienter'
  }
})

const simulateProgress = () => {
  progressInterval = setInterval(() => {
    if (currentStep.value === 'upload' && progress.value < 30) {
      progress.value = Math.min(30, progress.value + 2)
    } else if (currentStep.value === 'transcribe' && progress.value < 80) {
      progress.value = Math.min(80, progress.value + 1)
    } else if (currentStep.value === 'analyze' && progress.value < 100) {
      progress.value = Math.min(100, progress.value + 2)
    }
  }, 200)
}

const processAudio = async () => {
  try {
    // Step 1: Upload (should already be done, but check)
    currentStep.value = 'upload'
    progress.value = 10
    
    // Get audioLogId from localStorage
    audioLogId = localStorage.getItem('current_audio_log_id')
    
    if (!audioLogId) {
      throw new Error('Aucun enregistrement trouvé')
    }
    
    // Simulate upload progress
    await new Promise(resolve => setTimeout(resolve, 1000))
    progress.value = 30
    
    // Step 2: Transcribe
    currentStep.value = 'transcribe'
    progress.value = 35
    
    const transcription = await audioStore.transcribeAudio(audioLogId)
    
    if (!transcription) {
      throw new Error('Erreur lors de la transcription')
    }
    
    progress.value = 80
    
    // Step 3: Analyze (just a small delay for UX)
    currentStep.value = 'analyze'
    progress.value = 85
    
    await new Promise(resolve => setTimeout(resolve, 500))
    progress.value = 100
    
    // Navigate to transcription page
    setTimeout(() => {
      router.push('/transcription')
    }, 500)
  } catch (error: any) {
    console.error('Error processing audio:', error)
    
    // If rate limited, show message and redirect
    if (error.message && error.message.includes('Limite de traitement')) {
      const { error: showError } = useToast()
      showError(error.message)
      setTimeout(() => {
        router.push('/transcription')
      }, 2000)
    } else {
      const { error: showError } = useToast()
      showError(error.message || 'Erreur lors du traitement')
      setTimeout(() => {
        router.push('/home')
      }, 2000)
    }
  }
}

const handleCancel = () => {
  if (progressInterval) {
    clearInterval(progressInterval)
  }
  router.push('/home')
}

onMounted(() => {
  simulateProgress()
  processAudio()
})

onUnmounted(() => {
  if (progressInterval) {
    clearInterval(progressInterval)
  }
})

useHead({
  title: 'Traitement - Zeii'
})
</script>
