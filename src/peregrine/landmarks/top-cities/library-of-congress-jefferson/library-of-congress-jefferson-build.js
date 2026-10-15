import * as THREE from 'three';
import {
  ARCH_S, COURT_N, COURT_S, COURT_X0, COURT_X1, DOME, DOME_PROFILE, EAST, FOUNTAIN,
  MAIN_Y, NORTH, PODIUM, PORTICO, RAMP_N, RAMP_S, SOUTH, STAIR, TERRACE_X, TIP, WEST, domeRadius,
} from './library-of-congress-jefferson-plan.js';

const ROWS = [
  { y0: 1.55, y1: 3.45, w: 1.2 },
  { y0: 6.55, y1: 10.15, w: 1.55 },
  { y0: 12.85, y1: 17.05, w: 1.55 },
  { y0: 19.05, y1: 21.15, w: 1.2 },
];

// Corner pavilions, inset from the mapped notches so proud dressings stay inside the ring.
// Each pair is the pavilion body plus the shallow south or north tip.
const CORNERS = [
  { x0: -52.25, x1: -34.0, z0: 53.85, z1: 69.05, y: 25.15 },
  { x0: -49.95, x1: -35.35, z0: 68.55, z1: 71.52, y: 25.15 },
  { x0: 33.55, x1: 49.84, z0: 53.9, z1: 68.85, y: 25.15 },
  { x0: 32.75, x1: 47.35, z0: 68.45, z1: 71.38, y: 25.15 },
  { x0: -52.05, x1: -33.85, z0: -69.35, z1: -53.35, y: 25.15 },
  { x0: -49.9, x1: -35.15, z0: -71.46, z1: -68.55, y: 25.15 },
  { x0: 33.45, x1: 49.87, z0: -69.55, z1: -53.65, y: 25.15 },
  { x0: 32.75, x1: 47.45, z0: -71.41, z1: -68.5, y: 25.15 },
];

// East pavilion, stepped to the mapped spur beyond the main east wall.
const SPUR = [
  { x0: 44.7, x1: 55.85, z0: -22.35, z1: 22.15 },
  { x0: 55.5, x1: 61.15, z0: -11.15, z1: 11.05 },
  { x0: 61.05, x1: 71.55, z0: -10.2, z1: 9.9 },
];

