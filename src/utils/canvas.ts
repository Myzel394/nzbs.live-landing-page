export type CanvasSize = {
  /** CSS pixels. */
  width: number;
  height: number;
  /** Device pixels per CSS pixel, capped. */
  dpr: number;
};

/**
 * Sizes a canvas's backing store to its CSS size times the device pixel ratio (capped at 2, as more
 * costs fill rate without visible gain) and scales the context so drawing uses CSS pixels.
 */
export function fitCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  devicePixelRatio: number,
  maxDpr = 2,
): CanvasSize {
  const dpr = Math.min(devicePixelRatio || 1, maxDpr);
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { width, height, dpr };
}
