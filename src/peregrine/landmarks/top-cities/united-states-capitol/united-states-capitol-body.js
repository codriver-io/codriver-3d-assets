import * as THREE from 'three';
import { Y, EAST_FRONT, EAST_RETURN, WEST_FRONT, END_FRONT } from './united-states-capitol-plan.js';

// Wings, the centre block, the east portico (22 columns), the west portico and the
// shallow north and south temple fronts. Masses overlap so no two exterior faces share a plane.

const SKIRT = 0.22; // rusticated base stands proud of the wall above it

export function buildBody(kit) {
  const { wbox, frame, near } = kit;

  const mass = (x0, x1, z0, z1, yTop = Y.wall) => {
    wbox('stone', x0, x1, 0.12, yTop, z0, z1);
    wbox('stone2', x0 - SKIRT, x1 + SKIRT, 0, Y.base, z0 - SKIRT, z1 + SKIRT);
  };

  // `sides` drops a lip that would cross a step in the outline. East/west lips still
  // run the full length; north/south lips are the ones that jump a setback.
  const cornice = (x0, x1, z0, z1, p = 0.42, sides = 'nsew') => {
    if (sides.includes('e')) wbox('stone', x1 - 0.06, x1 + p, Y.corn0, Y.corn1, z0 - 0.08, z1 + 0.08);
    if (sides.includes('w')) wbox('stone', x0 - p, x0 + 0.06, Y.corn0, Y.corn1, z0 - 0.08, z1 + 0.08);
    if (sides.includes('s')) wbox('stone', x0 - 0.08, x1 + 0.08, Y.corn0, Y.corn1, z1 - 0.06, z1 + p);
    if (sides.includes('n')) wbox('stone', x0 - 0.08, x1 + 0.08, Y.corn0, Y.corn1, z0 - p, z0 + 0.06);
  };

  const parapet = (x0, x1, z0, z1) => {
    const post = (x, z) => wbox('stone', x - 0.18, x + 0.18, 24.4, 26.22, z - 0.18, z + 0.18);
    const rail = (xa, xb, za, zb) => wbox('stone', xa, xb, 26.12, Y.parapet, za, zb);
    if (!near) {
      wbox('stone', x0, x1, 24.32, Y.parapet, z0, z0 + 0.5);
      wbox('stone', x0, x1, 24.32, Y.parapet, z1 - 0.5, z1);
      wbox('stone', x0, x0 + 0.5, 24.32, Y.parapet, z0, z1);
      wbox('stone', x1 - 0.5, x1, 24.32, Y.parapet, z0, z1);
      return;
    }
    rail(x0, x1, z0, z0 + 0.38);
    rail(x0, x1, z1 - 0.38, z1);
    rail(x0, x0 + 0.38, z0, z1);
    rail(x1 - 0.38, x1, z0, z1);
    const step = 2.6;
    for (let x = x0 + 0.3; x < x1; x += step) { post(x, z0 + 0.16); post(x, z1 - 0.16); }
    for (let z = z0 + 0.3; z < z1; z += step) { post(x0 + 0.16, z); post(x1 - 0.16, z); }
  };

  const roof = (x0, x1, z0, z1, y0 = 24.08, y1 = 25.35) => wbox('roof', x0, x1, y0, y1, z0, z1);

  // Senate (north, z < 0) and House (south). s = -1 or +1.
  // Bands follow way 66418809: the wing is ~76 m wide, a shoulder steps in, then a
  // 31 m hyphen, then the link. Numbers are the tight side of the two wings, inset
  // so a 0.42 m cornice stays inside after the 0.12° wall rotation.
  const wing = (s) => {
    const zz = (inner, outer) => (s < 0 ? [-outer, -inner] : [inner, outer]);
    const [wide0, wide1] = zz(74.1, 105.2);
    const [sh0, sh1] = zz(68.3, 74.8);
    const [end0, end1] = zz(104.6, 110.7);
    mass(-41.2, 30.2, wide0, wide1);
    wbox('stone2', -44.3, 33.3, 0, Y.base, wide0 - 0.22, wide1 + 0.22);
    cornice(-44.2, 33.2, wide0, wide1, 0.42, 'ew');
    parapet(-43.8, 32.8, wide0 + 0.4, wide1 - 0.4);
    hipRoof(kit, -42.4, 31.4, wide0 + 1.2, wide1 - 1.2);

    // Shoulder between the wide wing and the hyphen. Narrower, so it can overlap both.
    mass(-41.1, 32.0, sh0, sh1);
    cornice(-41.1, 32.0, sh0, sh1, 0.42, 'ew');
    roof(-39.6, 30.6, sh0 + 0.8, sh1 - 0.8);

    // Block behind the end portico. No cornice on the outer end: that lip would
    // cross the step where the portico nose narrows to about 38 m.
    mass(-41.1, 31.6, end0, end1);
    cornice(-41.1, 31.6, end0, end1, 0.42, 'ew');
    parapet(-40.6, 31.1, end0 + 0.45, end1 - 0.45);
    roof(-39.4, 30.0, end0 + 1.0, end1 - 1.0);

    const east = frame(30.2, 0, 0);
    const west = frame(-41.2, 0, Math.PI);
    const zA = s < 0 ? -103.8 : 75.2;
    const zB = s < 0 ? -75.2 : 103.6;
    windows(east, -zB, -zA);
    windows(west, zA, zB, true);
    // Open side galleries of the House/Senate wings, present in both LODs.
    for (let j = 0; j < 10; j++) {
      const z = zA + 0.8 + (zB - zA - 1.6) * j / 9;
      columnAt(kit, 33.0, z, Y.col0, 21.95, 0.64, near ? 8 : 4);
      columnAt(kit, -43.9, z, Y.col0, 21.95, 0.64, near ? 8 : 4);
    }
    // Long outside end faces flank their projecting temple portico.
    const outside = frame(-5, s * 110.7, s * Math.PI / 2);
    windows(outside, -35, -10, true);
    windows(outside, 10, 35, true);
    // The short east wall behind the end portico, otherwise a blank pier.
    const endS0 = s < 0 ? 105.1 : -110.1;
    const endS1 = s < 0 ? 110.1 : -105.1;
    windows(frame(31.6, 0, 0), endS0, endS1);

    // East approach. The mapped terrace is solid against the facade only through the
    // middle of the wing; the two ends are a separate outer pad with a notch between.
    // One slope for the whole run, clipped to those pads. OSM height 8 is the pad, not a wall.
    const xHigh = 33.6, xLow = 56.0;
    const flight = (z0, z1, xa, xb) => stairs(xHigh, xLow, z0, z1, Y.base, xa, xb);
    if (s < 0) {
      flight(-100.5, -78.3, xHigh, xLow);
      flight(-103.2, -100.4, 48.3, xLow);
      flight(-78.4, -75.6, 48.3, xLow);
    } else {
      flight(78.4, 99.5, xHigh, xLow);
      flight(75.4, 78.5, 48.3, xLow);
      flight(99.4, 103.3, 48.3, xLow);
    }

    // North or south temple front. The mapped nose is about 3.5 m deep.
    const faceZ = s < 0 ? -113.05 : 113.05;
    const phi = s < 0 ? -Math.PI / 2 : Math.PI / 2;
    const end = frame(-5, faceZ, phi);
    const podiumZ0 = s < 0 ? -114.15 : 110.35;
    const podiumZ1 = s < 0 ? -110.35 : 114.15;
    wbox('stone', -18.2, 8.2, 0, Y.base, podiumZ0, podiumZ1);
    wbox('stone2', -18.4, 8.4, 0, 1.15, podiumZ0 + 0.08, podiumZ1 - 0.08);
    const span = 15.6;
    for (let i = 0; i < END_FRONT; i++) {
      const u = -span / 2 + (span * i) / (END_FRONT - 1);
      end.col('stone', u, 0.55, Y.col0, Y.col1 - 0.4, 0.58);
    }
    end.box('stone', -span / 2 - 1.1, span / 2 + 1.1, Y.col1 - 0.55, Y.entab - 0.35, 0.1, 1.05);
    end.pediment('stone', -span / 2 - 1.2, span / 2 + 1.2, Y.entab - 0.5, Y.endApex - (Y.entab - 0.5), 0.12, 1.05);
    end.pediment('stone2', -span / 2 + 0.9, span / 2 - 0.9, Y.entab - 0.15, Y.endApex - (Y.entab - 0.15) - 0.7, 1.08, 1.2);
    const back = frame(-5, s < 0 ? -110.72 : 110.72, phi);
    back.arch('light', 0, Y.col0, 2.3, 5.4, 0.24);
    back.quad('light', -4.6, -2.5, Y.col0 + 5.6, Y.col1 - 1.3, 0.24);
    back.quad('light', 2.5, 4.6, Y.col0 + 5.6, Y.col1 - 1.3, 0.24);
  };

  // basement: a third row on the rusticated base, proud of the skirt. Skip it where a stair covers the wall.
  const windows = (f, s0, s1, basement = false) => {
    const span = s1 - s0;
    const pitch = 4.15;
    const n = Math.max(span < 9 ? 2 : 3, Math.round(span / pitch));
    const step = span / n;
    const rows = [[7.05, 10.7], [13.15, 17.45]];
    for (let i = 0; i < n; i++) {
      const sC = s0 + step * (i + 0.5);
      for (const [y0, y1] of rows) {
        f.quad('light', sC - 0.85, sC + 0.85, y0, y1, 0.2);
        if (near) {
          f.box('stone', sC - 1.05, sC + 1.05, y1, y1 + 0.28, 0.12, 0.36);
          f.box('stone', sC - 1.0, sC + 1.0, y0 - 0.22, y0, 0.12, 0.38);
        }
      }
      if (basement) f.quad('light', sC - 0.62, sC + 0.62, 1.55, 3.85, 0.42);
      if (near) f.box('stone', sC - step / 2 - 0.02, sC - step / 2 + 0.32, Y.base + 0.15, 21.7, 0.04, 0.3);
    }
    f.box('stone', s0 - 0.2, s1 + 0.2, 11.55, 12.15, 0.08, 0.32);
  };

  // xNear is the high end (against the building), xFar the grade. Optional xa/xb clips the run.
  const stairs = (xNear, xFar, z0, z1, yTop, xa = xNear, xb = xFar) => {
    const n = near ? 18 : 5;
    const clipLo = Math.min(xa, xb), clipHi = Math.max(xa, xb);
    for (let i = 0; i < n; i++) {
      const t0 = i / n, t1 = (i + 1) / n;
      const a = xNear + (xFar - xNear) * t0 - 0.05;
      const b = xNear + (xFar - xNear) * t1;
      const lo = Math.max(Math.min(a, b), clipLo);
      const hi = Math.min(Math.max(a, b), clipHi);
      if (hi - lo < 0.12) continue;
      wbox('stone', lo, hi, 0, yTop * (1 - t0), z0, z1);
    }
  };

  wing(-1);
  wing(1);

  // Hyphen, the narrow waist (outline only ~31 m wide), then the wider link.
  const hyphen = (s) => {
    const z0 = s < 0 ? -68.2 : 51.6;
    const z1 = s < 0 ? -51.6 : 68.2;
    mass(-12.4, 16.5, z0, z1);
    cornice(-12.4, 16.5, z0, z1);
    parapet(-12.0, 16.1, z0 + 0.4, z1 - 0.4);
    roof(-10.8, 15.0, z0 + 1.1, z1 - 1.1);
    const zA = s < 0 ? -66.6 : 53.2;
    const zB = s < 0 ? -53.2 : 66.4;
    windows(frame(16.5, 0, 0), -zB, -zA, true);
    windows(frame(-12.4, 0, Math.PI), zA, zB, true);
  };
  const link = (s) => {
    const z0 = s < 0 ? -52.2 : 27.4;
    const z1 = s < 0 ? -27.4 : 52.2;
    mass(-22.8, 22.6, z0, z1);
    cornice(-22.8, 22.6, z0, z1, 0.42, s < 0 ? 'ewn' : 'ews');
    parapet(-22.35, 22.15, z0 + 0.45, z1 - 0.45);
    roof(-21.2, 21.0, z0 + 1.2, z1 - 1.2);
    const zA = s < 0 ? -50.4 : 29.2;
    const zB = s < 0 ? -29.2 : 50.2;
    windows(frame(22.6, 0, 0), -zB, -zA, true);
    windows(frame(-22.8, 0, Math.PI), zA, zB, true);
  };
  hyphen(-1); hyphen(1);
  link(-1); link(1);
  // Monitors over the links, under the balustrade (the mapped pyramids, flattened).
  wbox('roof', -12.4, 6.2, 24.08, 26.05, -47.5, -33.5);
  wbox('roof', -12.4, 6.2, 24.08, 26.05, 33.5, 47.5);

  // Centre under the dome. The west bulge only exists for |z| < 26; past that the
  // outline is the link. East corners fill the outline between the portico and the links.
  mass(-22.4, 22.0, -26.4, 26.4);
  cornice(-22.4, 22.0, -26.4, 26.4, 0.42, 'e');
  parapet(-21.9, 21.5, -25.8, 25.8);
  roof(-21.0, 20.6, -24.8, 24.8, 24.08, 25.6);

  mass(-39.6, -21.6, -24.8, 25.2);
  cornice(-39.6, -21.6, -24.8, 25.2, 0.42, 'w');
  parapet(-39.2, -22.2, -24.2, 24.6);
  roof(-38.2, -22.5, -23.6, 23.8, 24.08, 25.6);

  const westCorner = (s) => {
    const z0 = s < 0 ? -25.0 : 16.6;
    const z1 = s < 0 ? -16.6 : 25.0;
    mass(-44.4, -38.8, z0, z1);
    cornice(-44.4, -38.8, z0, z1, 0.42, s < 0 ? 'wn' : 'ws');
    parapet(-44.0, -39.3, z0 + 0.3, z1 - 0.3);
    roof(-43.2, -39.6, z0 + 0.6, z1 - 0.6, 24.08, 25.6);
    const f = frame(-44.4, 0, Math.PI);
    windows(f, z0 + 0.6, z1 - 0.6, true);
  };
  const eastCorner = (s) => {
    const z0 = s < 0 ? -24.4 : 11.2;
    const z1 = s < 0 ? -11.2 : 24.4;
    mass(21.2, 26.5, z0, z1);
    cornice(21.2, 26.5, z0, z1, 0.42, s < 0 ? 'en' : 'es');
    parapet(21.7, 26.05, z0 + 0.35, z1 - 0.35);
    roof(22.0, 25.2, z0 + 0.8, z1 - 0.8, 24.08, 25.6);
    // East frame s increases north, so s = -z and the range flips.
    windows(frame(26.5, 0, 0), -(z1 - 0.8), -(z0 + 0.8));
  };
  westCorner(-1); westCorner(1);
  eastCorner(-1); eastCorner(1);

  const archRow = (f, s0, s1, n) => {
    const step = (s1 - s0) / n;
    for (let i = 0; i < n; i++) {
      const sC = s0 + step * (i + 0.5);
      f.arch('light', sC, 0.7, Math.min(2.4, step * 0.62), 3.7, 0.28);
    }
  };
  archRow(frame(26.5, 0, 0), 12.2, 23.2, 3);
  archRow(frame(26.5, 0, 0), -23.2, -12.2, 3);
  archRow(frame(-44.4, 0, Math.PI), -24.2, -17.2, 2);
  archRow(frame(-44.4, 0, Math.PI), 17.2, 24.2, 2);

  eastPortico(kit, stairs);
  westPortico(kit, stairs);
}

