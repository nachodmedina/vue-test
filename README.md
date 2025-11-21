# vue-test

Proyecto Vue para familiarizarme con el lenguaje y testing con Playwright

## Descripción del Proyecto

Este es un proyecto creado desde cero con Vue 3 y Vite, diseñado para:
- Familiarizarse con Vue.js y su ecosistema
- Aprender y probar Playwright para testing end-to-end
- Servir como base para futuras iteraciones y desarrollo de una aplicación web

## Configuración Recomendada del IDE

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (desactiva Vetur si lo tienes instalado).

## Configuración Recomendada del Navegador

- Navegadores basados en Chromium (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Activar Custom Object Formatter en Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Activar Custom Object Formatter en Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Soporte de Tipos para Importaciones `.vue` en TypeScript

TypeScript no puede manejar información de tipos para importaciones `.vue` por defecto, así que reemplazamos el CLI `tsc` con `vue-tsc` para la verificación de tipos. En el editor, necesitamos [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) para que el servicio de lenguaje TypeScript reconozca los tipos `.vue`.

## Configuración del Proyecto

### Instalación de Dependencias

```sh
npm install
```

### Compilar y Recarga en Caliente para Desarrollo

```sh
npm run dev
```

### Verificación de Tipos, Compilación y Minificación para Producción

```sh
npm run build
```

### Ejecutar Tests End-to-End con [Playwright](https://playwright.dev)

```sh
# Instalar navegadores para la primera ejecución
npx playwright install

# Cuando se prueba en CI, primero hay que construir el proyecto
npm run build

# Ejecuta los tests end-to-end
npm run test:e2e
# Ejecuta los tests solo en Chromium
npm run test:e2e -- --project=chromium
# Ejecuta los tests de un archivo específico
npm run test:e2e -- tests/example.spec.ts
# Ejecuta los tests en modo debug
npm run test:e2e -- --debug
```

### Lint con [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Estructura del Proyecto

- `src/` - Código fuente de la aplicación Vue
- `e2e/` - Tests end-to-end con Playwright
- `public/` - Archivos estáticos
- `index.html` - Punto de entrada HTML
- `vite.config.ts` - Configuración de Vite
- `playwright.config.ts` - Configuración de Playwright

## Más Información

- [Documentación de Vue 3](https://vuejs.org/)
- [Documentación de Vite](https://vite.dev/)
- [Documentación de Playwright](https://playwright.dev/)
- [Referencia de Configuración de Vite](https://vite.dev/config/)
