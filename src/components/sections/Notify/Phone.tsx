import { Fragment } from "react";
import { NOTIFICATION_TITLE, PHONE_NOTIFICATIONS } from "@/data/notifications";

// Machine-readable times for the two runs: this month's (1 Nov 2026, 00:06) and last month's.
const DATETIMES = ["2026-11-01T00:06", "2026-10-01"] as const;

// The lock screen with the two ntfy messages. The tilted CSS 3D phone and wallpaper arrive in step 4.
export function Phone() {
  return (
    <figure aria-label="A phone lock screen at 00:06 on Sunday, 1 November, with the nzbs.live message from ntfy on top and last month's below">
      <p>00:06</p>
      <p>Sunday, 1 November</p>
      {PHONE_NOTIFICATIONS.map((n, i) => (
        <div key={n.time}>
          <p>
            <span>ntfy</span> <time dateTime={DATETIMES[i]}>{n.time}</time>
          </p>
          <strong>{NOTIFICATION_TITLE}</strong>
          <p>
            {n.lines.map((line, j) => (
              <Fragment key={line}>
                {j > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </p>
        </div>
      ))}
    </figure>
  );
}
