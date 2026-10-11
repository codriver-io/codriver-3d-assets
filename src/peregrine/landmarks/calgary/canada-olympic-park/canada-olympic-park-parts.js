// Canada Olympic Park: what a driver reads from the Trans-Canada Highway, one function each.
//   inrun()    the K114 / K89 inrun girders: a U trough on the sourced profile (straight at 35 deg, transition, take-off
//              table), grey cladding above and a dark steel soffit band below, with the stairway along the west side (near)
//   supports() the concrete pier under each girder, steel trestle bents down the lower inrun, the take-off table block
//   tower90()  the 58 m tower: flared lift-core shaft (70 % of the head), cantilevered head with a tapered underside,
//              glazed bands, Olympic rings (flat annuli), mast
//   tower70()  the 70 m tower: concrete shaft and box head with the K89 start
// Every support and shaft reaches y = 0 (see the plan for why). Numbers live in canada-olympic-park-plan.js.
import { JUMPS, SUPPORTS, TOWER90, TOWER70, TOWER50, HUT38, axes, inrunProfile, deckY, jumpPoint, girderDepth, GIRDER_STEEL } from './canada-olympic-park-plan.js';
import { polys, prism, sweep, bar, ring } from './canada-olympic-park-mesh.js';

const WALL = 0.3; // parapet thickness

/** A point in a jump's frame: [x, y, z]. */
const P = (jump, profile, u, v, y) => { const [x, z] = jumpPoint(jump, profile, u, v); return [x, y, z]; };
/** An axis-aligned (in the jump frame) rectangle at height y, counter-clockwise from (u0, v0). */
const rect = (jump, profile, { u0, u1, v0, v1 }, y) => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]].map(([u, v]) => P(jump, profile, u, v, typeof y === 'function' ? y(u, v) : y));
/** Girder underside at u. */
const girderBottom = (jump, profile, u) => deckY(profile, u) - girderDepth(jump, profile, u);

/** Vertical stations along the deck centreline, from just inside the start house to the take-off edge. */
function stations(jump, profile, near) {
  const { r } = axes(jump.bearing), pts = profile.points, list = [];
  const tan = Math.tan(jump.gamma * Math.PI / 180);
  list.push({ u: -1.2, y: pts[0].y + 1.2 * tan }); // into the start house
  // far keeps every other transition sample (the curve still reads)
  pts.forEach((p, i) => { if (near || i === 0 || i === pts.length - 1 || i % 2 === 1 || p.slope === jump.alpha) list.push(p); });
  return list.map(({ u, y }) => ({ u, y, p: P(jump, profile, u, 0, y), r }));
}

