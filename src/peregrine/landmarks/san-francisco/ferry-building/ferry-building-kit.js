import * as THREE from 'three';

// Small modelling kit for the Ferry Building, all in the facade frame (u along the Embarcadero,
// v from the Market Street front to the bay, y up). Every helper feeds the shared assetBuilder, so
// everything merges by material name and nothing here creates a draw call. The far model folds
// minor materials into their neighbours (base -> stone; copper, metal and glass -> roof) so it
// stays at seven draws.
const FAR_MATERIAL = { base: 'stone', copper: 'roof', metal: 'roof', glass: 'roof' };

export function ferryKit(b, near) {
  const mat = (m) => (near ? m : FAR_MATERIAL[m] || m);
  const seg = (n, f = 0.5) => (near ? n : Math.max(3, Math.round(n * f)));
  const put = (g, m) => b.put(g, mat(m));
  const ok = (...pairs) => pairs.every(([lo, hi]) => hi - lo > 1e-4);

  const box = (m, u0, u1, y0, y1, v0, v1) => {
    if (!ok([u0, u1], [y0, y1], [v0, v1])) return;
    b.box(mat(m), [(u0 + u1) / 2, (y0 + y1) / 2, (v0 + v1) / 2], [u1 - u0, y1 - y0, v1 - v0]);
  };

  // Keep the triangles of any geometry whose face normal passes keep(n); degenerate ones go, normals are flat.
  function keepFaces(g, keep) {
    const src = g.index ? g.toNonIndexed() : g;
    const p = src.attributes.position, out = [];
    const a = new THREE.Vector3(), c = new THREE.Vector3(), d = new THREE.Vector3(), n = new THREE.Vector3(), e = new THREE.Vector3();
    for (let i = 0; i + 2 < p.count; i += 3) {
      a.fromBufferAttribute(p, i); c.fromBufferAttribute(p, i + 1); d.fromBufferAttribute(p, i + 2);
      n.subVectors(c, a).cross(e.subVectors(d, a));
      if (n.lengthSq() < 1e-10) continue;
      n.normalize();
      if (keep(n)) out.push(a.x, a.y, a.z, c.x, c.y, c.z, d.x, d.y, d.z);
    }
    const r = new THREE.BufferGeometry();
    r.setAttribute('position', new THREE.Float32BufferAttribute(out, 3));
    r.computeVertexNormals();
    return r;
  }

  // Outline of a rectangular or round-headed opening in (a, y); a is u on a wall along u, v on a wall along v.
  // arch: the head is half an ellipse (a0..a1 wide, `rise` high, default a semicircle) ending at y1.
  function opening(h, n) {
    if (!h.arch) return [[h.a0, h.y0], [h.a1, h.y0], [h.a1, h.y1], [h.a0, h.y1]];
    const r = (h.a1 - h.a0) / 2, ca = (h.a0 + h.a1) / 2, rise = h.rise ?? r, spring = h.y1 - rise;
    const pts = [[h.a0, h.y0], [h.a1, h.y0], [h.a1, spring]];
    for (let i = 1; i < n; i++) { const t = (i / n) * Math.PI; pts.push([ca + r * Math.cos(t), spring + rise * Math.sin(t)]); }
    pts.push([h.a0, spring]);
    return pts;
  }

  // Map geometry authored as (x_s = a * sx, y, z_s = depth) into the facade frame. plane 'u': a is u, depth runs along +v.
  // plane 'v': a is v (x_s = -v), depth runs along +u (rotateY(90 deg): u = z_s, v = -x_s).
  function place(g, plane, depthPos) {
    if (plane === 'v') g.rotateY(Math.PI / 2);
    if (plane === 'u') g.translate(0, 0, depthPos); else g.translate(depthPos, 0, 0);
    return g;
  }
  const sxOf = (plane) => (plane === 'u' ? 1 : -1);

  /**
   * A wall slab with openings punched through, `t` thick. The outward face sits at `face` (v for plane 'u', u for plane
   * 'v'); facing -1 looks toward -v / -u, +1 toward +v / +u and the slab extends the other way. The hidden back cap is
   * dropped. `outline` ([[a, y], ...]) replaces the plain rectangle (stepped gables).
   */
  function slab(m, plane, a0, a1, y0, y1, face, t, holes, facing, arcN, outline) {
    const sx = sxOf(plane);
    const pts = outline || [[a0, y0], [a1, y0], [a1, y1], [a0, y1]];
    const shape = new THREE.Shape(pts.map(([a, y]) => new THREE.Vector2(sx * a, y)));
    for (const h of holes) shape.holes.push(new THREE.Path(opening(h, arcN).map(([a, y]) => new THREE.Vector2(sx * a, y))));
    let g = new THREE.ExtrudeGeometry(shape, { depth: t, bevelEnabled: false, curveSegments: 1 });
    g = keepFaces(g, (n) => (facing < 0 ? n.z < 0.9 : n.z > -0.9));
    put(place(g, plane, facing < 0 ? face : face - t), m);
  }

  // A flat infill filling one opening at depth position `pos`, facing outward like the wall that holds it.
  function pane(m, plane, h, pos, facing, arcN) {
    const sx = sxOf(plane);
    const g = new THREE.ShapeGeometry(new THREE.Shape(opening(h, arcN).map(([a, y]) => new THREE.Vector2(sx * a, y))), 1);
    if (facing < 0) { // ShapeGeometry faces +z_s: flip it toward -z_s
      const ix = g.index.array;
      for (let i = 0; i < ix.length; i += 3) { const k = ix[i + 1]; ix[i + 1] = ix[i + 2]; ix[i + 2] = k; }
      g.computeVertexNormals();
    }
    put(place(g, plane, pos), m);
  }

  // Axis-aligned box on a wall: a0..a1 along the wall, d0..d1 across it.
  const wallBox = (m, plane, a0, a1, y0, y1, d0, d1) => (plane === 'u' ? box(m, a0, a1, y0, y1, d0, d1) : box(m, d0, d1, y0, y1, a0, a1));

  // A flat quad on a wall (single-sided, facing outward): mullions, clock marks and the like at 2 triangles each.
  function wallQuad(m, plane, a0, a1, y0, y1, pos, facing) {
    const sx = sxOf(plane);
    const g = new THREE.PlaneGeometry(a1 - a0, y1 - y0);
    g.translate(sx * (a0 + a1) / 2, (y0 + y1) / 2, 0);
    if (facing < 0) {
      const ix = g.index.array;
      for (let i = 0; i < ix.length; i += 3) { const k = ix[i + 1]; ix[i + 1] = ix[i + 2]; ix[i + 2] = k; }
      g.computeVertexNormals();
    }
    put(place(g, plane, pos), m);
  }

  /**
   * A window set in a slab: the pane tucked 0.1 m inside the back of the reveal, and (near only) a centre mullion and a
   * transom as flat quads 0.05 m in front of it.
   */
  function windowSet(plane, face, t, facing, h, paneMat, arcN, bars = true) {
    const pos = facing < 0 ? face + t - 0.1 : face - t + 0.1;
    pane(paneMat, plane, h, pos, facing, arcN);
    if (!near || !bars) return;
    const q = facing < 0 ? pos - 0.05 : pos + 0.05;
    const ca = (h.a0 + h.a1) / 2, rise = h.arch ? (h.rise ?? (h.a1 - h.a0) / 2) : 0;
    const top = h.y1, spring = h.arch ? h.y1 - rise : (h.y0 + h.y1) / 2;
    wallQuad('metal', plane, ca - 0.06, ca + 0.06, h.y0, top - 0.04, q, facing);
    wallQuad('metal', plane, h.a0 + 0.04, h.a1 - 0.04, spring - 0.06, spring + 0.06, q, facing);
  }

  // A prism over a profile [[v, y], ...] running along u from u0 to u1: no end caps, no floor.
  function prismU(m, pts, u0, u1) {
    const shape = new THREE.Shape(pts.map(([v, y]) => new THREE.Vector2(-v, y)));
    let g = new THREE.ExtrudeGeometry(shape, { depth: u1 - u0, bevelEnabled: false, curveSegments: 1 });
    g.rotateY(Math.PI / 2); g.translate(u0, 0, 0);
    g = keepFaces(g, (n) => Math.abs(n.x) < 0.9 && n.y > -0.9);
    put(g, m);
  }

  // Solid of revolution about the vertical axis through (u, v); profile [[r, y], ...] from the bottom up.
  function lathe(m, profile, u, v, n) {
    const g = new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), seg(n, 0.5));
    g.translate(u, 0, v); put(g, m);
  }
  // Cylinder (or cone) between y0 and y1; open ends when something else closes them.
  function cyl(m, u, v, r0, r1, y0, y1, n, open = false) {
    const g = new THREE.CylinderGeometry(r1, r0, y1 - y0, seg(n, 0.6), 1, open);
    g.translate(u, (y0 + y1) / 2, v); put(g, m);
  }
  function ball(m, u, y, v, r) {
    const g = new THREE.IcosahedronGeometry(r, 0);
    g.translate(u, y, v); put(g, m);
  }

  // Put local geometries (authored facing +z, x to the viewer's right) on a face of the tower: dir '+v', '-v', '+u', '-u'.
  const FACE_ROT = { '+v': 0, '-v': Math.PI, '+u': Math.PI / 2, '-u': -Math.PI / 2 };
  function onFace(m, dir, centre, geometries) {
    for (const g of geometries) {
      g.rotateY(FACE_ROT[dir]); g.translate(...centre); put(g, m);
    }
  }

  return { mat, seg, put, box, keepFaces, opening, slab, pane, wallBox, wallQuad, windowSet, prismU, lathe, cyl, ball, onFace };
}
