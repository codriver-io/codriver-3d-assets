// The castle itself, authored in castle-reference plan coordinates (u, v) (see casa-loma-site.js).
// Every number below that is not a mapped outline is an estimate read off photographs
// (docs/3d-toronto-casa-loma.md, "Dimensions"): storeys are ~4.3 m, the ground floor is the
// local y = 0 terrace/courtyard level.
import * as THREE from 'three';
import { CASTLE_RING, inside } from './casa-loma-site.js';

// Heights (m above y = 0).
export const H = {
  base: 9.0,            // ground + first floor: the mapped outline extruded to here
  gatehouse: 23.4,      // gatehouse tower wall top (merlons and pinnacles above, ~27.4)
  scottishShaft: 20.4,  // round SE tower, shaft top where the corbels start
  scottishTip: 35.2,    // cone apex (finial to ~36.3)
  westShaft: 21.4,      // round W tower shaft top
};

// Upper storeys: stone blocks standing on the base slab, inside the mapped outline.
export const BLOCKS = [
  { id: 'main', u: [-29.7, 5.3], v: [-10.7, 11.9], top: 13.6, roof: { kind: 'hip', rise: 5.8, inset: 1.4 } },
  { id: 'north-east wing', u: [5.4, 20.0], v: [-25.2, -8.9], top: 13.4, roof: { kind: 'ridge', axis: 'v', rise: 6.4, inset: 1.3 } },
  { id: 'centre-east', u: [5.4, 20.0], v: [-8.8, 20.0], top: 13.0, roof: { kind: 'ridge', axis: 'v', rise: 5.6, inset: 1.3 } },
  { id: 'north-east bay', u: [20.0, 22.0], v: [-24.6, -16.6], top: 11.0, roof: null },
  { id: 'north-west wing', u: [-30.2, -21.2], v: [-18.6, -10.7], top: 13.0, roof: { kind: 'hip', rise: 5.0, inset: 1.2 } },
  { id: 'west range', u: [-35.2, -29.8], v: [-5.6, 3.4], top: 12.2, roof: { kind: 'hip', rise: 3.8, inset: 1.0 } },
  { id: 'south-west wing', u: [-29.6, -17.7], v: [12.3, 21.0], top: 12.6, roof: { kind: 'hip', rise: 4.6, inset: 1.2 } },
  { id: 'south bay A', u: [-14.4, -9.1], v: [12.2, 15.5], top: 10.8, roof: null },
  { id: 'south bay B', u: [-3.1, 2.2], v: [12.1, 15.3], top: 10.8, roof: null },
];
// Cross-gables breaking the two long roofs: [centre u, front face v, side (-1 north / +1 south), width, roof length].
export const CROSS_GABLES = [
  { u: -25.0, v: -10.6, dir: -1, w: 6.6, len: 9.0 }, { u: -0.4, v: -10.6, dir: -1, w: 6.2, len: 9.0 },
  { u: -21.5, v: 11.6, dir: 1, w: 6.4, len: 9.0 }, { u: -7.0, v: 11.6, dir: 1, w: 6.4, len: 9.0 },
];
export const GATEHOUSE = { u: [-10.5, -3.8], v: [-16.0, -9.4], top: H.gatehouse };
export const SCOTTISH = { u: 20.1, v: 15.2, r: 5.8 };
export const WEST_TOWER = { u: -30.4, v: 8.0, r: 4.8 };
export const CONSERVATORY = { u: [22.2, 35.2], v: [-6.0, 9.1], apse: { u: 35.2, v: 1.45, r: 4.0 }, dome: { u: 28.7, v: 1.5, r: 5.0 } };
// [u, v, top y] cream chimney stacks on the roof ridges.
export const CHIMNEYS = [
  [-27, -12.2, 21.6], [-23.4, -16.6, 20.8], [-18, -4.5, 22.6], [-9.2, -3.0, 22.2], [-2.2, -6.0, 21.6], [2.2, 6.0, 21.0],
  [-14.5, 8.5, 21.2], [10.0, -22.5, 22.8], [12.4, -14.0, 22.2], [18.2, -20.5, 22.4], [18.4, -12.0, 21.2], [9.0, 4.0, 21.4],
  [-22.2, 17.0, 20.4], [-26.4, 15.0, 20.8], [-33, -1.5, 18.8],
];
// Corner turrets with tile cones: [u, v, radius, wall top, cone apex].
export const TURRETS = [
  [6.3, 20.4, 1.15, 15.6, 20.4], [-29.5, 21.1, 1.0, 14.0, 18.2], [4.7, -9.6, 1.5, 16.2, 22.0], [-29.7, -18.3, 1.2, 15.4, 20.0], [20.8, -24.2, 1.3, 15.6, 20.6],
];

