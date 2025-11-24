<template>
  <div class="retro-register-container">
    <!-- Canvas Matrix de fondo -->
    <canvas 
      ref="matrixCanvas"
      class="matrix-bg"
    ></canvas>
    
    <div class="retro-register-content">
      <div class="retro-register-card">
        <div class="retro-header">
          <h2 class="retro-title">NEW USER REGISTRATION</h2>
          <div class="retro-line"></div>
        </div>

        <form @submit.prevent="handleRegister" class="retro-form">
          <div class="retro-form-group">
            <label class="retro-label">USERNAME:</label>
            <input 
              v-model="registerData.username"
              type="text" 
              class="retro-input"
              :class="{ 'retro-input--error': errors.username }"
              placeholder="Enter username..."
              required 
            />
            <span v-if="errors.username" class="retro-error-text">{{ errors.username }}</span>
          </div>

          <div class="retro-form-group">
            <label class="retro-label">EMAIL:</label>
            <input 
              v-model="registerData.email"
              type="email" 
              class="retro-input"
              :class="{ 'retro-input--error': errors.email }"
              placeholder="Enter email..."
              required 
            />
            <span v-if="errors.email" class="retro-error-text">{{ errors.email }}</span>
          </div>

          <div class="retro-form-group">
            <label class="retro-label">FULL NAME (OPTIONAL):</label>
            <input 
              v-model="registerData.full_name"
              type="text" 
              class="retro-input"
              :class="{ 'retro-input--error': errors.full_name }"
              placeholder="Enter full name..."
            />
            <span v-if="errors.full_name" class="retro-error-text">{{ errors.full_name }}</span>
          </div>
          
          <div class="retro-form-group">
            <label class="retro-label">PASSWORD:</label>
            <input 
              v-model="registerData.password"
              type="password" 
              class="retro-input"
              :class="{ 'retro-input--error': errors.password }"
              placeholder="Enter password..."
              maxlength="72"
              required 
            />
            <span v-if="errors.password" class="retro-error-text">{{ errors.password }}</span>
          </div>

          <div class="retro-form-group">
            <label class="retro-label">CONFIRM PASSWORD:</label>
            <input 
              v-model="registerData.confirmPassword"
              type="password" 
              class="retro-input"
              :class="{ 'retro-input--error': errors.confirmPassword }"
              placeholder="Confirm password..."
              maxlength="72"
              required 
            />
            <span v-if="errors.confirmPassword" class="retro-error-text">{{ errors.confirmPassword }}</span>
          </div>

          <div class="retro-form-group retro-checkbox-group">
            <label class="retro-checkbox-label">
              <input 
                v-model="registerData.acceptTerms"
                type="checkbox" 
                class="retro-checkbox"
                required 
              />
              I ACCEPT THE TERMS AND CONDITIONS
            </label>
            <span v-if="errors.acceptTerms" class="retro-error-text">{{ errors.acceptTerms }}</span>
          </div>
          
          <div v-if="authStore.error" class="retro-error">
            {{ authStore.error }}
          </div>
          
          <button 
            type="submit" 
            class="retro-button"
            :disabled="authStore.isLoading || !isFormValid"
          >
            {{ authStore.isLoading ? 'REGISTERING...' : 'REGISTER' }}
          </button>
        </form>

        <div class="retro-footer">
          <div class="retro-line"></div>
          <p class="retro-text">
            ALREADY HAVE AN ACCOUNT?
            <router-link to="/login" class="retro-link">ACCESS SYSTEM</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import type { RegisterData } from '@/types/auth'

interface ValidationErrors {
  username?: string
  email?: string
  full_name?: string
  password?: string
  confirmPassword?: string
  acceptTerms?: string
}

const authStore = useAuthStore()
const router = useRouter()
const matrixCanvas = ref<HTMLCanvasElement | null>(null)
let animationId: number | null = null

