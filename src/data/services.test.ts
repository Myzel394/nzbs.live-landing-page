import { expect, it } from "vitest";
import { SERVICES } from "./services";

it("lists the 29 Shoutrrr services, inner ring first", () => {
  expect(SERVICES).toHaveLength(29);
  expect(new Set(SERVICES.map((s) => s.name)).size).toBe(29);
  const weights = SERVICES.map((s) => s.weight);
  expect(weights).toEqual([...weights].sort((a, b) => b - a));
  expect(weights.filter((w) => w === 3)).toHaveLength(7);
  expect(weights.filter((w) => w === 2)).toHaveLength(8);
});
