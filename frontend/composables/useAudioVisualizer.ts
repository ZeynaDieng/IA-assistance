import { ref, computed, onUnmounted } from 'vue'

export function useAudioVisualizer() {
  const audioBars = ref<number[]>(Array(24).fill(0))
  let audioContext: AudioContext | null = null
  let analyser: AnalyserNode | null = null
  let dataArray: Uint8Array | null = null
  let animationFrameId: number | null = null
  let source: MediaStreamAudioSourceNode | null = null

  const startVisualizer = (stream: MediaStream) => {
    try {
      // Create audio context
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      analyser = audioContext.createAnalyser()
      analyser.fftSize = 64
      analyser.smoothingTimeConstant = 0.8

      // Connect stream to analyser
      source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)

      // Create data array
      const bufferLength = analyser.frequencyBinCount
      dataArray = new Uint8Array(bufferLength)

      // Start animation loop
      const updateVisualizer = () => {
        if (!analyser || !dataArray) return

        analyser.getByteFrequencyData(dataArray)

        // Process data for 24 bars (circular visualizer)
        const bars: number[] = []
        const step = Math.floor(bufferLength / 24)

        for (let i = 0; i < 24; i++) {
          const index = i * step
          const value = dataArray[index] / 255 // Normalize to 0-1
          bars.push(value)
        }

        audioBars.value = bars
        animationFrameId = requestAnimationFrame(updateVisualizer)
      }

      updateVisualizer()
    } catch (error) {
      console.error('Error starting audio visualizer:', error)
    }
  }

  const stopVisualizer = () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }

    if (source) {
      source.disconnect()
      source = null
    }

    if (audioContext && audioContext.state !== 'closed') {
      audioContext.close()
      audioContext = null
    }

    analyser = null
    dataArray = null
    audioBars.value = Array(24).fill(0)
  }

  onUnmounted(() => {
    stopVisualizer()
  })

  return {
    audioBars,
    startVisualizer,
    stopVisualizer,
    audioContext: computed(() => audioContext),
    analyser: computed(() => analyser),
  }
}

