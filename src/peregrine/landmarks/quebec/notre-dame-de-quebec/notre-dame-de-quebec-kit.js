import * as THREE from 'three';

// Small modelling kit for the Notre-Dame de Québec model. Authoring frame (before the final 1.3 deg turn onto the mapped nave axis):
// x = u (east, along the nave from the west front to the apse), y up, z = w (south). Everything is added to one assetBuilder `b`, which
// merges by material. Wall faces are named by their outward direction: W (-u, the Place de l'Hôtel-de-Ville front), E (+u), N (-w), S (+w).

const FACE = { W: { th: -Math.PI / 2, n: [-1, 0] }, E: { th: Math.PI / 2, n: [1, 0] }, N: { th: Math.PI, n: [0, -1] }, S: { th: 0, n: [0, 1] } };

/** Closed solid from planar convex faces; every face is wound so its normal points away from `inside`. */
export function solidFromFaces(faces, inside) {
  const out = [];
  for (const f of faces) {
    for (let i = 1; i < f.length - 1; i++) {
      let a = f[0], c = f[i], d = f[i + 1];
      const n = [(c[1] - a[1]) * (d[2] - a[2]) - (c[2] - a[2]) * (d[1] - a[1]), (c[2] - a[2]) * (d[0] - a[0]) - (c[0] - a[0]) * (d[2] - a[2]), (c[0] - a[0]) * (d[1] - a[1]) - (c[1] - a[1]) * (d[0] - a[0])];
      const m = [(a[0] + c[0] + d[0]) / 3 - inside[0], (a[1] + c[1] + d[1]) / 3 - inside[1], (a[2] + c[2] + d[2]) / 3 - inside[2]];
      if (n[0] * n[0] + n[1] * n[1] + n[2] * n[2] < 1e-10) continue; // a collapsed apex or edge: no sliver
      if (n[0] * m[0] + n[1] * m[1] + n[2] * m[2] < 0) [c, d] = [d, c];
      out.push(...a, ...c, ...d);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(out, 3));
  g.computeVertexNormals();
  return g;
}

/** Round-headed outline in a wall-local frame (x along the wall, y up): bottom at yb, springing at `spring`, half-width w / 2. */
export function archOutline(cx, yb, w, spring, n = 6) {
  const r = w / 2, pts = [[cx - r, yb], [cx + r, yb], [cx + r, spring]];
  for (let i = 1; i < n; i++) { const a = (i * Math.PI) / n; pts.push([cx + r * Math.cos(a), spring + r * Math.sin(a)]); }
  pts.push([cx - r, spring]);
  return pts;
}

const shapeOf = (pts) => new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));

/** Flat-shaded octagonal (or n-sided) prism / frustum around the Y axis, faces aligned on the axes when n = 8. */
export function facetedFrustum(rTop, rBottom, y0, y1, cx, cz, n = 8, open = true) {
  const g = new THREE.CylinderGeometry(rTop, rBottom, y1 - y0, n, 1, open).toNonIndexed();
  g.rotateY(Math.PI / n); g.translate(cx, (y0 + y1) / 2, cz); g.computeVertexNormals();
  return g;
}

/** Flat-shaded surface of revolution, `profile` = [[radius, y], ...] from the bottom up; n sides (8 gives an octagonal belfry). */
export function facetedLathe(profile, cx, cz, n = 8) {
  const g = new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), n).toNonIndexed();
  g.rotateY(Math.PI / n); g.translate(cx, 0, cz); g.computeVertexNormals();
  return g;
}

