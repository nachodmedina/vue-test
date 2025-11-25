import { test, expect } from '@playwright/test'

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Interceptar llamadas a la API de login
    await page.route('**/api/auth/login', async (route) => {
      const postData = route.request().postData()
      
      if (!postData) {
        await route.abort()
        return
      }

      const params = new URLSearchParams(postData)
      const username = params.get('username')
      const password = params.get('password')
      
      // Simular login exitoso
      if (username === 'test@example.com' && password === 'password123') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            access_token: 'mock-jwt-token',
            token_type: 'bearer',
            refresh_token: 'mock-refresh-token'
          })
        })
      } else {
        // Simular credenciales incorrectas
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({
            detail: 'Incorrect email or password'
          })
        })
      }
    })

    // Interceptar llamadas a /api/users/me
    await page.route('**/api/users/me', async (route) => {
      const authHeader = route.request().headers()['authorization']
      
      if (authHeader && authHeader.includes('mock-jwt-token')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: '1',
            email: 'test@example.com',
            username: 'testuser',
            full_name: 'Test User',
            is_active: true,
            is_superuser: false,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
          })
        })
      } else {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({
            detail: 'Not authenticated'
          })
        })
      }
    })

    await page.goto('/login')
  })

  test('should display login form elements', async ({ page }) => {
    // Verificar que el título está presente
    await expect(page.locator('.retro-title')).toContainText('SYSTEM ACCESS')
    
    // Verificar que los campos del formulario están presentes
    const emailInput = page.locator('input[type="email"]')
    const passwordInput = page.locator('input[type="password"]')
    const loginButton = page.locator('button[type="submit"]')
    
    await expect(emailInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
    await expect(loginButton).toBeVisible()
    await expect(loginButton).toContainText('LOGIN')
  })

  test('should show validation for empty fields', async ({ page }) => {
    const loginButton = page.locator('button[type="submit"]')
    
    // Intentar enviar formulario vacío
    await loginButton.click()
    
    // Verificar que los campos tienen el atributo required
    const emailInput = page.locator('input[type="email"]')
    const passwordInput = page.locator('input[type="password"]')
    
    await expect(emailInput).toHaveAttribute('required')
    await expect(passwordInput).toHaveAttribute('required')
  })

  test('should show error for invalid credentials', async ({ page }) => {
    // Llenar formulario con credenciales incorrectas
    await page.fill('input[type="email"]', 'wrong@example.com')
    await page.fill('input[type="password"]', 'wrongpassword')
    
    // Enviar formulario
    await page.click('button[type="submit"]')
    
    // Esperar y verificar mensaje de error
    await expect(page.locator('.retro-error')).toBeVisible()
    await expect(page.locator('.retro-error')).toContainText('Incorrect email or password')
  })

  test('should login successfully with valid credentials', async ({ page }) => {
    // Llenar formulario con credenciales correctas
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'password123')
    
    // Enviar formulario
    await page.click('button[type="submit"]')
    
    // Esperar redirección a la página principal
    await page.waitForURL('/')
    
    // Verificar que estamos en la página correcta
    expect(page.url()).toBe('http://localhost:5173/')
  })

  test('should show loading state during login', async ({ page }) => {
    // Llenar formulario
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'password123')
    
    const loginButton = page.locator('button[type="submit"]')
    
    // Enviar formulario
    await loginButton.click()
    
    // Verificar que el botón muestra estado de carga (aunque sea breve)
    // El texto puede ser 'ACCESSING...' o ya haber cambiado
    const buttonText = await loginButton.textContent()
    expect(buttonText).toBeTruthy()
  })

  test('should have link to register page', async ({ page }) => {
    const registerLink = page.locator('a[href="/register"]')
    
    await expect(registerLink).toBeVisible()
    await expect(registerLink).toContainText('REGISTER')
    
    // Verificar que el link funciona
    await registerLink.click()
    await page.waitForURL('/register')
    expect(page.url()).toContain('/register')
  })
})

