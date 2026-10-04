// Washington Monument, in metres, east/up/south, origin on the shaft axis.
// Shaft: 500 ft, 55 ft 1½ in at the plaza, 34 ft 5⅝ in under the pyramidion.
// Pyramidion plus the 8.9 in aluminium apex reach 555 ft 5⅛ in.
// The 150 ft course is the Civil War stop line (warmer marble below, brighter above,
// one course of a third marble between them). Eight windows, two per face, sit in
// the pyramidion; a red beacon stands over each. The east doorway is the only opening
// at grade. A one-storey glass lobby (OSM way 897141356) covers that door.
import * as THREE from 'three';
import { SPEC } from './config.js';

const S = SPEC;
const halfShaft = (y) => S.baseM / 2 + (S.shaftTopM / 2 - S.baseM / 2) * (y / S.shaftM);
const marbleTip = S.height - S.aluminumM;
const halfPyr = (y) => S.shaftTopM / 2 + (S.aluminumBaseM / 2 - S.shaftTopM / 2) * ((y - S.shaftM) / (marbleTip - S.shaftM));

// East and west faces run in z; north and south faces run in x. sign is the outward axis.
const FACES = [
  { id: 'east', axis: 'x', sign: 1, entrance: true },
  { id: 'west', axis: 'x', sign: -1 },
  { id: 'south', axis: 'z', sign: 1 },
  { id: 'north', axis: 'z', sign: -1 },
];

const outOf = (face) => (face.axis === 'x' ? [face.sign, 0, 0] : [0, 0, face.sign]);
const alongOf = (face) => (face.axis === 'x' ? [0, 0, 1] : [1, 0, 0]);

function onPlane(halfFn, face, y, along) {
  const h = halfFn(y);
  return face.axis === 'x' ? [face.sign * h, y, along] : [along, y, face.sign * h];
}
const onShaft = (face, y, along) => onPlane(halfShaft, face, y, along);
const onPyr = (face, y, along) => onPlane(halfPyr, face, y, along);

function pushIn(p, face, depth) {
  const q = [p[0], p[1], p[2]];
  if (face.axis === 'x') q[0] -= face.sign * depth;
  else q[2] -= face.sign * depth;
  return q;
}

function triNormal(a, b, c) {
  const ax = b[0] - a[0], ay = b[1] - a[1], az = b[2] - a[2];
  const bx = c[0] - a[0], by = c[1] - a[1], bz = c[2] - a[2];
  const n = [ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx];
  const len = Math.hypot(n[0], n[1], n[2]) || 1;
  return [n[0] / len, n[1] / len, n[2] / len];
}

function soup() {
  const positions = [], normals = [], indices = [];
  function add(a, b, c) {
    const n = triNormal(a, b, c);
    const base = positions.length / 3;
    for (const p of [a, b, c]) {
      positions.push(p[0], p[1], p[2]);
      normals.push(n[0], n[1], n[2]);
    }
    indices.push(base, base + 1, base + 2);
  }
  // pts go around the face; flipped when the resulting normal disagrees with outward.
  function quad(pts, outward) {
    const n = triNormal(pts[0], pts[1], pts[2]);
    const flip = n[0] * outward[0] + n[1] * outward[1] + n[2] * outward[2] < 0;
    const [a, b, c, d] = pts;
    if (flip) { add(a, d, c); add(a, c, b); } else { add(a, b, c); add(a, c, d); }
  }
  function tri(pts, outward) {
    const n = triNormal(pts[0], pts[1], pts[2]);
    const flip = n[0] * outward[0] + n[1] * outward[1] + n[2] * outward[2] < 0;
    const [a, b, c] = pts;
    if (flip) add(a, c, b); else add(a, b, c);
  }
  function commit(sink, material) {
    if (!indices.length) return;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    g.setIndex(indices);
    sink.put(g, material);
  }
  return { quad, tri, commit };
}

// A panel of a tapered face. a0/a1 are along-coordinates or functions of y.
function panel(mesh, place, y0, y1, a0, a1, outward) {
  const A = (y, a) => place(y, typeof a === 'function' ? a(y) : a);
  mesh.quad([A(y0, a0), A(y0, a1), A(y1, a1), A(y1, a0)], outward);
}

const DOOR_REVEAL = 0.55;
const WIN_REVEAL = 0.12;