export function inrun(b, ctx, key) {
  const jump = JUMPS[key], profile = inrunProfile(jump, ctx.near ? 8 : 4), W = jump.width / 2, H = jump.parapet;
  const st = stations(jump, profile, ctx.near), floor = ctx.near ? 'track' : 'clad';
  const D = (station) => -girderDepth(jump, profile, station.u), M = (station) => D(station) * (1 - GIRDER_STEEL); // M: clad / steel seam
  sweep(b, st, [
    [[-W, H], [-W, M], 'clad', -1, 0],
    [[-W, M], [-W, D], 'steel', -1, 0],
    [[-W, D], [W, D], 'steel', 0, -1],
    [[W, D], [W, M], 'steel', 1, 0],
    [[W, M], [W, H], 'clad', 1, 0],
    [[W, H], [W - WALL, H], 'clad', 0, 1],
    [[W - WALL, H], [W - WALL, 0], 'clad', -1, 0],
    [[W - WALL, 0], [-W + WALL, 0], floor, 0, 1],
    [[-W + WALL, 0], [-W + WALL, H], 'clad', 1, 0],
    [[-W + WALL, H], [-W, H], 'clad', 0, 1],
  ]);
  // The take-off edge: the trough's end face (three convex pieces).
  const { d } = axes(jump.bearing), out = [d[0], 0, d[1]], u = profile.uT, y = profile.edgeY, De = jump.shallow, ym = y - De * (1 - GIRDER_STEEL);
  polys(b, 'steel', [[P(jump, profile, u, -W, y - De), P(jump, profile, u, W, y - De), P(jump, profile, u, W, ym), P(jump, profile, u, -W, ym), out]]);
  polys(b, 'clad', [
    [P(jump, profile, u, -W, ym), P(jump, profile, u, W, ym), P(jump, profile, u, W, y), P(jump, profile, u, -W, y), out],
    [P(jump, profile, u, -W, y), P(jump, profile, u, -W + WALL, y), P(jump, profile, u, -W + WALL, y + H), P(jump, profile, u, -W, y + H), out],
    [P(jump, profile, u, W - WALL, y), P(jump, profile, u, W, y), P(jump, profile, u, W, y + H), P(jump, profile, u, W - WALL, y + H), out],
  ]);
  if (!ctx.near) return;
  // Stairway down the west side: a sloped slab hung on the girder and a handrail.
  const s = jump.stairSide, a = s * W, c = s * (W + 1.3), stair = st.slice(1);
  sweep(b, stair, [
    [[a, -0.5], [c, -0.5], 'steel', 0, 1],
    [[c, -0.5], [c, -0.8], 'steel', s, 0],
    [[c, -0.8], [a, -0.8], 'steel', 0, -1],
  ]);
  const rv = c - s * 0.05;
  sweep(b, stair, [
    [[rv - 0.04, 0.42], [rv + 0.04, 0.42], 'steel', 0, 1],
    [[rv + 0.04, 0.42], [rv + 0.04, 0.34], 'steel', 1, 0],
    [[rv + 0.04, 0.34], [rv - 0.04, 0.34], 'steel', 0, -1],
    [[rv - 0.04, 0.34], [rv - 0.04, 0.42], 'steel', -1, 0],
  ]);
}

/** The pier, the trestle bents and the take-off table under one inrun; each stands on y = 0. */
export function supports(b, ctx, key) {
  const jump = JUMPS[key], profile = inrunProfile(jump), sp = SUPPORTS[key], W = jump.width / 2, angle = -jump.bearing * Math.PI / 180;
  // Concrete pier: its top follows the girder's underside (sloped), so it never pokes through the deck.
  for (const pier of sp.piers) {
    const pu = pier.u, pa = pier.along / 2, pc = pier.across / 2, box = { u0: pu - pa, u1: pu + pa, v0: -pc, v1: pc };
    prism(b, 'concrete', rect(jump, profile, box, 0), rect(jump, profile, box, (u) => girderBottom(jump, profile, u) + 0.2), { top: false });
  }
  // Steel trestle bents: two legs, a cap beam under the girder, and (near) X bracing in the bent plane.
  const tableU = profile.uT - sp.table;
  for (let u = sp.trestle?.from ?? Infinity; u < tableU - 2; u += sp.trestle.pitch) {
    const top = girderBottom(jump, profile, u + 0.3) + 0.05, lv = W - 0.35, legs = [-lv, lv];
    for (const v of legs) bar(b, 'steel', P(jump, profile, u, v, 0), P(jump, profile, u, v, top), 0.45, angle);
    bar(b, 'steel', P(jump, profile, u, -W, top - 0.3), P(jump, profile, u, W, top - 0.3), 0.5, 0);
    if (!ctx.near || top < 3) continue;
    const panels = Math.max(1, Math.round(top / 6));
    for (let k = 0; k < panels; k++) {
      const y0 = 0.3 + (top - 0.3) * k / panels, y1 = 0.3 + (top - 0.3) * (k + 1) / panels;
      bar(b, 'steel', P(jump, profile, u, -lv, y0), P(jump, profile, u, lv, y1), 0.14, 0);
      bar(b, 'steel', P(jump, profile, u, lv, y0), P(jump, profile, u, -lv, y1), 0.14, 0);
    }
  }
  // Take-off table: a concrete block under the last metres of the trough, its face just behind the edge.
  const t = { u0: tableU, u1: profile.uT - 0.15, v0: -W + 0.1, v1: W - 0.1 };
  prism(b, 'concrete', rect(jump, profile, t, 0), rect(jump, profile, t, (u) => girderBottom(jump, profile, u) + 0.2), { top: false });
}

