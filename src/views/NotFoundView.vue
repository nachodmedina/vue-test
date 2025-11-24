<template>
  <div class="not-found">
    <h1>404</h1>
    <p>Página no encontrada</p>
    <router-link to="/" class="home-link">Volver al inicio</router-link>
  </div>
</template>

<style scoped>
.not-found {
  text-align: center;
  padding: 4rem 2rem;
}

.not-found h1 {
  font-size: 4rem;
  color: #667eea;
  margin-bottom: 1rem;
}

.home-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}
</style>