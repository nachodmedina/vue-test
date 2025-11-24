import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export interface AppError {
  message: string
  type: 'error' | 'warning' | 'info' | 'success'
  timeout?: number
  actions?: Array<{
    label: string
    action: () => void
  }>
}

const errors = ref<AppError[]>([])

export function useErrorHandler() {
  const router = useRouter()
  const authStore = useAuthStore()

  function addError(error: AppError | string) {
    const errorObj: AppError = typeof error === 'string' 
      ? { message: error, type: 'error' }
      : error

    errors.value.push(errorObj)

    // Auto remove after timeout
    if (errorObj.timeout !== 0) {
      setTimeout(() => {
        removeError(errorObj)
      }, errorObj.timeout || 5000)
    }
  }

  function removeError(error: AppError) {
    const index = errors.value.indexOf(error)
    if (index > -1) {
      errors.value.splice(index, 1)
    }
  }

  function clearErrors() {
    errors.value = []
  }

  function handleApiError(error: any) {
    console.error('API Error:', error)

    // Handle different types of errors
    if (error.status === 401) {
      // Unauthorized - redirect to login
      authStore.logout()
      router.push('/login')
      addError({
        message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
        type: 'warning'
      })
    } else if (error.status === 403) {
      // Forbidden
      addError({
        message: 'No tienes permisos para realizar esta acción.',
        type: 'error'
      })
    } else if (error.status === 404) {
      // Not found
      addError({
        message: 'El recurso solicitado no fue encontrado.',
        type: 'error'
      })
    } else if (error.status === 422) {
      // Validation error
      const message = error.data?.errors 
        ? Object.values(error.data.errors).flat().join(', ')
        : error.message || 'Error de validación'
      
      addError({
        message,
        type: 'error'
      })
    } else if (error.status === 500) {
      // Server error
      addError({
        message: 'Error interno del servidor. Intenta nuevamente más tarde.',
        type: 'error',
        actions: [{
          label: 'Reintentar',
          action: () => window.location.reload()
        }]
      })
    } else if (error.status === 0 || !navigator.onLine) {
      // Network error
      addError({
        message: 'Error de conexión. Verifica tu conexión a internet.',
        type: 'error',
        actions: [{
          label: 'Reintentar',
          action: () => window.location.reload()
        }]
      })
    } else {
      // Generic error
      addError({
        message: error.message || 'Ha ocurrido un error inesperado.',
        type: 'error'
      })
    }
  }

  function addSuccess(message: string, timeout = 3000) {
    addError({
      message,
      type: 'success',
      timeout
    })
  }

  function addInfo(message: string, timeout = 4000) {
    addError({
      message,
      type: 'info',
      timeout
    })
  }

  function addWarning(message: string, timeout = 5000) {
    addError({
      message,
      type: 'warning',
      timeout
    })
  }

  return {
    errors,
    addError,
    removeError,
    clearErrors,
    handleApiError,
    addSuccess,
    addInfo,
    addWarning
  }
}