const registerData = ref<RegisterData>({
  username: '',
  email: '',
  full_name: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const errors = ref<ValidationErrors>({})

const validateForm = (): boolean => {
  errors.value = {}

  // Validar username
  if (!registerData.value.username.trim()) {
    errors.value.username = 'Username is required'
  } else if (registerData.value.username.length < 3) {
    errors.value.username = 'Username must be at least 3 characters'
  } else if (registerData.value.username.length > 50) {
    errors.value.username = 'Username must be less than 50 characters'
  }

  // Validar email
  if (!registerData.value.email.trim()) {
    errors.value.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.value.email)) {
    errors.value.email = 'Please enter a valid email address'
  }

  // Validar password
  if (!registerData.value.password) {
    errors.value.password = 'Password is required'
  } else if (registerData.value.password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
  } else if (registerData.value.password.length > 72) {
    errors.value.password = 'Password must be less than 72 characters'
  }

  // Validar confirmPassword
  if (!registerData.value.confirmPassword) {
    errors.value.confirmPassword = 'Please confirm your password'
  } else if (registerData.value.password !== registerData.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match'
  }

  // Validar acceptTerms
  if (!registerData.value.acceptTerms) {
    errors.value.acceptTerms = 'You must accept the terms and conditions'
  }

  return Object.keys(errors.value).length === 0
}

const isFormValid = computed(() => {
  return registerData.value.username.trim() !== '' &&
         registerData.value.username.length >= 3 &&
         registerData.value.username.length <= 50 &&
         registerData.value.email.trim() !== '' &&
         registerData.value.password !== '' &&
         registerData.value.password.length >= 6 &&
         registerData.value.password.length <= 72 &&
         registerData.value.confirmPassword !== '' &&
         registerData.value.password === registerData.value.confirmPassword &&
         registerData.value.acceptTerms &&
         /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.value.email)
})

const handleRegister = async () => {
  if (!validateForm()) {
    return
  }

  try {
    await authStore.register({
      username: registerData.value.username,
      email: registerData.value.email,
      password: registerData.value.password,
      full_name: registerData.value.full_name || undefined,
      confirmPassword: registerData.value.confirmPassword,
      acceptTerms: registerData.value.acceptTerms
    })
    
    // Si el registro es exitoso, redirigir al dashboard
    router.push('/dashboard')
  } catch (error) {
    // Los errores se manejan en el store
    console.error('Registration failed:', error)
  }
}

// Función para inicializar el efecto Matrix
const initMatrixEffect = () => {
  if (!matrixCanvas.value) return

  const canvas = matrixCanvas.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Redimensionar canvas
  const resizeCanvas = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)

  // Caracteres para el efecto Matrix (igual que LoginView)
  const chars = [
    'ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ',
    'サ', 'シ', 'ス', 'セ', 'ソ', 'タ', 'チ', 'ツ', 'テ', 'ト',
    'ナ', 'ニ', 'ヌ', 'ネ', 'ノ', 'ハ', 'ヒ', 'フ', 'ヘ', 'ホ',
    'マ', 'ミ', 'ム', 'メ', 'モ', 'ヤ', 'ユ', 'ヨ', 'ラ', 'リ',
    'ル', 'レ', 'ロ', 'ワ', 'ヲ', 'ン', '0', '1', '2', '3', '4',
    '5', '6', '7', '8', '9'
  ]
  const fontSize = 20
  const columns = Math.floor(canvas.width / fontSize)
  const drops: number[] = Array(columns).fill(1).map(() => Math.random() * -100)
  const charStability: string[] = Array(columns).fill('0')
  const charTimer: number[] = Array(columns).fill(0)
  
  // Función de animación
  const draw = () => {
    // Fondo más agresivo para eliminar estelas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Configurar texto para máxima nitidez
    ctx.font = `bold ${fontSize}px 'Courier New', monospace`
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    // Propiedades para texto súper nítido
    ctx.imageSmoothingEnabled = false
    ctx.fillStyle = '#00ff41'  // Color base sólido
    
    for (let i = 0; i < drops.length; i++) {
      // Incrementar timer para este carácter
      charTimer[i] = (charTimer[i] || 0) + 1
      
      // Solo cambiar el carácter cada 120-180 frames (2-3 segundos)
      if ((charTimer[i] || 0) > Math.random() * 60 + 120) {
        charStability[i] = chars[Math.floor(Math.random() * chars.length)] || '0'
        charTimer[i] = 0
      }
      
      const char = charStability[i] || '0'
      const x = i * fontSize
      const y = (drops[i] || 0) * fontSize
      
      // Solo dibujar si está en pantalla
      if (y > 0 && y < canvas.height) {
        // Caracteres súper nítidos sin difuminado
        const distanceFromTop = y / canvas.height
        // Solo el primer 10% más brillante, el resto completamente sólido
        const alpha = distanceFromTop < 0.1 ? 1 : 0.8  // Sin degradado, solo cambio abrupto
        
        // Color verde Matrix clásico
        ctx.fillStyle = `rgba(0, 255, 65, ${alpha})`
        
        // Dibujar con posición exacta
        ctx.fillText(char, x, y)
      }
      
      // Movimiento súper lento: 0.2 pixels por frame
      drops[i] = (drops[i] || 0) + 0.2
      
      // Reset cuando sale de pantalla o randomly para mantener la lluvia
      if ((drops[i] || 0) * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = Math.random() * -100  // Start fuera de pantalla arriba
        charTimer[i] = 0  // Reset character timer
      }
    }

    animationId = requestAnimationFrame(draw)
  }

  draw()
}

