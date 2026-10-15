// Derived data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright
import { assetBuilder } from '../../asset-geometry.js';
import * as THREE from 'three';
import { SPEC, PALETTES } from './config.js';
import {
  Mesh, BASE, ringXZ, runs, runPoint, edgeNormal, crownTop, capPolygon, hash01, mastXZ, U, V,
} from './wilshire-grand-center-parts.js';

// The tower is a stack of tapering plan rings (parts.js). From the ground up:
//   0 to 8 m      dark lobby glass
//   8 to 245 m    blue-grey curtain wall, a light spandrel band at every floor line, a few long vertical fins on the bowed
//                 south-west face, zig-zag steel trusses at 60-74 m on both long faces, a share of the panes lit at night
//   245 m to 262-283 m   the sail crown: the glass runs on past the shaft, its top edge a convex arc that is highest at the
//                 north-west end (283 m) and falls to 262 m at the south-east prow, with vertical LED lines
//   a 90 m mast from 245 m (hidden in the crown) to 335.3 m, on the prow end where OSM maps it
// West of the tower, a seven-level podium (hotel, retail) wraps the north-west end of the tower.

// Podium outline in the model frame: OSM part 1307580962, projected with the dossier frame (see parts.js: SHIFT).
const PODIUM = [[13.4, -42.1], [-32.8, -77.3], [-75.6, -20.6], [-91.2, 0], [-50.3, 16.6], [0.9, 37.3], [3.6, 27.1], [2.9, 17], [-0.3, 10], [6.4, 2.5], [10.2, -1.8], [7.6, -4.1], [-4.5, -16.7], [4.3, -23.7], [2.2, -28.3], [5.2, -32.2]];
const shoelace = (pts) => { let s = 0; for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[(i + 1) % pts.length]; s += p[0] * q[1] - q[0] * p[1]; } return s / 2; };
const PODIUM_RING = shoelace(PODIUM) > 0 ? [...PODIUM].reverse() : PODIUM; // outward faces need a negative shoelace area

function distToSegment(p, a, b) {
  const dx = b[0] - a[0], dz = b[1] - a[1], l2 = dx * dx + dz * dz || 1;
  const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dz) / l2));
  return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dz);
}
const towerGradeRing = BASE.map((_, i) => ringXZ(i, 0));
const onTowerWall = (p) => towerGradeRing.some((q, i) => distToSegment(p, q, towerGradeRing[(i + 1) % towerGradeRing.length]) < 0.7);

