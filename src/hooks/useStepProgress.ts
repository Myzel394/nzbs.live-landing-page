import { useEffect, useEffectEvent } from "react";
import { type StepProgress, stepProgress } from "@/utils/stepProgress";

type Options = {
  /** The reading line, as a share of the viewport height from the top. */
  line?: number;
};

/**
 * Follows a scroll story: the list with id `listId` holds one child per step, and `onProgress`
 * hears which step is at the reading line and how far through it the visitor has scrolled.
 *
 * Scroll is read only while the list is on screen, at most once per frame. The list gets
 * `data-live` once this runs, and the active step `data-active`, so CSS can dim the others
 * (without JavaScript every step stays fully visible).
 */
export function useStepProgress(listId: string, onProgress: (progress: StepProgress) => void, { line = 0.55 }: Options = {}) {
  const notify = useEffectEvent(onProgress);

  useEffect(() => {
    const list = document.getElementById(listId);
    if (!list) return;
    const items = Array.from(list.children) as HTMLElement[];
    let active = -1;
    let frame = 0;
    let listening = false;

    const read = () => {
      frame = 0;
      const progress = stepProgress(
        items.map((item) => item.getBoundingClientRect()),
        innerHeight * line,
      );
      if (progress.step !== active) {
        items[active]?.removeAttribute("data-active");
        items[progress.step]?.setAttribute("data-active", "");
        active = progress.step;
      }
      notify(progress);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting === listening) return;
      listening = entry.isIntersecting;
      if (listening) addEventListener("scroll", schedule, { passive: true });
      else removeEventListener("scroll", schedule);
      // One more read either way, so a fast jump past the story still settles on its first or last frame.
      schedule();
    }, { rootMargin: "50% 0px" }); // start listening a little early, so re-entering after a jump never shows a stale frame
    observer.observe(list);
    addEventListener("resize", schedule);
    list.setAttribute("data-live", "");
    read();

    return () => {
      observer.disconnect();
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
      list.removeAttribute("data-live");
      items[active]?.removeAttribute("data-active");
    };
  }, [listId, line]);
}
