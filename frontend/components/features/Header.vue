<template>
  <header
    :class="[
      'px-4 flex justify-between items-center',
      'border-b border-gray-100 dark:border-gray-700',
      'bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg',
      'sticky top-0 z-40',
      'pt-[calc(env(safe-area-inset-top)+0.75rem)] pb-3'
    ]"
  >
    <!-- Left Section -->
    <div class="flex items-center gap-4">
      <button
        v-if="showBack"
        class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors press-animation"
        @click="handleBack"
      >
        <ChevronLeft :size="24" class="text-gray-600 dark:text-gray-300" />
      </button>
      
      <div v-if="title" class="flex flex-col">
        <h1 class="text-xl font-bold dark:text-white">{{ title }}</h1>
        <p v-if="subtitle" class="text-sm text-gray-400 dark:text-gray-500">{{ subtitle }}</p>
      </div>
    </div>
    
    <!-- Right Section -->
    <div class="flex items-center gap-3">
      <!-- Notifications Badge -->
      <button
        v-if="showNotifications"
        class="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        @click="handleNotifications"
      >
        <Bell :size="20" class="text-gray-600 dark:text-gray-300" />
        <span
          v-if="notificationCount > 0"
          class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold"
        >
          {{ notificationCount > 9 ? '9+' : notificationCount }}
        </span>
      </button>
      
      <!-- Avatar -->
      <button
        class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95 transition-all"
        @click="handleProfile"
      >
        <User
          :size="18"
          class="text-gray-600 dark:text-gray-400"
        />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ChevronLeft, Bell, User } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'

interface Props {
  title?: string
  subtitle?: string
  showBack?: boolean
  showNotifications?: boolean
  notificationCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  showBack: false,
  showNotifications: true,
  notificationCount: 0
})

const emit = defineEmits<{
  back: []
  notifications: []
  profile: []
}>()

const authStore = useAuthStore()

const router = useRouter()

const handleBack = () => {
  emit('back')
  router.back()
}

const handleNotifications = () => {
  emit('notifications')
  router.push('/notifications')
}

const handleProfile = () => {
  emit('profile')
  router.push('/profile')
}
</script>