/** Vertical mullions: concrete quads 4 cm proud of the glass bands, every `pitch` metres along each face. */
function mullions(b, jump, profile, box, ranges, pitch) {
  const { d, r } = axes(jump.bearing), o = 0.1, w = 0.18, list = [];
  for (const [y0, y1] of ranges) {
    for (let u = box.u0 + 0.6 + pitch; u < box.u1 - 0.6; u += pitch) {
      list.push([P(jump, profile, u - w, box.v0 - o, y0), P(jump, profile, u + w, box.v0 - o, y0), P(jump, profile, u + w, box.v0 - o, y1), P(jump, profile, u - w, box.v0 - o, y1), [-r[0], 0, -r[1]]]);
      list.push([P(jump, profile, u - w, box.v1 + o, y0), P(jump, profile, u + w, box.v1 + o, y0), P(jump, profile, u + w, box.v1 + o, y1), P(jump, profile, u - w, box.v1 + o, y1), [r[0], 0, r[1]]]);
    }
    for (let v = box.v0 + 0.6 + pitch; v < box.v1 - 0.6; v += pitch) {
      list.push([P(jump, profile, box.u1 + o, v - w, y0), P(jump, profile, box.u1 + o, v + w, y0), P(jump, profile, box.u1 + o, v + w, y1), P(jump, profile, box.u1 + o, v - w, y1), [d[0], 0, d[1]]]);
      list.push([P(jump, profile, box.u0 - o, v - w, y0), P(jump, profile, box.u0 - o, v + w, y0), P(jump, profile, box.u0 - o, v + w, y1), P(jump, profile, box.u0 - o, v - w, y1), [-d[0], 0, -d[1]]]);
    }
  }
  polys(b, 'concrete', list);
}

/** Window bands as quads 6 cm proud of the four (or listed) faces of an axis box in a jump frame. */
function bands(b, jump, profile, box, ranges, faces = ['n', 'e', 's', 'w'], inset = 0.6) {
  const { d, r } = axes(jump.bearing), o = 0.06, list = [];
  for (const [y0, y1] of ranges) {
    for (const f of faces) {
      if (f === 'n') list.push([P(jump, profile, box.u1 + o, box.v0 + inset, y0), P(jump, profile, box.u1 + o, box.v1 - inset, y0), P(jump, profile, box.u1 + o, box.v1 - inset, y1), P(jump, profile, box.u1 + o, box.v0 + inset, y1), [d[0], 0, d[1]]]);
      if (f === 's') list.push([P(jump, profile, box.u0 - o, box.v0 + inset, y0), P(jump, profile, box.u0 - o, box.v1 - inset, y0), P(jump, profile, box.u0 - o, box.v1 - inset, y1), P(jump, profile, box.u0 - o, box.v0 + inset, y1), [-d[0], 0, -d[1]]]);
      if (f === 'e') list.push([P(jump, profile, box.u0 + inset, box.v1 + o, y0), P(jump, profile, box.u1 - inset, box.v1 + o, y0), P(jump, profile, box.u1 - inset, box.v1 + o, y1), P(jump, profile, box.u0 + inset, box.v1 + o, y1), [r[0], 0, r[1]]]);
      if (f === 'w') list.push([P(jump, profile, box.u0 + inset, box.v0 - o, y0), P(jump, profile, box.u1 - inset, box.v0 - o, y0), P(jump, profile, box.u1 - inset, box.v0 - o, y1), P(jump, profile, box.u0 + inset, box.v0 - o, y1), [-r[0], 0, -r[1]]]);
    }
  }
  polys(b, 'glass', list);
}

