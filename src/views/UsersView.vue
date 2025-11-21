<template>
  <div class="users-page">
    <h1>Usuarios</h1>
    <p class="subtitle">Datos desde JSONPlaceholder API</p>

    <!-- Error State -->
    <div v-if="usersStore.error" class="error-banner" data-testid="error-banner">
      <div class="error-content">
        <span class="error-icon">⚠️</span>
        <div>
          <strong>Error al cargar usuarios</strong>
          <p>{{ usersStore.error }}</p>
        </div>
        <button @click="retry" class="btn btn--small btn--outline" data-testid="retry-btn">
          Reintentar
        </button>
      </div>
    </div>

    <div class="users-container">
      <!-- Controls -->
      <div class="users-controls">
        <button 
          @click="loadUsers" 
          :disabled="usersStore.isLoading"
          class="btn btn--primary"
          data-testid="load-users-btn"
        >
          {{ usersStore.isLoading ? 'Cargando...' : 'Cargar Usuarios' }}
        </button>
        
        <div v-if="usersStore.hasUsers" class="users-stats">
          <span class="stat-badge" data-testid="total-users">
            {{ usersStore.totalUsers }} usuarios
          </span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="usersStore.isLoading" class="loading-state" data-testid="loading-state">
        <div class="spinner"></div>
        <p>Cargando usuarios...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="!usersStore.hasUsers && !usersStore.error" class="empty-state" data-testid="empty-state">
        <p>Haz click en "Cargar Usuarios" para ver la lista</p>
      </div>

      <!-- Users List -->
      <div v-else-if="usersStore.hasUsers" class="users-list" data-testid="users-list">
        <div 
          v-for="user in usersStore.users" 
          :key="user.id"
          class="user-card"
          :data-testid="`user-card-${user.id}`"
          @click="selectUser(user)"
        >
          <div class="user-header">
            <h3>{{ user.name }}</h3>
            <span class="username">@{{ user.username }}</span>
          </div>
          <div class="user-info">
            <p class="user-email">📧 {{ user.email }}</p>
            <p class="user-city">🏙️ {{ user.address.city }}</p>
          </div>
        </div>
      </div>

      <!-- User Detail Modal -->
      <div v-if="selectedUser" class="modal-overlay" @click="closeModal" data-testid="user-modal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2>{{ selectedUser.name }}</h2>
            <button @click="closeModal" class="btn-close" data-testid="close-modal-btn">×</button>
          </div>
          
          <div class="user-details">
            <div class="detail-section">
              <h4>Información Personal</h4>
              <p><strong>Username:</strong> {{ selectedUser.username }}</p>
              <p><strong>Email:</strong> {{ selectedUser.email }}</p>
              <p><strong>Teléfono:</strong> {{ selectedUser.phone }}</p>
              <p><strong>Website:</strong> 
                <a :href="`http://${selectedUser.website}`" target="_blank">
                  {{ selectedUser.website }}
                </a>
              </p>
            </div>

            <div class="detail-section">
              <h4>Dirección</h4>
              <p>{{ selectedUser.address.street }}, {{ selectedUser.address.suite }}</p>
              <p>{{ selectedUser.address.city }} - {{ selectedUser.address.zipcode }}</p>
            </div>

            <div class="detail-section">
              <h4>Empresa</h4>
              <p><strong>{{ selectedUser.company.name }}</strong></p>
              <p class="company-catch">{{ selectedUser.company.catchPhrase }}</p>
              <p class="company-bs">{{ selectedUser.company.bs }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUsersStore, type User } from '@/stores/users'

const usersStore = useUsersStore()
const selectedUser = ref<User | null>(null)

const loadUsers = async () => {
  await usersStore.fetchUsers()
}

const selectUser = (user: User) => {
  selectedUser.value = user
}

const closeModal = () => {
  selectedUser.value = null
}

const retry = () => {
  usersStore.clearError()
  loadUsers()
}
</script>

<style scoped>
.users-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.users-page h1 {
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #6b7280;
  margin-bottom: 2rem;
}

.error-banner {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 2rem;
}

.error-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.error-icon {
  font-size: 1.5rem;
}

.users-container {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.users-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.stat-badge {
  background: #ecfdf5;
  color: #059669;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-weight: 500;
}

.loading-state {
  text-align: center;
  padding: 3rem;
}

.spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 1rem;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #059669;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.users-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.user-card {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.user-card:hover {
  border-color: #059669;
  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.1);
}

.user-header {
  margin-bottom: 1rem;
}

.user-header h3 {
  margin: 0 0 0.25rem 0;
  color: #1f2937;
}

.username {
  color: #6b7280;
  font-size: 0.875rem;
}

.user-info p {
  margin: 0.5rem 0;
  font-size: 0.875rem;
  color: #4b5563;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  margin: 1rem;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
}

.modal-header h2 {
  margin: 0;
  color: #1f2937;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  padding: 0.5rem;
  border-radius: 50%;
}

.btn-close:hover {
  background: #f3f4f6;
}

.detail-section {
  margin-bottom: 1.5rem;
}

.detail-section h4 {
  margin: 0 0 0.75rem 0;
  color: #059669;
}

.detail-section p {
  margin: 0.5rem 0;
  color: #4b5563;
}

.company-catch {
  font-style: italic;
  color: #6b7280;
}

.company-bs {
  font-size: 0.875rem;
  color: #9ca3af;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn--primary {
  background: #059669;
  color: white;
}

.btn--primary:hover:not(:disabled) {
  background: #047857;
}

.btn--outline {
  background: transparent;
  color: #6b7280;
  border: 2px solid #e5e7eb;
}

.btn--outline:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.btn--small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}
</style>