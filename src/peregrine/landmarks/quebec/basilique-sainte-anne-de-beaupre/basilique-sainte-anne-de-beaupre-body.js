import { arch, disc } from './basilique-sainte-anne-de-beaupre-kit.js';
import { NAVE, AISLE, TRANSEPT, CHOIR, CHAPEL_ANGLES, AXIAL } from './basilique-sainte-anne-de-beaupre-plan.js';

const RAD = Math.PI / 180;
// A row of round-headed windows along a wall: side E/W (z along the wall) at plane `off`, from s0 every `pitch`, n windows.
function windowRow(k, side, off, s0, n, pitch, y0, w, h, seg = 3) {
  for (let i = 0; i < n; i++) k.panel('glass', arch(w, y0 + h - w / 2, y0, seg), side, s0 + i * pitch, y0, off);
}


// Standing-seam ribs of the copper roofs (the "decorative beading"): thin bars down a roof slope, lifted off the surface so
// their lower face is buried 3 cm and nothing is coplanar. a = high end, b = low end, n = outward normal of the slope.
function seam(k, a, b, n) {
  const l = Math.hypot(...n), up = (p) => [p[0] + (n[0] / l) * 0.07, p[1] + (n[1] / l) * 0.07, p[2] + (n[2] / l) * 0.07];
  k.bar('roof', up(a), up(b), 0.2, 0.2);
}
function roofSeams(k) {
  const N = NAVE, A = AISLE, T = TRANSEPT, hw = N.hw + 0.5, rise = N.ridge - N.clere + 0.1, pitch = 2.4;
  for (let z = CHOIR.cz + 2.0; z < 44.6; z += pitch) for (const sx of [1, -1]) seam(k, [0, N.ridge, z], [sx * hw, N.clere - 0.1, z], [sx * rise, hw, 0]);
  const th = T.hw + 0.4, tr = N.ridge - 0.3 - N.clere + 0.1;
  for (let x = -22.6; x < 22.7; x += pitch) for (const sz of [1, -1]) seam(k, [x, N.ridge - 0.3, T.zc], [x, N.clere - 0.1, T.zc + sz * th], [0, th, sz * tr]);
  for (let z = N.z0 + 1.0; z < N.z1 - 0.4; z += pitch) for (const sx of [1, -1]) {
    seam(k, [sx * 13.9, A.roof2, z], [sx * (N.ais2 + 0.2), A.wall2 + 0.1, z], [sx * (A.roof2 - A.wall2 - 0.1), N.ais2 + 0.2 - 13.9, 0]);
    seam(k, [sx * 7.2, A.roof1, z], [sx * (N.ais1 + 0.2), A.wall1 + 0.2, z], [sx * (A.roof1 - A.wall1 - 0.2), N.ais1 + 0.2 - 7.2, 0]);
  }
}

