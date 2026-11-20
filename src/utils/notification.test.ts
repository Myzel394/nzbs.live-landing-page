import { describe, expect, it } from "vitest";
import { goDuration, notificationLines } from "./notification";

describe("notification", () => {
  it("formats both phone messages exactly as Go does", () => {
    expect(
      notificationLines({ checked: 214, articles: 3210448, nzbsMissing: 4, missing: 241, failed: 1, seconds: 372 }).join("\n"),
    ).toBe(
      "4 NZBs have missing articles (241 articles).\n1 NZB could not be fully checked.\nChecked 214 NZBs (3210448 articles), 1 failed in 6m12s.",
    );
    expect(
      notificationLines({ checked: 214, articles: 3210448, nzbsMissing: 0, missing: 0, failed: 0, seconds: 358 }).join("\n"),
    ).toBe("Everything is good.\nChecked 214 NZBs (3210448 articles) in 5m58s.");
  });

  it("uses singular forms for one", () => {
    expect(
      notificationLines({ checked: 1, articles: 1, nzbsMissing: 1, missing: 1, failed: 1, seconds: 5 }),
    ).toEqual(["1 NZB has missing articles (1 article).", "1 NZB could not be fully checked.", "Checked 1 NZB (1 article), 1 failed in 5s."]);
  });

  it("formats durations like Go's time.Duration", () => {
    expect(goDuration(42)).toBe("42s");
    expect(goDuration(372)).toBe("6m12s");
    expect(goDuration(3605)).toBe("1h0m5s");
  });
});
