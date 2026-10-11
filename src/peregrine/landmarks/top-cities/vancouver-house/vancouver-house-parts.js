import * as THREE from 'three';
import { SPEC } from './config.js';

const angle = SPEC.planAngle * Math.PI / 180;
export const xyz = (u, y, v) => [u * Math.cos(angle) - v * Math.sin(angle), y, u * Math.sin(angle) + v * Math.cos(angle)];
export const uv = (x, z) => [x * Math.cos(angle) + z * Math.sin(angle), -x * Math.sin(angle) + z * Math.cos(angle)];
export const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
export const area = p => p.reduce((a, v, i) => { const n = p[(i + 1) % p.length]; return a + v[0] * n[1] - n[0] * v[1]; }, 0) / 2;
export const ccw = p => area(p) < 0 ? [...p].reverse() : p;

// The diagonal eastern edge opens into two perpendicular faces above the bridge.
export function plate(y) {
  const t = Math.max(0, Math.min(1, (y - 30) / 85));
  const g = t * t * (3 - 2 * t), w = SPEC.width / 2, d = SPEC.depth / 2;
  const p = [[-w, -d], [w, -d], [w, -d + g * 2 * d], [-w + g * 2 * w, d], [-w, d]];
  return p.filter((v, i) => Math.hypot(v[0] - p[(i + p.length - 1) % p.length][0], v[1] - p[(i + p.length - 1) % p.length][1]) > 0.01);
}

export function inset(p, distance) {
  const lines = p.map((a, i) => {
    const b = p[(i + 1) % p.length], dx = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dx, dz);
    return { a: [a[0] - dz / l * distance, a[1] + dx / l * distance], d: [dx, dz] };
  });
  const intersections = lines.map((current, i) => {
    const prev = lines[(i + lines.length - 1) % lines.length];
    const cross = (a, b) => a[0] * b[1] - a[1] * b[0];
    const t = cross([current.a[0] - prev.a[0], current.a[1] - prev.a[1]], current.d) / cross(prev.d, current.d);
    return [prev.a[0] + prev.d[0] * t, prev.a[1] + prev.d[1] * t];
  });
  const convex = p.every((a, i) => {
    const b = p[(i + 1) % p.length], c = p[(i + 2) % p.length];
    return (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]) >= -1e-8;
  });
  if (!convex) return intersections;
  // Very short emerging east faces vanish under the inset. Clip half-planes
  // first, then project their obsolete corner intersections onto the valid
  // inset, retaining correspondence for the balcony/glazing face generation.
  let clipped = [...p];
  for (const line of lines) {
    const side = q => line.d[0] * (q[1] - line.a[1]) - line.d[1] * (q[0] - line.a[0]);
    const next = [];
    for (let i = 0; i < clipped.length; i++) {
      const a = clipped[i], b = clipped[(i + 1) % clipped.length], da = side(a), db = side(b);
      if (da >= -1e-8) next.push(a);
      if ((da >= 0) !== (db >= 0)) next.push(mix(a, b, da / (da - db)));
    }
    clipped = next;
  }
  return intersections.map(q => {
    if (lines.every(line => line.d[0] * (q[1] - line.a[1]) - line.d[1] * (q[0] - line.a[0]) >= -1e-8)) return q;
    let closest, distance = Infinity;
    for (let i = 0; i < clipped.length; i++) {
      const a = clipped[i], b = clipped[(i + 1) % clipped.length], d = [b[0] - a[0], b[1] - a[1]], len2 = d[0] ** 2 + d[1] ** 2;
      const t = len2 ? Math.max(0, Math.min(1, ((q[0] - a[0]) * d[0] + (q[1] - a[1]) * d[1]) / len2)) : 0;
      const point = mix(a, b, t), length = Math.hypot(point[0] - q[0], point[1] - q[1]);
      if (length < distance) { closest = point; distance = length; }
    }
    return closest;
  });
}

export function clipU(p, value, side) {
  const out = [];
  for (let i = 0; i < p.length; i++) {
    const a = p[i], b = p[(i + 1) % p.length], ia = side * (a[0] - value) >= 0, ib = side * (b[0] - value) >= 0;
    if (ia) out.push(a);
    if (ia !== ib) out.push(mix(a, b, (value - a[0]) / (b[0] - a[0])));
  }
  return ccw(out);
}

// Separate face vertices preserve flat normals, with explicit outward winding.
export class Faces {
  positions = []; indices = [];
  face(points, normal) {
    const q = points.map(p => new THREE.Vector3(...xyz(p[0], p[1], p[2])));
    const n = new THREE.Vector3(...xyz(normal[0], normal[1], normal[2]));
    const c = new THREE.Vector3().crossVectors(q[1].clone().sub(q[0]), q[2].clone().sub(q[0]));
    if (c.lengthSq() < 1e-10) return;
    if (c.dot(n) < 0) q.reverse();
    const start = this.positions.length / 3;
    q.forEach(v => this.positions.push(...v.toArray()));
    for (let i = 1; i < q.length - 1; i++) this.indices.push(start, start + i, start + i + 1);
  }
  flat(p, y, side = 1) {
    const triangles = THREE.ShapeUtils.triangulateShape(p.map(v => new THREE.Vector2(...v)), []).filter(([a, b, c]) => Math.abs((p[b][0] - p[a][0]) * (p[c][1] - p[a][1]) - (p[b][1] - p[a][1]) * (p[c][0] - p[a][0])) > 1e-8);
    const start = this.positions.length / 3;
    // A planar cap shares vertices: identical normals, no triangle-by-triangle
    // duplication. This matters for the far GLB's download budget.
    const remap = new Map();
    for (const i of new Set(triangles.flat())) { remap.set(i, start + remap.size); this.positions.push(...xyz(p[i][0], y, p[i][1])); }
    for (const [a, b, c] of triangles) {
      const cross = (p[b][0] - p[a][0]) * (p[c][1] - p[a][1]) - (p[b][1] - p[a][1]) * (p[c][0] - p[a][0]);
      this.indices.push(remap.get(a), remap.get(cross * side > 0 ? c : b), remap.get(cross * side > 0 ? b : c));
    }
  }
  wall(a, b, bottom, top, normal) {
    this.face([[a[0], bottom, a[1]], [b[0], bottom, b[1]], [b[0], top, b[1]], [a[0], top, a[1]]], [normal[0], 0, normal[1]]);
  }
  geometry() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.positions, 3));
    g.setIndex(this.indices); g.computeVertexNormals(); return g;
  }
}
