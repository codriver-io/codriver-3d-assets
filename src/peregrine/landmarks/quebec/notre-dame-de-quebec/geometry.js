import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { PLAN } from './notre-dame-de-quebec-plan.js';
import { makeKit } from './notre-dame-de-quebec-kit.js';
import { buildFront, buildTowers } from './notre-dame-de-quebec-front.js';

// Basilique-cathédrale Notre-Dame de Québec: an original procedural model. The plan is the mapped outline and building parts (OSM way
// 103862161); heights, pitches and window rhythm are read from photographs (docs/3d-quebec-notre-dame-de-quebec.md). Authoring frame:
// u east along the nave, y up, w south, origin at the outline's centroid; one 1.3 deg turn onto the mapped nave axis at the end.
const P = PLAN;
const CW = (P.nave.w0 + P.nave.w1) / 2; // nave axis, w = -1.45

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const K = makeKit(b, near);
  const { box, solid, opening, put } = K;
  buildFront(K);
  buildTowers(K);
  buildNave(K);
  buildAisles(K);
  buildEast(K);

  // ---- rotate the whole model onto the mapped axis (u east -> bearing 91.3 deg), once ----
  const root = b.finish();
  const phi = THREE.MathUtils.degToRad(SPEC.rotationDeg);
  root.traverse((o) => { if (o.isMesh) { o.geometry.rotateY(-phi); dropGroundFaces(o.geometry); o.geometry.computeBoundingBox(); o.geometry.computeBoundingSphere(); } });
  return root;
}

function buildNave(K) {
  const { near, box, solid, put } = K, n = P.nave, a = P.apse;
  box('stone', n.u0, n.u1, 0, n.eave, n.w0, n.w1);
  K.gable('copper', 'u', n.u0, n.u1, n.w0, n.w1, n.eave, n.ridge - n.eave);
  // roof ridge cap and, near, the standing seams of the copper
  box('seam', n.u0, n.u1, n.ridge - 0.1, n.ridge + 0.2, CW - 0.18, CW + 0.18);
  if (near) {
    const ye = n.eave - 0.3, yt = n.ridge, over = 0.35, dN = CW - (n.w0 - over), L = Math.hypot(yt - ye, dN), nz = (yt - ye) / L, ny = dN / L;
    for (let u = n.u0 + 1.4; u < n.u1 - 0.6; u += 1.9) {
      for (const s of [-1, 1]) {
        const wE = CW + s * (dN), off = 0.05, h = 0.07;
        const q = [[u - h, ye, wE], [u + h, ye, wE], [u + h, yt, CW], [u - h, yt, CW]].map(([x, y, z]) => [x, y + ny * off, z + s * nz * off]);
        solid('seam', [q], [u, ye - 2, CW]);
      }
    }
  }
  // apse: a half-drum with a half-cone roof continuing the nave's pitch, closed under its eaves
  const wall = new THREE.CylinderGeometry(a.r, a.r, n.eave - 14.8, near ? 14 : 8, 1, true, 0, Math.PI);
  wall.translate(a.cu, (n.eave + 14.8) / 2, a.cw); put(wall, 'stone');
  const roofH = n.ridge - (n.eave - 0.3), cone = new THREE.ConeGeometry(a.r + 0.35, roofH, near ? 14 : 8, 1, true, 0, Math.PI);
  cone.translate(a.cu, n.eave - 0.3 + roofH / 2, a.cw); put(cone, 'copper');
  const soffit = new THREE.RingGeometry(a.r - 0.2, a.r + 0.35, near ? 14 : 8, 1, -Math.PI / 2, Math.PI);
  soffit.rotateX(Math.PI / 2); soffit.translate(a.cu, n.eave - 0.3, a.cw); put(soffit, 'copper');
}

function buildAisles(K) {
  const { near, box, solid, opening } = K, A = P.aisle, n = P.nave;
  const sides = [
    { face: 'N', wO: A.wNorth, wI: n.w0 + 0.1, u1: A.uN1 }, // north aisle: outer wall at w = -17.6
    { face: 'S', wO: A.wSouth, wI: n.w1 - 0.1, u1: A.uS1 }, // south aisle: outer wall at w = 15.4
  ];
  for (const { face, wO, wI, u1 } of sides) {
    const u0 = A.u0, mid = (u0 + u1) / 2, wm = (wO + wI) / 2, eave = A.eave, high = A.high;
    // walls and end caps (stone), lean-to roof (slate): one closed solid
    solid('stone', [
      [[u0, 0, wO], [u1, 0, wO], [u1, eave, wO], [u0, eave, wO]],
      [[u0, 0, wO], [u0, eave, wO], [u0, high, wI], [u0, 0, wI]],
      [[u1, 0, wO], [u1, eave, wO], [u1, high, wI], [u1, 0, wI]],
    ], [mid, 5, wm]);
    solid('slate', [[[u0, eave, wO], [u1, eave, wO], [u1, high, wI], [u0, high, wI]]], [mid, 4, wm]);
    const s = face === 'N' ? -1 : 1;
    // plinth, eaves cornice
    const plinth = (ua, ub) => box('trim', ua, ub, 0, 0.6, s < 0 ? wO - 0.2 : wO - 0.1, s < 0 ? wO + 0.1 : wO + 0.2);
    if (face === 'N') { plinth(u0, -18.4); plinth(-8.3, u1); } else plinth(u0, u1); // the north plinth stops at the vestibule block
    box('trim', u0, u1, eave - 0.55, eave + 0.15, s < 0 ? wO - 0.35 : wO - 0.1, s < 0 ? wO + 0.1 : wO + 0.35);
    // two storeys of tall arched windows between pilasters
    const count = Math.floor((u1 - u0 - 1.4) / 4.3);
    for (let i = 0; i < count; i++) {
      const uc = u0 + 2.4 + i * 4.3;
      opening(face, wO, uc, 2.6, 1.7, 4.2, { ring: 0.32 });
      if (near) opening(face, wO, uc, 8.0, 1.4, 2.6, { ring: 0.28 });
      else opening(face, wO, uc, 8.0, 1.4, 2.6, { ring: 0 });
      if (near && i < count - 1) box('trim', uc + 2.15 - 0.25, uc + 2.15 + 0.25, 0.6, eave - 0.55, s < 0 ? wO - 0.25 : wO - 0.1, s < 0 ? wO + 0.1 : wO + 0.25);
    }
  }
  // the door in the north-west corner of the nave's flank and the small stair turret at the south aisle: left out (see docs)
}

