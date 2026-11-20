import { clamp } from "./ease";

export type StepProgress = {
  /** The step whose top has passed the reading line last (0 before the first one). */
  step: number;
  /** How far the reading line is through that step, 0..1. */
  progress: number;
};

/**
 * Maps the steps of a scroll story (their viewport tops and heights, in order) to the active step
 * and the progress through it, for a reading line at `line` pixels from the viewport top.
 */
export function stepProgress(rects: readonly { top: number; height: number }[], line: number): StepProgress {
  let step = 0;
  rects.forEach((r, k) => {
    if (r.top < line) step = k;
  });
  const r = rects[step];
  return { step, progress: r && r.height > 0 ? clamp((line - r.top) / r.height, 0, 1) : 0 };
}