/** Plan ring moved `d` metres inward (mitred at the corners); the ring may run either way round. */
function insetRing(ring, d) {
  let area = 0; for (let i = 0; i < ring.length; i++) { const p = ring[i], q = ring[(i + 1) % ring.length]; area += p[0] * q[1] - q[0] * p[1]; }
  const sg = Math.sign(area) || 1, n = ring.length;
  const edge = (a, b) => { const du = b[0] - a[0], dv = b[1] - a[1], L = Math.hypot(du, dv) || 1; return [-sg * dv / L, sg * du / L]; }; // inward normal
  return ring.map((p, i) => {
    const n1 = edge(ring[(i + n - 1) % n], p), n2 = edge(p, ring[(i + 1) % n]), k = d / (1 + n1[0] * n2[0] + n1[1] * n2[1]);
    return [p[0] + (n1[0] + n2[0]) * k, p[1] + (n1[1] + n2[1]) * k];
  });
}

const inRect = (r, u, v) => u >= r.u[0] && u <= r.u[1] && v >= r.v[0] && v <= r.v[1];
const tone = (near, a, b) => (near ? a : b);

export function buildCastle(k) {
  const { near } = k;
  const rects = [...BLOCKS, GATEHOUSE];
  // Is (u, v) at height y inside a taller part (so a wall face there is buried, not exposed)?
  const towers = (u, v) => [SCOTTISH, WEST_TOWER].some((t) => Math.hypot(u - t.u, v - t.v) < t.r + 0.3);
  const buried = (u, v, y) => rects.some((b) => inRect(b, u, v) && (b.top ?? 99) > y) || towers(u, v);
  // cross-gables also bury the parapet merlons in front of them
  const gableRects = CROSS_GABLES.map((g) => ({ u: [g.u - g.w / 2 - 0.2, g.u + g.w / 2 + 0.2], v: g.dir < 0 ? [g.v - 1.6, g.v + 1.0] : [g.v - 1.0, g.v + 1.6], top: 99 }));
  const buriedM = (u, v, y) => buried(u, v, y) || gableRects.some((b) => inRect(b, u, v));

  // -- 1. The mapped outline, extruded: this is the exact footprint, so no provider extrusion peeks out.
  k.poly('rubble', CASTLE_RING, -1.6, 1.4, { top: false }); // the stone course stands on it with the same ring
  k.poly('stone', CASTLE_RING, 1.4, H.base);
  k.poly('lead', insetRing(CASTLE_RING, 0.15), H.base, H.base + 0.12); // inset: its edge shares no plane with the stone below

  // -- 2. Upper storeys, cornices, merlons, roofs.
  for (const b of BLOCKS) {
    const [u0, u1] = b.u, [v0, v1] = b.v, w = u1 - u0, d = v1 - v0, cu = (u0 + u1) / 2, cv = (v0 + v1) / 2;
    k.box('stone', cu, H.base - 0.1, cv, w, b.top - H.base + 0.1, d); // sunk 10 cm into the base: its underside shares no plane with the base roof
    k.box('trim', cu, b.top - 0.9, cv, w + 0.5, 0.42, d + 0.5); // cornice / corbel table
    k.box('trim', cu, H.base - 0.15, cv, w + 0.36, 0.36, d + 0.36); // string course on the base slab
    if (near) parapet(k, b, buriedM);
    if (!b.roof) { k.box('lead', cu, b.top - 0.1, cv, w - 0.3, 0.24, d - 0.3); continue; } // lead plates sit 10 cm into the block top
    const r = b.roof, i = r.inset;
    if (r.kind === 'hip') k.hip('roof', u0 + i, u1 - i, v0 + i, v1 - i, b.top, r.rise);
    else {
      k.ridge('roof', u0 + i, u1 - i, v0 + i, v1 - i, b.top, r.rise, r.axis);
      k.box('lead', cu, b.top - 0.1, cv, w - 0.3, 0.24, d - 0.3);
    }
  }

  crossGables(k);
  ringDressing(k);
  gatehouse(k);
  scottishTower(k);
  westTower(k);
  conservatory(k);
  chimneys(k);
  turrets(k);
  stepGables(k);
  if (near) { windows(k, buried); loggiaAndBay(k); }
}

