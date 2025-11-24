<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h1 class="register-title">
          <IconUser class="user-icon" />
          Crear Cuenta
        </h1>
        <p class="register-subtitle">Únete a nuestra plataforma</p>
      </div>

      <form @submit.prevent="handleRegister" class="register-form">
        <!-- Nombre -->
        <div class="form-group">
          <label for="firstName" class="form-label">Nombre</label>
          <input
            id="firstName"
            v-model="registerData.firstName"
            type="text"
            class="form-input"
            :class="{ 'form-input--error': errors.firstName }"
            placeholder="Tu nombre"
            required
            autocomplete="given-name"
            :disabled="authStore.isLoading"
            data-testid="first-name-input"
          />
          <span v-if="errors.firstName" class="form-error">{{ errors.firstName }}</span>
        </div>

        <!-- Apellido -->
        <div class="form-group">
          <label for="lastName" class="form-label">Apellido</label>
          <input
            id="lastName"
            v-model="registerData.lastName"
            type="text"
            class="form-input"
            :class="{ 'form-input--error': errors.lastName }"
            placeholder="Tu apellido"
            required
            autocomplete="family-name"
            :disabled="authStore.isLoading"
            data-testid="last-name-input"
          />
          <span v-if="errors.lastName" class="form-error">{{ errors.lastName }}</span>
        </div>

        <!-- Email -->
        <div class="form-group">
          <label for="email" class="form-label">Correo Electrónico</label>
          <input
            id="email"
            v-model="registerData.email"
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

        <!-- Contraseña -->
        <div class="form-group">
          <label for="password" class="form-label">Contraseña</label>
          <div class="password-input-wrapper">
            <input
              id="password"
              v-model="registerData.password"
              :type="showPassword ? 'text' : 'password'"
              class="form-input"
              :class="{ 'form-input--error': errors.password }"
              placeholder="Mínimo 8 caracteres"
              required
              autocomplete="new-password"
              :disabled="authStore.isLoading"
              data-testid="password-input"
            />
            <button
              type="button"
              @click="togglePasswordVisibility"
              class="password-toggle"
              :disabled="authStore.isLoading"
              data-testid="password-toggle"
            >
              <IconEye v-if="showPassword" />
              <IconEyeSlash v-else />
            </button>
          </div>
          <span v-if="errors.password" class="form-error">{{ errors.password }}</span>
        </div>

        <!-- Confirmar Contraseña -->
        <div class="form-group">
          <label for="confirmPassword" class="form-label">Confirmar Contraseña</label>
          <div class="password-input-wrapper">
            <input
              id="confirmPassword"
              v-model="registerData.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              class="form-input"
              :class="{ 'form-input--error': errors.confirmPassword }"
              placeholder="Repite tu contraseña"
              required
              autocomplete="new-password"
              :disabled="authStore.isLoading"
              data-testid="confirm-password-input"
            />
            <button
              type="button"
              @click="toggleConfirmPasswordVisibility"
              class="password-toggle"
              :disabled="authStore.isLoading"
              data-testid="confirm-password-toggle"
            >
              <IconEye v-if="showConfirmPassword" />
              <IconEyeSlash v-else />
            </button>
          </div>
          <span v-if="errors.confirmPassword" class="form-error">{{ errors.confirmPassword }}</span>
        </div>

        <!-- Términos y condiciones -->
        <div class="form-group">
          <label class="checkbox-wrapper">
            <input
              v-model="registerData.acceptTerms"
              type="checkbox"
              class="checkbox-input"
              :disabled="authStore.isLoading"
              data-testid="terms-checkbox"
            />
            <span class="checkbox-label">
              Acepto los <a href="#" class="terms-link">términos y condiciones</a>
            </span>
          </label>
          <span v-if="errors.acceptTerms" class="form-error">{{ errors.acceptTerms }}</span>
        </div>

        <!-- Botón de registro -->
        <button
          type="submit"
          class="register-button"
          :disabled="authStore.isLoading || !isFormValid"
          data-testid="register-button"
        >
          <span v-if="authStore.isLoading" class="loading-spinner"></span>
          <IconUser v-else />
          {{ authStore.isLoading ? 'Creando cuenta...' : 'Crear Cuenta' }}
        </button>

        <!-- Mensaje de error -->
        <div v-if="authStore.error" class="error-message" data-testid="error-message">
          {{ authStore.error }}
          <button
            type="button"
            @click="authStore.clearError"
            class="error-close"
            data-testid="error-close"
          >
            ×
          </button>
        </div>
      </form>

      <div class="register-footer">
        <p class="login-link">
          ¿Ya tienes cuenta?
          <RouterLink to="/login" class="login-button">
            Inicia Sesión
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { RegisterData } from '@/types/auth'
import IconUser from '@/components/icons/IconUser.vue'
import IconEye from '@/components/icons/IconEye.vue'
import IconEyeSlash from '@/components/icons/IconEyeSlash.vue'

