// Scotiabank Saddledome: the saddle-roof maths and the small lofting helpers the geometry is built from.
// Frame: +X east, +Y up, +Z south, origin the centre of the arena circle. `phi` is measured in degrees
// CLOCKWISE (seen from above) from the high north-east end of the roof, so phi 0 is the north-east end,
// 90 the south-east low side (the side with the lettering), 180 the south-west end (the west entrance) and
// 270 the north-west low side.
import * as THREE from 'three';

const RAD = Math.PI / 180;
export const AXIS = 61; // bearing of the north-east high end (the south-west end is 241, from the mapped entrance bulge)

// Published: the edge ring lies on a 67.7 m radius sphere; the roof's centre is 14 m below the higher and 6 m above
// the lower point of the ring; the ring is made of 4.3 m wide precast elements. Estimated: ZC (the 89 ft figure
// read as the shell's middle), the 1.5 m ring depth.
export const R0 = 67.7, RISE = 14, DIP = 6, ZC = 27.1;
export const RING_WIDTH = 4.3, RING_DEPTH = 1.5;

// The concourse and facade bands (estimated from photographs).
export const DECK_R = 69.5, SLAB_BOTTOM = 5.2, DECK_Y = 6.8, BAND_R = 66.5, LEDGE_Y = 14.6;
export const BASE_R = 62.5, WALL_R0 = 61.0, LEAN = 0.07;

export const bearing = (phi) => (AXIS + phi) * RAD;
export const radial = (phi) => { const b = bearing(phi); return [Math.sin(b), -Math.cos(b)]; };
export const tangent = (phi) => { const b = bearing(phi); return [Math.cos(b), Math.sin(b)]; };
export const plan = (rho, phi) => { const [x, z] = radial(phi); return [rho * x, rho * z]; };
/** A point `a` out along the radial of `phi` and `t` along its tangent (a straight local frame, for boxes). */
export const local = (a, t, phi) => { const [rx, rz] = radial(phi), [tx, tz] = tangent(phi); return [a * rx + t * tx, a * rz + t * tz]; };

/** The saddle: height of the roof's top surface over plan polar (rho, phi). */
export const roofZ = (rho, phi) => { const p = phi * RAD; return ZC + (rho / R0) ** 2 * (RISE * Math.cos(p) ** 2 - DIP * Math.sin(p) ** 2); };
/** Plan radius of the edge ring: where the saddle meets the 67.7 m sphere centred 4 m above the roof's middle. */
export const ringR = (phi) => Math.sqrt(R0 * R0 - (10 * Math.cos(2 * phi * RAD)) ** 2);
export const ringTop = (phi) => roofZ(ringR(phi), phi);
export const ringBottom = (phi) => ringTop(phi) - RING_DEPTH;
export const soffitZ = (rho, phi) => roofZ(rho, phi) - RING_DEPTH;
/** Radius of the leaning upper wall at height y. */
export const wallR = (y) => WALL_R0 + LEAN * (y - LEDGE_Y);
/** Where the upper wall meets the underside of the roof ring. */
export function wallTop(phi) {
  let y = ringBottom(phi);
  for (let i = 0; i < 5; i++) y = soffitZ(wallR(y), phi);
  return { y, r: wallR(y) };
}

/**
 * Height of the soffit (the underside of the roof ring) over the plan point (x, z), as the geometry lofts it:
 * straight from the wall top out to the ring's outer edge, and level with the ring's lower edge beyond it.
 */
export function soffitAt(x, z) {
  const rho = Math.hypot(x, z), phi = ((((Math.atan2(x, -z) / RAD) - AXIS) % 360) + 360) % 360;
  const w = wallTop(phi), R = ringR(phi), r = Math.min(Math.max(rho, w.r), R);
  return w.y + ((r - w.r) / (R - w.r)) * (ringBottom(phi) - w.y);
}

const vec = (p) => new THREE.Vector3(p[0], p[1], p[2]);

