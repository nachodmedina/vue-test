import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')

// Remover loading inicial una vez que Vue esté montado
const initialLoading = document.getElementById('initial-loading')
if (initialLoading) {
  initialLoading.remove()
}
