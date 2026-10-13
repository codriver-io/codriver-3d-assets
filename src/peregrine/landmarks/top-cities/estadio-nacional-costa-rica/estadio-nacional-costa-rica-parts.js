import * as THREE from 'three';
import { SPEC } from './config.js';
import { MAPPED } from './estadio-nacional-costa-rica-mapped.js';

// Self-contained geographic frame, equivalent to facade/geo.js, in real metres.
const R = 6378137, D = Math.PI / 180;
const mercY = lat => R * Math.log(Math.tan(Math.PI / 4 + lat * D / 2));
export const local = ([lng, lat]) => [(lng - SPEC.origin[0]) * D * R * Math.cos(SPEC.origin[1] * D), (mercY(SPEC.origin[1]) - mercY(lat)) * Math.cos(SPEC.origin[1] * D)];
export const ringOf = id => MAPPED[id].ring.slice(0, -1).map(local);
export const roofIds = [656351598, 656351599];

// Intersections of a mapped crescent with a north/south station; exact plan,
// including the alternating triangular tips along its outside edge.
export function roofSection(id, z) {
  const ring = ringOf(id), hits = [];
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], c = ring[(i + 1) % ring.length];
    if (Math.abs(a[1] - c[1]) < 1e-8) { if (Math.abs(z - a[1]) < 1e-8) hits.push(a[0], c[0]); continue; }
    if (z < Math.min(a[1], c[1]) - 1e-8 || z > Math.max(a[1], c[1]) + 1e-8) continue;
    hits.push(a[0] + (c[0] - a[0]) * (z - a[1]) / (c[1] - a[1]));
  }
  const lo = Math.min(...hits), hi = Math.max(...hits);
  return id === roofIds[0] ? [hi, lo] : [lo, hi]; // inner, outer
}
export function roofStations(id, detail) {
  const mapped = ringOf(id).map(p => p[1]), lo = Math.min(...mapped), hi = Math.max(...mapped);
  // Both LODs retain every ridge/valley, alongside all mapped fascia cuts.
  const folds = []; for(let z=Math.ceil(lo/10)*10;z<hi;z+=10) folds.push(z);
  const zs = [...new Set([...mapped, ...folds])].sort((a, b) => a - b);
  const out = [zs[0]], step = detail === 'near' ? 7 : 16;
  for (let i = 1; i < zs.length; i++) {
    const n = Math.ceil((zs[i] - zs[i - 1]) / step);
    for (let j = 1; j <= n; j++) out.push(zs[i - 1] + (zs[i] - zs[i - 1]) * j / n);
  }
  return out;
}
export function roofPoint(id, z, across, underside = false) {
  const [inner, outer] = roofSection(id, z);
  // Broad planar folds: 20 m ridge spacing and valleys 4.2 m lower at
  // the outside tips, tapering across the roof to the inner edge.
  const phase = ((z % 20) + 20) % 20, valley = Math.min(phase, 20-phase)/10;
  const taper = Math.min(1, Math.max(0, (149.2-Math.abs(z))/24));
  const y = 4.2 + 47.4 * (1 - (z / 149.2) ** 2) + Math.sin(Math.PI * across) - 4.2*valley*taper*(.25+.75*across);
  return [inner + (outer - inner) * across, y - (underside ? 0.85 : 0), z];
}
export const tierHeight = theta => 13.5 + 12.5 * Math.abs(Math.cos(theta)) ** 3;
export const oval = (theta, f, y) => [(62 + 45 * f) * Math.cos(theta), y, (98 + 36 * f) * Math.sin(theta)];

export function memberGeometry({ a, c, width, sides = 4 }) {
  const av = new THREE.Vector3(...a), cv = new THREE.Vector3(...c), delta = cv.clone().sub(av);
  // Caps are inside the solid terminal joints; open four/three-sided tubes save
  // repeated hidden triangles while preserving the truss' open negative space.
  const g = new THREE.CylinderGeometry(width / 2, width / 2, delta.length(), sides, 1, true);
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize()));
  g.translate(...av.add(cv).multiplyScalar(0.5).toArray());
  return g;
}

