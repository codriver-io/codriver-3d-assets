// Vikingskipet hull: a lens-shaped upturned ship in real metres.
// Frame: +X east, +Y up, +Z south. +s runs along the keel toward NNE (bearing 25°);
// +a is to the right of that, toward the lake (ESE). The road (Åkersvikvegen) is −a.
// The outer eave is an analytic curve fitted inside OSM way 28287844, not a trace of it.
import * as THREE from 'three';

const RAD = Math.PI / 180;
export const BEARING = 25;
const SIN = Math.sin(BEARING * RAD);
const COS = Math.cos(BEARING * RAD);

export const HALF_L = 124; // half-length along the keel, m (published overall 250 m)
export const HALF_W = 51.15; // half-width at midships, m (outer eave; published max 110, span 96)
const PLAN_P = 1.42;
const PLAN_Q = 1.08;
export const CROWN = 35; // keel-batten top at midships
const KEEL_LIFT = 0.28;
const SEAM = -0.42; // plank joints pulled in along the normal so the rib reads as a groove
export const PLINTH = 0.55;
const EAVE = 7.15;
const STEM = 1.15; // extra rise of the prow above the last shell ring
const SHELL_U = 0.985; // shell stops here; a short fan sets the stem on the plinth

/** Half-width of the eave plan. Zero at ±HALF_L. */
export function halfWidth(s) {
  const u = Math.abs(s) / HALF_L;
  if (u >= 1) return 0;
  return HALF_W * (1 - u ** PLAN_P) ** PLAN_Q;
}

function arch(s) {
  const u = Math.min(1, Math.abs(s) / HALF_L);
  return Math.cos(u * Math.PI / 2);
}

/** Height of the cladding surface under the keel batten. */
export function ridgeY(s) {
  const crown = CROWN - KEEL_LIFT;
  const a = arch(s);
  const u = Math.min(1, Math.abs(s) / HALF_L);
  const k = Math.max(0, (u - 0.9) / 0.1);
  const stem = STEM * k * k * (3 - 2 * k);
  return PLINTH + (crown - PLINTH) * a ** 1.05 + stem;
}

/** Springing line of the hull (top of the glass skirt). */
export function eaveY(s) {
  const y = PLINTH + (EAVE - PLINTH) * arch(s) ** 0.5;
  return Math.min(y, ridgeY(s) - 0.9);
}

/** [x, y, z] from keel station s, across offset a and height y. */
export function world(s, a, y) {
  return [s * SIN + a * COS, y, -s * COS + a * SIN];
}

function frameNormal(nS, nA, nY) {
  const len = Math.hypot(nS, nA, nY) || 1;
  return [(nS * SIN + nA * COS) / len, nY / len, (-nS * COS + nA * SIN) / len];
}

function section(s, t) {
  const e = eaveY(s);
  const r = ridgeY(s);
  const y = e + (r - e) * Math.max(0, 1 - t * t) ** 0.66;
  return { a: t * halfWidth(s), y };
}

function positiveBands(nSide) {
  const tK = 0.028;
  const bands = [{ t0: 0, t1: tK, lift: KEEL_LIFT }];
  const span = 1 - tK;
  for (let i = 0; i < nSide; i++) {
    const a = tK + (span * i) / nSide;
    const b = tK + (span * (i + 1)) / nSide;
    const last = i === nSide - 1;
    const seam = last ? 0 : (b - a) * 0.12;
    bands.push({ t0: a, t1: b - seam, lift: 0 });
    if (!last) bands.push({ t0: b - seam, t1: b, lift: SEAM });
  }
  return bands;
}

function tSamples(nSide) {
  const pos = [];
  const push = (t, lift) => {
    const prev = pos[pos.length - 1];
    if (prev && Math.abs(prev.t - t) < 1e-8 && Math.abs(prev.lift - lift) < 1e-8) return;
    pos.push({ t, lift });
  };
  for (const band of positiveBands(nSide)) {
    push(band.t0, band.lift);
    if (band.lift === 0 && band.t1 - band.t0 > 0.035) push((band.t0 + band.t1) / 2, band.lift);
    push(band.t1, band.lift);
  }
  const neg = pos.filter((s) => s.t > 1e-8).reverse().map((s) => ({ t: -s.t, lift: s.lift }));
  return [...neg, ...pos];
}

