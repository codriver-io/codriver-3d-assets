import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { OUTLINE, SOUTH, NORTH, LINK, xyz, PANEL_COLS, PANEL_ROWS, panelCenter, southV, SPIRAL, spiralPoint } from './institut-du-monde-arabe-parts.js';

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near', b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail), soups = new Map();
  const vec = p => new THREE.Vector3(...p);
  function tri(m, a, c, d, out) {
    if (vec(c).sub(vec(a)).cross(vec(d).sub(vec(a))).dot(vec(out).sub(vec(a))) < 0) [c, d] = [d, c];
    if (!soups.has(m)) soups.set(m, []);
    soups.get(m).push(...a, ...c, ...d);
  }
  function quad(m, a, c, d, e, out) { tri(m, a, c, d, out); tri(m, a, d, e, out); }
  function facadeRect(m, a, c, y0, y1, out) {
    quad(m, xyz(a[0], y0, a[1]), xyz(c[0], y0, c[1]), xyz(c[0], y1, c[1]), xyz(a[0], y1, a[1]), out);
  }
  // Wall grids are a planar tessellation: panes and aluminium strips share boundaries, never overlap.
  function wall(a, c, h, openWest = false) {
    const du = c[0] - a[0], dv = c[1] - a[1], L = Math.hypot(du, dv);
    const out = xyz((a[0] + c[0]) / 2 + dv, h / 2, (a[1] + c[1]) / 2 - du);
    const N = Math.max(1, Math.ceil(L / (near ? 4 : 6.4))), M = Math.ceil(h / (near ? 2.1 : 4.5));
    const at = t => [a[0] + du * t, a[1] + dv * t];
    for (let i = 0; i < N; i++) for (let j = 0; j < M; j++) {
      const x0 = i / N, x1 = (i + 1) / N, y0 = j * h / M, y1 = (j + 1) * h / M;
      const margin = 0.07 / L, p0 = at(x0), p1 = at(x0 + margin), p2 = at(x1 - margin), p3 = at(x1);
      if (j === 0) { facadeRect('metal', p0, p1, 0, h, out); facadeRect('metal', p2, p3, 0, h, out); }
      facadeRect('frame', p1, p2, y0, y0 + 0.13, out); facadeRect('metal', p1, p2, y1 - 0.1, y1, out);
      // West-end glazed bay is an intentional open cutaway so the interior white spiral is legible.
      if (!(openWest && j > 0 && j < M - 1)) facadeRect(j === 0 && i % 4 === 1 ? 'glow' : 'glass', p1, p2, y0 + 0.13, y1 - 0.1, out);
    }
  }
  function roof(poly, y) {
    const ts = THREE.ShapeUtils.triangulateShape(poly.map(p => new THREE.Vector2(...p)), []);
    for (const [i, j, k] of ts) tri('roof', xyz(poly[i][0], y, poly[i][1]), xyz(poly[j][0], y, poly[j][1]), xyz(poly[k][0], y, poly[k][1]), xyz(0, y + 10, 0));
  }
  function prism(poly, h, skip = []) {
    // Input rings are CCW in u/v. Correct the winding once for outward wall probes.
    const area = poly.reduce((s, p, i) => { const q = poly[(i + 1) % poly.length]; return s + p[0] * q[1] - p[1] * q[0]; }, 0);
    const ring = area > 0 ? poly : [...poly].reverse();
    roof(ring, h);
    for (let i = 0; i < ring.length; i++) {
      const p = ring[i], q = ring[(i + 1) % ring.length];
      if (skip.some(f => f(p, q))) continue;
      wall(p, q, h, Math.max(p[0], q[0]) < -44);
    }
  }
  const isSouth = (p, q) => p[1] > 8 && q[1] > 8;
  prism(SOUTH, 32, [isSouth]);
  prism(NORTH, 26.6);
  prism(LINK, 30.7);

  // The open west bays stand in for the clear glazing in front of the book tower. The shell is
  // single-sided, so line the void behind them with an inward-facing dark atrium (floor slab at
  // 2 m below the lowest open row, soffit at 30 m above the highest, north, south and back walls):
  // every view through the cutaway ends on an interior face or the spiral, never on culled shell
  // back faces. Side walls sit 5 cm inside the shell; the floor and soffit meet the west wall line.
  {
    const [sw, mid, nw, ne] = [OUTLINE[0], OUTLINE[26], OUTLINE[25], OUTLINE[24]], inset = 0.05, back = -35.2, y0 = 2, y1 = 30;
    const along = (p, q, d) => { const t = d / Math.hypot(q[0] - p[0], q[1] - p[1]); return [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]; };
    const northV = u => nw[1] + (u - nw[0]) / (ne[0] - nw[0]) * (ne[1] - nw[1]);
    const ring = [along(sw, mid, inset), mid, along(nw, mid, inset), [back, northV(back) + inset], [back, southV(back) - inset]];
    const cu = ring.reduce((s, p) => s + p[0], 0) / ring.length, cv = ring.reduce((s, p) => s + p[1], 0) / ring.length, inside = xyz(cu, (y0 + y1) / 2, cv);
    for (const [y, toward] of [[y0, y1], [y1, y0]]) for (const [i, j, k] of THREE.ShapeUtils.triangulateShape(ring.map(p => new THREE.Vector2(...p)), [])) {
      tri('aperture', xyz(ring[i][0], y, ring[i][1]), xyz(ring[j][0], y, ring[j][1]), xyz(ring[k][0], y, ring[k][1]), xyz(cu, toward, cv));
    }
    for (let i = 2; i < ring.length; i++) facadeRect('aperture', ring[i], ring[(i + 1) % ring.length], y0, y1, inside);
  }

  // 240 metal moucharabiehs. Panel face and aperture infill occupy disjoint regions of one plane.
  // Each near mechanism has a central octagon, four small lenses with geometric star-shaped central iris surrounds.
  const u0 = OUTLINE[0][0], u1 = OUTLINE[4][0], pitch = (u1 - u0) / PANEL_COLS;
  function frontRect(m, x0, x1, y0, y1) { facadeRect(m, [x0, southV(x0)], [x1, southV(x1)], y0, y1, xyz((x0 + x1) / 2, (y0 + y1) / 2, 20)); }
  // ground glass and the narrow head frame
  for (let c = 0; c < PANEL_COLS; c++) {
    const l = u0 + c * pitch, r = l + pitch;
    frontRect('metal', l, l + 0.12, 0, 3.3); frontRect(c % 6 === 1 ? 'glow' : 'glass', l + 0.12, r - 0.12, 0, 3.3); frontRect('metal', r - 0.12, r, 0, 3.3);
  }
  frontRect('metal', u0, u1, 30.9, 32);
  for (let c = 0; c < PANEL_COLS; c++) for (let r = 0; r < PANEL_ROWS; r++) {
    const [u, y] = panelCenter(c, r), hw = pitch / 2, hh = 1.38, pad = 0.13;
    frontRect('frame', u - hw, u - hw + pad, y - hh, y + hh);
    frontRect('frame', u + hw - pad, u + hw, y - hh, y + hh);
    frontRect('frame', u - hw + pad, u + hw - pad, y - hh, y - hh + pad);
    frontRect('frame', u - hw + pad, u + hw - pad, y + hh - pad, y + hh);
    const outer = [[-hw + pad, -hh + pad], [hw - pad, -hh + pad], [hw - pad, hh - pad], [-hw + pad, hh - pad]].map(p => new THREE.Vector2(...p));
    const lens = [[0, 0, near ? 0.65 : 0.46, near ? 16 : 4]];
    if (near) {
      for (const a of [-1, 1]) for (const d of [-1, 1]) lens.push([a * 0.66, d * 0.73, 0.22, 4]);
    }
    const holes = lens.map(([x, yy, radius, n]) => Array.from({ length: n }, (_, i) => new THREE.Vector2(x + radius * (near && n === 16 && i % 2 ? 0.67 : 1) * Math.cos(i * Math.PI * 2 / n), yy + radius * (near && n === 16 && i % 2 ? 0.67 : 1) * Math.sin(i * Math.PI * 2 / n))));
    const points = [...outer, ...holes.flat()], out = xyz(u, y, 20);
    const p3 = p => xyz(u + p.x, y + p.y, southV(u + p.x));
    for (const [i, j, k] of THREE.ShapeUtils.triangulateShape(outer, holes)) tri('metal', p3(points[i]), p3(points[j]), p3(points[k]), out);
    for (let k = 0; k < holes.length; k++) {
      const h = holes[k], center = new THREE.Vector2(lens[k][0], lens[k][1]);
      for (let i = 0; i < h.length; i++) {
        const j = (i + 1) % h.length;
        if (near && k === 0) {
          const a = h[i].clone().normalize().multiplyScalar(0.25), d = h[j].clone().normalize().multiplyScalar(0.25);
          quad(i % 2 ? 'frame' : 'glass', p3(h[i]), p3(h[j]), p3(d), p3(a), out);
          tri('aperture', p3(center), p3(a), p3(d), out);
        } else tri('aperture', p3(center), p3(h[i]), p3(h[j]), out);
      }
    }
  }

  // North roof terrace: solid low parapet follows the river curve and has no floating rail ends.
  const chain = OUTLINE.slice(6, 18);
  for (let i = 0; i < chain.length - 1; i++) {
    const p = chain[i], q = chain[i + 1], len = Math.hypot(q[0] - p[0], q[1] - p[1]);
    const cen = xyz((p[0] + q[0]) / 2, 27.05, (p[1] + q[1]) / 2);
    b.box('metal', cen, [len, 0.9, 0.22], -Math.atan2(xyz(q[0] - p[0], 0, q[1] - p[1])[2], xyz(q[0] - p[0], 0, q[1] - p[1])[0]));
  }
  // White spiral book tower, rooted at plaza grade. Closed helical ramp around a white core.
  const core = new THREE.CylinderGeometry(1.12, 1.12, 29.1, near ? 20 : 10); core.translate(...xyz(SPIRAL.u, 14.55, SPIRAL.v)); b.put(core, 'white');
  const seg = near ? 144 : 64;
  for (let i = 0; i < seg; i++) {
    const t = i / seg, s = (i + 1) / seg;
    const ai = spiralPoint(t, 1.08), ao = spiralPoint(t), bi = spiralPoint(s, 1.08), bo = spiralPoint(s);
    // Orient tread and soffit by probes straight above/below their shared first vertex: the coarse
    // far helix is steep enough that an off-axis probe flipped soffit triangles to face up.
    const lower = p => [p[0], p[1] - 0.26, p[2]];
    quad('white', ai, ao, bo, bi, [ai[0], ai[1] + 1, ai[2]]);
    quad('white', lower(ai), lower(bi), lower(bo), lower(ao), [ai[0], ai[1] - 1.26, ai[2]]);
    const cc = xyz(SPIRAL.u, ao[1], SPIRAL.v), outside = [ao[0] * 2 - cc[0], ao[1], ao[2] * 2 - cc[2]];
    quad('white', lower(ao), lower(bo), bo, ao, outside);
    quad('white', ai, bi, lower(bi), lower(ai), cc);
  }
  // Ribbon starts/finishes in solid floor landings carried by the core (no unsupported free end).
  for (const t of [0, 1]) {
    const p = spiralPoint(t), mid = xyz(SPIRAL.u + SPIRAL.radius / 2, p[1] - 0.26, SPIRAL.v);
    b.box('white', [mid[0], mid[1], mid[2]], [SPIRAL.radius + 0.3, 0.52, 1.4], -Math.atan2(xyz(1, 0, 0)[2], xyz(1, 0, 0)[0]));
  }
  for (const [m, p] of soups) {
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3)); g.computeVertexNormals(); const indexed = mergeVertices(g, 1e-4); g.dispose(); b.put(indexed, m);
  }
  return b.finish();
}