// The five-aisle nave: central nave under a gable roof, two aisles each side under lean-to roofs, pilasters and windows.
export function buildNave(k) {
  const { near } = k, N = NAVE, A = AISLE, nz = 8.6, pitch = 3.6, count = 7; // windows at z = 8.6 + 3.6 i
  k.box('stone', -N.hw, N.hw, 0, N.clere, CHOIR.cz, 45.4);
  if (near) roofSeams(k);
  k.gableZ('roof', 0, CHOIR.cz, 45.4, N.clere - 0.1, N.hw + 0.5, N.ridge - N.clere + 0.1);
  for (const sx of [1, -1]) {
    const a = (v) => sx * v, lo = (u, v) => (sx > 0 ? [u, v] : [-v, -u]);
    const [o0, o1] = lo(13.9, N.ais2), [i0, i1] = lo(7.2, N.ais1);
    k.box('stone', o0, o1, 0, A.wall2, N.z0 - 0.1, N.z1 + 0.2); // outer aisle
    k.box('stone', i0, i1, 0, A.wall1, N.z0 - 0.1, N.z1 + 0.2); // inner aisle
    // lean-to roofs: the high end is sunk into the wall it leans on, the eave overhangs by 0.2 m
    if (sx > 0) {
      k.wedge('roof', 13.9, N.ais2 + 0.2, A.wall2 - 0.1, A.roof2, A.wall2 + 0.1, N.z0 - 0.1, N.z1 + 0.2);
      k.wedge('roof', 7.2, N.ais1 + 0.2, A.wall1 - 0.2, A.roof1, A.wall1 + 0.2, N.z0 - 0.1, 45.4);
    } else {
      k.wedge('roof', -N.ais2 - 0.2, -13.9, A.wall2 - 0.1, A.wall2 + 0.1, A.roof2, N.z0 - 0.1, N.z1 + 0.2);
      k.wedge('roof', -N.ais1 - 0.2, -7.2, A.wall1 - 0.2, A.wall1 + 0.2, A.roof1, N.z0 - 0.1, 45.4);
    }
    if (!near) continue;
    const E = sx > 0 ? 'E' : 'W';
    windowRow(k, E, a(N.ais2 + 0.08), nz, count, pitch, 3.0, 1.5, 5.6); // outer aisle windows
    windowRow(k, E, a(N.ais1 + 0.08), nz, count, pitch, 16.2, 1.3, 3.5); // inner aisle windows above the outer roof
    windowRow(k, E, a(N.hw + 0.08), nz, count, pitch, 26.3, 1.4, 2.9); // clerestory
    for (let i = 0; i <= count; i++) { // pilasters between the windows of each stage
      const z = nz - pitch / 2 + i * pitch, [p0, p1] = lo(N.ais2 - 0.1, N.ais2 + 0.4), [q0, q1] = lo(N.ais1 - 0.1, N.ais1 + 0.4), [r0, r1] = lo(N.hw - 0.1, N.hw + 0.4);
      k.box('stone', p0, p1, 0, A.wall2 - 0.2, z - 0.45, z + 0.45);
      k.box('stone', q0, q1, 15.2, A.wall1 - 0.1, z - 0.4, z + 0.4);
      k.box('stone', r0, r1, 25.0, N.clere - 0.1, z - 0.4, z + 0.4);
    }
    // corbelled eave bands along the three walls
    for (const [ex, top] of [[N.ais2, A.wall2], [N.ais1, A.wall1], [N.hw, N.clere]]) {
      const [e0, e1] = lo(ex - 0.1, ex + 0.35);
      k.box('stone', e0, e1, top - 0.7, top, N.z0 + 0.2, N.z1 - 0.1);
    }
    // frames round the windows of the clerestory and the inner aisle (a darker stone surround)
    for (let i = 0; i < count; i++) {
      k.panel('recess', arch(2.0, 26.1 + 1.45, 26.1, 3), E, nz + i * pitch, 26.1, a(N.hw + 0.05));
      k.panel('recess', arch(1.9, 16.0 + 1.75, 16.0, 3), E, nz + i * pitch, 16.0, a(N.ais1 + 0.05));
      k.panel('recess', arch(2.1, 2.8 + 2.9, 2.8, 3), E, nz + i * pitch, 2.8, a(N.ais2 + 0.05));
    }
  }
}

// Crossing and transept: low blocks, the high transept under a gable roof crossing the nave roof, gable ends, apsidal ends.
// The high transept stays inside the width of the facade (x +-24.4; photographs show nothing taller beyond the front's
// flanks); the arms reach x +-26.4 as low blocks carrying the 5 m apsidal ends.
export function buildTransept(k) {
  const { near } = k, T = TRANSEPT, X = T.x, XH = 24.4, seg = near ? 10 : 6;
  // low blocks round the high transept and the roof slabs over them
  const low = [[-X, X, -29.0, T.z0 + 0.1], [-X, X, T.z1 - 0.1, 1.2], [-23.7, 23.7, 1.1, NAVE.z0 + 0.1], [XH - 0.3, X, T.z0, T.z1], [-X, -XH + 0.3, T.z0, T.z1], [-19.8, 19.8, CHOIR.zRear, -28.9]];
  low.forEach(([x0, x1, z0, z1], i) => {
    const top = i === 5 ? CHOIR.ambWall : T.low;
    k.box('stone', x0, x1, 0, top, z0, z1);
    k.box('roof', x0 - 0.15, x1 + 0.15, top, top + 0.3, z0 - (i === 2 ? 0 : 0.15), z1 + 0.15);
  });
  // high transept block, crossing roof and stone gable ends
  k.box('stone', -XH, XH, 0, NAVE.clere, T.z0, T.z1);
  const rise = NAVE.ridge - 0.3 - NAVE.clere;
  k.gableX('roof', -XH + 0.7, XH - 0.7, T.zc, NAVE.clere - 0.1, T.hw + 0.4, rise + 0.1);
  k.gableX('stone', XH - 0.7, XH, T.zc, NAVE.clere - 0.1, T.hw + 0.4, rise + 0.1);
  k.gableX('stone', -XH, -XH + 0.7, T.zc, NAVE.clere - 0.1, T.hw + 0.4, rise + 0.1);
  // apsidal ends: half cylinders with half-cone roofs (the other half is buried in the wall)
  for (const sx of [1, -1]) {
    const t0 = sx > 0 ? 0 : Math.PI, cx = sx * X;
    k.cyl('stone', cx, T.apseZ, 0, 15.5, T.apseR, T.apseR, seg + 2, true, t0, Math.PI);
    k.cone('roof', cx, T.apseZ, 15.4, 21.8, T.apseR + 0.3, seg + 2, t0, Math.PI);
    if (!near) continue;
    const E = sx > 0 ? 'E' : 'W', off = sx * (XH + 0.08), offLow = sx * (X + 0.08);
    k.panel('glass', arch(2.4, 26.4, 22.3, 4), E, T.zc, 22.3, off); // great window of the gable
    for (const dz of [-3.4, 3.4]) k.panel('glass', arch(1.5, 26.6, 23.2, 3), E, T.zc + dz, 23.2, off);
    k.panel('glass', disc(1.0, 10), E, T.zc, 33.2, off); // oculus in the gable
    for (const z of [-26.0, -2.4]) k.panel('glass', arch(1.5, 8.7, 3.2, 3), E, z, 3.2, offLow); // windows of the low arms
    for (const d of [-45, 0, 45]) { // windows round the apsidal end
      const a = d * RAD, nx = sx * Math.cos(a), nz = Math.sin(a);
      k.panelAt('glass', arch(1.4, 9.4, 4.0, 3), cx + nx * (T.apseR + 0.08), 4.0, T.apseZ + nz * (T.apseR + 0.08), nx, nz);
    }
  }
}

