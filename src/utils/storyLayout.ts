import type { Box, Region } from "./isometric";

/** A rectangle on the canvas. */
export type Rect = { x: number; y: number; w: number; h: number };

/** wide: scene right of the text. stacked: scene above the step cards. side: short landscape phone, card left, scene right. */
export type StoryMode = "wide" | "stacked" | "side";

export type StoryLayout = {
  mode: StoryMode;
  /** Compact scene (stacked or side): smaller pages, no file labels. */
  narrow: boolean;
  /** Where each step's cubes are fitted; step 0 (the NZB page alone) has none. */
  regions: readonly (Region | null)[];
  /** The NZB card of step 5. */
  card: Rect;
  /** Baseline of the month ruler of step 7. */
  rulerY: number;
};

/** Below this canvas width the story uses its phone layout. */
export const NARROW = 1000;

/**
 * Where the cube scene of "Usenet forgets, slowly" puts things on a canvas of `width`×`height` CSS
 * pixels, as in the approved mockup: right of the step text on wide screens, above the cards on phones.
 * Pass `mode` from the CSS (`--story-mode`, Story.module.css), so canvas and text always agree on the layout.
 */
export function storyLayout(width: number, height: number, mode: StoryMode = width < NARROW ? "stacked" : "wide"): StoryLayout {
  const W = width;
  const H = height;
  const side = mode === "side";
  const narrow = mode !== "wide";
  const x0 = side ? W * 0.44 : narrow ? W * 0.05 : Math.max(W * 0.42, 600);
  const x1 = side ? W * 0.97 : W * 0.96;
  // Short landscape: leave room under the block for its captions and the ruler.
  const top = side ? H * 0.08 : narrow ? H * 0.05 : H * 0.1;
  const bot = side ? H - 72 : narrow ? H * 0.56 : H * 0.9;
  const cap = Math.min(W, H) / (narrow ? 32 : 33);
  const card = side
    ? { x: x0, y: top, w: Math.min(226, Math.max(200, (x1 - x0) * 0.5)), h: bot - top }
    : narrow
      ? { x: W * 0.05, y: H * 0.04, w: W * 0.9, h: H * 0.24 }
      : { x: x0, y: H * 0.14, w: Math.min((x1 - x0) * 0.36, 320), h: H * 0.6 };
  const stacked = mode === "stacked";
  const regions: (Region | null)[] = [
    null,
    [x0, top, x1, bot, cap],
    [x0, top, stacked || side ? x1 : x1 - 330, bot],
    [x0, top, x1, bot],
    stacked ? [x0, card.y + card.h + 14, x1, bot] : [card.x + card.w + (side ? 24 : 50), top, x1, bot],
    [x0, top, x1, bot, cap],
    [x0, top, x1, narrow ? bot : H * 0.8],
    [x0, top, x1, bot - 30, cap],
  ];
  return { mode, narrow, regions, card, rulerY: side ? H - 36 : narrow ? H * 0.6 : H * 0.88 };
}

/**
 * The NZB page: large and centred in `region` on its own (`alone`), then small at the foot of the
 * block of cubes (`block`, the bounds of the joined file) that grows out of it (`small`).
 */
export function nzbPages(narrow: boolean, region: Region, block: Box): { alone: Rect; small: Rect } {
  const pw = narrow ? 150 : 210;
  const alone = { x: (region[0] + region[2]) / 2 - pw / 2, y: (region[1] + region[3]) / 2 - pw * 0.66, w: pw, h: pw * 1.3 };
  const sw = narrow ? 64 : 84;
  const small = narrow
    ? { x: region[0], y: block[3] - sw * 1.3, w: sw, h: sw * 1.3 }
    : { x: Math.max(region[0] - 20, block[0] - sw - 60), y: block[3] - sw * 1.3 + 10, w: sw, h: sw * 1.3 };
  return { alone, small };
}
