import { seeded } from "./rng";

/** The shape of a release: `files` files of `cols`×`rows` articles each, some of them missing. */
export type Release = {
  files: number;
  cols: number;
  rows: number;
  /** Per file, the missing articles as indices within its grid. */
  missing: readonly (readonly number[])[];
  /** Files from this index on are par2 repair data. */
  par2From: number;
  /** Seed for the scatter. */
  seed: number;
};

export type Cube = {
  layer: number; // file index, 0 = top
  gx: number; // column, 0..cols-1
  gy: number; // row, 0..rows-1
  par2: boolean;
  gone: boolean;
  goneIndex: number; // order in which missing articles turn red, or -1
  rx: number; // scatter position, -1..1
  ry: number; // scatter position, -1..1
  rz: number; // scatter height, 0..1
  lag: number; // stagger delay as a share of a step, 0..0.16
};

/** Every article of `release` as a cube, file by file, row-major, each with its seeded scatter. */
export function buildCubes({ files, cols, rows, missing, par2From, seed }: Release): Cube[] {
  const rnd = seeded(seed);
  const cubes: Cube[] = [];
  let gone = 0;
  for (let layer = 0; layer < files; layer++) {
    for (let k = 0; k < cols * rows; k++) {
      const isGone = missing[layer]?.includes(k) ?? false;
      cubes.push({
        layer,
        gx: k % cols,
        gy: Math.floor(k / cols),
        par2: layer >= par2From,
        gone: isGone,
        goneIndex: isGone ? gone++ : -1,
        rx: rnd() * 2 - 1,
        ry: rnd() * 2 - 1,
        rz: rnd(),
        lag: rnd() * 0.16,
      });
    }
  }
  return cubes;
}