export function buildJefferson(kit) {
  const { wbox, frame, prism, lathe, bar, quad, flat, hip, put, near } = kit;
  const proud = near ? 0.42 : 0.7;
  const seg = near ? 28 : 14;

  // --- shell: a ring around two courts, not one solid extrusion ---
  wbox('stone', WEST, COURT_X0 + 0.45, 0, MAIN_Y, NORTH, SOUTH); // west range
  wbox('stone', COURT_X1 - 0.45, EAST, 0, MAIN_Y, NORTH, SOUTH); // east range and stacks
  wbox('stone', COURT_X0 - 0.4, COURT_X1 + 0.4, 0, 23.2, -18.45, 18.45); // reading-room spine
  wbox('stone', COURT_X0 - 0.4, COURT_X1 + 0.4, 0, MAIN_Y, COURT_S.z1 - 0.45, SOUTH);
  wbox('stone', COURT_X0 - 0.4, COURT_X1 + 0.4, 0, MAIN_Y, NORTH, COURT_N.z0 + 0.45);
  for (const c of CORNERS) wbox('stone', c.x0, c.x1, 0, c.y, c.z0, c.z1);
  for (const s of SPUR) wbox('stone', s.x0, s.x1, 0, MAIN_Y, s.z0, s.z1);

  courtFloor(COURT_S);
  courtFloor(COURT_N);

  // Metal hips on the ranges. Corner pavilions have raised dark windowed
  // metal stages and low hip crowns above the wing hips.
  hip('roof', -48.3, -36.1, 19.2, 53.6, MAIN_Y - 0.08, 3.55);
  hip('roof', -48.3, -36.1, -53.6, -19.2, MAIN_Y - 0.08, 3.55);
  hip('roof', -7.6, 32.4, 19.4, 64.8, MAIN_Y - 0.08, 3.7);
  hip('roof', -7.6, 32.4, -64.8, -19.4, MAIN_Y - 0.08, 3.7);
  hip('roof', 32.8, 44.5, 19.6, 53.4, MAIN_Y - 0.08, 3.4);
  hip('roof', 32.8, 44.5, -53.4, -19.6, MAIN_Y - 0.08, 3.4);
  hip('roof', -32.6, 31.6, 54.6, 67.2, MAIN_Y - 0.08, 3.35);
  hip('roof', -32.6, 31.6, -67.2, -54.6, MAIN_Y - 0.08, 3.35);
  pavilion(-51.75, -34.55, 54.35, 68.55);
  pavilion(34.05, 49.35, 54.4, 68.35);
  pavilion(-51.55, -34.35, -68.85, -53.85);
  pavilion(33.95, 49.35, -69.05, -54.15);
  hip('roof', -49.45, -35.85, 68.7, 71.15, 25.05, 2.15);
  hip('roof', 33.25, 46.85, 68.6, 71.0, 25.05, 2.15);
  hip('roof', -49.4, -35.65, -71.05, -68.7, 25.05, 2.15);
  hip('roof', 33.25, 46.95, -71.0, -68.65, 25.05, 2.15);
  hip('roof', 46.2, 55.2, -20.6, 20.4, MAIN_Y - 0.08, 3.2);
  hip('roof', 62.2, 70.6, -8.8, 8.6, MAIN_Y - 0.08, 2.6);

  // Darker flat roof east of the dome, the low stack roof in the aerial.
  wbox('stone2', -8.15, 16.5, 23.15, 23.7, -13.2, 13.2);
  if (near) {
    for (const z of [-8, -2.5, 3, 8.5]) flat('light', -2.2, 12.4, z - 0.7, z + 0.7, 23.95);
  }

  portico();
  stairs();
  fountain();
  facades();
  courts();
  dome();

  function courtFloor(span) {
    wbox('stone2', COURT_X0 - 0.35, COURT_X1 + 0.35, 0.12, 0.4, span.z0 - 0.35, span.z1 + 0.35);
  }

  function dress(fr, s0, s1, bay) {
    fr.box('stone2', s0, s1, 0.08, 5.55, 0.06, 0.4);
    fr.box('stone2', s0, s1, 2.15, 2.38, 0.1, 0.32);
    fr.box('stone2', s0, s1, 3.85, 4.08, 0.1, 0.32);
    for (const y of [5.62, 11.4, 18.2]) fr.box('stone', s0, s1, y, y + 0.46, 0.12, 0.58);
    fr.box('stone', s0, s1, 21.7, 22.95, 0.14, 0.7);
    fr.box('stone', s0, s1, 22.75, 24.35, 0.18, 0.66);
    const n = Math.max(1, Math.round((s1 - s0) / bay));
    const step = (s1 - s0) / n;
    for (let i = 0; i <= n; i++) {
      const s = s0 + step * i;
      fr.box('stone', s - 0.22, s + 0.22, 5.55, 21.65, 0.18, 0.55);
    }
    for (const row of ROWS) {
      const ww = Math.min(row.w, step * 0.52);
      for (let i = 0; i < n; i++) {
        const c = s0 + step * (i + 0.5);
        if (row.y0 < 4) {
          fr.arch('light', c, 1.35, Math.min(step * 0.46, 2.15), 3.85, proud);
        } else {
          fr.quad('light', c - ww / 2, c + ww / 2, row.y0, row.y1, proud);
          if (near) fr.box('stone2', c - 0.07, c + 0.07, row.y0 + 0.08, row.y1 - 0.08, proud + 0.16, proud + 0.3);
        }
      }
    }
    if (near) {
      const posts = Math.max(2, Math.round((s1 - s0) / 2.6));
      const ps = (s1 - s0) / posts;
      for (let i = 0; i <= posts; i++) {
        const s = s0 + ps * i;
        fr.box('stone', s - 0.14, s + 0.14, 22.7, 24.5, 0.14, 0.68);
      }
    }
  }

  function facades() {
    // West wings, between the portico and the corner pavilions.
    dress(frame(WEST, 0, Math.PI), -51.6, -17.8, 3.7);
    dress(frame(WEST, 0, Math.PI), 17.8, 51.8, 3.7);
    // South and north, between the corner bays. The plane is inset so the
    // parapet (0.68 m proud) stays inside the main wall at z ≈ ±68.8.
    dress(frame(-1, 67.95, Math.PI / 2), -31.2, 31.2, 3.85);
    dress(frame(-1, -67.95, -Math.PI / 2), -31.2, 31.2, 3.85);
    // East wall, between the spur and the corner pavilions.
    dress(frame(EAST, 0, 0), -52.0, -23.4, 3.85);
    dress(frame(EAST, 0, 0), 23.4, 52.2, 3.85);
    // Outer faces of the four pavilions. s is left-to-right from outside.
    cornerFace(frame(-52.21, 0, Math.PI), 54.3, 68.6); // SW west
    cornerFace(frame(0, 71.48, Math.PI / 2), -49.6, -35.6); // SW south
    cornerFace(frame(49.8, 0, 0), -68.4, -54.3); // SE east
    cornerFace(frame(0, 71.34, Math.PI / 2), 33.0, 47.1); // SE south
    cornerFace(frame(-52.0, 0, Math.PI), -68.9, -53.8); // NW west
    cornerFace(frame(0, -71.42, -Math.PI / 2), 35.3, 49.6); // NW north
    cornerFace(frame(49.82, 0, 0), 54.1, 69.1); // NE east
    cornerFace(frame(0, -71.37, -Math.PI / 2), -47.2, -33.0); // NE north
    // East spur. s is left-to-right on that face, not a world coordinate:
    // a north face (phi -π/2) runs s = −x, a south face runs s = +x.
    dress(frame(71.4, 0, 0), -9.4, 9.6, 3.5); // nose, outward east
    dress(frame(0, -22.2, -Math.PI / 2), -55.5, -45.6, 3.4); // inner shoulder, north
    dress(frame(0, 22.0, Math.PI / 2), 45.6, 55.5, 3.4);
    dress(frame(0, -11.15, -Math.PI / 2), -59.4, -56.2, 3.2); // middle step, kept inside the ring's step
    dress(frame(0, 11.05, Math.PI / 2), 56.2, 60.2, 3.2);
    dress(frame(0, -10.05, -Math.PI / 2), -71.2, -61.5, 3.3); // nose cheeks
    dress(frame(0, 9.7, Math.PI / 2), 61.5, 71.2, 3.3);
    // Returns of the west portico.
    const ret = frame(-49.6, PORTICO.z1, Math.PI / 2);
    ret.box('stone2', -3.2, 3.2, 0.1, 5.3, 0.06, 0.24);
    ret.quad('light', -1.05, -0.15, 7.1, 10.4, proud);
    ret.quad('light', 0.15, 1.05, 7.1, 10.4, proud);
    ret.quad('light', -0.7, 0.7, 14.2, 17.6, proud);
    const retN = frame(-49.6, PORTICO.z0, -Math.PI / 2);
    retN.quad('light', -1.05, -0.15, 7.1, 10.4, proud);
    retN.quad('light', 0.15, 1.05, 7.1, 10.4, proud);
    retN.quad('light', -0.7, 0.7, 14.2, 17.6, proud);
  }

  function cornerFace(fr, s0, s1) {
    dress(fr, s0, s1, Math.min(3.4, (s1 - s0) / 3));
  }

  function pavilion(x0, x1, z0, z1) {
    const m = 0.65;
    const a = x0 + m, b = x1 - m, c = z0 + m, d = z1 - m;
    // Raised dark metal stage with separate dormer lights, below the hip crown.
    wbox('roof', a, b, 24.9, 29.05, c, d);
    hip('roof', a - 0.12, b + 0.12, c - 0.12, d + 0.12, 28.95, 1.65);
    const stageFaces = [
      [frame(a, 0, Math.PI), c, d], [frame(b, 0, 0), -d, -c],
      [frame(0, c, -Math.PI / 2), -b, -a], [frame(0, d, Math.PI / 2), a, b],
    ];
    for (const [fr, s0, s1] of stageFaces) {
      const n = Math.max(3, Math.round((s1 - s0) / 2.65));
      const step = (s1 - s0) / n;
      for (let i = 0; i < n; i++) {
        const s = s0 + step * (i + 0.5), w = Math.min(1, step * 0.42);
        if (near) fr.box('stone2', s - w/2 - 0.18, s + w/2 + 0.18, 25.55, 28.45, 0.12, 0.24);
        else fr.quad('stone2', s - w/2 - 0.18, s + w/2 + 0.18, 25.55, 28.45, 0.15);
        fr.quad('light', s - w/2, s + w/2, 25.85, 28.1, near ? 0.42 : 0.7);
      }
    }
  }

  function portico() {
    wbox('stone', PORTICO.xFace, PORTICO.xBack, 0, PORTICO.y, PORTICO.z0, PORTICO.z1);
    // Upper attic of the centre pavilion, slightly proud of the wing cornice.
    wbox('stone', PORTICO.xFace - 0.45, PORTICO.xBack + 0.35, 22.15, PORTICO.y + 0.35, PORTICO.z0 + 0.3, PORTICO.z1 - 0.3);
    const fr = frame(PORTICO.xFace, 0, Math.PI);
    const colD = near ? 1.28 : 1.08;
    fr.box('stone', PORTICO.z0 + 0.4, PORTICO.z1 - 0.4, 5.1, 5.5, 0.12, 1.55);
    fr.box('stone', PORTICO.z0, PORTICO.z1, 11.05, 12.15, 0.22, colD + 0.35);
    // Entablature stands proud of the column shafts.
    fr.box('stone', PORTICO.z0 - 0.1, PORTICO.z1 + 0.1, 20.95, 22.5, colD - 0.2, colD + 0.7);
    fr.box('stone', PORTICO.z0 + 0.15, PORTICO.z1 - 0.15, 22.35, 23.3, colD - 0.05, colD + 0.4);
    fr.box('stone', PORTICO.z0, PORTICO.z1, 24.4, 26.4, 0.1, 0.78);
    for (const s of ARCH_S) {
      fr.arch('stone2', s, 5.1, 4.85, 6.15, 0.05);
      fr.arch('bronze', s, 5.48, 3.4, 5.05, near ? 0.48 : 0.78);
      const jd = near ? 1.05 : 0.88;
      fr.box('stone', s - 2.55, s - 1.78, 5.15, 10.75, 0.28, jd);
      fr.box('stone', s + 1.78, s + 2.55, 5.15, 10.75, 0.28, jd);
      // Archivolt outside the opening. The crown is above the door ray at y=7.1.
      const ar = 2.42, spring = 9.05, nA = near ? 5 : 3;
      for (let i = 0; i <= nA; i++) {
        const a = (i / nA) * Math.PI;
        const ss = s + Math.cos(a) * ar;
        const yy = spring + Math.sin(a) * ar;
        fr.box('stone', ss - 0.2, ss + 0.2, yy - 0.18, yy + 0.2, 0.55, jd + 0.06);
      }
      fr.box('stone', s - 0.34, s + 0.34, spring + ar - 0.05, spring + ar + 0.42, 0.6, jd + 0.16);
      fr.quad('light', s - 0.72, s + 0.72, 9.25, 10.25, near ? 0.64 : 0.94);
    }
    // Paired Corinthian screen, standing clear of the wall, and the oculi between the pairs.
    const cols = [-12.4, -10.15, -6.55, -4.3, -1.15, 1.15, 4.3, 6.55, 10.15, 12.4];
    for (const s of cols) fr.col('stone', s, colD, 12.15, 20.85, near ? 0.46 : 0.52);
    const oculi = [-11.3, -8.35, -5.45, -2.7, 2.7, 5.45, 8.35, 11.3];
    for (const s of oculi) {
      const g = new THREE.CircleGeometry(near ? 0.62 : 0.7, near ? 10 : 7);
      g.translate(s, 19.15, near ? 0.4 : 0.7);
      put(g, 'light', frMatrix());
      if (near) {
        const head = new THREE.SphereGeometry(0.32, 7, 5);
        head.translate(s, 19.15, 0.85);
        put(head, 'stone', frMatrix());
      }
    }
    // Rectangular windows behind the column screen.
    for (const s of [-9.2, -5.4, 0, 5.4, 9.2]) fr.quad('light', s - 0.7, s + 0.7, 13.6, 17.4, 0.28);
    if (near) {
      for (let s = PORTICO.z0 + 0.8; s < PORTICO.z1; s += 0.85) {
        fr.box('stone', s, s + 0.36, 21.35, 21.85, 1.05, 1.4);
      }
    }
    // Balustrade on the balcony and the attic.
    fr.box('stone', PORTICO.z0 + 0.2, PORTICO.z1 - 0.2, 12.0, 12.85, 1.35, 1.7);
    if (near) {
      for (let s = PORTICO.z0 + 1; s < PORTICO.z1; s += 1.35) fr.box('stone', s, s + 0.22, 12.0, 13.15, 1.3, 1.78);
    }

    function frMatrix() {
      return new THREE.Matrix4().makeBasis(
        new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 1, 0), new THREE.Vector3(-1, 0, 0),
      ).setPosition(PORTICO.xFace, 0, 0);
    }
  }

  function stairs() {
    wbox('stone', TERRACE_X, PORTICO.xFace + 0.4, 0, STAIR.y, PORTICO.z0, PORTICO.z1);
    ramp(RAMP_S.z0, RAMP_S.z1, 1);
    ramp(RAMP_N.z0, RAMP_N.z1, -1);
  }

  function ramp(z0, z1, side) {
    const n = near ? 16 : 7;
    for (let i = 0; i < n; i++) {
      const t0 = i / n, t1 = (i + 1) / n;
      const xa = STAIR.x0 + (STAIR.x1 - STAIR.x0) * t0;
      const xb = STAIR.x0 + (STAIR.x1 - STAIR.x0) * t1;
      const ya = STAIR.y * t0;
      const yb = STAIR.y * t1;
      wbox('stone', xa, xb + 0.12, ya, yb, z0, z1);
      const zo0 = side > 0 ? z1 - 0.85 : z0;
      const zo1 = side > 0 ? z1 : z0 + 0.85;
      wbox('stone', xa, xb + 0.12, ya, yb + 0.85, zo0, zo1);
    }
  }

  function fountain() {
    const { x, z, r } = FOUNTAIN;
    const bowl = x - r * 0.38;
    const water = new THREE.CircleGeometry(r * 0.52, near ? 20 : 12);
    water.rotateX(-Math.PI / 2);
    water.translate(bowl, 0.52, z);
    put(water, 'stone2');
    const n = near ? 16 : 8;
    const a0 = Math.PI / 2, a1 = Math.PI * 1.5;
    for (let i = 0; i < n; i++) {
      const am = a0 + (a1 - a0) * (i + 0.5) / n;
      const dth = (a1 - a0) / n;
      const seg = new THREE.BoxGeometry(r * dth * 1.02, 1.15, 0.48);
      seg.rotateY(Math.PI / 2 - am);
      seg.translate(x + (r - 0.05) * Math.cos(am), 0.62, z + (r - 0.05) * Math.sin(am));
      put(seg, 'stone');
    }
    // Neptune, trident and two flanking figures. Grouped silhouettes, not a scan.
    const fx = bowl - 0.15;
    wbox('stone', fx - 1.05, fx + 0.85, 0.42, 1.55, -1.05, 1.05);
    wbox('bronze', fx - 0.48, fx + 0.38, 1.4, 4.55, -0.46, 0.46);
    const head = new THREE.SphereGeometry(0.4, near ? 8 : 6, 6);
    head.translate(fx, 4.85, 0);
    put(head, 'bronze');
    bar('bronze', [fx, 3.5, 0], [fx - 1.35, 5.15, 0], 0.16, 0.16);
    const tx = fx - 1.35, ty = 5.15;
    bar('bronze', [tx, ty - 0.15, 0], [tx, ty + 1.15, 0], 0.08, 0.08);
    bar('bronze', [tx - 0.28, ty + 0.85, 0], [tx + 0.28, ty + 0.85, 0], 0.07, 0.07);
    if (near) {
      bar('bronze', [tx - 0.22, ty + 0.85, 0], [tx - 0.22, ty + 1.2, 0], 0.05, 0.05);
      bar('bronze', [tx + 0.22, ty + 0.85, 0], [tx + 0.22, ty + 1.2, 0], 0.05, 0.05);
    }
    for (const zs of [-1, 1]) {
      wbox('bronze', fx - 0.15, fx + 0.45, 0.5, 2.55, zs * 1.15, zs * 2.15);
      const h2 = new THREE.SphereGeometry(0.3, 6, 5);
      h2.translate(fx + 0.15, 2.8, zs * 1.65);
      put(h2, 'bronze');
    }
  }

  function courts() {
    const faces = [
      { x: COURT_X0, z: (COURT_S.z0 + COURT_S.z1) / 2, phi: 0, s0: -15.2, s1: 15.2 },
      { x: COURT_X1, z: (COURT_S.z0 + COURT_S.z1) / 2, phi: Math.PI, s0: -15.2, s1: 15.2 },
      { x: (COURT_X0 + COURT_X1) / 2, z: COURT_S.z0, phi: Math.PI / 2, s0: -12.4, s1: 12.4 },
      { x: (COURT_X0 + COURT_X1) / 2, z: COURT_S.z1, phi: -Math.PI / 2, s0: -12.4, s1: 12.4 },
      { x: COURT_X0, z: (COURT_N.z0 + COURT_N.z1) / 2, phi: 0, s0: -15.2, s1: 15.2 },
      { x: COURT_X1, z: (COURT_N.z0 + COURT_N.z1) / 2, phi: Math.PI, s0: -15.2, s1: 15.2 },
      { x: (COURT_X0 + COURT_X1) / 2, z: COURT_N.z1, phi: -Math.PI / 2, s0: -12.4, s1: 12.4 },
      { x: (COURT_X0 + COURT_X1) / 2, z: COURT_N.z0, phi: Math.PI / 2, s0: -12.4, s1: 12.4 },
    ];
    for (const f of faces) {
      const fr = frame(f.x, f.z, f.phi);
      const n = near ? 6 : 4;
      const step = (f.s1 - f.s0) / n;
      const w = step * 0.62;
      const dArch = near ? 0.46 : 0.75;
      for (let i = 0; i < n; i++) {
        const c = f.s0 + step * (i + 0.5);
        fr.arch('light', c, 1.3, w, 4.6, dArch);
        fr.box('stone', c - step / 2, c - w / 2 + 0.02, 1.2, 6.15, 0.08, 0.24);
        fr.quad('light', c - w * 0.28, c + w * 0.28, 8.4, 11.6, proud);
        fr.quad('light', c - w * 0.24, c + w * 0.24, 14.3, 17.2, proud);
      }
      fr.box('stone', f.s0, f.s1, 21.4, 22.7, 0.08, 0.4);
    }
  }

  function dome() {
    const { x, z } = DOME;
    wbox('stone', PODIUM.x0, PODIUM.x1, PODIUM.y0, 27.4, PODIUM.z0, PODIUM.z1);
    wbox('stone', PODIUM.x0 + 1.3, PODIUM.x1 - 1.3, 27.15, PODIUM.y1, PODIUM.z0 + 1.3, PODIUM.z1 - 1.3);
    // Podium windows, one band on each face.
    band(frame((PODIUM.x0 + PODIUM.x1) / 2, PODIUM.z1, Math.PI / 2), -12.2, 12.2, 24.1, 26.5);
    band(frame((PODIUM.x0 + PODIUM.x1) / 2, PODIUM.z0, -Math.PI / 2), -12.2, 12.2, 24.1, 26.5);
    band(frame(PODIUM.x0, 0, Math.PI), -12.4, 12.4, 24.1, 26.5);
    band(frame(PODIUM.x1, 0, 0), -12.4, 12.4, 24.1, 26.5);

    prism('stone', x, z, 12.15, seg, 31.15, 33.05);
    prism('stone', x, z, 11.45, seg, 32.85, 39.45);
    const bays = near ? 16 : 10;
    for (let i = 0; i < bays; i++) {
      const a = (i / bays) * Math.PI * 2;
      const ca = Math.cos(a), sa = Math.sin(a);
      bar('stone', [x + 11.85 * ca, 32.9, z + 11.85 * sa], [x + 11.85 * ca, 39.4, z + 11.85 * sa], near ? 0.55 : 0.7, 0.7);
      const wa = a + Math.PI / bays;
      quad('light',
        new THREE.Vector3(x + 11.72 * Math.cos(wa), 36.05, z + 11.72 * Math.sin(wa)),
        new THREE.Vector3(Math.cos(wa), 0, Math.sin(wa)),
        near ? 1.25 : 1.55, 3.9);
    }
    lathe('stone', x, z, [[12.05, 39.35], [13.55, 40.05], [13.85, 40.85], [13.15, 41.2]], seg);
    lathe('copper', x, z, DOME_PROFILE, seg);
    ribs(near ? 16 : 8);
    // Windowed cupola on the saucer's shoulder. Dark drum, tall lights, small
    // dome, gilt Flame of Knowledge. The shell underneath stays copper.
    const yG = 47.28;
    prism('patina', x, z, 8.15, near ? 16 : 10, yG, yG + 0.7);
    // Hollow cornice. A solid cylinder here filled the cupola and cycled with the patina drum.
    const yRail = yG + 0.5;
    lathe('stone', x, z, [
      [8.28, yRail],
      [8.58, yRail + 0.06],
      [8.58, yRail + 0.42],
      [8.28, yRail + 0.48],
      [8.28, yRail],
    ], near ? 16 : 10);
    const yW0 = yG + 1.05;
    const yW1 = yW0 + 4.85;
    prism('patina', x, z, 6.45, near ? 14 : 8, yW0 - 0.12, yW0 + 0.22);
    prism('patina', x, z, 6.2, near ? 14 : 8, yW0, yW1);
    const lanterns = near ? 10 : 8;
    for (let i = 0; i < lanterns; i++) {
      const a = (i / lanterns) * Math.PI * 2;
      bar('patina',
        [x + 6.4 * Math.cos(a), yW0, z + 6.4 * Math.sin(a)],
        [x + 6.4 * Math.cos(a), yW1, z + 6.4 * Math.sin(a)],
        near ? 0.36 : 0.48, 0.42);
      const wa = a + Math.PI / lanterns;
      quad('light',
        new THREE.Vector3(x + 6.08 * Math.cos(wa), (yW0 + yW1) / 2, z + 6.08 * Math.sin(wa)),
        new THREE.Vector3(Math.cos(wa), 0, Math.sin(wa)),
        near ? 1.65 : 1.9, 3.35);
    }
    prism('patina', x, z, 7.15, near ? 14 : 8, yW1 - 0.12, yW1 + 0.78);
    lathe('patina', x, z, [
      [6.55, yW1 + 0.5],
      [5.85, yW1 + 1.15],
      [4.45, yW1 + 2.2],
      [2.75, yW1 + 3.1],
      [1.25, yW1 + 3.75],
      [0.55, yW1 + 4.1],
    ], near ? 20 : 12);
    const flameH = 1.9;
    const flameBase = TIP - flameH;
    prism('gold', x, z, 0.82, near ? 8 : 6, yW1 + 3.65, flameBase + 0.1);
    const cup = new THREE.CylinderGeometry(0.58, 0.98, 0.46, near ? 8 : 6);
    cup.translate(x, flameBase + 0.02, z);
    put(cup, 'gold');
    // Faceted gilt torch. The centre cone's tip is the building's top vertex.
    const flame = new THREE.ConeGeometry(0.95, flameH, near ? 8 : 6);
    flame.translate(x, TIP - flameH / 2, z);
    put(flame, 'gold');
    for (const [dx, dz, s] of [[0.3, 0.1, 0.6], [-0.24, 0.16, 0.48], [0.04, -0.28, 0.52]]) {
      const tongue = new THREE.ConeGeometry(0.36, flameH * s, near ? 6 : 5);
      tongue.translate(x + dx, TIP - flameH + flameH * s * 0.5 - 0.08, z + dz);
      put(tongue, 'gold');
    }
  }

  function band(fr, s0, s1, y0, y1) {
    const n = near ? 8 : 5;
    const step = (s1 - s0) / n;
    const w = step * 0.42;
    for (let i = 0; i < n; i++) {
      const c = s0 + step * (i + 0.5);
      fr.quad('light', c - w / 2, c + w / 2, y0, y1, proud);
    }
  }

  function ribs(n) {
    const y0 = DOME_PROFILE[0][1], y1 = DOME_PROFILE[DOME_PROFILE.length - 1][1];
    const steps = near ? 10 : 6;
    const rise = near ? 0.72 : 0.85;
    for (let k = 0; k < n; k++) {
      const angle = (k / n) * Math.PI * 2;
      const pos = [], idx = [];
      for (let i = 0; i <= steps; i++) {
        const y = y0 + ((y1 - y0) * i) / steps;
        const r = domeRadius(y);
        const yb = Math.min(y1, y + 0.3), ya = Math.max(y0, y - 0.3);
        const nr = (domeRadius(ya) - domeRadius(yb)) / (yb - ya || 1);
        const nl = Math.hypot(nr, 1);
        const peakR = r + rise / nl, peakY = y + (nr / nl) * rise;
        const half = Math.min(0.34, r * 0.12) / Math.max(r, 0.4);
        for (const [rr, yy, da] of [[r + 0.06, y, -half], [peakR, peakY, 0], [r + 0.06, y, half]]) {
          pos.push(DOME.x + rr * Math.cos(angle + da), yy, DOME.z + rr * Math.sin(angle + da));
        }
      }
      for (let i = 0; i < steps; i++) {
        const a = i * 3, c = (i + 1) * 3;
        idx.push(a, c, a + 1, a + 1, c, c + 1, a + 1, c + 1, a + 2, a + 2, c + 1, c + 2);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.setIndex(idx);
      g.computeVertexNormals();
      put(g, 'patina');
    }
  }
}
