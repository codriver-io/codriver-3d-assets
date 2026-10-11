// Edificio Coltejer. A finned office slab on the mapped parallelogram, white gable ends,
// and a ridge that closes to a needle. The eye is a recess in each gable. A low annex
// fills the wing of the OSM outline. Metres, east/up/south. See edificio-coltejer-parts.js.
import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import {
  APEX_Y, EAVE_Y, PODIUM_Y, SHAFT_FLOORS, FLOOR_H, SPANDREL,
  EYE_Y0, EYE_Y1, EYE_HALF_T, POLE_TOP, LONG_M, SHORT_M, WING, CENTER,
  xyz, crown, sub, cross, norm,
} from './edificio-coltejer-parts.js';

const INSET = 1.15; // fins stand 0.95 m proud; the outer face still has to clear the ring

function quad(b, mat, a, c, d, e, outward) {
  const n = cross(sub(c, a), sub(e, a));
  const flip = n[0] * outward[0] + n[1] * outward[1] + n[2] * outward[2] < 0;
  const verts = flip ? [a, e, d, c] : [a, c, d, e];
  const g = new THREE.BufferGeometry();
  const arr = new Float32Array(12);
  verts.forEach((v, i) => { arr[i * 3] = v[0]; arr[i * 3 + 1] = v[1]; arr[i * 3 + 2] = v[2]; });
  g.setAttribute('position', new THREE.BufferAttribute(arr, 3));
  g.setIndex([0, 1, 2, 0, 2, 3]);
  g.computeVertexNormals();
  b.put(g, mat);
}

function tri(b, mat, a, c, d, outward) {
  const n = cross(sub(c, a), sub(d, a));
  if (Math.hypot(n[0], n[1], n[2]) < 1e-6) return;
  const flip = n[0] * outward[0] + n[1] * outward[1] + n[2] * outward[2] < 0;
  const verts = flip ? [a, d, c] : [a, c, d];
  const g = new THREE.BufferGeometry();
  const arr = new Float32Array(9);
  verts.forEach((v, i) => { arr[i * 3] = v[0]; arr[i * 3 + 1] = v[1]; arr[i * 3 + 2] = v[2]; });
  g.setAttribute('position', new THREE.BufferAttribute(arr, 3));
  g.setIndex([0, 1, 2]);
  g.computeVertexNormals();
  b.put(g, mat);
}

// s and t in 0..1, pulled in so every wall vertex is inside the ring.
// The north edge (t=1) is not the footprint: the ring leaves that corner along a
// shorter edge, and a full-depth fin there stood 0.6 m outside it.
const BACK_INSET = 0.9;
function S(s) { return INSET / LONG_M + s * (1 - 2 * INSET / LONG_M); }
function T(t) {
  const t0 = INSET / SHORT_M;
  const t1 = 1 - (INSET + BACK_INSET) / SHORT_M;
  return t0 + t * (t1 - t0);
}
function P(s, t, y) { return xyz(S(s), T(t), y); }
function K(s, t, y) { return crown(S(s), T(t), y); }

function outT(t) {
  const a = P(0.5, t, 40), c = P(0.5, t + (t < 0.5 ? -1 : 1), 40);
  return norm([c[0] - a[0], 0, c[2] - a[2]]);
}
function outS(s) {
  const a = P(s, 0.5, 40), c = P(s + (s < 0.5 ? -1 : 1), 0.5, 40);
  return norm([c[0] - a[0], 0, c[2] - a[2]]);
}
function push(p, dir, metres) {
  return [p[0] + dir[0] * metres, p[1] + dir[1] * metres, p[2] + dir[2] * metres];
}

// Closed rib standing proud of a long face. s0/s1 are in 0..1 face parameters.
function rib(b, mat, s0, s1, tFace, depth0, depth1, y0, y1) {
  if (s1 - s0 < 1e-4 || y1 - y0 < 1e-4) return;
  const o = outT(tFace);
  const os0 = outS(0), os1 = outS(1);
  const q = (s, depth, y) => push(P(s, tFace, y), o, depth);
  quad(b, mat, q(s0, depth1, y0), q(s1, depth1, y0), q(s1, depth1, y1), q(s0, depth1, y1), o);
  quad(b, mat, q(s1, depth0, y0), q(s0, depth0, y0), q(s0, depth0, y1), q(s1, depth0, y1), [-o[0], 0, -o[2]]);
  quad(b, mat, q(s0, depth0, y0), q(s0, depth1, y0), q(s0, depth1, y1), q(s0, depth0, y1), os0);
  quad(b, mat, q(s1, depth1, y0), q(s1, depth0, y0), q(s1, depth0, y1), q(s1, depth1, y1), os1);
  quad(b, mat, q(s0, depth0, y1), q(s1, depth0, y1), q(s1, depth1, y1), q(s0, depth1, y1), [0, 1, 0]);
  quad(b, mat, q(s1, depth0, y0), q(s0, depth0, y0), q(s0, depth1, y0), q(s1, depth1, y0), [0, -1, 0]);
}