onMounted(() => {
  initMatrixEffect()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<style scoped>
.retro-register-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #000;
  font-family: 'Courier New', monospace;
}

.matrix-bg {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  pointer-events: none;
}

.retro-register-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
}

.retro-register-card {
  background: rgba(0, 0, 0, 0.85);
  border: 2px solid #00ff41;
  border-radius: 0;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 
    0 0 20px rgba(0, 255, 65, 0.3),
    inset 0 0 20px rgba(0, 255, 65, 0.1);
  position: relative;
}

.retro-register-card::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #00ff41, transparent, #00ff41);
  z-index: -1;
  border-radius: 0;
}

.retro-header {
  text-align: center;
  margin-bottom: 2rem;
}

.retro-title {
  color: #00ff41;
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 3px;
  margin: 0 0 1rem 0;
  text-shadow: 0 0 10px rgba(0, 255, 65, 0.5);
  animation: flicker 2s infinite alternate;
}

@keyframes flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.retro-line {
  height: 2px;
  background: linear-gradient(90deg, transparent, #00ff41, transparent);
  margin: 1rem 0;
}

.retro-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.retro-form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.retro-label {
  color: #00ff41;
  font-size: 0.9rem;
  font-weight: bold;
  letter-spacing: 1px;
  text-shadow: 0 0 5px rgba(0, 255, 65, 0.3);
}

.retro-input {
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid #00ff41;
  color: #00ff41;
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  padding: 0.75rem;
  border-radius: 0;
  transition: all 0.3s ease;
}

.retro-input:focus {
  outline: none;
  border-color: #00ff41;
  box-shadow: 
    0 0 10px rgba(0, 255, 65, 0.5),
    inset 0 0 5px rgba(0, 255, 65, 0.2);
  background: rgba(0, 255, 65, 0.05);
}

.retro-input::placeholder {
  color: rgba(0, 255, 65, 0.5);
  font-style: italic;
}

.retro-input--error {
  border-color: #ff0000;
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
}

.retro-error-text {
  color: #ff0000;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  text-shadow: 0 0 3px rgba(255, 0, 0, 0.3);
}

.retro-checkbox-group {
  margin: 1rem 0;
}

.retro-checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #00ff41;
  cursor: pointer;
  font-size: 0.9rem;
  letter-spacing: 1px;
}

.retro-checkbox {
  width: 18px;
  height: 18px;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid #00ff41;
  border-radius: 0;
  cursor: pointer;
  position: relative;
}

.retro-checkbox:checked {
  background: #00ff41;
}

.retro-checkbox:checked::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #000;
  font-weight: bold;
  font-size: 12px;
}

.retro-error {
  background: rgba(255, 0, 0, 0.1);
  border: 1px solid #ff0000;
  color: #ff0000;
  padding: 0.75rem;
  border-radius: 0;
  text-align: center;
  font-size: 0.9rem;
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.2);
}

.retro-button {
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid #00ff41;
  color: #00ff41;
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  font-weight: bold;
  letter-spacing: 2px;
  padding: 1rem 2rem;
  border-radius: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.retro-button:hover:not(:disabled) {
  background: rgba(0, 255, 65, 0.1);
  box-shadow: 
    0 0 20px rgba(0, 255, 65, 0.5),
    inset 0 0 10px rgba(0, 255, 65, 0.1);
  transform: translateY(-2px);
}

.retro-button:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 0 10px rgba(0, 255, 65, 0.3);
}

.retro-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: rgba(0, 0, 0, 0.6);
}

.retro-footer {
  margin-top: 2rem;
  text-align: center;
}

.retro-text {
  color: rgba(0, 255, 65, 0.7);
  font-size: 0.9rem;
  margin: 0;
  letter-spacing: 1px;
}

.retro-link {
  color: #00ff41;
  text-decoration: none;
  font-weight: bold;
  text-shadow: 0 0 5px rgba(0, 255, 65, 0.3);
  transition: all 0.3s ease;
}

.retro-link:hover {
  text-shadow: 0 0 10px rgba(0, 255, 65, 0.8);
  letter-spacing: 2px;
}

/* Animación de scanlines */
.retro-register-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 255, 65, 0.03) 2px,
    rgba(0, 255, 65, 0.03) 4px
  );
  pointer-events: none;
  z-index: 1;
}

/* Responsive design */
@media (max-width: 768px) {
  .retro-register-content {
    padding: 1rem;
  }
  
  .retro-register-card {
    padding: 1.5rem;
    max-width: 100%;
  }
  
  .retro-title {
    font-size: 1.2rem;
    letter-spacing: 2px;
  }
  
  .retro-input {
    font-size: 0.9rem;
    padding: 0.6rem;
  }
  
  .retro-button {
    font-size: 0.9rem;
    padding: 0.8rem 1.5rem;
    letter-spacing: 1px;
  }
}
</style>