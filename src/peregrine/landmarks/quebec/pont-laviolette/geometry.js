import { BufferGeometry, Float32BufferAttribute, Vector3 } from 'three';
import { bridgeBuilder } from '../../asset-geometry.js';
import { PROFILE as p, VC_TOP, KNEE_N, KNEE_S } from './pont-laviolette-profile.js';
import {
  h, MAIN_S, TIP_S, CREST_S, TRUSS_START, TRUSS_END, BRIDGE_START, BRIDGE_END, TRUSS_PIER_S, APPROACH_PIER_S,
  CONCRETE_START, TRUSS_D, TRUSSES, TOP_ABOVE, BOT_BELOW, CHORD, FLOOR_TOP, FLOOR_BOT, SLAB, PLATE_DEPTH,
  PRECAST_DEPTH, PLATE_D, PORTAL_CLEAR, ARCH_CHORD, SHOE_Y, MAIN_PIER_TOP, DECK_HALF, KERB, MEDIAN, CROWN_TOP,
  topY, botY, floorY, PANEL_POINTS,
} from './pont-laviolette-structure.js';

const clamp01 = (v) => Math.max(0, Math.min(1, v));
const UP = new Vector3(0, 1, 0);

/**
 * Pont Laviolette: a 2.7 km A-55 crossing of the St. Lawrence. Two turquoise steel truss planes 18.6 m
 * apart carry the four-lane deck through 1.4 km of continuous through-trusses; over the navigation channel
 * the top chords sweep up into a 106.6 m arch whose lower chord dips through the deck to pin bearings on
 * the two main piers (the deck hangs from it on rope hangers), so the arch and its flanking anchor spans
 * read as one S-curved silhouette. Long plate-girder and precast approaches on twin-column piers climb from
 * both shores at about 4.5 %. Real metres, +X east, +Y up, +Z south, built on the mapped A-55 alignment
 * (pont-laviolette-profile.js) so it is one surface with the car, route and HD road.
 */
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = bridgeBuilder(p, detail), L = p.BRIDGE_LENGTH;
  // Five spatial chunks (near only): north approach, north trusses, the arch, south trusses, south approach.
  const CUTS = [TRUSS_START, MAIN_S[0] - 90, MAIN_S[1] + 90, TRUSS_END];
  const chunk = (s) => (near ? CUTS.filter((c) => s >= c).length : 0);
  const frame = (s) => { const q = p.bridgePoint(s, 0); return { T: new Vector3(q.tx, 0, q.tz), N: new Vector3(-q.tz, 0, q.tx) }; };
  const P = (s, d, y) => { const q = p.bridgePoint(s, d, y); return new Vector3(q.x, y, q.z); };
  const W = (k) => (near ? k : k * 1.35);   // far members read thicker at 2-8 km

  // ---- Mesh helpers (the Pont de Québec's) ------------------------------------------------------------
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

  // Stations where the deck bends (the sag and crest curves): ribbons are sampled every STEP there and
  // every 40 m on the constant grades (exact: the grade is linear), plus every alignment vertex and cut.
  // Far samples the 700 m crest curve every 64 m (a 6 cm chord sag) and keeps the ramp ends at 16 m.
  const STEP = near ? 8 : 16;
  const curved = (s) => s < BRIDGE_START + KNEE_N + 1 || s > BRIDGE_END - KNEE_S - 1 || Math.abs(s - CREST_S) < VC_TOP / 2 + 1;
  /** A ribbon along the deck between stations a and c, lateral l..r (numbers or functions of s), top at
   * deck + off (a number or a function of s), `thick` deep (0: a flat surface). `open` leaves out the bottom
   * and the end caps of a solid ribbon (faces nobody sees: far, on the deck). */
  function ribbon(mat, a, c, l, r, off, thick, ck, lift = 1, bottomAt = null, open = false) {
    const lAt = typeof l === 'function' ? l : () => l, rAt = typeof r === 'function' ? r : () => r;
    const offAt = typeof off === 'function' ? off : () => off;
    const set = new Set([a, c]);
    for (let s = Math.ceil(a / STEP) * STEP; s < c; s += STEP) if ((curved(s) && (near || Math.abs(s - CREST_S) > VC_TOP / 2 + 1 || s % 64 === 0)) || s % 40 === 0) set.add(s);
    for (const v of [BRIDGE_START + KNEE_N, BRIDGE_END - KNEE_S, CREST_S - VC_TOP / 2, CREST_S + VC_TOP / 2, ...p.ALIGNMENT.map((q) => q.s)]) if (v > a && v < c) set.add(v);
    const ss = [...set].sort((u, v) => u - v).filter((s, i, all) => !i || s - all[i - 1] > 0.05);
    const pos = [], idx = [];
    // Flat surfaces share their vertices; solid ribbons get their own vertices per face so their edges
    // stay crisp (the app recomputes normals after every fit).
    const corners = ss.map((s) => {
      const L0 = lAt(s), R0 = rAt(s), top = h(s) + offAt(s), bot = bottomAt ? bottomAt(s) : top - thick;
      return [[L0, top], [R0, top], [L0, bot], [R0, bot]].map(([d, y]) => b.xyz(s, d, y));
    });
    const quadOf = (A, B, C, D) => { const k = pos.length / 3; pos.push(...A, ...B, ...C, ...D); idx.push(k, k + 1, k + 2, k, k + 2, k + 3); };
    if (!thick) {
      corners.forEach((c, i) => {
        pos.push(...c[0], ...c[1]);
        if (i) { const x = (i - 1) * 2, y = i * 2; idx.push(x, x + 1, y, x + 1, y + 1, y); }
      });
    } else {
      for (let i = 1; i < corners.length; i++) {
        const [a0, a1, a2, a3] = corners[i - 1], [c0, c1, c2, c3] = corners[i];
        quadOf(a0, a1, c1, c0);           // top (up)
        if (!open) quadOf(a2, c2, c3, a3);   // bottom (down)
        quadOf(a0, c0, c2, a2);           // left side
        quadOf(a1, a3, c3, c1);           // right side
      }
      const [s0, s1, s2, s3] = corners[0], [e0, e1, e2, e3] = corners.at(-1);
      if (!open) { quadOf(s0, s2, s3, s1); quadOf(e0, e1, e3, e2); }   // end caps
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    b.put(g, mat, ck, lift);
  }
  /** A ribbon split at the chunk cuts. */
  function strips(mat, a, c, l, r, off = 0, thick = 0, lift = 1, bottomAt = null, open = false) {
    const cuts = near ? [a, ...CUTS.filter((v) => v > a && v < c), c] : [a, c];
    for (let i = 1; i < cuts.length; i++) ribbon(mat, cuts[i - 1], cuts[i], l, r, off, thick, chunk((cuts[i - 1] + cuts[i]) / 2), lift, bottomAt, open);
  }

  // ---- The two truss planes ---------------------------------------------------------------------------
  const PP = PANEL_POINTS;
  const isMain = (s) => MAIN_S.some((m) => Math.abs(m - s) < 0.01);
  const deep = (s) => topY(s) - botY(s) > 20;
  /** Far: consecutive segments { a, c, w } of one chord or line become one member while every panel point
   * between stays within 0.25 m of it (straight runs merge whole, the arch's curve by threes or fewer;
   * kinks, width changes and the crest never merge). */
  function runs(d, segs, yAt, t) {
    for (let i = 0; i < segs.length;) {
      let j = i;
      for (; j + 1 < segs.length && segs[j + 1].w === segs[i].w && Math.abs(segs[j + 1].a - segs[j].c) < 0.01 && Math.abs(segs[j].c - CREST_S) > 0.01; j++) {
        const a = segs[i].a, c = segs[j + 1].c, ya = yAt(a), yc = yAt(c);
        let fits = true;
        for (let k = i; k <= j && fits; k++) fits = Math.abs(yAt(segs[k].c) - (ya + (yc - ya) * (segs[k].c - a) / (c - a))) < 0.25;
        if (!fits) break;
      }
      member('steel', P(segs[i].a, d, yAt(segs[i].a)), P(segs[j].c, d, yAt(segs[j].c)), segs[i].w, t, 0, 1, segs[i].a);
      i = j + 1;
    }
  }
  for (const d of TRUSSES) {
    const topRuns = [], botRuns = [], floorRuns = [];
    for (let i = 0; i + 1 < PP.length; i++) {
      const a = PP[i].s, c = PP[i + 1].s, ck = chunk((a + c) / 2), arch = Math.abs((a + c) / 2 - CREST_S) < MAIN_S[1] - CREST_S;
      const w = arch ? ARCH_CHORD : W(CHORD);
      const lowered = Math.abs(botY(a) - floorY(a)) > 0.3 || Math.abs(botY(c) - floorY(c)) > 0.3;
      // chords (far: merged along straight runs below)
      if (near) {
        member('steel', P(a, d, topY(a)), P(c, d, topY(c)), w, 1.1, ck, 1, a);
        member('steel', P(a, d, botY(a)), P(c, d, botY(c)), w, 1.1, ck, 1, a);
      } else { topRuns.push({ a, c, w }); botRuns.push({ a, c, w }); }
      // the floor line: a deck-level edge girder where the bottom chord leaves the floor (the hangers
      // and the floor beams hang from it across the arch)
      if (lowered) { if (near) member('steel', P(a, d, floorY(a)), P(c, d, floorY(c)), W(1.2), 0.9, ck, 1, a); else floorRuns.push({ a, c, w: W(1.2) }); }
      // web: Warren in the through trusses, X where the truss is deep (over the main piers), N-pattern
      // diagonals rising towards the crown across the arch (far: one diagonal per panel everywhere)
      const up = (k) => P(k, d, topY(k)), dn = (k) => P(k, d, botY(k));
      const wd = W(near ? 0.8 : 0.9);
      if (near && (deep(a) || deep(c))) {
        member('steel', dn(a), up(c), wd, 0.8, ck, 1, a);
        member('steel', up(a), dn(c), wd, 0.8, ck, 1, a);
      } else if (arch) {
        const [o, k] = a < CREST_S ? [a, c] : [c, a];   // outer (pier side) and inner (crown side)
        member('steel', dn(o), up(k), wd, 0.8, ck, 1, a);
      } else if (i % 2 === 0) member('steel', dn(a), up(c), wd, 0.8, ck, 1, a);
      else member('steel', up(a), dn(c), wd, 0.8, ck, 1, a);
    }
    if (!near) { runs(d, topRuns, topY, 1.1); runs(d, botRuns, botY, 1.1); runs(d, floorRuns, floorY, 0.9); }
    // verticals (far: every fourth, and the end and main posts; the diagonals carry the web)
    for (let i = 0; i < PP.length; i++) {
      const { s } = PP[i], ck = chunk(s);
      const end = s === TRUSS_START || s === TRUSS_END || isMain(s);
      if (!near && i % 4 && !end) continue;
      member('steel', P(s, d, botY(s)), P(s, d, topY(s)), W(end ? 1.6 : 0.8), end ? 1.4 : 0.8, ck, 1, s);
    }
  }

  // ---- Hangers: steel ropes at every lower-chord panel point of the arch, down to the floor line --------
  for (const { s } of PP) {
    if (s <= TIP_S[0] + 0.01 || s >= TIP_S[1] - 0.01) continue;
    for (const d of TRUSSES) member('cable', P(s, d, botY(s) - ARCH_CHORD / 2), P(s, d, floorY(s) + 0.45), near ? 0.22 : 0.4, near ? 0.22 : 0.4, chunk(s), 1, s);
  }

  // ---- Transverse bracing between the truss planes -------------------------------------------------------
  for (const [i, { s }] of PP.entries()) {
    const ck = chunk(s), yt = topY(s), yb = botY(s), road = h(s);
    const end = s === TRUSS_START || s === TRUSS_END, inArch = s > MAIN_S[0] + 1 && s < MAIN_S[1] - 1;
    const portal = end || isMain(s);
    // top strut at every panel point (far: the arch's and the portals only, every other one)
    if (near || ((inArch || portal) && i % 2 === 0) || portal) member('steel', P(s, -TRUSS_D, yt), P(s, TRUSS_D, yt), portal ? 1.6 : 0.8, portal ? 1.2 : 0.7, ck, 1, s);
    // arch (near): a lower strut and an X between the chords where the lower chord is high enough above the road;
    // far keeps one bracing face, the top struts
    if (near && inArch && yb > road + PORTAL_CLEAR + 0.6) {
      member('steel', P(s, -TRUSS_D, yb), P(s, TRUSS_D, yb), W(0.8), 0.7, ck, 1, s);
      member('steel', P(s, -TRUSS_D, yb), P(s, TRUSS_D, yt), 0.5, 0.5, ck, 1, s);
      member('steel', P(s, TRUSS_D, yb), P(s, -TRUSS_D, yt), 0.5, 0.5, ck, 1, s);
    }
    // through trusses: knee braces from each plane up to the top strut, their foot PORTAL_CLEAR + 1 m up
    if (near && !inArch && yt - road < 30) {
      const foot = road + PORTAL_CLEAR + 1.0;
      for (const [d, o] of [[-TRUSS_D, 1], [TRUSS_D, -1]]) member('steel', P(s, d, foot), P(s, d + o * 3.2, yt - 0.4), 0.45, 0.45, ck, 1, s);
    }
    // portals at the truss ends: a deep strut with its underside PORTAL_CLEAR above the road
    if (end) box('steel', s, 0, road + PORTAL_CLEAR + 1.2, 1.2, 2 * TRUSS_D - 1.2, 2.4, ck);
    // below the deck where the chords dip to the main piers: a strut at the lower chord and an X to the floor
    if (yb < road - 6 && (near || isMain(s))) {
      const fl = road + FLOOR_BOT - 0.3;
      member('steel', P(s, -TRUSS_D, yb), P(s, TRUSS_D, yb), isMain(s) ? 1.8 : 0.8, 0.8, ck, 1, s);
      member('steel', P(s, -TRUSS_D, yb), P(s, TRUSS_D, fl), isMain(s) ? 1.2 : 0.55, 0.55, ck, 1, s);
      member('steel', P(s, TRUSS_D, yb), P(s, -TRUSS_D, fl), isMain(s) ? 1.2 : 0.55, 0.55, ck, 1, s);
    }
    // top lateral bracing, panel by panel (near)
    if (near && i + 1 < PP.length) {
      const s2 = PP[i + 1].s, ck2 = chunk((s + s2) / 2);
      member('steel', P(s, -TRUSS_D, yt), P(s2, TRUSS_D, topY(s2)), 0.45, 0.45, ck2, 1, s);
      member('steel', P(s, TRUSS_D, yt), P(s2, -TRUSS_D, topY(s2)), 0.45, 0.45, ck2, 1, s);
    }
  }
  // Red obstruction lights on the crown of each arch plane.
  for (const d of TRUSSES) box('light', CREST_S, d, CROWN_TOP + 0.2, 0.5, 0.5, 0.5, chunk(CREST_S));

  // ---- The deck ----------------------------------------------------------------------------------------
  const A0 = BRIDGE_START, A1 = BRIDGE_END;
  // Pavement, abutment to abutment and on along the approach roads (the alignment's extensions).
  strips('asphalt', 0, L, -KERB - 0.05, KERB + 0.05, 0, 0.25, 1, null, !near);
  // The central concrete wall (since 2007) and the two outer barriers.
  if (near) strips('concrete', A0, A1, -MEDIAN, MEDIAN, 0.85, 0.95);   // far: a 1 m wall between the lanes is sub-pixel
  for (const o of [-1, 1]) strips('concrete', A0, A1, o < 0 ? -DECK_HALF : KERB, o < 0 ? -KERB : DECK_HALF, 0.85, 1.1, 1, null, !near);
  // Floor between the trusses (stringers and floor beams), and the approach slab and girders.
  strips('floor', TRUSS_START, TRUSS_END, -TRUSS_D + 0.6, TRUSS_D - 0.6, FLOOR_TOP, FLOOR_TOP - FLOOR_BOT);
  // Approach slab and girders, abutment to the trusses at both ends (the girders never reach below 0.3 m).
  const under = (depth) => (s) => Math.max(h(s) - 0.25 - SLAB - depth, 0.3);
  for (const [a, c] of [[A0, TRUSS_START], [TRUSS_END, A1]]) strips('concrete', a, c, -DECK_HALF, DECK_HALF, -0.25, SLAB);
  for (const [a, c] of [[A0, TRUSS_START], [TRUSS_END, CONCRETE_START]]) {
    for (const d of near ? PLATE_D : [0]) strips('girder', a, c, d - (near ? 0.3 : 5.9), d + (near ? 0.3 : 5.9), -0.25 - SLAB, PLATE_DEPTH, 1, under(PLATE_DEPTH));
  }
  strips('concrete', CONCRETE_START, A1, -6.6, 6.6, -0.25 - SLAB, PRECAST_DEPTH, 1, under(PRECAST_DEPTH));
  // Beyond the abutments the flat-map ramps run on embankments between retaining walls (Full 3D world:
  // on the terrain roads): a solid wedge from the ramp foot to the abutment face, kerbs on top.
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
  for (const [a, c] of [[0, A0], [A1, L]]) for (const o of [-1, 1]) strips('concrete', a, c, o < 0 ? -DECK_HALF : KERB, o < 0 ? -KERB : DECK_HALF, 0.85, 1.1);

  // Lane paint (the HD pavement's own paint replaces it in the app): edge lines and the lane dashes.
  if (near) {
    const line = (d, a, c, w = 0.15) => ribbon('paint', a, c, d - w / 2, d + w / 2, 0.02, 0, chunk((a + c) / 2));
    const cuts = [0, ...CUTS, L];
    for (let k = 1; k < cuts.length; k++) for (const d of [-KERB + 0.35, -MEDIAN - 0.3, MEDIAN + 0.3, KERB - 0.35]) line(d, cuts[k - 1], cuts[k]);
    for (let s = 4; s < L - 6; s += 12) for (const d of [-(KERB + MEDIAN) / 2, (KERB + MEDIAN) / 2]) line(d, s, s + 3, 0.13);
  }
  // Lamps on the outer barriers, staggered, their heads over the outer lanes (near only).
  for (let s = A0 + 30, k = 0; near && s < A1 - 20; s += 42, k++) {
    const o = k % 2 ? 1 : -1, ck = chunk(s), d = o * (DECK_HALF - 0.4), y = h(s);
    if ([...MAIN_S, TRUSS_START, TRUSS_END].some((t) => Math.abs(s - t) < 4)) continue;
    const top = y + 10.5 < (topY(s) ?? Infinity) - 1.5 ? y + 10.5 : null;
    if (top === null) continue;   // under the through-truss top chord the lamps hang from the bracing
    member('steel', P(s, d, y + 0.85), P(s, d, top), 0.22, 0.22, ck, 1, s);
    member('steel', P(s, d, top), P(s, d - o * 2.2, top + 0.4), 0.16, 0.16, ck, 1, s);
    box('lamp', s, d - o * 2.35, top + 0.25, 1.1, 0.45, 0.28, ck);
  }
  // Inside the trusses the lamps hang under the top struts, over each carriageway (every 4th panel).
  for (const [i, { s }] of PP.entries()) {
    if (!near || i % 4 || s > MAIN_S[0] - 20 && s < MAIN_S[1] + 20) continue;
    for (const d of [-(KERB + MEDIAN) / 2, (KERB + MEDIAN) / 2]) {
      member('steel', P(s, d, topY(s) - 0.3), P(s, d, topY(s) - 1.3), 0.12, 0.12, chunk(s), 1, s);
      box('lamp', s, d, topY(s) - 1.4, 1.1, 0.45, 0.28, chunk(s));
    }
  }

  // ---- Piers and abutments (concrete) ----------------------------------------------------------------
  /** Twin rectangular columns at ±cd from the ground to `top`, a cap beam across, a footing. */
  function bent(s, cd, top, colAlong, colAcross, capDepth, capAcross, ck) {
    const colTop = top - capDepth, lift = liftBelow(colTop);
    for (const d of [-cd, cd]) {
      member('concrete', P(s, d, 0), P(s, d, colTop + 0.02), colAlong, colAcross, ck, lift, s);
      if (near) box('concrete', s, d, 0.6, colAlong + 1.6, colAcross + 1.6, 1.2, ck, 0);
    }
    box('concrete', s, 0, top - capDepth / 2, colAlong + 0.4, capAcross, capDepth, ck, 1);
  }
  // Main piers: massive twin columns under the pin bearings, a deep cap, and the bearing shoes.
  for (const s of MAIN_S) {
    const ck = chunk(s);
    bent(s, TRUSS_D, MAIN_PIER_TOP, 6.5, 5.0, 3.0, 2 * TRUSS_D + 6, ck);
    for (const d of TRUSSES) box('steel', s, d, (MAIN_PIER_TOP + SHOE_Y) / 2 + 0.3, 3.2, 2.4, SHOE_Y - MAIN_PIER_TOP + 0.6, ck);
  }
  // Truss-span piers: twin columns under the truss planes, to just under the bottom-chord bearings.
  for (const s of TRUSS_PIER_S) {
    const top = botY(s) - CHORD / 2 - 0.6;
    bent(s, TRUSS_D, top, 3.0, 3.4, 2.0, 2 * TRUSS_D + 3.4, chunk(s));
    for (const d of TRUSSES) box('steel', s, d, top + 0.35, 1.6, 1.4, 0.75, chunk(s));
  }
  // Approach piers: slimmer twin columns under the girders (skipped where the approach fill carries the deck).
  for (const s of APPROACH_PIER_S) {
    const precast = s > CONCRETE_START + 1, top = h(s) - 0.25 - SLAB - (precast ? PRECAST_DEPTH : PLATE_DEPTH);
    if (top < 1) continue;
    bent(s, 5.6, top, 2.0, 2.4, 1.3, 15.0, chunk(s));
  }
  for (const l of lists.values()) {
    if (!l.idx.length) continue;
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(l.pos, 3)); g.setIndex(l.idx); g.computeVertexNormals();
    b.put(g, l.mat, l.ck, l.lift);
  }
  return b.finish();
}
