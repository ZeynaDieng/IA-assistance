<template>
  <div class="flex items-center gap-3 mt-2">
    <button
      @click="togglePlay"
      :class="[
        'w-10 h-10 rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-sm',
        isPlaying
          ? 'bg-primary/20 dark:bg-primary/30 text-primary'
          : 'bg-white/20 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300'
      ]"
      aria-label="Play audio"
    >
      <component
        :is="isPlaying ? Pause : Play"
        :size="18"
      />
    </button>

    <!-- Progress bar -->
    <div class="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <div
        class="h-full bg-gradient-to-r from-primary to-primary-dark transition-all duration-100 rounded-full"
        :style="{ width: `${progress}%` }"
      />
    </div>

    <!-- Duration -->
    <span class="text-xs text-gray-500 dark:text-gray-400 min-w-[45px] text-right font-medium">
      {{ formatDuration(currentTime) }} / {{ formatDuration(audioDuration) }}
    </span>

    <audio
      ref="audioRef"
      :src="audioUrl"
      @timeupdate="updateProgress"
      @loadedmetadata="onLoadedMetadata"
      @ended="onEnded"
      preload="metadata"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, watch } from 'vue'
import { Play, Pause } from 'lucide-vue-next'

interface Props {
  audioUrl: string
  duration?: number | null // Duration in seconds from message metadata
}

const props = defineProps<Props>()

const audioRef = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const audioDuration = ref(props.duration || 0) // Initialize with prop duration if available
const progress = ref(0)

// Watch for prop duration changes
watch(() => props.duration, (newDuration) => {
  if (newDuration && newDuration > 0) {
    audioDuration.value = newDuration
  }
}, { immediate: true })

const togglePlay = () => {
  if (!audioRef.value) return

  try {
    if (isPlaying.value) {
      audioRef.value.pause()
    } else {
      audioRef.value.play().catch((error) => {
        console.warn('Error playing audio:', error)
        isPlaying.value = false
      })
    }
    isPlaying.value = !isPlaying.value
  } catch (error) {
    console.warn('Error toggling audio playback:', error)
    isPlaying.value = false
  }
}

const updateProgress = () => {
  if (!audioRef.value) return
  try {
    currentTime.value = audioRef.value.currentTime
    if (audioDuration.value > 0) {
      progress.value = (currentTime.value / audioDuration.value) * 100
    }
  } catch (error) {
    console.warn('Error updating audio progress:', error)
  }
}

const onLoadedMetadata = () => {
  if (!audioRef.value) return
  try {
    // Use audio metadata duration if available and valid, otherwise keep the prop duration
    const metadataDuration = audioRef.value.duration
    if (!isNaN(metadataDuration) && metadataDuration > 0) {
      audioDuration.value = metadataDuration
    } else if (props.duration && props.duration > 0) {
      // Fallback to prop duration if audio metadata is invalid
      audioDuration.value = props.duration
    }
  } catch (error) {
    console.warn('Error loading audio metadata:', error)
    // Fallback to prop duration on error
    if (props.duration && props.duration > 0) {
      audioDuration.value = props.duration
    }
  }
}

const onEnded = () => {
  isPlaying.value = false
  currentTime.value = 0
  progress.value = 0
  if (audioRef.value) {
    try {
      audioRef.value.currentTime = 0
    } catch (error) {
      console.warn('Error resetting audio:', error)
    }
  }
}

const formatDuration = (seconds: number): string => {
  if (isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

onUnmounted(() => {
  if (audioRef.value) {
    try {
      audioRef.value.pause()
      audioRef.value = null
    } catch (error) {
      console.warn('Error cleaning up audio:', error)
    }
  }
})
</script>
