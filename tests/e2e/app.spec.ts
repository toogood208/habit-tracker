import { expect, test } from '@playwright/test';

test.describe('Habit Tracker app', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test('shows the splash screen and redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('splash-screen')).toBeVisible();
    await page.waitForURL('**/login');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('redirects authenticated users from / to /dashboard', async ({ page }) => {
    await page.goto('/');

    await page.evaluate(() => {
      localStorage.setItem(
        'habit-tracker-session',
        JSON.stringify({
          userId: 'user-1',
          email: 'test@example.com',
        })
      );
    });

    await page.reload();

    await expect(page.getByTestId('splash-screen')).toBeVisible();
    await page.waitForURL('**/dashboard');
    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test('prevents unauthenticated access to /dashboard', async ({ page }) => {
    await page.goto('/dashboard');

    await page.waitForURL('**/login');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('signs up a new user and lands on the dashboard', async ({ page }) => {
    await page.goto('/signup');

    await page.getByTestId('auth-signup-email').fill('newuser@example.com');
    await page.getByTestId('auth-signup-password').fill('password123');
    await page.getByTestId('auth-signup-submit').click();

    await page.waitForURL('**/dashboard');
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
  });

  test("logs in an existing user and loads only that user's habits", async ({ page }) => {
    await page.goto('/login');

    await page.evaluate(() => {
      localStorage.setItem(
        'habit-tracker-users',
        JSON.stringify([
          {
            id: 'user-1',
            email: 'user1@example.com',
            password: 'password123',
            createdAt: '2026-04-26T10:00:00.000Z',
          },
          {
            id: 'user-2',
            email: 'user2@example.com',
            password: 'password456',
            createdAt: '2026-04-26T10:05:00.000Z',
          },
        ])
      );

      localStorage.setItem(
        'habit-tracker-habits',
        JSON.stringify([
          {
            id: 'habit-1',
            userId: 'user-1',
            name: 'Drink Water',
            description: 'Eight glasses',
            frequency: 'daily',
            createdAt: '2026-04-26T10:10:00.000Z',
            completions: [],
          },
          {
            id: 'habit-2',
            userId: 'user-2',
            name: 'Read Books',
            description: 'Ten pages',
            frequency: 'daily',
            createdAt: '2026-04-26T10:15:00.000Z',
            completions: [],
          },
        ])
      );
    });

    await page.getByTestId('auth-login-email').fill('user1@example.com');
    await page.getByTestId('auth-login-password').fill('password123');
    await page.getByTestId('auth-login-submit').click();

    await page.waitForURL('**/dashboard');

    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible();
    await expect(page.getByTestId('habit-card-read-books')).toHaveCount(0);
  });

  test('creates a habit from the dashboard', async ({ page }) => {
    await page.goto('/signup');

    await page.getByTestId('auth-signup-email').fill('creator@example.com');
    await page.getByTestId('auth-signup-password').fill('password123');
    await page.getByTestId('auth-signup-submit').click();

    await page.waitForURL('**/dashboard');

    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Drink Water');
    await page.getByTestId('habit-description-input').fill('Stay hydrated');
    await page.getByTestId('habit-save-button').click();

    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible();
  });

  test('completes a habit for today and updates the streak', async ({ page }) => {
    await page.goto('/signup');

    await page.getByTestId('auth-signup-email').fill('streak@example.com');
    await page.getByTestId('auth-signup-password').fill('password123');
    await page.getByTestId('auth-signup-submit').click();

    await page.waitForURL('**/dashboard');

    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Drink Water');
    await page.getByTestId('habit-save-button').click();

    await expect(page.getByTestId('habit-streak-drink-water')).toHaveText(
      /Current streak: 0/
    );

    await page.getByTestId('habit-complete-drink-water').click();

    await expect(page.getByTestId('habit-streak-drink-water')).toHaveText(
      /Current streak: 1/
    );
  });

  test('persists session and habits after page reload', async ({ page }) => {
    await page.goto('/signup');

    await page.getByTestId('auth-signup-email').fill('persist@example.com');
    await page.getByTestId('auth-signup-password').fill('password123');
    await page.getByTestId('auth-signup-submit').click();

    await page.waitForURL('**/dashboard');

    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Drink Water');
    await page.getByTestId('habit-save-button').click();

    await page.reload();

    await expect(page.getByTestId('dashboard-page')).toBeVisible();
    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible();
  });

  test('logs out and redirects to /login', async ({ page }) => {
    await page.goto('/signup');

    await page.getByTestId('auth-signup-email').fill('logout@example.com');
    await page.getByTestId('auth-signup-password').fill('password123');
    await page.getByTestId('auth-signup-submit').click();

    await page.waitForURL('**/dashboard');

    await page.getByTestId('auth-logout-button').click();

    await page.waitForURL('**/login');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('loads the cached app shell when offline after the app has been loaded once', async ({ page, context }) => {
    await page.goto('/');

    await page.waitForTimeout(1500);

    await context.setOffline(true);

    await page.goto('/');

    await expect(page.getByTestId('splash-screen')).toBeVisible();

    await context.setOffline(false);
  });
});
