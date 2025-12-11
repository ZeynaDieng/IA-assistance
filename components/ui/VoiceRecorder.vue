<template>
  <div class="flex flex-col items-center justify-center">
    <!-- Recording Button -->
    <button
      :class="[
        'group relative w-48 h-48 rounded-full',
        'flex items-center justify-center',
        'transition-all duration-500 hover:scale-105 active:scale-95 z-10',
        isRecording && 'scale-110'
      ]"
      @click="handleToggle"
    >
      <!-- Animated Rings -->
      <div
        v-if="isRecording"
        class="absolute inset-0 bg-primary rounded-full opacity-10 animate-ping"
      />
      <div
        :class="[
          'absolute inset-4 bg-primary rounded-full transition-opacity',
          isRecording ? 'opacity-20' : 'opacity-20 group-hover:opacity-30'
        ]"
      />
      
      <!-- Main Button -->
      <div
        :class="[
          'absolute inset-8 bg-gradient-to-br from-primary to-primary-darker',
          'rounded-full shadow-2xl flex items-center justify-center',
          isRecording ? 'bg-red-500' : ''
        ]"
      >
        <component
          :is="isRecording ? Square : Mic"
          :size="64"
          class="text-white"
        />
      </div>
    </button>
    
    <!-- Timer -->
    <div
      v-if="isRecording"
      class="mt-8 text-5xl font-mono font-bold tracking-widest"
    >
      {{ formatTime(timer) }}
    </div>
    
    <!-- Status Text -->
    <p
      :class="[
        'mt-8 text-center font-medium max-w-xs',
        isRecording ? 'text-white/60' : 'text-gray-500 animate-pulse'
      ]"
    >
      {{ isRecording ? "J'écoute..." : "Appuie pour raconter ta journée" }}
    </p>
    
    <!-- Audio Visualizer (when recording) -->
    <div
      v-if="isRecording"
      class="flex items-center gap-1 h-32 mt-10"
    >
      <div
        v-for="i in 20"
        :key="i"
        class="w-2 bg-primary rounded-full animate-pulse"
        :style="{
          height: `${Math.random() * 100}%`,
          animationDelay: `${i * 0.05}s`,
          animationDuration: '0.8s'
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Mic, Square } from 'lucide-vue-next'

interface Props {
  maxDuration?: number // in seconds
}

const props = withDefaults(defineProps<Props>(), {
  maxDuration: 120 // 2 minutes
})

const emit = defineEmits<{
  start: []
  stop: [duration: number]
  'max-duration-reached': []
}>()

const isRecording = ref(false)
const timer = ref(0)
let intervalId: NodeJS.Timeout | null = null

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

const handleToggle = () => {
  if (isRecording.value) {
    stopRecording()
  } else {
    startRecording()
  }
}

const startRecording = () => {
  isRecording.value = true
  timer.value = 0
  emit('start')
  
  intervalId = setInterval(() => {
    timer.value++
    if (timer.value >= props.maxDuration) {
      stopRecording()
      emit('max-duration-reached')
    }
  }, 1000)
}

const stopRecording = () => {
  isRecording.value = false
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
  emit('stop', timer.value)
  timer.value = 0
}

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

