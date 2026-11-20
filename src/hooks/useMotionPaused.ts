import { useSyncExternalStore } from "react";
import { getMotionPaused, setMotionPaused, subscribeMotionPaused } from "@/utils/motionPause";

/** The site-wide "Pause motion" setting, shared by every animated scene and kept across visits. */
export function useMotionPaused(): [paused: boolean, setPaused: (paused: boolean) => void] {
  const paused = useSyncExternalStore(subscribeMotionPaused, getMotionPaused, () => false);
  return [paused, setMotionPaused];
}
