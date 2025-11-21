import { test, expect } from '@playwright/test';

test.describe('Navegación básica', () => {
  test('debería mostrar la página principal', async ({ page }) => {
    await page.goto('/');
    
    // Verificar que el título principal esté presente
    await expect(page.locator('.greetings h1')).toHaveText('You did it!');
    
    // Verificar que el logo de Vue esté presente
    await expect(page.locator('img[alt="Vue logo"]')).toBeVisible();
  });

  test('debería navegar entre páginas', async ({ page }) => {
    await page.goto('/');
    
    // Verificar que todos los enlaces estén presentes
    await expect(page.locator('nav a[href="/"]')).toHaveText('Home');
    await expect(page.locator('nav a[href="/about"]')).toHaveText('About');
    await expect(page.locator('nav a[href="/counter"]')).toHaveText('Counter');
    await expect(page.locator('nav a[href="/todos"]')).toHaveText('Todos');
    
    // Navegar a la página About
    await page.click('nav a[href="/about"]');
    await page.waitForURL('/about');
    // Buscar el h1 específico de la página About
    await expect(page.locator('.about h1')).toHaveText('This is an about page');
    
    // Navegar a la página Counter
    await page.click('nav a[href="/counter"]');
    await page.waitForURL('/counter');
    await expect(page.locator('.counter-page h1')).toHaveText('Contador Interactivo');
    
    // Navegar a la página Todos
    await page.click('nav a[href="/todos"]');
    await page.waitForURL('/todos');
    await expect(page.locator('.todos-page h1')).toHaveText('Lista de Tareas');
  });
});