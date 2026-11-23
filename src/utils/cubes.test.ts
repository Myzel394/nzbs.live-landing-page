import { expect, it } from "vitest";
import { buildCubes } from "./cubes";

const release = { files: 3, cols: 4, rows: 2, missing: [[1], [], [0, 7]], par2From: 2, seed: 7 };

it("makes a cube per article, file by file, row-major", () => {
  const cubes = buildCubes(release);
  expect(cubes).toHaveLength(24);
  expect(cubes.slice(0, 5).map((c) => [c.layer, c.gx, c.gy])).toEqual([[0, 0, 0], [0, 1, 0], [0, 2, 0], [0, 3, 0], [0, 0, 1]]);
  expect(cubes.filter((c) => c.par2).map((c) => c.layer)).toEqual(Array(8).fill(2));
});

it("numbers the missing articles in order, and nothing else", () => {
  const cubes = buildCubes(release);
  expect(cubes.flatMap((c, i) => (c.gone ? [[i, c.goneIndex]] : []))).toEqual([[1, 0], [16, 1], [23, 2]]);
  expect(cubes.filter((c) => !c.gone).every((c) => c.goneIndex === -1)).toBe(true);
});

it("scatters the same way for the same seed, within range", () => {
  const a = buildCubes(release);
  expect(buildCubes(release)).toEqual(a);
  expect(buildCubes({ ...release, seed: 8 })).not.toEqual(a);
  for (const c of a) {
    expect(Math.abs(c.rx)).toBeLessThanOrEqual(1);
    expect(c.rz).toBeGreaterThanOrEqual(0);
    expect(c.lag).toBeLessThan(0.16);
  }
});