function pane(b, mat, s0, s1, tFace, y0, y1, depth) {
  const o = outT(tFace);
  const q = (s, y) => push(P(s, tFace, y), o, depth);
  quad(b, mat, q(s0, y0), q(s1, y0), q(s1, y1), q(s0, y1), o);
}

// Long face: concrete backing, a fin on every bay line, glass (some lit) and a spandrel per floor.
function finFace(b, tFace, bays, near, y0, y1, floors) {
  const o = outT(tFace);
  quad(b, 'concrete', P(0, tFace, y0), P(1, tFace, y0), P(1, tFace, y1), P(0, tFace, y1), o);
  const finW = 0.58 / LONG_M / (1 - 2 * INSET / LONG_M);
  const h = (y1 - y0) / floors;
  for (let i = 0; i <= bays; i++) {
    const s = i / bays;
    rib(b, 'concrete', Math.max(0.006, s - finW / 2), Math.min(0.994, s + finW / 2), tFace, 0.28, 0.95, y0, y1);
  }
  for (let f = 0; f < floors; f++) {
    const ya = y0 + f * h;
    const g0 = ya + 0.08;
    const g1 = ya + h - SPANDREL;
    for (let i = 0; i < bays; i++) {
      const s0 = i / bays + finW / 2;
      const s1 = (i + 1) / bays - finW / 2;
      const lit = (i * 2 + f) % 5 === 0;
      if (near) {
        const mid = (s0 + s1) / 2;
        const gap = 0.055 / LONG_M;
        pane(b, lit ? 'glow' : 'glass', s0, mid - gap, tFace, g0, g1, 0.16);
        pane(b, lit ? 'glow' : 'glass', mid + gap, s1, tFace, g0, g1, 0.16);
        const mo = outT(tFace);
        const mq = (s, y) => push(P(s, tFace, y), mo, 0.40);
        quad(b, 'concrete', mq(mid - gap, g0), mq(mid + gap, g0), mq(mid + gap, g1), mq(mid - gap, g1), mo);
      } else {
        pane(b, lit ? 'glow' : 'glass', s0, s1, tFace, g0, g1, 0.16);
      }
    }
    // One band across the whole face, behind the fins.
    rib(b, 'concrete', 0.01, 0.99, tFace, 0.30, 0.58, y0 + (f + 1) * h - SPANDREL, y0 + (f + 1) * h);
  }
}

// Three storeys of shopfronts. The centre bays of the south-west face drop to the sidewalk.
function podiumFace(b, tFace, bays) {
  const o = outT(tFace);
  const floors = 3;
  const h = PODIUM_Y / floors;
  quad(b, 'concrete', P(0, tFace, 0), P(1, tFace, 0), P(1, tFace, PODIUM_Y), P(0, tFace, PODIUM_Y), o);
  const jamb = 0.62 / LONG_M / (1 - 2 * INSET / LONG_M);
  for (let i = 0; i <= bays; i++) {
    const s = i / bays;
    rib(b, 'concrete', Math.max(0.004, s - jamb / 2), Math.min(0.996, s + jamb / 2), tFace, 0.18, 0.52, 0.25, PODIUM_Y);
  }
  for (let f = 0; f < floors; f++) {
    const ya = f * h;
    const yb = (f + 1) * h;
    for (let i = 0; i < bays; i++) {
      const s0 = i / bays + jamb / 2;
      const s1 = (i + 1) / bays - jamb / 2;
      const door = tFace === 0 && f === 0 && (i === (bays >> 1) - 1 || i === (bays >> 1));
      pane(b, 'glass', s0, s1, tFace, door ? 0.12 : ya + 0.4, yb - 0.62, 0.12);
      rib(b, 'concrete', s0, s1, tFace, 0.20, 0.46, yb - 0.62, yb);
    }
  }
}

