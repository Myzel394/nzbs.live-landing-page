import styles from "./Timing.module.css";

export const CELL = 13;
export const PITCH = 16;

type Props = {
  /** Top-left corner of the grid. */
  x: number;
  y: number;
  cols: number;
  rows: number;
  /** Cells (row-major) whose article is gone. */
  holes: ReadonlySet<number>;
  /** Lit by the lighthouse's beam. */
  warm?: boolean;
};

/** One monthly check: a cell per article, a red-outlined hole where one is gone. */
export function ArticleGrid({ x, y, cols, rows, holes, warm = false }: Props) {
  return (
    <g>
      {Array.from({ length: cols * rows }, (_, i) => (
        <rect
          key={i}
          x={x + (i % cols) * PITCH}
          y={y + Math.floor(i / cols) * PITCH}
          width={CELL}
          height={CELL}
          rx={2}
          className={holes.has(i) ? styles.hole : warm ? styles.warm : styles.cell}
        />
      ))}
    </g>
  );
}
