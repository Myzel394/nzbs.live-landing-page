"use client";

import type { ReactNode } from "react";
import { useRadarSweep } from "@/hooks/useRadarSweep";

type Props = { className: string; startDeg: number; children: ReactNode };

/** The radar's element; the server-rendered radar goes inside, and this turns its sweep. */
export function RadarMotion({ className, startDeg, children }: Props) {
  const ref = useRadarSweep<HTMLDivElement>(startDeg);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
