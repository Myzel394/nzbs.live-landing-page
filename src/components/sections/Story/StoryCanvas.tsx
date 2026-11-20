"use client";

import { useEffect, useEffectEvent, useRef } from "react";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";
import { useStepProgress } from "@/hooks/useStepProgress";
import { fitCanvas } from "@/utils/canvas";
import { clamp, easeInOutCubic as ease } from "@/utils/ease";
import { C30, depthOrder, fitIso, type IsoBox, type Projection, S30, sortByDepth } from "@/utils/isometric";
import { seeded } from "@/utils/rng";
import type { StepProgress } from "@/utils/stepProgress";
import { nzbPages, type Rect, storyLayout, type StoryLayout } from "@/utils/storyLayout";
import styles from "./Story.module.css";

// The cube scene of "Usenet forgets, slowly": one example release, cut into 8 files of 12×6 articles
// (576 in all), with 18 articles that Usenet drops over the year. Scrolling through the eight steps
// scrubs the cubes from one arrangement to the next.

/** Monthly runs, Dec 2025 to Nov 2026, for the month ruler. */
const MONTHS = ["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"] as const;

export const RELEASE = "Tears.of.Steel.2012.2160p";

/** The files of the release, top layer first; the last two are par2 repair data (frost blue). */
export const FILES = ["part01.rar", "part02.rar", "part03.rar", "part04.rar", "part05.rar", "part06.rar", "par2", "vol000+01.par2"] as const;
export const PAR2_FROM = 6;

/** Articles per file as a grid: 12 wide, 6 deep. */
export const FX = 12;
export const FY = 6;
export const ARTICLES = FILES.length * FX * FY;

/** Articles that go missing, as indices within each file's 12×6 grid. 18 in all. */
export const MISSING: readonly (readonly number[])[] = [
  [7, 8, 19, 20],
  [33],
  [50, 51, 52, 62, 63],
  [12],
  [40, 41, 52, 53, 64],
  [],
  [30, 31],
  [],
];

/** Articles that get a Message-ID tag in step 4, and the ones threaded to the NZB card in step 5. */
export const TAGGED = [9, 130, 215, 300, 377, 470] as const;
export const THREADED = [5, 66, 140, 207, 288, 351, 433, 512, 570] as const;

/** A made-up but stable Message-ID for article i (0-based). */
export function messageId(i: number): string {
  const hash = (Math.imul(i + 7, 2654435761) >>> 0).toString(36).slice(0, 6);
  return `part${i + 1}of${ARTICLES}.${hash}@news.example`;
}

export type Cube = {
  layer: number; // file index, 0 = top
  gx: number; // column, 0..FX-1
  gy: number; // row, 0..FY-1
  par2: boolean;
  gone: boolean;
  goneIndex: number; // order in which missing articles turn red, or -1
  rx: number; // scatter position, -1..1
  ry: number; // scatter position, -1..1
  rz: number; // scatter height, 0..1
  lag: number; // stagger delay as a share of a step, 0..0.16
};

/** Every article as a cube, in the mockup's order and with its seeded scatter (seed 7). */
export function buildCubes(): Cube[] {
  const rnd = seeded(7);
  const cubes: Cube[] = [];
  let gone = 0;
  FILES.forEach((_, layer) => {
    for (let k = 0; k < FX * FY; k++) {
      const isGone = MISSING[layer].includes(k);
      cubes.push({
        layer,
        gx: k % FX,
        gy: Math.floor(k / FX),
        par2: layer >= PAR2_FROM,
        gone: isGone,
        goneIndex: isGone ? gone++ : -1,
        rx: rnd() * 2 - 1,
        ry: rnd() * 2 - 1,
        rz: rnd(),
        lag: rnd() * 0.16,
      });
    }
  });
  return cubes;
}

const MISSING_COUNT = MISSING.flat().length;

