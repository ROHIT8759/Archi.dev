import { expect, test } from "@playwright/test";

test.describe("Landing Hero", () => {
  test("shows backend architecture platform messaging and routes from the primary CTA", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("Backend architecture platform")).toBeVisible();
    await expect(page.getByRole("heading", { name: /Design the backend\. Ship with confidence\./ })).toBeVisible();
    await expect(
      page.getByText(
        /Model APIs, workflows, data, and infrastructure in one visual studio\./,
      ),
    ).toBeVisible();

    const primaryCta = page.getByRole("button", { name: "Start building free" });
    await expect(primaryCta).toBeVisible();
    await primaryCta.click();

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
  });
});
