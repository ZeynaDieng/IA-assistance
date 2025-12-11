import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: string
  phoneNumber: string
  firstName?: string
  lastName?: string
  createdAt: string
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isAuthenticated = ref(false)
  const generatedOtp = ref<string>('')

  // Getters
  const currentUser = computed(() => user.value)
  const isLoggedIn = computed(() => isAuthenticated.value && !!token.value)

  // Actions - OTP-based authentication
  const sendOtp = async (phoneNumber: string, purpose: 'REGISTER' | 'LOGIN' = 'REGISTER') => {
    try {
      const config = useRuntimeConfig()
      const apiUrl = `${config.public.apiBaseUrl}/auth/send-otp`
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phoneNumber, purpose })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.message || `Erreur HTTP ${response.status}: ${response.statusText}`
        throw new Error(errorMessage)
      }

      const data = await response.json()
      
      // Mode gratuit : l'OTP est toujours retourné dans la réponse API
      // Il est affiché dans l'UI pour que l'utilisateur puisse le copier
      if (data.otp) {
        generatedOtp.value = data.otp
        console.log('[AuthStore] OTP received:', data.otp)
      }
      
      return data
    } catch (error: any) {
      console.error('Send OTP error:', error)
      throw error
    }
  }

  const verifyOtpRegister = async (phoneNumber: string, otp: string, firstName: string, lastName: string) => {
    try {
      const config = useRuntimeConfig()
      const apiUrl = `${config.public.apiBaseUrl}/auth/verify-otp-register`
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phoneNumber, otp, firstName, lastName })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.message || `Erreur HTTP ${response.status}: ${response.statusText}`
        throw new Error(errorMessage)
      }

      const data = await response.json()
      user.value = data.user
      token.value = data.token
      isAuthenticated.value = true

      // Persist to localStorage (3 months session)
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('auth_user', JSON.stringify(data.user))

      return data
    } catch (error: any) {
      console.error('Verify OTP Register error:', error)
      throw error
    }
  }

  const verifyOtpLogin = async (phoneNumber: string, otp: string) => {
    try {
      const config = useRuntimeConfig()
      const apiUrl = `${config.public.apiBaseUrl}/auth/verify-otp-login`
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phoneNumber, otp })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.message || `Erreur HTTP ${response.status}: ${response.statusText}`
        throw new Error(errorMessage)
      }

      const data = await response.json()
      user.value = data.user
      token.value = data.token
      isAuthenticated.value = true

      // Persist to localStorage (3 months session)
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('auth_user', JSON.stringify(data.user))

      return data
    } catch (error: any) {
      console.error('Verify OTP Login error:', error)
      throw error
    }
  }

  // OLD METHODS (COMMENTED - Can be uncommented later if needed)
  // const generateOtp = (): string => {
  //   // Generate 4-digit OTP locally
  //   const otp = Math.floor(1000 + Math.random() * 9000).toString()
  //   generatedOtp.value = otp
  //   return otp
  // }

  // const verifyOtp = (inputOtp: string): boolean => {
  //   return inputOtp === generatedOtp.value
  // }

  // OLD PIN-BASED LOGIN (COMMENTED - Can be uncommented later if needed)
  // const login = async (phoneNumber: string, pin: string) => {
  //   try {
  //     const config = useRuntimeConfig()
  //     const apiUrl = `${config.public.apiBaseUrl}/auth/login`
  //     
  //     const response = await fetch(apiUrl, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({ phoneNumber, pin })
  //     })
  //
  //     if (!response.ok) {
  //       const errorData = await response.json().catch(() => ({}))
  //       const errorMessage = errorData.message || `Erreur HTTP ${response.status}: ${response.statusText}`
  //       throw new Error(errorMessage)
  //     }
  //
  //     const data = await response.json()
  //     user.value = data.user
  //     token.value = data.token
  //     isAuthenticated.value = true
  //
  //     // Persist to localStorage
  //     localStorage.setItem('auth_token', data.token)
  //     localStorage.setItem('auth_user', JSON.stringify(data.user))
  //
  //     return data
  //   } catch (error: any) {
  //     console.error('Login error:', error)
  //     
  //     // More detailed error handling
  //     if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
  //       throw new Error('Impossible de se connecter au serveur. Vérifiez votre connexion ou que le backend est démarré.')
  //     }
  //     
  //     if (error.message.includes('404')) {
  //       throw new Error('Le service d\'authentification n\'est pas disponible. Le backend n\'est peut-être pas démarré.')
  //     }
  //     
  //     throw error
  //   }
  // }

  // OLD PIN-BASED REGISTER (COMMENTED - Can be uncommented later if needed)
  // const register = async (phoneNumber: string, pin: string) => {
  //   try {
  //     const config = useRuntimeConfig()
  //     const apiUrl = `${config.public.apiBaseUrl}/auth/register`
  //     
  //     const response = await fetch(apiUrl, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({ phoneNumber, pin })
  //     })
  //
  //     if (!response.ok) {
  //       const errorData = await response.json().catch(() => ({}))
  //       const errorMessage = errorData.message || `Erreur HTTP ${response.status}: ${response.statusText}`
  //       throw new Error(errorMessage)
  //     }
  //
  //     const data = await response.json()
  //     user.value = data.user
  //     token.value = data.token
  //     isAuthenticated.value = true
  //
  //     // Persist to localStorage
  //     localStorage.setItem('auth_token', data.token)
  //     localStorage.setItem('auth_user', JSON.stringify(data.user))
  //
  //     return data
  //   } catch (error: any) {
  //     console.error('Registration error:', error)
  //     
  //     // More detailed error handling
  //     if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
  //       throw new Error('Impossible de se connecter au serveur. Vérifiez votre connexion ou que le backend est démarré.')
  //     }
  //     
  //     if (error.message.includes('404')) {
  //       throw new Error('Le service d\'authentification n\'est pas disponible. Le backend n\'est peut-être pas démarré.')
  //     }
  //     
  //     throw error
  //   }
  // }

  const logout = () => {
    user.value = null
    token.value = null
    isAuthenticated.value = false
    generatedOtp.value = ''

    // Clean up all auth-related localStorage items
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    localStorage.removeItem('mock_pin') // Clean up old mock data if exists
  }

  const initialize = () => {
    // Restore from localStorage
    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('auth_user')

    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = JSON.parse(storedUser)
      isAuthenticated.value = true
    }
  }

  return {
    // State
    user,
    token,
    isAuthenticated,
    generatedOtp,
    // Getters
    currentUser,
    isLoggedIn,
    // Actions
    sendOtp,
    verifyOtpRegister,
    verifyOtpLogin,
    // OLD METHODS (COMMENTED)
    // generateOtp,
    // verifyOtp,
    // login,
    // register,
    logout,
    initialize
  }
})

