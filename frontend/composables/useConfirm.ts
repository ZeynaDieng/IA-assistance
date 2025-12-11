import { ref } from 'vue'

interface ConfirmOptions {
  message: string
  title?: string
  confirmText?: string
  cancelText?: string
  variant?: 'warning' | 'info'
}

const confirmState = ref<ConfirmOptions & { visible: boolean; resolve?: (value: boolean) => void }>({
  visible: false,
  message: '',
  title: '',
  confirmText: 'Confirmer',
  cancelText: 'Annuler',
  variant: 'warning'
})

export const useConfirm = () => {
  const confirm = (options: ConfirmOptions | string): Promise<boolean> => {
    return new Promise((resolve) => {
      const opts = typeof options === 'string' 
        ? { message: options }
        : options
      
      confirmState.value = {
        ...opts,
        visible: true,
        confirmText: opts.confirmText || 'Confirmer',
        cancelText: opts.cancelText || 'Annuler',
        variant: opts.variant || 'warning',
        resolve
      }
    })
  }

  const handleConfirm = () => {
    if (confirmState.value.resolve) {
      confirmState.value.resolve(true)
    }
    confirmState.value.visible = false
    confirmState.value.resolve = undefined
  }

  const handleCancel = () => {
    if (confirmState.value.resolve) {
      confirmState.value.resolve(false)
    }
    confirmState.value.visible = false
    confirmState.value.resolve = undefined
  }

  return {
    confirmState,
    confirm,
    handleConfirm,
    handleCancel
  }
}

