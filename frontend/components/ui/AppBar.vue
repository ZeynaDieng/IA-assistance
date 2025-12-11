<template>
  <header
    :class="[
      'px-4 py-3 flex items-center justify-between',
      'bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg',
      'border-b border-gray-100 dark:border-gray-700',
      'sticky top-0 z-40 safe-top',
      elevated && 'shadow-sm'
    ]"
  >
    <!-- Left Section -->
    <div class="flex items-center gap-3">
      <button
        v-if="showBack"
        class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors press-animation"
        @click="handleBack"
      >
        <ChevronLeft :size="24" class="text-gray-600 dark:text-gray-300" />
      </button>

      <slot name="leading">
        <div v-if="title" class="flex flex-col">
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ title }}
          </h1>
          <p v-if="subtitle" class="text-sm text-gray-500 dark:text-gray-400">
            {{ subtitle }}
          </p>
        </div>
      </slot>
    </div>

    <!-- Right Section -->
    <div class="flex items-center gap-2">
      <slot name="actions">
        <button
          v-if="showNotifications"
          class="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors press-animation"
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

        <button
          v-if="showProfile"
          class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-white dark:border-gray-600 shadow-sm hover:scale-105 transition-transform press-animation"
          @click="handleProfile"
        >
          <User :size="20" class="text-gray-500 dark:text-gray-400" />
        </button>
      </slot>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ChevronLeft, Bell, User } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

interface Props {
  title?: string
  subtitle?: string
  showBack?: boolean
  showNotifications?: boolean
  showProfile?: boolean
  notificationCount?: number
  elevated?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showBack: false,
  showNotifications: true,
  showProfile: true,
  notificationCount: 0,
  elevated: true
})

const emit = defineEmits<{
  back: []
  notifications: []
  profile: []
}>()

const router = useRouter()

const handleBack = async () => {
  emit('back')
  // Use smooth navigation if available
  try {
    const { useNavigation } = await import('~/composables/useNavigation')
    const { goBack } = useNavigation()
    await goBack()
  } catch {
    router.back()
  }
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

