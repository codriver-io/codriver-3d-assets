// Site frame for the Scotiabank Arena model: named vertices in local metres
// (+X east, +Z south, origin = SPEC.origin) taken from the OSM building:part
// outlines listed in footprint.js, plus the small planar helpers the geometry needs.
// Authoring only: imported by geometry.js and the tests, never by the map bundle.

// Every vertex marked "osm" is a vertex of a listed way (checked against
// FOOTPRINTS by scotiabank-arena.test.js); "derived" points lie on a mapped edge.
export const V = {
  // bowl roof, way 1104128156 (osm)
  P0: [45.5, -58.4], P1: [67.1, 13.8], P2: [-28.5, 68.9], P3: [-72.3, -14.4],
  N1: [5.4, -56.2], Na: [9.8, -55.2], Nb: [14.8, -54.6], Nc: [19.1, -54.6], Nd: [21.7, -54.8], N2: [25.5, -55.5], N3: [27.3, -51.3],
  // Postal Delivery Building limestone facade, way 1104128153 (osm)
  O0: [41.9, -70.5], O1: [45.8, -73.7], O2: [73.7, 17.8], O3: [10.2, 62.1],
  // limestone west end cap meets the bowl's south edge here (derived: on P1-P2)
  Q0: [3.0, 50.75],
  // west glazed front, way 1104128157 (osm)
  W1: [-64.9, 9.5], W2: [-71.3, 12.9], W3: [-66.0, 36.3], W4: [-51.4, 63.3], SW: [-43.7, 77.6],
  s1: [-39.1, 75.1], s2: [-30.7, 70.6], s3: [-30.0, 72.2], s4: [-28.6, 75.2], s5: [-23.2, 72.4],
  s6: [-22.6, 73.9], s7: [-19.2, 72.1], s8: [3.2, 60.5],
  // north wing, way 1104128159 (osm)
  Wn1: [-76.6, -11.8], Wn2: [-77.8, -17.7], Wn3: [-74.9, -19.3],
  // where the taller plaza front meets the lower north wing (derived: on P2-P3)
  A0: [-57.95, 12.9],
  // north black wall band, way 1104128154 (osm)
  K1: [-75.3, -20.1], K2: [-62.1, -27.5], K3: [-61.2, -25.6], K4: [-6.4, -54.8], K5: [-5.9, -53.3], K6: [3.1, -56.7],
};

export const RINGS = {
  bowl: [V.P0, V.P1, V.P2, V.P3, V.N1, V.Na, V.Nb, V.Nc, V.Nd, V.N2, V.N3],
  lime: [V.O1, V.O2, V.O3, V.Q0, V.P1, V.P0, V.O0],
  atrium: [V.A0, V.W2, V.W3, V.W4, V.SW, V.s1, V.s2, V.P2],
  ret: [V.P2, V.s2, V.s3, V.s4, V.s5, V.s6, V.s7, V.s8, V.O3, V.Q0],
  wing: [V.P3, V.A0, V.W1, V.Wn1, V.Wn2, V.Wn3],
  skirt: [V.P3, V.Wn3, V.K1, V.K2, V.K3, V.K4, V.K5, V.K6, V.N1],
};

export const shoelace = (ring) => ring.reduce((a, p, i) => { const q = ring[(i + 1) % ring.length]; return a + p[0] * q[1] - q[0] * p[1]; }, 0);
export const centroid = (ring) => {
  let a = 0, cx = 0, cz = 0;
  ring.forEach((p, i) => { const q = ring[(i + 1) % ring.length], f = p[0] * q[1] - q[0] * p[1]; a += f; cx += (p[0] + q[0]) * f; cz += (p[1] + q[1]) * f; });
  return [cx / (3 * a), cz / (3 * a)];
};

