// Bryggen's quay row: one gabled wooden tenement per mapped front, painted and of
// uneven height, gable end to the harbour. The ground floor is set back under a jetty
// so the shops read as a recess; the upper floors carry a grid of small panes.
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { sink } from './bryggen-parts.js';
import {
  HOUSES, SHOP, WATER, INLAND, RIGHT, UP, DOWN, point, facade, litWindow, sideFaces,
} from './bryggen-site.js';

const FAR_MERGE = { pink: 'red', roofDark: 'roof', timber: 'brown' };
export function material(detail, name) {
  return detail === 'far' ? (FAR_MERGE[name] || name) : name;
}

const LEFT = [-RIGHT[0], 0, -RIGHT[2]];
const SHOP_T = 0.82; // ground floor sits back under the jetty; the upper wall stays on the mapped front

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const S = sink();
  const M = (name) => material(detail, name);
  for (const h of HOUSES) house(S, h, near, M);
  sideWindows(S, near, M);
  S.flush(b);
  return b.finish();
}

function house(S, h, near, M) {
  const F = facade(h);
  const body = M(h.body);
  const eave = F.eave;
  const depth = h.depth;
  const shopT = SHOP_T;
  // Walls. The side runs the full jetty so the recess is a pocket, not a hole.
  side(S, body, h, h.u0, 0, depth, 0, eave, LEFT);
  side(S, body, h, h.u1, 0, depth, 0, eave, RIGHT);
  front(S, body, h, h.u0, h.u1, SHOP, eave, 0);
  front(S, body, h, h.u0, h.u1, 0, SHOP, shopT);
  back(S, body, h, h.u0, h.u1, 0, eave, depth);
  // Soffit under the jetty. The side walls already close the ends of the recess.
  S.quad(body, point(h, h.u0, shopT, SHOP), point(h, h.u1, shopT, SHOP), point(h, h.u1, 0, SHOP), point(h, h.u0, 0, SHOP), DOWN);
  gable(S, body, h, eave, 0);
  gable(S, body, h, eave, depth);
  roof(S, M(h.roof), h, eave, -0.22, depth + 0.22);
  barge(S, M('trim'), h, eave);
  fascia(S, M('trim'), h);
  corners(S, M('trim'), h, eave);
  if (near) boards(S, body, h, F);
  if (near) corbels(S, M('timber'), h);
  windows(S, h, F, near, M);
  rear(S, h, F, near, M);
  if (near && h.ridge <= 14 && h.way % 3 === 0) chimney(S, M('brown'), h, eave);
}

function front(S, mat, h, u0, u1, y0, y1, t) {
  S.quad(mat, point(h, u0, t, y0), point(h, u1, t, y0), point(h, u1, t, y1), point(h, u0, t, y1), WATER);
}
function back(S, mat, h, u0, u1, y0, y1, t) {
  S.quad(mat, point(h, u1, t, y0), point(h, u0, t, y0), point(h, u0, t, y1), point(h, u1, t, y1), INLAND);
}
function side(S, mat, h, u, t0, t1, y0, y1, outward) {
  S.quad(mat, point(h, u, t0, y0), point(h, u, t1, y0), point(h, u, t1, y1), point(h, u, t0, y1), outward);
}

function gable(S, mat, h, eave, t) {
  const uc = (h.u0 + h.u1) / 2;
  const peak = h.ridge - 0.22;
  const waterSide = t < h.depth * 0.5;
  const outward = waterSide ? WATER : INLAND;
  const a = point(h, h.u0 + 0.04, t, eave);
  const b = point(h, h.u1 - 0.04, t, eave);
  const c = point(h, uc, t, peak);
  triOut(S, mat, a, b, c, outward);
  // A thin return so the gable is not a paper edge from the side.
  const t2 = t + (waterSide ? 0.08 : -0.08);
  const a2 = point(h, h.u0 + 0.04, t2, eave);
  const b2 = point(h, h.u1 - 0.04, t2, eave);
  const c2 = point(h, uc, t2, peak);
  triOut(S, mat, a2, c2, b2, waterSide ? INLAND : WATER);
}

