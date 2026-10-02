import { Vector3, Matrix4, Shape, Path, ExtrudeGeometry, ShapeGeometry } from 'three';
import { bridgeBuilder } from '../../asset-geometry.js';
import { parts } from './bay-bridge-west-span-parts.js';
import {
  PROFILE as p, L, S, h, lower, ebLateral, S_EB_IN, S_EB_DRAW, S_WEST_PORTAL, TRUSS_HALF as TH, TRUSS_DEPTH,
  TOWER_BASE, CABLE_R, KERB,
} from './bay-bridge-west-span-profile.js';
import { CABLE_SPANS, cableY, TOWERS, truss, T_START, T_END } from './bay-bridge-west-span-structure.js';

/** The upper deck's fadeable materials (spec.upperDeck in the profile). */
export const UPPER_MAT = { asphalt: 'asphaltUpper', paint: 'paintUpper', concrete: 'deckUpper' };

const clamp01 = (v) => Math.max(0, Math.min(1, v));

/** Road surface to the top chord's centre, and chord to chord (35 ft overall with 1.1 m chords). */
export const TOPC = (s) => h(s) - 0.75;
export const BOTC = (s) => h(s) - 0.75 - (TRUSS_DEPTH - 1.1);
/** The eastbound carriageway's centre west of the anchorage (it slides under the upper deck). */
export const ebMid = (s) => (s < S.SFA - 30 ? ebLateral(s) : s < S.SFA ? ebLateral(S.SFA - 30) * (S.SFA - s) / 30 : 0);
/** Where the lower deck ends in the tunnel: closer than this to the upper deck there is no headroom. */
/** The stacked stretch starts a little before the eastbound carriageway reaches the deck corridor. */
export const STACK_START = S_EB_IN - 20;
export const LOW_END = (() => { let s = S_WEST_PORTAL; while (s < L && h(s) - lower(s) > 3.2) s += 2; return s; })();

/**
 * San Francisco–Oakland Bay Bridge, West Span: two suspension bridges end to end on the central
 * anchorage W4, X-braced steel towers W2, W3, W5 and W6, a 66 ft by 35 ft double-deck stiffening truss
 * (westbound on top, eastbound inside), the San Francisco anchorage and approach, and the island
 * viaduct into the Yerba Buena Island tunnel. Real metres, +X east, +Y up, +Z south, on the mapped
 * roadway (bay-bridge-west-span-profile.js) so it is one surface with the car, the route and the HD road.
 */
