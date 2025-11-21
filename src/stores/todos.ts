import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: Date
}

export const useTodoStore = defineStore('todos', () => {
  const todos = ref<Todo[]>([
    {
      id: 1,
      text: 'Aprender Vue.js',
      completed: false,
      createdAt: new Date()
    },
    {
      id: 2,
      text: 'Configurar Playwright',
      completed: true,
      createdAt: new Date()
    }
  ])

  const nextId = ref(3)

  const addTodo = (text: string) => {
    if (text.trim()) {
      todos.value.push({
        id: nextId.value++,
        text: text.trim(),
        completed: false,
        createdAt: new Date()
      })
    }
  }

  const removeTodo = (id: number) => {
    const index = todos.value.findIndex(todo => todo.id === id)
    if (index > -1) {
      todos.value.splice(index, 1)
    }
  }

  const toggleTodo = (id: number) => {
    const todo = todos.value.find(todo => todo.id === id)
    if (todo) {
      todo.completed = !todo.completed
    }
  }

  const clearCompleted = () => {
    todos.value = todos.value.filter(todo => !todo.completed)
  }

  // Computed properties
  const completedTodos = computed(() => 
    todos.value.filter(todo => todo.completed)
  )

  const pendingTodos = computed(() => 
    todos.value.filter(todo => !todo.completed)
  )

  const totalTodos = computed(() => todos.value.length)
  const completedCount = computed(() => completedTodos.value.length)
  const pendingCount = computed(() => pendingTodos.value.length)

  return {
    // State
    todos,
    
    // Actions
    addTodo,
    removeTodo,
    toggleTodo,
    clearCompleted,
    
    // Getters
    completedTodos,
    pendingTodos,
    totalTodos,
    completedCount,
    pendingCount
  }
})