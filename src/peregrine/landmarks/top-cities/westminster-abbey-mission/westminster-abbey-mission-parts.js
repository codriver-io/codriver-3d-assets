import * as THREE from 'three';

// Geometry helpers for the Abbey. Everything goes through assetBuilder.put (one mesh per material).
// Rings are [x, z] in model metres (+x east, +z south); y is up.

export function signedArea(ring) {
  let s = 0;
  for (let i = 0; i < ring.length; i++) { const [x0, z0] = ring[i], [x1, z1] = ring[(i + 1) % ring.length]; s += x0 * z1 - x1 * z0; }
  return s / 2;
}

// Outward unit normal of edge i in the x-z plane.
export function edgeNormal(ring, i) {
  const [x0, z0] = ring[i], [x1, z1] = ring[(i + 1) % ring.length];
  const dx = x1 - x0, dz = z1 - z0, l = Math.hypot(dx, dz) || 1;
  return signedArea(ring) > 0 ? [dz / l, -dx / l] : [-dz / l, dx / l];
}

// Ring pulled in by d (negative pushes out) with mitred corners; the miter is clamped.
export function insetRing(ring, d) {
  const n = ring.length, out = [];
  for (let i = 0; i < n; i++) {
    const p = ring[i], a = edgeNormal(ring, (i + n - 1) % n), b = edgeNormal(ring, i);
    const mx = a[0] + b[0], mz = a[1] + b[1];
    const k = 1 + a[0] * b[0] + a[1] * b[1];
    const f = Math.min(d / Math.max(k, 0.35), d * 2.2);
    out.push([p[0] - mx * f, p[1] - mz * f]);
  }
  return out;
}

export function lancetPts(w, h, seg) {
  const R = w * 1.05, a = Math.acos(Math.min(0.999, (R - w / 2) / R)), rise = R * Math.sin(a), spring = Math.max(0, h - rise);
  const pts = [[-w / 2, 0], [w / 2, 0]];
  if (spring > 0.02) pts.push([w / 2, spring]);
  for (let i = 1; i <= seg; i++) { const t = (i / seg) * a; pts.push([w / 2 - R + R * Math.cos(t), spring + R * Math.sin(t)]); }
  for (let i = seg - 1; i >= 1; i--) { const t = (i / seg) * a; pts.push([-w / 2 + R - R * Math.cos(t), spring + R * Math.sin(t)]); }
  if (spring > 0.02) pts.push([-w / 2, spring]);
  return pts;
}