function stationsOf(segments) {
  const sMax = HALF_L * SHELL_U;
  const out = [];
  for (let i = 0; i <= segments; i++) out.push(-sMax + (2 * sMax * i) / segments);
  return out;
}

// Road-side entrance, a shallow recess in the glass under the hull. s along the keel.
const DOOR_S0 = -4;
const DOOR_S1 = 22;

function glassA(s, side) {
  const w = halfWidth(s);
  let inset = 1.35;
  if (side < 0 && s >= DOOR_S0 && s <= DOOR_S1) {
    const u = (s - DOOR_S0) / (DOOR_S1 - DOOR_S0);
    const edge = u < 0.16 ? u / 0.16 : u > 0.84 ? (1 - u) / 0.16 : 1;
    const smooth = edge * edge * (3 - 2 * edge);
    inset += 6.4 * smooth;
  }
  return side * Math.max(0.5, w - inset);
}

function wallNormal(s, side) {
  const ds = 0.5;
  const dads = (glassA(s + ds, side) - glassA(s - ds, side)) / (2 * ds);
  // Perpendicular of the wall tangent (1, dads) pointing out of the hall.
  return frameNormal(-dads * side, side, 0);
}

function pointAtSection(s, sample) {
  const sec = section(s, sample.t);
  const eps = 0.012;
  const p0 = section(s, Math.max(-1, sample.t - eps));
  const p1 = section(s, Math.min(1, sample.t + eps));
  const tx = p1.a - p0.a;
  const ty = p1.y - p0.y;
  const len = Math.hypot(ty, tx) || 1;
  const nA = -ty / len;
  const nY = tx / len;
  // A deep groove on the narrowing stem folds over itself. Fade the offset with the section height.
  const depth = Math.max(0, ridgeY(s) - eaveY(s));
  const lift = sample.lift * Math.min(1, depth / 3.5);
  const a = sec.a + nA * lift;
  const y = Math.max(0, sec.y + nY * lift);
  return {
    p: world(s, a, y),
    n: frameNormal(0, nA, nY),
    // +t tangent in the section, used to face the groove walls.
    tangent: frameNormal(0, nY, -nA),
    lift: sample.lift,
    t: sample.t,
  };
}

function triArea(a, b, c) {
  const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
  const vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
  const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
  return Math.hypot(nx, ny, nz) * 0.5;
}

function pushTri(bucket, A, B, C) {
  if (triArea(A.p, B.p, C.p) < 1e-4) return;
  const n = [
    (A.n[0] + B.n[0] + C.n[0]) / 3,
    (A.n[1] + B.n[1] + C.n[1]) / 3,
    (A.n[2] + B.n[2] + C.n[2]) / 3,
  ];
  const ux = B.p[0] - A.p[0], uy = B.p[1] - A.p[1], uz = B.p[2] - A.p[2];
  const vx = C.p[0] - A.p[0], vy = C.p[1] - A.p[1], vz = C.p[2] - A.p[2];
  const face = uy * vz - uz * vy;
  const faceY = uz * vx - ux * vz;
  const faceZ = ux * vy - uy * vx;
  let a = A, b = B, c = C;
  if (face * n[0] + faceY * n[1] + faceZ * n[2] < 0) { b = C; c = B; }
  bucket.push({ p: [a.p, b.p, c.p], n: [a.n, b.n, c.n] });
}

function pushQuad(bucket, A, B, C, D) {
  pushTri(bucket, A, B, C);
  pushTri(bucket, A, C, D);
}

function vtx(s, a, y, n) {
  return { p: world(s, a, y), n };
}

function bandMaterial(lift0, lift1) {
  if (Math.abs(lift0 - lift1) > 0.04) return 'seam';
  if (lift0 < -0.05) return 'seam';
  return 'hull';
}

/**
 * Fill `b` (an assetBuilder) with the hall. Near keeps every plank and mullion;
 * far keeps the hull, the ribs, the glass and a coarser set of the same edges.
 */
