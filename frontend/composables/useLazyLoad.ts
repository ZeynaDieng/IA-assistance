import { defineAsyncComponent, Component } from 'vue'

/**
 * Lazy load a component with loading and error states
 */
export function useLazyComponent(
  loader: () => Promise<Component>,
  options?: {
    loadingComponent?: Component
    errorComponent?: Component
    delay?: number
    timeout?: number
  }
) {
  return defineAsyncComponent({
    loader,
    loadingComponent: options?.loadingComponent,
    errorComponent: options?.errorComponent,
    delay: options?.delay || 200,
    timeout: options?.timeout || 30000,
  })
}

/**
 * Lazy load an image with placeholder
 */
export function useLazyImage(src: string, placeholder?: string) {
  const imageSrc = ref<string>(placeholder || '')
  const isLoading = ref(true)
  const hasError = ref(false)

  const img = new Image()
  
  img.onload = () => {
    imageSrc.value = src
    isLoading.value = false
  }
  
  img.onerror = () => {
    hasError.value = true
    isLoading.value = false
  }
  
  img.src = src

  return {
    imageSrc: readonly(imageSrc),
    isLoading: readonly(isLoading),
    hasError: readonly(hasError),
  }
}

