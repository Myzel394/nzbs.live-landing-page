import { expect, it } from "vitest";
import { starfield } from "./starfield";

const options = { seed: 3, count: 150, maxY: 660, width: 1600, opacity: [0.08, 0.45] } as const;

it("is deterministic for a seed and differs between seeds", () => {
  expect(starfield(options)).toEqual(starfield(options));
  expect(starfield({ ...options, seed: 5 })).not.toEqual(starfield(options));
});

it("keeps every star inside its box, radius and opacity range", () => {
  const stars = starfield(options);
  expect(stars).toHaveLength(150);
  for (const s of stars) {
    expect(s.cx).toBeGreaterThanOrEqual(0);
    expect(s.cx).toBeLessThanOrEqual(1600);
    expect(s.cy).toBeGreaterThanOrEqual(4);
    expect(s.cy).toBeLessThanOrEqual(660);
    expect([0.6, 0.8, 1, 1.3]).toContain(s.r);
    expect(s.opacity).toBeGreaterThanOrEqual(0.08);
    expect(s.opacity).toBeLessThanOrEqual(0.45);
  }
});
