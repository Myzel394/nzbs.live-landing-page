import { Fragment } from "react";

type Props = {
  time: string;
  dateTime: string;
  lines: readonly string[];
};

/** One ntfy message on the lock screen. */
export function Notification({ time, dateTime, lines }: Props) {
  return (
    <div>
      <p>
        <span>ntfy</span> <time dateTime={dateTime}>{time}</time>
      </p>
      <strong>nzbs.live: HEAD check finished</strong>
      <p>
        {lines.map((line, i) => (
          <Fragment key={i}>
            {i > 0 && <br />}
            {line}
          </Fragment>
        ))}
      </p>
    </div>
  );
}
