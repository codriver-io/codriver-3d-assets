import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// Flat-shaded polygon accumulator, one per material. Every face owns its vertices and an explicit normal; winding is corrected against
// that normal, so a polygon given in either order still faces out.
export class Faces {
  constructor() { this.p = []; this.n = []; this.i = []; }
  poly(verts, nrm) {
    const base = this.p.length / 3, tris = [];
    for (let k = 1; k + 1 < verts.length; k++) {
      const A = verts[0], B = verts[k], C = verts[k + 1];
      const abx = B[0] - A[0], aby = B[1] - A[1], abz = B[2] - A[2], acx = C[0] - A[0], acy = C[1] - A[1], acz = C[2] - A[2];
      const cx = aby * acz - abz * acy, cy = abz * acx - abx * acz, cz = abx * acy - aby * acx;
      if (Math.hypot(cx, cy, cz) < 1e-6) continue;
      tris.push(cx * nrm[0] + cy * nrm[1] + cz * nrm[2] < 0 ? [0, k + 1, k] : [0, k, k + 1]);
    }
    if (!tris.length) return;
    for (const v of verts) { this.p.push(v[0], v[1], v[2]); this.n.push(nrm[0], nrm[1], nrm[2]); }
    for (const t of tris) this.i.push(base + t[0], base + t[1], base + t[2]);
  }
  quad(A, B, C, D, nrm) { this.poly([A, B, C, D], nrm); }
  toGeometry() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.p, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.n, 3));
    g.setIndex(this.i);
    const welded = mergeVertices(g, 1e-4);
    g.dispose();
    return welded;
  }
}

export class Meshes {
  constructor() { this.by = new Map(); }
  get(name) { if (!this.by.has(name)) this.by.set(name, new Faces()); return this.by.get(name); }
  [Symbol.iterator]() { return this.by.entries(); }
}

// Deterministic 0..1 hash so the lit windows are the same in every build.
export function hash01(a, b = 0, c = 0) {
  let h = (Math.imul(a + 1, 374761393) + Math.imul(b + 7, 668265263) + Math.imul(c + 13, 2246822519)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

// A plan frame: (u, v) metres on a grid turned `bearing` degrees clockwise from north (u runs along that bearing, v 90 degrees clockwise of it)
// to world (x east, z south). A proper rotation, so u and v behave like x and z.
export function planFrame(bearing) {
  const s = Math.sin(bearing * Math.PI / 180), c = Math.cos(bearing * Math.PI / 180);
  return {
    bearing,
    xz: (u, v) => [u * s + v * c, -u * c + v * s],
    dir: (du, dv) => [du * s + dv * c, 0, -du * c + dv * s], // a unit vector as a 3D direction (y = 0)
    angle: Math.PI / 2 - bearing * Math.PI / 180, // assetBuilder.box rotateY angle that turns local x onto the u axis
  };
}

// One wall of a plan rectangle (or any straight run) in its own coordinates: s along the wall from `a`, y up, r outward.
export function wallFrame(frame, a, b) {
  const du = b[0] - a[0], dv = b[1] - a[1], L = Math.hypot(du, dv), t = [du / L, dv / L], n = [t[1], -t[0]];
  const P = (s, y, r) => { const [x, z] = frame.xz(a[0] + t[0] * s + n[0] * r, a[1] + t[1] * s + n[1] * r); return [x, y, z]; };
  return { L, P, N: frame.dir(n[0], n[1]), T: frame.dir(t[0], t[1]), t, n };
}
