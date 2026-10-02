import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// Flat-shaded polygon accumulator, one per material. Every face owns its vertices and an explicit normal;
// winding is corrected against that normal, so a polygon given in either order still faces out.
export class Faces {
  constructor() { this.p = []; this.n = []; this.i = []; }
  get triangles() { return this.i.length / 3; }
  // Convex polygon (3D vertices) fanned from its first vertex; degenerate triangles are dropped.
  poly(verts, nrm) {
    const base = this.p.length / 3;
    let kept = 0;
    const tris = [];
    for (let k = 1; k + 1 < verts.length; k++) {
      const A = verts[0], B = verts[k], C = verts[k + 1];
      const abx = B[0] - A[0], aby = B[1] - A[1], abz = B[2] - A[2], acx = C[0] - A[0], acy = C[1] - A[1], acz = C[2] - A[2];
      const cx = aby * acz - abz * acy, cy = abz * acx - abx * acz, cz = abx * acy - aby * acx;
      if (Math.hypot(cx, cy, cz) < 1e-6) continue;
      tris.push(cx * nrm[0] + cy * nrm[1] + cz * nrm[2] < 0 ? [0, k + 1, k] : [0, k, k + 1]);
      kept++;
    }
    if (!kept) return;
    for (const v of verts) { this.p.push(v[0], v[1], v[2]); this.n.push(nrm[0], nrm[1], nrm[2]); }
    for (const t of tris) this.i.push(base + t[0], base + t[1], base + t[2]);
  }
  quad(A, B, C, D, nrm) { this.poly([A, B, C, D], nrm); }
  // Polygon in plan (x, z), concave allowed, lifted onto y = yAt(x, z) with a constant normal.
  plane(plan, yAt, nrm) {
    const g = new THREE.ShapeGeometry(new THREE.Shape(plan.map(([x, z]) => new THREE.Vector2(x, -z))));
    const pos = g.attributes.position, idx = g.index.array, base = this.p.length / 3;
    for (let k = 0; k < pos.count; k++) { const x = pos.getX(k), z = -pos.getY(k); this.p.push(x, yAt(x, z), z); this.n.push(nrm[0], nrm[1], nrm[2]); }
    for (let t = 0; t < idx.length; t += 3) {
      const a = idx[t], b = idx[t + 1], c = idx[t + 2];
      const ax = pos.getX(a), az = -pos.getY(a), bx = pos.getX(b), bz = -pos.getY(b), cx = pos.getX(c), cz = -pos.getY(c);
      // The plan is seen from above (+Y): the triangle faces up when (b - a) x (c - a) has a positive y component.
      const up = (bz - az) * (cx - ax) - (bx - ax) * (cz - az) > 0;
      if (up === nrm[1] > 0) this.i.push(base + a, base + b, base + c); else this.i.push(base + a, base + c, base + b);
    }
    g.dispose();
  }
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

// Deterministic 0..1 hash so lit windows are stable across builds.
export function hash01(a, b = 0, c = 0) {
  let h = (Math.imul(a + 1, 374761393) + Math.imul(b + 7, 668265263) + Math.imul(c + 13, 2246822519)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}
