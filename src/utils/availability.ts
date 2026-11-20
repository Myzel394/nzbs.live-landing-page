/** Geometry of the availability chart: `top` is the y of 1.000, `sea` the y of the waterline (0.990). */
export type ChartScale = { top: number; sea: number };

/** Below the waterline the scale is squeezed to this share of the one above it, so a deep dive stays on screen. */
const SEA_SQUEEZE = 0.32;
const WATERLINE = 0.99;

/**
 * Split y-scale. From 1.000 down to the waterline each 0.01 spans `sea - top` px (linear);
 * below it, each 0.01 spans only 32% of that.
 */
export function availabilityY(v: number, { top, sea }: ChartScale): number {
  const unit = sea - top;
  return v >= WATERLINE ? top + ((1 - v) / 0.01) * unit : sea + ((WATERLINE - v) / 0.01) * unit * SEA_SQUEEZE;
}

/** Lifts line `k` of `count` by `(count - 1 - k) * step` px so lines at 1.000 do not draw over each other. */
export function seriesOffset(k: number, count: number, step = 5): number {
  return (count - 1 - k) * step;
}

/** "Caminandes.Llamigos.2016.1080p.nzb" -> "Caminandes.Llamigos". */
export function shortName(nzb: string): string {
  return nzb.split(".20")[0].split("-13")[0];
}

/** Sorts labels top to bottom and pushes each down until it sits at least `gap` px below the one above. */
export function spreadLabels<T extends { y: number }>(labels: readonly T[], gap = 17): T[] {
  const sorted = labels.map((l) => ({ ...l })).sort((a, b) => a.y - b.y);
  for (let i = 1; i < sorted.length; i++) sorted[i].y = Math.max(sorted[i].y, sorted[i - 1].y + gap);
  return sorted;
}

export type ReadoutRow = { name: string; value: number; sunk: boolean };

/** What the readout card lists for one monthly run: the five lowest values, and how many were complete. */
export function monthReadout(
  series: readonly { nzb: string; values: readonly number[] }[],
  month: number,
): { rows: ReadoutRow[]; complete: number } {
  const all = series.map((s) => ({ name: shortName(s.nzb), value: s.values[month] }));
  const partial = all.filter((r) => r.value < 1).sort((a, b) => a.value - b.value);
  return {
    rows: partial.slice(0, 5).map((r) => ({ ...r, sunk: r.value < WATERLINE })),
    complete: all.length - partial.length,
  };
}

/** x of each of `count` monthly runs, spread evenly from `x0` to `x1`. */
export function monthXs(x0: number, x1: number, count: number): number[] {
  return Array.from({ length: count }, (_, i) => x0 + (i * (x1 - x0)) / (count - 1));
}

/** Index of the x closest to `x`. */
export function nearestIndex(xs: readonly number[], x: number): number {
  let best = 0;
  xs.forEach((value, i) => {
    if (Math.abs(value - x) < Math.abs(xs[best] - x)) best = i;
  });
  return best;
}

/** The readout's title for a run: months are Dec 2025, then Jan to Nov 2026 ("Run of 1 Jul 2026"). */
export function runTitle(month: string, index: number): string {
  return `Run of 1 ${month} ${index === 0 ? 2025 : 2026}`;
}
