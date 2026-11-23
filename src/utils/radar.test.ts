import { expect, it } from "vitest";
import { advanceSweep, radarGlow, radarLayout } from "./radar";

it("is fully lit as the beam passes, then fades behind it", () => {
  expect(radarGlow(160, 160)).toBe(1);
  expect(radarGlow(158, 160)).toBe(1);
  expect(radarGlow(105, 160)).toBeCloseTo(Math.exp(-1), 6);
});

it("is dark for services the beam has not reached yet, and wraps past 360", () => {
  expect(radarGlow(164.3, 160)).toBeLessThan(0.01);
  expect(radarGlow(350, 10)).toBeCloseTo(Math.exp(-20 / 55), 6);
});

it("turns 40 degrees a second, wraps at 360, and ignores long gaps", () => {
  expect(advanceSweep(0, 100)).toBeCloseTo(4, 6);
  expect(advanceSweep(358, 100)).toBeCloseTo(2, 6);
  expect(advanceSweep(10, 60000)).toBeCloseTo(14, 6);
});

it("spreads each ring's items evenly from its start angle, rings in the order given", () => {
  const items = [{ weight: 1, id: "a" }, { weight: 2, id: "b" }, { weight: 1, id: "c" }];
  const placed = radarLayout(items, [
    { weight: 2, radius: 0.5, startDeg: -90 },
    { weight: 1, radius: 1, startDeg: 0 },
  ]);
  expect(placed.map((p) => p.id)).toEqual(["b", "a", "c"]);
  // Straight up on the inner ring: back of the tilted radar, smallest and lowest.
  expect(placed[0]).toMatchObject({ left: 50, top: 50 - 0.5 * 44.6, depth: 0.84, zIndex: 5, sweepDeg: 0 });
  // The outer ring's two items, opposite each other at 0° and 180°.
  expect(placed[1].left).toBeCloseTo(100);
  expect(placed[2].left).toBeCloseTo(0);
  expect(placed[1].sweepDeg).toBeCloseTo(90);
  expect(placed[2].sweepDeg).toBeCloseTo(270);
});
