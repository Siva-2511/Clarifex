import { test, expect } from "@playwright/test";

test.describe("Authentication Flows", () => {
  test("should render login page with all expected options", async ({ page }) => {
    await page.goto("/login");

    await expect(page.locator("h1")).toContainText("CLARIFEX");
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole("button", { name: /Google/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /GitHub/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Sign In with Email/i })).toBeVisible();
  });

  test("should navigate to register and forgot password", async ({ page }) => {
    await page.goto("/login");

    await page.click('text="Register"');
    await expect(page).toHaveURL(/.*register/);
    await expect(page.locator('input[id="name"]')).toBeVisible();

    await page.goto("/login");
    await page.click('text="Forgot password?"');
    await expect(page).toHaveURL(/.*forgot-password/);
  });
});
