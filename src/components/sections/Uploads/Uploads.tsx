import { ScenePlaceholder } from "@/components/ScenePlaceholder";

// The planned Prometheus exporter, promoted as if it exists. Metric names are placeholders
// (design-reference/NOTES.md).

/** Monthly runs on the 1st at 00:00 UTC, Dec 2025 to Nov 2026. */
export const MONTHS = ["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"] as const;

/** The waterline: below this availability an upload should be replaced. */
export const WATERLINE = 0.99;

/** Availability per NZB for each monthly run (unique available articles / unique articles). */
export const SERIES: readonly { nzb: string; values: readonly number[] }[] = [
  { nzb: "Elephants.Dream.2006.1080p.nzb", values: Array(12).fill(1) },
  { nzb: "debian-13.2.0-amd64-DVD-1.nzb", values: Array(12).fill(1) },
  { nzb: "Agent.327.2017.1080p.nzb", values: [...Array(10).fill(1), 0.999548, 0.999548] },
  { nzb: "Big.Buck.Bunny.2008.2160p.nzb", values: [...Array(10).fill(1), 0.999837, 0.999837] },
  { nzb: "Sintel.2010.1080p.nzb", values: [...Array(9).fill(1), 0.999231, 0.999231, 0.999231] },
  { nzb: "Coffee.Run.2020.1080p.nzb", values: [...Array(6).fill(1), 0.9995, 0.999, 0.998, 0.997, 0.996, 0.995] },
  { nzb: "Tears.of.Steel.2012.2160p.nzb", values: [...Array(11).fill(1), 0.996273] },
  { nzb: "Caminandes.Llamigos.2016.1080p.nzb", values: [...Array(4).fill(1), 0.998, 0.995, 0.992, 0.989, 0.986, 0.983, 0.981, 0.98] },
  { nzb: "Spring.2019.2160p.nzb", values: [...Array(7).fill(1), 0.999356, 0.997371, 0.994582, 0.99088, 0.988519] },
];

/** A sample scrape of `GET /metrics` after the 1 Nov 2026 run. */
const METRICS_SAMPLE = [
  "# HELP nzbs_live_nzb_availability Available unique articles / unique articles, last run",
  'nzbs_live_nzb_availability{nzb="Spring.2019.2160p.nzb"} 0.988519',
  'nzbs_live_nzb_availability{nzb="Caminandes.Llamigos.2016.1080p.nzb"} 0.98',
  'nzbs_live_nzb_missing_articles{nzb="Spring.2019.2160p.nzb"} 214',
  "nzbs_live_last_check_timestamp_seconds 1795996800",
].join("\n");

export const ALERT_RULE = `nzbs_live_nzb_availability < ${WATERLINE}`;

export function Uploads() {
  return (
    <section id="prom" aria-labelledby="prom-title">
      {/* The availability chart, crosshair and month readout arrive in steps 4 and 8. */}
      <ScenePlaceholder
        scene="uploads"
        label="Nine NZBs as lines across a year of monthly checks. Two sink below the waterline at 0.99, Caminandes in July and Spring.2019 in November."
      />
      <div>
        <p>For uploaders: Prometheus exporter</p>
        <h2 id="prom-title">Watch how your uploads hold up</h2>
        <p>
          Upload to Usenet yourself? nzbs.live has a Prometheus exporter. Every NZB becomes a line in your graphs, so
          you see which uploads are fading and replace them before they sink.
        </p>
      </div>
      <div>
        <p>GET /metrics</p>
        <pre>
          <code>{METRICS_SAMPLE}</code>
        </pre>
      </div>
      <div>
        <p>Alert when an upload sinks</p>
        <code>{ALERT_RULE}</code>
        <p>Straight into Grafana, Alertmanager or the dashboards you already use.</p>
      </div>
    </section>
  );
}
