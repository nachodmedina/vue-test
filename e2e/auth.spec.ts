import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Interceptar llamadas a la API
    await page.route('**/api/auth/**', async (route) => {
      const url = route.request().url()
      
      if (url.includes('/login')) {
        const requestBody = await route.request().postDataJSON()
        
        // Simular login exitoso
        if (requestBody.email === 'admin@test.com' && requestBody.password === 'password123') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              access_token: 'mock-jwt-token',
              refresh_token: 'mock-refresh-token',
              user: {
                id: '1',
                email: 'admin@test.com',
                username: 'admin',
                firstName: 'Admin',
                lastName: 'User',
                role: 'admin',
                isEmailVerified: true,
                twoFactorEnabled: false,
                createdAt: '2023-01-01T00:00:00Z',
                updatedAt: '2023-01-01T00:00:00Z'
              }
            })
          })
        } 
        // Simular login con 2FA
        else if (requestBody.email === '2fa@test.com' && requestBody.password === 'password123') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              requires_2fa: true,
              temp_token: 'temp-token-123',
              message: 'Código de verificación requerido'
            })
          })
        }
        // Simular credenciales incorrectas
        else {
          await route.fulfill({
            status: 401,
            contentType: 'application/json',
            body: JSON.stringify({
              message: 'Credenciales inválidas'
            })
          })
        }
      }
      
      else if (url.includes('/verify-2fa')) {
        const requestBody = await route.request().postDataJSON()
        
        if (requestBody.code === '123456') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              access_token: 'mock-jwt-token-2fa',
              refresh_token: 'mock-refresh-token-2fa',
              user: {
                id: '2',
                email: '2fa@test.com',
                username: '2fa_user',
                firstName: '2FA',
                lastName: 'User',
                role: 'user',
                isEmailVerified: true,
                twoFactorEnabled: true,
                createdAt: '2023-01-01T00:00:00Z',
                updatedAt: '2023-01-01T00:00:00Z'
              }
            })
          })
        } else {
          await route.fulfill({
            status: 401,
            contentType: 'application/json',
            body: JSON.stringify({
              message: 'Código de verificación inválido'
            })
          })
        }
      }
      
      else if (url.includes('/me')) {
        const authHeader = route.request().headers().authorization
        
        if (authHeader && authHeader.includes('mock-jwt-token')) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              id: '1',
              email: 'admin@test.com',
              username: 'admin',
              firstName: 'Admin',
              lastName: 'User',
              role: 'admin',
              isEmailVerified: true,
              twoFactorEnabled: false,
              createdAt: '2023-01-01T00:00:00Z',
              updatedAt: '2023-01-01T00:00:00Z'
            })
          })
        } else {
          await route.fulfill({
            status: 401,
            contentType: 'application/json',
            body: JSON.stringify({
              message: 'Token inválido'
            })
          })
        }
      }
      
      else if (url.includes('/logout')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Sesión cerrada exitosamente'
          })
        })
      }
    })

    await page.goto('/login')
  })

  test('should display login form', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Iniciar Sesión')
    await expect(page.locator('[data-testid=\"email-input\"]')).toBeVisible()
    await expect(page.locator('[data-testid=\"password-input\"]')).toBeVisible()
    await expect(page.locator('[data-testid=\"login-button\"]')).toBeVisible()
  })

  test('should validate empty form', async ({ page }) => {
    await page.click('[data-testid=\"login-button\"]')
    
    // Verificar que no se envía el formulario con campos vacíos
    await expect(page.locator('[data-testid=\"email-input\"]')).toHaveAttribute('required')
    await expect(page.locator('[data-testid=\"password-input\"]')).toHaveAttribute('required')
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.fill('[data-testid=\"email-input\"]', 'wrong@test.com')
    await page.fill('[data-testid=\"password-input\"]', 'wrongpassword')
    await page.click('[data-testid=\"login-button\"]')

    await expect(page.locator('[data-testid=\"error-message\"]')).toContainText('Credenciales inválidas')
  })

  test('should login successfully and redirect to dashboard', async ({ page }) => {
    await page.fill('[data-testid=\"email-input\"]', 'admin@test.com')
    await page.fill('[data-testid=\"password-input\"]', 'password123')
    await page.click('[data-testid=\"login-button\"]')

    // Esperar redirección al dashboard
    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('h1')).toContainText('Bienvenido, Admin!')
  })

  test('should handle 2FA flow', async ({ page }) => {
    // Primer paso: login con credenciales que requieren 2FA
    await page.fill('[data-testid=\"email-input\"]', '2fa@test.com')
    await page.fill('[data-testid=\"password-input\"]', 'password123')
    await page.click('[data-testid=\"login-button\"]')

    // Verificar que aparece el formulario de 2FA
    await expect(page.locator('h2')).toContainText('Verificación en dos pasos')
    await expect(page.locator('[data-testid=\"2fa-code-input\"]')).toBeVisible()

    // Ingresar código incorrecto
    await page.fill('[data-testid=\"2fa-code-input\"]', '000000')
    await page.click('[data-testid=\"verify-2fa-button\"]')
    
    await expect(page.locator('[data-testid=\"error-message\"]')).toContainText('Código de verificación inválido')

    // Ingresar código correcto
    await page.fill('[data-testid=\"2fa-code-input\"]', '123456')
    await page.click('[data-testid=\"verify-2fa-button\"]')

    // Verificar redirección exitosa
    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('h1')).toContainText('Bienvenido, 2FA!')
  })

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.locator('[data-testid=\"password-input\"]')
    const toggleButton = page.locator('.password-toggle')

    // Verificar que inicialmente es tipo password
    await expect(passwordInput).toHaveAttribute('type', 'password')

    // Hacer clic en el toggle
    await toggleButton.click()
    await expect(passwordInput).toHaveAttribute('type', 'text')

    // Hacer clic de nuevo para ocultar
    await toggleButton.click()
    await expect(passwordInput).toHaveAttribute('type', 'password')
  })

  test('should cancel 2FA and return to login', async ({ page }) => {
    // Activar 2FA
    await page.fill('[data-testid=\"email-input\"]', '2fa@test.com')
    await page.fill('[data-testid=\"password-input\"]', 'password123')
    await page.click('[data-testid=\"login-button\"]')

    await expect(page.locator('h2')).toContainText('Verificación en dos pasos')

    // Cancelar 2FA
    await page.click('text=Cancelar')

    // Verificar que vuelve al formulario de login
    await expect(page.locator('h1')).toContainText('Iniciar Sesión')
    await expect(page.locator('[data-testid=\"email-input\"]')).toBeVisible()
  })
})

