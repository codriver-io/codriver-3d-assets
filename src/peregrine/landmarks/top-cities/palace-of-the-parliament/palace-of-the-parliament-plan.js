// Building frame for the Palace of the Parliament.
// +x runs along the Unirii front toward geographic north (the viewer's right, looking at the front).
// +z runs out of that front, toward Bulevardul Unirii (east). y is up.
// ANGLE is the one rotateY applied to the finished group so +z lands on the mapped east wall.
import { SPEC } from './config.js';
import { FOOTPRINTS, COURTYARDS } from './footprint.js';
import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';

const k = mercStretch(SPEC.origin[1]);
const ox = lngToMercX(SPEC.origin[0]);
const oy = latToMercY(SPEC.origin[1]);

function toWorldXZ(ring) {
  return ring.map(([lon, lat]) => [(lngToMercX(lon) - ox) / k, -(latToMercY(lat) - oy) / k]);
}

function signedArea(ring) {
  let a = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) a += ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1];
  return a / 2;
}
function ccw(ring) { return signedArea(ring) < 0 ? ring.slice().reverse() : ring.slice(); }

// Bearing of the long east wall, radians east of north, the wall walked northward.
function eastWallTheta(world) {
  let acc = 0, w = 0;
  for (let i = 0; i < world.length; i++) {
    const a = world[i], b = world[(i + 1) % world.length];
    let dx = b[0] - a[0], dz = b[1] - a[1];
    const len = Math.hypot(dx, dz);
    if (len < 70 || Math.abs(dx) > Math.abs(dz) * 0.3) continue;
    if ((a[0] + b[0]) / 2 < 50) continue;
    if (dz > 0) { dx = -dx; dz = -dz; }
    acc += Math.atan2(dx, -dz) * len; w += len;
  }
  if (!w) throw new Error('palace east wall not found');
  return acc / w;
}

const WORLD = ccw(toWorldXZ(FOOTPRINTS[0]));
export const THETA = eastWallTheta(WORLD);
// rotateY(ANGLE): building +z (front) -> world east-of-north by THETA+90°.
export const ANGLE = Math.PI / 2 - THETA;
export const FRONTAGE = ((THETA * 180 / Math.PI) + 90 + 360) % 360;

const cA = Math.cos(ANGLE), sA = Math.sin(ANGLE);
export function toWorld(bx, by, bz) {
  return [bx * cA + bz * sA, by, -bx * sA + bz * cA];
}
function toBuildingXZ(x, z) {
  return [x * cA - z * sA, x * sA + z * cA];
}
function buildingRing(world) {
  return ccw(world.map(([x, z]) => toBuildingXZ(x, z)));
}

// Pull the shell inside the mapped ring so cornices and columns can stand proud and still
// land on the footprint. The pull is about 0.9 m at the east front.
function scaleInset(ring) {
  const cx = ring.reduce((s, p) => s + p[0], 0) / ring.length;
  const cz = ring.reduce((s, p) => s + p[1], 0) / ring.length;
  const front = Math.max(...ring.map((p) => p[1]));
  const s = 1 - 0.9 / (front - cz);
  return ring.map(([x, z]) => [cx + (x - cx) * s, cz + (z - cz) * s]);
}

// The central bay of the east front sits back of the wings, the way the photographs show
// the wings coming forward of the tower. x is along the front, north positive.
export const RECESS_X0 = -55;
export const RECESS_X1 = 50;
const SETBACK = 6.8;

function notchPoly(pts) {
  const out = [];
  const push = (p) => {
    const l = out[out.length - 1];
    if (!l || Math.hypot(p[0] - l[0], p[1] - l[1]) > 0.04) out.push(p);
  };
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    const ts = [0, 1];
    if (Math.abs(b[0] - a[0]) > 1e-3) {
      for (const x of [RECESS_X0, RECESS_X1]) {
        const t = (x - a[0]) / (b[0] - a[0]);
        if (t > 0.002 && t < 0.998) ts.push(t);
      }
    }
    ts.sort((p, q) => p - q);
    for (let k = 0; k < ts.length - 1; k++) {
      const t0 = ts[k], t1 = ts[k + 1];
      const xMid = a[0] + (b[0] - a[0]) * (t0 + t1) / 2;
      const sink = xMid > RECESS_X0 && xMid < RECESS_X1 ? SETBACK : 0;
      push([a[0] + (b[0] - a[0]) * t0, a[1] + (b[1] - a[1]) * t0 - sink]);
      push([a[0] + (b[0] - a[0]) * t1, a[1] + (b[1] - a[1]) * t1 - sink]);
    }
  }
  return out;
}

function notchFront(ring) {
  const n = ring.length;
  const front = [];
  for (let i = 0; i < n; i++) {
    const a = ring[i], b = ring[(i + 1) % n];
    const dx = b[0] - a[0], dz = b[1] - a[1], len = Math.hypot(dx, dz);
    if (len < 25) continue;
    const nz = -dx / len;
    if (nz > 0.85 && (a[1] + b[1]) / 2 > 55) front.push(i);
  }
  if (!front.length) throw new Error('palace front edge not found');
  const i0 = front[0], i1 = front[front.length - 1];
  const poly = [];
  for (let i = i0; i <= i1 + 1; i++) poly.push(ring[i % n]);
  const mid = notchPoly(poly);
  return [...ring.slice(0, i0), ...mid, ...ring.slice(i1 + 2)];
}

