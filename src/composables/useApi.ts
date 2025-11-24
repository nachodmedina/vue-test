import { useAuthStore } from '@/stores/auth'

export interface ApiOptions {
  requiresAuth?: boolean
  skipAuthRefresh?: boolean
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export function useApi() {
  async function apiRequest<T>(
    endpoint: string,
    options: RequestInit & ApiOptions = {}
  ): Promise<T> {
    const { requiresAuth = true, skipAuthRefresh = false, ...fetchOptions } = options
    const authStore = useAuthStore()

    // Construir URL completa
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`

    // Configurar headers por defecto
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    })

    // Agregar token de autenticación si es requerido
    if (requiresAuth && authStore.token) {
      headers.set('Authorization', `Bearer ${authStore.token}`)
    }

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      })

      // Si no está autenticado y la petición requiere auth
      if (response.status === 401 && requiresAuth && !skipAuthRefresh) {
        // Intentar refrescar el token
        const refreshed = await authStore.refreshAccessToken()
        
        if (refreshed) {
          // Reintentar la petición con el nuevo token
          headers.set('Authorization', `Bearer ${authStore.token}`)
          const retryResponse = await fetch(url, {
            ...fetchOptions,
            headers,
          })
          
          if (!retryResponse.ok) {
            throw new ApiError(
              await retryResponse.json(),
              retryResponse.status
            )
          }
          
          return await retryResponse.json()
        } else {
          // No se pudo refrescar, redirigir al login
          throw new ApiError(
            { message: 'Sesión expirada. Por favor, inicia sesión nuevamente.' },
            401
          )
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: 'Error de conexión'
        }))
        throw new ApiError(errorData, response.status)
      }

      // Manejar respuestas vacías (204 No Content)
      if (response.status === 204) {
        return {} as T
      }

      return await response.json()
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      
      // Error de red o parsing
      throw new ApiError(
        { message: 'Error de conexión. Verifica tu conexión a internet.' },
        0
      )
    }
  }

  // Métodos convenientes para diferentes tipos de peticiones
  function get<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    return apiRequest<T>(endpoint, { method: 'GET', ...options })
  }

  function post<T>(
    endpoint: string, 
    data?: any, 
    options: ApiOptions = {}
  ): Promise<T> {
    return apiRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    })
  }

  function put<T>(
    endpoint: string, 
    data?: any, 
    options: ApiOptions = {}
  ): Promise<T> {
    return apiRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    })
  }

  function patch<T>(
    endpoint: string, 
    data?: any, 
    options: ApiOptions = {}
  ): Promise<T> {
    return apiRequest<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    })
  }

  function del<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    return apiRequest<T>(endpoint, { method: 'DELETE', ...options })
  }

  // Método para subir archivos
  function upload<T>(
    endpoint: string,
    formData: FormData,
    options: ApiOptions = {}
  ): Promise<T> {
    return apiRequest<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers: {}, // No establecer Content-Type para FormData
      ...options,
    })
  }

  return {
    get,
    post,
    put,
    patch,
    delete: del,
    upload,
    apiRequest,
  }
}

export class ApiError extends Error {
  public data: any
  public status: number

  constructor(data: any, status: number) {
    super(data.message || 'Error de API')
    this.data = data
    this.status = status
    this.name = 'ApiError'
  }
}