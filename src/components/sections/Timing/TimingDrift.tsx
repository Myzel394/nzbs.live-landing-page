"use client";

import { useRef } from "react";
import { usePointerDrift } from "@/hooks/usePointerDrift";

/** Renders nothing; makes the section's wide scene (`data-drift`) drift with the mouse. */
export function TimingDrift() {
  const ref = useRef<HTMLSpanElement>(null);
  usePointerDrift(ref);
  return <span ref={ref} hidden />;
}
