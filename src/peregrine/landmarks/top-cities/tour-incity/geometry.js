import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';

// The OSM outline supplies the two rounded east corners and the small north-west
// entrance setback. Projection is literal metric math; no application imports.
const R = 6378137, DEG = Math.PI / 180;
export const PLAN = FOOTPRINTS[0].slice(0, -1).map(([lng, lat]) => [
  (lng - SPEC.origin[0]) * DEG * R * Math.cos(SPEC.origin[1] * DEG),
  -(lat - SPEC.origin[1]) * DEG * R,
]);
const angle = -7.7 * DEG;
const along = ([x, z]) => -Math.sin(angle) * x + Math.cos(angle) * z;
const south = Math.max(...PLAN.map(along)), north = Math.min(...PLAN.map(along));
// roof:direction=352.3 in OSM: falls toward the north; five roof levels.
export const crownY = (x, z) => 154 + 16 * (along([x, z]) - north) / (south - north);
export const deckY = (x, z) => crownY(x, z) - 2.05;

// Explicit named-support handoff for the open crown. Tests enumerate every end.
export function crownMembers(detail = 'near') {
  const near = detail === 'near', posts = [], rails = [];
  PLAN.forEach((a, side) => {
    const c = PLAN[(side + 1) % PLAN.length], length = Math.hypot(c[0] - a[0], c[1] - a[1]);
    const count = Math.max(1, Math.ceil(length / (near ? 1.6 : 3.2)));
    rails.push({ id: `rim-${side}`, a: [a[0], crownY(...a) - 0.08, a[1]], b: [c[0], crownY(...c) - 0.08, c[1]], width: 0.14,
      supports: [`post-${side}-0`, `post-${(side + 1) % PLAN.length}-0`] });
    for (let j = 0; j < count; j++) {
      const x = a[0] + (c[0] - a[0]) * j / count, z = a[1] + (c[1] - a[1]) * j / count;
      posts.push({ id: `post-${side}-${j}`, a: [x, deckY(x, z) - 0.03, z], b: [x, crownY(x, z) - 0.05, z],
        width: near ? 0.075 : 0.11, supports: ['roof', `rim-${side}`] });
    }
  });
  return { posts, rails };
}

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near', b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const surfaces = new Map();
  const point = (a, c, u, y) => [a[0] + (c[0] - a[0]) * u, y, a[1] + (c[1] - a[1]) * u];
  const floors = near ? 38 : 19, pitch = (154 - 10) / floors;
  const levels = [0, 0.4, 5, 10];
  for (let i = 1; i <= floors; i++) levels.push(10 + i * pitch);
  for (let y = 157.6; y < 171; y += 3.6 * (near ? 1 : 2)) levels.push(y);
  levels.push(171);
  // Facade is tiled, not overlaid: strips and windows replace one another in a
  // watertight surface. This avoids any depth-layer cycles or far LOD flicker.
  PLAN.forEach((a, side) => {
    const c = PLAN[(side + 1) % PLAN.length], length = Math.hypot(c[0] - a[0], c[1] - a[1]);
    const bays = Math.max(1, Math.round(length / (near ? 1.45 : 3.15)));
    const band = near ? 0.15 : 0.22, mullion = near ? 0.065 : 0.1;
    const patch = (material, u0, u1, low, high) => {
      const p = point(a, c, u0, 0), q = point(a, c, u1, 0);
      const polygon = [[p[0], low, p[2]], [q[0], low, q[2]], [q[0], high, q[2]], [p[0], high, p[2]]];
      const clipped = [];
      for (let j = 0; j < polygon.length; j++) {
        const v = polygon[j], w = polygon[(j + 1) % polygon.length];
        const dv = deckY(v[0], v[2]) - v[1], dw = deckY(w[0], w[2]) - w[1];
        if (dv >= 0) clipped.push(v);
        if ((dv >= 0) !== (dw >= 0)) {
          const t = dv / (dv - dw); clipped.push(v.map((n, k) => n + t * (w[k] - n)));
        }
      }
      if (!surfaces.has(material)) surfaces.set(material, []);
      for (let j = 1; j < clipped.length - 1; j++) surfaces.get(material).push(...clipped[0], ...clipped[j + 1], ...clipped[j]);
    };
    // Each full-height mullion reaches its named supports: grade and roof deck.
    for (let col = 0; col < bays; col++) {
      const u0 = col / bays, u1 = (col + 1) / bays, gap = Math.min(mullion / length, (u1 - u0) * 0.15);
      patch('frame', u0, u0 + gap, 0, 171);
      for (let row = 0; row < levels.length - 1; row++) {
        const y0 = levels[row], y1 = levels[row + 1], h = row === 0 ? 0 : band;
        const hash = ((Math.imul(col + 11, 73856093) ^ Math.imul(row + 19, 19349663) ^ Math.imul(side + 5, 83492791)) >>> 0) % 31;
        let material = hash < 2 ? 'glassPale' : hash > 27 ? 'glassShade' : 'glass';
        if (row > 2 && hash === 5) material = 'glow';
        if (row === 0) material = 'roof';
        if (row === 1) material = 'glassShade';
        patch(material, u0 + gap, u1, y0 + h, y1);
        if (h) patch('frame', u0 + gap, u1, y0, y0 + h);
      }
    }

  });
  // Open crown rails and posts, all batched in the same material.
  const { posts, rails } = crownMembers(detail);
  for (const member of [...posts, ...rails]) b.bar('light', member.a, member.b, member.width, member.width);
  // True planar caps with correct winding; the bottom is explicitly closed.
  const triangles = THREE.ShapeUtils.triangulateShape(PLAN.map(([x, z]) => new THREE.Vector2(x, z)), []);
  const cap = (material, y, upward) => {
    const coords = [];
    for (const tri of triangles) for (const i of upward ? [...tri].reverse() : tri) coords.push(PLAN[i][0], typeof y === 'function' ? y(...PLAN[i]) : y, PLAN[i][1]);
    const g = new THREE.BufferGeometry();g.setAttribute('position', new THREE.Float32BufferAttribute(coords, 3));g.computeVertexNormals();b.put(g, material);
  };
  cap('roof', deckY, true); cap('roof', 0, false);
  // A 50 m mast is embedded from y=150, visible above the sloped crown. Taper
  // is modelled explicitly, not a thick spire or a generic pointed roof.
  const mast = new THREE.CylinderGeometry(0.12, 0.36, 50, near ? 10 : 6);
  mast.translate(0, 175, 0);b.put(mast, 'roof');
  for (const [material, positions] of surfaces) {
    const g = new THREE.BufferGeometry();g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));g.computeVertexNormals();b.put(g, material);
  }
  const model = b.finish();
  model.userData.identity = '170 m bevelled blue-glass tower with an open inclined crown rim and slender 200 m mast';
  return model;
}
