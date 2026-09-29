// CN Tower: surface builders on top of assetBuilder.put. Nothing here knows a dimension;
// cn-tower-shape.js owns every number. Conventions: a point at compass bearing b (deg,
// clockwise from north), radius r, height y is (r sin b, y, -r cos b).
import * as THREE from 'three';

const RAD = Math.PI / 180;
export const at = (bearing, r, y) => [r * Math.sin(bearing * RAD), y, -r * Math.cos(bearing * RAD)];

function geometry(positions, indices) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  g.setIndex(indices);
  g.computeVertexNormals();
  return g;
}

/**
 * A surface of revolution about the tower axis. `profile` is [radius, height] rows listed so
 * that the surface normal (dh, -dr) points at the viewer: walls bottom to top, roofs from
 * the rim inward, soffits from the shaft outward. Rows named in `crease` start a new,
 * separately shaded run (a hard edge); everything else is smooth.
 */
export function lathe(b, material, profile, segments, { crease = [], phase = 0 } = {}) {
  const runs = []; let run = [];
  profile.forEach((p, i) => {
    run.push(p);
    if (crease.includes(i) && run.length > 1) { runs.push(run); run = [p]; }
  });
  if (run.length > 1) runs.push(run);
  for (const rows of runs) {
    const positions = [], indices = [];
    for (const [r, h] of rows) for (let j = 0; j < segments; j++) positions.push(...at(phase + j * 360 / segments, r, h));
    for (let i = 0; i < rows.length - 1; i++) for (let j = 0; j < segments; j++) {
      const j1 = (j + 1) % segments;
      const a = i * segments + j1, bb = i * segments + j, c = (i + 1) * segments + j, d = (i + 1) * segments + j1;
      indices.push(a, bb, c, a, c, d);
    }
    b.put(geometry(positions, indices), material, 0, 0);
  }
}

/** A flat quad whose front face looks along `outward` (a vector, not a point). */
export function quad(b, material, p0, p1, p2, p3, outward) {
  const n = new THREE.Vector3().subVectors(new THREE.Vector3(...p1), new THREE.Vector3(...p0)).cross(new THREE.Vector3().subVectors(new THREE.Vector3(...p2), new THREE.Vector3(...p0)));
  const flip = n.dot(new THREE.Vector3(...outward)) < 0;
  const pts = flip ? [p0, p3, p2, p1] : [p0, p1, p2, p3];
  b.put(geometry(pts.flat(), [0, 1, 2, 0, 2, 3]), material, 0, 0);
}

/** Many quads in one geometry (each with its own vertices, so shaded flat). quads = [[p0,p1,p2,p3,outward]]. */
export function quads(b, material, list) {
  const positions = [], indices = [];
  for (const [p0, p1, p2, p3, outward] of list) {
    const n = new THREE.Vector3().subVectors(new THREE.Vector3(...p1), new THREE.Vector3(...p0)).cross(new THREE.Vector3().subVectors(new THREE.Vector3(...p2), new THREE.Vector3(...p0)));
    const pts = n.dot(new THREE.Vector3(...outward)) < 0 ? [p0, p3, p2, p1] : [p0, p1, p2, p3];
    const base = positions.length / 3; for (const p of pts) positions.push(...p);
    indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
  }
  if (indices.length) b.put(geometry(positions, indices), material, 0, 0);
}

/** An oriented box from p0 to p1 with a chosen lateral axis, `width` along it and `thick` across. Merged as one geometry per call. */
export function beamList(b, material, list) {
  const out = [];
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
    // faces around the beam
    for (let k = 0; k < 4; k++) {
      const a = c[k], e = c[(k + 1) % 4], mid = a[0].clone().add(e[0]).multiplyScalar(0.5).sub(p0);
      out.push([a[0].toArray(), e[0].toArray(), e[1].toArray(), a[1].toArray(), mid.toArray()]);
    }
    out.push([c[0][1].toArray(), c[1][1].toArray(), c[2][1].toArray(), c[3][1].toArray(), d.toArray()]);
    out.push([c[0][0].toArray(), c[1][0].toArray(), c[2][0].toArray(), c[3][0].toArray(), d.clone().negate().toArray()]);
  }
  quads(b, material, out);
}

/** A closed prism of `polygon` ([x,z] rows) between two heights, flat sides, optional cap. */
export function prism(b, material, polygon, y0, y1) {
  const list = [];
  const cx = polygon.reduce((s, p) => s + p[0], 0) / polygon.length, cz = polygon.reduce((s, p) => s + p[1], 0) / polygon.length;
  for (let i = 0; i < polygon.length; i++) {
    const a = polygon[i], e = polygon[(i + 1) % polygon.length];
    list.push([[a[0], y0, a[1]], [e[0], y0, e[1]], [e[0], y1, e[1]], [a[0], y1, a[1]], [(a[0] + e[0]) / 2 - cx, 0, (a[1] + e[1]) / 2 - cz]]);
  }
  quads(b, material, list);
}