function endWall(b, sFace, near) {
  const o = outS(sFace);
  quad(b, 'end', P(sFace, 0, 0), P(sFace, 1, 0), P(sFace, 1, EAVE_Y), P(sFace, 0, EAVE_Y), o);
  // Podium: two wide panes on the white ends, so the base is not a blank slab.
  const oq = (t, y, depth) => push(P(sFace, t, y), o, depth);
  for (const [t0, t1] of [[0.12, 0.40], [0.60, 0.88]]) {
    quad(b, 'glass', oq(t0, 1.2, 0.14), oq(t1, 1.2, 0.14), oq(t1, PODIUM_Y - 0.8, 0.14), oq(t0, PODIUM_Y - 0.8, 0.14), o);
  }
  // One small square window per shaft floor (every other floor when far), centred.
  const step = near ? 1 : 2;
  const half = 0.78 / SHORT_M / (1 - 2 * INSET / SHORT_M);
  for (let f = 0; f < SHAFT_FLOORS; f += step) {
    const yc = PODIUM_Y + (f + 0.42) * FLOOR_H;
    const y0 = yc - 0.78, y1 = yc + 0.78;
    quad(b, f % 4 === 0 ? 'glow' : 'glass',
      oq(0.5 - half, y0, 0.16), oq(0.5 + half, y0, 0.16), oq(0.5 + half, y1, 0.16), oq(0.5 - half, y1, 0.16), o);
  }
}

function gable(b, sFace) {
  const o = outS(sFace);
  const L = (t, y) => K(sFace, t, y);
  const t0 = 0.5 - EYE_HALF_T, t1 = 0.5 + EYE_HALF_T;
  quad(b, 'end', L(0, EAVE_Y), L(1, EAVE_Y), L(1, EYE_Y0), L(0, EYE_Y0), o);
  quad(b, 'end', L(0, EYE_Y0), L(t0, EYE_Y0), L(t0, EYE_Y1), L(0, EYE_Y1), o);
  quad(b, 'end', L(t1, EYE_Y0), L(1, EYE_Y0), L(1, EYE_Y1), L(t1, EYE_Y1), o);
  tri(b, 'end', L(0, EYE_Y1), L(1, EYE_Y1), L(0.5, APEX_Y), o);
  // Eye: a dark pane 1.35 m back, white jambs around it. Not a hole through the tower.
  const back = [-o[0], 0, -o[2]];
  const g = (t, y) => push(L(t, y), back, 1.35);
  quad(b, 'light', g(t0, EYE_Y0), g(t1, EYE_Y0), g(t1, EYE_Y1), g(t0, EYE_Y1), o);
  const into = (t, dir) => quad(b, 'end', L(t, EYE_Y0), L(t, EYE_Y1), g(t, EYE_Y1), g(t, EYE_Y0), dir);
  into(t0, outT(1));
  into(t1, outT(0));
  quad(b, 'end', L(t0, EYE_Y0), g(t0, EYE_Y0), g(t1, EYE_Y0), L(t1, EYE_Y0), [0, -1, 0]);
  quad(b, 'end', L(t0, EYE_Y1), L(t1, EYE_Y1), g(t1, EYE_Y1), g(t0, EYE_Y1), [0, 1, 0]);
}

function roof(b) {
  const up0 = [outT(0)[0] * 0.55, 1, outT(0)[2] * 0.55];
  const up1 = [outT(1)[0] * 0.55, 1, outT(1)[2] * 0.55];
  quad(b, 'end', K(0, 0, EAVE_Y), K(1, 0, EAVE_Y), K(1, 0.5, APEX_Y), K(0, 0.5, APEX_Y), up0);
  quad(b, 'end', K(0, 1, EAVE_Y), K(0, 0.5, APEX_Y), K(1, 0.5, APEX_Y), K(1, 1, EAVE_Y), up1);
}

function poles(b) {
  // Two staffs a couple of metres apart at the needle, flags flying to either side of the ridge.
  const fly = outT(0);
  const face = outS(0);
  for (const [s, side] of [[0.468, 1], [0.532, -1]]) {
    const foot = K(s, 0.5, APEX_Y);
    b.bar('metal', [foot[0], APEX_Y - 0.35, foot[2]], [foot[0], POLE_TOP, foot[2]], 0.32, 0.32);
    const hoist = [foot[0], POLE_TOP - 0.7, foot[2]];
    const tip = [hoist[0] + fly[0] * 2.5 * side, hoist[1] - 0.4, hoist[2] + fly[2] * 2.5 * side];
    const hem = [hoist[0], hoist[1] - 1.35, hoist[2]];
    const flyHem = [tip[0], tip[1] - 1.05, tip[2]];
    quad(b, 'metal', hoist, tip, flyHem, hem, face);
    const back = (p) => push(p, face, -0.06);
    quad(b, 'metal', back(hoist), back(hem), back(flyHem), back(tip), [-face[0], 0, -face[2]]);
  }
}

