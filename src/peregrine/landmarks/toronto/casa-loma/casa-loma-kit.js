// Casa Loma's primitive kit: a frame-aware wrapper over `assetBuilder` so each
// wing can be authored in its own (u, v) plan axes and rotated onto the map once.
//
// Plan coordinates are metres: u runs along the frame's long axis, v across it
// (+v is +Z, south when the frame is unrotated), y is up from local grade y = 0.
// Every primitive takes its BOTTOM height, so a stack of parts reads like a
// list of storeys. Authoring only: nothing here reaches the app bundle.
import * as THREE from 'three';

export function createKit(b, near) {
  const st = { du: 0, dv: 0, a: 0 };
  /** Everything drawn after this call is first shifted by plan (du, dv), then rotated by `a` (rad, about +Y). */
  const frame = (a = 0, du = 0, dv = 0) => { st.a = a; st.du = du; st.dv = dv; };
  const seg = (n, far = Math.max(3, Math.round(n / 2))) => (near ? n : far);
  const out = (g, m) => {
    g.translate(st.du, 0, st.dv);
    if (st.a) g.rotateY(st.a);
    b.put(g, m, 0, 0);
  };

  function box(m, u, y0, v, w, h, d, rot = 0) {
    const g = new THREE.BoxGeometry(w, h, d);
    if (rot) g.rotateY(rot);
    g.translate(u, y0 + h / 2, v);
    out(g, m);
  }
  /** Truncated cone / cylinder; `open` skips the bottom cap (it is never seen). */
  function cyl(m, u, v, y0, y1, r0, r1 = r0, n = seg(24, 10), open = false) {
    const g = new THREE.CylinderGeometry(r1, r0, y1 - y0, n, 1, open);
    g.translate(u, (y0 + y1) / 2, v);
    out(g, m);
  }
  function cone(m, u, v, y0, y1, r, n = seg(24, 8)) {
    const g = new THREE.CylinderGeometry(0, r, y1 - y0, n, 1, true);
    g.translate(u, (y0 + y1) / 2, v);
    out(g, m);
  }
  /** Four-sided hipped pyramid over a w x d plan, apex at y1. */
  function pyramid(m, u, v, y0, y1, w, d, rot = 0) {
    const g = new THREE.CylinderGeometry(0, Math.SQRT1_2, y1 - y0, 4, 1, true);
    g.rotateY(Math.PI / 4); g.scale(w, 1, d);
    if (rot) g.rotateY(rot);
    g.translate(u, (y0 + y1) / 2, v);
    out(g, m);
  }
  /** Extruded plan polygon [[u, v], ...] from y0 up to y1. */
  function poly(m, ring, y0, y1) {
    const shape = new THREE.Shape(ring.map(([u, v]) => new THREE.Vector2(u, -v)));
    const g = new THREE.ExtrudeGeometry(shape, { depth: y1 - y0, bevelEnabled: false, steps: 1 });
    g.rotateX(-Math.PI / 2); g.translate(0, y0, 0);
    out(g, m);
  }
  /** Lathe solid of revolution: profile [[radius, y], ...] about the vertical axis at (u, v). */
  function lathe(m, u, v, profile, n = seg(24, 10)) {
    const g = new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), n);
    g.translate(u, 0, v);
    out(g, m);
  }
  /**
   * Two-slope roof: a triangular prism whose ridge runs along local v when `ang` is 0
   * (along u when ang = PI/2). `w` is the span across the ridge, `len` along it.
   */
  function gable(m, u, v, y0, ridgeH, w, len, ang = 0) {
    const shape = new THREE.Shape([new THREE.Vector2(-w / 2, 0), new THREE.Vector2(w / 2, 0), new THREE.Vector2(0, ridgeH)]);
    const g = new THREE.ExtrudeGeometry(shape, { depth: len, bevelEnabled: false, steps: 1 });
    g.translate(0, 0, -len / 2);
    if (ang) g.rotateY(ang);
    g.translate(u, y0, v);
    out(g, m);
  }
  /** Merlons (battlement teeth) along a straight run from (u0, v0) to (u1, v1); parapet base at y0. */
  function merlons(m, u0, v0, u1, v1, y0, { thick = 0.7, h = 0.95, mw = 1.1, gap = 0.9 } = {}) {
    const dx = u1 - u0, dz = v1 - v0, len = Math.hypot(dx, dz);
    if (len < mw) return;
    const n = Math.max(1, Math.round((len + gap) / (mw + gap))), pitch = len / n;
    const ang = -Math.atan2(dz, dx);
    for (let i = 0; i < n; i++) {
      const t = (i * pitch + mw / 2 + (pitch - mw - gap) / 2) / len;
      box(m, u0 + dx * t, y0, v0 + dz * t, mw, h, thick, ang);
    }
  }
  /** Merlons around a round tower of outer radius r. */
  function merlonRing(m, u, v, y0, r, { count = seg(14, 10), thick = 0.7, h = 0.95, mw = 1.15 } = {}) {
    for (let i = 0; i < count; i++) {
      const a = (i + 0.5) * Math.PI * 2 / count;
      box(m, u + Math.cos(a) * (r - thick / 2), y0, v + Math.sin(a) * (r - thick / 2), mw, h, thick, -a + Math.PI / 2);
    }
  }
  /** Small pointed pinnacle: a square shaft with a stone cone. */
  function pinnacle(m, u, v, y0, h, r = 0.35) {
    box(m, u, y0, v, r * 1.6, h * 0.35, r * 1.6);
    cone(m, u, v, y0 + h * 0.35, y0 + h, r * 1.15, 4);
  }
  /**
   * A window on a wall: cream limestone surround plus a dark pane. (cu, cv) is the
   * window centre on the wall face, `ang` the outward normal's plan angle measured
   * so that 0 faces +v (south when unrotated) and PI/2 faces +u.
   */
  function win(u, v, y0, ang, w = 1.1, h = 1.9, { frame: fm = 'trim', glass = 'glass', out: o = 0.08, pane = 0.12 } = {}) {
    const nx = Math.sin(ang), nz = Math.cos(ang);
    const bx = u + nx * o, bz = v + nz * o;
    const g1 = new THREE.BoxGeometry(w + 0.36, h + 0.36, 0.16);
    g1.rotateY(ang); g1.translate(bx, y0 + h / 2, bz); out(g1, fm);
    const g2 = new THREE.BoxGeometry(w, h, 0.16);
    g2.rotateY(ang); g2.translate(u + nx * (o + pane), y0 + h / 2, v + nz * (o + pane)); out(g2, glass);
  }


  /** Flat triangles [[x,y,z]x3, ...]; winding is flipped so every face points outward (up / away from the axis). */
  function faces(m, tris, up = true, centre = null) {
    const pos = [];
    for (const [a, b, c] of tris) {
      const ab = new THREE.Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]), ac = new THREE.Vector3(c[0] - a[0], c[1] - a[1], c[2] - a[2]);
      const n = ab.clone().cross(ac);
      let flip = n.y < 0;
      if (!up && centre) {
        const mid = [(a[0] + b[0] + c[0]) / 3 - centre[0], (a[2] + b[2] + c[2]) / 3 - centre[2]];
        flip = n.x * mid[0] + n.z * mid[1] < 0;
      }
      pos.push(...a, ...(flip ? [c, b] : [b, c]).flat());
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.computeVertexNormals();
    out(g, m);
  }
  /** Hipped roof over the u0..u1 x v0..v1 plan, eaves at y0, ridge at y0 + rise (ridge along the longer side). */
  function hip(m, u0, u1, v0, v1, y0, rise) {
    const w = u1 - u0, d = v1 - v0, y1 = y0 + rise;
    const uc = (u0 + u1) / 2, vc = (v0 + v1) / 2, a = [u0, y0, v0], b = [u1, y0, v0], c = [u1, y0, v1], e = [u0, y0, v1];
    if (w >= d) {
      const r0 = [u0 + d / 2, y1, vc], r1 = [u1 - d / 2, y1, vc];
      faces(m, [[a, b, r1], [a, r1, r0], [e, c, r1], [e, r1, r0], [a, e, r0], [b, c, r1]]);
    } else {
      const r0 = [uc, y1, v0 + w / 2], r1 = [uc, y1, v1 - w / 2];
      faces(m, [[a, e, r1], [a, r1, r0], [b, c, r1], [b, r1, r0], [a, b, r0], [e, c, r1]]);
    }
  }
  /** Gable roof, ridge along `axis` ('u' or 'v'), with the two slopes only (end walls are built in stone by the caller). */
  function ridge(m, u0, u1, v0, v1, y0, rise, axis = 'u') {
    const y1 = y0 + rise, a = [u0, y0, v0], b = [u1, y0, v0], c = [u1, y0, v1], e = [u0, y0, v1];
    if (axis === 'u') {
      const vc = (v0 + v1) / 2, r0 = [u0, y1, vc], r1 = [u1, y1, vc];
      faces(m, [[a, b, r1], [a, r1, r0], [e, c, r1], [e, r1, r0]]);
    } else {
      const uc = (u0 + u1) / 2, r0 = [uc, y1, v0], r1 = [uc, y1, v1];
      faces(m, [[a, e, r1], [a, r1, r0], [b, c, r1], [b, r1, r0]]);
    }
  }
  /** Triangular gable wall (stone) standing on the u0..u1 side at plan v (axis 'u') or the v0..v1 side at plan u (axis 'v'). */
  function gableWall(m, at, lo, hi, y0, rise, axis = 'u', thick = 0.5) {
    const shape = new THREE.Shape([new THREE.Vector2(lo, 0), new THREE.Vector2(hi, 0), new THREE.Vector2((lo + hi) / 2, rise)]);
    const g = new THREE.ExtrudeGeometry(shape, { depth: thick, bevelEnabled: false, steps: 1 });
    g.translate(0, 0, -thick / 2);
    if (axis === 'v') { g.rotateY(-Math.PI / 2); g.translate(at, y0, 0); } else g.translate(0, y0, at);
    out(g, m);
  }
  /**
   * Crow-stepped gable coping: only the stepped edge in cream stone (the stone gable wall behind it is
   * a separate solid), centred on `c`, `width` across the base, `rise` to the apex.
   */
  function stepGable(m, at, c, y0, width, rise, steps, axis = 'u', thick = 0.7) {
    const dh = rise / steps, cw = Math.max(0.42, width * 0.045);
    for (let i = 0; i < steps; i++) {
      const w = width * (1 - i / steps) - 0.1;
      if (w <= cw * 2) { const top = width * 0 + 0; void top; break; }
      for (const side of [-1, 1]) {
        const x = c + side * (w / 2 - cw / 2);
        if (axis === 'u') box(m, x, y0 + i * dh, at, cw, dh + 0.02, thick); else box(m, at, y0 + i * dh, x, thick, dh + 0.02, cw);
      }
      // the tread capping each step
      const nextW = width * (1 - (i + 1) / steps) - 0.1;
      const tread = Math.max(cw, (w - Math.max(nextW, 0)) / 2 + 0.05);
      for (const side of [-1, 1]) {
        const x = c + side * (w / 2 - tread / 2);
        if (axis === 'u') box(m, x, y0 + (i + 1) * dh - 0.18, at, tread, 0.2, thick + 0.12); else box(m, at, y0 + (i + 1) * dh - 0.18, x, thick + 0.12, 0.2, tread);
      }
    }
  }
  /** Pointed (equilateral) Gothic arch: rectangle of height h1 (springing line) topped by a two-centred arch, w wide. */
  function archShape(w, h1) {
    const s = new THREE.Shape();
    s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(w / 2, h1);
    s.absarc(-w / 2, h1, w, 0, Math.PI / 3, false);
    s.absarc(w / 2, h1, w, 2 * Math.PI / 3, Math.PI, false);
    s.lineTo(-w / 2, 0);
    return s;
  }
  /** Flat dark arched opening (or frame) facing `ang`, front face at plan (u, v). */
  function arch(m, u, v, y0, w, h1, ang = 0, depth = 0.12) {
    const g = new THREE.ExtrudeGeometry(archShape(w, h1), { depth, bevelEnabled: false, steps: 1, curveSegments: near ? 8 : 3 });
    g.translate(0, 0, -depth);
    g.rotateY(ang); g.translate(u, y0, v);
    out(g, m);
  }
  /** Arch surround: two jambs and a pointed head `t` thick round a w-wide opening (no sill). */
  function archFrame(m, u, v, y0, w, h1, t = 0.35, ang = 0, depth = 0.3) {
    const n = near ? 8 : 3, ro = w + t, thO = Math.acos((w / 2) / ro), thI = Math.PI / 3;
    const outerRight = [], innerRight = [];
    for (let i = 0; i <= n; i++) {
      const a = thO * i / n, b = thI * i / n;
      outerRight.push([-w / 2 + ro * Math.cos(a), h1 + ro * Math.sin(a)]);
      innerRight.push([-w / 2 + w * Math.cos(b), h1 + w * Math.sin(b)]);
    }
    const mirror = ([x, y]) => [-x, y];
    const pts = [
      [-w / 2 - t, 0],
      ...outerRight.map(mirror), // left end -> apex
      ...outerRight.slice().reverse().slice(1), // apex -> right end
      [w / 2 + t, 0], [w / 2, 0], [w / 2, h1],
      ...innerRight.slice(1), // up the inner right arc to the apex
      ...innerRight.map(mirror).reverse().slice(1), // and down the inner left arc
      [-w / 2, 0],
    ];
    const shape = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
    const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, steps: 1 });
    g.translate(0, 0, -depth);
    g.rotateY(ang); g.translate(u, y0, v);
    out(g, m);
  }

  return { frame, seg, out, faces, box, cyl, cone, pyramid, poly, lathe, gable, hip, ridge, gableWall, stepGable, arch, archFrame, merlons, merlonRing, pinnacle, win, near };
}