const BODY = buildingRing(WORLD);
export const SHELL = ccw(notchFront(scaleInset(BODY)));
export const COURTS = COURTYARDS.map((ring) => {
  const b = buildingRing(ccw(toWorldXZ(ring)));
  // Holes wind opposite the shell.
  return signedArea(b) > 0 ? b.slice().reverse() : b;
});

function frontEdgeZ() {
  let wing = -1e9, recessW = 0, recessZ = 0;
  const n = SHELL.length;
  for (let i = 0; i < n; i++) {
    const a = SHELL[i], b = SHELL[(i + 1) % n];
    const dx = b[0] - a[0], dz = b[1] - a[1], len = Math.hypot(dx, dz);
    if (len < 8) continue;
    const nz = -dx / len;
    if (nz < 0.85) continue;
    const mz = (a[1] + b[1]) / 2, mx = (a[0] + b[0]) / 2;
    if (mx > RECESS_X0 + 2 && mx < RECESS_X1 - 2 && len > 40) { recessZ += mz * len; recessW += len; }
    // Corner bastions also face east and sit further out; the wing plane is the long run between them.
    else if (len > 20 && Math.abs(mx) < 105) wing = Math.max(wing, mz);
  }
  return { wingZ: wing, recessZ: recessW ? recessZ / recessW : wing - SETBACK };
}
const front = frontEdgeZ();
export const WING_Z = front.wingZ;
export const RECESS_Z = front.recessZ;

// Stepped crown. Outer wings and the projecting corner bastions are lower than the
// OSM 58 m middle part, expanded into a broad setback tier below the 84 m tower.
// The colonnade is a giant order: shafts to ent0, cornice at ent1, arched piano nobile above.
export const H = {
  bastionRoof: 40.8,
  bastion: 42.4,
  wingRoof: 46.2,
  wing: 48,
  shoulderRoof: 56.4,
  shoulder: 58,
  towerRoof: 82.7,
  tower: 84,
  pole: 89.5,
  ent0: 22.2,
  ent1: 25.4,
};

// One tall arched opening per giant bay. Upper floors use the tighter BAY.
export const PIANO = { y: 26.2, h: 7.0, w: 4.8, arch: true, glow: true };
export const BASTION_ROWS = [
  { y: 35.2, h: 1.55, w: 2.0 },
  { y: 37.6, h: 1.55, w: 2.0, glow: true },
];
export const UPPER = [
  { y: 35.7, h: 2.3, w: 2.1 },
  { y: 39.0, h: 2.3, w: 2.05, glow: true },
  { y: 42.3, h: 2.2, w: 2.0 },
];
// Original procedural setback envelopes, estimated from the exterior photographs.
// Both broad rings surround BOTH mapped courtyards. The upper central block
// stands east of their ends; no tier bridges across a courtyard hole.
export const SETBACK_TIERS = [
  { x0: -96, x1: 94, z0: -70, z1: 77, base: 46.2, roof: 56.4, top: 58,
    rows: [{ y: 48.0, h: 2.5, w: 2.1 }, { y: 51.6, h: 2.7, w: 2.2, arch: true }], courts: true },
  { x0: -82, x1: 80, z0: -55, z1: 67, base: 56.4, roof: 64.4, top: 66,
    rows: [{ y: 58.0, h: 2.0, w: 2.1 }, { y: 61.0, h: 2.0, w: 2.0, glow: true }], courts: true },
];
export const TOWER_ROWS = [
  { y: 66.3, h: 2.6, w: 2.2 },
  { y: 70.3, h: 2.6, w: 2.2, glow: true },
  { y: 74.3, h: 2.6, w: 2.2 },
  { y: 78.0, h: 3.1, w: 3.0, arch: true, glow: true },
];

export const COL_BAY = 8.4;
export const BAY = 4.5;
// Projecting east corner pavilions, sliced off the shell in ring order.
export const BASTION_RINGS = [SHELL.slice(15, 21), SHELL.slice(26, 32)];
// Ceremonial ground-level facade stays on its mapped recessed front.
export const SCREEN = {
  x0: RECESS_X0 - 0.15, x1: RECESS_X1 + 0.15,
  z0: RECESS_Z - 0.15, z1: RECESS_Z + 0.48,
};
// Upper crown sits behind both terrace fronts; no scene height is baked.
export const BULK = { x0: -55, x1: 50, z0: 40, z1: 63 };
export const PORTICO = {
  x0: (RECESS_X0 + RECESS_X1) / 2 - 14,
  x1: (RECESS_X0 + RECESS_X1) / 2 + 14,
  z0: SCREEN.z1 - 0.2,
  z1: SCREEN.z1 + 5.4,
};
