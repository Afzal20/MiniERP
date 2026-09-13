import { test, expect } from '@playwright/test';

test('Can download invoice PDF', async ({ page }) => {
  await page.goto('/auth/login');
  await page.fill('input[id="email"]', 'demo@bizpilot.app');
  await page.fill('input[id="password"]', 'demo1234');
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL(/\/dashboard/);
  
  await page.goto('/invoices');
  
  // Click the first invoice number link
  await page.locator('table tbody tr:first-child td:first-child a').click();
  
  await expect(page).toHaveURL(/\/invoices\/.+/);
  
  // Start waiting for the download
  const downloadPromise = page.waitForEvent('download');
  
  // Click download PDF button
  await page.click('button:has-text("Download PDF")');
  
  const download = await downloadPromise;
  
  // Verify download filename
  expect(download.suggestedFilename()).toContain('.pdf');
});
