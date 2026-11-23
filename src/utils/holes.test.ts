import { expect, it } from "vitest";
import { holesFor } from "./holes";

it("takes the first `gone` cells of the order, so later counts keep earlier holes", () => {
  const order = [4, 1, 9, 2];
  expect([...holesFor(order, 0)]).toEqual([]);
  expect([...holesFor(order, 2)]).toEqual([4, 1]);
  expect([...holesFor(order, 3)]).toEqual(expect.arrayContaining([...holesFor(order, 2)]));
  expect(holesFor(order, 10).size).toBe(4);
});
