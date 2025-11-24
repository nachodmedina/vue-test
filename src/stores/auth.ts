import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginCredentials, RegisterData, TwoFactorData, AuthResponse } from '@/types/auth'

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  requires2FA: boolean
  tempToken: string | null
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'))
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const requires2FA = ref(false)
  const tempToken = ref<string | null>(null)
  const isInitialized = ref(false)

  // Getters
  const isAuthenticated = computed(() => isInitialized.value && !!token.value && !!user.value)
  const userRole = computed(() => user.value?.role || 'user')
  const isAdmin = computed(() => userRole.value === 'admin')

  // API Base URL
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

  // Actions
  async function login(credentials: LoginCredentials) {
    isLoading.value = true
    error.value = null
    requires2FA.value = false

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      const data: AuthResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error de autenticación')
      }

      if (data.requires_2fa) {
        requires2FA.value = true
        tempToken.value = data.temp_token || null
        return { success: true, requires2FA: true }
      }

      // Login exitoso sin 2FA
      await setAuthData(data)
      return { success: true, requires2FA: false }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error de conexión'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  async function verify2FA(twoFactorData: TwoFactorData) {
    isLoading.value = true
    error.value = null

    try {
      const response = await fetch(`${API_BASE}/auth/verify-2fa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tempToken.value}`,
        },
        body: JSON.stringify(twoFactorData),
      })

      const data: AuthResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Código de verificación inválido')
      }

      await setAuthData(data)
      requires2FA.value = false
      tempToken.value = null

      return { success: true }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error de verificación'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  async function register(registerData: RegisterData) {
    isLoading.value = true
    error.value = null

    try {
      const { confirmPassword, acceptTerms, ...registerPayload } = registerData

      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerPayload),
      })

      const data: AuthResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error en el registro')
      }

      // Auto login after successful registration
      await setAuthData(data)
      return { success: true }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error de registro'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    isLoading.value = true

    try {
      if (token.value) {
        await fetch(`${API_BASE}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token.value}`,
          },
        })
      }
    } catch (err) {
      console.error('Error al cerrar sesión:', err)
    } finally {
      clearAuthData()
      isLoading.value = false
    }
  }

  async function refreshAccessToken() {
    if (!refreshToken.value) {
      clearAuthData()
      return false
    }

    try {
      const response = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken.value }),
      })

      const data: AuthResponse = await response.json()

      if (!response.ok) {
        throw new Error('Token de actualización inválido')
      }

      token.value = data.access_token
      localStorage.setItem('token', data.access_token)

      if (data.refresh_token) {
        refreshToken.value = data.refresh_token
        localStorage.setItem('refreshToken', data.refresh_token)
      }

      return true
    } catch (err) {
      console.error('Error al actualizar token:', err)
      clearAuthData()
      return false
    }
  }

  async function getCurrentUser() {
    if (!token.value) return null

    try {
      const response = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token.value}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          const refreshed = await refreshAccessToken()
          if (refreshed) {
            return getCurrentUser()
          }
        }
        throw new Error('Error al obtener datos del usuario')
      }

      const userData: User = await response.json()
      user.value = userData
      return userData
    } catch (err) {
      console.error('Error al obtener usuario:', err)
      clearAuthData()
      return null
    }
  }

  function setAuthData(data: AuthResponse) {
    token.value = data.access_token
    refreshToken.value = data.refresh_token
    user.value = data.user

    localStorage.setItem('token', data.access_token)
    localStorage.setItem('refreshToken', data.refresh_token)
    localStorage.setItem('user', JSON.stringify(data.user))
  }

  function clearAuthData() {
    user.value = null
    token.value = null
    refreshToken.value = null
    requires2FA.value = false
    tempToken.value = null
    error.value = null

    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  }

  function clearError() {
    error.value = null
  }

  // Initialize auth state from localStorage
  function initializeAuth() {
    try {
      const storedUser = localStorage.getItem('user')
      if (storedUser && token.value) {
        user.value = JSON.parse(storedUser)
      }
    } catch (err) {
      console.error('Error inicializando autenticación:', err)
      clearAuthData()
    } finally {
      isInitialized.value = true
    }
  }

  // Ejecutar inicialización automáticamente al crear el store
  initializeAuth()

  return {
    // State
    user,
    token,
    isLoading,
    error,
    requires2FA,
    isInitialized,
    // Getters
    isAuthenticated,
    userRole,
    isAdmin,
    // Actions
    login,
    register,
    verify2FA,
    logout,
    refreshAccessToken,
    getCurrentUser,
    clearError,
    initializeAuth,
  }
})

// El store ya se inicializa automáticamente cuando se ejecuta initializeAuth() dentro de él