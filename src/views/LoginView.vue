<template>
  <div class="retro-login-container">
    <!-- Canvas Matrix de fondo -->
    <canvas 
      ref="matrixCanvas"
      class="matrix-bg"
    ></canvas>
    
    <div class="retro-login-content">
      <div class="retro-login-card">
        <div class="retro-header">
          <h2 class="retro-title">SYSTEM ACCESS</h2>
          <div class="retro-line"></div>
        </div>

        
        <form @submit.prevent="handleLogin" class="retro-form">
          <div class="retro-form-group">
            <label class="retro-label">USERNAME:</label>
            <input 
              v-model="credentials.email" 
              type="email" 
              class="retro-input"
              placeholder="Enter username..."
              required 
            />
          </div>
          
          <div class="retro-form-group">
            <label class="retro-label">PASSWORD:</label>
            <input 
              v-model="credentials.password" 
              type="password" 
              class="retro-input"
              placeholder="Enter password..."
              required 
            />
          </div>
          
          <div v-if="authStore.error" class="retro-error">
            {{ authStore.error }}
          </div>
          
          <button 
            type="submit" 
            class="retro-button"
            :disabled="authStore.isLoading"
          >
            {{ authStore.isLoading ? 'ACCESSING...' : 'LOGIN' }}
          </button>
        </form>
        
        <div class="retro-footer">
          <p class="retro-link-text">Need access? <router-link to="/register" class="retro-link">[REGISTER]</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { LoginCredentials } from '@/types/auth'

const router = useRouter()
const authStore = useAuthStore()

// Formulario
const credentials = ref<LoginCredentials>({
  email: '',
  password: '',
  rememberMe: false
})

// Matrix Effect
const matrixCanvas = ref<HTMLCanvasElement | null>(null)
let animationId: number

function initMatrixEffect() {
  if (!matrixCanvas.value) {
    console.log('Canvas no encontrado')
    return
  }
  
  const canvas = matrixCanvas.value
  const ctx = canvas.getContext('2d')
  
  if (!ctx) {
    console.log('Contexto 2D no disponible')
    return
  }
  
  // Configurar canvas
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  
  // Configuración Matrix con caracteres japoneses
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
        ctx.fillText(char, x, y)
      }
      
      // Reiniciar la gota cuando sale de pantalla
      if ((drops[i] || 0) * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0
        charStability[i] = chars[Math.floor(Math.random() * chars.length)] || '0'
        charTimer[i] = 0
      }
      
      drops[i] = (drops[i] || 0) + 0.2  // Velocidad extremadamente lenta
    }
  }
  
  const animate = () => {
    draw()
    animationId = requestAnimationFrame(animate)
  }
  
  animate()
}

// Manejo del login
async function handleLogin() {
  const result = await authStore.login(credentials.value)
  
  if (result.success) {
    const redirectTo = router.currentRoute.value.query.redirect as string || '/'
    router.push(redirectTo)
  }
}

// Lifecycle
onMounted(() => {
  authStore.clearError()
  
  setTimeout(() => {
    initMatrixEffect()
  }, 100)
  
  window.addEventListener('resize', () => {
    if (matrixCanvas.value) {
      matrixCanvas.value.width = window.innerWidth
      matrixCanvas.value.height = window.innerHeight
    }
  })
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>


<style scoped>
.retro-login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #000000 0%, #001100 100%);
  position: relative;
  overflow: hidden;
}

.matrix-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

.retro-login-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 400px;
  padding: 0 24px;
}

.retro-login-card {
  background: rgba(0, 0, 0, 0.85);
  border: 2px solid #00ff41;
  border-radius: 0;
  padding: 32px;
  backdrop-filter: blur(10px);
  box-shadow: 
    0 0 20px rgba(0, 255, 65, 0.3),
    inset 0 0 20px rgba(0, 255, 65, 0.1);
}

.retro-header {
  text-align: center;
  margin-bottom: 32px;
}

.retro-title {
  font-family: 'Courier New', monospace;
  font-size: 24px;
  font-weight: bold;
  color: #00ff41;
  margin: 0 0 16px 0;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(0, 255, 65, 0.8);
}

.retro-line {
  height: 2px;
  background: linear-gradient(90deg, transparent, #00ff41, transparent);
  margin: 0 auto;
  animation: pulse 2s ease-in-out infinite alternate;
}

@keyframes pulse {
  from { opacity: 0.5; }
  to { opacity: 1; }
}

.retro-form {
  margin-bottom: 24px;
}

.retro-form-group {
  margin-bottom: 20px;
}

.retro-label {
  display: block;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  font-weight: bold;
  color: #00ff41;
  margin-bottom: 8px;
  letter-spacing: 1px;
  text-shadow: 0 0 5px rgba(0, 255, 65, 0.5);
}

.retro-input {
  width: 100%;
  padding: 12px 16px;
  font-family: 'Courier New', monospace;
  font-size: 16px;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid #00ff41;
  border-radius: 0;
  color: #00ff41;
  transition: all 0.3s ease;
  box-shadow: inset 0 0 10px rgba(0, 255, 65, 0.1);
  box-sizing: border-box;
}

.retro-input::placeholder {
  color: rgba(0, 255, 65, 0.5);
  font-family: 'Courier New', monospace;
}

.retro-input:focus {
  outline: none;
  border-color: #00ff41;
  box-shadow: 
    0 0 15px rgba(0, 255, 65, 0.5),
    inset 0 0 15px rgba(0, 255, 65, 0.1);
  background: rgba(0, 0, 0, 0.9);
}

.retro-button {
  width: 100%;
  padding: 14px;
  font-family: 'Courier New', monospace;
  font-size: 16px;
  font-weight: bold;
  background: rgba(0, 0, 0, 0.8);
  color: #00ff41;
  border: 2px solid #00ff41;
  border-radius: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 2px;
  text-shadow: 0 0 5px rgba(0, 255, 65, 0.8);
}

.retro-button:hover:not(:disabled) {
  background: #00ff41;
  color: #000000;
  box-shadow: 0 0 20px rgba(0, 255, 65, 0.8);
  transform: translateY(-2px);
}

.retro-button:active {
  transform: translateY(0);
}

.retro-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 0.6; }
  51%, 100% { opacity: 0.3; }
}

.retro-error {
  background: rgba(255, 0, 0, 0.1);
  border: 1px solid #ff0000;
  color: #ff0000;
  padding: 12px;
  margin-bottom: 16px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  text-align: center;
  text-shadow: 0 0 5px rgba(255, 0, 0, 0.5);
}

.retro-footer {
  text-align: center;
}

.retro-link-text {
  color: rgba(0, 255, 65, 0.8);
  font-family: 'Courier New', monospace;
  font-size: 14px;
  margin: 0;
}

.retro-link {
  color: #00ff41;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;
  text-shadow: 0 0 5px rgba(0, 255, 65, 0.5);
}

.retro-link:hover {
  text-shadow: 0 0 10px rgba(0, 255, 65, 0.8);
  text-decoration: underline;
}

/* Efectos de escaneo retro */
.retro-login-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00ff41, transparent);
  animation: scan 3s linear infinite;
  opacity: 0.5;
}

@keyframes scan {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* Responsive */
@media (max-width: 480px) {
  .retro-login-content {
    padding: 0 16px;
  }
  
  .retro-login-card {
    padding: 24px;
  }
  
  .retro-title {
    font-size: 20px;
  }
}
</style>