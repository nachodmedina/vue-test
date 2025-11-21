import { test, expect } from '@playwright/test';

// Mock data para los tests
const mockUsers = [
  {
    id: 1,
    name: 'Leanne Graham',
    username: 'Bret',
    email: 'Sincere@april.biz',
    phone: '1-770-736-8031 x56442',
    website: 'hildegard.org',
    address: {
      street: 'Kulas Light',
      suite: 'Apt. 556',
      city: 'Gwenborough',
      zipcode: '92998-3874',
      geo: { lat: '-37.3159', lng: '81.1496' }
    },
    company: {
      name: 'Romaguera-Crona',
      catchPhrase: 'Multi-layered client-server neural-net',
      bs: 'harness real-time e-markets'
    }
  },
  {
    id: 2,
    name: 'Ervin Howell',
    username: 'Antonette',
    email: 'Shanna@melissa.tv',
    phone: '010-692-6593 x09125',
    website: 'anastasia.net',
    address: {
      street: 'Victor Plains',
      suite: 'Suite 879',
      city: 'Wisokyburgh',
      zipcode: '90566-7771',
      geo: { lat: '-43.9509', lng: '-34.4618' }
    },
    company: {
      name: 'Deckow-Crist',
      catchPhrase: 'Proactive didactic contingency',
      bs: 'synergize scalable supply-chains'
    }
  }
];

test.describe('Users Page - API Mocking', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/users');
  });

  test('muestra estado inicial sin usuarios', async ({ page }) => {
    await expect(page.getByTestId('empty-state')).toBeVisible();
    await expect(page.getByTestId('load-users-btn')).toBeVisible();
    await expect(page.getByTestId('load-users-btn')).toHaveText('Cargar Usuarios');
  });

  test('carga usuarios exitosamente desde API', async ({ page }) => {
    // Mock de la API exitosa con un pequeño delay para ver el loading
    await page.route('https://jsonplaceholder.typicode.com/users', async route => {
      await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockUsers)
      });
    });

    // Click en cargar usuarios
    const loadButton = page.getByTestId('load-users-btn');
    await loadButton.click();

    // Verificar que el botón cambia a "Cargando..."
    await expect(loadButton).toHaveText('Cargando...');
    await expect(loadButton).toBeDisabled();

    // Esperar que se carguen los usuarios
    await expect(page.getByTestId('users-list')).toBeVisible();
    await expect(page.getByTestId('total-users')).toHaveText('2 usuarios');

    // Verificar que aparecen las tarjetas de usuarios
    await expect(page.getByTestId('user-card-1')).toBeVisible();
    await expect(page.getByTestId('user-card-2')).toBeVisible();
    
    // Verificar contenido del primer usuario
    await expect(page.getByTestId('user-card-1')).toContainText('Leanne Graham');
    await expect(page.getByTestId('user-card-1')).toContainText('@Bret');
    await expect(page.getByTestId('user-card-1')).toContainText('Sincere@april.biz');
    await expect(page.getByTestId('user-card-1')).toContainText('Gwenborough');

    // Verificar que el botón vuelve a su estado normal
    await expect(loadButton).toHaveText('Cargar Usuarios');
    await expect(loadButton).toBeEnabled();
  });

  test('maneja errores de red correctamente', async ({ page }) => {
    // Mock de error de red - interceptar antes del click
    await page.route('https://jsonplaceholder.typicode.com/users', async route => {
      await route.abort('failed');
    });

    // Click en cargar usuarios
    await page.getByTestId('load-users-btn').click();
    
    // Verificar que aparece el banner de error
    await expect(page.getByTestId('error-banner')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('error-banner')).toContainText('Error al cargar usuarios');
    
    // Verificar que el botón de reintentar está presente
    await expect(page.getByTestId('retry-btn')).toBeVisible();
  });

  test('maneja error 404 de la API', async ({ page }) => {
    // Mock de error 404
    await page.route('https://jsonplaceholder.typicode.com/users', async route => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Not Found' })
      });
    });

    await page.getByTestId('load-users-btn').click();
    
    await expect(page.getByTestId('error-banner')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('error-banner')).toContainText('Error 404');
  });

  test('maneja error 500 del servidor', async ({ page }) => {
    // Mock de error interno del servidor
    await page.route('https://jsonplaceholder.typicode.com/users', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      });
    });

    await page.getByTestId('load-users-btn').click();
    
    await expect(page.getByTestId('error-banner')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('error-banner')).toContainText('Error 500');
  });

  test('funcionalidad de reintentar después de error', async ({ page }) => {
    let requestCount = 0;

    // Primera llamada falla, segunda funciona
    await page.route('https://jsonplaceholder.typicode.com/users', async route => {
      requestCount++;
      if (requestCount === 1) {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Server Error' })
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockUsers)
        });
      }
    });

    // Primera llamada (falla)
    await page.getByTestId('load-users-btn').click();
    await expect(page.getByTestId('error-banner')).toBeVisible({ timeout: 10000 });

    // Reintentar (exitosa)
    await page.getByTestId('retry-btn').click();
    await expect(page.getByTestId('users-list')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('total-users')).toHaveText('2 usuarios');
  });

  test('abre y cierra modal de detalle de usuario', async ({ page }) => {
    // Mock exitoso
    await page.route('https://jsonplaceholder.typicode.com/users', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockUsers)
      });
    });

    // Cargar usuarios
    await page.getByTestId('load-users-btn').click();
    await expect(page.getByTestId('users-list')).toBeVisible();

    // Click en el primer usuario
    await page.getByTestId('user-card-1').click();

    // Verificar que se abre el modal
    await expect(page.getByTestId('user-modal')).toBeVisible();
    await expect(page.getByTestId('user-modal')).toContainText('Leanne Graham');
    await expect(page.getByTestId('user-modal')).toContainText('Romaguera-Crona');
    await expect(page.getByTestId('user-modal')).toContainText('Multi-layered client-server neural-net');

    // Cerrar modal con botón X
    await page.getByTestId('close-modal-btn').click();
    await expect(page.getByTestId('user-modal')).not.toBeVisible();
  });

  test('simula respuesta lenta de API', async ({ page }) => {
    // Mock con delay
    await page.route('https://jsonplaceholder.typicode.com/users', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 segundo de delay
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockUsers)
      });
    });

    await page.getByTestId('load-users-btn').click();
    
    // Verificar que aparece el loading state
    await expect(page.getByTestId('loading-state')).toBeVisible();
    await expect(page.getByText('Cargando usuarios...')).toBeVisible();
    
    // Esperar que termine la carga
    await expect(page.getByTestId('users-list')).toBeVisible();
  });
});

test.describe('Users Page - Sin Mocking (API Real)', () => {
  test('carga usuarios reales de JSONPlaceholder', async ({ page }) => {
    await page.goto('/users');
    
    await page.getByTestId('load-users-btn').click();
    
    // Esperar que se carguen los usuarios reales (puede tardar más)
    await expect(page.getByTestId('users-list')).toBeVisible({ timeout: 10000 });
    
    // Verificar que hay usuarios (JSONPlaceholder devuelve 10)
    const totalUsers = page.getByTestId('total-users');
    await expect(totalUsers).toContainText('usuarios');
    
    // Verificar que al menos hay algunas tarjetas
    const userCards = page.locator('[data-testid^="user-card-"]');
    await expect(userCards.first()).toBeVisible();
  });
});