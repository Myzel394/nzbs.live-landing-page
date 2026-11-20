import { ScenePlaceholder } from "@/components/ScenePlaceholder";
import { seeded } from "@/utils/rng";

// The cube scene of "Usenet forgets, slowly": one example release, cut into 8 files of 12×6 articles
// (576 in all), with 18 articles that Usenet drops over the year. The canvas arrives in step 7.

/** Monthly runs, Dec 2025 to Nov 2026, for the month ruler. */
const MONTHS = ["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"] as const;

export const RELEASE = "Tears.of.Steel.2012.2160p";

/** The files of the release, top layer first; the last two are par2 repair data (frost blue). */
export const FILES = ["part01.rar", "part02.rar", "part03.rar", "part04.rar", "part05.rar", "part06.rar", "par2", "vol000+01.par2"] as const;
export const PAR2_FROM = 6;

/** Articles per file as a grid: 12 wide, 6 deep. */
export const FX = 12;
export const FY = 6;
export const ARTICLES = FILES.length * FX * FY;

/** Articles that go missing, as indices within each file's 12×6 grid. 18 in all. */
export const MISSING: readonly (readonly number[])[] = [
  [7, 8, 19, 20],
  [33],
  [50, 51, 52, 62, 63],
  [12],
  [40, 41, 52, 53, 64],
  [],
  [30, 31],
  [],
];

/** Articles that get a Message-ID tag in step 4, and the ones threaded to the NZB card in step 5. */
export const TAGGED = [9, 130, 215, 300, 377, 470] as const;
export const THREADED = [5, 66, 140, 207, 288, 351, 433, 512, 570] as const;

/** A made-up but stable Message-ID for article i (0-based). */
export function messageId(i: number): string {
  const hash = (Math.imul(i + 7, 2654435761) >>> 0).toString(36).slice(0, 6);
  return `part${i + 1}of${ARTICLES}.${hash}@news.example`;
}

export type Cube = {
  layer: number; // file index, 0 = top
  gx: number; // column, 0..FX-1
  gy: number; // row, 0..FY-1
  par2: boolean;
  gone: boolean;
  goneIndex: number; // order in which missing articles turn red, or -1
  rx: number; // scatter position, -1..1
  ry: number; // scatter position, -1..1
  rz: number; // scatter height, 0..1
  lag: number; // stagger delay as a share of a step, 0..0.16
};

/** Every article as a cube, in the mockup's order and with its seeded scatter (seed 7). */
export function buildCubes(): Cube[] {
  const rnd = seeded(7);
  const cubes: Cube[] = [];
  let gone = 0;
  FILES.forEach((_, layer) => {
    for (let k = 0; k < FX * FY; k++) {
      const isGone = MISSING[layer].includes(k);
      cubes.push({
        layer,
        gx: k % FX,
        gy: Math.floor(k / FX),
        par2: layer >= PAR2_FROM,
        gone: isGone,
        goneIndex: isGone ? gone++ : -1,
        rx: rnd() * 2 - 1,
        ry: rnd() * 2 - 1,
        rz: rnd(),
        lag: rnd() * 0.16,
      });
    }
  });
  return cubes;
}

const MISSING_COUNT = MISSING.flat().length;

/** Text drawn on the canvas (a canvas cannot render JSX). */
export const STORY_TEXT = {
  nzbBadge: "NZB",
  nzbFile: `${RELEASE}.nzb`,
  nzbSize: "412 KB, from your indexer",
  releaseFile: `${RELEASE}.mkv`,
  releaseCaption: "the file it stands for",
  releaseJoined: "joined again, plays",
  fileLabel: (index: number) => `${index + 1}  ${FILES[index]}`,
  articleCount: `${ARTICLES} articles, ${FX * FY} in each file`,
  segment: (index: number) => `<segment number="${index + 1}">`,
  cardFooter: `… ${ARTICLES} articles in this example`,
  months: MONTHS,
  gone: `${MISSING_COUNT} articles gone: cannot be joined, stops at 97%`,
} as const;

export function StoryScene() {
  return (
    <ScenePlaceholder
      scene="story"
      label="An NZB file. A block of cubes, the file it stands for, grows out of it, then comes apart into its parts and articles, which scatter. The NZB is a list of them. A downloader joins them again, until articles drop out and the file cannot be joined."
    />
  );
}
