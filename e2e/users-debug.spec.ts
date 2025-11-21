import { test, expect } from '@playwright/test';

// Test simplificado para debugging
test.describe('Users Page - Debug', () => {
  test('test básico de carga de página', async ({ page }) => {
    await page.goto('/users');
    
    // Verificar que la página carga - usar selector más específico
    await expect(page.locator('.users-page h1')).toHaveText('Usuarios');
    await expect(page.getByTestId('load-users-btn')).toBeVisible();
    await expect(page.getByTestId('empty-state')).toBeVisible();
  });

  test('test de mock simple', async ({ page }) => {
    // Mock muy básico
    await page.route('https://jsonplaceholder.typicode.com/users', async route => {
      console.log('Route intercepted!');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 1, name: 'Test User', username: 'test', email: 'test@test.com', 
            phone: '123', website: 'test.com', 
            address: { street: 'Test St', suite: '1', city: 'Test City', zipcode: '12345', geo: { lat: '0', lng: '0' }},
            company: { name: 'Test Co', catchPhrase: 'Testing', bs: 'testing' }}
        ])
      });
    });

    await page.goto('/users');
    
    // Click y esperar con timeout más largo
    const loadButton = page.getByTestId('load-users-btn');
    await expect(loadButton).toBeVisible();
    
    await loadButton.click();
    
    // Esperar resultado con timeout más largo
    await expect(page.getByTestId('users-list')).toBeVisible({ timeout: 15000 });
    await expect(page.getByTestId('total-users')).toHaveText('1 usuarios');
  });
});