function annex(b, near) {
  // The wing is concave where it leaves the shaft. A fan from the tower edge crosses
  // the ring; the bulge triangle plus two triangles back to the inset north corner do not.
  const c = WING.reduce((s, p) => [s[0] + p[0], s[1] + p[1]], [0, 0]).map((v) => v / WING.length);
  const pull = (p) => {
    const dx = c[0] - p[0], dz = c[1] - p[1], L = Math.hypot(dx, dz) || 1;
    return [p[0] + (dx / L) * 0.7, p[1] + (dz / L) * 0.7];
  };
  const [p0, p1, p2] = WING.map(pull);
  const face = P(0.55, 1, 0), corner = P(1, 1, 0);
  const tA = [face[0], face[2]], tB = [corner[0], corner[2]];
  const Y = PODIUM_Y;
  const v = (p) => [p[0], Y, p[1]];
  tri(b, 'concrete', v(p0), v(p1), v(p2), [0, 1, 0]);
  tri(b, 'concrete', v(p0), v(p2), v(tB), [0, 1, 0]);
  tri(b, 'concrete', v(tA), v(p0), v(tB), [0, 1, 0]);
  const edges = [[tA, p0, false], [p0, p1, true], [p1, p2, true], [p2, tB, true]];
  for (const [p, q, glass] of edges) {
    const edge = [q[0] - p[0], q[1] - p[1]];
    let dir = norm([edge[1], 0, -edge[0]]);
    const mid = [(p[0] + q[0]) / 2, 0, (p[1] + q[1]) / 2];
    const away = [mid[0] - CENTER[0], 0, mid[2] - CENTER[1]];
    if (dir[0] * away[0] + dir[2] * away[2] < 0) dir = [-dir[0], 0, -dir[2]];
    quad(b, 'concrete', [p[0], 0, p[1]], [q[0], 0, q[1]], [q[0], Y, q[1]], [p[0], Y, p[1]], dir);
    if (!near || !glass) continue;
    const gl = (u, y) => {
      const x = p[0] * (1 - u) + q[0] * u, z = p[1] * (1 - u) + q[1] * u;
      return [x + dir[0] * 0.18, y, z + dir[2] * 0.18];
    };
    quad(b, 'glass', gl(0.18, 1.6), gl(0.82, 1.6), gl(0.82, Y - 1.4), gl(0.18, Y - 1.4), dir);
  }
}

function pilasters(b) {
  for (const [s, t] of [[0, 0], [0, 1], [1, 0], [1, 1]]) {
    const os = outS(s), ot = outT(t);
    const w = 0.62;
    const base = (y) => push(push(P(s, t, y), os, 0.12), ot, 0.12);
    const q = (ds, dt, y) => push(push(base(y), os, ds), ot, dt);
    quad(b, 'concrete', q(0, 0, 0), q(w, 0, 0), q(w, 0, EAVE_Y), q(0, 0, EAVE_Y), os);
    quad(b, 'concrete', q(w, 0, 0), q(w, w, 0), q(w, w, EAVE_Y), q(w, 0, EAVE_Y), ot);
    quad(b, 'concrete', q(0, 0, EAVE_Y), q(w, 0, EAVE_Y), q(w, w, EAVE_Y), q(0, w, EAVE_Y), [0, 1, 0]);
  }
}

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const bays = near ? 18 : 12;
  const floors = SHAFT_FLOORS;
  finFace(b, 0, bays, near, PODIUM_Y, EAVE_Y, floors);
  finFace(b, 1, bays, near, PODIUM_Y, EAVE_Y, floors);
  podiumFace(b, 0, near ? 7 : 4);
  {
    const o = outT(1);
    quad(b, 'concrete', P(0, 1, 0), P(1, 1, 0), P(1, 1, PODIUM_Y), P(0, 1, PODIUM_Y), o);
  }
  endWall(b, 0, near);
  endWall(b, 1, near);
  gable(b, 0);
  gable(b, 1);
  roof(b);
  poles(b);
  annex(b, near);
  pilasters(b);
  return b.finish();
}
