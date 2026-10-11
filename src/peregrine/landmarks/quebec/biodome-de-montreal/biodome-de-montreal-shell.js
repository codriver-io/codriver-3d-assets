// The Biodôme's roof as a surface: Taillibert's 1976 Velodrome vault, a prestressed concrete shell
// resting on four abutments (A, B, C, D), with arches between them, a long spindle of skylights along
// its spine and columns of lens-shaped skylights near the edges. Everything here is a height function
// over the mapped plan (`biodome-de-montreal-plan.js`), so ribs, skylights and walls sit exactly on the
// shell. All lengths are metres; the frame is +X east, +Y up, +Z south around the plan centroid.
import * as THREE from 'three';
import { RING, FEET, AXIS } from './biodome-de-montreal-plan.js';

// Sourced: 33.5 m (110 ft) above ground at the crown, 172 m average length, four abutments
// (stadeolympiquemontreal.ca/le-toit-du-velodrome.php). Estimated: everything else here.
export const CROWN = 33.5;
const LIP = 1.1;          // thickness of the roof edge beam seen from the front
const BUBBLE = 0.46;
const SKY_GAP = 0.16;     // glass floats this far over the shell at its rim (shell faces are larger than 50 m)      // how far a skylight's glass rises over the shell
const LIFT = 1.5;         // how far the spindle stands proud of the flanks at the crown
const HC = CROWN - BUBBLE - LIFT - 0.25; // dome height at the centre; spindle lift and the middle skylight bubble bring it to CROWN
const P_EXP = 1.8;        // fullness of the dome profile, t = 0 at the crown, 1 at the edge
const KAPPA = 0.22;       // how much the dome drops between the feet (ridges run down to the abutments)
const ARCH = { AB: 7.0, BC: 8.5, CD: 8.0, DA: 6.0 }; // clear height under the roof edge at mid-arch

const N0 = RING.length;
const SIG = [0];
for (let i = 1; i <= N0; i++) SIG.push(SIG[i - 1] + Math.hypot(RING[i % N0][0] - RING[i - 1][0], RING[i % N0][1] - RING[i - 1][1]));
export const PERIMETER = SIG[N0];
const SA = SIG[FEET.A], SB = SIG[FEET.B], SC = SIG[FEET.C], SD = SIG[FEET.D];
const SECTIONS = [[SA, SB, ARCH.AB], [SB, SC, ARCH.BC], [SC, SD, ARCH.CD], [SD, SA + PERIMETER, ARCH.DA]];
const wrap = (s) => { let v = s; while (v < SA) v += PERIMETER; while (v >= SA + PERIMETER) v -= PERIMETER; return v; };

/** Clear height under the roof edge at perimeter position sigma (0 at a foot) and its 0..1 shape. */
export function archAt(sigma) {
  const s = wrap(sigma);
  for (const [a, b, h] of SECTIONS) {
    if (s >= a && s < b) {
      const n = Math.pow(Math.max(0, Math.sin(Math.PI * (s - a) / (b - a))), 0.78);
      return { h: h * n, n };
    }
  }
  return { h: 0, n: 0 };
}

/** Top of the shell at perimeter position sigma and radial fraction t (0 centre, 1 edge). */
export function topAt(sigma, t) {
  const { h, n } = archAt(sigma);
  return (h + LIP) * t * t + HC * (1 - Math.pow(t, P_EXP)) * (1 - KAPPA * n * Math.pow(t, 0.7));
}

// Half-width of the central spindle (the two ribs that run from the south-west foot to the north-east
// foot), by distance s along the axis. The spindle stands a little proud of the flanks.
const SPINDLE = [[-84, 0.4], [-72, 3], [-60, 7.5], [-45, 12.5], [-25, 16.3], [0, 17.4], [30, 16.5], [60, 13.8], [80, 9.5], [93, 2.5]];
export const SPINDLE_POINTS = SPINDLE;
export function spindleHalfWidth(s) {
  if (s <= SPINDLE[0][0]) return SPINDLE[0][1];
  for (let i = 1; i < SPINDLE.length; i++) {
    if (s <= SPINDLE[i][0]) { const [a, wa] = SPINDLE[i - 1], [b, wb] = SPINDLE[i]; return wa + (wb - wa) * (s - a) / (b - a); }
  }
  return SPINDLE[SPINDLE.length - 1][1];
}
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
function spindleLift(x, z) {
  const s = x * AXIS.u[0] + z * AXIS.u[1], w = x * AXIS.v[0] + z * AXIS.v[1];
  const half = spindleHalfWidth(s), q = Math.abs(w) / half;
  if (q >= 1 || s < -80 || s > 92) return 0;
  return LIFT * (1 - smooth(0.5, 1, q)) * smooth(-80, -42, s) * (1 - smooth(68, 92, s));
}
export const surfaceAt = (x, z, sigma, t) => topAt(sigma, t) + spindleLift(x, z);