function triOut(S, mat, a, b, c, outward) {
  const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const ac = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
  const n = [ab[1] * ac[2] - ab[2] * ac[1], ab[2] * ac[0] - ab[0] * ac[2], ab[0] * ac[1] - ab[1] * ac[0]];
  if (n[0] * outward[0] + n[1] * outward[1] + n[2] * outward[2] < 0) S.tri(mat, a, c, b);
  else S.tri(mat, a, b, c);
}

function roof(S, mat, h, eave, t0, t1) {
  const uc = (h.u0 + h.u1) / 2;
  const oh = 0.06;
  slope(S, mat, h, h.u0 - oh, eave + 0.04, uc, h.ridge + 0.1, t0, t1, 0.16);
  slope(S, mat, h, uc, h.ridge + 0.1, h.u1 + oh, eave + 0.04, t0, t1, 0.16);
  // Ridge cap, just clear of both slopes.
  const y0 = h.ridge + 0.08;
  const y1 = h.ridge + 0.16;
  S.quad(mat, point(h, uc - 0.16, t0, y0), point(h, uc + 0.16, t0, y0), point(h, uc + 0.16, t1, y0), point(h, uc - 0.16, t1, y0), UP);
  S.quad(mat, point(h, uc - 0.16, t0, y0), point(h, uc - 0.16, t0, y1), point(h, uc - 0.16, t1, y1), point(h, uc - 0.16, t1, y0), LEFT);
  S.quad(mat, point(h, uc + 0.16, t0, y1), point(h, uc + 0.16, t0, y0), point(h, uc + 0.16, t1, y0), point(h, uc + 0.16, t1, y1), RIGHT);
}

function slope(S, mat, h, uA, yA, uB, yB, t0, t1, thick, lift = 0) {
  const du = uB - uA, dy = yB - yA;
  const L = Math.hypot(du, dy) || 1;
  let pu = -dy / L, py = du / L;
  if (py < 0) { pu = -pu; py = -py; }
  const out = [pu * RIGHT[0], py, pu * RIGHT[2]];
  const inn = [-out[0], -out[1], -out[2]];
  const A = (t, k) => point(h, uA + pu * (k + lift), t, yA + py * (k + lift));
  const B = (t, k) => point(h, uB + pu * (k + lift), t, yB + py * (k + lift));
  S.quad(mat, A(t0, 0), B(t0, 0), B(t1, 0), A(t1, 0), out);
  S.quad(mat, A(t0, -thick), A(t1, -thick), B(t1, -thick), B(t0, -thick), inn);
  // Eave (the A edge) and the two ends. The ridge edge stays open against its twin.
  const eaveOut = [pu * RIGHT[0], 0, pu * RIGHT[2]];
  S.quad(mat, A(t0, 0), A(t1, 0), A(t1, -thick), A(t0, -thick), eaveOut);
  S.quad(mat, A(t0, 0), A(t0, -thick), B(t0, -thick), B(t0, 0), WATER);
  S.quad(mat, A(t1, -thick), A(t1, 0), B(t1, 0), B(t1, -thick), INLAND);
}

function barge(S, mat, h, eave) {
  const uc = (h.u0 + h.u1) / 2;
  // White bargeboards on each rake, in front of the gable and just outside the tile.
  // Lifted clear of the tile so the board does not share the roof plane.
  slope(S, mat, h, h.u0 - 0.12, eave - 0.02, uc - 0.08, h.ridge + 0.02, -0.1, 0.06, 0.05, 0.1);
  slope(S, mat, h, uc + 0.08, h.ridge + 0.02, h.u1 + 0.12, eave - 0.02, -0.1, 0.06, 0.05, 0.1);
}

function corners(S, mat, h, eave) {
  // White corner boards, proud of the window frames.
  const t = -0.16;
  front(S, mat, h, h.u0, h.u0 + 0.07, SHOP, eave, t);
  front(S, mat, h, h.u1 - 0.07, h.u1, SHOP, eave, t);
}

function fascia(S, mat, h) {
  // The beam under the jetty, across the shop front.
  const y0 = SHOP - 0.28, y1 = SHOP - 0.08;
  const t0 = -0.06, t1 = 0.1;
  front(S, mat, h, h.u0, h.u1, y0, y1, t0);
  S.quad(mat, point(h, h.u0, t0, y1), point(h, h.u1, t0, y1), point(h, h.u1, t1, y1), point(h, h.u0, t1, y1), UP);
  S.quad(mat, point(h, h.u0, t1, y0), point(h, h.u1, t1, y0), point(h, h.u1, t0, y0), point(h, h.u0, t0, y0), DOWN);
}

