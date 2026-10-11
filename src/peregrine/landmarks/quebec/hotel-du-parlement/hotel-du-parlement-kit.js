import * as THREE from 'three';

// Primitives for the Hôtel du Parlement. Everything is authored in the building frame (+x along the front, +z out of the front,
// y up) and turned onto the mapped footprint once at the end of geometry.js. `b` is an assetBuilder.
export function kit(b, near) {
  const put = (g, m) => b.put(g, m);
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const mk = (P, N, I) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(N, 3)); g.setIndex(I);
    return g;
  };

  // Axis-aligned box. `omit` lists faces nobody sees: d = down, u = up, e / w = +x / -x, s / n = +z / -z.
  function box(m, x0, x1, y0, y1, z0, z1, omit = '') {
    const P = [], N = [], I = [];
    const face = (key, n, a, c, d, e) => { if (omit.includes(key)) return; const o = P.length / 3; P.push(...a, ...c, ...d, ...e); for (let i = 0; i < 4; i++) N.push(...n); I.push(o, o + 1, o + 2, o, o + 2, o + 3); };
    face('s', [0, 0, 1], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]);
    face('n', [0, 0, -1], [x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0]);
    face('e', [1, 0, 0], [x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1]);
    face('w', [-1, 0, 0], [x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]);
    face('u', [0, 1, 0], [x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]);
    face('d', [0, -1, 0], [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]);
    put(mk(P, N, I), m);
  }
  // A flat polygon (3 or 4 points) wound so its normal faces away from `ref`.
  function poly(m, pts, ref) {
    const a = V(...pts[0]), c = V(...pts[1]), d = V(...pts[2]);
    let n = c.clone().sub(a).cross(d.clone().sub(a)).normalize();
    const ctr = pts.reduce((s, p) => s.add(V(...p)), V(0, 0, 0)).multiplyScalar(1 / pts.length);
    const flip = n.dot(ctr.sub(V(...ref))) < 0; if (flip) { n = n.negate(); pts = [...pts].reverse(); }
    const P = [], N = [], I = [];
    pts.forEach((p) => { P.push(...p); N.push(n.x, n.y, n.z); });
    for (let i = 1; i < pts.length - 1; i++) I.push(0, i, i + 1);
    put(mk(P, N, I), m);
  }
  // Closed convex solid from points + faces (index lists), wound outward.
  function solid(m, pts, faces) {
    const c = pts.reduce((a, p) => a.add(V(...p)), V(0, 0, 0)).multiplyScalar(1 / pts.length);
    for (const f of faces) poly(m, f.map((i) => pts[i]), c.toArray());
  }
  // Sweep a polyline profile [[t, y], ...] along an axis ('x': t is z; 'z': t is x) from a0 to a1. Open ends, open bottom.
  function strip(m, axis, a0, a1, prof, ref) {
    const at = (a, [t, y]) => (axis === 'x' ? [a, y, t] : [t, y, a]);
    for (let i = 0; i + 1 < prof.length; i++) poly(m, [at(a0, prof[i]), at(a1, prof[i]), at(a1, prof[i + 1]), at(a0, prof[i + 1])], ref);
  }
  // Frustum between two rectangles [x0, x1, z0, z1] at y0 and y1: four sides, optionally the top (the bottom sits on a wall).
  function frustum(m, r0, r1, y0, y1, { top = true } = {}) {
    const [a0, a1, b0, b1] = r0, [c0, c1, d0, d1] = r1;
    const pts = [[a0, y0, b0], [a1, y0, b0], [a1, y0, b1], [a0, y0, b1], [c0, y1, d0], [c1, y1, d0], [c1, y1, d1], [c0, y1, d1]];
    const faces = [[0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]]; if (top) faces.push([4, 5, 6, 7]);
    solid(m, pts, faces);
  }
  // Square-plan loft (tower roofs): rings [{ y, hx, hz }] about (cx, cz); a ring with hx = 0 closes at an apex.
  function loft(m, cx, cz, rings, { top = true } = {}) {
    for (let i = 0; i + 1 < rings.length; i++) {
      const p = rings[i], q = rings[i + 1], cy = (p.y + q.y) / 2;
      const P = (r, sx, sz) => [cx + sx * r.hx, r.y, cz + sz * r.hz];
      const sides = [[[-1, -1], [1, -1]], [[1, -1], [1, 1]], [[1, 1], [-1, 1]], [[-1, 1], [-1, -1]]];
      for (const [s0, s1] of sides) poly(m, [P(p, ...s0), P(p, ...s1), P(q, ...s1), P(q, ...s0)].filter((pt, k, a) => k === 0 || pt.some((v, j) => Math.abs(v - a[k - 1][j]) > 1e-6)), [cx, cy, cz]);
    }
    const t = rings[rings.length - 1];
    if (top && t.hx > 0) poly(m, [[cx - t.hx, t.y, cz - t.hz], [cx + t.hx, t.y, cz - t.hz], [cx + t.hx, t.y, cz + t.hz], [cx - t.hx, t.y, cz + t.hz]], [cx, t.y - 1, cz]);
  }
  function lathe(m, x, y0, z, profile, seg = near ? 14 : 8) {
    const g = new THREE.LatheGeometry(profile.map(([r, h]) => new THREE.Vector2(r, h)), seg); g.translate(x, y0, z); put(g, m);
  }
  function cyl(m, x, y0, y1, z, r0, r1 = r0, seg = near ? 10 : 6, caps = 't') {
    const g = new THREE.CylinderGeometry(r1, r0, y1 - y0, seg, 1, true); g.translate(x, (y0 + y1) / 2, z); put(g, m);
    if (caps.includes('t') && r1 > 0) put(new THREE.CircleGeometry(r1, seg).rotateX(-Math.PI / 2).translate(x, y1, z), m);
    if (caps.includes('b') && r0 > 0) put(new THREE.CircleGeometry(r0, seg).rotateX(Math.PI / 2).translate(x, y0, z), m);
  }
  function cone(m, x, y0, y1, z, r, seg = near ? 8 : 5) {
    const g = new THREE.ConeGeometry(r, y1 - y0, seg, 1, true); g.translate(x, (y0 + y1) / 2, z); put(g, m);
  }
  const bar = (m, a, c, w, d = w) => b.bar(m, a, c, w, d);

  // ---- wall-local pieces (normal +Z), placed on a wall with face angle `ang` (0 = +z, PI = -z, PI/2 = +x, -PI/2 = -x) ----
  const onWall = (g, x, y, z, ang) => { g.rotateY(ang); g.translate(x, y, z); return g; };
  const archShape = (w, h, rise = null, segs = near ? 6 : 3) => {
    const r = w / 2, s = rise == null ? r : rise, sh = new THREE.Shape();
    sh.moveTo(-r, 0); sh.lineTo(r, 0); sh.lineTo(r, h - s);
    for (let i = 1; i <= segs; i++) { const a = Math.PI * i / segs; sh.lineTo(Math.cos(a) * r, h - s + Math.sin(a) * s); }
    sh.lineTo(-r, 0); return sh;
  };
  // Wall-local box with only the faces that can be seen: f front, u up, d down, l left, r right (the back is against the wall).
  function wbox(m, sa, sb, y0, y1, d0, d1, faces, x, y, z, ang) {
    const P = [], N = [], I = [];
    const q = (a, c, d, e, n) => { const o = P.length / 3; P.push(...a, ...c, ...d, ...e); for (let i = 0; i < 4; i++) N.push(...n); I.push(o, o + 1, o + 2, o, o + 2, o + 3); };
    if (faces.includes('f')) q([sa, y0, d1], [sb, y0, d1], [sb, y1, d1], [sa, y1, d1], [0, 0, 1]);
    if (faces.includes('u')) q([sa, y1, d1], [sb, y1, d1], [sb, y1, d0], [sa, y1, d0], [0, 1, 0]);
    if (faces.includes('d')) q([sa, y0, d0], [sb, y0, d0], [sb, y0, d1], [sa, y0, d1], [0, -1, 0]);
    if (faces.includes('l')) q([sa, y0, d0], [sa, y0, d1], [sa, y1, d1], [sa, y1, d0], [-1, 0, 0]);
    if (faces.includes('r')) q([sb, y0, d1], [sb, y0, d0], [sb, y1, d0], [sb, y1, d1], [1, 0, 0]);
    put(onWall(mk(P, N, I), x, y, z, ang), m);
  }
  // A window: dark pane 12 cm proud of the wall; near adds a sill and jambs (and a flat arch ring or a head) in dressed stone that stand 34 cm
  // out, so the pane sits 22 cm deep in a reveal whose shadowed sides and soffit are `stoneDark`.
  function win(x, y, z, w, h, ang, { arch = false, mat = 'glass', frame = true, ring = false, sill = true } = {}) {
    const rise = w / 2, D = 0.34;
    const glass = arch ? new THREE.ShapeGeometry(archShape(w, h, rise)) : new THREE.PlaneGeometry(w, h).translate(0, h / 2, 0);
    glass.translate(0, 0, 0.12); put(onWall(glass, x, y, z, ang), mat);
    if (!frame || !near) return;
    if (sill) wbox('trim', -(w + 0.6) / 2, (w + 0.6) / 2, -0.2, 0, 0, D + 0.08, 'fu', x, y, z, ang);                // sill
    const jh = arch ? h - rise : h;
    for (const s of [-1, 1]) {
      wbox('trim', s * (w / 2 + 0.08) - 0.1, s * (w / 2 + 0.08) + 0.1, 0, jh, 0, D, 'f', x, y, z, ang);                       // jambs
      wbox('stoneDark', s * (w / 2 - 0.02), s * (w / 2 - 0.02), 0, jh, 0.12, D, s < 0 ? 'r' : 'l', x, y, z, ang);              // their shadowed inner faces
    }
    if (arch && ring) {
      const outer = archShape(w + 0.5, h + 0.25, rise + 0.25, 6); outer.holes.push(new THREE.Path(archShape(w + 0.1, h, rise, 6).getPoints(6)));
      put(onWall(new THREE.ShapeGeometry(outer, 6).translate(0, -0.0, D), x, y, z, ang), 'trim');
    } else if (!arch) {
      wbox('trim', -(w + 0.6) / 2, (w + 0.6) / 2, h, h + 0.25, 0, D + 0.02, 'fu', x, y, z, ang);                                // head
      wbox('stoneDark', -(w / 2 - 0.02), w / 2 - 0.02, h, h, 0.12, D, 'd', x, y, z, ang);                                       // its soffit
    }
  }
  // Pedimented dormer in a mansard: stone frame, pane, slate gable. (x, y, z) is the centre of its front at the foot.
  function dormer(x, y, z, ang, { w = 1.5, h = 2.4, rise = 0.9, depth = 1.5, mat = 'glass' } = {}) {
    const bw = w + 0.7;
    put(onWall(new THREE.BoxGeometry(bw, h, depth).translate(0, h / 2, -depth / 2 + 0.2), x, y, z, ang), 'stone');
    if (near) win(x, y + 0.35, z + 0.2, w, h - 0.7, ang, { mat, frame: false });
    const sh = new THREE.Shape([new THREE.Vector2(-bw / 2 - 0.12, 0), new THREE.Vector2(bw / 2 + 0.12, 0), new THREE.Vector2(0, rise)]);
    put(onWall(new THREE.ExtrudeGeometry(sh, { depth: depth + 0.1, bevelEnabled: false }).translate(0, h, -depth + 0.3), x, y, z, ang), 'roof');
  }
  // A bronze statue silhouette on a pedestal (about 2.3 m, pedestal included), standing on a ledge at (x, y, z), facing `ang`.
  function statue(x, y, z, ang, { ped = 0.9, scale = 1 } = {}) {
    if (!near) return;
    put(onWall(new THREE.BoxGeometry(0.8 * scale, ped, 0.7 * scale).translate(0, ped / 2, 0.35 * scale), x, y, z, ang), 'trim');
    const py = ped, c = 0.35 * scale;
    put(onWall(new THREE.CylinderGeometry(0.27 * scale, 0.38 * scale, 0.95 * scale, 5, 1, true).translate(0, py + 0.475 * scale, c), x, y, z, ang), 'iron');
    put(onWall(new THREE.CylinderGeometry(0.17 * scale, 0.27 * scale, 0.55 * scale, 5, 1, false).translate(0, py + 1.225 * scale, c), x, y, z, ang), 'iron');
    put(onWall(new THREE.OctahedronGeometry(0.17 * scale, 0).translate(0, py + 1.68 * scale, c), x, y, z, ang), 'iron');
  }
  // Stone course around an axis-aligned rectangle (a string course or cornice).
  const course = (m, x0, x1, z0, z1, y, h, out = 0.35) => box(m, x0 - out, x1 + out, y, y + h, z0 - out, z1 + out);
  return { box, poly, solid, strip, frustum, loft, lathe, cyl, cone, bar, onWall, archShape, wbox, win, dormer, statue, course, put, V, mk };
}

// Drop the downward faces that rest on the ground (y <= 1 cm): nobody sees them.
export function dropGroundFaces(g) {
  const p = g.attributes.position, n = g.attributes.normal, idx = g.index, keep = [];
  for (let i = 0; i < idx.count; i += 3) {
    const a = idx.getX(i), c = idx.getX(i + 1), d = idx.getX(i + 2);
    if (n.getY(a) < -0.9 && p.getY(a) < 0.01 && p.getY(c) < 0.01 && p.getY(d) < 0.01) continue;
    keep.push(a, c, d);
  }
  g.setIndex(keep);
  return g;
}