export function buildVikingskipet(b, detail) {
  const near = detail === 'near';
  const buckets = { hull: [], seam: [], concrete: [], light: [], glow: [], door: [] };
  const samples = tSamples(near ? 10 : 5);
  const stations = stationsOf(near ? 96 : 40);
  const rings = stations.map((s) => samples.map((sm) => pointAtSection(s, sm)));

  for (let i = 0; i < stations.length - 1; i++) {
    for (let j = 0; j < samples.length - 1; j++) {
      const l0 = samples[j].lift;
      const l1 = samples[j + 1].lift;
      let A = rings[i][j], B = rings[i][j + 1], C = rings[i + 1][j + 1], D = rings[i + 1][j];
      // Groove walls lie across the section. Their face is perpendicular to the plank
      // normal, so winding them against that normal flips every other triangle.
      if (Math.abs(l0 - l1) > 0.04) {
        // The open side of a groove faces the next plank, so the wall normal points into the groove.
        const sign = l0 < l1 ? -1 : 1;
        const tn = A.tangent;
        const n = [tn[0] * sign, tn[1] * sign, tn[2] * sign];
        const face = (v) => ({ p: v.p, n });
        A = face(A); B = face(B); C = face(C); D = face(D);
      }
      pushQuad(buckets[bandMaterial(l0, l1)], A, B, C, D);
    }
  }

  // Upturned stems: the end ring fans to a point slightly higher than the last keel.
  for (const end of [0, stations.length - 1]) {
    const side = end === 0 ? -1 : 1;
    const sTip = side * HALF_L;
    // The published profile pinches to the ground. Sit the stem on the plinth rather than
    // leaving the last ring (still about 2 m up) capped in the air.
    const yTip = PLINTH + 0.4;
    const tip = { p: world(sTip, 0, yTip), n: frameNormal(side, 0, 0.35) };
    const ring = rings[end];
    for (let j = 0; j < ring.length - 1; j++) {
      // The stems are metal. Glass on this fan was a few aliased triangles at the point;
      // the glazed skirt already wraps the long sides and stops as the eave meets the plinth.
      const A = ring[j], B = ring[j + 1];
      if (side > 0) pushTri(buckets.hull, A, B, tip);
      else pushTri(buckets.hull, A, tip, B);
    }
  }

  addPlinthAndGlass(buckets, stations);

  addMullions(b, stations, near);
  addEntrance(b, near);

  for (const [mat, tris] of Object.entries(buckets)) {
    if (!tris.length) continue;
    b.put(toGeometry(tris), mat);
  }
}

function addPlinthAndGlass(buckets, stations) {
  for (const side of [-1, 1]) {
    for (let i = 0; i < stations.length - 1; i++) {
      const s0 = stations[i], s1 = stations[i + 1];
      const show0 = eaveY(s0) > PLINTH + 1.25 && halfWidth(s0) > 6;
      const show1 = eaveY(s1) > PLINTH + 1.25 && halfWidth(s1) > 6;
      const show = show0 && show1;
      const n = wallNormal((s0 + s1) / 2, side);
      const aWall = (s) => (show ? glassA(s, side) : side * Math.max(0.4, halfWidth(s) - 0.15));
      const aPlinth = (s) => aWall(s) + side * 0.18;
      const yGlass = (s) => (show ? eaveY(s) - 0.08 : PLINTH);
      // vertical enclosure. Past the glass, a metal cheek carries the eave down to the plinth
      // so the stem is not an open cut.
      if (show) {
        pushQuad(
          buckets.light,
          vtx(s0, aWall(s0), yGlass(s0), n),
          vtx(s1, aWall(s1), yGlass(s1), n),
          vtx(s1, aWall(s1), PLINTH, n),
          vtx(s0, aWall(s0), PLINTH, n),
        );
        const soffitN = frameNormal(0, side * 0.2, -1);
        pushQuad(
          buckets.seam,
          vtx(s0, side * halfWidth(s0), eaveY(s0), soffitN),
          vtx(s1, side * halfWidth(s1), eaveY(s1), soffitN),
          vtx(s1, aWall(s1), yGlass(s1), soffitN),
          vtx(s0, aWall(s0), yGlass(s0), soffitN),
        );
        const glowN = n;
        const proud = 0.08;
        pushQuad(
          buckets.glow,
          vtx(s0, aWall(s0) + side * proud, yGlass(s0) - 0.48, glowN),
          vtx(s1, aWall(s1) + side * proud, yGlass(s1) - 0.48, glowN),
          vtx(s1, aWall(s1) + side * proud, yGlass(s1) - 0.06, glowN),
          vtx(s0, aWall(s0) + side * proud, yGlass(s0) - 0.06, glowN),
        );
      } else if (halfWidth(s0) > 2.2 && halfWidth(s1) > 2.2) {
        pushQuad(
          buckets.hull,
          vtx(s0, side * halfWidth(s0), eaveY(s0), n),
          vtx(s1, side * halfWidth(s1), eaveY(s1), n),
          vtx(s1, aPlinth(s1), PLINTH, n),
          vtx(s0, aPlinth(s0), PLINTH, n),
        );
      }
      if (halfWidth(s0) < 2.2 || halfWidth(s1) < 2.2) continue;
      // plinth outer face and a thin top lip
      const topN = [0, 1, 0];
      pushQuad(
        buckets.concrete,
        vtx(s0, aPlinth(s0), PLINTH, n),
        vtx(s1, aPlinth(s1), PLINTH, n),
        vtx(s1, aPlinth(s1), 0, n),
        vtx(s0, aPlinth(s0), 0, n),
      );
      pushQuad(
        buckets.concrete,
        vtx(s0, aPlinth(s0), PLINTH, topN),
        vtx(s1, aPlinth(s1), PLINTH, topN),
        vtx(s1, aPlinth(s1) - side * 0.42, PLINTH, topN),
        vtx(s0, aPlinth(s0) - side * 0.42, PLINTH, topN),
      );
    }
  }
}

