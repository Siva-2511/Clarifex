import { test, expect } from "@playwright/test";

test.describe("Document Ingestion", () => {
  test("should display 6 ingestion tabs on upload page", async ({ page }) => {
    await page.goto("/dashboard/upload");

    // Check all 6 tabs are present
    await expect(page.getByRole("tab", { name: /Upload/i })).toBeVisible();
    await expect(page.getByRole("tab", { name: /Paste/i })).toBeVisible();
    await expect(page.getByRole("tab", { name: /URL Fetch/i })).toBeVisible();
    await expect(page.getByRole("tab", { name: /Google Drive/i })).toBeVisible();
    await expect(page.getByRole("tab", { name: /OCR Vision/i })).toBeVisible();
    await expect(page.getByRole("tab", { name: /Batch/i })).toBeVisible();
  });
});
