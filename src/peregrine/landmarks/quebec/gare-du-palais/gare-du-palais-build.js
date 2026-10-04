// The Gare du Palais as blocks: a main block with the tall central hall and its two round turrets, a west wing and a north wing (the concourse toward
// the tracks), each a brick box under a steep copper mansard roof, with stone trim, pedimented dormers and chimneys. All plan numbers come from the
// mapped rings (gare-du-palais-site.js); every height and every detail is read from photographs (docs/3d-quebec-gare-du-palais.md).
import { A, M, RINGS } from './gare-du-palais-site.js';
import { solidOf, clipPolygon, clipSegment } from './gare-du-palais-clip.js';

const { MAIN, WEST_WING, NORTH_WING } = RINGS;
const muv = (i) => M.uv(MAIN[i]);
const bbox = (fr, ring) => {
  const q = ring.map(fr.uv);
  return { u0: Math.min(...q.map((p) => p[0])), u1: Math.max(...q.map((p) => p[0])), v0: Math.min(...q.map((p) => p[1])), v1: Math.max(...q.map((p) => p[1])) };
};

// ---- plan, in the main block's grid (u along the facade, v toward the forecourt) ----
// MAIN ring vertices (OSM order): 3 and 5 are the ends of the central pavilion's front, 4 its middle; 1, 2, 6, 7 are the side fronts; 1 and 7 the outer ends.
export const PAV = { u0: muv(5)[0], u1: muv(3)[0] };
PAV.uc = (PAV.u0 + PAV.u1) / 2; PAV.w = PAV.u1 - PAV.u0;
export const V_OUTLINE = (muv(3)[1] + muv(4)[1] + muv(5)[1]) / 3; // the mapped front of the pavilion (turrets and canopy)
export const V_WALL = V_OUTLINE - 1.8; // the pavilion's wall plane: the two turrets stand in front of it, inside the mapped front
const V_SIDE = (muv(1)[1] + muv(2)[1] + muv(6)[1] + muv(7)[1]) / 4;
const U_LEFT = muv(7)[0], U_RIGHT = muv(1)[0], V_BACK = 1.5;
const ww = bbox(A, WEST_WING), nw = bbox(A, NORTH_WING);
nw.v0 = NORTH_WING.slice(0, 3).reduce((a, p) => a + A.uv(p)[1], 0) / 3; // the mapped north end is a line 1.4 deg off the grid: take its middle

// Heights (m above the forecourt), estimated from the photographs. prof: [inset from the wall, roof height] up to the top; Infinity = the ridge.
export const H = { hallEave: 11.8, hallTop: 19.4, sideEave: 6.7, sideTop: 12.4, wingEave: 3.6, wingRidge: 10.8, finial: 20.4, cone: 17.4 };
export const BLOCKS = {
  hall: { fr: M, u0: PAV.u0, u1: PAV.u1, v0: V_BACK, v1: V_WALL, eave: H.hallEave, prof: [[2.4, 15.6], [6.8, H.hallTop]], plain: true },
  left: { fr: M, u0: U_LEFT, u1: PAV.u0 + 3, v0: V_BACK, v1: V_SIDE, eave: H.sideEave, prof: [[1.9, 10.6], [4.2, H.sideTop]] },
  right: { fr: M, u0: PAV.u1 - 3, u1: U_RIGHT, v0: V_BACK, v1: V_SIDE, eave: H.sideEave, prof: [[1.9, 10.6], [4.2, H.sideTop]] },
  // gable: the wing's ridge axis; its far end (a0) is hipped, its joined end (a1) is a gable running into the main block's roof (clipped, with a valley)
  west: { fr: A, u0: ww.u0, u1: ww.u1, v0: ww.v0, v1: ww.v1, eave: H.wingEave, prof: [[1.9, 7.5], [Infinity, H.wingRidge]], gable: 'u' },
  north: { fr: A, u0: nw.u0, u1: nw.u1, v0: nw.v0, v1: Math.min(nw.v1, 8), eave: H.wingEave, prof: [[1.9, 7.5], [Infinity, H.wingRidge]], gable: 'v' },
};
for (const b of Object.values(BLOCKS)) {
  b.half = Math.min(b.u1 - b.u0, b.v1 - b.v0) / 2;
  b.pts = [[0, b.eave], ...b.prof.map(([d, y]) => [Math.min(d, b.half), y])]; // the roof's cross-section, from the wall inward
}
const contains = (b, x, z) => { const [u, v] = b.fr.uv([x, z]); return u > b.u0 && u < b.u1 && v > b.v0 && v < b.v1; };
const roofH = (b, s) => { const p = b.pts; for (let i = 0; i < p.length - 1; i++) if (s <= p[i + 1][0]) return p[i][1] + (p[i + 1][1] - p[i][1]) * (s - p[i][0]) / ((p[i + 1][0] - p[i][0]) || 1); return p[p.length - 1][1]; };
const sAt = (b, y) => { const p = b.pts; for (let i = 0; i < p.length - 1; i++) if (y <= p[i + 1][1] + 1e-9) return p[i][0] + (p[i + 1][0] - p[i][0]) * (y - p[i][1]) / ((p[i + 1][1] - p[i][1]) || 1); return p[p.length - 1][0] + 0.4; };

