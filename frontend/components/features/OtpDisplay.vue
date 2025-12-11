<template>
  <Card
    variant="colored"
    class="mb-8 text-center animate-bounce"
  >
    <span class="text-sm uppercase tracking-widest opacity-80 font-bold block mb-2">
      {{ label }}
    </span>
    <div class="text-5xl font-mono font-bold mt-2 tracking-widest">
      {{ otp }}
    </div>
    <p
      v-if="expiresIn > 0"
      class="text-xs opacity-70 mt-4"
    >
      Expire dans {{ formatTime(expiresIn) }}
    </p>
  </Card>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Card from '~/components/ui/Card.vue'

interface Props {
  otp: string
  label?: string
  expiresIn?: number // seconds
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Ton Code',
  expiresIn: 600 // 10 minutes default
})

const expiresIn = ref(props.expiresIn)
let intervalId: NodeJS.Timeout | null = null

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

onMounted(() => {
  if (props.expiresIn > 0) {
    intervalId = setInterval(() => {
      expiresIn.value--
      if (expiresIn.value <= 0) {
        clearInterval(intervalId!)
      }
    }, 1000)
  }
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

