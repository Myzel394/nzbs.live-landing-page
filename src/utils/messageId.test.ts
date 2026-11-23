import { expect, it } from "vitest";
import { messageId } from "./messageId";

it("numbers the part from 1 and is the same every time", () => {
  expect(messageId(0, 576)).toMatch(/^part1of576\.[0-9a-z]{1,6}@news\.example$/);
  expect(messageId(9, 576)).toBe(messageId(9, 576));
  expect(messageId(9, 576)).not.toBe(messageId(10, 576));
});
