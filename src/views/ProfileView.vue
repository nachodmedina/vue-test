<template>
  <div class="profile">
    <h1>Mi Perfil</h1>
    <div v-if="authStore.user" class="profile-content">
      <div class="profile-info">
        <h2>Información Personal</h2>
        <p><strong>Nombre:</strong> {{ authStore.user.firstName }} {{ authStore.user.lastName }}</p>
        <p><strong>Email:</strong> {{ authStore.user.email }}</p>
        <p><strong>Usuario:</strong> {{ authStore.user.username }}</p>
        <p><strong>Rol:</strong> {{ authStore.user.role }}</p>
        <p><strong>2FA:</strong> {{ authStore.user.twoFactorEnabled ? 'Activado' : 'Desactivado' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<style scoped>
.profile {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.profile-info {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>