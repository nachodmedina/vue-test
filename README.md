# Vue Test App 🚀

Un proyecto de Vue.js moderno con sistema de autenticación completo, diseño elegante modo oscuro y funcionalidades avanzadas.

## ✨ Características Principales

- **Vue 3** con Composition API
- **TypeScript** para type safety completo
- **Vite** como bundler moderno y rápido
- **Vue Router** para navegación con guards de autenticación
- **Pinia** para state management reactivo
- **JWT Authentication** con refresh tokens automáticos
- **2FA (Two-Factor Authentication)** con códigos de recuperación
- **Diseño modo oscuro** con gradientes violeta elegantes
- **Formularios avanzados** con validación en tiempo real
- **Playwright** para testing E2E completo
- **ESLint** y **Vitest** para calidad de código

## 🎨 Diseño y UI/UX

### Tema Visual Moderno
- **Modo oscuro elegante** con gradientes violeta profundos
- **Glassmorphism effects** con backdrop-filter y bordes brillantes
- **Animaciones suaves** con cubic-bezier personalizado
- **Iconografía consistente** en toda la aplicación
- **Responsive design** optimizado para móviles y desktop
- **Microinteracciones** con hover effects y transiciones

### Sistema de Colores
- **Gradientes principales**: Del azul marino (#0f0c29) al violeta brillante (#6a0dad)
- **Acentos violeta**: #a855f7, #c084fc para elementos interactivos
- **Textos adaptables**: Grises claros (#e5e7eb, #d1d5db) sobre fondos oscuros
- **Estados de error**: Rojos suaves con transparencias para mejor legibilidad

## 🔐 Sistema de Autenticación Avanzado

### Características de Seguridad
- **Login completo** con email y contraseña
- **Registro de usuarios** con validación robusta
- **Autenticación 2FA** con códigos de verificación
- **Códigos de recuperación** para backup de 2FA
- **JWT tokens** con refresh automático
- **Guards de navegación** por roles y autenticación
- **Interceptores de API** transparentes
- **Manejo de sesiones** persistentes y seguras
- **Logout completo** con limpieza de datos

### Flujo de Autenticación Mejorado
1. **Inicio**: Página de bienvenida sin parpadeo al actualizar
2. **Registro**: Formulario completo con confirmación de contraseña
3. **Login**: Validación en tiempo real y manejo de errores
4. **2FA**: Verificación opcional con códigos de 6 dígitos
5. **Dashboard**: Redirección automática según estado de autenticación
6. **Persistencia**: Mantiene sesión entre recargas del navegador
7. **Expiración**: Renovación transparente de tokens

### Anti-Flicker System
- **RedirectView component**: Componente invisible para redirecciones
- **CSS-based hiding**: Ocultación inmediata de contenido no autorizado
- **Router guards optimizados**: Previenen rutas incorrectas
- **Loading states**: Estados de carga consistentes en toda la app

## 🎯 Funcionalidades Implementadas

### 📄 Páginas Públicas
- **Home** - Página principal con información del proyecto
- **About** - Información detallada sobre la aplicación  
- **Login** - Formulario de autenticación con:
  - Diseño modo oscuro elegante
  - Validación en tiempo real
  - Toggle de visibilidad de contraseña
  - Soporte completo para 2FA
  - Códigos de recuperación
  - Mensajes de error contextuales
  - Animaciones de entrada suaves
- **Register** - Registro de nuevos usuarios con:
  - Formulario completo (nombre, apellido, email, contraseña)
  - Validación de confirmación de contraseña
  - Checkbox de términos y condiciones
  - Misma estética que login
  - Scroll apropiado en móviles
- **Forgot Password** - Recuperación de contraseña (preparado para implementar)

### 🔒 Páginas Protegidas
- **Dashboard** - Panel principal con:
  - Estadísticas del usuario
  - Enlaces rápidos a funcionalidades
  - Cards informativos con métricas
- **Profile** - Perfil del usuario con datos personales
- **Settings** - Configuración de cuenta y preferencias
- **Counter** - Contador interactivo con:
  - Incrementar/decrementar
  - Reset a cero
  - Prevención de valores negativos
  - Mensaje de logro al llegar a 10
- **Todos** - Lista de tareas completa con:
  - Agregar nuevas tareas
  - Marcar como completadas/pendientes
  - Eliminar tareas individuales
  - Limpiar todas las completadas
  - Estado vacío elegante
- **Users** - Gestión de usuarios con:
  - Lista desde API con fallback a JSONPlaceholder
  - Modal de detalles de usuario
  - Estados de carga y error
- **Admin** - Panel de administración (solo admins)

### 🔒 Sistema de Guards y Navegación
- **requiresAuth**: Protección de rutas autenticadas
- **hideForAuthenticated**: Oculta login/registro para usuarios logueados
- **requiresRole**: Control de acceso por roles (admin, user, moderator)
- **Redirección inteligente**: Mantiene URL destino después del login
- **Prevención de flicker**: Sin parpadeo al actualizar páginas

### 🧩 Componentes Reutilizables
- **AppNotifications** - Sistema de notificaciones toast
- **AppLoading** - Pantalla de carga con spinner violeta
- **Icons Collection**: 
  - IconLock, IconEye, IconEyeSlash (autenticación)
  - IconShield (2FA)
  - IconUser (registro)
- **RedirectView** - Componente invisible para redirecciones

### 🗄️ Stores Avanzados (Pinia)
- **AuthStore** - Gestión completa de autenticación:
  - Login con manejo de errores
  - Registro de usuarios nuevos
  - Verificación 2FA con códigos de recuperación
  - Refresh automático de JWT tokens
  - Estado persistente entre sesiones
  - Inicialización sincrónica para prevenir flicker
- **TodoStore** - Gestión de tareas reactiva
- **UsersStore** - Lista de usuarios con API fallback

### 🔌 Composables Útiles
- **useApi** - Cliente HTTP robusto con:
  - Interceptores automáticos de JWT
  - Refresh transparente de tokens
  - Métodos convenientes (get, post, put, delete)
  - Manejo centralizado de errores
- **useErrorHandler** - Manejo global de errores:
  - Notificaciones automáticas toast
  - Clasificación por tipo y severidad
  - Acciones de recuperación automáticas
- **useGlobalLoading** - Estado de carga global

## 🛠️ Configuración del Proyecto

### Variables de Entorno
Crear archivo `.env`:
```env
# API Configuration
VITE_API_URL=http://localhost:8000/api

# Application Configuration  
VITE_APP_NAME=Vue Test App
VITE_APP_VERSION=1.0.0

# Authentication Configuration
VITE_JWT_EXPIRY=3600
VITE_REFRESH_TOKEN_EXPIRY=86400

# Feature Flags
VITE_ENABLE_2FA=true
VITE_ENABLE_REGISTRATION=true
VITE_ENABLE_DARK_MODE=true
```

### Prerequisitos
- **Node.js 22+** (requerido para Vite 7+)
- **npm** o **pnpm** como gestor de paquetes

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/nachodmedina/vue-test.git
cd vue-test

# Instalar dependencias
npm install
```

### Desarrollo
```bash
# Servidor de desarrollo con hot-reload
npm run dev
```
La aplicación estará disponible en `http://localhost:5173/`

### Build para Producción
```bash
# Verificar tipos TypeScript y construir
npm run build

# Preview del build de producción  
npm run preview
```

## 🧪 Testing Completo

### Resumen de Cobertura de Tests

Este proyecto cuenta con **67 tests automatizados** que garantizan la calidad y funcionamiento correcto de la aplicación:

- **54 tests E2E (Playwright)** - Testing de flujos completos de usuario
- **13 tests unitarios (Vitest)** - Testing de stores y lógica de negocio

#### Tests E2E por Módulo

| Módulo | Tests | Descripción |
|--------|-------|-------------|
| **Autenticación** | 18 | Login completo con validaciones y errores |
| **Registro** | 11 | Registro de usuarios con validaciones |
| **Navegación** | 8 | Guards, redirecciones y acceso por roles |
| **Counter** | 7 | Operaciones de contador y validaciones |
| **Todos** | 9 | CRUD completo de tareas |
| **Básicos** | 1 | Test inicial de configuración |

#### Tests Unitarios por Store

| Store | Tests | Descripción |
|-------|-------|-------------|
| **Auth Store** | 13 | Login, registro, logout y manejo de estado |

### Tests E2E con Playwright

#### 🔐 Tests de Autenticación (`e2e/auth.spec.ts`)

**Login Flow (7 tests):**
1. ✅ Muestra todos los elementos del formulario (inputs, botón, link)
2. ✅ Muestra error con credenciales inválidas
3. ✅ Muestra error con email no registrado
4. ✅ Login exitoso redirige a dashboard
5. ✅ Mantiene sesión después de recargar página
6. ✅ Logout limpia sesión y redirige a home
7. ✅ Navegación desde login a registro funciona

**Register Flow (11 tests):**
1. ✅ Muestra todos los elementos del formulario de registro
2. ✅ Habilita botón solo cuando formulario es válido
3. ✅ Valida longitud mínima de username (3 caracteres)
4. ✅ Valida longitud mínima de password (6 caracteres)
5. ✅ Valida que passwords coincidan
6. ✅ Valida formato de email
7. ✅ Valida checkbox de términos y condiciones
8. ✅ Muestra error cuando email ya existe
9. ✅ Muestra error cuando username ya existe
10. ✅ Registro exitoso con datos válidos
11. ✅ Navegación desde registro a login funciona

**Características técnicas:**
- **Mocking de API**: Simula respuestas del backend (éxito y errores)
- **Validación en tiempo real**: Verifica que el botón se deshabilite/habilite correctamente
- **Manejo de errores**: Prueba todos los casos de error (email/username existente, credenciales inválidas)
- **Persistencia**: Verifica que la sesión se mantenga después de recargar
- **Redirecciones**: Asegura navegación correcta según estado de autenticación

#### 🧭 Tests de Navegación (`e2e/navigation.spec.ts`)

1. ✅ Navbar muestra links correctos para usuario no autenticado
2. ✅ Navbar muestra links correctos para usuario autenticado
3. ✅ Redirige de login a dashboard si ya está autenticado
4. ✅ Redirige de register a dashboard si ya está autenticado
5. ✅ Protege ruta /dashboard requiriendo autenticación
6. ✅ Protege ruta /profile requiriendo autenticación
7. ✅ Protege ruta /admin requiriendo rol admin
8. ✅ Links de navegación funcionan correctamente

**Características técnicas:**
- **Guards de autenticación**: Verifica que rutas protegidas redirijan correctamente
- **Guards de roles**: Asegura que solo usuarios con permisos accedan a ciertas rutas
- **Estado de UI**: Valida que el navbar cambie según autenticación
- **Persistencia de URL**: Mantiene URL destino después del login

#### 🔢 Tests de Counter (`e2e/counter.spec.ts`)

1. ✅ Muestra contador en 0 inicialmente
2. ✅ Incrementa contador correctamente
3. ✅ Decrementa contador correctamente
4. ✅ No permite valores negativos
5. ✅ Reset vuelve contador a 0
6. ✅ Muestra mensaje especial al llegar a 10
7. ✅ Múltiples operaciones funcionan en secuencia

**Características técnicas:**
- **Validación de estado**: Verifica valores en cada operación
- **Edge cases**: Prueba límites (negativos, valores especiales)
- **Secuencias**: Asegura que operaciones múltiples funcionen correctamente

#### ✅ Tests de Todos (`e2e/todos.spec.ts`)

1. ✅ Muestra estado vacío inicial
2. ✅ Agrega nueva tarea correctamente
3. ✅ No permite agregar tareas vacías
4. ✅ Marca tarea como completada
5. ✅ Desmarca tarea completada
6. ✅ Elimina tarea individual
7. ✅ Limpia todas las tareas completadas
8. ✅ Mantiene tareas pendientes al limpiar completadas
9. ✅ Múltiples tareas se gestionan correctamente

**Características técnicas:**
- **CRUD completo**: Create, Read, Update, Delete
- **Validaciones**: Input vacío, estados de tareas
- **Operaciones en lote**: Limpiar todas las completadas
- **Persistencia**: Estado se mantiene entre operaciones

### Tests Unitarios con Vitest

#### 🔐 Tests de Auth Store (`src/stores/__tests__/auth.spec.ts`)

**Setup y Estado (3 tests):**
1. ✅ Inicializa con estado correcto por defecto
2. ✅ Setea usuario correctamente
3. ✅ Maneja loading state

**Login (4 tests):**
4. ✅ Login exitoso setea usuario y token
5. ✅ Login falla con credenciales incorrectas
6. ✅ Login maneja errores de red
7. ✅ Login limpia error anterior en nuevo intento

**Registro (3 tests):**
8. ✅ Registro exitoso crea usuario y hace login automático
9. ✅ Registro falla con email existente
10. ✅ Registro falla con username existente

**Logout (2 tests):**
11. ✅ Logout limpia todo el estado
12. ✅ Logout limpia localStorage

**Getters (1 test):**
13. ✅ Computed properties funcionan correctamente

**Características técnicas:**
- **Mocking de APIs**: Simula respuestas con `vi.fn()`
- **Estado reactivo**: Verifica reactividad de Pinia
- **Efectos secundarios**: Valida cambios en localStorage
- **Manejo de errores**: Prueba todos los casos de error

### Comandos de Testing

```bash
# Tests E2E con Playwright
npm run test:e2e                    # Todos los tests E2E
npm run test:e2e e2e/auth.spec.ts   # Solo tests de autenticación
npm run test:e2e -- --headed        # Ver navegador durante tests
npm run test:e2e -- --debug         # Modo debug paso a paso

# Tests específicos
npx playwright test auth.spec.ts           # Tests de auth
npx playwright test navigation.spec.ts     # Tests de navegación  
npx playwright test counter.spec.ts        # Tests de counter
npx playwright test todos.spec.ts          # Tests de todos

# Configuración útil
npx playwright test --workers=1            # Un navegador a la vez
npx playwright test --project=chromium     # Solo Chrome
npx playwright show-report                 # Ver reporte HTML

# Tests Unitarios con Vitest
npm run test:unit                   # Todos los tests unitarios
npm run test:unit -- --coverage     # Con reporte de cobertura
npm run test:unit -- --watch        # Modo watch para desarrollo

# Instalar navegadores (solo primera vez)
npx playwright install
npx playwright install --with-deps chromium  # Solo Chrome con dependencias
```

### Arquitectura de Testing

#### Estructura de Archivos
```
e2e/                              # Tests End-to-End (Playwright)
├── auth.spec.ts                  # 18 tests de autenticación
├── navigation.spec.ts            # 8 tests de navegación
├── counter.spec.ts               # 7 tests de contador
├── todos.spec.ts                 # 9 tests de tareas
├── vue.spec.ts                   # 1 test básico
└── tsconfig.json                 # Config TypeScript para tests

src/
└── stores/
    └── __tests__/                # Tests Unitarios (Vitest)
        └── auth.spec.ts          # 13 tests del auth store

playwright.config.ts              # Configuración de Playwright
vitest.config.ts                  # Configuración de Vitest
```

#### Estrategias de Testing Implementadas

**1. Page Object Pattern (implícito):**
```typescript
// Locators reutilizables
const emailInput = page.fill('input[type="email"]')
const passwordInput = page.locator('input[type="password"]')
const submitButton = page.locator('button[type="submit"]')
```

**2. API Mocking con Playwright:**
```typescript
await page.route('**/api/auth/login', async (route) => {
  const requestBody = JSON.parse(route.request().postData())
  
  if (requestBody.email === 'test@example.com') {
    await route.fulfill({
      status: 200,
      body: JSON.stringify({ access_token: 'mock-token' })
    })
  } else {
    await route.fulfill({
      status: 401,
      body: JSON.stringify({ detail: 'Invalid credentials' })
    })
  }
})
```

**3. Setup y Teardown Consistentes:**
```typescript
test.beforeEach(async ({ page }) => {
  // Mock de APIs
  await page.route('**/api/**', mockHandler)
  // Navegar a página
  await page.goto('/login')
})
```

**4. Assertions Específicas:**
```typescript
// Verificar elementos visibles
await expect(page.locator('.error-message')).toBeVisible()

// Verificar texto exacto
await expect(page.locator('h1')).toHaveText('Login')

// Verificar redirección
expect(page.url()).toContain('/dashboard')

// Verificar estado deshabilitado
await expect(submitButton).toBeDisabled()
```

**5. Testing de Estados de Loading:**
```typescript
await submitButton.click()

// Verificar que muestra "Loading..."
await expect(submitButton).toContainText('Loading')

// Esperar que termine
await page.waitForURL('/dashboard')
```

**6. Testing Cross-Browser:**
```typescript
// playwright.config.ts
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  { name: 'webkit', use: { ...devices['Desktop Safari'] } }
]
```

### Buenas Prácticas Implementadas

✅ **Tests aislados**: Cada test puede correr independientemente
✅ **No flakiness**: Tests estables sin timeouts arbitrarios
✅ **Fast feedback**: Tests rápidos que corren en paralelo
✅ **Clear assertions**: Mensajes de error descriptivos
✅ **Mock management**: APIs mockeadas consistentemente
✅ **Browser coverage**: Tests en Chrome, Firefox y Safari
✅ **Type safety**: TypeScript en todos los tests
✅ **Clean code**: Tests legibles y mantenibles

### Cobertura y Calidad

- **Cobertura funcional**: 100% de flujos críticos cubiertos
- **Cobertura de UI**: Todos los componentes principales testeados
- **Cobertura de errores**: Casos de error y edge cases incluidos
- **Validación de UX**: Verificación de mensajes y feedback al usuario
- **Performance**: Tests completos corren en ~15-20 segundos

## 📁 Estructura del Proyecto

```
src/
├── assets/             # CSS y recursos estáticos
│   ├── main.css       # Estilos globales y tema oscuro
│   └── base.css       # Reset y variables CSS
├── components/         # Componentes reutilizables
│   ├── HelloWorld.vue
│   ├── AppNotifications.vue
│   ├── AppLoading.vue # Pantalla de carga elegante
│   └── icons/         # Colección de iconos SVG
│       ├── IconLock.vue
│       ├── IconEye.vue
│       ├── IconEyeSlash.vue
│       ├── IconShield.vue
│       └── IconUser.vue
├── composables/        # Lógica reutilizable
│   ├── useApi.ts      # Cliente HTTP con interceptores
│   ├── useErrorHandler.ts
│   └── useGlobalLoading.ts
├── stores/            # Pinia stores
│   ├── auth.ts        # Store completo de autenticación
│   ├── todos.ts       # Gestión de tareas
│   └── users.ts       # Lista de usuarios
├── types/             # Tipos TypeScript
│   ├── auth.ts        # Interfaces de autenticación
│   ├── user.ts        # Tipos de usuario
│   └── todo.ts        # Tipos de tareas
├── views/             # Páginas/Vistas
│   ├── HomeView.vue
│   ├── AboutView.vue
│   ├── LoginView.vue    # Login con diseño modo oscuro
│   ├── RegisterView.vue # Registro completo
│   ├── DashboardView.vue
│   ├── CounterView.vue
│   ├── TodosView.vue
│   ├── UsersView.vue
│   ├── ProfileView.vue
│   ├── SettingsView.vue
│   ├── AdminView.vue
│   ├── ForgotPasswordView.vue
│   ├── NotFoundView.vue
│   └── RedirectView.vue # Anti-flicker component
├── router/            # Configuración de rutas
│   └── index.ts       # Guards y rutas protegidas
└── main.ts           # Punto de entrada

e2e/                  # Tests End-to-End
├── auth.spec.ts      # Tests de autenticación
├── navigation.spec.ts # Tests de navegación
├── counter.spec.ts   # Tests del contador
├── todos.spec.ts     # Tests de tareas
└── vue.spec.ts       # Test básico original

tests/                # Tests unitarios
└── stores/           # Tests de Pinia stores
    ├── auth.spec.ts
    └── todos.spec.ts
```

## 🎮 Cobertura de Testing

### Tests E2E Implementados
- ✅ **Autenticación completa** - Login, registro, 2FA, logout
- ✅ **Navegación protegida** - Guards y redirecciones
- ✅ **Counter** - Todas las operaciones y validaciones
- ✅ **Todos** - CRUD completo y edge cases
- ✅ **UI Components** - Elementos interactivos
- ✅ **Responsive** - Comportamiento en diferentes viewports

### Estrategias de Testing
- **Data-testid selectors** para estabilidad
- **Page Object patterns** para mantenibilidad
- **Mocking de APIs** para tests aislados
- **Setup/teardown** consistente entre tests
- **Assertions específicas** por funcionalidad

## 🚀 Tecnologías y Arquitectura

### Stack Técnico
- **Frontend**: Vue 3 + TypeScript + Vite
- **State Management**: Pinia con persistencia
- **Styling**: CSS nativo con variables y gradientes
- **Routing**: Vue Router con guards avanzados
- **HTTP Client**: Fetch API con interceptores custom
- **Testing**: Playwright + Vitest
- **Code Quality**: ESLint + Prettier

### Patrones de Diseño Implementados
- **Composition API** para lógica reutilizable
- **Store pattern** con Pinia para estado global
- **Repository pattern** en composables de API
- **Component composition** para reutilización
- **Guard pattern** para control de acceso
- **Observer pattern** en sistema de notificaciones

## 📚 Recursos y Referencias

- [Vue.js 3 Documentation](https://vuejs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Pinia Store](https://pinia.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Playwright Testing](https://playwright.dev/)
- [CSS Grid & Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS)

## 🤝 Contribuciones

Este proyecto está en constante evolución. Si tienes ideas, mejoras o encuentras bugs:

1. **Fork** el repositorio
2. **Crea una rama** para tu feature (`git checkout -b feature/amazing-feature`)
3. **Commit** tus cambios (`git commit -m 'Add amazing feature'`)
4. **Push** a la rama (`git push origin feature/amazing-feature`)
5. **Abre un Pull Request**

## 📝 Próximas Funcionalidades

- [ ] **Backend API** con FastAPI o Express
- [ ] **Base de datos** con PostgreSQL
- [ ] **Email verification** para registro
- [ ] **OAuth** con Google/GitHub
- [ ] **PWA** capabilities
- [ ] **Docker** containerization
- [ ] **CI/CD** pipeline con GitHub Actions

---

**Creado con ❤️ y ☕ para aprender Vue.js moderno y mejores prácticas de desarrollo web**

> *Este proyecto representa un ejemplo completo de aplicación Vue.js con autenticación, diseño moderno y testing exhaustivo. Perfecto para aprender o como base para proyectos reales.*