<template>
  <nav
    :class="[
      'sticky top-0 z-40 flex items-center justify-between p-4',
      'bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg',
      'border-b border-gray-100 dark:border-gray-700',
      'safe-top',
      className
    ]"
  >
    <!-- Left Section -->
    <div class="flex items-center gap-3">
      <button
        v-if="showBack"
        class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        @click="handleBack"
      >
        <ChevronLeft :size="24" class="text-gray-600 dark:text-gray-300" />
      </button>
      
      <slot name="left">
        <h1 v-if="title" class="text-xl font-bold dark:text-white">{{ title }}</h1>
      </slot>
    </div>
    
    <!-- Right Section -->
    <div class="flex items-center gap-2">
      <slot name="right">
        <button
          v-if="showNotifications"
          class="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          @click="$emit('notifications')"
        >
          <Bell :size="20" class="text-gray-600 dark:text-gray-300" />
          <span
            v-if="notificationCount > 0"
            class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold"
          >
            {{ notificationCount > 9 ? '9+' : notificationCount }}
          </span>
        </button>
        
        <button
          v-if="showProfile"
          class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-white dark:border-gray-600 shadow-sm hover:scale-105 transition-transform"
          @click="$emit('profile')"
        >
          <User
            :size="20"
            class="text-gray-500 dark:text-gray-400"
          />
        </button>
      </slot>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ChevronLeft, Bell, User } from 'lucide-vue-next'

interface Props {
  title?: string
  showBack?: boolean
  showNotifications?: boolean
  showProfile?: boolean
  notificationCount?: number
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  showBack: false,
  showNotifications: true,
  showProfile: true,
  notificationCount: 0
})

defineEmits<{
  back: []
  notifications: []
  profile: []
}>()

const router = useRouter()

const handleBack = () => {
  router.back()
}
</script>