function eastPortico(kit, stairs) {
  const { wbox, frame, near } = kit;
  // Podium. The outer nose is narrower, matching the mapped east steps.
  wbox('stone', 22.1, 36.4, 0, Y.base, -11.15, 11.15);
  wbox('stone2', 22.0, 36.5, 0, 1.2, -11.35, 11.35);
  wbox('stone', 35.8, 43.35, 0, Y.base, -9.35, 9.35);
  wbox('stone2', 35.7, 43.5, 0, 1.2, -9.55, 9.55);

  const front = frame(41.15, 0, 0);
  const span = 16.8;
  const zs = [];
  for (let i = 0; i < EAST_FRONT; i++) zs.push(-span / 2 + (span * i) / (EAST_FRONT - 1));
  for (const z of zs) front.col('stone', -z, 0.15, Y.col0, Y.col1, 0.66, near ? 10 : 5);
  // Returns: 7 columns a side, not counting the front corner, running back to the wall.
  const depth = 41.15 - 24.2;
  for (const side of [1, -1]) {
    for (let j = 1; j <= EAST_RETURN; j++) {
      const x = 41.15 - (depth * j) / EAST_RETURN;
      columnAt(kit, x, side * 9.55, Y.col0, Y.col1, 0.62, near ? 8 : 5);
    }
  }

  // Entablature and pediment. The tympanum is a darker recess; sculpture is a few blocks.
  front.box('stone', -span / 2 - 1.35, span / 2 + 1.35, Y.col1 - 0.05, Y.entab, -0.2, 1.45);
  front.box('stone', -10.6, 10.6, Y.col1 - 0.15, Y.entab, -6.5, -0.2); // ceiling of the porch, running back
  wbox('stone', 23.5, 41.4, Y.col1 - 0.2, Y.entab, -10.5, -9.3);
  wbox('stone', 23.5, 41.4, Y.col1 - 0.2, Y.entab, 9.3, 10.5);
  const rise = Y.apex - Y.entab;
  front.pediment('stone', -span / 2 - 1.6, span / 2 + 1.6, Y.entab - 0.7, rise + 0.7, 0.25, 1.7);
  front.pediment('stone2', -span / 2 + 1.1, span / 2 - 1.1, Y.entab + 0.15, rise - 0.85, 1.72, 1.86);
  if (near) {
    for (const [s, h] of [[-4.2, 1.5], [-2.2, 2.2], [0, 2.7], [2.4, 2.0], [4.6, 1.4]]) {
      front.box('stone', s - 0.45, s + 0.45, Y.entab + 0.5, Y.entab + 0.5 + h, 1.78, 2.02);
    }
  }

  // Wall behind the columns: three doors, windows above and between.
  const back = frame(22.45, 0, 0);
  back.box('stone2', -10.2, 10.2, Y.base, Y.col1 + 0.2, 0.02, 0.2);
  for (const s of [-4.4, 0, 4.4]) back.arch('light', s, Y.col0, 2.15, 5.6, 0.28);
  for (const s of [-7.4, -2.2, 2.2, 7.4]) back.quad('light', s - 0.85, s + 0.85, 12.4, 17.2, 0.28);

  stairs(43.2, 45.5, -8.0, 8.0, Y.base);
  // Arches on the podium nose, either side of the stair.
  const nose = frame(43.35, 0, 0);
  nose.arch('light', -6.4, 0.85, 2.2, 3.5, 0.22);
  nose.arch('light', 6.4, 0.85, 2.2, 3.5, 0.22);
}

