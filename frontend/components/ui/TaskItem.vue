<template>
  <div
    :class="[
      'group relative overflow-hidden p-4 rounded-2xl shadow-sm border transition-all press-animation',
      taskClasses.container,
    ]"
    @click="$emit('click')"
  >
    <div class="flex items-center gap-4 relative z-10">
      <button
        :class="[
          'w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all flex-shrink-0',
          'hover:scale-110 active:scale-95',
          taskClasses.checkbox,
        ]"
        @click.stop="$emit('toggle')"
        :aria-label="
          completed ? 'Marquer comme non complétée' : 'Marquer comme complétée'
        "
      >
        <Check v-if="completed" :size="16" class="text-white" />
      </button>
      <div class="flex-1">
        <h4 :class="['font-bold', taskClasses.title]">{{ title }}</h4>
        <p class="text-xs text-gray-400 dark:text-gray-500">
          {{ time }} • {{ duration }}
        </p>
      </div>
      <div
        :class="['w-2 h-2 rounded-full', taskClasses.priorityIndicator]"
      ></div>
    </div>

    <!-- Swipe Actions visual hint (exact React style) -->
  </div>
</template>

<script setup lang="ts">
import { Check, Trash2 } from "lucide-vue-next";
import { computed } from "vue";
import { useDarkMode } from "~/composables/useDarkMode";

interface Props {
  title: string;
  time: string;
  duration: string;
  priority?: "high" | "medium" | "low" | "urgent" | "normal";
  completed?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  priority: "low",
  completed: false,
});

const { isDark } = useDarkMode();

defineEmits<{
  toggle: [];
  click: [];
}>();

const taskClasses = computed(() => {
  const baseBg = isDark.value ? "bg-gray-800" : "bg-white";
  const baseBorder = isDark.value ? "border-gray-700" : "border-gray-50";
  const completedOpacity = props.completed ? "opacity-60" : "";

  return {
    container: `${baseBg} ${baseBorder} ${completedOpacity} ${
      props.completed ? "hover:opacity-70" : "hover:shadow-md"
    }`,
    checkbox: props.completed
      ? "bg-success border-success shadow-sm"
      : "border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary",
    title: props.completed
      ? "line-through text-gray-400 dark:text-gray-500"
      : "text-gray-800 dark:text-white",
    priorityIndicator:
      props.priority === "high" || props.priority === "urgent"
        ? "bg-red-500"
        : "bg-[#6C3EF1]",
  };
});
</script>
