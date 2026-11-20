import { useMotionPaused } from "./useMotionPaused";
import { useReducedMotion } from "./useReducedMotion";

/** True unless the visitor prefers reduced motion or paused it with the toggle. */
export function useMotionAllowed(): boolean {
  const reduced = useReducedMotion();
  const [paused] = useMotionPaused();
  return !reduced && !paused;
}