export function makeKit(b, near) {
  const put = (g, m) => b.put(g, m, 0, 0);
  /** Axis-aligned box from extents. */
  const box = (m, u0, u1, y0, y1, w0, w1) => b.box(m, [(u0 + u1) / 2, (y0 + y1) / 2, (w0 + w1) / 2], [u1 - u0, y1 - y0, w1 - w0], 0, 0, 0);
  /** Solid from faces, oriented away from `inside`. */
  const solid = (m, faces, inside) => put(solidFromFaces(faces, inside), m);
  /** Extruded polygon [[u, w], ...] between two heights. */
  const prism = (m, ring, y0, y1) => {
    const g = new THREE.ExtrudeGeometry(new THREE.Shape(ring.map(([u, w]) => new THREE.Vector2(u, -w))), { depth: y1 - y0, bevelEnabled: false });
    g.rotateX(-Math.PI / 2); g.translate(0, y0, 0); put(g, m);
  };
  /** Place a wall-local flat piece (centred at x = 0, built with absolute y) on a face: p = the wall plane (u for W/E, w for N/S), a = along-wall centre, d = proud. */
  const onFace = (g, face, p, a, d = 0) => {
    const f = FACE[face]; g.rotateY(f.th);
    if (face === 'W' || face === 'E') g.translate(p + f.n[0] * d, 0, a); else g.translate(a, 0, p + f.n[1] * d);
    return g;
  };
  /** Same for the eight faces of an octagonal drum (k = 0 faces +w, 2 faces +u, 4 faces -w, 6 faces -u); apothem from the drum axis (cx, cz). */
  const onOct = (g, k, cx, cz, apothem, d = 0) => {
    const th = (k * Math.PI) / 4; g.rotateY(th);
    g.translate(cx + Math.sin(th) * (apothem + d), 0, cz + Math.cos(th) * (apothem + d)); return g;
  };
  /** A round-headed (or flat-headed) opening: dark glass panel plus a stone surround that tiles exactly around it (no overlap). */
  const openingGeoms = (a, y0, w, h, { arch = true, ring = 0.35, sill = 0.22 } = {}) => {
    const r = w / 2, n = near ? 6 : 3, spring = arch ? y0 + h - r : y0 + h;
    const inner = arch ? archOutline(a, y0, w, spring, n) : [[a - r, y0], [a + r, y0], [a + r, y0 + h], [a - r, y0 + h]];
    const glass = new THREE.ShapeGeometry(shapeOf(inner));
    let trim = null;
    if (near && ring > 0) {
      const R = r + ring, outer = arch ? archOutline(a, y0 - sill, w + 2 * ring, spring, n) : [[a - R, y0 - sill], [a + R, y0 - sill], [a + R, y0 + h + ring], [a - R, y0 + h + ring]];
      const s = shapeOf(outer); s.holes.push(new THREE.Path(inner.map(([x, y]) => new THREE.Vector2(x, y))));
      trim = new THREE.ShapeGeometry(s);
    }
    return { glass, trim };
  };
  /** A U-shaped stone band (blind arch recess outline): outer width w + 2t, legs from y0 up to the springing, round head. */
  const archBand = (face, p, a, y0, w, spring, t, { d = 0.07, mat = 'trim' } = {}) => {
    const r = w / 2, R = r + t, n = near ? 8 : 4, pts = [[-R, y0], [-R, spring]];
    for (let i = 1; i < n; i++) { const th = Math.PI - (i * Math.PI) / n; pts.push([R * Math.cos(th), spring + R * Math.sin(th)]); }
    pts.push([R, spring], [R, y0], [r, y0], [r, spring]);
    for (let i = n - 1; i >= 1; i--) { const th = Math.PI - (i * Math.PI) / n; pts.push([r * Math.cos(th), spring + r * Math.sin(th)]); }
    pts.push([-r, spring], [-r, y0]);
    put(onFace(new THREE.ShapeGeometry(shapeOf(pts)), face, p, a, d), mat);
  };
  const opening = (face, p, a, y0, w, h, o = {}) => {
    const { mat = 'glass', ringMat = 'trim', d = 0.07, ring = 0.35, arch = true, relief = true } = o, { glass, trim } = openingGeoms(0, y0, w, h, o);
    put(onFace(glass, face, p, a, d), mat); if (trim) put(onFace(trim, face, p, a, d), ringMat);
    if (near && relief && ring >= 0.28) { // a projecting sill and, over a round head, a keystone
      const sw = w + 2 * ring + 0.3, sill = new THREE.BoxGeometry(sw, 0.2, 0.35); sill.translate(0, y0 - 0.22 + 0.1, 0.125); put(onFace(sill, face, p, a, 0), ringMat);
      if (arch) { const key = new THREE.BoxGeometry(0.4, ring + 0.45, 0.3); key.translate(0, y0 + h + (ring - 0.45) / 2 - 0.02, 0.1); put(onFace(key, face, p, a, 0), ringMat); }
    }
  };
  /** A flat quad on a face (wall-local width x height, centred at `a` along the wall, bottom at y0). */
  const quad = (face, p, a, y0, wd, ht, mat, d = 0.06) => {
    const g = new THREE.PlaneGeometry(wd, ht); g.translate(0, y0 + ht / 2, 0); put(onFace(g, face, p, a, d), mat);
  };
  const openingOct = (k, cx, cz, apothem, y0, w, h, o = {}) => {
    const { mat = 'glass', ringMat = 'trim', d = 0.07 } = o, { glass, trim } = openingGeoms(0, y0, w, h, o);
    put(onOct(glass, k, cx, cz, apothem, d), mat); if (trim) put(onOct(trim, k, cx, cz, apothem, d), ringMat);
  };
  /** A flat disc (oculus) on a face. */
  const disc = (face, p, a, y, r, mat = 'glass', d = 0.07) => {
    const g = new THREE.CircleGeometry(r, near ? 14 : 8); g.translate(0, y, 0); put(onFace(g, face, p, a, d), mat);
  };
  const discRing = (face, p, a, y, r, t, mat = 'trim', d = 0.07) => {
    const g = new THREE.RingGeometry(r, r + t, near ? 14 : 8); g.translate(0, y, 0); put(onFace(g, face, p, a, d), mat);
  };
  /** Gable roof solid over u0..u1 x w0..w1 (ridge along `axis`), eave y, ridge y + rise, `over` of eave overhang, base sunk `drop`. */
  const gable = (m, axis, u0, u1, w0, w1, y, rise, over = 0.35, drop = 0.3) => {
    const ye = y - drop, yt = y + rise;
    if (axis === 'u') {
      const W0 = w0 - over, W1 = w1 + over, cw = (w0 + w1) / 2;
      const A = [u0, ye, W0], B = [u1, ye, W0], C = [u1, ye, W1], D = [u0, ye, W1], R1 = [u0, yt, cw], R2 = [u1, yt, cw];
      solid(m, [[A, B, C, D], [A, B, R2, R1], [D, C, R2, R1], [A, D, R1], [B, C, R2]], [(u0 + u1) / 2, (ye + yt) / 2, cw]);
    } else {
      const U0 = u0 - over, U1 = u1 + over, cu = (u0 + u1) / 2;
      const A = [U0, ye, w0], B = [U0, ye, w1], C = [U1, ye, w1], D = [U1, ye, w0], R1 = [cu, yt, w0], R2 = [cu, yt, w1];
      solid(m, [[A, B, C, D], [A, B, R2, R1], [D, C, R2, R1], [A, D, R1], [B, C, R2]], [cu, (ye + yt) / 2, (w0 + w1) / 2]);
    }
  };
  /** Hipped roof over a rectangle, eave at y (after `over`), ridge/apex `rise` higher; `top` > 0 keeps a flat top of that half-size. */
  const hip = (m, u0, u1, w0, w1, y, rise, over = 0.3, drop = 0.3, top = 0) => {
    const U0 = u0 - over, U1 = u1 + over, W0 = w0 - over, W1 = w1 + over, ye = y - drop, yt = y + rise, cu = (U0 + U1) / 2, cw = (W0 + W1) / 2;
    const E = [[U0, ye, W0], [U1, ye, W0], [U1, ye, W1], [U0, ye, W1]], long = U1 - U0 >= W1 - W0, mm = Math.min(U1 - U0, W1 - W0) / 2 - top;
    const T = long ? [[U0 + mm, yt, cw - top], [U1 - mm, yt, cw - top], [U1 - mm, yt, cw + top], [U0 + mm, yt, cw + top]] : [[cu - top, yt, W0 + mm], [cu + top, yt, W0 + mm], [cu + top, yt, W1 - mm], [cu - top, yt, W1 - mm]];
    const faces = [[E[0], E[1], E[2], E[3]]];
    for (let i = 0; i < 4; i++) faces.push([E[i], E[(i + 1) % 4], T[(i + 1) % 4], T[i]]);
    if (top > 0) faces.push([T[0], T[1], T[2], T[3]]);
    solid(m, faces, [cu, (ye + yt) / 2, cw]);
  };
  return { b, near, put, box, solid, prism, onFace, onOct, opening, openingOct, archBand, quad, disc, discRing, gable, hip, openingGeoms };
}
