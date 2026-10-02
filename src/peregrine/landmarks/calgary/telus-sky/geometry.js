import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import {
  Mesh, NU, NV, STRIP, BAY, ROW, uAt, vAt, HALF_W, HALF_D, Y0, Y1, ROOF_Y, TOP_K, PODIUM_TOP_K,
  recessions, occupancy, levelGroups, hash01,
} from './telus-sky-parts.js';

// Telus Sky is a stack of floor plates on a cell grid. The offices (levels 1 to 28) are a flush rectangle; from the first residential level
// the north, west, east and south faces step back by whole cells, each pixel column by its own amount (see recessions() in
// telus-sky-parts.js), so the facade becomes a mosaic of small terraces and the tower thins toward a stepped, tilted roof. The geometry
// is built as the exposed faces of that stack: a glass wall and a dark slab-edge band per exposed run of cells, a pale terrace where a
// floor is covered by a smaller one, a dark soffit where one overhangs. Everything is merged by material.
//
//   0 to 7 m       recessed lobby (glass behind slim columns) under the first office floor
//   7 to 122 m     28 office levels, a flush rectangle with a dark band at every slab edge; a 10-level podium strip on the west
//   122 to 221 m   29 residential levels plus the plant level, stepping back and pixelating toward the roof
//   221 to 222.3 m roof plant on the highest, east end
// `glow` is the Northern Lights fascia (north and south faces only), `light` a share of lit windows.

const PROUD = 0.15; // slab-edge bands stand this far off the glass (every wall run is over 20 m2, the far ones over 50 m2)
const GLOW_OUT = 0.26; // the LED fascia stands 0.11 m proud of its band
const PANE_OUT = 0.1; // lit window panes stand this far off the glass, below the band

const aurora = (c, k, face) => Math.sin(c * 0.9 + k * 0.21 + Math.sin(k * 0.07 + face) * 3 + face * 1.7) + 0.6 * Math.sin(c * 0.35 - k * 0.11) > -0.45;

// A run of cells along one wall: a glass wall with its slab-edge band, glow strip and lit panes, or (a narrow notch) a plain dark side.
function wallRun(M, o, axis, side, plane, s0, s1, y0, y1, k, lenCells, group) {
  const put = (m, p, a, b, ya, yb) => (axis === 'v' ? m.wallV(p, a, b, ya, yb, side) : m.wallU(p, a, b, ya, yb, side));
  if (lenCells < 3) { put(M.frame, plane, s0, s1, y0, y1); return; }
  put(M.glass, plane, s0, s1, y0, y1);
  if (k === 0) return; // the lobby is plain glass
  const band = o.near ? 0.95 : 1.7;
  put(M.frame, plane + side * PROUD, s0, s1, y1 - band, y1);
  if (axis === 'v' && k >= 3 && aurora(group, k, side > 0 ? 1 : 0)) put(M.glow, plane + side * GLOW_OUT, s0 + 0.3, s1 - 0.3, y1 - band + 0.1, y1 - 0.1);
  if (!o.near) return;
  // dark vertical frames at both ends of the run (adjacent runs make one 0.5 m frame) and a 0.2 m mullion between window modules of about
  // 3.6 m, all under the band; a share of the modules are lit at night as 0.1 m proud panes between the mullions
  const yTop = y1 - band, len = s1 - s0, n = Math.max(1, Math.round(len / 3.6)), floorBias = 0.5 + hash01(k, 11);
  put(M.frame, plane + side * PROUD, s0, s0 + 0.25, y0, yTop);
  put(M.frame, plane + side * PROUD, s1 - 0.25, s1, y0, yTop);
  for (let m = 0; m < n; m++) {
    const m0 = s0 + (len * m) / n, m1 = s0 + (len * (m + 1)) / n;
    if (m > 0) put(M.frame, plane + side * (PROUD - 0.03), m0 - 0.1, m0 + 0.1, y0, yTop);
    if (hash01(k * 31 + m + Math.round(plane * 8), Math.round(s0 * 4) + (axis === 'v' ? 7 : 19)) <= 0.16 * floorBias) put(M.light, plane + side * PANE_OUT, m0 + 0.45, m1 - 0.45, y0 + 0.5, yTop - 0.35);
  }
}

