// Calgary Tower: surface builders on top of assetBuilder.put. Nothing here knows a dimension;
// calgary-tower-shape.js owns every number. A point at compass bearing b (deg, clockwise from north),
// radius r, height y is (r sin b, y, -r cos b), so segment 0 always lies on the north axis and the
// extents of a coarse far polygon equal those of a fine near one.
import * as THREE from 'three';

const RAD = Math.PI / 180;
export const at = (bearing, r, y) => [r * Math.sin(bearing * RAD), y, -r * Math.cos(bearing * RAD)];
export const tangent = (bearing) => [Math.cos(bearing * RAD), 0, Math.sin(bearing * RAD)];

function geometry(positions, indices) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  g.setIndex(indices);
  g.computeVertexNormals();
  return g;
}

/**
 * A surface of revolution about the tower axis. `profile` rows are [radius, height], listed so the
 * surface normal (dh, -dr) points at the viewer: walls bottom to top, roofs from the rim inward,
 * soffits from the shaft outward. A row may carry a third value, `groove`, that insets every odd ring
 * vertex of that row (segments must be even): a corrugated panel wall between two plain trim rings. Rows named in `crease` start a new, separately shaded run (a hard edge).
 * A profile ending on the axis (r = 0) makes a fan.
 */
export function lathe(b, material, profile, segments, { crease = [], groove = 0 } = {}) {
  const runs = []; let run = [];
  profile.forEach((p, i) => {
    run.push(p);
    if (crease.includes(i) && run.length > 1) { runs.push(run); run = [p]; }
  });
  if (run.length > 1) runs.push(run);
  for (const rows of runs) {
    const positions = [], indices = [];
    for (const [r, h, g = groove] of rows) for (let j = 0; j < segments; j++) positions.push(...at(j * 360 / segments, g && j % 2 ? r - g : r, h));
    for (let i = 0; i < rows.length - 1; i++) for (let j = 0; j < segments; j++) {
      const j1 = (j + 1) % segments;
      const a = i * segments + j1, bb = i * segments + j, c = (i + 1) * segments + j, d = (i + 1) * segments + j1;
      indices.push(a, bb, c, a, c, d);
    }
    b.put(geometry(positions, indices), material, 0, 0);
  }
}

/** Oriented boxes between two points with a chosen lateral axis (`side`): `width` along it, `thick` across. One geometry per call. `caps: false` leaves the two end faces off (a mullion whose ends are hidden). */
export function beams(b, material, list, { caps = true } = {}) {
  const positions = [], indices = [];
  const quad = (p0, p1, p2, p3, outward) => {
    const n = new THREE.Vector3().subVectors(p1, p0).cross(new THREE.Vector3().subVectors(p2, p0));
    const pts = n.dot(outward) < 0 ? [p0, p3, p2, p1] : [p0, p1, p2, p3];
    const base = positions.length / 3; for (const p of pts) positions.push(p.x, p.y, p.z);
    indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
  };
  for (const { from, to, side, width, thick } of list) {
    const p0 = new THREE.Vector3(...from), p1 = new THREE.Vector3(...to), d = p1.clone().sub(p0);
    if (d.lengthSq() < 1e-8) continue;
    const s = new THREE.Vector3(...side); s.addScaledVector(d, -s.dot(d) / d.lengthSq()).normalize();
    const n = d.clone().normalize().cross(s).normalize();
    const c = [];
    for (const [u, v] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) c.push([
      p0.clone().addScaledVector(s, u * width / 2).addScaledVector(n, v * thick / 2),
      p1.clone().addScaledVector(s, u * width / 2).addScaledVector(n, v * thick / 2),
    ]);
    for (let k = 0; k < 4; k++) {
      const a = c[k], e = c[(k + 1) % 4];
      quad(a[0], e[0], e[1], a[1], a[0].clone().add(e[0]).multiplyScalar(0.5).sub(p0));
    }
    if (caps) { quad(c[0][1], c[1][1], c[2][1], c[3][1], d); quad(c[0][0], c[1][0], c[2][0], c[3][0], d.clone().negate()); }
  }
  if (indices.length) b.put(geometry(positions, indices), material, 0, 0);
}

/** A tiny octahedron (8 triangles, apex on the vertical through `centre`), merged into the material's mesh: a lamp. */
export function lamp(b, material, centre, radius) {
  const g = new THREE.OctahedronGeometry(radius, 0);
  g.translate(...centre);
  b.put(g, material, 0, 0);
}

/**
 * A raised oval skylight on the dome: a short 10-sided prism, long axis along the tangent, tilted to
 * the dome's slope `tilt` (deg, outward), sunk `sink` below the surface so it never floats.
 */
export function skylight(b, material, bearing, r, h, tilt, { along = 0.75, across = 0.48, rise = 0.32, sink = 0.15 } = {}) {
  const g = new THREE.CylinderGeometry(1, 1, rise + sink, 10, 1, false);
  g.scale(along, 1, across);
  g.translate(0, (rise - sink) / 2, 0);
  g.rotateX(tilt * RAD);                // +y leans outward (+z): a convex dome's normal tilts away from the axis
  g.rotateY(Math.PI - bearing * RAD);   // local +z -> the radial direction at this bearing
  g.translate(...at(bearing, r, h));
  b.put(g, material, 0, 0);
}
