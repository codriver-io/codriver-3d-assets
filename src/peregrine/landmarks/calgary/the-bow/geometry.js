import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { Mesh, bar, outline, surf, columnAngle, rimAt, hash01, ROOF_Y, BANDS, BAND, OUT, IN, GARDEN } from './the-bow-parts.js';
import { addWonderland } from './the-bow-sculpture.js';

// The Bow is a prism: one crescent plan from the ground to a flat roof, with no taper. From the outside in:
//   diagrid  pale silver-white members stand 0.3 to 1.5 m off the glass on both curved faces: a horizontal ring every
//            BAND (25.96 m, nine bands), a zigzag of long diagonals crossing at the rings, thin verticals every half-bay
//   glass    blue-grey curtain wall on a plan inset 1.5 m from the mapped outline; the two wing columns (the crescent's
//            tips) are darker glass with fine vertical fins and no diagrid
//   details  two dark bronze mechanical bands, three sky gardens recessed in the concave face, lit offices at night,
//            a parapet beam, the roof and the window-washing rig; Wonderland (Plensa) stands in the plaza
const FLOOR0 = 8, PITCH = 4; // lobby height and storey pitch of the lit-window grid (58 storeys, 233.6 m)
const MECH = [3, 6].map((k) => [k * BAND + 1.5, k * BAND + 9.0]); // dark louvred mechanical floors, above rings 3 and 6
const GARDENS = GARDEN.centres.map((c) => [c - GARDEN.height / 2, c + GARDEN.height / 2]);
const overlaps = (a0, a1, bands) => bands.some(([b0, b1]) => a1 > b0 - 0.3 && a0 < b1 + 0.3);

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const M = { glass: new Mesh(), wing: new Mesh(), frame: new Mesh(), louvre: new Mesh(), glow: new Mesh(), roof: new Mesh() };
  const V = outline(detail), N = V.length;
  const nxt = (i) => V[(i + 1) % N];

  // surface point of the glass line at vertex v, height y, pushed `off` metres outward; normal at the vertex's end of an edge
  const P = (v, y, off = 0) => [v.g[0] + v.n[0] * off, y, v.g[1] + v.n[1] * off];
  const endN = (v, end) => { const n = v.smooth ? v.n : (end === 'start' ? v.nNext : v.nPrev); return [n[0], 0, n[1]]; };
  const wallQuad = (mesh, i, ya, yb, off = 0) => { // ya/yb: heights at the two ends (numbers or per-vertex functions)
    const a = V[i], c = nxt(i), f = (y, v) => (typeof y === 'function' ? y(v) : y);
    const na = endN(a, 'start'), nc = endN(c, 'end');
    mesh.quad(mesh.v(P(a, f(ya, a), off), na), mesh.v(P(c, f(ya, c), off), nc), mesh.v(P(c, f(yb, c), off), nc), mesh.v(P(a, f(yb, a), off), na));
  };
  const rim = (v) => v.rim;
  const inGarden = (i) => { const a = V[i], c = nxt(i); return a.zone === 'in' && c.zone === 'in' && a.deg >= GARDEN.from - 0.1 && c.deg <= GARDEN.to + 0.1; };
  const bodyMat = (i) => (V[i].zone === 'W' || V[i].zone === 'E' ? 'wing' : 'glass');

  // ---- glass: one quad strip per outline edge, cut where a sky garden is recessed
  for (let i = 0; i < N; i++) {
    const mesh = M[bodyMat(i)];
    if (inGarden(i)) {
      let y = 0;
      for (const [y0, y1] of GARDENS) { wallQuad(mesh, i, y, y0); y = y1; }
      wallQuad(mesh, i, y, rim);
    } else wallQuad(mesh, i, 0, rim);
  }

  // ---- sky gardens: the glass steps back GARDEN.depth, behind the diagrid, between a floor slab and a soffit
  {
    const R = (v, y) => [v.g[0] - v.n[0] * GARDEN.depth, y, v.g[1] - v.n[1] * GARDEN.depth];
    const idx = []; for (let i = 0; i < N; i++) if (inGarden(i)) idx.push(i);
    const first = V[idx[0]], last = nxt(idx[idx.length - 1]);
    for (const [y0, y1] of GARDENS) {
      for (const i of idx) {
        const a = V[i], c = nxt(i), na = endN(a, 'start'), nc = endN(c, 'end');
        M.wing.quad(M.wing.v(R(a, y0), na), M.wing.v(R(c, y0), nc), M.wing.v(R(c, y1), nc), M.wing.v(R(a, y1), na)); // the recess reads as a darker band
        M.frame.flat(P(a, y0), P(c, y0), R(c, y0), R(a, y0), [0, 1, 0]); // floor slab edge
        M.frame.flat(P(a, y1), P(c, y1), R(c, y1), R(a, y1), [0, -1, 0]); // soffit
      }
      const t0 = [nxt(idx[0]).g[0] - first.g[0], 0, nxt(idx[0]).g[1] - first.g[1]];
      const t1 = [last.g[0] - V[idx[idx.length - 1]].g[0], 0, last.g[1] - V[idx[idx.length - 1]].g[1]];
      M.wing.flat(P(first, y0), R(first, y0), R(first, y1), P(first, y1), t0); // end walls
      M.wing.flat(R(last, y0), P(last, y0), P(last, y1), R(last, y1), [-t1[0], 0, -t1[2]]);
    }
  }

  // ---- mechanical floors: dark bronze louvre bands on both diagrid faces (about 9 m tall, above rings 3 and 6)
  for (let i = 0; i < N; i++) {
    if (V[i].zone !== 'out' && V[i].zone !== 'in') continue;
    for (const [y0, y1] of MECH) wallQuad(M.louvre, i, y0, y1, 0.2);
  }

  // ---- lit offices: a hashed share of the bays glows at night (it reads as glass by day), clear of the louvres,
  // the sky gardens and the parapet. Near lights single bays on every floor, far coarser bays on every other floor.
  const step = near ? PITCH : 2 * PITCH, lift = near ? 0.15 : 0.3;
  for (let i = 0; i < N; i++) {
    const a = V[i], c = nxt(i), len = Math.hypot(c.g[0] - a.g[0], c.g[1] - a.g[1]);
    if (len < 1.5) continue;
    const mesh = M.glow, mw = Math.min(0.5, len * 0.1);
    for (let f = 0; FLOOR0 + f * step + step < Math.min(a.rim, c.rim) - 1.5; f++) {
      const y0 = FLOOR0 + f * step + 0.9, y1 = FLOOR0 + f * step + step - 0.8;
      if (overlaps(y0, y1, MECH) || (near && inGarden(i) && overlaps(y0, y1, GARDENS))) continue;
      if (hash01(f + 1, i + 7) > (near ? 0.27 : 0.34) * (0.55 + hash01(f, 3))) continue;
      const s0 = mw / len, s1 = 1 - mw / len;
      const at = (s, y) => {
        const n = a.smooth && c.smooth ? [a.n[0] + (c.n[0] - a.n[0]) * s, a.n[1] + (c.n[1] - a.n[1]) * s] : a.nNext;
        return [a.g[0] + (c.g[0] - a.g[0]) * s + n[0] * lift, y, a.g[1] + (c.g[1] - a.g[1]) * s + n[1] * lift];
      };
      const nrm = a.nNext, N3 = [nrm[0], 0, nrm[1]];
      mesh.flat(at(s0, y0), at(s1, y0), at(s1, y1), at(s0, y1), N3);
    }
  }

  // ---- wing columns: fine vertical fins at every outline vertex of the two wings (near only)
  if (near) {
    for (const v of V) {
      if (v.zone !== 'W' && v.zone !== 'E') continue;
      bar(M.frame, P(v, 0), P(v, v.rim), v.n, v.n, 0.3, 0.2, 0.7);
    }
  }

  // ---- the diagrid: rings, diagonals and verticals on both curved faces
  const RW = 0.85, DW = 0.95, VW = 0.3, o0 = 0.3, o1 = 1.5;
  for (const zone of ['out', 'in']) {
    const cfg = zone === 'out' ? OUT : IN, n = cfg.n;
    const node = (j, k) => {
      const a = columnAngle(zone, j), s = surf(zone, a), y = k >= BANDS ? rimAt(zone, a) : k === 0 ? 0.2 : k * BAND; // the diagonals' ground ends stay above grade
      return { p: [s.x, y, s.z], n: [s.nx, s.nz] };
    };
    const ringAt = (j, y) => { const a = columnAngle(zone, j), s = surf(zone, a); return { p: [s.x, y, s.z], n: [s.nx, s.nz] }; };
    // horizontal rings between every pair of columns; the ground ring sits on the ground
    for (let k = 0; k < BANDS; k++) {
      const y = k === 0 ? 0.55 : k * BAND;
      for (let j = 0; j < n; j++) { const A = ringAt(j, y), B = ringAt(j + 1, y); bar(M.frame, A.p, B.p, A.n, B.n, RW, o0, o1); }
    }
    // the zigzag: from every node of ring k (columns j + k even) up to both neighbouring columns of ring k + 1
    for (let k = 0; k < BANDS; k++) {
      for (let j = 0; j <= n; j++) {
        if ((j + k) % 2) continue;
        for (const dj of [-1, 1]) {
          if (j + dj < 0 || j + dj > n) continue;
          const A = node(j, k), B = node(j + dj, k + 1);
          bar(M.frame, A.p, B.p, A.n, B.n, DW, o0, o1);
        }
      }
    }
    // verticals every half-bay; the two end columns are heavy posts where the diagrid meets a wing
    if (near) {
      for (let j = 0; j <= n; j++) {
        const A = node(j, 0), B = node(j, BANDS), end = j === 0 || j === n;
        bar(M.frame, A.p, B.p, A.n, B.n, end ? 1.4 : VW, end ? o0 - 0.1 : o0, end ? o1 + 0.05 : 0.9);
      }
    } else {
      for (const j of [0, n]) { const A = node(j, 0), B = node(j, BANDS); bar(M.frame, A.p, B.p, A.n, B.n, 1.4, o0 - 0.1, o1 + 0.05); }
    }
  }

  // ---- parapet beam around the whole roof edge (the top ring member of the diagrid)
  const O = (v, y, off) => [v.g[0] + v.miter[0] * off, y, v.g[1] + v.miter[1] * off];
  for (let i = 0; i < N; i++) {
    const a = V[i], c = nxt(i), na = endN(a, 'start'), nc = endN(c, 'end'), up = [0, 1, 0], dn = [0, -1, 0];
    const lo = -0.7, hi = 0.9, oi = -0.4, oo = 1.4;
    M.frame.quad(M.frame.v(O(a, a.rim + lo, oo), na), M.frame.v(O(c, c.rim + lo, oo), nc), M.frame.v(O(c, c.rim + hi, oo), nc), M.frame.v(O(a, a.rim + hi, oo), na)); // outer face
    M.frame.quad(M.frame.v(O(a, a.rim + hi, oo), up), M.frame.v(O(c, c.rim + hi, oo), up), M.frame.v(O(c, c.rim + hi, oi), up), M.frame.v(O(a, a.rim + hi, oi), up)); // top
    M.frame.quad(M.frame.v(O(a, a.rim + hi, oi), [-na[0], 0, -na[2]]), M.frame.v(O(c, c.rim + hi, oi), [-nc[0], 0, -nc[2]]), M.frame.v(O(c, c.rim, oi), [-nc[0], 0, -nc[2]]), M.frame.v(O(a, a.rim, oi), [-na[0], 0, -na[2]])); // inner face, down to the roof
    M.frame.quad(M.frame.v(O(a, a.rim + lo, 0), dn), M.frame.v(O(c, c.rim + lo, 0), dn), M.frame.v(O(c, c.rim + lo, oo), dn), M.frame.v(O(a, a.rim + lo, oo), dn)); // underside of the overhang
  }

  // ---- roof deck: the outline filled, at the rim heights (the concave rim dips a little)
  const tris = THREE.ShapeUtils.triangulateShape(V.map((v) => new THREE.Vector2(v.g[0], v.g[1])), []);
  for (const [i, j, k] of tris) M.roof.tri(M.roof.v([V[i].g[0], V[i].rim, V[i].g[1]], [0, 1, 0]), M.roof.v([V[j].g[0], V[j].rim, V[j].g[1]], [0, 1, 0]), M.roof.v([V[k].g[0], V[k].rim, V[k].g[1]], [0, 1, 0]));

  for (const [name, m] of Object.entries(M)) b.put(m.geometry(), name);

  // ---- roof plant and the window-washing rig (boxes sunk into the deck so they never hover over the sloping rim)
  b.box('metal', [14, ROOF_Y - 0.5, -10], [16, 5, 9], 0); // plant enclosure, sunk 3 m into the deck, top at ROOF_Y + 2
  const th = 56 * Math.PI / 180, rx = OUT.c[0] + 41.5 * Math.cos(th), rz = OUT.c[1] - 41.5 * Math.sin(th);
  const rot = Math.atan2(-Math.cos(th), Math.sin(th)); // long axis along the rim tangent
  b.box('metal', [rx, ROOF_Y - 0.4, rz], [9, 3.2, 3.2], rot); // carriage, top at ROOF_Y + 1.2
  b.box('metal', [rx, ROOF_Y + 1.7, rz], [2.2, 1.4, 2.2], rot); // mast, top at ROOF_Y + 2.4 = 236 m
  if (near) addWonderland(b);

  const root = b.finish();
  root.traverse((o) => { if (o.isMesh) o.geometry.deleteAttribute('bridgeLift'); }); // a building carries no road contract
  root.userData.elevationDatum = 'Y=0 is local flat-map grade, not sea level; the ground floor stands on it.';
  return root;
}
