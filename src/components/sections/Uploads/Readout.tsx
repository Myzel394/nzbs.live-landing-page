"use client";

import { useUploadsMonth } from "@/hooks/useUploadsMonth";
import { monthReadout, runTitle } from "@/utils/availability";
import styles from "./Uploads.module.css";

type Props = {
  series: readonly { nzb: string; values: readonly number[] }[];
  months: readonly string[];
};

/** The shown run's five lowest values, sunk ones red, and how many NZBs were complete. Follows the chart. */
export function Readout({ series, months }: Props) {
  const { month } = useUploadsMonth();
  const { rows, complete } = monthReadout(series, month);
  return (
    <div className={styles.readout} aria-live="polite">
      <strong>{runTitle(months[month], month)}</strong>
      {rows.map((row) => (
        <div key={row.name} className={row.sunk ? `${styles.row} ${styles.sunk}` : styles.row}>
          <span>{row.name}</span>
          <span>{row.value.toFixed(6)}</span>
        </div>
      ))}
      <div className={`${styles.row} ${styles.dim}`}>
        <span>{complete} more, all complete</span>
        <span>1.000000</span>
      </div>
    </div>
  );
}
