import { expect, it } from "vitest";
import { seeded } from "./rng";

it("matches the mockup's generator (reference values from its JS, seed 7)", () => {
  const r = seeded(7);
  expect([r(), r(), r(), r(), r()]).toEqual([
    0.000054784584815979276, 0.9207645170021637, 0.2892372553652326, 0.210550923464145, 0.7293706618851845,
  ]);
});
