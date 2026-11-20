import type { CSSProperties } from "react";
import { LogoMark } from "@/components/LogoMark";
import { radarGlow } from "@/utils/radar";
import { RadarMotion } from "./RadarMotion";
import { RINGS, type RadarItem } from "./Services";
import styles from "./Services.module.css";

/** Where the sweep rests in the still frame (the mockup's reduced-motion frame). `RadarMotion` turns `--rot` from here. */
const REST_DEG = 160;

const ringClass = { 1: styles.outer, 2: styles.middle, 3: styles.inner } as const;

/**
 * Every service as a light on three tilted rings around the nzbs.live mark, a beam resting at 160° with the
 * services behind it still glowing. `--i` (how lit) comes from `--i-default`, set here for the still frame;
 * `RadarMotion` updates `--i-default` and `--rot` while it runs. Narrow screens ignore both and show a plain grid.
 */
export function Radar({ items }: { items: readonly RadarItem[] }) {
  return (
    <RadarMotion className={styles.radar} startDeg={REST_DEG}>
      {RINGS.map((ring) => (
        <i key={ring.weight} className={styles.ring} style={{ "--r": ring.radius } as CSSProperties} aria-hidden="true" />
      ))}
      <div className={styles.tilt} aria-hidden="true">
        <i className={styles.sweep} data-radar-sweep="" style={{ "--rot": `${REST_DEG}deg` } as CSSProperties} />
      </div>
      <span className={styles.hub} aria-hidden="true">
        <LogoMark />
      </span>
      <ul aria-label="Supported notification services">
        {items.map(({ name, icon: Icon, weight, left, top, depth, zIndex, sweepDeg }) => (
          <li
            key={name}
            className={`${styles.item} ${ringClass[weight]}`}
            style={
              {
                left: `${left.toFixed(2)}%`,
                top: `${top.toFixed(2)}%`,
                zIndex,
                "--d": depth.toFixed(3),
                "--i-default": radarGlow(sweepDeg, REST_DEG).toFixed(3),
              } as CSSProperties
            }
            data-sweep={sweepDeg.toFixed(1)}
          >
            {Icon && (
              <span className={styles.mark}>
                <Icon aria-hidden="true" focusable="false" />
              </span>
            )}
            <span className={styles.name}>{name}</span>
          </li>
        ))}
      </ul>
    </RadarMotion>
  );
}
