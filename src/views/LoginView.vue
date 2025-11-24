<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1 class="login-title">
          <IconLock class="lock-icon" />
          Iniciar Sesión
        </h1>
        <p class="login-subtitle">Accede a tu cuenta</p>
      </div>

      <!-- Formulario de Login -->
      <form v-if="!authStore.requires2FA" @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            v-model="credentials.email"
            type="email"
            class="form-input"
            :class="{ 'form-input--error': errors.email }"
            placeholder="tu@email.com"
            required
            autocomplete="email"
            :disabled="authStore.isLoading"
            data-testid="email-input"
          />
          <span v-if="errors.email" class="form-error">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Contraseña</label>
          <div class="password-input-wrapper">
            <input
              id="password"
              v-model="credentials.password"
              :type="showPassword ? 'text' : 'password'"
              class="form-input"
              :class="{ 'form-input--error': errors.password }"
              placeholder="••••••••"
              required
              autocomplete="current-password"
              :disabled="authStore.isLoading"
              data-testid="password-input"
            />
            <button
              type="button"
              @click="togglePasswordVisibility"
              class="password-toggle"
              :disabled="authStore.isLoading"
            >
              <IconEye v-if="!showPassword" />
              <IconEyeSlash v-else />
            </button>
          </div>
          <span v-if="errors.password" class="form-error">{{ errors.password }}</span>
        </div>

        <div class="form-group">
          <label class="checkbox-wrapper">
            <input
              v-model="credentials.rememberMe"
              type="checkbox"
              class="checkbox-input"
              :disabled="authStore.isLoading"
            />
            <span class="checkbox-label">Recordarme</span>
          </label>
        </div>

        <button
          type="submit"
          class="login-button"
          :disabled="authStore.isLoading || !isFormValid"
          data-testid="login-button"
        >
          <span v-if="authStore.isLoading" class="loading-spinner"></span>
          {{ authStore.isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
        </button>

        <div v-if="authStore.error" class="error-message" data-testid="error-message">
          {{ authStore.error }}
          <button @click="authStore.clearError()" class="error-close">×</button>
        </div>
      </form>

      <!-- Formulario 2FA -->
      <form v-else @submit.prevent="handle2FA" class="twofa-form">
        <div class="twofa-header">
          <IconShield class="shield-icon" />
          <h2>Verificación en dos pasos</h2>
          <p>Ingresa el código de tu aplicación de autenticación</p>
        </div>

        <div class="form-group">
          <label for="twofa-code" class="form-label">Código de verificación</label>
          <input
            id="twofa-code"
            v-model="twoFactorCode"
            type="text"
            class="form-input twofa-input"
            :class="{ 'form-input--error': errors.twoFactorCode }"
            placeholder="123456"
            maxlength="6"
            required
            autocomplete="one-time-code"
            :disabled="authStore.isLoading"
            data-testid="2fa-code-input"
            @input="formatTwoFactorCode"
          />
          <span v-if="errors.twoFactorCode" class="form-error">{{ errors.twoFactorCode }}</span>
        </div>

        <div class="form-group">
          <details class="recovery-details">
            <summary>¿Perdiste acceso a tu dispositivo?</summary>
            <div class="recovery-content">
              <label for="recovery-code" class="form-label">Código de recuperación</label>
              <input
                id="recovery-code"
                v-model="recoveryCode"
                type="text"
                class="form-input"
                placeholder="xxxx-xxxx-xxxx-xxxx"
                :disabled="authStore.isLoading"
                data-testid="recovery-code-input"
              />
            </div>
          </details>
        </div>

        <button
          type="submit"
          class="login-button"
          :disabled="authStore.isLoading || !is2FAFormValid"
          data-testid="verify-2fa-button"
        >
          <span v-if="authStore.isLoading" class="loading-spinner"></span>
          {{ authStore.isLoading ? 'Verificando...' : 'Verificar' }}
        </button>

        <button
          type="button"
          @click="cancelTwoFactor"
          class="cancel-button"
          :disabled="authStore.isLoading"
        >
          Cancelar
        </button>

        <div v-if="authStore.error" class="error-message" data-testid="error-message">
          {{ authStore.error }}
          <button @click="authStore.clearError()" class="error-close">×</button>
        </div>
      </form>

      <div class="login-footer">
        <router-link to="/forgot-password" class="forgot-link">
          ¿Olvidaste tu contraseña?
        </router-link>
        <div class="signup-link">
          ¿No tienes cuenta?
          <router-link to="/register" class="signup-button">
            Regístrate
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { LoginCredentials, TwoFactorData } from '@/types/auth'
import IconLock from '@/components/icons/IconLock.vue'
import IconEye from '@/components/icons/IconEye.vue'
import IconEyeSlash from '@/components/icons/IconEyeSlash.vue'
import IconShield from '@/components/icons/IconShield.vue'

const router = useRouter()
const authStore = useAuthStore()

// Form state
const credentials = ref<LoginCredentials>({
  email: '',
  password: '',
  rememberMe: false
})

const twoFactorCode = ref('')
const recoveryCode = ref('')
const showPassword = ref(false)

// Validation errors
const errors = ref<Record<string, string>>({})

// Computed properties
const isFormValid = computed(() => {
  return credentials.value.email && 
         credentials.value.password && 
         !errors.value.email && 
         !errors.value.password
})

const is2FAFormValid = computed(() => {
  return (twoFactorCode.value.length === 6) || recoveryCode.value.length > 0
})
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validateForm() {
  errors.value = {}

  if (!credentials.value.email) {
    errors.value.email = 'El email es requerido'
  } else if (!validateEmail(credentials.value.email)) {
    errors.value.email = 'Ingresa un email válido'
  }

  if (!credentials.value.password) {
    errors.value.password = 'La contraseña es requerida'
  } else if (credentials.value.password.length < 6) {
    errors.value.password = 'La contraseña debe tener al menos 6 caracteres'
  }

  return Object.keys(errors.value).length === 0
}

function validate2FAForm() {
  errors.value = {}

  if (!twoFactorCode.value && !recoveryCode.value) {
    errors.value.twoFactorCode = 'Ingresa un código de verificación o código de recuperación'
  } else if (twoFactorCode.value && twoFactorCode.value.length !== 6) {
    errors.value.twoFactorCode = 'El código debe tener 6 dígitos'
  }

  return Object.keys(errors.value).length === 0
}

async function handleLogin() {
  if (!validateForm()) return

  const result = await authStore.login(credentials.value)
  
  if (result.success) {
    if (!result.requires2FA) {
      // Redirigir al dashboard o página principal
      const redirectTo = router.currentRoute.value.query.redirect as string || '/'
      router.push(redirectTo)
    }
    // Si requiere 2FA, el formulario cambiará automáticamente
  }
}

async function handle2FA() {
  if (!validate2FAForm()) return

  const twoFactorData: TwoFactorData = {
    code: twoFactorCode.value || '',
    recovery_code: recoveryCode.value || undefined
  }

  const result = await authStore.verify2FA(twoFactorData)
  
  if (result.success) {
    const redirectTo = router.currentRoute.value.query.redirect as string || '/'
    router.push(redirectTo)
  }
}

function formatTwoFactorCode(event: Event) {
  const target = event.target as HTMLInputElement
  // Solo permitir números
  target.value = target.value.replace(/\D/g, '')
  twoFactorCode.value = target.value
}

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value
}

function cancelTwoFactor() {
  authStore.requires2FA = false
  twoFactorCode.value = ''
  recoveryCode.value = ''
  errors.value = {}
}

onMounted(() => {
  // Limpiar errores previos al montar el componente
  authStore.clearError()
  
  // Si ya está autenticado, redirigir
  if (authStore.isAuthenticated) {
    router.push('/')
  }
})
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f0c29 0%, #24243e 25%, #302b63 50%, #4b0082 75%, #6a0dad 100%);
  padding: 2rem 1rem;
  box-sizing: border-box;
}

