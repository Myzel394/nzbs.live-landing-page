import { useId, type CSSProperties } from "react";
import { Stars } from "@/components/Stars";
import { availabilityY, seriesOffset, shortName, spreadLabels } from "@/utils/availability";
import styles from "./Uploads.module.css";

/** Where everything sits, in the chart's own viewBox units. */
export type ChartLayout = {
  width: number;
  height: number;
  /** y of 1.000 and of the waterline. */
  top: number;
  sea: number;
  /** x of the first and the last month. */
  x0: number;
  x1: number;
  /** px each line is lifted above the next one, so lines at 1.000 do not overlap. */
  lift: number;
  /** Fonts and marks. */
  text: number;
  tick: number;
  monthY: number;
  /** Which months get a label on the axis. */
  monthLabels: readonly number[];
  /** Label every line that ends below 1.000 (wide) or only those below the waterline (compact). */
  labelAll: boolean;
  /** Label lines with the first word of their name only ("Caminandes"), to fit. */
  firstWordLabels: boolean;
  /** The waterline's caption on one line, or on two lines at the left so it clears the lines. */
  waterlineCaption: "line" | "stacked";
  /** Where "steady at 1.000000" goes: above the lines at the right, or at the left edge of the plot. */
  steady: "right" | "left";
  stars: number;
  /** Paint the night sky and the sea into the chart; otherwise the page behind it shows through. */
  backdrop: boolean;
  lineWidth: { sunk: number; steady: number; under: number };
  dot: number;
  glow: number;
  /** The crosshair beam: how far it reaches above the plot and how wide it is. */
  beam: { reach: number; width: number; blur: number };
  /** The month the beam starts on. */
  month: number;
};

type Props = {
  series: readonly { nzb: string; values: readonly number[] }[];
  months: readonly string[];
  waterline: number;
  layout: ChartLayout;
  label: string;
  className?: string;
};

const fmt = (n: number) => Number(n.toFixed(1));