const EDGES = RING.map((p, i) => {
  const q = RING[(i + 1) % N0];
  return { p, e: [q[0] - p[0], q[1] - p[1]], len: SIG[i + 1] - SIG[i] };
});

/** Where the ray from the plan centre through (x, z) leaves the plan: edge, fraction, radius. */
export function locate(x, z) {
  const r = Math.hypot(x, z);
  if (r < 1e-9) return { t: 0, sigma: 0, R: 80, r: 0 };
  const dx = x / r, dz = z / r;
  for (let i = 0; i < N0; i++) {
    const { p, e, len } = EDGES[i];
    const den = dx * e[1] - dz * e[0];
    if (Math.abs(den) < 1e-12) continue;
    const a = (p[0] * e[1] - p[1] * e[0]) / den, u = (dz * p[0] - dx * p[1]) / den;
    if (a > 0 && u >= 0 && u < 1) return { t: r / a, sigma: SIG[i] + u * len, R: a, r };
  }
  return { t: 1, sigma: 0, R: r, r };
}
export function heightAt(x, z) {
  const { t, sigma } = locate(x, z);
  return surfaceAt(x, z, sigma, Math.min(1, t));
}

// ---------------------------------------------------------------------------------------------
// Boundary samples: the mapped ring, split to a maximum edge length (near) or simplified (far).
function simplifyChain(chain, tol) {
  if (chain.length < 3) return chain;
  const [a, b] = [chain[0], chain[chain.length - 1]];
  const ex = b.x - a.x, ez = b.z - a.z, el = Math.hypot(ex, ez) || 1;
  let worst = 0, at = -1;
  for (let i = 1; i < chain.length - 1; i++) {
    const d = Math.abs((chain[i].x - a.x) * ez - (chain[i].z - a.z) * ex) / el;
    if (d > worst) { worst = d; at = i; }
  }
  if (worst <= tol) return [a, b];
  return [...simplifyChain(chain.slice(0, at + 1), tol).slice(0, -1), ...simplifyChain(chain.slice(at), tol)];
}
export function boundary(detail) {
  const pts = RING.map(([x, z], i) => ({ x, z, sigma: SIG[i], idx: i }));
  if (detail === 'far') {
    const forced = [FEET.A, FEET.B, FEET.C, FEET.D].sort((a, b) => a - b);
    const out = [];
    for (let f = 0; f < forced.length; f++) {
      const from = forced[f], to = f + 1 < forced.length ? forced[f + 1] : forced[0] + N0;
      const chain = [];
      for (let i = from; i <= to; i++) chain.push(pts[i % N0]);
      out.push(...simplifyChain(chain, 0.7).slice(0, -1));
    }
    return out;
  }
  const out = [];
  for (let i = 0; i < N0; i++) {
    const a = pts[i], b = pts[(i + 1) % N0], n = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.z - a.z) / 6.5));
    for (let k = 0; k < n; k++) {
      const f = k / n;
      out.push({ x: a.x + (b.x - a.x) * f, z: a.z + (b.z - a.z) * f, sigma: SIG[i] + (SIG[i + 1] - SIG[i]) * f });
    }
  }
  return out;
}

// ---------------------------------------------------------------------------------------------
// Small mesh helpers.
function geometryFrom(positions, indices) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  g.setIndex(indices);
  g.computeVertexNormals();
  return g;
}
/** Flip every triangle if the faces mostly point away from `want(centroid, normal)` > 0. */
function faceTowards(g, want) {
  const p = g.attributes.position, ix = g.index.array;
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), n = new THREE.Vector3(), m = new THREE.Vector3();
  let score = 0;
  for (let i = 0; i < ix.length; i += 3) {
    a.fromBufferAttribute(p, ix[i]); b.fromBufferAttribute(p, ix[i + 1]); c.fromBufferAttribute(p, ix[i + 2]);
    n.subVectors(b, a).cross(m.subVectors(c, a));
    const area = n.length();
    if (area < 1e-12) continue;
    n.divideScalar(area); m.copy(a).add(b).add(c).divideScalar(3);
    score += want(m, n) * area;
  }
  if (score < 0) {
    const flipped = Uint32Array.from(ix);
    for (let i = 0; i < flipped.length; i += 3) { flipped[i + 1] = ix[i + 2]; flipped[i + 2] = ix[i + 1]; }
    g.setIndex(Array.from(flipped));
    g.computeVertexNormals();
  }
  return g;
}
const up = (_, n) => n.y;
const down = (_, n) => -n.y;
const radialOut = (m, n) => { const r = Math.hypot(m.x, m.z) || 1; return (n.x * m.x + n.z * m.z) / r; };