// The four walls of a block: o = start point, t = direction along the wall, n = outward normal, L = length, and the conversion to frame coordinates.
function wallsOf(b) {
  const { fr, u0, u1, v0, v1 } = b, [U, V] = [fr.U, fr.V], neg = (a) => [-a[0], -a[1]];
  return {
    v1: { o: fr.at(u0, v1), t: U, n: V, L: u1 - u0, coord: (s) => u0 + s },
    v0: { o: fr.at(u1, v0), t: neg(U), n: neg(V), L: u1 - u0, coord: (s) => u1 - s },
    u1: { o: fr.at(u1, v1), t: neg(V), n: U, L: v1 - v0, coord: (s) => v1 - s },
    u0: { o: fr.at(u0, v0), t: V, n: neg(U), L: v1 - v0, coord: (s) => v0 + s },
  };
}
// The exposed stretches of a wall: [{ a, b, y0 }] where y0 is the height a taller or equal neighbour's roof starts to hide it from (0 = fully exposed).
function exposures(key, w) {
  const b = BLOCKS[key], out = [], n = Math.max(1, Math.round(w.L / 0.25)), step = w.L / n; let cur = null;
  for (let i = 0; i < n; i++) {
    const s = (i + 0.5) * step, x = w.o[0] + w.t[0] * s + w.n[0] * 0.3, z = w.o[1] + w.t[1] * s + w.n[1] * 0.3;
    let y0 = 0, hidden = false;
    for (const [k2, b2] of Object.entries(BLOCKS)) {
      if (k2 === key || !contains(b2, x, z)) continue;
      if (b2.eave >= b.eave - 1e-6) { hidden = true; break; }
      y0 = Math.max(y0, b2.eave);
    }
    const val = hidden ? null : y0;
    if (cur && cur.y0 === val) cur.b = (i + 1) * step; else { cur = { a: i * step, b: (i + 1) * step, y0: val }; out.push(cur); }
  }
  return out.filter((e) => e.y0 !== null);
}

// ---- rows of windows per kind of wall ----
const WING_ROWS = [{ y0: 0.9, y1: 3.0, w: 1.3, pitch: 3.75, shape: 'arch', margin: 1.6 }];
const PART_ROWS = [
  { y0: 1.0, y1: 3.3, w: 1.3, pitch: 2.9, shape: 'arch', margin: 1.2 },
  { y0: 4.45, y1: 6.05, w: 0.8, pitch: 2.9, shape: 'rect', offsets: [-0.6, 0.6], margin: 1.2 },
];

