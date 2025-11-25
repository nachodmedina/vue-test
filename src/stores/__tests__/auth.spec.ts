import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../auth'
import type { LoginCredentials, RegisterData } from '@/types/auth'

// Mock de las funciones API
vi.mock('@/utils/api', () => ({
  apiCall: vi.fn(),
  apiCallFormData: vi.fn()
}))

describe('Auth Store', () => {
  beforeEach(() => {
    // Crear un nuevo pinia para cada test
    setActivePinia(createPinia())
    
    // Limpiar localStorage
    localStorage.clear()
    
    // Resetear los mocks
    vi.clearAllMocks()
  })

  describe('State inicial', () => {
    it('debe tener el estado inicial correcto', () => {
      const store = useAuthStore()
      
      expect(store.user).toBeNull()
      expect(store.isAuthenticated).toBe(false)
      expect(store.isLoading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('debe cargar el token desde localStorage si existe', () => {
      localStorage.setItem('token', 'test-token')
      localStorage.setItem('refreshToken', 'test-refresh-token')
      
      const store = useAuthStore()
      
      // El token se carga del localStorage pero isAuthenticated es false
      // hasta que se verifique con getCurrentUser
      expect(store.isAuthenticated).toBe(false)
    })
  })

  describe('Login', () => {
    it('debe realizar login exitoso', async () => {
      const { apiCallFormData } = await import('@/utils/api')
      
      // Mock de respuesta exitosa
      vi.mocked(apiCallFormData).mockResolvedValueOnce({
        data: {
          access_token: 'new-token',
          token_type: 'bearer',
          refresh_token: 'new-refresh-token'
        },
        error: undefined
      })

      // Mock de getCurrentUser
      const { apiCall } = await import('@/utils/api')
      vi.mocked(apiCall).mockResolvedValueOnce({
        data: {
          id: '1',
          email: 'test@example.com',
          username: 'testuser',
          is_active: true,
          is_superuser: false,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        error: undefined
      })
      
      const store = useAuthStore()
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'password123'
      }
      
      const result = await store.login(credentials)
      
      expect(result.success).toBe(true)
      expect(result.requires2FA).toBe(false)
      expect(store.error).toBeNull()
      expect(localStorage.getItem('token')).toBe('new-token')
      expect(localStorage.getItem('refreshToken')).toBe('new-refresh-token')
    })

    it('debe manejar credenciales incorrectas', async () => {
      const { apiCallFormData } = await import('@/utils/api')
      
      // Mock de respuesta con error
      vi.mocked(apiCallFormData).mockResolvedValueOnce({
        data: null,
        error: 'Incorrect email or password'
      })
      
      const store = useAuthStore()
      const credentials: LoginCredentials = {
        email: 'wrong@example.com',
        password: 'wrongpassword'
      }
      
      const result = await store.login(credentials)
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Incorrect email or password')
      expect(store.error).toBe('Incorrect email or password')
      expect(store.user).toBeNull()
    })

    it('debe manejar login que requiere 2FA', async () => {
      const { apiCallFormData } = await import('@/utils/api')
      
      // Mock de respuesta que requiere 2FA
      vi.mocked(apiCallFormData).mockResolvedValueOnce({
        data: {
          requires_2fa: true,
          temp_token: 'temp-token-123'
        },
        error: undefined
      })
      
      const store = useAuthStore()
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'password123'
      }
      
      const result = await store.login(credentials)
      
      expect(result.success).toBe(true)
      expect(result.requires2FA).toBe(true)
      expect(store.requires2FA).toBe(true)
      // No debe guardar token permanente aún
      expect(localStorage.getItem('token')).toBeNull()
    })

    it('debe actualizar isLoading durante el login', async () => {
      const { apiCallFormData } = await import('@/utils/api')
      
      // Mock con promesa pendiente
      let resolvePromise: any
      const pendingPromise = new Promise((resolve) => {
        resolvePromise = resolve
      })
      
      vi.mocked(apiCallFormData).mockReturnValueOnce(pendingPromise as any)
      
      const store = useAuthStore()
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'password123'
      }
      
      const loginPromise = store.login(credentials)
      
      // Debe estar cargando
      expect(store.isLoading).toBe(true)
      
      // Resolver la promesa
      resolvePromise({
        data: {
          access_token: 'token',
          token_type: 'bearer'
        },
        error: undefined
      })
      
      await loginPromise
      
      // Ya no debe estar cargando
      expect(store.isLoading).toBe(false)
    })
  })

  describe('Register', () => {
    it('debe registrar un nuevo usuario exitosamente', async () => {
      const { apiCall } = await import('@/utils/api')
      
      // Mock de registro exitoso
      vi.mocked(apiCall).mockResolvedValueOnce({
        data: {
          access_token: 'new-user-token',
          token_type: 'bearer',
          refresh_token: 'new-user-refresh-token'
        },
        error: undefined
      })

      // Mock de getCurrentUser
      vi.mocked(apiCall).mockResolvedValueOnce({
        data: {
          id: '2',
          email: 'newuser@example.com',
          username: 'newuser',
          is_active: true,
          is_superuser: false,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        error: undefined
      })
      
      const store = useAuthStore()
      const registerData: RegisterData = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        acceptTerms: true
      }
      
      const result = await store.register(registerData)
      
      expect(result.success).toBe(true)
      expect(store.error).toBeNull()
      expect(localStorage.getItem('token')).toBe('new-user-token')
    })

    it('debe manejar email ya registrado', async () => {
      const { apiCall } = await import('@/utils/api')
      
      // Mock de error por email duplicado
      vi.mocked(apiCall).mockResolvedValueOnce({
        data: null,
        error: 'Email already registered'
      })
      
      const store = useAuthStore()
      const registerData: RegisterData = {
        username: 'testuser',
        email: 'existing@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        acceptTerms: true
      }
      
      const result = await store.register(registerData)
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Email already registered')
      expect(store.error).toBe('Email already registered')
      expect(store.user).toBeNull()
    })

    it('debe manejar username ya registrado', async () => {
      const { apiCall } = await import('@/utils/api')
      
      // Mock de error por username duplicado
      vi.mocked(apiCall).mockResolvedValueOnce({
        data: null,
        error: 'Username already taken'
      })
      
      const store = useAuthStore()
      const registerData: RegisterData = {
        username: 'existinguser',
        email: 'newuser@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        acceptTerms: true
      }
      
      const result = await store.register(registerData)
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Username already taken')
    })
  })

  describe('Logout', () => {
    it('debe hacer logout correctamente', async () => {
      const { apiCall } = await import('@/utils/api')
      
      // Configurar estado autenticado
      localStorage.setItem('token', 'test-token')
      localStorage.setItem('refreshToken', 'test-refresh-token')
      
      const store = useAuthStore()
      store.user = {
        id: '1',
        email: 'test@example.com',
        username: 'testuser',
        is_active: true,
        is_superuser: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
      
      // Mock de logout exitoso
      vi.mocked(apiCall).mockResolvedValueOnce({
        data: { message: 'Logged out successfully' },
        error: undefined
      })
      
      await store.logout()
      
      expect(store.user).toBeNull()
      expect(localStorage.getItem('token')).toBeNull()
      expect(localStorage.getItem('refreshToken')).toBeNull()
      expect(store.isAuthenticated).toBe(false)
    })

    it('debe limpiar el estado incluso si la API falla', async () => {
      const { apiCall } = await import('@/utils/api')
      
      // Configurar estado autenticado
      localStorage.setItem('token', 'test-token')
      const store = useAuthStore()
      store.user = {
        id: '1',
        email: 'test@example.com',
        username: 'testuser',
        is_active: true,
        is_superuser: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
      
      // Mock de error en logout
      vi.mocked(apiCall).mockRejectedValueOnce(new Error('Network error'))
      
      await store.logout()
      
      // Debe limpiar el estado de todos modos
      expect(store.user).toBeNull()
      expect(localStorage.getItem('token')).toBeNull()
    })
  })

  describe('Error handling', () => {
    it('debe limpiar el error con clearError()', () => {
      const store = useAuthStore()
      store.error = 'Some error'
      
      store.clearError()
      
      expect(store.error).toBeNull()
    })
  })

  describe('Getters', () => {
    it('isAuthenticated debe ser true solo cuando hay token, usuario y está inicializado', async () => {
      const store = useAuthStore()
      
      // Sin token ni usuario
      expect(store.isAuthenticated).toBe(false)
      
      // Solo con token en localStorage pero sin usuario
      localStorage.setItem('token', 'test-token')
      expect(store.isAuthenticated).toBe(false)
      
      // Con token y usuario, y el store inicializado
      store.user = {
        id: '1',
        email: 'test@example.com',
        username: 'testuser',
        is_active: true,
        is_superuser: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
      
      // Necesitamos marcar como inicializado después de cargar el usuario
      await store.initialize()
      
      expect(store.isAuthenticated).toBe(true)
    })
  })
})
