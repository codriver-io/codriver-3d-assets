import * as THREE from 'three';

// Small mesh kit for the Studio Bell model. Faces are oriented toward a point you name, so no winding is checked by
// hand. `Soup` is flat-shaded (windows, roofs, soffits); `Surf` shares vertices inside each grid and smooths the
// normals, which is what lets a bulging terracotta tower read as a curved vessel.

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

export class Soup {
  constructor() { this.p = []; }
  tri(a, b, c, toward) {
    if (toward && dot(cross(sub(b, a), sub(c, a)), sub(toward, a)) < 0) [b, c] = [c, b];
    this.p.push(...a, ...b, ...c);
  }
  quad(a, b, c, d, toward) { this.tri(a, b, c, toward); this.tri(a, c, d, toward); }
  get empty() { return this.p.length === 0; }
  geometry() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.p, 3));
    g.computeVertexNormals();
    return g;
  }
}

export class Surf {
  constructor() { this.pos = []; this.idx = []; }
  // rows[j][i] is a 3D point; the grid is oriented toward `toward` (a point on the outer side).
  grid(rows, toward) {
    const nj = rows.length, ni = rows[0].length, base = this.pos.length / 3;
    for (const r of rows) for (const p of r) this.pos.push(...p);
    const id = (j, i) => base + j * ni + i;
    let score = 0;
    for (let j = 0; j < nj - 1; j++) for (let i = 0; i < ni - 1; i++) {
      const a = rows[j][i], b = rows[j][i + 1], c = rows[j + 1][i + 1];
      const n = cross(sub(b, a), sub(c, a));
      score += dot(n, sub(toward, a)) >= 0 ? 1 : -1;
    }
    const flip = score < 0;
    for (let j = 0; j < nj - 1; j++) for (let i = 0; i < ni - 1; i++) {
      const a = id(j, i), b = id(j, i + 1), c = id(j + 1, i + 1), d = id(j + 1, i);
      if (flip) this.idx.push(a, c, b, a, d, c); else this.idx.push(a, b, c, a, c, d);
    }
  }
  get empty() { return this.pos.length === 0; }
  geometry() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setIndex(this.idx);
    g.computeVertexNormals();
    return g;
  }
}

export const hash = (a, b, c = 0) => {
  let h = (a * 73856093) ^ (b * 19349663) ^ (c * 83492791);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

// Point in a polygon of [x, z].
export function inPoly(pt, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, zi] = ring[i], [xj, zj] = ring[j];
    if ((zi > pt[1]) !== (zj > pt[1]) && pt[0] < (xj - xi) * (pt[1] - zi) / (zj - zi) + xi) inside = !inside;
  }
  return inside;
}

// Triangles of a polygon (rings of [x, z]); returns [[a, b, c], ...] of [x, z] points.
export function triangulate(outer) {
  const v = (p) => new THREE.Vector2(p[0], p[1]);
  return THREE.ShapeUtils.triangulateShape(outer.map(v), []).map((t) => t.map((i) => outer[i]));
}