function windows(kit, w, e, rows, near) {
  if (!near) { // far: one dark slot per two windows, a quarter of them lit at night
    let k = 0;
    for (const r of rows) {
      const step = r.pitch * 2, count = Math.floor((e.b - e.a - 2 * r.margin) / step) + 1;
      if (count < 1) continue;
      const start = (e.a + e.b) / 2 - (count - 1) * step / 2;
      for (let i = 0; i < count; i++) { const c = start + i * step; kit.panel(k++ % 4 === 1 ? 'glow' : 'glass', w.o, w.t, w.n, Math.max(e.a + 0.6, c - r.w * 1.1), Math.min(e.b - 0.6, c + r.w * 1.1), r.y0, r.y1, 0.1); }
    }
    return;
  }
  let idx = 0;
  for (const r of rows) {
    const count = Math.floor((e.b - e.a - 2 * r.margin) / r.pitch) + 1;
    if (count < 1) continue;
    const start = (e.a + e.b) / 2 - (count - 1) * r.pitch / 2;
    for (let i = 0; i < count; i++) for (const off of r.offsets || [0]) {
      const c = start + i * r.pitch + off, hw = r.w / 2, lit = (idx++ % 3) === 1, mat = lit ? 'glow' : 'glass';
      kit.slab('stone', w.o, w.t, w.n, c - hw - 0.22, c + hw + 0.22, r.y0 - 0.32, r.y0 - 0.15, 0.2, { top: false });
      if (r.shape === 'arch') {
        kit.arch('stone', w.o, w.t, w.n, c - hw - 0.15, c + hw + 0.15, r.y0 - 0.15, r.y1 - hw, 0.06);
        kit.arch(mat, w.o, w.t, w.n, c - hw, c + hw, r.y0, r.y1 - hw, 0.11);
        kit.panel('stone', w.o, w.t, w.n, c - 0.04, c + 0.04, r.y0, r.y1 - hw, 0.15);
      } else {
        kit.panel('stone', w.o, w.t, w.n, c - hw - 0.14, c + hw + 0.14, r.y0 - 0.14, r.y1 + 0.14, 0.06);
        kit.panel(mat, w.o, w.t, w.n, c - hw, c + hw, r.y0, r.y1, 0.11);
        kit.panel('stone', w.o, w.t, w.n, c - 0.04, c + 0.04, r.y0, r.y1, 0.15);
      }
    }
  }
}

// ---- roofs ----
const ringAt = (b, d) => {
  const { fr, u0, u1, v0, v1 } = b, cu = (u0 + u1) / 2, cv = (v0 + v1) / 2;
  const ua = Math.min(u0 + d, cu), ub = Math.max(u1 - d, cu), va = Math.min(v0 + d, cv), vb = Math.max(v1 - d, cv);
  return [fr.at(ua, va), fr.at(ub, va), fr.at(ub, vb), fr.at(ua, vb)];
};
// Metal cresting along the hips, breaks and ridges: thin strips (0.1 m wide, 0.07 m above the roof; they read as heavy dark lines at 0.2 x 0.14).
const CREST_W = 0.1, CREST_H = 0.15;
// The solids a wing's roof runs into: the three blocks of the main building (the hall and its two side blocks).
const MAIN_SOLIDS = ['hall', 'left', 'right'].map((k) => solidOf(BLOCKS[k]));

function roof(kit, b, near) {
  if (b.gable) return wingRoof(kit, b, near);
  const rings = b.pts.map(([d]) => ringAt(b, d));
  for (let i = 0; i < b.pts.length - 1; i++) kit.loft('copper', rings[i], b.pts[i][1], rings[i + 1], b.pts[i + 1][1], 0.6);
  const [dt, yt] = b.pts[b.pts.length - 1];
  const flat = dt < b.half - 1e-6;
  if (flat) kit.cap('copper', rings[rings.length - 1], yt, true); // a flat top deck (mansard)
  if (!near) return;
  // metal cresting: along the hips and along the break and the top of every slope
  const pt = (k, i) => [rings[i][k][0], b.pts[i][1], rings[i][k][1]];
  for (let i = 0; i < b.pts.length - 1; i++) for (let k = 0; k < 4; k++) kit.bar('metal', pt(k, i), pt(k, i + 1), CREST_W, CREST_H);
  for (let i = 1; i < b.pts.length; i++) for (let k = 0; k < 4; k++) if (i < b.pts.length - 1 || flat || k === 0) kit.bar('metal', pt(k, i), pt((k + 1) % 4, i), CREST_W, CREST_H);
}

