"use client";

import { useMotionPaused } from "@/hooks/useMotionPaused";
import styles from "./MotionToggle.module.css";

/** Pauses every animation on the page (canvases and CSS), and remembers the choice. */
export function MotionToggle({ className }: { className?: string }) {
  const [paused, setPaused] = useMotionPaused();
  return (
    <button
      type="button"
      className={className ? `${styles.toggle} ${className}` : styles.toggle}
      aria-pressed={paused}
      onClick={() => setPaused(!paused)}
    >
      {paused ? "Play motion" : "Pause motion"}
    </button>
  );
}
