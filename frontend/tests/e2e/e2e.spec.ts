import { test, expect } from '@playwright/test';

test.describe('E2E Flow', () => {
  test('Signup, create and edit clients, products, and expenses', async ({ page }) => {
    // 1. Login
    await page.goto('http://localhost:3000/auth/login');
    await page.fill('#email', 'demo@bizpilot.app');
    await page.fill('#password', 'demo1234');
    await page.click('button[type="submit"]:has-text("Login")');

    // Wait for navigation to dashboard
    await expect(page).toHaveURL(/.*dashboard/);

    // 2. Clients
    await page.goto('http://localhost:3000/clients');
    
    // Add Client
    await page.click('text="Add Client"');
    await page.fill('input[name="name"]', 'Acme Corp');
    await page.fill('input[name="email"]', 'acme@example.com');
    await page.click('button[type="submit"]:has-text("Save Client")');
    
    // Check Client exists
    await expect(page.locator('table')).toContainText('Acme Corp');

    // Edit Client
    // The table might have a dropdown menu. In shadcn ui, clicking a trigger opens it.
    // Edit Client
    await page.locator('table tr', { hasText: 'Acme Corp' }).locator('button').last().click();
    await page.click('text="Edit Client"');
    await page.fill('#edit-name', 'Acme Global');
    await page.click('button[type="submit"]:has-text("Save Changes")');

    // Check Client is updated
    await expect(page.locator('table')).toContainText('Acme Global');

    // 3. Products
    await page.goto('http://localhost:3000/products');

    // Add Product
    await page.click('text="Add Product"');
    await page.fill('input[name="name"]', 'Widget');
    await page.fill('input[name="unit_price"]', '10');
    await page.click('button[type="submit"]:has-text("Save Product")');

    await expect(page.locator('table')).toContainText('Widget');

    // Edit Product
    await page.locator('table tr', { hasText: 'Widget' }).locator('button').last().click();
    await page.click('text="Edit Product"');
    await page.fill('#edit-prod-price', '20');
    await page.click('button[type="submit"]:has-text("Save Changes")');

    await expect(page.locator('table')).toContainText('$20.00');

    // 4. Expenses
    await page.goto('http://localhost:3000/expenses');

    // Add Expense
    await page.click('text="Add Expense"');
    await page.fill('input[name="title"]', 'Office Supplies');
    await page.fill('input[name="amount"]', '50');
    await page.click('button[type="submit"]:has-text("Save Expense")');

    await expect(page.locator('table')).toContainText('Office Supplies');

    // Edit Expense
    await page.locator('table tr', { hasText: 'Office Supplies' }).locator('button').last().click();
    await page.click('text="Edit Expense"');
    await page.fill('#edit-exp-amount', '75');
    await page.click('button[type="submit"]:has-text("Save Changes")');

    await expect(page.locator('table')).toContainText('$75.00');
  });
});
