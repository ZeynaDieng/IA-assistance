<template>
  <div
    class="fixed bottom-0 left-0 right-0 h-16 backdrop-blur-lg shadow-xl flex justify-around items-center border-t z-50 pb-safe-bottom bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700 transition-none"
  >
    <button
      v-for="tab in items"
      :key="tab.id"
      @click="handleTabClick(tab.id)"
      :class="[
        'p-2 rounded-xl transition-all',
        tab.id === currentTab
          ? 'bg-[#6C3EF1]/10 text-[#6C3EF1] dark:bg-[#6C3EF1]/20 dark:text-[#6C3EF1]'
          : 'text-gray-400 dark:text-gray-500',
      ]"
    >
      <component :is="tab.icon" :size="24" />
    </button>

    <!-- Floating FAB for quick add -->
    <button
      v-if="fab"
      @click="fab.onClick"
      class="absolute -top-7 w-14 h-14 bg-[#6C3EF1] dark:bg-[#6C3EF1] rounded-full shadow-colored-lg flex items-center justify-center text-white press-animation"
    >
      <component :is="fab.icon" :size="24" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import type { Component } from "vue";

interface Tab {
  id: string;
  icon: Component;
  route?: string; // Optional route for navigation
}

interface Props {
  activeTab?: string;
  items: Tab[];
  fab?: {
    icon: Component;
    onClick: () => void;
  };
}

const props = withDefaults(defineProps<Props>(), {});

const router = useRouter();
const route = useRoute();

// Navigation routes mapping
const routeMap: Record<string, string> = {
  home: "/home",
  tasks: "/tasks", // Add tasks route
  calendar: "/calendar",
  chat: "/chat",
  stats: "/stats",
  // profile: "/profile",
};

// Get current tab based on route
const currentTab = computed(() => {
  // If activeTab prop is provided, use it
  if (props.activeTab) return props.activeTab;

  // Otherwise, determine from current route
  const path = route.path;
  if (path === "/home" || path === "/") return "home";
  if (path.startsWith("/tasks")) return "tasks"; // Tasks pages
  if (path === "/calendar") return "calendar";
  if (path === "/chat") return "chat";
  if (path === "/stats") return "stats";
  //if (path === "/profile") return "profile";
  return "home";
});

const handleTabClick = (tabId: string) => {
  const targetRoute = routeMap[tabId];
  if (targetRoute && route.path !== targetRoute) {
    router.push(targetRoute);
  }
};
</script>