// BoxGeometry +X is swung onto +a by rotateY(−bearing). The box is symmetric, so the
// along-keel axis lands on ±s either way.
function placeBox(b, mat, s, a, y, sizeA, sizeY, sizeS) {
  b.box(mat, world(s, a, y), [sizeA, sizeY, sizeS], -BEARING * RAD);
}

function addMullions(b, stations, near) {
  const step = near ? 8.5 : 18;
  for (const side of [-1, 1]) {
    for (let s = -HALF_L * 0.86; s <= HALF_L * 0.86; s += step) {
      if (eaveY(s) < PLINTH + 2.2 || halfWidth(s) < 10) continue;
      if (side < 0 && s > DOOR_S0 + 2 && s < DOOR_S1 - 2) continue;
      const a = glassA(s, side) + side * 0.1;
      const y1 = eaveY(s) - 0.7;
      if (y1 - PLINTH < 1.2) continue;
      placeBox(b, 'seam', s, a, (PLINTH + y1) / 2, 0.12, y1 - PLINTH, near ? 0.2 : 0.28);
    }
  }
}

function addEntrance(b, near) {
  const side = -1;
  const mid = (DOOR_S0 + DOOR_S1) / 2;
  const span = DOOR_S1 - DOOR_S0;
  // Dark canopy across the recess, under the soffit and clear of the glass.
  const aInner = glassA(mid, side) + side * 0.15;
  const aOuter = side * (halfWidth(mid) - 0.85);
  const depth = Math.abs(aOuter - aInner);
  if (depth > 0.8) {
    placeBox(b, 'seam', mid, (aInner + aOuter) / 2, 4.55, depth, 0.34, near ? 18 : 18);
  }
  const doorW = near ? 3.2 : 3.5;
  const doorH = 3.55;
  for (const s of [mid - 2.6, mid + 2.6]) {
    const a = glassA(s, side) + side * 0.18;
    placeBox(b, 'door', s, a, PLINTH + doorH / 2, 0.2, doorH, doorW);
  }
  // Cheek returns at the shoulders of the recess, so the cut reads from the road.
  for (const s of [DOOR_S0 + span * 0.16, DOOR_S1 - span * 0.16]) {
    const inner = glassA(s, side);
    const outer = side * (halfWidth(s) - 1.35);
    const sizeA = Math.abs(inner - outer);
    if (sizeA < 0.8) continue;
    placeBox(b, 'seam', s, (inner + outer) / 2, (PLINTH + 4.55) / 2, sizeA, 4.55 - PLINTH, 0.32);
  }
}

function toGeometry(tris) {
  const pos = [];
  const nor = [];
  const idx = [];
  let k = 0;
  for (const t of tris) {
    for (let i = 0; i < 3; i++) {
      pos.push(t.p[i][0], t.p[i][1], t.p[i][2]);
      const n = t.n[i];
      nor.push(n[0], n[1], n[2]);
    }
    idx.push(k, k + 1, k + 2);
    k += 3;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setIndex(idx);
  return g;
}
