<template>
  <div
    :class="[
      'flex items-end gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300',
      message.role === 'user' ? 'justify-end' : 'justify-start',
    ]"
  >
    <!-- Avatar for assistant -->
    <div
      v-if="message.role === 'assistant'"
      class="w-8 h-8 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 flex items-center justify-center flex-shrink-0 shadow-sm"
    >
      <MessageCircle :size="16" class="text-primary" />
    </div>

    <!-- Message bubble -->
    <div
      :class="[
        'max-w-[75%] rounded-3xl shadow-md transition-all duration-200',
        message.role === 'user'
          ? 'bg-gradient-to-br from-primary to-primary-dark text-white rounded-br-md'
          : 'bg-white dark:bg-gray-800/80 text-gray-900 dark:text-white rounded-bl-md border border-gray-100 dark:border-gray-700/50',
      ]"
    >
      <div class="px-4 py-3">
        <!-- Message content -->
        <p
          :class="[
            'text-sm leading-relaxed whitespace-pre-wrap break-words',
            message.role === 'user'
              ? 'text-white'
              : 'text-gray-900 dark:text-white',
          ]"
        >
          {{ cleanMessageContent(message.content) }}
        </p>

        <!-- Voice player -->
        <div
          v-if="message.isVoice && message.audioUrl"
          class="mt-3 pt-3 border-t border-white/20 dark:border-gray-700/50"
        >
          <VoicePlayer
            :audio-url="message.audioUrl"
            :duration="message.duration"
          />
        </div>

        <!-- Confirmation request message -->
        <div
          v-if="
            message.role === 'assistant' &&
            !hasProposedItems &&
            hasPlanningContent &&
            hasConfirmationRequest &&
            !hasUserConfirmed
          "
          class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700/50"
        >
          <p
            class="text-xs text-gray-500 dark:text-gray-400 italic text-center"
          >
            💬 Répondez "oui", "ok" ou "d'accord" pour que je crée ce planning
          </p>
        </div>

        <!-- Planning proposal actions - Only show if user has confirmed but no JSON yet -->
        <div
          v-if="
            message.role === 'assistant' &&
            !hasProposedItems &&
            hasPlanningContent &&
            hasUserConfirmed &&
            !hasConfirmationRequest
          "
          class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700/50"
        >
          <button
            @click="handleExtractTasks"
            class="w-full px-4 py-2.5 text-sm font-medium rounded-2xl bg-primary/10 hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 text-primary dark:text-primary-light active:scale-95 transition-all"
          >
            📋 Extraire les tâches du planning
          </button>
        </div>

        <!-- Proposed tasks and routines -->
        <div
          v-if="message.role === 'assistant' && hasProposedItems"
          class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700/50"
        >
          <div v-if="!isValidated" class="space-y-3">
            <!-- Tasks preview -->
            <div
              v-if="proposedTasks && proposedTasks.length > 0"
              class="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-3 space-y-2 max-h-40 overflow-y-auto"
            >
              <p
                class="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                📋 {{ proposedTasks.length }} tâche{{
                  proposedTasks.length > 1 ? "s" : ""
                }}
                proposée{{ proposedTasks.length > 1 ? "s" : "" }}
              </p>
              <div
                v-for="(task, index) in proposedTasks.slice(0, 3)"
                :key="index"
                class="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2 bg-white dark:bg-gray-800/50 rounded-xl p-2"
              >
                <span class="text-primary font-semibold flex-shrink-0"
                  >{{ index + 1 }}.</span
                >
                <span class="flex-1">{{ task.title }}</span>
                <span
                  class="text-gray-400 dark:text-gray-500 text-[10px] flex-shrink-0"
                >
                  {{ formatTaskTime(task.scheduledAt) }}
                </span>
              </div>
              <p
                v-if="proposedTasks.length > 3"
                class="text-xs text-gray-500 dark:text-gray-500 italic text-center pt-1"
              >
                + {{ proposedTasks.length - 3 }} autre{{
                  proposedTasks.length - 3 > 1 ? "s" : ""
                }}...
              </p>
            </div>

            <!-- Routines preview -->
            <div
              v-if="proposedRoutines && proposedRoutines.length > 0"
              class="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-3 space-y-2 max-h-40 overflow-y-auto"
            >
              <p
                class="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                🔄 {{ proposedRoutines.length }} routine{{
                  proposedRoutines.length > 1 ? "s" : ""
                }}
                proposée{{ proposedRoutines.length > 1 ? "s" : "" }}
              </p>
              <div
                v-for="(routine, index) in proposedRoutines.slice(0, 3)"
                :key="index"
                class="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2 bg-white dark:bg-gray-800/50 rounded-xl p-2"
              >
                <span class="text-primary font-semibold flex-shrink-0"
                  >{{ index + 1 }}.</span
                >
                <span class="flex-1">{{ routine.title }}</span>
                <span
                  class="text-gray-400 dark:text-gray-500 text-[10px] flex-shrink-0"
                >
                  {{ routine.frequency }}
                </span>
              </div>
              <p
                v-if="proposedRoutines.length > 3"
                class="text-xs text-gray-500 dark:text-gray-500 italic text-center pt-1"
              >
                + {{ proposedRoutines.length - 3 }} autre{{
                  proposedRoutines.length - 3 > 1 ? "s" : ""
                }}...
              </p>
            </div>

            <!-- Action buttons -->
            <div class="flex gap-2">
              <button
                @click="handleValidate"
                :disabled="isValidating"
                class="flex-1 px-4 py-3 text-sm font-semibold rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                <span
                  v-if="!isValidating"
                  class="flex items-center justify-center gap-2"
                >
                  <span>✓</span>
                  <span>Accepter</span>
                </span>
                <span v-else class="flex items-center justify-center gap-2">
                  <span class="animate-spin">⏳</span>
                  <span>Validation...</span>
                </span>
              </button>
              <button
                @click="handleReject"
                :disabled="isValidating"
                class="px-4 py-3 text-sm font-medium rounded-2xl bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600/50 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Rejeter"
              >
                ✕
              </button>
            </div>
          </div>
          <div
            v-else
            class="flex items-center gap-2 text-sm text-success dark:text-success font-medium bg-success/10 dark:bg-success/20 rounded-2xl p-3"
          >
            <span>✓</span>
            <span>Planning validé, tâches et routines créées</span>
          </div>
        </div>

        <!-- Timestamp -->
        <p
          :class="[
            'text-xs mt-2',
            message.role === 'user'
              ? 'text-right text-white/70'
              : 'text-left text-gray-400 dark:text-gray-500',
          ]"
        >
          {{ formatTime(message.createdAt) }}
        </p>
      </div>
    </div>

    <!-- Avatar for user -->
    <div
      v-if="message.role === 'user'"
      class="w-8 h-8 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/20 flex items-center justify-center flex-shrink-0 shadow-sm"
    >
      <div class="w-2 h-2 rounded-full bg-white" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChatMessage, ProposedTask, ProposedRoutine } from "~/stores/chat";
