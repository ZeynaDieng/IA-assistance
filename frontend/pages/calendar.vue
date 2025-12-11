<template>
  <div
    class="min-h-screen flex flex-col bg-white dark:bg-[#0D0F33] transition-colors duration-300 pb-safe-bottom"
  >
    <!-- Calendar Grid -->
    <div class="flex-1 overflow-y-auto px-6 pt-6 pb-24">
      <CalendarGrid
        :tasks="tasks"
        :selected-date-tasks="selectedDateTasks"
        @day-selected="handleDaySelected"
        @month-changed="handleMonthChanged"
        @task-clicked="handleTaskClick"
      />
    </div>

    <!-- Bottom Navigation -->
    <BottomNavigationBar
      :items="navItems"
      :fab="{ icon: Mic, onClick: () => router.push('/chat') }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Mic, Home, Calendar, BarChart2, User, List } from "lucide-vue-next";
import Header from "~/components/features/Header.vue";
import CalendarGrid from "~/components/features/CalendarGrid.vue";
import BottomNavigationBar from "~/components/ui/BottomNavigationBar.vue";
import { useTasksStore } from "~/stores/tasks";
import { useToast } from "~/composables/useToast";

const router = useRouter();
const tasksStore = useTasksStore();

const navItems = [
  { id: "home", icon: Home },
  { id: "tasks", icon: List },
  { id: "calendar", icon: Calendar },
  { id: "stats", icon: BarChart2 },
];

// Use tasks from store, mapped to calendar format
const tasks = computed(() => {
  return tasksStore.tasks.map((task) => ({
    id: task.id,
    title: task.title,
    scheduledAt:
      task.scheduledAt instanceof Date
        ? task.scheduledAt
        : new Date(task.scheduledAt),
    priority: (task.priority?.toLowerCase() || "low") as
      | "high"
      | "medium"
      | "low"
      | "urgent",
    description: task.description,
  }));
});

const selectedDate = ref<Date | null>(null);
const selectedDateTasks = ref<any[]>([]);

const handleDaySelected = async (date: Date) => {
  console.log("[CalendarPage] Day selected:", date.toISOString().split("T")[0]);
  selectedDate.value = date;

  // Load tasks for the selected day (includes routine-generated tasks)
  try {
    const config = useRuntimeConfig();
    const { useAuthStore } = await import("~/stores/auth");
    const authStore = useAuthStore();

    const dateStr = date.toISOString().split("T")[0];
    const response = await fetch(
      `${config.public.apiBaseUrl}/calendar/day?date=${dateStr}`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to load day tasks");
    }

    const data = await response.json();
    // Filter out temporary routine tasks - only show saved tasks
    selectedDateTasks.value = (data.data?.tasks || [])
      .filter((task: any) => {
        // Exclude temporary routine tasks (they have IDs starting with "routine-task-")
        return !task.id?.toString().startsWith("routine-task-");
      })
      .map((task: any) => ({
        id: task.id,
        title: task.title,
        scheduledAt:
          task.scheduledAt instanceof Date
            ? task.scheduledAt
            : new Date(task.scheduledAt),
        priority: (task.priority?.toLowerCase() || "low") as
          | "high"
          | "medium"
          | "low"
          | "urgent",
        description: task.description,
        isFromRoutine: task.isFromRoutine || false,
      }));

    console.log(
      "[CalendarPage] Found",
      selectedDateTasks.value.length,
      "tasks for selected day (including routines)"
    );
    console.log(
      "[CalendarPage] Tasks details:",
      selectedDateTasks.value.map((t) => ({
        id: t.id,
        title: t.title,
        isFromRoutine: t.isFromRoutine,
      }))
    );
  } catch (error) {
    console.error("[CalendarPage] Error loading tasks for day:", error);
    // Fallback to store if API fails
    await tasksStore.loadTasks({ date: date.toISOString().split("T")[0] });
    const taskDate = new Date(date);
    taskDate.setHours(0, 0, 0, 0);
    selectedDateTasks.value = tasksStore.tasks.filter((task) => {
      const taskDateObj =
        task.scheduledAt instanceof Date
          ? task.scheduledAt
          : new Date(task.scheduledAt);
      return (
        taskDateObj.getDate() === taskDate.getDate() &&
        taskDateObj.getMonth() === taskDate.getMonth() &&
        taskDateObj.getFullYear() === taskDate.getFullYear()
      );
    });
  }
};

const handleMonthChanged = async (date: Date) => {
  console.log(
    "[CalendarPage] Month changed:",
    date.toISOString().split("T")[0]
  );

  // Load all tasks for the month (no date filter to show all tasks in the calendar)
  try {
    await tasksStore.loadTasks();
    console.log(
      "[CalendarPage] Loaded",
      tasksStore.tasks.length,
      "tasks for the month"
    );
  } catch (error) {
    console.error("[CalendarPage] Error loading tasks for month:", error);
  }
};

const handleTaskClick = (task: any) => {
  console.log("[CalendarPage] Task clicked:", task);
  console.log("[CalendarPage] Task ID:", task.id, "Type:", typeof task.id);
  console.log("[CalendarPage] Is from routine:", task.isFromRoutine);

  // Check if task has an ID
  if (!task.id) {
    console.warn("[CalendarPage] Task has no ID");
    const { error } = useToast();
    error("Impossible d'afficher les détails de cette tâche");
    return;
  }

  // Temporary routine tasks should not appear anymore (filtered out)
  // But keep this check as a safety measure
  if (typeof task.id === "string" && task.id.startsWith("routine-task-")) {
    console.warn(
      "[CalendarPage] Temporary routine task detected (should not happen)"
    );
    return;
  }

  // For all other tasks (saved tasks with real IDs), navigate to detail page
  console.log(
    "[CalendarPage] Navigating to task detail page:",
    `/tasks/${task.id}`
  );
  router.push(`/tasks/${task.id}`).catch((err) => {
    console.error("[CalendarPage] Navigation error:", err);
    const { error } = useToast();
    error("Erreur lors de la navigation vers les détails");
  });
};

onMounted(async () => {
  console.log("[CalendarPage] Loading tasks on mount");
  try {
    // Load all tasks to populate the calendar
    await tasksStore.loadTasks();
    console.log("[CalendarPage] Tasks loaded:", tasksStore.tasks.length);
  } catch (error) {
    console.error("[CalendarPage] Error loading tasks:", error);
  }
});

useHead({
  title: "Calendrier - Zeii",
});
</script>