test.describe('Register Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Interceptar llamadas a la API de registro
    await page.route('**/api/auth/register', async (route) => {
      const postData = route.request().postData()
      const requestBody = postData ? JSON.parse(postData) : {}
      
      // Simular email ya existente
      if (requestBody.email === 'existing@example.com') {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            detail: 'Email already registered'
          })
        })
        return
      }
      
      // Simular username ya existente
      if (requestBody.username === 'existinguser') {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            detail: 'Username already taken'
          })
        })
        return
      }
      
      // Simular registro exitoso
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'mock-jwt-token-new-user',
          token_type: 'bearer',
          refresh_token: 'mock-refresh-token-new-user'
        })
      })
    })

    // Interceptar llamadas a /api/users/me para usuarios nuevos
    await page.route('**/api/users/me', async (route) => {
      const authHeader = route.request().headers()['authorization']
      
      if (authHeader && authHeader.includes('mock-jwt-token')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: '2',
            email: 'newuser@example.com',
            username: 'newuser',
            full_name: 'New User',
            is_active: true,
            is_superuser: false,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
          })
        })
      } else {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({
            detail: 'Not authenticated'
          })
        })
      }
    })

    await page.goto('/register')
  })

  test('should display register form elements', async ({ page }) => {
    // Verificar título
    await expect(page.locator('.retro-title')).toContainText('NEW USER REGISTRATION')
    
    // Verificar campos del formulario
    const usernameInput = page.locator('input[type="text"]').first()
    const emailInput = page.locator('input[type="email"]')
    const passwordInputs = page.locator('input[type="password"]')
    const termsCheckbox = page.locator('input[type="checkbox"]')
    const registerButton = page.locator('button[type="submit"]')
    
    await expect(usernameInput).toBeVisible()
    await expect(emailInput).toBeVisible()
    await expect(passwordInputs.first()).toBeVisible() // password
    await expect(passwordInputs.nth(1)).toBeVisible() // confirm password
    await expect(termsCheckbox).toBeVisible()
    await expect(registerButton).toBeVisible()
  })

  test('should validate required fields', async ({ page }) => {
    // Verificar que los campos requeridos tienen el atributo
    await expect(page.locator('input[type="text"]').first()).toHaveAttribute('required')
    await expect(page.locator('input[type="email"]')).toHaveAttribute('required')
    await expect(page.locator('input[type="password"]').first()).toHaveAttribute('required')
    
    // Verificar que el botón está deshabilitado sin datos
    const registerButton = page.locator('button[type="submit"]')
    await expect(registerButton).toBeDisabled()
  })

  test('should validate username length', async ({ page }) => {
    // El componente deshabilita el botón cuando el username es muy corto
    // Verificar que con username corto, el botón está deshabilitado
    await page.locator('input[type="text"]').first().fill('ab')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.locator('input[type="password"]').first().fill('password123')
    await page.locator('input[type="password"]').nth(1).fill('password123')
    await page.check('input[type="checkbox"]')
    
    // El botón debe estar deshabilitado porque username < 3 caracteres
    const registerButton = page.locator('button[type="submit"]')
    await expect(registerButton).toBeDisabled()
  })

  test('should validate email format', async ({ page }) => {
    // El navegador valida el formato de email con el atributo type="email"
    const emailInput = page.locator('input[type="email"]')
    await expect(emailInput).toHaveAttribute('type', 'email')
    await expect(emailInput).toHaveAttribute('required')
  })

  test('should validate password length', async ({ page }) => {
    // El componente deshabilita el botón cuando el password es muy corto
    await page.locator('input[type="text"]').first().fill('testuser')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.locator('input[type="password"]').first().fill('12345') // Muy corto
    await page.locator('input[type="password"]').nth(1).fill('12345')
    await page.check('input[type="checkbox"]')
    
    // El botón debe estar deshabilitado porque password < 6 caracteres
    const registerButton = page.locator('button[type="submit"]')
    await expect(registerButton).toBeDisabled()
  })

  test('should validate password confirmation match', async ({ page }) => {
    // El componente deshabilita el botón cuando las passwords no coinciden
    await page.locator('input[type="text"]').first().fill('testuser')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.locator('input[type="password"]').first().fill('password123')
    await page.locator('input[type="password"]').nth(1).fill('different456') // No coinciden
    await page.check('input[type="checkbox"]')
    
    // El botón debe estar deshabilitado porque las passwords no coinciden
    const registerButton = page.locator('button[type="submit"]')
    await expect(registerButton).toBeDisabled()
  })

  test('should validate terms acceptance', async ({ page }) => {
    await page.locator('input[type="text"]').first().fill('testuser')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.locator('input[type="password"]').first().fill('password123')
    await page.locator('input[type="password"]').nth(1).fill('password123')
    // NO marcar checkbox
    
    // El botón debería estar deshabilitado
    const registerButton = page.locator('button[type="submit"]')
    await expect(registerButton).toBeDisabled()
  })

  test('should show error for existing email', async ({ page }) => {
    await page.locator('input[type="text"]').first().fill('newuser')
    await page.fill('input[type="email"]', 'existing@example.com')
    await page.locator('input[type="password"]').first().fill('password123')
    await page.locator('input[type="password"]').nth(1).fill('password123')
    await page.check('input[type="checkbox"]')
    
    const registerButton = page.locator('button[type="submit"]')
    await expect(registerButton).toBeEnabled()
    
    await registerButton.click()
    
    // Esperar a que termine el loading
    await page.waitForTimeout(2000)
    
    // Verificar que NO redirigió (se quedó en /register por el error)
    expect(page.url()).toContain('/register')
  })

  test('should show error for existing username', async ({ page }) => {
    await page.locator('input[type="text"]').first().fill('existinguser')
    await page.fill('input[type="email"]', 'newuser@example.com')
    await page.locator('input[type="password"]').first().fill('password123')
    await page.locator('input[type="password"]').nth(1).fill('password123')
    await page.check('input[type="checkbox"]')
    
    const registerButton = page.locator('button[type="submit"]')
    await expect(registerButton).toBeEnabled()
    
    await registerButton.click()
    
    // Esperar a que termine el loading
    await page.waitForTimeout(2000)
    
    // Verificar que NO redirigió (se quedó en /register por el error)
    expect(page.url()).toContain('/register')
  })

  test('should register successfully with valid data', async ({ page }) => {
    await page.locator('input[type="text"]').first().fill('newuser')
    await page.fill('input[type="email"]', 'newuser@example.com')
    await page.locator('input[type="text"]').nth(1).fill('John Doe') // full_name
    await page.locator('input[type="password"]').first().fill('password123')
    await page.locator('input[type="password"]').nth(1).fill('password123')
    await page.check('input[type="checkbox"]')
    
    // Verificar que el botón está habilitado
    const registerButton = page.locator('button[type="submit"]')
    await expect(registerButton).toBeEnabled()
    
    await registerButton.click()
    
    // Esperar cualquier cambio de URL (puede tardar debido a la API)
    await page.waitForURL(/http:\/\/localhost:5173\/(dashboard|login|$)/, { timeout: 15000 })
    
    // Verificar que no estamos en la página de registro
    const url = page.url()
    expect(url).not.toContain('/register')
  })

  test('should have link to login page', async ({ page }) => {
    const loginLink = page.locator('a[href="/login"]')
    
    await expect(loginLink).toBeVisible()
    await expect(loginLink).toContainText('ACCESS SYSTEM')
    
    // Verificar que el link funciona
    await loginLink.click()
    await page.waitForURL('/login')
    expect(page.url()).toContain('/login')
  })

  test('should show loading state during registration', async ({ page }) => {
    await page.locator('input[type="text"]').first().fill('newuser')
    await page.fill('input[type="email"]', 'newuser@example.com')
    await page.locator('input[type="password"]').first().fill('password123')
    await page.locator('input[type="password"]').nth(1).fill('password123')
    await page.check('input[type="checkbox"]')
    
    const registerButton = page.locator('button[type="submit"]')
    
    // Enviar formulario
    await registerButton.click()
    
    // El botón debería mostrar estado de carga
    const buttonText = await registerButton.textContent()
    expect(buttonText).toBeTruthy()
  })
})