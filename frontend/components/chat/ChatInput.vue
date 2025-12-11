<template>
  <div
    class="sticky bottom-0 bg-white/80 dark:bg-[#0D0F33]/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 p-4 pb-safe-bottom"
  >
    <div class="flex items-end gap-3">
      <!-- Text input -->
      <div class="flex-1 relative">
        <textarea
          v-model="inputText"
          ref="textareaRef"
          :placeholder="
            isRecording ? 'Enregistrement en cours...' : 'Tapez un message...'
          "
          class="w-full px-4 py-3 pr-12 rounded-2xl border border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none max-h-32 overflow-y-auto transition-all"
          rows="1"
          :disabled="isRecording || isLoading"
          @keydown.enter.exact.prevent="handleSend"
          @input="handleInput"
        />
      </div>

      <!-- Microphone button -->
      <button
        v-if="!isRecording"
        @click="handleStartRecording"
        :disabled="isLoading || inputText.trim().length > 0"
        :class="[
          'w-12 h-12 rounded-2xl flex items-center mb-2 justify-center transition-all active:scale-95 shadow-md',
          inputText.trim().length > 0 || isLoading
            ? 'bg-gray-100 dark:bg-gray-700/50 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-br from-primary to-primary-dark text-white hover:shadow-lg',
        ]"
        aria-label="Enregistrer un message vocal"
      >
        <Mic :size="20" />
      </button>

      <!-- Stop recording button -->
      <button
        v-else
        @click="handleStopRecording"
        class="w-12 h-12 rounded-2xl bg-red-500 text-white flex items-center justify-center hover:bg-red-600 active:scale-95 transition-all shadow-md hover:shadow-lg"
        aria-label="Arrêter l'enregistrement"
      >
        <Square :size="20" />
      </button>

      <!-- Send button -->
      <button
        v-if="inputText.trim().length > 0 && !isRecording"
        @click="handleSend"
        :disabled="isLoading"
        class="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white flex items-center justify-center hover:shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        aria-label="Envoyer"
      >
        <Send :size="20" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import { Mic, Square, Send } from "lucide-vue-next";
import { useSpeechRecognition } from "~/composables/useSpeechRecognition";
import { useAudioStore } from "~/stores/audio";

const emit = defineEmits<{
  sendText: [message: string];
  sendVoice: [audioBlob: Blob, duration?: number];
}>();

const props = defineProps<{
  isLoading?: boolean;
}>();

const inputText = ref("");
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const isRecording = ref(false);

const {
  start: startRecognition,
  stop: stopRecognition,
  isListening,
  isSupported: isRecognitionSupported,
} = useSpeechRecognition();
const audioStore = useAudioStore();

const handleInput = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = "auto";
    textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`;
  }
};

const handleSend = () => {
  if (inputText.value.trim() && !props.isLoading) {
    emit("sendText", inputText.value.trim());
    inputText.value = "";
    if (textareaRef.value) {
      textareaRef.value.style.height = "auto";
    }
  }
};

const handleStartRecording = async () => {
  if (props.isLoading) return;

  // Try Web Speech API first (free)
  if (isRecognitionSupported.value) {
    try {
      isRecording.value = true;
      const transcript = await startRecognition();
      if (transcript && transcript.trim().length > 0) {
        emit("sendText", transcript);
        isRecording.value = false;
        return;
      }
      isRecording.value = false;
      await startAudioRecording();
    } catch (error: any) {
      console.warn(
        "Web Speech API error, falling back to audio recording:",
        error.message
      );
      isRecording.value = false;
      await startAudioRecording();
    }
  } else {
    await startAudioRecording();
  }
};

const startAudioRecording = async () => {
  try {
    isRecording.value = true;
    await audioStore.startRecording();
  } catch (error: any) {
    console.error("Error starting audio recording:", error);
    isRecording.value = false;
    alert(error.message || "Erreur lors du démarrage de l'enregistrement");
  }
};

const handleStopRecording = async () => {
  if (isListening.value) {
    stopRecognition();
    isRecording.value = false;
    return;
  }

  try {
    const blob = await audioStore.stopRecording();
    if (blob) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const durationSeconds = audioStore.duration;
      console.log(
        "[ChatInput] Sending voice message with duration:",
        durationSeconds,
        "seconds"
      );
      emit(
        "sendVoice",
        blob,
        durationSeconds > 0 ? durationSeconds : undefined
      );
    }
  } catch (error: any) {
    console.error("Error stopping audio recording:", error);
    alert(error.message || "Erreur lors de l'arrêt de l'enregistrement");
  } finally {
    isRecording.value = false;
  }
};
</script>
