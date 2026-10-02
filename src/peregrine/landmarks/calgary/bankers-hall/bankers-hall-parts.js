import * as THREE from 'three';

// Helpers for Bankers Hall: a flat-shaded quad/triangle/cap accumulator (every face carries its own normal, so
// nothing is indexed across hard edges) and small plan helpers.

export const mapArea = (ring) => { let a = 0; for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) a += ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1]; return a / 2; };
// Clockwise seen from above (x east, z south): positive map area.
export const clockwise = (ring) => (mapArea(ring) > 0 ? ring : [...ring].reverse());
export const outward = (a, b) => { const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [(b[1] - a[1]) / l, -(b[0] - a[0]) / l]; }; // of a clockwise ring
export const inside = (ring, x, z) => { let h = false; for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) { const [ax, az] = ring[j], [bx, bz] = ring[i]; if ((az > z) !== (bz > z) && x < (bx - ax) * (z - az) / (bz - az) + ax) h = !h; } return h; };
export const hash = (a, b, c) => {
  let h = (Math.imul(a, 374761393) + Math.imul(b, 668265263) + Math.imul(c, 1274126177)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

export function meshBuilder() {
  const pos = [], nor = [], idx = [];
  const push = (pts, n) => { const base = pos.length / 3; for (const p of pts) { pos.push(...p); nor.push(...n); } return base; };
  const normal = (a, b, c) => {
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
    const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx, l = Math.hypot(nx, ny, nz);
    return l < 1e-9 ? null : [nx / l, ny / l, nz / l];
  };
  // a, b, c counter-clockwise seen from the visible side.
  const tri = (a, b, c) => { const n = normal(a, b, c); if (!n) return; const base = push([a, b, c], n); idx.push(base, base + 1, base + 2); };
  const quad = (a, b, c, d) => {
    const n = normal(a, b, c) || normal(a, c, d); if (!n) return;
    const base = push([a, b, c, d], n); idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
  };
  // Same, but the winding is flipped when the face would look away from `hint` (a direction towards the viewer).
  const facing = (hint, ...p) => {
    const n = normal(p[0], p[1], p[2]) || (p.length > 3 ? normal(p[0], p[2], p[3]) : null); if (!n) return;
    const flip = n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0;
    const q = flip ? [...p].reverse() : p;
    if (q.length === 3) tri(...q); else quad(...q);
  };
  // Horizontal polygon [x, z] at height y facing up (or down), optionally with holes.
  const cap = (contour, y, holes = [], up = true) => {
    const c = contour.map((p) => new THREE.Vector2(p[0], p[1])), h = holes.map((r) => r.map((p) => new THREE.Vector2(p[0], p[1])));
    const faces = THREE.ShapeUtils.triangulateShape(c, h), all = [...c, ...h.flat()];
    for (const [i, j, k] of faces) {
      const A = [all[i].x, y, all[i].y], B = [all[j].x, y, all[j].y], D = [all[k].x, y, all[k].y];
      const ny = (B[2] - A[2]) * (D[0] - A[0]) - (B[0] - A[0]) * (D[2] - A[2]);
      if ((ny > 0) === up) tri(A, B, D); else tri(A, D, B);
    }
  };
  const geometry = () => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
    g.setIndex(idx);
    return g;
  };
  return { tri, quad, facing, cap, geometry, count: () => idx.length / 3 };
}
