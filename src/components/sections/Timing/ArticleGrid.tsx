import styles from "./Timing.module.css";

export const CELL = 13;
export const PITCH = 16;
const RADIUS = 2;
/** The inner square of a cell: its round-joined stroke, 2 × RADIUS wide, makes up the rest. */
const CORE = CELL - 2 * RADIUS;

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

/**
 * One monthly check: a cell per article, a red-outlined hole where one is gone.
 * The cells that are there are one path (each a small square with a round-joined stroke, which is a
 * rounded 13×13 tile), so the five grids are a few elements instead of hundreds.
 */
export function ArticleGrid({ x, y, cols, rows, holes, warm = false }: Props) {
  const cells: string[] = [];
  let pen: [number, number] | null = null;
  for (let i = 0; i < cols * rows; i++) {
    if (holes.has(i)) continue;
    const cx = x + (i % cols) * PITCH + RADIUS;
    const cy = y + Math.floor(i / cols) * PITCH + RADIUS;
    // After `z` the pen is back at the square's start, so each next square is a short relative move.
    cells.push(`${pen ? `m${cx - pen[0]} ${cy - pen[1]}` : `M${cx} ${cy}`}h${CORE}v${CORE}h-${CORE}z`);
    pen = [cx, cy];
  }
  return (
    <g>
      <path d={cells.join("")} className={warm ? styles.warm : styles.cell} />
      {[...holes].map((i) => (
        <rect
          key={i}
          x={x + (i % cols) * PITCH}
          y={y + Math.floor(i / cols) * PITCH}
          width={CELL}
          height={CELL}
          rx={RADIUS}
          className={styles.hole}
        />
      ))}
    </g>
  );
}