// ---------------------------------------------------------------------------------------------
// The shell, its edge beam, soffit and the wall under the arches.
export function shellParts(detail) {
  const near = detail === 'near';
  const ring = boundary(detail), K = ring.length;
  const M = near ? 30 : 13;
  const tOf = (j) => 1 - Math.pow(1 - j / M, near ? 1.3 : 1.15);

  // Top surface: centre vertex then M rings.
  const pos = [0, surfaceAt(0, 0, 0, 0), 0];
  for (let j = 1; j <= M; j++) {
    const t = tOf(j);
    for (let k = 0; k < K; k++) pos.push(ring[k].x * t, surfaceAt(ring[k].x * t, ring[k].z * t, ring[k].sigma, t), ring[k].z * t);
  }
  const idx = [];
  const at = (k, j) => 1 + (j - 1) * K + (k % K);
  for (let k = 0; k < K; k++) idx.push(0, at(k, 1), at(k + 1, 1));
  for (let j = 1; j < M; j++) for (let k = 0; k < K; k++) idx.push(at(k, j), at(k, j + 1), at(k + 1, j), at(k + 1, j), at(k, j + 1), at(k + 1, j + 1));
  const top = faceTowards(geometryFrom(pos, idx), up);

  // Edge beam: the vertical band at the plan boundary from the clear height up to the top.
  const rimPos = [], rimIdx = [];
  for (let k = 0; k < K; k++) {
    const arch = archAt(ring[k].sigma).h;
    rimPos.push(ring[k].x, arch, ring[k].z, ring[k].x, arch + LIP, ring[k].z);
  }
  for (let k = 0; k < K; k++) { const a = 2 * k, b = 2 * ((k + 1) % K); rimIdx.push(a, b, a + 1, a + 1, b, b + 1); }
  const rim = faceTowards(geometryFrom(rimPos, rimIdx), radialOut);

  // Soffit (the underside of the edge, from the beam back to the wall) and the wall itself.
  const INSET = 3.6;   // the glazed wall stands this far back from the roof edge
  const sofPos = [], sofIdx = [], wallInfo = [];
  for (let k = 0; k < K; k++) {
    const b = ring[k], R = Math.hypot(b.x, b.z), tin = Math.max(0.05, 1 - INSET / R), arch = archAt(b.sigma).h;
    const wx = b.x * tin, wz = b.z * tin, wallTop = topAt(b.sigma, tin) - LIP;
    sofPos.push(b.x, arch, b.z, wx, wallTop, wz);
    wallInfo.push({ x: wx, z: wz, top: wallTop, arch });
  }
  for (let k = 0; k < K; k++) { const a = 2 * k, b = 2 * ((k + 1) % K); sofIdx.push(a, b, a + 1, a + 1, b, b + 1); }
  const soffit = faceTowards(geometryFrom(sofPos, sofIdx), down);

  const glassPos = [], glassIdx = [], solidPos = [], solidIdx = [];
  const addWall = (posArr, idxArr, p, q) => {
    const base = posArr.length / 3;
    posArr.push(p.x, 0, p.z, p.x, p.top, p.z, q.x, 0, q.z, q.x, q.top, q.z);
    idxArr.push(base, base + 2, base + 1, base + 1, base + 2, base + 3);
  };
  for (let k = 0; k < K; k++) {
    const p = wallInfo[k], q = wallInfo[(k + 1) % K];
    if ((p.arch + q.arch) / 2 > 2.8) addWall(glassPos, glassIdx, p, q); else addWall(solidPos, solidIdx, p, q);
  }
  const glass = glassIdx.length ? faceTowards(geometryFrom(glassPos, glassIdx), radialOut) : null;
  const solid = solidIdx.length ? faceTowards(geometryFrom(solidPos, solidIdx), radialOut) : null;
  return { top, rim, soffit, glass, solid, wallInfo, ring };
}