// A wing's roof: a steep lower slope and a shallow upper slope to a ridge, hipped at the far end (a0) and a gable at the end that joins the main block (a1).
// The gable's slopes and wall are cut by the main block's solid, so the ridge disappears into the hall or side-block roof along a valley instead of ending
// in a hip pyramid that butts against it.
function wingRoof(kit, b, near) {
  const alongU = b.gable === 'u', fr = b.fr;
  const [A0, A1, C0, C1] = alongU ? [b.u0, b.u1, b.v0, b.v1] : [b.v0, b.v1, b.u0, b.u1];
  const P = (a, c, y) => { const [x, z] = alongU ? fr.at(a, c) : fr.at(c, a); return [x, y, z]; };
  const [d1, y1] = b.pts[1], y2 = b.pts[2][1], yE = b.eave, half = b.half, cm = (C0 + C1) / 2;
  const up = [0, 1, 0], dir = alongU ? fr.U : fr.V;
  const cut = (mat, poly, hint) => { for (const q of clipPolygon(poly, MAIN_SOLIDS)) kit.fan(mat, q, hint); };
  cut('copper', [P(A0, C0, yE), P(A1, C0, yE), P(A1, C0 + d1, y1), P(A0 + d1, C0 + d1, y1)], up); // long slopes, lower and upper, both sides
  cut('copper', [P(A0 + d1, C0 + d1, y1), P(A1, C0 + d1, y1), P(A1, cm, y2), P(A0 + half, cm, y2)], up);
  cut('copper', [P(A0, C1, yE), P(A0 + d1, C1 - d1, y1), P(A1, C1 - d1, y1), P(A1, C1, yE)], up);
  cut('copper', [P(A0 + d1, C1 - d1, y1), P(A0 + half, cm, y2), P(A1, cm, y2), P(A1, C1 - d1, y1)], up);
  cut('copper', [P(A0, C0, yE), P(A0 + d1, C0 + d1, y1), P(A0 + d1, C1 - d1, y1), P(A0, C1, yE)], up); // the hip at the free end
  cut('copper', [P(A0 + d1, C0 + d1, y1), P(A0 + half, cm, y2), P(A0 + d1, C1 - d1, y1)], up);
  cut('brick', [P(A1, C0, yE), P(A1, C1, yE), P(A1, C1 - d1, y1), P(A1, cm, y2), P(A1, C0 + d1, y1)], [dir[0], 0, dir[1]]); // the gable wall above the eave
  if (!near) return;
  const crest = (p, q) => { for (const [s, t] of clipSegment(p, q, MAIN_SOLIDS)) kit.bar('metal', s, t, CREST_W, CREST_H); };
  for (const [c, sg] of [[C0, 1], [C1, -1]]) {
    crest(P(A0, c, yE), P(A0 + d1, c + sg * d1, y1)); // hips, lower and upper
    crest(P(A0 + d1, c + sg * d1, y1), P(A0 + half, cm, y2));
    crest(P(A0 + d1, c + sg * d1, y1), P(A1, c + sg * d1, y1)); // the break along the long side
  }
  crest(P(A0 + d1, C0 + d1, y1), P(A0 + d1, C1 - d1, y1)); // the break across the hip
  crest(P(A0 + half, cm, y2), P(A1, cm, y2)); // the ridge
}

// ---- dormers: a stone (or copper) front on the wall plane, two cheeks and a gabled roof running back into the slope ----
function dormer(kit, b, w, s, spec, near) {
  const { o, t, n } = w, hw = spec.w / 2, y0 = spec.y0 ?? b.eave, y1 = y0 + spec.h1, ya = y0 + spec.hApex, d0 = spec.d0 ?? 0.12;
  const s1 = -sAt(b, y1), sr = -sAt(b, ya), // the slope runs inward: the wall's outward normal points the other way
     P = (u, y, d) => kit.wp(o, t, n, s + u, y, d);
  kit.gable(spec.front, o, t, n, s - hw, s + hw, y0, y1, ya, d0);
  if (near && spec.window) {
    const ww2 = spec.window, top = y1 + 0.1;
    kit.arch(spec.glass || 'glass', o, t, n, s - ww2 / 2, s + ww2 / 2, y0 + 0.5, top - ww2 / 2, d0 + 0.05);
    kit.panel('stone', o, t, n, s - 0.04, s + 0.04, y0 + 0.5, top - ww2 / 2, d0 + 0.09);
  }
  for (const sg of [-1, 1]) {
    kit.tri(spec.cheek || 'copper', P(sg * hw, y0, d0), P(sg * hw, y1, d0), P(sg * hw, y1, s1), [t[0] * sg, 0, t[1] * sg]);
    kit.quad('copper', P(sg * hw, y1, d0), P(0, ya, d0), P(0, ya, sr), P(sg * hw, y1, s1), [t[0] * sg * (ya - y1), hw, t[1] * sg * (ya - y1)]);
  }
  void near;
}
const WALL_DORMER = { w: 3.0, h1: 2.3, hApex: 3.7, front: 'stone', window: 1.0, glass: 'glass' };
const WING_DORMER = { w: 2.3, h1: 2.4, hApex: 4.0, front: 'stone', window: 0.9, glass: 'glass' };
const SMALL_DORMER = { w: 1.1, h1: 1.0, hApex: 1.7, front: 'copper', cheek: 'copper' };

