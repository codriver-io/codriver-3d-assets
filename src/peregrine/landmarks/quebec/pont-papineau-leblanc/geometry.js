import { BufferGeometry, Float32BufferAttribute, Vector3 } from 'three';
import { bridgeBuilder } from '../../asset-geometry.js';
import { PROFILE as p } from './pont-papineau-leblanc-profile.js';
import {
  h, PYLON_S, PYLON_W, pylonTop, STAYS, STAY_D, ANCHOR_UP, PLATE_TOP, PLATE, FASCIA_IN, FASCIA_BOT, BOX_TOP_HALF,
  BOX_BOT_HALF, BOX_BOT, RIB_STEP, END_GIRDER_D, END_GIRDER, PARAPET_TOP, CURB_TOP, MEDIAN_SLAB, MEDIAN_WALL, MEDIAN_TOP,
  END_PIER_S, PIER_R0, PIER_R1, STAYED_START, STAYED_END, BRIDGE_START, BRIDGE_END, DECK_HALF, KERB, MEDIAN,
  PVI_S, VC,
} from './pont-papineau-leblanc-structure.js';

const clamp01 = (v) => Math.max(0, Math.min(1, v));

/**
 * Pont Papineau-Leblanc: the 1969 A-19 crossing of the Rivière des Prairies between Laval and Montréal, one
 * of the first cable-stayed bridges in North America. A rust-brown weathering-steel box girder carries six
 * lanes over a 241 m main span and two 90 m side spans; two single square steel pylons stand in the median,
 * 38.4 m above the deck, each holding a fan of two stays a side in the central plane, on round concrete
 * piers in the river. Real metres, +X east, +Y up, +Z south, built on the mapped A-19 alignment
 * (pont-papineau-leblanc-profile.js) so it is one surface with the car, route and HD road.
 */
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = bridgeBuilder(p, detail), L = p.BRIDGE_LENGTH;
  // Three spatial chunks (near only): Laval ramp and north side span, the main span, south side span and
  // the Montréal ramp.
  const CUTS = [PYLON_S[0] + 50, PYLON_S[1] - 50];
  const chunk = (s) => (near ? CUTS.filter((c) => s >= c).length : 0);
  const frame = (s) => { const q = p.bridgePoint(s, 0); return { T: new Vector3(q.tx, 0, q.tz), N: new Vector3(-q.tz, 0, q.tx) }; };
  const P = (s, d, y) => { const q = p.bridgePoint(s, d, y); return new Vector3(q.x, y, q.z); };
  // Far drops the darker box-girder material into the steel (one fewer draw).
  const GIRDER = near ? 'girder' : 'steel';

  // ---- Mesh helpers (the Pont Laviolette's) -----------------------------------------------------------
  const lists = new Map();
  function list(mat, ck, lift) {
    const key = `${mat}|${ck}|${typeof lift === 'function' ? lift.key : lift}`;
    if (!lists.has(key)) lists.set(key, { mat, ck, lift, pos: [], idx: [] });
    return lists.get(key);
  }
  const liftBelow = (top, foot = 0) => Object.assign((y) => clamp01((y - foot) / Math.max(1, top - foot)), { key: `below:${top.toFixed(2)}:${foot}` });
  const _e1 = new Vector3(), _e2 = new Vector3();
  function quad(l, A, B, C, D) {
    if (_e1.subVectors(C, A).cross(_e2.subVectors(D, B)).lengthSq() < 1e-8) return;
    const i = l.pos.length / 3;
    l.pos.push(A.x, A.y, A.z, B.x, B.y, B.z, C.x, C.y, C.z, D.x, D.y, D.z);
    l.idx.push(i, i + 1, i + 2, i, i + 2, i + 3);
  }
  /** A quad whose front faces `out` (a direction away from the solid). */
  function face(l, A, B, C, D, out) {
    const n = new Vector3().subVectors(B, A).cross(new Vector3().subVectors(C, A));
    if (n.dot(out) >= 0) quad(l, A, B, C, D); else quad(l, A, D, C, B);
  }
  /** An open box (four sides, no end caps) between two points, `w` wide across the bridge (or along it for
   * a transverse member), `t` thick. */
  function member(mat, A, B, w, t, ck = 0, lift = 1, s = null) {
    const axis = new Vector3().subVectors(B, A), len = axis.length();
    if (len < 1e-3) return;
    axis.divideScalar(len);
    const { T, N } = frame(s ?? p.projectBridge((A.x + B.x) / 2, (A.z + B.z) / 2).s);
    let u = new Vector3().crossVectors(axis, T);
    if (u.lengthSq() < 0.09) u = new Vector3().crossVectors(axis, N);
    u.normalize();
    const v = new Vector3().crossVectors(u, axis).normalize(), l = list(mat, ck, lift), c = [];
    for (const E of [A, B]) for (const [i, j] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) c.push(E.clone().addScaledVector(u, i * w / 2).addScaledVector(v, j * t / 2));
    for (let k = 0; k < 4; k++) {
      const k2 = (k + 1) % 4, mid = c[k].clone().add(c[k2]).multiplyScalar(0.5).sub(A);
      face(l, c[k], c[k2], c[4 + k2], c[4 + k], mid.addScaledVector(axis, -mid.dot(axis)));
    }
  }
  /** A closed box in the bridge frame: centre (s, d, y), size along/across/up. */
  const box = (mat, s, d, y, along, across, up, ck, lift = 1) => b.box(mat, s, d, y, along, across, up, ck, lift);

  // Stations where the deck bends (the vertical curves): ribbons are sampled every STEP there and every 40 m
  // on the constant grades (exact: the grade is linear), plus every alignment vertex and cut.
  const STEP = near ? 6 : 12;
  const BENDS = PVI_S.map((s, i) => [s, Object.values(VC)[i]]);
  const curved = (s) => BENDS.some(([c, vc]) => Math.abs(s - c) < vc / 2 + 1);
  function stations(a, c) {
    const set = new Set([a, c]);
    for (let s = Math.ceil(a / STEP) * STEP; s < c; s += STEP) if (curved(s) || s % 40 === 0) set.add(s);
    for (const v of [...BENDS.flatMap(([s, vc]) => [s - vc / 2, s + vc / 2]), ...p.ALIGNMENT.map((q) => q.s)]) if (v > a && v < c) set.add(v);
    return [...set].sort((u, v) => u - v).filter((s, i, all) => !i || s - all[i - 1] > 0.05);
  }
  /**
   * A prism lofted along the deck between stations a and c: `section` is a closed polygon of [d, dy]
   * (dy relative to the road surface h(s)), its faces kept crisp (own vertices) and turned outwards; end
   * caps closed. `section` may be a function of s.
   */
  function loft(mat, a, c, section, ck, lift = 1) {
    const secAt = typeof section === 'function' ? section : () => section;
    const ss = stations(a, c), l = list(mat, ck, lift);
    const rings = ss.map((s) => secAt(s).map(([d, dy]) => P(s, d, h(s) + dy)));
    const n = rings[0].length;
    for (let i = 1; i < rings.length; i++) {
      const A = rings[i - 1], C = rings[i];
      const cen = A.reduce((m, v) => m.add(v), new Vector3()).multiplyScalar(1 / n);
      for (let k = 0; k < n; k++) {
        const k2 = (k + 1) % n, out = A[k].clone().add(A[k2]).multiplyScalar(0.5).sub(cen);
        const T = new Vector3().subVectors(C[k], A[k]).normalize();
        face(l, A[k], A[k2], C[k2], C[k], out.addScaledVector(T, -out.dot(T)));
      }
    }
    for (const [ring, dir] of [[rings[0], -1], [rings.at(-1), 1]]) {
      const { T } = frame(dir < 0 ? a : c), out = T.clone().multiplyScalar(dir);
      for (let k = 1; k + 1 < n; k++) {
        const nn = new Vector3().subVectors(ring[k], ring[0]).cross(new Vector3().subVectors(ring[k + 1], ring[0]));
        const i = l.pos.length / 3, [A, B, C] = nn.dot(out) >= 0 ? [ring[0], ring[k], ring[k + 1]] : [ring[0], ring[k + 1], ring[k]];
        l.pos.push(A.x, A.y, A.z, B.x, B.y, B.z, C.x, C.y, C.z); l.idx.push(i, i + 1, i + 2);
      }
    }
  }
  /** A rectangle-section loft: lateral l..r, top at road + top, bottom at road + bot. */
  const slab = (mat, a, c, l, r, top, bot, ck, lift) => loft(mat, a, c, [[l, top], [r, top], [r, bot], [l, bot]], ck, lift);
  /** Split at the chunk cuts. */
  function along(fn, a, c) {
    const cuts = near ? [a, ...CUTS.filter((v) => v > a && v < c), c] : [a, c];
    for (let i = 1; i < cuts.length; i++) fn(cuts[i - 1], cuts[i], chunk((cuts[i - 1] + cuts[i]) / 2));
  }
  /** A flat ribbon (paint) on the road between stations a and c. */
  function ribbon(mat, a, c, l, r, off, ck) {
    const ss = stations(a, c), pos = [], idx = [];
    ss.forEach((s, i) => {
      pos.push(...b.xyz(s, l, h(s) + off), ...b.xyz(s, r, h(s) + off));
      if (i) { const x = (i - 1) * 2, y = i * 2; idx.push(x, x + 1, y, x + 1, y + 1, y); }
    });
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    b.put(g, mat, ck, 1);
  }

  // ---- The deck ----------------------------------------------------------------------------------------
  const A0 = BRIDGE_START, A1 = BRIDGE_END;
  // Pavement over the whole alignment (the approach roads' extensions included), 0.25 m thick.
  along((a, c, ck) => slab('asphalt', a, c, -KERB - 0.05, KERB + 0.05, 0, -0.25, ck), 0, L);
  // Orthotropic deck plate, abutment to abutment, cantilevered to the parapets.
  along((a, c, ck) => slab('steel', a, c, -DECK_HALF, DECK_HALF, PLATE_TOP, PLATE_TOP - PLATE, ck), A0, A1);
  // Fascia edge girders under the cantilever tips.
  for (const o of [-1, 1]) along((a, c, ck) => slab('steel', a, c, o < 0 ? -DECK_HALF + 0.02 : FASCIA_IN, o < 0 ? -FASCIA_IN : DECK_HALF - 0.02, PLATE_TOP - PLATE, FASCIA_BOT, ck), A0, A1);
  // The two-cell box girder across the cable-stayed unit: sloped webs, 12 m bottom flange.
  const boxSec = [[-BOX_TOP_HALF, PLATE_TOP - PLATE], [BOX_TOP_HALF, PLATE_TOP - PLATE], [BOX_BOT_HALF, BOX_BOT], [-BOX_BOT_HALF, BOX_BOT]];
  along((a, c, ck) => loft(GIRDER, a, c, boxSec, ck), STAYED_START, STAYED_END);
  // End spans to the abutments: shallow plate girders.
  for (const [a, c] of [[A0, STAYED_START], [STAYED_END, A1]]) {
    if (near) for (const d of END_GIRDER_D) slab(GIRDER, a, c, d - 0.3, d + 0.3, PLATE_TOP - PLATE, PLATE_TOP - PLATE - END_GIRDER, chunk(a));
    else slab(GIRDER, a, c, END_GIRDER_D[0] - 0.3, END_GIRDER_D.at(-1) + 0.3, PLATE_TOP - PLATE, PLATE_TOP - PLATE - END_GIRDER, 0);
  }
  // Cantilever ribs under the deck plate, from the box webs out to the fascia, every RIB_STEP (near).
  if (near) {
    for (let s = STAYED_START + RIB_STEP / 2; s < STAYED_END; s += RIB_STEP) {
      if (PYLON_S.some((ps) => Math.abs(s - ps) < 1.5)) continue;
      const y = h(s) + PLATE_TOP - PLATE;
      for (const o of [-1, 1]) member(GIRDER, P(s, o * (BOX_TOP_HALF - 0.3), y - 0.45), P(s, o * FASCIA_IN, y - 0.45), 0.9, 0.3, chunk(s), 1, s);
    }
  }
  // Outer parapets (concrete) the whole bridge and along the ramps; the median from abutment to abutment.
  // On the bridge a low concrete curb carries a steel rail on posts every 6 m (photographs 1 and 5); on the ramps the
  // retaining walls carry a full concrete parapet.
  for (const o of [-1, 1]) {
    const [l, r] = o < 0 ? [-DECK_HALF, -KERB] : [KERB, DECK_HALF];
    for (const [a, c] of [[0, A0], [A1, L]]) slab('concrete', a, c, l, r, PARAPET_TOP, -0.3, chunk(a === 0 ? 0 : L));
    along((a, c, ck) => slab('concrete', a, c, l, r, CURB_TOP, -0.3, ck), A0, A1);
    const dr = o * (DECK_HALF - 0.42);
    along((a, c, ck) => slab('pole', a, c, dr - 0.12, dr + 0.12, PARAPET_TOP, PARAPET_TOP - 0.3, ck), A0, A1);
    for (let s = A0 + 3; near && s < A1 - 1; s += 6) member('pole', P(s, dr, h(s) + CURB_TOP - 0.05), P(s, dr, h(s) + PARAPET_TOP - 0.28), 0.14, 0.14, chunk(s), 1, s);
  }
  along((a, c, ck) => slab('concrete', a, c, -MEDIAN, MEDIAN, MEDIAN_SLAB, -0.2, ck), A0, A1);
  along((a, c, ck) => slab('concrete', a, c, -MEDIAN_WALL, MEDIAN_WALL, MEDIAN_TOP, MEDIAN_SLAB - 0.05, ck), A0, A1);

  // Beyond the abutments the flat-map ramps run on embankments between retaining walls (Full 3D world: on
  // the terrain roads): a solid wedge from the ramp foot to the abutment face. Its base stays on the ground.
  function solid(s0, s1, ck) {
    const n = Math.max(2, Math.ceil((s1 - s0) / 8)), pos = [], idx = [];
    for (let i = 0; i <= n; i++) {
      const s = s0 + (s1 - s0) * i / n, top = Math.max(h(s) - 0.25, 0.05);
      for (const [d, y] of [[-DECK_HALF, top], [DECK_HALF, top], [-DECK_HALF, 0], [DECK_HALF, 0]]) pos.push(...b.xyz(s, d, y));
      if (!i) continue;
      const u = (i - 1) * 4, v = i * 4;
      idx.push(u, u + 1, v, u + 1, v + 1, v, u, v, u + 2, u + 2, v, v + 2, u + 1, u + 3, v + 1, u + 3, v + 3, v + 1);
    }
    idx.push(0, 2, 1, 1, 2, 3, n * 4, n * 4 + 1, n * 4 + 2, n * 4 + 1, n * 4 + 3, n * 4 + 2);
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    b.put(g, 'concrete', ck, (y) => (y > 0.05 ? 1 : 0));
  }
  let footN = 0; while (h(footN) < 0.3) footN += 0.5;
  let footS = L; while (h(footS) < 0.3) footS -= 0.5;
  solid(footN, A0, chunk(A0 - 1)); solid(A1, footS, chunk(A1 + 1));

  // Lane paint (the HD pavement's own paint replaces it in the app): edge lines and the lane dashes.
  if (near) {
    const cuts = [0, ...CUTS, L];
    for (let k = 1; k < cuts.length; k++) for (const d of [-KERB + 0.35, -MEDIAN - 0.3, MEDIAN + 0.3, KERB - 0.35]) ribbon('paint', cuts[k - 1], cuts[k], d - 0.075, d + 0.075, 0.02, k - 1);
    for (let s = 4; s < L - 6; s += 12) for (const o of [-1, 1]) for (const d of [MEDIAN + 3.75, MEDIAN + 7.5]) ribbon('paint', s, s + 3, o * d - 0.065, o * d + 0.065, 0.02, chunk(s));
  }

  // ---- Pylons and stays --------------------------------------------------------------------------------
  for (const ps of PYLON_S) {
    const ck = chunk(ps), top = pylonTop(ps), foot = h(ps) + BOX_BOT + 0.3;
    // the square steel column from the box girder up through the median, a shallow cap, the beacon
    box('pylon', ps, 0, (foot + top + 0.1) / 2, PYLON_W, PYLON_W, top + 0.1 - foot, ck);
    box('pylon', ps, 0, top + 0.2, PYLON_W + 0.3, PYLON_W + 0.3, 0.4, ck);
    box('light', ps, 0, top + 0.6, 0.5, 0.5, 0.5, ck);
    // anchorage bands where the stay fans leave the column (near)
    if (near) for (const y of [top - 1.2, top - 3.4]) box('pylon', ps, 0, y, PYLON_W + 0.24, PYLON_W + 0.24, 0.7, ck);
  }
  for (const st of STAYS) {
    const dir = Math.sign(st.s - st.pylon), ck = chunk((st.s + st.pylon) / 2);
    const yTop = pylonTop(st.pylon) - st.drop, yDeck = h(st.s) + ANCHOR_UP;
    if (near) {
      for (const d of [-STAY_D, STAY_D]) member('cable', P(st.pylon + dir * (PYLON_W / 2 + 0.05), d, yTop), P(st.s, d, yDeck), 0.32, 0.32, ck, 1, st.s);
    } else {
      member('cable', P(st.pylon + dir * (PYLON_W / 2 + 0.05), 0, yTop), P(st.s, 0, yDeck), 0.9, 0.7, ck, 1, st.s);
    }
    // the deck anchorage: a steel block on the median wall
    box('steel', st.s, 0, h(st.s) + MEDIAN_TOP + 0.2, 1.6, MEDIAN_WALL * 2 + 0.2, 0.5, ck);
  }

  // Lamps on the outer parapets, opposite each other, their heads over the outer lanes (near only).
  for (let s = A0 + 18; near && s < A1 - 10; s += 38) {
    if (PYLON_S.some((ps) => Math.abs(s - ps) < 6) || STAYS.some((st) => Math.abs(s - st.s) < 3)) continue;
    const ck = chunk(s), y = h(s);
    for (const o of [-1, 1]) {
      const d = o * (DECK_HALF - 0.4), top = y + 11;
      member('pole', P(s, d, y + CURB_TOP - 0.05), P(s, d, top), 0.24, 0.24, ck, 1, s);
      member('pole', P(s, d, top), P(s, d - o * 2.6, top + 0.45), 0.16, 0.16, ck, 1, s);
      box('lamp', s, d - o * 2.75, top + 0.3, 1.1, 0.45, 0.26, ck);
    }
  }

  // ---- Piers and abutments (concrete) ----------------------------------------------------------------
  /** A round shaft (an n-gon) from radius r0 at y0 to r1 at y1, open at both ends. */
  function shaft(s, y0, y1, r0, r1, n, ck, lift) {
    const l = list('concrete', ck, lift), c = P(s, 0, 0), { T, N } = frame(s);
    const at = (k, r, y) => { const a = (k + 0.5) / n * Math.PI * 2; return c.clone().addScaledVector(T, Math.cos(a) * r).addScaledVector(N, Math.sin(a) * r).setY(y); };
    for (let k = 0; k < n; k++) {
      const out = T.clone().multiplyScalar(Math.cos((k + 1) / n * Math.PI * 2)).addScaledVector(N, Math.sin((k + 1) / n * Math.PI * 2));
      face(l, at(k, r0, y0), at(k + 1, r0, y0), at(k + 1, r1, y1), at(k, r1, y1), out);
    }
  }
  // Main piers under the pylons: a round shaft rising from the river, flaring into a cap under the box.
  for (const ps of PYLON_S) {
    const ck = chunk(ps), under = h(ps) + BOX_BOT, flare = under - 2.6, n = near ? 12 : 8;
    shaft(ps, 0, flare, PIER_R0, PIER_R0 + 0.2, n, ck, liftBelow(flare));
    shaft(ps, flare, under - 0.02, PIER_R0 + 0.2, PIER_R1, n, ck, 1);
    if (near) box('concrete', ps, 0, 0.5, 2 * PIER_R0 + 1.6, 2 * PIER_R0 + 1.6, 1.0, ck, 0);
  }
  // End piers: a concrete wall under the box at each end of the cable-stayed unit.
  for (const s of END_PIER_S) {
    const top = h(s) + BOX_BOT - 0.02, ck = chunk(s);
    box('concrete', s, 0, top / 2, 1.6, 2 * BOX_BOT_HALF + 1.0, top, ck, liftBelow(top));
  }
  // Abutment seats under the end-span girders (the embankment wedge carries the face behind them).
  for (const [s, o] of [[A0, 1], [A1, -1]]) {
    const top = h(s) + PLATE_TOP - PLATE - END_GIRDER - 0.02, ck = chunk(s);
    box('concrete', s + o * 0.9, 0, top / 2, 1.8, 2 * DECK_HALF, top, ck, liftBelow(top));
  }

  for (const l of lists.values()) {
    if (!l.idx.length) continue;
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(l.pos, 3)); g.setIndex(l.idx); g.computeVertexNormals();
    b.put(g, l.mat, l.ck, l.lift);
  }
  return b.finish();
}
