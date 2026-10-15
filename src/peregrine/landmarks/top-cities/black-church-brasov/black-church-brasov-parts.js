import * as THREE from 'three';

// Gothic primitives for the Black Church. Everything is built in the plan frame (u along the nave,
// v across, y up); geometry.js rotates the finished model once.
export function pointed(w, h, segments = 3) {
  const rise = Math.min(w * 0.9, h * 0.4), spring = h - rise;
  const out = [[-w / 2, 0], [w / 2, 0], [w / 2, spring]];
  for (let i = 1; i <= segments; i++) {
    const t = i / segments;
    out.push([w / 2 * (1 - t * t), spring + rise * t]);
  }
  for (let i = segments - 1; i >= 0; i--) {
    const t = i / segments;
    out.push([-w / 2 * (1 - t * t), spring + rise * t]);
  }
  return out;
}
const path = (pts, Type = THREE.Shape) => new Type(pts.map(p => new THREE.Vector2(...p)));

export const BUTTRESS_DEPTH = 1.25; // nave buttress projection from the wall face (m)

export function kit(b, near) {
  const seg = near ? 3 : 1;
  function put(g, mat) {
    if (!g.attributes.normal) g.computeVertexNormals();
    b.put(g, mat);
  }
  // A convex planar polygon given as [u, y, v] points, wound to face away from `inside`.
  function poly(mat, pts, inside) {
    const pos = [];
    for (let i = 1; i < pts.length - 1; i++) {
      let a = pts[0], c = pts[i], d = pts[i + 1];
      const ab = new THREE.Vector3(...c).sub(new THREE.Vector3(...a)), ac = new THREE.Vector3(...d).sub(new THREE.Vector3(...a));
      const n = ab.cross(ac);
      const mid = new THREE.Vector3(...a).add(new THREE.Vector3(...c)).add(new THREE.Vector3(...d)).multiplyScalar(1 / 3);
      if (n.dot(mid.sub(new THREE.Vector3(...inside))) < 0) [c, d] = [d, c];
      pos.push(...a, ...c, ...d);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.computeVertexNormals();
    put(g, mat);
  }
  // A vertical wall slab: shape in (s, y), outer face at the plane through (cu, cv) facing `angle`
  // (rotation about Y: z → (sin, cos) in (u, v)), thickness running inwards. Windows are real holes.
  function wall(cu, cv, angle, width, height, holes = [], { depth = 0.8, y0 = 0, mat = 'stone', } = {}) {
    const s = path([[-width / 2, 0], [width / 2, 0], [width / 2, height], [-width / 2, height]]);
    for (const h of holes) {
      const pts = pointed(h.w, h.h, seg).map(([x, y]) => [x + (h.x || 0), y + h.y]);
      s.holes.push(path(pts.slice().reverse(), THREE.Path));
    }
    let g;
    if (near) { g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: 1 }); g.translate(0, 0, -depth); }
    else g = new THREE.ShapeGeometry(s);
    g.rotateY(angle); g.translate(cu, y0, cv);
    put(g, mat);
  }
  // Mullions and a trim sill inside each wall hole (near only).
  function mullions(cu, cv, angle, holes, y0 = 0) {
    if (!near) return;
    const sa = Math.sin(angle), ca = Math.cos(angle), tu = ca, tv = -sa; // tangent (s axis) in (u, v)
    for (const h of holes) {
      const s = h.x || 0, d = -0.35; // 0.35 m behind the outer face
      const pu = cu + s * tu + d * sa, pv = cv + s * tv + d * ca;
      if (h.w <= 1.5) continue;
      const r = h.w / 2, rise = Math.min(h.w * 0.9, h.h * 0.4), spring = y0 + h.y + h.h - rise;
      const q = (t, y) => [pu + tu * t, y, pv + tv * t];
      b.bar('stone', q(0, y0 + h.y + 0.2), q(0, spring), 0.14, 0.14);                         // central mullion
      for (const f of [0.18, 0.62]) b.bar('stone', q(-r, y0 + h.y + h.h * f), q(r, y0 + h.y + h.h * f), 0.12, 0.12);
      b.bar('stone', q(-r, spring), q(r, spring), 0.12, 0.12);                                    // springing transom
      // Y-tracery: the mullion forks at the springing and both branches run up into the pointed head
      const t = 0.75, hw = r * (1 - t * t);
      for (const sgn of [-1, 1]) b.bar('stone', q(0, spring - 0.05), q(sgn * hw * 1.02, spring + rise * t), 0.12, 0.12);
      b.bar('stone', q(0, spring + rise * 0.35), q(0, spring + rise * 0.97), 0.1, 0.1);            // cusp between the branches
    }
  }
  function cone(u, v, y0, y1, r, mat = 'stone', n = 4, rot = Math.PI / 4) {
    const g = new THREE.ConeGeometry(r, y1 - y0, n);
    g.rotateY(rot); g.translate(u, (y0 + y1) / 2, v); put(g, mat);
  }
  function cylinder(u, v, y0, y1, r0, r1 = r0, mat = 'stone', n = 8, open = false) {
    const g = new THREE.CylinderGeometry(r1, r0, y1 - y0, n, 1, open);
    g.translate(u, (y0 + y1) / 2, v); put(g, mat);
  }
  // Gabled roof prism. `axis` 'u': ridge along u (across = v); 'v': ridge along v (across = u).
  // Ends: 'gable' draws the closing triangle in stone, anything else leaves the end buried.
  function prism({ axis = 'u', a0, a1, c, half, eave, ridge, over = 0.35, ends = ['gable', 'gable'], bottom = true }) {
    const m = (a, y, x) => axis === 'u' ? [a, y, x] : [x, y, a];
    const rise = ridge - eave, ye = eave - over * rise / half, hx = half + over;
    const N0 = m(a0, ye, c - hx), N1 = m(a1, ye, c - hx), S0 = m(a0, ye, c + hx), S1 = m(a1, ye, c + hx);
    const R0 = m(a0, ridge, c), R1 = m(a1, ridge, c);
    const inside = m((a0 + a1) / 2, ye + 1, c);
    poly('roof', [N0, N1, R1, R0], inside); poly('roof', [S0, S1, R1, R0], inside);
    if (bottom) poly('stone', [N0, N1, S1, S0], inside);
    if (ends[0] === 'gable') poly('stone', [N0, S0, R0], inside);
    if (ends[1] === 'gable') poly('stone', [N1, S1, R1], inside);
    return { ye, hx };
  }
  // A stepped buttress at (cu, cv) projecting along `angle`; `cv` is on the outer wall face. Near: three stages
  // stepping back with sloped weatherings and a gabled cap; far: one block at the full projection.
  function buttress(cu, cv, angle, { width = 1.2, depth = BUTTRESS_DEPTH, h = 17, h2 = 20.5, top = 21.6 } = {}) {
    const sa = Math.sin(angle), ca = Math.cos(angle);
    const at = (d) => [cu + sa * d, cv + ca * d];
    const stage = (w, d, y0, y1) => { // block from 0.3 m inside the wall face to d out
      const [u, v] = at((d - 0.3) / 2);
      const g = new THREE.BoxGeometry(w, y1 - y0, d + 0.3); g.rotateY(angle); g.translate(u, (y0 + y1) / 2, v); put(g, 'stone');
    };
    if (!near) { stage(width, depth, 0, h); return; }
    const d1 = depth, d2 = depth * 0.7, d3 = depth * 0.42, ya = h * 0.48;
    stage(width, d1, 0, ya);
    weather(width, d1, d2, ya);
    stage(width - 0.12, d2, ya, h);
    weather(width - 0.12, d2, d3, h);
    stage(width - 0.24, d3, h, h2);
    const [u3, v3] = at(d3 / 2 - 0.15);
    cone(u3, v3, h2, top, (width - 0.24) * 0.62, 'stone', 4, Math.PI / 4 + angle);
    // sloped weathering from projection a back to b2 over 0.8 m of height, closed at both sides
    function weather(w, a, b2, y) {
      const hw = w / 2, tu = ca, tv = -sa; // tangent along the wall in (u, v)
      const p = (d, yy, t) => { const [u, v] = at(d); return [u + tu * t, yy, v + tv * t]; };
      const [ui, vi] = at(0);
      poly('stone', [p(a, y, -hw), p(a, y, hw), p(b2, y + 0.8, hw), p(b2, y + 0.8, -hw)], [ui, y, vi]);
      for (const t of [-hw, hw]) { const [ou, ov] = at((a + b2) / 2); poly('stone', [p(a, y, t), p(b2, y + 0.8, t), p(b2, y, t)], [ou - tu * t, y + 0.2, ov - tv * t]); }
    }
  }
  function disc(cu, cv, angle, y, r, proud, mat, n = near ? 14 : 6) {
    const g = new THREE.CylinderGeometry(r, r, 0.12, n); g.rotateX(Math.PI / 2); // axis along z
    g.translate(0, 0, proud); g.rotateY(angle); g.translate(cu, y, cv); put(g, mat);
  }
  return { near, seg, put, poly, wall, mullions, cone, cylinder, prism, buttress, disc, box: b.box, bar: b.bar };
}
