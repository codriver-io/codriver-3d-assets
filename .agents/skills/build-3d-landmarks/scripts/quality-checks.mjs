// Conservative geometry-only review candidates; host terrain and visual QA remain separate.
import * as THREE from 'three';
const WINDOW = /glass|glaz|window|fenestr|glow/i;
const MEMBER = /cable|stay|hanger|suspender|rail|beam|girder|walkway/i;
const median = (xs) => xs.length ? xs.sort((a, b) => a - b)[Math.floor(xs.length / 2)] : 0;
const at = (v) => v.toArray().map((x) => +x.toFixed(2));

// Compare outward vertical window faces in eight bearing bins. Counts alone do not fail:
// a coarse grid is valid. Require lost coverage, oversized panes or excessive dark area too.
export function windowFacades(tris) {
  const bins = new Map();
  for (const t of tris) {
    if (Math.abs(t.n.y) > 0.2) continue;
    const key = (Math.round(Math.atan2(t.n.z, t.n.x) * 4 / Math.PI) + 8) % 8;
    const r = bins.get(key) || { area: 0, windowArea: 0, faces: 0, heights: [], widths: [] };
    r.area += t.area;
    if (WINDOW.test(t.mat || '')) {
      const ps = [t.a, t.b, t.c], u = new THREE.Vector3(-t.n.z, 0, t.n.x).normalize();
      r.windowArea += t.area; r.faces++;
      r.heights.push(Math.max(...ps.map(p => p.y)) - Math.min(...ps.map(p => p.y)));
      r.widths.push(Math.max(...ps.map(p => p.dot(u))) - Math.min(...ps.map(p => p.dot(u))));
    }
    bins.set(key, r);
  }
  return [...bins].map(([bearingBin, r]) => ({ bearingBin, faces: r.faces, windowAreaM2: +r.windowArea.toFixed(2), areaShare: r.windowArea / Math.max(r.area, 1), medianHeightM: median(r.heights), medianWidthM: median(r.widths) }));
}
export function windowRhythm(near, far) {
  const flags = [];
  for (const n of near) {
    if (n.faces < 32 || n.windowAreaM2 < 10) continue;
    const f = far.find(r => r.bearingBin === n.bearingBin) || { faces: 0, windowAreaM2: 0, areaShare: 0, medianHeightM: 0, medianWidthM: 0 };
    const countRatio = f.faces / n.faces, reasons = [];
    if (f.windowAreaM2 < n.windowAreaM2 * 0.15) reasons.push('window coverage lost');
    if (countRatio < 0.35) {
      if (f.medianHeightM > Math.max(6, n.medianHeightM * 3)) reasons.push('tall window stripes');
      if (f.medianWidthM > Math.max(10, n.medianWidthM * 4)) reasons.push('wide window bands');
      if (f.areaShare > Math.max(0.45, n.areaShare * 2.5)) reasons.push('excessive window area');
    }
    if (reasons.length) flags.push({ bearingBin: n.bearingBin, reasons, near: n, far: f });
  }
  return { facades: flags.length, flags };
}

