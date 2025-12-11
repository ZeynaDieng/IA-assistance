<template>
  <div>
    <div class="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
      <div :class="['bg-primary h-2 rounded-full transition-all duration-500']" :style="{ width: `${percentage}%`, boxShadow: '0 0 10px rgba(108, 62, 241, 0.5)' }"></div>
    </div>
    <p v-if="showLabel" class="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
      {{ percentage }}%
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  percentage: number
  showLabel?: boolean
}

withDefaults(defineProps<Props>(), {
  showLabel: false
})
</script>

