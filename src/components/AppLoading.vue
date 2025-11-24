<template>
  <div class="loading-container">
    <div class="loading-content">
      <div class="spinner"></div>
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message?: string
}

withDefaults(defineProps<Props>(), {
  message: 'Cargando...'
})
</script>

<style scoped>
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f0c29 0%, #24243e 25%, #302b63 50%, #4b0082 75%, #6a0dad 100%);
  z-index: 9999;
}

.loading-content {
  text-align: center;
  color: white;
}

.spinner {
  width: 50px;
  height: 50px;
  margin: 0 auto 1.5rem;
  border: 3px solid rgba(168, 85, 247, 0.3);
  border-top: 3px solid #a855f7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-content p {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
}
</style>