import { expect, it } from "vitest";
import { ALERT_RULE, MONTHS, SERIES, WATERLINE } from "./Uploads";

it("has twelve monthly values for every NZB", () => {
  for (const s of SERIES) expect(s.values).toHaveLength(MONTHS.length);
});

it("sinks Caminandes in July and Spring.2019 in November, and nothing else", () => {
  const firstBelow = (nzb: string) =>
    MONTHS[SERIES.find((s) => s.nzb === nzb)!.values.findIndex((v) => v < WATERLINE)];
  expect(firstBelow("Caminandes.Llamigos.2016.1080p.nzb")).toBe("Jul");
  expect(firstBelow("Spring.2019.2160p.nzb")).toBe("Nov");
  expect(SERIES.filter((s) => s.values.some((v) => v < WATERLINE))).toHaveLength(2);
});

it("states the alert rule at the waterline", () => {
  expect(ALERT_RULE).toBe("nzbs_live_nzb_availability < 0.99");
});
