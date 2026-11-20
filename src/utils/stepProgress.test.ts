import { expect, it } from "vitest";
import { stepProgress } from "./stepProgress";

const steps = (...tops: number[]) => tops.map((top) => ({ top, height: 100 }));

it("picks the last step past the line and how far the line is through it", () => {
  expect(stepProgress(steps(0, 100, 200), 150)).toEqual({ step: 1, progress: 0.5 });
  expect(stepProgress(steps(-300, -200, -100), 50)).toEqual({ step: 2, progress: 1 });
});

it("holds the first step at 0 before the story starts", () => {
  expect(stepProgress(steps(500, 600), 400)).toEqual({ step: 0, progress: 0 });
});

it("copes with no steps", () => {
  expect(stepProgress([], 100)).toEqual({ step: 0, progress: 0 });
});
