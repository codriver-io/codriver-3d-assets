import * as THREE from 'three';

// Primitives in the building frame (+x along the river front toward Elizabeth Tower, +z out toward the
// Thames, y up). geometry.js rotates the finished meshes onto east/up/south once.
export function kit(b, near) {
  const put = (g, m) => b.put(g, m);
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const mk = (P, N, I) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(N, 3));
    g.setIndex(I);
    return g;
  };

  // Axis-aligned box. `omit` drops faces: d down, u up, e +x, w -x, s +z, n -z.
  function box(m, x0, x1, y0, y1, z0, z1, omit = '') {
    if (x1 - x0 < 1e-4 || y1 - y0 < 1e-4 || z1 - z0 < 1e-4) return;
    const P = [], N = [], I = [];
    const face = (key, n, a, c, d, e) => {
      if (omit.includes(key)) return;
      const o = P.length / 3;
      P.push(...a, ...c, ...d, ...e);
      for (let i = 0; i < 4; i++) N.push(...n);
      I.push(o, o + 1, o + 2, o, o + 2, o + 3);
    };
    face('s', [0, 0, 1], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]);
    face('n', [0, 0, -1], [x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0]);
    face('e', [1, 0, 0], [x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1]);
    face('w', [-1, 0, 0], [x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]);
    face('u', [0, 1, 0], [x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]);
    face('d', [0, -1, 0], [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]);
    put(mk(P, N, I), m);
  }

  function poly(m, pts, ref) {
    const a = V(...pts[0]), c = V(...pts[1]), d = V(...pts[2]);
    let n = c.clone().sub(a).cross(d.clone().sub(a));
    if (n.lengthSq() < 1e-8) return;
    n.normalize();
    const ctr = pts.reduce((s, p) => s.add(V(...p)), V(0, 0, 0)).multiplyScalar(1 / pts.length);
    if (n.dot(ctr.clone().sub(V(...ref))) < 0) { n = n.negate(); pts = [...pts].reverse(); }
    const P = [], N = [], I = [];
    pts.forEach((p) => { P.push(...p); N.push(n.x, n.y, n.z); });
    for (let i = 1; i < pts.length - 1; i++) I.push(0, i, i + 1);
    put(mk(P, N, I), m);
  }

  // Pitched roof sitting 6 cm above a parapet, inset so the wall top stays visible. Ridge runs along x.
  function pitched(m, x0, x1, z0, z1, parapet, ridge) {
    const i = 0.85;
    const a0 = x0 + i, a1 = x1 - i, b0 = z0 + i, b1 = z1 - i;
    if (a1 - a0 < 0.4 || b1 - b0 < 0.4 || ridge < parapet + 0.4) return;
    const y = parapet + 0.06, zm = (b0 + b1) / 2, xm = (a0 + a1) / 2;
    poly(m, [[a0, y, b0], [a1, y, b0], [a1, ridge, zm], [a0, ridge, zm]], [xm, y - 1, zm]);
    poly(m, [[a1, y, b1], [a0, y, b1], [a0, ridge, zm], [a1, ridge, zm]], [xm, y - 1, zm]);
    poly(m, [[a0, y, b0], [a0, ridge, zm], [a0, y, b1]], [xm, y, zm]);
    poly(m, [[a1, y, b1], [a1, ridge, zm], [a1, y, b0]], [xm, y, zm]);
  }

  // A range: stone box to the parapet (no underside) and a slate roof.
  function house(x0, x1, z0, z1, parapet, ridge) {
    box('stone', x0, x1, 0, parapet, z0, z1, 'd');
    pitched('roof', x0, x1, z0, z1, parapet, ridge);
  }

  const bar = (m, a, c, w, d) => b.bar(m, a, c, w, d);

  // A slab standing off a wall. `out` is metres outward from the wall plane `at` (negative recesses it).
  function onFace(side, along0, along1, at, y0, y1, out0, out1, mat) {
    const a0 = Math.min(along0, along1), a1 = Math.max(along0, along1);
    const o0 = Math.min(out0, out1), o1 = Math.max(out0, out1);
    if (a1 - a0 < 1e-4 || y1 - y0 < 1e-4 || o1 - o0 < 1e-4) return;
    if (side === 's') box(mat, a0, a1, y0, y1, at + o0, at + o1, 'n');
    else if (side === 'n') box(mat, a0, a1, y0, y1, at - o1, at - o0, 's');
    else if (side === 'e') box(mat, at + o0, at + o1, y0, y1, a0, a1, 'w');
    else box(mat, at - o1, at - o0, y0, y1, a0, a1, 'e');
  }

  function facePoint(side, along, at, y, out) {
    if (side === 's') return [along, y, at + out];
    if (side === 'n') return [along, y, at - out];
    if (side === 'e') return [at + out, y, along];
    return [at - out, y, along];
  }

  // Pointed window as a glass quad plus a triangular head, proud of a wall.
  // side: 's' +z, 'n' -z, 'e' +x, 'w' -x. `at` is the wall plane. `along` is the centre.
  // The centre of the opening stays glass: mullions sit off it, so a centre ray still hits the pane.
  function window(side, along, at, y, w, h) {
    const proud = 0.22, head = near ? Math.min(w * 0.55, h * 0.28) : 0;
    const body = h - head;
    const quad = (y0, y1, xL, xR) => {
      if (side === 's' || side === 'n') {
        const z = at + (side === 's' ? proud : -proud);
        const ref = [along, (y0 + y1) / 2, at];
        poly('glass', [[xL, y0, z], [xR, y0, z], [xR, y1, z], [xL, y1, z]], ref);
      } else {
        const x = at + (side === 'e' ? proud : -proud);
        const ref = [at, (y0 + y1) / 2, along];
        poly('glass', [[x, y0, xL], [x, y0, xR], [x, y1, xR], [x, y1, xL]], ref);
      }
    };
    const a = along - w / 2, c = along + w / 2;
    quad(y, y + body, a, c);
    if (head > 0.2) {
      const ym = y + body, tip = y + h, mid = along;
      if (side === 's' || side === 'n') {
        const z = at + (side === 's' ? proud : -proud);
        poly('glass', [[a, ym, z], [c, ym, z], [mid, tip, z]], [along, ym, at]);
      } else {
        const x = at + (side === 'e' ? proud : -proud);
        poly('glass', [[x, ym, a], [x, ym, c], [x, tip, mid]], [at, ym, along]);
      }
    }
    if (near) {
      const t = 0.2, p0 = proud + 0.14, p1 = p0 + 0.16;
      onFace(side, a - t, a, at, y, y + h, p0, p1, 'trim');
      onFace(side, c, c + t, at, y, y + h, p0, p1, 'trim');
      onFace(side, a, c, at, y - t, y, p0, p1, 'trim');
      onFace(side, a, c, at, y + h, y + h + t, p0, p1, 'trim');
      if (w > 1.15) {
        const m = Math.min(0.46, w * 0.28);
        for (const s of [-1, 1]) {
          onFace(side, along + s * m - 0.055, along + s * m + 0.055, at, y + 0.06, y + body - 0.04, proud + 0.1, proud + 0.22, 'trim');
        }
      }
    }
  }

  // Recessed louvred opening: iron slats and a dark back, with a pointed arch in front.
  // Nothing here shares the wall plane, so the opening does not z-fight the stone.
  function louvreBay(side, along, at, y0, y1, w, n, archMat, slatMat = 'trim') {
    const a = along - w / 2, c = along + w / 2, span = y1 - y0;
    for (let i = 0; i < n; i++) {
      const yb = y0 + span * (i + 0.18) / n;
      const yt = Math.min(y1 - 0.08, yb + Math.max(0.36, span / n * 0.46));
      if (yt - yb < 0.12) continue;
      onFace(side, a + 0.1, c - 0.1, at, yb, yt, -0.62, -0.34, slatMat);
    }
    const rise = w * 0.5;
    onFace(side, a + 0.12, c - 0.12, at, y0 - 0.04, y1 + rise - 0.08, -1.28, -1.06, 'iron');
    bar(archMat, facePoint(side, a, at, y1, 0.2), facePoint(side, along, at, y1 + rise, 0.24), 0.22, 0.16);
    bar(archMat, facePoint(side, c, at, y1, 0.2), facePoint(side, along, at, y1 + rise, 0.24), 0.22, 0.16);
  }

  // Hour mark in the clock plane. angleDeg is clockwise from 12 toward 3. Sits proud of the dial.
  function tick(mat, x, y, z, face, angleDeg, r0, r1, width, proud) {
    const a = angleDeg * Math.PI / 180;
    const right = { s: [1, 0, 0], n: [-1, 0, 0], e: [0, 0, -1], w: [0, 0, 1] }[face];
    const dir = [right[0] * Math.sin(a), Math.cos(a), right[2] * Math.sin(a)];
    const nrm = { s: [0, 0, 1], n: [0, 0, -1], e: [1, 0, 0], w: [-1, 0, 0] }[face];
    const side = [
      dir[1] * nrm[2] - dir[2] * nrm[1],
      dir[2] * nrm[0] - dir[0] * nrm[2],
      dir[0] * nrm[1] - dir[1] * nrm[0],
    ];
    const sl = Math.hypot(side[0], side[1], side[2]) || 1;
    side[0] /= sl; side[1] /= sl; side[2] /= sl;
    const o = [x + nrm[0] * proud, y, z + nrm[2] * proud];
    const p = (rad, across) => [
      o[0] + dir[0] * rad + side[0] * across,
      o[1] + dir[1] * rad + side[1] * across,
      o[2] + dir[2] * rad + side[2] * across,
    ];
    const hw = width / 2;
    poly(mat, [p(r0, -hw), p(r1, -hw * 0.65), p(r1, hw * 0.65), p(r0, hw)], [x, y, z]);
  }

  // Buttress proud of a long wall. `along` varies, `at` is the wall, `out` is +1 outside +s/+e.
  function buttress(side, along, at, y0, y1, width = 0.55, depth = 0.62) {
    const a0 = along - width / 2, a1 = along + width / 2;
    if (side === 's') box('stone', a0, a1, y0, y1, at + 0.05, at + depth, 'n');
    else if (side === 'n') box('stone', a0, a1, y0, y1, at - depth, at - 0.05, 's');
    else if (side === 'e') box('stone', at + 0.05, at + depth, y0, y1, a0, a1, 'w');
    else box('stone', at - depth, at - 0.05, y0, y1, a0, a1, 'e');
  }

  function pinnacle(x, z, y0, y1) {
    const w = near ? 0.72 : 0.9;
    const shaft = y0 + (y1 - y0) * 0.62;
    box('stone', x - w / 2, x + w / 2, y0 + 0.05, shaft, z - w / 2, z + w / 2, 'd');
    const r = w * 0.55, h = y1 - shaft;
    const g = new THREE.ConeGeometry(r, h, near ? 4 : 4, 1, true);
    g.translate(x, shaft + h / 2, z);
    put(g, 'stone');
  }

  // Repeated bays along a wall. `from`/`to` run along the wall; `at` is the wall plane.
  // Windows sit on the bay centres. Buttresses and pinnacles sit on the boundaries between them.
  function bays(side, from, to, at, parapet, { step = 5.2, rows, pins = true, butts = true } = {}) {
    const n = Math.max(1, Math.round(Math.abs(to - from) / step));
    const span = to - from;
    const edge = (i) => from + span * i / n;
    if (butts) {
      for (let i = 0; i <= n; i++) buttress(side, edge(i), at, 0.4, parapet);
    }
    for (let i = 0; i < n; i++) {
      const t = from + span * (i + 0.5) / n;
      if (rows) for (const [y, h, w] of rows) window(side, t, at, y, w ?? 1.7, h);
    }
    if (pins) {
      for (let i = 0; i <= n; i++) {
        const t = edge(i);
        const inward = side === 'e' ? -0.55 : side === 'w' ? 0.55 : side === 's' ? -0.55 : 0.55;
        const ax = side === 's' || side === 'n' ? t : at + inward;
        const az = side === 's' || side === 'n' ? at + inward : t;
        pinnacle(ax, az, parapet - 0.2, parapet + (near ? 6.2 : 5.4));
      }
    }
  }

  function disc(mat, x, y, z, face, r, proud, seg) {
    const g = new THREE.CircleGeometry(r, seg);
    if (face === 'n') g.rotateY(Math.PI);
    else if (face === 'e') g.rotateY(Math.PI / 2);
    else if (face === 'w') g.rotateY(-Math.PI / 2);
    const n = { s: [0, 0, 1], n: [0, 0, -1], e: [1, 0, 0], w: [-1, 0, 0] }[face];
    g.translate(x + n[0] * proud, y, z + n[2] * proud);
    put(g, mat);
  }

  function ring(mat, x, y, z, face, r0, r1, proud, seg) {
    const g = new THREE.RingGeometry(r0, r1, seg);
    if (face === 'n') g.rotateY(Math.PI);
    else if (face === 'e') g.rotateY(Math.PI / 2);
    else if (face === 'w') g.rotateY(-Math.PI / 2);
    const n = { s: [0, 0, 1], n: [0, 0, -1], e: [1, 0, 0], w: [-1, 0, 0] }[face];
    g.translate(x + n[0] * proud, y, z + n[2] * proud);
    put(g, mat);
  }

  // Clock hand in the plane of a face. angleDeg is clockwise from 12 toward 3.
  function hand(mat, x, y, z, face, angleDeg, length, width, proud) {
    const a = angleDeg * Math.PI / 180;
    const right = { s: [1, 0, 0], n: [-1, 0, 0], e: [0, 0, -1], w: [0, 0, 1] }[face];
    const up = [0, 1, 0];
    const dir = [right[0] * Math.sin(a) + up[0] * Math.cos(a), Math.cos(a), right[2] * Math.sin(a) + up[2] * Math.cos(a)];
    const nrm = { s: [0, 0, 1], n: [0, 0, -1], e: [1, 0, 0], w: [-1, 0, 0] }[face];
    // width axis = dir × normal
    const side = [
      dir[1] * nrm[2] - dir[2] * nrm[1],
      dir[2] * nrm[0] - dir[0] * nrm[2],
      dir[0] * nrm[1] - dir[1] * nrm[0],
    ];
    const sl = Math.hypot(...side) || 1;
    side[0] /= sl; side[1] /= sl; side[2] /= sl;
    const o = [x + nrm[0] * proud, y + nrm[1] * proud, z + nrm[2] * proud];
    const p = (along, across) => [
      o[0] + dir[0] * along + side[0] * across,
      o[1] + dir[1] * along + side[1] * across,
      o[2] + dir[2] * along + side[2] * across,
    ];
    const hw = width / 2;
    poly(mat, [p(0.25, -hw), p(length, -hw * 0.35), p(length, hw * 0.35), p(0.25, hw)], [x, y, z]);
  }

  // Octagonal (or n-sided) frustum about (x, z). r1 = 0 closes to a point.
  function spire(m, x, z, y0, y1, r0, r1, sides) {
    const n = sides;
    for (let i = 0; i < n; i++) {
      const a0 = (i / n) * Math.PI * 2 + Math.PI / n, a1 = ((i + 1) / n) * Math.PI * 2 + Math.PI / n;
      const b0 = [x + Math.cos(a0) * r0, y0, z + Math.sin(a0) * r0];
      const b1 = [x + Math.cos(a1) * r0, y0, z + Math.sin(a1) * r0];
      const t0 = r1 < 1e-3 ? [x, y1, z] : [x + Math.cos(a0) * r1, y1, z + Math.sin(a0) * r1];
      const t1 = r1 < 1e-3 ? [x, y1, z] : [x + Math.cos(a1) * r1, y1, z + Math.sin(a1) * r1];
      const pts = r1 < 1e-3 ? [b0, b1, t0] : [b0, b1, t1, t0];
      poly(m, pts, [x, (y0 + y1) / 2 - 1, z]);
    }
  }

  // A projecting band around a square shaft. Corner volumes belong to the north/south runs so no two
  // faces share a plane.
  function band(m, x, z, half, y0, y1, proud) {
    const h = half + proud;
    box(m, x - h, x + h, y0, y1, z + half, z + h, 'n');
    box(m, x - h, x + h, y0, y1, z - h, z - half, 's');
    box(m, x + half, x + h, y0, y1, z - half, z + half, 'w');
    box(m, x - h, x - half, y0, y1, z - half, z + half, 'e');
  }

  return { box, poly, pitched, house, window, buttress, pinnacle, bays, disc, hand, ring, spire, band, bar, onFace, louvreBay, tick, facePoint };
}
