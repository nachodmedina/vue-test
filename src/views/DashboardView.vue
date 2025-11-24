<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>Bienvenido, {{ authStore.user?.firstName || 'Usuario' }}!</h1>
      <p>Panel de control principal</p>
    </div>

    <div class="dashboard-content">
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Tareas</h3>
          <p class="stat-number">{{ todoStore.totalTodos }}</p>
          <router-link to="/todos" class="stat-link">Ver todas →</router-link>
        </div>
        
        <div class="stat-card">
          <h3>Usuarios</h3>
          <p class="stat-number">{{ usersStore.users.length }}</p>
          <router-link to="/users" class="stat-link">Ver todos →</router-link>
        </div>
        
        <div class="stat-card">
          <h3>Contador</h3>
          <p class="stat-number">{{ counterValue }}</p>
          <router-link to="/counter" class="stat-link">Ir al contador →</router-link>
        </div>
      </div>

      <div class="quick-actions">
        <h2>Acciones rápidas</h2>
        <div class="actions-grid">
          <router-link to="/todos" class="action-button">
            📝 Nueva Tarea
          </router-link>
          <router-link to="/users" class="action-button">
            👥 Ver Usuarios
          </router-link>
          <router-link to="/profile" class="action-button">
            👤 Mi Perfil
          </router-link>
          <router-link to="/settings" class="action-button">
            ⚙️ Configuración
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useTodoStore } from '@/stores/todos'
import { useUsersStore } from '@/stores/users'

const authStore = useAuthStore()
const todoStore = useTodoStore()
const usersStore = useUsersStore()
const counterValue = ref(0)

onMounted(async () => {
  // Cargar datos iniciales del dashboard
  try {
    await usersStore.fetchUsers()
    // El counterValue podría venir de un store dedicado o localStorage
    counterValue.value = parseInt(localStorage.getItem('counter') || '0')
  } catch (error) {
    console.error('Error cargando datos del dashboard:', error)
  }
})
</script>

<style scoped>
.dashboard {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.dashboard-header p {
  color: #6b7280;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.stat-card h3 {
  color: #6b7280;
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-number {
  color: #1f2937;
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.stat-link {
  color: #667eea;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
}

.stat-link:hover {
  text-decoration: underline;
}

.quick-actions h2 {
  color: #1f2937;
  margin-bottom: 1rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}
</style>