// Choir: the nave ends in a half-cylinder apse under a half cone; a lower ambulatory ring, seven radiating chapels, the axial chapel.
export function buildChoir(k) {
  const { near } = k, C = CHOIR, segA = near ? 16 : 8, segC = near ? 10 : 6;
  k.cyl('stone', 0, C.cz, 0, NAVE.clere, C.apseR, C.apseR, segA, true, Math.PI / 2, Math.PI);
  k.cone('roof', 0, C.cz, NAVE.clere - 0.1, NAVE.ridge, C.apseR + 0.5, segA, Math.PI / 2, Math.PI);
  k.cyl('stone', 0, C.cz, 0, C.ambWall, C.ambR, C.ambR, segA, true, Math.PI / 2, Math.PI); // ambulatory wall
  k.cyl('roof', 0, C.cz, C.ambWall - 0.1, 20.7, C.ambR + 0.2, C.apseR - 0.2, segA, true, Math.PI / 2, Math.PI); // its roof
  const spots = [];
  for (const sx of [1, -1]) for (const deg of CHAPEL_ANGLES) {
    const a = deg * RAD, nx = sx * Math.sin(a), nz = -Math.cos(a);
    spots.push({ x: nx * C.chapelRing, z: C.cz + nz * C.chapelRing, nx, nz });
  }
  for (const s of spots) {
    k.cyl('stone', s.x, s.z, 0, C.chapelWall, C.chapelR, C.chapelR, segC, true);
    k.cone('roof', s.x, s.z, C.chapelWall - 0.1, 13.0, C.chapelR + 0.2, segC);
    if (near) k.panelAt('glass', arch(1.2, 6.3, 2.6, 3), s.x + s.nx * (C.chapelR + 0.08), 2.6, s.z + s.nz * (C.chapelR + 0.08), s.nx, s.nz);
  }
  // chapel at each rear corner of the arms
  for (const sx of [1, -1]) {
    const x = sx * 23.0;
    k.cyl('stone', x, -29.1, 0, 9.0, C.chapelR, C.chapelR, segC, true);
    k.cone('roof', x, -29.1, 8.9, 13.5, C.chapelR + 0.2, segC);
  }
  // axial chapel
  k.box('stone', -AXIAL.hw, AXIAL.hw, 0, AXIAL.wall, AXIAL.z0, AXIAL.z1);
  k.gableZ('roof', 0, AXIAL.z0 + 0.7, AXIAL.z1 + 0.4, AXIAL.wall - 0.1, AXIAL.hw + 0.5, AXIAL.ridge - AXIAL.wall + 0.1);
  k.gableZ('stone', 0, AXIAL.z0 - 0.1, AXIAL.z0 + 0.7, AXIAL.wall - 0.1, AXIAL.hw + 0.5, AXIAL.ridge - AXIAL.wall + 0.1);
  if (!near) return;
  // windows: clerestory of the apse, ambulatory between the chapels, the axial chapel
  for (const deg of [-60, -30, 0, 30, 60]) {
    const a = deg * RAD, nx = Math.sin(a), nz = -Math.cos(a), r = C.apseR + 0.08;
    k.panelAt('glass', arch(1.4, 26.0, 21.8, 3), nx * r, 21.8, C.cz + nz * r, nx, nz);
  }
  for (const sx of [1, -1]) for (const deg of [13, 38, 62, 88]) {
    const a = deg * RAD, nx = sx * Math.sin(a), nz = -Math.cos(a), r = C.ambR + 0.08;
    k.panelAt('glass', arch(1.4, 7.6, 3.0, 3), nx * r, 3.0, C.cz + nz * r, nx, nz);
  }
  k.panel('glass', arch(1.6, 6.4, 2.4, 3), 'B', 0, 2.4, AXIAL.z0 - 0.08);
}

