// The stables complex (E. J. Lennox, 1905-06), 330 Walmer Road: red brick with cream limestone
// dressings, tile roofs, round corner turrets, and the tall crenellated water tower, the one
// part of Casa Loma a driver on Walmer Road sees before the castle. Same plan frame as the
// castle; heights are estimated from photographs.
import { STABLES_RING } from './casa-loma-site.js';

// Rectangles sit inside the mapped ring: the long wing narrows toward the castle, the north range is notched.
export const STABLE_BLOCKS = [
  { id: 'long wing, wide', u: [-101.0, -92.0], v: [-164.4, -137.9], top: 5.8, roof: { kind: 'hip', rise: 4.4, inset: 0.3 } },
  { id: 'long wing, narrow', u: [-101.0, -94.9], v: [-137.9, -105.4], top: 5.6, roof: { kind: 'hip', rise: 3.4, inset: 0.3 } },
  { id: 'front range', u: [-100.6, -71.6], v: [-176.6, -164.9], top: 6.0, roof: { kind: 'hip', rise: 4.8, inset: 0.3 } },
  { id: 'north range', u: [-86.0, -69.9], v: [-190.6, -176.6], top: 6.2, roof: { kind: 'hip', rise: 5.0, inset: 0.3 } },
  { id: 'north-east range', u: [-77.7, -67.2], v: [-197.3, -186.5], top: 6.2, roof: { kind: 'hip', rise: 4.6, inset: 0.3 } },
];
export const WATER_TOWER = { u: -73.0, v: -182.0, side: 5.6, top: 22.8 };
// [u, v, radius, wall top, cone apex]
export const STABLE_TURRETS = [
  [-65.5, -196.4, 1.3, 7.4, 11.6], [-65.4, -167.4, 1.65, 7.0, 11.8],
  [-102.3, -156.2, 1.05, 5.6, 8.9], [-102.3, -148.2, 1.05, 5.6, 8.9], [-91.6, -156.2, 1.05, 5.6, 8.9], [-91.6, -148.6, 1.05, 5.6, 8.9],
];

export function buildStables(k) {
  const { near } = k, n = near ? 16 : 8;
  k.poly('rubble', STABLES_RING, -1.0, 0.9, { top: false }); // rubble plinth, the brick course stands on it
  k.poly('brick', STABLES_RING, 0.9, 4.2);
  for (const b of STABLE_BLOCKS) {
    const [u0, u1] = b.u, [v0, v1] = b.v, cu = (u0 + u1) / 2, cv = (v0 + v1) / 2, w = u1 - u0, d = v1 - v0;
    k.box('brick', cu, 4.1, cv, w, b.top - 4.1, d);
    k.box('trim', cu, b.top - 0.5, cv, w + 0.4, 0.4, d + 0.4); // stone eaves course
    k.box('trim', cu, 0.8, cv, w + 0.2, 0.3, d + 0.2);
    k.hip('roof', u0 - 0.35, u1 + 0.35, v0 - 0.35, v1 + 0.35, b.top - 0.1, b.roof.rise);
  }
  // east gable of the front range, stepped in cream stone, facing Walmer Road
  k.gableWall('brick', -65.55, -177.4, -165.6, 6.0, 4.4, 'v', 0.5);
  k.stepGable('trim', -65.2, -171.5, 6.05, 11.6, 5.0, near ? 6 : 3, 'v', 0.35);
  // the round pavilion at the foot of the water tower
  k.cyl('brick', -67.9, -171.2, 4.1, 5.6, 3.3, 3.3, n);
  k.cyl('trim', -67.9, -171.2, 5.5, 5.9, 3.55, 3.55, n);
  k.cone('roof', -67.9, -171.2, 5.9, 10.6, 3.85, n);
  k.box('copper', -67.9, 10.4, -171.2, 0.08, 1.0, 0.08);
  for (const [u, v, r, top, tip] of STABLE_TURRETS) {
    k.cyl('brick', u, v, 4.1, top, r, r, 10, true);
    k.cyl('trim', u, v, top - 0.5, top + 0.25, r + 0.2, r + 0.35, 10);
    k.cone('roof', u, v, top + 0.2, tip, r + 0.5, 10);
  }
  waterTower(k);
  if (near) windows(k);
}

