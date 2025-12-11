<template>
  <div
    class="min-h-screen flex flex-col bg-white dark:bg-[#0D0F33] transition-colors duration-300 pb-safe-bottom"
  >
    <!-- Content -->
    <div class="flex-1 overflow-y-auto px-6 pt-6 pb-24">
      <!-- Progress Section -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-3">
            <div
              class="w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center"
            >
              <span class="text-lg font-bold text-primary">
                {{ completionPercentage }}%
              </span>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Progression
              </p>
              <p class="text-xs text-gray-400 dark:text-gray-500">
                {{ completedTasks }} / {{ tasks.length }} tâches
              </p>
            </div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div
          class="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden"
        >
          <div
            class="bg-primary h-2 rounded-full transition-all duration-500"
            :style="{ width: `${completionPercentage}%` }"
          />
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="mb-6">
        <div class="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          <button
            v-for="filter in filters"
            :key="filter.id"
            :class="[
              'px-5 py-2.5 rounded-2xl text-sm font-medium transition-all whitespace-nowrap flex-shrink-0',
              activeFilter === filter.id
                ? 'bg-primary text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
            ]"
            @click="activeFilter = filter.id"
          >
            {{ filter.label }}
          </button>
        </div>
      </div>

      <!-- Tasks List -->
      <div class="space-y-3">
        <SwipeableCard
          v-for="task in filteredTasks"
          :key="task.id"
          @swipe-right="handleSwipeRight(task)"
          @swipe-left="handleSwipeLeft(task)"
        >
          <TaskItem
            :title="task.title"
            :time="formatTime(task.scheduledAt)"
            :duration="`${task.duration}min`"
            :priority="task.priority"
            :completed="task.completed"
            @click="router.push(`/tasks/${task.id}`)"
            @toggle="handleToggle(task)"
          />
        </SwipeableCard>

        <!-- Empty State -->
        <div
          v-if="filteredTasks.length === 0"
          class="flex flex-col items-center justify-center py-16 text-center"
        >
          <div
            class="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4"
          >
            <Calendar :size="40" class="text-gray-400 dark:text-gray-600" />
          </div>
          <p class="text-gray-600 dark:text-gray-300 font-medium mb-1">
            {{
              activeFilter === "completed"
                ? "Aucune tâche complétée"
                : "Aucune tâche pour le moment"
            }}
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{
              activeFilter === "completed"
                ? "Complétez vos tâches pour les voir ici"
                : "Créez votre première tâche en parlant"
            }}
          </p>
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
import { ref, computed, onMounted, watchEffect } from "vue";
import { useRoute } from "vue-router";
import {
  Mic,
  Home,
  Calendar,
  BarChart2,
  User,
  List,
  Calendar as CalendarIcon,
} from "lucide-vue-next";
// Header is handled by default layout
import TaskItem from "~/components/ui/TaskItem.vue";
import ProgressBar from "~/components/ui/ProgressBar.vue";
import BottomNavigationBar from "~/components/ui/BottomNavigationBar.vue";
import SwipeableCard from "~/components/features/SwipeableCard.vue";
import { useTasksStore } from "~/stores/tasks";

const router = useRouter();
const route = useRoute();
const tasksStore = useTasksStore();

const activeFilter = ref("all");

const navItems = [
  { id: "home", icon: Home },
  { id: "tasks", icon: List },
  { id: "calendar", icon: Calendar },
  { id: "stats", icon: BarChart2 },
  //{ id: "profile", icon: User },
];

const filters = [
  { id: "all", label: "Tous" },
  { id: "today", label: "Aujourd'hui" },
  { id: "week", label: "Cette semaine" },
  { id: "completed", label: "Complétées" },
];

const tasks = computed(() => {
  // Map tasks from store to match the expected format
  return tasksStore.tasks.map((task) => ({
    id: task.id,
    title: task.title,
    scheduledAt:
      task.scheduledAt instanceof Date
        ? task.scheduledAt
        : new Date(task.scheduledAt),
    duration: task.duration,
    priority: task.priority?.toLowerCase() || "normal",
    completed: task.status === "COMPLETED",
  }));
});

const currentDate = computed(() => {
  return new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
});

const formattedDate = computed(() => {
  return new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
});

const remainingTasks = computed(() => {
  return tasks.value.filter((t) => !t.completed).length;
});

// Update route meta for header (handled by layout)
watchEffect(() => {
  if (!route.meta) {
    route.meta = {};
  }
  if (route.path === "/tasks") {
    route.meta.headerTitle = currentDate.value;
    route.meta.headerSubtitle = `${remainingTasks.value} tâche${
      remainingTasks.value > 1 ? "s" : ""
    } restante${remainingTasks.value > 1 ? "s" : ""}`;
    route.meta.headerShowBack = false;
  }
});

const completedTasks = computed(() => {
  return tasks.value.filter((t) => t.completed).length;
});

const completionPercentage = computed(() => {
  if (tasks.value.length === 0) return 0;
  return Math.round((completedTasks.value / tasks.value.length) * 100);
});

const filteredTasks = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let filtered = [...tasks.value];

  switch (activeFilter.value) {
    case "today":
      filtered = filtered.filter((task) => {
        const taskDate = new Date(task.scheduledAt);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === today.getTime();
      });
      break;
    case "week":
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay() + 1);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      filtered = filtered.filter((task) => {
        const taskDate = new Date(task.scheduledAt);
        return taskDate >= weekStart && taskDate <= weekEnd;
      });
      break;
    case "completed":
      filtered = filtered.filter((task) => task.completed);
      break;
  }

  return filtered.sort((a, b) => {
    return (
      new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    );
  });
});

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const handleToggle = async (task: any) => {
  try {
    if (task.completed) {
      // If already completed, we might want to uncomplete it
      // For now, we'll just complete it if not completed
      return;
    }
    // Complete the task via the store
    await tasksStore.completeTask(task.id);
    // Reload tasks to get updated state
    await tasksStore.loadTasks();
  } catch (error) {
    console.error("[TasksPage] Error toggling task:", error);
  }
};

const handleSwipeRight = (task: any) => {
  // Swipe right = Complete
  if (!task.completed) {
    handleToggle(task);
  }
};

const handleSwipeLeft = (task: any) => {
  // Swipe left = Delete or Postpone
  // TODO: Show action sheet
  console.log("Swipe left on task:", task.id);
};

onMounted(async () => {
  // Load tasks from backend
  console.log("[TasksPage] Loading tasks on mount");
  try {
    // Try loading all tasks first to see if any exist
    await tasksStore.loadTasks();
    console.log("[TasksPage] All tasks loaded:", tasksStore.tasks.length);

    // If no tasks, try with today's date filter
    if (tasksStore.tasks.length === 0) {
      console.log(
        "[TasksPage] No tasks found, trying with today's date filter"
      );
      const today = new Date().toISOString().split("T")[0];
      console.log("[TasksPage] Today date:", today);
      await tasksStore.loadTasks({ date: today });
      console.log(
        "[TasksPage] Tasks after date filter:",
        tasksStore.tasks.length
      );
    }
  } catch (error) {
    console.error("[TasksPage] Error loading tasks:", error);
  }
});

useHead({
  title: "Mes Tâches - Zeii",
});
</script>
