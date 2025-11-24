export interface User {
  id: string
  email: string
  username: string
  firstName: string
  lastName: string
  role: 'admin' | 'user' | 'moderator'
  isEmailVerified: boolean
  twoFactorEnabled: boolean
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

export interface TwoFactorData {
  code: string
  recovery_code?: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  user: User
  requires_2fa?: boolean
  temp_token?: string
  message?: string
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  statusCode: number
}