/** A tower shaft from y = 0 to just inside the head's taper; its lowest `flare.h` metres flare out by `flare.out` on every side. */
function shaft(b, jump, profile, T) {
  const s = T.shaft, f = T.flare, wide = { u0: s.u0 - f.out, u1: s.u1 + f.out, v0: s.v0 - f.out, v1: s.v1 + f.out };
  prism(b, 'concrete', rect(jump, profile, wide, 0), rect(jump, profile, s, f.h), { top: false });
  prism(b, 'concrete', rect(jump, profile, s, f.h), rect(jump, profile, s, T.frustumY + 0.05), { top: false });
}

export function tower90(b, ctx) {
  const jump = JUMPS.k114, profile = inrunProfile(jump), T = TOWER90, { d, r } = axes(jump.bearing);
  const yRoof = T.roof, yEave = T.eave;
  // Lift core / shaft from y = 0 into the head's underside, flared at its foot.
  shaft(b, jump, profile, T);
  // Tapered underside: from the shaft's top to the head's bottom outline.
  prism(b, 'concrete', rect(jump, profile, T.shaft, T.frustumY), rect(jump, profile, T.head, T.head.y0), { top: false });
  // Head walls, then the cap: its north face chamfered back over the inrun (the sloped top seen from the highway).
  prism(b, 'concrete', rect(jump, profile, T.head, T.head.y0), rect(jump, profile, T.head, yEave), { top: false });
  prism(b, 'concrete', rect(jump, profile, T.head, yEave), rect(jump, profile, { ...T.head, u1: T.head.u1 - T.capSetback }, yRoof));
  // The start gate: a dark opening round the girder where it enters the head's north face.
  const g = T.gateOpening, W = jump.width / 2, yd = deckY(profile, 0), n = [d[0], 0, d[1]];
  polys(b, 'glass', [[P(jump, profile, 0.06, -W - g, yd - jump.depth - 0.3), P(jump, profile, 0.06, W + g, yd - jump.depth - 0.3),
    P(jump, profile, 0.06, W + g, yd + jump.parapet + 0.9), P(jump, profile, 0.06, -W - g, yd + jump.parapet + 0.9), n]]);
  bands(b, jump, profile, T.head, T.bands, ['n', 'e', 'w', 's']);
  if (ctx.near) mullions(b, jump, profile, T.head, T.bands, T.mullion);
  // Glazed lift-core strip on the west face, from the tower's real ground to the cornice.
  const o = 0.06, s0 = T.core.u0, s1 = T.core.u1, west = [-r[0], 0, -r[1]];
  const wv = T.shaft.v0 - o, hv = T.head.v0 - o;
  polys(b, 'glass', [
    [P(jump, profile, s0, wv, T.base + 0.5), P(jump, profile, s1, wv, T.base + 0.5), P(jump, profile, s1, wv, T.frustumY - 0.3), P(jump, profile, s0, wv, T.frustumY - 0.3), west],
    [P(jump, profile, s0, hv, T.head.y0 + 0.4), P(jump, profile, s1, hv, T.head.y0 + 0.4), P(jump, profile, s1, hv, yEave - 0.6), P(jump, profile, s0, hv, yEave - 0.6), west],
  ]);
  // Roof: lift machine room and the antenna mast.
  const ph = T.penthouse;
  prism(b, 'concrete', rect(jump, profile, ph, yRoof - 0.05), rect(jump, profile, ph, yRoof + ph.h));
  const m = T.mast, base = yRoof + ph.h, top = yRoof + m.top;
  if (ctx.near) {
    const legs = [0, 1, 2].map((k) => [m.u + 0.6 * Math.cos(k * 2.094), m.v + 0.6 * Math.sin(k * 2.094)]);
    for (const [u, v] of legs) bar(b, 'steel', P(jump, profile, u, v, base - 0.1), P(jump, profile, u, v, top), 0.1);
    for (let y = base, k = 0; y < top - 1; y += 1.4, k++) {
      const a = legs[k % 3], e = legs[(k + 1) % 3];
      bar(b, 'steel', P(jump, profile, a[0], a[1], y), P(jump, profile, e[0], e[1], y + 1.4), 0.05);
    }
    for (const [u, v, h] of [[-3, -5.5, 5.5], [-6, 5.8, 4.2], [-13.6, -6.6, 6.5]]) bar(b, 'steel', P(jump, profile, u, v, yRoof - 0.05), P(jump, profile, u, v, yRoof + h), 0.09);
    // Olympic rings on the west face of the head: flat annuli (24 segments) blue, black, red above; yellow, green below
    // (blue at the north end). The lower row stands 5 cm further out so the interlocking crossings do not z-fight.
    const R = T.rings, step = R.r * 2.3, n = [-r[0], -r[1]];
    const at = (du, dy, out = 0) => P(jump, profile, R.u + du, T.head.v0 - R.off - out, R.y + dy);
    ring(b, 'ringBlue', at(step, 0), n, R.r, R.tube, 24);
    ring(b, 'ringBlack', at(0, 0), n, R.r, R.tube, 24);
    ring(b, 'ringRed', at(-step, 0), n, R.r, R.tube, 24);
    ring(b, 'ringYellow', at(step / 2, -R.r * 1.05, 0.05), n, R.r, R.tube, 24);
    ring(b, 'ringGreen', at(-step / 2, -R.r * 1.05, 0.05), n, R.r, R.tube, 24);
  } else {
    bar(b, 'steel', P(jump, profile, m.u, m.v, base - 0.1), P(jump, profile, m.u, m.v, top), 0.5);
  }
}

