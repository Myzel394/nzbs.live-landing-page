// The site-wide "Pause motion" setting: kept in localStorage and mirrored on <html data-motion="paused">
// so CSS animations pause too. Read through useMotionPaused().

const KEY = "nzbs-live:motion-paused";
const listeners = new Set<() => void>();
let paused: boolean | null = null;

function read(): boolean {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false; // storage blocked: motion runs, the toggle still works for this visit
  }
}

function reflect(value: boolean) {
  if (value) document.documentElement.dataset.motion = "paused";
  else delete document.documentElement.dataset.motion;
}

export function getMotionPaused(): boolean {
  if (paused === null) {
    paused = read();
    reflect(paused);
  }
  return paused;
}

export function setMotionPaused(value: boolean) {
  paused = value;
  try {
    if (value) localStorage.setItem(KEY, "1");
    else localStorage.removeItem(KEY);
  } catch {
    // storage blocked: keep the setting for this visit only
  }
  reflect(value);
  listeners.forEach((listener) => listener());
}

export function subscribeMotionPaused(listener: () => void) {
  listeners.add(listener);
  // Follow the setting when another tab changes it.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== KEY) return;
    paused = read();
    reflect(paused);
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}
