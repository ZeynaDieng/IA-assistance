<template>
  <div class="flex flex-col items-center justify-center">
    <!-- Recording Button -->
    <button
      :class="[
        'group relative w-48 h-48 rounded-full',
        'flex items-center justify-center',
        'transition-all duration-500 hover:scale-105 active:scale-95 z-10',
        isRecording && 'scale-110',
      ]"
      :disabled="!hasPermission || uploading"
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
          isRecording ? 'opacity-20' : 'opacity-20 group-hover:opacity-30',
        ]"
      />

      <!-- Main Button -->
      <div
        :class="[
          'absolute inset-8 rounded-full shadow-2xl flex items-center justify-center',
          isRecording
            ? 'bg-red-500'
            : 'bg-gradient-to-br from-primary to-primary-darker',
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
      class="mt-8 text-5xl font-mono font-bold tracking-widest text-gray-800 dark:text-white"
    >
      {{ formatTime(timer) }}
    </div>

    <!-- Status Text -->
    <p
      :class="[
        'mt-8 text-center font-medium max-w-xs',
        isRecording
          ? 'text-gray-600 dark:text-white/60'
          : 'text-gray-500 animate-pulse',
      ]"
    >
      {{ statusText }}
    </p>

    <!-- Audio Visualizer (when recording) -->
    <div v-if="isRecording" class="flex items-center gap-1 h-32 mt-10">
      <div
        v-for="i in 20"
        :key="i"
        class="w-2 bg-primary rounded-full animate-pulse"
        :style="{
          height: `${Math.random() * 100}%`,
          animationDelay: `${i * 0.05}s`,
          animationDuration: '0.8s',
        }"
      />
    </div>

    <!-- Upload Progress -->
    <div v-if="uploading" class="mt-6 w-64">
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div
          class="bg-primary h-2 rounded-full transition-all duration-300"
          :style="{ width: `${uploadProgress}%` }"
        />
      </div>
      <p class="text-sm text-gray-500 mt-2 text-center">
        Envoi en cours... {{ uploadProgress }}%
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { Mic, Square } from "lucide-vue-next";

interface Props {
  maxDuration?: number; // in seconds
}

const props = withDefaults(defineProps<Props>(), {
  maxDuration: 120, // 2 minutes
});

const emit = defineEmits<{
  start: [];
  stop: [blob: Blob, duration: number];
  "max-duration-reached": [];
  "permission-denied": [];
  "upload-progress": [progress: number];
  "upload-complete": [audioUrl: string];
  error: [error: Error];
}>();

const isRecording = ref(false);
const timer = ref(0);
const hasPermission = ref(false);
const uploading = ref(false);
const uploadProgress = ref(0);

let intervalId: NodeJS.Timeout | null = null;
let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];

const statusText = computed(() => {
  if (!hasPermission.value) return "Autorisation microphone requise";
  if (uploading.value) return "Envoi en cours...";
  if (isRecording.value) return "J'écoute...";
  return "Appuie pour raconter ta journée";
});

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

const requestMicrophonePermission = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    hasPermission.value = true;
    stream.getTracks().forEach((track) => track.stop()); // Stop immediately, we'll start recording on button click
  } catch (error) {
    hasPermission.value = false;
    emit("permission-denied");
  }
};

const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100,
      },
    });

    mediaRecorder = new MediaRecorder(stream, {
      mimeType: "audio/webm;codecs=opus",
    });

    audioChunks = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      const duration = timer.value;

      // Stop all tracks
      stream.getTracks().forEach((track) => track.stop());

      // Upload audio
      await uploadAudio(audioBlob);

      emit("stop", audioBlob, duration);
    };

    mediaRecorder.start();
    isRecording.value = true;
    timer.value = 0;
    emit("start");

    intervalId = setInterval(() => {
      timer.value++;
      if (timer.value >= props.maxDuration) {
        stopRecording();
        emit("max-duration-reached");
      }
    }, 1000);
  } catch (error) {
    console.error("Error starting recording:", error);
    emit("error", error as Error);
  }
};

const stopRecording = () => {
  if (mediaRecorder && isRecording.value) {
    mediaRecorder.stop();
    isRecording.value = false;
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }
};

const uploadAudio = async (blob: Blob) => {
  uploading.value = true;
  uploadProgress.value = 0;

  try {
    const formData = new FormData();
    formData.append("file", blob, "recording.webm");

    const config = useRuntimeConfig();
    const authStore = useAuthStore();
    const response = await fetch(`${config.public.apiBaseUrl}/audio/upload`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();
    uploadProgress.value = 100;
    uploading.value = false;

    // Backend returns: { success: true, data: { audioLogId, fileUrl } }
    const audioLogId = data.data?.audioLogId || data.audioLogId;
    emit("upload-complete", audioLogId);
  } catch (error) {
    uploading.value = false;
    emit("error", error as Error);
  }
};

const handleToggle = () => {
  if (!hasPermission.value) {
    requestMicrophonePermission();
    return;
  }

  if (isRecording.value) {
    stopRecording();
  } else {
    startRecording();
  }
};

onMounted(() => {
  requestMicrophonePermission();
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
  if (mediaRecorder && isRecording.value) {
    mediaRecorder.stop();
    mediaRecorder = null;
  }
});
</script>
