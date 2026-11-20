import { seeded } from "./rng";

export type Star = { cx: number; cy: number; r: number; opacity: number };

type Options = {
  seed: number;
  count: number;
  /** Stars sit between y = 4 and this. */
  maxY: number;
  /** Stars sit between x = 0 and this. */
  width: number;
  /** Lowest and highest opacity. */
  opacity?: readonly [number, number];
};

const RADII = [0.6, 0.8, 1, 1.3] as const;
const round = (n: number, digits: number) => Number(n.toFixed(digits));

/** A deterministic scatter of stars for an SVG scene, so every visit and every screenshot looks the same. */
export function starfield({ seed, count, maxY, width, opacity = [0.15, 0.8] }: Options): Star[] {
  const rand = seeded(seed);
  const [lo, hi] = opacity;
  return Array.from({ length: count }, () => {
    const cx = rand() * width;
    const cy = 4 + rand() * (maxY - 4);
    const r = RADII[Math.floor(rand() * RADII.length)];
    return { cx: round(cx, 1), cy: round(cy, 1), r, opacity: round(lo + rand() * (hi - lo), 2) };
  });
}
