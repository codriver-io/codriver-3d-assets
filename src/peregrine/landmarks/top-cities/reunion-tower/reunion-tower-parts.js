// Reunion Tower parts. The silhouette is the geodesic ball (aluminium struts, round light
// housings, a blue glass belt, a concrete crown) on a banded central shaft and three
// slimmer elevator shafts. Numbers live on SPEC; see config.js for what is mapped
// and what is estimated.
import * as THREE from 'three';
import { SPEC } from './config.js';
import { geodesic } from './reunion-tower-geodesic.js';

// South cap cut. Below this the sphere would be narrower than the outer shafts and the
// struts would stab through the concrete. The real basket ends open around the capitals.
const MIN_NY = -0.55;
const BAND_M = 3.6;
const COLUMN_TOP = 151.15;

function geo(positions, normals, indices) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  if (normals) g.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  g.setIndex(indices);
  if (!normals) g.computeVertexNormals();
  return g;
}

// Round tube along each strut. Normals point away from the strut axis, so the frame
// reads from outside the ball and through the open cap.
function strutFrame(points, edges, radius, sides) {
  const positions = [];
  const normals = [];
  const indices = [];
  const side = new THREE.Vector3();
  const bin = new THREE.Vector3();
  const dir = new THREE.Vector3();
  for (const [ia, ib] of edges) {
    const a = points[ia], b = points[ib];
    dir.set(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
    const len = dir.length();
    if (len < 1e-4) continue;
    dir.multiplyScalar(1 / len);
    const hint = Math.abs(dir.y) < 0.85 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
    side.crossVectors(dir, hint).normalize();
    bin.crossVectors(dir, side).normalize();
    const base = positions.length / 3;
    for (let i = 0; i < sides; i++) {
      const t = (i / sides) * Math.PI * 2;
      const c = Math.cos(t), s = Math.sin(t);
      const ox = (side.x * c + bin.x * s) * radius;
      const oy = (side.y * c + bin.y * s) * radius;
      const oz = (side.z * c + bin.z * s) * radius;
      positions.push(a[0] + ox, a[1] + oy, a[2] + oz, b[0] + ox, b[1] + oy, b[2] + oz);
      normals.push(ox / radius, oy / radius, oz / radius, ox / radius, oy / radius, oz / radius);
    }
    for (let i = 0; i < sides; i++) {
      const j = (i + 1) % sides;
      const a0 = base + i * 2, a1 = a0 + 1, b0 = base + j * 2, b1 = b0 + 1;
      indices.push(a0, b0, a1, a1, b0, b1);
    }
  }
  return geo(positions, normals, indices);
}

// Light housing: a small octahedron at each kept joint. Shared vertices so the
// averaged normal reads as a round aluminium (and, at night, glowing) disc.
function nodeCloud(points, keep, radius) {
  const groups = { glow: [], light: [], lamp: [] };
  const tip = [
    [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1],
  ];
  const faces = [
    [0, 2, 4], [4, 2, 1], [1, 2, 5], [5, 2, 0],
    [0, 4, 3], [4, 1, 3], [1, 5, 3], [5, 0, 3],
  ];
  for (let i = 0; i < points.length; i++) {
    if (!keep[i]) continue;
    const p = points[i];
    const ny = (p[1] - SPEC.centerY) / SPEC.sphereR;
    const mat = ny > 0.28 ? 'glow' : ny > -0.18 ? 'light' : 'lamp';
    const base = groups[mat].length / 3;
    const positions = groups[mat];
    for (const [x, y, z] of tip) positions.push(p[0] + x * radius, p[1] + y * radius, p[2] + z * radius);
    if (!groups[mat].indices) groups[mat].indices = [];
    for (const [a, b, c] of faces) groups[mat].indices.push(base + a, base + b, base + c);
  }
  const out = {};
  for (const mat of ['glow', 'light', 'lamp']) {
    const positions = groups[mat];
    if (!positions.indices?.length) continue;
    out[mat] = geo(positions, null, positions.indices);
  }
  return out;
}

function bandedColumn(b, x, z, radius, y0, y1, sides, bands) {
  const h = (y1 - y0) / bands;
  for (let i = 0; i < bands; i++) {
    const g = new THREE.CylinderGeometry(radius, radius, h, sides, 1, true);
    g.translate(x, y0 + (i + 0.5) * h, z);
    b.put(g, i % 2 === 0 ? 'concrete' : 'concrete_dark');
  }
  // A short collar, just proud of the shaft, sleeved into the deck so the skins never share a plane.
  const cap = new THREE.CylinderGeometry(radius + 0.16, radius + 0.06, 0.55, sides, 1, true);
  cap.translate(x, y1 - 0.12, z);
  b.put(cap, 'concrete');
}

function elevatorGlass(b, x, z, radius, y0, y1) {
  const dist = Math.hypot(x, z) || 1;
  const ux = x / dist, uz = z / dist;
  // Box local +Z rotates to (sin θ, cos θ) = outward, so the thin face stands proud of the shaft.
  const proud = 0.08, depth = 0.1;
  b.box('glass', [x + ux * (radius + proud), (y0 + y1) / 2, z + uz * (radius + proud)], [0.95, y1 - y0, depth], Math.atan2(ux, uz));
}

// Observation-deck fascia: a ring, not a plug, so the basket stays open around the shafts.
function ringDeck(b, y0, y1, rIn, rOut, seg) {
  const wall = new THREE.CylinderGeometry(rOut, rOut, y1 - y0, seg, 1, true);
  wall.translate(0, (y0 + y1) / 2, 0);
  b.put(wall, 'concrete');
  const inner = new THREE.CylinderGeometry(rIn, rIn, y1 - y0, seg, 1, true);
  const idx = inner.index.array;
  for (let i = 0; i < idx.length; i += 3) { const t = idx[i]; idx[i] = idx[i + 1]; idx[i + 1] = t; }
  inner.computeVertexNormals();
  inner.translate(0, (y0 + y1) / 2, 0);
  b.put(inner, 'concrete');
  for (const up of [true, false]) {
    const y = up ? y1 : y0;
    const positions = [];
    const indices = [];
    for (let i = 0; i < seg; i++) {
      const th = (i / seg) * Math.PI * 2;
      const s = Math.sin(th), c = Math.cos(th);
      positions.push(rIn * s, y, rIn * c, rOut * s, y, rOut * c);
    }
    for (let i = 0; i < seg; i++) {
      const j = (i + 1) % seg;
      const a = i * 2, c = a + 1, d = j * 2, e = d + 1;
      indices.push(a, e, c, a, d, e);
    }
    const g = geo(positions, null, indices);
    if ((up && g.attributes.normal.getY(0) < 0) || (!up && g.attributes.normal.getY(0) > 0)) {
      for (let k = 0; k < indices.length; k += 3) { const t = indices[k]; indices[k] = indices[k + 1]; indices[k + 1] = t; }
      g.setIndex(indices);
      g.computeVertexNormals();
    }
    b.put(g, 'concrete');
  }
}

function sphereBand(b, radius, y0, y1, seg, rows) {
  const { centerY } = SPEC;
  const phi0 = Math.acos(THREE.MathUtils.clamp((y1 - centerY) / radius, -1, 1));
  const phi1 = Math.acos(THREE.MathUtils.clamp((y0 - centerY) / radius, -1, 1));
  const positions = [];
  const normals = [];
  const indices = [];
  const stride = seg + 1;
  for (let j = 0; j <= rows; j++) {
    const phi = phi0 + (phi1 - phi0) * (j / rows);
    const y = centerY + radius * Math.cos(phi);
    const rad = radius * Math.sin(phi);
    const ny = Math.cos(phi), nr = Math.sin(phi);
    for (let i = 0; i <= seg; i++) {
      const th = (i / seg) * Math.PI * 2;
      const s = Math.sin(th), c = Math.cos(th);
      positions.push(rad * s, y, rad * c);
      normals.push(nr * s, ny, nr * c);
    }
  }
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < seg; i++) {
      const a = j * stride + i, c = a + stride;
      indices.push(a, c, a + 1, a + 1, c, c + 1);
    }
  }
  b.put(geo(positions, normals, indices), 'glass');
}

