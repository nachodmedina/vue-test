import { test, expect } from '@playwright/test';

test.describe('Componente Counter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/counter');
  });

  test('debería mostrar el valor inicial en 0', async ({ page }) => {
    await expect(page.getByTestId('counter-value')).toHaveText('0');
  });

  test('debería incrementar el contador', async ({ page }) => {
    // Hacer click en incrementar
    await page.getByTestId('increment-btn').click();
    await expect(page.getByTestId('counter-value')).toHaveText('1');
    
    // Incrementar varias veces
    await page.getByTestId('increment-btn').click();
    await page.getByTestId('increment-btn').click();
    await expect(page.getByTestId('counter-value')).toHaveText('3');
  });

  test('debería decrementar el contador', async ({ page }) => {
    // Primero incrementar para tener algo que decrementar
    await page.getByTestId('increment-btn').click();
    await page.getByTestId('increment-btn').click();
    await expect(page.getByTestId('counter-value')).toHaveText('2');
    
    // Decrementar
    await page.getByTestId('decrement-btn').click();
    await expect(page.getByTestId('counter-value')).toHaveText('1');
  });

  test('no debería decrementar por debajo de 0', async ({ page }) => {
    // El botón de decremento debería estar deshabilitado en 0
    await expect(page.getByTestId('decrement-btn')).toBeDisabled();
    
    // Intentar hacer click (no debería funcionar)
    await page.getByTestId('decrement-btn').click({ force: true });
    await expect(page.getByTestId('counter-value')).toHaveText('0');
  });

  test('debería resetear el contador', async ({ page }) => {
    // Incrementar el contador
    await page.getByTestId('increment-btn').click();
    await page.getByTestId('increment-btn').click();
    await page.getByTestId('increment-btn').click();
    await expect(page.getByTestId('counter-value')).toHaveText('3');
    
    // Resetear
    await page.getByTestId('reset-btn').click();
    await expect(page.getByTestId('counter-value')).toHaveText('0');
  });

  test('debería mostrar el mensaje de logro al llegar a 10', async ({ page }) => {
    // Incrementar hasta 10
    for (let i = 0; i < 10; i++) {
      await page.getByTestId('increment-btn').click();
    }
    
    await expect(page.getByTestId('counter-value')).toHaveText('10');
    await expect(page.getByTestId('achievement')).toBeVisible();
    await expect(page.getByTestId('achievement')).toContainText('¡Has alcanzado 10 o más!');
  });
});