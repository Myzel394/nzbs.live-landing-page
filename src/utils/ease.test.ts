import { expect, it } from "vitest";
import { clamp, easeInOutCubic, lerp } from "./ease";

it("clamps, interpolates and eases", () => {
  expect(clamp(5, 0, 1)).toBe(1);
  expect(clamp(-1, 0, 1)).toBe(0);
  expect(lerp(10, 20, 0.25)).toBe(12.5);
  expect([0, 0.5, 1].map(easeInOutCubic)).toEqual([0, 0.5, 1]);
  expect(easeInOutCubic(0.25)).toBeCloseTo(0.0625);
  expect(easeInOutCubic(0.75)).toBeCloseTo(0.9375);
});
