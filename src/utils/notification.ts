// The ntfy message nzbs.live sends after the monthly HEAD check. The text must stay exactly as
// BuildNotification in notifications.go formats it.

type CheckRun = {
  checked: number; // NZBs checked
  articles: number; // articles checked
  nzbsMissing: number; // NZBs with missing articles
  missing: number; // missing articles
  failed: number; // NZBs that could not be fully checked
  seconds: number; // run duration
};

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** Go's time.Duration.String() for whole seconds: 6m12s, 1h0m5s, 42s. */
export function goDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h) return `${h}h${m}m${s}s`;
  if (m) return `${m}m${s}s`;
  return `${s}s`;
}

/** The message body as separate lines (Go joins them with "\n"). */
export function notificationLines(run: CheckRun): string[] {
  const lines: string[] = [];
  if (run.nzbsMissing) {
    lines.push(
      `${plural(run.nzbsMissing, "NZB has", "NZBs have")} missing articles (${plural(run.missing, "article", "articles")}).`,
    );
  }
  if (run.failed) lines.push(`${plural(run.failed, "NZB could", "NZBs could")} not be fully checked.`);
  if (!lines.length) lines.push("Everything is good.");
  let stats = `Checked ${plural(run.checked, "NZB", "NZBs")} (${plural(run.articles, "article", "articles")})`;
  if (run.failed) stats += `, ${run.failed} failed`;
  lines.push(`${stats} in ${goDuration(run.seconds)}.`);
  return lines;
}
