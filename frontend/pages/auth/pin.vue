<template>
  <div class="h-full flex flex-col p-8 pt-20 safe-top safe-bottom overflow-hidden">
    <h2 class="text-2xl font-bold mb-2">Créer un PIN</h2>
    <p class="text-gray-500 mb-8 text-sm dark:text-gray-400">
      Sécurise l'accès à ton journal personnel.
    </p>
    
    <!-- PIN Input Component -->
    <PinInput
      v-model="pin"
      label="Choisis un code PIN à 4 chiffres"
      :error="error"
      :disabled="loading"
      helper="Évite les codes trop simples (ex: 1111)"
      :show-confirm="pin.length === 4 && !loading"
      :confirm-text="loading ? 'Création en cours...' : 'Confirmer le PIN'"
      @confirm="handleConfirm"
    />
    
    <!-- Loading indicator -->
    <div
      v-if="loading"
      class="mt-6 text-center"
    >
      <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
      <p class="text-sm text-gray-500">Création du compte en cours...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PinInput from '~/components/features/PinInput.vue'
import { useAuthStore } from '~/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const pin = ref('')
const error = ref('')
const loading = ref(false)

const phoneNumber = computed(() => route.query.phone as string || '')

const validatePin = (pinValue: string): boolean => {
  if (pinValue.length !== 4) {
    error.value = 'Le PIN doit contenir 4 chiffres'
    return false
  }
  
  // Check if all digits are the same
  if (/^(\d)\1{3}$/.test(pinValue)) {
    error.value = 'Choisissez un PIN plus sécurisé'
    return false
  }
  
  error.value = ''
  return true
}

const handleConfirm = async () => {
  if (!validatePin(pin.value)) return
  
  if (!phoneNumber.value) {
    error.value = 'Numéro de téléphone manquant. Veuillez recommencer depuis le début.'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    // Register user - Backend will hash the PIN
    await authStore.register(phoneNumber.value, pin.value)
    
    // Navigate to home
    router.push('/home')
  } catch (err: any) {
    // Show detailed error message
    error.value = err.message || 'Une erreur est survenue lors de la création du compte'
    console.error('Registration error:', err)
    
    // Log more details for debugging
    if (import.meta.dev) {
      console.error('Full error details:', {
        message: err.message,
        phoneNumber: phoneNumber.value,
        stack: err.stack
      })
    }
  } finally {
    loading.value = false
  }
}


useHead({
  title: 'Créer un PIN - Zeii'
})
</script>

