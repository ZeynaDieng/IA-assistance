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
        Vérification
      </h1>

      <!-- Description -->
      <p
        class="text-gray-600 dark:text-gray-300 mb-8 text-center max-w-sm mx-auto leading-relaxed"
      >
        Entrez le code à 6 chiffres envoyé au {{ formattedPhone }}. Ce code
        expire dans 3 minutes.
      </p>

      <!-- OTP Display - Mode gratuit : toujours affiché -->
      <div
        v-if="authStore.generatedOtp"
        class="bg-primary/10 dark:bg-primary/20 border border-primary/30 dark:border-primary/40 p-6 rounded-2xl mb-8 text-center"
      >
        <span
          class="text-xs uppercase tracking-wider text-primary dark:text-primary/90 font-medium block mb-3"
        >
          Votre Code de Vérification
        </span>
        <div
          class="text-4xl font-mono font-bold text-primary dark:text-primary/90 tracking-widest"
        >
          {{ authStore.generatedOtp }}
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-3">
          Copiez ce code dans le champ ci-dessous
        </p>
      </div>

      <!-- Form -->
      <div class="space-y-6">
        <!-- OTP Input (6 digits) -->
        <input
          v-model="otpInput"
          type="text"
          placeholder="000000"
          maxlength="6"
          :class="[
            'text-center text-4xl tracking-[0.5em] w-full p-6 rounded-2xl border outline-none',
            'transition-all font-mono',
            error
              ? 'border-red-400 bg-red-50 dark:bg-red-900/20'
              : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20',
            'text-gray-900 dark:text-white placeholder:text-gray-400',
          ]"
          @input="handleInput"
          @keyup.enter="handleVerify"
        />

        <!-- Error Message -->
        <p v-if="error" class="text-sm text-red-500 text-center">
          {{ error }}
        </p>

        <!-- Verify Button -->
        <Button
          variant="primary"
          size="lg"
          :icon="ShieldCheck"
          :disabled="otpInput.length !== 6 || loading"
          :loading="loading"
          class="w-full"
          @click="handleVerify"
        >
          Valider
        </Button>

        <!-- Resend OTP Button -->
        <button
          v-if="canResend"
          @click="handleResend"
          class="text-sm text-primary dark:text-primary/80 hover:underline text-center w-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          :disabled="resending"
        >
          {{ resending ? "Envoi en cours..." : "Renvoyer le code" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue";
import { ShieldCheck, ChevronLeft } from "lucide-vue-next";
import Button from "~/components/ui/Button.vue";
import Logo from "~/components/ui/Logo.vue";
import { useAuthStore } from "~/stores/auth";
import { useDarkMode } from "~/composables/useDarkMode";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const { isDark } = useDarkMode();

const otpInput = ref("");
const error = ref("");
const loading = ref(false);
const resending = ref(false);
const canResend = ref(true);

const phoneNumber = computed(() => (route.query.phone as string) || "");
const firstName = computed(() => (route.query.firstName as string) || "");
const lastName = computed(() => (route.query.lastName as string) || "");
const purpose = computed(() => (route.query.purpose as string) || "register");

const formattedPhone = computed(() => {
  const phone = phoneNumber.value;
  if (phone.startsWith("+221")) {
    return phone
      .replace("+221", "+221 ")
      .replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, "$1 $2 $3 $4");
  }
  return phone;
});

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  // Only allow digits, max 6
  otpInput.value = target.value.replace(/\D/g, "").slice(0, 6);
  error.value = "";
};

const handleResend = async () => {
  if (!phoneNumber.value) return;

  resending.value = true;
  error.value = "";

  try {
    await authStore.sendOtp(
      phoneNumber.value,
      purpose.value as "REGISTER" | "LOGIN"
    );
    canResend.value = false;
    setTimeout(() => {
      canResend.value = true;
    }, 30000); // Can resend after 30 seconds
  } catch (err: any) {
    error.value = err.message || "Erreur lors de l'envoi du code";
  } finally {
    resending.value = false;
  }
};

const handleVerify = async () => {
  if (otpInput.value.length !== 6) return;

  loading.value = true;
  error.value = "";

  try {
    if (purpose.value === "register") {
      // Registration flow
      if (!firstName.value || !lastName.value) {
        error.value = "Informations manquantes";
        return;
      }

      await authStore.verifyOtpRegister(
        phoneNumber.value,
        otpInput.value,
        firstName.value,
        lastName.value
      );

      // Redirect to home
      router.push("/home");
    } else {
      // Login flow
      await authStore.verifyOtpLogin(phoneNumber.value, otpInput.value);

      // Redirect to home
      router.push("/home");
    }
  } catch (err: any) {
    error.value =
      err.message || "Code incorrect ou expiré. Veuillez réessayer.";
    console.error("OTP verification error:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  // If no phone number, redirect to auth choice page
  if (!phoneNumber.value) {
    router.push("/auth");
    return;
  }

  // Focus on input
  await nextTick();
  const input = document.querySelector("input") as HTMLInputElement;
  input?.focus();
});

useHead({
  title: "Vérification - Zeii",
});
</script>
