import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { ROT, SLAB, QuadBatch, armPrism, annexMass, annexWindows } from './cathedral-of-saint-mary-parts.js';

const { towerHalf: Tw, finTip: Zf, finHalf: C, wallTop: Yw, finTop: Yf, crossBase: Yc, slabTop: Y0, slabBottom: Ys, blockHalf: Hb } = SPEC;

// Authored in the grid frame (u east, v south, rotated 9.1 deg); `add` rotates it into local metres.
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near', b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const add = (g, mat) => { g.rotateY(ROT); b.put(g, mat); };
  const box = (mat, cx, cy, cz, sx, sy, sz) => { const g = new THREE.BoxGeometry(sx, sy, sz); g.translate(cx, cy, cz); add(g, mat); };
  const dark = near ? 'stoneDark' : 'stone', bronze = 'bronze';
  const quarter = (g, k) => { g.rotateY(k * Math.PI / 2); return g; };

  // --- Roof slab: the cantilevered 77 m square roof of the ground floor (mapped roof outline).
  box('slab', (SLAB.u0 + SLAB.u1) / 2, (Ys + Y0) / 2, (SLAB.v0 + SLAB.v1) / 2, SLAB.u1 - SLAB.u0, Y0 - Ys, SLAB.v1 - SLAB.v0);

  // --- Ground block: glazed core inset 1.2 m, travertine piers and set-back panels in front of it, an entrance bay in each face.
  const gi = Hb - 1.2, gz = gi + 0.06; // glass plane and the plane 0.06 m in front of it
  box('glass', 0, Ys / 2, 0, 2 * gi, Ys - 0.05, 2 * gi);
  for (let k = 0; k < 4; k++) {
    const piece = (u0, u1, depth, mat, off = 0) => { const g = new THREE.BoxGeometry(u1 - u0, Ys, depth); g.translate((u0 + u1) / 2, Ys / 2, Hb - off - depth / 2); add(quarter(g, k), mat); };
    for (const s of [-1, 1]) {
      const m = (a, c) => (s < 0 ? [-c, -a] : [a, c]);
      piece(...m(4.7, 6.7), 1.2, dark);        // narrow pier beside the doors
      piece(...m(6.7, 15.7), 0.6, 'stone', 0.6); // travertine panel, set back 0.6 m
      piece(...m(15.7, 20.7), 1.2, 'stone');   // wide pier
    }
    const lintel = new THREE.BoxGeometry(9.4, 0.5, 1.2); lintel.translate(0, Ys - 0.25, Hb - 0.6); if (near) add(quarter(lintel, k), dark);
    const joints = new QuadBatch(), glassBars = new QuadBatch(), leaves = new QuadBatch(), relief = new QuadBatch(), ribs = new QuadBatch();
    if (near) {
      const ys = []; for (let y = 1.2; y < Ys - 0.3; y += 1.2) ys.push(y);
      for (const s of [-1, 1]) {
        const x = (a, c) => (s < 0 ? [-c, -a] : [a, c]);
        for (const y of ys) { // travertine courses (1.2 m) on the panel, the wide pier and the narrow pier
          joints.face(...[x(6.7, 15.7)[0], y - 0.04, x(6.7, 15.7)[1], y + 0.04], Hb - 0.6 + 0.05);
          joints.face(...[x(15.7, 20.7)[0], y - 0.04, x(15.7, 20.7)[1], y + 0.04], Hb + 0.05);
          joints.face(...[x(4.7, 6.7)[0], y - 0.04, x(4.7, 6.7)[1], y + 0.04], Hb + 0.05);
        }
        for (const px of [8.95, 11.2, 13.45]) joints.face(s * px - 0.04, 0.1, s * px + 0.04, Ys - 0.3, Hb - 0.6 + 0.05);
        joints.face(s * 18.2 - 0.04, 0.1, s * 18.2 + 0.04, Ys - 0.3, Hb + 0.05);
        // glazing grid on the wing: mullions every 2.4 m and two transoms
        for (let px = 23.1; px < gi - 0.5; px += 2.4) glassBars.face(s * px - 0.07, 0.2, s * px + 0.07, Ys - 0.25, gz);
        for (const y of [3.6, 7.2]) glassBars.face(...[x(20.7, gi)[0], y - 0.07, x(20.7, gi)[1], y + 0.07], gz);
      }
      // entrance bay: four bronze door leaves, a transom, a relief panel with ribs (east face), or glazing with a grid (other faces)
      if (k === 1) {
        for (let i = 0; i < 4; i++) leaves.face(-4.5 + i * 2.25 + 0.07, 0.15, -4.5 + (i + 1) * 2.25 - 0.07, 4.6, gz);
        relief.face(-4.5, 4.9, 4.5, 10.0, gz);
        for (let i = 0; i < 5; i++) ribs.face(-3.6 + i * 1.8 - 0.14, 5.1, -3.6 + i * 1.8 + 0.14, 9.8, gz + 0.05);
        joints.face(-4.5, 4.6, 4.5, 4.9, gz); // transom between doors and relief
        for (const px of [-4.5, 0, 4.5]) joints.face(px - 0.08, 0.15, px + 0.08, 4.6, gz + 0.04);
      } else {
        for (const px of [-2.25, 0, 2.25]) glassBars.face(px - 0.07, 0.2, px + 0.07, Ys - 0.6, gz);
        for (const y of [3.6, 7.2]) glassBars.face(-4.5, y - 0.07, 4.5, y + 0.07, gz);
      }
      for (const [q, mat] of [[joints, 'stoneDark'], [glassBars, 'stoneDark'], [leaves, 'bronze'], [relief, 'bronzeLight'], [ribs, 'bronze']]) if (!q.empty) add(quarter(q.geometry(), k), mat);
    } else if (k === 1) { // far: one bronze door bay, nothing black
      const g = new THREE.BoxGeometry(9, 9.8, 0.4); g.translate(0, 5.05, gi + 0.1); add(quarter(g, k), bronze);
    }
  }

  // Eight shell segments form four continuous saddle quadrants, rising
  // from slab-level corners to the high fins and the central glass cross.
  // Each shell has a closed 35 cm edge/soffit, so street views see no back faces.
  const shells = new QuadBatch(), N = near ? 22 : 8;
  const point = (u, v, lower = false) => {
    const A = [C, Yc, C], B = [C, Yf, Zf], D = [Tw, Y0, Tw], E = [Zf, Yf, C];
    return A.map((x, i) => x * (1-u) * (1-v) + B[i] * (1-u) * v + D[i] * u * v + E[i] * u * (1-v) - (i === 1 && lower ? .35 : 0));
  };
  for (let k = 0; k < 4; k++) {
    const turn = ([x,y,z]) => { const a = k*Math.PI/2; return [x*Math.cos(a)+z*Math.sin(a),y,-x*Math.sin(a)+z*Math.cos(a)]; };
    const at = (u,v,lower=false) => turn(point(u,v,lower));
    for (let i=0;i<N;i++) for(let j=0;j<N;j++) {
      const u=i/N,U=(i+1)/N,v=j/N,V=(j+1)/N;
      shells.quad(at(u,v),at(u,V),at(U,V),at(U,v));
      shells.quad(at(u,v,true),at(U,v,true),at(U,V,true),at(u,V,true));
    }
    for (let i=0;i<N;i++) {
      const u=i/N,U=(i+1)/N;
      shells.quad(at(u,1),at(u,1,true),at(U,1,true),at(U,1));
      shells.quad(at(1,u),at(1,U),at(1,U,true),at(1,u,true));
    }
  }
  add(shells.geometry(), 'stone');

  // --- The cross of the summit: a stone hub on the crossing and four arms (stone jambs round a recessed glass core) whose tops
  // climb from the hub to the fins; the glass strips and the slots are the cores.
  const hub = new THREE.BoxGeometry(2 * C, Yc - (Y0 - 0.15), 2 * C); hub.translate(0, (Yc + Y0 - 0.15) / 2, 0); add(hub, 'stone');
  for (const axis of ['z', 'x']) for (const sign of [-1, 1]) {
    for (const lat of [-1.225, 1.225]) add(armPrism({ axis, sign, thick: 0.85, lat }), 'stone');
    add(armPrism({ axis, sign, thick: 1.6, lat: 0, r1: Zf - 0.25, drop: 0.12, y0: 14.2 }), 'glow');
    const sill = new THREE.BoxGeometry(1.6, 14.2 - (Y0 - 0.15), 2.6); sill.translate(0, (14.2 + Y0 - 0.15) / 2, Zf - 1.3); // under the slot, up to the fin face
    if (axis === 'x') sill.rotateY(-Math.PI / 2); if (sign < 0) sill.rotateY(Math.PI); add(sill, 'stone');
  }

  // --- The dark metal cross on the hub (16.8 m class: 55 ft, 58 m summit).
  const t = near ? 0.32 : 0.6;
  box('metal', 0, (Yc + 58) / 2, 0, t, 58 - Yc, t);
  box('metal', 0, 54.6, 0, near ? 5.2 : 6, t, t);

  // --- Annex mass (parish buildings south of the cathedral), three storeys, with its windows.
  add(annexMass(), 'annex');
  add(annexWindows(), 'glass');
  return b.finish();
}
