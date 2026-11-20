"use client";

import type { ComponentPropsWithoutRef } from "react";
import { useInView } from "@/hooks/useInView";
import styles from "./ImmersiveSection.module.css";

type Props = ComponentPropsWithoutRef<"section"> & {
  /** `full`: at least a screen tall, for sections with a scene behind them. `auto`: as tall as the content. */
  height?: "full" | "auto";
};

/**
 * A section on the page's night: seams fade it into its neighbours, and its scene sits behind its text.
 * Gets `data-in` once scrolled into view, which reveals its text and starts entrance motion.
 */
export function ImmersiveSection({ height = "full", className, ...props }: Props) {
  const [ref, inView] = useInView<HTMLElement>();
  const classes = [styles.section, height === "full" && styles.full, className];
  return (
    <section
      ref={ref}
      data-reveal=""
      data-in={inView ? "" : undefined}
      className={classes.filter(Boolean).join(" ")}
      {...props}
    />
  );
}
