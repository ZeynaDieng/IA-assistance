<template>
  <div class="h-full flex items-center justify-center">
    <div class="text-center">
      <div class="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p class="text-gray-500">Chargement...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

// Redirect to appropriate page based on auth status
const authStore = useAuthStore()

// Initialize auth to check if user is logged in
authStore.initialize()

// Use navigateTo for redirects
onMounted(() => {
  if (authStore.isLoggedIn) {
    navigateTo('/home', { replace: true })
  } else {
    navigateTo('/onboarding', { replace: true })
  }
})
</script>


