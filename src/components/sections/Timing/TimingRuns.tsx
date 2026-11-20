import { Stars } from "@/components/Stars";
import { ArticleGrid, PITCH } from "./ArticleGrid";
import styles from "./Timing.module.css";

type Props = {
  runs: readonly { label: string; gone: number; holes: ReadonlySet<number> }[];
  grid: { cols: number; rows: number };
};

/**
 * Narrow screens (the wide scene is hidden): the same five nights as small grids in a flowing grid,
 * the "tells you" callout before the first and the "finds out" callout after the last.
 */
export function TimingRuns({ runs, grid }: Props) {
  const last = runs.length - 1;
  const total = grid.cols * grid.rows;
  const width = grid.cols * PITCH - 3;
  const height = grid.rows * PITCH - 3;

  return (
    <>
      <svg className={styles.sky} viewBox="0 0 390 1000" preserveAspectRatio="xMidYMin slice" aria-hidden="true" focusable="false">
        <Stars seed={3} count={70} maxY={1000} width={390} opacity={[0.08, 0.45]} />
      </svg>
      <div className={styles.runs}>
        <p className={`${styles.stop} ${styles.stopFirst}`}>
          <strong>nzbs.live tells you here</strong>
          <span>par2 covers one gap, or grab another NZB</span>
        </p>
        {runs.map((run, k) => (
          <figure key={run.label} className={styles.run} data-tone={k === 0 ? "first" : k === last ? "last" : "mid"}>
            <figcaption>
              <time>{run.label}</time>
              <span>
                {run.gone} of {total} gone
              </span>
            </figcaption>
            <svg viewBox={`-1 -1 ${width + 2} ${height + 2}`} aria-hidden="true" focusable="false">
              <ArticleGrid x={0} y={0} {...grid} holes={run.holes} warm={k === 0} />
            </svg>
          </figure>
        ))}
        <p className={`${styles.stop} ${styles.stopLast}`}>
          <strong>your downloader finds out here</strong>
          <span>too many gone, stops at 97%</span>
        </p>
      </div>
    </>
  );
}
