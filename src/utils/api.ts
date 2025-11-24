// API Utilities
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  detail?: string | any
  message?: string
}

export async function apiCall<T = any>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE}${endpoint}`
    console.log(`🌐 API Call: ${options.method || 'GET'} ${url}`)
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    })

    const data = await response.json()
    
    if (!response.ok) {
      console.error(`❌ API Error: ${response.status}`, data)
      const errorMessage = typeof data.detail === 'string' ? data.detail : 
                         data.message || 
                         (data.detail && typeof data.detail === 'object' ? JSON.stringify(data.detail) : '') ||
                         `HTTP ${response.status}`
      
      return { error: errorMessage, detail: data.detail }
    }

    console.log(`✅ API Success:`, data)
    return { data }
  } catch (error) {
    console.error('🔥 Network Error:', error)
    return { error: error instanceof Error ? error.message : 'Error de conexión' }
  }
}

export async function apiCallFormData(
  endpoint: string, 
  formData: URLSearchParams,
  options: RequestInit = {}
): Promise<ApiResponse> {
  try {
    const url = `${API_BASE}${endpoint}`
    console.log(`🌐 API Call (FormData): POST ${url}`)
    console.log('📝 Form Data:', Object.fromEntries(formData.entries()))
    
    const response = await fetch(url, {
      method: 'POST',
      ...options,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...options.headers,
      },
      body: formData,
    })

    const data = await response.json()
    
    if (!response.ok) {
      console.error(`❌ API Error: ${response.status}`, data)
      const errorMessage = typeof data.detail === 'string' ? data.detail : 
                         data.message || 
                         (data.detail && typeof data.detail === 'object' ? JSON.stringify(data.detail) : '') ||
                         `HTTP ${response.status}`
      
      return { error: errorMessage, detail: data.detail }
    }

    console.log(`✅ API Success:`, data)
    return { data }
  } catch (error) {
    console.error('🔥 Network Error:', error)
    return { error: error instanceof Error ? error.message : 'Error de conexión' }
  }
}