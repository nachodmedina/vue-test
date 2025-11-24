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

### Tests E2E con Playwright
```bash
# Instalar navegadores (solo primera vez)
npx playwright install

# Ejecutar todos los tests E2E
npm run test:e2e

# Tests específicos
npx playwright test auth.spec.ts
npx playwright test navigation.spec.ts  
npx playwright test counter.spec.ts
npx playwright test todos.spec.ts

# Con un solo worker (menos ventanas)
npx playwright test --workers=1

# Ver reporte HTML detallado
npx playwright show-report
```

### Tests Unitarios
```bash
# Ejecutar tests unitarios con Vitest
npm run test:unit

# Con coverage
npm run test:unit -- --coverage
```

### Linting y Calidad
```bash
# Ejecutar ESLint
npm run lint

# Auto-fix de problemas
npm run lint -- --fix
```

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