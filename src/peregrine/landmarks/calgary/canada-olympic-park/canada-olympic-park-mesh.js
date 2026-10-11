// Canada Olympic Park: surface helpers on top of assetBuilder.put. They know no dimension (the plan owns every number).
// Faces are flat shaded unless a strip is swept along a curve, and every face is wound to look outward.
import * as THREE from 'three';

const V = (p) => new THREE.Vector3(...p);

/** Convex planar polygons, flat shaded, each wound so its front face looks along `outward`. list = [[...points, outward]]. */
export function polys(b, material, list) {
  const positions = [], indices = [];
  for (const poly of list) {
    const outward = poly[poly.length - 1], pts = poly.slice(0, -1);
    const n = new THREE.Vector3().subVectors(V(pts[1]), V(pts[0])).cross(new THREE.Vector3().subVectors(V(pts[2]), V(pts[0])));
    const ordered = n.dot(V(outward)) < 0 ? [...pts].reverse() : pts;
    const base = positions.length / 3;
    for (const p of ordered) positions.push(...p);
    for (let i = 1; i < ordered.length - 1; i++) indices.push(base, base + i, base + i + 1);
  }
  if (!indices.length) return;
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  g.setIndex(indices);
  g.computeVertexNormals();
  b.put(g, material);
}

/**
 * A prism between two rings with the same vertex count (convex, any order round the axis): flat sides, optional caps.
 * Rings are [x, y, z] points; `skip` lists side indices to leave open (a face against another solid).
 */
export function prism(b, material, lo, hi, { bottom = false, top = true, skip = [] } = {}) {
  const n = lo.length, list = [];
  const mid = [...lo, ...hi].reduce((s, p) => [s[0] + p[0], s[1] + p[1], s[2] + p[2]], [0, 0, 0]).map((v) => v / (2 * n));
  for (let i = 0; i < n; i++) {
    if (skip.includes(i)) continue;
    const j = (i + 1) % n, c = [(lo[i][0] + lo[j][0] + hi[i][0] + hi[j][0]) / 4, 0, (lo[i][2] + lo[j][2] + hi[i][2] + hi[j][2]) / 4];
    list.push([lo[i], lo[j], hi[j], hi[i], [c[0] - mid[0], 0, c[2] - mid[2]]]);
  }
  if (bottom) list.push([...lo, [0, -1, 0]]);
  if (top) list.push([...hi, [0, 1, 0]]);
  polys(b, material, list);
}

/**
 * Sweep an open or closed cross-section along a path of vertical stations. Each station is { p: [x, y, z], r: [rx, rz] }
 * (the deck centre and the horizontal unit vector to the right); a section point [v, dy] sits at p + v r + dy up (dy may be
 * a function of the station). The
 * section is a list of edges [[v0, dy0], [v1, dy1], material, outwardV, outwardY]; each edge becomes one strip, smooth
 * along the path, hard at the section corners. Strips are wound to face (outwardV, outwardY) in the section plane.
 */
export function sweep(b, stations, edges) {
  const byMaterial = new Map();
  for (const [a, c, material, ov, oy] of edges) {
    const positions = [], indices = [];
    stations.forEach(({ p, r }, i) => {
      for (const [v, dy0] of [a, c]) { const dy = typeof dy0 === 'function' ? dy0(stations[i]) : dy0; positions.push(p[0] + v * r[0], p[1] + dy, p[2] + v * r[1]); }
      if (!i) return;
      const k = (i - 1) * 2, m = i * 2;
      indices.push(k, k + 1, m + 1, k, m + 1, m);
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    // Wind by the outward direction of the first quad.
    const P = (q) => V(positions.slice(q * 3, q * 3 + 3));
    const n = new THREE.Vector3().subVectors(P(1), P(0)).cross(new THREE.Vector3().subVectors(P(3), P(0)));
    const r0 = stations[0].r, out = new THREE.Vector3(ov * r0[0], oy, ov * r0[1]);
    if (n.dot(out) < 0) for (let q = 0; q < indices.length; q += 3) [indices[q + 1], indices[q + 2]] = [indices[q + 2], indices[q + 1]];
    g.setIndex(indices);
    g.computeVertexNormals();
    if (!byMaterial.has(material)) byMaterial.set(material, []);
    byMaterial.get(material).push(g);
  }
  for (const [material, list] of byMaterial) for (const g of list) b.put(g, material);
}

/** A closed square bar between two points (any direction), `w` wide; a vertical bar stays axis-aligned to `angle`. */
export function bar(b, material, a, c, w, angle = 0) {
  const av = V(a), cv = V(c), dir = cv.clone().sub(av), len = dir.length();
  if (len < 1e-4) return;
  const g = new THREE.BoxGeometry(w, len, w);
  g.rotateY(angle);
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize()));
  g.translate(...av.add(cv).multiplyScalar(0.5).toArray());
  b.put(g, material);
}

/** A flat annulus of width 2 * tube centred at `c`, facing the horizontal unit vector `n` ([nx, nz]): 2 * segments triangles, one-sided. */
export function ring(b, material, c, n, radius, tube, segments) {
  const g = new THREE.RingGeometry(radius - tube, radius + tube, segments, 1);
  g.rotateY(Math.atan2(n[0], n[1]));
  g.translate(...c);
  b.put(g, material);
}
