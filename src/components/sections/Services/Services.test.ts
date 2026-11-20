import { describe, expect, it } from "vitest";
import { radarLayout, SERVICES } from "./Services";

// [name, weight, left %, top %, depth, z-index, sweep degrees] as rendered by the approved mockup.
const MOCKUP: [string, number, number, number, number, number, number][] = [
  ["ntfy", 3, 52.95, 35.07, 0.841, 5, 10.0],
  ["Discord", 3, 64.93, 42.75, 0.882, 7, 61.4],
  ["Telegram", 3, 65.67, 55.89, 0.951, 11, 112.9],
  ["Slack", 3, 54.6, 64.6, 0.997, 14, 164.3],
  ["Email", 3, 40.08, 62.31, 0.985, 14, 215.7],
  ["Signal", 3, 33.02, 50.76, 0.924, 10, 267.1],
  ["Matrix", 3, 38.75, 38.63, 0.86, 6, 318.6],
  ["Gotify", 2, 64.08, 26.37, 0.849, 5, 28.0],
  ["Microsoft Teams", 2, 78.69, 42.18, 0.897, 8, 73.0],
  ["Pushover", 2, 76.49, 62.56, 0.958, 12, 118.0],
  ["Home Assistant", 2, 58.77, 75.59, 0.997, 14, 163.0],
  ["Webhooks", 2, 35.92, 73.63, 0.991, 14, 208.0],
  ["Mattermost", 2, 21.31, 57.82, 0.943, 11, 253.0],
  ["Pushbullet", 2, 23.51, 37.44, 0.882, 7, 298.0],
  ["Google Chat", 2, 41.23, 24.41, 0.843, 5, 343.0],
  ["Rocket.Chat", 1, 46.17, 10.9, 0.84, 5, 355.0],
  ["Zulip", 1, 65.56, 13.29, 0.845, 5, 20.7],
  ["Bark", 1, 81.88, 22.95, 0.865, 6, 46.4],
  ["IFTTT", 1, 91.88, 37.96, 0.895, 8, 72.1],
  ["Join", 1, 93.59, 55.37, 0.931, 10, 97.9],
  ["Lark", 1, 86.66, 71.7, 0.964, 12, 123.6],
  ["MQTT", 1, 72.47, 83.74, 0.989, 14, 149.3],
  ["Notifiarr", 1, 53.83, 89.1, 1.0, 14, 175.0],
  ["Opsgenie", 1, 34.44, 86.71, 0.995, 14, 200.7],
  ["PagerDuty", 1, 18.12, 77.05, 0.975, 13, 226.4],
  ["Signalgrid", 1, 8.12, 62.04, 0.945, 11, 252.1],
  ["Twilio SMS", 1, 6.41, 44.63, 0.909, 9, 277.9],
  ["WeCom", 1, 13.34, 28.3, 0.876, 7, 303.6],
  ["XMPP", 1, 27.53, 16.26, 0.851, 5, 329.3],
];

describe("services", () => {
  it("lists the 29 Shoutrrr services, inner ring first", () => {
    expect(SERVICES).toHaveLength(29);
    expect(new Set(SERVICES.map((s) => s.name)).size).toBe(29);
    const weights = SERVICES.map((s) => s.weight);
    expect(weights).toEqual([...weights].sort((a, b) => b - a));
    expect(weights.filter((w) => w === 3)).toHaveLength(7);
    expect(weights.filter((w) => w === 2)).toHaveLength(8);
  });

  it("has a logo for every service except the seven no permissive icon pack covers", () => {
    expect(SERVICES.filter((s) => !s.icon).map((s) => s.name)).toEqual([
      "Gotify", "Bark", "Join", "Lark", "Notifiarr", "Signalgrid", "WeCom",
    ]);
    for (const s of SERVICES.filter((s) => s.icon)) expect(s.icon, s.name).toBeTypeOf("function");
  });

  it("places every service where the mockup did", () => {
    const items = radarLayout();
    expect(items.map((i) => i.name)).toEqual(MOCKUP.map((m) => m[0]));
    items.forEach((item, k) => {
      const [, weight, left, top, depth, zIndex, sweep] = MOCKUP[k];
      expect(item.weight).toBe(weight);
      expect(item.left).toBeCloseTo(left, 2);
      expect(item.top).toBeCloseTo(top, 2);
      expect(item.depth).toBeCloseTo(depth, 3);
      expect(item.zIndex).toBe(zIndex);
      expect(item.sweepDeg).toBeCloseTo(sweep, 1);
    });
  });
});
