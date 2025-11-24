<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Redirección inmediata - incluso antes del template
if (authStore.isAuthenticated) {
  router.replace('/dashboard')
} else {
  router.replace('/login')
}
</script>

<template>
  <!-- Completamente vacío -->
</template>