function waterTower(k) {
  const { near } = k, { u, v, side: s, top } = WATER_TOWER, h = s / 2;
  k.box('brick', u, 1.0, v, s, top - 1.0, s);
  // cream limestone quoins up all four corners and a string course at mid height
  for (const [du, dv] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) k.box('trim', u + du * h, 0.75, v + dv * h, 0.75, top - 0.65, 0.75); // quoins run past the brick at foot and head (the foot sinks into the rubble plinth)
  k.box('trim', u, 12.0, v, s + 0.3, 0.35, s + 0.3);
  // corbelled crown, white parapet, then a cluster of crenellated round turrets of different heights
  k.box('trim', u, top - 0.2, v, s + 0.9, 0.7, s + 0.9);
  k.box('trim', u, top + 0.5, v, s + 1.3, 0.5, s + 1.3);
  const y0 = top + 1.0;
  const turret = (du, dv, r, hh, cap) => {
    const cu = u + du, cv = v + dv, nn = near ? 16 : 8;
    k.cyl('trim', cu, cv, y0, y0 + hh, r, r, nn, true);
    k.cyl('trim', cu, cv, y0 + hh - 1.1, y0 + hh, r, r + 0.45, nn);
    k.cyl('trim', cu, cv, y0 + hh, y0 + hh + 0.55, r + 0.45, r + 0.45, nn);
    if (near) k.merlonRing('trim', cu, cv, y0 + hh + 0.55, r + 0.45, { count: 8, mw: 0.85, h: 0.75, thick: 0.5 });
    if (cap) k.cone('trim', cu, cv, y0 + hh + 0.55, y0 + hh + 0.55 + cap, r + 0.3, nn);
  };
  turret(1.55, 1.75, 1.75, 5.2, 0);      // front-right, the big round drum
  turret(1.9, -1.9, 1.35, 3.6, 0);       // rear-right
  turret(-1.95, 1.8, 1.25, 2.4, 2.2);    // left-front, capped
  k.box('trim', u - 1.65, y0, v - 1.7, 2.0, 8.1, 2.0);                       // rear-left: the tallest, a square turret
  k.box('trim', u - 1.65, y0 + 8.0, v - 1.7, 2.6, 0.5, 2.6);
  if (near) k.merlons('trim', u - 2.85, v - 2.9, u - 0.45, v - 2.9, y0 + 8.5, { mw: 0.7, gap: 0.5, h: 0.7, thick: 0.5 }), k.merlons('trim', u - 2.85, v - 0.5, u - 0.45, v - 0.5, y0 + 8.5, { mw: 0.7, gap: 0.5, h: 0.7, thick: 0.5 });
  if (near) for (const y of [8.0, 14.5, 19.5]) for (const [du, dv, ang] of [[0, h + 0.01, 0], [h + 0.01, 0, Math.PI / 2]]) k.win(u + du * 1, v + dv * 1, y, ang, 0.75, 1.2);
}

function windows(k) {
  const ring = STABLES_RING;
  for (const b of STABLE_BLOCKS) {
    const [u0, u1] = b.u, [v0, v1] = b.v;
    // A wall that stands against another wing is not a facade: windows there would sit inside the neighbour.
    const buried = (pu, pv, nu, nv) => STABLE_BLOCKS.some((o) => o !== b && pu + nu * 0.6 >= o.u[0] && pu + nu * 0.6 <= o.u[1] && pv + nv * 0.6 >= o.v[0] && pv + nv * 0.6 <= o.v[1]);
    const face = (ua, va, ub, vb, ang, nu, nv) => {
      const L = Math.hypot(ub - ua, vb - va), n = Math.floor((L - 1.5) / 3.6);
      for (let j = 0; j < n; j++) {
        const pu = ua + (ub - ua) * (j + 0.5) / n, pv = va + (vb - va) * (j + 0.5) / n;
        if (buried(pu, pv, nu, nv)) continue;
        k.win(pu, pv, 1.4, ang, 1.0, 1.7, { frame: 'trim' }); k.win(pu, pv, 4.6, ang, 0.9, 1.0, { frame: 'trim' });
      }
    };
    face(u0, v0, u1, v0, Math.PI, 0, -1); face(u0, v1, u1, v1, 0, 0, 1); face(u0, v0, u0, v1, -Math.PI / 2, -1, 0); face(u1, v0, u1, v1, Math.PI / 2, 1, 0);
  }
  void ring;
}