function buildEast(K) {
  const { near, box, hip, opening, put } = K;
  // the ambulatory behind the apse: a solid block under a flat slate roof; the apse's upper drum and roof rise out of it
  box('stone', 14.6, 21.9, 0, 14.85, P.nave.w0 + 0.1, P.nave.w1 - 0.1);
  box('slate', 14.6, 21.9, 14.85, 15.0, P.nave.w0 + 0.1, P.nave.w1 - 0.1);
  // chevet shell (low, under a copper hip), its polygonal apse bump, north-east chapel (copper hip), south-east sacristy block (dark hip)
  box('stone', 21.8, 27.7, 0, 11.0, -7.5, 5.6);
  hip('copper', 21.8, 27.7, -7.5, 5.6, 11.0, 3.0, 0.05, 0.3);
  const chevet = [[27.6, -3.1], [29.1, -3.2], [30.1, -2.5], [30.3, 0.3], [29.2, 0.8], [27.6, 0.7]];
  K.prism('stone', chevet, 0, 9.0); K.prism('slate', chevet, 9.0, 9.15);
  box('stone', 21.8, 29.4, 0, 12.0, -17.9, -7.5);
  hip('copper', 21.8, 29.4, -17.9, -7.5, 12.0, 4.0, 0.05, 0.3);
  box('stone', 24.3, 49.1, 0, 12.5, 6.8, 19.8);
  hip('slate', 24.3, 49.1, 6.8, 19.8, 12.5, 3.2, 0.1, 0.3);
  box('stone', 34.6, 43.9, 0, 8.5, 3.8, 6.9);
  box('slate', 34.6, 43.9, 8.5, 8.65, 3.8, 6.9);
  // the low projection on the north flank (the mapped outline's bump at u -18 to -9, w -26 to -18): a vestibule block under a flat slate roof
  const bump = [[-18.0, -17.5], [-17.8, -22.3], [-14.9, -24.5], [-14.9, -25.9], [-11.2, -25.9], [-11.3, -24.5], [-8.8, -21.9], [-8.7, -17.5]];
  K.prism('stone', bump, 0, 8.6); K.prism('slate', bump, 8.6, 8.75);
  // plain rows of windows on the exposed walls (rectangular, three storeys on the blocks)
  const rows = near ? [1.6, 5.4, 9.2] : [3.0, 8.0];
  const rowH = near ? 2.2 : 3.0;
  const row = (face, p, centres, w) => { for (const y of rows) for (const a of centres) opening(face, p, a, y, w, rowH, { arch: false, ring: 0 }); };
  const evenly = (from, to, step) => { const out = []; for (let x = from; x <= to + 1e-6; x += step) out.push(x); return out; };
  row('S', 19.8, evenly(26.6, 47, 3.6), 1.3); // south-east block, rue de Buade side
  row('E', 49.1, evenly(8.6, 18.2, 3.2), 1.3);
  row('N', -17.9, [24.2, 27.0], 1.3); // north-east chapel
  row('E', 29.4, [-16.0, -12.6, -9.2], 1.3);
  row('E', 27.7, [-5.6, 2.2, 4.6], 1.3); // chevet
}

// Drop the downward faces that rest on the ground (y <= 1 cm): they are under the building, and where a trim box starts on the same plane
// as a stone box they were coplanar overlaps of different materials.
function dropGroundFaces(g) {
  const p = g.attributes.position, n = g.attributes.normal, idx = g.index, count = idx ? idx.count : p.count, at = (i) => (idx ? idx.getX(i) : i), keep = [];
  for (let i = 0; i < count; i += 3) {
    const a = at(i), c = at(i + 1), d = at(i + 2);
    if (n.getY(a) < -0.9 && p.getY(a) < 0.01 && p.getY(c) < 0.01 && p.getY(d) < 0.01) continue;
    keep.push(a, c, d);
  }
  g.setIndex(keep);
}
