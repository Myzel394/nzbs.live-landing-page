import { describe, expect, it } from "vitest";
import { C30, depthOrder, fitIso, type IsoBox, sortByDepth } from "./isometric";

const unit = (x: number, y: number, z: number): IsoBox => ({ x, y, z, s: 1, h: 1 });

describe("fitIso", () => {
  it("projects like the mockup and centres the set in its region", () => {
    const p = fitIso([unit(0, 0, 0), unit(2, 0, 0), unit(0, 0, 3)], [0, 0, 1000, 1000]);
    // Bounds in cube units: x −C30..3·C30, y −4..2, so height limits the scale.
    expect(p.scale).toBeCloseTo(1000 / 6);
    expect(p.box[1]).toBeCloseTo(0);
    expect(p.box[3]).toBeCloseTo(1000);
    expect((p.box[0] + p.box[2]) / 2).toBeCloseTo(500);
    // Moving 2 along x moves right by 2·cos30° and down by 1, in units of the scale.
    expect(p.X[1] - p.X[0]).toBeCloseTo(2 * C30 * p.scale);
    expect(p.Y[1] - p.Y[0]).toBeCloseTo(p.scale);
    // Up 3 is straight up.
    expect(p.X[2]).toBeCloseTo(p.X[0]);
    expect(p.Y[0] - p.Y[2]).toBeCloseTo(3 * p.scale);
    expect([...p.s]).toEqual([p.scale, p.scale, p.scale]);
    expect([...p.d].map((v) => +v.toFixed(9))).toEqual([0, 2, 3.6]);
  });

  it("never scales above the region's cap", () => {
    expect(fitIso([unit(0, 0, 0)], [0, 0, 1000, 1000, 20]).scale).toBe(20);
  });
});

describe("depth order", () => {
  it("sorts by depth, ties by index, like a stable sort", () => {
    const depth = [3, 1, 2, 1, 0];
    expect([...depthOrder(depth)]).toEqual([4, 1, 3, 2, 0]);
  });

  it("re-sorts a nearly sorted order in place", () => {
    const depth = new Float64Array([0, 1, 2, 3, 4]);
    const order = depthOrder(depth);
    depth[1] = 3.5;
    depth[4] = 0;
    expect(sortByDepth(order, depth)).toBe(order);
    expect([...order]).toEqual([0, 4, 2, 3, 1]);
  });
});
