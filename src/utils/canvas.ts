export type CanvasSize = {
  /** CSS pixels. */
  width: number;
  height: number;
  /** Device pixels per CSS pixel, capped. */
  dpr: number;
};

/**
 * The scale from CSS pixels to a backing store of `store` device pixels for `css` CSS pixels: the rounded
 * store over the CSS size, so a full-size fill reaches the last device pixel (393 CSS px at 1.5 is 590
 * device px, not 589.5, and a 1.5 scale would leave that column to earlier frames). `dpr` for an empty box.
 */
export const storeScale = (store: number, css: number, dpr: number) => (css ? store / css : dpr);

/**
 * Sizes a canvas's backing store to its CSS size times the device pixel ratio (capped at 2, as more
 * costs fill rate without visible gain) and scales the context so drawing uses CSS pixels.
 * The scale is per axis (see storeScale).
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
  ctx.setTransform(storeScale(canvas.width, width, dpr), 0, 0, storeScale(canvas.height, height, dpr), 0, 0);
  return { width, height, dpr };
}

/**
 * Calls `callback` whenever the device pixel ratio changes: the window moved to a screen with another
 * density, or the page was zoomed. A ResizeObserver misses the first case, as the CSS size stays the same.
 * Returns the function that stops listening.
 */
export function onPixelRatioChange(callback: () => void): () => void {
  let query: MediaQueryList | null = null;
  const onChange = () => {
    listen();
    callback();
  };
  // The query matches the current ratio only, so it is renewed after every change.
  const listen = () => {
    query?.removeEventListener("change", onChange);
    query = matchMedia(`(resolution: ${devicePixelRatio}dppx)`);
    query.addEventListener("change", onChange);
  };
  listen();
  return () => query?.removeEventListener("change", onChange);
}
