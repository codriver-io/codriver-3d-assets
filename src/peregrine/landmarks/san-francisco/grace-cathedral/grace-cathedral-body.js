import * as THREE from 'three';
import { lancet, disc } from './grace-cathedral-kit.js';
import { NAVE, TRANSEPT, CHOIR, APSE, CROSSING_Z, FLECHE_AT, FLECHE_TIP, ENTRY_Y } from './grace-cathedral-plan.js';

const AISLE_WALL = NAVE.aisleWall, AISLE_TOP = NAVE.aisleTop;
const BAY_PITCH = 8.08, PIER_Z = Array.from({ length: 6 }, (_, i) => 29.0 - i * BAY_PITCH); // six buttress lines, five bays

// Nave: tall aisles behind buttress piers with pinnacles, flyers up to the clerestory, one steep slate-grey roof.
export function buildNave(k) {
  const { near } = k, N = NAVE, zc = CROSSING_Z;
  k.box('stone', -AISLE_WALL, AISLE_WALL, 0, AISLE_TOP, -15.0, 30.6);
  k.box('stone', -N.clearX, N.clearX, AISLE_TOP, N.eave, -25.0, 36.5); // clerestory, continued through the crossing
  k.gableZ('roof', 0, -25.4, 37.4, N.eave, 8.1, N.ridge - N.eave);
  k.gableZ('stone', 0, -26.2, -25.4, N.eave - 0.2, 8.3, N.ridge - N.eave + 0.5); // gable end over the choir roof
  for (const s of [-1, 1]) {
    k.box('roof', s > 0 ? N.clearX : -AISLE_WALL + 0.5, s > 0 ? AISLE_WALL - 0.5 : -N.clearX, AISLE_TOP, AISLE_TOP + 0.3, -12.6, N.z1 - 0.3); // aisle roof deck, one side at a time
  }
  // parapet along both aisle roofs
  for (const s of [-1, 1]) {
    const x0 = s > 0 ? AISLE_WALL - 0.5 : -AISLE_WALL, x1 = s > 0 ? AISLE_WALL : -AISLE_WALL + 0.5;
    k.box('stone', x0, x1, AISLE_TOP, AISLE_TOP + 0.9, -12.6, N.z1);
    if (near) for (let z = -11.4; z < N.z1 - 0.4; z += 1.8) k.box('stone', x0, x1, AISLE_TOP + 0.9, AISLE_TOP + 1.5, z - 0.4, z + 0.4);
  }
  for (const pz of PIER_Z) for (const s of [-1, 1]) {
    // buttress pier: a broad base to the aisle parapet, a weathered setback, a slimmer shaft and a pinnacle
    const x0 = s > 0 ? AISLE_WALL : -N.x, x1 = s > 0 ? N.x : -AISLE_WALL, px = (x0 + x1) / 2;
    if (near) {
      k.box('stone', x0, x1, 0, 18.0, pz - 0.65, pz + 0.65);
      k.frustum('stone', px, pz, 18.0, 19.2, 0.6, 0.5);
      k.box('stone', s > 0 ? AISLE_WALL : -N.x + 0.25, s > 0 ? N.x - 0.25 : -AISLE_WALL, 19.2, 26.5, pz - 0.5, pz + 0.5);
      k.pyramid('stone', px, pz, 26.5, 29.9, 0.5);
      for (const nz of [-1, 1]) k.gablet('stone', px, pz + nz * 0.1, 0, nz, 0.55, 22.4, 0.38, 2.0, 0.2); // gablets on the pier sides
      // double-curved flyer from the pier head to the clerestory wall, four bars along an arch
      const pts = Array.from({ length: 5 }, (_, j) => { const t = j / 4; return [s * (12.6 - 5.0 * t), 26.3 + 6.0 * t + 1.0 * Math.sin(Math.PI * t), pz]; });
      for (let j = 0; j < 4; j++) k.bar('stone', pts[j], pts[j + 1], 0.8, 0.85);
      k.box('stone', s > 0 ? N.clearX : -N.clearX - 0.8, s > 0 ? N.clearX + 0.8 : -N.clearX, 29.5, 33.4, pz - 0.5, pz + 0.5); // abutment on the clerestory wall
      k.pyramid('stone', s * (N.clearX + 0.4), pz, 33.4, 35.4, 0.5);
    } else {
      k.box('stone', x0, x1, 0, 26.5, pz - 0.55, pz + 0.55);
      k.pyramid('stone', px, pz, 26.5, 29.6, 0.55);
    }
  }
  // bay windows
  for (let i = 0; i < 5; i++) {
    const z = PIER_Z[i] - BAY_PITCH / 2;
    for (const [side, x] of [['E', AISLE_WALL], ['W', -AISLE_WALL]]) {
      const s = side === 'E' ? 1 : -1;
      k.panel('glass', lancet(2.6, 12.0, near ? 3 : 1, 1.1), side, z, 8.5, x + s * 0.18);
      if (!near) k.panel('recess', lancet(5.4, 15.2, 1, 1.1), side, z, ENTRY_Y + 0.5, x + s * 0.09);
      if (near) {
        k.box('stone', s > 0 ? x + 0.2 : x - 0.3, s > 0 ? x + 0.3 : x - 0.2, 8.5, 18.6, z - 0.06, z + 0.06); // mullion
        k.box('stone', s > 0 ? x + 0.2 : x - 0.3, s > 0 ? x + 0.3 : x - 0.2, 16.4, 16.55, z - 1.3, z + 1.3); // transom
        k.ring('stone', side, z, 19.9, x + s * 0.3, 0.2, 0.42, 0.1, 10); // tracery ring in the head
        k.panel('recess', lancet(5.4, 15.2, 3, 1.1), side, z, ENTRY_Y + 0.5, x + s * 0.09);
        k.panel('glass', disc(0.75, 8), side, z, 22.9, x + s * 0.1);
        k.panel('glass', lancet(1.5, 6.0, 3, 1.1), side, z, 26.6, N.clearX * s + s * 0.14); // clerestory lancet
      }
    }
  }
  void zc;
}

