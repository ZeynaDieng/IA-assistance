<template>
  <div
    class="min-h-screen flex flex-col bg-white dark:bg-[#0D0F33] transition-colors duration-300 pb-safe-bottom"
  >
    <!-- Content -->
    <div class="flex-1 overflow-y-auto px-6 pt-6 pb-24">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">Profil</h1>
      </div>

      <!-- User Info -->
      <div class="flex flex-col items-center mb-8">
        <div
          class="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3"
        >
          <User :size="40" class="text-gray-400 dark:text-gray-500" />
        </div>
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-1">
          {{ userName }}
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ authStore.currentUser?.phoneNumber || "" }}
        </p>
        <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Membre depuis {{ memberSince }}
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div
          class="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700"
        >
          <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {{ completedTasksCount }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Complétées</p>
        </div>

        <div
          class="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700"
        >
          <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {{ currentStreak }}j
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Série</p>
        </div>
      </div>

      <!-- Settings List -->
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden mb-6"
      >
        <!-- Preferences -->
        <button
          class="w-full p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          @click="router.push('/settings')"
        >
          <span class="text-sm font-medium text-gray-900 dark:text-white"
            >Préférences</span
          >
          <ChevronRight :size="18" class="text-gray-400 dark:text-gray-500" />
        </button>

        <!-- Dark Mode Toggle -->
        <div
          class="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          @click="toggleDarkMode"
        >
          <span class="text-sm font-medium text-gray-900 dark:text-white"
            >Mode {{ isDark ? "Clair" : "Sombre" }}</span
          >
          <div
            :class="[
              'w-10 h-6 rounded-full p-1 transition-colors',
              isDark ? 'bg-primary' : 'bg-gray-300',
            ]"
          >
            <div
              :class="[
                'w-4 h-4 rounded-full bg-white shadow-sm transition-transform',
                isDark ? 'translate-x-4' : '',
              ]"
            />
          </div>
        </div>

        <!-- Notifications -->
        <button
          class="w-full p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          @click="router.push('/notifications')"
        >
          <span class="text-sm font-medium text-gray-900 dark:text-white"
            >Notifications</span
          >
          <ChevronRight :size="18" class="text-gray-400 dark:text-gray-500" />
        </button>
      </div>

      <!-- Logout -->
      <button
        class="w-full p-4 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-colors"
        @click="handleLogout"
      >
        Déconnexion
      </button>
    </div>

    <!-- Bottom Navigation -->
    <BottomNavigationBar
      :items="navItems"
      :fab="{ icon: Mic, onClick: () => router.push('/record') }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { ChevronRight, Mic, Home, Calendar, BarChart2, User, List } from "lucide-vue-next";
import { useConfirm } from "~/composables/useConfirm";
import BottomNavigationBar from "~/components/ui/BottomNavigationBar.vue";
import { useAuthStore } from "~/stores/auth";
import { useTasksStore } from "~/stores/tasks";
import { useDarkMode } from "~/composables/useDarkMode";

const router = useRouter();
const authStore = useAuthStore();
const tasksStore = useTasksStore();

// Use global dark mode composable
const { isDark, toggleDark } = useDarkMode();

// Dynamic stats
const completedTasksCount = computed(() => {
  return tasksStore.tasks.filter((t) => t.status === "COMPLETED").length;
});

const currentStreak = computed(() => {
  const completedDates = tasksStore.tasks
    .filter((t) => t.status === "COMPLETED" && t.completedAt)
    .map((t) => {
      const date = new Date(t.completedAt!);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    })
    .filter((date, index, arr) => arr.indexOf(date) === index)
    .sort((a, b) => b - a);

  if (completedDates.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let currentDate = today.getTime();

  for (const completedDate of completedDates) {
    if (completedDate === currentDate) {
      streak++;
      currentDate -= 24 * 60 * 60 * 1000;
    } else if (completedDate < currentDate) {
      break;
    }
  }

  return streak;
});

const navItems = [
  { id: "home", icon: Home },
  { id: "tasks", icon: List },
  { id: "calendar", icon: Calendar },
  { id: "stats", icon: BarChart2 },
];

const userName = computed(() => {
  const user = authStore.currentUser;
  if (user?.firstName && user?.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  return user?.phoneNumber?.slice(-4) || "Utilisateur";
});

const memberSince = computed(() => {
  if (!authStore.currentUser?.createdAt) return "2023";
  const date = new Date(authStore.currentUser.createdAt);
  return date.toLocaleDateString("fr-FR", { year: "numeric", month: "long" });
});

const toggleDarkMode = () => {
  toggleDark()
}

const handleLogout = async () => {
  const { confirm } = useConfirm();
  const confirmed = await confirm({
    message: "Êtes-vous sûr de vouloir vous déconnecter ?",
    title: "Déconnexion",
    variant: "warning",
  });

  if (confirmed) {
    authStore.logout();
    router.push("/onboarding");
  }
};

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
    console.error("Error loading tasks for profile:", error);
  }
});

useHead({
  title: "Profil - Zeii",
});
</script>
