import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApi } from '@/composables/useApi'

export interface User {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
    geo: {
      lat: string
      lng: string
    }
  }
  company: {
    name: string
    catchPhrase: string
    bs: string
  }
}

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const selectedUser = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const api = useApi()

  // Actions
  const fetchUsers = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      // Intentar primero desde nuestra API (si está disponible)
      try {
        const data = await api.get<User[]>('/users')
        users.value = data
      } catch (apiError) {
        // Fallback a JSONPlaceholder si nuestra API no está disponible
        console.info('API no disponible, usando JSONPlaceholder como fallback')
        const data = await api.get<User[]>('https://jsonplaceholder.typicode.com/users', { requiresAuth: false })
        users.value = data
      }
    } catch (err: any) {
      error.value = err?.message || 'Error al cargar usuarios'
      console.error('Error fetching users:', err)
    } finally {
      isLoading.value = false
    }
  }

  const fetchUserById = async (id: number) => {
    isLoading.value = true
    error.value = null
    
    try {
      // Intentar primero desde nuestra API
      try {
        const data = await api.get<User>(`/users/${id}`)
        selectedUser.value = data
      } catch (apiError) {
        // Fallback a JSONPlaceholder
        console.info('API no disponible, usando JSONPlaceholder como fallback')
        const data = await api.get<User>(`https://jsonplaceholder.typicode.com/users/${id}`, { requiresAuth: false })
        selectedUser.value = data
      }
    } catch (err: any) {
      error.value = err?.message || 'Error al cargar usuario'
      selectedUser.value = null
      console.error('Error fetching user:', err)
    } finally {
      isLoading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  const clearSelectedUser = () => {
    selectedUser.value = null
  }

  // Computed properties
  const totalUsers = computed(() => users.value.length)
  
  const usersByCity = computed(() => {
    const cityGroups: Record<string, User[]> = {}
    users.value.forEach(user => {
      const city = user.address.city
      if (!cityGroups[city]) {
        cityGroups[city] = []
      }
      cityGroups[city].push(user)
    })
    return cityGroups
  })

  const hasUsers = computed(() => users.value.length > 0)

  return {
    // State
    users,
    selectedUser,
    isLoading,
    error,
    
    // Actions
    fetchUsers,
    fetchUserById,
    clearError,
    clearSelectedUser,
    
    // Getters
    totalUsers,
    usersByCity,
    hasUsers
  }
})