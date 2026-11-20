import { useEffect, useEffectEvent, useRef, useState } from "react";
import { type CanvasSize, fitCanvas } from "@/utils/canvas";
import { createClock } from "@/utils/clock";
import { useInView } from "./useInView";
import { useMotionPaused } from "./useMotionPaused";
import { useReducedMotion } from "./useReducedMotion";

type Scene = {
  /** Called after every resize, before drawing: precompute geometry for the new size here. */
  layout?: (size: CanvasSize) => void;
  /** Draws one frame at scene time `time` (seconds). */
  draw: (ctx: CanvasRenderingContext2D, size: CanvasSize, time: number) => void;
  /** The frame shown when the visitor prefers reduced motion. */
  stillTime?: number;
  /** Cap on device pixels per CSS pixel (default 2). Soft full-screen scenes can use less. */
  maxDpr?: number;
};

/**
 * Runs an animated 2D canvas scene: keeps the canvas sharp at any size, animates only while the
 * canvas is on screen, and holds a still frame when motion is reduced or paused.
 * Returns the ref to put on the <canvas>.
 */
export function useCanvasScene({ layout, draw, stillTime = 0, maxDpr }: Scene) {
  const [ref, visible] = useInView<HTMLCanvasElement>({ once: false, rootMargin: "0px" });
  const reduced = useReducedMotion();
  const [paused] = useMotionPaused();
  const scene = useRef<{ ctx: CanvasRenderingContext2D; size: CanvasSize } | null>(null);
  const [clock] = useState(() => createClock(stillTime));

  const render = useEffectEvent(() => {
    if (scene.current) draw(scene.current.ctx, scene.current.size, clock.time);
  });
  const resize = useEffectEvent(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const size = fitCanvas(canvas, ctx, devicePixelRatio, maxDpr);
    scene.current = { ctx, size };
    layout?.(size);
    render();
  });

  // Size the canvas now and whenever its box changes, at most once per frame.
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => resize());
    });
    observer.observe(canvas);
    resize();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [ref]);

  // Animate while visible and allowed; otherwise hold a still frame.
  useEffect(() => {
    if (reduced) {
      clock.set(stillTime);
      render();
      return;
    }
    if (paused || !visible) {
      clock.pause();
      render();
      return;
    }
    let frame = requestAnimationFrame(function tick(now) {
      clock.tick(now);
      render();
      frame = requestAnimationFrame(tick);
    });
    return () => {
      cancelAnimationFrame(frame);
      clock.pause();
    };
  }, [clock, reduced, paused, visible, stillTime]);

  return ref;
}