function westPortico(kit, stairs) {
  const { wbox, frame, near } = kit;
  // Single rank of ten columns over an arched basement, the Mall front.
  wbox('stone', -48.55, -39.6, 0, Y.base, -14.35, 14.35);
  wbox('stone2', -48.75, -39.5, 0, 1.25, -14.55, 14.55);

  const front = frame(-47.55, 0, Math.PI);
  const span = 24.6;
  for (let i = 0; i < WEST_FRONT; i++) {
    const z = -span / 2 + (span * i) / (WEST_FRONT - 1);
    front.col('stone', z, 0.2, Y.col0, Y.col1, 0.68, near ? 10 : 5);
  }
  front.box('stone', -span / 2 - 1.4, span / 2 + 1.4, Y.col1 - 0.05, Y.entab, -0.2, 1.35);
  const rise = Y.apex - Y.entab;
  front.pediment('stone', -span / 2 - 1.5, span / 2 + 1.5, Y.entab - 0.7, rise + 0.7, 0.2, 1.5);
  front.pediment('stone2', -span / 2 + 1.3, span / 2 - 1.3, Y.entab + 0.15, rise - 0.9, 1.55, 1.68);
  if (near) {
    for (const [s, h] of [[-5.5, 1.6], [-2.6, 2.3], [0, 2.8], [2.8, 2.2], [5.6, 1.5]]) {
      front.box('stone', s - 0.5, s + 0.5, Y.entab + 0.55, Y.entab + 0.55 + h, 1.35, 1.62);
    }
  }

  const back = frame(-40.45, 0, Math.PI);
  back.box('stone2', -13.6, 13.6, Y.base, Y.col1 + 0.2, 0.02, 0.22);
  for (const s of [-5.2, 0, 5.2]) back.arch('light', s, Y.col0, 2.3, 5.6, 0.3);
  for (const s of [-9.2, -2.6, 2.6, 9.2]) back.quad('light', s - 0.9, s + 0.9, 12.5, 17.3, 0.3);

  // Arched basement on the podium face. The column rank stands behind it; the arches
  // have to clear the stone, or the lawn only sees a blank plinth.
  const podiumFace = frame(-48.55, 0, Math.PI);
  for (const z of [-10.2, -6.1, -2.05, 2.05, 6.1, 10.2]) podiumFace.arch('light', z, 1.4, 2.4, 3.45, 0.2);

  // Side flights. The long Olmsted cascade continues down the lawn, outside this outline.
  stairs(-40.0, -45.15, 16.8, 25.6, Y.base + 0.1);
  stairs(-40.0, -45.15, -25.6, -16.8, Y.base + 0.1);
}

