// The nzbs.live mark: six article tiles with one missing (red outline) and a light beam across.
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false" className={className}>
      <line
        x1="14.5"
        y1="14.5"
        x2="49.5"
        y2="49.5"
        stroke="var(--acc, #EBCB8B)"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <g fill="var(--ink, #ECEFF4)">
        <rect x="8" y="8" width="13" height="14" rx="4" />
        <rect x="8" y="25" width="13" height="14" rx="4" />
        <rect x="8" y="42" width="13" height="14" rx="4" />
        <rect x="43" y="25" width="13" height="14" rx="4" />
        <rect x="43" y="42" width="13" height="14" rx="4" />
      </g>
      <rect x="44" y="9" width="11" height="12" rx="3.5" fill="none" stroke="var(--miss, #BF616A)" strokeWidth="2" />
    </svg>
  );
}
