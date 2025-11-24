<template>
  <div class="settings">
    <h1>Configuración</h1>
    <div class="settings-content">
      <div class="setting-group">
        <h2>Seguridad</h2>
        <p>Configura las opciones de seguridad de tu cuenta</p>
        <button class="settings-button">Cambiar Contraseña</button>
        <button class="settings-button">Configurar 2FA</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.setting-group {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

.settings-button {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  margin-right: 1rem;
  cursor: pointer;
}
</style>