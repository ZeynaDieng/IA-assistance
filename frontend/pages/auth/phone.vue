<template>
  <div class="h-full flex flex-col p-4 pt-20 safe-top safe-bottom overflow-hidden">
    <h2 class="text-2xl font-bold mb-2">Inscription</h2>
    <p class="text-gray-500 mb-8 text-sm dark:text-gray-400">
      Créez votre compte en quelques étapes simples.
    </p>
    
    <div class="space-y-4">
      <!-- First Name Input -->
      <div class="flex items-center p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <input
          v-model="firstName"
          type="text"
          placeholder="Prénom"
          class="bg-transparent outline-none w-full font-medium text-gray-800 dark:text-white placeholder:text-gray-400"
          @keyup.enter="handleSubmit"
        />
      </div>
      
      <!-- Last Name Input -->
      <div class="flex items-center p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <input
          v-model="lastName"
          type="text"
          placeholder="Nom"
          class="bg-transparent outline-none w-full font-medium text-gray-800 dark:text-white placeholder:text-gray-400"
          @keyup.enter="handleSubmit"
        />
      </div>
      
      <!-- Phone Input -->
      <div class="flex items-center p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <Smartphone class="text-primary mr-3 flex-shrink-0" :size="20" />
        <span class="font-bold mr-2">+221</span>
        <input
          v-model="phoneNumber"
          type="tel"
          placeholder="77 000 00 00"
          class="bg-transparent outline-none w-full font-medium text-gray-800 dark:text-white placeholder:text-gray-400"
          maxlength="9"
          @keyup.enter="handleSubmit"
        />
      </div>
      
      <!-- Error Message -->
      <p
        v-if="error"
        class="text-sm text-red-500"
      >
        {{ error }}
      </p>
      
      <!-- Submit Button -->
      <Button
        variant="primary"
        :disabled="!isValid || loading"
        :loading="loading"
        @click="handleSubmit"
      >
        Envoyer le code OTP
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Smartphone } from 'lucide-vue-next'
import Button from '~/components/ui/Button.vue'
import { useAuthStore } from '~/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const firstName = ref('')
const lastName = ref('')
const phoneNumber = ref('')
const error = ref('')
const loading = ref(false)

const isValid = computed(() => {
  const cleaned = phoneNumber.value.replace(/\s/g, '')
  return firstName.value.trim().length > 0 && 
         lastName.value.trim().length > 0 && 
         /^[0-9]{9}$/.test(cleaned)
})

const validateInputs = (): boolean => {
  if (!firstName.value.trim()) {
    error.value = 'Le prénom est requis'
    return false
  }
  
  if (!lastName.value.trim()) {
    error.value = 'Le nom est requis'
    return false
  }
  
  const cleaned = phoneNumber.value.replace(/\s/g, '')
  if (!cleaned) {
    error.value = 'Le numéro est requis'
    return false
  }
  
  if (!/^[0-9]{9}$/.test(cleaned)) {
    error.value = 'Format invalide. Entrez 9 chiffres.'
    return false
  }
  
  error.value = ''
  return true
}

const handleSubmit = async () => {
  if (!validateInputs()) return
  
  loading.value = true
  error.value = ''
  
  try {
    const cleanedPhone = phoneNumber.value.replace(/\s/g, '')
    const fullPhone = `+221${cleanedPhone}`
    
    // Send OTP via backend
    await authStore.sendOtp(fullPhone, 'REGISTER')
    
    // Navigate to OTP verification page with user data
    router.push({
      path: '/auth/otp',
      query: { 
        phone: fullPhone,
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
        purpose: 'register'
      }
    })
  } catch (err: any) {
    error.value = err.message || 'Une erreur est survenue lors de l\'envoi du code'
    console.error(err)
  } finally {
    loading.value = false
  }
}

useHead({
  title: 'Authentification - Zeii'
})
</script>

