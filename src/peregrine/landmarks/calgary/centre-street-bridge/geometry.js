import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { bridgeBuilder } from '../../asset-geometry.js';
import { PROFILE as p, ROAD_EDGES } from './centre-street-bridge-profile.js';
import {
  h, S, L, HALF, SKEW, PIER_S, PIER_LEN, PIER_TOP, pierAt, RIB_IN, RIB_OUT, CORNICE, SLAB_TOP, SLAB_BOTTOM, FLOOR_BOTTOM,
  WALK, BALUSTRADE, BAY_OUT, SPRING, archAt, OPENING, COLUMN, OPENINGS, ABUT_S, ABUT_N, BENTS, UNDERPASS, LOWER_TOP, LOWER_HALF,
  LOWER_RANGE, lowerD, grip,
} from './centre-street-bridge-structure.js';

const clamp01 = (v) => Math.max(0, Math.min(1, v));
const [KERB_W, KERB_E] = ROAD_EDGES[0];
const RIB_C = (RIB_IN + RIB_OUT) / 2;
/** Pavilion piers (A and D) carry the lions; their bays project further than the river piers' bays. */
const PAVILION_PIERS = [0, 3], PAV_OUT = 12.6, PAV = { len: 4.6, inner: 9.0, outer: 12.4 };
/** How far the spandrel infill is set back behind the ring's face (the ring stands proud). */
const RECESS = 0.25;