// ---- one block ----
function buildBlock(kit, key, near) {
  const b = BLOCKS[key], walls = wallsOf(b);
  for (const [name, w] of Object.entries(walls)) {
    for (const e of exposures(key, w)) {
      if (e.b - e.a < 0.3) continue;
      kit.panel('brick', w.o, w.t, w.n, e.a, e.b, e.y0, b.eave, 0);
      if (b.plain || e.y0 > 0 || e.b - e.a < 1.2) continue;
      if (near) {
        kit.slab('stone', w.o, w.t, w.n, e.a, e.b, 0, 0.7, 0.15, { bottom: false });
        kit.slab('stone', w.o, w.t, w.n, e.a, e.b, b.eave - 0.45, b.eave, 0.28);
        if (b.eave > 5) kit.slab('stone', w.o, w.t, w.n, e.a, e.b, 3.95, 4.2, 0.12, { bottom: false });
        for (let j = 0, y = 0.76; y + 0.5 < b.eave - 0.45; j++, y += 0.56) { // quoins at convex corners
          const q = j % 2 ? 0.45 : 0.75;
          if (e.a < 0.01) kit.panel('stone', w.o, w.t, w.n, e.a, e.a + q, y, y + 0.5, 0.07);
          if (e.b > w.L - 0.01) kit.panel('stone', w.o, w.t, w.n, e.b - q, e.b, y, y + 0.5, 0.07);
        }
      }
      const rows = b.eave > 5 ? PART_ROWS : WING_ROWS;
      const longWall = (name === 'v1' || name === 'v0') ? b.u1 - b.u0 > b.v1 - b.v0 : b.v1 - b.v0 > b.u1 - b.u0;
      if (b.eave > 5 && name !== 'v1' && name !== 'u0' && name !== 'u1') continue;
      void longWall;
      windows(kit, w, e, rows, near);
    }
  }
  roof(kit, b, near);
  return walls;
}

// Dormers along a wall: positions given as distances s along it.
function dormersOn(kit, key, wallName, positions, spec, near) {
  const b = BLOCKS[key], w = wallsOf(b)[wallName], ex = exposures(key, w).filter((e) => e.y0 === 0);
  for (const s of positions) {
    if (!ex.some((e) => s - spec.w / 2 - 0.3 > e.a && s + spec.w / 2 + 0.3 < e.b)) continue;
    dormer(kit, b, w, s, spec, near);
  }
}
const spread = (L, n, margin = 2.4) => Array.from({ length: n }, (_, i) => margin + (i + 0.5) * (L - 2 * margin) / n);

