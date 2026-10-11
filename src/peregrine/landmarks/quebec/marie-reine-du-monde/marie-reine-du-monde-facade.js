import * as THREE from 'three';
import { LEVELS as L } from './marie-reine-du-monde-plan.js';

// The façade on boulevard René-Lévesque (building axes, façade toward +z): a 55 m wide block with two end piers carrying arched portals, a portico of ten
// giant Corinthian columns (coupled in the middle, under a low pediment) in front of a wall with three doors and a row of arched windows, a copper-lined cornice,
// an attic with rectangular windows, a balustrade course carrying the thirteen copper statues of the patron saints, and a broad stair.
export const FACADE = {
  halfWidth: 27.5,
  backZ: 56.3, // rear of the façade block, where the nave begins
  wallZ: 60.8, // the portico's back wall
  colZ: 63.2, // column axes
  colR: 0.82,
  colX: [2.9, 6.6, 8.5, 13.0, 18.6], // each mirrored: ten columns, coupled at 6.6 / 8.5
  pierX: 21.9,
  frontZ: 64.7, // entablature front
  corniceZ: 65.3,
  floorZ: 64.8, // portico floor edge, where the stair starts
  base: 2.25, // column plinth top
  capTop: 18.4, // abacus top = entablature bottom
  corniceBase: 20.5,
  corniceTop: 21.1,
  atticFrontZ: 63.4,
  atticTop: 26.2,
  pedimentRise: 4.0,
  pedimentHalf: 7.9,
  statueX: [0, 2.6, 5.9, 7.8, 11.8, 17.2, 23.0], // thirteen statues: these and their mirror images
};

