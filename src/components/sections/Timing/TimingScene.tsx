import { useId } from "react";
import { Stars } from "@/components/Stars";
import { ArticleGrid, PITCH } from "./ArticleGrid";
import styles from "./Timing.module.css";

type Run = { label: string; gone: number; holes: ReadonlySet<number> };

type Props = {
  runs: readonly Run[];
  grid: { cols: number; rows: number };
  /** The scene's text alternative. */
  label: string;
};

// The scene is 1600×900; grids hang from the timeline above the horizon, the callouts sit below it.
const W = 1600;
const H = 900;
const HORIZON = 720;
const TIMELINE_Y = HORIZON - 166;
const centreX = (k: number) => 560 + k * 215;

/** Dot on the timeline: the lamp's colour for the first night, red for the last, dim between. */
const dotClass = (k: number, last: number) => (k === 0 ? styles.dotFirst : k === last ? styles.dotLast : styles.dot);

export function TimingScene({ runs, grid, label }: Props) {
  const id = useId();
  const last = runs.length - 1;
  const total = grid.cols * grid.rows;
  const gridW = grid.cols * PITCH;
  const gridTop = HORIZON - 40 - grid.rows * PITCH;
  const left = centreX(0) - gridW / 2;
  const right = centreX(last) + gridW / 2;

  return (
    <svg
      className={styles.wide}
      data-drift=""
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={label}
    >
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a0d12" />
          <stop offset=".5" stopColor="#151d29" />
          <stop offset=".7" stopColor="#1d2635" />
          <stop offset="1" stopColor="#0a0d12" />
        </linearGradient>
        <linearGradient id={`${id}-beam`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff0cc" stopOpacity="0" />
          <stop offset=".55" stopColor="#fff0cc" stopOpacity=".16" />
          <stop offset="1" stopColor="#ebcb8b" stopOpacity=".3" />
        </linearGradient>
        <filter id={`${id}-soft`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="40" />
        </filter>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}-sky)`} />
      <Stars seed={3} count={150} maxY={HORIZON - 60} width={W} opacity={[0.08, 0.45]} />

      {/* The lighthouse's beam falls on the first night; the last one glows red. */}
      <polygon
        points={`${centreX(0) - 10},0 ${centreX(0) + 10},0 ${centreX(0) + 110},${HORIZON - 30} ${centreX(0) - 110},${HORIZON - 30}`}
        fill={`url(#${id}-beam)`}
        filter={`url(#${id}-soft)`}
      />
      <ellipse cx={centreX(0)} cy={HORIZON - 90} rx={170} ry={110} fill="#ebcb8b" opacity=".14" filter={`url(#${id}-glow)`} />
      <ellipse cx={centreX(last)} cy={HORIZON - 90} rx={150} ry={100} fill="#bf616a" opacity=".16" filter={`url(#${id}-glow)`} />

      <line x1={left} x2={right} y1={TIMELINE_Y} y2={TIMELINE_Y} className={styles.timeline} />
      {runs.map((run, k) => {
        const cx = centreX(k);
        return (
          <g key={run.label}>
            <ArticleGrid x={cx - gridW / 2} y={gridTop} {...grid} holes={run.holes} warm={k === 0} />
            <circle cx={cx} cy={TIMELINE_Y} r={4} className={dotClass(k, last)} />
            <text x={cx} y={TIMELINE_Y - 14} textAnchor="middle" className={`${styles.cap} ${styles.month}`}>
              {run.label}
            </text>
            <text
              x={cx}
              y={gridTop + grid.rows * PITCH + 26}
              textAnchor="middle"
              className={`${styles.cap} ${styles.count} ${k === 0 ? styles.countFirst : ""}`}
            >
              {run.gone} of {total} gone
            </text>
          </g>
        );
      })}

      <g>
        <text x={left} y={HORIZON + 46} className={`${styles.cap} ${styles.callout} ${styles.calloutFirst}`}>
          nzbs.live tells you here
        </text>
        <text x={left} y={HORIZON + 70} className={`${styles.cap} ${styles.calloutNote}`}>
          par2 covers one gap, or grab another NZB
        </text>
        <text x={right} y={HORIZON + 46} textAnchor="end" className={`${styles.cap} ${styles.callout} ${styles.calloutLast}`}>
          your downloader finds out here
        </text>
        <text x={right} y={HORIZON + 70} textAnchor="end" className={`${styles.cap} ${styles.calloutNote}`}>
          too many gone, stops at 97%
        </text>
      </g>
    </svg>
  );
}
