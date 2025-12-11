<template>
  <div
    class="min-h-screen flex flex-col bg-white dark:bg-[#0D0F33] transition-colors duration-300 pb-safe-bottom"
  >
    <!-- Content -->
    <div class="flex-1 overflow-y-auto px-6 pt-6 pb-24">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">
          Statistiques
        </h1>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <Loader2 :size="32" class="animate-spin text-primary" />
      </div>

      <!-- Stats Content -->
      <div v-else class="space-y-6">
        <!-- Overview Cards -->
        <div class="grid grid-cols-2 gap-4">
          <div
            class="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700"
          >
            <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {{ statistics.completedTasks || completedTasksCount }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Complétées</p>
          </div>

          <div
            class="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700"
          >
            <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {{ statistics.currentStreak || currentStreak }}j
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Série</p>
          </div>

          <div
            class="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700"
          >
            <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {{ statistics.pendingTasks || 0 }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">En attente</p>
          </div>

          <div
            class="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700"
          >
            <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {{ statistics.completionRate || 0 }}%
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Complétion</p>
          </div>
        </div>

        <!-- Weekly Progress -->
        <div
          class="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700"
        >
          <h3 class="text-base font-bold text-gray-900 dark:text-white mb-4">
            Cette semaine
          </h3>
          <div class="space-y-4">
            <div
              v-for="day in weekDays"
              :key="day.name"
              class="flex items-center gap-3"
            >
              <span
                class="text-sm text-gray-600 dark:text-gray-400 w-10 flex-shrink-0"
              >
                {{ day.name }}
              </span>
              <div
                class="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden"
              >
                <div
                  class="bg-primary h-1.5 rounded-full transition-all duration-500"
                  :style="{ width: `${day.progress}%` }"
                />
              </div>
              <span
                class="text-sm font-medium text-gray-900 dark:text-white w-10 text-right"
              >
                {{ day.progress }}%
              </span>
            </div>
          </div>
        </div>

        <!-- Productivity Score -->
        <div
          class="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700"
        >
          <h3 class="text-base font-bold text-gray-900 dark:text-white mb-6">
            Productivité
          </h3>
          <div class="flex flex-col items-center">
            <div class="relative w-28 h-28 mb-4">
              <svg class="transform -rotate-90 w-28 h-28">
                <circle
                  cx="56"
                  cy="56"
                  r="50"
                  stroke="currentColor"
                  stroke-width="6"
                  fill="transparent"
                  class="text-gray-100 dark:text-gray-700"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="50"
                  stroke="currentColor"
                  stroke-width="6"
                  fill="transparent"
                  stroke-dasharray="314"
                  :stroke-dashoffset="314 - (314 * productivityScore) / 100"
                  class="text-primary transition-all duration-700"
                  stroke-linecap="round"
                />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center">
                  <span
                    class="text-2xl font-bold text-gray-900 dark:text-white block"
                    >{{ productivityScore }}</span
                  >
                </div>
              </div>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 text-center">
              {{
                productivityScore >= 80
                  ? "Excellente productivité"
                  : productivityScore >= 60
                  ? "Bonne productivité"
                  : productivityScore >= 40
                  ? "Productivité moyenne"
                  : "Continuez vos efforts"
              }}
            </p>
          </div>
        </div>

        <!-- Priority Distribution -->
        <div
          class="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700"
        >
          <h3 class="text-base font-bold text-gray-900 dark:text-white mb-4">
            Par priorité
          </h3>
          <div class="space-y-3">
            <div
              v-for="category in categories"
              :key="category.name"
              class="flex items-center justify-between"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-2 h-2 rounded-full flex-shrink-0"
                  :style="{ backgroundColor: category.color }"
                />
                <span class="text-sm text-gray-900 dark:text-white">
                  {{ category.name }}
                </span>
              </div>
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                {{ category.count }}
              </span>
            </div>
          </div>
        </div>
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
import { ref, computed, onMounted } from "vue";
import { Mic, Home, Calendar, BarChart2, List, Loader2 } from "lucide-vue-next";
import BottomNavigationBar from "~/components/ui/BottomNavigationBar.vue";
import { useAuthStore } from "~/stores/auth";
import { useTasksStore } from "~/stores/tasks";

const router = useRouter();
const authStore = useAuthStore();
const tasksStore = useTasksStore();

const navItems = [
  { id: "home", icon: Home },
  { id: "tasks", icon: List },
  { id: "calendar", icon: Calendar },
  { id: "stats", icon: BarChart2 },
];

// Statistics from API
const statistics = ref<any>({
  totalTasks: 0,
  completedTasks: 0,
  pendingTasks: 0,
  totalPlannings: 0,
  totalRecordings: 0,
  completionRate: 0,
  currentStreak: 0,
});

const loading = ref(true);

// Fallback stats computed from tasks store
const completedTasksCount = computed(() => {
  return tasksStore.tasks.filter((t) => t.status === "COMPLETED").length;
});

const currentStreak = computed(() => {
  // Calculate streak of consecutive days with completed tasks
  const completedDates = tasksStore.tasks
    .filter((t) => t.status === "COMPLETED" && t.completedAt)
    .map((t) => {
      const date = new Date(t.completedAt!);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    })
    .filter((date, index, arr) => arr.indexOf(date) === index) // Unique dates
    .sort((a, b) => b - a); // Most recent first

  if (completedDates.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let currentDate = today.getTime();

  for (const completedDate of completedDates) {
    if (completedDate === currentDate) {
      streak++;
      currentDate -= 24 * 60 * 60 * 1000; // Previous day
    } else if (completedDate < currentDate) {
      break;
    }
  }

  return streak;
});

const weekDays = computed(() => {
  const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + 1); // Monday
  weekStart.setHours(0, 0, 0, 0);

  return days.map((name, index) => {
    const dayDate = new Date(weekStart);
    dayDate.setDate(weekStart.getDate() + index);

    const dayTasks = tasksStore.tasks.filter((task) => {
      const taskDate = new Date(task.scheduledAt);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === dayDate.getTime();
    });

    const completed = dayTasks.filter((t) => t.status === "COMPLETED").length;
    const total = dayTasks.length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { name, progress };
  });
});

const totalTasks = computed(() => {
  return tasksStore.tasks.length || statistics.value.totalTasks || 1;
});

const categories = computed(() => {
  // Group tasks by priority/type
  const priorityCounts: Record<string, number> = {
    URGENT: 0,
    HIGH: 0,
    MEDIUM: 0,
    LOW: 0,
  };

  tasksStore.tasks.forEach((task) => {
    const priority = task.priority?.toUpperCase() || "MEDIUM";
    priorityCounts[priority] = (priorityCounts[priority] || 0) + 1;
  });

  return [
    {
      name: "Urgentes",
      count: priorityCounts["URGENT"] || 0,
      color: "#EF4444",
    },
    {
      name: "Importantes",
      count: priorityCounts["HIGH"] || 0,
      color: "#F59E0B",
    },
    {
      name: "Normales",
      count: priorityCounts["MEDIUM"] || 0,
      color: "#6C3EF1",
    },
    {
      name: "Basses",
      count: priorityCounts["LOW"] || 0,
      color: "#4ADE80",
    },
  ].filter((cat) => cat.count > 0);
});

const productivityScore = computed(() => {
  const completionRate =
    statistics.value.completionRate || tasksStore.completionRate || 0;
  const streak = statistics.value.currentStreak || currentStreak.value || 0;
  const consistencyBonus = Math.min(streak * 2, 20); // Up to 20 points for streaks

  return Math.min(completionRate + consistencyBonus, 100);
});

// Load statistics from API
const loadStatistics = async () => {
  try {
    const config = useRuntimeConfig();
    const response = await fetch(
      `${config.public.apiBaseUrl}/users/statistics`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      statistics.value = data.data || data;
      console.log("[StatsPage] Loaded statistics:", statistics.value);
    } else {
      console.warn("[StatsPage] Failed to load statistics, using fallback");
    }
  } catch (error) {
    console.error("[StatsPage] Error loading statistics:", error);
  }
};

onMounted(async () => {
  authStore.initialize();

  // Redirect to auth if not logged in
  if (!authStore.isLoggedIn) {
    router.push("/onboarding");
    return;
  }

  loading.value = true;

  try {
    // Load tasks and statistics in parallel
    await Promise.all([tasksStore.loadTasks(), loadStatistics()]);
  } catch (error) {
    console.error("Error loading stats:", error);
  } finally {
    loading.value = false;
  }
});

useHead({
  title: "Statistiques - Zeii",
});
</script>

<style scoped>
svg {
  width: 128px;
  height: 128px;
}

/* Smooth progress bar animation */
@keyframes progress {
  from {
    width: 0%;
  }
}

.transition-all {
  animation: progress 0.7s ease-out;
}
</style>