// Vertical column in building axes (used for the east portico returns, which are not on one flat s-axis).
function columnAt(kit, x, z, y0, y1, r, sides) {
  const { put, near } = kit;
  if (!near) {
    const g = new THREE.CylinderGeometry(r,r*1.08,y1-y0+0.9,4,1,true);
    g.translate(x,(y0+y1)/2+0.1,z);put(g,'stone');return;
  }
  const shaft = new THREE.CylinderGeometry(r, r * 1.04, y1 - y0, sides, 1, true);
  shaft.translate(x, (y0 + y1) / 2, z);
  put(shaft, 'stone');
  const base = new THREE.CylinderGeometry(r * 1.28, r * 1.38, 0.64, sides, 1, false);
  base.translate(x, y0 - 0.02, z);
  put(base, 'stone');
  const cap = new THREE.CylinderGeometry(r * 1.42, r * 1.16, 0.7, sides, 1, false);
  cap.translate(x, y1 + 0.22, z);
  put(cap, 'stone');
}

// Four closed pitches over the broad chamber wings; ridge inset preserves the parapet.
function hipRoof(kit, x0, x1, z0, z1) {
  const lower = [[x0,24.08,z0],[x1,24.08,z0],[x1,24.08,z1],[x0,24.08,z1]];
  const upper = [[x0+7,27.2,z0+7],[x1-7,27.2,z0+7],[x1-7,27.2,z1-7],[x0+7,27.2,z1-7]];
  const g = new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute([...lower,...upper].flat(),3));
  const indices = [4,7,6,4,6,5];
  for(let i=0;i<4;i++){const j=(i+1)%4;indices.push(i,4+i,j,j,4+i,4+j);}
  g.setIndex(indices);g.computeVertexNormals();kit.put(g,'roof');
}
