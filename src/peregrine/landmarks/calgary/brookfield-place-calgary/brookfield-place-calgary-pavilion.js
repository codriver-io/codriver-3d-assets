// The three-storey glass pavilion beside the tower (OSM way 575090048, building=commercial, 1 599 m2), joined to the tower's
// west and south-west faces and to the Plus 15 network. Walls are glass with a slender mullion rhythm and two floor lines; the
// roof is a glass skin with ribs that rises toward the tower (photographs from the Calgary Tower show a gently pitched glass
// roof; the exact pitch and eave height are estimated).
import * as THREE from 'three';
import { SPEC } from './config.js';

// The mapped outline (way 575090048) simplified: the small jogs of its west side are dropped, and its shared edge with
// the tower is pushed 1 m into the tower so the roof meets the glass. Local metres from the OSM centroid frame
// (x east, z south) shifted to this model's origin by `Z0` (the origin sits 0.31 m north of the stub origin that the
// numbers below were measured in).
const Z0 = 0.31;
const OUTLINE = [
  [-53.6, -25.6], [-44.3, -25.4], [-36.7, -25.1], [-33.3, -24.0], [-32.0, -20.9], [-30.4, -18.5], // the wall runs into the tower's north-west corner
  [-32.4, 16.0], // inside the tower: the edge from the previous point runs inside it and is not drawn
  [-33.8, 21.0], [-34.7, 41.6], [-34.8, 44.4], [-36.2, 46.2], [-38.7, 47.2], [-52.6, 46.8], [-58.3, 46.6],
  [-57.8, 33.2], [-55.1, 33.2], [-54.8, 25.1], [-57.4, 25.0], [-57.3, 18.2], [-54.4, 18.2], [-53.6, -11.4],
].map(([x, z]) => [x, z + Z0]);
const HIDDEN_EDGE = 5; // OUTLINE[5] -> OUTLINE[6]: the tower hides it

const { eaveY, slope, westX } = SPEC.pavilion;
/** Height of the glass roof plane above x: it rises toward the tower (east). */
export const roofAt = (x) => eaveY + slope * (x - westX);
export const PAVILION_OUTLINE = OUTLINE;

function inside(pts, x, z) {
  let c = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, zi] = pts[i], [xj, zj] = pts[j];
    if ((zi > z) !== (zj > z) && x < (xj - xi) * (z - zi) / (zj - zi) + xi) c = !c;
  }
  return c;
}

/** A square-ended bar from a to b (top-centre line, y given), `w` across, `h` deep below the top: top and both sides. */
function bar(mesh, a, b, w, h) {
  const dx = b[0] - a[0], dz = b[2] - a[2], dy = b[1] - a[1], len = Math.hypot(dx, dy, dz);
  if (len < 1e-4) return;
  const hl = Math.hypot(dx, dz) || 1, sx = -dz / hl * w / 2, sz = dx / hl * w / 2; // horizontal half-width across the bar
  const P = (p, s, down) => [p[0] + sx * s, p[1] - down, p[2] + sz * s];
  const nSide = [-dz / hl, 0, dx / hl];
  const top = [0, 1, 0];
  mesh.quad(mesh.vertex(P(a, -1, 0), top), mesh.vertex(P(a, 1, 0), top), mesh.vertex(P(b, 1, 0), top), mesh.vertex(P(b, -1, 0), top));
  for (const s of [-1, 1]) {
    const n = [nSide[0] * s, 0, nSide[2] * s];
    mesh.quad(mesh.vertex(P(a, s, 0), n), mesh.vertex(P(b, s, 0), n), mesh.vertex(P(b, s, h), n), mesh.vertex(P(a, s, h), n));
  }
}

/** A wall post standing proud of a wall: outer face and both sides. (x, z) on the wall, n the outward normal. */
function post(mesh, x, z, nx, nz, y0, y1, w, out) {
  const tx = -nz, tz = nx, h = w / 2;
  const V = (s, d, y, n) => mesh.vertex([x + tx * s * h + nx * d, y, z + tz * s * h + nz * d], n);
  const nO = [nx, 0, nz];
  mesh.quad(V(-1, out, y0, nO), V(1, out, y0, nO), V(1, out, y1, nO), V(-1, out, y1, nO));
  for (const s of [-1, 1]) {
    const nS = [tx * s, 0, tz * s];
    mesh.quad(V(s, 0, y0, nS), V(s, out, y0, nS), V(s, out, y1, nS), V(s, 0, y1, nS));
  }
}