import VoicePlayer from "./VoicePlayer.vue";
import { useChatStore } from "~/stores/chat";
import { useToast } from "~/composables/useToast";
import { computed, ref } from "vue";
import { MessageCircle } from "lucide-vue-next";

const props = defineProps<{
  message: ChatMessage;
}>();

const chatStore = useChatStore();
const { showToast } = useToast();
const isValidating = ref(false);

const proposedTasks = computed(() => {
  const tasks = chatStore.getProposedTasks(props.message);
  return tasks;
});

const proposedRoutines = computed(() => {
  const routines = chatStore.getProposedRoutines(props.message);
  return routines;
});

const isValidated = computed(() =>
  chatStore.isPlanningValidated(props.message)
);

const hasProposedItems = computed(() => {
  return (
    (proposedTasks.value && proposedTasks.value.length > 0) ||
    (proposedRoutines.value && proposedRoutines.value.length > 0)
  );
});

const hasPlanningContent = computed(() => {
  const content = props.message.content.toLowerCase();
  const planningKeywords = [
    "9h",
    "10h",
    "11h",
    "12h",
    "13h",
    "14h",
    "15h",
    "16h",
    "17h",
    "planning",
    "tâche",
    "tache",
  ];
  return planningKeywords.some((keyword) => content.includes(keyword));
});

const hasConfirmationRequest = computed(() => {
  if (props.message.role !== "assistant") return false;
  const content = props.message.content.toLowerCase();
  const confirmationPhrases = [
    "souhaitez-vous",
    "voulez-vous",
    "je peux créer",
    "souhaitez vous",
    "voulez vous",
    "souhaiteriez-vous",
    "voulez-vous que je",
    "souhaitez-vous que je",
    "voulez vous que je",
    "souhaitez vous que je",
    "acceptez-vous",
    "acceptez vous",
    "confirmez-vous",
    "confirmez vous",
  ];
  return confirmationPhrases.some((phrase) => content.includes(phrase));
});

const hasUserConfirmed = computed(() => {
  // Check if there's a user message after this assistant message that confirms
  if (!props.message.id) return false;

  const currentMessageIndex = chatStore.chatMessages.findIndex(
    (m) => m.id === props.message.id
  );

  if (currentMessageIndex === -1) return false;

  // Look for user messages after this assistant message
  const subsequentMessages = chatStore.chatMessages.slice(
    currentMessageIndex + 1
  );
  const confirmationKeywords = [
    "oui",
    "ok",
    "d'accord",
    "d accord",
    "accepte",
    "confirme",
    "valide",
    "créer",
    "ajoute",
    "vas-y",
    "vas y",
    "go",
    "yes",
  ];

  return subsequentMessages.some((msg) => {
    if (msg.role !== "user") return false;
    const content = msg.content.toLowerCase();
    return confirmationKeywords.some((keyword) => content.includes(keyword));
  });
});

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatTaskTime = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