function openingJambs(mesh, place, face, y0, y1, a0, a1, depth) {
  const along = alongOf(face);
  const side = (a, sign) => {
    const o0 = place(y0, a), o1 = place(y1, a);
    const i0 = pushIn(o0, face, depth), i1 = pushIn(o1, face, depth);
    mesh.quad([o0, o1, i1, i0], along.map((v) => v * sign));
  };
  // a0 is the lesser along-coordinate. Its jamb faces +along, into the hole.
  side(a0, 1);
  side(a1, -1);
  const sill = (y, ny) => {
    const o0 = place(y, a0), o1 = place(y, a1);
    mesh.quad([o0, o1, pushIn(o1, face, depth), pushIn(o0, face, depth)], [0, ny, 0]);
  };
  sill(y0, 1);
  sill(y1, -1);
}

// East lobby: OSM rectangle, one storey, no mapped height. 4 m is the estimate.
// West wall is omitted; it would sit on the marble. The roof stops 4 cm clear of the batter.
const LOBBY_H = 4;
const LOBBY_X1 = 19.02;
const LOBBY_Z = 4.48;

function lobby(glass, roof) {
  const xWest = (y) => halfShaft(y) + 0.03;
  const y0 = 0.02;
  const outE = [1, 0, 0], outS = [0, 0, 1], outN = [0, 0, -1];
  glass.quad([[LOBBY_X1, y0, -LOBBY_Z], [LOBBY_X1, y0, LOBBY_Z], [LOBBY_X1, LOBBY_H, LOBBY_Z], [LOBBY_X1, LOBBY_H, -LOBBY_Z]], outE);
  glass.quad([[xWest(y0), y0, LOBBY_Z], [LOBBY_X1, y0, LOBBY_Z], [LOBBY_X1, LOBBY_H, LOBBY_Z], [xWest(LOBBY_H), LOBBY_H, LOBBY_Z]], outS);
  glass.quad([[LOBBY_X1, y0, -LOBBY_Z], [xWest(y0), y0, -LOBBY_Z], [xWest(LOBBY_H), LOBBY_H, -LOBBY_Z], [LOBBY_X1, LOBBY_H, -LOBBY_Z]], outN);
  const x0 = halfShaft(LOBBY_H) + 0.05;
  const x1 = LOBBY_X1 + 0.1;
  const z = LOBBY_Z + 0.08;
  const yR = LOBBY_H + 0.22;
  // Slab: top, bottom, and the three edges a driver can see. No west edge (it faces the shaft 4 cm away).
  roof.quad([[x0, yR, -z], [x1, yR, -z], [x1, yR, z], [x0, yR, z]], [0, 1, 0]);
  roof.quad([[x0, LOBBY_H, z], [x1, LOBBY_H, z], [x1, LOBBY_H, -z], [x0, LOBBY_H, -z]], [0, -1, 0]);
  roof.quad([[x1, LOBBY_H, -z], [x1, LOBBY_H, z], [x1, yR, z], [x1, yR, -z]], outE);
  roof.quad([[x0, LOBBY_H, z], [x1, LOBBY_H, z], [x1, yR, z], [x0, yR, z]], outS);
  roof.quad([[x1, LOBBY_H, -z], [x0, LOBBY_H, -z], [x0, yR, -z], [x1, yR, -z]], outN);
}

// Dark mullions, proud of the glass but inside the roof overhang, so the lobby reads as
// a glazed pavilion. Same on both LODs; they do not change the bounding box.
function mullions(sink) {
  const y0 = 0.25, y1 = LOBBY_H - 0.12, mid = (y0 + y1) / 2, h = y1 - y0;
  for (const z of [-3.2, -1.6, 0, 1.6, 3.2]) sink.box('roof', [LOBBY_X1 + 0.055, mid, z], [0.05, h, 0.07]);
  sink.box('roof', [LOBBY_X1 + 0.055, 2.05, 0], [0.045, 0.07, LOBBY_Z * 2 - 0.3]);
  for (const x of [11.2, 14.2, 17.2]) {
    sink.box('roof', [x, mid, LOBBY_Z + 0.04], [0.07, h, 0.05]);
    sink.box('roof', [x, mid, -(LOBBY_Z + 0.04)], [0.07, h, 0.05]);
  }
}