// Merlons along the parapet of one block, skipping runs buried against a taller neighbour.
function parapet(k, b, buried) {
  const [u0, u1] = b.u, [v0, v1] = b.v, y = b.top;
  const run = (ua, va, ub, vb, nu, nv) => {
    // split the edge into 2 m pieces and keep those not standing against a taller part
    const len = Math.hypot(ub - ua, vb - va), n = Math.max(1, Math.round(len / 2.1));
    for (let i = 0; i < n; i++) {
      const t0 = i / n, t1 = (i + 1) / n, mu = ua + (ub - ua) * (t0 + t1) / 2, mv = va + (vb - va) * (t0 + t1) / 2;
      if (buried(mu + nu * 0.7, mv + nv * 0.7, y - 0.5)) continue;
      k.merlons('trim', ua + (ub - ua) * t0, va + (vb - va) * t0, ua + (ub - ua) * t1, va + (vb - va) * t1, y, { mw: 1.05, gap: 1.0 });
    }
  };
  run(u0, v0, u1, v0, 0, -1); run(u0, v1, u1, v1, 0, 1); run(u0, v0, u0, v1, -1, 0); run(u1, v0, u1, v1, 1, 0);
}

function gatehouse(k) {
  const { near } = k, [u0, u1] = GATEHOUSE.u, [v0, v1] = GATEHOUSE.v, w = u1 - u0, d = v1 - v0, cu = (u0 + u1) / 2, cv = (v0 + v1) / 2;
  k.box('stone', cu, H.base - 0.1, cv, w, H.gatehouse - H.base + 0.1, d);
  // corbelled crown: stepped machicolation table, parapet, battlement, corner pinnacles
  k.box('trim', cu, H.gatehouse - 1.5, cv, w + 0.7, 0.5, d + 0.7);
  k.box('trim', cu, H.gatehouse - 1.0, cv, w + 1.1, 0.5, d + 1.1);
  k.box('stone', cu, H.gatehouse - 0.5, cv, w + 0.9, 1.6, d + 0.9);
  for (const y of [12.4, 17.6]) k.box('trim', cu, y, cv, w + 0.4, 0.3, d + 0.4); // string courses round the shaft
  k.box('trim', cu, H.gatehouse + 1.1, cv, w + 1.1, 0.3, d + 1.1);
  if (near) {
    k.merlons('trim', u0 - 0.45, v0 - 0.45, u1 + 0.45, v0 - 0.45, H.gatehouse + 1.4, { mw: 1.2, gap: 0.95, h: 1.0 });
    k.merlons('trim', u0 - 0.45, v1 + 0.45, u1 + 0.45, v1 + 0.45, H.gatehouse + 1.4, { mw: 1.2, gap: 0.95, h: 1.0 });
    k.merlons('trim', u0 - 0.45, v0 - 0.45, u0 - 0.45, v1 + 0.45, H.gatehouse + 1.4, { mw: 1.2, gap: 0.95, h: 1.0 });
    k.merlons('trim', u1 + 0.45, v0 - 0.45, u1 + 0.45, v1 + 0.45, H.gatehouse + 1.4, { mw: 1.2, gap: 0.95, h: 1.0 });
  } else k.box('trim', cu, H.gatehouse + 1.4, cv, w + 1.0, 0.9, d + 1.0);
  for (const [pu, pv] of [[u0 - 0.35, v0 - 0.35], [u1 + 0.35, v0 - 0.35], [u0 - 0.35, v1 + 0.35], [u1 + 0.35, v1 + 0.35], [cu, v0 - 0.45]]) k.pinnacle('trim', pu, pv, H.gatehouse + 1.4, near ? 2.6 : 2.2, 0.42);

  // porte-cochere on the north front: pointed arch, cream surround, plaque, flanking corbelled turrets, crest
  const front = -21.15, ac = cu;
  k.box('trim', cu, H.base - 0.05, (front + v0) / 2, w + 0.2, 0.55, v0 - front + 0.2); // portal roof edge / balustrade base
  if (near) {
    k.archFrame('trim', ac, front - 0.02, 0.0, 3.5, 3.2, 0.5, Math.PI, 0.4);
    k.arch('glass', ac, front - 0.05, 0.0, 3.5, 3.2, Math.PI, 0.2);
    k.archFrame('trim', ac, front - 0.02, 3.0, 6.2, 3.4, 0.35, Math.PI, 0.25); // drip-mould over the arch
    k.merlons('trim', u0 + 0.2, front + 0.25, u1 - 0.2, front + 0.25, H.base + 0.3, { mw: 0.9, gap: 0.7, h: 0.8, thick: 0.6 });
    k.box('trim', ac, H.base + 0.3, front + 0.4, 1.9, 2.6, 0.7); // stepped crest with the plaque
    k.box('glass', ac, H.base + 0.9, front + 0.02, 1.0, 1.3, 0.12);
  } else k.box('glass', ac, 0.0, front - 0.02, 3.4, 5.2, 0.2);
  for (const tu of [u0 + 0.35, u1 - 0.35]) {
    k.cyl('trim', tu, front + 0.35, 4.0, 5.6, 0.55, 1.45, tone(near, 12, 6)); // corbel cone
    k.cyl('stone', tu, front + 0.35, 5.6, H.base + 0.9, 1.45, 1.45, tone(near, 12, 6));
    k.cyl('trim', tu, front + 0.35, H.base + 0.9, H.base + 1.3, 1.65, 1.65, tone(near, 12, 6));
  }
  if (near) {
    // oriel window box on the tower's north face, and a slit window
    k.box('trim', cu, 14.6, v0 - 0.45, 4.3, 0.5, 1.0); k.box('trim', cu, 15.1, v0 - 0.45, 4.6, 2.5, 0.9);
    k.win(cu - 1.0, v0 - 0.92, 15.5, Math.PI, 1.0, 1.5, { glass: 'glow' }); k.win(cu + 1.0, v0 - 0.92, 15.5, Math.PI, 1.0, 1.5, { glass: 'glow' });
    k.win(cu, v0 - 0.02, 11.0, Math.PI, 0.55, 1.0, {});
    k.box('trim', cu, 9.9, v0 - 0.12, 1.5, 1.6, 0.3); k.box('copper', cu, 10.2, v0 - 0.3, 1.0, 1.0, 0.08); // carved arms over the hood-mould
    k.win(cu, v0 - 0.02, 18.6, Math.PI, 0.8, 1.6, {});
  }
}