.login-card {
  background: linear-gradient(145deg, #1e1e2f 0%, #232338 100%);
  border: 1px solid rgba(138, 43, 226, 0.3);
  border-radius: 20px;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(168, 85, 247, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  padding: 3rem;
  width: 100%;
  max-width: 450px;
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  backdrop-filter: blur(20px);
  position: relative;
}

.login-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.05) 0%, rgba(192, 132, 252, 0.05) 100%);
  border-radius: 20px;
  pointer-events: none;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0 0 0.5rem 0;
  color: #e5e7eb;
  font-size: 1.5rem;
  font-weight: 700;
}

.lock-icon {
  width: 24px;
  height: 24px;
  color: #a855f7;
}

.login-subtitle {
  margin: 0;
  color: #9ca3af;
  font-size: 0.875rem;
}

.login-form,
.twofa-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.twofa-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.shield-icon {
  width: 32px;
  height: 32px;
  color: #10b981;
  margin: 0 auto 0.5rem;
  display: block;
}

.twofa-header h2 {
  margin: 0 0 0.5rem 0;
  color: #e5e7eb;
  font-size: 1.25rem;
  font-weight: 600;
}

.twofa-header p {
  margin: 0;
  color: #9ca3af;
  font-size: 0.875rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  margin-bottom: 0.25rem;
  color: #d1d5db;
  font-size: 0.875rem;
  font-weight: 500;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid #4b5563;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background: #1f2937;
  color: #e5e7eb;
}