function beacon(sink, face, y0, y1, a0, a1) {
  const h = halfPyr(y0);
  const proud = 0.1, depth = 0.08;
  const cy = (y0 + y1) / 2, ca = (a0 + a1) / 2;
  const span = Math.abs(a1 - a0), thick = y1 - y0;
  if (face.axis === 'x') {
    const inner = face.sign * (h + proud);
    sink.box('lamp', [inner + face.sign * depth / 2, cy, ca], [depth, thick, span]);
  } else {
    const inner = face.sign * (h + proud);
    sink.box('lamp', [ca, cy, inner + face.sign * depth / 2], [span, thick, depth]);
  }
}

export function build(sink, { near }) {
  const lower = soup(), joint = soup(), upper = soup(), bronze = soup(), glow = soup(), alum = soup();
  const glass = soup(), roof = soup();
  const jointTop = S.jointM + S.jointBandM;
  const doorHalf = S.doorWM / 2;
  const winHalf = S.winWM / 2;
  const winCenter = (S.winGapM + S.winWM) / 2;
  const holeOuter = winCenter + winHalf;
  const holeInner = winCenter - winHalf;

  for (const face of FACES) {
    const outward = outOf(face);
    const full0 = (y) => -halfShaft(y);
    const full1 = (y) => halfShaft(y);
    if (face.entrance) {
      panel(lower, (y, a) => onShaft(face, y, a), 0, S.jointM, doorHalf, full1, outward);
      panel(lower, (y, a) => onShaft(face, y, a), 0, S.jointM, full0, -doorHalf, outward);
      panel(lower, (y, a) => onShaft(face, y, a), S.doorHM, S.jointM, -doorHalf, doorHalf, outward);
      const place = (y, a) => onShaft(face, y, a);
      if (near) openingJambs(bronze, place, face, 0.02, S.doorHM, -doorHalf, doorHalf, DOOR_REVEAL);
      panel(bronze, (y, a) => pushIn(onShaft(face, y, a), face, DOOR_REVEAL), 0.02, S.doorHM, -doorHalf, doorHalf, outward);
    } else {
      panel(lower, (y, a) => onShaft(face, y, a), 0, S.jointM, full0, full1, outward);
    }
    panel(joint, (y, a) => onShaft(face, y, a), S.jointM, jointTop, full0, full1, outward);
    panel(upper, (y, a) => onShaft(face, y, a), jointTop, S.shaftM, full0, full1, outward);

    const winH = face.entrance ? S.winHEastM : S.winHM;
    const sill = S.winSillM, head = sill + winH;
    const pyr = (y, a) => onPyr(face, y, a);
    const p0 = (y) => -halfPyr(y), p1 = (y) => halfPyr(y);
    panel(upper, pyr, S.shaftM, sill, p0, p1, outward);
    panel(upper, pyr, sill, head, p0, -holeOuter, outward);
    panel(upper, pyr, sill, head, -holeInner, holeInner, outward);
    panel(upper, pyr, sill, head, holeOuter, p1, outward);
    panel(upper, pyr, head, marbleTip, p0, p1, outward);

    for (const center of [-winCenter, winCenter]) {
      const a0 = center - winHalf, a1 = center + winHalf;
      panel(glow, (y, a) => pushIn(onPyr(face, y, a), face, WIN_REVEAL), sill, head, a0, a1, outward);
      if (near) openingJambs(upper, pyr, face, sill, head, a0, a1, WIN_REVEAL);
      beacon(sink, face, head + 0.16, head + 0.34, center - 0.15, center + 0.15);
    }
  }

  const h = S.aluminumBaseM / 2, yb = marbleTip, apex = [0, S.height, 0];
  const se = [h, yb, h], sw = [-h, yb, h], nw = [-h, yb, -h], ne = [h, yb, -h];
  alum.tri([ne, se, apex], [1, 0, 0]);
  alum.tri([sw, nw, apex], [-1, 0, 0]);
  alum.tri([se, sw, apex], [0, 0, 1]);
  alum.tri([nw, ne, apex], [0, 0, -1]);
  upper.quad([se, ne, nw, sw], [0, 1, 0]);

  lobby(glass, roof);
  mullions(sink);

  lower.commit(sink, 'marble_lower');
  joint.commit(sink, 'marble_joint');
  upper.commit(sink, 'marble_upper');
  bronze.commit(sink, 'bronze');
  glow.commit(sink, 'glow');
  alum.commit(sink, near ? 'aluminum' : 'marble_upper');
  glass.commit(sink, 'glass');
  roof.commit(sink, 'roof');
}
