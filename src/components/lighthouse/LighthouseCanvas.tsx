"use client";

import { useEffect, useState } from "react";
import { useCanvasScene } from "@/hooks/useCanvasScene";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";
import { createAim, STILL_TIME } from "@/utils/lighthouse";
import { createLighthouseRenderer, type LighthouseLook } from "./drawLighthouse";
import styles from "./Lighthouse.module.css";

export type LighthouseVariant = "hero" | "closing";

const LOOKS: Record<LighthouseVariant, LighthouseLook> = {
  hero: {
    skyTop: "#0d1117",
    seaBottom: "#0e1217",
    haze: 0.11,
    hazeRadius: 0.65,
    moteCount: 320,
    starSpan: 0.35,
    tiles: true,
    flare: true,
  },
  closing: {
    skyTop: "#0a0d12",
    seaBottom: "#0a0d12",
    haze: 0.09,
    hazeRadius: 0.6,
    moteCount: 260,
    starSpan: 0.32,
    tiles: false,
    flare: false,
  },
};

/**
 * The lighthouse on its dark sea, drawn on a canvas that fills its container. In the hero, a mouse pointer
 * over the container aims the beam; with reduced motion, or while paused, the beam rests and the pointer is ignored.
 */
export function LighthouseCanvas({ variant }: { variant: LighthouseVariant }) {
  const [renderer] = useState(() => createLighthouseRenderer(LOOKS[variant]));
  const [aim] = useState(createAim);
  const motionAllowed = useMotionAllowed();
  const aimable = variant === "hero" && motionAllowed;

  const ref = useCanvasScene({
    layout: renderer.layout,
    draw: (ctx, size, time) => renderer.draw(ctx, size, time, aimable ? aim.step(performance.now() / 1000) : null),
    stillTime: STILL_TIME,
    maxDpr: 1.5,
  });

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.closest("header, section");
    if (!canvas || !host || !aimable) {
      aim.reset();
      return;
    }
    const onMove = (event: Event) => {
      const { pointerType, clientX, clientY } = event as PointerEvent;
      if (pointerType !== "mouse") return;
      const box = canvas.getBoundingClientRect();
      aim.move(clientX - box.left, clientY - box.top, performance.now() / 1000);
    };
    const onLeave = () => aim.leave();
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [ref, aim, aimable]);

  return <canvas ref={ref} className={styles.canvas} aria-hidden="true" />;
}
