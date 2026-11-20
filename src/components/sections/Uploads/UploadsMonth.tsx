"use client";

import { useState, type ReactNode } from "react";
import { UploadsMonthContext } from "@/hooks/useUploadsMonth";

/** Holds which monthly run the charts and the readout show, so they stay in step. */
export function UploadsMonth({ initial, children }: { initial: number; children: ReactNode }) {
  const [month, setMonth] = useState(initial);
  return <UploadsMonthContext value={{ month, setMonth }}>{children}</UploadsMonthContext>;
}
