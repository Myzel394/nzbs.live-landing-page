import { notificationLines } from "@/utils/notification";
import { Notification } from "./Notification";

// The lock screen with this month's message (1 Nov 2026) on top and last month's below.
// The tilted CSS 3D phone and wallpaper arrive in step 4.
export function Phone() {
  return (
    <figure aria-label="A phone lock screen at 00:06 on Sunday, 1 November, with the nzbs.live message from ntfy on top and last month's below">
      <p>00:06</p>
      <p>Sunday, 1 November</p>
      <Notification
        time="now"
        dateTime="2026-11-01T00:06"
        lines={notificationLines({ checked: 214, articles: 3210448, nzbsMissing: 4, missing: 241, failed: 1, seconds: 372 })}
      />
      <Notification
        time="1 Oct"
        dateTime="2026-10-01"
        lines={notificationLines({ checked: 214, articles: 3210448, nzbsMissing: 0, missing: 0, failed: 0, seconds: 358 })}
      />
    </figure>
  );
}
