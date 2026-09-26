import { test, expect } from "@playwright/test";

test.describe("Export Operations", () => {
  test("should load overview dashboard without errors", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.locator("h1")).toContainText("Legal AI Dashboard");
    await expect(page.locator("text=Documents in Vault")).toBeVisible();
    await expect(page.locator("text=Analyses Completed")).toBeVisible();
  });
});
