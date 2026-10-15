// Derived data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright
import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { DIM, STAYS, BEARING, girderDepthAt, pylonV, pathYAt, stayList, hangerList, PATH_DECK, APPROACH, approachLength, approachY, approachDepth, SOUTH_LINE, NORTH_LINE, alignment, PORTAL } from './tawatina-bridge-site.js';

const { halfLength: HL, deckTop: H, deckWidth: W } = DIM;
const WING = W / 2; // 5.5 m, the deck's half width
const SOFFIT = 2.8; // half width of the box girder's flat bottom
const RAIL_V = 5.25; // deck parapet line, inboard of the stay blisters

/**
 * Tawatinâ Bridge, Edmonton: an extradosed LRT bridge, 261 m long. Authored in the bridge's own frame (u north,
 * v east, y up; see tawatina-bridge-site.js), then rotated once onto the mapped 0.57 degree bearing.
 *
 *  - an 11 m trapezoidal box girder, 3.5 m deep, haunched to 5.0 m / 4.4 m over its two piers, carrying two tracks
 *    with parapets and overhead-line masts and wires;
 *  - one pair of slender concrete pylons at the north bank pier, leaning outward, with 28 stays (seven a side on
 *    each plane, fanning south over the 110 m main span and north over the side span);
 *  - an 8 m timber and asphalt path hung beneath the girder on slender rods and luminaires, ramping to the banks,
 *    its soffit studded with art panels (stylised, no artwork);
 *  - twin pier legs under each pylon, a pair under the south pier, abutment walls at both ends.
 */
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const yaw = -BEARING * Math.PI / 180; // north end swings east: x' = x cos + z sin, z = -u
  const put = (g, mat) => { g.rotateY(yaw); b.put(g, mat, 0, 0); };
  const P = (u, v, y) => [v, y, -u];

  // A closed solid between rings of equal point count, each ring given in (u, v, y). Faces are flat shaded and
  // wound outward by testing each quad against the solid's centre, so any convex-in-section loft is safe.
  function loft(mat, rings, { caps = true } = {}) {
    const pos = [];
    const n = rings[0].length;
    const centreOf = (rs) => { const c = new THREE.Vector3(); for (const r of rs) for (const p of r) c.add(new THREE.Vector3(...P(...p))); return c.multiplyScalar(1 / (rs.length * n)); };
    // Orient each triangle away from `inside`: the local centre of the ring pair it belongs to (a long loft has no
    // single centre), or the neighbouring ring for an end cap.
    const tri = (a, c, d, inside) => {
      const A = new THREE.Vector3(...a), C = new THREE.Vector3(...c), D = new THREE.Vector3(...d);
      const normal = C.clone().sub(A).cross(D.clone().sub(A));
      const mid = A.clone().add(C).add(D).multiplyScalar(1 / 3).sub(inside);
      if (normal.dot(mid) < 0) pos.push(...a, ...d, ...c); else pos.push(...a, ...c, ...d);
    };
    for (let k = 0; k < rings.length - 1; k++) {
      const inside = centreOf([rings[k], rings[k + 1]]);
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        const a = P(...rings[k][i]), c = P(...rings[k][j]), d = P(...rings[k + 1][j]), e = P(...rings[k + 1][i]);
        tri(a, c, d, inside); tri(a, d, e, inside);
      }
    }
    if (caps) {
      for (const [r, next] of [[rings[0], rings[1]], [rings.at(-1), rings.at(-2)]]) {
        const p0 = P(...r[0]), inside = centreOf([next]);
        for (let i = 1; i < n - 1; i++) tri(p0, P(...r[i]), P(...r[i + 1]), inside);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.computeVertexNormals();
    put(g, mat);
  }
  const slab = (mat, u0, u1, v0, v1, y0, y1) => loft(mat, [
    [[u0, v0, y0], [u0, v1, y0], [u0, v1, y1], [u0, v0, y1]],
    [[u1, v0, y0], [u1, v1, y0], [u1, v1, y1], [u1, v0, y1]],
  ]);
  const bx = (mat, u, v, y, du, dv, dy) => slab(mat, u - du / 2, u + du / 2, v - dv / 2, v + dv / 2, y - dy / 2, y + dy / 2);
  // A thin member between two (u, v, y) points; round = cylinder (stays, rods), else a square bar.
  // The builder's own bar() places in scene space without our yaw, so rotate its end points here.
  const R = (u, v, y) => { const [x, , z] = P(u, v, y); return [x * Math.cos(yaw) + z * Math.sin(yaw), y, -x * Math.sin(yaw) + z * Math.cos(yaw)]; };
  const bar = (mat, a, c, w, round = false) => b.bar(mat, R(...a), R(...c), w, w, 0, round, 0);

  // ---- girder ----------------------------------------------------------------------------------------------
  const stations = new Set([-HL, HL, DIM.pylonU, DIM.southPierU]);
  const haunchStep = near ? 3 : 6;
  for (const c of [DIM.pylonU, DIM.southPierU]) {
    for (let d = -DIM.haunchHalf; d <= DIM.haunchHalf + 1e-6; d += haunchStep) stations.add(Math.min(HL, Math.max(-HL, +(c + d).toFixed(3))));
  }
  const girderU = [...stations].sort((a, c) => a - c);
  loft('concrete', girderU.map((u) => {
    const d = girderDepthAt(u);
    return [[u, -WING, H], [u, WING, H], [u, WING, H - 0.5], [u, SOFFIT, H - d], [u, -SOFFIT, H - d], [u, -WING, H - 0.5]];
  }));

  // ---- pylons, piers, abutments ---------------------------------------------------------------------------
  const pylonBottom = -1.4;
  for (const side of [-1, 1]) {
    const levels = near ? [pylonBottom, 4, 9, 14, DIM.pylonRise] : [pylonBottom, DIM.pylonRise];
    loft('concrete', levels.map((y) => {
      const t = (y - pylonBottom) / (DIM.pylonRise - pylonBottom);
      const a = 1.15 - 0.55 * t, c = 0.85 - 0.38 * t, v = pylonV(side, y);
      return [[DIM.pylonU - a, v - c, H + y], [DIM.pylonU + a, v - c, H + y], [DIM.pylonU + a, v + c, H + y], [DIM.pylonU - a, v + c, H + y]];
    }));
    // pylon pier legs: from the datum up into the girder haunch
    bx('concrete', DIM.pylonU, side * DIM.pylonBaseV, (H - 1.0) / 2, 3.4, 1.9, H - 1.0);
    // south pier legs
    bx('concrete', DIM.southPierU, side * 5.2, (H - 0.9) / 2, 2.6, 1.5, H - 0.9);
  }
  // End piers under the abutment ends of the girder: two stout legs each, where the approach viaducts take over.
  for (const end of [-1, 1]) for (const side of [-1, 1]) bx('concrete', end * (HL - 1.8), side * 3.9, (H - 3.4) / 2, 3.2, 2.6, H - 3.4);

  // ---- parapet, track, overhead line ----------------------------------------------------------------------
  const L2 = HL - 0.4;
  for (const side of [-1, 1]) {
    bar('rail', [-L2, side * RAIL_V, H + 1.2], [L2, side * RAIL_V, H + 1.2], 0.05);
    bar('rail', [-L2, side * RAIL_V, H + 0.62], [L2, side * RAIL_V, H + 0.62], 0.04);
    if (near) for (let u = -L2; u <= L2 + 0.01; u += 2.6) bx('rail', u, side * RAIL_V, H + 0.6, 0.07, 0.07, 1.24);
    else for (const u of [-L2, -L2 / 2, 0, L2 / 2, L2]) bx('rail', u, side * RAIL_V, H + 0.6, 0.1, 0.1, 1.24);
    // track slab and running rails
    bx('track', 0, side * DIM.trackOffset, H + 0.07, 2 * L2, 3.0, 0.18);
    if (near) for (const r of [-0.7175, 0.7175]) bx('rail', 0, side * DIM.trackOffset + r, H + 0.2, 2 * L2, 0.07, 0.12);
  }
  // anchor blisters: the support every stay ends on, just outside the deck edge
  const stays = stayList();
  for (const s of stays) bx('concrete', s.b[0], s.b[1], H - 0.2, 0.7, 0.55, 0.7);
  // overhead line: two wires over the tracks, each held by an arm on a mast at both ends of the deck and, near,
  // by more masts along it (away from the stay anchors)
  for (const side of [-1, 1]) {
    bar('rail', [-L2, side * DIM.trackOffset, H + 5.4], [L2, side * DIM.trackOffset, H + 5.4], 0.04);
    for (const u of [-L2, L2]) {
      bar('steel', [u, side * RAIL_V, H - 0.05], [u, side * RAIL_V, H + 6.4], 0.09);
      bar('steel', [u, side * RAIL_V, H + 5.9], [u, side * DIM.trackOffset, H + 5.4], 0.05);
    }
  }
  if (near) {
    const anchors = stays.map((s) => s.b[0]);
    let i = 0;
    for (let u = -L2 + 14; u < L2 - 10; u += 40) {
      if (anchors.some((a) => Math.abs(a - u) < 2.2)) continue;
      const side = i++ % 2 ? 1 : -1;
      bar('steel', [u, side * RAIL_V, H - 0.05], [u, side * RAIL_V, H + 6.4], 0.09);
      bar('steel', [u, side * RAIL_V, H + 5.9], [u, side * DIM.trackOffset, H + 5.4], 0.05);
    }
  }

  // ---- stays ----------------------------------------------------------------------------------------------
  for (const s of stays) bar('steel', s.a, s.b, near ? 0.085 : 0.11, true);

  // ---- the hung path -------------------------------------------------------------------------------------
  const [pe0, pe1] = DIM.pathEnds;
  const pathU = [pe0, DIM.pathFlat[0], DIM.pathFlat[1], pe1];
  const PW = DIM.pathWidth / 2;
  const ring = (u, v0, v1, dy0, dy1) => { const y = pathYAt(u); return [[u, v0, y + dy0], [u, v1, y + dy0], [u, v1, y + dy1], [u, v0, y + dy1]]; };
  if (near) {
    loft('concrete', pathU.map((u) => ring(u, -PW, PW, -DIM.pathSlab, 0)));
    // timber margins and an asphalt strip, 10 cm proud of the slab (they sink 2 cm into it, never coplanar)
    for (const [mat, v0, v1] of [['timber', -PW, -2], ['asphalt', -2, 2], ['timber', 2, PW]]) {
      loft(mat, pathU.map((u) => ring(u, v0, v1, -0.02, PATH_DECK)));
    }
  } else {
    // far: one solid, decking on top, no layered faces
    loft('timber', pathU.map((u) => ring(u, -PW, PW, -DIM.pathSlab, PATH_DECK)));
  }
  // handrails along the path's edges, following its ramps
  for (const side of [-1, 1]) {
    for (let k = 0; k < pathU.length - 1; k++) {
      const u0 = pathU[k], u1 = pathU[k + 1];
      for (const h of near ? [1.25, 0.65] : [1.25]) bar('rail', [u0, side * (PW - 0.05), pathYAt(u0) + h], [u1, side * (PW - 0.05), pathYAt(u1) + h], 0.045);
    }
    const posts = new Set([pe0, pe1, ...pathU]);
    for (let u = pe0; u < pe1; u += near ? 3 : 19) posts.add(+u.toFixed(3));
    for (const u of posts) bx('rail', u, side * (PW - 0.05), pathYAt(u) + 0.6, 0.06, 0.06, 1.2);
  }
  // hanger rods from the girder soffit down into the slab, with a luminaire on every other one
  for (const r of hangerList(near)) {
    bar('steel', [r.u, r.v, r.bottom], [r.u, r.v, r.top], 0.06, true);
    if (r.lamp) bx('lamp', r.u, r.v, pathYAt(r.u) + 3.7, 0.3, 0.3, 0.2);
  }
  // end walls: the path stops against the bank on a wall that runs from the slab down to grade (a wall of the bank in
  // Full 3D world, where the terrain covers all but its top; the landing on the flat map)
  [[pe0, -1], [pe1, 1]].forEach(([u, dir]) => {
    const top = pathYAt(u) - 0.2, wall = 1.4; // the wall tucks 20 cm up into the slab and runs 1.4 m under it
    bx('concrete', u - dir * (wall / 2 - 0.5), 0, top / 2, wall, DIM.pathWidth, top);
  });
  // art panels on the soffit, where it runs flat (stylised tones, three materials)
  if (near) {
    let n = 0;
    const flat = (u) => Math.abs(u - DIM.pylonU) > DIM.haunchHalf + 2 && Math.abs(u - DIM.southPierU) > DIM.haunchHalf + 2;
    for (let u = -HL + 5; u < HL - 5; u += 2.9) {
      if (!flat(u) || !flat(u + 2.2)) continue;
      [-1.95, -0.65, 0.65, 1.95].forEach((v, c) => {
        const tone = ['art1', 'art2', 'art3'][(n * 7 + c * 3 + (n >> 2)) % 3];
        bx(tone, u + 1.1, v, H - DIM.girderDepth - 0.06, 2.2, 1.15, 0.16);
      });
      n++;
    }
  }

  // ---- guideway approaches: the girder runs on to grade along the mapped Valley Line --------------------------------
  const putS = (g, mat) => b.put(g, mat, 0, 0); // scene space: no yaw
  const barS = (mat, a, c, w, round = false) => b.bar(mat, a, c, w, w, 0, round, 0);
  // Prism through rings of scene-space points (flat shaded, wound outward by testing against the ring pair's centre).
  function loftS(mat, rings, capEnd = true) {
    const pos = [], n = rings[0].length;
    const centreOf = (rs) => { const c = new THREE.Vector3(); for (const r of rs) for (const p of r) c.add(new THREE.Vector3(...p)); return c.multiplyScalar(1 / (rs.length * n)); };
    const tri = (a, c, d, inside) => {
      const A = new THREE.Vector3(...a), C = new THREE.Vector3(...c), D = new THREE.Vector3(...d);
      const normal = C.clone().sub(A).cross(D.clone().sub(A));
      if (normal.lengthSq() < 1e-9) return;
      if (normal.dot(A.clone().add(C).add(D).multiplyScalar(1 / 3).sub(inside)) < 0) pos.push(...a, ...d, ...c); else pos.push(...a, ...c, ...d);
    };
    for (let k = 0; k < rings.length - 1; k++) {
      const inside = centreOf([rings[k], rings[k + 1]]);
      for (let i = 0; i < n; i++) { const j = (i + 1) % n; tri(rings[k][i], rings[k][j], rings[k + 1][j], inside); tri(rings[k][i], rings[k + 1][j], rings[k + 1][i], inside); }
    }
    if (capEnd) { const r = rings.at(-1), inside = centreOf([rings.at(-2)]); for (let i = 1; i < n - 1; i++) tri(r[0], r[i], r[i + 1], inside); }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.computeVertexNormals();
    putS(g, mat);
  }
  const approaches = [alignment(SOUTH_LINE), alignment(NORTH_LINE)];
  const stepS = near ? 8 : 20;
  for (const line of approaches) {
    const north = line === approaches[1];
    const endS = north ? PORTAL.endS : approachLength; // the north guideway ends inside the tunnel portal
    const ss = [];
    for (let s = 0; s < endS + 1e-6; s += stepS) ss.push(s);
    if (ss.at(-1) < endS - 0.01) ss.push(endS);
    const frame = (s) => { const q = line.at(s), lx = -q.tz, lz = q.tx; return { q, pt: (v, y) => [q.x + lx * v, Math.max(0, y), q.z + lz * v] }; };
    const girder = (s) => {
      const { pt } = frame(s), top = approachY(s), d = approachDepth(s);
      return [pt(-WING, top), pt(WING, top), pt(WING, top - 0.5), pt(SOFFIT, top - d), pt(-SOFFIT, top - d), pt(-WING, top - 0.5)];
    };
    loftS('concrete', ss.map(girder), true);
    // track slabs, running rails, parapet rails and posts follow the deck
    for (const side of [-1, 1]) {
      loftS('track', ss.map((s) => { const { pt } = frame(s), top = approachY(s); return [pt(side * DIM.trackOffset - 1.5, top - 0.02), pt(side * DIM.trackOffset + 1.5, top - 0.02), pt(side * DIM.trackOffset + 1.5, top + 0.16), pt(side * DIM.trackOffset - 1.5, top + 0.16)]; }), false);
      for (let i = 0; i < ss.length - 1; i++) {
        const A = frame(ss[i]).pt, B = frame(ss[i + 1]).pt, yA = approachY(ss[i]), yB = approachY(ss[i + 1]);
        if (yA < 0.6 && yB < 0.6) continue;
        barS('rail', A(side * RAIL_V, yA + 1.2), B(side * RAIL_V, yB + 1.2), 0.05);
        barS('rail', A(side * RAIL_V, yA + 0.62), B(side * RAIL_V, yB + 0.62), 0.04);
        if (near) for (const r of [-0.7175, 0.7175]) barS('rail', A(side * DIM.trackOffset + r, yA + 0.2), B(side * DIM.trackOffset + r, yB + 0.2), 0.07);
      }
      if (near) for (let s = 2; s < endS; s += 2.6) { const { pt } = frame(s), y = approachY(s); if (y > 0.6) barS('rail', pt(side * RAIL_V, y), pt(side * RAIL_V, y + 1.22), 0.07); }
    }
    // overhead line: masts every 40 m on alternating sides, one wire over each track. Every mast carries BOTH wires
    // (an arm to its own track and a longer one across to the far track), so the first and last mast, where the wires
    // end, hold both ends. The line starts on the main deck's own wire ends (the first span joins them).
    if (near) {
      const flip = line === approaches[0] ? -1 : 1, endU = flip * L2; // the south line runs towards -u
      let i = 0, prev = [-1, 1].map((t) => R(endU, t * flip * DIM.trackOffset, H + 5.4));
      for (let s = 20; s < endS - 12; s += 40, i++) {
        const { pt } = frame(s), y = approachY(s), side = i % 2 ? 1 : -1;
        barS('steel', pt(side * RAIL_V, y - 0.05), pt(side * RAIL_V, y + 6.4), 0.09);
        barS('steel', pt(side * RAIL_V, y + 5.9), pt(side * DIM.trackOffset, y + 5.4), 0.05);
        barS('steel', pt(side * RAIL_V, y + 6.2), pt(-side * DIM.trackOffset, y + 5.4), 0.05);
        const wire = [-1, 1].map((t) => pt(t * DIM.trackOffset, y + 5.4));
        wire.forEach((w, k) => barS('rail', prev[k], w, 0.04));
        prev = wire;
      }
      if (north) { // the wires run into the tunnel and end on droppers from its roof
        const { pt } = frame(PORTAL.dropS), y = approachY(PORTAL.dropS);
        [-1, 1].forEach((t, k) => {
          const w = pt(t * DIM.trackOffset, y + 5.4);
          barS('rail', prev[k], w, 0.04);
          barS('steel', w, pt(t * DIM.trackOffset, PORTAL.roofY + 0.1), 0.06);
        });
      }
    }
    // piers: a pair of legs every 32 m while the soffit is clear of the ground, running up into the girder
    for (let s = APPROACH.pierEvery; s < endS; s += APPROACH.pierEvery) {
      const top = approachY(s) - approachDepth(s) + 0.1;
      if (top < 0.9) continue;
      const q = line.at(s), lx = -q.tz, lz = q.tx;
      for (const side of [-1, 1]) {
        const cx = q.x + lx * side * 3.9, cz = q.z + lz * side * 3.9, hl = 1.3, hw = 0.8;
        const ring = (y) => [[-hl, -hw], [hl, -hw], [hl, hw], [-hl, hw]].map(([a, c]) => [cx + q.tx * a + lx * c, y, cz + q.tz * a + lz * c]);
        loftS('concrete', [ring(0), ring(top)], false);
      }
    }
  }

  // ---- north tunnel portal -----------------------------------------------------------------------------------
  // Where the Valley Line goes underground (u = 169.5, see PORTAL): a concrete headwall with a rectangular opening, wing
  // walls splaying back along the cutting, a dark recess behind it that the tracks and wires run into. The walls stand on
  // the datum; in Full 3D world the hill buries the lower part and the ground behind.
  {
    const { u, thick, half, headHalf, top, floorY, roofY, depth, wingLen, wingHalf, wingThick } = PORTAL;
    const u1 = u + depth;
    for (const side of [-1, 1]) {
      const [v0, v1] = side < 0 ? [-headHalf, -half] : [half, headHalf];
      slab('concrete', u, u + thick, v0, v1, 0, top); // jamb: the headwall either side of the opening
      // wing wall: from just inside the headwall back along the cutting, splaying out and stepping down to the rail level
      const wing = (uu, vi, y1) => { const a = side * vi, c = side * (vi + wingThick); return [[uu, Math.min(a, c), 0], [uu, Math.max(a, c), 0], [uu, Math.max(a, c), y1], [uu, Math.min(a, c), y1]]; };
      loft('concrete', [wing(u + 0.3, wingHalf[0], top), wing(u - wingLen, wingHalf[1], approachY(u - DIM.halfLength - wingLen) + 1.4)]);
      // recess: concrete shell round a dark lining, so the opening reads as a bore and not a painted square
      slab('concrete', u + thick, u1, side < 0 ? -half - 1.0 : half + 0.15, side < 0 ? -half - 0.15 : half + 1.0, floorY, roofY + 0.15);
      slab('tunnel', u + thick, u1, side < 0 ? -half - 0.15 : half, side < 0 ? -half : half + 0.15, floorY, roofY + 0.15);
    }
    slab('concrete', u, u + thick, -half, half, 0, floorY); // sill under the opening
    slab('concrete', u, u + thick, -half, half, roofY, top); // lintel
    slab('concrete', u + thick, u1, -half - 1.0, half + 1.0, roofY + 0.15, roofY + 1.1); // roof
    slab('tunnel', u + thick, u1, -half, half, roofY, roofY + 0.15); // lining of the roof
    slab('tunnel', u1 - 0.6, u1, -half, half, floorY, roofY); // the dark end of the bore
    slab('concrete', u + thick, u1, -half - 1.0, half + 1.0, 0, floorY); // plinth: the recess stands on the ground
    if (near) slab('concrete', u - 0.25, u + thick + 0.25, -headHalf - 0.25, headHalf + 0.25, top - 0.05, top + 0.4); // coping, 40 cm proud
  }
  return b.finish();
}
