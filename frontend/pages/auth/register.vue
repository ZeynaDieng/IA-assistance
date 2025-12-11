<template>
  <div
    class="min-h-screen flex flex-col p-8 pt-safe-top pb-safe-bottom bg-white dark:bg-[#0D0F33] transition-colors duration-300"
  >
    <!-- Back Button -->
    <button
      @click="router.push('/auth')"
      class="absolute top-safe-top left-6 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mt-4"
    >
      <ChevronLeft :size="24" class="text-gray-600 dark:text-gray-300" />
    </button>

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
        Inscription
      </h1>

      <!-- Description -->
      <p
        class="text-gray-600 dark:text-gray-300 mb-12 text-center max-w-sm mx-auto leading-relaxed"
      >
        Créez votre compte en quelques étapes simples.
      </p>

      <!-- Form -->
      <div class="space-y-6">
        <!-- First Name Input -->
        <div>
          <div
            class="flex items-center p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all"
          >
            <input
              v-model="firstName"
              type="text"
              placeholder="Prénom"
              class="bg-transparent outline-none w-full font-medium text-gray-900 dark:text-white placeholder:text-gray-400"
              @keyup.enter="handleSubmit"
            />
          </div>
          <p v-if="errors.firstName" class="text-sm text-red-500 mt-2">
            {{ errors.firstName }}
          </p>
        </div>

        <!-- Last Name Input -->
        <div>
          <div
            class="flex items-center p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all"
          >
            <input
              v-model="lastName"
              type="text"
              placeholder="Nom"
              class="bg-transparent outline-none w-full font-medium text-gray-900 dark:text-white placeholder:text-gray-400"
              @keyup.enter="handleSubmit"
            />
          </div>
          <p v-if="errors.lastName" class="text-sm text-red-500 mt-2">
            {{ errors.lastName }}
          </p>
        </div>

        <!-- Phone Input -->
        <div>
          <div
            class="flex items-center p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all"
          >
            <Smartphone class="text-primary mr-3 flex-shrink-0" :size="20" />
            <span class="font-bold mr-2 text-gray-700 dark:text-gray-300">+221</span>
            <input
              v-model="phoneNumber"
              type="tel"
              placeholder="77 000 00 00"
              class="bg-transparent outline-none w-full font-medium text-gray-900 dark:text-white placeholder:text-gray-400"
              maxlength="9"
              @keyup.enter="handleSubmit"
            />
          </div>
          <p v-if="errors.phone" class="text-sm text-red-500 mt-2">
            {{ errors.phone }}
          </p>
        </div>

        <!-- Error Message -->
        <p v-if="errors.general" class="text-sm text-red-500 text-center">
          {{ errors.general }}
        </p>

        <!-- Submit Button -->
        <Button
          variant="primary"
          size="lg"
          :disabled="!isValid || loading"
          :loading="loading"
          class="w-full"
          @click="handleSubmit"
        >
          Envoyer le code
        </Button>

        <!-- Login Link -->
        <div class="text-center pt-4">
          <span class="text-sm text-gray-500 dark:text-gray-400"
            >Déjà un compte ?
          </span>
          <button
            class="text-sm text-primary font-medium ml-1 hover:underline"
            @click="router.push('/auth/login')"
          >
            Se connecter
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Smartphone, ChevronLeft } from "lucide-vue-next";
import Button from "~/components/ui/Button.vue";
import Logo from "~/components/ui/Logo.vue";
import { useAuthStore } from "~/stores/auth";
import { useDarkMode } from "~/composables/useDarkMode";

const router = useRouter();
const authStore = useAuthStore();
const { isDark } = useDarkMode();

const firstName = ref("");
const lastName = ref("");
const phoneNumber = ref("");
const error = ref("");
const loading = ref(false);
const errors = ref({
  firstName: "",
  lastName: "",
  phone: "",
  general: "",
});

const isValid = computed(() => {
  const cleaned = phoneNumber.value.replace(/\s/g, "");
  return (
    firstName.value.trim().length > 0 &&
    lastName.value.trim().length > 0 &&
    /^[0-9]{9}$/.test(cleaned)
  );
});

const validateInputs = (): boolean => {
  errors.value = { firstName: "", lastName: "", phone: "", general: "" };

  if (!firstName.value.trim()) {
    errors.value.firstName = "Le prénom est requis";
    return false;
  }

  if (!lastName.value.trim()) {
    errors.value.lastName = "Le nom est requis";
    return false;
  }

  const cleaned = phoneNumber.value.replace(/\s/g, "");
  if (!cleaned) {
    errors.value.phone = "Le numéro est requis";
    return false;
  }

  if (!/^[0-9]{9}$/.test(cleaned)) {
    errors.value.phone = "Format invalide. Entrez 9 chiffres.";
    return false;
  }

  return true;
};

const handleSubmit = async () => {
  if (!validateInputs()) return;

  loading.value = true;
  errors.value.general = "";

  try {
    const cleanedPhone = phoneNumber.value.replace(/\s/g, "");
    const fullPhone = `+221${cleanedPhone}`;

    // Send OTP via backend
    await authStore.sendOtp(fullPhone, "REGISTER");

    // Navigate to OTP verification page with user data
    router.push({
      path: "/auth/otp",
      query: {
        phone: fullPhone,
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
        purpose: "register",
      },
    });
  } catch (err: any) {
    errors.value.general =
      err.message || "Une erreur est survenue lors de l'envoi du code";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

useHead({
  title: "Inscription - Zeii",
});
</script>
