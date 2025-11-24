<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { computed, watch, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import HelloWorld from './components/HelloWorld.vue'
import AppNotifications from './components/AppNotifications.vue'

const route = useRoute()
const authStore = useAuthStore()

// Inicializar inmediatamente el store
if (!authStore.isInitialized) {
  authStore.initialize()
}

const isLoginPage = computed(() => {
  return route.name === 'login' || route.name === 'register' || route.name === 'forgot-password'
})

async function handleLogout() {
  await authStore.logout()
}

// Controlar clases del body para CSS
function updateBodyClasses() {
  const app = document.getElementById('app')
  if (!app) return

  // Remover todas las clases de control
  app.classList.remove('auth-ready', 'show-login', 'app-loading')

  if (!authStore.isInitialized) {
    app.classList.add('app-loading')
  } else if (isLoginPage.value) {
    app.classList.add('show-login', 'auth-ready')
  } else if (authStore.isAuthenticated) {
    app.classList.add('auth-ready')
  } else {
    // No autenticado, no en login - forzar redirección
    app.classList.add('app-loading')
  }
}

// Observar cambios y actualizar clases
watch([() => authStore.isInitialized, () => authStore.isAuthenticated, isLoginPage], () => {
  updateBodyClasses()
}, { immediate: true })

onMounted(() => {
  updateBodyClasses()
})
</script>

<template>
  <header v-if="!isLoginPage">
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="Vue Test App with Authentication!" />

      <nav v-if="authStore.isAuthenticated" class="authenticated-nav">
        <!-- Navegación para usuarios autenticados -->
        <div class="nav-links">
          <RouterLink to="/dashboard">Dashboard</RouterLink>
          <RouterLink to="/counter">Counter</RouterLink>
          <RouterLink to="/todos">Todos</RouterLink>
          <RouterLink to="/users">Users</RouterLink>
          <RouterLink to="/profile">Perfil</RouterLink>
          <RouterLink v-if="authStore.isAdmin" to="/admin">Admin</RouterLink>
        </div>
        
        <div class="user-menu">
          <span class="user-greeting">
            Hola, {{ authStore.user?.first_name || 'Usuario' }}!
          </span>
          <RouterLink to="/settings" class="settings-link">⚙️</RouterLink>
          <button @click="handleLogout" class="logout-button">
            Cerrar Sesión
          </button>
        </div>
      </nav>

      <nav v-else class="public-nav">
        <!-- Navegación para usuarios no autenticados -->
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/login" class="login-button">Iniciar Sesión</RouterLink>
        <RouterLink to="/register" class="register-button">Registrarse</RouterLink>
      </nav>
    </div>
  </header>

  <main :class="{ 'login-layout': isLoginPage }">
    <RouterView />
  </main>

  <!-- Componente de notificaciones -->
  <AppNotifications />
</template><style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

.authenticated-nav {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.nav-links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-greeting {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.settings-link {
  text-decoration: none;
  font-size: 1.2rem;
}

.logout-button {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.75rem;
  transition: background-color 0.2s ease;
}

.logout-button:hover {
  background: #dc2626;
}

.public-nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.login-button {
  background: #667eea;
  color: white !important;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.login-button:hover {
  background: #5a67d8;
}

.register-button {
  background: #10b981;
  color: white !important;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.register-button:hover {
  background: #059669;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

main {
  padding: 1rem;
}

main.login-layout {
  padding: 0;
  margin: 0;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
}

@media (max-width: 768px) {
  .authenticated-nav {
    flex-direction: column;
    align-items: stretch;
  }
  
  .nav-links {
    justify-content: center;
  }
  
  .user-menu {
    justify-content: center;
    border-top: 1px solid var(--color-border);
    padding-top: 1rem;
  }
  
  .public-nav {
    flex-direction: column;
  }
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

.login-layout {
  height: 100vh;
  overflow-y: auto;
  padding: 0;
  margin: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
