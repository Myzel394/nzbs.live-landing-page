import { expect, it } from "vitest";
import { createClock } from "./clock";

it("advances by frame time, caps long gaps and resumes without jumping", () => {
  const clock = createClock();
  clock.tick(1000); // first tick only sets the reference
  expect(clock.time).toBe(0);
  clock.tick(1016);
  expect(clock.time).toBeCloseTo(0.016);
  clock.tick(6016); // five seconds in a background tab
  expect(clock.time).toBeCloseTo(0.116);
  clock.pause();
  clock.tick(9000);
  expect(clock.time).toBeCloseTo(0.116);
  clock.set(2.6);
  clock.tick(9500);
  expect(clock.time).toBe(2.6);
});