function boards(S, mat, h, F) {
  const bands = [SHOP + 0.06];
  for (const [y0, y1] of F.bands) { bands.push(y0 - 0.14); bands.push(y1 + 0.14); }
  bands.push(F.eave - 0.08);
  // Horizontal weatherboards in the storey bands, 6 cm proud of the wall, not crossing it.
  for (let i = 0; i < bands.length - 1; i += 2) {
    const yLo = bands[i], yHi = bands[i + 1];
    if (yHi - yLo < 0.18) continue;
    const n = Math.max(1, Math.floor((yHi - yLo) / 0.22));
    for (let k = 0; k < n; k++) {
      const y = yLo + ((k + 0.5) / n) * (yHi - yLo);
      board(S, mat, h, h.u0 + 0.1, h.u1 - 0.1, y - 0.04, y + 0.04, -0.06);
    }
  }
}

function board(S, mat, h, u0, u1, y0, y1, t) {
  front(S, mat, h, u0, u1, y0, y1, t);
  S.quad(mat, point(h, u0, t, y1), point(h, u1, t, y1), point(h, u1, t + 0.045, y1), point(h, u0, t + 0.045, y1), UP);
  S.quad(mat, point(h, u0, t + 0.045, y0), point(h, u1, t + 0.045, y0), point(h, u1, t, y0), point(h, u0, t, y0), DOWN);
}

function corbels(S, mat, h) {
  for (let u = h.u0 + 0.55; u <= h.u1 - 0.35; u += 1.5) {
    const y0 = SHOP - 0.78, y1 = SHOP - 0.36;
    const t0 = 0.06, t1 = 0.14;
    const hw = 0.05;
    S.quad(mat, point(h, u - hw, t0, y0), point(h, u + hw, t0, y0), point(h, u + hw, t0, y1), point(h, u - hw, t0, y1), WATER);
    S.quad(mat, point(h, u + hw, t1, y0), point(h, u - hw, t1, y0), point(h, u - hw, t1, y1), point(h, u + hw, t1, y1), INLAND);
    S.quad(mat, point(h, u - hw, t1, y0), point(h, u - hw, t0, y0), point(h, u - hw, t0, y1), point(h, u - hw, t1, y1), LEFT);
    S.quad(mat, point(h, u + hw, t0, y0), point(h, u + hw, t1, y0), point(h, u + hw, t1, y1), point(h, u + hw, t0, y1), RIGHT);
  }
}

function windows(S, h, F, near, M) {
  const trim = M('trim');
  let i = 0;
  F.bands.forEach((band, row) => {
    F.centers.forEach((u) => {
      opening(S, h, u, band[0], band[1], F.winW, 0, litWindow(h.way, i++), near, M, trim, 3);
    });
  });
  F.gables.forEach((g, n) => {
    opening(S, h, (h.u0 + h.u1) / 2, g[0], g[1], g[2], 0, litWindow(h.way, 40 + n), near, M, trim, 2);
  });
  // Shop: a door in one bay, glazed openings in the others, all warm at night.
  F.centers.forEach((u, n) => {
    if (n === F.doorAt) {
      opening(S, h, u, 0.08, 2.32, Math.min(0.76, F.winW * 0.86), SHOP_T, true, near, M, trim, 2);
      return;
    }
    opening(S, h, u, 0.58, 2.42, Math.min(1.15, F.winW + 0.18), SHOP_T, litWindow(h.way, 60 + n), near, M, trim, 2);
  });
  // A pier of timber between the shop openings, on the recessed wall.
  if (near) {
    const posts = [h.u0 + 0.1, h.u1 - 0.1];
    for (let n = 0; n < F.centers.length - 1; n++) posts.push((F.centers[n] + F.centers[n + 1]) / 2);
    for (const u of posts) {
      const t = SHOP_T - 0.16;
      S.quad(M('timber'), point(h, u - 0.055, t, 0.06), point(h, u + 0.055, t, 0.06), point(h, u + 0.055, t, SHOP - 0.36), point(h, u - 0.055, t, SHOP - 0.36), WATER);
    }
  }
}

