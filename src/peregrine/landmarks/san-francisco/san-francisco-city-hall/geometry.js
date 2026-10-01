import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { makeKit } from './san-francisco-city-hall-kit.js';
import { PLAN as P, LEVELS as L } from './san-francisco-city-hall-plan.js';
import { wing, pavilion, centralPavilion, parapet } from './san-francisco-city-hall-facade.js';
import { buildRotunda } from './san-francisco-city-hall-dome.js';

// San Francisco City Hall (Arthur Brown Jr., 1915): a granite Beaux-Arts block with Doric colonnades,
// a pedimented portico on each main front (Polk Street east, Van Ness Avenue west), a gabled roof spine
// across the middle, and the 93.7 m slate dome with gilded ribs and lantern over the rotunda.
// Authored in building axes (x toward the Polk front) and rotated once by SPEC.rotationDeg in the kit.

const stepsFor = (depth) => ({ top: 1.8, list: [[0.6, depth], [1.2, depth * 2 / 3], [1.8, depth / 3]] });

/** Four-sided truncated hip roof: bottom rectangle [x0,x1]x[z0,z1] at y0, top rectangle at y1, inset by `inset`. */
function hipRoofGeometry(x0, x1, z0, z1, y0, y1, inset) {
  const B = [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], T = [[x0 + inset, y1, z0 + inset], [x1 - inset, y1, z0 + inset], [x1 - inset, y1, z1 - inset], [x0 + inset, y1, z1 - inset]];
  const pos = [], idx = [];
  [...B, ...T].forEach((v) => pos.push(...v));
  for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; idx.push(i, j + 4, j, i, i + 4, j + 4); } // sloped faces, outward
  idx.push(4, 6, 5, 4, 7, 6); // flat top, up
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx);
  return flat(g);
}
function flat(g) { const n = g.toNonIndexed(); n.computeVertexNormals(); const i = Array.from({ length: n.attributes.position.count }, (_, k) => k); n.setIndex(i); return n; }

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const k = makeKit(b, (SPEC.rotationDeg * Math.PI) / 180, near);
  const E = k.frame(P.planeE, 0, 0), W = k.frame(P.planeW, 0, Math.PI), N = k.frame(P.centerX, -P.planeN, -Math.PI / 2), S = k.frame(P.centerX, P.planeN, Math.PI / 2);
  const [dx, dz] = P.dome;

  // The two main fronts: portico, colonnaded wings, end pavilions.
  for (const [F, q, depth, qEnd] of [[E, 1.25, 2.5, 1.2], [W, 2.05, 5.7, 1.15]]) {
    centralPavilion(F, near, q, stepsFor(depth));
    for (const sg of [-1, 1]) {
      const a = sg * P.centralHalf, c = sg * P.endFrom, e = sg * P.endZ;
      wing(F, near, Math.min(a, c), Math.max(a, c));
      pavilion(F, near, Math.min(c, e), Math.max(c, e), qEnd, { cols: 2, rise: 2.2 });
      parapet(F, Math.min(c, e), Math.max(c, e));
      wing(F, near, Math.min(e, sg * P.cornerZ), Math.max(e, sg * P.cornerZ)); // the short return to the corner notch
    }
  }
  // The long sides (Grove and McAllister): a middle colonnade between two pedimented pavilions.
  for (const F of [N, S]) {
    wing(F, near, -P.sideInner, P.sideInner);
    for (const sg of [-1, 1]) {
      const a = sg * P.sideInner, c = sg * P.sidePavTo, e = sg * P.sideEnd;
      pavilion(F, near, Math.min(a, c), Math.max(a, c), 2.2, { cols: 4, rise: 2.6 });
      parapet(F, Math.min(a, c), Math.max(a, c));
      wing(F, near, Math.min(c, e), Math.max(c, e), -1.0);
    }
  }

  // Hidden mass, the wing roof, the roof spine and the square block under the drum.
  k.wbox('stone', -38.5, 39.0, 0, 24.5, -56, 56);
  k.put(hipRoofGeometry(-40.85, 41.55, -59.7, 59.7, 25.2, 28.2, 8.8), 'roof');
  const eave = L.spineEave, armHalf = 15;
  k.wbox('stone', 16, 40.5, 24, eave, -armHalf, armHalf);
  k.wbox('stone', -40, -16, 24, eave, -armHalf, armHalf);
  E.pediment('stone', -armHalf - 0.3, armHalf + 0.3, eave - 0.2, L.spineRise + 0.2, -27.55, -3.25);
  W.pediment('stone', -armHalf - 0.3, armHalf + 0.3, eave - 0.2, L.spineRise + 0.2, -26.65, -2.85);
  k.wbox('stone', dx - 19, dx + 19, 20, 32.6, dz - 19, dz + 19);
  k.wbox('stone', dx - 19.4, dx + 19.4, 31.7, 33.0, dz - 19.4, dz + 19.4);
  for (const [fz, phi] of [[dz - 19.4, -Math.PI / 2], [dz + 19.4, Math.PI / 2]]) { // arched windows on the block's long sides
    const F = k.frame(dx, fz, phi);
    F.arch('glass', 0, 22.6, 7.6, 9.6, 0.06);
  }

  buildRotunda(k, near, dx, dz);
  return b.finish();
}
