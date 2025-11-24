export interface User {
  id: string
  email: string
  username: string
  full_name?: string
  is_active: boolean
  is_superuser: boolean
  created_at: string
  updated_at: string
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  username: string
  email: string
  password: string
  full_name?: string
  confirmPassword: string
  acceptTerms: boolean
}

export interface TwoFactorData {
  code: string
  recovery_code?: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  refresh_token?: string
  user?: User
  requires_2fa?: boolean
  temp_token?: string
  message?: string
  detail?: string | any
}

export interface ApiError {
  detail: string | any
  message?: string
  errors?: Record<string, string[]>
  statusCode?: number
}