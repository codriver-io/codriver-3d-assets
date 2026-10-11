import * as THREE from 'three';
import { PLAN, H } from './marche-bonsecours-site.js';

// The drum and the silver dome of the Marché Bonsecours, centred on the central block: a stepped base, a 16-bay drum (a pilaster
// on every corner, an arched window on every face), an entablature, the ribbed tin dome (24 ribs near), a small lantern (pale stone core, slender columns) with a
// conical cap and a thin silver mast. Everything stands on the block cornice at H.block (18.8 m); heights are estimates read from photographs
// (docs/3d-quebec-marche-bonsecours.md). Authored in the facade frame like the rest.
export const DOME = {
  cu: 0, cv: PLAN.domeV,
  baseTop: 19.9,              // drum starts here (stepped base 18.8 .. 19.9)
  apothem: 7.3,               // drum face to axis (15 m across the pilasters)
  sills: 21.5, springs: 24.35, headTop: 25.0, // arched windows
  cornice: 25.5, eave: 26.9,  // entablature 25.5 .. 26.9
  ribBase: 27.5, ribRise: 7.7, ribR: 7.6, // dome shell
  lanternBase: 34.8, lanternTop: 39.2, capTop: 41.2, mastTip: 49.4,
};

const N_FACE = 16;

export function addDome(k, near) {
  const { box, cyl, ball, put, seg } = k;
  const { cu, cv } = DOME;
  const Rc = (a) => a / Math.cos(Math.PI / N_FACE); // circumradius of the 16-gon that has apothem a

  // stepped base and drum body (16-gon prisms; vertices on the pilaster corners)
  cyl('pale', cu, cv, Rc(7.75), Rc(7.75), H.block - 0.05, DOME.baseTop, N_FACE, false, 1);
  cyl('stone', cu, cv, Rc(DOME.apothem), Rc(DOME.apothem), DOME.baseTop - 0.05, DOME.cornice + 0.05, N_FACE, true, 1);
  cyl('pale', cu, cv, Rc(7.7), Rc(7.7), DOME.cornice, DOME.eave, N_FACE, false, 1);

  const at = (theta, r) => [cu + r * Math.sin(theta), cv + r * Math.cos(theta)];
  // pilasters on the corners (near) and the arched windows on the faces
  for (let i = 0; i < N_FACE; i++) {
    const th = (i * 2 * Math.PI) / N_FACE;
    if (near) {
      const g = new THREE.BoxGeometry(0.6, DOME.cornice - DOME.baseTop, 0.7);
      g.rotateY(th);
      const [x, z] = at(th, Rc(DOME.apothem) + 0.05);
      g.translate(x, (DOME.cornice + DOME.baseTop) / 2, z); put(g, 'pale');
    }
    const tm = th + Math.PI / N_FACE, off = DOME.apothem + 0.08;
    const w = 1.3, rise = 0.65, pts = [[-w / 2, DOME.sills], [w / 2, DOME.sills], [w / 2, DOME.headTop - rise]];
    const n = near ? 6 : 3;
    for (let j = 1; j < n; j++) { const t = (j / n) * Math.PI; pts.push([(w / 2) * Math.cos(t), DOME.headTop - rise + rise * Math.sin(t)]); }
    pts.push([-w / 2, DOME.headTop - rise]);
    const pane = new THREE.ShapeGeometry(new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y))), 1);
    pane.rotateY(tm); const [px, pz] = at(tm, off); pane.translate(px - 0, 0, pz); put(pane, 'glow');
    if (near) { // a centre mullion and a transom, flat quads 0.04 m off the pane
      const q = new THREE.PlaneGeometry(0.1, DOME.headTop - DOME.sills - 0.05); q.translate(0, (DOME.headTop + DOME.sills) / 2 - 0.02, 0);
      q.rotateY(tm); const [qx, qz] = at(tm, off + 0.04); q.translate(qx, 0, qz); put(q, 'metal');
      const t2 = new THREE.PlaneGeometry(w - 0.1, 0.1); t2.translate(0, DOME.headTop - rise - 0.05, 0);
      t2.rotateY(tm); t2.translate(qx, 0, qz); put(t2, 'metal');
    }
  }

  // eave ring and the ribbed tin dome: alternate columns are ribs and shallow grooves, so the shell reads as 24 ribs
  cyl('tin', cu, cv, 7.95, 7.95, DOME.eave - 0.05, DOME.ribBase + 0.05, near ? 24 : 12, false, 1);
  {
    const gores = near ? 24 : 12, rows = near ? 9 : 5, cols = gores * 2, tMax = (76 * Math.PI) / 180, groove = 0.1;
    const P = (c, j) => {
      const t = (j / rows) * tMax, r = DOME.ribR * Math.cos(t) - (c % 2 ? groove * Math.cos(t) : 0), phi = (c * Math.PI) / gores;
      const [x, z] = at(phi, r);
      return new THREE.Vector3(x, DOME.ribBase + DOME.ribRise * Math.sin(t), z);
    };
    const pos = [];
    const tri = (a, b, c) => {
      const n = new THREE.Vector3().subVectors(b, a).cross(new THREE.Vector3().subVectors(c, a));
      const mid = new THREE.Vector3().add(a).add(b).add(c).multiplyScalar(1 / 3);
      const out = new THREE.Vector3(mid.x - cu, 0.35, mid.z - cv);
      if (n.dot(out) < 0) [b, c] = [c, b];
      pos.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
    };
    for (let c = 0; c < cols; c++) for (let j = 0; j < rows; j++) {
      const a = P(c, j), b = P((c + 1) % cols, j), d = P(c, j + 1), e = P((c + 1) % cols, j + 1);
      tri(a, b, d); tri(b, e, d);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.computeVertexNormals();
    put(g, 'tin');
  }

  // lantern: pedestal, a pale stone core with eight slender columns round it, entablature, conical cap, ball and mast. Photographs show a
  // pale stone lantern: the core is stone, and only eight narrow slits between the columns carry the 'lamp' material (dark by day, lit at night).
  const lb = DOME.lanternBase, lbTop = DOME.lanternTop - 0.6;
  cyl('pale', cu, cv, 2.15, 2.15, lb, lb + 0.8, 12, false, 0.67);
  cyl('pale', cu, cv, 1.55, 1.55, lb + 0.8, lbTop, 8, true, 0.5);
  for (let i = 0; i < 8; i++) {
    const th = (i * Math.PI) / 4, [x, z] = at(th, 1.7);
    cyl('pale', x, z, 0.15, 0.15, lb + 0.8, lbTop, 5, false, 0.6);
    if (near) { // a slit on the core face between two columns (apothem 1.43 m), 4 cm proud
      const tm = th + Math.PI / 8, q = new THREE.PlaneGeometry(0.6, 2.1);
      q.translate(0, lb + 0.8 + 0.35 + 1.05, 0); q.rotateY(tm);
      const [qx, qz] = at(tm, 1.55 * Math.cos(Math.PI / 8) + 0.04); q.translate(qx, 0, qz); put(q, 'lamp');
    }
  }
  cyl('pale', cu, cv, 2.15, 2.15, lbTop, DOME.lanternTop, 12, false, 0.67);
  cyl('tin', cu, cv, 2.0, 0.3, DOME.lanternTop, DOME.capTop, 12, false, 0.5);
  ball('tin', cu, DOME.capTop + 0.15, cv, 0.3);
  cyl('tin', cu, cv, 0.07, 0.07, DOME.capTop, DOME.mastTip, 5, false, 0.6); // the silver spire, the dome's metal
}
