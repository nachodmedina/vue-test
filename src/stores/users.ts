import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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

  // Actions
  const fetchUsers = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users')
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      users.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error desconocido'
      console.error('Error fetching users:', err)
    } finally {
      isLoading.value = false
    }
  }

  const fetchUserById = async (id: number) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
      
      if (!response.ok) {
        throw new Error(`Usuario no encontrado (${response.status})`)
      }
      
      const data = await response.json()
      selectedUser.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error desconocido'
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