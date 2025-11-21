import { test, expect } from '@playwright/test';

// Mock data simplificado
const mockUsers = [
  {
    id: 1,
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    phone: '123-456-7890',
    website: 'johndoe.com',
    address: {
      street: 'Main St',
      suite: 'Apt 1',
      city: 'Springfield',
      zipcode: '12345',
      geo: { lat: '0', lng: '0' }
    },
    company: {
      name: 'Acme Corp',
      catchPhrase: 'Quality products',
      bs: 'business solutions'
    }
  }
];

test.describe('Users API Tests - Simplified', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/users');
  });

  test('carga usuarios con mock exitoso', async ({ page }) => {
    // Mock simple y directo
    await page.route('https://jsonplaceholder.typicode.com/users', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockUsers)
      });
    });

    // Click y esperar resultado
    await page.getByTestId('load-users-btn').click();
    
    await expect(page.getByTestId('users-list')).toBeVisible({ timeout: 15000 });
    await expect(page.getByTestId('total-users')).toHaveText('1 usuarios');
    await expect(page.getByTestId('user-card-1')).toContainText('John Doe');
  });

  test('maneja error 500 con mock', async ({ page }) => {
    await page.route('https://jsonplaceholder.typicode.com/users', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'text/plain',
        body: 'Internal Server Error'
      });
    });

    await page.getByTestId('load-users-btn').click();
    
    await expect(page.getByTestId('error-banner')).toBeVisible({ timeout: 15000 });
    await expect(page.getByTestId('retry-btn')).toBeVisible();
  });

  test('abre modal de usuario', async ({ page }) => {
    await page.route('https://jsonplaceholder.typicode.com/users', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockUsers)
      });
    });

    await page.getByTestId('load-users-btn').click();
    await expect(page.getByTestId('user-card-1')).toBeVisible({ timeout: 15000 });
    
    await page.getByTestId('user-card-1').click();
    
    await expect(page.getByTestId('user-modal')).toBeVisible();
    await expect(page.getByTestId('user-modal')).toContainText('John Doe');
    
    await page.getByTestId('close-modal-btn').click();
    await expect(page.getByTestId('user-modal')).not.toBeVisible();
  });
});