import { BoxGeometry, BufferGeometry, Float32BufferAttribute, Vector3 } from 'three';
import { bridgeBuilder } from '../../asset-geometry.js';
import { PROFILE as p, LEG, LEG_HALF, LEG_MERGE, UNDER_S } from './pont-de-quebec-profile.js';
import {
  h, ROAD_H, MAIN_S, ANCHOR_S, TIP_S, APPROACH_PIER_S, BRIDGE_START, BRIDGE_END, MID_S, TRUSS_E, TRUSS_W, AXIS_D,
  RAIL_D, WALK, ROAD_HALF, BOT_Y, BOT_DEPTH, SHOE_Y, MAIN_PIER_TOP, POST_TOP, TOP_MAIN, TOP_END, END_POST_TOP,
  PORTAL_CLEAR, ANCHOR_PIER_TOP, APPROACH_DEPTH, CLEARANCE, FLOOR_TOP, FLOOR_DEPTH, topY, botY, PANEL_POINTS,
} from './pont-de-quebec-structure.js';

const clamp01 = (v) => Math.max(0, Math.min(1, v));
const UP = new Vector3(0, 1, 0);
const TRUSSES = [TRUSS_E, TRUSS_W];
const APPROACH_TOP = FLOOR_TOP - FLOOR_DEPTH - 0.52;