// Transepts: gabled arms with a great lancet window in each end, corner buttresses and pinnacles.
export function buildTransept(k) {
  const { near } = k, T = TRANSEPT, zc = (T.z0 + T.z1) / 2, hw = (T.z1 - T.z0) / 2;
  const X = T.x - 0.5, Z0 = T.z0 + 0.5, Z1 = T.z1 - 0.5; // body inside the buttress line
  k.box('stone', -X, X, 0, T.eave, Z0, Z1);
  const rise = T.ridge - T.eave, slope = rise / hw, roofY0 = T.eave - 0.35 * slope;
  k.gableX('roof', -T.x + 0.4, T.x - 0.4, zc, roofY0, hw + 0.35, T.ridge - roofY0);
  for (const s of [-1, 1]) {
    // gable wall with a coping standing proud of the roof
    k.gableX('stone', s > 0 ? X - 0.8 : -X, s > 0 ? X : -X + 0.8, zc, T.eave, hw + 0.2, rise + 0.4);
    const side = s > 0 ? 'E' : 'W';
    k.pyramid('stone', s * (X - 0.4), zc, T.ridge + 0.1, T.ridge + 3.4, 0.5); // finial on the gable
    k.panel('glass', lancet(5.2, 17.5, near ? 4 : 1, 1.1), side, zc, 8.0, s * (X + 0.14));
    if (near) { // mullions and transoms of the great window
      for (const dz of [-1.3, 0, 1.3]) k.box('stone', s * (X + 0.05) - 0.06, s * (X + 0.05) + 0.06 + 0.1, 8.0, 19.0, zc + dz - 0.07, zc + dz + 0.07);
      for (const y of [12.5, 16.5]) k.box('stone', s * (X + 0.05) - 0.06, s * (X + 0.05) + 0.06 + 0.1, y, y + 0.14, zc - 2.5, zc + 2.5);
    }
    if (near) {
      k.panel('recess', lancet(6.6, 20.5, 4, 1.1), side, zc, ENTRY_Y + 0.6, s * (X + 0.07));
      k.panel('recess', disc(1.3, 12), side, zc, T.eave + 2.2, s * (X + 0.06));
    }
    for (const z of [T.z0, T.z1]) {
      const pz = z + (z < zc ? 0.5 : -0.5);
      k.box('stone', s > 0 ? X - 0.4 : -T.x, s > 0 ? T.x : -X + 0.4, 0, 29.5, pz - 0.5, pz + 0.5);
      k.pyramid('stone', s * (X - 0.4 + T.x) / 2, pz, 29.5, 33.0, 0.45);
    }
    if (near) for (const z of [T.z0, T.z1]) { // arm faces toward the nave and the choir
      const dir = z === T.z1 ? 1 : -1, off = (z === T.z1 ? Z1 : Z0) + dir * 0.16;
      for (const cx of [s * 17.0]) k.panel('glass', lancet(2.2, 12.5, 3, 1.1), dir > 0 ? 'F' : 'B', cx, 9.0, off);
    }
  }
}

