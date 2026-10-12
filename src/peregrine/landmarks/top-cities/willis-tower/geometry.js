import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';
import { SPEC, DESIGN, PALETTES } from './config.js';
import { RINGS, TOWER_IDS, PODIUM_HEIGHTS, HEIGHTS, ROOF_IDS } from './willis-tower-plan.js';

const k = mercStretch(SPEC.origin[1]), ox = lngToMercX(SPEC.origin[0]), oz = latToMercY(SPEC.origin[1]);
export const localRing = id => RINGS[id].map(([lng, lat]) => [(lngToMercX(lng) - ox) / k, (oz - latToMercY(lat)) / k]);
const area = r => r.reduce((a, p, i) => { const q = r[(i + 1) % r.length]; return a + p[0] * q[1] - q[0] * p[1]; }, 0);
function clean(r) {
  r = r.map(p => [...p]);
  for (let changed = true; changed && r.length > 3;) {
    changed = false;
    for (let i = 0; i < r.length; i++) {
      const p = r[(i + r.length - 1) % r.length], q = r[i], c = r[(i + 1) % r.length];
      const L = Math.hypot(c[0] - p[0], c[1] - p[1]);
      if (L && Math.abs((q[0] - p[0]) * (c[1] - p[1]) - (q[1] - p[1]) * (c[0] - p[0])) / L < 0.12) { r.splice(i, 1); changed = true; break; }
    }
  }
  return area(r) > 0 ? r : r.reverse();
}
export function inside(r, x, z) {
  let h = false;
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const a = r[i], b = r[j];
    if ((a[1] > z) !== (b[1] > z) && x < (b[0] - a[0]) * (z - a[1]) / (b[1] - a[1]) + a[0]) h = !h;
  }
  return h;
}
const blocks = [...TOWER_IDS.map(id => ({ id, roof: HEIGHTS[id], ring: clean(localRing(id)), tower: true })),
  ...Object.entries(PODIUM_HEIGHTS).map(([id, roof]) => ({ id: +id, roof, ring: clean(localRing(id)), tower: false }))];

