import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { site, roofHeight, archAssembly, memberGeometry, roofCells, endWallCells, OUTLINE } from './att-stadium-parts.js';

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near', b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const outline = near ? OUTLINE : OUTLINE.filter((p, i) => i % 2 === 0 || Math.abs(p[0]) === 135);
  function face(mat, pts, desired) {
    const indices = [];
    for (let i = 1; i < pts.length - 1; i++) {
      const a = new THREE.Vector3(...pts[0]), c = new THREE.Vector3(...pts[i]), d = new THREE.Vector3(...pts[i + 1]);
      if (c.sub(a).cross(d.sub(a)).lengthSq() > 1e-12) indices.push(0, i, i + 1);
    }
    if (!indices.length) return;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts.flatMap(p => site(...p)), 3));
    g.setIndex(indices); g.computeVertexNormals();
    const dir = new THREE.Vector3(...site(...desired));
    const norm = new THREE.Vector3().fromBufferAttribute(g.attributes.normal, 0);
    if (norm.dot(dir) < 0) { for (let i = 0; i < indices.length; i += 3) [indices[i + 1], indices[i + 2]] = [indices[i + 2], indices[i + 1]]; g.setIndex(indices); g.computeVertexNormals(); }
    b.put(g, mat);
  }
  const box = (mat, at, size) => b.box(mat, site(...at), size, SPEC.axisAngle);
  const lerp = (a, c, f) => a.map((v, i) => v + (c[i] - v) * f);
  function pane(mat, corners, margin = 0.045, frame = 'seam') {
    const [a, c, d, e] = corners;
    const q = [lerp(lerp(a, c, margin), lerp(e, d, margin), margin), lerp(lerp(a, c, 1 - margin), lerp(e, d, 1 - margin), margin), lerp(lerp(a, c, 1 - margin), lerp(e, d, 1 - margin), 1 - margin), lerp(lerp(a, c, margin), lerp(e, d, margin), 1 - margin)];
    const normal = [(a[0] + d[0]) / 2, 0, (a[2] + d[2]) / 2];
    face(mat, q, normal);
    for (let k = 0; k < 4; k++) { const j = (k + 1) % 4; face(frame, [corners[k], corners[j], q[j], q[k]], normal); }
  }
  const N = outline.length;
  for (let i = 0; i < N; i++) {
    const a = outline[i], c = outline[(i + 1) % N];
    const isEnd = Math.abs(a[0] - c[0]) < 0.01 && Math.abs(a[0]) > 134;
    if (isEnd) continue;
    const h0 = roofHeight(...a) - 2, h1 = roofHeight(...c) - 2;
    const wall = (f, y) => { const uv = lerp(a, c, f), h = h0 + (h1 - h0) * f, scale = 0.92 + 0.08 * y / h; return [Math.sign(uv[0]) * (Math.min(135, Math.abs(uv[0])) + Math.max(0, Math.abs(uv[0]) - 135) * (y / h)), y, uv[1] * scale]; };
    face('concrete', [wall(0, 0), wall(1, 0), wall(1, 2.4), wall(0, 2.4)], [a[0], 0, a[1]]);
    const rows = near ? 10 : 4;
    for (let r = 0; r < rows; r++) {
      const y0 = 2.4 + (h0 - 2.4) * r / rows, y1 = 2.4 + (h0 - 2.4) * (r + 1) / rows;
      const z0 = 2.4 + (h1 - 2.4) * r / rows, z1 = 2.4 + (h1 - 2.4) * (r + 1) / rows;
      pane(r === 0 && i % (near ? 5 : 3) === 0 ? 'glow' : 'glass', [wall(0, y0), wall(1, z0), wall(1, z1), wall(0, y1)], near ? 0.035 : 0.025);
    }
  }
  // One conforming mesh spans fixed wings, moving panels and their centre seam.
  const cells = roofCells(outline, detail);
  for (const end of [-1, 1]) for (const { points, material } of endWallCells(cells, end, detail)) {
    if (material === 'steel' || (!near && material === 'glass')) { face(material, points, [end, 0, 0]); continue; }
    const center = points.reduce((s, p) => s.map((v, i) => v + p[i] / points.length), [0, 0, 0]);
    const margin = material === 'door' ? 0.054 : 0.04;
    const inner = points.map(p => lerp(p, center, margin));
    face(material, inner, [end, 0, 0]);
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      face(material === 'door' ? 'steel' : 'seam', [points[i], points[j], inner[j], inner[i]], [end, 0, 0]);
    }
  }
  for (const { points, material } of cells) face(material, points.map(([u, v]) => [u, roofHeight(u, v), v]), [0, 1, 0]);
  // Use the same cut samples along the outside fascia as on the curved skin.
  for (const { points } of cells) for (let i = 0; i < points.length; i++) {
    const a = points[i], c = points[(i + 1) % points.length];
    const onEdge = (p, q, x) => {
      const dx = q[0] - p[0], dz = q[1] - p[1];
      const t = ((x[0] - p[0]) * dx + (x[1] - p[1]) * dz) / (dx * dx + dz * dz);
      return t >= -1e-7 && t <= 1 + 1e-7 && Math.abs(dx * (x[1] - p[1]) - dz * (x[0] - p[0])) < 1e-5;
    };
    if (!outline.some((p, j) => onEdge(p, outline[(j + 1) % N], a) && onEdge(p, outline[(j + 1) % N], c))) continue;
    face('roof', [[a[0], roofHeight(...a), a[1]], [c[0], roofHeight(...c), c[1]], [c[0], roofHeight(...c) - 2, c[1]], [a[0], roofHeight(...a) - 2, a[1]]], [a[0], 0, a[1]]);
  }
  const assembly = archAssembly(detail);
  for (const s of assembly.supports) {
    box('concrete', s.at, s.size);
    const end = Math.sign(s.at[0]), v = s.at[2];
    const lo = end * 142, hi = end * 193;
    face('concrete', [[lo, 0, v - 3.6], [hi, 0, v - 3.6], [hi, 11, v - 3.6], [lo, 4, v - 3.6]], [0, 0, -1]);
    face('concrete', [[lo, 0, v + 3.6], [hi, 0, v + 3.6], [hi, 11, v + 3.6], [lo, 4, v + 3.6]], [0, 0, 1]);
    face('concrete', [[lo, 4, v - 3.6], [hi, 11, v - 3.6], [hi, 11, v + 3.6], [lo, 4, v + 3.6]], [0, 1, 0]);
    face('concrete', [[lo, 0, v - 3.6], [lo, 4, v - 3.6], [lo, 4, v + 3.6], [lo, 0, v + 3.6]], [-end, 0, 0]);
    face('concrete', [[hi, 0, v - 3.6], [hi, 11, v - 3.6], [hi, 11, v + 3.6], [hi, 0, v + 3.6]], [end, 0, 0]);
  }
  for (const m of assembly.members) b.put(memberGeometry(m), 'steel');
  const root = b.finish();
  // Inspection-only named contacts stay out of GLB extras.
  Object.defineProperties(root.userData, { supports: { value: assembly.supports }, members: { value: assembly.members } });
  return root;
}