export function create({ detail = 'near' } = {}) {
  const b = bridgeBuilder(p, detail), k = parts(p, b, detail), near = k.near;
  const { P, samples, slab, surface, chord, bar, block, octRing, loft, sweep } = k;
  const ck = (s) => (near ? Math.min(3, Math.max(0, Math.floor(s / (L / 4)))) : 0);
  /** Station ranges split at the chunk boundaries (near) so each piece culls with its quarter. */
  const pieces = (s0, s1) => {
    const cuts = near ? [1, 2, 3].map((i) => i * L / 4).filter((c) => c > s0 + 1 && c < s1 - 1) : [];
    const edges = [s0, ...cuts, s1];
    return edges.slice(1).map((e, i) => [edges[i], e]);
  };
  // Dense where the deck curves (the flat-map ramps), sparse on the gently cambered spans.
  const step = (s) => ((s < S.W2 - 100 || s > S.W6 + 20) ? (near ? 8 : 16) : (near ? 20 : 40));
  const along = (s0, s1, fn) => { for (const [a, c] of pieces(s0, s1)) fn(samples(a, c, step), ck((a + c) / 2)); };
  const tan = (s) => k.tangent(s);
  const lat = (s) => k.lateral(s);
  /** A vertical plate on one side of a roadway, both faces, from y0(s) to y1(s). */
  const wall = (mat, st, d0, d1, y0, y1, opts) => sweep(mat, st, (s) => {
    const a = d0(s), c = d1(s), lo = y0(s), hi = y1(s);
    return [[a, hi], [a, lo], [c, lo], [c, hi]];
  }, { closed: true, flat: true, ...opts });

  /**
   * A deck body under a road surface (`il`..`ir` laterally): the box of wall()/slab() without the top face
   * between the road's edges. That face is hidden under the asphalt and lay 10 cm from it, which z-fights at
   * distance. Only the margins beside the road keep their top (the rails and barriers stand on them).
   * `open` false keeps the full closed box (the lower deck has no asphalt in the far LOD).
   */
  const body = (open, mat, st, dl, dr, y0, y1, il, ir, opts) => (open
    ? sweep(mat, st, (s) => { const a = dl(s), c = dr(s), lo = y0(s), hi = y1(s); return [[il(s), hi], [a, hi], [a, lo], [c, lo], [c, hi], [ir(s), hi]]; }, { closed: false, flat: true, ...opts })
    : wall(mat, st, dl, dr, y0, y1, opts));

  // ---- 1. The upper (westbound) deck ------------------------------------------------------------------
  const SLAB_W = TH - 0.6;                                   // slab edge, clear of the chords' inner faces
  // Over the stacked stretch the upper road, its paint and its slab are their own materials: the layer
  // fades them while the followed car is on the lower deck (spec.upperDeck, bridge-layer.js).
  const UP0 = STACK_START, UP1 = LOW_END;
  const upper = (mat, s) => (s >= UP0 && s <= UP1 ? UPPER_MAT[mat] : mat);
  const RAIL = near ? 'rail' : 'steel';
  const deckRanges = [[0, UP0], [UP0, UP1], [UP1, L]];
  for (const [a0, a1] of deckRanges) along(a0, a1, (st, c) => {
    const m = (a0 + a1) / 2, ch = upper('asphalt', m) === 'asphalt' ? c : 0;
    surface(upper('asphalt', m), st, () => -KERB, () => KERB, h, { chunk: ch });
    if (near) for (const d of [-KERB + 0.35, KERB - 0.35]) surface(upper('paint', m), st, () => d - 0.08, () => d + 0.08, (s) => h(s) + 0.02, { chunk: ch });
    if (near) for (const o of [-1, 1]) wall(RAIL, st, () => (o < 0 ? -KERB - 0.55 : KERB + 0.25), () => (o < 0 ? -KERB - 0.25 : KERB + 0.55), (s) => h(s) - 0.1, (s) => h(s) + 1.05, { chunk: c });
  });
  if (near) for (let s = 6; s < L - 6; s += 12) for (const d of [-5.25, -1.75, 1.75, 5.25]) {
    const mat = upper('paint', s);
    surface(mat, [s, s + 3], () => d - 0.07, () => d + 0.07, (v) => h(v) + 0.02, { chunk: mat === 'paint' ? ck(s) : 0 });
  }
  // The deck structure: a concrete box girder on the approaches (on fill near the ground), the floor
  // slab inside the truss.
  const FILL_TOP = 4.5;
  const girderBottom = (s) => (h(s) < FILL_TOP ? 0 : Math.max(0, h(s) - 2.3));
  const fillLift = (y) => clamp01(y / FILL_TOP);
  const deckMat = (a0, a1, c) => (upper('concrete', (a0 + a1) / 2) === 'concrete' ? ['concrete', c] : [UPPER_MAT.concrete, 0]);
  for (const [a0, a1] of [[0, UP0], [UP0, T_START]]) along(a0, a1, (st, c) => body(true, ...deckMat(a0, a1, c).slice(0, 1), st, () => -KERB - 0.9, () => KERB + 0.9, girderBottom, (s) => h(s) - 0.1, () => -KERB, () => KERB, { chunk: deckMat(a0, a1, c)[1], lift: fillLift }));
  along(T_START, T_END, (st) => body(true, UPPER_MAT.concrete, st, () => -SLAB_W, () => SLAB_W, (s) => h(s) - 0.55, (s) => h(s) - 0.1, () => -KERB, () => KERB, {}));
  for (const [a0, a1] of [[T_END, UP1], [UP1, L]]) along(a0, a1, (st, c) => body(true, ...deckMat(a0, a1, c).slice(0, 1), st, () => -KERB - 0.9, () => KERB + 0.9, (s) => (h(s) < FILL_TOP ? 0 : h(s) - 1.9), (s) => h(s) - 0.1, () => -KERB, () => KERB, { chunk: deckMat(a0, a1, c)[1], lift: fillLift }));

  // ---- 2. The lower (eastbound) deck --------------------------------------------------------------------
  // From San Francisco it climbs beside, then under, the westbound viaduct; inside the truss it runs
  // 9 m below the upper road; on the island it eases into the tunnel with the upper deck.
  const lowY = (s) => Math.max(0.04, lower(s));
  const ebL = (s) => (s < T_START ? ebMid(s) - KERB : -KERB), ebR = (s) => (s < T_START ? ebMid(s) + KERB : KERB);
  if (near) along(S_EB_DRAW, LOW_END, (st, c) => {
    surface('asphalt', st, ebL, ebR, lowY, { chunk: c });
    // Edge lines (near): the lower carriageway reads as a road through the open truss.
    if (near) for (const e of [ebL, ebR]) surface('paint', st, (s) => e(s) + (e === ebL ? 0.27 : -0.43), (s) => e(s) + (e === ebL ? 0.43 : -0.27), (s) => lowY(s) + 0.02, { chunk: c });
  });
  let sEbHigh = S_EB_IN; while (lower(sEbHigh) < 3 && sEbHigh < S.SFA) sEbHigh += 1;
  along(S_EB_IN, sEbHigh, (st, c) => body(near, 'concrete', st, (s) => ebL(s) - 0.6, (s) => ebR(s) + 0.6, () => 0, (s) => lowY(s) - 0.1, ebL, ebR, { chunk: c, lift: fillLift }));
  along(sEbHigh, T_START, (st, c) => {
    body(near, 'concrete', st, (s) => ebL(s) - 0.6, (s) => ebR(s) + 0.6, (s) => lowY(s) - 1.3, (s) => lowY(s) - 0.1, ebL, ebR, { chunk: c });
    for (const o of [-1, 1]) wall('concrete', st, (s) => (o < 0 ? ebL(s) - 0.55 : ebR(s) + 0.15), (s) => (o < 0 ? ebL(s) - 0.15 : ebR(s) + 0.55), (s) => lowY(s) - 0.1, (s) => lowY(s) + 0.9, { chunk: c });
  });
  if (near) along(T_START, LOW_END, (st, c) => body(true, 'concrete', st, () => -SLAB_W, () => SLAB_W, (s) => lowY(s) - 0.55, (s) => lowY(s) - 0.1, ebL, ebR, { chunk: c }));

  // ---- 3. The double-deck stiffening truss (San Francisco anchorage to W7) -------------------------------
  along(T_START, T_END, (st, c) => {
    for (const d of [-TH, TH]) {
      chord('steel', st, d, TOPC, 1.0, 1.1, { chunk: c });
      chord('steel', st, d, BOTC, 1.0, 1.1, { chunk: c });
    }
  });
  const panels = truss.panels(near);
  for (let i = 0; i < panels.length; i++) {
    const s = panels[i], c = ck(s), n = lat(s);
    for (const d of [-TH, TH]) {
      if (near) bar('steel', P(s, d, BOTC(s)), P(s, d, TOPC(s)), 0.75, 0.6, { side: n, chunk: c });
      // Far (2-5 km away) the diagonals are sub-pixel: the two chords draw the truss as a band.
      if (near && i + 1 < panels.length) {
        const s1 = panels[i + 1], up = i % 2 === 0;
        bar('steel', P(s, d, up ? BOTC(s) : TOPC(s)), P(s1, d, up ? TOPC(s1) : BOTC(s1)), 0.8, 0.75, { side: n, chunk: c });
      }
    }
    // Lower wind bracing (the truss's only lateral system, HAER) and the floor beams, seen from below.
    if (near && i + 1 < panels.length) {
      const s1 = panels[i + 1], y0 = BOTC(s) - 0.25, y1 = BOTC(s1) - 0.25;
      bar('steel', P(s, -TH, y0), P(s1, TH, y1), 0.45, 0.45, { chunk: c });
      bar('steel', P(s, TH, y0), P(s1, -TH, y1), 0.45, 0.45, { chunk: c });
      bar('steel', P(s, -TH, BOTC(s) + 0.35), P(s, TH, BOTC(s) + 0.35), 0.7, 0.9, { side: tan(s), chunk: c });
    }
  }

  // ---- 4. Towers W2, W3, W5, W6 --------------------------------------------------------------------------
  for (const t of TOWERS) tower(t);
  function tower({ s, top, fender }) {
    const c = ck(s), base = TOWER_BASE, dk = h(s);
    // Caisson pier and its timber-faced fender at the waterline.
    block('concrete', s, 0, 0, 2.6, fender[0], fender[1], { chunk: c, taper: 0.4 });
    block('concrete', s, 0, 2.6, base, 16, 42, { chunk: c, taper: 0.5 });
    // Battered legs: cruciform shafts 30 x 20 ft at the base plate, centred over the cables at the top.
    const f = (y) => (y - base) / (top - base);
    const legD = (y) => 15.7 + (TH - 15.7) * f(y);
    const legA = (y) => 9.1 + (5.0 - 9.1) * f(y);
    const legW = (y) => 5.6 + (3.4 - 5.6) * f(y);
    const levels = near ? [base, (base + dk - 14) / 2, dk - 14, dk + 10, top - 6, top - 1.2] : [base, dk - 14, top - 1.2];
    for (const o of [-1, 1]) {
      loft('steel', levels.map((y) => octRing(s, o * legD(y), y, legA(y), legW(y), Math.min(1.1, legW(y) / 4))), { capTop: true, chunk: c, lift: 0 });
      block('steel', s, o * TH, top - 1.2, top + 0.4, 6.2, 3.8, { chunk: c, taper: 0.5 });   // saddle housing under the cable
      if (near) block('beacon', s, o * TH, top + 0.4, top + 1.1, 0.7, 0.7);
    }
    // Horizontal struts: base, deck (carrying the truss), two above-deck panel struts, the top portal,
    // and one between the two lower panels.
    const belowBase = base + 6.0, belowTop = dk - 13.2, midBelow = (belowBase + belowTop) / 2;
    const above0 = dk + 2, above1 = top - 7.5, pa = (above1 - above0) / 3;
    const struts = [[base + 2.5, belowBase], [belowTop, dk - 11.0], [midBelow - 1.6, midBelow + 1.6],
      [above0 + pa - 1.6, above0 + pa + 1.6], [above0 + 2 * pa - 1.6, above0 + 2 * pa + 1.6], [above1, top - 1.4]];
    for (const [y0, y1] of struts) {
      const ym = (y0 + y1) / 2, dIn = legD(ym) - legW(ym) / 2 + 0.3;
      bar('steel', P(s, -dIn, ym), P(s, dIn, ym), 2.8, y1 - y0, { side: tan(s), chunk: c, lift: 0, flat: true });
    }
    // The X bracing: two panels below the deck, three above (HAER, Scheme 7). Wide plated members.
    const xPanels = [[belowBase, midBelow - 1.6], [midBelow + 1.6, belowTop], [above0, above0 + pa - 1.6],
      [above0 + pa + 1.6, above0 + 2 * pa - 1.6], [above0 + 2 * pa + 1.6, above1]];
    for (const [y0, y1] of xPanels) {
      const a0 = legD(y0) - legW(y0) / 2 + 0.4, a1 = legD(y1) - legW(y1) / 2 + 0.4;
      bar('steel', P(s, -a0, y0), P(s, a1, y1), 2.4, 2.1, { side: tan(s), chunk: c, lift: 0, flat: true });
      bar('steel', P(s, a0, y0), P(s, -a1, y1), 2.4, 2.1, { side: tan(s), chunk: c, lift: 0, flat: true });
    }
    // The open gallery on the top portal (near).
    if (near) {
      const d = legD(top) - legW(top) / 2 - 0.4;
      for (let i = 0; i <= 6; i++) { const x = -d + 2 * d * i / 6; bar('steel', P(s, x, top - 1.5), P(s, x, top + 0.3), 0.5, 0.5, { chunk: c, lift: 0 }); }
      bar('steel', P(s, -d, top + 0.3), P(s, d, top + 0.3), 1.2, 0.5, { side: tan(s), chunk: c, lift: 0 });
    }
  }

  // ---- 5. Anchorages and piers --------------------------------------------------------------------------
  // W4, "Moran's Island": the central anchorage on its mapped 69 x 40 m outline, rising to the cables.
  {
    const s = S.W4, c = ck(s), dk = h(s), body = dk - 11.2;
    // The darkest, greyest element of the crossing: weathered concrete in its own material.
    block('pier', s, 0, 0, 3, 72, 44, { chunk: c, taper: 0.5 });
    block('pier', s, 0, 3, body, 68, 40, { chunk: c });
    // Cable housings flank the truss and rise above the deck; the cables land in their crowns.
    for (const o of [-1, 1]) {
      block('pier', s, o * 14.6, body, dk + 3.6, 58, 7.4, { chunk: c, taper: 0.4 });
      block('pier', s, o * 14.6, dk + 3.6, dk + 5.2, 40, 5.8, { chunk: c, taper: 0.7 });
      // Pilasters on the long faces and the ends, and a string course under the housings.
      if (near) for (let e = -2; e <= 2; e++) block('pier', s + e * 13.5, o * 20.3, 4, body - 3.5, 3.2, 0.8, { chunk: c });
      if (near) for (const e of [-1, 1]) block('pier', s + e * 34.3, o * 12, 4, body - 3.5, 0.8, 3.2, { chunk: c });
      block('pier', s, o * 20.25, body - 2.6, body - 1.4, 68.6, 0.9, { chunk: c });
    }
    for (const e of [-1, 1]) block('pier', s + e * 34.25, 0, body - 2.6, body - 1.4, 0.9, 40.4, { chunk: c });
  }
  // The San Francisco anchorage on its mapped outline, the decks landing on it.
  {
    const s = S.SFA, c = ck(s), top = lower(s) - 0.6;
    block('concrete', s, 0, 0, top - 3, 50, 32, { chunk: c });
    block('concrete', s, 0, top - 3, top, 46, 30, { chunk: c, taper: 0.4 });
    if (near) for (const e of [-1, 0, 1]) for (const o of [-1, 1]) block('concrete', s + e * 14, o * 16.2, 4, top - 5.5, 5, 0.6, { chunk: c });
  }
  // W1, the transition pier at the shoreline, and the steel bents A and B of the approach truss.
  {
    const s = S.W1, c = ck(s);
    block('concrete', s, 0, 0, BOTC(s) - 0.6, 10, 30, { chunk: c, taper: 0.6 });
    for (const sb of truss.bents) {
      const t = BOTC(sb) - 0.6, cb = ck(sb), lift = (y) => clamp01(y / t);
      for (const o of [-1, 1]) bar('steel', P(sb, o * (TH + 1.4), 0), P(sb, o * (TH + 0.9), t), 1.4, 1.4, { chunk: cb, lift });
      bar('steel', P(sb, -TH - 1.8, t - 0.8), P(sb, TH + 1.8, t - 0.8), 1.6, 1.6, { side: tan(sb), chunk: cb, lift });
      if (near) for (const [y0, y1] of [[2, t * 0.5], [t * 0.5, t - 1.6]]) {
        bar('steel', P(sb, -TH - 1.2, y0), P(sb, TH + 1.0, y1), 0.6, 0.6, { side: tan(sb), chunk: cb, lift });
        bar('steel', P(sb, TH + 1.2, y0), P(sb, -TH - 1.0, y1), 0.6, 0.6, { side: tan(sb), chunk: cb, lift });
      }
    }
  }
  // W7, the Yerba Buena Island anchorage pier, and its cable housings.
  {
    const s = S.W7, c = ck(s), dk = h(s), top = BOTC(s) - 0.6;
    block('concrete', s, 0, 0, top, 38, 32, { chunk: c, taper: 0.8 });
    for (const o of [-1, 1]) block('concrete', s + 4, o * 14.4, top, dk + 3.6, 22, 7.0, { chunk: c, taper: 0.5 });
  }

  // ---- 6. Main cables and suspenders ----------------------------------------------------------------------
  const sides = near ? 8 : 5;
  for (const span of CABLE_SPANS) {
    const n = Math.max(4, Math.round((span.s1 - span.s0) / (near ? 22 : 44)));
    for (const o of [-1, 1]) {
      const pts = Array.from({ length: n + 1 }, (_, i) => { const s = span.s0 + (span.s1 - span.s0) * i / n; return { s, d: o * span.lat(s), y: cableY(span, s) }; });
      const pos = [], idx = [];
      pts.forEach((q, i) => {
        const a = pts[Math.max(0, i - 1)], c = pts[Math.min(n, i + 1)];
        const A = new Vector3(...P(a.s, a.d, a.y)), C = new Vector3(...P(c.s, c.d, c.y)), axis = C.sub(A).normalize();
        const u = new Vector3().crossVectors(axis, new Vector3(0, 1, 0)).normalize(), v = new Vector3().crossVectors(u, axis).normalize();
        const centre = new Vector3(...P(q.s, q.d, q.y));
        for (let j = 0; j < sides; j++) { const ang = j / sides * Math.PI * 2; pos.push(...centre.clone().addScaledVector(u, Math.cos(ang) * CABLE_R).addScaledVector(v, Math.sin(ang) * CABLE_R).toArray()); }
        if (i) for (let j = 0; j < sides; j++) { const jj = (j + 1) % sides, a0 = (i - 1) * sides, b0 = i * sides; idx.push(a0 + j, b0 + j, a0 + jj, a0 + jj, b0 + j, b0 + jj); }
      });
      k.mesh('cable', pos, idx, 0, 0);
      // Suspenders about 30 ft apart (612 cable bands on the two cables), from the cable to the top chord.
      // The north side carries the Bay Lights.
      if (!span.hangers) continue;
      const count = Math.round((span.s1 - span.s0) / 9.2);
      for (let i = 1; i < count; i += near ? 1 : 4) {
        const s = span.s0 + (span.s1 - span.s0) * i / count, y = cableY(span, s), y0 = TOPC(s) + 0.5;
        if (y - y0 < 1.2) continue;
        bar(o < 0 ? 'bay' : near ? 'hanger' : 'cable', P(s, o * span.lat(s), y - CABLE_R * 0.5), P(s, o * TH, y0), near ? 0.22 : 0.32, near ? 0.22 : 0.32, { chunk: 0, lift: (yy) => (yy < y0 + 0.5 ? 1 : 0) });
      }
    }
  }

  // ---- 7. San Francisco approach: portal bents under the westbound viaduct and the eastbound ramp ---------
  for (let s = 40; s < T_START - 22; s += 32) {
    const top = h(s) - 2.3;
    if (top < 3) continue;
    const c = ck(s), lift = (y) => clamp01(y / top);
    const eb = s >= S_EB_DRAW ? ebMid(s) : null, dR = eb === null ? KERB + 1.4 : Math.max(KERB + 1.4, eb + KERB + 1.6), dL = -KERB - 1.4;
    for (const d of [dL, dR]) bar('concrete', P(s, d, 0), P(s, d, top), 1.6, 1.6, { chunk: c, lift });
    bar('concrete', P(s, dL - 0.8, top - 0.8), P(s, dR + 0.8, top - 0.8), 1.8, 1.6, { side: tan(s), chunk: c, lift });
    if (eb !== null && lower(s) > 3) bar('concrete', P(s, dL - 0.8, lowY(s) - 1.3 - 0.7), P(s, dR + 0.8, lowY(s) - 1.3 - 0.7), 1.6, 1.4, { side: tan(s), chunk: c, lift });
  }

  // ---- 8. Yerba Buena Island: double-deck viaduct and the tunnel ------------------------------------------
  for (let s = T_END + 14; s < S_WEST_PORTAL - 6; s += 30) {
    const top = h(s) - 1.9, c = ck(s), lift = (y) => clamp01(y / top);
    for (const o of [-1, 1]) bar('concrete', P(s, o * (KERB + 1.6), 0), P(s, o * (KERB + 1.6), top), 1.6, 1.6, { chunk: c, lift });
    bar('concrete', P(s, -KERB - 2.4, top - 0.8), P(s, KERB + 2.4, top - 0.8), 1.8, 1.6, { side: tan(s), chunk: c, lift });
    if (lower(s) > 3) bar('concrete', P(s, -KERB - 2.4, lowY(s) - 1.25), P(s, KERB + 2.4, lowY(s) - 1.25), 1.6, 1.4, { side: tan(s), chunk: c, lift });
  }
  // The tunnel through the island, drawn as its concrete tube on the flat map: 76 ft wide overall.
  along(S_WEST_PORTAL, L, (st, c) => {
    slab('concrete', st, () => -11.6, () => 11.6, (s) => h(s) + 6.6, 1.2, { chunk: c });
    for (const o of [-1, 1]) wall('concrete', st, () => (o < 0 ? -11.6 : 10.4), () => (o < 0 ? -10.4 : 11.6), () => 0, (s) => h(s) + 5.45, { chunk: c, lift: 1 });
  });
  {
    // The portal: "three planes of broad arches over the crown ... and a raising of the portal by
    // concrete blocks pyramided up" (HAER), a dark arched bore, and wing walls splayed toward the bridge.
    const WP = S_WEST_PORTAL, c = ck(WP), dk = h(WP), R = 10.4, yS = dk + 0.5, crown = yS + R, top = crown + 3.2;
    const segs = near ? 12 : 6;
    const q = p.bridgePoint(WP, 0), T = new Vector3(q.tx, 0, q.tz), N = new Vector3(-q.tz, 0, q.tx), UP = new Vector3(0, 1, 0);
    // Shapes are drawn in (lateral, height) and extruded westward (out of the tunnel) from `at`.
    const place = (geometry, mat, at, ck2 = c) => {
      const o = p.bridgePoint(at, 0);
      geometry.applyMatrix4(new Matrix4().makeBasis(N, UP, T.clone().negate()).setPosition(o.x, 0, o.z));
      b.put(geometry, mat, ck2, 1);   // the portal moves with the deck (Full 3D world: into the hillside)
    };
    const arch = (path, r, from, to) => path.absarc(0, yS, r, from, to, from > to);
    const face = new Shape([[-16, 0], [16, 0], [16, top], [-16, top]].map(([x, y]) => new Vector3(x, y, 0)));
    const bore = new Path(); bore.moveTo(R, 0); bore.lineTo(R, yS); arch(bore, R, 0, Math.PI); bore.lineTo(-R, 0); bore.lineTo(R, 0);
    face.holes.push(bore);
    place(new ExtrudeGeometry(face, { depth: 1.8, bevelEnabled: false, curveSegments: segs }), 'concrete', WP);
    for (const [r0, r1, d] of [[R, R + 1.4, 0.5], [R + 1.4, R + 2.8, 1.0]]) {
      const ring = new Shape(); ring.moveTo(r1, yS); arch(ring, r1, 0, Math.PI); ring.lineTo(-r0, yS); arch(ring, r0, Math.PI, 0); ring.lineTo(r1, yS);
      place(new ExtrudeGeometry(ring, { depth: d, bevelEnabled: false, curveSegments: segs }), 'concrete', WP - 1.8);
    }
    // Inside the bore above the tunnel roof: dark.
    const yr = dk + 5.4, a0 = Math.asin((yr - yS) / R), dark = new Shape();
    dark.moveTo(R * Math.cos(a0), yr); dark.absarc(0, yS, R, a0, Math.PI - a0, false); dark.lineTo(R * Math.cos(a0), yr);
    if (near) place(new ShapeGeometry(dark, segs), 'void', WP - 0.9);
    // Blocks pyramided over the crown.
    block('concrete', WP - 1.1, 0, top, top + 1.5, 1.4, 20, { chunk: c, lift: 1 });
    block('concrete', WP - 1.2, 0, top + 1.5, top + 2.8, 1.0, 10, { chunk: c, lift: 1 });
    // Wing walls: 20 m long, splayed 35 degrees, falling from the portal to the ground.
    for (const o of [-1, 1]) {
      const w = T.clone().negate().multiplyScalar(Math.cos(0.61)).addScaledVector(N, o * Math.sin(0.61)).normalize();
      const wing = new Shape([[0, 0], [20, 0], [20, 1.4], [0, top - 2]].map(([x, y]) => new Vector3(x, y, 0)));
      const g = new ExtrudeGeometry(wing, { depth: 1.2, bevelEnabled: false });
      const z = new Vector3().crossVectors(w, UP), e = p.bridgePoint(WP - 1.8, o * 15.4);
      g.applyMatrix4(new Matrix4().makeBasis(w, UP, z).setPosition(e.x - z.x * 0.6, 0, e.z - z.z * 0.6));
      b.put(g, 'concrete', c, 1);
    }
  }
  return b.finish();
}
