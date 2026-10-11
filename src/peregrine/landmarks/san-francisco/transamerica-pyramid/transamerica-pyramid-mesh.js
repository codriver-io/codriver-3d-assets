// Transamerica Pyramid: shape constants and the flat-quad surface accumulator the parts draw into.
// Everything is authored in the BUILDING frame (faces face +X' east, +Z' south, -X' west, -Z' north,
// the pyramid axis at the origin) and rotated once by SHAPE.rotationDeg when it is handed to the
// builder, so the model sits in its mapped footprint. Nothing else knows a dimension.
import * as THREE from 'three';
import { SPEC } from './config.js';

export const DEG = Math.PI / 180;
export const SHAPE = {
  halfBase: 26.65,   // half of the 53.3 m (175 ft) base side at grade
  apexY: 266,        // where the straight faces would meet; the 1.2 m crown flat sits at 260 m
  topY: 260,
  pocket: 0.5,       // depth of the window recesses, metres
  // Four-storey base: arcade of A-frames, fascia, recessed strip, thick band.
  arcadeTop: 11, fasciaTop: 13.8, stripTop: 16, bandTop: 20.4,
  floor: 4,          // storey height above the base
  rows: 44,          // window rows: floors 5..48
  pocketH: 3.6,      // a window pocket: a 1.6 m sloped sill under a 2.0 m opening
  sillH: 1.6,
  farSillH: 1.8,     // far: wall and sill merge into one band, leaving a 1.8 m dark opening
  pocketRows: 14,    // near: full recessed pockets on the lowest 14 rows (to 76 m); above, flat wall with window panes
  tuck: 0.03,        // pier fronts and jambs run 0.03 m behind and past the bands they meet, so no T-junction crack opens
  bandH: 0.4,        // the plain frame between one pocket row and the next
  topBand: [196.0, 196.4], // closing band; the aluminium spire starts at 196.4 m
  spireTop: 254, crownTop: 260,
  // Wings (E and W faces): a vertical outer face 6.5 m wide that emerges from the sloping face at the
  // 128 m band (about the 29th floor) and stops with a pitched top at 209.5 .. 214.5 m.
  wingHalfW: 3.25, wingY0: 128, wingEaveY: 209.5, wingTopY: 214.5,
};
SHAPE.wingFaceN = SHAPE.halfBase * (1 - SHAPE.wingY0 / SHAPE.apexY); // 13.83 m (mapped 13.95)
SHAPE.rotation = SPEC.rotationDeg * DEG;
SHAPE.windowRow = (i) => ({ zb: SHAPE.bandTop + i * SHAPE.floor, zt: SHAPE.bandTop + i * SHAPE.floor + SHAPE.pocketH });
/** Half-width of a face at height y (the face plane's offset from the axis). */
export const half = (y) => SHAPE.halfBase * (1 - y / SHAPE.apexY);

// Faces in order east, south, west, north: outward unit vector (x, z) and the lateral axis u.
const OUT = [[1, 0], [0, 1], [-1, 0], [0, -1]];
export const FACE_NAMES = ['east', 'south', 'west', 'north'];
export function faceFrame(f) {
  const [ox, oz] = OUT[f], tx = -oz, tz = ox;
  const slope = SHAPE.halfBase / SHAPE.apexY; // dn/dy of the face plane
  return {
    o: [ox, 0, oz], t: [tx, 0, tz],
    // outward hint for a face-plane quad (tilted up by the face slope)
    hint: [ox, slope, oz],
    // a point at lateral u, height y, offset dn from the face plane (outward positive)
    pt: (u, y, dn = 0) => { const n = half(y) + dn; return [tx * u + ox * n, y, tz * u + oz * n]; },
    // a point at absolute outward distance n (from the axis)
    ptN: (u, y, n) => [tx * u + ox * n, y, tz * u + oz * n],
    tHint: (s) => [tx * s, 0, tz * s],
  };
}

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

/** Flat-shaded surface accumulator: chunked buckets per material, every quad on its own four vertices. */
export function surfaces() {
  const buckets = new Map(); // material -> [{ p, i }] chunks of at most MAX_VERTS vertices (16-bit indices)
  const MAX_VERTS = 60000;
  const bucket = (m) => {
    let list = buckets.get(m); if (!list) { list = [{ p: [], i: [] }]; buckets.set(m, list); }
    if (list[list.length - 1].p.length / 3 > MAX_VERTS) list.push({ p: [], i: [] });
    return list[list.length - 1];
  };
  const stats = { quads: 0, tris: 0 };
  /** A quad a-b-c-d (any winding); the visible side is the one `hint` points toward. */
  function quad(m, a, b, c, d, hint) {
    const n1 = cross(sub(b, a), sub(c, a)), n2 = cross(sub(c, a), sub(d, a));
    const n = [n1[0] + n2[0], n1[1] + n2[1], n1[2] + n2[2]];
    const pts = dot(n, hint) < 0 ? [a, d, c, b] : [a, b, c, d];
    const k = bucket(m), base = k.p.length / 3;
    for (const p of pts) k.p.push(p[0], p[1], p[2]);
    k.i.push(base, base + 1, base + 2, base, base + 2, base + 3);
    stats.quads++; stats.tris += 2;
  }
  function tri(m, a, b, c, hint) {
    const n = cross(sub(b, a), sub(c, a));
    const pts = dot(n, hint) < 0 ? [a, c, b] : [a, b, c];
    const k = bucket(m), base = k.p.length / 3;
    for (const p of pts) k.p.push(p[0], p[1], p[2]);
    k.i.push(base, base + 1, base + 2);
    stats.tris++;
  }
  /** A simple (possibly concave) polygon given as 3D points whose planar 2D coordinates are `pts2`. */
  function poly(m, pts3, pts2, hint) {
    const v2 = pts2.map(([x, y]) => new THREE.Vector2(x, y));
    for (const [i, j, k] of THREE.ShapeUtils.triangulateShape(v2, [])) tri(m, pts3[i], pts3[j], pts3[k], hint);
  }
  /** Turn each chunk into a BufferGeometry, rotate it into the local frame and hand it to the builder. */
  function flush(builder, rotation) {
    for (const [material, list] of buckets) {
      list.forEach(({ p, i }, chunk) => {
        if (!i.length) return;
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
        g.setIndex(i);
        g.computeVertexNormals();
        g.rotateY(rotation);
        builder.put(g, material, chunk);
      });
    }
  }
  return { quad, tri, poly, flush, stats };
}
