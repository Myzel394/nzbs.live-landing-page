/**
 * How lit a service is when the radar sweep points at `rotDeg`: full as the beam passes, then fading
 * behind it as exp(-d / 55), where d is how many degrees the beam has moved on since. Same as the mockup.
 */
export function radarGlow(sweepDeg: number, rotDeg: number): number {
  const d = (((rotDeg - sweepDeg) % 360) + 360) % 360;
  return d < 3 ? 1 : Math.exp(-d / 55);
}

/** The sweep's speed: about nine seconds a turn. */
export const SWEEP_DEG_PER_SECOND = 40;

/** Where the sweep is after `dtMs` more milliseconds. A long gap (a hidden tab) counts as at most 100 ms, so it never jumps. */
export function advanceSweep(rotDeg: number, dtMs: number): number {
  return (rotDeg + (Math.min(Math.max(dtMs, 0), 100) / 1000) * SWEEP_DEG_PER_SECOND) % 360;
}
