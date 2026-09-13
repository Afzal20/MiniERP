import { test, expect } from '@playwright/test';

test('Create invoice flow computes totals correctly', async ({ page }) => {
  await page.goto('/auth/login');
  await page.fill('input[id="email"]', 'demo@bizpilot.app');
  await page.fill('input[id="password"]', 'demo1234');
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL(/\/dashboard/);
  
  await page.goto('/create-invoice');
  
  // Fill line item
  await page.fill('input[placeholder="Description of service or product"]', 'Test service');
  await page.fill('input[placeholder="Qty"]', '2');
  await page.fill('input[placeholder="Rate"]', '150');
  
  // Fill tax and discount
  await page.fill('input[id="tax_rate"]', '10');
  await page.fill('input[id="discount"]', '50');
  
  // Check the summary totals
  // Subtotal = 300, Discount = 50, Tax = 25 ((300-50)*0.1), Total = 275
  await expect(page.locator('text=Subtotal').locator('..').locator('span.tabular-nums')).toContainText('300.00');
  await expect(page.locator('text=Discount').locator('..').locator('span.tabular-nums')).toContainText('50.00');
  await expect(page.locator('text=Tax (10%)').locator('..').locator('span.tabular-nums')).toContainText('25.00');
  await expect(page.locator('text=Total').locator('..').locator('span.tabular-nums')).toContainText('275.00');
  
  // Fill client name
  await page.fill('input[id="client_name"]', 'Test Client');
  
  // Save as draft
  await page.click('button:has-text("Save as Draft")');
  
  // Should redirect to invoice details page
  await expect(page).toHaveURL(/\/invoices\/.+/);
  await expect(page.locator('h1')).toContainText('INV-');
});
