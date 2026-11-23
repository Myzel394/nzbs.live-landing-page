import { useEffect, useRef } from "react";
import { advanceSweep, radarGlow } from "@/utils/radar";
import { useInView } from "./useInView";
import { useMotionAllowed } from "./useMotionAllowed";

/**
 * Turns the radar's sweep (`[data-radar-sweep]`, its `--rot`) and lights each `[data-sweep]` service through
 * its `--i-default` as the beam passes. Runs only while the radar is on screen, motion is allowed and the
 * viewport is wider than 47.5em (up to that the radar is a plain grid). Styles are written straight to the
 * elements, not through React state. Returns the ref for the radar's root element.
 */
export function useRadarSweep<T extends HTMLElement>(startDeg: number) {
  const [ref, visible] = useInView<T>({ once: false, rootMargin: "0%" });
  const allowed = useMotionAllowed();
  const rot = useRef(startDeg);

  useEffect(() => {
    const root = ref.current;
    const sweep = root?.querySelector<HTMLElement>("[data-radar-sweep]");
    if (!root || !sweep || !allowed || !visible) return;
    const items = [...root.querySelectorAll<HTMLElement>("[data-sweep]")].map((el) => ({ el, deg: Number(el.dataset.sweep) }));
    const wide = matchMedia("(width > 47.5em)");

    let frame = 0;
    let last = 0;
    const tick = (now: number) => {
      rot.current = advanceSweep(rot.current, now - last);
      last = now;
      sweep.style.setProperty("--rot", `${rot.current.toFixed(2)}deg`);
      for (const { el, deg } of items) el.style.setProperty("--i-default", radarGlow(deg, rot.current).toFixed(3));
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      cancelAnimationFrame(frame);
      if (!wide.matches) return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };
    start();
    wide.addEventListener("change", start);
    return () => {
      cancelAnimationFrame(frame);
      wide.removeEventListener("change", start);
    };
  }, [ref, allowed, visible]);

  return ref;
}
