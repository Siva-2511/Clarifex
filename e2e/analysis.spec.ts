import { test, expect } from "@playwright/test";

test.describe("Analysis Workspace", () => {
  test("should render marketing page with hero and interactive ELI strip", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("h1")).toContainText("Clarity out of");
    await expect(page.getByRole("button", { name: /ELI-5/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /ELI-10/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Expert Counsel/i })).toBeVisible();

    // Click ELI-5 and verify text updates
    await page.getByRole("button", { name: /ELI-5/i }).click();
    await expect(page.locator("body")).toContainText("toy truck");
  });
});
