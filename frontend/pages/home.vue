<template>
  <div
    class="min-h-screen flex flex-col bg-white dark:bg-[#0D0F33] transition-colors duration-300 pb-safe-bottom"
  >
    <!-- Header -->
    <div class="px-4 pt-safe-top pb-6">
      <div class="flex items-center justify-between mb-6">
        <div class="flex flex-col">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {{ getGreeting() }}
          </p>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ userName }}
          </h1>
        </div>
        <div class="flex items-center gap-2">
          <button
            class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95 transition-all"
            @click="router.push('/settings')"
            aria-label="Paramètres"
          >
            <Settings :size="18" class="text-gray-600 dark:text-gray-400" />
          </button>
          <button
            class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95 transition-all"
            @click="router.push('/profile')"
            aria-label="Profil"
          >
            <User :size="18" class="text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col px-6 pt-8 pb-24">
      <!-- Chat Assistant Button -->
      <div class="flex flex-col items-center justify-center mb-12">
        <button
          @click="router.push('/chat')"
          class="group relative w-40 h-40 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-105 active:scale-95"
        >
          <!-- Wave Rings -->
          <div
            class="absolute inset-0 bg-primary/30 rounded-full animate-wave-1"
          />
          <div
            class="absolute inset-0 bg-primary/20 rounded-full animate-wave-2"
          />
          <div
            class="absolute inset-0 bg-primary/10 rounded-full animate-wave-3"
          />
          <!-- Background Circle -->
          <div
            class="absolute inset-0 bg-gradient-to-br from-primary to-primary-darker rounded-full shadow-lg z-10"
          />
          <!-- Icon -->
          <MessageCircle :size="56" class="relative z-20 text-white" />
        </button>

        <p
          class="mt-6 text-center text-gray-600 dark:text-gray-300 font-medium"
        >
          Parle avec ton assistant IA
        </p>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-2 gap-4 mb-8">
        <Card
          variant="default"
          class="cursor-pointer hover:shadow-md transition-shadow"
          @click="router.push('/tasks')"
        >
          <div class="text-success mb-3">
            <Check :size="24" />
          </div>
          <div class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {{ completionRate }}%
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            Tâches complétées
          </div>
        </Card>

        <Card
          variant="default"
          class="cursor-pointer hover:shadow-md transition-shadow"
          @click="router.push('/stats')"
        >
          <div class="text-primary mb-3">
            <BarChart2 :size="24" />
          </div>
          <div class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {{ todayTasksCount }}
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            Tâches aujourd'hui
          </div>
        </Card>
      </div>

      <!-- Quick Access to Tasks -->
      <Button
        variant="primary"
        size="lg"
        :icon="Check"
        class="w-full"
        @click="router.push('/tasks')"
      >
        Voir mes tâches
      </Button>
    </div>

    <!-- Bottom Navigation -->
    <BottomNavigationBar
      :items="navItems"
      :fab="{ icon: MessageCircle, onClick: () => router.push('/chat') }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import {
  Mic,
  Home,
  Calendar,
  BarChart2,
  User,
  Check,
  List,
  Settings,
  MessageCircle,
} from "lucide-vue-next";
import Card from "~/components/ui/Card.vue";
import Button from "~/components/ui/Button.vue";
import BottomNavigationBar from "~/components/ui/BottomNavigationBar.vue";
import { useAuthStore } from "~/stores/auth";
import { useTasksStore } from "~/stores/tasks";

const router = useRouter();
const authStore = useAuthStore();
const tasksStore = useTasksStore();

const userName = computed(() => {
  const user = authStore.currentUser;
  if (user?.firstName && user?.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  return user?.phoneNumber?.slice(-4) || "Utilisateur";
});

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Bonjour";
  if (hour < 18) return "Bon après-midi";
  return "Bonsoir";
};

const navItems = [
  { id: "home", icon: Home },
  { id: "tasks", icon: List },
  { id: "calendar", icon: Calendar },
  { id: "chat", icon: MessageCircle },
  { id: "stats", icon: BarChart2 },
  //{ id: "profile", icon: User },
];

// Dynamic stats
const completionRate = computed(() => {
  if (tasksStore.tasks.length === 0) return 0;
  const completed = tasksStore.tasks.filter(
    (t) => t.status === "COMPLETED"
  ).length;
  return Math.round((completed / tasksStore.tasks.length) * 100);
});

const todayTasksCount = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return tasksStore.tasks.filter((task) => {
    const taskDate = new Date(task.scheduledAt);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() === today.getTime();
  }).length;
});

// Initialize auth on mount and load tasks
onMounted(async () => {
  authStore.initialize();

  // Redirect to auth if not logged in
  if (!authStore.isLoggedIn) {
    router.push("/onboarding");
    return;
  }

  // Load tasks for stats
  try {
    await tasksStore.loadTasks();
  } catch (error) {
    console.error("Error loading tasks:", error);
  }
});

useHead({
  title: "Accueil - Zeii",
});
</script>

<style scoped>
@keyframes wave {
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  100% {
    transform: scale(1.6);
    opacity: 0;
  }
}

.animate-wave-1 {
  animation: wave 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-wave-2 {
  animation: wave 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  animation-delay: 0.4s;
}

.animate-wave-3 {
  animation: wave 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  animation-delay: 0.8s;
}
</style>
