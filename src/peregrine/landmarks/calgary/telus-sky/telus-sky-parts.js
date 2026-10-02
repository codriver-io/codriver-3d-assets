// Geometry helpers for Telus Sky: an indexed quad mesh authored in the plan frame, and the stack of floor plates.
//
// The plan frame is (u, y, v): u runs along the east-west grid direction, v along the north-south one (+v is south), both rotated
// GRID_DEG clockwise from the cardinal axes, with the centre of the tower plate at (0, 0). Every point is rotated into the model frame
// (+X east, +Z south) as it is written, so the rotation is baked into the GLB.
//
// The tower is a stack of floor plates on a grid of cells (CELL_U x CELL_V). Each floor says, for every pixel column of the north and
// south faces and every row of the east and west faces, how many cells that part of the plate steps back. Offices are a flush
// rectangle; the residential floors step back progressively and are dithered, which is the "pixelated" stepping of the real facade.
import * as THREE from 'three';
import { SPEC } from './config.js';

const TH = SPEC.gridBearingDeg * Math.PI / 180, CT = Math.cos(TH), ST = Math.sin(TH);
export const toModel = (u, y, v) => [u * CT - v * ST, y, u * ST + v * CT];
const rotN = (nu, ny, nv) => [nu * CT - nv * ST, ny, nu * ST + nv * CT];

// ---- the plate grid ----------------------------------------------------------------------------
export const NU = 42, NV = 25, STRIP = 4; // cells east-west and north-south on the main plate; the west podium strip adds STRIP cells
export const BAY = SPEC.plan.bayCells, ROW = SPEC.plan.rowCells;
export const CELL_U = SPEC.plan.width / NU, CELL_V = SPEC.plan.depth / NV;
export const U0 = -SPEC.plan.width / 2, V0 = -SPEC.plan.depth / 2; // plan position of cell (0, 0)'s north-west corner
export const uAt = (a) => U0 + a * CELL_U, vAt = (b) => V0 + b * CELL_V;
export const HALF_W = SPEC.plan.width / 2, HALF_D = SPEC.plan.depth / 2;

// ---- the floor stack ---------------------------------------------------------------------------
const L = SPEC.levels;
export const HEIGHTS = [L.lobby, ...Array(L.officeCount).fill(L.office), ...Array(L.residentialCount).fill(L.residential), L.plant];
export const Y0 = [], Y1 = [];
{ let y = 0; for (const h of HEIGHTS) { Y0.push(y); y += h; Y1.push(y); } }
export const TOP_K = HEIGHTS.length - 1; // 58: the plant level
export const ROOF_Y = Y1[TOP_K]; // 221.1; the roof plant stands on it up to SPEC.height
export const FIRST_RES = 1 + L.officeCount + 1; // 30: first residential level index is 29, its pixel stepping starts here
export const PODIUM_TOP_K = 9; // the west strip is 10 levels (OSM building:levels=10)

// The stepped roof: each pixel column stops at its own top level, rising toward the east.
export const topOf = (a) => (a >= 30 ? TOP_K : a >= 24 ? TOP_K - 1 : a >= 18 ? TOP_K - 2 : a >= 12 ? TOP_K - 3 : a >= 6 ? TOP_K - 4 : TOP_K - 5);