function scottishTower(k) {
  const { near } = k, { u, v, r } = SCOTTISH, n = tone(near, 32, 12);
  k.cyl('stone', u, v, H.base, H.scottishShaft, r, r, n, true);
  // The crown is SQUARE-on-round (Commons "C L 03 - Torre principal", "C L 22"): the round shaft is corbelled out
  // to a square, machicolated, battlemented parapet (corner pinnacles), inside which a tile skirt rises to a smaller round drum.
  const half = 5.2, yp = H.scottishShaft;
  k.cyl('trim', u, v, yp, yp + 1.0, r, r + 0.7, n); // round-to-square corbelling
  k.box('trim', u, yp + 0.7, v, 2 * half + 0.6, 0.5, 2 * half + 0.6);
  k.box('trim', u, yp + 1.2, v, 2 * half + 1.0, 0.45, 2 * half + 1.0);
  k.box('stone', u, yp + 1.65, v, 2 * half + 0.5, 1.55, 2 * half + 0.5);
  k.box('trim', u, yp + 3.2, v, 2 * half + 0.9, 0.3, 2 * half + 0.9);
  if (near) {
    for (const s of [-1, 1]) for (let i = -2; i <= 2; i++) {
      k.box('trim', u + i * 2.1, yp + 0.15, v + s * (half + 0.55), 0.55, 0.7, 0.55); // machicolation brackets
      k.box('trim', u + s * (half + 0.55), yp + 0.15, v + i * 2.1, 0.55, 0.7, 0.55);
    }
    const edge = half + 0.45;
    k.merlons('trim', u - edge, v - edge, u + edge, v - edge, yp + 3.5, { mw: 1.3, gap: 0.9, h: 1.0, thick: 0.7 });
    k.merlons('trim', u - edge, v + edge, u + edge, v + edge, yp + 3.5, { mw: 1.3, gap: 0.9, h: 1.0, thick: 0.7 });
    k.merlons('trim', u - edge, v - edge, u - edge, v + edge, yp + 3.5, { mw: 1.3, gap: 0.9, h: 1.0, thick: 0.7 });
    k.merlons('trim', u + edge, v - edge, u + edge, v + edge, yp + 3.5, { mw: 1.3, gap: 0.9, h: 1.0, thick: 0.7 });
  } else k.box('trim', u, yp + 3.5, v, 2 * half + 0.6, 0.9, 2 * half + 0.6);
  for (const [du, dv] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) k.pinnacle('trim', u + du * (half + 0.3), v + dv * (half + 0.3), yp + 3.5, near ? 2.2 : 1.9, 0.4);
  k.cyl('roof', u, v, yp + 3.3, yp + 5.4, half - 0.6, 4.05, tone(near, 32, 12), true); // tile skirt round the upper drum
  // upper stage: slimmer drum, its own corbelled crown and the tall tile cone
  const r2 = 3.9, y2 = H.scottishShaft + 3.25, yc = y2 + 3.95; // yc: where the upper drum's corbel starts
  k.cyl('stone', u, v, y2, yc, r2, r2, tone(near, 24, 10), true);
  k.cyl('trim', u, v, yc, yc + 1.0, r2, r2 + 0.65, tone(near, 24, 10));
  k.cyl('stone', u, v, yc + 1.0, yc + 1.8, r2 + 0.65, r2 + 0.65, tone(near, 24, 10));
  const ye = yc + 1.8;
  if (near) k.merlonRing('trim', u, v, ye, r2 + 0.65, { count: 12, mw: 1.15, h: 0.8, thick: 0.6 });
  k.cyl('roof', u, v, ye + 0.9, H.scottishTip - 0.25, r2 + 0.95, 0.26, tone(near, 32, 12), true);
  k.cyl('copper', u, v, H.scottishTip - 1.1, H.scottishTip + 0.55, 0.22, 0.08, 6);
  k.box('copper', u, H.scottishTip + 0.5, v, 0.08, 1.15, 0.08);
  if (near) {
    for (const [a, y, hh] of [[0.7, 12.0, 2.2], [2.4, 15.0, 1.6], [4.1, 17.4, 1.3], [5.5, 13.0, 2.0]]) k.win(u + Math.cos(a) * (r + 0.02), v + Math.sin(a) * (r + 0.02), y, Math.PI / 2 - a, 1.0, hh);
    for (const a of [0.4, 1.9, 3.5, 5.0]) k.win(u + Math.cos(a) * (r2 + 0.02), v + Math.sin(a) * (r2 + 0.02), y2 + 2.3, Math.PI / 2 - a, 0.7, 1.3);
  }
}

