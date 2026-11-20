import { useId } from "react";
import { Stars } from "@/components/Stars";
import styles from "./Phone.module.css";

/** The lock-screen wallpaper: a starry night and a small lighthouse whose beam sweeps slowly. */
export function Wallpaper() {
  const id = useId();
  return (
    <svg className={styles.wallpaper} viewBox="0 0 300 640" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a0d12" />
          <stop offset=".72" stopColor="#1a2230" />
          <stop offset="1" stopColor="#0c0f14" />
        </linearGradient>
        <linearGradient id={`${id}-beam`} x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#fff0cc" stopOpacity=".55" />
          <stop offset="1" stopColor="#ebcb8b" stopOpacity="0" />
        </linearGradient>
        <filter id={`${id}-glow`}>
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      <rect width="300" height="640" fill={`url(#${id}-sky)`} />
      <Stars seed={9} count={70} maxY={420} width={300} opacity={[0.2, 0.6]} />
      <polygon className={styles.wpbeam} points="232,452 -40,380 -40,560 232,458" fill={`url(#${id}-beam)`} />
      <circle cx="232" cy="455" r="20" fill="#ebcb8b" opacity=".6" filter={`url(#${id}-glow)`} />
      <path d="M200 560 Q232 540 268 560 L300 640 L170 640 Z" fill="#07090c" />
      {Array.from({ length: 13 }, (_, k) => (
        <rect
          key={k}
          x={221 + k * 0.25}
          y={548 - k * 6.5}
          width={22 - k * 0.5}
          height="5.5"
          fill={Math.floor(k / 3) % 2 === 0 ? "#d8dee9" : "#3b4252"}
        />
      ))}
      <rect x="227" y="450" width="10" height="10" fill="#fff3d6" />
    </svg>
  );
}
