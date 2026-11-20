import { expect, it, vi } from "vitest";
import { fitCanvas } from "./canvas";

it("sizes the backing store to CSS size times a capped pixel ratio", () => {
  const canvas = { clientWidth: 400, clientHeight: 300, width: 0, height: 0 } as HTMLCanvasElement;
  const ctx = { setTransform: vi.fn() } as unknown as CanvasRenderingContext2D;

  expect(fitCanvas(canvas, ctx, 3)).toEqual({ width: 400, height: 300, dpr: 2 });
  expect([canvas.width, canvas.height]).toEqual([800, 600]);
  expect(ctx.setTransform).toHaveBeenLastCalledWith(2, 0, 0, 2, 0, 0);

  expect(fitCanvas(canvas, ctx, 1.5).dpr).toBe(1.5);
  expect(canvas.width).toBe(600);
});