function rear(S, h, F, near, M) {
  const trim = M('trim');
  const bays = Math.max(2, Math.min(4, F.bays - 2));
  const gap = 0.28;
  const w = Math.min(0.82, (F.width - 0.9) / bays - gap);
  if (w < 0.4) return;
  const span = bays * w + (bays - 1) * gap;
  const uStart = h.u0 + (F.width - span) / 2 + w / 2;
  let i = 0;
  for (const band of F.bands.slice(0, 2)) {
    for (let n = 0; n < bays; n++) {
      rearOpening(S, h, uStart + n * (w + gap), band[0], band[1], w, h.depth, litWindow(h.way, 120 + i++), near, M, trim);
    }
  }
}

function rearOpening(S, h, u, y0, y1, w, tWall, lit, near, M, trim) {
  const pane = M(lit ? 'glow' : 'glass');
  const x0 = u - w / 2, x1 = u + w / 2;
  const tf = tWall + 0.1;
  const tg = tWall + 0.05;
  const e = 0.05;
  back(S, trim, h, x0 - e, x1 + e, y1, y1 + e, tf);
  back(S, trim, h, x0 - e, x1 + e, y0 - e, y0, tf);
  back(S, trim, h, x0 - e, x0, y0, y1, tf);
  back(S, trim, h, x1, x1 + e, y0, y1, tf);
  if (!near) { back(S, pane, h, x0, x1, y0, y1, tg); return; }
  const gw = w / 2, gh = (y1 - y0) / 2;
  for (let c = 0; c < 2; c++) for (let r = 0; r < 2; r++) {
    back(S, pane, h, x0 + c * gw + 0.02, x0 + (c + 1) * gw - 0.02, y0 + r * gh + 0.02, y0 + (r + 1) * gh - 0.02, tg);
  }
  back(S, trim, h, x0 + gw - 0.016, x0 + gw + 0.016, y0, y1, tf);
  back(S, trim, h, x0, x1, y0 + gh - 0.016, y0 + gh + 0.016, tf);
}

function sideWindows(S, near, M) {
  if (!near) return;
  for (const { h, side } of sideFaces()) {
    const F = facade(h);
    const uWall = side < 0 ? h.u0 : h.u1;
    const outward = side < 0 ? LEFT : RIGHT;
    const reach = Math.min(7.6, h.depth - 1.4);
    const w = 0.78;
    let i = 0;
    for (let t = 1.5; t + w < reach; t += w + 0.7) {
      const tc = t + w / 2;
      F.bands.slice(0, 2).forEach((band) => {
        sideOpening(S, h, uWall, outward, tc, band[0], band[1], w, litWindow(h.way, 90 + i++), near, M);
      });
    }
  }
}

function opening(S, h, u, y0, y1, w, tWall, lit, near, M, trim, rows) {
  if (y1 - y0 < 0.4 || w < 0.3) return;
  const pane = M(lit ? 'glow' : 'glass');
  const x0 = u - w / 2, x1 = u + w / 2;
  const tf = tWall - 0.1;
  const tg = tWall - 0.05;
  const e = near ? 0.065 : 0.05;
  // Frame 10 cm proud of the wall. Glass sits 5 cm behind the frame.
  front(S, trim, h, x0 - e, x1 + e, y1, y1 + e, tf);
  front(S, trim, h, x0 - e, x1 + e, y0 - e, y0, tf);
  front(S, trim, h, x0 - e, x0, y0, y1, tf);
  front(S, trim, h, x1, x1 + e, y0, y1, tf);
  if (!near) { front(S, pane, h, x0, x1, y0, y1, tg); return; }
  const cols = w > 0.72 ? 3 : 2;
  const gw = (x1 - x0) / cols, gh = (y1 - y0) / rows;
  for (let c = 0; c < cols; c++) for (let r = 0; r < rows; r++) {
    front(S, pane, h, x0 + c * gw + 0.022, x0 + (c + 1) * gw - 0.022, y0 + r * gh + 0.022, y0 + (r + 1) * gh - 0.022, tg);
  }
  for (let c = 1; c < cols; c++) front(S, trim, h, x0 + c * gw - 0.018, x0 + c * gw + 0.018, y0, y1, tf);
  for (let r = 1; r < rows; r++) front(S, trim, h, x0, x1, y0 + r * gh - 0.016, y0 + r * gh + 0.016, tf);
  const tb = tWall - 0.02;
  S.quad(trim, point(h, x0, tf, y0), point(h, x0, tb, y0), point(h, x0, tb, y1), point(h, x0, tf, y1), RIGHT);
  S.quad(trim, point(h, x1, tb, y0), point(h, x1, tf, y0), point(h, x1, tf, y1), point(h, x1, tb, y1), LEFT);
  S.quad(trim, point(h, x0, tf, y1), point(h, x1, tf, y1), point(h, x1, tb, y1), point(h, x0, tb, y1), DOWN);
  S.quad(trim, point(h, x0, tb, y0), point(h, x1, tb, y0), point(h, x1, tf, y0), point(h, x0, tf, y0), UP);
  const ts = tWall - 0.16;
  S.quad(trim, point(h, x0 - 0.04, ts, y0 - e), point(h, x1 + 0.04, ts, y0 - e), point(h, x1 + 0.04, tf, y0 - e), point(h, x0 - 0.04, tf, y0 - e), DOWN);
}