function westTower(k) {
  const { near } = k, { u, v, r } = WEST_TOWER, n = tone(near, 28, 12);
  k.cyl('stone', u, v, H.base, H.westShaft, r, r, n, true);
  k.cyl('trim', u, v, H.westShaft, H.westShaft + 1.3, r, r + 0.85, n);
  k.cyl('stone', u, v, H.westShaft + 1.3, H.westShaft + 2.6, r + 0.85, r + 0.85, n);
  k.cyl('trim', u, v, H.westShaft + 2.6, H.westShaft + 2.95, r + 1.0, r + 1.0, n);
  if (near) k.merlonRing('trim', u, v, H.westShaft + 2.95, r + 1.0, { count: 16, mw: 1.3, h: 1.0, thick: 0.75 });
  // open pinnacled crown: eight cream buttress posts, pointed lancets between them, a coping ring and pinnacles
  const y0 = H.westShaft + 2.95, rc = 2.55, posts = 8, top = y0 + 5.2;
  k.cyl('lead', u, v, y0 - 0.02, y0 + 0.1, r + 0.7, r + 0.7, n);
  for (let i = 0; i < posts; i++) {
    const a = (i + 0.5) * Math.PI * 2 / posts, pu = u + Math.cos(a) * rc, pv = v + Math.sin(a) * rc;
    k.box('trim', pu, y0, pv, 0.62, 5.2, 0.62, -a + Math.PI / 2);
    k.pinnacle('trim', pu, pv, top + 0.3, near ? 2.6 : 2.2, 0.36);
    if (near) {
      const a2 = a + Math.PI / posts, mu = u + Math.cos(a2) * (rc - 0.02), mv = v + Math.sin(a2) * (rc - 0.02);
      k.arch('glow', mu, mv, y0 + 0.3, 1.25, 1.9, Math.PI / 2 - a2 + Math.PI, 0.15);
      k.box('trim', mu, top - 0.9, mv, 1.55, 0.5, 0.5, -a2 + Math.PI / 2);
    }
  }
  // coping: one short beam between each pair of posts, so the crown stays open to the sky
  for (let i = 0; i < posts; i++) {
    const a = i * Math.PI * 2 / posts, mu = u + Math.cos(a) * rc * Math.cos(Math.PI / posts), mv = v + Math.sin(a) * rc * Math.cos(Math.PI / posts);
    k.box('trim', mu, top, mv, 2 * rc * Math.sin(Math.PI / posts) + 0.2, 0.35, 0.62, -a + Math.PI / 2 + Math.PI / 2 * 0 - 0);
  }
  if (near) for (const a of [0.9, 2.1, 3.3, 4.4, 5.6]) k.win(u + Math.cos(a) * (r + 0.02), v + Math.sin(a) * (r + 0.02), 12.0 + (a * 3) % 5, Math.PI / 2 - a, 0.95, 2.0);
}

