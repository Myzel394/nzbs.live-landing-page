import { describe, expect, it } from "vitest";
import { AIM_HOLD, beamAt, createAim, emberLevel, layoutLighthouse } from "./lighthouse";

const options = { moteCount: 320, starSpan: 0.35, tiles: true };

describe("layoutLighthouse", () => {
  const wide = layoutLighthouse(1440, 900, options, false);

  it("places the horizon and lamp like the mockup, and moves them on narrow screens", () => {
    expect(wide.narrow).toBe(false);
    expect(wide.horizon).toBeCloseTo(594);
    expect(wide.lamp).toEqual({ x: 1440 * 0.82, y: 900 * 0.27 });
    const narrow = layoutLighthouse(390, 844, options, true);
    expect(narrow.narrow).toBe(true);
    expect(narrow.horizon).toBeCloseTo(844 * 0.86);
    expect(narrow.lamp.x).toBeCloseTo(390 * 0.86);
    expect(narrow.lamp.y).toBeCloseTo(844 * 0.76);
  });

  it("is deterministic", () => {
    expect(layoutLighthouse(1440, 900, options, false)).toEqual(wide);
  });

  it("lays out about 3000 tiles in 20 rows, a few percent of them missing", () => {
    const total = wide.tileX.length + wide.missing.length;
    expect(total).toBeGreaterThan(2500);
    expect(total).toBeLessThan(3600);
    expect(wide.rows).toHaveLength(20);
    expect(wide.rows.at(-1)?.end).toBe(wide.tileX.length);
    expect(wide.missing.length / total).toBeGreaterThan(0.01);
    expect(wide.missing.length / total).toBeLessThan(0.05);
    expect(wide.rows[19].size).toBeCloseTo(34);
  });

  it("has no sea without tiles", () => {
    const g = layoutLighthouse(1440, 900, { ...options, tiles: false }, false);
    expect(g.rows).toHaveLength(0);
    expect(g.tileX).toHaveLength(0);
    expect(g.missing).toHaveLength(0);
    expect(g.stars).toEqual(wide.stars);
  });
});

describe("beamAt", () => {
  const g = layoutLighthouse(1440, 900, options, false);

  it("sweeps from the lamp out to the left and back every 10 seconds", () => {
    expect(beamAt(0, g, null).x).toBeCloseTo(g.lamp.x);
    expect(beamAt(5, g, null).x).toBeCloseTo(g.width * 0.16);
    expect(beamAt(10, g, null).x).toBeCloseTo(g.lamp.x);
  });

  it("flashes toward the viewer only while turning back", () => {
    expect(beamAt(2.5, g, null).facing).toBeCloseTo(1);
    expect(beamAt(7.5, g, null).facing).toBe(0);
  });

  it("turns onto the aim, keeping the landing point on the sea", () => {
    const aimed = beamAt(2.5, g, { x: 300, y: 10, weight: 1 });
    expect(aimed.x).toBeCloseTo(300);
    expect(aimed.y).toBeCloseTo(g.horizon + 24);
    expect(aimed.facing).toBeCloseTo(0);
    const half = beamAt(2.5, g, { x: 300, y: 700, weight: 0.5 });
    expect(half.x).toBeCloseTo((beamAt(2.5, g, null).x + 300) / 2);
  });
});

describe("createAim", () => {
  it("eases onto the pointer, holds, then eases back instead of snapping", () => {
    const aim = createAim();
    expect(aim.step(0)).toBeNull();
    aim.move(100, 700, 0);
    const early = aim.step(0.1)?.weight ?? 0;
    expect(early).toBeGreaterThan(0);
    expect(early).toBeLessThan(0.2);
    for (let t = 0.2; t < 0.7; t += 0.1) aim.step(t);
    expect(aim.step(0.8)?.weight).toBe(1);
    expect(aim.step(0.9)?.weight).toBe(1);
    // Past the hold time, the weight falls gradually.
    const out: number[] = [];
    for (let t = 1; t < AIM_HOLD + 1.5; t += 0.1) {
      const a = aim.step(t);
      if (t > AIM_HOLD + 0.2) out.push(a?.weight ?? 0);
    }
    expect(out[0]).toBeGreaterThan(0);
    expect(out[0]).toBeLessThan(1);
    expect(out.at(-1)).toBe(0);
    expect(aim.step(10)).toBeNull();
  });

  it("returns as soon as the pointer leaves", () => {
    const aim = createAim();
    aim.move(1, 1, 0);
    for (let t = 0; t < 1; t += 0.1) aim.step(t);
    aim.leave();
    const w1 = aim.step(1.1)?.weight ?? 1;
    expect(w1).toBeLessThan(1);
  });

  it("ignores time jumps and resets", () => {
    const aim = createAim();
    aim.move(1, 1, 0);
    aim.step(0);
    expect(aim.step(50)?.weight ?? 0).toBeLessThan(0.2);
    aim.reset();
    expect(aim.step(51)).toBeNull();
  });
});

describe("emberLevel", () => {
  it("glows while lit and decays with a six second time constant afterwards", () => {
    expect(emberLevel(1, 0)).toBe(1);
    expect(emberLevel(0, 0)).toBeCloseTo(0.8);
    expect(emberLevel(0, 6)).toBeCloseTo(0.8 / Math.E);
    expect(emberLevel(0, 99)).toBeLessThan(0.001);
  });
});