function orientAndBuild(pos, idx, want) {
  // flip the winding when the first non-degenerate triangle faces away from the wanted direction
  for (let k = 0; k < idx.length; k += 3) {
    const a = vec(pos.slice(idx[k] * 3, idx[k] * 3 + 3)), b = vec(pos.slice(idx[k + 1] * 3, idx[k + 1] * 3 + 3)), c = vec(pos.slice(idx[k + 2] * 3, idx[k + 2] * 3 + 3));
    const n = b.sub(a).cross(c.sub(a));
    if (n.lengthSq() < 1e-10) continue;
    const w = typeof want === 'function' ? want(Math.floor(k / 6)) : want;
    if (n.dot(vec(w)) < 0) for (let j = 0; j < idx.length; j += 3) { const t = idx[j + 1]; idx[j + 1] = idx[j + 2]; idx[j + 2] = t; }
    break;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/**
 * A band between two profile curves A(phi) and B(phi) (each returns [x, y, z]) sampled at `phis` (degrees).
 * `closed` wraps the last sample to the first (a full ring). `want` is a direction the faces must face.
 */
export function strip(phis, A, B, want, closed = false) {
  const n = phis.length, pos = [];
  for (const p of phis) pos.push(...A(p));
  for (const p of phis) pos.push(...B(p));
  const idx = [], m = closed ? n : n - 1;
  for (let i = 0; i < m; i++) { const j = (i + 1) % n; idx.push(i, j, n + j, i, n + j, n + i); }
  return orientAndBuild(pos, idx, (seg) => (typeof want === 'function' ? want(phis[Math.min(seg, n - 1)]) : want));
}

/** Evenly spaced samples around the full circle, `n` of them (a multiple of 16 keeps the piers on samples). */
export const ring = (n) => Array.from({ length: n }, (_, i) => (360 * i) / n);
/** Evenly spaced samples from a to b inclusive. */
export const span = (a, b, n) => Array.from({ length: n + 1 }, (_, i) => a + ((b - a) * i) / n);

/** Flat faces (3 or 4 points each, with their own wanted direction): hard-edged, one geometry. */
export function faces(list) {
  const pos = [], idx = [];
  const perFace = [];
  for (const { p, w } of list) {
    const base = pos.length / 3;
    for (const q of p) pos.push(...q);
    const tris = p.length === 4 ? [base, base + 1, base + 2, base, base + 2, base + 3] : [base, base + 1, base + 2];
    // orient this face
    const a = vec(p[0]), b = vec(p[1]), c = vec(p[2]);
    let n = b.clone().sub(a).cross(c.clone().sub(a));
    if (n.lengthSq() < 1e-10 && p.length === 4) n = vec(p[2]).sub(a).cross(vec(p[3]).sub(a));
    if (n.dot(vec(w)) < 0) for (let j = 0; j < tris.length; j += 3) { const t = tris[j + 1]; tris[j + 1] = tris[j + 2]; tris[j + 2] = t; }
    idx.push(...tris);
    perFace.push(tris.length / 3);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/** The saddle's top surface: a polar grid of `n` spokes and `rings` rings out to the edge ring. */
export function roofSurface(n, rings) {
  const pos = [0, ZC, 0], idx = [];
  for (let j = 1; j <= rings; j++) {
    for (let i = 0; i < n; i++) {
      const phi = (360 * i) / n, rho = (ringR(phi) * j) / rings, [x, z] = plan(rho, phi);
      pos.push(x, roofZ(rho, phi), z);
    }
  }
  for (let i = 0; i < n; i++) idx.push(0, 1 + i, 1 + ((i + 1) % n));
  for (let j = 1; j < rings; j++) {
    for (let i = 0; i < n; i++) {
      const i1 = (i + 1) % n, a = 1 + (j - 1) * n + i, b = 1 + (j - 1) * n + i1, c = 1 + j * n + i, d = 1 + j * n + i1;
      idx.push(a, c, d, a, d, b);
    }
  }
  return orientAndBuild(pos, idx, [0, 1, 0]);
}

/** The height of a faceted shell geometry at plan (x, z) (ray down onto it); the shell must cover the point. */
export function shellHeight(geometry) {
  const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }), mesh = new THREE.Mesh(geometry, material);
  const ray = new THREE.Raycaster(), origin = new THREE.Vector3(), down = new THREE.Vector3(0, -1, 0);
  const at = (x, z) => {
    ray.set(origin.set(x, 200, z), down);
    const hit = ray.intersectObject(mesh)[0];
    if (!hit) throw new Error(`no roof shell at plan (${x.toFixed(1)}, ${z.toFixed(1)})`);
    return hit.point.y;
  };
  at.dispose = () => { material.dispose(); geometry.dispose(); };
  return at;
}

/**
 * Seam strips on the roof along its two principal directions: `along` are offsets v (m) of the strips that run
 * toward the high ends (constant v, the arching direction), `across` offsets u of those that run across them
 * (constant u, the sagging direction). Each is a flat ribbon `width` wide, sampled every ~`step` m, that follows
 * the faceted shell (`height(x, z)`) at `lift[0]` (along) or `lift[1]` (across) above it, so two seams never share
 * a plane where they cross. Returns one geometry per strip.
 */
export function seams(height, { along, across, width = 0.8, step = 5, lift = [0.1, 0.16], limit = 66.4 }) {
  const out = [];
  for (const [family, list] of [[0, along], [1, across]]) {
    for (const c of list) {
      const T = Math.sqrt(limit * limit - c * c), n = Math.max(2, Math.round((2 * T) / step));
      const edge = (side) => (i) => {
        const t = -T + (2 * T * i) / n, [x, z] = family === 0 ? local(t, c + side * width / 2, 0) : local(c + side * width / 2, t, 0);
        return [x, height(x, z) + lift[family], z];
      };
      out.push(strip(Array.from({ length: n + 1 }, (_, i) => i), edge(-1), edge(1), [0, 1, 0]));
    }
  }
  return out;
}

/** A leaning pier: a prism on the upper wall at `phi`, `w` wide, from y0 up into the roof ring's underside. */
export function pier(phi, w, y0, outer = 1.3, buried = 0.3) {
  // the top runs 0.1 m into the roof ring's underside, above the pier's outer face
  let y1 = wallTop(phi).y;
  y1 = Math.max(y1, soffitZ(wallR(y1) + outer, phi)) + 0.1;
  const [rx, rz] = radial(phi), [tx, tz] = tangent(phi);
  const P = (rho, s, y) => [rho * rx + s * tx, y, rho * rz + s * tz];
  const ri0 = wallR(y0) - buried, ro0 = wallR(y0) + outer, ri1 = wallR(y1) - buried, ro1 = wallR(y1) + outer, h = w / 2;
  return faces([
    { p: [P(ro0, -h, y0), P(ro0, h, y0), P(ro1, h, y1), P(ro1, -h, y1)], w: [rx, 0, rz] },
    { p: [P(ri0, h, y0), P(ro0, h, y0), P(ro1, h, y1), P(ri1, h, y1)], w: [tx, 0, tz] },
    { p: [P(ri0, -h, y0), P(ro0, -h, y0), P(ro1, -h, y1), P(ri1, -h, y1)], w: [-tx, 0, -tz] },
  ]);
}

/** A box in a straight local frame at `phi` (a out along the radial, t along the tangent) with an optional sloped top. */
export function slab(phi, a0, a1, t0, t1, y0, y1, rise = 0) {
  const [rx, rz] = radial(phi), [tx, tz] = tangent(phi);
  const P = (a, t, y) => [a * rx + t * tx, y, a * rz + t * tz];
  const wall = [
    { p: [P(a1, t0, y0), P(a1, t1, y0), P(a1, t1, y1), P(a1, t0, y1)], w: [rx, 0, rz] },
    { p: [P(a0, t0, y0), P(a0, t1, y0), P(a0, t1, y1 + rise), P(a0, t0, y1 + rise)], w: [-rx, 0, -rz] },
    { p: [P(a0, t1, y0), P(a1, t1, y0), P(a1, t1, y1), P(a0, t1, y1 + rise)], w: [tx, 0, tz] },
    { p: [P(a0, t0, y0), P(a1, t0, y0), P(a1, t0, y1), P(a0, t0, y1 + rise)], w: [-tx, 0, -tz] },
  ];
  const top = [{ p: [P(a0, t0, y1 + rise), P(a1, t0, y1), P(a1, t1, y1), P(a0, t1, y1 + rise)], w: [0, 1, 0] }];
  return { wall: faces(wall), top: faces(top) };
}

// A compact 5 x 7 pixel face for the two words of the sign: S c o t i a b n k d l e m, rows top to bottom.
const GLYPH = {
  S: ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'],
  c: ['.....', '.....', '.###.', '#...#', '#....', '#...#', '.###.'],
  o: ['.....', '.....', '.###.', '#...#', '#...#', '#...#', '.###.'],
  t: ['..#..', '..#..', '#####', '..#..', '..#..', '..#..', '...##'],
  i: ['..#..', '.....', '..#..', '..#..', '..#..', '..#..', '..#..'],
  a: ['.....', '.....', '.###.', '....#', '.####', '#...#', '.####'],
  b: ['#....', '#....', '####.', '#...#', '#...#', '#...#', '####.'],
  n: ['.....', '.....', '####.', '#...#', '#...#', '#...#', '#...#'],
  k: ['#....', '#....', '#..#.', '#.#..', '##...', '#.#..', '#..#.'],
  d: ['....#', '....#', '.####', '#...#', '#...#', '#...#', '.####'],
  l: ['..#..', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..'],
  e: ['.....', '.....', '.###.', '#...#', '#####', '#....', '.###.'],
  m: ['.....', '.....', '##.#.', '#.#.#', '#.#.#', '#.#.#', '#.#.#'],
};
/** Pixel-font quads for `text`: returns face descriptors with `at(u, v)` mapping text coordinates (metres) to 3D. */
export function textFaces(text, px, at, want) {
  const out = [];
  let cursor = 0;
  for (const ch of text) {
    const rows = GLYPH[ch];
    for (let r = 0; r < 7; r++) {
      let c = 0;
      while (c < 5) {
        if (rows[r][c] !== '#') { c++; continue; }
        let e = c; while (e + 1 < 5 && rows[r][e + 1] === '#') e++;
        const u0 = cursor + c * px, u1 = cursor + (e + 1) * px, v1 = (7 - r) * px, v0 = (6 - r) * px;
        out.push({ p: [at(u0, v0), at(u1, v0), at(u1, v1), at(u0, v1)], w: want(u0) });
        c = e + 1;
      }
    }
    cursor += 6.4 * px;
  }
  return { faces: out, width: cursor - 1.4 * px };
}