function conservatory(k) {
  const { near } = k, C = CONSERVATORY, [u0, u1] = C.u, [v0, v1] = C.v, cu = (u0 + u1) / 2, cv = (v0 + v1) / 2;
  // cream parapet with merlons all round the hall and the apse
  k.box('trim', cu, H.base - 0.05, cv, u1 - u0 + 0.5, 0.5, v1 - v0 + 0.5);
  const a = C.apse;
  k.cyl('trim', a.u, a.v, H.base - 0.05, H.base + 0.45, a.r + 0.3, a.r + 0.3, tone(near, 20, 10));
  if (near) {
    k.merlons('trim', u0, v0 + 0.1, u1, v0 + 0.1, H.base + 0.4, { mw: 1.1, gap: 1.0 });
    k.merlons('trim', u0, v1 - 0.1, u1, v1 - 0.1, H.base + 0.4, { mw: 1.1, gap: 1.0 });
    for (let i = 0; i < 9; i++) { const t = -Math.PI / 2 + (i + 0.5) * Math.PI / 9; k.box('trim', a.u + Math.cos(t) * (a.r + 0.05), H.base + 0.4, a.v + Math.sin(t) * (a.r + 0.05), 1.0, 0.9, 0.6, -t + Math.PI / 2); }
    // tall arched windows along the south wall and round the apse
    for (let i = 0; i < 4; i++) { const x = u0 + 2.2 + i * 3.1; k.arch('glow', x, v1 + 0.05, 1.2, 1.5, 4.6, 0, 0.15); k.archFrame('trim', x, v1 + 0.16, 1.2, 1.5, 4.6, 0.3, 0, 0.3); }
    for (let i = 0; i < 5; i++) { const t = -Math.PI / 2 + (i + 0.5) * Math.PI / 5, px = a.u + Math.cos(t) * (a.r + 0.05), pz = a.v + Math.sin(t) * (a.r + 0.05); k.arch('glow', px, pz, 1.2, 1.4, 4.4, Math.PI / 2 - t, 0.15); }
  }
  // domed glasshouse roof: hall in blue-grey lead, an octagonal drum and a ribbed glazed dome, semi-conical apse roof
  k.box('lead', cu, H.base + 0.1, cv, u1 - u0 - 0.6, 0.3, v1 - v0 - 0.6);
  const d = C.dome;
  k.cyl('trim', d.u, d.v, H.base + 0.3, H.base + 1.6, d.r + 0.4, d.r + 0.4, tone(near, 16, 8));
  const prof = [];
  for (let i = 0; i <= (near ? 10 : 5); i++) { const t = i / (near ? 10 : 5) * Math.PI / 2; prof.push([Math.cos(t) * d.r + 0.001, H.base + 1.6 + Math.sin(t) * d.r * 0.9]); }
  k.lathe('glow', d.u, d.v, prof, tone(near, 24, 10));
  if (near) for (let i = 0; i < 8; i++) { const t = i * Math.PI / 4; for (let j = 0; j < prof.length - 1; j++) { const q = (p) => [d.u + Math.cos(t) * (p[0] + 0.05), p[1], d.v + Math.sin(t) * (p[0] + 0.05)]; barBetween(k, 'trim', q(prof[j]), q(prof[j + 1]), 0.11); } }
  k.cyl('trim', d.u, d.v, H.base + 1.6 + d.r * 0.9 - 0.1, H.base + 1.6 + d.r * 0.9 + 1.0, 0.55, 0.4, 8);
  k.cone('copper', d.u, d.v, H.base + 1.6 + d.r * 0.9 + 1.0, H.base + 1.6 + d.r * 0.9 + 2.3, 0.5, 8);
  k.cyl('lead', a.u, a.v, H.base + 0.3, H.base + 2.6, a.r - 0.3, 0.6, tone(near, 20, 8), true);
}

function barBetween(k, m, a, b, w) {
  const dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2], len = Math.hypot(dx, dy, dz);
  const g = new THREE.BoxGeometry(w, len, w);
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(dx, dy, dz).normalize()));
  g.translate((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2);
  k.out(g, m);
}

function chimneys(k) {
  const { near } = k;
  for (const [u, v, top] of CHIMNEYS) {
    const y0 = Math.max(H.base, top - 7.0), sh = 1.15; // slim cream stacks with a corbelled cap
    k.box('trim', u, y0, v, sh, top - y0 - 0.55, sh);
    k.box('trim', u, top - 0.65, v, sh + 0.4, 0.4, sh + 0.4);
    if (near) { k.box('stone', u, top - 0.3, v, sh + 0.05, 0.4, sh + 0.05); k.box('lead', u, top + 0.05, v, sh + 0.5, 0.12, sh + 0.5); }
    else k.box('trim', u, top - 0.3, v, sh + 0.35, 0.4, sh + 0.35);
  }
}

function turrets(k) {
  const { near } = k;
  for (const [u, v, r, top, tip] of TURRETS) {
    k.cyl('stone', u, v, H.base, top, r, r, tone(near, 14, 7), true);
    k.cyl('trim', u, v, top - 1.0, top, r, r + 0.35, tone(near, 14, 7));
    k.cone('roof', u, v, top, tip, r + 0.45, tone(near, 14, 7));
    k.box('copper', u, tip - 0.2, v, 0.07, 0.7, 0.07);
  }
}