/** Text drawn on the canvas (a canvas cannot render JSX). */
export const STORY_TEXT = {
  nzbBadge: "NZB",
  nzbFile: `${RELEASE}.nzb`,
  nzbSize: "412 KB, from your indexer",
  releaseFile: `${RELEASE}.mkv`,
  releaseCaption: "the file it stands for",
  releaseJoined: "joined again, plays",
  fileLabel: (index: number) => `${index + 1}  ${FILES[index]}`,
  articleCount: `${ARTICLES} articles, ${FX * FY} in each file`,
  segment: (index: number) => `<segment number="${index + 1}">`,
  cardFooter: `… ${ARTICLES} articles in this example`,
  months: MONTHS,
  gone: `${MISSING_COUNT} articles gone: cannot be joined, stops at 97%`,
} as const;

// ---------------------------------------------------------------------------------------------
// Geometry: where every cube sits in each step, projected once per canvas size.

const CUBES = buildCubes();
const N = CUBES.length;
/** Progress through a step after which every cube has arrived (the tween takes 0.34 after its lag). */
const SETTLED = Math.max(...CUBES.map((c) => c.lag)) + 0.34;

/**
 * Frames that no longer change with scrolling: once every cube has arrived and the overlays have
 * faded in (and, in step 7, the last article has dropped). Returns the step, or -1 while moving.
 */
const stillFrame = (b: number, u: number) => (b === 0 || (u >= Math.max(SETTLED, 0.4) && (b !== 6 || u >= 0.75)) ? b : -1);
const TOP = FILES.length - 1;
const STEPS = 8;
const TAG_TEXT = TAGGED.map((i) => `<${messageId(i)}>`);
const THREAD_TEXT = THREADED.map((i) => `${messageId(i).slice(0, 22)}…`);

/** A cube's place in step 1..7, in cube units (step 0 shows the NZB alone). */
function place(step: number, c: Cube): IsoBox {
  const x = c.gx - FX / 2;
  const y = c.gy - FY / 2;
  const z = TOP - c.layer;
  switch (step) {
    case 1:
      return { x, y, z, s: 1, h: 1 };
    case 2: // exploded into its files
      return { x: x * 1.55, y: y * 1.55, z: z * 4.2, s: 0.8, h: 0.8 };
    case 5:
      return { x, y, z, s: 0.92, h: 0.92 };
    case 7: // joined, with the missing articles fallen below
      return { x, y, z: c.gone ? -5 - ((c.gx * 7 + c.gy * 3) % 6) : z, s: 0.92, h: 0.92 };
    default: // 3, 4, 6: scattered across Usenet
      return { x: c.rx * 22, y: c.ry * 13, z: c.rz * 30, s: 0.8, h: 0.8 };
  }
}

type Palette = readonly [top: string, left: string, right: string];
const PALETTES: readonly Palette[] = [
  ["#E5E9F0", "#8f9bb0", "#b8c2d1"], // article
  ["#a9d6e0", "#5e8e9b", "#82b3c0"], // par2, frost
  ["#e08891", "#8c3a42", "#BF616A"], // missing
];
const ARTICLE = 0;
const PAR2 = 1;
const RED = 2;

type Scene = StoryLayout & {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  /** The mono font family, as resolved from CSS. */
  mono: string;
  /** Each step's end state; step 0 has every cube shrunk to a point on the small NZB page. */
  states: Projection[];
  /** Each state's cubes in painter's order. */
  orders: Uint16Array[];
  /** The faint lamp glow behind each step's cubes, as a CSS background (painted once per step, not per frame). */
  glows: string[];
  /** The NZB page alone (step 1) and small at the foot of the block (step 2). */
  docAlone: Rect;
  docSmall: Rect;
  /** Per-frame scratch: tweened positions and the painter's order. */
  X: Float64Array;
  Y: Float64Array;
  S: Float64Array;
  D: Float64Array;
  order: Uint16Array;
};

/** The CSS switches the steps to phone cards at this width (Story.module.css); the canvas follows it. */
const PHONE_QUERY = "(max-width: 999px)";