/** Pavilion meshes: M.pglass (walls and roof skin) and M.frame (mullions, floor lines, roof ribs). */
export function buildPavilion(M, near) {
  const pts = OUTLINE, n = pts.length;
  // ---- walls
  for (let i = 0; i < n; i++) {
    if (i === HIDDEN_EDGE) continue;
    const [x1, z1] = pts[i], [x2, z2] = pts[(i + 1) % n], dx = x2 - x1, dz = z2 - z1, len = Math.hypot(dx, dz);
    let nx = dz / len, nz = -dx / len; // outward normal: tested against the polygon, whatever its winding
    if (inside(pts, (x1 + x2) / 2 + nx * 0.05, (z1 + z2) / 2 + nz * 0.05)) { nx = -nx; nz = -nz; }
    const y1 = roofAt(x1), y2 = roofAt(x2), nn = [nx, 0, nz];
    M.pglass.quad(M.pglass.vertex([x1, 0, z1], nn), M.pglass.vertex([x2, 0, z2], nn), M.pglass.vertex([x2, y2, z2], nn), M.pglass.vertex([x1, y1, z1], nn));
    // eave band along the sloping top of the wall, standing a little proud of it and above the roof skin's edge
    bar(M.frame, [x1 + nx * 0.15, y1 + 0.25, z1 + nz * 0.15], [x2 + nx * 0.15, y2 + 0.25, z2 + nz * 0.15], 0.3, 0.55);
    if (!near) continue;
    // mullions every ~3 m, the edge's two ends included
    const count = Math.max(1, Math.round(len / 3));
    for (let k = 0; k <= count; k++) {
      const t = k / count, x = x1 + dx * t, z = z1 + dz * t, top = roofAt(x);
      post(M.frame, x, z, nx, nz, 0, top, 0.2, 0.14);
    }
    // two floor lines, 4.0 and 8.0 m up, running the length of the wall (a hair shallower than the posts)
    for (const fy of [4.0, 8.0]) {
      if (len < 1.5) continue;
      bar(M.frame, [x1 + nx * 0.08, fy + 0.15, z1 + nz * 0.08], [x2 + nx * 0.08, fy + 0.15, z2 + nz * 0.08], 0.16, 0.3);
    }
  }
  // ---- sloping glass roof: one planar skin over the outline, rising toward the tower
  const contour = pts.map(([x, z]) => new THREE.Vector2(x, z));
  const tris = THREE.ShapeUtils.triangulateShape(contour, []);
  const nr = [-slope, 1, 0];
  const V = (i) => M.pglass.vertex([pts[i][0], roofAt(pts[i][0]), pts[i][1]], nr);
  for (const [a, b, c] of tris) M.pglass.tri(V(a), V(b), V(c));
  // roof ribs: along the slope every 3 m (near) or 6 m (far), plus cross ribs every 6 m (near)
  let zMin = Infinity, zMax = -Infinity, xMin = Infinity, xMax = -Infinity;
  for (const [x, z] of pts) { zMin = Math.min(zMin, z); zMax = Math.max(zMax, z); xMin = Math.min(xMin, x); xMax = Math.max(xMax, x); }
  const crossings = (axis, v) => { // sorted crossings of the outline with the line axis=v (axis 'z': z=v, returns x's)
    const hits = [];
    for (let i = 0; i < n; i++) {
      const a = pts[i], b = pts[(i + 1) % n], ia = axis === 'z' ? 1 : 0, ib = axis === 'z' ? 0 : 1;
      if ((a[ia] > v) === (b[ia] > v)) continue;
      hits.push(a[ib] + (b[ib] - a[ib]) * (v - a[ia]) / (b[ia] - a[ia]));
    }
    return hits.sort((p, q) => p - q);
  };
  const lift = 0.16; // ribs stand proud of the glass skin
  if (near) {
    for (let z = Math.ceil(zMin / 3) * 3; z < zMax; z += 3) {
      const xs = crossings('z', z);
      for (let i = 0; i + 1 < xs.length; i += 2) {
        const xa = xs[i] + 0.2, xb = Math.min(xs[i + 1] - 0.2, -32.6);
        if (xb - xa > 1) bar(M.frame, [xa, roofAt(xa) + lift, z], [xb, roofAt(xb) + lift, z], 0.18, 0.3);
      }
    }
    for (let x = Math.ceil(xMin / 6) * 6; x < xMax; x += 6) {
      if (x > -33) continue;
      const zs = crossings('x', x), y = roofAt(x) + lift;
      for (let i = 0; i + 1 < zs.length; i += 2) {
        const za = zs[i] + 0.2, zb = zs[i + 1] - 0.2;
        if (zb - za > 1) bar(M.frame, [x, y, za], [x, y, zb], 0.18, 0.3);
      }
    }
  }
}