// Choir and apse: a lower, narrower vessel ending in a polygonal apse under a hipped half-cone.
export function buildChoir(k) {
  const { near } = k, C = CHOIR, A = APSE, X = C.x - 0.8, RX = A.rx - 0.8, RZ = A.rz - 0.8;
  k.box('stone', -X, X, 0, C.top, C.z0, -24.0);
  k.gableZ('roof', 0, C.z0, -20.0, C.top + 0.1, X + 0.45, C.ridge - C.top - 0.1);
  const facets = near ? 7 : 5, pts = Array.from({ length: facets + 1 }, (_, i) => { const t = (i / facets) * Math.PI; return [RX * Math.cos(t), A.zc - RZ * Math.sin(t)]; });
  k.prism('stone', pts, 0, C.top);
  // hipped half-cone over the apse, rising to the end of the choir ridge
  const cone = new THREE.CylinderGeometry(0.01, X + 0.5, C.ridge - C.top - 0.1, facets, 1, true, Math.PI / 2, Math.PI);
  cone.scale(1, 1, (RZ + 0.5) / (X + 0.5)); cone.translate(0, (C.ridge + C.top + 0.1) / 2, A.zc); k.put(cone, 'roof');
  const bays = [-29.25, -37.75];
  for (const [side, s] of [['E', 1], ['W', -1]]) for (const z of bays) {
    k.panel('glass', lancet(2.2, 12.5, near ? 3 : 1, 1.1), side, z, 9.0, s * (X + 0.14));
    if (near) k.panel('recess', lancet(4.6, 15.2, 3, 1.1), side, z, ENTRY_Y + 0.6, s * (X + 0.07));
  }
  for (const z of [-25.9, -33.5, -41.2]) for (const s of [-1, 1]) {
    k.box('stone', s > 0 ? X : -C.x, s > 0 ? C.x : -X, 0, 26.5, z - 0.5, z + 0.5);
    k.pyramid('stone', s * (X + C.x) / 2, z, 26.5, 29.4, 0.5);
  }
  if (near) for (let j = 1; j < facets - 1; j++) { // apse: a lancet in every facet but the first and last
    const [ax, az] = pts[j], [bx, bz] = pts[j + 1], mx = (ax + bx) / 2, mz = (az + bz) / 2;
    let nx = bz - az, nz = -(bx - ax); if (nx * mx + nz * (mz - A.zc) < 0) { nx = -nx; nz = -nz; }
    const l = Math.hypot(nx, nz); nx /= l; nz /= l;
    k.panelAt('glass', lancet(1.9, 12.5, 3, 1.1), mx + nx * 0.14, 9.0, mz + nz * 0.14, nx, nz);
  }
}

