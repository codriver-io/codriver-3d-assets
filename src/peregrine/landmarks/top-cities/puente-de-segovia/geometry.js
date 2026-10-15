// Puente de Segovia, original procedural geometry. Frame: station s along the mapped Calle de
// Segovia carriageway (west to east), lateral d (+ = south, downstream), height y above the
// flat-map river datum. Placement data © OpenStreetMap contributors, ODbL 1.0.
import { Shape, ExtrudeGeometry, BufferGeometry, Float32BufferAttribute, CylinderGeometry, SphereGeometry, BoxGeometry } from 'three';
import { bridgeBuilder } from '../../asset-geometry.js';
import { PROFILE as P, START, END, L, MID, CENTER, HALF, PARAPET, ARCHES as GRADE_ARCHES, PIERS, PIER, SPRING, RISE, RIVER,
  WEST_FACE, EAST_FACE, ROAD_EDGES, outerEdgesAt, PAINT_END } from './puente-de-segovia-profile.js';
import { FOOTPRINTS } from './footprint.js';

// Authoring frame: y above the river, the road RISE up. The exported frame is the bank-street
// grade (y + RIVER): the deck is flush with the streets and the masonry hangs below it.
const p = { ...P, deckHeight: () => RISE, bridgePoint: (s, d = 0, y = null) => P.bridgePoint(s, d, (y ?? RISE) + RIVER) };
const DECK = RISE, ARCHES = GRADE_ARCHES.map((A) => ({ ...A, crown: A.crown - RIVER }));