// ---------------------------------------------------------------------------------------------
// Draped ribs: a raised strip following a plan polyline on the shell surface.
export const toWorld = (s, w) => [s * AXIS.u[0] + w * AXIS.v[0], s * AXIS.u[1] + w * AXIS.v[1]];
function spacedPlan(points, step) {
  const curve = new THREE.CatmullRomCurve3(points.map(([x, z]) => new THREE.Vector3(x, 0, z)), false, 'centripetal');
  const n = Math.max(4, Math.round(curve.getLength() / step));
  return curve.getSpacedPoints(n).map((v) => [v.x, v.z]);
}
export function ribStrip(points, { step = 3, wb = 2, wt = 0.8, hr = 0.9, taper = 5, sink = 0.14, lift = 0, follow = heightAt } = {}) {
  const pts = spacedPlan(points, step), pos = [], idx = [];
  let run = 0;
  const cum = pts.map((p, i) => (i ? (run += Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1])) : 0));
  const total = run;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    let tx = b[0] - a[0], tz = b[1] - a[1]; const tl = Math.hypot(tx, tz) || 1; tx /= tl; tz /= tl;
    const nx = -tz, nz = tx;
    const f = Math.max(0.12, Math.min(1, cum[i] / taper, (total - cum[i]) / taper));
    const [x, z] = pts[i], h0 = follow(x, z) + lift;
    const half = wb / 2 * f, halfTop = wt / 2 * f;
    const left = [x + nx * half, z + nz * half], right = [x - nx * half, z - nz * half];
    pos.push(left[0], follow(left[0], left[1]) + lift - sink, left[1]);
    pos.push(x + nx * halfTop, h0 + hr * f, z + nz * halfTop);
    pos.push(x - nx * halfTop, h0 + hr * f, z - nz * halfTop);
    pos.push(right[0], follow(right[0], right[1]) + lift - sink, right[1]);
  }
  for (let i = 0; i + 1 < pts.length; i++) {
    const a = 4 * i, b = 4 * (i + 1);
    for (let c = 0; c < 3; c++) idx.push(a + c, b + c, a + c + 1, a + c + 1, b + c, b + c + 1);
  }
  return faceTowards(geometryFrom(pos, idx), up);
}

// ---------------------------------------------------------------------------------------------
// A lens-shaped skylight: pointed at both ends, a low glass bubble over the shell.
export function lens(cx, cz, angle, halfLength, halfWidth, { nu = 10, nv = 4 } = {}) {
  const dx = Math.cos(angle), dz = Math.sin(angle), px = -dz, pz = dx;
  const pos = [], idx = [];
  const put = (xi, eta) => {
    const om = Math.pow(Math.max(0, 1 - xi * xi), 0.8);
    const x = cx + xi * halfLength * dx + eta * halfWidth * om * px, z = cz + xi * halfLength * dz + eta * halfWidth * om * pz;
    const bubble = BUBBLE * (1 - eta * eta) * Math.sqrt(Math.max(0, 1 - xi * xi));
    pos.push(x, heightAt(x, z) + SKY_GAP + bubble, z);
  };
  put(-1, 0);
  const col = (c) => 1 + (c - 1) * (nv + 1);
  for (let c = 1; c < nu; c++) for (let r = 0; r <= nv; r++) put(-1 + (2 * c) / nu, -1 + (2 * r) / nv);
  put(1, 0);
  const last = pos.length / 3 - 1;
  for (let r = 0; r < nv; r++) { idx.push(0, col(1) + r, col(1) + r + 1); idx.push(last, col(nu - 1) + r + 1, col(nu - 1) + r); }
  for (let c = 1; c < nu - 1; c++) for (let r = 0; r < nv; r++) {
    const a = col(c) + r, b = col(c + 1) + r;
    idx.push(a, b, a + 1, a + 1, b, b + 1);
  }
  return faceTowards(geometryFrom(pos, idx), up);
}
export const BUBBLE_RISE = BUBBLE;

/** Point on the plan boundary at perimeter position sigma. */
export function pointAtSigma(sigma) {
  const s = ((sigma % PERIMETER) + PERIMETER) % PERIMETER;
  let i = 0;
  while (i < N0 - 1 && SIG[i + 1] <= s) i++;
  const f = (s - SIG[i]) / (SIG[i + 1] - SIG[i]), a = RING[i], b = RING[(i + 1) % N0];
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
}
export const FOOT_SIGMA = { A: SA, B: SB, C: SC, D: SD };