// The chapel wing south of the choir (OSM building=chapel): a gabled stone vessel with lancets along California Street, a
// gabled west end and a lower, chamfered extension beyond it.
export function buildChapel(k) {
  const { near } = k, WALL = 11.5, RIDGE = 17.5, X0 = -21.15, X1 = -8.9, cx = (X0 + X1) / 2, ZW = -49.0, hw = (X1 - X0) / 2;
  k.box('stone', X0, X1, 0, WALL, ZW, -25.0);
  k.gableZ('roof', cx, ZW, -24.5, WALL, hw + 0.35, RIDGE - WALL);
  k.gableZ('stone', cx, ZW - 0.8, ZW, WALL - 0.1, hw + 0.45, RIDGE - WALL + 0.4); // west gable
  k.panel('glass', lancet(2.6, 8.8, near ? 4 : 1, 1.1), 'B', cx, 2.8, ZW - 0.8 - 0.14);
  if (near) k.panel('recess', lancet(4.2, 11.0, 4, 1.1), 'B', cx, 1.8, ZW - 0.8 - 0.07);
  const ext = [[-11.6, -48.5], [-11.5, -52.8], [-14.5, -55.8], [-18.6, -55.6], [-21.2, -52.8], [X0, -48.5]];
  k.prism('stone', ext, 0, 9.5);
  k.prism('roof', ext, 9.5, 9.9);
  for (const z of [-29.0, -35.5, -42.0]) {
    k.panel('glass', lancet(1.9, 7.4, near ? 3 : 1, 1.1), 'W', z, 2.6, X0 - 0.14);
    if (near) k.panel('recess', lancet(3.3, 9.4, 3, 1.1), 'W', z, 1.8, X0 - 0.07);
  }
  for (const z of [-26.0, -32.2, -38.8, -45.4]) { // buttress piers with pinnacles
    k.box('stone', X0 - 0.5, X0 + 0.1, 0, WALL + 1.0, z - 0.45, z + 0.45);
    k.pyramid('stone', X0 - 0.2, z, WALL + 1.0, WALL + 3.4, 0.45);
  }
  k.box('stone', X0 - 0.15, X1, WALL - 0.7, WALL, ZW, -25.0); // cornice band at the eaves
}

// The flèche over the crossing: an octagonal base, an arched lantern, a needle spire and a gilded cross, 75 m.
export function buildFleche(k) {
  const { near } = k, { x, z } = FLECHE_AT, seg = near ? 8 : 6, tip = FLECHE_TIP, rot = Math.PI / seg;
  k.cyl('spire', x, z, 40.5, 50.5, 2.0, 1.75, seg, false, rot);
  k.cyl('spire', x, z, 50.5, 51.1, 2.1, 2.1, seg, false, rot);
  k.cyl('spire', x, z, 51.1, 51.6, 1.62, 1.62, seg, false, rot); // lantern floor
  k.cyl('spire', x, z, 57.6, 58.5, 1.7, 1.7, seg, false, rot); // lantern cornice
  k.cyl('spire', x, z, 58.5, 73.6, 1.35, 0.1, seg, false, rot);
  // the lantern is open: slim columns at the eight corners, pointed frames between them
  const RC = 1.5;
  for (let i = 0; i < 8; i++) {
    if (!near && i % 2) continue;
    const a = ((i + 0.5) / 8) * Math.PI * 2, cxp = x + Math.sin(a) * RC, czp = z + Math.cos(a) * RC;
    k.box('spire', cxp - 0.11, cxp + 0.11, 51.6, 57.6, czp - 0.11, czp + 0.11);
  }
  if (near) {
    for (let i = 0; i < 8; i++) { // pierced pointed frames on the eight faces
      const a = (i / 8) * Math.PI * 2, nx = Math.sin(a), nz = Math.cos(a), r = RC * Math.cos(Math.PI / 8) + 0.02;
      k.panelRingAt('spire', lancet(1.1, 5.7, 3, 1.1), lancet(0.8, 5.2, 3, 1.1).map(([px, py]) => [px, py + 0.12]), x + nx * r, 51.6, z + nz * r, nx, nz);
      const b = ((i + 0.5) / 8) * Math.PI * 2;
      k.pyramid('spire', x + Math.sin(b) * 2.0, z + Math.cos(b) * 2.0, 51.1, 54.4, 0.22); // pinnacles round the lantern foot
      for (let j = 0; j < 8; j++) { // crockets: small spikes leaning out of the eight spire edges
        const y = 60.0 + j * 1.6, R = 1.35 - 1.25 * (y - 58.5) / 15.1, sn = Math.sin(b), cs = Math.cos(b);
        k.bar('spire', [x + sn * R, y, z + cs * R], [x + sn * (R + 0.4), y + 0.42, z + cs * (R + 0.4)], 0.13, 0.13);
      }
    }
  }
  const cross = near ? 'brass' : 'spire'; // far: one dark material fewer
  k.cyl(cross, x, z, 73.6, 74.4, 0.1, 0.1, 6);
  k.box(cross, x - 0.05, x + 0.05, 74.2, tip, z - 0.05, z + 0.05);
  k.box(cross, x - 0.28, x + 0.28, 74.55, 74.65, z - 0.05, z + 0.05);
}