function buildScene(ctx: CanvasRenderingContext2D, width: number, height: number, mono: string): Scene {
  const layout = storyLayout(width, height, matchMedia(PHONE_QUERY).matches);
  const states: Projection[] = [];
  for (let k = 1; k < STEPS; k++) {
    states[k] = fitIso(
      CUBES.map((c) => place(k, c)),
      layout.regions[k]!,
    );
  }
  const { alone, small } = nzbPages(layout.narrow, layout.regions[1]!, states[1].box);
  // Step 0: every cube waits, size 0, where the block will grow out of the page.
  states[0] = {
    scale: 0,
    box: [alone.x, alone.y, alone.x + alone.w, alone.y + alone.h],
    X: new Float64Array(N).fill(small.x + small.w / 2),
    Y: new Float64Array(N).fill(small.y + small.h * 0.4),
    s: new Float64Array(N),
    h: new Float64Array(N),
    d: states[1].d,
  };
  const orders = states.map((p) => depthOrder(p.d));
  const glows = states.map(({ box }) => {
    const r = Math.max(box[2] - box[0], box[3] - box[1]) * 0.8;
    const at = `${(box[0] + box[2]) / 2}px ${(box[1] + box[3]) / 2}px`;
    return `radial-gradient(circle ${r}px at ${at}, rgb(235 203 139 / 8%), rgb(235 203 139 / 0%) ${r}px)`;
  });
  return {
    ...layout,
    ctx,
    width,
    height,
    mono,
    states,
    orders,
    glows,
    docAlone: alone,
    docSmall: small,
    X: new Float64Array(N),
    Y: new Float64Array(N),
    S: new Float64Array(N),
    D: new Float64Array(N),
    order: orders[0].slice(),
  };
}

// ---------------------------------------------------------------------------------------------
// Painting

/** One isometric cube: its back-top corner at (X, Y), `s` wide, `h` high. */
function cubeFaces(ctx: CanvasRenderingContext2D, X: number, Y: number, s: number, h: number, c: Palette) {
  const ax = C30 * s;
  const ay = S30 * s;
  ctx.fillStyle = c[0];
  ctx.beginPath();
  ctx.moveTo(X, Y - h);
  ctx.lineTo(X + ax, Y + ay - h);
  ctx.lineTo(X, Y + 2 * ay - h);
  ctx.lineTo(X - ax, Y + ay - h);
  ctx.fill();
  ctx.fillStyle = c[2];
  ctx.beginPath();
  ctx.moveTo(X + ax, Y + ay - h);
  ctx.lineTo(X + ax, Y + ay);
  ctx.lineTo(X, Y + 2 * ay);
  ctx.lineTo(X, Y + 2 * ay - h);
  ctx.fill();
  ctx.fillStyle = c[1];
  ctx.beginPath();
  ctx.moveTo(X - ax, Y + ay - h);
  ctx.lineTo(X, Y + 2 * ay - h);
  ctx.lineTo(X, Y + 2 * ay);
  ctx.lineTo(X - ax, Y + ay);
  ctx.fill();
}