test.describe('Protected Routes', () => {
  test('should redirect unauthenticated users to login', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/login?redirect=%2Fdashboard')
  })

  test('should allow authenticated users to access protected routes', async ({ page }) => {
    // Mock autenticación en localStorage
    await page.addInitScript(() => {
      localStorage.setItem('token', 'mock-jwt-token')
      localStorage.setItem('user', JSON.stringify({
        id: '1',
        email: 'admin@test.com',
        firstName: 'Admin',
        role: 'admin'
      }))
    })

    // Interceptar llamada de verificación del usuario
    await page.route('**/api/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '1',
          email: 'admin@test.com',
          username: 'admin',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          isEmailVerified: true,
          twoFactorEnabled: false
        })
      })
    })

    await page.goto('/dashboard')
    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('h1')).toContainText('Bienvenido')
  })
})

test.describe('Navigation', () => {
  test('should show different navigation for authenticated users', async ({ page }) => {
    // Mock autenticación
    await page.addInitScript(() => {
      localStorage.setItem('token', 'mock-jwt-token')
      localStorage.setItem('user', JSON.stringify({
        id: '1',
        email: 'admin@test.com',
        firstName: 'Admin',
        role: 'admin'
      }))
    })

    await page.route('**/api/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '1',
          firstName: 'Admin',
          role: 'admin'
        })
      })
    })

    await page.goto('/')

    // Verificar navegación autenticada
    await expect(page.locator('text=Dashboard')).toBeVisible()
    await expect(page.locator('text=Hola, Admin!')).toBeVisible()
    await expect(page.locator('text=Cerrar Sesión')).toBeVisible()

    // No debería mostrar botones de login/registro
    await expect(page.locator('text=Iniciar Sesión')).not.toBeVisible()
    await expect(page.locator('text=Registrarse')).not.toBeVisible()
  })

  test('should logout successfully', async ({ page }) => {
    // Mock autenticación inicial
    await page.addInitScript(() => {
      localStorage.setItem('token', 'mock-jwt-token')
      localStorage.setItem('user', JSON.stringify({
        id: '1',
        firstName: 'Admin',
        role: 'admin'
      }))
    })

    await page.route('**/api/auth/**', async (route) => {
      if (route.request().url().includes('/me')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ id: '1', firstName: 'Admin', role: 'admin' })
        })
      } else if (route.request().url().includes('/logout')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Logout successful' })
        })
      }
    })

    await page.goto('/')

    // Hacer logout
    await page.click('text=Cerrar Sesión')

    // Verificar que se muestra la navegación pública
    await expect(page.locator('text=Iniciar Sesión')).toBeVisible()
    await expect(page.locator('text=Registrarse')).toBeVisible()
    await expect(page.locator('text=Dashboard')).not.toBeVisible()
  })
})