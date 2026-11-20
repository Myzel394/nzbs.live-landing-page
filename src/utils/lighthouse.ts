import { clamp, easeInOutCubic } from "./ease";
import { seeded } from "./rng";

// Geometry and motion rules of the lighthouse scene (the hero and the closing section), ported from the
// approved mockup. Pure: the canvas drawing lives in components/lighthouse.

/** Below this canvas width the lighthouse moves to the bottom right, close to the horizon. */
export const NARROW_BELOW = 800;
/**
 * Scene time of the still frame (reduced motion, and the first frame): the beam is out over the sea, turning
 * back to the tower. The mockup's 2.6 s lands on the lamp's flash, which washes out the headline.
 */
export const STILL_TIME = 7.1;
/** The beam sweeps out to sea and back every 10 seconds. */
export const SWEEP_SECONDS = 10;

const SEA_ROWS = 20;
/** Chance that a tile in the sea is a missing article. */
const MISSING_CHANCE = 0.026;

export type Star = { x: number; y: number; alpha: number; phase: number; size: number };
export type Mote = { x: number; y: number; speed: number; phase: number; size: number };
/** One row of the sea: rows nearer the viewer are larger and further apart. Tiles are `start` to `end` in `tileX`. */
export type SeaRow = { index: number; y: number; size: number; depth: number; start: number; end: number };
export type MissingTile = { x: number; row: SeaRow };

export type LighthouseGeometry = {
  width: number;
  height: number;
  narrow: boolean;
  horizon: number;
  lamp: { x: number; y: number };
  stars: Star[];
  motes: Mote[];
  rows: SeaRow[];
  /** Left edge of every article tile that is present, row by row. */
  tileX: Float32Array;
  /** Tiles that are missing: drawn as red outlines. */
  missing: MissingTile[];
};

export type LayoutOptions = {
  moteCount: number;
  /** How much brighter the brightest star is than the dimmest (which is 0.08). */
  starSpan: number;
  /** Whether the sea of article tiles exists (the closing section has none). */
  tiles: boolean;
};

export function layoutLighthouse(width: number, height: number, options: LayoutOptions): LighthouseGeometry {
  const random = seeded(21);
  const narrow = width < NARROW_BELOW;
  const horizon = height * (narrow ? 0.86 : 0.66);
  const lamp = { x: width * (narrow ? 0.86 : 0.82), y: height * (narrow ? 0.76 : 0.27) };

  const stars = Array.from({ length: Math.round((width * horizon) / 2300) }, () => ({
    x: random() * width,
    y: random() * horizon * 0.92,
    alpha: 0.08 + random() * options.starSpan,
    phase: random() * 6.3,
    size: random() < 0.1 ? 1.8 : 1.1,
  }));
  const motes = Array.from({ length: options.moteCount }, () => ({
    x: random() * width,
    y: random() * height,
    speed: 3 + random() * 9,
    phase: random() * 6.3,
    size: 0.7 + random() * 1.5,
  }));

  const rows: SeaRow[] = [];
  const missing: MissingTile[] = [];
  const xs: number[] = [];
  if (options.tiles) {
    for (let index = 0; index < SEA_ROWS; index++) {
      const depth = ((index + 1) / SEA_ROWS) ** 1.8;
      const size = 2 + 32 * depth;
      const pitch = size * 1.36;
      const row = { index, y: horizon + 4 + (height - horizon) * depth, size, depth, start: xs.length, end: 0 };
      for (let x = -pitch + ((index % 2) * pitch) / 2; x < width + pitch; x += pitch) {
        if (random() < MISSING_CHANCE) missing.push({ x, row });
        else xs.push(x);
      }
      row.end = xs.length;
      rows.push(row);
    }
  }
  return { width, height, narrow, horizon, lamp, stars, motes, rows, tileX: Float32Array.from(xs), missing };
}

/** Where the visitor is pointing the light, with `weight` (0 to 1, eased) saying how far the beam has turned to it. */
export type Aim = { x: number; y: number; weight: number };

export type Beam = {
  /** Where the beam lands on the sea. */
  x: number;
  y: number;
  /** Half-width of the cone at its end. */
  width: number;
  /** 0 to 1: how much it points at the viewer, which makes the lamp flash. */
  facing: number;
};

export function beamAt(time: number, g: LighthouseGeometry, aim: Aim | null): Beam {
  const phase = (time * 2 * Math.PI) / SWEEP_SECONDS;
  const sea = g.height - g.horizon;
  let x = g.lamp.x - (0.5 - 0.5 * Math.cos(phase)) * (g.lamp.x - g.width * 0.16);
  let y = g.horizon + sea * 0.5;
  let facing = Math.max(0, Math.sin(phase)) ** 12;
  if (aim && aim.weight > 0) {
    x += (aim.x - x) * aim.weight;
    y += (clamp(aim.y, g.horizon + 24, g.height - 10) - y) * aim.weight;
    facing *= 1 - aim.weight;
  }
  return { x, y, facing, width: 46 + Math.abs(x - g.lamp.x) * 0.26 };
}

/** The beam holds on the pointer this long after it last moved, then returns to its sweep. */
export const AIM_HOLD = 1.8;
const AIM_IN = 0.5;
const AIM_OUT = 1.2;

/**
 * Pointer aim over time. The beam eases onto the pointer, holds while the pointer keeps moving (or rests for
 * {@link AIM_HOLD} seconds), and eases back, rather than snapping like the mockup.
 */
export function createAim() {
  let x = 0;
  let y = 0;
  let linear = 0;
  let lastMove = -Infinity;
  let inside = false;
  let last: number | null = null;
  return {
    move(px: number, py: number, now: number) {
      x = px;
      y = py;
      lastMove = now;
      inside = true;
    },
    leave() {
      inside = false;
    },
    reset() {
      linear = 0;
      inside = false;
      last = null;
    },
    /** Advances to `now` (seconds, any steady clock) and returns the aim, or null while the beam is on its sweep. */
    step(now: number): Aim | null {
      const dt = last === null ? 0 : clamp(now - last, 0, 0.1);
      last = now;
      const held = inside && now - lastMove < AIM_HOLD;
      linear = clamp(linear + (held ? dt / AIM_IN : -dt / AIM_OUT), 0, 1);
      return linear > 0 ? { x, y, weight: easeInOutCubic(linear) } : null;
    },
  };
}

/** How strongly a missing article's outline glows: while lit, then decaying for a while after the beam passes. */
export function emberLevel(lit: number, secondsSinceLit: number) {
  return Math.max(lit, 0.8 * Math.exp(-secondsSinceLit / 6));
}
