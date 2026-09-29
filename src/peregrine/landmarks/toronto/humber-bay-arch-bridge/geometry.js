import * as THREE from 'three';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { DIM, ribY, ribPoint, hangerStations, hangerEnds } from './humber-bay-arch-bridge-site.js';

const V3 = (a) => new THREE.Vector3(a[0], a[1], a[2]);

/**
 * Humber Bay Arch Bridge (1994): a 139 m foot and cycle bridge over the mouth of
 * the Humber River. Two white 1.2 m steel-pipe ribs rise in parabolas and lean
 * in towards each other, braced by a triangulated ladder of steel between them
 * (the "Thunderbird"), and hang a 5.4 m deck on 44 stainless rods. Concrete
 * abutments carry board-formed pylon blocks at each end.
 *
 * Authored in the bridge's own frame (u along the axis, v across, y up) and
 * rotated once onto the mapped bearing; foundations sit at y = 0, the deck above.
 */
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const yaw = (90 - SPEC.frontageBearing) * Math.PI / 180; // local +u -> mapped axis bearing
  const put = (g, mat) => { g.rotateY(yaw); b.put(g, mat, 0, 0); };
  const { deckY, slab } = DIM;
  const deckTop = deckY, slabBottom = deckY - slab;

  // ---- primitives -------------------------------------------------------------------------
  const hull = (points, mat) => put(new ConvexGeometry(points.map(V3)), mat);
  const box = (mat, [u0, u1], [y0, y1], [v0, v1]) => hull([
    [u0, y0, v0], [u1, y0, v0], [u0, y1, v0], [u1, y1, v0], [u0, y0, v1], [u1, y0, v1], [u0, y1, v1], [u1, y1, v1],
  ], mat);
  // A square-section member between two points; `up` keeps its faces from rolling.
  const strut = (mat, a, c, w, d, up = [0, 1, 0]) => {
    const A = V3(a), C = V3(c), t = C.clone().sub(A);
    if (t.length() < 1e-4) return;
    t.normalize();
    let s = new THREE.Vector3().crossVectors(t, V3(up));
    if (s.length() < 1e-4) s = new THREE.Vector3().crossVectors(t, new THREE.Vector3(0, 0, 1));
    s.normalize(); const n = new THREE.Vector3().crossVectors(s, t).normalize();
    const pts = [];
    for (const P of [A, C]) for (const [i, j] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) pts.push(P.clone().addScaledVector(s, i * w / 2).addScaledVector(n, j * d / 2).toArray());
    hull(pts, mat);
  };
  // Smooth-shaded round tube along a polyline (ribs, hangers). Triangles are wound to match their
  // outward normals whatever direction the polyline runs in; ends are capped when `caps`.
  const tube = (mat, points, radius, sides, caps = true) => {
    const P = points.map(V3), n = P.length, ring = [], dirs = [], tan = [];
    for (let i = 0; i < n; i++) {
      const t = P[Math.min(i + 1, n - 1)].clone().sub(P[Math.max(i - 1, 0)]).normalize();
      let nn = new THREE.Vector3().crossVectors(t, new THREE.Vector3(0, 0, 1));
      if (nn.length() < 1e-4) nn = new THREE.Vector3().crossVectors(t, new THREE.Vector3(0, 1, 0));
      nn.normalize(); const bb = new THREE.Vector3().crossVectors(t, nn).normalize();
      tan.push(t); ring.push([]); dirs.push([]);
      for (let j = 0; j < sides; j++) {
        const a = j / sides * Math.PI * 2, d = nn.clone().multiplyScalar(Math.cos(a)).addScaledVector(bb, Math.sin(a));
        dirs[i].push(d); ring[i].push(P[i].clone().addScaledVector(d, radius));
      }
    }
    const pos = [], nor = [];
    const tri = (pa, pb, pc, na, nb, nc) => {
      const out = na.clone().add(nb).add(nc);
      const face = new THREE.Vector3().crossVectors(pb.clone().sub(pa), pc.clone().sub(pa));
      if (face.dot(out) < 0) { [pb, pc] = [pc, pb]; [nb, nc] = [nc, nb]; }
      for (const [p, q] of [[pa, na], [pb, nb], [pc, nc]]) { pos.push(p.x, p.y, p.z); nor.push(q.x, q.y, q.z); }
    };
    for (let i = 0; i < n - 1; i++) for (let j = 0; j < sides; j++) {
      const k = (j + 1) % sides;
      tri(ring[i][j], ring[i][k], ring[i + 1][j], dirs[i][j], dirs[i][k], dirs[i + 1][j]);
      tri(ring[i][k], ring[i + 1][k], ring[i + 1][j], dirs[i][k], dirs[i + 1][k], dirs[i + 1][j]);
    }
    if (caps) for (const [i, sign] of [[0, -1], [n - 1, 1]]) {
      const c = P[i], out = tan[i].clone().multiplyScalar(sign);
      for (let j = 0; j < sides; j++) tri(c, ring[i][j], ring[i][(j + 1) % sides], out, out, out);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
    put(g, mat);
  };

  // ---- ribs: two leaning parabolic pipes (sourced: 2 x 1 200 mm steel pipe) -------------------
  const ribSegments = near ? 72 : 30, ribSides = near ? 14 : 6;
  const ribUs = Array.from({ length: ribSegments + 1 }, (_, i) => -DIM.springU + 2 * DIM.springU * i / ribSegments);
  for (const side of [-1, 1]) tube('paint', ribUs.map((u) => ribPoint(side, u)), DIM.ribDiameter / 2, ribSides);

  // ---- the "Thunderbird" between the ribs -------------------------------------------------------------
  // A central spine of small X-braced frames hangs below the crown line, and flat white triangular wings
  // fan from each rib to it (photographs: the wings read as a sawtooth from below, a ladder from the side).
  // Stations are spaced evenly along the arch, not along the axis, so the cells keep their size on the steep ends.
  const nodeCount = near ? 40 : 20;
  const arc = [0]; const dense = Array.from({ length: 401 }, (_, i) => -DIM.springU + 2 * DIM.springU * i / 400);
  for (let i = 1; i < dense.length; i++) arc.push(arc[i - 1] + Math.hypot(dense[i] - dense[i - 1], ribY(dense[i]) - ribY(dense[i - 1])));
  const uAt = (s) => { let i = 1; while (i < arc.length - 1 && arc[i] < s) i++; const k = (s - arc[i - 1]) / (arc[i] - arc[i - 1]); return dense[i - 1] + k * (dense[i] - dense[i - 1]); };
  const arcAt = (u) => arc[Math.round((u + DIM.springU) / (2 * DIM.springU) * 400)];
  const s0 = arcAt(-DIM.ladderFoot), s1 = arcAt(DIM.ladderFoot);
  const nodes = Array.from({ length: nodeCount + 1 }, (_, i) => uAt(s0 + (s1 - s0) * i / nodeCount));
  const sy = (u) => ribY(u) - DIM.spineDrop, h = DIM.spineHalf, depth = DIM.spineDepth;
  const member = near ? 0.13 : 0.3;
  nodes.forEach((u, i) => {
    strut('paint', ribPoint(-1, u), ribPoint(1, u), member, member, [0, 1, 0]); // cross bar between the ribs
    if (!near) return;
    const top = sy(u), low = top - depth;
    for (const v of [-h, h]) strut('paint', [u, low, v], [u, top, v], 0.11, 0.11, [1, 0, 0]);          // spine posts
    for (const y of [low, top]) strut('paint', [u, y, -h], [u, y, h], 0.1, 0.1, [1, 0, 0]);             // frame rails
    strut('paint', [u, low, -h], [u, top, h], 0.07, 0.07, [1, 0, 0]); strut('paint', [u, low, h], [u, top, -h], 0.07, 0.07, [1, 0, 0]); // X bracing
    if (i < nodes.length - 1) {
      const nu = nodes[i + 1], nt = sy(nu), mu = (u + nu) / 2, mt = sy(mu);
      for (const v of [-h, h]) { strut('paint', [u, top, v], [nu, nt, v], 0.1, 0.1); strut('paint', [u, low, v], [nu, nt - depth, v], 0.08, 0.08); }
      // flat triangular wings: base on a bay of the rib, apex on the spine's top chord
      for (const side of [-1, 1]) {
        const P = [ribPoint(side, u), ribPoint(side, nu), [mu, mt, side * h]].map(V3);
        const n = new THREE.Vector3().crossVectors(P[1].clone().sub(P[0]), P[2].clone().sub(P[0])).normalize().multiplyScalar(0.03);
        hull([...P.map((p) => p.clone().add(n)), ...P.map((p) => p.clone().sub(n))].map((p) => p.toArray()), 'paint');
      }
    }
  });

  // ---- deck ---------------------------------------------------------------------------------------
  const half = DIM.clearSpan / 2;
  box('deck', [-half, half], [slabBottom, deckTop], [-DIM.deckHalf, DIM.deckHalf]);
  for (const s of [-1, 1]) box('girder', [-half, half], [deckY - DIM.girderDepth, deckTop - 0.02], s > 0 ? [DIM.deckHalf, DIM.deckHalf + 0.3] : [-DIM.deckHalf - 0.3, -DIM.deckHalf]);
  // Cross beams: one per hanger pair, deep in the middle, tapering to the hanger tips outside the deck.
  const stations = hangerStations();
  for (const u of stations) {
    const y1 = slabBottom, y0 = slabBottom - 0.3, yt = slabBottom - 0.13, w = DIM.outrigger;
    hull([-w, w].flatMap((v) => [[u - 0.2, y1, v], [u + 0.2, y1, v], [u - 0.2, yt, v], [u + 0.2, yt, v]])
      .concat([-2.0, 2.0].flatMap((v) => [[u - 0.2, y0, v], [u + 0.2, y0, v]])), 'paint');
    if (near) for (const s of [-1, 1]) box('steel', [u - 0.17, u + 0.17], [deckY - 0.9, deckY - 0.28], s > 0 ? [DIM.outrigger - 0.25, DIM.outrigger + 0.05] : [-DIM.outrigger - 0.05, -DIM.outrigger + 0.25]);
  }

  // ---- hangers: 44 stainless rods, 22 per rib ------------------------------------------------------
  const hangerR = near ? DIM.hangerDiameter / 2 : 0.06;
  for (const side of [-1, 1]) for (const u of stations) {
    const [top, foot] = hangerEnds(side, u);
    tube('steel', [top, foot], hangerR, near ? 5 : 3, false);
    if (near) { // the small white gusset that carries the rod under the pipe
      const drop = DIM.finDrop - 0.5; // from just inside the pipe down to the hanger's tip
      const g = new THREE.Shape([new THREE.Vector2(-0.45, 0), new THREE.Vector2(0.45, 0), new THREE.Vector2(0, -drop)]);
      const e = new THREE.ExtrudeGeometry(g, { depth: 0.06, bevelEnabled: false }); e.translate(0, 0, -0.03);
      e.translate(top[0], top[1] + drop, top[2]); put(e, 'paint');
    }
  }

  // ---- rails on the span and abutments ------------------------------------------------------------
  const railEnd = 65.5;
  for (const s of [-1, 1]) {
    const v = s * (DIM.deckHalf + 0.02);
    box('steel', [-railEnd, railEnd], [deckTop + 1.24, deckTop + 1.32], [v - 0.035, v + 0.035]);
    if (near) {
      for (const y of [0.25, 0.55, 0.85]) box('steel', [-half, half], [deckTop + y - 0.008, deckTop + y + 0.008], [v - 0.008, v + 0.008]);
      for (let u = -half; u <= half + 0.01; u += 2.5) box('steel', [u - 0.04, u + 0.04], [deckTop, deckTop + 1.3], [v - 0.05, v + 0.05]);
    } else for (let u = -half; u <= half + 0.01; u += 5) box('steel', [u - 0.05, u + 0.05], [deckTop, deckTop + 1.3], [v - 0.05, v + 0.05]);
  }

  // ---- abutments, rib feet, pylons, parapets and the ramps ---------------------------------------------
  const P0 = DIM.approachU, R = DIM.rampLength, width = 3.4, pave = 3.0, wall = 1.1;
  for (const e of [-1, 1]) {
    const U = (a, c) => (e > 0 ? [a, c] : [-c, -a]);
    box('concrete', U(half, P0), [0, slabBottom], [-width, width]);                        // abutment mass
    box('deck', U(half, P0), [slabBottom, deckTop], [-pave, pave]);                       // paving on top
    for (const s of [-1, 1]) box('concrete', U(half + 3.2, P0 - 2.5), [slabBottom, deckTop + wall], s > 0 ? [pave, width] : [-width, -pave]); // parapets
    // rib feet: the pipes land in chunky concrete shoes beside the deck
    for (const s of [-1, 1]) box('concrete', U(DIM.springU - 3.2, DIM.springU + 2.2), [0, 2.4], s > 0 ? [DIM.springV - 1.1, DIM.springV + 1.0] : [-DIM.springV - 1.0, -DIM.springV + 1.1]);
    // pylons flanking the path at the very end (sourced photos: board-formed concrete blocks with a medallion)
    for (const s of [-1, 1]) {
      const v = s > 0 ? [3.0, 6.6] : [-6.6, -3.0], p = U(P0 - 4, P0);
      box('concrete', p, [0, deckTop + 2.9], v);
      if (near) {
        for (const y of [0.85, 1.7, 2.55]) box('girder', [p[0] - 0.012, p[1] + 0.012], [deckTop + y - 0.012, deckTop + y + 0.012], [v[0] - 0.012, v[1] + 0.012]);
        const inner = s > 0 ? v[0] : v[1], face = s > 0 ? -0.02 : 0.02;
        const a = p[0] + (e > 0 ? 0.9 : 3.1); // recessed slot, 0.3 x 0.9 m, near the path-side corner of the block
        box('girder', [a - 0.15, a + 0.15], [deckTop + 0.45, deckTop + 1.35], [inner - 0.02, inner + 0.02]);
        const disc = new THREE.CylinderGeometry(0.34, 0.34, 0.04, 20); disc.rotateX(Math.PI / 2); // medallion
        disc.translate(p[0] + (e > 0 ? 2.7 : 1.3), deckTop + 1.75, inner + face); put(disc, 'steel');
      }
    }
    // the ramp: a closed wedge from deck level down to the flat-map ground, with parapets that follow it
    const a = e > 0 ? P0 : -P0, z = e > 0 ? P0 + R : -(P0 + R);
    hull([[a, 0, -pave], [a, deckTop, -pave], [z, 0, -pave], [z, 0.04, -pave], [a, 0, pave], [a, deckTop, pave], [z, 0, pave], [z, 0.04, pave]], 'deck');
    for (const s of [-1, 1]) {
      const v0 = s > 0 ? pave : -width, v1 = s > 0 ? width : -pave;
      hull([[a, 0, v0], [a, deckTop + wall, v0], [z, 0, v0], [z, wall, v0], [a, 0, v1], [a, deckTop + wall, v1], [z, 0, v1], [z, wall, v1]], 'concrete');
    }
  }

  const root = b.finish();
  root.traverse((o) => { if (o.isMesh) o.geometry.deleteAttribute('bridgeLift'); }); // free-standing: no road datum to fit
  root.userData.elevationDatum = 'Foundations on the flat-map datum (water level, y=0); deck surface ' + deckY + ' m above it.';
  return root;
}
