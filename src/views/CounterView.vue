<template>
  <div class="counter-page">
    <h1>Contador Interactivo</h1>
    <div class="counter-container">
      <div class="counter-display">
        <span class="counter-value" data-testid="counter-value">{{ count }}</span>
      </div>
      <div class="counter-controls">
        <button 
          @click="decrement" 
          class="btn btn--secondary"
          data-testid="decrement-btn"
          :disabled="count <= 0"
        >
          -
        </button>
        <button 
          @click="reset" 
          class="btn btn--outline"
          data-testid="reset-btn"
        >
          Reset
        </button>
        <button 
          @click="increment" 
          class="btn btn--primary"
          data-testid="increment-btn"
        >
          +
        </button>
      </div>
      <div class="counter-info">
        <p>
          El contador ha sido 
          <span class="highlight">{{ count > 0 ? 'incrementado' : count < 0 ? 'decrementado' : 'reseteado' }}</span>
        </p>
        <p v-if="count >= 10" class="achievement" data-testid="achievement">
          🎉 ¡Has alcanzado 10 o más!
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)

const increment = () => {
  count.value++
}

const decrement = () => {
  if (count.value > 0) {
    count.value--
  }
}

const reset = () => {
  count.value = 0
}
</script>

<style scoped>
.counter-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.counter-page h1 {
  color: #1f2937;
  margin-bottom: 2rem;
}

.counter-container {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.counter-display {
  margin-bottom: 2rem;
}

.counter-value {
  font-size: 4rem;
  font-weight: bold;
  color: #059669;
  padding: 1rem 2rem;
  background: #ecfdf5;
  border-radius: 0.5rem;
  display: inline-block;
  min-width: 120px;
}

.counter-controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  font-size: 1.1rem;
  min-width: 80px;
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

.btn--secondary {
  background: #dc2626;
  color: white;
}

.btn--secondary:hover:not(:disabled) {
  background: #b91c1c;
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

.counter-info {
  text-align: center;
}

.highlight {
  font-weight: 600;
  color: #059669;
}

.achievement {
  color: #dc2626;
  font-weight: 600;
  font-size: 1.2rem;
  margin-top: 1rem;
}
</style>