// ---- round turrets under cones ----
function turret(kit, cx, cz, near) {
  const seg = near ? 12 : 8, ring = (r) => Array.from({ length: seg }, (_, i) => { const a = (i / seg) * Math.PI * 2; return [cx + r * Math.cos(a), cz + r * Math.sin(a)]; });
  const r0 = 1.5, rBelt = 1.66, rDrum = 1.52, rCorn = 1.9, yBelt = 10.7, yBeltTop = 11.15, yDrum = 12.9, yCone = 13.2;
  // a continuous round brick tower from the ground (the photographs show no corbel or pier under the shaft), with the same stone base course as the walls
  kit.loft('brick', ring(r0), 0, ring(r0), yBelt, 0);
  if (near) { kit.loft('stone', ring(r0 + 0.15), 0, ring(r0 + 0.15), 0.7, 0); kit.annulus('stone', ring(r0), ring(r0 + 0.15), 0.7, true); }
  kit.annulus('stone', ring(r0), ring(rBelt), yBelt, false);
  kit.loft('stone', ring(rBelt), yBelt, ring(rBelt), yBeltTop, 0);
  kit.annulus('stone', ring(rDrum), ring(rBelt), yBeltTop, true);
  kit.loft('stone', ring(rDrum), yBeltTop, ring(rDrum), yDrum, 0);
  kit.annulus('stone', ring(rDrum), ring(rCorn), yDrum, false);
  kit.loft('stone', ring(rCorn), yDrum, ring(rCorn), yCone, 0);
  const apex = [cx, H.cone, cz];
  for (let i = 0; i < seg; i++) { const j = (i + 1) % seg, a = ring(rCorn); kit.tri('copper', [a[i][0], yCone, a[i][1]], [a[j][0], yCone, a[j][1]], apex, [a[i][0] - cx, 0.7, a[i][1] - cz]); }
  const pole = [[cx - 0.06, cz - 0.06], [cx + 0.06, cz - 0.06], [cx + 0.06, cz + 0.06], [cx - 0.06, cz + 0.06]];
  kit.prism('metal', pole, H.cone - 0.1, H.cone + 0.95);
  if (!near) return;
  const slit = (r, y0, y1, ang) => { const nn = [Math.cos(ang), Math.sin(ang)], tt = [-nn[1], nn[0]]; kit.panel('glass', [cx + nn[0] * (r + 0.04), cz + nn[1] * (r + 0.04)], tt, nn, -0.14, 0.14, y0, y1, 0); };
  for (let i = 0; i < seg; i++) { // a corbel table of small arches under the cornice
    const a = ((i + 0.5) / seg) * Math.PI * 2, nn = [Math.cos(a), Math.sin(a)], tt = [-nn[1], nn[0]];
    kit.arch('glass', [cx + nn[0] * (rDrum + 0.03), cz + nn[1] * (rDrum + 0.03)], tt, nn, -0.2, 0.2, 12.3, 12.45, 0, 3);
  }
  const toFront = Math.atan2(M.V[1], M.V[0]);
  for (const da of [-0.55, 0.55]) { slit(r0, 8.6, 9.9, toFront + da); slit(rDrum, 11.6, 12.4, toFront + da); }
  slit(r0, 8.6, 9.9, toFront); slit(rDrum, 11.6, 12.4, toFront);
}

