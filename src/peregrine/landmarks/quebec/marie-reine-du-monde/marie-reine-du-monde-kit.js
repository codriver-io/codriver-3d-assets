import * as THREE from 'three';

// Small modelling kit for the Cathédrale Marie-Reine-du-Monde. Everything is authored in building axes
// (x across the church, to the right of someone facing the façade; y up; z along the nave toward the façade; origin on the
// dome axis) and rotated once, then moved to the dome axis in model metres, when a piece is handed to the asset builder.
//
// A "wall frame" is a local (s, y, d) system standing on one wall: s runs left to right seen from outside, d is the
// distance outward from the wall's base plane. Faces are built with correct outward winding (materials are single-sided).

const UP = new THREE.Vector3(0, 1, 0);
const FACE = { x: 0, X: 1, y: 2, Y: 3, z: 4, Z: 5 }; // BoxGeometry face order: +x, -x, +y, -y, +z, -z (6 indices each)

/** Rebuild a geometry with only its referenced vertices (and flat attributes the builder needs). */
function compact(g) {
  const index = g.index.array, pos = g.attributes.position.array, nor = g.attributes.normal.array, map = new Map(), P = [], N = [], I = [];
  for (const i of index) {
    let j = map.get(i);
    if (j === undefined) { j = P.length / 3; map.set(i, j); P.push(pos[3 * i], pos[3 * i + 1], pos[3 * i + 2]); N.push(nor[3 * i], nor[3 * i + 1], nor[3 * i + 2]); }
    I.push(j);
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); out.setAttribute('normal', new THREE.Float32BufferAttribute(N, 3)); out.setIndex(I);
  return out;
}

/** Drop zero-area triangles (lathe poles, collinear cap vertices): they carry NaN normals and cost bytes. */
function prune(g) {
  if (!g.index) g.setIndex(Array.from({ length: g.attributes.position.count }, (_, i) => i));
  const p = g.attributes.position, src = g.index.array, keep = [], a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  for (let i = 0; i < src.length; i += 3) {
    a.fromBufferAttribute(p, src[i]); b.fromBufferAttribute(p, src[i + 1]); c.fromBufferAttribute(p, src[i + 2]);
    if (b.sub(a).cross(c.sub(a)).length() > 1e-4) keep.push(src[i], src[i + 1], src[i + 2]);
  }
  if (keep.length === src.length) return g;
  g.setIndex(keep);
  return compact(g);
}

function boxGeometry(w, h, d, drop) {
  const g = new THREE.BoxGeometry(w, h, d);
  if (!drop) return g;
  const keep = [], src = g.index.array;
  for (let f = 0; f < 6; f++) if (![...drop].some((c) => FACE[c] === f)) for (let i = 0; i < 6; i++) keep.push(src[f * 6 + i]);
  g.setIndex(keep);
  return compact(g);
}

function insidePoly(pts, x, z) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [ax, az] = pts[j], [bx, bz] = pts[i];
    if ((az > z) !== (bz > z) && x < ((bx - ax) * (z - az)) / (bz - az) + ax) inside = !inside;
  }
  return inside;
}

