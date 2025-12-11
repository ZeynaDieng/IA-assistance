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
      <!-- Illustration -->
      <div class="flex justify-center mb-12">
        <div
          class="w-32 h-32 rounded-full bg-primary flex items-center justify-center shadow-lg"
        >
          <MessageCircle :size="48" class="text-white" />
        </div>
      </div>

      <!-- Headline -->
      <h1
        class="text-3xl font-bold mb-4 text-center text-gray-900 dark:text-white"
      >
        Ton assistant<br />
        de planification
      </h1>

      <!-- Description -->
      <p
        class="text-gray-600 dark:text-gray-300 mb-12 text-center max-w-sm mx-auto leading-relaxed"
      >
        Discute en texte ou en vocal. L'IA planifie et organise ta journée
        intelligemment.
      </p>

      <!-- CTA Button -->
      <Button
        variant="primary"
        size="lg"
        :icon="ArrowRight"
        class="w-full mb-4"
        @click="handleStart"
      >
        Commencer
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MessageCircle, ArrowRight } from "lucide-vue-next";
import Logo from "~/components/ui/Logo.vue";
import Button from "~/components/ui/Button.vue";
import { useDarkMode } from "~/composables/useDarkMode";

const router = useRouter();
const { isDark } = useDarkMode();

const handleStart = () => {
  router.push("/auth");
};

useHead({
  title: "Bienvenue - Zeii",
});
</script>
