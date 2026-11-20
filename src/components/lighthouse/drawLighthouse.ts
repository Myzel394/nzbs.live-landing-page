import type { CanvasSize } from "@/utils/canvas";
import { type Aim, beamAt, emberLevel, layoutLighthouse, type LighthouseGeometry } from "@/utils/lighthouse";

/** What differs between the hero's lighthouse and the closing section's. */
export type LighthouseLook = {
  skyTop: string;
  seaBottom: string;
  /** Strength of the warm haze on the horizon around the tower. */
  haze: number;
  hazeRadius: number;
  moteCount: number;
  starSpan: number;
  /** The sea of article tiles (with missing ones as red outlines). */
  tiles: boolean;
  /** The full-width flare and warm wash when the lamp faces the viewer. */
  flare: boolean;
};

const WHITE = ["#8fa3ba", "#b7c6d6", "#e3e8ef", "#c9d0da"];
const DARK = ["#262d38", "#323a47", "#414b5c", "#384150"];
/** The cone is drawn at this fraction of the canvas and scaled up, which is soft by itself. */
const CONE_SCALE = 0.2;
const CONE_LAYERS = [
  [1.9, 0.035],
  [1.5, 0.045],
  [1.15, 0.06],
  [0.85, 0.075],
  [0.55, 0.09],
  [0.3, 0.11],
] as const;

/**
 * The lighthouse scene: stars, a sweeping beam with dust in it, a sea of article tiles and the tower.
 * `layout` after every resize, then `draw` per frame. What cannot change between frames (sky, haze, sea
 * colour) is painted once into a backdrop; tiles outside the beam are filled one path per row.
 */