// Split same-material triangles into welded components: exporters merge many cables in one mesh.
function components(tris) {
  const parent = tris.map((_, i) => i), seen = new Map();
  const find = (i) => { while (parent[i] !== i) { parent[i] = parent[parent[i]]; i = parent[i]; } return i; };
  tris.forEach((t, i) => { for (const p of [t.a, t.b, t.c]) {
    const key = t.mat + ':' + p.toArray().map(x => Math.round(x * 1e4)).join(',');
    if (seen.has(key)) parent[find(i)] = find(seen.get(key)); else seen.set(key, i);
  } });
  const groups = new Map();
  tris.forEach((t, i) => { const k = find(i); if (!groups.has(k)) groups.set(k, []); groups.get(k).push(i); });
  return [...groups.values()];
}
export function memberEnds(tris, { contactM = 0.75, groundY = 0 } = {}) {
  // Spatial hash of triangle bounds; large surfaces stay in a short fallback list.
  const cell = 4, grid = new Map(), large = [], boxes = [], triangle = new THREE.Triangle();
  const xyz = ['x', 'y', 'z'];
  tris.forEach((t, i) => {
    const b = new THREE.Box3().setFromPoints([t.a, t.b, t.c]); boxes.push(b);
    const lo = xyz.map(k => Math.floor(b.min[k] / cell)), hi = xyz.map(k => Math.floor(b.max[k] / cell));
    if (hi.reduce((n, x, k) => n * (x - lo[k] + 1), 1) > 512) { large.push(i); return; }
    for (let x = lo[0]; x <= hi[0]; x++) for (let y = lo[1]; y <= hi[1]; y++) for (let z = lo[2]; z <= hi[2]; z++) {
      const k = `${x},${y},${z}`; if (!grid.has(k)) grid.set(k, []); grid.get(k).push(i);
    }
  });
  const flags = []; let tested = 0;
  for (const ids of components(tris)) {
    const mat = tris[ids[0]].mat || '';
    if (!MEMBER.test(mat)) continue;
    const points = [...new Map(ids.flatMap(i => [tris[i].a, tris[i].b, tris[i].c]).map(p => [p.toArray().map(x => Math.round(x * 1e4)).join(','), p])).values()];
    const center = points.reduce((v, p) => v.add(p), new THREE.Vector3()).divideScalar(points.length);
    const box = new THREE.Box3().setFromPoints(points), size = box.getSize(new THREE.Vector3());
    let axis = new THREE.Vector3().setComponent(size.toArray().indexOf(Math.max(size.x, size.y, size.z)), 1);
    // Principal axis avoids diagonal-member axis-aligned box false negatives.
    for (let k = 0; k < 12; k++) { const next = new THREE.Vector3(); for (const p of points) { const q = p.clone().sub(center); next.addScaledVector(q, q.dot(axis)); } if (next.lengthSq() < 1e-12) break; axis = next.normalize(); }
    const ds = points.map(p => p.clone().sub(center).dot(axis)), lo = ds.reduce((a, b) => Math.min(a, b), Infinity), hi = ds.reduce((a, b) => Math.max(a, b), -Infinity), length = hi - lo;
    const radius = points.reduce((r, p, i) => Math.max(r, p.clone().sub(center).addScaledVector(axis, -ds[i]).length()), 0);
    if (length < 4 || radius > 1.5 || length / Math.max(radius * 2, 0.01) < 12) continue;
    tested++; const own = new Set(ids), tolerance = Math.max(contactM, radius * 1.5);
    for (const end of [lo, hi]) {
      const cap = points.filter((_, i) => Math.abs(ds[i] - end) < Math.max(0.02, length * 0.001));
      const p = cap.reduce((v, q) => v.add(q), new THREE.Vector3()).divideScalar(cap.length);
      if (p.y <= groundY + tolerance) continue; // actual DEM contact is a host check
      const candidates = new Set(large), lower = xyz.map(k => Math.floor((p[k] - tolerance) / cell)), upper = xyz.map(k => Math.floor((p[k] + tolerance) / cell));
      for (let x = lower[0]; x <= upper[0]; x++) for (let y = lower[1]; y <= upper[1]; y++) for (let z = lower[2]; z <= upper[2]; z++) for (const i of grid.get(`${x},${y},${z}`) || []) candidates.add(i);
      let distance = Infinity;
      for (const i of candidates) {
        if (own.has(i) || boxes[i].distanceToPoint(p) > tolerance) continue;
        const t = tris[i]; triangle.set(t.a, t.b, t.c);
        distance = Math.min(distance, triangle.closestPointToPoint(p, new THREE.Vector3()).distanceTo(p));
      }
      if (distance > tolerance) flags.push({ material: mat, at: at(p), lengthM: +length.toFixed(1), contactM: +tolerance.toFixed(2) });
    }
  }
  return { tested, ends: flags.length, flags };
}
