<template>
  <footer class="footer">
    <div class="container">
      <p>&copy; 2025 Vue Test App. Creado para aprender Vue.js y Playwright testing.</p>
      <div class="links">
        <a href="https://vuejs.org/" target="_blank" class="link">Vue.js</a>
        <a href="https://playwright.dev/" target="_blank" class="link">Playwright</a>
        <a href="https://vitejs.dev/" target="_blank" class="link">Vite</a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Footer component - no logic needed for now
</script>

<style scoped>
.footer {
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
  margin-top: auto;
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.container p {
  margin: 0;
  color: #6b7280;
}

.links {
  display: flex;
  gap: 1.5rem;
}

.link {
  color: #059669;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease-in-out;
}

.link:hover {
  color: #047857;
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
    text-align: center;
  }
}
</style>