export function createLighthouseRenderer(look: LighthouseLook) {
  let g: LighthouseGeometry;
  let backdrop: HTMLCanvasElement | null = null;
  /** When each missing tile was last lit by the beam, for its fading ember. */
  let lastLit = new Float32Array(0);
  let litTiles = new Float32Array(0);
  const cone = document.createElement("canvas");
  const coneCtx = cone.getContext("2d");
  // Safari has no canvas filter: there the low-resolution upscale alone does the softening.
  const blurs = !!coneCtx && "filter" in coneCtx;
  const coneScale = blurs ? CONE_SCALE : 0.12;

  function layout({ width, height, dpr }: CanvasSize) {
    g = layoutLighthouse(width, height, look);
    lastLit = new Float32Array(g.missing.length).fill(-99);
    litTiles = new Float32Array(Math.max(3, g.tileX.length * 3));
    cone.width = Math.ceil(width * coneScale);
    cone.height = Math.ceil(height * coneScale);

    backdrop ??= document.createElement("canvas");
    backdrop.width = Math.round(width * dpr);
    backdrop.height = Math.round(height * dpr);
    const ctx = backdrop.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    let gradient = ctx.createLinearGradient(0, 0, 0, g.horizon);
    gradient.addColorStop(0, look.skyTop);
    gradient.addColorStop(0.7, "#171f2a");
    gradient.addColorStop(1, "#243041");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, g.horizon);
    gradient = ctx.createRadialGradient(g.lamp.x, g.horizon, 0, g.lamp.x, g.horizon, width * look.hazeRadius);
    gradient.addColorStop(0, `rgba(235,203,139,${look.haze})`);
    gradient.addColorStop(1, "rgba(235,203,139,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, g.horizon);
    gradient = ctx.createLinearGradient(0, g.horizon, 0, height);
    gradient.addColorStop(0, "#1b2433");
    gradient.addColorStop(1, look.seaBottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, g.horizon, width, height - g.horizon);
  }

  function drawCone(ctx: CanvasRenderingContext2D, beam: ReturnType<typeof beamAt>, time: number) {
    if (!coneCtx) return;
    const { width, height, horizon, lamp, motes } = g;
    const sea = height - horizon;
    coneCtx.setTransform(1, 0, 0, 1, 0, 0);
    coneCtx.clearRect(0, 0, cone.width, cone.height);
    coneCtx.setTransform(coneScale, 0, 0, coneScale, 0, 0);
    if (blurs) coneCtx.filter = "blur(2.5px)";
    coneCtx.globalCompositeOperation = "lighter";
    for (const [k, alpha] of CONE_LAYERS) {
      const gradient = coneCtx.createLinearGradient(lamp.x, lamp.y, beam.x, beam.y);
      gradient.addColorStop(0, `rgba(255,236,190,${alpha * 2.6})`);
      gradient.addColorStop(0.45, `rgba(235,203,139,${alpha})`);
      gradient.addColorStop(1, "rgba(235,203,139,0)");
      coneCtx.fillStyle = gradient;
      coneCtx.beginPath();
      coneCtx.moveTo(lamp.x, lamp.y - 2 * k);
      coneCtx.lineTo(beam.x - beam.width * k, beam.y - sea * 0.1 * k);
      coneCtx.lineTo(beam.x + beam.width * k, beam.y + sea * 0.4 * k);
      coneCtx.lineTo(lamp.x, lamp.y + 2 * k);
      coneCtx.closePath();
      coneCtx.fill();
    }
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    // Upscale only the part of the cone canvas the beam covers: filling the whole screen costs more than all the rest.
    const reach = beam.width * CONE_LAYERS[0][0] + 24;
    const left = Math.max(0, Math.min(lamp.x, beam.x - reach));
    const right = Math.min(width, Math.max(lamp.x, beam.x + reach));
    const top = Math.max(0, Math.min(lamp.y, beam.y - sea * 0.19) - 24);
    const bottom = Math.min(height, Math.max(lamp.y, beam.y + sea * 0.76) + 24);
    const kx = cone.width / width;
    const ky = cone.height / height;
    const sx = Math.floor(left * kx);
    const sy = Math.floor(top * ky);
    const sw = Math.min(cone.width, Math.ceil(right * kx)) - sx;
    const sh = Math.min(cone.height, Math.ceil(bottom * ky)) - sy;
    if (sw > 0 && sh > 0) ctx.drawImage(cone, sx, sy, sw, sh, sx / kx, sy / ky, sw / kx, sh / ky);

    // Dust, only inside the cone.
    const length = Math.hypot(beam.x - lamp.x, beam.y - lamp.y) || 1;
    const dx = (beam.x - lamp.x) / length;
    const dy = (beam.y - lamp.y) / length;
    ctx.fillStyle = "#FFF1D0";
    for (const m of motes) {
      const x = (((m.x - time * m.speed) % width) + width) % width;
      const y = m.y + Math.sin(time * 0.5 + m.phase) * 9;
      const ux = x - lamp.x;
      const uy = y - lamp.y;
      const along = ux * dx + uy * dy;
      if (along < 0 || along > length * 1.15) continue;
      const across = Math.abs(ux * dy - uy * dx);
      const half = 4 + (along / length) * beam.width * 1.1;
      if (across > half) continue;
      ctx.globalAlpha = (1 - across / half) * (1 - along / (length * 1.25)) * 0.95;
      ctx.fillRect(x, y, m.size, m.size);
    }
    ctx.restore();
  }

  function drawSea(ctx: CanvasRenderingContext2D, beam: ReturnType<typeof beamAt>, time: number) {
    const { height, horizon, lamp, narrow, rows, tileX, missing } = g;
    const sea = height - horizon;
    const reachX = beam.width * 1.5 * 3;
    const lit = litTiles;

    // How lit a tile is: a soft pool where the beam lands, a flicker under the tower, a lift when facing us.
    const light = (x: number, y: number, row: (typeof rows)[number]) => {
      const foot = Math.exp(-(((x - beam.x) / (beam.width * 1.5)) ** 2) - (((y - beam.y) / (sea * 0.6)) ** 2));
      const glade = narrow
        ? 0
        : Math.exp(-(((x - lamp.x) / (12 + 46 * row.depth)) ** 2)) *
          (0.3 + 0.25 * Math.sin(time * 2.6 + x * 0.05 + row.index));
      return Math.min(1.1, foot * (0.45 + 0.6 * row.depth) + glade * 0.55 + beam.facing * 0.3);
    };

    for (const row of rows) {
      const { index, size, depth, start, end } = row;
      const tileHeight = size * 0.55;
      const amplitude = 6 * depth;
      const lampReach = (12 + 46 * depth) * 3;
      let count = 0;
      // Tiles far from the beam and the tower all look alike: fill them in one path.
      ctx.fillStyle = "#9DB2C9";
      ctx.globalAlpha = Math.min(1, 0.08 + 0.07 * depth + beam.facing * 0.3 * 0.6);
      ctx.beginPath();
      for (let i = start; i < end; i++) {
        const x = tileX[i];
        const y = row.y + Math.sin(x * 0.011 + time * 1.1 + index * 0.7) * amplitude;
        if (Math.abs(x - beam.x) < reachX || (!narrow && Math.abs(x - lamp.x) < lampReach)) {
          lit[count++] = x;
          lit[count++] = y;
          lit[count++] = light(x, y, row);
        } else {
          ctx.rect(x, y, size, tileHeight);
        }
      }
      ctx.fill();
      for (let i = 0; i < count; i += 3) {
        const level = lit[i + 2];
        if (level > 0.3) {
          ctx.globalAlpha = Math.min(1, 0.1 + level * 0.9);
          ctx.fillStyle = level > 0.7 ? "#FFF3DA" : "#EBD5A6";
        } else {
          ctx.globalAlpha = 0.08 + 0.07 * depth + level * 0.6;
          ctx.fillStyle = "#9DB2C9";
        }
        ctx.fillRect(lit[i], lit[i + 1], size, tileHeight);
      }
    }

    // Missing articles: red outlines that glow when the beam finds them and fade slowly after.
    ctx.strokeStyle = "#BF616A";
    for (let i = 0; i < missing.length; i++) {
      const { x, row } = missing[i];
      const y = row.y + Math.sin(x * 0.011 + time * 1.1 + row.index * 0.7) * 6 * row.depth;
      const level = light(x, y, row);
      if (level > 0.25) lastLit[i] = time;
      const ember = emberLevel(level, time - lastLit[i]);
      if (ember <= 0.03) continue;
      const line = Math.max(1, row.size * 0.09);
      ctx.globalAlpha = Math.min(1, ember * 1.3);
      ctx.lineWidth = line;
      ctx.strokeRect(x, y, row.size, row.size * 0.55);
      ctx.globalAlpha = ember * 0.28;
      ctx.lineWidth = line + 2 + 5 * row.depth;
      ctx.strokeRect(x, y, row.size, row.size * 0.55);
    }
    ctx.globalAlpha = 1;
  }

  function drawTower(ctx: CanvasRenderingContext2D, beam: ReturnType<typeof beamAt>) {
    const { lamp, horizon, width, height } = g;
    const bx = lamp.x;
    const base = horizon + 14;
    const top = lamp.y + 28;
    const rows = 16;
    const rowHeight = (base - top) / rows;
    ctx.fillStyle = "#0c0f13";
    ctx.beginPath();
    ctx.moveTo(bx - 80, base + 30);
    ctx.quadraticCurveTo(bx - 44, base - 12, bx, base - 5);
    ctx.quadraticCurveTo(bx + 50, base - 14, bx + 90, base + 30);
    ctx.fill();
    for (let k = 0; k < rows; k++) {
      const f = k / rows;
      const y = base - 8 - (base - top) * f;
      const half = 23 - 9 * f;
      const cell = (half * 2) / 4;
      const band = Math.floor(k / 3) % 2;
      for (let q = 0; q < 4; q++) {
        ctx.fillStyle = band ? DARK[q] : WHITE[q];
        ctx.fillRect(bx - half + q * cell + 0.7, y - rowHeight + 1.5, cell - 1.4, rowHeight - 1.5);
      }
    }
    ctx.fillStyle = "#1c222b";
    ctx.fillRect(bx - 19, lamp.y + 20, 38, 7);
    ctx.fillRect(bx - 12, lamp.y - 18, 24, 5);
    ctx.fillStyle = "#2E3440";
    ctx.fillRect(bx - 12, lamp.y - 13, 24, 33);

    const radius = 30 + beam.facing * 280;
    const glow = ctx.createRadialGradient(bx, lamp.y + 3, 0, bx, lamp.y + 3, radius);
    glow.addColorStop(0, "rgba(255,244,214,.95)");
    glow.addColorStop(0.22, `rgba(235,203,139,${0.38 + beam.facing * 0.35})`);
    glow.addColorStop(1, "rgba(235,203,139,0)");
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = glow;
    ctx.fillRect(bx - radius, lamp.y + 3 - radius, radius * 2, radius * 2);
    if (look.flare && beam.facing > 0.02) {
      const flare = ctx.createLinearGradient(0, 0, width, 0);
      flare.addColorStop(0, "rgba(235,203,139,0)");
      flare.addColorStop(bx / width, `rgba(255,236,190,${beam.facing * 0.55})`);
      flare.addColorStop(1, "rgba(235,203,139,0)");
      ctx.fillStyle = flare;
      ctx.fillRect(0, lamp.y + 1 - beam.facing * 3, width, 2 + beam.facing * 6);
      ctx.fillStyle = `rgba(235,203,139,${beam.facing * 0.05})`;
      ctx.fillRect(0, 0, width, height);
    }
    ctx.restore();
    const lean = Math.max(-1, Math.min(1, (beam.x - lamp.x) / (width * 0.5)));
    ctx.fillStyle = "#FFF6E0";
    ctx.fillRect(bx - 6 + lean * 4, lamp.y - 9, 12, 22);
  }

  function draw(ctx: CanvasRenderingContext2D, { width, height }: CanvasSize, time: number, aim: Aim | null) {
    if (!g || !backdrop) return;
    const beam = beamAt(time, g, aim);
    ctx.globalAlpha = 1;
    ctx.drawImage(backdrop, 0, 0, width, height);
    ctx.fillStyle = "#D8DEE9";
    for (const star of g.stars) {
      ctx.globalAlpha = star.alpha * (0.6 + 0.4 * Math.sin(time * 0.7 + star.phase));
      ctx.fillRect(star.x, star.y, star.size, star.size);
    }
    ctx.globalAlpha = 1;
    drawCone(ctx, beam, time);
    ctx.globalAlpha = 1;
    drawSea(ctx, beam, time);
    drawTower(ctx, beam);
  }

  return { layout, draw };
}