/** The NZB: a page of XML with a folded corner, glowing like a lamp. */
function nzbPage(scene: Scene, d: Rect, text: boolean) {
  const { ctx } = scene;
  const { x, y, w, h } = d;
  const fold = w * 0.2;
  const u = w / 210;
  ctx.save();
  ctx.shadowColor = "rgba(235,203,139,.35)";
  ctx.shadowBlur = 50 * u;
  ctx.fillStyle = "#E5E9F0";
  ctx.beginPath();
  ctx.moveTo(x + 8 * u, y);
  ctx.lineTo(x + w - fold, y);
  ctx.lineTo(x + w, y + fold);
  ctx.lineTo(x + w, y + h - 8 * u);
  ctx.quadraticCurveTo(x + w, y + h, x + w - 8 * u, y + h);
  ctx.lineTo(x + 8 * u, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - 8 * u);
  ctx.lineTo(x, y + 8 * u);
  ctx.quadraticCurveTo(x, y, x + 8 * u, y);
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = "#AEB9C8";
  ctx.beginPath();
  ctx.moveTo(x + w - fold, y);
  ctx.lineTo(x + w - fold, y + fold);
  ctx.lineTo(x + w, y + fold);
  ctx.closePath();
  ctx.fill();
  // XML lines: tags in grey, Message-IDs in amber.
  const lh = 13 * u;
  for (let k = 0, yy = y + fold + 12 * u; yy < y + h - 56 * u; k++, yy += lh) {
    const ind = k === 0 ? 0 : k === 1 ? 10 : 20;
    const len = [0.55, 0.7, 0.45, 0.62, 0.5, 0.66, 0.4, 0.58][k % 8];
    const line = (w - (28 + ind) * u) * len;
    ctx.fillStyle = "#9aa4b5";
    ctx.fillRect(x + (14 + ind) * u, yy, line * 0.45, 4 * u);
    if (k > 1) {
      ctx.fillStyle = "#d2a85a";
      ctx.fillRect(x + (14 + ind) * u + line * 0.5, yy, line * 0.5, 4 * u);
    }
  }
  ctx.fillStyle = "#2E3440";
  ctx.beginPath();
  ctx.roundRect(x + 14 * u, y + h - 44 * u, 62 * u, 30 * u, 7 * u);
  ctx.fill();
  if (!text) return;
  ctx.fillStyle = "#EBCB8B";
  ctx.font = `700 ${15 * u}px ${scene.mono}`;
  ctx.textAlign = "center";
  ctx.fillText(STORY_TEXT.nzbBadge, x + 45 * u, y + h - 24 * u);
  ctx.textAlign = "left";
}

/**
 * Draws the scene at step `b` (0..7), `u` (0..1) of the way through it. Cubes tween from the
 * previous step's state to this one's, each a little late by its own lag; overlays crossfade.
 * Text waits for `text` (the web font being ready).
 */
