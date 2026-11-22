import { describe, expect, it } from "vitest";
import { nzbPages, storyLayout } from "./storyLayout";

describe("storyLayout", () => {
  it("puts the scene right of the text on a 1440×900 screen, as in the mockup", () => {
    const l = storyLayout(1440, 900);
    expect(l.narrow).toBe(false);
    expect(l.regions[0]).toBeNull();
    expect(l.regions[1]?.map((v) => +(v ?? 0).toFixed(6))).toEqual([604.8, 90, 1382.4, 810, +(900 / 33).toFixed(6)]);
    expect(l.regions[2]?.[2]).toBeCloseTo(1382.4 - 330);
    expect(l.card).toMatchObject({ x: 604.8, h: 540 });
    expect(l.card.y).toBeCloseTo(126);
    expect(l.card.w).toBeCloseTo(279.936);
    // Step 5 scatters beside the card.
    expect(l.regions[4]?.[0]).toBeCloseTo(604.8 + 279.936 + 50);
    expect(l.rulerY).toBe(792);
  });

  it("never starts the scene left of 600px on a wide screen", () => {
    expect(storyLayout(1100, 800).regions[1]?.[0]).toBe(600);
  });

  it("stacks the scene above the step cards on a phone", () => {
    const l = storyLayout(390, 844);
    expect(l.narrow).toBe(true);
    expect(l.regions[1]?.slice(0, 4).map((v) => +(v ?? 0).toFixed(6))).toEqual([19.5, 42.2, 374.4, 472.64]);
    expect(l.card.w).toBeCloseTo(351);
    // Step 5 scatters below the card.
    expect(l.regions[4]?.[1]).toBeCloseTo(844 * 0.04 + 844 * 0.24 + 14);
  });
});

describe("nzbPages", () => {
  it("centres the page alone, then puts it small at the foot of the block", () => {
    const { alone, small } = nzbPages(false, [600, 100, 1400, 900], [800, 200, 1200, 700]);
    expect(alone).toEqual({ x: 895, y: 361.4, w: 210, h: 273 });
    expect(small.x).toBe(656);
    expect(small.y).toBeCloseTo(700 - 84 * 1.3 + 10);
    expect(small.w).toBe(84);
  });
});

describe("storyLayout on a short landscape phone", () => {
  const l = storyLayout(844, 390, "side");

  it("puts the card left and the scene right of it, clear of the step text", () => {
    expect(l.mode).toBe("side");
    expect(l.narrow).toBe(true);
    expect(l.regions[1]![0]).toBeGreaterThan(844 * 0.4 + 16);
    expect(l.regions[1]![3]).toBeLessThanOrEqual(390 - 70);
    expect(l.rulerY).toBeLessThan(390 - 20);
  });

  it("scatters step 5 right of the NZB card, which fits its rows", () => {
    expect(l.regions[4]![0]).toBeGreaterThan(l.card.x + l.card.w);
    expect(l.card.h).toBeGreaterThanOrEqual(122);
  });
});
