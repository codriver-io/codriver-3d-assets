// Derived data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright
import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';
import { BLOCKS, PLINTH_H, SAILS, centroid, blockTopY, sailFrame, sailPoint, struts } from './fondation-louis-vuitton-parts.js';

// Frank Gehry, 2014: white fibre-concrete "icebergs" on a terrace, wrapped by twelve curved glass
// sails on timber and steel. Authored directly in east/up/south metres around SPEC.origin; the
// mapped outline's orientation is already in the coordinates, the layer never rotates it.
// local lng/lat -> metres: copy of facade/geo.js's equirectangular step at this latitude.
const local = ([lng, lat]) => [(lng - SPEC.origin[0]) * 111320 * Math.cos(SPEC.origin[1] * Math.PI / 180), (SPEC.origin[1] - lat) * 111320];
const v3 = (p) => new THREE.Vector3(...p);

// The water basin that wraps the south side of the building: inner edge (smooth chain, >= 2 m
// outside the mapped outline), then water, a stone rim and a lower stone step.
const BASIN_CHAIN = [[-62, -6], [-62, 4], [-54, 12], [-44, 18], [-30, 26], [-14, 34], [6, 36], [24, 37], [38, 29], [52, 17], [63, 6], [66, -3]];

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const soups = new Map();
  // far merges the minor materials into their neighbours
  const fold = (m) => (near ? m : m === 'steel' ? 'frame' : m);
  function tri(mat, p, q, r, out) {
    mat = fold(mat);
    const n = v3(q).sub(v3(p)).cross(v3(r).sub(v3(p)));
    if (n.lengthSq() < 1e-10) return;
    if (n.dot(v3(out).sub(v3(p))) < 0) [q, r] = [r, q];
    if (!soups.has(mat)) soups.set(mat, []);
    soups.get(mat).push(...p, ...q, ...r);
  }
  const quad = (m, p, q, r, s, out) => { tri(m, p, q, r, out); tri(m, p, r, s, out); };

  // ---- terrace: the mapped outline, extruded to a white plinth
  const ring = FOOTPRINTS[0].slice(0, -1).map(local);
  const area = ring.reduce((s, p, i) => { const q = ring[(i + 1) % ring.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0);
  const tops = THREE.ShapeUtils.triangulateShape(ring.map((p) => new THREE.Vector2(p[0], p[1])), []);
  for (const [i, j, k] of tops) tri('stone', [ring[i][0], PLINTH_H, ring[i][1]], [ring[j][0], PLINTH_H, ring[j][1]], [ring[k][0], PLINTH_H, ring[k][1]], [ring[i][0], PLINTH_H + 5, ring[i][1]]);
  ring.forEach((p, i) => {
    const q = ring[(i + 1) % ring.length], dx = q[0] - p[0], dz = q[1] - p[1];
    const sgn = area > 0 ? 1 : -1, ox = sgn * dz, oz = -sgn * dx; // outward normal for the ring's winding
    const mid = [(p[0] + q[0]) / 2 + ox, PLINTH_H / 2, (p[1] + q[1]) / 2 + oz];
    quad('stone', [p[0], 0, p[1]], [q[0], 0, q[1]], [q[0], PLINTH_H, q[1]], [p[0], PLINTH_H, p[1]], mid);
  });

  // ---- icebergs: faceted blocks with sloping planar tops
  for (const block of BLOCKS) {
    const poly = block.poly, [cx, cz] = centroid(poly);
    const top = (p) => [p[0], blockTopY(block, p[0], p[1]), p[1]];
    for (let i = 1; i < poly.length - 1; i++) tri('ice', top(poly[0]), top(poly[i]), top(poly[i + 1]), [cx, blockTopY(block, cx, cz) + 5, cz]);
    poly.forEach((p, i) => {
      const q = poly[(i + 1) % poly.length], mx = (p[0] + q[0]) / 2, mz = (p[1] + q[1]) / 2;
      // outward reference: the edge midpoint pushed one more centroid-to-edge distance away from the block
      quad('ice', [p[0], PLINTH_H, p[1]], [q[0], PLINTH_H, q[1]], top(q), top(p), [mx + (mx - cx), PLINTH_H + 4, mz + (mz - cz)]);
    });
  }

  // ---- lit gallery slits on the outward faces of the icebergs (self-lit at night)
  if (near) for (const block of BLOCKS) block.poly.forEach((p, i) => {
    const q = block.poly[(i + 1) % block.poly.length], dx = q[0] - p[0], dz = q[1] - p[1], len = Math.hypot(dx, dz);
    const [cx, cz] = centroid(block.poly), mx = (p[0] + q[0]) / 2, mz = (p[1] + q[1]) / 2;
    let nx = dz / len, nz = -dx / len;
    if (nx * (mx - cx) + nz * (mz - cz) < 0) { nx = -nx; nz = -nz; }
    if (len < 10 || (nz < 0.5 && Math.abs(nx) < 0.8)) return;
    for (const y of [6.5, 11]) for (const [f0, f1] of [[0.12, 0.4], [0.6, 0.88]]) {
      const at = (f, yy) => [p[0] + dx * f + nx * 0.3, yy, p[1] + dz * f + nz * 0.3];
      const top = Math.min(blockTopY(block, p[0] + dx * f0, p[1] + dz * f0), blockTopY(block, p[0] + dx * f1, p[1] + dz * f1));
      if (y + 1.6 > top) continue;
      quad('glow', at(f0, y), at(f1, y), at(f1, y + 1.4), at(f0, y + 1.4), [mx + nx * 5, y, mz + nz * 5]);
    }
  });

  // ---- glass sails
  const nu = near ? 10 : 5, nv = near ? 14 : 7;
  const surfaceNormal = (sail, f, s, t) => {
    const e = 0.02, ds = sailPoint(sail, Math.min(1, s + e), t, f), ds0 = sailPoint(sail, Math.max(-1, s - e), t, f);
    const dt = sailPoint(sail, s, Math.min(1, t + e), f), dt0 = sailPoint(sail, s, Math.max(0, t - e), f);
    const n = v3(ds).sub(v3(ds0)).cross(v3(dt).sub(v3(dt0)));
    if (n.lengthSq() < 1e-12) return new THREE.Vector3(...f.n);
    n.normalize();
    return n.dot(v3(f.n)) < 0 ? n.negate() : n;
  };
  // One skin of a sail as an indexed grid (smooth normals), `back` = metres behind the outer surface.
  // The outer skin faces the convex side; the inner skin is a separate surface 0.35 m behind it facing
  // the other way, and edge strips close the two, so the shell is one thin solid with consistent faces.
  const grid = (sail, f) => {
    const P = [], N = [];
    for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) {
      const s = -1 + (2 * i) / nu, t = j / nv;
      P.push(sailPoint(sail, s, t, f)); N.push(surfaceNormal(sail, f, s, t));
    }
    return { P, N };
  };
  function sailSkins(sail, f, mat) {
    const { P, N } = grid(sail, f), W = 0.35, row = nu + 1;
    for (const inner of [false, true]) {
      const pos = [], idx = [];
      P.forEach((p, k) => pos.push(...(inner ? v3(p).addScaledVector(N[k], -W).toArray() : p)));
      for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
        const a = j * row + i, c = a + 1, d = a + row, e = d + 1;
        idx.push(a, c, d, c, e, d);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
      // normals of this skin must agree with the convex side (outer) or oppose it (inner)
      const k = (nv >> 1) * row + (nu >> 1), nm = new THREE.Vector3().fromBufferAttribute(g.attributes.normal, k);
      if ((nm.dot(N[k]) > 0) === inner) {
        const ix = g.index.array;
        for (let q = 0; q < ix.length; q += 3) { const t = ix[q + 1]; ix[q + 1] = ix[q + 2]; ix[q + 2] = t; }
        g.computeVertexNormals();
      }
      b.put(g, mat);
    }
    // closing returns on the four edges (flat), facing away from the shell's centre
    const c = P[(nv >> 1) * row + (nu >> 1)];
    const edge = (list) => {
      for (let q = 0; q < list.length - 1; q++) {
        const [i0, i1] = [list[q], list[q + 1]], o0 = P[i0], o1 = P[i1];
        const n0 = v3(o0).addScaledVector(N[i0], -W).toArray(), n1 = v3(o1).addScaledVector(N[i1], -W).toArray();
        const mid = v3(o0).add(v3(o1)).multiplyScalar(0.5), away = mid.clone().sub(v3(c)).toArray();
        quad(mat, o0, o1, n1, n0, [mid.x + away[0], mid.y + away[1], mid.z + away[2]]);
      }
    };
    edge(Array.from({ length: nu + 1 }, (_, i) => i)); // bottom
    edge(Array.from({ length: nu + 1 }, (_, i) => nv * row + i)); // top
    edge(Array.from({ length: nv + 1 }, (_, j) => j * row)); // left
    edge(Array.from({ length: nv + 1 }, (_, j) => j * row + nu)); // right
  }
  // ribbon (mullion, purlin or beam) along a polyline on the shell, proud of it by `lift`
  function ribbon(mat, sail, f, pts, hw, lift) {
    const rows = pts.map(([s, t], k) => {
      const p = sailPoint(sail, s, t, f), n = surfaceNormal(sail, f, s, t);
      const a = sailPoint(sail, pts[Math.min(k + 1, pts.length - 1)][0], pts[Math.min(k + 1, pts.length - 1)][1], f);
      const z = sailPoint(sail, pts[Math.max(k - 1, 0)][0], pts[Math.max(k - 1, 0)][1], f);
      const tan = v3(a).sub(v3(z)).normalize(), w = n.clone().cross(tan).normalize().multiplyScalar(hw);
      const c = v3(p).addScaledVector(n, lift);
      return { l: c.clone().sub(w).toArray(), r: c.clone().add(w).toArray(), out: c.clone().addScaledVector(n, 5).toArray() };
    });
    for (let k = 0; k < rows.length - 1; k++) quad(mat, rows[k].l, rows[k].r, rows[k + 1].r, rows[k + 1].l, rows[k].out);
  }
  // box-section beam along a polyline on the shell: base sunk 5 cm into the glass, `height` standing on the local normal
  function beam(mat, sail, f, pts, hw, height) {
    const rows = pts.map(([s, t], k) => {
      const p = sailPoint(sail, s, t, f), n = surfaceNormal(sail, f, s, t);
      const a = pts[Math.min(k + 1, pts.length - 1)], z = pts[Math.max(k - 1, 0)];
      const tan = v3(sailPoint(sail, a[0], a[1], f)).sub(v3(sailPoint(sail, z[0], z[1], f))).normalize(), w = n.clone().cross(tan).normalize().multiplyScalar(hw);
      const base = v3(p).addScaledVector(n, -0.05), top = base.clone().addScaledVector(n, height + 0.05);
      return { bl: base.clone().sub(w).toArray(), br: base.clone().add(w).toArray(), tl: top.clone().sub(w).toArray(), tr: top.clone().add(w).toArray(), n, c: top.toArray(), w: w.toArray() };
    });
    for (let k = 0; k < rows.length - 1; k++) {
      const [r, q] = [rows[k], rows[k + 1]], c = r.c, w = r.w, n = r.n;
      quad(mat, r.tl, r.tr, q.tr, q.tl, [c[0] + n.x * 5, c[1] + n.y * 5, c[2] + n.z * 5]);
      quad(mat, r.bl, r.tl, q.tl, q.bl, [c[0] - w[0] * 5, c[1] - w[1] * 5, c[2] - w[2] * 5]);
      quad(mat, r.br, r.tr, q.tr, q.br, [c[0] + w[0] * 5, c[1] + w[1] * 5, c[2] + w[2] * 5]);
    }
    // end caps, facing along the beam
    for (const [r, o] of [[rows[0], rows[1]], [rows[rows.length - 1], rows[rows.length - 2]]]) {
      const c = r.c, d = [c[0] - o.c[0], c[1] - o.c[1], c[2] - o.c[2]];
      quad(mat, r.bl, r.br, r.tr, r.tl, [c[0] + d[0] * 5, c[1] + d[1] * 5, c[2] + d[2] * 5]);
    }
  }
  const line = (fixed, axis, n, from = 0, to = 1) => Array.from({ length: n + 1 }, (_, k) => {
    const v = from + ((to - from) * k) / n;
    return axis === 's' ? [fixed, v] : [v, fixed];
  });

  for (const sail of SAILS) {
    const f = sailFrame(sail), skin = sail.mat || 'glass';
    sailSkins(sail, f, skin);
    if (!sail.timber) {
      // the lattice: horizontal purlins plus two crossing families of diagonals, following the shell
      const nd = near ? 4 : 2, seg = near ? 14 : 6, hw = near ? 0.12 : 0.32, lift = near ? 0.18 : 0.3;
      for (let k = 0; k < nd; k++) {
        const s0 = -1.1 + (2.2 * k) / nd, ds = 0.9; // diagonals sweep ~0.9 of the half-width up the shell
        for (const dir of [1, -1]) {
          const pts = Array.from({ length: seg + 1 }, (_, q) => [s0 + (dir * ds * q) / seg + (dir < 0 ? 1.1 : 0), 0.03 + (0.94 * q) / seg]).filter(([ss]) => Math.abs(ss) < 0.97);
          if (pts.length > 2) ribbon('frame', sail, f, pts, hw, lift);
        }
      }
      for (const t of near ? [0.25, 0.5, 0.75] : [0.5]) ribbon('frame', sail, f, line(t, 't', near ? 12 : 6, -0.95, 0.95), hw, lift);
    }
    if (sail.timber) { // exposed glulam grid: every beam is a box standing on the local shell normal, so it bears on the glass
      const H = near ? 0.6 : 0.9, hw = near ? 0.28 : 0.45, eh = near ? 0.9 : 1.0, ehw = near ? 0.5 : 0.7;
      const ns = near ? 5 : 2, nt = near ? 5 : 2, step = near ? 14 : 6;
      for (let k = 0; k < ns; k++) beam('timber', sail, f, line(-0.78 + (1.56 * k) / (ns - 1 || 1), 's', step, 0.005, 0.995), hw, H); // ends run into the top and bottom edge beams
      for (let k = 1; k <= nt; k++) beam('timber', sail, f, line(k / (nt + 1), 't', step, -0.96, 0.96), hw, H);
      // heavy glulam edge beams round the sail: top, bottom and the two flanks
      beam('timber', sail, f, line(0.995, 't', step, -0.995, 0.995), ehw, eh);
      beam('timber', sail, f, line(0.005, 't', step, -0.995, 0.995), ehw, eh);
      beam('timber', sail, f, line(-0.995, 's', step, 0.01, 0.99), ehw, eh);
      beam('timber', sail, f, line(0.995, 's', step, 0.01, 0.99), ehw, eh);
    }
  }

  // ---- steel struts from each sail down onto the iceberg that carries it
  for (const s of struts()) b.bar('steel', s.foot, s.top, near ? 0.45 : 0.7, near ? 0.45 : 0.7);

  // ---- basin: stepped water, stone rim and step wrapped round the south side
  {
    const curve = new THREE.CatmullRomCurve3(BASIN_CHAIN.map(([x, z]) => new THREE.Vector3(x, 0, z)), false, 'catmullrom', 0.5);
    const pts = curve.getPoints(near ? 44 : 16), nrm = pts.map((p, i) => {
      const a = pts[Math.min(i + 1, pts.length - 1)], z = pts[Math.max(i - 1, 0)];
      const tx = a.x - z.x, tz = a.z - z.z, l = Math.hypot(tx, tz) || 1;
      return [-tz / l, tx / l]; // south-facing (outward) normal for an eastward chain
    });
    const at = (i, d, y) => [pts[i].x + nrm[i][0] * d, y, pts[i].z + nrm[i][1] * d];
    const bands = [['water', 0, 4.6, 0.3], ['stone', 4.6, 6.2, 1.1], ['stone', 6.2, 9.5, 0.6]];
    for (let i = 0; i < pts.length - 1; i++) {
      for (const [m, d0, d1, y] of bands) quad(m, at(i, d0, y), at(i, d1, y), at(i + 1, d1, y), at(i + 1, d0, y), [pts[i].x, y + 5, pts[i].z]);
      // rim: inner wall facing the water, outer wall facing the step
      quad('stone', at(i, 4.6, 0.3), at(i + 1, 4.6, 0.3), at(i + 1, 4.6, 1.1), at(i, 4.6, 1.1), at(i, 0, 0.7));
      quad('stone', at(i, 6.2, 0.6), at(i + 1, 6.2, 0.6), at(i + 1, 6.2, 1.1), at(i, 6.2, 1.1), at(i, 9, 0.8));
      quad('stone', at(i, 9.5, 0), at(i + 1, 9.5, 0), at(i + 1, 9.5, 0.6), at(i, 9.5, 0.6), at(i, 14, 0.3));
    }
  }

  // ---- hand over the merged soups (one flat-shaded mesh per material)
  for (const [mat, arr] of soups) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3));
    g.computeVertexNormals();
    b.put(g, mat);
  }
  return b.finish();
}
