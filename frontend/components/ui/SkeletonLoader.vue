<template>
  <div :class="['animate-pulse', className]">
    <div class="bg-gray-200 dark:bg-gray-700 rounded" :style="{ width: width, height: height }"></div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  width?: string
  height?: string
  className?: string
}

withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '20px',
  className: ''
})
</script>

