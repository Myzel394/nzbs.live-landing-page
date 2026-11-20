import { expect, test } from "@playwright/test";

test("fonts are self-hosted and loaded", async ({ page }) => {
  const external: string[] = [];
  page.on("request", (r) => {
    if (/fonts\.(googleapis|gstatic)\.com/.test(r.url())) external.push(r.url());
  });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  expect(external).toEqual([]);

  const families = await page.evaluate(() => ({
    body: getComputedStyle(document.body).fontFamily,
    code: getComputedStyle(document.querySelector("code")!).fontFamily,
    loaded: [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family),
  }));
  expect(families.body).toMatch(/Bricolage Grotesque/);
  expect(families.code).toMatch(/JetBrains Mono/);
  expect(families.loaded.join()).toMatch(/Bricolage Grotesque/);
  expect(families.loaded.join()).toMatch(/JetBrains Mono/);
});

test("has canonical and social metadata", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("nzbs.live: uptime monitoring for your NZBs");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://nzbs.live");
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", "https://nzbs.live");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /nzbs\.live/);
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#0a0d12");
});

test("skip link appears on focus and targets main", async ({ page }) => {
  await page.goto("/");
  const skip = page.getByRole("link", { name: "Skip to content" });
  expect((await skip.boundingBox())!.y).toBeLessThan(0);
  await page.keyboard.press("Tab");
  await expect(skip).toBeFocused();
  expect((await skip.boundingBox())!.y).toBeGreaterThanOrEqual(0);
  await expect(page.locator("#main")).toHaveCount(1);
});

test("nav keeps the call to action; text links hide on phones", async ({ page, isMobile }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Main" });
  await expect(nav.getByRole("link", { name: "Start monitoring" })).toBeVisible();
  const howItWorks = nav.getByRole("link", { name: "How it works" });
  if (isMobile) await expect(howItWorks).toBeHidden();
  else await expect(howItWorks).toBeVisible();
});
