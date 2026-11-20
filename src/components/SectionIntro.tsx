import type { ReactNode } from "react";
import styles from "./SectionIntro.module.css";

type Props = {
  /** The mono label above the heading. */
  label: string;
  title: string;
  /** Id of the heading; the section points `aria-labelledby` at it. */
  titleId: string;
  /** The paragraph and anything else below the heading. */
  children: ReactNode;
  variant?: "default" | "wide" | "narrow" | "inline" | "centered";
};

/** The text block that sits on a scene: label, big heading, then a lede. */
export function SectionIntro({ label, title, titleId, children, variant = "default" }: Props) {
  return (
    <div className={`${styles.intro} ${styles[variant]}`}>
      <p className={styles.label}>{label}</p>
      <h2 id={titleId}>{title}</h2>
      {children}
    </div>
  );
}
