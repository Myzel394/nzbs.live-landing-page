/**
 * Seeded Park–Miller ("minimal standard") generator, the same as the approved mockup's,
 * so every scene lays out identically on every visit and in screenshot tests.
 * Returns a function yielding numbers in (0, 1).
 */
export function seeded(seed: number): () => number {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}
