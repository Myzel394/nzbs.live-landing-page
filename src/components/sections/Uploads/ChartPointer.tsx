"use client";

import { useEffect, useRef, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { useUploadsMonth } from "@/hooks/useUploadsMonth";
import { nearestIndex, runTitle } from "@/utils/availability";

type Props = {
  className: string;
  /** x of each month in the chart's viewBox. */
  xs: readonly number[];
  months: readonly string[];
  children: ReactNode;
};

/**
 * Makes the server-rendered chart inside it interactive: the pointer (mouse, touch or pen; tap or drag) or the
 * arrow keys, Home and End pick a month; the crosshair beam follows through the chart's `--x`.
 */
export function ChartPointer({ className, xs, months, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { month, setMonth } = useUploadsMonth();

  useEffect(() => {
    const svg = ref.current?.querySelector("svg");
    // A share of the viewBox's width: the crosshair translates against the viewBox (transform-box in the CSS).
    if (svg) svg.style.setProperty("--x", `${(xs[month] / svg.viewBox.baseVal.width) * 100}%`);
  }, [month, xs]);

  const pick = (e: PointerEvent) => {
    const svg = ref.current?.querySelector("svg");
    const ctm = svg?.getScreenCTM();
    if (!ctm) return;
    setMonth(nearestIndex(xs, new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse()).x));
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const next = { ArrowLeft: month - 1, ArrowRight: month + 1, Home: 0, End: months.length - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setMonth(Math.min(Math.max(next, 0), months.length - 1));
  };

  return (
    <div
      ref={ref}
      className={className}
      role="group"
      tabIndex={0}
      aria-label={`Availability by month, use the left and right arrow keys. Showing ${runTitle(months[month], month)}.`}
      onPointerDown={(e) => {
        if (e.pointerType !== "mouse") e.currentTarget.setPointerCapture(e.pointerId);
        pick(e);
      }}
      onPointerMove={pick}
      onKeyDown={onKeyDown}
    >
      {children}
    </div>
  );
}
