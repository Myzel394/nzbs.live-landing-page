import { expect, it } from "vitest";
import { advanceSweep, radarGlow } from "./radar";

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
