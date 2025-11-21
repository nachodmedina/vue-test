<template>
  <div class="todos-page">
    <h1>Lista de Tareas</h1>
    
    <div class="todos-container">
      <div class="todo-form">
        <input 
          v-model="newTodoText"
          @keyup.enter="addNewTodo"
          type="text" 
          placeholder="¿Qué necesitas hacer?"
          class="todo-input"
          data-testid="todo-input"
        />
        <button 
          @click="addNewTodo"
          class="btn btn--primary"
          data-testid="add-todo-btn"
          :disabled="!newTodoText.trim()"
        >
          Agregar
        </button>
      </div>

      <div class="todo-stats">
        <div class="stat">
          <span class="stat-number">{{ todoStore.totalTodos }}</span>
          <span class="stat-label">Total</span>
        </div>
        <div class="stat">
          <span class="stat-number">{{ todoStore.pendingCount }}</span>
          <span class="stat-label">Pendientes</span>
        </div>
        <div class="stat">
          <span class="stat-number">{{ todoStore.completedCount }}</span>
          <span class="stat-label">Completadas</span>
        </div>
      </div>

      <div class="todo-actions" v-if="todoStore.completedCount > 0">
        <button 
          @click="todoStore.clearCompleted"
          class="btn btn--outline btn--small"
          data-testid="clear-completed-btn"
        >
          Limpiar completadas
        </button>
      </div>

      <div class="todo-list" data-testid="todo-list">
        <div 
          v-for="todo in todoStore.todos" 
          :key="todo.id"
          class="todo-item"
          :class="{ 'todo-item--completed': todo.completed }"
          :data-testid="`todo-item-${todo.id}`"
        >
          <input 
            type="checkbox" 
            :checked="todo.completed"
            @change="todoStore.toggleTodo(todo.id)"
            class="todo-checkbox"
            :data-testid="`todo-checkbox-${todo.id}`"
          />
          <span class="todo-text">{{ todo.text }}</span>
          <span class="todo-date">
            {{ formatDate(todo.createdAt) }}
          </span>
          <button 
            @click="todoStore.removeTodo(todo.id)"
            class="btn-remove"
            :data-testid="`remove-todo-${todo.id}`"
            title="Eliminar tarea"
          >
            ×
          </button>
        </div>

        <div v-if="todoStore.totalTodos === 0" class="empty-state" data-testid="empty-state">
          <p>¡No hay tareas! Agrega una nueva tarea arriba.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTodoStore } from '@/stores/todos'

const todoStore = useTodoStore()
const newTodoText = ref('')

const addNewTodo = () => {
  if (newTodoText.value.trim()) {
    todoStore.addTodo(newTodoText.value)
    newTodoText.value = ''
  }
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}
</script>

<style scoped>
.todos-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.todos-page h1 {
  color: #1f2937;
  margin-bottom: 2rem;
  text-align: center;
}

.todos-container {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.todo-form {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.todo-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease-in-out;
}

.todo-input:focus {
  border-color: #059669;
}

.todo-stats {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
  justify-content: center;
}

.stat {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  color: #059669;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.todo-actions {
  text-align: center;
  margin-bottom: 1.5rem;
}


.todo-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  transition: all 0.2s ease-in-out;
}

.todo-item:hover {
  background-color: #f9fafb;
}

.todo-item--completed {
  opacity: 0.6;
  background-color: #f3f4f6;
}

.todo-item--completed .todo-text {
  text-decoration: line-through;
  color: #6b7280;
}

.todo-checkbox {
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
}

.todo-text {
  flex: 1;
  font-weight: 500;
}

.todo-date {
  font-size: 0.875rem;
  color: #9ca3af;
}

.btn-remove {
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  transition: background-color 0.2s ease-in-out;
}

.btn-remove:hover {
  background: #b91c1c;
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

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.empty-state p {
  margin: 0;
  font-size: 1.1rem;
}
</style>