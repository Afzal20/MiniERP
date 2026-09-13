import { test, expect } from '@playwright/test';

test('Signup creates an organization and lands on dashboard', async ({ page }) => {
  const email = `test-${Date.now()}@bizpilot.app`;
  
  await page.goto('/auth/sign-up');
  await page.fill('input[id="email"]', email);
  await page.fill('input[id="password"]', 'demo1234');
  await page.fill('input[id="repeat-password"]', 'demo1234');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(/\/auth\/sign-up-success/);
  
  await page.goto('/auth/login');
  await page.fill('input[id="email"]', email);
  await page.fill('input[id="password"]', 'demo1234');
  await page.click('button[type="submit"]');
  
  // since this is a new signup without email confirmation block (disabled in local config), 
  // login works immediately and redirects to dashboard (which creates org automatically).
  await expect(page).toHaveURL(/\/dashboard/);
});