function sideOpening(S, h, uWall, outward, tc, y0, y1, w, lit, near, M) {
  const sign = outward === LEFT ? -1 : 1;
  const trim = M('trim');
  const pane = M(lit ? 'glow' : 'glass');
  const uF = uWall + sign * 0.1;
  const uG = uWall + sign * 0.05;
  const e = near ? 0.06 : 0.05;
  const t0 = tc - w / 2, t1 = tc + w / 2;
  const face = (mat, ta, tb, ya, yb, u) => {
    S.quad(mat, point(h, u, ta, ya), point(h, u, tb, ya), point(h, u, tb, yb), point(h, u, ta, yb), outward);
  };
  face(trim, t0 - e, t1 + e, y1, y1 + e, uF);
  face(trim, t0 - e, t1 + e, y0 - e, y0, uF);
  face(trim, t0 - e, t0, y0, y1, uF);
  face(trim, t1, t1 + e, y0, y1, uF);
  if (!near) { face(pane, t0, t1, y0, y1, uG); return; }
  const gw = w / 2, gh = (y1 - y0) / 2;
  for (let c = 0; c < 2; c++) for (let r = 0; r < 2; r++) {
    face(pane, t0 + c * gw + 0.02, t0 + (c + 1) * gw - 0.02, y0 + r * gh + 0.02, y0 + (r + 1) * gh - 0.02, uG);
  }
  face(trim, t0 + gw - 0.016, t0 + gw + 0.016, y0, y1, uF);
  face(trim, t0, t1, y0 + gh - 0.016, y0 + gh + 0.016, uF);
}

function chimney(S, mat, h, eave) {
  const mid = (h.u0 + h.u1) / 2;
  const uc = mid + (h.way % 2 ? 0.85 : -0.85);
  const half = (h.u1 - h.u0) / 2;
  const local = h.ridge + 0.1 - (Math.abs(uc - mid) / half) * (h.ridge + 0.1 - (eave + 0.04));
  const t = Math.min(4.2, h.depth * 0.32);
  const base = local - 0.08;
  const top = h.ridge + 0.62;
  const s = 0.32;
  S.quad(mat, point(h, uc - s, t - s, base), point(h, uc + s, t - s, base), point(h, uc + s, t - s, top), point(h, uc - s, t - s, top), WATER);
  S.quad(mat, point(h, uc + s, t + s, base), point(h, uc - s, t + s, base), point(h, uc - s, t + s, top), point(h, uc + s, t + s, top), INLAND);
  S.quad(mat, point(h, uc - s, t + s, base), point(h, uc - s, t - s, base), point(h, uc - s, t - s, top), point(h, uc - s, t + s, top), LEFT);
  S.quad(mat, point(h, uc + s, t - s, base), point(h, uc + s, t + s, base), point(h, uc + s, t + s, top), point(h, uc + s, t - s, top), RIGHT);
  S.quad(mat, point(h, uc - s, t + s, top), point(h, uc - s, t - s, top), point(h, uc + s, t - s, top), point(h, uc + s, t + s, top), UP);
}