// Every truss terminal has a named joint; all chords join the next chord, each
// web joins chords, and four arch tails enter ground-rooted mapped thrust blocks.
export function structure(detail) {
  const supports = [], members = [], nodes = new Map(), bays = detail === 'near' ? 32 : 12;
  const addNode = (name, at, radius = 0.58) => {
    const geometry = detail === 'near' ? new THREE.OctahedronGeometry(radius) : new THREE.TetrahedronGeometry(radius); geometry.translate(...at);
    supports.push({ name, at, geometry, material: 'steel' }); nodes.set(name, at); return name;
  };
  const addMember = (name, from, to, width) => members.push({ name, a: nodes.get(from), c: nodes.get(to), width, sides: detail === 'near' ? 4 : 3, supports: [from, to] });
  for (const id of roofIds) {
    const extent = ringOf(id).map(p => p[1]), lo = Math.min(...extent) + 2.5, hi = Math.max(...extent) - 2.5;
    const joints = [];
    for (let i = 0; i <= bays; i++) {
      const z = lo + (hi - lo) * i / bays;
      const row = [], roofRow = [];
      for (const t of [0.04, 0.94]) {
        const roof = roofPoint(id, z, t, true); roof[1] -= 0.35;
        const top = [...roof]; top[1] = 4.2 + 47.4*(1-(z/149.2)**2) - 4.8*Math.sin(Math.PI*i/bays) - 0.9;
        const bottom = [...top]; bottom[1] -= 5.2 * Math.sin(Math.PI * i / bays) + 0.7;
        row.push([addNode(`${id}-${i}-${t}-top`, top, .78), addNode(`${id}-${i}-${t}-bottom`, bottom, .78)]);
        roofRow.push(addNode(`${id}-${i}-${t}-roof`, roof, .6));
      }
      joints.push(row);
      for (let edge = 0; edge < 2; edge++) {
        addMember(`arch-post-${id}-${edge}-${i}`, row[edge][0], row[edge][1], 0.58);
        addMember(`roof-strut-${id}-${edge}-${i}`, row[edge][0], roofRow[edge], 0.44);
      }
      addMember(`roof-rib-${id}-${i}`, roofRow[0], roofRow[1], 0.48);
      if (detail === 'near') addMember(`roof-tie-${id}-${i}`, row[0][1], row[1][1], 0.28);
      if (detail === 'near') addMember(`roof-web-${id}-${i}`, row[0][0], row[1][1], 0.23);
      if (!i) continue;
      for (let edge = 0; edge < 2; edge++) {
        for (let level = 0; level < 2; level++) addMember(`arch-chord-${id}-${edge}-${level}-${i}`, joints[i - 1][edge][level], row[edge][level], edge ? 1.25 : 1.05);
        addMember(`arch-web-${id}-${edge}-${i}`, joints[i - 1][edge][i % 2], row[edge][1 - i % 2], edge ? 0.72 : 0.6);
      }
      if (detail === 'near') addMember(`plan-brace-${id}-${i}`, joints[i - 1][0][0], row[1][0], 0.20);
    }
    const footIds = id === roofIds[0] ? [656371094, 656371096] : [656371095, 656371097];
    for (let end = 0; end < 2; end++) {
      const footId = footIds[end], pts = ringOf(footId), at = [pts.reduce((s, p) => s + p[0] / pts.length, 0), 3.5, pts.reduce((s, p) => s + p[1] / pts.length, 0)];
      const foot = addNode(`foot-${footId}`, at, 0.75);
      for (const pair of joints[end ? bays : 0]) for (const terminal of pair) addMember(`tail-${id}-${terminal}`, terminal, foot, 0.95);
    }
    // Photo-estimated V columns from the upper stand backs into the inner truss.
    for (let i = 6; i < bays - 4; i += detail === 'near' ? 4 : 2) {
      const at = nodes.get(joints[i][0][1]), theta = Math.asin(Math.max(-0.99, Math.min(0.99, at[2] / 134)));
      const x = (id === roofIds[0] ? -1 : 1) * 104 * Math.cos(theta), y = tierHeight(theta) - 0.6;
      const base = addNode(`column-base-${id}-${i}`, [x, y, at[2]], 0.75);
      // The base is embedded in the rigid concrete seating shell, not suspended.
      for (const j of [i - 1, i + 1]) addMember(`column-${id}-${i}-${j}`, base, joints[j][0][1], 0.64);
    }
  }
  return { supports, members };
}