// The exposed faces of one level group of the tower plate.
function levelFaces(M, o, group, prev, next) {
  const { k0, k1 } = group, y0 = Y0[k0], y1 = Y1[k1];
  const cur = occupancy(k1, recessions(k1));
  const up = next && occupancy(next.k1, recessions(next.k1)), down = prev && occupancy(prev.k1, recessions(prev.k1));
  // keep the roof stair consistent when a far group spans two levels: a cell exists in the group if it exists at its upper level
  const here = (a, b) => cur(a, b);
  const collect = (lo, hi, test, groupOf) => {
    const list = []; let run = null;
    for (let i = lo; i < hi; i++) {
      if (!test(i)) { run = null; continue; }
      const g = groupOf(i);
      if (run && run.g === g && run.end === i - 1) { run.end = i; } else { run = { start: i, end: i, g }; list.push(run); }
    }
    return list;
  };
  const colOf = (a) => (a < 0 ? -1 : Math.floor(a / BAY)), rowOf = (b) => Math.floor(b / ROW);
  for (let b = 0; b < NV; b++) {
    for (const r of collect(-STRIP, NU, (a) => here(a, b) && !here(a, b - 1), colOf)) wallRun(M, o, 'v', -1, vAt(b), uAt(r.start), uAt(r.end + 1), y0, y1, k1, r.end - r.start + 1, r.g);
    for (const r of collect(-STRIP, NU, (a) => here(a, b) && !here(a, b + 1), colOf)) wallRun(M, o, 'v', 1, vAt(b + 1), uAt(r.start), uAt(r.end + 1), y0, y1, k1, r.end - r.start + 1, r.g);
    // terraces (the cell is covered by nothing above) and soffits (nothing below), merged along u
    for (const r of collect(-STRIP, NU, (a) => here(a, b) && !(up && up(a, b)), () => 0)) M.ledge.flat(uAt(r.start), uAt(r.end + 1), vAt(b), vAt(b + 1), y1, 1);
    if (prev) for (const r of collect(-STRIP, NU, (a) => here(a, b) && !down(a, b), () => 0)) M.frame.flat(uAt(r.start), uAt(r.end + 1), vAt(b), vAt(b + 1), y0, -1);
  }
  for (let a = -STRIP; a < NU; a++) {
    for (const r of collect(0, NV, (b) => here(a, b) && !here(a - 1, b), rowOf)) wallRun(M, o, 'u', -1, uAt(a), vAt(r.start), vAt(r.end + 1), y0, y1, k1, r.end - r.start + 1, r.g);
    for (const r of collect(0, NV, (b) => here(a, b) && !here(a + 1, b), rowOf)) wallRun(M, o, 'u', 1, uAt(a + 1), vAt(r.start), vAt(r.end + 1), y0, y1, k1, r.end - r.start + 1, r.g);
  }
}

// A small glazed volume stacked on levels k0..k1: glass and band on the listed sides, a terrace on top and a dark soffit below.
function volume(M, o, u0, u1, v0, v1, k0, k1, sides) {
  for (let k = k0; k <= k1; k++) {
    const y0 = Y0[k], y1 = Y1[k];
    const ends = (axis, side, plane, a, b) => wallRun(M, o, axis, side, plane, a, b, y0, y1, k, 99, 0);
    if (sides.includes('n')) ends('v', -1, v0, u0, u1);
    if (sides.includes('s')) ends('v', 1, v1, u0, u1);
    if (sides.includes('w')) ends('u', -1, u0, v0, v1);
    if (sides.includes('e')) ends('u', 1, u1, v0, v1);
  }
  M.ledge.flat(u0, u1, v0, v1, Y1[k1], 1);
  M.frame.flat(u0, u1, v0, v1, Y0[k0], -1);
}

function column(M, u, v, top, size = 0.5) { M.frame.box(u - size / 2, u + size / 2, 0, top, v - size / 2, v + size / 2, 'nswe'); }

function base(M, o) {
  // lobby columns on the plate line, carrying the first office slab (their tops end inside it)
  const slab = Y0[1] + 0.2;
  for (let i = 0; i <= NU / BAY; i++) {
    const u = Math.min(HALF_W - 0.3, Math.max(-HALF_W + 0.3, uAt(i * BAY)));
    if (u > -HALF_W + 0.5) { column(M, u, -HALF_D + 0.3, slab); column(M, u, HALF_D - 0.3, slab); } // the west end is the podium
  }
  for (let i = 1; i < NV / ROW; i++) column(M, HALF_W - 0.3, vAt(i * ROW), slab);
  // south-east annex (OSM levels 1 to 4), cantilevered from the east wall
  volume(M, o, HALF_W, 30.535, 8.355, 16.805, 1, 3, 'nse');
  // south bay, level 3, a bay window over 7 Avenue
  volume(M, o, 17.1, 25.145, HALF_D, 18.855, 2, 2, 'sew');
  // north volume at level 2: an L of two blocks hanging 9.7 m beyond the north wall, on three slim columns
  volume(M, o, -6.485, 1.975, -26.865, -HALF_D, 1, 1, 'ne');
  wallRun(M, o, 'u', -1, -6.485, -25.0, -HALF_D, Y0[1], Y1[1], 1, 99, 0); // the first block's west face, from where the second block ends
  volume(M, o, -13.835, -6.485, -26.865, -25.0, 1, 1, 'nws');
  for (const [u, v] of [[-6.485 + 0.3, -26.865 + 0.3], [1.975 - 0.3, -26.865 + 0.3], [-13.835 + 0.3, -26.865 + 0.3]]) column(M, u, v, slab);
}

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near', o = { near };
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const M = { glass: new Mesh(), frame: new Mesh(), ledge: new Mesh(), glow: new Mesh(), light: new Mesh(), metal: new Mesh() };
  const groups = levelGroups(near);
  groups.forEach((g, i) => levelFaces(M, o, g, groups[i - 1], groups[i + 1]));
  base(M, o);
  // the roof plant, on the highest (east) end of the roof, well inside the top plate
  M.metal.box(14.5, 21.5, ROOF_Y, SPEC.height, -1.0, 9.5, 'nswet');
  for (const [name, m] of Object.entries(M)) if (m.count) b.put(m.geometry(), name);
  const root = b.finish();
  root.traverse((n) => { if (n.isMesh) n.geometry.deleteAttribute('bridgeLift'); }); // a building carries no road contract
  root.userData.elevationDatum = 'Y=0 is local flat-map grade, not sea level; the street-level lobby floor stands on it.';
  return root;
}
