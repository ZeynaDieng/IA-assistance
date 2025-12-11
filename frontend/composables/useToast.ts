import { ref } from 'vue'

interface ToastOptions {
  message: string
  variant?: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

const toastState = ref<ToastOptions & { visible: boolean }>({
  visible: false,
  message: '',
  variant: 'info',
  duration: 3000
})

export const useToast = () => {
  const showToast = (options: ToastOptions) => {
    toastState.value = {
      ...options,
      visible: true,
      variant: options.variant || 'info',
      duration: options.duration || 3000
    }

    if (toastState.value.duration! > 0) {
      setTimeout(() => {
        hideToast()
      }, toastState.value.duration)
    }
  }

  const hideToast = () => {
    toastState.value.visible = false
  }

  const success = (message: string, duration?: number) => {
    showToast({ message, variant: 'success', duration })
  }

  const error = (message: string, duration?: number) => {
    showToast({ message, variant: 'error', duration })
  }

  const info = (message: string, duration?: number) => {
    showToast({ message, variant: 'info', duration })
  }

  const warning = (message: string, duration?: number) => {
    showToast({ message, variant: 'warning', duration })
  }

  return {
    toastState,
    showToast,
    hideToast,
    success,
    error,
    info,
    warning
  }
}

