import { expect, test, type Page } from "@playwright/test";
import fixture from "./fixtures/mockup-copy.json" with { type: "json" };

// Every visible string of the approved mockup must be on the page, verbatim, in the same section.
// Uses textContent rather than innerText so responsive CSS that hides text does not affect the check.

const normalise = (s: string) => s.replace(/\s+/g, " ").trim();

const container = (page: Page, group: string) => {
  switch (group) {
    case "skip":
      return page.locator('body > a[href="#main"]');
    case "nav":
      return page.getByRole("navigation", { name: "Main" });
    case "hero":
      return page.locator("#hero");
    case "footer":
      return page.locator("body > footer");
    default:
      return page.locator(`#${group}`);
  }
};

// Terms the copy rules forbid (design-reference/NOTES.md), plus NNTP status codes.
const BANNED = [/self-host/i, /\bBODY\b/, /\bNix\b/, /\bCLI\b/, /\bYAML\b/i, /your server/i, /\b[45]\d\d\b/];

for (const javaScriptEnabled of [true, false]) {
  test.describe(`copy (JavaScript ${javaScriptEnabled ? "on" : "off"})`, () => {
    test.use({ javaScriptEnabled });

    test.beforeEach(async ({ page }) => {
      await page.goto("/");
    });

    test("headline is exact", async ({ page }) => {
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("Uptime monitoring for your NZBs");
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(page.locator("#forgets h3")).toHaveCount(8);
    });

    for (const [group, strings] of Object.entries(fixture.copy)) {
      test(`${group} has the mockup copy`, async ({ page }) => {
        const text = normalise((await container(page, group).first().textContent()) ?? "");
        const missing = strings.map(normalise).filter((s) => !text.includes(s));
        expect(missing, `missing from ${group}`).toEqual([]);
      });
    }

    for (const [section, labels] of Object.entries(fixture.labels)) {
      test(`${section} keeps its text alternative`, async ({ page }) => {
        const found = await page
          .locator(`#${section} [aria-label]`)
          .evaluateAll((els) => els.map((el) => el.getAttribute("aria-label")));
        for (const label of labels) expect(found).toContain(label);
      });
    }

    test("uses none of the banned terms", async ({ page }) => {
      const text = await page.evaluate(() => {
        // Page text without the contents of <script>, <style> and <template> (Next's RSC payload).
        const parts: string[] = [document.title];
        // No filter callback: with JavaScript disabled the page cannot call back into one.
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
          const node = walker.currentNode;
          if (!node.parentElement?.closest("script, style, template")) parts.push(node.textContent ?? "");
        }
        for (const el of document.querySelectorAll("[aria-label]")) parts.push(el.getAttribute("aria-label") ?? "");
        return parts.join(" ");
      });
      for (const term of BANNED) expect(text, `banned term ${term}`).not.toMatch(term);
    });
  });
}
