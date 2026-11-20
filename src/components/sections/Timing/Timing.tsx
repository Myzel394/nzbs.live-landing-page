import { ScenePlaceholder } from "@/components/ScenePlaceholder";

// The scene: the same NZB on five monthly nights, as a 10×7 grid of articles.

export const GRID = { cols: 10, rows: 7 } as const;

export const RUNS = [
  { label: "1 Jul", gone: 1 },
  { label: "1 Aug", gone: 5 },
  { label: "1 Sep", gone: 13 },
  { label: "1 Oct", gone: 27 },
  { label: "1 Nov", gone: 46 },
] as const;

/**
 * Grid cells (row-major) in the order they go missing; each run's holes are the first `gone`.
 * The mockup made this order with Python's random; it is copied from the approved render so
 * every month shows exactly the same holes.
 */
export const HOLE_ORDER = [
  17, 4, 16, 39, 62, 12, 18, 22, 23, 29, 46, 54, 60, 0, 9, 13, 27, 34, 35, 36, 42, 44, 45, 50, 55, 56, 63, 5, 6, 14,
  15, 19, 30, 33, 41, 43, 47, 48, 49, 51, 53, 64, 65, 66, 67, 69,
] as const;

export const holesFor = (gone: number): ReadonlySet<number> => new Set(HOLE_ORDER.slice(0, gone));

export function Timing() {
  return (
    <section id="early" aria-labelledby="early-title">
      {/* The five monthly article grids arrive in step 4. */}
      <ScenePlaceholder
        scene="timing"
        label="The same NZB as a block of articles on five monthly nights, July to November. In July one article is gone and the light is on it; by November 46 of 70 are gone."
      />
      <div>
        <p>Timing</p>
        <h2 id="early-title">Know before your downloader does</h2>
        <p>
          The first night an article goes missing, you still have options: par2 covers a small gap, or you grab
          another NZB while one is still around. Found by your downloader months later, at 97%, there are none left.
        </p>
      </div>
    </section>
  );
}
