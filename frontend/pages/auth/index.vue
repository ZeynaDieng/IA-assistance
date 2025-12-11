<template>
  <div
    class="min-h-screen flex flex-col p-8 pt-safe-top pb-safe-bottom bg-white dark:bg-[#0D0F33] transition-colors duration-300"
  >
    <!-- Logo -->
    <div class="flex justify-center mb-12 mt-8">
      <Logo size="lg" :variant="isDark ? 'light' : 'dark'" />
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col justify-center">
      <!-- Title -->
      <h1
        class="text-3xl font-bold mb-4 text-center text-gray-900 dark:text-white"
      >
        Bienvenue
      </h1>

      <!-- Description -->
      <p
        class="text-gray-600 dark:text-gray-300 mb-12 text-center max-w-sm mx-auto leading-relaxed"
      >
        Choisissez une option pour continuer
      </p>

      <!-- Options -->
      <div class="space-y-4">
        <!-- Créer un compte -->
        <Button
          variant="primary"
          size="lg"
          :icon="UserPlus"
          class="w-full"
          @click="router.push('/auth/register')"
        >
          Créer un compte
        </Button>

        <!-- Se connecter -->
        <Button
          variant="outline"
          size="lg"
          :icon="LogIn"
          class="w-full"
          @click="router.push('/auth/login')"
        >
          Se connecter
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { UserPlus, LogIn } from "lucide-vue-next";
import Logo from "~/components/ui/Logo.vue";
import Button from "~/components/ui/Button.vue";
import { useAuthStore } from "~/stores/auth";
import { useDarkMode } from "~/composables/useDarkMode";

const router = useRouter();
const authStore = useAuthStore();
const { isDark } = useDarkMode();

onMounted(() => {
  authStore.initialize();

  // Redirect if already logged in
  if (authStore.isLoggedIn) {
    router.push("/home");
  }
});

useHead({
  title: "Authentification - Zeii",
});
</script>
