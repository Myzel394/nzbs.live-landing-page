// Isometric projection for cube scenes drawn on a 2D canvas, as in the approved mockup:
// screen X = (x − y)·cos30°, screen Y = (x + y)·sin30° − z, in cube units times a scale.

export const C30 = Math.cos(Math.PI / 6);
export const S30 = 0.5;

/** A box in cube units: its back-top corner at (x, y, z), `s` wide and deep, `h` high. */
export type IsoBox = { x: number; y: number; z: number; s: number; h: number };

/** Screen rectangle [left, top, right, bottom] in CSS pixels, with an optional cap on the scale. */
export type Region = readonly [number, number, number, number, number?];

/** Rectangle [left, top, right, bottom]. */
export type Box = [number, number, number, number];

/** Every box projected to the screen, one entry per box in each array. */
export type Projection = {
  /** CSS pixels per cube unit. */
  scale: number;
  /** Screen bounds of all boxes. */
  box: Box;
  X: Float64Array;
  Y: Float64Array;
  /** Projected width and height of each box, in pixels. */
  s: Float64Array;
  h: Float64Array;
  /** Painter's depth: draw low values first. */
  d: Float64Array;
};

/** Painter's depth of a box: further back and lower boxes are drawn first. */
export const isoDepth = (b: IsoBox) => b.x + b.y + b.z * 1.2;

/**
 * Projects the boxes, then scales and centres the whole set into `region` so its bounds fit
 * (never above the region's scale cap).
 */
export function fitIso(boxes: readonly IsoBox[], region: Region): Projection {
  let x0 = Infinity;
  let x1 = -Infinity;
  let y0 = Infinity;
  let y1 = -Infinity;
  for (const q of boxes) {
    x0 = Math.min(x0, (q.x - q.y - q.s) * C30);
    x1 = Math.max(x1, (q.x + q.s - q.y) * C30);
    y0 = Math.min(y0, (q.x + q.y) * S30 - q.z - q.h);
    y1 = Math.max(y1, (q.x + q.y + 2 * q.s) * S30 - q.z);
  }
  const [left, top, right, bottom, cap] = region;
  const scale = Math.min((right - left) / (x1 - x0), (bottom - top) / (y1 - y0), cap || Infinity);
  const ox = left + (right - left - (x1 - x0) * scale) / 2 - x0 * scale;
  const oy = top + (bottom - top - (y1 - y0) * scale) / 2 - y0 * scale;

  const n = boxes.length;
  const p: Projection = {
    scale,
    box: [x0 * scale + ox, y0 * scale + oy, x1 * scale + ox, y1 * scale + oy],
    X: new Float64Array(n),
    Y: new Float64Array(n),
    s: new Float64Array(n),
    h: new Float64Array(n),
    d: new Float64Array(n),
  };
  boxes.forEach((q, i) => {
    p.X[i] = ox + (q.x - q.y) * C30 * scale;
    p.Y[i] = oy + ((q.x + q.y) * S30 - q.z) * scale;
    p.s[i] = q.s * scale;
    p.h[i] = q.h * scale;
    p.d[i] = isoDepth(q);
  });
  return p;
}

/**
 * Sorts box indices by depth in place, ties by index, so the order is the same as a stable sort of
 * the boxes. Insertion sort: close to linear when `order` is still sorted from the previous frame,
 * which it is while boxes move a little per frame.
 */
export function sortByDepth(order: Uint16Array, depth: ArrayLike<number>): Uint16Array {
  for (let i = 1; i < order.length; i++) {
    const item = order[i];
    const d = depth[item];
    let j = i - 1;
    while (j >= 0 && (depth[order[j]] > d || (depth[order[j]] === d && order[j] > item))) {
      order[j + 1] = order[j];
      j--;
    }
    order[j + 1] = item;
  }
  return order;
}

/** Indices 0..n−1 sorted by depth. */
export function depthOrder(depth: ArrayLike<number>): Uint16Array {
  const order = new Uint16Array(depth.length);
  for (let i = 0; i < order.length; i++) order[i] = i;
  // A full sort first: insertion sort is quadratic on an unsorted start.
  order.sort((a, b) => depth[a] - depth[b] || a - b);
  return order;
}