export function buildReunionTower(b, detail) {
  const near = detail === 'near';
  const { sphereR, centerY, nodeR, centerShaftR, outerShaftR, shafts } = SPEC;
  const freq = near ? 8 : 4;
  const { verts, edges, keep } = geodesic(freq, MIN_NY);
  const points = verts.map(([x, y, z]) => [x * sphereR, centerY + y * sphereR, z * sphereR]);

  b.put(strutFrame(points, edges, near ? 0.09 : 0.13, near ? 5 : 3), 'metal');
  for (const [mat, g] of Object.entries(nodeCloud(points, keep, nodeR))) b.put(g, mat);

  // Blue observation belt, 0.55 m inside the strut centreline so the frame sits in front of it.
  // The belt starts above the equator so the lower basket stays an open lattice, as on the tower.
  sphereBand(b, sphereR - 0.55, 152.55, 162.7, near ? 48 : 24, near ? 5 : 3);

  // Deck ring the shafts rise into, and a lip at the top of the glass. Both inside the cage.
  ringDeck(b, 151.05, 152.35, 7.6, 13.85, near ? 40 : 20);
  const lip = new THREE.CylinderGeometry(12.45, 12.6, 0.4, near ? 32 : 16, 1, true);
  lip.translate(0, 162.95, 0);
  b.put(lip, 'concrete');

  // Mechanical crown standing inside the open upper cap. Estimated from the worm's-eye photos.
  const crown = new THREE.CylinderGeometry(4.35, 4.7, 4.6, near ? 16 : 10);
  crown.translate(0, 166.15, 0);
  b.put(crown, 'concrete');
  const crownLip = new THREE.CylinderGeometry(5.15, 5.15, 0.4, near ? 16 : 10, 1, true);
  crownLip.translate(0, 168.25, 0);
  b.put(crownLip, 'concrete_dark');

  const bands = near ? Math.round(COLUMN_TOP / BAND_M) : 8;
  const centerSides = near ? 24 : 12;
  const outerSides = near ? 14 : 8;
  bandedColumn(b, 0, 0, centerShaftR, 0, COLUMN_TOP, centerSides, bands);
  for (const shaft of shafts) {
    bandedColumn(b, shaft.x, shaft.z, outerShaftR, 0, COLUMN_TOP, outerSides, bands);
    elevatorGlass(b, shaft.x, shaft.z, outerShaftR, 1.2, COLUMN_TOP - 0.4);
  }
}