function paint(scene: Scene, b: number, u: number, text: boolean) {
  const { ctx, width: W, height: H, narrow, states, card, regions } = scene;
  const font = (weight: number, size: number) => `${weight} ${size}px ${scene.mono}`;
  /** Sets the font, smaller if needed so `line` fits across the canvas (long captions on phones). */
  const fitFont = (line: string, weight: number, size: number) => {
    ctx.font = font(weight, size);
    const width = ctx.measureText(line).width;
    if (width > W - 24) ctx.font = font(weight, (size * (W - 24)) / width);
  };
  ctx.clearRect(0, 0, W, H);
  const F = b === 0 ? 1 : ease(clamp(u / 0.4, 0, 1));
  const A = states[Math.max(0, b - 1)];
  const B = states[b];
  const k5 = clamp((u - 0.15) / 0.6, 0, 1);

  // Tween every cube; sort by depth only while some are between states.
  const { X, Y, S, D, order } = scene;
  let settled = true;
  let waiting = true;
  for (let i = 0; i < N; i++) {
    const f = b === 0 ? 1 : ease(clamp((u - CUBES[i].lag) / 0.34, 0, 1));
    if (f < 1) settled = false;
    if (f > 0) waiting = false;
    X[i] = A.X[i] + (B.X[i] - A.X[i]) * f;
    Y[i] = A.Y[i] + (B.Y[i] - A.Y[i]) * f;
    S[i] = A.s[i] + (B.s[i] - A.s[i]) * f;
    D[i] = A.d[i] + (B.d[i] - A.d[i]) * f;
  }
  if (settled) order.set(scene.orders[b]);
  else if (waiting) order.set(scene.orders[Math.max(0, b - 1)]);
  else sortByDepth(order, D);

  const parOn = b > 2 || (b === 2 && F > 0.35);
  for (let n = 0; n < N; n++) {
    const i = order[n];
    const s = S[i];
    if (s < 0.4) continue;
    const c = CUBES[i];
    if (c.gone && b === 7) {
      ctx.globalAlpha = 1;
      ctx.save();
      ctx.shadowColor = "#BF616A";
      ctx.shadowBlur = 16 * F;
      cubeFaces(ctx, X[i], Y[i], s, s, PALETTES[RED]);
      ctx.restore();
      continue;
    }
    let palette = c.par2 && parOn ? PAR2 : ARTICLE;
    let alpha = 1;
    let dy = 0;
    if (c.gone && b === 6) {
      // One by one, month by month, the missing articles turn red, drop and fade.
      const gk = clamp(k5 * MISSING_COUNT - c.goneIndex, 0, 1);
      if (gk > 0) {
        palette = RED;
        dy = gk * 50;
        alpha = 1 - gk * 0.55;
      }
    }
    ctx.globalAlpha = alpha;
    cubeFaces(ctx, X[i], Y[i] + dy, s, s, PALETTES[palette]);
  }
  ctx.globalAlpha = 1;

  /** How visible step k's overlay is: fading in during step k, out during step k + 1. */
  const show = (k: number) => (b === k ? F : 0) + (b - 1 === k ? 1 - F : 0) + (b === 0 && k === 0 ? 1 - F : 0);

  // The NZB: a page of XML, alone first, then small at the foot of the block that grows out of it.
  const aDoc = Math.min(1, show(0) + show(1));
  if (aDoc > 0.01) {
    const k = b === 0 ? 0 : b === 1 ? F : 1;
    const { docAlone: d0, docSmall: d1 } = scene;
    const d = { x: d0.x + (d1.x - d0.x) * k, y: d0.y + (d1.y - d0.y) * k, w: d0.w + (d1.w - d0.w) * k, h: d0.h + (d1.h - d0.h) * k };
    if (b === 1) {
      // A wedge of light from the page to the block.
      const bx = states[1].box;
      const cx = d.x + d.w / 2;
      const cy = d.y + d.h * 0.4;
      ctx.globalAlpha = F * 0.9;
      const lg = ctx.createLinearGradient(cx, cy, (bx[0] + bx[2]) / 2, (bx[1] + bx[3]) / 2);
      lg.addColorStop(0, "rgba(255,236,190,.22)");
      lg.addColorStop(1, "rgba(235,203,139,0)");
      ctx.fillStyle = lg;
      ctx.beginPath();
      ctx.moveTo(cx - 8, cy);
      ctx.lineTo(bx[0], bx[1] + (bx[3] - bx[1]) * 0.2);
      ctx.lineTo(bx[2], bx[3]);
      ctx.lineTo(cx + 8, cy);
      ctx.fill();
    }
    ctx.globalAlpha = aDoc;
    nzbPage(scene, d, text);
    if (text) {
      ctx.globalAlpha = aDoc * (1 - k);
      ctx.textAlign = "center";
      ctx.font = font(500, 13.5);
      ctx.fillStyle = "#ECEFF4";
      ctx.fillText(STORY_TEXT.nzbFile, d.x + d.w / 2, d.y + d.h + 34);
      ctx.fillStyle = "#8a94a8";
      ctx.font = font(400, 12);
      ctx.fillText(STORY_TEXT.nzbSize, d.x + d.w / 2, d.y + d.h + 54);
      ctx.textAlign = "left";
    }
    ctx.globalAlpha = 1;
  }
  if (!text) return;

  // The release under the joined block.
  const aFile = Math.min(1, show(1) + show(5));
  if (aFile > 0.01) {
    const bx = b <= 2 ? states[1].box : states[5].box;
    ctx.globalAlpha = aFile;
    ctx.textAlign = "center";
    ctx.fillStyle = "#ECEFF4";
    ctx.font = font(500, 13.5);
    ctx.fillText(STORY_TEXT.releaseFile, (bx[0] + bx[2]) / 2, bx[3] + 34);
    ctx.fillStyle = "#8a94a8";
    ctx.font = font(400, 12);
    ctx.fillText(b >= 5 ? STORY_TEXT.releaseJoined : STORY_TEXT.releaseCaption, (bx[0] + bx[2]) / 2, bx[3] + 54);
    ctx.textAlign = "left";
  }

  // File labels with leader lines, beside the exploded block (no room on phones).
  const aFiles = show(2);
  if (aFiles > 0.01 && !narrow) {
    ctx.globalAlpha = aFiles;
    ctx.strokeStyle = "rgba(163,171,186,.45)";
    ctx.lineWidth = 1;
    ctx.font = font(400, 12);
    const P = states[2];
    const tx = regions[2]![2] + 30;
    FILES.forEach((_, layer) => {
      const i = layer * FX * FY + FX - 1;
      const x = P.X[i] + P.s[i] * C30;
      const y = P.Y[i] + P.s[i] * S30 - P.h[i] / 2;
      ctx.beginPath();
      ctx.moveTo(x + 6, y);
      ctx.lineTo(tx - 8, y);
      ctx.stroke();
      ctx.fillStyle = layer >= PAR2_FROM ? "#a9d6e0" : "#A3ABBA";
      ctx.fillText(STORY_TEXT.fileLabel(layer), tx, y + 4);
    });
    ctx.fillStyle = "#8a94a8";
    ctx.fillText(STORY_TEXT.articleCount, tx, P.box[3] + 8);
  }

  // Message-ID tags on a few scattered articles.
  const aTags = show(3);
  if (aTags > 0.01) {
    ctx.globalAlpha = aTags;
    ctx.font = font(400, 10.5);
    const P = states[3];
    TAGGED.forEach((i, k) => {
      const tag = TAG_TEXT[k];
      const tw = ctx.measureText(tag).width;
      const tx = Math.min(P.X[i] + P.s[i] + 8, W - tw - 10);
      const ty = P.Y[i] + P.s[i] * 0.5 - P.h[i] * 0.5;
      ctx.fillStyle = "rgba(10,13,18,.88)";
      ctx.fillRect(tx - 5, ty - 11, tw + 10, 17);
      ctx.fillStyle = "#EBCB8B";
      ctx.fillText(tag, tx, ty + 2);
    });
  }

  // The NZB as a card of segments, each threaded to its article.
  const aCard = show(4);
  if (aCard > 0.01) {
    const rows = Math.max(3, Math.min(THREADED.length, Math.floor((card.h - 84) / 38)));
    const P = states[4];
    ctx.globalAlpha = aCard;
    ctx.fillStyle = "rgba(16,21,28,.92)";
    ctx.strokeStyle = "rgba(235,203,139,.4)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(card.x, card.y, card.w, card.h, 14);
    ctx.fill();
    ctx.stroke();
    ctx.font = font(600, 12.5);
    ctx.fillStyle = "#ECEFF4";
    ctx.fillText(STORY_TEXT.nzbFile, card.x + 16, card.y + 28, card.w - 32);
    ctx.font = font(400, 10.5);
    for (let k = 0; k < rows; k++) {
      const ly = card.y + 58 + (k * (card.h - 92)) / rows;
      const i = THREADED[k];
      const tx = P.X[i];
      const ty = P.Y[i] + P.s[i] * S30;
      ctx.fillStyle = "#A3ABBA";
      ctx.fillText(STORY_TEXT.segment(i), card.x + 16, ly);
      ctx.fillStyle = "#EBCB8B";
      ctx.fillText(THREAD_TEXT[k], card.x + 16, ly + 14);
      const sx = narrow ? card.x + card.w * (0.2 + k * 0.1) : card.x + card.w;
      const sy = narrow ? card.y + card.h : ly + 4;
      ctx.strokeStyle = "rgba(235,203,139,.38)";
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.bezierCurveTo(sx + (tx - sx) * 0.5, sy, tx - (tx - sx) * 0.3, ty, tx, ty);
      ctx.stroke();
      ctx.strokeStyle = "rgba(255,236,190,.75)";
      ctx.beginPath();
      ctx.arc(tx, ty, P.s[i] * 1.3 + 3, 0, 7);
      ctx.stroke();
    }
    ctx.fillStyle = "#A3ABBA";
    ctx.fillText(STORY_TEXT.cardFooter, card.x + 16, card.y + card.h - 16);
  }

  // The month ruler while articles drop out.
  const aRuler = show(6);
  if (aRuler > 0.01) {
    ctx.globalAlpha = aRuler;
    const y0 = scene.rulerY;
    const x0 = regions[6]![0];
    const x1 = regions[6]![2];
    const m = b === 6 ? Math.min(11, Math.floor(k5 * 11.99)) : 11;
    ctx.strokeStyle = "rgba(136,192,208,.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y0);
    ctx.stroke();
    ctx.font = font(400, 11);
    ctx.textAlign = "center";
    for (let k = 0; k < 12; k++) {
      const x = x0 + ((x1 - x0) * k) / 11;
      ctx.fillStyle = k <= m ? "#EBCB8B" : "#4C566A";
      ctx.fillRect(x - 1, y0 - 5, 2, 10);
      if (!narrow || k % 2 === 0 || k === m) {
        ctx.fillStyle = k === m ? "#ECEFF4" : "#8a94a8";
        ctx.fillText(MONTHS[k], x, y0 + 22);
      }
    }
    ctx.textAlign = "left";
  }

  // The verdict under the broken block.
  const aGone = show(7);
  if (aGone > 0.01) {
    const bx = states[7].box;
    ctx.globalAlpha = aGone;
    ctx.textAlign = "center";
    fitFont(STORY_TEXT.gone, 500, 13.5);
    ctx.fillStyle = "#ff9aa3";
    ctx.fillText(STORY_TEXT.gone, (bx[0] + bx[2]) / 2, bx[3] + 30);
    ctx.textAlign = "left";
  }
  ctx.globalAlpha = 1;
}

