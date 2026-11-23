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

/** A ring of the radar: which services sit on it, its radius (share of the radar) and where the first one starts. */
export type RadarRing = { weight: number; radius: number; startDeg: number };

/** Where a service sits on the radar. */
export type RadarPlacement = {
  left: number; // % of the radar's width
  top: number; // % of the radar's height
  depth: number; // scale, 0.84 (back) to 1 (front)
  zIndex: number;
  sweepDeg: number; // conic-gradient angle (0 = up, clockwise), for the radar sweep
};

/**
 * Places every item on the ring of its weight (rings in the order given), spread evenly from the
 * ring's start angle. The rings are ellipses (the radar is tilted), so y uses 44.6% instead of 50%.
 */
export function radarLayout<T extends { weight: number }>(items: readonly T[], rings: readonly RadarRing[]): (T & RadarPlacement)[] {
  return rings.flatMap((ring) => {
    const onRing = items.filter((item) => item.weight === ring.weight);
    return onRing.map((item, k) => {
      const a = ((ring.startDeg + (360 * k) / onRing.length) * Math.PI) / 180;
      const sin = Math.sin(a);
      return {
        ...item,
        left: 50 + Math.cos(a) * ring.radius * 50,
        top: 50 + sin * ring.radius * 44.6,
        depth: 0.84 + (0.16 * (1 + sin)) / 2,
        zIndex: Math.trunc(10 + sin * 5),
        sweepDeg: ((((a * 180) / Math.PI + 90) % 360) + 360) % 360,
      };
    });
  });
}
