<template>
  <!-- Responsive Container -->
  <div
    class="w-full min-h-screen flex flex-col font-sans transition-colors duration-300"
  >
    <!-- Header - Conditionally shown based on route -->
    <Header
      v-if="shouldShowHeader"
      :title="headerTitle"
      :subtitle="headerSubtitle"
      :show-back="headerShowBack"
      :show-notifications="headerShowNotifications"
      :notification-count="headerNotificationCount"
      @back="handleHeaderBack"
      @notifications="handleHeaderNotifications"
      @profile="handleHeaderProfile"
    />

    <!-- Page Content -->
    <div class="flex-1 overflow-hidden w-full">
      <NuxtPage />
    </div>

    <!-- Toast Notification -->
    <Toast
      v-model="toastState.visible"
      :message="toastState.message"
      :variant="toastState.variant"
      :duration="toastState.duration"
    />

    <!-- Confirm Dialog -->
    <ConfirmDialog
      :visible="confirmState.visible"
      :message="confirmState.message"
      :title="confirmState.title"
      :confirm-text="confirmState.confirmText"
      :cancel-text="confirmState.cancelText"
      :variant="confirmState.variant"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, defineAsyncComponent, onMounted } from "vue";
import { useDarkMode } from "~/composables/useDarkMode";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "~/composables/useToast";
import { useConfirm } from "~/composables/useConfirm";

// Lazy load components for better performance
const Header = defineAsyncComponent(
  () => import("~/components/features/Header.vue")
);
const Toast = defineAsyncComponent(() => import("~/components/ui/Toast.vue"));
const ConfirmDialog = defineAsyncComponent(
  () => import("~/components/ui/ConfirmDialog.vue")
);

// Initialize dark mode to ensure it's applied
const { isDark } = useDarkMode();

// Ensure dark mode is applied on mount
onMounted(() => {
  if (typeof document !== "undefined") {
    // Force check and apply dark mode
    const html = document.documentElement;
    if (isDark.value && !html.classList.contains("dark")) {
      html.classList.add("dark");
    } else if (!isDark.value && html.classList.contains("dark")) {
      html.classList.remove("dark");
    }
  }
});

const route = useRoute();
const router = useRouter();

// Toast state - shared across all pages
const { toastState } = useToast();

// Confirm dialog state - shared across all pages
const { confirmState, handleConfirm, handleCancel } = useConfirm();

// Pages that should NOT show the header
const pagesWithoutHeader = [
  "/onboarding",
  "/auth",
  "/auth/login",
  "/auth/register",
  "/auth/otp",
  "/auth/pin",
  "/record",
  "/processing",
  "/transcription",
  "/home", // Home has its own custom header
  "/chat", // Chat has its own custom header
];

// Computed properties for header configuration
const shouldShowHeader = computed(() => {
  const currentPath = route.path;
  return !pagesWithoutHeader.some((path) => currentPath.startsWith(path));
});

const headerTitle = computed(() => {
  // Get title from route meta first
  if (route.meta?.headerTitle) {
    return route.meta.headerTitle as string;
  }

  // Dynamic title for tasks page
  if (route.path === "/tasks") {
    return new Date().toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  }

  // Default titles based on route
  const routeTitles: Record<string, string> = {
    "/calendar": "Calendrier",
    "/stats": "Statistiques",
    "/profile": "Profil",
    "/notifications": "Notifications",
    "/settings": "Paramètres",
    "/planning": "Planning Généré",
    "/routines": "Routines",
  };

  // Check if route matches a pattern (e.g., /tasks/:id)
  if (route.path.startsWith("/tasks/")) {
    return (route.meta?.title as string) || "Détail de la tâche";
  }

  return routeTitles[route.path] || (route.meta?.title as string) || "";
});

const headerSubtitle = computed(() => {
  return (route.meta?.headerSubtitle as string) || "";
});

const headerShowBack = computed(() => {
  // Explicitly set to false
  if (route.meta?.headerShowBack === false) {
    return false;
  }
  // Explicitly set to true
  if (route.meta?.headerShowBack === true) {
    return true;
  }
  // Auto-detect based on route
  return shouldBackButton();
});

const headerShowNotifications = computed(() => {
  return route.meta?.headerShowNotifications !== false;
});

const headerNotificationCount = computed(() => {
  return (route.meta?.headerNotificationCount as number) || 0;
});

// Helper to determine if back button should be shown
function shouldBackButton() {
  const currentPath = route.path;
  // Show back on detail pages, planning, etc.
  return (
    currentPath.includes("/tasks/") ||
    currentPath === "/planning" ||
    currentPath === "/transcription" ||
    route.meta?.headerShowBack === true
  );
}

// Event handlers
const handleHeaderBack = async () => {
  // Use smooth navigation if available
  const { useNavigation } = await import("~/composables/useNavigation");
  const { goBack } = useNavigation();
  await goBack();
};

const handleHeaderNotifications = () => {
  router.push("/notifications");
};

const handleHeaderProfile = () => {
  router.push("/profile");
};
</script>

<style scoped>
/* Ensure full height */
:deep(.h-full) {
  min-height: 100vh;
  height: 100%;
}
</style>