/** A thin prism standing proud of a wall: front face and both sides, from rows of {p: [x, y, z], n: [nx, nz]}. */
function finPrism(mesh, rows, half, proud, embed = 0.15) {
  const pts = rows.map(({ p, n }) => {
    const t = [n[1], -n[0]], at = (s, d) => [p[0] + t[0] * s + n[0] * d, p[1], p[2] + t[1] * s + n[1] * d];
    return { lf: at(-half, proud), rf: at(half, proud), le: at(-half, -embed), re: at(half, -embed) };
  });
  for (let j = 0; j + 1 < pts.length; j++) {
    const a = pts[j], b = pts[j + 1];
    mesh.quad(a.lf, a.rf, b.rf, b.lf);
    mesh.quad(a.rf, a.re, b.re, b.rf);
    mesh.quad(a.le, a.lf, b.lf, b.le);
  }
}

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const M = {};
  // Far merges minor materials into neighbours (8 draws): steel into the fins, the plinth stone into the spandrel colour.
  const FAR_ALIAS = { metal: 'fin', stone: 'spandrel' };
  const alias = (name) => (near ? name : FAR_ALIAS[name] || name);
  const mesh = (name) => (M[alias(name)] ||= new Mesh());
  const R = runs();
  const N = BASE.length;

  // ---- rows of the shaft: lobby, then floors of (spandrel, glass)
  // Far keeps the near floor pitch (the 3.95 m floor lines are the tower's rhythm); it simplifies bays and bow vertices instead.
  const PITCH = SPEC.floorPitch, SPAN = near ? 1.25 : 1.4;
  const rows = [0, SPEC.lobbyY], kind = ['pglass'];
  for (let h = SPEC.lobbyY; h < SPEC.shaftTopY - 0.01; h += PITCH) { rows.push(h + SPAN, h + PITCH); kind.push('spandrel', 'glass'); }
  rows[rows.length - 1] = SPEC.shaftTopY;
  const nearEnough = (h) => Math.abs(h - SPEC.shaftTopY) < 1e-6;

  // ---- tower shaft and crown walls, run by run (a run is smooth, corners are hard)
  const M_CROWN = near ? 8 : 4;
  // far drops two of the bow's near-collinear vertices (the chord misses the arc by < 0.2 m)
  const wallRun = (run) => (near || run.length < 7 ? run : run.filter((_, k) => k !== 2 && k !== 4));
  for (const run of R) {
    const g = rows.map((h) => wallRun(run).map((i) => { const q = ringXZ(i, h); return [q[0], h, q[1]]; }));
    for (const k of ['pglass', 'spandrel', 'glass']) mesh(k).wall(g, (j) => kind[j] === k);
    const gc = [];
    for (let j = 0; j <= M_CROWN; j++) {
      gc.push(wallRun(run).map((i) => { const T = crownTop(BASE[i][0]), y = SPEC.shaftTopY + (T - SPEC.shaftTopY) * (j / M_CROWN), q = ringXZ(i, y); return [q[0], y, q[1]]; }));
    }
    mesh('crown').wall(gc);
  }
  // crown top: a sloping roof over the arc
  {
    const top = BASE.map((p, i) => { const T = crownTop(p[0]); return { q: ringXZ(i, T), y: T }; });
    capPolygon(mesh('roof'), top.map((t) => t.q), top.map((t) => t.y));
  }

  // ---- fins: long verticals on the bowed south-west face, plus the spine up the prow
  const fin = mesh('fin');
  const finAt = (i, half, proud) => {
    const T = crownTop(BASE[i][0]), ys = near ? [0, 60, 120, 180, SPEC.shaftTopY, T] : [0, 120, SPEC.shaftTopY, T];
    const rowsF = ys.map((y) => {
      const p = ringXZ(i, y), pa = ringXZ((i + N - 1) % N, y), pb = ringXZ((i + 1) % N, y);
      const n1 = edgeNormal(pa, p), n2 = edgeNormal(p, pb), n = [n1[0] + n2[0], n1[1] + n2[1]], l = Math.hypot(...n) || 1;
      return { p: [p[0], y, p[1]], n: [n[0] / l, n[1] / l] };
    });
    finPrism(fin, rowsF, half, proud);
  };
  BASE.forEach((p, i) => { if (!p[2]) finAt(i, near ? 0.3 : 0.55, near ? 0.3 : 0.5); }); // the bow's interior vertices
  const prow = BASE.findIndex((p) => Math.abs(p[0] + 24.4) < 0.01 && Math.abs(p[1] - 24.7) < 0.01);
  finAt(prow, near ? 0.55 : 0.8, 0.45);

  // ---- mullions: one slim light strip per bay, floor to shaft top. The taper is linear in height, so a strip between two
  // wall points is one straight quad (2 triangles) however tall; 12 cm proud of the wall.
  if (near) {
    for (let i = 0; i < N; i++) {
      const j = (i + 1) % N, p0 = ringXZ(i, SPEC.lobbyY), q0 = ringXZ(j, SPEC.lobbyY), len = Math.hypot(q0[0] - p0[0], q0[1] - p0[1]);
      if (len < 4) continue;
      const bays = Math.round(len / 3.6), n = edgeNormal(p0, q0);
      for (let s = 1; s < bays; s++) {
        const f = s / bays, W = 0.1;
        const at = (y, d) => { const p = ringXZ(i, y), q = ringXZ(j, y); return [p[0] + (q[0] - p[0]) * f + n[0] * 0.14, y, p[1] + (q[1] - p[1]) * f + n[1] * 0.14, d]; };
        const a = at(SPEC.lobbyY, 0), c = at(SPEC.shaftTopY, 0), t = [n[1] * W, -n[0] * W];
        mesh('spandrel').quad([a[0] - t[0], a[1], a[2] - t[1]], [a[0] + t[0], a[1], a[2] + t[1]], [c[0] + t[0], c[1], c[2] + t[1]], [c[0] - t[0], c[1], c[2] - t[1]]);
      }
    }
  }

  // ---- the stepped north-west end (photographs 7 and 8): a ledge at alternate floor lines along the faces at the NW end
  // gives the sawtooth edge of the shaft. Near every other floor, far every fourth, so the steps survive at distance.
  {
    const fin2 = mesh('fin');
    const outward = (mesh_, pts, want) => { // a quad wound to face `want`
      const u = [pts[1][0] - pts[0][0], pts[1][1] - pts[0][1], pts[1][2] - pts[0][2]], v = [pts[3][0] - pts[0][0], pts[3][1] - pts[0][1], pts[3][2] - pts[0][2]];
      const nn = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
      if (nn[0] * want[0] + nn[1] * want[1] + nn[2] * want[2] >= 0) mesh_.quad(...pts); else mesh_.quad(pts[0], pts[3], pts[2], pts[1]);
    };
    const D = near ? 0.9 : 1.4, T = near ? 0.5 : 0.7, every = near ? 2 : 4;
    for (let i = 0; i < N; i++) {
      const j = (i + 1) % N;
      if (BASE[i][0] > -72 || BASE[j][0] > -72) continue;
      let fl = 0;
      for (let h = SPEC.lobbyY + PITCH; h < SPEC.shaftTopY - 3; h += PITCH, fl++) {
        if (fl % every) continue;
        const p = ringXZ(i, h), q = ringXZ(j, h), n = edgeNormal(p, q);
        const P0 = [p[0], h, p[1]], Q0 = [q[0], h, q[1]], P1 = [p[0] + n[0] * D, h, p[1] + n[1] * D], Q1 = [q[0] + n[0] * D, h, q[1] + n[1] * D];
        const up = (a) => [a[0], a[1] + T, a[2]];
        outward(fin2, [P1, Q1, up(Q1), up(P1)], [n[0], 0, n[1]]); // front
        outward(fin2, [up(P0), up(Q0), up(Q1), up(P1)], [0, 1, 0]); // top
        if (near) outward(fin2, [P0, Q0, Q1, P1], [0, -1, 0]); // soffit
      }
    }
  }

  // ---- LED lines on the sail crown, midway between the fins (self-lit)
  const bowRun = R.find((r) => r.length > 4);
  const led = mesh('light');
  for (let k = 0; k + 1 < bowRun.length; k++) {
    const ia = bowRun[k], ib = bowRun[k + 1], am = (BASE[ia][0] + BASE[ib][0]) / 2, T = crownTop(am), steps = near ? 4 : 2;
    for (let j = 0; j < steps; j++) {
      const y0 = SPEC.shaftTopY + 1.5 + (T - SPEC.shaftTopY - 3) * j / steps, y1 = SPEC.shaftTopY + 1.5 + (T - SPEC.shaftTopY - 3) * (j + 1) / steps;
      const at = (y) => { const p = runPoint(bowRun, am, y, 0.2), n = p[3], t = [n[1], -n[0]], w = near ? 0.28 : 0.5; return [[p[0] - t[0] * w, p[1], p[2] - t[1] * w], [p[0] + t[0] * w, p[1], p[2] + t[1] * w]]; };
      const lo = at(y0), hi = at(y1);
      led.quad(lo[0], lo[1], hi[1], hi[0]);
    }
  }

  // ---- zig-zag trusses at 60-74 m on the north-east and south-west faces (white steel)
  if (near) {
    const neRun = R.find((r) => r.length === 2 && Math.abs(BASE[r[0]][1] - 8.7) < 1 && Math.abs(BASE[r[1]][1] - 8.4) < 1) || R[0];
    const truss = (run, a0, a1, n) => {
      const P = (a, y) => runPoint(run, a, y, 0.5).slice(0, 3), W = 1.0;
      for (let k = 0; k < n; k++) {
        const x0 = a0 + (a1 - a0) * k / n, x1 = a0 + (a1 - a0) * (k + 1) / n;
        b.bar('metal', P(x0, 58), P(x1, 76), W, W);
        b.bar('metal', P(x0, 76), P(x1, 58), W, W);
        b.bar('metal', P(x0, 58), P(x1, 58), W, W); // chords follow the face bay by bay (the bow is curved)
        b.bar('metal', P(x0, 76), P(x1, 76), W, W);
      }
    };
    truss(neRun, -76, -38, 5);
    truss(bowRun, -76, -36, 8);
  }

  // ---- lit panes: a deterministic share of the glass glows at night (reads as glass by day)
  const glow = mesh('glow');
  const lift = near ? 0.15 : 0.3;
  const BAY = near ? 3.6 : 11;
  let floor = 0;
  for (let h = SPEC.lobbyY; h < SPEC.shaftTopY - PITCH + 0.01; h += PITCH, floor++) {
    const y0 = h + SPAN + 0.35, y1 = h + PITCH - 0.3;
    R.forEach((run, ri) => {
      for (let k = 0; k + 1 < run.length; k++) {
        const e0 = ringXZ(run[k], h), e1 = ringXZ(run[k + 1], h), len = Math.hypot(e1[0] - e0[0], e1[1] - e0[1]);
        const bays = Math.max(1, Math.round(len / BAY));
        for (let s = 0; s < bays; s++) {
          if (hash01(floor + 1, ri * 40 + k * 7 + s + 3) > (near ? 0.22 : 0.26) * (0.55 + hash01(floor, 5))) continue;
          const f0 = (s + 0.1) / bays, f1 = (s + 0.9) / bays;
          const pt = (f, y) => { const p = ringXZ(run[k], y), q = ringXZ(run[k + 1], y); return [p[0] + (q[0] - p[0]) * f, y, p[1] + (q[1] - p[1]) * f]; };
          glow.quad(pt(f0, y0), pt(f1, y0), pt(f1, y1), pt(f0, y1), lift);
        }
      }
    });
  }

  // ---- the mast
  {
    const [sx, sz] = mastXZ();
    const seg = near ? 8 : 5, y0 = SPEC.spireBaseY, y1 = SPEC.height - 0.3;
    const cyl = (ya, yb, ra, rb) => {
      const g = new THREE.CylinderGeometry(rb, ra, yb - ya, seg, 1, true);
      g.translate(sx, (ya + yb) / 2, sz);
      b.put(g, alias('metal'));
    };
    cyl(y0, 275, 1.6, 1.0); cyl(275, 305, 1.0, 0.55); cyl(305, y1, 0.55, 0.12);
    if (near) { const lamp = new THREE.OctahedronGeometry(0.3, 0); lamp.translate(sx, y1, sz); b.put(lamp, 'lamp'); }
    if (near) for (const y of [262, 290, 318]) { const g = new THREE.CylinderGeometry(1.15 - (y - 262) / 100, 1.15 - (y - 262) / 100, 0.5, 8, 1, false); g.translate(sx, y, sz); b.put(g, 'fin'); }
  }

  // ---- the podium
  {
    const P = PODIUM_RING, n = P.length;
    const rowsP = [0, 7];
    const kindP = ['stone'];
    const floors = 6, pitch = (SPEC.podiumY - 7) / floors;
    for (let f = 0; f < floors; f++) { const h = 7 + f * pitch; rowsP.push(h + 1.0, h + pitch); kindP.push('spandrel', 'pglass'); }
    rowsP.push(SPEC.podiumY + 1.2); kindP.push('stone');
    for (let i = 0; i < n; i++) {
      const p = P[i], q = P[(i + 1) % n], m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
      if (onTowerWall(p) && onTowerWall(q) && onTowerWall(m)) continue;
      const g = rowsP.map((h) => [[p[0], h, p[1]], [q[0], h, q[1]]]);
      for (const k of ['stone', 'spandrel', 'pglass']) mesh(k).wall(g, (j) => kindP[j] === k);
      const len = Math.hypot(q[0] - p[0], q[1] - p[1]);
      // a share of the podium panes glows at night
      const bays = Math.max(1, Math.round(len / (near ? 3.6 : 7)));
      for (let f = 0; f < floors; f++) {
        const y0 = 7 + f * pitch + 1.4, y1 = 7 + (f + 1) * pitch - 0.3;
        for (let k = 0; k < bays; k++) {
          if (hash01(f + 9, i * 31 + k) > 0.3) continue;
          const t0 = (k + 0.12) / bays, t1 = (k + 0.88) / bays, at = (t, y) => [p[0] + (q[0] - p[0]) * t, y, p[1] + (q[1] - p[1]) * t];
          mesh('glow').quad(at(t0, y0), at(t1, y0), at(t1, y1), at(t0, y1), near ? 0.15 : 0.3);
        }
      }
      if (near && len > 6) {
        const nrm = edgeNormal(p, q), count = Math.floor(len / 4.5);
        for (let s = 1; s < count; s++) {
          const f = s / count, c = [p[0] + (q[0] - p[0]) * f, p[1] + (q[1] - p[1]) * f];
          finPrism(fin, [{ p: [c[0], 7, c[1]], n: nrm }, { p: [c[0], SPEC.podiumY, c[1]], n: nrm }], 0.15, 0.3);
        }
      }
    }
    capPolygon(mesh('roof'), P, P.map(() => SPEC.podiumY + 1.2));
    // the pool on the roof terrace beside the tower
    const pool = (cx, cz, len, wid) => {
      const ux = U[0], uz = U[1], vx = V[0], vz = V[1], y = SPEC.podiumY + 1.2 + 0.1;
      const c = (s, t) => [cx + ux * s * len / 2 + vx * t * wid / 2, y, cz + uz * s * len / 2 + vz * t * wid / 2];
      mesh('water').quad(c(-1, -1), c(-1, 1), c(1, 1), c(1, -1)); // faces up
    };
    if (near) pool(-14, -8, 20, 6);
  }

  for (const [name, m] of Object.entries(M)) if (m.count) b.put(m.geometry(), name);
  const root = b.finish();
  root.traverse((o) => { if (o.isMesh) o.geometry.deleteAttribute('bridgeLift'); }); // a building carries no road contract
  root.userData.elevationDatum = 'Y=0 is local flat-map grade, not sea level; the tower and podium stand on it.';
  return root;
}
