<template>
  <header class="header">
    <div class="container">
      <div class="logo">
        <img alt="Vue logo" src="@/assets/logo.svg" width="40" height="40" />
        <h1>Vue Test App</h1>
      </div>
      <nav class="nav">
        <RouterLink to="/" class="nav-link" active-class="nav-link--active">
          Home
        </RouterLink>
        <RouterLink to="/about" class="nav-link" active-class="nav-link--active">
          About
        </RouterLink>
        <RouterLink to="/counter" class="nav-link" active-class="nav-link--active">
          Counter
        </RouterLink>
        <RouterLink to="/todos" class="nav-link" active-class="nav-link--active">
          Todos
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.header {
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo h1 {
  margin: 0;
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: 600;
}

.nav {
  display: flex;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: #6b7280;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease-in-out;
}

.nav-link:hover {
  color: #374151;
  background-color: #f3f4f6;
}

.nav-link--active {
  color: #059669;
  background-color: #ecfdf5;
}
</style>