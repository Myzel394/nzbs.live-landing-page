import { describe, expect, it } from "vitest";
import { ARTICLES, articleId, CUBES, STORY_TEXT, TAGGED } from "./StoryCanvas";

// Reference values come from running the approved mockup's own JS.
describe("story data", () => {
  const cubes = CUBES;

  it("has 576 articles, 18 of them missing, at the mockup's positions", () => {
    expect(ARTICLES).toBe(576);
    expect(cubes).toHaveLength(576);
    expect(cubes.flatMap((c, i) => (c.gone ? [i] : []))).toEqual([
      7, 8, 19, 20, 105, 194, 195, 196, 206, 207, 228, 328, 329, 340, 341, 352, 462, 463,
    ]);
    expect(cubes.filter((c) => c.gone).map((c) => c.goneIndex)).toEqual([...Array(18).keys()]);
    expect(cubes.filter((c) => c.par2)).toHaveLength(144);
  });

  it("scatters cubes exactly like the mockup", () => {
    const pick = (i: number) => {
      const { layer, gx, gy, par2, gone, rx, ry, rz, lag } = cubes[i];
      return { layer, gx, gy, par2, gone, rx, ry, rz, lag };
    };
    expect(pick(0)).toEqual({
      layer: 0, gx: 0, gy: 0, par2: false, gone: false,
      rx: -0.999890430830368, ry: 0.8415290340043273, rz: 0.2892372553652326, lag: 0.0336881477542632,
    });
    expect(pick(300)).toEqual({
      layer: 4, gx: 0, gy: 1, par2: false, gone: false,
      rx: 0.6161109365597883, ry: 0.9765107603634291, rz: 0.6081747140773455, lag: 0.09478711967113759,
    });
    expect(pick(575)).toEqual({
      layer: 7, gx: 11, gy: 5, par2: true, gone: false,
      rx: 0.6057835415032615, ry: -0.5960179546829396, rz: 0.8631178219165271, lag: 0.06739727217117197,
    });
  });

  it("gives the tagged articles the Message-IDs seen in the mockup", () => {
    expect(TAGGED.map(articleId)).toEqual([
      "part10of576.1r43u3@news.example",
      "part131of576.1bmxyn@news.example",
      "part216of576.eghjzy@news.example",
      "part301of576.1gb57b@news.example",
      "part378of576.n36wlc@news.example",
      "part471of576.1kzcfy@news.example",
    ]);
  });

  it("keeps the canvas copy", () => {
    expect(STORY_TEXT.releaseFile).toBe("Tears.of.Steel.2012.2160p.mkv");
    expect(STORY_TEXT.fileLabel(7)).toBe("8  vol000+01.par2");
    expect(STORY_TEXT.articleCount).toBe("576 articles, 72 in each file");
    expect(STORY_TEXT.gone).toBe("18 articles gone: cannot be joined, stops at 97%");
  });
});
