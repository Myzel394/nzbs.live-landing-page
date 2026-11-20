import { useEffect, type RefObject } from "react";
import { useMotionAllowed } from "./useMotionAllowed";

/**
 * A little depth: the scene drifts against the pointer (mouse only, up to 7px across and 4px down, enlarged 2%
 * so the edges stay covered). `marker` is any element inside the section; the section is its closest <section>
 * and the scene is the child of it marked `data-drift`. Does nothing when motion is reduced or paused.
 */
export function usePointerDrift(marker: RefObject<HTMLElement | null>) {
  const allowed = useMotionAllowed();

  useEffect(() => {
    const section = marker.current?.closest("section");
    const scene = section?.querySelector<HTMLElement>("[data-drift]");
    if (!allowed || !section || !scene) return;

    scene.style.transition = "transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)";
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const box = section.getBoundingClientRect();
      const dx = (e.clientX - box.left) / box.width - 0.5;
      const dy = (e.clientY - box.top) / box.height - 0.5;
      scene.style.transform = `translate(${(-dx * 14).toFixed(2)}px, ${(-dy * 8).toFixed(2)}px) scale(1.02)`;
    };
    section.addEventListener("pointermove", onMove);
    return () => {
      section.removeEventListener("pointermove", onMove);
      scene.style.transition = "";
      scene.style.transform = "";
    };
  }, [allowed, marker]);
}
