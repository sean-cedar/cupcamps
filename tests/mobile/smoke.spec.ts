import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/countries",
  "/countries/argentina",
  "/groups",
  "/groups/j",
  "/host-cities",
  "/host-cities/boston",
  "/map",
  "/bracket",
  "/matches/19",
];

async function expectNoHorizontalOverflow(page: import("@playwright/test").Page) {
  const overflow = await page.evaluate(() => {
    const root = document.documentElement;
    return root.scrollWidth > root.clientWidth + 1;
  });

  expect(overflow).toBe(false);
}

test.describe("mobile smoke", () => {
  for (const route of routes) {
    test(`${route} renders without horizontal overflow`, async ({ page }) => {
      await page.goto(route);
      await expectNoHorizontalOverflow(page);
      await expect(page.locator("main")).toBeVisible();
    });
  }

  test("mobile navigation opens and exposes primary links", async ({ page }) => {
    await page.goto("/");

    const menuButton = page.getByRole("button", { name: "Open menu" });
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    await expect(page.getByRole("link", { name: "Countries" }).first()).toBeVisible();
    await page.getByRole("button", { name: /Theme:/i }).click();
    await expect(page.getByRole("menu", { name: "Choose theme" })).toBeVisible();
    await expect(page.getByRole("menuitemradio", { name: /Light/i })).toBeVisible();

    await page.getByRole("button", { name: "Dismiss menu overlay" }).click();
    await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
  });

  test("country card navigates to country page", async ({ page }) => {
    await page.goto("/countries");
    await page.getByRole("link", { name: /Argentina/i }).first().click();
    await expect(page).toHaveURL(/\/countries\/argentina$/);
    await expect(page.getByRole("heading", { name: /Argentina/i })).toBeVisible();
  });

  test("group page shows mobile standings cards", async ({ page }) => {
    await page.goto("/groups/j");
    await expect(
      page.getByRole("paragraph").filter({ hasText: "Group J standings" }),
    ).toBeVisible();
    await expect(page.locator("table")).toBeHidden();
    await expect(page.getByRole("link", { name: /Argentina/i }).first()).toBeVisible();
  });

  test("map page shows map and scrollable country list", async ({ page }) => {
    await page.goto("/map");

    const map = page.locator(".leaflet-container");
    await expect(map).toBeVisible();

    const mapHeight = await map.evaluate((element) => element.clientHeight);
    expect(mapHeight).toBeGreaterThan(200);

    await expect(page.getByText(/All countries \(48\)/i)).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });
});