/** Every NZB as a line over a year of monthly runs. Below the waterline a line turns red, and the scale squeezes. */
export function AvailabilityChart({ series, months, waterline, layout: L, label, className }: Props) {
  const id = useId();
  const scale = { top: L.top, sea: L.sea };
  const xs = months.map((_, i) => L.x0 + (i * (L.x1 - L.x0)) / (months.length - 1));

  const lines = series.map((s, k) => {
    const points = s.values.map((v, i) => ({
      x: xs[i],
      y: availabilityY(v, scale) - seriesOffset(k, series.length, L.lift),
    }));
    const sunk = Math.min(...s.values) < waterline;
    const d = "M" + points.map((p) => `${fmt(p.x)} ${fmt(p.y)}`).join(" L");
    return { nzb: s.nzb, points, sunk, d, ends: s.values[s.values.length - 1] };
  });

  const labelled = lines
    .filter((l) => l.sunk || (L.labelAll && l.ends < 1))
    .map((l) => ({ y: l.points[l.points.length - 1].y + 4, sunk: l.sunk, text: L.firstWordLabels ? shortName(l.nzb).split(".")[0] : shortName(l.nzb) }));
  const spread = spreadLabels(L.steady === "right" ? [...labelled, { y: L.top - 60, sunk: false, text: "steady at 1.000000" }] : labelled);
  const labelX = L.x1 + 18;
  const beamTop = L.top - L.beam.reach;

  return (
    <svg
      className={className}
      viewBox={`0 0 ${L.width} ${L.height}`}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={label}
      style={{ "--x": `${fmt((xs[L.month] / L.width) * 100)}%` } as CSSProperties}
    >
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a0d12" />
          <stop offset=".7" stopColor="#151d29" />
          <stop offset="1" stopColor="#243041" />
        </linearGradient>
        <linearGradient id={`${id}-sea`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#121821" />
          <stop offset="1" stopColor="#0a0d12" />
        </linearGradient>
        <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
        <filter id={`${id}-beam`} x="-150%" y="-10%" width="400%" height="120%">
          <feGaussianBlur stdDeviation={L.beam.blur} />
        </filter>
        <clipPath id={`${id}-under`}>
          <rect y={L.sea} width={L.width} height={L.height - L.sea} />
        </clipPath>
      </defs>

      {L.backdrop && <rect width={L.width} height={L.sea} fill={`url(#${id}-sky)`} />}
      <Stars seed={5} count={L.stars} maxY={L.sea - 40} width={L.width} opacity={[0.08, 0.45]} />
      {L.backdrop && <rect y={L.sea} width={L.width} height={L.height - L.sea} fill={`url(#${id}-sea)`} />}

      {[1, 0.995].map((v) => {
        const y = availabilityY(v, scale);
        return (
          <g key={v}>
            <line x1={L.x0} x2={L.x1} y1={y} y2={y} className={styles.grid} />
            <text x={L.x0 - L.tick * 1.3} y={y + 4} textAnchor="end" className={styles.tick} fontSize={L.tick}>
              {v.toFixed(3)}
            </text>
          </g>
        );
      })}

      {lines.map((l) => (
        <path
          key={l.nzb}
          d={l.d}
          fill="none"
          className={l.sunk ? styles.lineSunk : styles.line}
          strokeWidth={l.sunk ? L.lineWidth.sunk : L.lineWidth.steady}
        />
      ))}

      {lines
        .filter((l) => l.sunk)
        .map((l) => {
          const end = l.points[l.points.length - 1];
          return (
            <g key={l.nzb}>
              <g clipPath={`url(#${id}-under)`}>
                <path d={l.d} fill="none" className={styles.lineUnder} strokeWidth={L.lineWidth.under} />
                {l.points
                  .filter((p) => p.y > L.sea)
                  .map((p) => (
                    <circle key={p.x} cx={fmt(p.x)} cy={fmt(p.y)} r={L.dot} className={styles.dotUnder} />
                  ))}
              </g>
              <circle cx={fmt(end.x)} cy={fmt(end.y)} r={L.glow} className={styles.endGlow} filter={`url(#${id}-glow)`} />
            </g>
          );
        })}

      <line x1={0} x2={L.width} y1={L.sea} y2={L.sea} className={styles.waterline} />
      <text
        x={L.x0}
        y={L.waterlineCaption === "line" ? L.sea - L.text : L.sea + L.text + 4}
        className={`${styles.cap} ${styles.waterlineLabel}`}
        fontSize={L.text + (L.waterlineCaption === "line" ? 1.5 : 0)}
      >
        {L.waterlineCaption === "line" ? (
          "your waterline: replace below 0.990"
        ) : (
          <>
            <tspan>your waterline:</tspan> <tspan x={L.x0} dy={L.text + 3}>replace below 0.990</tspan>
          </>
        )}
      </text>

      {spread.map((l) => (
        <text
          key={l.text}
          x={labelX}
          y={fmt(l.y)}
          className={`${styles.cap} ${l.sunk ? styles.labelSunk : styles.labelSteady}`}
          fontSize={L.text}
        >
          {l.text}
        </text>
      ))}
      {L.steady === "left" && (
        <text x={L.x0} y={L.top - seriesOffset(0, series.length, L.lift) - 12} className={`${styles.cap} ${styles.labelSteady}`} fontSize={L.text}>
          steady at 1.000000
        </text>
      )}

      {months.map(
        (m, i) =>
          L.monthLabels.includes(i) && (
            <text key={m} x={fmt(xs[i])} y={L.monthY} textAnchor="middle" className={`${styles.cap} ${styles.month}`} fontSize={L.text + 0.5}>
              {m}
            </text>
          ),
      )}

      {/* The crosshair is a beam of light; its x is a CSS variable so a later step can move it to any month. */}
      <g className={styles.xh}>
        <rect x={-L.beam.width / 2} y={beamTop} width={L.beam.width} height={L.sea - beamTop} className={styles.beam} />
        <rect
          x={-L.beam.width * 6.5}
          y={beamTop}
          width={L.beam.width * 13}
          height={L.sea - beamTop}
          className={styles.beamGlow}
          filter={`url(#${id}-beam)`}
        />
      </g>
    </svg>
  );
}
