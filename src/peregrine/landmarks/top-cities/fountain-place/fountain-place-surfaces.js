import * as THREE from 'three';

export const world = ([u, y, v]) => [(u - v) / Math.SQRT2, y, (u + v) / Math.SQRT2];

// Clip a convex polygon in its face coordinates. Adjacent cells tile the shell,
// rather than covering a backing plane: no coplanar or far-LOD overlays.
function clip(poly, axis, value, sign) {
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    const da = sign * (a[axis] - value), db = sign * (b[axis] - value);
    if (da >= -1e-9) out.push(a);
    if ((da > 1e-9 && db < -1e-9) || (da < -1e-9 && db > 1e-9)) {
      const t = da / (da - db); out.push(a.map((n, j) => n + t * (b[j] - n)));
    }
  }
  return out;
}
function rect(poly, x0, x1, y0, y1) {
  return clip(clip(clip(clip(poly, 0, x0, 1), 0, x1, -1), 1, y0, 1), 1, y1, -1);
}

export function shellBuilder(b) {
  const batches = new Map(); let panes = 0;
  function emit(material, pts, normal) {
    if (pts.length < 3) return;
    const vectors = pts.map(p => new THREE.Vector3(...world(p)));
    const desired = new THREE.Vector3(...world(normal));
    const n = new THREE.Vector3().crossVectors(vectors[1].clone().sub(vectors[0]), vectors[2].clone().sub(vectors[0]));
    if (n.lengthSq() < 1e-12) return;
    if (n.dot(desired) < 0) vectors.reverse();
    n.copy(desired).normalize();
    if (!batches.has(material)) batches.set(material, { positions: [], normals: [], indices: [] });
    const batch = batches.get(material), start = batch.positions.length / 3;
    for (const v of vectors) { batch.positions.push(...v.toArray()); batch.normals.push(...n.toArray()); }
    for (let i = 1; i < vectors.length - 1; i++) batch.indices.push(start, start + i, start + i + 1);
  }
  function face(points, normal, near, material = 'glass', salt = 0) {
    const variable = Math.abs(normal[2]) > 1e-6 ? 0 : 2;
    const fixed = variable === 0 ? 2 : 0;
    const poly = points.map(p => [p[variable], p[1]]);
    const datum = points[0];
    const restore = ([s, y]) => {
      const p = [0, y, 0]; p[variable] = s;
      p[fixed] = datum[fixed] - (normal[variable] * (s - datum[variable]) + normal[1] * (y - datum[1])) / normal[fixed];
      return p;
    };
    const xs = poly.map(p => p[0]), ys = poly.map(p => p[1]);
    const pitchX = near ? 2.15 : 6.45, pitchY = near ? 3.45 : 6.9;
    const seamX = near ? 0.075 : 0.12, seamY = near ? 0.09 : 0.15;
    const x0 = Math.floor(Math.min(...xs) / pitchX), x1 = Math.ceil(Math.max(...xs) / pitchX);
    const y0 = Math.floor(Math.min(...ys) / pitchY), y1 = Math.ceil(Math.max(...ys) / pitchY);
    const draw = (mat, poly2) => emit(mat, poly2.map(restore), normal);
    for (let row = y0; row < y1; row++) {
      const bottom = row * pitchY, top = bottom + pitchY;
      draw('mullion', rect(poly, x0 * pitchX, x1 * pitchX, bottom, bottom + seamY));
      for (let col = x0; col < x1; col++) {
        const left = col * pitchX, right = left + pitchX;
        draw('mullion', rect(poly, left, left + seamX, bottom + seamY, top));
        const pane = rect(poly, left + seamX, right, bottom + seamY, top);
        if (pane.length >= 3) {
          const lit = material === 'glass' && ((col * 17 + row * 7 + salt * 13) % 37 + 37) % 37 < 3 && bottom < 155 && normal[1] >= 0;
          draw(lit ? 'office' : material, pane); panes++;
        }
      }
    }
  }
  function finish() {
    for (const [material, data] of batches) {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(data.positions, 3));
      g.setAttribute('normal', new THREE.Float32BufferAttribute(data.normals, 3)); g.setIndex(data.indices);
      b.put(g, material);
    }
    return panes;
  }
  return { face, emit, finish };
}
