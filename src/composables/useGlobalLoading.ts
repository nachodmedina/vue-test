import { ref } from 'vue'

const isGlobalLoading = ref(false)
const loadingMessage = ref('')

export function useGlobalLoading() {
  function startLoading(message = 'Cargando...') {
    isGlobalLoading.value = true
    loadingMessage.value = message
  }

  function stopLoading() {
    isGlobalLoading.value = false
    loadingMessage.value = ''
  }

  function withLoading<T>(
    asyncFn: () => Promise<T>, 
    message = 'Cargando...'
  ): Promise<T> {
    startLoading(message)
    return asyncFn().finally(() => {
      stopLoading()
    })
  }

  return {
    isGlobalLoading,
    loadingMessage,
    startLoading,
    stopLoading,
    withLoading
  }
}