export function buildFacade(k) {
  const { near } = k, F = FACADE, W = F.halfWidth, fl = L.platform;
  const sides = [-1, 1];

  // The mapped outline cuts the façade block's corners at 45 degrees (x + z = 91.8 in front, a steeper cut behind): the plan pieces below follow it.
  const cut = (xs, zf) => Math.max(0, xs + zf - 91.8);
  const plan = (xs, z0, zf, rear = 0) => { // x in [-xs, xs], z0..zf, front corners cut by cut(xs, zf), rear corners cut by `rear` (x 2.5, z 1.9 as mapped)
    const c = cut(xs, zf), pts = [];
    pts.push([-xs + (rear ? 2.5 : 0), z0], [xs - (rear ? 2.5 : 0), z0]);
    if (rear) pts.push([xs, z0 + 1.9]);
    pts.push([xs, zf - c], [xs - c, zf], [-xs + c, zf], [-xs, zf - c]);
    if (rear) pts.push([-xs, z0 + 1.9]);
    return pts;
  };
  // Block behind the portico, the attic, and the entablature with its copper-lined cornice.
  k.extrudePoly('stone', plan(W, F.backZ, F.wallZ, true), 0, F.atticTop, { top: false });
  k.box('stone', -W, W, F.corniceTop, F.atticTop, F.wallZ, F.atticFrontZ, 'YZ');
  k.extrudePoly('stone', plan(W, F.wallZ, F.frontZ), F.capTop, F.corniceBase, { top: false, bottom: true });
  k.extrudePoly('bronze', plan(W, F.wallZ, F.corniceZ), F.corniceBase, F.corniceTop, { bottom: true });
  // The copper-lined cornice wraps the block's end walls (photograph: it runs around the corner and back along the side).
  for (const sg of sides) k.box('bronze', Math.min(sg * W, sg * (W + 0.55)), Math.max(sg * W, sg * (W + 0.55)), F.corniceBase, F.corniceTop, 58.2, 64.3, sg > 0 ? 'X' : 'x');
  // Roof cornice under the statues (top at the OSM part height, 27 m).
  k.extrudePoly('stone', plan(W + 0.35, F.backZ - 0.4, F.atticFrontZ + 0.5, true), F.atticTop, L.facade, { bottom: true });
  // Portico floor, end piers.
  k.extrudePoly('stone', plan(W, F.wallZ, F.floorZ), 0, fl);
  for (const sg of sides) {
    const c = cut(W, F.frontZ);
    k.extrudePoly('stone', [[sg * F.pierX, F.wallZ], [sg * F.pierX, F.frontZ], [sg * (W - c), F.frontZ], [sg * W, F.frontZ - c], [sg * W, F.wallZ]], fl, F.capTop, { top: false });
  }

  // Stair: five risers across the width, the middle flight (the mapped bump) projecting 2.3 m further.
  const stair = (x0, x1, zEnd) => {
    const steps = 5, run = (zEnd - F.floorZ) / steps, rise = fl / steps, prof = [[zEnd, 0]];
    for (let i = 1; i <= steps; i++) prof.push([zEnd - (i - 1) * run, i * rise], [zEnd - i * run, i * rise]);
    prof.push([F.floorZ, 0]);
    const g = new THREE.ExtrudeGeometry(new THREE.Shape(prof.map(([z, y]) => new THREE.Vector2(z, y))), { depth: x1 - x0, bevelEnabled: false, steps: 1 });
    g.rotateY(-Math.PI / 2); g.translate(x1, 0, 0); // shape x -> +z, extrusion -> -x
    k.put(g, 'stone');
  };
  stair(-F.pedimentHalf, F.pedimentHalf, 68.9);
  stair(F.pedimentHalf, 25.2, 66.6);
  stair(-25.2, -F.pedimentHalf, 66.6);

  // Giant Corinthian columns: plinth, tapering shaft, flared capital with abacus.
  for (const sg of sides) for (const x of F.colX) {
    const cx = sg * x, cz = F.colZ;
    k.box('stone', cx - 1.0, cx + 1.0, fl, F.base, cz - 1.0, cz + 1.0, 'Y');
    k.prism('stone', cx, cz, F.colR, near ? 12 : 6, F.base, F.capTop - 1.4, 0, F.colR * 0.9, '');
    k.prism('stone', cx, cz, F.colR * 0.9, near ? 12 : 6, F.capTop - 1.4, F.capTop - 0.45, 0, F.colR * 1.25, '');
    k.box('stone', cx - 1.2, cx + 1.2, F.capTop - 0.45, F.capTop, cz - 1.2, cz + 1.2, 'Yy');
  }

  // Pediment over the middle four columns (OSM porch part: 21 to 25 m), with a copper-lined raking cornice.
  const P = k.frame(0, 0, Math.PI / 2), pz0 = F.wallZ + 0.3, pz1 = F.corniceZ;
  P.pediment('stone', -F.pedimentHalf, F.pedimentHalf, F.corniceTop, F.pedimentRise, pz0, pz1);
  for (const sg of sides) k.bar('bronze', [sg * F.pedimentHalf, F.corniceTop + 0.15, pz1], [0, F.corniceTop + F.pedimentRise + 0.05, pz1], 0.5, 0.7);

  // The thirteen statues of the patron saints stand on the cornice.
  for (const x of F.statueX) for (const sg of x === 0 ? [1] : sides) k.statue(sg * x, L.facade, F.atticFrontZ - 1.1);

  // Wall openings: three doors, a window row above, arched portals in the end piers; attic windows. Offsets are 0.15 m (large surfaces).
  const wall = k.frame(0, F.wallZ, Math.PI / 2), front = k.frame(0, F.frontZ, Math.PI / 2), attic = k.frame(0, F.atticFrontZ, Math.PI / 2);
  wall.arch('glass', 0, fl, 3.4, 6.6, 0.15);
  for (const sg of sides) {
    wall.arch('glass', sg * 4.9, fl, 2.4, 5.4, 0.15);
    for (const x of [4.9, 10.75, 15.8, 20.3]) wall.arch('glow', sg * x, 9.2, 1.7, 4.6, 0.15);
    for (const x of [10.75, 15.8, 20.3]) wall.arch('glow', sg * x, fl + 0.9, 1.5, 3.4, 0.15);
    front.arch('glass', sg * 24.7, fl, 2.8, 7.4, 0.15);
    front.arch('glow', sg * 24.7, 10.4, 1.8, 4.6, 0.15);
    for (const x of [21.0, 14.8, 10.3]) attic.quad('glow', sg * x - 0.75, sg * x + 0.75, F.corniceTop + 1.0, F.atticTop - 1.0, 0.15);
  }
  // window hoods, and engaged pilasters framing the end piers
  for (const sg of sides) {
    for (const x of [4.9, 10.75, 15.8, 20.3]) wall.box('stone', sg * x - 1.15, sg * x + 1.15, 13.9, 14.3, -0.05, 0.4, 'Z');
    front.box('stone', sg * 24.7 - 1.15, sg * 24.7 + 1.15, 15.1, 15.5, -0.05, 0.4, 'Z');
    for (const x of [F.pierX + 0.45, W - 0.85]) {
      front.box('stone', sg * x - 0.55, sg * x + 0.55, fl, F.capTop - 1.0, -0.1, 0.45, 'YZ');
      front.box('stone', sg * x - 0.75, sg * x + 0.75, F.capTop - 1.0, F.capTop, -0.1, 0.6, 'Z');
    }
  }
  // pilaster strips on the attic above the columns
  if (near) for (const sg of sides) for (const x of F.colX) attic.box('stone', sg * x - 0.5, sg * x + 0.5, F.corniceTop, F.atticTop, -0.1, 0.4, 'YZ');
  // end walls of the façade block: two arched windows and a tall narrow attic window on the straight part of the wall (z 58.2 to 64.3)
  for (const sg of sides) {
    const E = sg > 0 ? k.frame(W, F.frontZ, 0) : k.frame(-W, F.backZ, Math.PI), at = (z) => (sg > 0 ? F.frontZ - z : z - F.backZ);
    for (const z of [59.5, 62.4]) { E.arch('glow', at(z), 9.0, 1.8, 5.0, 0.15); E.arch('glass', at(z), fl, 1.8, 4.6, 0.15); }
    E.quad('glow', at(59.5) - 0.7, at(59.5) + 0.7, F.corniceTop + 1.0, F.atticTop - 1.0, 0.15);
  }
}
