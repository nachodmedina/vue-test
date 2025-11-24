import { createRouter, createWebHistory } from 'vue-router'
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Ruta raíz usa componente de redirección
    {
      path: '/',
      name: 'root',
      component: () => import('../views/RedirectView.vue')
    },
    
    // Rutas de autenticación (públicas)
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { 
        requiresAuth: false,
        hideForAuthenticated: true 
      }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { 
        requiresAuth: false,
        hideForAuthenticated: true 
      }
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/ForgotPasswordView.vue'),
      meta: { 
        requiresAuth: false,
        hideForAuthenticated: true 
      }
    },
    
    // Rutas protegidas
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Dashboard'
      }
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Inicio'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Acerca de'
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Perfil'
      }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Configuración'
      }
    },
    {
      path: '/counter',
      name: 'counter',
      component: () => import('../views/CounterView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Contador'
      }
    },
    {
      path: '/todos',
      name: 'todos',
      component: () => import('../views/TodosView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Tareas'
      }
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('../views/UsersView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Usuarios'
      }
    },

    // Rutas de administración
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
      meta: { 
        requiresAuth: true,
        requiresRole: 'admin',
        title: 'Administración'
      }
    },

    // Ruta 404 - Cualquier ruta no encontrada va a login
    {
      path: '/:pathMatch(.*)*',
      redirect: '/login'
    }
  ],
})

// Guard de navegación global - Simplificado
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Permitir siempre la ruta root (RedirectView se encarga)
  if (to.name === 'root') {
    next()
    return
  }

  // Páginas que NO requieren autenticación
  const publicPages = ['login', 'register', 'forgot-password']
  const isPublicPage = publicPages.includes(to.name as string)

  // Si no está en una página pública y no está autenticado
  if (!isPublicPage && !authStore.isAuthenticated) {
    next({ name: 'login', replace: true })
    return
  }

  // Si está autenticado y trata de ir a login/register
  if (isPublicPage && authStore.isAuthenticated) {
    next({ name: 'dashboard', replace: true })
    return
  }

  // Verificar roles si es necesario
  if (to.meta.requiresRole && authStore.isAuthenticated) {
    const requiredRole = to.meta.requiresRole as string
    if (authStore.userRole !== requiredRole) {
      next({ name: 'dashboard', replace: true })
      return
    }
  }

  // Actualizar el título de la página
  if (to.meta.title) {
    document.title = `${to.meta.title} | Vue App`
  } else {
    document.title = 'Vue App'
  }

  next()
})

// Guard para manejar errores de autenticación
router.onError((error) => {
  console.error('Error de navegación:', error)
  
  // Si es un error de autenticación, limpiar y redirigir al login
  if (error.message.includes('401') || error.message.includes('unauthorized')) {
    const authStore = useAuthStore()
    authStore.logout()
    router.push('/login')
  }
})

export default router
