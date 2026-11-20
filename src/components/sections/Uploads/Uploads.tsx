import { ImmersiveSection } from "@/components/ImmersiveSection";
import { SectionIntro } from "@/components/SectionIntro";
import { monthXs } from "@/utils/availability";
import { AvailabilityChart, type ChartLayout } from "./AvailabilityChart";
import { ChartPointer } from "./ChartPointer";
import { Readout } from "./Readout";
import { UploadsMonth } from "./UploadsMonth";
import styles from "./Uploads.module.css";

// The planned Prometheus exporter, promoted as if it exists. Metric names are placeholders
// (design-reference/NOTES.md).

/** Monthly runs on the 1st at 00:00 UTC, Dec 2025 to Nov 2026. */
export const MONTHS = [
  "Dec",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
] as const;

/** The waterline: below this availability an upload should be replaced. */
export const WATERLINE = 0.99;

/** Availability per NZB for each monthly run (unique available articles / unique articles). */
export const SERIES: readonly { nzb: string; values: readonly number[] }[] = [
  { nzb: "Elephants.Dream.2006.1080p.nzb", values: Array(12).fill(1) },
  { nzb: "debian-13.2.0-amd64-DVD-1.nzb", values: Array(12).fill(1) },
  {
    nzb: "Agent.327.2017.1080p.nzb",
    values: [...Array(10).fill(1), 0.999548, 0.999548],
  },
  {
    nzb: "Big.Buck.Bunny.2008.2160p.nzb",
    values: [...Array(10).fill(1), 0.999837, 0.999837],
  },
  {
    nzb: "Sintel.2010.1080p.nzb",
    values: [...Array(9).fill(1), 0.999231, 0.999231, 0.999231],
  },
  {
    nzb: "Coffee.Run.2020.1080p.nzb",
    values: [...Array(6).fill(1), 0.9995, 0.999, 0.998, 0.997, 0.996, 0.995],
  },
  {
    nzb: "Tears.of.Steel.2012.2160p.nzb",
    values: [...Array(11).fill(1), 0.996273],
  },
  {
    nzb: "Caminandes.Llamigos.2016.1080p.nzb",
    values: [
      ...Array(4).fill(1),
      0.998,
      0.995,
      0.992,
      0.989,
      0.986,
      0.983,
      0.981,
      0.98,
    ],
  },
  {
    nzb: "Spring.2019.2160p.nzb",
    values: [
      ...Array(7).fill(1),
      0.999356,
      0.997371,
      0.994582,
      0.99088,
      0.988519,
    ],
  },
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

const LABEL =
  "Nine NZBs as lines across a year of monthly checks. Two sink below the waterline at 0.99, Caminandes in July and Spring.2019 in November.";

/** The full scene behind the text, 1600×900, cropped to the screen. The chart sits right of the text. */
const WIDE: ChartLayout = {
  width: 1600,
  height: 900,
  top: 250,
  sea: 600,
  x0: 660,
  x1: 1330,
  lift: 5,
  text: 12.5,
  tick: 12,
  monthY: 648,
  monthLabels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  labelAll: true,
  firstWordLabels: false,
  waterlineCaption: "line",
  steady: "right",
  stars: 140,
  backdrop: true,
  lineWidth: { sunk: 2.2, steady: 1.3, under: 2.6 },
  dot: 4,
  glow: 26,
  beam: { reach: 90, width: 4, blur: 24 },
  month: 11,
};

/** The same chart for phones: it fits a 390px screen, labels only what sinks, every third month on the axis. */
const COMPACT: ChartLayout = {
  width: 360,
  height: 244,
  top: 76,
  sea: 172,
  x0: 46,
  x1: 244,
  lift: 3.5,
  text: 11,
  tick: 10,
  monthY: 232,
  monthLabels: [0, 3, 6, 9, 11],
  labelAll: false,
  firstWordLabels: true,
  waterlineCaption: "stacked",
  steady: "left",
  stars: 40,
  backdrop: false,
  lineWidth: { sunk: 2, steady: 1.1, under: 2.4 },
  dot: 3.2,
  glow: 18,
  beam: { reach: 64, width: 3, blur: 9 },
  month: 11,
};

const xsFor = (layout: ChartLayout) =>
  monthXs(layout.x0, layout.x1, MONTHS.length);

export function Uploads() {
  return (
    <UploadsMonth initial={WIDE.month}>
      <ImmersiveSection
        id="prom"
        aria-labelledby="prom-title"
        className={styles.section}
      >
        <ChartPointer className={styles.stage} xs={xsFor(WIDE)} months={MONTHS}>
          <AvailabilityChart
            series={SERIES}
            months={MONTHS}
            waterline={WATERLINE}
            layout={WIDE}
            label={LABEL}
          />
        </ChartPointer>
        <SectionIntro
          label="For uploaders: Prometheus exporter"
          title="Watch how your uploads hold up"
          titleId="prom-title"
          variant="narrow"
        >
          <p>
            Upload to Usenet yourself? nzbs.live has a Prometheus exporter.
            Every NZB becomes a line in your graphs, so you see which uploads
            are fading and replace them before they sink.
          </p>
          <Readout series={SERIES} months={MONTHS} />
        </SectionIntro>
        <ChartPointer
          className={styles.compact}
          xs={xsFor(COMPACT)}
          months={MONTHS}
        >
          <AvailabilityChart
            series={SERIES}
            months={MONTHS}
            waterline={WATERLINE}
            layout={COMPACT}
            label={LABEL}
          />
        </ChartPointer>
        <div className={`${styles.glass} ${styles.metrics}`}>
          <p>GET /metrics</p>
          <pre>
            <code>{METRICS_SAMPLE}</code>
          </pre>
        </div>
        <div className={`${styles.glass} ${styles.alert}`}>
          <p>Alert when an upload sinks</p>
          <code>{ALERT_RULE}</code>
          <p>
            Straight into Grafana, Alertmanager or the dashboards you already
            use.
          </p>
        </div>
      </ImmersiveSection>
    </UploadsMonth>
  );
}