// ---- the central pavilion: glass wall, arcature, clock, canopy ----
function pavilion(kit, near) {
  const o = M.at(PAV.uc, V_WALL), t = M.U, n = M.V;
  const S = (u0, u1, y0, y1, d, opt) => kit.slab('stone', o, t, n, u0, u1, y0, y1, d, opt);
  const sq = (u, d, h) => [[-h, -h], [h, -h], [h, h], [-h, h]].map(([a, b]) => [o[0] + t[0] * (u + a) + n[0] * (d + b), o[1] + t[1] * (u + a) + n[1] * (d + b)]);
  // doorway: stone surround, five glazed doors, metal mullions
  S(-5.0, 5.0, 0, 4.5, 0.14, { top: false });
  for (let i = 0; i < 5; i++) kit.panel('glow', o, t, n, (i - 2) * 1.8 - 0.8, (i - 2) * 1.8 + 0.8, 0.12, 3.2, 0.2);
  if (near) { for (let i = 0; i < 6; i++) S((i - 2.5) * 1.8 - 0.06, (i - 2.5) * 1.8 + 0.06, 0.12, 3.4, 0.26, { bottom: false }); S(-4.5, 4.5, 3.2, 3.4, 0.24, { bottom: false }); }
  // canopy: a closed wedge
  const Q = (u, y, d) => kit.wp(o, t, n, u, y, d), cw = 5.0, cd = 2.2;
  kit.quad('copper', Q(-cw, 4.6, 0.14), Q(cw, 4.6, 0.14), Q(cw, 3.95, cd), Q(-cw, 3.95, cd), [0, 1, 0.1]);
  kit.quad('copper', Q(-cw, 3.4, cd), Q(cw, 3.4, cd), Q(cw, 3.95, cd), Q(-cw, 3.95, cd), kit.hint(n));
  kit.quad('metal', Q(-cw, 3.4, 0.14), Q(cw, 3.4, 0.14), Q(cw, 3.4, cd), Q(-cw, 3.4, cd), [0, -1, 0]);
  for (const sg of [-1, 1]) kit.quad('copper', Q(sg * cw, 3.4, 0.14), Q(sg * cw, 4.6, 0.14), Q(sg * cw, 3.95, cd), Q(sg * cw, 3.4, cd), [t[0] * sg, 0, t[1] * sg]);
  kit.panel('sign', o, t, n, -4.3, 4.3, 3.55, 3.8, cd + 0.05);
  for (const sg of [-1, 1]) kit.prism('metal', sq(sg * 4.7, cd - 0.2, 0.12), 0, 3.4, { top: false });
  // glass wall: stone frame, seven tall panes under seven arched transoms (the seven windows of the central bay, Parks Canada), stone mullions
  S(-3.9, 3.9, 4.4, 10.5, 0.35, { top: false });
  const bay = 1.02, hwp = 0.41;
  for (let i = 0; i < 7; i++) {
    const c = (i - 3) * bay;
    kit.panel('glow', o, t, n, c - hwp, c + hwp, 4.7, 8.4, 0.4);
    kit.arch('glow', o, t, n, c - hwp, c + hwp, 8.7, 9.7, 0.4, near ? 4 : 2);
  }
  S(-3.55, 3.55, 8.4, 8.7, 0.48, { bottom: false });
  if (near) for (let i = 0; i < 6; i++) { const m = (i - 2.5) * bay; S(m - 0.11, m + 0.11, 4.6, 10.3, 0.52, { top: false, bottom: false }); }
  // stone base course either side of the doorway
  S(-7.4, -5.0, 0, 0.7, 0.15, { bottom: false }); S(5.0, 7.4, 0, 0.7, 0.15, { bottom: false });
  // arcature band under the roof, between the turrets
  S(-7.4, 7.4, 10.5, 11.6, 0.4);
  if (near) for (let i = 0; i < 9; i++) kit.arch('glass', o, t, n, (i - 4) * 0.85 - 0.22, (i - 4) * 0.85 + 0.22, 10.78, 11.1, 0.45, 3);
  // clock gable: a stone dormer rising through the roof, with the dial; two pinnacles beside it
  const hall = BLOCKS.hall;
  dormer(kit, hall, { o, t, n }, 0, { w: 3.4, y0: 11.6, h1: 2.8, hApex: 4.5, d0: 0.55, front: 'stone' }, near);
  const disc = (r, y, d, m) => kit.fan(m, Array.from({ length: near ? 16 : 10 }, (_, i) => Q(r * Math.cos((i / (near ? 16 : 10)) * Math.PI * 2), y + r * Math.sin((i / (near ? 16 : 10)) * Math.PI * 2), d)), kit.hint(n));
  disc(1.2, 13.0, 0.6, 'metal'); disc(1.05, 13.0, 0.66, 'sign'); // the real dial is eight feet (2.4 m)
  if (near) {
    const hand = (ang, len, wid, d) => { const dir = [Math.sin(ang), Math.cos(ang)], pp = [dir[1], -dir[0]]; kit.quad('metal', Q(-pp[0] * wid, 13.0 - pp[1] * wid, d), Q(pp[0] * wid, 13.0 + pp[1] * wid, d), Q(dir[0] * len + pp[0] * wid * 0.5, 13.0 + dir[1] * len + pp[1] * wid * 0.5, d), Q(dir[0] * len - pp[0] * wid * 0.5, 13.0 + dir[1] * len - pp[1] * wid * 0.5, d), kit.hint(n)); };
    hand(Math.PI / 3, 0.9, 0.05, 0.71); hand(-Math.PI * 0.34, 0.58, 0.065, 0.74);
  }
  if (near) for (const [u, y0] of [[-3.25, 13.05], [3.25, 13.05], [-2.9, 15.1], [2.9, 15.1]]) { // louvred vents on the hall's front slope
    const sd = -(sAt(hall, y0) + 0.05); // the vent stands on the slope, inside the wall plane
    dormer(kit, hall, { o, t, n }, u, { w: 0.7, y0, h1: 0.5, hApex: 0.95, d0: sd, front: 'copper', cheek: 'copper' }, near);
    kit.panel('metal', o, t, n, u - 0.2, u + 0.2, y0 + 0.1, y0 + 0.4, sd + 0.04);
  }
  for (const sg of [-1, 1]) {
    const ring = sq(sg * 2.45, 0.25, 0.2); // the pinnacle stands on the band, within its depth
    kit.prism('stone', ring, 11.6, 14.1, { top: false });
    kit.cone('stone', ring, 14.1, [o[0] + t[0] * sg * 2.45 + n[0] * 0.25, 15.1, o[1] + t[1] * sg * 2.45 + n[1] * 0.25]);
  }
  // finial on the crest of the hall roof
  const mid = M.at(PAV.uc, (hall.v0 + hall.v1) / 2);
  kit.prism('metal', [[mid[0] - 0.08, mid[1] - 0.08], [mid[0] + 0.08, mid[1] - 0.08], [mid[0] + 0.08, mid[1] + 0.08], [mid[0] - 0.08, mid[1] + 0.08]], H.hallTop - 0.1, H.finial);
  for (const sg of [-1, 1]) {
    const p = M.at(PAV.uc + sg * (PAV.w / 2 - 1.55), V_OUTLINE - 1.6);
    turret(kit, p[0], p[1], near);
  }
}

