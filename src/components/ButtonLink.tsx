import type { ComponentPropsWithoutRef } from "react";
import styles from "./ButtonLink.module.css";

type Props = ComponentPropsWithoutRef<"a"> & {
  variant?: "primary" | "ghost";
  size?: "default" | "small";
};

export function ButtonLink({ variant = "primary", size = "default", className, ...props }: Props) {
  const classes = [styles.button, styles[variant], size === "small" && styles.small, className];
  return <a className={classes.filter(Boolean).join(" ")} {...props} />;
}
