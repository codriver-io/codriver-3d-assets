import * as THREE from 'three';

// Helpers for 555 California Street: a flat-shaded quad/cap accumulator (the sawtooth faces need hard edges,
// so nothing is indexed across facets) and the decomposition of an OSM "strip" (the 48-level outer bay layer)
// into per-tooth cells, so every tooth can end at its own height (the Sierra-like cutouts).

export const key2 = (p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`;
export const edgeKey = (a, b) => { const x = key2(a), y = key2(b); return x < y ? `${x}|${y}` : `${y}|${x}`; };
const sub = (p, q) => [p[0] - q[0], p[1] - q[1]];
const dot = (p, q) => p[0] * q[0] + p[1] * q[1];
const len = (p) => Math.hypot(p[0], p[1]);
const unit = (p) => { const l = len(p) || 1; return [p[0] / l, p[1] / l]; };

// Signed area on the map (x east, z south): > 0 means clockwise seen from above.
export function mapArea(ring) {
  let a = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) a += (ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1]);
  return a / 2;
}
export const clockwise = (ring) => (mapArea(ring) > 0 ? ring : [...ring].reverse());
// Outward normal of an edge a -> b of a clockwise ring.
export const outward = (a, b) => unit([b[1] - a[1], -(b[0] - a[0])]);

export function meshBuilder() {
  const pos = [], nor = [], idx = [];
  const tri = (a, b, c) => {
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    const l = Math.hypot(nx, ny, nz);
    if (l < 1e-9) return;
    nx /= l; ny /= l; nz /= l;
    const base = pos.length / 3;
    pos.push(...a, ...b, ...c); nor.push(nx, ny, nz, nx, ny, nz, nx, ny, nz); idx.push(base, base + 1, base + 2);
  };
  // a, b, c, d counter-clockwise seen from the visible side.
  const quad = (a, b, c, d) => {
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    let l = Math.hypot(nx, ny, nz);
    if (l < 1e-9) { // degenerate first triangle: try the second
      const wx = d[0] - a[0], wy = d[1] - a[1], wz = d[2] - a[2];
      nx = vy * wz - vz * wy; ny = vz * wx - vx * wz; nz = vx * wy - vy * wx; l = Math.hypot(nx, ny, nz);
      if (l < 1e-9) return;
    }
    nx /= l; ny /= l; nz /= l;
    const base = pos.length / 3;
    pos.push(...a, ...b, ...c, ...d); nor.push(nx, ny, nz, nx, ny, nz, nx, ny, nz, nx, ny, nz);
    idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
  };
  // Horizontal polygon [x, z] at height y, facing up (or down), optionally with holes.
  const cap = (contour, y, holes = [], up = true) => {
    const c = contour.map((p) => new THREE.Vector2(p[0], p[1])), h = holes.map((r) => r.map((p) => new THREE.Vector2(p[0], p[1])));
    const faces = THREE.ShapeUtils.triangulateShape(c, h);
    // triangulateShape drops a repeated end point in place; the indices refer to the cleaned arrays.
    const all = [...c, ...h.flat()];
    for (const [i, j, k] of faces) {
      let a = all[i], b = all[j], d = all[k];
      const A = [a.x, y, a.y], B = [b.x, y, b.y], D = [d.x, y, d.y];
      const ny = (B[2] - A[2]) * (D[0] - A[0]) - (B[0] - A[0]) * (D[2] - A[2]); // y component of (B-A)x(D-A)
      // (B-A)x(D-A) has +y when counter-clockwise with z up on screen; we need +y facing the sky.
      if ((ny > 0) === up) tri(A, B, D); else tri(A, D, B);
    }
  };
  const geometry = () => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
    g.setIndex(idx);
    return g;
  };
  return { tri, quad, cap, geometry, count: () => idx.length / 3 };
}

// ---- strips -----------------------------------------------------------------------------------------------

// Split an OSM strip polygon into the inner chain (edges shared with the core) and the outer chain, both
// running start -> end along the strip, with the strip's outward unit normal and the along-axis s of every
// vertex. Throws if the strip is not a simple band (so a bad import fails loudly rather than rendering wrong).
export function decomposeStrip(poly, core) {
  const ring = poly.slice(), n = ring.length;
  const coreIndex = new Map(core.map((p, i) => [key2(p), i]));
  const innerEdge = (i) => {
    const a = coreIndex.get(key2(ring[i])), b = coreIndex.get(key2(ring[(i + 1) % n]));
    if (a === undefined || b === undefined) return false;
    const d = (a - b + core.length) % core.length;
    return d === 1 || d === core.length - 1;
  };
  let start = -1;
  for (let i = 0; i < n; i++) if (innerEdge(i) && !innerEdge((i + n - 1) % n)) { start = i; break; }
  if (start < 0) throw new Error('strip has no inner run');
  const inner = [ring[start]];
  let i = start;
  while (innerEdge(i)) { i = (i + 1) % n; inner.push(ring[i]); }
  const outer = [ring[i]];
  while (i !== start) { i = (i + 1) % n; outer.push(ring[i]); }
  outer.reverse(); // now start -> end like the inner chain
  const t = unit(sub(inner[inner.length - 1], inner[0]));
  let nrm = [t[1], -t[0]];
  const p0 = inner[0], depth = (p, v) => dot(sub(p, p0), v);
  const mean = (chain, v) => chain.reduce((s, p) => s + depth(p, v), 0) / chain.length;
  if (mean(outer, nrm) < mean(inner, nrm)) nrm = [-nrm[0], -nrm[1]];
  const s = (p) => dot(sub(p, p0), t), d = (p) => depth(p, nrm);
  for (const chain of [inner, outer]) for (let k = 1; k < chain.length; k++) if (!(s(chain[k]) > s(chain[k - 1]) - 1e-6)) throw new Error('strip chain is not monotone');
  // Valleys: outer vertices that sit deeper in than both neighbours. Cells are tooth to tooth.
  const valleys = [];
  for (let k = 1; k < outer.length - 1; k++) if (d(outer[k]) < d(outer[k - 1]) && d(outer[k]) < d(outer[k + 1])) valleys.push(s(outer[k]));
  const bounds = [0, ...valleys, s(inner[inner.length - 1])];
  return { inner, outer, t, n: nrm, s, d, bounds, cells: bounds.length - 1 };
}

// Point of a monotone chain at along-axis position sv.
function at(chain, s, sv) {
  for (let k = 1; k < chain.length; k++) {
    const a = chain[k - 1], b = chain[k], sa = s(a), sb = s(b);
    if (sv <= sb + 1e-9) { const f = sb - sa < 1e-9 ? 0 : Math.min(1, Math.max(0, (sv - sa) / (sb - sa))); return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]; }
  }
  return chain[chain.length - 1];
}
// The part of a chain between sa and sb: [point at sa, vertices strictly between, point at sb], no repeats.
export function chainBetween(strip, chain, sa, sb) {
  const first = at(chain, strip.s, sa), last = at(chain, strip.s, sb), out = [first];
  // A chain vertex within 0.35 m of a cut is merged into the cut: no sliver walls 0.1 m wide and 20 m tall.
  for (const p of chain) { const sp = strip.s(p); if (sp > sa + 1e-6 && sp < sb - 1e-6 && len(sub(p, first)) > 0.35 && len(sub(p, last)) > 0.35) out.push(p); }
  out.push(last);
  return out.filter((p, i) => i === 0 || len(sub(p, out[i - 1])) > 1e-4);
}
// Cell k of a strip: its inner and outer sub-chains and the closed polygon between them.
export function stripCell(strip, k) {
  const sa = strip.bounds[k], sb = strip.bounds[k + 1];
  const inner = chainBetween(strip, strip.inner, sa, sb), outer = chainBetween(strip, strip.outer, sa, sb);
  let poly = [...inner, ...[...outer].reverse()];
  poly = poly.filter((p, i) => len(sub(p, poly[(i + poly.length - 1) % poly.length])) > 1e-4);
  return { inner, outer, poly, sa, sb, ends: [[inner[0], outer[0]], [inner[inner.length - 1], outer[outer.length - 1]]] };
}
// Piecewise-constant profile over the strip: stops = [[uMax, height], ...] sampled at each cell centre;
// `reverse` reads the strip from its far end (the stops are written west to east or north to south).
export function profileHeights(strip, stops, reverse = false) {
  const total = strip.bounds[strip.bounds.length - 1];
  return Array.from({ length: strip.cells }, (_, k) => {
    let u = ((strip.bounds[k] + strip.bounds[k + 1]) / 2) / total;
    if (reverse) u = 1 - u;
    for (const [uMax, h] of stops) if (u <= uMax) return h;
    return stops[stops.length - 1][1];
  });
}
