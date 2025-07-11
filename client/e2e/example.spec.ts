import { test, expect } from "@playwright/test";

test("hompeage has Vite in title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Leaflyt/);
});