.form-input:focus {
  outline: none;
  border-color: #a855f7;
  box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.2);
}

.form-input--error {
  border-color: #ef4444;
}

.form-input--error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
}

.form-input:disabled {
  background-color: #374151;
  color: #6b7280;
  cursor: not-allowed;
}

.twofa-input {
  text-align: center;
  font-size: 1.25rem;
  letter-spacing: 0.25rem;
  font-weight: 600;
}

.password-input-wrapper {
  position: relative;
  width: 100%;
}

.password-input-wrapper .form-input {
  width: 100%;
  padding-right: 2.5rem;
  box-sizing: border-box;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: color 0.2s ease;
}

.password-toggle:hover {
  color: #d1d5db;
}

.password-toggle:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-input {
  width: 16px;
  height: 16px;
  accent-color: #a855f7;
}

.checkbox-label {
  color: #d1d5db;
  font-size: 0.875rem;
}

.recovery-details {
  margin-top: 0.5rem;
}

.recovery-details summary {
  cursor: pointer;
  color: #a855f7;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.recovery-details summary:hover {
  text-decoration: underline;
}

.recovery-content {
  padding-top: 0.5rem;
}

.login-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.5rem;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(168, 85, 247, 0.4);
}

.login-button:active:not(:disabled) {
  transform: translateY(0);
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.cancel-button {
  padding: 0.5rem 1rem;
  background: transparent;
  color: #9ca3af;
  border: 1px solid #4b5563;
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-button:hover:not(:disabled) {
  background: #374151;
  color: #d1d5db;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.form-error {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.error-message {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(239, 68, 68, 0.1);
  color: #fca5a5;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(239, 68, 68, 0.3);
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.error-close {
  background: none;
  border: none;
  color: #fca5a5;
  cursor: pointer;
  font-size: 1.25rem;
  font-weight: bold;
  padding: 0;
  margin-left: 0.5rem;
}

.login-footer {
  margin-top: 2rem;
  text-align: center;
}

.forgot-link {
  display: block;
  color: #a855f7;
  text-decoration: none;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  background: transparent;
}

.forgot-link:hover {
  text-decoration: none;
  background: rgba(168, 85, 247, 0.1);
  color: #c084fc;
}

.signup-link {
  color: #9ca3af;
  font-size: 0.875rem;
}

.signup-button {
  color: #a855f7;
  text-decoration: none;
  font-weight: 600;
  margin-left: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  background: transparent;
}

.signup-button:hover {
  text-decoration: none;
  background: rgba(168, 85, 247, 0.1);
  color: #c084fc;
}

.signup-button:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-card {
    padding: 1.5rem;
    margin: 0.5rem;
  }
  
  .login-title {
    font-size: 1.25rem;
  }
}
</style>