const formatDuration = (seconds: number | null | undefined): string => {
  if (seconds === null || seconds === undefined || seconds <= 0) {
    return "0:00";
  }
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const cleanMessageContent = (content: string): string => {
  if (!content) return "";

  let cleaned = content;

  // Remove JSON blocks wrapped in code blocks
  cleaned = cleaned.replace(/```json[\s\S]*?```/gi, "");
  cleaned = cleaned.replace(/```[\s\S]*?```/g, "");

  // Remove JSON objects that are clearly metadata (proposedTasks, proposedRoutines, etc.)
  // Match complete JSON objects with these keys
  const jsonPatterns = [
    /\{\s*"proposedTasks"[\s\S]*?\}/g,
    /\{\s*"proposedRoutines"[\s\S]*?\}/g,
    /\{\s*"metadata"[\s\S]*?\}/g,
    /\{\s*"validated"[\s\S]*?\}/g,
    /\{\s*"tasks"[\s\S]*?\}/g,
    /\{\s*"routines"[\s\S]*?\}/g,
  ];

  jsonPatterns.forEach((pattern) => {
    cleaned = cleaned.replace(pattern, "");
  });

  // Remove standalone JSON objects/arrays that span multiple lines
  // Match: { ... } or [ ... ] that look like complete JSON structures
  cleaned = cleaned.replace(/\{\s*\n[\s\S]*?\n\s*\}/g, (match) => {
    try {
      JSON.parse(match);
      return ""; // Valid JSON, remove it
    } catch {
      return match; // Not valid JSON, keep it
    }
  });

  cleaned = cleaned.replace(/\[\s*\n[\s\S]*?\n\s*\]/g, (match) => {
    try {
      JSON.parse(match);
      return ""; // Valid JSON, remove it
    } catch {
      return match; // Not valid JSON, keep it
    }
  });

  // Remove any remaining single-line JSON objects that are clearly metadata
  cleaned = cleaned.replace(/\{\s*"[^"]+"\s*:\s*[^}]+\}/g, (match) => {
    // Only remove if it looks like metadata (has common metadata keys)
    if (
      match.includes("proposedTasks") ||
      match.includes("proposedRoutines") ||
      match.includes("validated") ||
      match.includes("metadata")
    ) {
      return "";
    }
    try {
      JSON.parse(match);
      // If it's valid JSON but short, it might be metadata
      if (match.length < 200) {
        return "";
      }
    } catch {
      // Not valid JSON, keep it
    }
    return match;
  });

  // Clean up multiple newlines and whitespace
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");
  cleaned = cleaned.replace(/[ \t]+/g, " ");
  cleaned = cleaned.trim();

  // If cleaned content is too short or empty, return original
  // This prevents removing legitimate content
  if (cleaned.length < 10 && content.length > 50) {
    return content;
  }

  return cleaned || content;
};

const handleValidate = async () => {
  if (!props.message.id || isValidating.value) return;

  isValidating.value = true;
  try {
    const result = await chatStore.validatePlanning(props.message.id);
    const tasksCount = result.data?.tasksCreated || 0;
    const routinesCount = result.data?.routinesCreated || 0;
    let message = "Planning validé ! ";
    if (tasksCount > 0 && routinesCount > 0) {
      message += `${tasksCount} tâche${
        tasksCount > 1 ? "s" : ""
      } et ${routinesCount} routine${routinesCount > 1 ? "s" : ""} créées.`;
    } else if (tasksCount > 0) {
      message += `${tasksCount} tâche${tasksCount > 1 ? "s" : ""} créée${
        tasksCount > 1 ? "s" : ""
      }.`;
    } else if (routinesCount > 0) {
      message += `${routinesCount} routine${
        routinesCount > 1 ? "s" : ""
      } créée${routinesCount > 1 ? "s" : ""}.`;
    }
    showToast({ message, variant: "success" });

    // Reload tasks in tasks store
    try {
      const { useTasksStore } = await import("~/stores/tasks");
      const tasksStore = useTasksStore();
      await tasksStore.loadTasks();
    } catch (taskError) {
      // Ignore task reload errors, planning is still validated
      console.warn("Error reloading tasks:", taskError);
    }
  } catch (err: any) {
    showToast({
      message: err.message || "Erreur lors de la validation",
      variant: "error",
    });
  } finally {
    isValidating.value = false;
  }
};

const handleReject = () => {
  showToast({ message: "Planning rejeté", variant: "info" });
};

const handleExtractTasks = async () => {
  try {
    const config = useRuntimeConfig();
    const { useAuthStore } = await import("~/stores/auth");
    const authStore = useAuthStore();

    if (!authStore.token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(
      `${config.public.apiBaseUrl}/ai/chat/extract-from-message`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.token}`,
        },
        body: JSON.stringify({
          messageId: props.message.id,
          content: props.message.content,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      await chatStore.loadHistory();
      showToast({
        message: "Tâches extraites avec succès !",
        variant: "success",
      });
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to extract tasks");
    }
  } catch (err: any) {
    console.error("Error extracting tasks:", err);
    showToast({
      message: err.message || "Erreur lors de l'extraction",
      variant: "error",
    });
  }
};
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-in-from-bottom-2 {
  from {
    transform: translateY(8px);
  }
  to {
    transform: translateY(0);
  }
}

.animate-in {
  animation: fade-in 0.3s ease-out, slide-in-from-bottom-2 0.3s ease-out;
}
</style>