// Frame of the edge a->b of a ring: unit direction, outward normal (given the ring's
// winding), length and the Y rotation that turns a box's local +X onto the edge.
export function edgeFrame(a, b, sign) {
  const dx = b[0] - a[0], dz = b[1] - a[1], len = Math.hypot(dx, dz), ux = dx / len, uz = dz / len;
  return { a, b, len, ux, uz, nx: sign > 0 ? uz : -uz, nz: sign > 0 ? -ux : ux, angle: Math.atan2(-uz, ux) };
}

// Fillet the corner at `corner` (between prev and next) with a circular arc of radius r.
export function roundCorner(prev, corner, next, r, segments = 6) {
  const unit = (p) => { const dx = p[0] - corner[0], dz = p[1] - corner[1], l = Math.hypot(dx, dz); return [dx / l, dz / l]; };
  const d1 = unit(prev), d2 = unit(next), alpha = Math.acos(Math.max(-1, Math.min(1, d1[0] * d2[0] + d1[1] * d2[1])));
  const t = r / Math.tan(alpha / 2), bis = [d1[0] + d2[0], d1[1] + d2[1]], bl = Math.hypot(...bis);
  const c = [corner[0] + bis[0] / bl * r / Math.sin(alpha / 2), corner[1] + bis[1] / bl * r / Math.sin(alpha / 2)];
  const t1 = [corner[0] + d1[0] * t, corner[1] + d1[1] * t], t2 = [corner[0] + d2[0] * t, corner[1] + d2[1] * t];
  const a1 = Math.atan2(t1[1] - c[1], t1[0] - c[0]), a2 = Math.atan2(t2[1] - c[1], t2[0] - c[0]);
  let da = a2 - a1; while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI;
  return Array.from({ length: segments + 1 }, (_, k) => [c[0] + r * Math.cos(a1 + da * k / segments), c[1] + r * Math.sin(a1 + da * k / segments)]);
}

// Open polyline with arclength stations; `at(s)` gives position, unit tangent and the outward normal.
export function makePath(points, sign) {
  const cum = [0];
  for (let i = 1; i < points.length; i++) cum.push(cum[i - 1] + Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]));
  const length = cum[cum.length - 1];
  function at(s) {
    s = Math.max(0, Math.min(length, s));
    let i = 1; while (i < points.length - 1 && cum[i] < s) i++;
    const a = points[i - 1], b = points[i], t = (s - cum[i - 1]) / (cum[i] - cum[i - 1] || 1), f = edgeFrame(a, b, sign);
    return { x: a[0] + (b[0] - a[0]) * t, z: a[1] + (b[1] - a[1]) * t, ...f };
  }
  return { points, length, at, cum };
}

// Height of the shallow arched roof at (x, z): a two-way kingpost-truss roof, low profile,
// highest at the crown (eave + rise) and falling to about the eave at the corners.
export function makeRoofHeight({ eave, rise }, bowl = RINGS.bowl) {
  const ax = edgeFrame(V.P2, V.P1, 1), ux = ax.ux, uz = ax.uz, vx = -uz, vz = ux;
  const c = centroid(bowl);
  let A = 0, B = 0;
  for (const p of bowl) { A = Math.max(A, Math.abs((p[0] - c[0]) * ux + (p[1] - c[1]) * uz)); B = Math.max(B, Math.abs((p[0] - c[0]) * vx + (p[1] - c[1]) * vz)); }
  return (x, z) => {
    const sa = ((x - c[0]) * ux + (z - c[1]) * uz) / A, sb = ((x - c[0]) * vx + (z - c[1]) * vz) / B;
    return eave + rise * Math.max(0, 1 - (sa * sa + sb * sb) / 2);
  };
}

// Point-in-polygon and distance to a ring's boundary (used by the tests and the roof mesh).
export function inside(ring, x, z) {
  let hit = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [ax, az] = ring[j], [bx, bz] = ring[i];
    if ((az > z) !== (bz > z) && x < (bx - ax) * (z - az) / (bz - az) + ax) hit = !hit;
  }
  return hit;
}
