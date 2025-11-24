<template>
  <Teleport to="body">
    <div class="notifications-container">
      <TransitionGroup name="notification" tag="div" class="notifications-list">
        <div
          v-for="error in errors"
          :key="`${error.message}-${Date.now()}`"
          :class="['notification', `notification--${error.type}`]"
        >
          <div class="notification-content">
            <div class="notification-icon">
              <span v-if="error.type === 'success'">✓</span>
              <span v-else-if="error.type === 'warning'">⚠</span>
              <span v-else-if="error.type === 'info'">ℹ</span>
              <span v-else>✕</span>
            </div>
            
            <div class="notification-message">
              {{ error.message }}
            </div>
            
            <div class="notification-actions">
              <button
                v-for="action in error.actions"
                :key="action.label"
                @click="action.action"
                class="notification-action"
              >
                {{ action.label }}
              </button>
              
              <button
                @click="removeError(error)"
                class="notification-close"
                aria-label="Cerrar notificación"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useErrorHandler } from '@/composables/useErrorHandler'

const { errors, removeError } = useErrorHandler()
</script>

<style scoped>
.notifications-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  pointer-events: none;
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 400px;
}

.notification {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid;
  pointer-events: auto;
  min-width: 300px;
  max-width: 400px;
}

.notification--success {
  border-color: #10b981;
  background: linear-gradient(to right, #ecfdf5, #ffffff);
}

.notification--error {
  border-color: #ef4444;
  background: linear-gradient(to right, #fef2f2, #ffffff);
}

.notification--warning {
  border-color: #f59e0b;
  background: linear-gradient(to right, #fffbeb, #ffffff);
}

.notification--info {
  border-color: #3b82f6;
  background: linear-gradient(to right, #eff6ff, #ffffff);
}

.notification-content {
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  gap: 0.75rem;
}

.notification-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: bold;
  font-size: 0.875rem;
}

.notification--success .notification-icon {
  background: #10b981;
  color: white;
}

.notification--error .notification-icon {
  background: #ef4444;
  color: white;
}

.notification--warning .notification-icon {
  background: #f59e0b;
  color: white;
}

.notification--info .notification-icon {
  background: #3b82f6;
  color: white;
}

.notification-message {
  flex: 1;
  font-size: 0.875rem;
  line-height: 1.4;
  color: #374151;
}

.notification-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.notification-action {
  background: none;
  border: 1px solid currentColor;
  color: #6b7280;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.notification-action:hover {
  background: currentColor;
  color: white;
}

.notification-close {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 1.25rem;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.notification-close:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #374151;
}

/* Animaciones */
.notification-enter-active {
  transition: all 0.3s ease-out;
}

.notification-leave-active {
  transition: all 0.3s ease-in;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

.notification-move {
  transition: transform 0.3s ease;
}

@media (max-width: 480px) {
  .notifications-container {
    top: 0;
    right: 0;
    left: 0;
    padding: 1rem;
  }
  
  .notifications-list {
    max-width: none;
  }
  
  .notification {
    min-width: auto;
    max-width: none;
  }
}
</style>