export function makeKit(b, spec, near) {
  const th = THREE.MathUtils.degToRad(spec.rotationDeg);
  const R = new THREE.Matrix4().makeRotationY(th).premultiply(new THREE.Matrix4().makeTranslation(spec.axisM[0], 0, spec.axisM[1]));
  const put = (geometry, material, matrix) => { if (matrix) geometry.applyMatrix4(matrix); geometry.applyMatrix4(R); b.put(prune(geometry), material); };

  /** Axis-aligned box from min/max in building axes; `drop` lists faces to leave out (x X y Y z Z = +x -x top bottom +z -z). */
  const box = (mat, x0, x1, y0, y1, z0, z1, drop = '') => {
    put(boxGeometry(x1 - x0, y1 - y0, z1 - z0, drop).translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2), mat);
  };

  /** Flat-shaded solid from triangles ([a, b, c] points); every triangle is turned to face away from the interior point. */
  function solid(mat, tris, interior, matrix) {
    const pos = [], it = new THREE.Vector3(...interior), a = new THREE.Vector3(), c = new THREE.Vector3(), n = new THREE.Vector3(), m = new THREE.Vector3();
    for (const t of tris) {
      const [p, q, r] = t.map((v) => new THREE.Vector3(...v));
      n.crossVectors(a.subVectors(q, p), c.subVectors(r, p));
      m.copy(p).add(q).add(r).divideScalar(3).sub(it);
      if (n.dot(m) < 0) pos.push(...p.toArray(), ...r.toArray(), ...q.toArray()); else pos.push(...p.toArray(), ...q.toArray(), ...r.toArray());
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.computeVertexNormals();
    put(g, mat, matrix);
  }

  /** Vertical extrusion of a (x, z) polygon from y0 to y1: outward walls plus a top (no bottom: it stands on the ground or on another solid). */
  function extrudePoly(mat, pts, y0, y1, { top = true, bottom = false } = {}) {
    const pos = [], n = pts.length;
    const tri = (p, q, r, out) => {
      const nn = new THREE.Vector3().crossVectors(new THREE.Vector3().subVectors(q, p), new THREE.Vector3().subVectors(r, p));
      if (nn.dot(out) < 0) pos.push(...p.toArray(), ...r.toArray(), ...q.toArray()); else pos.push(...p.toArray(), ...q.toArray(), ...r.toArray());
    };
    for (let i = 0; i < n; i++) {
      const [ax, az] = pts[i], [bx, bz] = pts[(i + 1) % n], ex = bx - ax, ez = bz - az, len = Math.hypot(ex, ez);
      if (len < 1e-6) continue;
      let nx = ez / len, nz = -ex / len;
      if (insidePoly(pts, (ax + bx) / 2 + nx * 0.02, (az + bz) / 2 + nz * 0.02)) { nx = -nx; nz = -nz; }
      const out = new THREE.Vector3(nx, 0, nz), A0 = new THREE.Vector3(ax, y0, az), B0 = new THREE.Vector3(bx, y0, bz), A1 = new THREE.Vector3(ax, y1, az), B1 = new THREE.Vector3(bx, y1, bz);
      tri(A0, B0, B1, out); tri(A0, B1, A1, out);
    }
    if (top || bottom) {
      const contour = pts.map(([x, z]) => new THREE.Vector2(x, z)), idx = THREE.ShapeUtils.triangulateShape(contour, []);
      for (const [i, j, k] of idx) {
        if (top) tri(new THREE.Vector3(pts[i][0], y1, pts[i][1]), new THREE.Vector3(pts[j][0], y1, pts[j][1]), new THREE.Vector3(pts[k][0], y1, pts[k][1]), new THREE.Vector3(0, 1, 0));
        if (bottom) tri(new THREE.Vector3(pts[i][0], y0, pts[i][1]), new THREE.Vector3(pts[j][0], y0, pts[j][1]), new THREE.Vector3(pts[k][0], y0, pts[k][1]), new THREE.Vector3(0, -1, 0));
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.computeVertexNormals();
    put(g, mat);
  }

  /** A projecting band around a closed (x, z) polygon: outer walls at offset `outer` (a polygon already offset outward), a top ring and an underside ring between y0 and y1. */
  function band(mat, inner, outer, y0, y1) {
    const pos = [], up = new THREE.Vector3(0, 1, 0), n = outer.length;
    const tri = (p, q, r, out) => {
      const nn = new THREE.Vector3().crossVectors(new THREE.Vector3().subVectors(q, p), new THREE.Vector3().subVectors(r, p));
      if (nn.dot(out) < 0) pos.push(...p.toArray(), ...r.toArray(), ...q.toArray()); else pos.push(...p.toArray(), ...q.toArray(), ...r.toArray());
    };
    for (let i = 0; i < n; i++) {
      const [ax, az] = outer[i], [bx, bz] = outer[(i + 1) % n], ex = bx - ax, ez = bz - az, len = Math.hypot(ex, ez);
      if (len < 1e-6) continue;
      let nx = ez / len, nz = -ex / len;
      if (insidePoly(outer, (ax + bx) / 2 + nx * 0.02, (az + bz) / 2 + nz * 0.02)) { nx = -nx; nz = -nz; }
      const out = new THREE.Vector3(nx, 0, nz), A0 = new THREE.Vector3(ax, y0, az), B0 = new THREE.Vector3(bx, y0, bz), A1 = new THREE.Vector3(ax, y1, az), B1 = new THREE.Vector3(bx, y1, bz);
      tri(A0, B0, B1, out); tri(A0, B1, A1, out);
    }
    const o = outer.map(([x, z]) => new THREE.Vector2(x, z)), h = inner.map(([x, z]) => new THREE.Vector2(x, z)), all = [...outer, ...inner];
    for (const [i, j, k2] of THREE.ShapeUtils.triangulateShape(o, [h])) {
      for (const [y, dir] of [[y1, up], [y0, new THREE.Vector3(0, -1, 0)]]) tri(new THREE.Vector3(all[i][0], y, all[i][1]), new THREE.Vector3(all[j][0], y, all[j][1]), new THREE.Vector3(all[k2][0], y, all[k2][1]), dir);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.computeVertexNormals();
    put(g, mat);
  }

  /** Regular polygon prism / frustum around the vertical axis through (cx, cz); radius to the corners. `caps` is 't', 'b', 'tb' or ''. */
  function prism(mat, cx, cz, r, sides, y0, y1, phase = 0, rTop = r, caps = 't') {
    const g = new THREE.CylinderGeometry(rTop, r, y1 - y0, sides, 1, false), src = g.index.array, torso = sides * 6, topN = rTop > 0 ? sides * 3 : 0;
    const keep = [...src.slice(0, torso)];
    if (caps.includes('t') && topN) keep.push(...src.slice(torso, torso + topN));
    if (caps.includes('b') && r > 0) keep.push(...src.slice(torso + topN));
    g.setIndex(keep); g.rotateY(phase); g.translate(cx, (y0 + y1) / 2, cz);
    put(compact(g), mat);
  }

  /** Surface of revolution through (radius, y) points ordered bottom to top, about the vertical axis through (cx, cz). */
  function lathe(mat, cx, cz, profile, segments, phase = 0) {
    const g = new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), segments, phase);
    g.translate(cx, 0, cz);
    put(g, mat);
  }

  /** Thin bar between two points (square section). */
  function bar(mat, a, c, w, d = w) {
    const av = new THREE.Vector3(...a), cv = new THREE.Vector3(...c), dir = cv.clone().sub(av), len = dir.length();
    if (len < 1e-5) return;
    const g = new THREE.BoxGeometry(w, len, d);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(UP, dir.normalize()));
    g.translate(...av.add(cv).multiplyScalar(0.5).toArray());
    put(g, mat);
  }

  /** A frame standing on a wall: base plane through (x0, z0) facing outward at angle phi (0 = +x, pi/2 = +z). */
  function frame(x0, z0, phi) {
    const c = Math.cos(phi), s = Math.sin(phi);
    const M = new THREE.Matrix4().makeBasis(new THREE.Vector3(s, 0, -c), UP, new THREE.Vector3(c, 0, s)).setPosition(x0, 0, z0);
    return {
      M,
      /** box between s0..s1, y0..y1, d0..d1 (faces in frame axes: x = +s, y = up, z = outward) */
      box(mat, s0, s1, y0, y1, d0, d1, drop = '') {
        put(boxGeometry(s1 - s0, y1 - y0, d1 - d0, drop).translate((s0 + s1) / 2, (y0 + y1) / 2, (d0 + d1) / 2), mat, M);
      },
      /** vertical panel facing outward at depth d */
      quad(mat, s0, s1, y0, y1, d) {
        put(new THREE.PlaneGeometry(s1 - s0, y1 - y0).translate((s0 + s1) / 2, (y0 + y1) / 2, d), mat, M);
      },
      /** round-headed opening panel: centre s, width w, total height h, bottom y0 */
      arch(mat, s, y0, w, h, d, n = near ? 5 : 3) {
        const r = w / 2, spring = y0 + h - r, pts = [new THREE.Vector2(s - r, y0), new THREE.Vector2(s + r, y0), new THREE.Vector2(s + r, spring)];
        for (let i = 1; i < n; i++) { const a = (i * Math.PI) / n; pts.push(new THREE.Vector2(s + r * Math.cos(a), spring + r * Math.sin(a))); }
        pts.push(new THREE.Vector2(s - r, spring));
        put(new THREE.ShapeGeometry(new THREE.Shape(pts)).translate(0, 0, d), mat, M);
      },
      /** vertical cylinder at (s, d) from y0 to y1 */
      col(mat, s, d, y0, y1, r, rTop = r, sides = near ? 10 : 6) {
        const g = new THREE.CylinderGeometry(rTop, r, y1 - y0, sides, 1, true).translate(s, (y0 + y1) / 2, d);
        put(g, mat, M);
      },
      /** triangular pediment prism: base y, apex y+rise, between s0..s1, d0..d1 */
      pediment(mat, s0, s1, y, rise, d0, d1) {
        const mid = (s0 + s1) / 2, p = (s, yy, d) => [s, yy, d];
        const A = [p(s0, y, d0), p(s1, y, d0), p(mid, y + rise, d0)], B = [p(s0, y, d1), p(s1, y, d1), p(mid, y + rise, d1)];
        const tris = [[A[0], A[2], A[1]], [B[0], B[1], B[2]], [A[0], B[0], B[2]], [A[0], B[2], A[2]], [A[1], A[2], B[2]], [A[1], B[2], B[1]], [A[0], A[1], B[1]], [A[0], B[1], B[0]]];
        solid(mat, tris, [mid, y + rise / 3, (d0 + d1) / 2], M);
      },
    };
  }

  /** A saint on a plinth, standing at (x, z) on height y: a stone plinth, one tapered six-sided robe and a head (near, about 48 triangles); a four-sided taper far. */
  function statue(x, y, z, { scale = 1 } = {}) {
    const ph = 0.9 * scale, w = 1.1 * scale;
    if (near) {
      box('stone', x - w / 2, x + w / 2, y, y + ph, z - w / 2, z + w / 2, 'Y');
      prism('bronze', x, z, 0.48 * scale, 6, y + ph, y + ph + 2.4 * scale, 0, 0.2 * scale, 't');
      put(new THREE.IcosahedronGeometry(0.3 * scale, 0).translate(x, y + ph + 2.6 * scale, z), 'bronze');
    } else {
      lathe('bronze', x, z, [[0.55 * scale, y], [0.42 * scale, y + ph + 0.9 * scale], [0.18 * scale, y + ph + 2.2 * scale], [0, y + ph + 2.9 * scale]], 4);
    }
  }

  return { put, box, solid, extrudePoly, band, prism, lathe, bar, frame, statue, near };
}