// ---------------------------------------------------------------------------------------------

type Props = {
  /** The scene's text alternative. */
  label: string;
  /** Id of the list of steps that scrolling through drives the scene. */
  stepsId: string;
};

/** The pinned canvas of "Usenet forgets, slowly", scrubbed by scrolling through the steps. */
export function StoryCanvas({ label, stepsId }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const glowShown = useRef("");
  // With reduced motion, or motion paused by the toggle, every step is a still: its end state, no tween.
  const reduced = !useMotionAllowed();
  const scene = useRef<Scene | null>(null);
  const view = useRef<StepProgress>({ step: 0, progress: 0 });
  const fontsReady = useRef(false);

  const painted = useRef(-1);
  const draw = () => {
    const current = scene.current;
    if (!current) return;
    const { step } = view.current;
    const progress = reduced ? 1 : view.current.progress;
    // Scrolling through the still part of a step repaints nothing.
    const background = current.glows[step];
    if (glow.current && glowShown.current !== background) {
      glow.current.style.background = background;
      glowShown.current = background;
    }
    const still = stillFrame(step, progress);
    if (still >= 0 && still === painted.current) return;
    painted.current = still;
    paint(current, step, progress, fontsReady.current);
  };
  const render = useEffectEvent(draw);

  useStepProgress(stepsId, (next) => {
    const prev = view.current;
    view.current = next;
    if (next.step === prev.step && (reduced || next.progress === prev.progress)) return;
    draw();
  });

  // Lay out on mount and whenever the canvas changes size (ResizeObserver reports at most once per frame,
  // and rebuilding is cheap, so there is no stretched stale frame while resizing).
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const mono = getComputedStyle(canvas).fontFamily;
    const build = () => {
      const { width, height } = fitCanvas(canvas, ctx, devicePixelRatio);
      scene.current = buildScene(ctx, width, height, mono);
      painted.current = -1;
      render();
    };
    const observer = new ResizeObserver(build);
    observer.observe(canvas);

    // Draw text only in the real font: the weights the scene uses, from the variable font.
    let live = true;
    Promise.all([400, 500, 600, 700].map((w) => document.fonts.load(`${w} 12px ${mono}`)))
      .catch(() => undefined)
      .then(() => {
        if (!live) return;
        fontsReady.current = true;
        painted.current = -1;
        render();
      });

    return () => {
      live = false;
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    painted.current = -1;
    render();
  }, [reduced]);

  return (
    <>
      <div ref={glow} className={styles.glow} aria-hidden="true" />
      <canvas ref={ref} className={styles.canvas} role="img" aria-label={label} />
    </>
  );
}