// All panels are actual disjoint facade pieces, not glass overlays on opaque boxes.
// This preserves the thin mullions without close stacked surfaces or depth cycles.
function batch() {
  const p = [], ix = [];
  return {
    quad(a, b, c, d) { const i = p.length / 3; p.push(...a, ...b, ...c, ...d); ix.push(i, i + 1, i + 2, i, i + 2, i + 3); },
    cap(r, y, holes = [], down = false) {
      const vec = a => a.map(p => new THREE.Vector2(...p));
      const v = [r, ...holes].flat(), off = p.length / 3;
      p.push(...v.flatMap(([x, z]) => [x, y, z]));
      for (const [a, b, c] of THREE.ShapeUtils.triangulateShape(vec(r), holes.map(vec))) ix.push(off + a, off + (down ? b : c), off + (down ? c : b));
    },
    finish() { if (!ix.length) return null; const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3)); g.setIndex(ix); g.computeVertexNormals(); return g; },
  };
}
function exteriorSegments(block, p, q) {
  const dx = q[0] - p[0], dz = q[1] - p[1], L = Math.hypot(dx, dz), nx = dz / L, nz = -dx / L;
  const cuts = [0, L];
  for (const other of blocks) if (other !== block) for (const v of other.ring) {
    const u = ((v[0] - p[0]) * dx + (v[1] - p[1]) * dz) / L;
    const d = Math.abs((v[0] - p[0]) * dz - (v[1] - p[1]) * dx) / L;
    if (d < 0.3 && u > 0.4 && u < L - 0.4) cuts.push(u);
  }
  const sorted = [...new Set(cuts.map(v => +v.toFixed(3)))].sort((a, b) => a - b), spans = [];
  for (let i = 1; i < sorted.length; i++) {
    const a = sorted[i - 1], c = sorted[i]; if (c - a < 0.35) continue;
    const m = (a + c) / 2, x = p[0] + dx * m / L + nx * 0.35, z = p[1] + dz * m / L + nz * 0.35;
    const y0 = Math.max(0, ...blocks.filter(o => o !== block && inside(o.ring, x, z)).map(o => o.roof));
    if (y0 >= block.roof) continue;
    if (spans.length && spans.at(-1).y0 === y0 && Math.abs(spans.at(-1).c - a) < 0.01) spans.at(-1).c = c;
    else spans.push({ a, c, y0 });
  }
  return spans.map(({ a, c, y0 }) => ({ p: [p[0] + dx * a / L, p[1] + dz * a / L], q: [p[0] + dx * c / L, p[1] + dz * c / L], y0 }));
}
export function create({ detail = 'near' } = {}) {
  const far = detail === 'far', b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const mats = Object.fromEntries(Object.keys(PALETTES.light).map(n => [n, batch()]));
  let faceId = 0;
  function facade(p, q, y0, y1, tower) {
    const id = faceId++, L = Math.hypot(q[0] - p[0], q[1] - p[1]);
    const solid = tower ? 'metal' : 'podium';
    const wall = (mat, u0, u1, a, c) => {
      if (u1 - u0 < 0.01 || c - a < 0.01) return;
      const v = (u, y) => [p[0] + (q[0] - p[0]) * u / L, y, p[1] + (q[1] - p[1]) * u / L];
      mats[mat].quad(v(u0, a), v(u0, c), v(u1, c), v(u1, a));
    };
    if (L < 1) { wall(solid, 0, L, y0, y1); return; }
    const cols = Math.max(1, Math.round(L / (far ? 8 : tower ? 3 : 3.6))), w = L / cols;
    const pier = far ? 0.65 : tower ? 0.26 : 0.45;
    const rows = [];
    let y = y0;
    while (y < y1 - 0.01) {
      const pitch = tower ? (far ? 10 : 4) : (far ? 10 : 5);
      const end = Math.min(y1, (Math.floor((y + 0.001) / pitch) + 1) * pitch);
      rows.push([y, end]); y = end;
    }
    // Continuous black mullions. Horizontal sills fill ONLY between them.
    for (let c = 0; c <= cols; c++) wall(solid, Math.max(0, c * w - pier / 2), Math.min(L, c * w + pier / 2), y0, y1);
    rows.forEach(([a, c], row) => {
      const mechanical = tower && DESIGN.mechanical.some(([lo, hi]) => (a + c) / 2 >= lo && (a + c) / 2 < hi);
      const sill = mechanical ? (c - a) * 0.76 : far ? 1.25 : tower ? 0.95 : 0.7;
      for (let col = 0; col < cols; col++) {
        const u0 = col * w + pier / 2, u1 = (col + 1) * w - pier / 2;
        const bottom = Math.min(c, a + sill), top = c;
        wall(solid, u0, u1, a, bottom);
        const lit = !mechanical && ((id * 37 + row * 17 + col * 23) % 19 < 3);
        wall(lit ? 'glow' : 'glass', u0, u1, bottom, top);
      }
    });
  }
  for (const block of blocks) {
    for (let i = 0; i < block.ring.length; i++) for (const s of exteriorSegments(block, block.ring[i], block.ring[(i + 1) % block.ring.length])) facade(s.p, s.q, s.y0, block.roof, block.tower);
    const holes = blocks.filter(o => o !== block && o.roof > block.roof && o.ring.every(p => inside(block.ring, p[0], p[1]))).map(o => o.ring);
    mats.roof.cap(block.ring, block.roof, holes);
  }
  // Small mapped entrance canopies and west atrium eaves, anchored to adjacent volumes.
  for (const id of ROOF_IDS) {
    const ring = clean(localRing(id));
    const h = id === 1178212981 ? 18 : 10;
    mats.roof.cap(ring, h);
    mats.roof.cap(ring, h - 0.65, [], true);
    const center = ring.reduce((a, p) => [a[0] + p[0] / ring.length, a[1] + p[1] / ring.length], [0, 0]);
    for (const p of [ring[0], ring[Math.floor(ring.length / 2)]]) {
      const x = p[0] * 0.9 + center[0] * 0.1, z = p[1] * 0.9 + center[1] * 0.1;
      b.box('podium', [x, (h - 0.4) / 2, z], [0.32, h - 0.4, 0.32]);
    }
    for (let i = 0; i < ring.length; i++) facade(ring[i], ring[(i + 1) % ring.length], h - 0.65, h, false);
  }
  for (const [name, m] of Object.entries(mats)) { const g = m.finish(); if (g) b.put(g, name); }
  // Tapered antenna shafts seated directly on the 442 m roof, with closed section joins.
  for (const [x, z, tip] of DESIGN.antennas) {
    const levels = [[442, 2.25], [465, 1.85], [481, 1.35], [505, 0.88], [tip, 0.26]];
    for (let i = 1; i < levels.length; i++) {
      const [a, ra] = levels[i - 1], [c, rc] = levels[i];
      const g = new THREE.CylinderGeometry(rc, ra, c - a, far ? 6 : 10, 1, true); g.translate(x, (a + c) / 2, z); b.put(g, 'lamp');
    }
    const cap = new THREE.CircleGeometry(0.26, far ? 6 : 10); cap.rotateX(-Math.PI / 2); cap.translate(x, tip, z); b.put(cap, 'lamp');
  }
  // Four mapped circular roof plant drums on the corner tubes, retained in far.
  for (const [x, z, roof] of [[15, 23.9, 200], [-31.7, -20.8, 200], [-30.7, 24.8, 260], [14.5, -21.6, 260]]) {
    const g = new THREE.CylinderGeometry(4.3, 4.3, 5, far ? 6 : 12); g.translate(x, roof + 2.5, z); b.put(g, 'roof');
  }
  return b.finish();
}