export function hash01(a, b) {
  let h = Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/** Cells each face steps back at level k: arrays per pixel column (N, S: 7) and per row (W, E: 5). */
export function recessions(k) {
  const nCol = NU / BAY, nRow = NV / ROW;
  const zero = (n) => Array(n).fill(0);
  if (k === 0) return { N: Array(nCol).fill(1), S: Array(nCol).fill(1), W: zero(nRow), E: Array(nRow).fill(1) }; // the recessed lobby
  if (k < FIRST_RES - 1) return { N: zero(nCol), S: zero(nCol), W: zero(nRow), E: zero(nRow) }; // office floors: a clean rectangle
  const t = (k - (FIRST_RES - 2)) / (TOP_K - (FIRST_RES - 2)); // 1/30 on the first residential floor, 1 on the plant level
  const jitter = (i, face) => 2 * (0.7 * hash01(i + face * 31, k) + 0.3 * hash01(i + face * 31, 500 + (k >> 1))) - 1;
  const step = (mean, amp, i, face) => Math.max(0, Math.round(mean + (k === TOP_K ? 0 : amp) * jitter(i, face)));
  const N = [], S = [], W = [], E = [];
  for (let c = 0; c < nCol; c++) { N.push(step(9 * Math.pow(t, 1.1), 0.8 + 1.6 * t, c, 0)); S.push(step(1.0 * t, 0.8 + 1.4 * t, c, 1)); }
  for (let r = 0; r < nRow; r++) { W.push(step(5 * Math.pow(t, 1.2), 0.6 + 1.2 * t, r, 2)); E.push(step(2 * t, 0.5 + 1.0 * t, r, 3)); }
  return { N, S, W, E };
}

/** Occupancy of cell (a, b) at level k, given that level's recessions. a < 0 is the west podium strip. */
export function occupancy(k, rec) {
  return (a, b) => {
    if (a < 0) return a >= -STRIP && k <= PODIUM_TOP_K && b >= 1 && b < NV - 2; // mapped: it ends 2.2 m short of the south face
    if (a >= NU || b < 0 || b >= NV || k > topOf(a)) return false;
    const c = Math.floor(a / BAY), r = Math.floor(b / ROW);
    return a >= rec.W[r] && a < NU - rec.E[r] && b >= rec.N[c] && b < NV - rec.S[c];
  };
}

// Level groups. Near draws every level; far draws pairs (cutting the quad count) but keeps every level at which the grid, the podium or
// the stepped roof changes, so its silhouette matches.
export function levelGroups(near) {
  const out = [{ k0: 0, k1: 0 }];
  if (near) { for (let k = 1; k <= TOP_K; k++) out.push({ k0: k, k1: k }); return out; }
  for (let k = 1; k < PODIUM_TOP_K; k += 2) out.push({ k0: k, k1: k + 1 });
  out.push({ k0: PODIUM_TOP_K, k1: PODIUM_TOP_K });
  for (let k = PODIUM_TOP_K + 1; k <= TOP_K - 6; k += 2) out.push({ k0: k, k1: k + 1 });
  for (let k = TOP_K - 4; k <= TOP_K; k++) out.push({ k0: k, k1: k });
  return out;
}

// ---- mesh --------------------------------------------------------------------------------------
export class Mesh {
  constructor() { this.pos = []; this.nor = []; this.idx = []; }
  get count() { return this.idx.length; }
  /** A quad given four plan points [u, y, v] in loop order and its outward plan normal; the winding is made to match it. */
  quad(a, b, c, d, n) {
    const A = toModel(...a), B = toModel(...b), C = toModel(...c), D = toModel(...d), N = rotN(...n);
    const e1 = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], e2 = [C[0] - A[0], C[1] - A[1], C[2] - A[2]];
    const cross = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const flip = cross[0] * N[0] + cross[1] * N[1] + cross[2] * N[2] < 0, i = this.pos.length / 3;
    for (const P of [A, B, C, D]) { this.pos.push(...P); this.nor.push(...N); }
    this.idx.push(...(flip ? [i, i + 2, i + 1, i, i + 3, i + 2] : [i, i + 1, i + 2, i, i + 2, i + 3]));
  }
  /** A vertical wall in the plane v = p (normal -v for side -1, +v for side +1), spanning u0..u1 and y0..y1. */
  wallV(p, u0, u1, y0, y1, side) { this.quad([u0, y0, p], [u1, y0, p], [u1, y1, p], [u0, y1, p], [0, 0, side]); }
  /** A vertical wall in the plane u = p (normal -u for side -1, +u for side +1), spanning v0..v1 and y0..y1. */
  wallU(p, v0, v1, y0, y1, side) { this.quad([p, y0, v0], [p, y0, v1], [p, y1, v1], [p, y1, v0], [side, 0, 0]); }
  /** A horizontal face at height y, facing up (up = 1) or down (-1). */
  flat(u0, u1, v0, v1, y, up) { this.quad([u0, y, v0], [u1, y, v0], [u1, y, v1], [u0, y, v1], [0, up, 0]); }
  /** A box; `faces` picks from n s w e t b (north -v, south +v, west -u, east +u, top, bottom). */
  box(u0, u1, y0, y1, v0, v1, faces = 'nswetb') {
    if (faces.includes('n')) this.wallV(v0, u0, u1, y0, y1, -1);
    if (faces.includes('s')) this.wallV(v1, u0, u1, y0, y1, 1);
    if (faces.includes('w')) this.wallU(u0, v0, v1, y0, y1, -1);
    if (faces.includes('e')) this.wallU(u1, v0, v1, y0, y1, 1);
    if (faces.includes('t')) this.flat(u0, u1, v0, v1, y1, 1);
    if (faces.includes('b')) this.flat(u0, u1, v0, v1, y0, -1);
  }
  geometry() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nor, 3));
    g.setIndex(this.idx);
    return g;
  }
}
