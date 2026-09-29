import * as THREE from 'three';

// Primitives for the Ontario Legislative Building. Everything is authored in the
// building's own frame (+X along the south front toward the east end, +Z toward
// the front, i.e. the facade faces +Z, north is -Z) and rotated onto the mapped
// footprint once, at the very end of geometry.js. `b` is an assetBuilder.
export function kit(b, near) {
  const put = (g, m) => b.put(g, m);
  const V = (x, y, z) => new THREE.Vector3(x, y, z);

  // Closed convex solid from points + faces (index lists), wound outward.
  function solid(material, pts, faces) {
    const c = pts.reduce((a, p) => a.add(V(...p)), V(0, 0, 0)).multiplyScalar(1 / pts.length);
    const pos = [];
    for (const f of faces) {
      for (let i = 1; i < f.length - 1; i++) {
        const a = V(...pts[f[0]]), q = V(...pts[f[i]]), r = V(...pts[f[i + 1]]);
        const n = q.clone().sub(a).cross(r.clone().sub(a));
        const flip = n.dot(a.clone().sub(c)) < 0;
        pos.push(...a.toArray(), ...(flip ? [r, q] : [q, r]).flatMap((p) => p.toArray()));
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.computeVertexNormals(); put(g, material);
  }

  const box = (m, x0, x1, y0, y1, z0, z1) => b.box(m, [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], [x1 - x0, y1 - y0, z1 - z0]);
  const boxR = (m, cx, cy, cz, w, h, d, ang) => b.box(m, [cx, cy, cz], [w, h, d], ang);

  // Hipped roof over the rectangle x0..x1, z0..z1 from eave height y0. The ridge runs
  // along X or Z; `inset` is how far each ridge end sits in from its gable end
  // (default: 45 degree hips, so a square plan becomes a pyramid). A closed solid so
  // nothing is seen through it from below.
  function hipRoof(m, x0, x1, z0, z1, y0, rise, opts = {}) {
    const o = opts, over = o.over || 0; x0 -= over; x1 += over; z0 -= over; z1 += over;
    const w = x1 - x0, d = z1 - z0, ax = o.along || (w >= d ? 'x' : 'z');
    const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, yt = y0 + rise, short = ax === 'x' ? d : w;
    const i0 = Array.isArray(o.inset) ? o.inset[0] : o.inset, i1 = Array.isArray(o.inset) ? o.inset[1] : o.inset;
    const ins0 = i0 == null ? short / 2 : Math.min(i0, short / 2), ins1 = i1 == null ? short / 2 : Math.min(i1, short / 2);
    const c = [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]];
    let r0, r1, faces;
    if (ax === 'x') { r0 = [x0 + ins0, yt, cz]; r1 = [x1 - ins1, yt, cz]; faces = [[0, 1, 5, 4], [2, 3, 4, 5], [3, 0, 4], [1, 2, 5]]; }
    else { r0 = [cx, yt, z0 + ins0]; r1 = [cx, yt, z1 - ins1]; faces = [[0, 3, 5, 4], [1, 2, 5, 4], [0, 1, 4], [3, 2, 5]]; }
    solid(m, [...c, r0, r1], [[0, 1, 2, 3], ...faces]);
  }
  // Convex frustum: a base rectangle at y0 and a smaller (or offset) top rectangle at y1.
  function frustum(m, b, t, y0, y1) {
    const [bx0, bx1, bz0, bz1] = b, [tx0, tx1, tz0, tz1] = t;
    solid(m, [[bx0, y0, bz0], [bx1, y0, bz0], [bx1, y0, bz1], [bx0, y0, bz1], [tx0, y1, tz0], [tx1, y1, tz0], [tx1, y1, tz1], [tx0, y1, tz1]],
      [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]]);
  }
  // Pyramid over a convex polygon ring [[x, z], ...] (any winding) rising to an apex.
  function polyPyramid(m, ring, y0, apex) {
    const pts = ring.map(([x, z]) => [x, y0, z]); pts.push(apex);
    const n = ring.length, faces = [Array.from({ length: n }, (_, i) => i)];
    for (let i = 0; i < n; i++) faces.push([i, (i + 1) % n, n]);
    solid(m, pts, faces);
  }
  // Gable roof: ridge along `along`; hips omitted (gable ends are closed by gableWall).
  function gableRoof(m, x0, x1, z0, z1, y0, rise, { along = 'x', over = 0 } = {}) {
    x0 -= over; x1 += over; z0 -= over; z1 += over;
    const yt = y0 + rise, cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
    const pts = along === 'x'
      ? [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [x0, yt, cz], [x1, yt, cz]]
      : [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [cx, yt, z0], [cx, yt, z1]];
    const faces = along === 'x'
      ? [[0, 1, 2, 3], [0, 1, 5, 4], [2, 3, 4, 5], [3, 0, 4], [1, 2, 5]]
      : [[0, 1, 2, 3], [0, 3, 5, 4], [1, 2, 5, 4], [0, 1, 4], [3, 2, 5]];
    solid(m, pts, faces);
  }
  // Triangular gable wall (thickness t) closing a gable roof at z (axis 'z') or x (axis 'x'),
  // spanning a0..a1 along the other horizontal axis. It is `grow` larger than the roof it
  // meets, so the verge stands proud of the slate instead of z-fighting with it.
  function gableWall(m, axis, at, a0, a1, y0, rise, t = 0.6, grow = 0.16) {
    const hw = (a1 - a0) / 2, mid = (a0 + a1) / 2, yt = y0 + (hw + grow) * rise / hw;
    const lo = at - t / 2, hi = at + t / 2, p = axis === 'z';
    const P = (a, y, c) => (p ? [a, y, c] : [c, y, a]);
    solid(m, [P(a0 - grow, y0, lo), P(a1 + grow, y0, lo), P(mid, yt, lo), P(a0 - grow, y0, hi), P(a1 + grow, y0, hi), P(mid, yt, hi)],
      [[0, 1, 2], [3, 4, 5], [0, 1, 4, 3], [1, 2, 5, 4], [2, 0, 3, 5]]);
  }

  // Lofted dome from a [radius, height] profile (bottom to top), centred at (x, z).
  function lathe(m, x, y0, z, profile, seg = near ? 20 : 10) {
    const g = new THREE.LatheGeometry(profile.map(([r, h]) => new THREE.Vector2(r, h)), seg);
    g.translate(x, y0, z); put(g, m);
  }
  function cyl(m, x, y0, y1, z, r0, r1 = r0, seg = near ? 14 : 8) {
    const g = new THREE.CylinderGeometry(r1, r0, y1 - y0, seg, 1);
    g.translate(x, (y0 + y1) / 2, z); put(g, m);
  }
  function cone(m, x, y0, y1, z, r, seg = 8) {
    const g = new THREE.ConeGeometry(r, y1 - y0, seg);
    g.translate(x, (y0 + y1) / 2, z); put(g, m);
  }

  // Arch outline (a semicircular head) in a local x/y plane, base at y = 0.
  function archShape(w, h, rise = null) {
    const r = w / 2, s = rise == null ? r : rise, sh = new THREE.Shape();
    sh.moveTo(-r, 0); sh.lineTo(r, 0); sh.lineTo(r, h - s);
    const n = near ? 10 : 5;
    for (let i = 1; i <= n; i++) { const a = Math.PI * i / n; sh.lineTo(Math.cos(a) * r, h - s + Math.sin(a) * s); }
    sh.lineTo(-r, 0); return sh;
  }
  // Place a local geometry (normal +Z) on a wall: face angle `ang` (0 faces +Z, PI faces -Z,
  // PI/2 faces +X, -PI/2 faces -X), with its origin at (x, y, z).
  const onWall = (g, x, y, z, ang) => { g.rotateY(ang); g.translate(x, y, z); return g; };
  // A window: dark glass pane with a dressed-stone head and sill. `arch` gives a round head.
  function win(x, y, z, w, h, ang, { arch = false, mat = 'glass', frame = true, rise = null } = {}) {
    const glass = arch ? new THREE.ShapeGeometry(archShape(w, h, rise), near ? 8 : 4) : new THREE.PlaneGeometry(w, h).translate(0, h / 2, 0);
    glass.translate(0, 0, 0.05); put(onWall(glass, x, y, z, ang), mat);
    if (!frame || !near) return;
    if (!arch) {
      const head = new THREE.BoxGeometry(w + 0.7, 0.32, 0.34).translate(0, h + 0.14, 0.14);
      put(onWall(head, x, y, z, ang), 'trim');
    }
    const sill = new THREE.BoxGeometry(w + 0.5, 0.22, 0.42).translate(0, -0.1, 0.16);
    put(onWall(sill, x, y, z, ang), 'trim');
    for (const s of [-1, 1]) {
      const jamb = new THREE.BoxGeometry(0.2, arch ? h - (rise == null ? w / 2 : rise) : h, 0.26).translate(s * (w / 2 + 0.06), (arch ? h - (rise == null ? w / 2 : rise) : h) / 2, 0.1);
      put(onWall(jamb, x, y, z, ang), 'trim');
    }
  }
  // An arch ring in dressed stone around a round-headed opening (extruded, hollow).
  function archRing(x, y, z, w, h, ang, { rim = 0.45, depth = 0.5, rise = null } = {}) {
    const outer = archShape(w + rim * 2, h + rim, rise == null ? null : rise + rim);
    outer.holes.push(new THREE.Path(archShape(w, h, rise).getPoints(near ? 10 : 5)));
    const g = new THREE.ExtrudeGeometry(outer, { depth, bevelEnabled: false, curveSegments: near ? 10 : 5 });
    g.translate(0, 0, 0.0); put(onWall(g, x, y, z, ang), 'trim');
  }
  // A row of identical windows along a wall. Wall runs from (x0,z0) to (x1,z1); n windows.
  function windowRow(x0, z0, x1, z1, y, n, w, h, ang, opts) {
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n;
      win(x0 + (x1 - x0) * t, y, z0 + (z1 - z0) * t, w, h, ang, opts);
    }
  }
  // A stepped horizontal course (string course / cornice) around an axis-aligned rectangle.
  function course(m, x0, x1, z0, z1, y, h, out = 0.35) { box(m, x0 - out, x1 + out, y, y + h + 0.03, z0 - out, z1 + out); }
  // Wall dormer facing angle `ang`; (x, y, z) is the centre of its front at the eave. The stone
  // gable is proud of the slate behind it, so the pediment reads from the front.
  function dormer(x, y, z, ang, { w = 1.8, h = 2.6, rise = 1.5, depth = 2.0, mat = 'glass', panes = 1 } = {}) {
    const bw = w + 0.8;
    put(onWall(new THREE.BoxGeometry(bw, h, depth).translate(0, h / 2, -depth / 2), x, y, z, ang), 'stone');
    const tri = (hw, r, d, z0) => {
      const sh = new THREE.Shape([new THREE.Vector2(-hw, 0), new THREE.Vector2(hw, 0), new THREE.Vector2(0, r)]);
      return new THREE.ExtrudeGeometry(sh, { depth: d, bevelEnabled: false }).translate(0, h, z0);
    };
    put(onWall(tri(bw / 2 + 0.16, rise + 0.16, 0.34, -0.3), x, y, z, ang), 'trim');
    put(onWall(tri(bw / 2, rise, depth - 0.3, -depth), x, y, z, ang), 'roof');
    if (panes === 1) win(x, y + 0.35, z, w * 0.66, h - 0.8, ang, { frame: false, mat });
    else for (let i = 0; i < panes; i++) {
      const pw = w / panes * 0.62, dx = (i - (panes - 1) / 2) * (w / panes);
      const c = Math.cos(ang), s = Math.sin(ang);
      win(x + c * dx, y + 0.4, z - s * dx, pw, h - 0.9, ang, { arch: true, rise: pw / 2, mat, frame: false });
    }
  }
  // Tall ribbed chimney stack: a square base with shaft and a corbelled cap.
  function stack(x, y0, y1, z, size = 1.6, round = false) {
    if (round) { cyl('stone', x, y0, y1 - 0.5, z, size / 2, size / 2 * 0.9, near ? 12 : 6); cyl('trim', x, y1 - 0.5, y1, z, size / 2 + 0.2, size / 2 + 0.2, near ? 12 : 6); }
    else { box('stone', x - size / 2, x + size / 2, y0, y1 - 0.5, z - size / 2, z + size / 2); box('trim', x - size / 2 - 0.2, x + size / 2 + 0.2, y1 - 0.5, y1, z - size / 2 - 0.2, z + size / 2 + 0.2); }
    if (near && !round) for (const s of [-1, 1]) { box('stoneDark', x + s * (size / 2 - 0.06), x + s * (size / 2 + 0.05), y0, y1 - 0.6, z - size / 2 + 0.25, z + size / 2 - 0.25); }
  }
  return { solid, box, boxR, frustum, polyPyramid, hipRoof, gableRoof, gableWall, lathe, cyl, cone, archShape, onWall, win, archRing, windowRow, course, dormer, stack, V, put };
}
