import { starfield } from "@/utils/starfield";

type Props = Parameters<typeof starfield>[0];

/** A seeded scatter of stars, as SVG circles. Put it inside an <svg>. */
export function Stars(props: Props) {
  return (
    <g fill="#e5e9f0">
      {starfield(props).map((s, i) => (
        <circle key={i} cx={s.cx} cy={s.cy} r={s.r} opacity={s.opacity} />
      ))}
    </g>
  );
}
