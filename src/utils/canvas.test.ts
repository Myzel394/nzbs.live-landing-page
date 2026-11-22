import { expect, it, vi } from "vitest";
import { fitCanvas, storeScale } from "./canvas";

it("sizes the backing store to CSS size times a capped pixel ratio", () => {
  const canvas = { clientWidth: 400, clientHeight: 300, width: 0, height: 0 } as HTMLCanvasElement;
  const ctx = { setTransform: vi.fn() } as unknown as CanvasRenderingContext2D;

  expect(fitCanvas(canvas, ctx, 3)).toEqual({ width: 400, height: 300, dpr: 2 });
  expect([canvas.width, canvas.height]).toEqual([800, 600]);
  expect(ctx.setTransform).toHaveBeenLastCalledWith(2, 0, 0, 2, 0, 0);

  expect(fitCanvas(canvas, ctx, 1.5).dpr).toBe(1.5);
  expect(canvas.width).toBe(600);
});

it("scales by the rounded backing store, so drawing reaches the last device pixel", () => {
  const canvas = { clientWidth: 393, clientHeight: 760, width: 0, height: 0 } as HTMLCanvasElement;
  const ctx = { setTransform: vi.fn() } as unknown as CanvasRenderingContext2D;

  fitCanvas(canvas, ctx, 3, 1.5);
  expect([canvas.width, canvas.height]).toEqual([590, 1140]);
  expect(ctx.setTransform).toHaveBeenLastCalledWith(590 / 393, 0, 0, 1.5, 0, 0);
});

it("falls back to the pixel ratio for an empty box", () => {
  expect(storeScale(0, 0, 1.5)).toBe(1.5);
  expect(storeScale(590, 393, 1.5)).toBeCloseTo(1.5013, 4);
});
