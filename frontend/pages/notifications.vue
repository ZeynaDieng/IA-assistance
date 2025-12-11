<template>
  <div
    class="min-h-screen flex flex-col bg-white dark:bg-[#0D0F33] transition-colors duration-300 pb-safe-bottom"
  >
    <!-- Content -->
    <div class="flex-1 overflow-y-auto px-6 pt-6 pb-24">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">
          Notifications
        </h1>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <Loader2 :size="32" class="animate-spin text-primary" />
      </div>

      <!-- Notifications List -->
      <div v-else-if="notifications.length > 0" class="space-y-3">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <div
                  :class="[
                    'w-2 h-2 rounded-full flex-shrink-0',
                    notification.status === 'PENDING'
                      ? 'bg-primary'
                      : notification.status === 'SENT'
                      ? 'bg-success'
                      : 'bg-gray-400',
                  ]"
                />
                <span
                  class="text-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  {{ formatDate(notification.scheduledAt) }}
                </span>
              </div>
              <h3
                class="text-sm font-bold text-gray-900 dark:text-white mb-1"
              >
                {{ notification.task?.title || 'Rappel de tâche' }}
              </h3>
              <p
                v-if="notification.task?.scheduledAt"
                class="text-xs text-gray-500 dark:text-gray-400"
              >
                {{ formatTime(notification.task.scheduledAt) }}
              </p>
            </div>
            <button
              v-if="notification.status === 'PENDING'"
              @click="cancelNotification(notification.id)"
              class="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X :size="18" />
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="flex flex-col items-center justify-center py-12">
        <div
          class="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3"
        >
          <Bell :size="32" class="text-gray-400 dark:text-gray-500" />
        </div>
        <p class="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
          Aucune notification
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400 text-center">
          Vous n'avez pas de notifications pour le moment
        </p>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <BottomNavigationBar
      :items="navItems"
      :fab="{ icon: Mic, onClick: () => router.push('/record') }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Bell, X, Mic, Home, Calendar, BarChart2, List, Loader2 } from "lucide-vue-next";
import BottomNavigationBar from "~/components/ui/BottomNavigationBar.vue";
import { useAuthStore } from "~/stores/auth";
import { useToast } from "~/composables/useToast";

const router = useRouter();
const authStore = useAuthStore();
const { success, error } = useToast();

const navItems = [
  { id: "home", icon: Home },
  { id: "tasks", icon: List },
  { id: "calendar", icon: Calendar },
  { id: "stats", icon: BarChart2 },
];

interface Notification {
  id: string;
  scheduledAt: string | Date;
  status: "PENDING" | "SENT" | "CANCELLED";
  task?: {
    id: string;
    title: string;
    scheduledAt: string | Date;
    priority?: string;
  };
}

const notifications = ref<Notification[]>([]);
const loading = ref(true);

const formatDate = (date: string | Date): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const notificationDate = new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate()
  );

  if (notificationDate.getTime() === today.getTime()) {
    return "Aujourd'hui";
  }

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (notificationDate.getTime() === yesterday.getTime()) {
    return "Hier";
  }

  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
  });
};

const formatTime = (date: string | Date): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const loadNotifications = async () => {
  try {
    loading.value = true;
    const config = useRuntimeConfig();
    const response = await fetch(
      `${config.public.apiBaseUrl}/notifications`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      notifications.value = (data.data || []).map((notif: any) => ({
        ...notif,
        scheduledAt: new Date(notif.scheduledAt),
        task: notif.task
          ? {
              ...notif.task,
              scheduledAt: new Date(notif.task.scheduledAt),
            }
          : undefined,
      }));
    } else {
      console.warn("[NotificationsPage] Failed to load notifications");
    }
  } catch (err) {
    console.error("[NotificationsPage] Error loading notifications:", err);
    error("Erreur lors du chargement des notifications");
  } finally {
    loading.value = false;
  }
};

const cancelNotification = async (id: string) => {
  try {
    const config = useRuntimeConfig();
    const response = await fetch(
      `${config.public.apiBaseUrl}/notifications/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    if (response.ok) {
      notifications.value = notifications.value.filter((n) => n.id !== id);
      success("Notification annulée");
    } else {
      error("Erreur lors de l'annulation");
    }
  } catch (err) {
    console.error("[NotificationsPage] Error cancelling notification:", err);
    error("Erreur lors de l'annulation");
  }
};

onMounted(async () => {
  authStore.initialize();

  if (!authStore.isLoggedIn) {
    router.push("/onboarding");
    return;
  }

  await loadNotifications();
});

useHead({
  title: "Notifications - Zeii",
});
</script>

