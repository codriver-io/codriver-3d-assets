import { BufferGeometry, Float32BufferAttribute, Vector3 } from 'three';
import { bridgeBuilder } from '../../asset-geometry.js';
import { PROFILE as p } from './pont-dubuc-profile.js';
import {
  h, BRIDGE_START, BRIDGE_END, CREST_S, KNEE_S, KNEE_N, VC_TOP, DECK_HALF, KERB, MEDIAN, STEEL_END,
  P1, RIVER_PIERS, PAVE, SLAB_TOP, SLAB_BOT, BARRIER, BARRIER_H, WALK, WALK_H, PARAPET, PARAPET_H, RAIL_H, BOX_TOP,
  BOX_BOT, FASCIA_D, FASCIA_DEPTH, BRACKET, UNDERSIDE, boxBottom, BOX_MIN_DECK, COL_D, COL, HEAD, HEAD_FRAC, WALL_TOP,
  BATTER_TOP, BATTER_OUT, WALL_T, WALL_END, P1_HALF, P1_T, P1_CAP, LAMPS, POLE_H, ARM,
} from './pont-dubuc-structure.js';

/**
 * Pont Dubuc: Route 175 over the Saguenay at Chicoutimi, 1972. A long, low, plain girder bridge: a dark
 * green steel box under the middle of a 22.8 m deck, with inclined brackets reaching out to fascia girders
 * at the edges (the diagonal rhythm under the deck), carried over seven spans by six pale twin-column
 * concrete piers whose columns rise from a battered wall, and a concrete end pier at the Chicoutimi end.
 * Four lanes either side of a median wall with 13 double-arm lamp posts, a sidewalk behind a barrier and a
 * railed parapet on each side. Real metres, +X east, +Y up, +Z south, built on the mapped Route 175
 * alignment (pont-dubuc-profile.js) so it is one surface with the car, route and HD road.
 */
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = bridgeBuilder(p, detail), L = p.BRIDGE_LENGTH;
  // Three spatial chunks (near only): south third, middle, north third.
  const CUTS = [190, 350];
  const chunk = (s) => (near ? CUTS.filter((c) => s >= c).length : 0);
  const frame = (s) => { const q = p.bridgePoint(s, 0); return { T: new Vector3(q.tx, 0, q.tz), N: new Vector3(-q.tz, 0, q.tx) }; };
  const P = (s, d, y) => { const q = p.bridgePoint(s, d, y); return new Vector3(q.x, y, q.z); };

  // ---- Mesh helpers -------------------------------------------------------------------------------
  const lists = new Map();
  function list(mat, ck, lift) {
    const key = `${mat}|${ck}|${typeof lift === 'function' ? lift.key : lift}`;
    if (!lists.has(key)) lists.set(key, { mat, ck, lift, pos: [], idx: [] });
    return lists.get(key);
  }
  /** A quad A-B-C-D whose front faces away from `inside` (a point within the solid). */
  function quad(l, A, B, C, D, inside) {
    const n = new Vector3().subVectors(B, A).cross(new Vector3().subVectors(C, A));
    if (n.lengthSq() < 1e-10) { n.subVectors(C, A).cross(new Vector3().subVectors(D, A)); if (n.lengthSq() < 1e-10) return; }
    const mid = A.clone().add(B).add(C).add(D).multiplyScalar(0.25);
    const i = l.pos.length / 3;
    for (const v of n.dot(mid.sub(inside)) >= 0 ? [A, B, C, D] : [A, D, C, B]) l.pos.push(v.x, v.y, v.z);
    l.idx.push(i, i + 1, i + 2, i, i + 2, i + 3);
  }
  /** A triangle facing away from `inside`. */
  function tri(l, A, B, C, inside) {
    const n = new Vector3().subVectors(B, A).cross(new Vector3().subVectors(C, A));
    if (n.lengthSq() < 1e-10) return;
    const mid = A.clone().add(B).add(C).multiplyScalar(1 / 3), i = l.pos.length / 3;
    for (const v of n.dot(mid.sub(inside)) >= 0 ? [A, B, C] : [A, C, B]) l.pos.push(v.x, v.y, v.z);
    l.idx.push(i, i + 1, i + 2);
  }
  /** A straight bar of square section between two points (open ends), merged per material. */
  function bar(mat, A, B, w, t, ck, lift = 1, s = null) {
    const axis = new Vector3().subVectors(B, A), len = axis.length();
    if (len < 1e-3) return;
    axis.divideScalar(len);
    const { T, N } = frame(s ?? p.projectBridge((A.x + B.x) / 2, (A.z + B.z) / 2).s);
    let u = new Vector3().crossVectors(axis, T);
    if (u.lengthSq() < 0.09) u = new Vector3().crossVectors(axis, N);
    u.normalize();
    const v = new Vector3().crossVectors(u, axis).normalize(), l = list(mat, ck, lift), c = [];
    for (const E of [A, B]) for (const [i, j] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) c.push(E.clone().addScaledVector(u, i * w / 2).addScaledVector(v, j * t / 2));
    const mid = A.clone().add(B).multiplyScalar(0.5);
    for (let k = 0; k < 4; k++) { const k2 = (k + 1) % 4; quad(l, c[k], c[k2], c[4 + k2], c[4 + k], mid); }
  }
  /** A box in the bridge frame: centre (s, d, y), size along/across/up. */
  const box = (mat, s, d, y, along, across, up, ck, lift = 1) => b.box(mat, s, d, y, along, across, up, ck, lift);

  // Stations where the deck bends (the ramp eases and the crest curve) are sampled every STEP, the constant
  // grades every 30 m (exact: the grade is linear), plus each knee and cut.
  const STEP = near ? 5 : 10;
  const curved = (s) => s < KNEE_S + 1 || s > L - KNEE_N - 1 || Math.abs(s - CREST_S) < VC_TOP / 2 + 1;
  function stations(a, c) {
    const set = new Set([a, c]);
    for (let s = Math.ceil(a / STEP) * STEP; s < c; s += STEP) if (curved(s) || s % 30 === 0) set.add(s);
    for (const v of [KNEE_S, L - KNEE_N, CREST_S - VC_TOP / 2, CREST_S + VC_TOP / 2, ...CUTS]) if (v > a && v < c) set.add(v);
    return [...set].sort((u, v) => u - v).filter((s, i, all) => !i || s - all[i - 1] > 0.05);
  }
  /**
   * Sweep a closed cross-section along the deck between stations a and c. `section(s)` returns the
   * polygon's [d, y] corners (absolute heights) in order; every face gets its own vertices so edges stay
   * crisp, faces turn outward, and both ends are capped (`caps` false leaves them open). `skip` lists
   * edge indices to leave out (faces nobody sees, e.g. a top buried under the slab).
   */
  function sweep(mat, a, c, section, ck, lift = 1, { caps = true, skip = [] } = {}) {
    const ss = stations(a, c), l = list(mat, ck, lift);
    const rings = ss.map((s) => section(s).map(([d, y]) => P(s, d, y)));
    const centre = (r) => r.reduce((m, v) => m.add(v), new Vector3()).multiplyScalar(1 / r.length);
    for (let i = 1; i < rings.length; i++) {
      const r0 = rings[i - 1], r1 = rings[i], inside = centre(r0).add(centre(r1)).multiplyScalar(0.5);
      for (let k = 0; k < r0.length; k++) if (!skip.includes(k)) { const k2 = (k + 1) % r0.length; quad(l, r0[k], r0[k2], r1[k2], r1[k], inside); }
    }
    if (!caps) return;
    for (const [r, dir] of [[rings[0], -1], [rings.at(-1), 1]]) {
      const cc = centre(r), s = dir < 0 ? ss[0] : ss.at(-1), { T } = frame(s), inside = cc.clone().addScaledVector(T, -dir);
      for (let k = 1; k + 1 < r.length; k++) tri(l, r[0], r[k], r[k + 1], inside);
    }
  }
  /** A rectangular strip lateral lo..hi, top at deck + top, bottom at deck + bot (never below `floor`). */
  const slab = (lo, hi, top, bot, floor = -PAVE) => (s) => { const y = Math.max(h(s) + bot, floor); return [[lo, h(s) + top], [hi, h(s) + top], [hi, y], [lo, y]]; };
  /** The same split at the chunk cuts. */
  function deck(mat, a, c, section, lift = 1, opts) {
    const cuts = near ? [a, ...CUTS.filter((v) => v > a && v < c), c] : [a, c];
    for (let i = 1; i < cuts.length; i++) sweep(mat, cuts[i - 1], cuts[i], section, chunk((cuts[i - 1] + cuts[i]) / 2), lift, opts);
  }

  // ---- Deck surface and kerbs, abutment to abutment ---------------------------------------------------
  // Where the west sidewalk ramps away from the deck (mapped 1387995414, 11 m south of the bridge end).
  const WEST_WALK_START = BRIDGE_START - 11;
  // (the pavement's underside floors 4 cm above the deck slab's at the ramp feet, where both reach grade: they were coplanar)
  deck('asphalt', 0, L, slab(-KERB - 0.05, KERB + 0.05, 0, -PAVE, -PAVE + 0.04));
  deck('concrete', 0, L, slab(-MEDIAN, MEDIAN, BARRIER_H, -0.1));
  for (const o of [-1, 1]) {
    const [lo, hi] = BARRIER, [wl, wh] = WALK, [pl, ph] = PARAPET, from = o < 0 ? WEST_WALK_START : 0;
    const side = (a, c) => (o < 0 ? [-c, -a] : [a, c]);
    deck('concrete', 0, L, slab(...side(lo, hi), BARRIER_H, -PAVE));
    deck('concrete', from, L, slab(...side(wl, wh), WALK_H, SLAB_TOP - 0.06));
    deck('concrete', from, L, slab(...side(pl, ph), PARAPET_H, SLAB_BOT - 0.15));
  }
  // The deck slab under everything, edge to edge (its top is buried under the pavement and sidewalks).
  deck('concrete', 0, L, slab(-DECK_HALF + 0.02, DECK_HALF - 0.02, SLAB_TOP, SLAB_BOT), 1, { skip: [0] });

  // Railings on the parapets (near): a solid galvanised panel on the concrete parapet under one top bar, as
  // one prism per segment (the open railing's posts and mid rail were 3.3 k triangles of sub-pixel members).
  // Far drops the railing; the lamp posts keep the `rail` material.
  if (near) for (const o of [-1, 1]) {
    const d = o * (PARAPET[0] + PARAPET[1]) / 2, from = o < 0 ? WEST_WALK_START : 0;
    const y0 = (s) => h(s) + PARAPET_H, y1 = (s) => h(s) + RAIL_H - 0.06, y2 = (s) => h(s) + RAIL_H + 0.06;
    deck('rail', from, L, (s) => [[d - 0.06, y2(s)], [d + 0.06, y2(s)], [d + 0.06, y1(s)], [d + 0.03, y1(s)], [d + 0.03, y0(s)], [d - 0.03, y0(s)], [d - 0.03, y1(s)], [d - 0.06, y1(s)]], 1, { caps: false, skip: [2, 4, 6] });
  }

  // Lane paint (the HD pavement's own paint replaces it in the app): edge lines and the lane dashes.
  if (near) {
    const line = (d, a, c, w = 0.15) => sweep('paint', a, c, (s) => [[d - w / 2, h(s) + 0.02], [d + w / 2, h(s) + 0.02], [d + w / 2, h(s) + 0.005], [d - w / 2, h(s) + 0.005]], chunk((a + c) / 2), 1, { skip: [2], caps: false });
    const cuts = [0, ...CUTS, L];
    for (let k = 1; k < cuts.length; k++) for (const d of [-KERB + 0.35, -MEDIAN - 0.3, MEDIAN + 0.3, KERB - 0.35]) line(d, cuts[k - 1], cuts[k]);
    for (let s = 4; s < L - 6; s += 12) for (const d of [-(KERB + MEDIAN) / 2, (KERB + MEDIAN) / 2]) line(d, s, s + 3, 0.13);
  }

  // ---- The steel: the box, the fascia girders and the brackets ---------------------------------------
  // On the flat map the box ends where the deck is too low to hold it (the solid ramps take over).
  let boxN = STEEL_END; while (h(boxN) < BOX_MIN_DECK) boxN -= 0.5;
  // The box runs on over P1 to the south abutment (the mapped bridge start), as far as the deck can hold it.
  let boxS = P1; while (boxS - 0.5 >= BRIDGE_START && h(boxS - 0.5) >= BOX_MIN_DECK) boxS -= 0.5;
  const under = SLAB_BOT + 0.02;   // the steel tucks 2 cm into the slab
  deck('steel', boxS, boxN, (s) => [[-BOX_TOP, h(s) + under], [BOX_TOP, h(s) + under], [BOX_BOT, boxBottom(s)], [-BOX_BOT, boxBottom(s)]], 1, { skip: [0] });
  const fasciaBottom = (s) => Math.max(h(s) + SLAB_BOT - FASCIA_DEPTH, Math.min(boxBottom(s) + 0.4, h(s) + SLAB_BOT - 0.3));
  // (the outer face is inset 2 cm: at P1 the cap beam's side face is at the same lateral, and they were coplanar)
  for (const o of [-1, 1]) deck('steel', boxS, boxN, (s) => [[o * (FASCIA_D - 0.2), h(s) + under], [o * (FASCIA_D + 0.18), h(s) + under], [o * (FASCIA_D + 0.18), fasciaBottom(s)], [o * (FASCIA_D - 0.2), fasciaBottom(s)]], 1, { skip: [0] });
  // Brackets: an inclined strut from the box's bottom corner to the fascia girder's bottom flange and a
  // floor beam under the slab, every BRACKET metres (far: every other one, struts only).
  // (counted from P1, where the steel used to start, so the spans keep their rhythm)
  const n = Math.floor((boxN - P1) / BRACKET), k0 = Math.floor((boxS - P1) / BRACKET) + 1;
  for (let k = k0; k < n; k++) {
    if (!near && k % 2) continue;
    const s = P1 + k * BRACKET, y = h(s), ck = chunk(s), bot = boxBottom(s);
    if (s < boxS + 0.5 || !k) continue;
    if (y + UNDERSIDE < 0.5) continue;   // too close to grade on the flat map
    for (const o of [-1, 1]) {
      bar('steel', P(s, o * (BOX_BOT + 0.1), bot + 0.25), P(s, o * (FASCIA_D - 0.15), fasciaBottom(s) + 0.2), near ? 0.35 : 0.5, near ? 0.3 : 0.45, ck, 1, s);
      if (near) bar('steel', P(s, o * (BOX_TOP - 0.1), y + SLAB_BOT - 0.25), P(s, o * (FASCIA_D - 0.15), y + SLAB_BOT - 0.25), 0.3, 0.45, ck, 1, s);
    }
  }

  // ---- Piers -------------------------------------------------------------------------------------------
  /** Lift weight proportional to height (0 on the river bed, 1 at the bearing): the pier stretches whole. */
  const prop = (top) => Object.assign((y) => Math.max(0, Math.min(1, y / Math.max(top, 1e-3))), { key: `prop:${top.toFixed(3)}` });
  /** A prism: polygon [d, y] extruded along the bridge at station s between along offsets a0..a1. */
  function prism(mat, s, poly, a0, a1, ck, lift, skipBottom = true) {
    const l = list(mat, ck, lift), r0 = poly.map(([d, y]) => P(s + a0, d, y)), r1 = poly.map(([d, y]) => P(s + a1, d, y));
    const inside = P(s + (a0 + a1) / 2, poly.reduce((m, q) => m + q[0], 0) / poly.length, poly.reduce((m, q) => m + q[1], 0) / poly.length);
    for (let k = 0; k < poly.length; k++) {
      const k2 = (k + 1) % poly.length;
      if (skipBottom && poly[k][1] <= 1e-6 && poly[k2][1] <= 1e-6) continue;
      quad(l, r0[k], r0[k2], r1[k2], r1[k], inside);
    }
    for (const r of [r0, r1]) for (let k = 1; k + 1 < r.length; k++) tri(l, r[0], r[k], r[k + 1], inside);
  }
  /** Square column of side w from y0 to y1 at (s, d), open bottom. */
  const column = (mat, s, d, y0, y1, w, ck, lift) => prism(mat, s, [[d - w / 2, y0], [d + w / 2, y0], [d + w / 2, y1], [d - w / 2, y1]], -w / 2, w / 2, ck, lift, y0 <= 1e-6);
  for (const s of RIVER_PIERS) {
    const H = boxBottom(s), ck = chunk(s), lift = prop(H), out = WALL_END + BATTER_OUT * H;
    for (const d of [-COL_D, COL_D]) {
      column('concrete', s, d, 0, H * (1 - HEAD_FRAC) + 0.01, COL, ck, lift);
      column('concrete', s, d, H * (1 - HEAD_FRAC), H, HEAD, ck, lift);
    }
    // The wall between the columns, battered out at both ends below BATTER_TOP.
    prism('concrete', s, [[-out, 0], [out, 0], [WALL_END, BATTER_TOP * H], [WALL_END, WALL_TOP * H], [-WALL_END, WALL_TOP * H], [-WALL_END, BATTER_TOP * H]], -WALL_T / 2, WALL_T / 2, ck, lift);
  }
  // P1, the concrete end pier where the steel starts: a wall under a cap beam the width of the deck.
  {
    const top = h(P1) + SLAB_BOT - 0.01, capBot = Math.max(top - P1_CAP, 0), lift = prop(top);
    prism('concrete', P1, [[-DECK_HALF + 0.4, capBot], [DECK_HALF - 0.4, capBot], [DECK_HALF - 0.4, top], [-DECK_HALF + 0.4, top]], -P1_T / 2, P1_T / 2, chunk(P1), lift, false);
    if (capBot > 0.05) prism('concrete', P1, [[-P1_HALF, 0], [P1_HALF, 0], [P1_HALF, capBot + 0.01], [-P1_HALF, capBot + 0.01]], -P1_T / 2 + 0.15, P1_T / 2 - 0.15, chunk(P1), lift);
  }
  // Beyond the steel the deck runs on solid ramps between retaining walls down to the alignment ends (on
  // the flat map: in Full 3D world their base stays on the ground and their top follows the real deck).
  function solid(s0, s1, ck) {
    const half = DECK_HALF - 0.04;
    sweep('concrete', s0, s1, (s) => [[-half, Math.max(h(s) + SLAB_BOT + 0.01, 0.02)], [half, Math.max(h(s) + SLAB_BOT + 0.01, 0.02)], [half, 0], [-half, 0]], ck, (y) => (y > 0.01 ? 1 : 0), { skip: [0, 2] });
  }
  let footS = 0; while (h(footS) + SLAB_BOT < 0.05) footS += 0.5;
  let footN = L; while (h(footN) + SLAB_BOT < 0.05) footN -= 0.5;
  solid(footS, boxS + 0.25, chunk(0));
  solid(boxN - 0.25, footN, chunk(L));

  // ---- Lamps: 13 double-arm posts on the median wall --------------------------------------------------
  for (const s of LAMPS) {
    const y = h(s), ck = chunk(s), top = y + POLE_H;
    bar('rail', P(s, 0, y + BARRIER_H - 0.05), P(s, 0, top), near ? 0.3 : 0.45, near ? 0.3 : 0.45, ck, 1, s);
    for (const o of [-1, 1]) {
      bar('rail', P(s, 0, top - 0.4), P(s, o * ARM, top + 0.15), near ? 0.14 : 0.25, near ? 0.14 : 0.25, ck, 1, s);
      box('lamp', s, o * (ARM + 0.35), top + 0.05, 0.5, 0.9, 0.3, ck);
    }
  }

  for (const l of lists.values()) {
    if (!l.idx.length) continue;
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(l.pos, 3)); g.setIndex(l.idx); g.computeVertexNormals();
    b.put(g, l.mat, l.ck, l.lift);
  }
  return b.finish();
}
