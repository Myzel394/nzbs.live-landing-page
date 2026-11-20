import { expect, it } from "vitest";
import { GRID, HOLE_ORDER, holesFor, RUNS } from "./Timing";

it("loses 1, 5, 13, 27 and 46 of 70 articles, each month keeping last month's holes", () => {
  const size = GRID.cols * GRID.rows;
  expect(size).toBe(70);
  expect(RUNS.map((r) => holesFor(r.gone).size)).toEqual([1, 5, 13, 27, 46]);
  expect(new Set(HOLE_ORDER).size).toBe(HOLE_ORDER.length);
  expect(HOLE_ORDER.every((i) => i >= 0 && i < size)).toBe(true);
  expect([...holesFor(1)]).toEqual([17]); // July: row 2, column 8, as in the mockup
});
