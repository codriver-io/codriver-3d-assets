import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { DIM, YAW, SPANS, PIERS, RAMP, rampY, rampRailStart, rampLandingOffset, deckHeight, archPoint } from './george-c-king-bridge-site.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);

/**
 * George C. King Bridge, Calgary (RFR, 2014): a 182 m pedestrian bridge over the Bow River in three network-arch
 * spans of 99, 31 and 52 m (south to north). Each span has a pair of grey steel box arches that lean in toward each
 * other, a pale deck that rises gently over the span (the "skipping stone" profile) and thin hangers that cross
 * between arch and deck edge. The arches spring from concrete skewback blocks beside the deck that stand proud of
 * the ground and reach down to footings, shared by neighbouring spans, with V struts up to the girder; concrete
 * abutments at both ends. The mapped 78 m island ramp leaves the east side of the centre span (the rail is open
 * there) and runs to a landing on St Patrick's Island on its own piers.
 *
 * Authored in the bridge's own frame (u along the axis toward the north, y up from the footway grade, v across,
 * to the right when facing +u) and turned once onto the mapped bearing. The walking surface starts 5 cm over
 * y = 0 so it never fights the provider's footway; nothing is below -2.95 m.
 */
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const acc = {}; // material -> { pos, nor, idx, off }
  const slot = (mat) => (acc[mat] ||= { pos: [], nor: [], idx: [], off: [] });
  let shift = null; // (u, v) -> Full 3D world vertical shift of what is being emitted (the island ramp); null = rigid with the deck
  const emit = (mat, P, N, tris) => {
    const s = slot(mat), base = s.pos.length / 3;
    P.forEach((p, i) => { s.pos.push(p.x, p.y, p.z); s.nor.push(N[i].x, N[i].y, N[i].z); s.off.push(shift ? shift(p.x, p.z) : 0); });
    for (const t of tris) s.idx.push(base + t[0], base + t[1], base + t[2]);
  };
  // One triangle wound so its normal points along `out`; flat shaded.
  const tri = (mat, a, c, d, out) => {
    const n = new THREE.Vector3().crossVectors(c.clone().sub(a), d.clone().sub(a)).normalize();
    const flip = n.dot(out) < 0;
    emit(mat, flip ? [a, d, c] : [a, c, d], [n, n, n].map((x) => (flip ? x.clone().negate() : x)), [[0, 1, 2]]);
  };
  const centre = (ring) => ring.reduce((s, p) => s.add(p), V(0, 0, 0)).divideScalar(ring.length);
  // Loft a closed convex ring through stations. flat: one normal per face (box-like sections); otherwise smooth
  // normals from `normals` (same shape as rings) or from the ring's own centre. Winding is fixed outward.
  const loft = (mat, rings, { flat = false, normals = null, capStart = false, capEnd = false } = {}) => {
    const m = rings[0].length, cs = rings.map(centre);
    for (let i = 0; i < rings.length - 1; i++) for (let j = 0; j < m; j++) {
      const k = (j + 1) % m, a = rings[i][j], c = rings[i][k], d = rings[i + 1][j], e = rings[i + 1][k];
      if (flat) {
        const out = a.clone().add(c).add(d).add(e).multiplyScalar(0.25).sub(cs[i].clone().add(cs[i + 1]).multiplyScalar(0.5));
        tri(mat, a, c, d, out); tri(mat, c, e, d, out);
      } else {
        const nrm = (r, q) => (normals ? normals[r][q] : rings[r][q].clone().sub(cs[r]).normalize());
        const P = [a, c, d, e], N = [nrm(i, j), nrm(i, k), nrm(i + 1, j), nrm(i + 1, k)];
        const f = new THREE.Vector3().crossVectors(c.clone().sub(a), d.clone().sub(a));
        const avg = N[0].clone().add(N[1]).add(N[2]).add(N[3]);
        emit(mat, P, N, f.dot(avg) >= 0 ? [[0, 1, 2], [1, 3, 2]] : [[0, 2, 1], [1, 2, 3]]);
      }
    }
    const cap = (ring, out) => { for (let j = 1; j < m - 1; j++) tri(mat, ring[0], ring[j], ring[j + 1], out); };
    if (capStart) cap(rings[0], cs[0].clone().sub(cs[1]));
    if (capEnd) cap(rings[rings.length - 1], cs[rings.length - 1].clone().sub(cs[rings.length - 2]));
  };
  const boxAA = (mat, [u0, u1], [y0, y1], [v0, v1]) => {
    const c = [[u0, y0, v0], [u1, y0, v0], [u1, y1, v0], [u0, y1, v0], [u0, y0, v1], [u1, y0, v1], [u1, y1, v1], [u0, y1, v1]].map((p) => V(...p));
    const faces = [[0, 3, 2, 1, [0, 0, -1]], [4, 5, 6, 7, [0, 0, 1]], [0, 4, 7, 3, [-1, 0, 0]], [1, 2, 6, 5, [1, 0, 0]], [0, 1, 5, 4, [0, -1, 0]], [3, 7, 6, 2, [0, 1, 0]]];
    for (const [a, c1, d, e, n] of faces) { const o = V(...n); tri(mat, c[a], c[c1], c[d], o); tri(mat, c[a], c[d], c[e], o); }
  };
  // A box turned about the vertical axis: centre (cu, cv), `d` the unit direction of its length in the (u, v) plane.
  const boxTurned = (mat, [cu, cv], d, hAlong, hAcross, y0, y1) => {
    const n = [d[1], -d[0]], P = (a, c, y) => V(cu + d[0] * a + n[0] * c, y, cv + d[1] * a + n[1] * c);
    const k = [[-1, -1, y0], [1, -1, y0], [1, 1, y0], [-1, 1, y0], [-1, -1, y1], [1, -1, y1], [1, 1, y1], [-1, 1, y1]].map(([a, c, y]) => P(a * hAlong, c * hAcross, y));
    const mid = P(0, 0, (y0 + y1) / 2);
    for (const f of [[0, 3, 2, 1], [4, 5, 6, 7], [0, 4, 7, 3], [1, 2, 6, 5], [0, 1, 5, 4], [3, 7, 6, 2]]) {
      const out = f.reduce((q, i) => q.add(k[i]), V(0, 0, 0)).divideScalar(4).sub(mid);
      tri(mat, k[f[0]], k[f[1]], k[f[2]], out); tri(mat, k[f[0]], k[f[2]], k[f[3]], out);
    }
  };
  // A thin round tube between two points (hangers, struts); open ends sit inside what they join.
  const tube = (mat, p, q, r, sides) => {
    const d = q.clone().sub(p).normalize(), ref = Math.abs(d.y) > 0.9 ? V(1, 0, 0) : V(0, 1, 0);
    const n1 = new THREE.Vector3().crossVectors(d, ref).normalize(), n2 = new THREE.Vector3().crossVectors(d, n1);
    const ring = (c) => Array.from({ length: sides }, (_, i) => { const a = i / sides * Math.PI * 2; return c.clone().addScaledVector(n1, Math.cos(a) * r).addScaledVector(n2, Math.sin(a) * r); });
    loft(mat, [ring(p), ring(q)]);
  };

  const stations = (u0, u1, step) => { const n = Math.max(2, Math.round((u1 - u0) / step)); return Array.from({ length: n + 1 }, (_, i) => u0 + (u1 - u0) * i / n); };
  const deckStep = near ? 2.0 : 4.0;
  const RAMP_GAP = [rampRailStart(-RAMP.railHalf).u, rampRailStart(RAMP.railHalf).u];

  // ---- deck: pale slab, grey box girder below it, handrail with posts and wires -------------------------------
  const { deckHalf: dh, slab, railV, railY } = DIM;
  for (const s of SPANS) {
    const us = stations(s.u0, s.u1, deckStep), first = s.u0 === PIERS[0], last = s.u1 === PIERS[3];
    const at = (u, yy, v) => V(u, deckHeight(u) + yy, v);
    const slabRings = us.map((u) => [at(u, 0, -dh), at(u, 0, dh), at(u, -slab, dh), at(u, -slab, -dh)]);
    loft('deck', slabRings, { flat: true, capStart: first, capEnd: last });
    const gH = DIM.girderDepth;
    // the girder's end faces sit 60 cm inside the slab's, or the two share a plane at the abutment
    const gus = stations(s.u0 + (first ? 0.6 : 0), s.u1 - (last ? 0.6 : 0), deckStep);
    const girderRings = gus.map((u) => [at(u, -0.1, -dh + 0.05), at(u, -0.1, dh - 0.05), at(u, -gH, 1.3), at(u, -gH, -1.3)]);
    loft('steel', girderRings, { flat: true, capStart: first, capEnd: last });
    // handrail: top bar and (near) two wires, following the deck's rise
    // the east rail of the centre span is open between the island ramp's two edge lines
    const gap = s.name === 'centre' ? RAMP_GAP : null;
    const rail = (yy, half, mat, step) => {
      const a = s.u0 + (first ? 0.5 : 0.35), c = s.u1 - (last ? 0.5 : 0.35);
      for (const side of [-1, 1]) {
        const v = side * railV, runs = gap && side > 0 ? [[a, gap[0]], [gap[1], c]] : [[a, c]];
        for (const [r0, r1] of runs) {
          const ru = stations(r0, r1, step);
          loft(mat, ru.map((u) => [at(u, yy - half, v - half), at(u, yy - half, v + half), at(u, yy + half, v + half), at(u, yy + half, v - half)]), { flat: true, capStart: true, capEnd: true });
        }
      }
    };
    if (gap) for (const g of gap) boxAA('rail', [g - (near ? 0.04 : 0.06), g + (near ? 0.04 : 0.06)], [deckHeight(g) - 0.05, deckHeight(g) + railY + 0.04], [railV - (near ? 0.04 : 0.06), railV + (near ? 0.04 : 0.06)]);
    rail(railY, near ? 0.045 : 0.06, 'rail', deckStep);
    if (near) { rail(railY - 0.35, 0.012, 'rail', 4); rail(railY - 0.7, 0.012, 'rail', 4); }
    // posts
    const postStep = near ? 2.5 : 5;
    const n = Math.max(1, Math.round((s.u1 - s.u0) / postStep));
    for (let i = 0; i <= n; i++) {
      const u = s.u0 + (s.u1 - s.u0) * i / n;
      if ((i === 0 && !first) || (i === n && !last && false)) continue; // the pier post belongs to the span before it
      const uu = i === 0 ? u + 0.1 : i === n ? u - 0.1 : u, y = deckHeight(uu), w = near ? 0.04 : 0.06;
      for (const side of [-1, 1]) if (!(gap && side > 0 && uu > gap[0] - 0.4 && uu < gap[1] + 0.4)) boxAA('rail', [uu - w, uu + w], [y - 0.05, y + railY + 0.04], [side * railV - w, side * railV + w]);
    }
  }

  // ---- arches: a pair per span, elliptical box sections that lean in, with crossing hangers ------------------
  const sides = near ? 10 : 6;
  for (const s of SPANS) {
    const L = s.u1 - s.u0, segs = near ? Math.max(24, Math.round(L / 1.6)) : Math.max(12, Math.round(L / 4));
    const segsEven = segs + (segs % 2);
    for (const side of [-1, 1]) {
      const rings = [], norms = [];
      for (let i = 0; i <= segsEven; i++) {
        const t = i / segsEven, P = V(...archPoint(s, t, side));
        const e = 1e-3, a0 = V(...archPoint(s, Math.max(0, t - e), side)), a1 = V(...archPoint(s, Math.min(1, t + e), side));
        const T = a1.sub(a0).normalize();
        let N = new THREE.Vector3().crossVectors(T, V(0, 0, 1)); if (N.y < 0) N.negate(); N.normalize(); // in-plane normal, up
        const S = new THREE.Vector3().crossVectors(N, T).normalize();
        const ra = s.depth / 2, rb = s.width / 2, ring = [], nr = [];
        for (let j = 0; j < sides; j++) {
          const a = j / sides * Math.PI * 2, c = Math.cos(a), sn = Math.sin(a);
          ring.push(P.clone().addScaledVector(N, c * ra).addScaledVector(S, sn * rb));
          nr.push(N.clone().multiplyScalar(c / ra).addScaledVector(S, sn / rb).normalize());
        }
        rings.push(ring); norms.push(nr);
      }
      loft('steel', rings, { normals: norms, capStart: true, capEnd: true });

      // crossing hangers: two families at ~60 deg, arch centre line to the deck edge
      const count = Math.max(2, Math.round(L / (near ? s.hangerEvery : s.hangerEvery * 1.8)));
      const hr = near ? 0.045 : 0.1, hs = near ? 4 : 3;
      for (const dir of [-1, 1]) for (let k = 0; k < count; k++) {
        const t = (k + 0.5) / count, top = V(...archPoint(s, t, side));
        const h = top.y - deckHeight(top.x);
        if (h < 1.5) continue; // no hanger where the arch is still at the deck
        const ub = Math.max(s.u0 + 0.9, Math.min(s.u1 - 0.9, top.x + dir * h / Math.tan(60 * Math.PI / 180)));
        if (s.name === 'centre' && side > 0 && ub > RAMP_GAP[0] - 0.3 && ub < RAMP_GAP[1] + 0.3) continue; // the ramp leaves the deck here
        const bottom = V(ub, deckHeight(ub) - 0.06, side * (railV - 0.03));
        tube('cable', top, bottom, hr, hs);
      }
    }
  }

  // ---- piers: skewback blocks the arches spring from, footings to the ground, V struts to the girder; abutments --
  // Each arch foot stands in a concrete block beside the deck that rises to skewTop (proud of the ground in Full 3D
  // world, where the river bank is a metre or so under the deck line) and goes down to footBottom (buried there).
  // Under the deck a pier column and a cross cap carry the girder and tie the two blocks together.
  const fb = DIM.footBottom, fv = DIM.footLat;
  for (const u of PIERS) {
    const end = u === PIERS[0] || u === PIERS[3], e = Math.sign(u), uu = end ? u - e * 0.9 : u, h = end ? 1.5 : 1.4;
    for (const side of [-1, 1]) boxAA('concrete', [uu - h, uu + h], [fb, DIM.skewTop], side > 0 ? [fv - 0.8, fv + 0.75] : [-fv - 0.75, -fv + 0.8]);
    boxAA('concrete', [uu - (end ? 1.3 : 1.2), uu + (end ? 1.3 : 1.2)], [fb, -1.6], [-fv + 0.8, fv - 0.8]); // cross cap between the blocks
    if (!end) {
      boxAA('concrete', [u - 0.9, u + 0.9], [fb, -0.85], [-1.4, 1.4]); // column under the girder
      for (const side of [-1, 1]) tube('steel', V(u, DIM.springY, side * DIM.footLat), V(u, -0.6, side * 1.15), near ? 0.4 : 0.45, near ? 8 : 5);
    }
  }
  for (const e of [-1, 1]) {
    const u0 = e * DIM.halfLength, ua = u0 - e * 5;
    boxAA('concrete', [Math.min(ua, u0), Math.max(ua, u0)], [fb, -0.55], [-2.4, 2.4]);
  }

  // ---- the island ramp (OSM way 779639382): a pale slab on a steel girder with rails, three concrete supports ------
  {
    shift = rampLandingOffset; // everything the ramp is made of settles to the island path in Full 3D world
    const [du, dv] = RAMP.dir, [nu, nv] = RAMP.normal, s0 = (1.6 - RAMP.v0) / dv; // starts under the deck, 40 cm in from its edge
    const along = (s, lat, y) => V(RAMP.u0 + du * s + nu * lat, y, RAMP.v0 + dv * s + nv * lat);
    const ss = stations(s0, RAMP.length, near ? 4 : 8), W = RAMP.half;
    loft('deck', ss.map((t) => { const y = rampY(t); return [along(t, -W, y), along(t, W, y), along(t, W, y - RAMP.slab), along(t, -W, y - RAMP.slab)]; }), { flat: true, capStart: true, capEnd: true });
    loft('steel', ss.map((t) => { const y = rampY(t) - RAMP.slab; return [along(t, -W + 0.1, y), along(t, W - 0.1, y), along(t, 0.9, y - RAMP.girder), along(t, -0.9, y - RAMP.girder)]; }), { flat: true, capStart: true, capEnd: true });
    // handrails from where each edge line leaves the deck rail to the landing, posts every 3 m (6 m far)
    for (const side of [-1, 1]) {
      const lat = side * RAMP.railHalf, a = rampRailStart(lat).s, half = near ? 0.045 : 0.06;
      loft('rail', stations(a, RAMP.length - 0.3, near ? 4 : 8).map((t) => { const y = rampY(t) + railY; return [along(t, lat - half, y - half), along(t, lat + half, y - half), along(t, lat + half, y + half), along(t, lat - half, y + half)]; }), { flat: true, capStart: true, capEnd: true });
      if (near) for (const w of [0.35, 0.7]) loft('rail', stations(a, RAMP.length - 0.3, 8).map((t) => { const y = rampY(t) + railY - w; return [along(t, lat - 0.012, y - 0.012), along(t, lat + 0.012, y - 0.012), along(t, lat + 0.012, y + 0.012), along(t, lat - 0.012, y + 0.012)]; }), { flat: true, capStart: true, capEnd: true });
      const n = Math.max(2, Math.round((RAMP.length - 0.3 - a) / (near ? 3 : 6)));
      for (let i = 0; i <= n; i++) {
        const t = a + (RAMP.length - 0.3 - a) * i / n, p = along(t, lat, 0), w = near ? 0.04 : 0.06;
        boxAA('rail', [p.x - w, p.x + w], [rampY(t) - 0.05, rampY(t) + railY + 0.04], [p.z - w, p.z + w]);
      }
    }
    // supports: two pier columns across the river and the landing abutment, from the footing up under the girder
    for (const f of RAMP.posts) { const t = RAMP.length * f, p = along(t, 0, 0); boxTurned('concrete', [p.x, p.z], RAMP.dir, 0.4, 1.1, fb, rampY(t) - RAMP.slab - 0.1); }
    { const t = RAMP.length - 0.5, p = along(t, 0, 0); boxTurned('concrete', [p.x, p.z], RAMP.dir, 0.9, 1.9, fb, rampY(RAMP.length) - 0.25); }
    shift = null;
  }

  for (const [mat, g] of Object.entries(acc)) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(g.pos, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(g.nor, 3));
    geo.setIndex(g.idx); geo.rotateY(YAW); b.put(geo, mat, 0);
  }
  const root = b.finish();
  // Full 3D world: the building layer adds these per-vertex runs [start, count, metres] to the mesh while terrain is on
  // and restores the authored heights in Cityscape. Only the island ramp's last stretch has a non-zero shift.
  for (const mesh of root.children) {
    const off = acc[mesh.material.name].off, runs = [];
    for (let i = 0; i < off.length;) {
      let j = i + 1; while (j < off.length && off[j] === off[i]) j++;
      if (off[i]) runs.push([i, j - i, Math.round(off[i] * 1e4) / 1e4]);
      i = j;
    }
    if (runs.length) mesh.userData.terrainOffsets = runs;
  }
  root.traverse((o) => { if (o.isMesh) o.geometry.deleteAttribute('bridgeLift'); }); // free-standing: no road datum to fit
  root.userData.elevationDatum = 'Walking surface 5 cm over local grade y=0 at the abutments, rising to 1.0 m over the south span; the island ramp descends from 0.3 m to 0.1 m (Full 3D world settles its last 22 m by 0.5 m onto the island path); footings, pier columns and abutments to -2.95 m.';
  return root;
}