/**
 * Pont de Québec: the world's longest cantilever span. Two dark charcoal-brown steel K-trusses 26.8 m apart: anchor
 * arms rising from the tall masonry anchor piers to the 104 m main posts on their pin shoes, cantilever
 * arms falling to the tips, and the camel-backed suspended span between them; the bottom chords dip in
 * a V to each main pier while the floor runs level through the trusses at 48 m. Route 175 (three lanes)
 * runs in the east half beside the walkway, the CN track near the centre line. Short deck-truss approach
 * spans to the clifftop abutments; beyond them only the roadway continues (the flat-map ramps). Real
 * metres, +X east, +Y up, +Z south, built on the mapped roadway (pont-de-quebec-profile.js) so it is one
 * surface with the car, route and HD road.
 */
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const STEP = near ? 10 : 20;
  const b = bridgeBuilder({ ...p, meshStep: STEP }, detail), L = p.BRIDGE_LENGTH;
  // Three spatial chunks (near only): the north half with its ramp, the suspended span, the south half.
  const CUTS = [MID_S - 200, MID_S + 200];
  const chunk = (s) => (near ? (s < CUTS[0] ? 0 : s < CUTS[1] ? 1 : 2) : 0);
  const frame = (s) => { const q = p.bridgePoint(s, 0); return { T: new Vector3(q.tx, 0, q.tz), N: new Vector3(-q.tz, 0, q.tx) }; };
  const P = (s, d, y) => { const q = p.bridgePoint(s, d, y); return new Vector3(q.x, y, q.z); };

  // ---- Mesh helpers (as the Pont Pierre-Laporte) ------------------------------------------------------
  const lists = new Map();
  function list(mat, ck, lift, crisp = true) {
    const key = `${mat}|${ck}|${typeof lift === 'function' ? lift.key : lift}|${crisp}`;
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
  /** An open box (four sides, no end caps) between two points: `w` wide in the truss plane (or vertical
   * for a transverse member), `t` thick across it. */
  function member(mat, A, B, w, t, ck = 0, lift = 1, s = null) {
    const axis = new Vector3().subVectors(B, A), len = axis.length();
    if (len < 1e-3) return;
    axis.divideScalar(len);
    const { T, N } = frame(s ?? p.projectBridge((A.x + B.x) / 2, (A.z + B.z) / 2).s);
    let u = new Vector3().crossVectors(axis, N);
    if (u.lengthSq() < 0.09) u = new Vector3().crossVectors(axis, T);
    u.normalize();
    const v = new Vector3().crossVectors(u, axis).normalize();
    const crisp = w > 1.5 || t > 1.5, l = list(mat, ck, lift, crisp), c = [];
    for (const E of [A, B]) for (const [i, j] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) c.push(E.clone().addScaledVector(u, i * w / 2).addScaledVector(v, j * t / 2));
    const base = l.pos.length / 3;
    if (!crisp) for (const q of c) l.pos.push(q.x, q.y, q.z);
    for (let k = 0; k < 4; k++) {
      const k2 = (k + 1) % 4, mid = c[k].clone().add(c[k2]).multiplyScalar(0.5).sub(A);
      const out = mid.addScaledVector(axis, -mid.dot(axis));
      if (crisp) { face(l, c[k], c[k2], c[4 + k2], c[4 + k], out); continue; }
      const n = new Vector3().subVectors(c[k2], c[k]).cross(new Vector3().subVectors(c[4 + k2], c[k]));
      const [a0, a1, a2, a3] = [base + k, base + k2, base + 4 + k2, base + 4 + k];
      if (n.dot(out) >= 0) l.idx.push(a0, a1, a2, a0, a2, a3); else l.idx.push(a0, a3, a2, a0, a2, a1);
    }
  }
  /** A closed box in the bridge frame: centre (s, d, y), size along/across/up. */
  const box = (mat, s, d, y, along, across, up, ck, lift = 1) => b.box(mat, s, d, y, along, across, up, ck, lift);
  /** A ribbon along the roadway between stations a and c, lateral l..r (numbers or functions of s), top at
   * deck + off, `thick` deep (0: a flat surface). Sampled every STEP where the deck is not level. */
  function ribbon(mat, a, c, l, r, off, thick, ck, lift = 1, target = b) {
    const lAt = typeof l === 'function' ? l : () => l, rAt = typeof r === 'function' ? r : () => r;
    const set = new Set([a, c]);
    for (let s = Math.ceil(a / STEP) * STEP; s < c; s += STEP) if (s < BRIDGE_START || s > BRIDGE_END) set.add(s);
    for (const v of p.ALIGNMENT) if (v.s > a && v.s < c) set.add(v.s);
    const ss = [...set].sort((u, v) => u - v).filter((s, i, all) => !i || s - all[i - 1] > 0.05);
    const pos = [], idx = [], stride = thick ? 4 : 2;
    ss.forEach((s, i) => {
      const L0 = lAt(s), R0 = rAt(s);
      for (const [d, dy] of thick ? [[L0, 0], [R0, 0], [L0, -thick], [R0, -thick]] : [[L0, 0], [R0, 0]]) pos.push(...b.xyz(s, d, h(s) + off + dy));
      if (!i) return;
      const x = (i - 1) * stride, y = i * stride;
      idx.push(x, x + 1, y, x + 1, y + 1, y);
      if (thick) idx.push(x + 2, y + 2, x + 3, x + 3, y + 2, y + 3, x, y, x + 2, x + 2, y, y + 2, x + 1, x + 3, y + 1, x + 3, y + 3, y + 1);
    });
    if (thick) {   // end caps
      const n = (ss.length - 1) * 4;
      idx.push(0, 2, 1, 1, 2, 3, n, n + 1, n + 2, n + 1, n + 3, n + 2);
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    target.put(g, mat, ck, lift);
  }
  /** A ribbon split at the chunk cuts. */
  function strips(mat, a, c, l, r, off = 0, thick = 0) {
    const cuts = near ? [a, ...CUTS.filter((v) => v > a && v < c), c] : [a, c];
    for (let i = 1; i < cuts.length; i++) ribbon(mat, cuts[i - 1], cuts[i], l, r, off, thick, chunk((cuts[i - 1] + cuts[i]) / 2));
  }
  /** A closed block (top, sides, ends; no bottom) from y0 up to topAt(s), between two stations, lateral dl..dr. */
  function block(mat, s0, s1, dl, dr, y0, topAt, ck, lift) {
    const l = list(mat, ck, lift), n = Math.max(1, Math.ceil((s1 - s0) / 8));
    const ss = Array.from({ length: n + 1 }, (_, k) => s0 + (s1 - s0) * k / n);
    for (let k = 0; k < n; k++) {
      const a = ss[k], c = ss[k + 1], { N, T } = frame(a);
      face(l, P(a, dl, topAt(a)), P(c, dl, topAt(c)), P(c, dr, topAt(c)), P(a, dr, topAt(a)), UP);
      face(l, P(a, dl, y0), P(c, dl, y0), P(c, dl, topAt(c)), P(a, dl, topAt(a)), N.clone().negate());
      face(l, P(a, dr, y0), P(c, dr, y0), P(c, dr, topAt(c)), P(a, dr, topAt(a)), N);
      if (!k) face(l, P(a, dl, y0), P(a, dr, y0), P(a, dr, topAt(a)), P(a, dl, topAt(a)), T.clone().negate());
      if (k === n - 1) face(l, P(c, dl, y0), P(c, dr, y0), P(c, dr, topAt(c)), P(c, dl, topAt(c)), T);
    }
  }
  /** A masonry pier: a horizontal outline (along, across) offsets around (s0, d0), lofted from y0 to y1
   * with a batter (the base outline scaled by `batter`), plus a projecting cap. */
  function pier(mat, s0, d0, outline, y0, y1, batter, ck) {
    const l = list(mat, ck, liftBelow(y1)), { T, N } = frame(s0), centre = P(s0, d0, 0);
    const ring = (y, k) => outline.map(([u, v]) => centre.clone().addScaledVector(T, u * k).addScaledVector(N, v * k).setY(y));
    const lo = ring(y0, batter), hi = ring(y1, 1), n = outline.length;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n, out = new Vector3().subVectors(lo[i].clone().add(lo[j]).multiplyScalar(0.5), centre).setY(0);
      face(l, lo[i], lo[j], hi[j], hi[i], out);
    }
    // flat top (fan)
    const top = centre.clone().setY(y1);
    for (let i = 0; i < n; i++) { const j = (i + 1) % n, k = l.pos.length / 3; const [A, B] = [hi[i], hi[j]]; const nn = new Vector3().subVectors(A, top).cross(new Vector3().subVectors(B, top)); if (nn.y >= 0) l.pos.push(top.x, top.y, top.z, A.x, A.y, A.z, B.x, B.y, B.z); else l.pos.push(top.x, top.y, top.z, B.x, B.y, B.z, A.x, A.y, A.z); l.idx.push(k, k + 1, k + 2); }
  }
  const rect = (a, c) => [[a / 2, -c / 2], [a / 2, c / 2], [-a / 2, c / 2], [-a / 2, -c / 2]];
  /** Plan outline with pointed cutwaters on both across-bridge ends (main piers in the river). */
  const cutwater = (a, c, nose) => [[a / 2, -c / 2], [a / 2, c / 2], [0, c / 2 + nose], [-a / 2, c / 2], [-a / 2, -c / 2], [0, -c / 2 - nose]];

  const W = (k) => (near ? k : k * 1.3);   // far members read thicker at 2-8 km

  // ---- The two K-trusses ---------------------------------------------------------------------------
  const PP = PANEL_POINTS;
  /** Far: a chord as one member per straight run (consecutive panels on one slope merge into one). */
  function chordRuns(d, yAt, w, t) {
    const slope = (k) => (yAt(PP[k + 1].s) - yAt(PP[k].s)) / (PP[k + 1].s - PP[k].s);
    for (let i = 0; i + 1 < PP.length;) {
      let j = i + 1;
      while (j + 1 < PP.length && Math.abs(slope(j) - slope(i)) < 1e-6) j++;
      member('steel', P(PP[i].s, d, yAt(PP[i].s)), P(PP[j].s, d, yAt(PP[j].s)), w, t, 0, 1, PP[i].s);
      i = j;
    }
  }
  for (const d of TRUSSES) {
    // chords: one member per panel, top and bottom (far: one per straight run)
    if (near) {
      for (let i = 0; i + 1 < PP.length; i++) {
        const a = PP[i].s, c = PP[i + 1].s, ck = chunk((a + c) / 2);
        member('steel', P(a, d, topY(a)), P(c, d, topY(c)), W(1.4), 1.4, ck, 1, a);
        member('steel', P(a, d, botY(a)), P(c, d, botY(c)), BOT_DEPTH, 1.7, ck, 1, a);
      }
    } else {
      chordRuns(d, topY, W(1.4), 1.4);
      chordRuns(d, botY, BOT_DEPTH, 1.7);
    }
    // verticals and the K diagonals; the K's apex at mid-height of the vertical nearer the main pier
    // (far: one full-depth diagonal per panel, alternating, and no lateral bracing)
    let floorRun = null;
    for (let i = 0; i < PP.length; i++) {
      const { s, main } = PP[i], ck = chunk(s), yt = topY(s), yb = botY(s);
      const isMain = MAIN_S.some((m) => Math.abs(m - s) < 0.01), isEnd = ANCHOR_S.some((a) => Math.abs(a - s) < 0.01);
      if (isMain) {
        // the main post: a deep built-up column from the shoe to the cap
        member('steel', P(s, d, yb), P(s, d, POST_TOP - 0.9), 3.4, 2.6, ck, 1, s);
        box('steel', s, d, POST_TOP - 0.45, 4.2, 3.2, 0.9, ck);
        box('light', s, d + Math.sign(d - AXIS_D) * 1.66, POST_TOP - 0.5, 0.6, 0.12, 0.6, ck);
      } else if (isEnd) {
        // the end posts over the anchor piers rise above the top chord as capped pylons
        box('steel', s, d, (yb - BOT_DEPTH / 2 + END_POST_TOP) / 2, 2.8, 2.6, END_POST_TOP - yb + BOT_DEPTH / 2, ck);
        box('steel', s, d, END_POST_TOP + 0.4, 3.4, 3.2, 0.8, ck);
      } else if (near || i % 2 === 0) member('steel', P(s, d, yb), P(s, d, yt), W(1.0), 1.0, ck, 1, s);   // far: every other
      if (i + 1 >= PP.length) continue;
      const s2 = PP[i + 1].s, toMain = Math.abs(s2 - main) < Math.abs(s - main);
      const [o, k] = toMain ? [s, s2] : [s2, s];   // outer and apex verticals of this panel
      const mid = (topY(k) + botY(k)) / 2;
      const deepFloor = botY(s) < BOT_Y - 0.5 || botY(s2) < BOT_Y - 0.5;
      if (near) {
        member('steel', P(o, d, topY(o)), P(k, d, mid), W(0.95), 0.9, chunk((s + s2) / 2), 1, s);
        member('steel', P(o, d, botY(o)), P(k, d, mid), W(0.95), 0.9, chunk((s + s2) / 2), 1, s);
        // the floor line: a deck-level member through the arms where the bottom chord dips (lit at night)
        if (deepFloor) member('steel', P(s, d, BOT_Y), P(s2, d, BOT_Y), W(1.2), 0.9, chunk((s + s2) / 2), 1, s);
      } else {
        const [y0, y1] = i % 2 ? [yt, botY(s2)] : [yb, topY(s2)];
        member('steel', P(s, d, y0), P(s2, d, y1), W(0.95), 0.9, 0, 1, s);
        // the floor line stays as the photographs show it, merged into one member per run
        if (deepFloor) { if (floorRun && Math.abs(floorRun.c - s) < 0.01) floorRun.c = s2; else { if (floorRun) member('steel', P(floorRun.a, d, BOT_Y), P(floorRun.c, d, BOT_Y), W(1.2), 0.9, 0, 1, floorRun.a); floorRun = { a: s, c: s2 }; } }
      }
    }
    if (floorRun) member('steel', P(floorRun.a, d, BOT_Y), P(floorRun.c, d, BOT_Y), W(1.2), 0.9, 0, 1, floorRun.a);
  }

  // ---- Transverse bracing between the trusses ----------------------------------------------------------
  const span = TRUSS_W - TRUSS_E;
  for (const [i, { s }] of PP.entries()) {
    const ck = chunk(s), yt = topY(s), yb = botY(s), isMain = MAIN_S.some((m) => Math.abs(m - s) < 0.01);
    const isEnd = ANCHOR_S.some((a) => Math.abs(a - s) < 0.01), isTip = TIP_S.some((t) => Math.abs(t - s) < 0.01);
    const portal = isMain || isEnd || isTip;
    if (!near && !portal) continue;
    // centre of the lowest strut above the road (the anchor ends: the top of their deep cross girder)
    const low = isEnd ? ROAD_H + PORTAL_CLEAR + 3.2 : ROAD_H + PORTAL_CLEAR + 1.0;
    // top strut
    member('steel', P(s, TRUSS_E, yt), P(s, TRUSS_W, yt), portal ? 1.8 : 1.0, portal ? 1.4 : 0.8, ck, 1, s);
    if (yt - low > 3) {
      // sway frame / portal: a strut at `low` and an X between it and the top strut
      if (!isEnd) member('steel', P(s, TRUSS_E, low), P(s, TRUSS_W, low), portal ? 2.0 : 0.9, portal ? 1.6 : 0.7, ck, 1, s);
      const levels = isMain ? [low, (low + yt) / 2, yt] : [low, yt];
      if (isMain) member('steel', P(s, TRUSS_E, levels[1]), P(s, TRUSS_W, levels[1]), 1.4, 1.2, ck, 1, s);
      for (let k = 0; k + 1 < levels.length; k++) {
        member('steel', P(s, TRUSS_E, levels[k]), P(s, TRUSS_W, levels[k + 1]), portal ? 1.2 : 0.6, 0.6, ck, 1, s);
        member('steel', P(s, TRUSS_W, levels[k]), P(s, TRUSS_E, levels[k + 1]), portal ? 1.2 : 0.6, 0.6, ck, 1, s);
      }
      // knee braces under the portal strut, kept above the clearance line
      if (portal && !isEnd) for (const [d, o] of [[TRUSS_E, 1], [TRUSS_W, -1]]) member('steel', P(s, d, low + 5), P(s, d + o * 4.5, low), 0.9, 0.6, ck, 1, s);
    }
    // below the deck: a strut at the bottom chord and an X up to the floor where the chords dip
    if (yb < ROAD_H - 8 && (near || isMain)) {
      const fl = ROAD_H - FLOOR_DEPTH - 0.6;
      member('steel', P(s, TRUSS_E, yb), P(s, TRUSS_W, yb), isMain ? 2.0 : 0.9, 0.8, ck, 1, s);
      member('steel', P(s, TRUSS_E, yb), P(s, TRUSS_W, fl), isMain ? 1.4 : 0.6, 0.6, ck, 1, s);
      member('steel', P(s, TRUSS_W, yb), P(s, TRUSS_E, fl), isMain ? 1.4 : 0.6, 0.6, ck, 1, s);
    }
    // near: top and bottom lateral bracing in the chord planes, panel by panel
    if (near && i + 1 < PP.length) {
      const s2 = PP[i + 1].s, ck2 = chunk((s + s2) / 2);
      member('steel', P(s, TRUSS_E, topY(s)), P(s2, TRUSS_W, topY(s2)), 0.5, 0.5, ck2, 1, s);
      member('steel', P(s, TRUSS_W, topY(s)), P(s2, TRUSS_E, topY(s2)), 0.5, 0.5, ck2, 1, s);
      if (botY(s) < ROAD_H - 3 || botY(s2) < ROAD_H - 3) {
        member('steel', P(s, TRUSS_E, botY(s)), P(s2, TRUSS_W, botY(s2)), 0.5, 0.5, ck2, 1, s);
        member('steel', P(s, TRUSS_W, botY(s)), P(s2, TRUSS_E, botY(s2)), 0.5, 0.5, ck2, 1, s);
      }
    }
  }
  // The anchor-end portal (as a driver sees it entering the bridge): the deep cross girder between the
  // pylons, its underside PORTAL_CLEAR above the road.
  for (const s of ANCHOR_S) box('steel', s, AXIS_D, ROAD_H + PORTAL_CLEAR + 1.6, 1.8, span - 2.6, 3.2, chunk(s));

  // ---- The floor, the roadway, the track and the walkway (abutment to abutment) -------------------------
  const A0 = BRIDGE_START, A1 = BRIDGE_END;
  strips('floor', A0, A1, TRUSS_E + 0.86, TRUSS_W - 0.86, FLOOR_TOP - ROAD_H, FLOOR_DEPTH);
  // Route 175 (3 lanes, 9.17 m), its concrete wall against the track and the kerb on the walkway side
  strips('asphalt', A0, A1, -ROAD_HALF, ROAD_HALF, 0, 0.33);
  strips('concrete', A0, A1, ROAD_HALF, ROAD_HALF + 0.45, 1.25, 1.58);
  if (near) strips('concrete', A0, A1, -ROAD_HALF - 0.4, -ROAD_HALF, 0.22, 0.55);
  // the walkway (raised, on the east side inside the truss) and its two railings
  strips('concrete', A0, A1, WALK[0], WALK[1], 0.2, 0.53);
  if (near) for (const d of [WALK[0] + 0.05, WALK[1] - 0.05]) strips('steel', A0, A1, d - 0.05, d + 0.05, 1.3, 1.1);
  // the CN track near the centre line: ballast bed, ties as a dark band, two rails (near)
  strips('rail', A0, A1, RAIL_D - 2.0, RAIL_D + 2.0, 0.2, 0.53);
  if (near) for (const o of [-0.7175, 0.7175]) strips('steel', A0, A1, RAIL_D + o - 0.04, RAIL_D + o + 0.04, 0.38, 0.18);
  // the old second track bed west of it, now a service way, and the west railing
  if (near) strips('steel', A0, A1, TRUSS_W - 1.0, TRUSS_W - 0.9, 1.3, 1.66);

  // Lane paint (the HD pavement's own paint replaces it in the app): edge lines and the reversible
  // middle lane's dashed lines.
  if (near) {
    const line = (d, a, c, w = 0.15) => ribbon('paint', a, c, d - w / 2, d + w / 2, 0.025, 0, chunk((a + c) / 2));
    for (const [a, c] of [[0, CUTS[0]], [CUTS[0], CUTS[1]], [CUTS[1], L]]) { line(-ROAD_HALF + 0.3, a, c); line(ROAD_HALF - 0.3, a, c); }
    for (let s = 2; s < L - 4; s += 12) for (const d of [-1.53, 1.53]) line(d, s, s + 3, 0.13);
  }
  // Lamps on the concrete wall, the head over the roadway (near only)
  for (let s = A0 + 15; near && s < A1 - 10; s += 38) {
    if ([...MAIN_S, ...ANCHOR_S, ...TIP_S].some((t) => Math.abs(s - t) < 5)) continue;
    const ck = chunk(s), d = ROAD_HALF + 0.22, y = ROAD_H;
    member('steel', P(s, d, y + 1.25), P(s, d, y + 9.0), 0.22, 0.22, ck, 1, s);
    member('steel', P(s, d, y + 9.0), P(s, d - 2.0, y + 9.4), 0.16, 0.16, ck, 1, s);
    box('lamp', s, d - 2.15, y + 9.25, 1.1, 0.45, 0.28, ck);
  }

  // ---- Approach spans: deck trusses under the floor, from each abutment to its anchor pier ------------
  // (top-chord centre just under the floor beams)
  for (const [a, c] of [[A0, ANCHOR_S[0]], [ANCHOR_S[1], A1]]) {
    const yTop = APPROACH_TOP, yBot = yTop - APPROACH_DEPTH;
    for (const d of TRUSSES) {
      strips('steel', a, c, d - 0.6, d + 0.6, yTop + 0.5 - ROAD_H, 1.0);
      strips('steel', a, c, d - 0.6, d + 0.6, yBot + 0.5 - ROAD_H, 1.0);
      const n = near ? 8 : 4;
      for (let k = 0; k <= n; k++) {
        const s = a + (c - a) * k / n, ck = chunk(s);
        member('steel', P(s, d, yBot + 0.5), P(s, d, yTop - 0.5), W(0.6), 0.6, ck, 1, s);
        if (k < n) { const s2 = a + (c - a) * (k + 1) / n, up = k % 2 === 0; member('steel', P(up ? s : s2, d, yBot + 0.5), P(up ? s2 : s, d, yTop - 0.5), W(0.6), 0.6, ck, 1, s); }
      }
    }
    if (near) for (let k = 0; k < 8; k += 2) {
      const s = a + (c - a) * k / 8, s2 = a + (c - a) * (k + 2) / 8, ck = chunk(s);
      member('steel', P(s, TRUSS_E, yBot + 0.5), P(s2, TRUSS_W, yBot + 0.5), 0.4, 0.4, ck, 1, s);
      member('steel', P(s, TRUSS_W, yBot + 0.5), P(s2, TRUSS_E, yBot + 0.5), 0.4, 0.4, ck, 1, s);
    }
  }

  // ---- Masonry: main piers, anchor piers, approach piers and abutments (granite) -------------------------
  // Main piers in the river: cutwaters up- and downstream; a granite pedestal and a steel pin shoe under each truss.
  for (const s of MAIN_S) {
    const ck = chunk(s);
    pier('stone', s, AXIS_D, cutwater(18, span + 8, 7), 0, MAIN_PIER_TOP, 1.06, ck);
    for (const d of TRUSSES) {
      box('stone', s, d, MAIN_PIER_TOP + 0.4, 8.0, 6.0, 0.8, ck);
      box('steel', s, d, (MAIN_PIER_TOP + 0.8 + SHOE_Y) / 2 + 0.2, 5.0, 3.6, SHOE_Y - MAIN_PIER_TOP + 0.4, ck);
    }
  }
  // Anchor piers: tall granite towers under each truss joined by a lower wall, a cornice at the top.
  for (const s of ANCHOR_S) {
    const ck = chunk(s);
    for (const d of TRUSSES) {
      pier('stone', s, d, rect(11, 8), 0, ANCHOR_PIER_TOP - 1.2, 1.12, ck);
      box('stone', s, d, ANCHOR_PIER_TOP - 0.65, 12.2, 9.2, 1.3, ck, liftBelow(ANCHOR_PIER_TOP));
      box('steel', s, d, (ANCHOR_PIER_TOP + CLEARANCE) / 2, 4.0, 3.0, CLEARANCE - ANCHOR_PIER_TOP + 0.02, ck);
    }
    pier('stone', s, AXIS_D, rect(8, span - 6), 0, ANCHOR_PIER_TOP - 14, 1.0, ck);
  }
  // Intermediate approach piers and the clifftop abutments (full width, to just under the floor/trusses).
  const apTop = APPROACH_TOP - APPROACH_DEPTH - 0.52;
  for (const s of APPROACH_PIER_S) pier('stone', s, AXIS_D, rect(5, span + 3), 0, apTop, 1.08, chunk(s));
  for (const [s, o] of [[A0, -1], [A1, 1]]) {
    const ck = chunk(s), top = ROAD_H - 0.97;
    block('stone', Math.min(s, s + o * 9), Math.max(s, s + o * 9), TRUSS_E - 1.8, TRUSS_W + 1.8, 0, () => top, ck, liftBelow(top));
    // the approach trusses' bearing ledge in front of it
    block('stone', Math.min(s - o * 2, s), Math.max(s - o * 2, s), TRUSS_E - 1.8, TRUSS_W + 1.8, 0, () => apTop, ck, liftBelow(apTop));
  }

  // ---- Beyond the abutments: Route 175 only (the flat-map ramps; Full 3D world: on the clifftops) --------
  // Near the south junction the deck widens east to take the northbound branch (the leg, below): up to
  // GORE_END its east edge follows the leg's outer edge and its east parapet follows that edge instead.
  const edgeL = -ROAD_HALF - 0.9, edgeR = ROAD_HALF + 0.9;
  const LEG_SLAB = LEG_HALF + 0.9;
  const legLat = (t, u) => { const q = LEG.point(t, u); return p.projectBridge(q.x, q.z); };
  const tWhere = (u, f) => { let lo = 0, hi = LEG_MERGE + 20; for (let k = 0; k < 40; k++) { const m = (lo + hi) / 2; if (f(legLat(m, u))) hi = m; else lo = m; } return hi; };
  /** The gore's end: where the leg's inner slab edge leaves the main slab edge (a station on the main). */
  const T_IN0 = tWhere(LEG_SLAB, (q) => q.lateral < edgeL), GORE_END = legLat(T_IN0, LEG_SLAB).s;
  /** Where each of the leg's edges meets the station GORE_END (the leg's first cross-section lies on it). */
  const tAtGore = (u) => tWhere(u, (q) => q.s >= GORE_END);
  /** Lateral of the leg's edge u at main station s (inside the gore), by bisection along the leg. */
  const legEdgeAt = (u, s) => legLat(tWhere(u, (q) => q.s >= s), u).lateral;
  const GORE_OPEN = legLat(tWhere(-LEG_SLAB, (q) => q.lateral < edgeL), -LEG_SLAB).s;
  const goreL = (u, base) => (s) => (s > GORE_OPEN - 0.01 && s < GORE_END + 0.01 ? Math.min(base, legEdgeAt(u, s)) : base);
  const north = [0, A0 - 0.01], south = [A1 + 0.01, L];
  for (const [a, c] of [north, south]) {
    strips('asphalt', a, c, -ROAD_HALF, ROAD_HALF, 0, 0);
    strips('concrete', a, c, edgeL, edgeR, -0.06, 0.9);
  }
  if (near) {
    strips('concrete', ...north, edgeL, -ROAD_HALF - 0.35, 1.0, 1.06); strips('concrete', ...north, ROAD_HALF + 0.35, edgeR, 1.0, 1.06);
    strips('concrete', ...south, ROAD_HALF + 0.35, edgeR, 1.0, 1.06);
    // east parapet: open from GORE_OPEN to GORE_END, where the leg joins
    ribbon('concrete', south[0], GORE_OPEN, edgeL, -ROAD_HALF - 0.35, 1.0, 1.06, chunk(south[0]));
    ribbon('concrete', GORE_END, south[1], edgeL, -ROAD_HALF - 0.35, 1.0, 1.06, chunk(GORE_END));
  }
  // Solid fill where the ramp is low, then a box girder on two-column piers. South, Route Marie-Victorin
  // passes under (UNDER, mapped): a girderless slab span from MV_PIER to the fill, >= 5 m clear.
  const FILL_BELOW = 3.2;
  function solid(s0, s1) {
    const n = Math.max(2, Math.ceil((s1 - s0) / 4)), pos = [], idx = [];
    for (let i = 0; i <= n; i++) {
      const s = s0 + (s1 - s0) * i / n, top = Math.max(h(s) - 0.12, 0.05);
      for (const [d, y] of [[edgeL, top], [edgeR, top], [edgeL, 0], [edgeR, 0]]) pos.push(...b.xyz(s, d, y));
      if (!i) continue;
      const u = (i - 1) * 4, v = i * 4;
      idx.push(u, u + 1, v, u + 1, v + 1, v, u, v, u + 2, u + 2, v, v + 2, u + 1, u + 3, v + 1, u + 3, v + 3, v + 1);
    }
    idx.push(0, 2, 1, 1, 2, 3, n * 4, n * 4 + 1, n * 4 + 2, n * 4 + 1, n * 4 + 3, n * 4 + 2);
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    b.put(g, 'concrete', chunk((s0 + s1) / 2), (y) => (y > 0.05 ? 1 : 0));
  }
  let fillN = 0; while (h(fillN) < FILL_BELOW) fillN += 0.5;
  let fillS = L; while (h(fillS) < FILL_BELOW) fillS -= 0.5;
  let footN = 0; while (h(footN) < 0.25) footN += 0.5;
  let footS = L; while (h(footS) < 0.25) footS -= 0.5;
  solid(footN, fillN); solid(fillS, footS);
  const MV_PIER = Math.min(...UNDER_S.map(([a]) => a)) - 4;
  const bent = (s) => {
    const top = h(s) - 3.1, ck = chunk(s);
    for (const d of [edgeL + 2.6, edgeR - 2.6]) member('concrete', P(s, d, 0), P(s, d, top), 1.8, 1.8, ck, liftBelow(top), s);
    box('concrete', s, 0, top + 0.6, 2.2, edgeR - edgeL - 1.2, 1.2, ck, 1);
  };
  for (const [a, c, last] of [[fillN, A0 - 9, false], [A1 + 9, MV_PIER, true]]) {
    strips('concrete', a, c, edgeL + 2.2, edgeR - 2.2, -0.96, 2.2);
    const n = Math.max(1, Math.round((c - a) / 40));
    for (let k = 1; k < n; k++) { if (!near && k % 2) continue; bent(a + (c - a) * k / n); }
    if (last) bent(c);
  }

  // ---- The leg: the northbound branch of Boulevard Guillaume-Couture on its own flat-map ramp ---------
  // Built in its own meshes (`<id>-leg-<material>`) so that Full 3D world can hide it (layer.js). Its
  // first cross-section lies on GORE_END; heights are the leg's road surface at each vertex.
  const lb = bridgeBuilder({ ...p, meshStep: STEP }, 'near');
  // the gore: the main deck widened east to the leg's outer edge between GORE_OPEN and GORE_END
  ribbon('asphalt', GORE_OPEN, GORE_END, goreL(-LEG_HALF, -ROAD_HALF), -ROAD_HALF, 0, 0, 'leg', 0, lb);
  ribbon('concrete', GORE_OPEN, GORE_END, goreL(-LEG_SLAB, edgeL), edgeL, -0.06, 0.9, 'leg', 0, lb);
  if (near) ribbon('concrete', GORE_OPEN, GORE_END, goreL(-LEG_SLAB, edgeL), (s) => goreL(-LEG_SLAB, edgeL)(s) + 0.55, 1.0, 1.06, 'leg', 0, lb);
  const legY = (q) => LEG.surface(q.x, q.z);
  function legRibbon(mat, u0, u1, off, thick, t1 = LEG.end, tStart = null) {
    const ta = tStart ?? tAtGore(u0), tb = tStart ?? tAtGore(u1);
    const ts = [...new Set([Math.max(ta, tb), ...LEG.line.map((v) => v.t), ...Array.from({ length: Math.ceil(t1 / STEP) }, (_, k) => k * STEP)])]
      .filter((t) => t > Math.max(ta, tb) + 0.05 && t < t1 - 0.05).sort((x, y) => x - y);
    const rows = [[ta, tb], ...ts.map((t) => [t, t]), [t1, t1]], pos = [], idx = [], stride = thick ? 4 : 2;
    rows.forEach(([t0, t2], i) => {
      const A = LEG.point(t0, u0), B = LEG.point(t2, u1), ya = legY(A) + off, yb = legY(B) + off;
      for (const [Q, y, dy] of thick ? [[A, ya, 0], [B, yb, 0], [A, ya, -thick], [B, yb, -thick]] : [[A, ya, 0], [B, yb, 0]]) pos.push(Q.x, Math.max(y + dy, off < 0 && thick > 1 ? 0.02 : -1), Q.z);
      if (!i) return;
      const x = (i - 1) * stride, y = i * stride;
      idx.push(x, y, x + 1, x + 1, y, y + 1);
      if (thick) idx.push(x + 2, x + 3, y + 2, x + 3, y + 3, y + 2, x, x + 2, y, x + 2, y + 2, y, x + 1, y + 1, x + 3, x + 3, y + 1, y + 3);
    });
    if (thick) { const n = (rows.length - 1) * 4; idx.push(0, 1, 2, 1, 3, 2, n, n + 2, n + 1, n + 1, n + 2, n + 3); }
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    lb.put(g, mat, 'leg', 0);
  }
  legRibbon('asphalt', LEG_HALF, -LEG_HALF, 0, 0);
  legRibbon('concrete', LEG_SLAB, -LEG_SLAB, -0.06, 0.9);
  if (near) { legRibbon('concrete', LEG_SLAB, LEG_HALF + 0.35, 1.0, 1.06); legRibbon('concrete', -LEG_HALF - 0.35, -LEG_SLAB, 1.0, 1.06); }
  // girder and single-column piers where it is high, fill below FILL_BELOW
  let tFill = LEG.end; while (tFill > 0 && LEG.profile(tFill) < FILL_BELOW) tFill -= 0.5;
  const tG = Math.max(tAtGore(LEG_SLAB), tAtGore(-LEG_SLAB)) + 4;
  legRibbon('concrete', LEG_SLAB - 1.6, -LEG_SLAB + 1.6, -0.96, 2.0, tFill, tG);
  for (let t = tG + 30; t < tFill - 10; t += near ? 34 : 68) {
    const q = LEG.point(t), top = legY(q) - 2.96;
    lb.bar('concrete', [q.x, 0, q.z], [q.x, top, q.z], 1.8, 1.8, 'leg', false, 0);
    lb.put(new BoxGeometry(2.2, 1.0, 2 * LEG_SLAB - 2.4).rotateY(-Math.atan2(q.tz, q.tx)).translate(q.x, top + 0.5, q.z), 'concrete', 'leg', 0);
  }
  {
    // the fill: a solid from the slab underside to the ground, ending at the leg's foot
    const n = Math.max(2, Math.ceil((LEG.end - tFill) / 4)), pos = [], idx = [];
    for (let i = 0; i <= n; i++) {
      const t = tFill + (LEG.end - tFill) * i / n;
      for (const [u, top] of [[LEG_SLAB, true], [-LEG_SLAB, true], [LEG_SLAB, false], [-LEG_SLAB, false]]) { const q = LEG.point(t, u); pos.push(q.x, top ? Math.max(legY(q) - 0.12, 0.05) : 0, q.z); }
      if (!i) continue;
      const u = (i - 1) * 4, v = i * 4;
      idx.push(u, v, u + 1, u + 1, v, v + 1, u, u + 2, v, u + 2, v + 2, v, u + 1, v + 1, u + 3, u + 3, v + 1, v + 3);
    }
    idx.push(0, 1, 2, 1, 3, 2, n * 4, n * 4 + 2, n * 4 + 1, n * 4 + 1, n * 4 + 2, n * 4 + 3);
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    lb.put(g, 'concrete', 'leg', 0);
  }

  for (const l of lists.values()) {
    if (!l.idx.length) continue;
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(l.pos, 3)); g.setIndex(l.idx); g.computeVertexNormals();
    b.put(g, l.mat, l.ck, l.lift);
  }
  const root = b.finish(), legRoot = lb.finish(), mats = new Map();
  root.traverse((o) => o.isMesh && mats.set(o.material.name, o.material));
  for (const mesh of [...legRoot.children]) {
    const shared = mats.get(mesh.material.name);
    if (shared) { mesh.material.dispose(); mesh.material = shared; }
    root.add(mesh);
  }
  root.userData.triangles += legRoot.userData.triangles; root.userData.drawCalls = root.children.length;
  return root;
}
