# Vue Test App 🚀

Un proyecto de Vue.js creado para aprender Vue 3, TypeScript y testing con Playwright.

## 📋 Características

- **Vue 3** con Composition API
- **TypeScript** para type safety
- **Vite** como bundler moderno y rápido
- **Vue Router** para navegación entre páginas
- **Pinia** para state management
- **Playwright** para testing E2E
- **ESLint** para linting de código
- **Vitest** para unit testing

## 🎯 Funcionalidades Implementadas

### 📄 Páginas
- **Home** - Página principal con componente HelloWorld
- **About** - Página informativa básica
- **Counter** - Contador interactivo con funcionalidades:
  - Incrementar/decrementar
  - Reset a cero
  - Validación (no permite valores negativos)
  - Mensaje de logro al llegar a 10
- **Todos** - Lista de tareas con:
  - Agregar nuevas tareas
  - Marcar como completadas
  - Eliminar tareas individuales
  - Limpiar todas las completadas
  - Estado vacío cuando no hay tareas

### 🧩 Componentes
- **TheHeader** - Navegación principal (preparado para futuro uso)
- **TheFooter** - Footer con enlaces (preparado para futuro uso)
- **HelloWorld** - Componente de bienvenida original

### 🗄️ Store (Pinia)
- **TodoStore** - Maneja el estado de las tareas:
  - CRUD completo de todos
  - Computed properties para estadísticas
  - Estado persistente durante la sesión

## 🛠️ Configuración del Proyecto

### Prerequisitos
- Node.js 22+ (requerido para Vite 7+)
- npm o pnpm

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
El proyecto estará disponible en `http://localhost:5173/`

### Build para Producción
```bash
# Verificar tipos y construir
npm run build

# Preview del build de producción
npm run preview
```

## 🧪 Testing

### Tests E2E con Playwright
```bash
# Instalar navegadores de Playwright (solo la primera vez)
npx playwright install

# Ejecutar todos los tests
npm run test:e2e

# Ejecutar tests específicos
npx playwright test navigation.spec.ts
npx playwright test counter.spec.ts
npx playwright test todos.spec.ts

# Ejecutar con un solo worker (menos ventanas)
npx playwright test --workers=1

# Ver reporte HTML de resultados
npx playwright show-report
```

### Tests Unitarios
```bash
# Ejecutar tests unitarios con Vitest
npm run test:unit
```

### Linting
```bash
# Ejecutar ESLint
npm run lint
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── HelloWorld.vue
│   ├── TheHeader.vue    # (preparado para futuro)
│   └── TheFooter.vue    # (preparado para futuro)
├── views/              # Páginas/Vistas
│   ├── HomeView.vue
│   ├── AboutView.vue
│   ├── CounterView.vue
│   └── TodosView.vue
├── stores/             # Pinia stores
│   ├── counter.ts      # (generado automáticamente)
│   └── todos.ts        # Store personalizado
├── router/             # Configuración de rutas
│   └── index.ts
├── assets/             # Archivos estáticos
└── main.ts             # Punto de entrada

e2e/                    # Tests End-to-End
├── navigation.spec.ts  # Tests de navegación
├── counter.spec.ts     # Tests del contador
├── todos.spec.ts       # Tests de la lista de tareas
└── vue.spec.ts         # Test básico original
```

## 🎮 Funcionalidades de Testing

### Cobertura de Tests
- ✅ **Navegación** - Entre todas las páginas
- ✅ **Counter** - Todas las operaciones y validaciones
- ✅ **Todos** - CRUD completo y estados edge case
- ✅ **UI Components** - Elementos interactivos

### Estrategias de Testing Implementadas
- **Data-testid attributes** para selectores estables
- **Page Object Model** implícito en la organización
- **Hooks beforeEach** para setup consistente
- **Expectations específicas** por funcionalidad
- **Cleanup automático** entre tests

## 📚 Recursos de Aprendizaje

- [Vue.js Documentation](https://vuejs.org/)
- [Vite Guide](https://vitejs.dev/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/)

## 🤝 Contribuciones

Este es un proyecto de aprendizaje personal. Si tienes sugerencias o mejoras, ¡son bienvenidas!

---

**Creado con ❤️ para aprender Vue.js y testing moderno**