export function makeKit(b, near) {
  const put = (g, m) => { g.computeVertexNormals(); b.put(g, m, 0, 0); };
  const geo = (pos, idx) => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); return g; };
  const kit = {
    near,
    put,
    box(m, cx, cy, cz, sx, sy, sz) { const g = new THREE.BoxGeometry(sx, sy, sz); g.translate(cx, cy, cz); put(g, m); },
    // Vertical wall on every edge of a ring between y0 and y1, facing out.
    walls(m, ring, y0, y1) {
      const pos = [], idx = [];
      const s = signedArea(ring) > 0;
      ring.forEach((p, i) => {
        const q = ring[(i + 1) % ring.length], o = pos.length / 3;
        pos.push(p[0], y0, p[1], q[0], y0, q[1], q[0], y1, q[1], p[0], y1, p[1]);
        // x-z area sign decides which way is outward; this winding faces out for a positive area
        if (s) idx.push(o, o + 2, o + 1, o, o + 3, o + 2); else idx.push(o, o + 1, o + 2, o, o + 2, o + 3);
      });
      put(geo(pos, idx), m);
    },
    // Horizontal polygon at height y facing up.
    cap(m, ring, y) {
      const tris = THREE.ShapeUtils.triangulateShape(ring.map(([x, z]) => new THREE.Vector2(x, z)), []);
      const pos = []; ring.forEach(([x, z]) => pos.push(x, y, z));
      const idx = [];
      for (const [a, c, d] of tris) {
        const ax = ring[c][0] - ring[a][0], az = ring[c][1] - ring[a][1], bx = ring[d][0] - ring[a][0], bz = ring[d][1] - ring[a][1];
        // normal.y of (c-a)x(d-a) = az*bx - ax*bz ; want > 0
        if (az * bx - ax * bz > 0) idx.push(a, c, d); else idx.push(a, d, c);
      }
      put(geo(pos, idx), m);
    },
    // Horizontal polygon at height y facing down (the underside of a slab).
    capDown(m, ring, y) {
      const tris = THREE.ShapeUtils.triangulateShape(ring.map(([x, z]) => new THREE.Vector2(x, z)), []);
      const pos = []; ring.forEach(([x, z]) => pos.push(x, y, z));
      const idx = [];
      for (const [a, c, d] of tris) {
        const ax = ring[c][0] - ring[a][0], az = ring[c][1] - ring[a][1], bx = ring[d][0] - ring[a][0], bz = ring[d][1] - ring[a][1];
        if (az * bx - ax * bz > 0) idx.push(a, d, c); else idx.push(a, c, d);
      }
      put(geo(pos, idx), m);
    },
    // Sloped skirt joining ring (at y0) to an inner ring (y1), facing up and out.
    skirt(m, ring, inner, y0, y1) {
      const pos = [], idx = [], s = signedArea(ring) > 0;
      ring.forEach((p, i) => {
        const j = (i + 1) % ring.length, q = ring[j], pi = inner[i], qi = inner[j], o = pos.length / 3;
        pos.push(p[0], y0, p[1], q[0], y0, q[1], qi[0], y1, qi[1], pi[0], y1, pi[1]);
        if (s) idx.push(o, o + 2, o + 1, o, o + 3, o + 2); else idx.push(o, o + 1, o + 2, o, o + 2, o + 3);
      });
      put(geo(pos, idx), m);
    },
    // Flat shape on a wall edge: pts are [u (along the edge), v (up)] relative to (mid, y); sits `proud` out of the wall.
    onEdge(m, ring, i, mid, y, pts, proud) {
      const [x0, z0] = ring[i], [x1, z1] = ring[(i + 1) % ring.length];
      const dx = x1 - x0, dz = z1 - z0, l = Math.hypot(dx, dz), ux = dx / l, uz = dz / l, [nx, nz] = edgeNormal(ring, i);
      const cx = x0 + dx * mid + nx * proud, cz = z0 + dz * mid + nz * proud;
      const tris = THREE.ShapeUtils.triangulateShape(pts.map(([u, v]) => new THREE.Vector2(u, v)), []);
      const pos = []; pts.forEach(([u, v]) => pos.push(cx + ux * u, y + v, cz + uz * u));
      const idx = [];
      for (const [a, c, d] of tris) {
        const ab = [pts[c][0] - pts[a][0], pts[c][1] - pts[a][1]], ac = [pts[d][0] - pts[a][0], pts[d][1] - pts[a][1]];
        // 3D normal of (c-a)x(d-a) with u along (ux,0,uz), v up: n = (c-a)x(d-a)
        const e1 = [ux * ab[0], ab[1], uz * ab[0]], e2 = [ux * ac[0], ac[1], uz * ac[0]];
        const cr = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
        if (cr[0] * nx + cr[2] * nz > 0) idx.push(a, c, d); else idx.push(a, d, c);
      }
      put(geo(pos, idx), m);
    },
    // Rectangle on a wall edge.
    rectOnEdge(m, ring, i, mid, y0, w, h, proud) {
      kit.onEdge(m, ring, i, mid, y0, [[-w / 2, 0], [w / 2, 0], [w / 2, h], [-w / 2, h]], proud);
    },
    // Four-sided spike on a square base.
    spike(m, cx, cz, half, y0, y1) {
      const pos = [cx - half, y0, cz - half, cx + half, y0, cz - half, cx + half, y0, cz + half, cx - half, y0, cz + half, cx, y1, cz];
      put(geo(pos, [0, 4, 1, 1, 4, 2, 2, 4, 3, 3, 4, 0]), m);
    },
  };
  return kit;
}
