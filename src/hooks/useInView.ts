import { useEffect, useRef, useState } from "react";

type Options = {
  /** Stay true after the first time the element comes into view. */
  once?: boolean;
  rootMargin?: string;
  threshold?: number;
};

/**
 * Whether an element is in the viewport. By default it turns true once the element's top passes
 * 80% of the viewport height, which works for elements of any height.
 */
export function useInView<T extends Element>({ once = true, rootMargin = "0px 0px -20% 0px", threshold = 0 }: Options = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin, threshold },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [once, rootMargin, threshold]);

  return [ref, inView] as const;
}
