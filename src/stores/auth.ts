import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import type { User, LoginCredentials, RegisterData, TwoFactorData, AuthResponse } from '@/types/auth'
import { apiCall, apiCallFormData } from '@/utils/api'

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
  const userRole = computed(() => 'user') // Por ahora sin roles
  const isAdmin = computed(() => false) // Por ahora sin roles

  // Actions
  async function login(credentials: LoginCredentials) {
    isLoading.value = true
    error.value = null
    requires2FA.value = false

    try {
      const formData = new URLSearchParams({
        username: credentials.email,
        password: credentials.password
      })

      const result = await apiCallFormData('/api/auth/login', formData)
      
      if (result.error) {
        throw new Error(result.error)
      }

      const data = result.data as AuthResponse

      if (data.requires_2fa) {
        requires2FA.value = true
        tempToken.value = data.temp_token || null
        return { success: true, requires2FA: true }
      }

      // Login exitoso sin 2FA
      await setAuthData(data)
      // Obtener datos del usuario autenticado
      await getCurrentUser()
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
      const result = await apiCall('/api/auth/verify-2fa', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tempToken.value}`,
        },
        body: JSON.stringify(twoFactorData),
      })

      if (result.error) {
        throw new Error(result.error)
      }

      const data = result.data as AuthResponse
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

      const result = await apiCall('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          username: registerPayload.username,
          email: registerPayload.email,
          password: registerPayload.password,
          full_name: registerPayload.full_name || null
        }),
      })

      if (result.error) {
        throw new Error(result.error)
      }

      const data = result.data as AuthResponse
      
      // Auto login after successful registration
      if (data.access_token) {
        await setAuthData(data)
        await getCurrentUser()
      }
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
        await apiCall('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token.value}`,
          },
        })
      }
    } catch (err) {
      console.error('Error en logout:', err)
    } finally {
      clearAuthData()
      isLoading.value = false
    }
  }

  async function refreshAccessToken(): Promise<boolean> {
    if (!refreshToken.value) {
      clearAuthData()
      return false
    }

    try {
      const result = await apiCall('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${refreshToken.value}`,
        },
      })

      if (result.error) {
        clearAuthData()
        return false
      }

      const data = result.data as AuthResponse
      token.value = data.access_token
      localStorage.setItem('token', data.access_token)
      
      if (data.refresh_token) {
        refreshToken.value = data.refresh_token
        localStorage.setItem('refreshToken', data.refresh_token)
      }

      return true
    } catch (err) {
      console.error('Error refreshing token:', err)
      clearAuthData()
      return false
    }
  }

  async function getCurrentUser() {
    if (!token.value) return null

    try {
      const result = await apiCall('/api/users/me', {
        headers: {
          'Authorization': `Bearer ${token.value}`,
        },
      })

      if (result.error) {
        // Try to refresh token if unauthorized
        const refreshed = await refreshAccessToken()
        if (refreshed) {
          return getCurrentUser()
        }
        throw new Error(result.error)
      }

      const userData = result.data as User
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
    if (data.refresh_token) {
      refreshToken.value = data.refresh_token
      localStorage.setItem('refreshToken', data.refresh_token)
    }
    if (data.user) {
      user.value = data.user
      localStorage.setItem('user', JSON.stringify(data.user))
    }

    localStorage.setItem('token', data.access_token)
  }

  function clearAuthData() {
    user.value = null
    token.value = null
    refreshToken.value = null
    requires2FA.value = false
    tempToken.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  }

  function clearError() {
    error.value = null
  }

  async function initialize() {
    isLoading.value = true
    try {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')

      if (storedToken && storedUser) {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
        // Verify token is still valid
        await getCurrentUser()
      }
    } catch (err) {
      console.error('Error initializing auth:', err)
      clearAuthData()
    } finally {
      isInitialized.value = true
      isLoading.value = false
    }
  }

  return {
    // State
    user: readonly(user),
    token: readonly(token),
    refreshToken: readonly(refreshToken),
    isLoading: readonly(isLoading),
    error: readonly(error),
    requires2FA: readonly(requires2FA),
    tempToken: readonly(tempToken),
    isInitialized: readonly(isInitialized),
    
    // Getters
    isAuthenticated,
    userRole,
    isAdmin,
    
    // Actions
    login,
    verify2FA,
    register,
    logout,
    refreshAccessToken,
    getCurrentUser,
    clearError,
    initialize,
  }
})