const router = useRouter()
const authStore = useAuthStore()

// Form state
const registerData = ref<RegisterData>({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Validation errors
const errors = ref<Record<string, string>>({})

// Computed properties
const isFormValid = computed(() => {
  return validateForm() && registerData.value.acceptTerms
})

// Validation functions
function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

function validateForm(): boolean {
  errors.value = {}

  // Validar nombre
  if (!registerData.value.firstName.trim()) {
    errors.value.firstName = 'El nombre es requerido'
  } else if (registerData.value.firstName.length < 2) {
    errors.value.firstName = 'El nombre debe tener al menos 2 caracteres'
  }

  // Validar apellido
  if (!registerData.value.lastName.trim()) {
    errors.value.lastName = 'El apellido es requerido'
  } else if (registerData.value.lastName.length < 2) {
    errors.value.lastName = 'El apellido debe tener al menos 2 caracteres'
  }

  // Validar email
  if (!registerData.value.email) {
    errors.value.email = 'El email es requerido'
  } else if (!validateEmail(registerData.value.email)) {
    errors.value.email = 'Ingresa un email válido'
  }

  // Validar contraseña
  if (!registerData.value.password) {
    errors.value.password = 'La contraseña es requerida'
  } else if (registerData.value.password.length < 8) {
    errors.value.password = 'La contraseña debe tener al menos 8 caracteres'
  }

  // Validar confirmación de contraseña
  if (!registerData.value.confirmPassword) {
    errors.value.confirmPassword = 'Confirma tu contraseña'
  } else if (registerData.value.password !== registerData.value.confirmPassword) {
    errors.value.confirmPassword = 'Las contraseñas no coinciden'
  }

  // Validar términos y condiciones
  if (!registerData.value.acceptTerms) {
    errors.value.acceptTerms = 'Debes aceptar los términos y condiciones'
  }

  return Object.keys(errors.value).length === 0
}

async function handleRegister() {
  if (!validateForm()) return

  const result = await authStore.register(registerData.value)
  
  if (result.success) {
    // Redirigir al dashboard o mostrar mensaje de verificación
    const redirectTo = router.currentRoute.value.query.redirect as string || '/dashboard'
    router.push(redirectTo)
  }
}

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value
}

function toggleConfirmPasswordVisibility() {
  showConfirmPassword.value = !showConfirmPassword.value
}
</script>

<style scoped>
.register-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f0c29 0%, #24243e 25%, #302b63 50%, #4b0082 75%, #6a0dad 100%);
  padding: 2rem 1rem;
  box-sizing: border-box;
  overflow-y: auto;
}

.register-card {
  background: linear-gradient(145deg, #1e1e2f 0%, #232338 100%);
  border: 1px solid rgba(138, 43, 226, 0.3);
  border-radius: 20px;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(168, 85, 247, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  padding: 3rem;
  width: 100%;
  max-width: 500px;
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  backdrop-filter: blur(20px);
  position: relative;
  margin: auto;
  overflow: visible;
}

.register-card::before {
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

.register-header {
  text-align: center;
  margin-bottom: 2rem;
}

.register-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0 0 0.5rem 0;
  color: #e5e7eb;
  font-size: 1.5rem;
  font-weight: 700;
}

.user-icon {
  width: 20px;
  height: 20px;
  color: #a855f7;
}

.register-subtitle {
  margin: 0;
  color: #9ca3af;
  font-size: 0.875rem;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
  width: 100%;
  box-sizing: border-box;
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
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-input {
  width: 16px;
  height: 16px;
  accent-color: #a855f7;
  margin-top: 0.125rem;
  flex-shrink: 0;
}

.checkbox-label {
  color: #d1d5db;
  font-size: 0.875rem;
  line-height: 1.4;
}

.terms-link {
  color: #a855f7;
  text-decoration: none;
  transition: color 0.2s ease;
}

.terms-link:hover {
  color: #c084fc;
  text-decoration: underline;
}

.register-button {
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

.register-button svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.register-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(168, 85, 247, 0.4);
}

.register-button:active:not(:disabled) {
  transform: translateY(0);
}

.register-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
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

.register-footer {
  margin-top: 2rem;
  text-align: center;
}

.login-link {
  color: #9ca3af;
  font-size: 0.875rem;
  margin: 0;
}

.login-button {
  color: #a855f7;
  text-decoration: none;
  font-weight: 600;
  margin-left: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  background: transparent;
}

.login-button:hover {
  text-decoration: none;
  background: rgba(168, 85, 247, 0.1);
  color: #c084fc;
}

@media (max-width: 480px) {
  .register-container {
    padding: 1rem 0.5rem;
    align-items: flex-start;
    min-height: 100vh;
  }
  
  .register-card {
    padding: 1.5rem;
    margin: 0.5rem 0;
    max-width: none;
    width: 100%;
  }
  
  .register-title {
    font-size: 1.25rem;
  }
  
  .form-group {
    gap: 0.75rem;
  }
}
</style>