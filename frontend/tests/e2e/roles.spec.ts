import { test, expect } from '@playwright/test';

test('Viewer role cannot open create-invoice actions', async ({ page }) => {
  // Login as viewer (already seeded)
  await page.goto('/auth/login');
  await page.fill('input[id="email"]', 'viewer@acmesolutions.co');
  await page.fill('input[id="password"]', 'demo1234');
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL(/\/dashboard/);
  
  // Go to invoices
  await page.goto('/invoices');
  
  // The 'New Invoice' button should be hidden from UI
  await expect(page.locator('text=New Invoice')).toHaveCount(0);

  // Directly hitting the URL should be rejected (either redirect or error)
  await page.goto('/create-invoice');
  // It throws an error "This action requires the editor role or higher..."
  // or it might display the error on the screen. Let's just assert we're not on the create-invoice form.
  await expect(page.locator('text=Bill To')).toHaveCount(0);
});
