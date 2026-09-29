import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// Flat-shaded quad accumulator for one material, authored in the site frame
// (x = u along King Street, y up, z = v along Bay Street). Every quad owns its
// four vertices and an explicit normal, so a wall of ten thousand window
// reveals costs no smoothing surprises, and winding is corrected against the
// normal it was authored with (a quad given in either order still faces out).
export class Quads {
  constructor() { this.p = []; this.n = []; this.i = []; }
  get triangles() { return this.i.length / 3; }
  quad(A, B, C, D, nrm) {
    const abx = B[0] - A[0], aby = B[1] - A[1], abz = B[2] - A[2];
    const acx = C[0] - A[0], acy = C[1] - A[1], acz = C[2] - A[2];
    const cx = aby * acz - abz * acy, cy = abz * acx - abx * acz, cz = abx * acy - aby * acx;
    const len = Math.hypot(cx, cy, cz);
    if (len < 1e-7) {
      // Degenerate ABC (a collapsed edge): fall back to ACD before dropping the quad.
      const adx = D[0] - A[0], ady = D[1] - A[1], adz = D[2] - A[2];
      if (Math.hypot(acy * adz - acz * ady, acz * adx - acx * adz, acx * ady - acy * adx) < 1e-7) return;
    }
    const flip = cx * nrm[0] + cy * nrm[1] + cz * nrm[2] < 0;
    const o = this.p.length / 3;
    this.p.push(A[0], A[1], A[2], B[0], B[1], B[2], C[0], C[1], C[2], D[0], D[1], D[2]);
    for (let k = 0; k < 4; k++) this.n.push(nrm[0], nrm[1], nrm[2]);
    if (flip) this.i.push(o, o + 2, o + 1, o, o + 3, o + 2); else this.i.push(o, o + 1, o + 2, o, o + 2, o + 3);
  }
  // Axis-aligned box from min/max corners; all six faces.
  box(x0, y0, z0, x1, y1, z1) {
    this.quad([x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [0, 0, -1]);
    this.quad([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1]);
    this.quad([x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0], [-1, 0, 0]);
    this.quad([x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0], [1, 0, 0]);
    this.quad([x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1], [0, 1, 0]);
    this.quad([x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [0, -1, 0]);
  }
  // Flat polygon (u, v) at height y, facing up or down, triangulated by three.
  cap(poly, y, up = true) {
    const shape = new THREE.Shape(poly.map(([u, v]) => new THREE.Vector2(u, -v)));
    const g = new THREE.ShapeGeometry(shape); // +Z facing; rotateX(-90) maps (x, y) -> (x, z=-y): u stays x, v = z
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position, idx = g.index ? Array.from(g.index.array) : Array.from({ length: pos.count }, (_, k) => k);
    const o = this.p.length / 3;
    for (let k = 0; k < pos.count; k++) { this.p.push(pos.getX(k), y, pos.getZ(k)); this.n.push(0, up ? 1 : -1, 0); }
    for (let k = 0; k < idx.length; k += 3) {
      const a = idx[k], b = idx[k + 1], c = idx[k + 2];
      // Wind each triangle against the normal it was given rather than trusting the triangulator's orientation.
      const cy = (pos.getZ(b) - pos.getZ(a)) * (pos.getX(c) - pos.getX(a)) - (pos.getX(b) - pos.getX(a)) * (pos.getZ(c) - pos.getZ(a));
      const facesUp = cy > 0;
      if (facesUp === up) this.i.push(o + a, o + b, o + c); else this.i.push(o + a, o + c, o + b);
    }
    g.dispose();
  }
  // Rotate the authored frame about +Y by `phi` (world = rotateY(phi) of authoring), then hand over a geometry.
  toGeometry(phi) {
    const c = Math.cos(phi), s = Math.sin(phi), n = this.p.length / 3;
    const pos = new Float32Array(this.p.length), nor = new Float32Array(this.n.length);
    for (let k = 0; k < n; k++) {
      const x = this.p[3 * k], y = this.p[3 * k + 1], z = this.p[3 * k + 2];
      pos[3 * k] = x * c + z * s; pos[3 * k + 1] = y; pos[3 * k + 2] = -x * s + z * c;
      const nx = this.n[3 * k], ny = this.n[3 * k + 1], nz = this.n[3 * k + 2];
      nor[3 * k] = nx * c + nz * s; nor[3 * k +1] = ny; nor[3 * k + 2] = -nx * s + nz * c;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
    g.setIndex(new THREE.BufferAttribute(n > 65535 ? Uint32Array.from(this.i) : Uint16Array.from(this.i), 1));
    // Weld vertices that share position AND normal: the corners of a lattice on one plane are
    // used by up to four cells, so this removes most of the duplicated wall vertices.
    const welded = mergeVertices(g, 1e-4);
    g.dispose();
    return welded;
  }
}

// One accumulator per material name, created on first use.
export class Meshes {
  constructor() { this.by = new Map(); }
  get(name) { if (!this.by.has(name)) this.by.set(name, new Quads()); return this.by.get(name); }
  [Symbol.iterator]() { return this.by.entries(); }
  get triangles() { let t = 0; for (const q of this.by.values()) t += q.triangles; return t; }
}

// Deterministic 0..1 hash, so lit windows are stable across builds.
export function hash01(a, b = 0, c = 0) {
  let h = (Math.imul(a + 1, 374761393) + Math.imul(b + 7, 668265263) + Math.imul(c + 13, 2246822519)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

// Split an indexed geometry into pieces of at most `limit` vertices, in triangle order, so each
// piece can use 16-bit indices. Triangles never straddle pieces; vertices used by two pieces are copied.
export function splitByVertices(g, limit) {
  const pos = g.attributes.position, nor = g.attributes.normal, idx = g.index.array;
  if (pos.count <= limit) return [g];
  const out = [];
  let map = new Map(), P = [], N = [], I = [];
  const flush = () => {
    if (!I.length) return;
    const piece = new THREE.BufferGeometry();
    piece.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    piece.setAttribute('normal', new THREE.Float32BufferAttribute(N, 3));
    piece.setIndex(I);
    out.push(piece); map = new Map(); P = []; N = []; I = [];
  };
  for (let t = 0; t < idx.length; t += 3) {
    let fresh = 0;
    for (let k = 0; k < 3; k++) if (!map.has(idx[t + k])) fresh++;
    if (map.size + fresh > limit) flush();
    for (let k = 0; k < 3; k++) {
      const v = idx[t + k];
      if (!map.has(v)) { map.set(v, P.length / 3); P.push(pos.getX(v), pos.getY(v), pos.getZ(v)); N.push(nor.getX(v), nor.getY(v), nor.getZ(v)); }
      I.push(map.get(v));
    }
  }
  flush(); g.dispose();
  return out;
}
