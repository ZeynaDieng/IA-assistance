<template>
  <div
    class="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white dark:from-[#0D0F33] dark:to-[#0A0C26] transition-colors duration-300 pb-safe-bottom"
  >
    <!-- Header -->
    <div
      class="sticky top-0 z-10 bg-white/80 dark:bg-[#0D0F33]/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50"
    >
      <div class="px-4 pt-safe-top pb-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button
            class="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-gray-800/50 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700/50 active:scale-95 transition-all"
            @click="router.back()"
            aria-label="Retour"
          >
            <X :size="18" class="text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 class="text-lg font-bold text-gray-900 dark:text-white">
              {{ assistantName }}
            </h1>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Planification intelligente
            </p>
          </div>
        </div>
        <button
          v-if="chatStore.hasMessages"
          class="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-gray-800/50 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700/50 active:scale-95 transition-all"
          @click="handleClear"
          aria-label="Effacer"
        >
          <Trash2 :size="18" class="text-gray-600 dark:text-gray-400" />
        </button>
      </div>
    </div>

    <!-- Messages area -->
    <div
      ref="messagesContainer"
      class="flex-1 overflow-y-auto px-4 py-6 space-y-4 scroll-smooth"
    >
      <!-- Empty state -->
      <div
        v-if="!chatStore.hasMessages && !chatStore.isLoading"
        class="flex flex-col items-center justify-center min-h-full text-center px-4 py-12"
      >
        <div class="relative mb-6">
          <div
            class="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 flex items-center justify-center shadow-lg"
          >
            <MessageCircle :size="40" class="text-primary" />
          </div>
          <div
            class="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary/20 dark:bg-primary/30 flex items-center justify-center"
          >
            <div class="w-2 h-2 rounded-full bg-primary animate-pulse" />
          </div>
        </div>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Commencez une conversation
        </h2>
        <p
          class="text-sm text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed"
        >
          Posez vos questions ou envoyez un message vocal pour obtenir de l'aide
          avec votre planning
        </p>
      </div>

      <!-- Messages -->
      <TransitionGroup name="message" tag="div" class="space-y-4">
        <ChatMessage
          v-for="message in chatStore.chatMessages"
          :key="message.id"
          :message="message"
        />
      </TransitionGroup>

      <!-- Typing indicator -->
      <Transition name="fade">
        <div v-if="chatStore.isLoading" class="flex justify-start mb-4">
          <div
            class="bg-white dark:bg-gray-800/50 rounded-3xl rounded-bl-md px-5 py-4 shadow-md border border-gray-100 dark:border-gray-700/50"
          >
            <div class="flex items-center gap-2">
              <div
                class="w-2 h-2 bg-primary rounded-full animate-bounce"
                style="animation-delay: 0s"
              />
              <div
                class="w-2 h-2 bg-primary rounded-full animate-bounce"
                style="animation-delay: 0.2s"
              />
              <div
                class="w-2 h-2 bg-primary rounded-full animate-bounce"
                style="animation-delay: 0.4s"
              />
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Input area -->
    <ChatInput
      :is-loading="chatStore.isLoading"
      @send-text="handleSendText"
      @send-voice="handleSendVoice"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from "vue";
import { X, Trash2, MessageCircle } from "lucide-vue-next";
import { useChatStore } from "~/stores/chat";
import { useAuthStore } from "~/stores/auth";
import { useTTS } from "~/composables/useTTS";
import ChatMessage from "~/components/chat/ChatMessage.vue";
import ChatInput from "~/components/chat/ChatInput.vue";
import { useToast } from "~/composables/useToast";

const router = useRouter();
const chatStore = useChatStore();
const { success, error } = useToast();
const { speak, isSupported: isTTSSupported } = useTTS();
const authStore = useAuthStore();

const messagesContainer = ref<HTMLElement | null>(null);
const voiceResponseEnabled = ref(true);
const assistantName = ref("Assistant IA");

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTo({
        top: messagesContainer.value.scrollHeight,
        behavior: "smooth",
      });
    }
  });
};

const handleSendText = async (message: string) => {
  try {
    await chatStore.sendTextMessage(message);
    scrollToBottom();

    // Auto-play TTS for assistant response if supported and enabled
    if (
      isTTSSupported.value &&
      voiceResponseEnabled.value &&
      chatStore.lastMessage?.role === "assistant"
    ) {
      speak(chatStore.lastMessage.content);
    }
  } catch (err: any) {
    error(err.message || "Erreur lors de l'envoi du message");
  }
};

const handleSendVoice = async (audioBlob: Blob, duration?: number) => {
  try {
    await chatStore.sendVoiceMessage(audioBlob, "recording.webm", duration);
    scrollToBottom();

    // Auto-play TTS for assistant response if supported and enabled
    if (
      isTTSSupported.value &&
      voiceResponseEnabled.value &&
      chatStore.lastMessage?.role === "assistant"
    ) {
      speak(chatStore.lastMessage.content);
    }
  } catch (err: any) {
    error(err.message || "Erreur lors de l'envoi du message vocal");
  }
};

const handleClear = async () => {
  if (confirm("Voulez-vous effacer toute la conversation ?")) {
    try {
      await chatStore.clearChat();
      success("Conversation effacée");
    } catch (err: any) {
      error(err.message || "Erreur lors de l'effacement de la conversation");
    }
  }
};

// Watch for new messages and scroll
watch(
  () => chatStore.chatMessages.length,
  () => {
    nextTick(() => {
      scrollToBottom();
    });
  }
);

const loadPreferences = async () => {
  try {
    const config = useRuntimeConfig();
    const response = await fetch(
      `${config.public.apiBaseUrl}/users/preferences`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (data.data) {
        voiceResponseEnabled.value = data.data.voiceResponseEnabled !== false;
        assistantName.value = data.data.assistantName || "Assistant IA";
      }
    }
  } catch (err) {
    console.error("Error loading preferences:", err);
  }
};

onMounted(async () => {
  authStore.initialize();
  if (authStore.isLoggedIn) {
    await loadPreferences();
  }
  try {
    await chatStore.loadHistory();
    scrollToBottom();
  } catch (err: any) {
    console.error("Error loading chat history:", err);
  }
});

useHead({
  title: "Chat - Zeii",
});
</script>

<style scoped>
/* Message animations */
.message-enter-active {
  transition: all 0.3s ease-out;
}

.message-leave-active {
  transition: all 0.2s ease-in;
}

.message-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}

.message-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.message-move {
  transition: transform 0.3s ease;
}

/* Fade animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Smooth scroll */
.scroll-smooth {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
.scroll-smooth::-webkit-scrollbar {
  width: 4px;
}

.scroll-smooth::-webkit-scrollbar-track {
  background: transparent;
}

.scroll-smooth::-webkit-scrollbar-thumb {
  background: rgba(108, 62, 241, 0.2);
  border-radius: 2px;
}

.scroll-smooth::-webkit-scrollbar-thumb:hover {
  background: rgba(108, 62, 241, 0.3);
}
</style>
