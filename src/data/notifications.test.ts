import { describe, expect, it } from "vitest";
import { goDuration, notificationLines, NOTIFICATION_TITLE, PHONE_NOTIFICATIONS } from "./notifications";

describe("notifications", () => {
  it("keeps the title and both phone messages exactly as Go formats them", () => {
    expect(NOTIFICATION_TITLE).toBe("nzbs.live: HEAD check finished");
    expect(PHONE_NOTIFICATIONS[0].lines.join("\n")).toBe(
      "4 NZBs have missing articles (241 articles).\n1 NZB could not be fully checked.\nChecked 214 NZBs (3210448 articles), 1 failed in 6m12s.",
    );
    expect(PHONE_NOTIFICATIONS[1].lines.join("\n")).toBe(
      "Everything is good.\nChecked 214 NZBs (3210448 articles) in 5m58s.",
    );
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