/**
 * Centre Street Bridge, Calgary (1916): three open-spandrel reinforced-concrete arches on piers skewed
 * to the deck, carrying Centre Street on an upper deck with cantilevered balconies, ornamental
 * balustrades and lamp standards, four lions on pavilions over the end piers, and an I-girder lower
 * deck hung between the arch ribs. Real metres, +X east, +Y up, +Z south, built on the mapped roadway
 * (centre-street-bridge-profile.js) so it is one surface with the car, the route and the HD road.
 */
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  // meshStep 2: the ramps are 7-9 %, and a coarse chord sags under the HD overlay draped on them.
  const b = bridgeBuilder({ ...p, meshStep: 2 }, detail);
  const SPLIT = (PIER_S[1] + PIER_S[2]) / 2;
  const chunk = (s) => (near && s >= SPLIT ? 1 : 0);
  const sideOf = (sign) => (sign > 0 ? [RIB_IN, RIB_OUT] : [-RIB_OUT, -RIB_IN]);

  // Flat-shaded triangle soup: weld each face's corners (same position AND normal) into an indexed mesh.
  const put = (g, mat, ck, lift) => {
    g.deleteAttribute('uv');
    if (!g.attributes.normal) g.computeVertexNormals();
    b.put(mergeVertices(g, 1e-4), mat, ck, lift);
  };
  // ---- Placement helpers: author in the bridge frame (X = station s, Y = height, Z = lateral d, a
  // right-handed frame like x, y, z), then map every vertex onto the alignment. `shear` skews a part
  // with the piers about the lateral it names.
  function place(g, mat, ck = 0, lift = 1, shear = null) {
    if (g.index) g = g.toNonIndexed();
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const X = pos.getX(i), Y = pos.getY(i), Z = pos.getZ(i);
      const q = p.bridgePoint(shear === null ? X : X - SKEW * (Z - shear), Z, Y);
      pos.setXYZ(i, q.x, Y, q.z);
    }
    g.deleteAttribute('normal'); g.computeVertexNormals();
    put(g, mat, ck, lift);
  }
  const boxAt = (mat, s0, s1, d0, d1, y0, y1, ck, lift = 1, shear = null) => {
    const g = new THREE.BoxGeometry(s1 - s0, y1 - y0, d1 - d0);
    g.translate((s0 + s1) / 2, (y0 + y1) / 2, (d0 + d1) / 2);
    place(g, mat, ck, lift, shear);
  };
  /** A closed band along the alignment: lateral edges lr(s) = [l, r], top y(s), thickness t. */
  const STEP = near ? 4 : 8;
  function ribbon(mat, s0, s1, lr, top, t, { ck = chunk(s0), lift = 1, step = STEP, caps = true, bottom = true } = {}) {
    if (s1 - s0 < 0.05) return;
    const set = new Set([s0, s1]);
    for (let s = Math.ceil(s0 / step) * step; s < s1; s += step) set.add(s);
    for (const v of p.ALIGNMENT) if (v.s > s0 && v.s < s1) set.add(v.s);
    const ss = [...set].sort((u, v) => u - v).filter((s, i, a) => !i || s - a[i - 1] > 0.02);
    const out = [];
    const P = (s, d, y) => { const q = p.bridgePoint(s, d, y); return [q.x, y, q.z]; };
    const tri = (a, c, e) => out.push(...a, ...c, ...e);
    const corners = (s) => { const [l, r] = lr(s), y = top(s); return { A: P(s, l, y), B: P(s, r, y), a: P(s, l, y - t), c: P(s, r, y - t) }; };
    let prev = corners(ss[0]);
    if (caps && t > 0) { tri(prev.A, prev.a, prev.B); tri(prev.B, prev.a, prev.c); }
    for (let i = 1; i < ss.length; i++) {
      const n = corners(ss[i]);
      tri(prev.A, prev.B, n.A); tri(prev.B, n.B, n.A);                                   // top (+y)
      if (t > 0) {
        if (bottom) { tri(prev.a, n.a, prev.c); tri(prev.c, n.a, n.c); }                    // bottom (-y)
        tri(prev.B, prev.c, n.B); tri(n.B, prev.c, n.c);                                   // right (+d)
        tri(prev.A, n.A, prev.a); tri(n.A, n.a, prev.a);                                   // left (-d)
      }
      prev = n;
    }
    if (caps && t > 0) { tri(prev.A, prev.B, prev.a); tri(prev.B, prev.c, prev.a); }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(out, 3)); g.computeVertexNormals();
    put(g, mat, ck, lift);
  }
  /** A band following the deck: [l, r] fixed, top at the road surface plus `off`. */
  const along = (mat, s0, s1, l, r, off, t, opts = {}) => {
    const cuts = near && s0 < SPLIT && s1 > SPLIT ? [s0, SPLIT, s1] : [s0, s1];
    for (let i = 1; i < cuts.length; i++) ribbon(mat, cuts[i - 1], cuts[i], () => [l, r], (s) => h(s) + off, t, { ck: chunk(cuts[i - 1]), ...opts });
  };

  // ---- Upper road, slab, balconies ---------------------------------------------------------------
  along('asphalt', 0, L, KERB_W, KERB_E, 0, 0, { step: near ? 2 : 6 });
  if (near) {
    // Lane paint (the HD pavement's own paint replaces it in the app): edge lines, lane dashes, double yellow.
    const line = (mat, d, w, s0 = 0, s1 = L, off = 0.025) => along(mat, s0, s1, d - w / 2, d + w / 2, off, 0, { step: 2 });
    line('paint', KERB_W + 0.3, 0.15); line('paint', KERB_E - 0.3, 0.15);
    line('yellow', -0.12, 0.1, 0, L, 0.05); line('yellow', 0.12, 0.1, 0, L, 0.05);
    for (let s = 4; s < L - 4; s += 12) for (const d of [-3.35, 3.35]) line('paint', d, 0.12, s, Math.min(s + 3, L));
  }
  // The structural slab under the road, between the outer faces, over the bridge.
  along('deck', ABUT_S, ABUT_N, -RIB_OUT, RIB_OUT, SLAB_TOP, SLAB_TOP - SLAB_BOTTOM);
  // Balconies: the sidewalk slab cantilevered to the balustrade; over the fills it is the sidewalk.
  for (const [l, r] of [[KERB_E, HALF], [-HALF, KERB_W]]) along('deck', 0, L, l, r, WALK, WALK + 0.32);
  // Cornice band under the balconies, projecting past the arcade faces (the arch crowns meet it).
  for (const sign of [1, -1]) {
    // (its top 2 cm inside the balcony slab, so no face is shared with it)
    const [l, r] = sign > 0 ? [RIB_IN, RIB_OUT + 0.15] : [-(RIB_OUT + 0.15), -RIB_IN];
    along('concrete', ABUT_S + 0.6, ABUT_N - 0.6, l, r, -0.30, CORNICE - 0.30);
    if (near) for (let s = ABUT_S + 1.2; s < ABUT_N - 1; s += 2.2) {   // the consoles under the balcony overhang
      const q = sign > 0 ? [RIB_OUT + 0.05, HALF - 0.05] : [-(HALF - 0.05), -(RIB_OUT + 0.05)];
      boxAt('deck', s - 0.16, s + 0.16, q[0], q[1], h(s) - 0.8, h(s) - 0.30, chunk(s));
    }
  }
  // Floor beams under the slab, between the ribs (seen from the lower deck and from the banks).
  if (near) for (let s = ABUT_S + 2; s < ABUT_N - 1.5; s += 4.2) boxAt('deck', s - 0.25, s + 0.25, -RIB_IN - 0.1, RIB_IN + 0.1, h(s) + FLOOR_BOTTOM, h(s) + SLAB_BOTTOM + 0.05, chunk(s));

  // ---- Balustrades, bays and lamp standards ------------------------------------------------------
  // Where the balustrade gives way: the pier bays (solid parapets) and the pavilions.
  const breaks = (sign) => PIER_S.map((_, k) => { const s = pierAt(k, sign * HALF), w = PAVILION_PIERS.includes(k) ? PAV.len / 2 + 0.2 : 2.6; return [s - w, s + w]; });
  const runs = (sign) => {
    const list = [], cuts = breaks(sign);
    let s0 = ABUT_S + 0.3;
    for (const [a, c] of cuts) { list.push([s0, a]); s0 = c; }
    list.push([s0, ABUT_N - 0.3]);
    return list.filter(([a, c]) => c - a > 0.5);
  };
  for (const sign of [1, -1]) {
    const [l, r] = sign > 0 ? BALUSTRADE : [-BALUSTRADE[1], -BALUSTRADE[0]];
    for (const [s0, s1] of runs(sign)) {
      if (!near) { along('balustrade', s0, s1, l + 0.05, r - 0.05, WALK + 1.1, 1.1, { bottom: false }); continue; }
      along('balustrade', s0, s1, l, r, WALK + 0.16, 0.16, { bottom: false });                 // plinth
      along('balustrade', s0, s1, l - 0.03, r + 0.03, WALK + 1.12, 0.14);                      // top rail
      const n = Math.max(1, Math.round((s1 - s0) / 3.0));
      for (let i = 0; i <= n; i++) { const s = s0 + (s1 - s0) * i / n; boxAt('balustrade', s - 0.24, s + 0.24, l - 0.02, r + 0.02, h(s) + WALK - 0.02, h(s) + WALK + 1.0, chunk(s)); }
      // Balusters: one thin two-sided quad each, so the open balustrade reads without a box per baluster.
      const pos = [], m = (r + l) / 2;
      for (let s = s0 + 0.5; s < s1 - 0.3; s += 0.36) {
        const lo = h(s) + WALK + 0.16, hi = h(s) + WALK + 0.98;
        const a = p.bridgePoint(s - 0.07, m, lo), c = p.bridgePoint(s + 0.07, m, lo), e = p.bridgePoint(s + 0.07, m, hi), f = p.bridgePoint(s - 0.07, m, hi);
        const A = [a.x, lo, a.z], C = [c.x, lo, c.z], E = [e.x, hi, e.z], F = [f.x, hi, f.z];
        pos.push(...A, ...C, ...E, ...A, ...E, ...F, ...A, ...E, ...C, ...A, ...F, ...E);
      }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.computeVertexNormals();
      put(g, 'balustrade', chunk(s0), 1);
    }
  }
  // Bays over the piers: the balcony widens; a solid parapet; a buttress below on the pilaster.
  for (let k = 0; k < PIER_S.length; k++) for (const sign of [1, -1]) {
    const pav = PAVILION_PIERS.includes(k), out = pav ? PAV_OUT : BAY_OUT, sc = pierAt(k, sign * HALF), w = pav ? PAV.len / 2 + 0.6 : 2.6, ck = chunk(sc);
    const D = (a, c) => (sign > 0 ? [a, c] : [-c, -a]);
    boxAt('deck', sc - w, sc + w, ...D(HALF, out), h(sc) - 0.32, h(sc) + WALK, ck, 1, sign * HALF);
    boxAt('concrete', sc - w + 0.4, sc + w - 0.4, ...D(RIB_OUT + 0.25, out - 0.3), 0, h(sc) - 0.30, ck, grip, sign * HALF);
    if (!pav) {
      boxAt('balustrade', sc - w, sc + w, ...D(out - 0.42, out), h(sc) + WALK - 0.02, h(sc) + WALK + 1.15, ck, 1, sign * HALF);
      for (const e of [-1, 1]) boxAt('balustrade', sc + e * (w - 0.21) - 0.21, sc + e * (w - 0.21) + 0.21, ...D(BALUSTRADE[0], out - 0.4), h(sc) + WALK - 0.02, h(sc) + WALK + 1.15, ck, 1, sign * HALF);
    }
  }
  // Lamp standards on the balustrade line: at the river piers and the quarter points of each arch, and
  // along the end spans. Cast-iron posts with a globe (self-lit at night).
  const POST = 7.0;
  for (const sign of [1, -1]) {
    const d = sign * (HALF - 0.25);
    for (let k = 0; k < 3; k++) for (const u of [0.25, 0.5, 0.75]) { const s = pierAt(k, d) + u * (pierAt(k + 1, d) - pierAt(k, d)); lampPost(s, d, h(s) + WALK, chunk(s)); }
    for (const k of [1, 2]) { const s = pierAt(k, sign * BAY_OUT); lampPost(s, sign * (BAY_OUT - 0.21), h(s) + WALK, chunk(s)); }
    for (const s of [ABUT_S + 10, ABUT_S + 31, (pierAt(3, d) + ABUT_N) / 2 + 2]) lampPost(s, d, h(s) + WALK, chunk(s));
  }
  function lampPost(s, d, y0, ck) {
    boxAt('iron', s - 0.3, s + 0.3, d - 0.3, d + 0.3, y0 + 0.01, y0 + 1.25, ck);   // (its foot clear of the balustrade posts' 2 cm below the walk)
    const post = new THREE.CylinderGeometry(near ? 0.09 : 0.12, near ? 0.15 : 0.12, POST - 1.2, near ? 6 : 4, 1, true);
    post.translate(s, y0 + 1.2 + (POST - 1.2) / 2, d); place(post, 'iron', ck);
    if (near) { boxAt('iron', s - 0.26, s + 0.26, d - 0.26, d + 0.26, y0 + POST - 0.05, y0 + POST + 0.12, ck); }
    const globe = near ? new THREE.IcosahedronGeometry(0.34, 1) : new THREE.BoxGeometry(0.6, 0.66, 0.6);
    globe.translate(s, y0 + POST + 0.42, d); place(globe, 'lamp', ck);
  }

  // ---- Piers, pilasters and the three arches ---------------------------------------------------
  for (let k = 0; k < PIER_S.length; k++) {
    // River pier: a skewed block with a pointed cutwater upstream (west), springing cap at PIER_TOP.
    const dW = -RIB_OUT - 0.3, dE = RIB_OUT + 0.3, half = PIER_LEN / 2, ck = chunk(PIER_S[k]);
    const plan = [[pierAt(k, dW) - half, dW], [pierAt(k, dE) - half, dE], [pierAt(k, dE) + half, dE], [pierAt(k, dW) + half, dW], [pierAt(k, dW - 3.2), dW - 3.2]];
    prism('concrete', plan, 0, PIER_TOP, ck, grip);
    // Pilasters on both faces, from the pier to the cornice, projecting 0.3 m.
    for (const sign of [1, -1]) {
      const [l, r] = sideOf(sign), dc = sign * RIB_C, sc = pierAt(k, dc);
      boxAt('concrete', sc - half, sc + half, sign > 0 ? l : l - 0.3, sign > 0 ? r + 0.3 : r, 0, h(sc) - CORNICE + 0.05, ck, grip, dc);
    }
  }
  for (let k = 0; k < 3; k++) for (const sign of [1, -1]) archFace(k, sign);

  /**
   * One face of one arch. The body (ring, spandrel and the arcade of round-headed openings, one extrusion)
   * is the darker `spandrel` tone, set back RECESS from the outer face; the ring's own face (the band
   * between the intrados and the extrados) stands proud in the light concrete, so each arch reads as a
   * pale ring against a darker infill, and its soffit is dark.
   */
  function archFace(k, sign) {
    const [l, r] = sideOf(sign), dc = sign * RIB_C, A = archAt(k, dc), ck = chunk(A.mid);
    const n = near ? 20 : 12, arc = near ? 7 : 3;
    const top = (s) => h(s) - CORNICE + 0.05;
    const shape = new THREE.Shape();
    const a = A.a - 0.05, c = A.b + 0.05;
    shape.moveTo(a, SPRING);
    shape.lineTo(a, top(a));
    for (let i = 1; i < 8; i++) { const s = a + (c - a) * i / 8; shape.lineTo(s, top(s)); }
    shape.lineTo(c, top(c));
    shape.lineTo(c, SPRING);
    for (let i = n; i >= 0; i--) shape.lineTo(A.station(i / n), A.intrados(i / n));
    // Openings: three per haunch from each pilaster; each runs down to the ring's extrados.
    for (const end of [0, 1]) for (let j = 0; j < OPENINGS; j++) {
      const o0 = end ? A.b - 0.08 - (j + 1) * OPENING - j * COLUMN : A.a + 0.08 + j * (OPENING + COLUMN), o1 = o0 + OPENING;
      const rad = OPENING / 2, crown = Math.min(top(o0), top(o1)) - 0.05 - 0.4, spring = crown - rad;
      const ex = (s) => A.extrados(A.u(s)) + 0.12;
      const lo = Math.max(ex(o0), ex(o1));
      if (spring - Math.max(ex(o0), ex(o1)) < -rad * 0.6 || crown - lo < 0.9) continue;
      const hole = new THREE.Path();
      hole.moveTo(o0, ex(o0));
      for (let i = 1; i <= 3; i++) { const s = o0 + (o1 - o0) * i / 3; hole.lineTo(s, ex(s)); }
      for (let i = 0; i <= arc; i++) {
        const t = i / arc * Math.PI, s = (o0 + o1) / 2 + rad * Math.cos(t), y = spring + rad * Math.sin(t);
        hole.lineTo(s, Math.max(y, ex(s) + 0.05));
      }
      shape.holes.push(hole);
    }
    const body = new THREE.ExtrudeGeometry(shape, { depth: r - l - RECESS, bevelEnabled: false, curveSegments: 1 });
    body.translate(0, 0, sign > 0 ? l : l + RECESS);
    place(body, 'spandrel', ck, grip, dc);
    // The ring face: intrados to extrados from pilaster to pilaster, RECESS deep on the outer side.
    const ring = new THREE.Shape();
    ring.moveTo(a, SPRING);
    for (let i = 0; i <= n; i++) ring.lineTo(i ? A.station(i / n) : a, A.extrados(i / n));
    ring.lineTo(c, A.extrados(1));
    ring.lineTo(c, SPRING);
    for (let i = n; i >= 0; i--) ring.lineTo(A.station(i / n), A.intrados(i / n));
    const face = new THREE.ExtrudeGeometry(ring, { depth: RECESS, bevelEnabled: false, curveSegments: 1 });
    face.translate(0, 0, sign > 0 ? r - RECESS : l);
    place(face, 'concrete', ck, grip, dc);
  }

  /** A vertical prism over a convex plan [[s, d], ...] from y0 to y1 (no bottom: it stands on the ground). */
  function prism(mat, plan, y0, y1, ck, lift) {
    const out = [], P = (s, d, y) => { const q = p.bridgePoint(s, d, y); return [q.x, y, q.z]; };
    const cs = plan.reduce((n, v) => n + v[0], 0) / plan.length, cd = plan.reduce((n, v) => n + v[1], 0) / plan.length;
    // orient the plan counter-clockwise in (s, d) seen from above (+y): outward side faces
    const area = plan.reduce((n, v, i) => { const w = plan[(i + 1) % plan.length]; return n + v[0] * w[1] - w[0] * v[1]; }, 0);
    const ring = area > 0 ? plan : [...plan].reverse();
    for (let i = 0; i < ring.length; i++) {
      const [s0, d0] = ring[i], [s1, d1] = ring[(i + 1) % ring.length];
      const A = P(s0, d0, y0), B = P(s1, d1, y0), C = P(s1, d1, y1), D = P(s0, d0, y1);
      out.push(...A, ...C, ...B, ...A, ...D, ...C);
    }
    const T = P(cs, cd, y1);
    for (let i = 0; i < ring.length; i++) { const [s0, d0] = ring[i], [s1, d1] = ring[(i + 1) % ring.length]; out.push(...T, ...P(s1, d1, y1), ...P(s0, d0, y1)); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(out, 3)); g.computeVertexNormals();
    put(g, mat, ck, lift);
  }

  // ---- End spans, abutments and the approaches on fill ---------------------------------------------
  // Edge girders continue the cornice line from the abutments to the end piers' pilasters.
  for (const sign of [1, -1]) {
    const [l, r] = sideOf(sign);
    along('concrete', ABUT_S + 0.6, pierAt(0, sign * RIB_C) - PIER_LEN / 2 + 0.45, l, r, -CORNICE + 0.05, 1.15);
    along('concrete', pierAt(3, sign * RIB_C) + PIER_LEN / 2 - 0.45, ABUT_N - 0.6, l, r, -CORNICE + 0.05, 1.15);
    for (const s of BENTS) {
      const d = sign * RIB_C, top = h(s) - CORNICE - 1.05;
      boxAt('concrete', s - 0.5, s + 0.5, d - 0.5, d + 0.5, 0, top, chunk(s), grip);
    }
  }
  for (const s of [ABUT_S, ABUT_N]) boxAt('concrete', s - 0.6, s + 0.6, -HALF, HALF, 0, h(s) - 0.5, chunk(s), (y) => (y > 0.05 ? 1 : 0));
  // Retained fill under the approach ramps (south to 2 Avenue SE, north down the Centre Street N
  // embankment), open where Memorial Drive NW passes under the north embankment.
  const fill = (s0, s1, ends) => {
    let a = s0, c = s1;
    while (a < c && h(a) < 0.5) a += 0.5;
    while (c > a && h(c) < 0.5) c -= 0.5;
    if (c - a < 1) return;
    ribbon('concrete', a, c, () => [-HALF, HALF], (s) => h(s) - 0.3, 0, { ck: chunk(a) });   // top, under the road
    sideWalls(a, c, ends);
  };
  function sideWalls(s0, s1, ends) {
    // Retaining walls (vertical faces at +-HALF from grade to the fill top) and the end wall at the ramp foot.
    const out = [], P = (s, d, y) => { const q = p.bridgePoint(s, d, y); return [q.x, y, q.z]; };
    const ss = []; for (let s = s0; s < s1; s += STEP) ss.push(s); ss.push(s1);
    for (let i = 1; i < ss.length; i++) {
      const s = ss[i - 1], t = ss[i];
      for (const sign of [1, -1]) {
        const d = sign * HALF, A = P(s, d, 0), B = P(t, d, 0), C = P(t, d, h(t) - 0.3), D = P(s, d, h(s) - 0.3);
        // Outward faces: the east wall (+d) winds A, B, C; the west wall A, C, B (each wall seen from outside).
        if (sign > 0) out.push(...A, ...B, ...C, ...A, ...C, ...D); else out.push(...A, ...C, ...B, ...A, ...D, ...C);
      }
    }
    for (const [s, dir] of [[s0, -1], [s1, 1]].filter((_, i) => ends[i])) {
      const A = P(s, -HALF, 0), B = P(s, HALF, 0), C = P(s, HALF, h(s) - 0.3), D = P(s, -HALF, h(s) - 0.3);
      if (dir > 0) out.push(...A, ...C, ...B, ...A, ...D, ...C); else out.push(...A, ...B, ...C, ...A, ...C, ...D);
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(out, 3)); g.computeVertexNormals();
    put(g, 'concrete', chunk(s0), (y) => (y > 0.05 ? 1 : 0));
  }
  fill(0, ABUT_S - 0.6, [true, false]);          // the abutment closes the bridge end
  fill(ABUT_N + 0.6, UNDERPASS[0], [false, true]);
  fill(UNDERPASS[1], L, [true, true]);
  // The short span over Memorial Drive NW: a slab with edge beams, and the parapets of the embankment.
  along('concrete', UNDERPASS[0] - 0.4, UNDERPASS[1] + 0.4, -HALF, HALF, -0.3, 0.75);
  for (const sign of [1, -1]) {
    const [l, r] = sign > 0 ? [HALF - 0.35, HALF] : [-HALF, -HALF + 0.35];
    let s0 = ABUT_N; while (s0 < L && h(s0) > 1.2) s0 += 1;
    along('concrete', ABUT_N, s0, l, r, WALK + 0.95, 0.95, { bottom: false });
    let s1 = ABUT_S; while (s1 > 0 && h(s1) > 1.2) s1 -= 1;
    along('concrete', s1, ABUT_S, l, r, WALK + 0.95, 0.95, { bottom: false });
  }

  // ---- The lower deck: I-girders and a slab hung between the ribs, under the provider's lower road ----
  {
    const [s0, s1] = LOWER_RANGE;
    const cut = near ? [s0, SPLIT, s1] : [s0, s1];
    for (let i = 1; i < cut.length; i++) {
      const a = cut[i - 1], c = cut[i], ck = chunk(a);
      ribbon('concrete', a, c, (s) => [lowerD(s) - LOWER_HALF, lowerD(s) + LOWER_HALF], () => LOWER_TOP, 0.22, { ck });
      for (const e of near ? [-1.7, 1.7] : [0]) ribbon('steel', a, c, (s) => [lowerD(s) + e - (near ? 0.22 : 1.9), lowerD(s) + e + (near ? 0.22 : 1.9)], () => LOWER_TOP - 0.2, near ? 0.85 : 0.75, { ck });
    }
    // Cross girders at the piers and the deck ends, spanning rib to rib (posts at the deck ends).
    for (let k = 0; k < PIER_S.length; k++) {
      const s = pierAt(k, lowerD(PIER_S[k])), ck = chunk(s);
      boxAt('steel', s - 0.3, s + 0.3, -RIB_IN - 0.05, RIB_IN + 0.05, LOWER_TOP - 1.65, LOWER_TOP - 0.95, ck, 1, lowerD(PIER_S[k]));
    }
    for (const s of [s0 + 0.4, s1 - 0.4]) {
      boxAt('steel', s - 0.3, s + 0.3, lowerD(s) - LOWER_HALF - 0.2, lowerD(s) + LOWER_HALF + 0.2, LOWER_TOP - 1.65, LOWER_TOP - 0.95, chunk(s));
      for (const e of [-1, 1]) boxAt('steel', s - 0.25, s + 0.25, lowerD(s) + e * 1.9 - 0.25, lowerD(s) + e * 1.9 + 0.25, 0, LOWER_TOP - 1.65 + 0.02, chunk(s), grip);
    }
    // Hangers from the upper floor beams to the lower girders.
    if (near) for (let s = s0 + 4; s < s1 - 2; s += 8.4) for (const e of [-1.7, 1.7]) {
      const d = lowerD(s) + e, g = new THREE.CylinderGeometry(0.06, 0.06, (h(s) + FLOOR_BOTTOM) - (LOWER_TOP - 0.2), 4, 1, true);
      g.translate(s, ((h(s) + FLOOR_BOTTOM) + (LOWER_TOP - 0.2)) / 2, d); place(g, 'steel', chunk(s));
    }
  }

  // ---- Pavilions with the lions, on the end piers (A south bank, D north bank) ------------------------
  for (const k of PAVILION_PIERS) for (const sign of [1, -1]) {
    const dc = sign * (PAV.inner + PAV.outer) / 2, sc = pierAt(k, dc), ck = chunk(sc), y0 = h(sc) + WALK;
    pavilion(sc, dc, y0, ck, k === 0 ? -1 : 1);
  }
  function pavilion(sc, dc, y0, ck, facing) {
    const L2 = PAV.len / 2, W2 = (PAV.outer - PAV.inner) / 2, B = (mat, s0, s1, d0, d1, ya, yb) => boxAt(mat, sc + s0, sc + s1, dc + d0, dc + d1, y0 + ya, y0 + yb, ck, 1, dc);
    B('balustrade', -L2, L2, -W2, W2, -0.02, 0.5);                                     // plinth
    if (near) {
      const P = 0.85;
      for (const e of [-1, 1]) for (const f of [-1, 1]) B('balustrade', e > 0 ? L2 - P : -L2, e > 0 ? L2 : -L2 + P, f > 0 ? W2 - P : -W2, f > 0 ? W2 : -W2 + P, 0.48, 4.02);
      // Round-headed openings on all four faces: an arch head between the corner piers, 0.5 m thick.
      for (const [axis, e] of [['s', -1], ['s', 1], ['d', -1], ['d', 1]]) {
        const span = axis === 's' ? 2 * W2 - 2 * P : 2 * L2 - 2 * P, rad = span / 2, t = 0.5;
        const shape = new THREE.Shape();
        shape.moveTo(-rad - 0.05, 2.35); shape.lineTo(-rad - 0.05, 4.02); shape.lineTo(rad + 0.05, 4.02); shape.lineTo(rad + 0.05, 2.35); shape.lineTo(rad, 2.35);
        for (let i = 1; i < 6; i++) { const a = i / 6 * Math.PI; shape.lineTo(rad * Math.cos(a), 2.35 + rad * Math.sin(a)); }
        shape.lineTo(-rad, 2.35);
        const g = new THREE.ExtrudeGeometry(shape, { depth: t, bevelEnabled: false, curveSegments: 1 });
        // Bridge frame: the shape's x runs across the face, y up, the extrusion through the wall.
        if (axis === 's') { g.rotateY(-Math.PI / 2); g.translate(sc + e * L2 + (e > 0 ? 0 : t), y0, dc); }   // x' = -z: [-t, 0]
        else g.translate(sc, y0, dc + (e > 0 ? W2 - t : -W2));
        place(g, 'balustrade', ck, 1, dc);
      }
    } else B('balustrade', -L2, L2, -W2, W2, 0.5, 4.0);
    B('balustrade', -L2 - 0.2, L2 + 0.2, -W2 - 0.2, W2 + 0.2, 4.0, 4.35);               // cornice
    B('balustrade', -L2 + 0.15, L2 - 0.15, -W2 + 0.15, W2 - 0.15, 4.35, 4.95);          // attic
    B('balustrade', -1.6, 1.6, -0.8, 0.8, 4.95, 5.25);                                 // the lion's plinth
    lion(sc, dc, y0 + 5.25, ck, facing);
  }

  /** A recumbent lion after Landseer's (simplified, one material), 2.8 m long, facing +s or -s. */
  function lion(sc, dc, y0, ck, facing) {
    const parts = [];
    const add = (g) => parts.push(g);
    if (near) {
      // Body: elliptical rings from the haunch to the chest.
      const rings = [[-1.25, 0.28, 0.26, 0.34], [-0.95, 0.44, 0.42, 0.46], [-0.45, 0.40, 0.36, 0.44], [0.15, 0.42, 0.42, 0.52], [0.55, 0.36, 0.40, 0.62]];
      const N = 8, pos = [];
      const pt = (r, i) => { const a = i / N * Math.PI * 2; return [r[0], r[3] + r[2] * Math.sin(a), r[1] * Math.cos(a)]; };
      for (let j = 1; j < rings.length; j++) for (let i = 0; i < N; i++) {
        const A = pt(rings[j - 1], i), B = pt(rings[j - 1], i + 1), C = pt(rings[j], i + 1), D = pt(rings[j], i);
        pos.push(...A, ...C, ...B, ...A, ...D, ...C);
      }
      for (const [r, dir] of [[rings[0], -1], [rings.at(-1), 1]]) for (let i = 0; i < N; i++) {
        const c = [r[0], r[3], 0], A = pt(r, i), B = pt(r, i + 1);
        pos.push(...(dir > 0 ? [...c, ...A, ...B] : [...c, ...B, ...A]));
      }
      const body = new THREE.BufferGeometry(); body.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); add(body);
      const mane = new THREE.IcosahedronGeometry(0.52, 1); mane.scale(0.8, 1.2, 1.05); mane.translate(0.6, 0.92, 0); add(mane);
      const head = new THREE.IcosahedronGeometry(0.33, 1); head.scale(1.15, 1.0, 0.95); head.translate(1.0, 1.08, 0); add(head);
      const muzzle = new THREE.BoxGeometry(0.32, 0.26, 0.32); muzzle.translate(1.3, 0.94, 0); add(muzzle);
      for (const z of [-0.22, 0.22]) { const paw = new THREE.BoxGeometry(1.0, 0.22, 0.24); paw.translate(1.05, 0.11, z); add(paw); }
      const hind = new THREE.BoxGeometry(0.62, 0.24, 0.26); hind.translate(-0.62, 0.12, 0.42); add(hind);
      const tail = new THREE.BoxGeometry(1.0, 0.1, 0.11); tail.translate(-1.05, 0.06, -0.38); add(tail);
    } else {
      const body = new THREE.BoxGeometry(2.4, 0.8, 0.86); body.translate(-0.2, 0.4, 0); add(body);
      const mane = new THREE.BoxGeometry(0.95, 0.9, 1.0); mane.translate(0.75, 0.9, 0); add(mane);
      const paws = new THREE.BoxGeometry(0.75, 0.22, 0.7); paws.translate(1.4, 0.11, 0); add(paws);
    }
    for (const g of parts) {
      const q = g.index ? g.toNonIndexed() : g;
      if (facing < 0) q.rotateY(Math.PI);
      q.translate(sc, y0, dc);
      place(q, 'lion', ck, 1);
    }
  }

  return b.finish();
}
