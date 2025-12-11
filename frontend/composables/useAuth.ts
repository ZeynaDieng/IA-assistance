import { computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

export const useAuth = () => {
  const authStore = useAuthStore()

  const isAuthenticated = computed(() => authStore.isLoggedIn)
  const currentUser = computed(() => authStore.currentUser)
  const token = computed(() => authStore.token)

  const generateOtp = () => {
    return authStore.generateOtp()
  }

  const verifyOtp = (otp: string) => {
    return authStore.verifyOtp(otp)
  }

  const login = async (phoneNumber: string, pin: string) => {
    return await authStore.login(phoneNumber, pin)
  }

  const register = async (phoneNumber: string, pinHash: string) => {
    return await authStore.register(phoneNumber, pinHash)
  }

  const logout = () => {
    authStore.logout()
  }

  const initialize = () => {
    authStore.initialize()
  }

  return {
    isAuthenticated,
    currentUser,
    token,
    generateOtp,
    verifyOtp,
    login,
    register,
    logout,
    initialize
  }
}

