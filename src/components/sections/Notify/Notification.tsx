import { Fragment } from "react";
import { SiNtfy } from "react-icons/si";
import styles from "./Phone.module.css";

type Props = {
  time: string;
  dateTime: string;
  lines: readonly string[];
  /** `latest` is this month's message; `earlier` sits below it, dimmed. */
  tone?: "latest" | "earlier";
};

/**
 * One ntfy message on the lock screen, shown dropped in. With JavaScript and motion allowed it starts lifted
 * and invisible and drops in when the section comes into view (`data-note` in Phone.module.css).
 */
export function Notification({ time, dateTime, lines, tone = "latest" }: Props) {
  return (
    <div className={`${styles.note} ${tone === "earlier" ? styles.earlier : ""}`} data-note={tone}>
      <p className={styles.noteHead}>
        <span className={styles.logo}>
          <SiNtfy aria-hidden="true" focusable="false" />
        </span>
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
