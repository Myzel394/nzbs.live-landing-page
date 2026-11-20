import { ScenePlaceholder } from "@/components/ScenePlaceholder";

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
