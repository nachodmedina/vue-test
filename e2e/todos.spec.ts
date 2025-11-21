import { test, expect } from '@playwright/test';

test.describe('Todos Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/todos');
  });

  test('muestra la lista inicial y el estado de completado', async ({ page }) => {
    // Los todos iniciales vienen del store: id 1 (pending), id 2 (completed)
    await expect(page.getByTestId('todo-item-1')).toBeVisible();
    await expect(page.getByTestId('todo-checkbox-1')).not.toBeChecked();

    await expect(page.getByTestId('todo-item-2')).toBeVisible();
    await expect(page.getByTestId('todo-checkbox-2')).toBeChecked();
  });

  test('agrega una nueva tarea', async ({ page }) => {
    const input = page.getByTestId('todo-input');
    const addBtn = page.getByTestId('add-todo-btn');

    await input.fill('Comprar leche');
    await addBtn.click();

    // Nuevo item debe aparecer con id 3 (según store inicial)
    await expect(page.getByTestId('todo-list')).toContainText('Comprar leche');
  });

  test('marca y desmarca una tarea (toggle)', async ({ page }) => {
    // Asegurarnos de que el item 1 está inicialmente sin completar
    const checkbox1 = page.getByTestId('todo-checkbox-1');
    await expect(checkbox1).not.toBeChecked();

    // Marcar como completado
    await checkbox1.click();
    await expect(checkbox1).toBeChecked();

    // Desmarcar
    await checkbox1.click();
    await expect(checkbox1).not.toBeChecked();
  });

  test('elimina una tarea', async ({ page }) => {
    // Añadir una tarea temporal para eliminar
    await page.getByTestId('todo-input').fill('Tarea a eliminar');
    await page.getByTestId('add-todo-btn').click();

    // Buscar su elemento (aparecerá en la lista)
    await expect(page.getByTestId('todo-list')).toContainText('Tarea a eliminar');

    // Encontrar el botón remove asociado (buscamos por texto y luego el botón dentro del item)
    const item = page.locator('div.todo-item', { hasText: 'Tarea a eliminar' }).first();
    const removeBtn = item.locator('button[title="Eliminar tarea"]');
    await removeBtn.click();

    // Verificar que ya no aparece en la lista
    await expect(page.getByTestId('todo-list')).not.toContainText('Tarea a eliminar');
  });

  test('limpia completadas', async ({ page }) => {
    // Asegurarnos de que hay al menos una completada (id 2 viene completada)
    await expect(page.getByTestId('todo-checkbox-2')).toBeChecked();

    // Click en limpiar completadas
    const clearBtn = page.getByTestId('clear-completed-btn');
    // Si no está visible (por alguna razón), fallará la expectativa y el test avisará
    await expect(clearBtn).toBeVisible();
    await clearBtn.click();

    // El item 2 ya no debe aparecer
    await expect(page.locator('[data-testid="todo-item-2"]')).toHaveCount(0);
  });

  test('estado vacío cuando no hay tareas', async ({ page }) => {
    // Eliminar todas las tareas manualmente
    const items = await page.locator('div.todo-item').all();
    for (let i = 0; i < items.length; i++) {
      const item = page.locator('div.todo-item').nth(0);
      const removeBtn = item.locator('button[title="Eliminar tarea"]');
      await removeBtn.click();
    }

    // Verificar empty state
    await expect(page.getByTestId('empty-state')).toBeVisible();
  });
});
