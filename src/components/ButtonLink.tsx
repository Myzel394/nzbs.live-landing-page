import type { ComponentPropsWithoutRef } from "react";

type Props = ComponentPropsWithoutRef<"a"> & {
  variant?: "primary" | "ghost";
  size?: "default" | "small";
};

// Styled in step 1 (tokens and buttons); variant and size are exposed as data attributes until then.
export function ButtonLink({ variant = "primary", size = "default", ...props }: Props) {
  return <a data-variant={variant} data-size={size} {...props} />;
}
