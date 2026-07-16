import path from 'path';
import { expect, test } from '@playwright/test';

const harPath = path.join(__dirname, 'fixtures', 'constructor.har');

const ingredientName = 'Краторная булка N-200i';
const fillingName = 'Биокотлета из марсианской Магнолии';

async function waitForAppReady(page: Parameters<typeof test>[0]['page']) {
  await expect(page.getByText('Соберите бургер')).toBeVisible();
  await expect(page.getByText(ingredientName)).toBeVisible();
  await expect(page.getByText(fillingName)).toBeVisible();
}

async function addIngredient(page: Parameters<typeof test>[0]['page'], name: string) {
  const ingredientCard = page.locator('li').filter({ hasText: name }).first();
  await ingredientCard.getByRole('button', { name: 'Добавить' }).click();
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('refreshToken', 'test-refresh-token');
    document.cookie = 'accessToken=Bearer test-access-token';
  });

  await page.routeFromHAR(harPath, {
    url: '**/api/**',
    update: false,
    notFound: 'abort'
  });
});

test('добавляет ингредиенты в конструктор', async ({ page }) => {
  await page.goto('/');
  await waitForAppReady(page);

  await addIngredient(page, ingredientName);
  await addIngredient(page, fillingName);

  await expect(page.locator('span').filter({ hasText: /^Краторная булка N-200i \(верх\)$/ })).toBeVisible();
  await expect(page.locator('span').filter({ hasText: /^Биокотлета из марсианской Магнолии$/ })).toBeVisible();
});

test('открывает и закрывает модальное окно ингредиента', async ({ page }) => {
  await page.goto('/');
  await waitForAppReady(page);

  await page.getByRole('link', { name: /Краторная булка N-200i/i }).click();

  const modal = page.locator('#modals');

  await expect(page.getByRole('heading', { name: 'Детали ингредиента' })).toBeVisible();
  await expect(modal.getByRole('heading', { name: 'Краторная булка N-200i' })).toBeVisible();

  await page.locator('button').filter({ has: page.locator('svg') }).last().click();
  await expect(page.getByRole('heading', { name: 'Детали ингредиента' })).toHaveCount(0);

  await page.getByRole('link', { name: /Краторная булка N-200i/i }).click();
  await expect(page.getByRole('heading', { name: 'Детали ингредиента' })).toBeVisible();

  await page.locator('body').click({ position: { x: 10, y: 10 } });
  await expect(page.getByRole('heading', { name: 'Детали ингредиента' })).toHaveCount(0);
});

test('оформляет заказ и закрывает модальное окно', async ({ page }) => {
  await page.goto('/');
  await waitForAppReady(page);

  await addIngredient(page, ingredientName);
  await addIngredient(page, fillingName);

  await page.getByRole('button', { name: 'Оформить заказ' }).click();

  await expect(page.getByText('идентификатор заказа')).toBeVisible();
  await expect(page.getByText('4321')).toBeVisible();

  await expect(page.getByText('Выберите булки')).toHaveCount(2);
  await expect(page.getByText('Выберите начинку')).toBeVisible();

  await page.locator('button').filter({ has: page.locator('svg') }).last().click();
  await expect(page.getByText('идентификатор заказа')).toHaveCount(0);
});
