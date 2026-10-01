import { BufferGeometry, Float32BufferAttribute, Vector3 } from 'three';
import { bridgeBuilder } from '../../asset-geometry.js';
import { PROFILE as p, KERB, BARRIER, SIDEWALK, DECK_HALF, roadEdgesAt } from './golden-gate-bridge-profile.js';
import {
  h, TRUSS_BOTTOM, TRUSS_TOP, PANEL, PIER_TOP, PIER, LEG, LEG_TOP, TOWER_TOP, STRUTS_ABOVE, STRUTS_BELOW, STRUT_DEPTH,
  CABLE_R, cableY, SUSPENDERS, PYLON_D, ARCH, ANCHORAGE, FENDER, SOUTH_VIADUCT, NORTH_VIADUCT, FILL_BELOW,
  DECK_H, TOWER_S, S1, S2, N1, N2, BRIDGE_START, BRIDGE_END, CABLE_D,
} from './golden-gate-bridge-structure.js';

const clamp01 = (v) => Math.max(0, Math.min(1, v));
const UP = new Vector3(0, 1, 0);

/**
 * Golden Gate Bridge: two art-deco towers with stacked portal struts, the main cables' sweep, 250
 * pairs of suspenders, the open Warren stiffening truss under the deck, the Fort Point arch between
 * pylons S2 and S1, the anchorages and the approach viaducts, carrying six lanes of US 101 with its
 * movable median barrier, sidewalks and lamps. Real metres, +X east, +Y up, +Z south, built on the
 * mapped roadway (golden-gate-bridge-profile.js) so it is one surface with the car, route and HD road.
 */
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  // The ramps are gentle (smoothstep over 900 m): a 12.5 m chord sags < 1 cm below the curve the HD
  // overlay is lifted to, so the strips need not sample every 5 m.
  // far (2-8 km): every 25 m (a 4 cm chord sag)
  const STEP = near ? 12.5 : 25;
  const b = bridgeBuilder({ ...p, meshStep: STEP }, detail), L = p.BRIDGE_LENGTH;
  // Three spatial chunks along the bridge (near only): culling for a 3.9 km structure.
  const CUTS = [L / 3, 2 * L / 3];
  const chunk = (s) => (near ? (s < CUTS[0] ? 0 : s < CUTS[1] ? 1 : 2) : 0);
  const frame = (s) => { const q = p.bridgePoint(s, 0); return { T: new Vector3(q.tx, 0, q.tz), N: new Vector3(-q.tz, 0, q.tx) }; };
  const P = (s, d, y) => { const q = p.bridgePoint(s, d, y); return new Vector3(q.x, y, q.z); };

  // ---- Mesh helpers ---------------------------------------------------------------------------------
  // Flat-shaded custom geometry: every quad owns its four vertices, so the baked directional shading
  // stays crisp on the towers' recessed faces.
  const lists = new Map();
  function list(mat, ck, lift, crisp = true) {
    const key = `${mat}|${ck}|${typeof lift === 'function' ? lift.key : lift}|${crisp}`;
    if (!lists.has(key)) lists.set(key, { mat, ck, lift, pos: [], idx: [] });
    return lists.get(key);
  }
  const liftBelow = (top, foot = 0) => Object.assign((y) => clamp01((y - foot) / Math.max(1, top - foot)), { key: `below:${top.toFixed(2)}:${foot}` });
  const _e1 = new Vector3(), _e2 = new Vector3();
  function quad(l, A, B, C, D) {
    // a setback that steps in one direction only leaves collinear ledge quads: drop them
    if (_e1.subVectors(C, A).cross(_e2.subVectors(D, B)).lengthSq() < 1e-8) return;
    const i = l.pos.length / 3;
    l.pos.push(A.x, A.y, A.z, B.x, B.y, B.z, C.x, C.y, C.z, D.x, D.y, D.z);
    l.idx.push(i, i + 1, i + 2, i, i + 2, i + 3);
  }
  function tri(l, A, B, C) { const i = l.pos.length / 3; l.pos.push(A.x, A.y, A.z, B.x, B.y, B.z, C.x, C.y, C.z); l.idx.push(i, i + 1, i + 2); }
  /** A quad whose front faces `out` (a direction away from the solid). */
  function face(l, A, B, C, D, out) {
    const n = new Vector3().subVectors(B, A).cross(new Vector3().subVectors(C, A));
    if (n.dot(out) >= 0) quad(l, A, B, C, D); else quad(l, A, D, C, B);
  }
  /** An open box (four sides, no end caps) between two points: `w` wide, `t` thick. */
  function member(mat, A, B, w, t, ck = 0, lift = 1, s = null) {
    const axis = new Vector3().subVectors(B, A), len = axis.length();
    if (len < 1e-3) return;
    axis.divideScalar(len);
    const { T, N } = frame(s ?? p.projectBridge(A.x, A.z).s);
    let u = new Vector3().crossVectors(axis, N);
    if (u.lengthSq() < 0.09) u = new Vector3().crossVectors(axis, T);
    u.normalize();
    const v = new Vector3().crossVectors(u, axis).normalize();
    // Thin members share their eight corners (soft shading costs nothing visible at their size);
    // the towers' heavy bracing keeps flat faces.
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
  /**
   * A flat-shaded loft of horizontal rings (same vertex count, wound the same way) with an optional
   * top cap fanned from the ring centre. Rings at the same height make a setback ledge.
   */
  function loft(mat, rings, centre, { cap = true } = {}, ck = 0, lift = 1) {
    const l = list(mat, ck, lift), n = rings[0].length;
    // Wind by the first edge, which is always a plain outer face of the section.
    const e0 = new Vector3().subVectors(rings[0][1], rings[0][0]), m0 = rings[0][0].clone().add(rings[0][1]).multiplyScalar(0.5);
    const out0 = new Vector3(m0.x - centre(rings[0][0].y).x, 0, m0.z - centre(rings[0][0].y).z);
    const flip = new Vector3().crossVectors(e0, UP).dot(out0) < 0;
    for (let k = 0; k + 1 < rings.length; k++) for (let i = 0; i < n; i++) {
      const j = (i + 1) % n, A = rings[k][i], B = rings[k][j], C = rings[k + 1][j], D = rings[k + 1][i];
      if (flip) quad(l, A, D, C, B); else quad(l, A, B, C, D);
    }
    if (cap) {
      const top = rings.at(-1), c = centre(top[0].y);
      for (let i = 0; i < n; i++) { const j = (i + 1) % n; if (flip) tri(l, c, top[j], top[i]); else tri(l, c, top[i], top[j]); }
    }
  }
  /**
   * An art-deco section in the bridge frame: a rectangle `along` x `across` with re-entrant notched
   * corners and a recessed vertical panel down the middle of every face (the towers' fluting).
   */
  function section(s, d, y, along, across, { notch = 0.9, recess = 0.35, grooves = near } = {}) {
    const { T, N } = frame(s), o = P(s, d, y), A = along / 2, B = across / 2, n = Math.min(notch, A / 3, B / 3);
    // far: the notched corners only (the recessed panels are invisible at that distance)
    if (!grooves) return [[A, -B + n], [A, B - n], [A - n, B - n], [A - n, B], [-A + n, B], [-A + n, B - n], [-A, B - n], [-A, -B + n], [-A + n, -B + n], [-A + n, -B], [A - n, -B], [A - n, -B + n]]
      .map(([u, v]) => o.clone().addScaledVector(T, u).addScaledVector(N, v));
    const gu = grooves ? across * 0.34 : 0, gv = grooves ? along * 0.26 : 0, r = grooves ? recess : 0;
    const uv = [
      [A, -B + n], [A, -gu / 2], [A - r, -gu / 2], [A - r, gu / 2], [A, gu / 2], [A, B - n], [A - n, B - n],
      [A - n, B], [gv / 2, B], [gv / 2, B - r], [-gv / 2, B - r], [-gv / 2, B], [-A + n, B], [-A + n, B - n],
      [-A, B - n], [-A, gu / 2], [-A + r, gu / 2], [-A + r, -gu / 2], [-A, -gu / 2], [-A, -B + n], [-A + n, -B + n],
      [-A + n, -B], [-gv / 2, -B], [-gv / 2, -B + r], [gv / 2, -B + r], [gv / 2, -B], [A - n, -B], [A - n, -B + n],
    ];
    return uv.map(([u, v]) => o.clone().addScaledVector(T, u).addScaledVector(N, v));
  }
  /**
   * A ribbon along the roadway (the builder's strip, sampled sparsely): every 12.5 m on the ramps,
   * and only at alignment vertices where the deck is level (pylon S2 to pylon N1, straight).
   */
  function ribbon(mat, a, c, l, r, off, thick, ck) {
    const lAt = typeof l === 'function' ? l : () => l, rAt = typeof r === 'function' ? r : () => r;
    const set = new Set([a, c]);
    for (let s = Math.ceil(a / STEP) * STEP; s < c; s += STEP) if (s < S2 || s > N1) set.add(s);
    for (const v of p.ALIGNMENT) if (v.s > a && v.s < c) set.add(v.s);
    const ss = [...set].sort((u, v) => u - v).filter((s, i, all) => !i || s - all[i - 1] > 0.05 || s === c), pos = [], idx = [], stride = thick ? 4 : 2;
    if (ss.length > 2 && ss.at(-1) - ss.at(-2) <= 0.05) ss.splice(-2, 1);
    ss.forEach((s, i) => {
      const L0 = lAt(s), R0 = rAt(s);
      for (const [d, dy] of thick ? [[L0, 0], [R0, 0], [L0, -thick], [R0, -thick]] : [[L0, 0], [R0, 0]]) pos.push(...b.xyz(s, d, h(s) + off + dy));
      if (!i) return;
      const x = (i - 1) * stride, y = i * stride;
      idx.push(x, x + 1, y, x + 1, y + 1, y);
      if (thick) idx.push(x + 2, y + 2, x + 3, x + 3, y + 2, y + 3, x, y, x + 2, x + 2, y, y + 2, x + 1, x + 3, y + 1, x + 3, y + 3, y + 1);
    });
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    b.put(g, mat, ck, 1);
  }
  /** A ribbon along the roadway, split at the chunk cuts. */
  function strips(mat, a, c, l, r, off = 0, thick = 0) {
    const cuts = near ? [a, ...CUTS.filter((v) => v > a && v < c), c] : [a, c];
    for (let i = 1; i < cuts.length; i++) (mat === 'asphalt' && typeof l !== 'function' ? b.strip : ribbon)(mat, cuts[i - 1], cuts[i], l, r, off, thick, chunk((cuts[i - 1] + cuts[i]) / 2));
  }
  const both = (fn) => { fn(-1); fn(1); };
  /** Height of the north anchorage's low block (estimated: the part of the mass a Cityscape map shows). */
  const NORTH_LOW = 22;

  // ---- The deck: roadway, median barrier, sidewalks, railings ----------------------------------------
  const [B0, B1] = [BRIDGE_START, BRIDGE_END];
  // Beyond the mapped bridge the two carriageways separate (golden-gate-bridge-profile.js#roadEdgesAt):
  // each keeps its own pavement on one wide ramp deck, the median between them is bare deck.
  const outerW = (s) => roadEdgesAt(s)[0][0], innerW = (s) => roadEdgesAt(s)[0][1];
  const innerE = (s) => roadEdgesAt(s)[1][0], outerE = (s) => roadEdgesAt(s)[1][1];
  const EXT = [[0, B0], [B1, L]];
  strips('asphalt', B0, B1, -KERB, KERB, 0, 0);
  for (const [a, c] of EXT) { strips('asphalt', a, c, outerW, innerW, 0, 0); strips('asphalt', a, c, innerE, outerE, 0, 0); }
  if (near) strips('concrete', B0, B1, -BARRIER, BARRIER, 0.82, 0.84);      // movable median barrier
  // On the bridge: steel floor out to the trusses, raised sidewalks, the traffic railing at the kerb
  // and the outer railing (drawn solid: from the road its balusters read as one orange band).
  strips('steel', B0, B1, -DECK_HALF, DECK_HALF, -0.3, 0.6);
  both((o) => {
    const k = o * KERB, w = o * SIDEWALK;
    if (near) strips('concrete', B0, B1, Math.min(k + o * 0.3, w + o * 0.1), Math.max(k + o * 0.3, w + o * 0.1), 0.22, 0.55);
    if (near) strips('steel', B0, B1, Math.min(k, k + o * 0.32), Math.max(k, k + o * 0.32), 1.0, 1.05);
    strips('steel', B0, B1, Math.min(w, w + o * 0.18), Math.max(w, w + o * 0.18), 1.42, 1.75);
  });
  // Beyond the mapped bridge (flat-map ramps over the approach roads): a concrete deck with parapets.
  const edgeW = (s) => outerW(s) - 0.9, edgeE = (s) => outerE(s) + 0.9;
  for (const [a, c] of EXT) {
    strips('concrete', a, c, edgeW, edgeE, -0.06, 0.9);
    if (near) {
      strips('concrete', a, c, edgeW, (s) => outerW(s) - 0.35, 1.0, 1.06);
      strips('concrete', a, c, (s) => outerE(s) + 0.35, edgeE, 1.0, 1.06);
    }
  }
  // Lane paint (the HD pavement's own paint replaces it in the app): edge lines and lane dashes on
  // the bridge, the carriageway edge lines on the ramps.
  if (near) {
    const line = (d, a, c, w = 0.15) => ribbon('paint', a, c, typeof d === 'function' ? (s) => d(s) - w / 2 : d - w / 2, typeof d === 'function' ? (s) => d(s) + w / 2 : d + w / 2, 0.025, 0, chunk((a + c) / 2));
    both((o) => {
      for (const [a, c] of [[B0, L / 3], [L / 3, 2 * L / 3], [2 * L / 3, B1]]) line(o * (KERB - 0.3), a, c);
      for (let s = B0 + 2; s < B1 - 4; s += 12.2) for (const d of [3.35, 6.4]) line(o * d, s, s + 3.05, 0.13);
    });
    for (const [a, c] of EXT) for (const [f, k] of [[outerW, 0.3], [innerW, -0.3], [innerE, 0.3], [outerE, -0.3]]) line((s) => f(s) + k, a, c);
  }

  // ---- Stiffening truss (Warren with verticals) on the suspension spans and approach viaducts --------
  // Interrupted at the tower legs and the pylons; over the north anchorage it rides on steel bents.
  const gaps = [[TOWER_S[0], 7.4], [TOWER_S[1], 7.4], [S2, 5.6], [S1, 5.6], [N2, 5.6]];
  const runs = [[B0 + 0.5, N1 - 5.6], [N1 + 5.6, B1 - 0.5]].flatMap(([a, c]) => {
    const cuts = gaps.filter(([s]) => s > a && s < c).sort((u, v) => u[0] - v[0]);
    const out = []; let from = a;
    for (const [s, half] of cuts) { out.push([from, s - half]); from = s + half; }
    out.push([from, c]); return out;
  });
  const yTop = (s) => h(s) - TRUSS_TOP, yBot = (s) => h(s) - TRUSS_BOTTOM;
  for (const [a, c] of runs) {
    both((o) => {
      const d = o * CABLE_D;
      strips('steel', a, c, d - 0.5, d + 0.5, -TRUSS_TOP, 1.1);                      // top chord
      strips('steel', a, c, d - 0.5, d + 0.5, -(TRUSS_BOTTOM - 1.1), 1.1);           // bottom chord
      const n = Math.max(1, Math.round((c - a) / PANEL)), step = (c - a) / n;
      for (let k = 0; k <= n; k++) {
        const s = a + k * step, ck = chunk(s);
        if (near) member('steel', P(s, d, yBot(s) + 1.0), P(s, d, yTop(s) - 1.0), 0.75, 0.7, ck, 1, s);   // verticals
        if (k < n && (near || k % 4 === 0)) {                                                                           // diagonals
          const s2 = a + (k + (near ? 1 : 4)) * step, up = k % (near ? 2 : 8) === 0;
          if (s2 <= c + 1e-6) member('steel', P(up ? s : s2, d, yBot(up ? s : s2) + 1.0), P(up ? s2 : s, d, yTop(up ? s2 : s) - 1.0), 0.6, 0.55, ck, 1, s);
        }
      }
    });
    if (near) {   // bottom lateral bracing and sway struts between the two trusses, every two panels
      const n = Math.max(1, Math.round((c - a) / (2 * PANEL))), step = (c - a) / n;
      for (let k = 0; k < n; k++) {
        const s = a + k * step, s2 = s + step, y = yBot(s) + 0.5, ck = chunk(s);
        member('steel', P(s, -CABLE_D, y), P(s2, CABLE_D, y), 0.45, 0.45, ck, 1, s);
        member('steel', P(s, CABLE_D, y), P(s2, -CABLE_D, y), 0.45, 0.45, ck, 1, s);
        member('steel', P(s, -CABLE_D, y), P(s, CABLE_D, y), 0.55, 0.55, ck, 1, s);
      }
    }
  }

  // ---- The towers ----------------------------------------------------------------------------------
  function tower(s0) {
    const ck = chunk(s0);
    // Concrete pier with stepped top and vertical flutes; the legs stand on it.
    // the pier's base reaches the bed in Full 3D world (weight 0 there); the rest is rigid
    box('concrete', s0, 0, (PIER_TOP - 3.2) / 2, PIER[0], PIER[1], PIER_TOP - 3.2, ck, liftBelow(PIER_TOP - 3.2));
    box('concrete', s0, 0, PIER_TOP - 1.6, PIER[0] - 2.4, PIER[1] - 2.4, 3.2, ck);
    if (near) for (const o of [-1, 1]) for (let k = -6; k <= 6; k++) box('concrete', s0 + o * (PIER[0] / 2 + 0.12), k * 3.0, (PIER_TOP - 3.2) / 2, 0.5, 1.1, PIER_TOP - 4.2, ck);
    for (const o of [-1, 1]) {
      // each setback is a ledge: the top ring of one section and the bottom ring of the next share a height
      const d = o * CABLE_D, rings = LEG.flatMap(([y0, y1, along, across]) => [section(s0, d, y0, along, across), section(s0, d, y1, along, across)]);
      loft('tower', rings, (y) => P(s0, d, y), {}, ck, 1);
      box('tower', s0, d, (LEG_TOP + TOWER_TOP) / 2, 5.4, 4.8, TOWER_TOP - LEG_TOP, ck);   // saddle housing
    }
    // Portal struts: the deep top strut and three below it, each with stepped brackets in the
    // opening's upper corners and (near) a grille of vertical ribs on both faces.
    const innerAt = (y) => CABLE_D - LEG.find(([a, c]) => y >= a && y <= c)[3] / 2;   // the legs' inner faces
    const inner = innerAt(40);
    for (const [y0, y1] of STRUTS_ABOVE) {
      const inner = innerAt(y0 - 4);
      box('tower', s0, 0, (y0 + y1) / 2, STRUT_DEPTH, 2 * CABLE_D, y1 - y0, ck);
      for (const o of [-1, 1]) {
        box('tower', s0, o * (inner - 1.3), y0 - 1.3, STRUT_DEPTH - 0.6, 2.6, 2.6, ck);
        box('tower', s0, o * (inner - 0.6), y0 - 3.2, STRUT_DEPTH - 1.0, 1.2, 1.2, ck);
        if (near) for (let k = -4; k <= 4; k++) box('tower', s0 + o * (STRUT_DEPTH / 2 + 0.15), k * 2.0, (y0 + y1) / 2, 0.3, 0.7, y1 - y0, ck);
      }
    }
    // Below the deck: horizontal struts and two panels of X-bracing.
    for (const [y0, y1] of STRUTS_BELOW) box('tower', s0, 0, (y0 + y1) / 2, STRUT_DEPTH, 2 * CABLE_D, y1 - y0, ck);
    const panels = [[STRUTS_BELOW[0][1], STRUTS_BELOW[1][0]], [STRUTS_BELOW[1][1], STRUTS_BELOW[2][0]]];
    for (const [y0, y1] of panels) for (const o of [-1, 1]) member('tower', P(s0, -o * inner, y0), P(s0, o * inner, y1), 2.0, 2.4, ck, 1, s0);
  }
  for (const s of TOWER_S) tower(s);

  // The south tower's fender: an elliptical concrete wall round the pier, 4 m above the water. The
  // mapped half (south of the tower) is mirrored about the tower for the north half.
  {
    const mapped = FENDER.map((q) => p.projectBridge(q.x, q.z)).map((q) => [q.s - TOWER_S[0], q.lateral]);
    const ring = [...mapped, ...mapped.slice().reverse().map(([u, d]) => [-u, d])];
    const l = list('concrete', chunk(TOWER_S[0]), 1), W = 2.2, H = 4.0, n = ring.length;
    const pt = ([u, d], y, inset) => { const k = 1 - inset / (Math.hypot(u, d) || 1); return P(TOWER_S[0] + u * k, d * k, y); };
    for (let i = 0; i < n; i++) {
      const a = ring[i], c = ring[(i + 1) % n];
      if (Math.hypot(a[0] - c[0], a[1] - c[1]) < 0.5) continue;
      const out = new Vector3().subVectors(P(TOWER_S[0] + (a[0] + c[0]) / 2, (a[1] + c[1]) / 2, 0), P(TOWER_S[0], 0, 0));
      const [A0, C0, A1, C1] = [pt(a, 0, 0), pt(c, 0, 0), pt(a, H, 0), pt(c, H, 0)];
      const [a0, c0, a1, c1] = [pt(a, 0, W), pt(c, 0, W), pt(a, H, W), pt(c, H, W)];
      face(l, A0, C0, C1, A1, out);                     // outer wall
      face(l, a0, c0, c1, a1, out.clone().negate());    // inner wall
      face(l, A1, C1, c1, a1, UP);                      // top
    }
  }

  // ---- Main cables and suspenders ---------------------------------------------------------------------
  // Smooth tubes sampled at 24 points on the main span and 12 on each side span (near), 10 and 5 far.
  function tube(mat, pts, r, sides, ck) {
    const pos = [], idx = [];
    for (let i = 0; i < pts.length; i++) {
      const t = new Vector3().subVectors(pts[Math.min(pts.length - 1, i + 1)], pts[Math.max(0, i - 1)]).normalize();
      const u = new Vector3().crossVectors(t, UP).normalize(), v = new Vector3().crossVectors(u, t);
      for (let k = 0; k < sides; k++) {
        const a = 2 * Math.PI * k / sides;
        pos.push(...pts[i].clone().addScaledVector(u, Math.cos(a) * r).addScaledVector(v, Math.sin(a) * r).toArray());
      }
      if (i) for (let k = 0; k < sides; k++) {
        const k2 = (k + 1) % sides, a0 = (i - 1) * sides;
        idx.push(a0 + k, i * sides + k, a0 + k2, a0 + k2, i * sides + k, i * sides + k2);
      }
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    // wind outward: the first quad's normal must point away from the axis
    const n0 = new Vector3(), A = new Vector3().fromArray(pos, 0), B = new Vector3().fromArray(pos, sides * 3), C = new Vector3().fromArray(pos, 3);
    n0.subVectors(B, A).cross(new Vector3().subVectors(C, A));
    if (n0.dot(new Vector3().subVectors(A, pts[0])) < 0) { for (let i = 0; i < idx.length; i += 3) [idx[i + 1], idx[i + 2]] = [idx[i + 2], idx[i + 1]]; g.setIndex(idx); g.computeVertexNormals(); }
    b.put(g, mat, ck, 1);
  }
  const sides = near ? 8 : 5;
  for (const o of [-1, 1]) {
    const d = o * CABLE_D, span = (a, c, n) => Array.from({ length: n + 1 }, (_, k) => { const s = a + (c - a) * k / n; return P(s, d, cableY(s)); });
    tube('steel', span(TOWER_S[0], TOWER_S[1], near ? 24 : 10), 0.46, sides, chunk(TOWER_S[0] + 10));
    tube('steel', span(S1, TOWER_S[0], near ? 12 : 5), 0.46, sides, chunk(S1));
    tube('steel', span(TOWER_S[1], N1, near ? 12 : 5), 0.46, sides, chunk(N1));
    // From S1 the cables run beside the deck over the Fort Point arch into the south anchorage at S2.
    member('steel', P(S1, d, cableY(S1)), P(S2, d, h(S2) + 1.6), 0.9, 0.9, chunk(S2), 1, S1);
    member('steel', P(S2, d, h(S2) + 1.6), P(ANCHORAGE.south.s[1] - 18, d, h(S2) - 22), 0.9, 0.9, chunk(S2), 1, S2);
    member('steel', P(N1, d, cableY(N1)), P(N1 + 26, d, NORTH_LOW + 4), 0.9, 0.9, chunk(N1), 1, N1);   // into the cable housing
  }
  // Suspender pairs: one flat ribbon per pair from the cable down to the top chord.
  for (const [k, s] of SUSPENDERS.entries()) {
    if (!near && k % 2) continue;   // far (2-8 km): every other band
    const top = cableY(s) - CABLE_R, foot = h(s) - TRUSS_TOP;
    if (top - foot < 1.0) continue;
    for (const o of [-1, 1]) member('steel', P(s, o * CABLE_D, foot), P(s, o * CABLE_D, top), near ? 0.42 : 0.5, near ? 0.16 : 0.22, chunk(s), 1, s);
  }

  /** A closed block (top, sides, ends; no bottom) from y0 up to topAt(s), between two stations. */
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

  // ---- Pylons S1/S2/N1/N2, the piers between them and the anchorages ---------------------------------
  function pylon(s, rise) {
    const ck = chunk(s), top = h(s) + rise, foot = liftBelow(top);
    for (const o of [-1, 1]) {
      const d = o * PYLON_D, rings = [
        section(s, d, 0, 13, 7.5), section(s, d, h(s) - TRUSS_BOTTOM, 13, 7.5), section(s, d, h(s) - TRUSS_BOTTOM, 10, 5.5),
        section(s, d, top - 3.5, 10, 5.5), section(s, d, top - 3.5, 8, 4.4), section(s, d, top, 8, 4.4),
      ];
      loft('concrete', rings, (y) => P(s, d, y), {}, ck, foot);
    }
    // the cross wall under the deck between the pair (mapped piers 36 x 13 m)
    box('concrete', s, 0, (h(s) - TRUSS_BOTTOM) / 2, 11, 2 * PYLON_D - 2, h(s) - TRUSS_BOTTOM, ck, liftBelow(h(s) - TRUSS_BOTTOM));
  }
  pylon(S2, 18); pylon(S1, 7.5); pylon(N1, 7.5); pylon(N2, 18);
  // The south anchorage (mapped outline, south of S2): a stepped block the cables run down into.
  {
    const [a, c] = ANCHORAGE.south.s, [dl, dr] = ANCHORAGE.south.d, mid = (a + c) / 2, ck = chunk(mid);
    const y1 = h(c) - 22, low = 0.45 * y1;
    box('concrete', mid, (dl + dr) / 2, low / 2, c - a, dr - dl, low, ck, liftBelow(low));
    box('concrete', c - 22, 0, (low + y1) / 2, 40, 2 * PYLON_D + 6, y1 - low, ck, liftBelow(y1));
    if (near) for (const o of [-1, 1]) for (let k = 0; k < 4; k++) box('concrete', c - 38 + k * 10.6, o * (PYLON_D + 3.4), (low + y1) / 2, 1.8, 0.8, y1 - low - 2, ck, liftBelow(y1));
  }
  // The north anchorage (mapped outline between N1 and N2): a low block with pilaster relief, a
  // tapered cable housing behind pylon N1 that the cables run down into, and the deck truss carried
  // across it on steel bents. Rigid (weight 1): in Full 3D world it sits in the hillside.
  {
    const [a, c] = ANCHORAGE.north.s, [dl, dr] = ANCHORAGE.north.d, mid = (a + c) / 2, ck = chunk(mid);
    box('concrete', mid, (dl + dr) / 2, NORTH_LOW / 2, c - a - 6, dr - dl, NORTH_LOW, ck, 1);
    if (near) for (const [d, o] of [[dl, -1], [dr, 1]]) for (let s = a + 9; s < c - 6; s += 10) box('concrete', s, d + o * 0.3, NORTH_LOW / 2 - 0.5, 2.0, 1.0, NORTH_LOW - 1, ck, 1);
    const s0 = N1 + 4, s1 = N1 + 32, top = (s) => h(N1) - 9.5 + (NORTH_LOW + 6 - (h(N1) - 9.5)) * (s - s0) / (s1 - s0);
    block('concrete', s0, s1, -CABLE_D - 2.2, CABLE_D + 2.2, NORTH_LOW - 0.5, top, ck, 1);
    for (const s of [N1 + 40, (N1 + N2) / 2 + 12, N2 - 12]) bent(s, NORTH_LOW, 1);
  }

  // ---- The Fort Point arch ----------------------------------------------------------------------------
  {
    const N = near ? 16 : 8, ck = chunk(ARCH.a), us = Array.from({ length: N + 1 }, (_, k) => k / N);
    const ss = us.map(ARCH.station), lo = us.map(ARCH.bottom), hi = us.map(ARCH.top);
    for (const o of [-1, 1]) {
      const d = o * ARCH.rib;
      for (let k = 0; k < N; k++) {
        member('steel', P(ss[k], d, hi[k]), P(ss[k + 1], d, hi[k + 1]), 1.6, 1.3, ck, 1, ss[k]);      // extrados chord
        member('steel', P(ss[k], d, lo[k]), P(ss[k + 1], d, lo[k + 1]), 1.6, 1.3, ck, 1, ss[k]);      // intrados chord
        if (near) member('steel', P(ss[k], d, k % 2 ? hi[k] : lo[k]), P(ss[k + 1], d, k % 2 ? lo[k + 1] : hi[k + 1]), 0.7, 0.6, ck, 1, ss[k]);
      }
      for (let k = 0; k <= N; k++) {
        const s = ss[k], yd = h(s) - TRUSS_BOTTOM;
        if (near && k > 0 && k < N) member('steel', P(s, d, lo[k]), P(s, d, hi[k]), 0.7, 0.6, ck, 1, s);     // web posts
        if (yd - hi[k] > 1.0) member('steel', P(s, d, hi[k]), P(s, d, yd), 1.1, 0.9, ck, 1, s);             // spandrel columns
        if (near && k < N && yd - hi[k] > 4 && yd - hi[k + 1] > 4) member('steel', P(s, d, hi[k] + 1), P(ss[k + 1], d, yd - 1), 0.55, 0.5, ck, 1, s);
      }
      box('concrete', ss[0] - 2, d, ARCH.y0 / 2, 9, 7, ARCH.y0, ck, liftBelow(ARCH.y0));                     // springing piers
      box('concrete', ss[N] + 2, d, ARCH.y0 / 2, 9, 7, ARCH.y0, ck, liftBelow(ARCH.y0));
    }
    if (near) for (let k = 1; k < N; k++) member('steel', P(ss[k], -ARCH.rib, hi[k]), P(ss[k], ARCH.rib, hi[k]), 0.6, 0.6, ck, 1, ss[k]);
  }

  // ---- Approach viaducts on steel bents (mapped bridge) and concrete piers (flat-map ramps) -----------
  /** A steel bent from `foot` up to the truss: two columns, struts and (near) X-bracing. */
  function bent(s, foot = 0, rigid = 0) {
    const top = h(s) - TRUSS_BOTTOM, ck = chunk(s), lift = rigid || liftBelow(top, foot);
    if (top - foot < 2) return;
    for (const o of [-1, 1]) member('steel', P(s, o * 11, foot), P(s, o * 11, top), 2.0, 1.6, ck, lift, s);
    for (let y = foot + 14; y < top - 4; y += 16) member('steel', P(s, -11, y), P(s, 11, y), 0.9, 0.9, ck, lift, s);
    if (near) for (let y = foot; y + 16 < top; y += 16) for (const o of [-1, 1]) member('steel', P(s, -o * 11, y + 1), P(s, o * 11, y + 15), 0.6, 0.6, ck, lift, s);
    member('steel', P(s, -CABLE_D - 0.5, top), P(s, CABLE_D + 0.5, top), 1.4, 1.2, ck, lift, s);
  }
  for (const [a, c] of [[SOUTH_VIADUCT[0], ANCHORAGE.south.s[0]], NORTH_VIADUCT]) {
    const n = Math.max(1, Math.round((c - a) / 36));
    for (let k = 1; k < n; k += near ? 1 : 2) bent(a + (c - a) * k / n);
  }
  bent(B0 + 1.5); bent(B1 - 1.5);
  // Beyond the mapped bridge: a concrete box girder on two-column piers while high, solid fill below.
  function solid(s0, s1) {
    const n = Math.max(2, Math.ceil((s1 - s0) / 4)), pos = [], idx = [];
    for (let i = 0; i <= n; i++) {
      const s = s0 + (s1 - s0) * i / n, top = Math.max(h(s) - 0.12, 0.05);
      for (const [d, y] of [[edgeW(s), top], [edgeE(s), top], [edgeW(s), 0], [edgeE(s), 0]]) pos.push(...b.xyz(s, d, y));
      if (!i) continue;
      const u = (i - 1) * 4, v = i * 4;
      idx.push(u, u + 1, v, u + 1, v + 1, v, u, v, u + 2, u + 2, v, v + 2, u + 1, u + 3, v + 1, u + 3, v + 3, v + 1);
    }
    idx.push(0, 2, 1, 1, 2, 3, n * 4, n * 4 + 1, n * 4 + 2, n * 4 + 1, n * 4 + 3, n * 4 + 2);
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    b.put(g, 'concrete', chunk((s0 + s1) / 2), (y) => (y > 0.05 ? 1 : 0));
  }
  // The fill starts where the deck is 0.25 m up: below that the ramp is pavement on grade (a fill
  // top clamped above the road would show through the asphalt at the foot).
  let fillSouth = 0; while (h(fillSouth) < FILL_BELOW) fillSouth += 0.5;
  let fillNorth = L; while (h(fillNorth) < FILL_BELOW) fillNorth -= 0.5;
  let footSouth = 0; while (h(footSouth) < 0.25) footSouth += 0.5;
  let footNorth = L; while (h(footNorth) < 0.25) footNorth -= 0.5;
  solid(footSouth, fillSouth); solid(fillNorth, footNorth);
  for (const [a, c] of [[fillSouth, B0], [B1, fillNorth]]) {
    strips('concrete', a, c, (s) => edgeW(s) + 4, (s) => edgeE(s) - 4, -0.96, 2.2);
    const n = Math.max(1, Math.round((c - a) / 38));
    for (let k = 1; k < n; k++) {
      const s = a + (c - a) * k / n, top = h(s) - 3.1, ck = chunk(s), dl = edgeW(s) + 5, dr = edgeE(s) - 5;
      if (!near && k % 2) continue;
      for (const d of [dl, dr]) member('concrete', P(s, d, 0), P(s, d, top), 2.4, 2.4, ck, liftBelow(top), s);
      if (dr - dl > 18) member('concrete', P(s, (dl + dr) / 2, 0), P(s, (dl + dr) / 2, top), 2.4, 2.4, ck, liftBelow(top), s);
      box('concrete', s, (dl + dr) / 2, top + 0.6, 2.6, dr - dl + 4, 1.2, ck, 1);
    }
  }

  // ---- Lamps: orange standards at the kerb with the head over the roadway, every 100 ft --------------
  for (let s = B0 + 12; near && s < B1 - 6; s += 30.48) {   // far (2-8 km): no lamps
    if (TOWER_S.some((t) => Math.abs(s - t) < 10) || [S1, S2, N1, N2].some((t) => Math.abs(s - t) < 8)) continue;
    const ck = chunk(s);
    for (const o of [-1, 1]) {
      const d = o * (KERB + 0.16), y = h(s);
      member('steel', P(s, d, y + 1.0), P(s, d, y + 7.4), 0.22, 0.22, ck, 1, s);
      member('steel', P(s, d, y + 7.4), P(s, d - o * 1.5, y + 7.9), 0.18, 0.18, ck, 1, s);
      box('lamp', s, d - o * 1.65, y + 7.75, 1.25, 0.55, 0.34, ck);
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
