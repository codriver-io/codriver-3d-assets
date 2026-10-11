import * as THREE from 'three';

// Small solid/quad kit for the Ghirardelli Square model. Everything is authored in a frame's local
// metres (u along the street grid, y up, v into the block: a right-handed copy of east/up/south that
// is rotated by the frame's angle) and emitted as INDEXED, face-normalled geometry into one
// accumulator per (frame, material). `flush()` hands each accumulator to assetBuilder.put once, so a
// thousand window quads cost one merged mesh per material, not a thousand objects.
//
// Every face is oriented outward automatically: solids pass their centre, wall quads pass the wall's
// outward normal, so no winding has to be worked out by hand.
export function makeKit(b) {
  const bins = new Map();
  const vec = (p) => new THREE.Vector3(p[0], p[1], p[2]);

  function frame(theta, tag = '') {
    const bin = (mat) => {
      const key = `${tag}|${theta}|${mat}`;
      if (!bins.has(key)) bins.set(key, { theta, mat, pos: [], nor: [], idx: [] });
      return bins.get(key);
    };
    // A planar convex polygon (3..n vertices, in cyclic order). `hint` is either {centre} (the face
    // must point away from a solid's centre) or {normal} (it must point along a wall normal).
    function face(mat, verts, hint) {
      const v = [];
      for (const p of verts) { const last = v[v.length - 1]; if (!last || Math.hypot(p[0] - last[0], p[1] - last[1], p[2] - last[2]) > 1e-6) v.push(p); }
      if (v.length > 1) { const a = v[0], z = v[v.length - 1]; if (Math.hypot(a[0] - z[0], a[1] - z[1], a[2] - z[2]) < 1e-6) v.pop(); }
      if (v.length < 3) return;
      // Newell normal
      let nx = 0, ny = 0, nz = 0;
      for (let i = 0; i < v.length; i++) {
        const p = v[i], q = v[(i + 1) % v.length];
        nx += (p[1] - q[1]) * (p[2] + q[2]); ny += (p[2] - q[2]) * (p[0] + q[0]); nz += (p[0] - q[0]) * (p[1] + q[1]);
      }
      const len = Math.hypot(nx, ny, nz);
      if (len < 1e-9) return;
      nx /= len; ny /= len; nz /= len;
      let flip = false;
      if (hint.normal) flip = nx * hint.normal[0] + ny * hint.normal[1] + nz * hint.normal[2] < 0;
      else {
        const c = [0, 0, 0]; for (const p of v) { c[0] += p[0]; c[1] += p[1]; c[2] += p[2]; } c[0] /= v.length; c[1] /= v.length; c[2] /= v.length;
        flip = nx * (c[0] - hint.centre[0]) + ny * (c[1] - hint.centre[1]) + nz * (c[2] - hint.centre[2]) < 0;
      }
      if (flip) { nx = -nx; ny = -ny; nz = -nz; v.reverse(); }
      const t = bin(mat), base = t.pos.length / 3;
      for (const p of v) { t.pos.push(p[0], p[1], p[2]); t.nor.push(nx, ny, nz); }
      for (let i = 1; i < v.length - 1; i++) t.idx.push(base, base + i, base + i + 1);
    }

    // Axis-aligned (in the frame) box; `skip` lists faces to leave out ('bottom', 'top', 'N','S','E','W').
    function box(mat, u0, u1, y0, y1, v0, v1, skip = '') {
      const c = [(u0 + u1) / 2, (y0 + y1) / 2, (v0 + v1) / 2], h = { centre: c };
      const P = (u, y, v) => [u, y, v];
      if (!skip.includes('E')) face(mat, [P(u1, y0, v0), P(u1, y1, v0), P(u1, y1, v1), P(u1, y0, v1)], h);
      if (!skip.includes('W')) face(mat, [P(u0, y0, v0), P(u0, y1, v0), P(u0, y1, v1), P(u0, y0, v1)], h);
      if (!skip.includes('S')) face(mat, [P(u0, y0, v1), P(u1, y0, v1), P(u1, y1, v1), P(u0, y1, v1)], h);
      if (!skip.includes('N')) face(mat, [P(u0, y0, v0), P(u1, y0, v0), P(u1, y1, v0), P(u0, y1, v0)], h);
      if (!skip.includes('top')) face(mat, [P(u0, y1, v0), P(u1, y1, v0), P(u1, y1, v1), P(u0, y1, v1)], h);
      if (!skip.includes('bottom')) face(mat, [P(u0, y0, v0), P(u1, y0, v0), P(u1, y0, v1), P(u0, y0, v1)], h);
    }

    // Horizontal rectangle facing up.
    function deck(mat, u0, u1, v0, v1, y) {
      face(mat, [[u0, y, v0], [u1, y, v0], [u1, y, v1], [u0, y, v1]], { normal: [0, 1, 0] });
    }

    // Quad on a vertical wall: centre of its bottom edge at (cu, cv) already pushed off the wall,
    // outward unit normal n = [nu, nv], width w (along the wall), from y0 to y1.
    function wallQuad(mat, cu, cv, n, w, y0, y1) {
      const ru = n[1] * w / 2, rv = -n[0] * w / 2; // right vector = up x n
      face(mat, [[cu - ru, y0, cv - rv], [cu + ru, y0, cv + rv], [cu + ru, y1, cv + rv], [cu - ru, y1, cv - rv]], { normal: [n[0], 0, n[1]] });
    }

    // Wall polygon: a flat convex outline given in (s, y) wall coordinates (s along the wall's right
    // vector from the point (cu, cv)), e.g. a clock dial or an arched window head.
    function wallPoly(mat, cu, cv, n, pts) {
      const ru = n[1], rv = -n[0];
      face(mat, pts.map(([s, y]) => [cu + ru * s, y, cv + rv * s]), { normal: [n[0], 0, n[1]] });
    }

    // Frustum between two rectangles [u0,u1,v0,v1] at heights y0 and y1 (a pyramid when the top rectangle
    // has zero extent; hips, tower roofs, pinnacles). Optional bottom cap.
    function frustum(mat, a, y0, t, y1, cap = false) {
      const c = [(a[0] + a[1]) / 2, (y0 + y1) / 2, (a[2] + a[3]) / 2], h = { centre: c };
      const A = [[a[0], y0, a[2]], [a[1], y0, a[2]], [a[1], y0, a[3]], [a[0], y0, a[3]]];
      const T = [[t[0], y1, t[2]], [t[1], y1, t[2]], [t[1], y1, t[3]], [t[0], y1, t[3]]];
      for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; face(mat, [A[i], A[j], T[j], T[i]], h); }
      if (cap) face(mat, A, h);
    }

    // Hip roof over a rectangle: eaves at y0, ridge `rise` above, hipped on all four sides.
    function hip(mat, u0, u1, v0, v1, y0, rise) {
      const w = u1 - u0, d = v1 - v0, k = Math.min(w, d) / 2;
      if (w >= d) frustum(mat, [u0, u1, v0, v1], y0, [u0 + k, u1 - k, (v0 + v1) / 2, (v0 + v1) / 2], y0 + rise);
      else frustum(mat, [u0, u1, v0, v1], y0, [(u0 + u1) / 2, (u0 + u1) / 2, v0 + k, v1 - k], y0 + rise);
    }

    // Gable roof (two slopes and two triangular ends) with the ridge along `axis` ('u' or 'v').
    function gable(mat, u0, u1, v0, v1, y0, rise, axis = 'u', capMat = mat) {
      const c = [(u0 + u1) / 2, y0 + rise / 3, (v0 + v1) / 2], h = { centre: c };
      if (axis === 'u') {
        const vm = (v0 + v1) / 2;
        face(mat, [[u0, y0, v0], [u1, y0, v0], [u1, y0 + rise, vm], [u0, y0 + rise, vm]], h);
        face(mat, [[u0, y0, v1], [u1, y0, v1], [u1, y0 + rise, vm], [u0, y0 + rise, vm]], h);
        face(capMat, [[u0, y0, v0], [u0, y0, v1], [u0, y0 + rise, vm]], h);
        face(capMat, [[u1, y0, v0], [u1, y0, v1], [u1, y0 + rise, vm]], h);
      } else {
        const um = (u0 + u1) / 2;
        face(mat, [[u0, y0, v0], [u0, y0, v1], [um, y0 + rise, v1], [um, y0 + rise, v0]], h);
        face(mat, [[u1, y0, v0], [u1, y0, v1], [um, y0 + rise, v1], [um, y0 + rise, v0]], h);
        face(capMat, [[u0, y0, v0], [u1, y0, v0], [um, y0 + rise, v0]], h);
        face(capMat, [[u0, y0, v1], [u1, y0, v1], [um, y0 + rise, v1]], h);
      }
    }

    // Regular n-gon prism standing on y0 (gazebo drum), optional top cap.
    function drum(mat, cu, cv, r, y0, y1, n, cap = false, phase = Math.PI / n) {
      const ring = (y) => Array.from({ length: n }, (_, i) => [cu + r * Math.cos(phase + 2 * Math.PI * i / n), y, cv + r * Math.sin(phase + 2 * Math.PI * i / n)]);
      const A = ring(y0), T = ring(y1), h = { centre: [cu, (y0 + y1) / 2, cv] };
      for (let i = 0; i < n; i++) { const j = (i + 1) % n; face(mat, [A[i], A[j], T[j], T[i]], h); }
      if (cap) face(mat, T, h);
    }
    // Cone / pyramid on an n-gon.
    function spire(mat, cu, cv, r, y0, y1, n, phase = Math.PI / n) {
      const A = Array.from({ length: n }, (_, i) => [cu + r * Math.cos(phase + 2 * Math.PI * i / n), y0, cv + r * Math.sin(phase + 2 * Math.PI * i / n)]);
      const apex = [cu, y1, cv], h = { centre: [cu, (y0 + y1) / 2, cv] };
      for (let i = 0; i < n; i++) face(mat, [A[i], A[(i + 1) % n], apex], h);
    }

    // A bar in a vertical plane (u, y) from a to b ([u, y]), `w` wide in that plane, extruded along v
    // from v0 to v1: letter strokes and the sign's steel frame. `ext` lengthens both ends by w*ext so
    // consecutive strokes of a curve overlap instead of leaving wedges.
    function stroke(mat, a, bb, w, v0, v1, ext = 0, skip = '') {
      let du = bb[0] - a[0], dy = bb[1] - a[1];
      const len = Math.hypot(du, dy); if (len < 1e-6) return;
      du /= len; dy /= len;
      const e = w * ext, pu = -dy * w / 2, py = du * w / 2;
      const s = [a[0] - du * e, a[1] - dy * e], f = [bb[0] + du * e, bb[1] + dy * e];
      const q = [[s[0] + pu, s[1] + py], [f[0] + pu, f[1] + py], [f[0] - pu, f[1] - py], [s[0] - pu, s[1] - py]];
      const h = { centre: [(s[0] + f[0]) / 2, (s[1] + f[1]) / 2, (v0 + v1) / 2] };
      if (!skip.includes('N')) face(mat, q.map(([u, y]) => [u, y, v0]), h);
      if (!skip.includes('S')) face(mat, q.map(([u, y]) => [u, y, v1]), h);
      for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; face(mat, [[q[i][0], q[i][1], v0], [q[j][0], q[j][1], v0], [q[j][0], q[j][1], v1], [q[i][0], q[i][1], v1]], h); }
    }

    return { theta, face, box, deck, wallQuad, wallPoly, frustum, hip, gable, drum, spire, stroke };
  }

  function flush() {
    for (const { theta, mat, pos, nor, idx } of bins.values()) {
      if (!idx.length) continue;
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
      g.setIndex(idx);
      g.rotateY(theta);
      b.put(g, mat);
    }
    bins.clear();
  }
  return { frame, flush, vec };
}