// Estimated from photographs (refs 1, 3, 4): plinth, cutwater body and stepped caps, ring depth.
export const TOP = DECK - 0.1, RING = 1.0, RING_PROUD = 0.14;
// Per pier [body top, cap apex]: the stepped cap stops just under the crown of the smaller
// neighbouring arch (refs 1 and 4), so caps step down toward the banks.
export const CAPS = PIERS.map((_, i) => { const r = Math.min(ARCHES[i].r, ARCHES[i + 1].r); return [SPRING + 0.42 * r, SPRING + 0.95 * r]; });
export const BACK = 0.25, PILASTER = 2.4, PILASTER_PROUD = 0.22;
export const WALK_TOP = 0.15, PARAPET_H = 1.0, COPING = 0.12, BALL_R = 0.38;
export const LAMP_TOP = WALK_TOP + 4.3;
export const BALL_STATIONS = [START + 0.6, ...PIERS, END - 0.6];
// Each cutwater projects as far as its own mapped bump (north tips 3.3-4.1 m, south 2.7-3.6 m),
// kept 0.1 m inside the mapped outline.
export const NOSES = (() => {
  const ring = FOOTPRINTS[0].map((ll) => { const v = p.bridgeLocal(...ll); return p.projectBridge(v.x, v.z); });
  return PIERS.map((s) => [-1, 1].map((side) => {
    const out = ring.filter((q) => Math.abs(q.s - s) < 3.5).map((q) => side * (q.lateral - CENTER - side * HALF));
    return Math.max(2.6, Math.min(4.2, Math.max(...out) - 0.1));
  }));
})();

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near', b = bridgeBuilder(p, detail), h = p.deckHeight;
  const chunk = (s) => (near && s >= MID ? 1 : 0);
  // Rigid: in Full 3D world everything rides the bank datum; the masonry runs on into the terrain.
  const foot = 1;
  const face = (side) => CENTER + side * HALF;

  // Local geometry (x along s, y up, z lateral) to the bridge frame.
  function place(g, mat, s, d = 0, y = 0, lift = foot, flat = true) {
    if (flat && g.index) g = g.toNonIndexed();
    const a = g.attributes.position;
    for (let i = 0; i < a.count; i++) { const q = p.bridgePoint(s + a.getX(i), d + a.getZ(i), y + a.getY(i)); a.setXYZ(i, q.x, q.y, q.z); }
    g.computeVertexNormals(); b.put(g, mat, chunk(s), lift);
  }
  function prism(shape, mat, s, d, width, segments = 1, lift = foot) {
    const g = new ExtrudeGeometry(shape, { depth: width, bevelEnabled: false, steps: 1, curveSegments: segments });
    g.translate(0, 0, -width / 2); place(g, mat, s, d, 0, lift);
  }
  // Triangle soup in world coordinates, oriented outward from a reference axis.
  function soup(mat, tris, ref, s, lift = foot) {
    const pos = [];
    for (const [A, B, C] of tris) {
      const u = B.map((v, i) => v - A[i]), w = C.map((v, i) => v - A[i]);
      const n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]];
      const len = Math.hypot(...n); if (len < 1e-9) continue;
      const c = [0, 1, 2].map((i) => (A[i] + B[i] + C[i]) / 3), r = ref(c);
      const out = Math.abs(n[1]) / len > 0.7 ? n[1] * r[1] > 0 : n[0] * r[0] + n[2] * r[2] > 0;
      pos.push(...A, ...(out ? B : C), ...(out ? C : B));
    }
    const g = new BufferGeometry(); g.setAttribute('position', new Float32BufferAttribute(pos, 3)); g.computeVertexNormals(); b.put(g, mat, chunk(s), lift);
  }
  // Ribbon with a varying cross-section: f(s) -> [left, right, top, bottom]; open ends.
  function slab(mat, s0, s1, f, { step = near ? 2 : 5, top = true, sides = true, bottom = true, lift = 1 } = {}) {
    const stations = new Set([s0, s1]);
    for (let s = Math.ceil(s0 / step) * step; s < s1; s += step) {
      const ramp = s < START || s > END; if (ramp || s % 25 === 0) stations.add(s);
    }
    for (const v of p.ALIGNMENT) if (v.s > s0 && v.s < s1) stations.add(v.s);
    for (const s of [START, END, MID]) if (s > s0 && s < s1) stations.add(s);
    const list = [...stations].sort((a, c) => a - c);
    for (const part of near ? [[s0, MID], [MID, s1]] : [[s0, s1]]) {
      const run = list.filter((s) => s >= part[0] && s <= part[1]); if (run.length < 2) continue;
      if (!run.includes(part[0]) && part[0] > s0) run.unshift(part[0]);
      if (!run.includes(part[1]) && part[1] < s1) run.push(part[1]);
      const pos = [], idx = [];
      for (const s of run) {
        const [l, r, top, bot] = f(s), P = (d, y) => { const q = p.bridgePoint(s, d, y); return [q.x, q.y, q.z]; };
        pos.push(...P(l, top), ...P(r, top), ...P(l, bot), ...P(r, bot));
      }
      for (let i = 1; i < run.length; i++) {
        const a = (i - 1) * 4, c = i * 4;
        if (top) idx.push(a, a + 1, c, a + 1, c + 1, c);
        if (bottom) idx.push(a + 2, c + 2, a + 3, a + 3, c + 2, c + 3);
        if (sides) idx.push(a, c, a + 2, a + 2, c, c + 2, a + 1, a + 3, c + 1, a + 3, c + 3, c + 1);
      }
      let g = new BufferGeometry(); g.setAttribute('position', new Float32BufferAttribute(pos, 3)); g.setIndex(idx);
      g = g.toNonIndexed(); g.computeVertexNormals(); b.put(g, mat, chunk((part[0] + part[1]) / 2), lift);
    }
  }
  const quads = new Map();
  function quad(mat, s, pts, side) { // flat panel parallel to a facade, facing outward (side)
    const key = `${mat}:${chunk(s)}`; if (!quads.has(key)) quads.set(key, { mat, s, tris: [] });
    const P = pts.map(([ss, d, y]) => { const q = p.bridgePoint(ss, d, y); return [q.x, q.y, q.z]; });
    quads.get(key).tris.push([P[0], P[1], P[2], side], [P[0], P[2], P[3], side]);
  }

  // 1. Arch fills: semicircular barrel vault and spandrel, one prism per arch across the deck.
  const arcSeg = (r) => near ? Math.max(18, Math.round(r * 4)) : 10;
  for (const A of ARCHES) {
    const sh = new Shape(); sh.moveTo(-A.r, SPRING); sh.lineTo(-A.r, TOP); sh.lineTo(A.r, TOP); sh.lineTo(A.r, SPRING);
    const n = arcSeg(A.r); for (let i = 1; i < n; i++) { const t = Math.PI * i / n; sh.lineTo(A.r * Math.cos(t), SPRING + A.r * Math.sin(t)); }
    sh.closePath(); prism(sh, 'stone', A.mid, CENTER, 2 * HALF);
  }
  // 2. Piers and abutments: water-stained plinth up to the springing, granite above.
  const block = (s0, s1) => {
    for (const [y0, y1, mat] of [[0, SPRING, 'base'], [SPRING, TOP, 'stone']]) {
      const sh = new Shape(), m = (s0 + s1) / 2, w = (s1 - s0) / 2; sh.moveTo(-w, y0); sh.lineTo(w, y0); sh.lineTo(w, y1); sh.lineTo(-w, y1); sh.closePath();
      prism(sh, mat, m, CENTER, 2 * HALF);
    }
  };
  for (const s of PIERS) block(s - PIER / 2, s + PIER / 2);
  block(START, WEST_FACE); block(EAST_FACE, END);

  // 3. Cutwaters: pointed upstream (north), rounded downstream (south), each a lofted body with a
  // stepped cap that climbs to the facade (tajamares rematados cónicamente).
  const roundSeg = near ? 10 : 5;
  const outlineN = (nose) => [[-PIER / 2, -BACK], [0, nose], [PIER / 2, -BACK]];
  const outlineS = (nose) => { const c = Math.max(0, nose - PIER / 2); return [[-PIER / 2, -BACK], [-PIER / 2, c],
    ...Array.from({ length: roundSeg - 1 }, (_, i) => { const t = Math.PI * (i + 1) / roundSeg; return [-PIER / 2 * Math.cos(t), c + Math.min(PIER / 2, nose) * Math.sin(t)]; }),
    [PIER / 2, c], [PIER / 2, -BACK]]; };
  const steps = near ? 6 : 3;
  for (const [i, s] of PIERS.entries()) for (const side of [-1, 1]) {
    const [BODY_TOP, CAP_TOP] = CAPS[i], nose = NOSES[i][side < 0 ? 0 : 1], outline = side < 0 ? outlineN(nose) : outlineS(nose), d0 = face(side);
    const W = (u, v, y, sc) => { const q = p.bridgePoint(s + u * sc, d0 + side * (-BACK + (v + BACK) * sc), y); return [q.x, q.y, q.z]; };
    const ref = (c) => { const q = p.bridgePoint(s, d0 - side * BACK, c[1]); return [c[0] - q.x, 1, c[2] - q.z]; };
    const loft = (mat, levels, apex, close = true) => {
      const tris = [];
      for (let j = 0; j + 1 < levels.length; j++) {
        const [ya, sa] = levels[j], [yb, sb] = levels[j + 1];
        for (let k = 0; k + 1 < outline.length; k++) {
          const a0 = W(...outline[k], ya, sa), a1 = W(...outline[k + 1], ya, sa), b0 = W(...outline[k], yb, sb), b1 = W(...outline[k + 1], yb, sb);
          tris.push([a0, a1, b1], [a0, b1, b0]);
        }
      }
      const [yl, sl] = levels.at(-1), top = W(0, -BACK, apex ?? yl, 1);
      if (close) for (let k = 0; k + 1 < outline.length; k++) tris.push([W(...outline[k], yl, sl), W(...outline[k + 1], yl, sl), top]);
      soup(mat, tris, ref, s);
    };
    loft('base', [[0, 1], [SPRING, 1]], null, false);
    loft('stone', [[SPRING, 1], [BODY_TOP, 1]], null, false);
    const cap = [[BODY_TOP, 1.04]];
    for (let k = 0; k < steps; k++) {
      const y = BODY_TOP + (CAP_TOP - BODY_TOP) * (k + 1) / (steps + 1), sc = 1.04 - 0.9 * (k + 1) / (steps + 1);
      cap.push([y - (CAP_TOP - BODY_TOP) * 0.62 / (steps + 1), cap.at(-1)[1]], [y, sc]);
    }
    loft('ring', cap, CAP_TOP);
    // Pilaster above each cap, up to the cornice.
    const ps = new Shape(); ps.moveTo(-PILASTER / 2, CAP_TOP - 1.2); ps.lineTo(PILASTER / 2, CAP_TOP - 1.2); ps.lineTo(PILASTER / 2, DECK - 0.4); ps.lineTo(-PILASTER / 2, DECK - 0.4); ps.closePath();
    prism(ps, 'stone', s, d0 + side * (PILASTER_PROUD - 0.06) / 2, PILASTER_PROUD + 0.06);
  }

  // 4. Voussoir rings, proud of both facades.
  for (const A of ARCHES) for (const side of [-1, 1]) {
    const n = near ? 2 * Math.round(Math.PI * (A.r + RING / 2) / 1.6) + 1 : 1, gap = near ? 0.012 / A.r : 0;
    const seg = near ? Math.max(2, Math.round(arcSeg(A.r) / n * 2)) : 10;
    for (let i = 0; i < n; i++) {
      const t0 = Math.PI * i / n + gap, t1 = Math.PI * (i + 1) / n - gap, sh = new Shape();
      const ri = A.r - 0.02, ro = A.r + RING;
      const P = (t, r) => [-r * Math.cos(t), SPRING + r * Math.sin(t)];
      sh.moveTo(...P(t0, ri)); for (let k = 1; k <= seg; k++) sh.lineTo(...P(t0 + (t1 - t0) * k / seg, ri));
      for (let k = seg; k >= 0; k--) sh.lineTo(...P(t0 + (t1 - t0) * k / seg, ro)); sh.closePath();
      prism(sh, 'ring', A.mid, face(side) + side * (RING_PROUD - 0.05) / 2, RING_PROUD + 0.05);
    }
  }

  // 5. Deck: carriageway, raised walks, parapets with coping, cornice. Level from joint to joint:
  // the walks and parapets end square at the abutments, where the bank streets' own walks begin.
  const road = () => ROAD_EDGES, outer = (s) => outerEdgesAt(s);
  slab('asphalt', START, END, (s) => [road(s)[0], road(s)[1], h(s), h(s)], { sides: false, bottom: false });
  for (const side of [-1, 1]) {
    const o = (s) => outer(s)[side < 0 ? 0 : 1], inner = (s) => o(s) - side * (PARAPET - 0.05), kerb = (s) => road(s)[side < 0 ? 0 : 1];
    // Far: the walk shares the parapet's (near-identical) stone colour and draw call.
    slab(near ? 'walk' : 'parapet', START, END, (s) => side < 0 ? [inner(s), kerb(s), h(s) + WALK_TOP, h(s) - 0.1] : [kerb(s), inner(s), h(s) + WALK_TOP, h(s) - 0.1]);
    const lr = (s, a, c) => side < 0 ? [o(s) - c, o(s) - a] : [o(s) + a, o(s) + c];
    slab('parapet', START, END, (s) => [...lr(s, -PARAPET, 0), h(s) + WALK_TOP + PARAPET_H, h(s) - 0.1], { top: false, bottom: false }); // capped by the coping
    slab('trim', START, END, (s) => [...lr(s, -PARAPET - 0.06, 0.06), h(s) + WALK_TOP + PARAPET_H + COPING, h(s) + WALK_TOP + PARAPET_H - 0.02]);
    slab('ring', START, END, (s) => [...lr(s, -0.05, 0.25), h(s) - 0.1, h(s) - 0.45]); // cornice, flush with the street below it
  }

  // 6. Ball finials on pedestals over every pier and at both structural ends, both parapets.
  const ballSeg = near ? [12, 8] : [6, 4];
  for (const s of BALL_STATIONS) for (const side of [-1, 1]) {
    const d = face(side) - side * PARAPET / 2, y = DECK + WALK_TOP + PARAPET_H + COPING - 0.03;
    b.box('trim', s, d, y + 0.3, 0.78, 0.78, 0.6, chunk(s), 1);
    b.box('trim', s, d, y + 0.64, 0.52, 0.52, 0.1, chunk(s), 1);
    const neck = new CylinderGeometry(0.16, 0.22, 0.24, ballSeg[0], 1); place(neck, 'trim', s, d, y + 0.8, 1, false);
    const ball = new SphereGeometry(BALL_R, ballSeg[0], ballSeg[1]); place(ball, 'trim', s, d, y + 0.88 + BALL_R - 0.04, 1, false);
  }
  // 7. Lamp posts (Madrid cast-iron pattern simplified) on the walks, every other pier.
  for (const [i, s0] of PIERS.entries()) for (const side of [-1, 1]) {
    if ((i + (side > 0 ? 1 : 0)) % 2) continue;
    const s = s0 + 3.2, d = face(side) - side * (PARAPET + 0.45), y = DECK + WALK_TOP;
    b.box('iron', s, d, y + 0.3, 0.42, 0.42, 0.6, chunk(s), 1);
    const shaft = new CylinderGeometry(0.06, 0.1, 3.05, near ? 8 : 4, 1); place(shaft, 'iron', s, d, y + 0.6 + 1.525, 1, false);
    const glass = new CylinderGeometry(0.24, 0.15, 0.5, near ? 6 : 4, 1); place(glass, 'lamp', s, d, y + 3.65 + 0.25, 1, false);
    const cap = new CylinderGeometry(0.03, 0.3, 0.25, near ? 6 : 4, 1); place(cap, 'iron', s, d, y + 4.15 + 0.125, 1, false); // stacked, never overlapping
  }
  // 8. Lane paint fallback (seven lanes, 3 westbound | 4 eastbound); HD paint replaces it when on.
  // It stops PAINT_END short of each joint, where the bank streets' junction paint takes over.
  for (let k = 1; k < 7; k++) {
    const at = (s) => { const [l, r] = road(s); return l + (r - l) * k / 7; }, p0 = START + PAINT_END, p1 = END - PAINT_END;
    if (k === 3) slab('paint', p0, p1, (s) => [at(s) - 0.1, at(s) + 0.1, h(s) + 0.03, h(s) + 0.03], { sides: false, bottom: false });
    else if (near) for (let s = p0 + 1; s + 3 <= p1; s += 9) slab('paint', s, s + 3, (q) => [at(q) - 0.07, at(q) + 0.07, h(q) + 0.03, h(q) + 0.03], { sides: false, bottom: false, step: 3 });
  }

  // 9. Near: ashlar coursing (proud mortar joints) on spandrels, piers and parapets.
  if (near) {
    const COURSE = 0.46, JOINT = 0.1, P2 = PIER / 2, JH = 0.045;
    const capHalf = (i, y) => { const [BODY_TOP, CAP_TOP] = CAPS[i]; return y < BODY_TOP ? P2 + 0.1 : y < CAP_TOP ? P2 * (1.04 - 0.9 * (y - BODY_TOP) / (CAP_TOP - BODY_TOP)) + 0.12 : 0; };
    function open(s, y) {
      for (const A of ARCHES) {
        const dy = y - SPRING, R = A.r + RING + 0.05;
        if (dy <= 0 ? Math.abs(s - A.mid) < A.r : dy < R && Math.abs(s - A.mid) < Math.sqrt(R * R - dy * dy)) return true;
      }
      for (const [i, P] of PIERS.entries()) {
        const c = capHalf(i, y); if (Math.abs(s - P) < c) return true;
        if (y > CAPS[i][1] - 1.2 && Math.abs(s - P) < PILASTER / 2 + 0.05) return true;
      }
      return false;
    }
    for (const side of [-1, 1]) {
      const d = face(side) + side * JOINT;
      for (let row = 1, y = COURSE; y < DECK - 0.55 - JH; row++, y += COURSE) {
        // Horizontal bed joints: runs of exposed wall sampled every 0.25 m.
        let run = null;
        for (let s = START; s <= END + 0.001; s += 0.25) {
          const ok = !open(s, y) && !open(s, y + 0.02) && s < END - 0.01;
          if (ok && run === null) run = s;
          if (!ok && run !== null) { if (s - run > 0.4) quad('joint', run, [[run, d, y], [s - 0.25, d, y], [s - 0.25, d, y + JH], [run, d, y + JH]], side); run = null; }
        }
        // Staggered head joints.
        for (let s = START + 0.3 + (row % 2) * 0.55; s < END - 0.3; s += 1.1) {
          if (open(s, y + 0.03) || open(s, Math.min(y + COURSE, DECK - 0.5) - 0.03)) continue;
          quad('joint', s, [[s, d, y + JH], [s + JH, d, y + JH], [s + JH, d, Math.min(y + COURSE, DECK - 0.5)], [s, d, Math.min(y + COURSE, DECK - 0.5)]], side);
        }
      }
      // Parapet blocks.
      const dp = face(side) + side * JOINT, y0 = DECK - 0.04, y1 = DECK + WALK_TOP + PARAPET_H - 0.02;
      for (let s = START + 0.9; s < END - 0.6; s += 1.25) if (!BALL_STATIONS.some((v) => Math.abs(v - s) < 0.5)) quad('trim', s, [[s, dp, y0], [s + JH, dp, y0], [s + JH, dp, y1], [s, dp, y1]], side);
    }
    for (const { mat, s, tris } of quads.values()) {
      const out = tris.map(([A, B, C, side]) => [A, B, C, side]);
      const pos = [];
      for (const [A, B, C, side] of out) {
        const u = B.map((v, i) => v - A[i]), w = C.map((v, i) => v - A[i]);
        const n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]];
        const q = p.bridgePoint(START, 0, 0), dir = [-q.tz * side, q.tx * side];
        const keep = n[0] * dir[0] + n[2] * dir[1] > 0; pos.push(...A, ...(keep ? B : C), ...(keep ? C : B));
      }
      const g = new BufferGeometry(); g.setAttribute('position', new Float32BufferAttribute(pos, 3)); g.computeVertexNormals(); b.put(g, mat, chunk(s), foot);
    }
  }
  return b.finish();
}
