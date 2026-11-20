import { expect, it } from "vitest";
import { availabilityY, monthReadout, seriesOffset, shortName, spreadLabels, monthXs, nearestIndex, runTitle } from "./availability";

const scale = { top: 250, sea: 600 };

it("maps 1.000 to the top, the waterline to the sea, and squeezes what is below", () => {
  expect(availabilityY(1, scale)).toBe(250);
  expect(availabilityY(0.995, scale)).toBeCloseTo(425, 6);
  expect(availabilityY(0.99, scale)).toBeCloseTo(600, 6);
  // 0.98 is one 0.01 below the waterline: 350 * 0.32 px further down.
  expect(availabilityY(0.98, scale)).toBeCloseTo(600 + 350 * 0.32, 6);
});

it("lifts each line by 5 px per line above the last", () => {
  expect([0, 4, 8].map((k) => seriesOffset(k, 9))).toEqual([40, 20, 0]);
  expect(seriesOffset(3, 9, 3)).toBe(15);
});

it("shortens NZB names the way the mockup's labels do", () => {
  expect(shortName("Caminandes.Llamigos.2016.1080p.nzb")).toBe("Caminandes.Llamigos");
  expect(shortName("debian-13.2.0-amd64-DVD-1.nzb")).toBe("debian");
  expect(shortName("Big.Buck.Bunny.2008.2160p.nzb")).toBe("Big.Buck.Bunny");
  expect(shortName("Agent.327.2017.1080p.nzb")).toBe("Agent.327");
});

it("spreads labels at least 17 px apart, top to bottom", () => {
  const out = spreadLabels([{ y: 264 }, { y: 230 }, { y: 247 }, { y: 369 }, { y: 250 }]);
  expect(out.map((l) => l.y)).toEqual([230, 247, 264, 281, 369]);
});

it("reads the 1 Nov run: five lowest values, sunk ones flagged, two complete", () => {
  const series = [
    { nzb: "A.2000.nzb", values: [1, 0.98] },
    { nzb: "B.2000.nzb", values: [1, 0.995] },
    { nzb: "C.2000.nzb", values: [1, 1] },
    { nzb: "D.2000.nzb", values: [1, 0.9995] },
    { nzb: "E.2000.nzb", values: [1, 1] },
    { nzb: "F.2000.nzb", values: [1, 0.989] },
    { nzb: "G.2000.nzb", values: [1, 0.999] },
  ];
  const { rows, complete } = monthReadout(series, 1);
  expect(rows.map((r) => [r.name, r.sunk])).toEqual([
    ["A", true],
    ["F", true],
    ["B", false],
    ["G", false],
    ["D", false],
  ]);
  expect(complete).toBe(2);
  expect(monthReadout(series, 0)).toEqual({ rows: [], complete: 7 });
});

it("places the months evenly and finds the nearest one", () => {
  const xs = monthXs(100, 210, 12);
  expect(xs[0]).toBe(100);
  expect(xs[11]).toBe(210);
  expect(nearestIndex(xs, 0)).toBe(0);
  expect(nearestIndex(xs, 1000)).toBe(11);
  expect(nearestIndex(xs, xs[7] + 4)).toBe(7);
});

it("titles a run with its year", () => {
  expect(runTitle("Dec", 0)).toBe("Run of 1 Dec 2025");
  expect(runTitle("Jul", 7)).toBe("Run of 1 Jul 2026");
});
