/** Scene time in seconds, advanced by real frame time. Long gaps (a background tab) count as one short step. */
export type Clock = {
  readonly time: number;
  /** Advances by the time since the last tick (at most `maxStep`) and returns the new time. */
  tick(nowMs: number): number;
  /** Forgets the last tick, so time does not jump when ticking resumes. */
  pause(): void;
  /** Jumps to a time, e.g. a scene's still frame. */
  set(time: number): void;
};

export function createClock(start = 0, maxStep = 0.1): Clock {
  let time = start;
  let last: number | null = null;
  return {
    get time() {
      return time;
    },
    tick(nowMs) {
      if (last !== null) time += Math.min(maxStep, Math.max(0, (nowMs - last) / 1000));
      last = nowMs;
      return time;
    },
    pause() {
      last = null;
    },
    set(next) {
      time = next;
      last = null;
    },
  };
}