// ---- chimneys: brick stacks with a stone cap, planted in the roofs along the ridges ----
function chimneys(kit, near) {
  const stack = (fr, u, v, ridge, w = 1.0, d = 0.9) => {
    const c = fr.at(u, v), ring = [[-w / 2, -d / 2], [w / 2, -d / 2], [w / 2, d / 2], [-w / 2, d / 2]].map(([a, b]) => { const p = fr.at(a, b); return [c[0] + p[0], c[1] + p[1]]; });
    const cap = ring.map(([x, z], i) => [c[0] + (x - c[0]) * 1.25, c[1] + (z - c[1]) * 1.25]);
    kit.prism('brick', ring, ridge - 1.2, ridge + 2.2, { top: false });
    if (near) { kit.prism('stone', cap, ridge + 2.2, ridge + 2.5, { bottom: true }); } else kit.cap('brick', ring, ridge + 2.2, true);
  };
  const w = BLOCKS.west, n = BLOCKS.north, wcv = (w.v0 + w.v1) / 2, ncu = (n.u0 + n.u1) / 2;
  for (const u of [-46, -30, -14]) stack(A, u, wcv, H.wingRidge);
  for (const v of [-38, -24, -10]) stack(A, ncu, v, H.wingRidge);
  const l = BLOCKS.left, r = BLOCKS.right;
  stack(M, (l.u0 + l.u1) / 2 - 3, (l.v0 + l.v1) / 2 + 2, H.sideTop - 0.5);
  stack(M, (r.u0 + r.u1) / 2 + 3, (r.v0 + r.v1) / 2 + 2, H.sideTop - 0.5);
}

export function buildStation(kit, near) {
  for (const key of Object.keys(BLOCKS)) buildBlock(kit, key, near);
  // dormers on the long roofs
  const wl = wallsOf(BLOCKS.west), nl = wallsOf(BLOCKS.north), lw = wallsOf(BLOCKS.left), rw = wallsOf(BLOCKS.right);
  for (const name of ['v1', 'v0']) dormersOn(kit, 'west', name, spread(wl[name].L, 5), WING_DORMER, near);
  for (const name of ['u0', 'u1']) dormersOn(kit, 'north', name, spread(nl[name].L, 5), WING_DORMER, near);
  // the pedimented dormers and small hooded ones either side of the pavilion
  const dl = (u) => u - BLOCKS.left.u0, dr = (u) => u - BLOCKS.right.u0;
  dormersOn(kit, 'left', 'v1', [dl(PAV.uc - 11.9)], WALL_DORMER, near);
  dormersOn(kit, 'right', 'v1', [dr(PAV.uc + 11.9)], WALL_DORMER, near);
  dormersOn(kit, 'left', 'u0', spread(lw.u0.L, 2, 3.6), WALL_DORMER, near); // the outer ends carry two pedimented dormers each (photo of the west end)
  dormersOn(kit, 'right', 'u1', spread(rw.u1.L, 2, 3.6), WALL_DORMER, near);
  if (near) {
    dormersOn(kit, 'left', 'v1', [dl(PAV.uc - 8.6), dl(PAV.uc - 15.5)], SMALL_DORMER, near);
    dormersOn(kit, 'right', 'v1', [dr(PAV.uc + 8.6), dr(PAV.uc + 15.5)], SMALL_DORMER, near);
  }
  pavilion(kit, near);
  chimneys(kit, near);
}