function stepGables(k) {
  // crow-stepped stone gables closing the two long N-S roofs, as seen on the south front and the north courtyard
  const g = (b, at, faceSign) => {
    const [u0, u1] = b.u, w = (u1 - u0) - 2 * b.roof.inset;
    k.gableWall('stone', at + faceSign * 0.0, u0 + b.roof.inset, u1 + -b.roof.inset, b.top, b.roof.rise, 'u', 0.5);
    k.stepGable('trim', at + faceSign * 0.3, (u0 + u1) / 2, b.top + 0.05, w + 0.6, b.roof.rise + 0.9, k.near ? 7 : 4, 'u', 0.42);
  };
  const ne = BLOCKS[1], ce = BLOCKS[2];
  g(ne, ne.v[0] + ne.roof.inset, -1);
  g(ce, ce.v[1] - ce.roof.inset, 1);
}

// Ground-floor and first-floor windows on the mapped outline's straight edges, second-floor windows
// on the blocks. Positions snap to a 2.9 m grid so the rows stack.
function windows(k, buried) {
  const noWin = [{ u: [-10.9, -3.4], v: [-22, -15.6], y: 9 }, { u: [-18.5, -11.5], v: [-13, -9.5], y: 12 }, { u: [-4, 5.5], v: [-13, -9.5], y: 6.5 }, { u: [21.9, 36], v: [-7, 10], y: 10 }];
  const skip = (u, v, y) => noWin.some((z) => u >= z.u[0] && u <= z.u[1] && v >= z.v[0] && v <= z.v[1] && y < z.y);
  const ring = CASTLE_RING;
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length], du = b[0] - a[0], dv = b[1] - a[1], L = Math.hypot(du, dv);
    if (L < 2.6) continue;
    let nu = dv / L, nv = -du / L;
    const mu = (a[0] + b[0]) / 2, mv = (a[1] + b[1]) / 2;
    if (inside(ring, mu + nu * 0.3, mv + nv * 0.3)) { nu = -nu; nv = -nv; }
    const ang = Math.atan2(nu, nv), n = Math.floor((L - 0.8) / 2.9);
    for (let j = 0; j < n; j++) {
      const pu = a[0] + du * ((j + 0.5) / n), pv = a[1] + dv * ((j + 0.5) / n);
      // every third first-floor window is a lit one at night (drawn `glow`); the rest stay dark leaded glass
      for (const [y, hh] of [[1.4, 2.7], [5.3, 2.5]]) if (!skip(pu, pv, y)) k.win(pu, pv, y, ang, 1.15, hh, { glass: y > 5 && (i + j) % 3 === 0 ? 'glow' : 'glass' });
    }
  }
  for (const b of BLOCKS) {
    const [u0, u1] = b.u, [v0, v1] = b.v;
    const face = (ua, va, ub, vb, ang, nu, nv) => {
      const L = Math.hypot(ub - ua, vb - va), n = Math.floor((L - 1.0) / 2.9);
      for (let j = 0; j < n; j++) {
        const pu = ua + (ub - ua) * (j + 0.5) / n, pv = va + (vb - va) * (j + 0.5) / n;
        if (buried(pu + nu * 0.7, pv + nv * 0.7, 10) || skip(pu, pv, 10)) continue;
        k.win(pu, pv, 9.9, ang, 1.15, 2.4, { glass: (Math.round(pu + pv)) % 4 === 0 ? 'glow' : 'glass' });
      }
    };
    if (b.top - H.base < 3) continue;
    face(u0, v0, u1, v0, Math.PI, 0, -1); face(u0, v1, u1, v1, 0, 0, 1); face(u0, v0, u0, v1, -Math.PI / 2, -1, 0); face(u1, v0, u1, v1, Math.PI / 2, 1, 0);
  }
}

function loggiaAndBay(k) {
  // arcaded loggia east of the gatehouse on the north front (three pointed arches over a balcony rail)
  for (let i = 0; i < 3; i++) {
    const x = -2.0 + i * 2.5;
    k.arch('glass', x, -10.95, 1.0, 1.7, 3.0, Math.PI, 0.14); k.archFrame('trim', x, -10.95, 1.0, 1.7, 3.0, 0.25, Math.PI, 0.25);
  }
  k.box('trim', 1.0, 5.4, -11.2, 8.0, 0.9, 0.6);
  for (let i = 0; i < 3; i++) { const x = -2.0 + i * 2.5; k.arch('glass', x, -10.95, 5.9, 1.6, 1.9, Math.PI, 0.14); }
  // cream canted bay with tall leaded windows, west of the gatehouse
  k.box('trim', -15.6, 0.4, -11.55, 4.6, 10.4, 1.35);
  for (const x of [-17.0, -15.6, -14.2]) { k.win(x, -12.25, 1.6, Math.PI, 0.9, 3.4, { glass: 'glow', frame: 'trim' }); k.win(x, -12.25, 5.6, Math.PI, 0.9, 3.4, { glass: 'glow', frame: 'trim' }); }
  k.box('trim', -15.6, 10.8, -11.55, 5.2, 0.5, 1.7);
  k.merlons('trim', -18.2, -12.1, -13.0, -12.1, 11.3, { mw: 0.9, gap: 0.8, h: 0.9 });
}