/** A concrete shaft carrying a box head with a tapered underside and a glazed band: the 70 m tower and the K63 tower. */
export function boxTower(b, ctx, T) {
  const jump = JUMPS[T.jump], profile = inrunProfile(jump);
  shaft(b, jump, profile, T);
  prism(b, 'concrete', rect(jump, profile, T.shaft, T.frustumY), rect(jump, profile, T.head, T.head.y0), { top: false });
  prism(b, 'concrete', rect(jump, profile, T.head, T.head.y0), rect(jump, profile, T.head, T.head.top));
  bands(b, jump, profile, T.head, [T.band], ctx.near ? ['n', 'e', 'w', 's'] : ['n', 'e', 'w'], 0.8);
}
export const tower70 = (b, ctx) => boxTower(b, ctx, TOWER70);
export const tower50 = (b, ctx) => boxTower(b, ctx, TOWER50);

/** The K38 start hut on four steel legs (the girder's open end runs into it). */
export function hut38(b, ctx) {
  const H = HUT38, jump = JUMPS[H.jump], profile = inrunProfile(jump), y0 = profile.startY - H.below, y1 = profile.startY + H.above;
  prism(b, 'concrete', rect(jump, profile, H.box, y0), rect(jump, profile, H.box, y1), { bottom: true });
  const angle = -jump.bearing * Math.PI / 180;
  for (const [u, v] of [[H.box.u0 + 0.3, H.box.v0 + 0.3], [H.box.u0 + 0.3, H.box.v1 - 0.3], [H.box.u1 - 0.3, H.box.v0 + 0.3], [H.box.u1 - 0.3, H.box.v1 - 0.3]]) {
    bar(b, 'steel', P(jump, profile, u, v, 0), P(jump, profile, u, v, y0 + 0.05), 0.4, angle);
  }
  if (ctx.near) bands(b, jump, profile, H.box, [[y1 - 1.6, y1 - 0.7]], ['n', 'e', 'w'], 0.5);
}
