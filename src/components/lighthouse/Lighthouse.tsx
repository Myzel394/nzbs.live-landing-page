"use client";

import dynamic from "next/dynamic";
import type { LighthouseVariant } from "./LighthouseCanvas";
import styles from "./Lighthouse.module.css";

// The canvas only exists in the browser. Until it loads, the container's CSS gradient shows the same sky,
// sea and lamp, so nothing flashes and nothing moves.
const LighthouseCanvas = dynamic(() => import("./LighthouseCanvas").then((m) => m.LighthouseCanvas), { ssr: false });

/** The lighthouse scene, filling the nearest positioned ancestor, behind its content. */
export function Lighthouse({ variant }: { variant: LighthouseVariant }) {
  return (
    <div className={`${styles.scene} ${styles[variant]}`} data-scene="lighthouse" aria-hidden="true">
      <LighthouseCanvas variant={variant} />
    </div>
  );
}