function crossGables(k) {
  for (const g of CROSS_GABLES) {
    const b = BLOCKS[0], top = b.top, rise = 4.8, u0 = g.u - g.w / 2, u1 = g.u + g.w / 2;
    const vLo = g.dir < 0 ? g.v : g.v - g.len, vHi = g.dir < 0 ? g.v + g.len : g.v;
    k.ridge('roof', u0 - 0.15, u1 + 0.15, vLo, vHi, top, rise, 'v');
    k.gableWall('stone', g.v, u0 - 0.15, u1 + 0.15, top, rise, 'u', 0.6);
    const face = g.dir < 0 ? Math.PI : 0;
    if (k.near) {
      k.stepGable('trim', g.v + g.dir * 0.35, g.u, top + 0.02, g.w + 0.7, rise + 0.9, 5, 'u', 0.38);
      k.arch('glass', g.u, g.v + g.dir * 0.36, top + 0.7, 1.0, 1.5, face, 0.1); // 6 cm proud of the gable wall (0.3 half-thickness)
      k.archFrame('trim', g.u, g.v + g.dir * 0.42, top + 0.7, 1.0, 1.5, 0.28, face, 0.2);
    }
    k.pinnacle('trim', g.u, g.v + g.dir * 0.3, top + rise + 0.5, k.near ? 1.8 : 1.5, 0.3);
    k.box('trim', g.u, top - 0.9, g.v + g.dir * 0.05, g.w + 0.5, 0.42, 0.9);
  }
}

// String courses and cream quoins on the mapped outline: the grey-on-cream banding is what makes the walls read.
function ringDressing(k) {
  const ring = CASTLE_RING, n = ring.length;
  const norm = (a, b) => {
    const du = b[0] - a[0], dv = b[1] - a[1], L = Math.hypot(du, dv);
    let nu = dv / L, nv = -du / L;
    const mu = (a[0] + b[0]) / 2, mv = (a[1] + b[1]) / 2;
    if (inside(ring, mu + nu * 0.3, mv + nv * 0.3)) { nu = -nu; nv = -nv; }
    return { du, dv, L, nu, nv, mu, mv, rot: -Math.atan2(dv, du) };
  };
  for (let i = 0; i < n; i++) {
    const a = ring[i], b = ring[(i + 1) % n], e = norm(a, b);
    if (e.L < (k.near ? 1.9 : 4.5)) continue; // far skips the short facets that only approximate the curved bays: sub-pixel courses
    for (const y of [4.6, 8.55]) k.box('trim', e.mu + e.nu * 0.08, y, e.mv + e.nv * 0.08, e.L + 0.06, 0.32, 0.36, e.rot);
  }
  if (!k.near) return;
  for (let i = 0; i < n; i++) {
    const p = ring[(i + n - 1) % n], c = ring[i], q = ring[(i + 1) % n];
    const e1 = norm(p, c), e2 = norm(c, q);
    if (e1.L < 1.6 || e2.L < 1.6) continue;
    const dot = (e1.du * e2.du + e1.dv * e2.dv) / (e1.L * e2.L);
    if (Math.abs(dot) > 0.3) continue;
    const dx = e1.nu + e2.nu, dz = e1.nv + e2.nv, dl = Math.hypot(dx, dz) || 1, ox = dx / dl, oz = dz / dl;
    if (inside(ring, c[0] + ox * 0.25, c[1] + oz * 0.25) || !inside(ring, c[0] - ox * 0.25, c[1] - oz * 0.25)) continue; // convex corners only
    k.box('trim', c[0] + ox * 0.05, 0.0, c[1] + oz * 0.05, 0.62, H.base, 0.62, e1.rot);
  }
  // the same two courses round the three big round bulges
  for (const t of [SCOTTISH, WEST_TOWER, { u: CONSERVATORY.apse.u, v: CONSERVATORY.apse.v, r: CONSERVATORY.apse.r }]) for (const y of [4.6, 8.55]) k.cyl('trim', t.u, t.v, y, y + 0.32, t.r + 0.1, t.r + 0.1, 28, true);
}
