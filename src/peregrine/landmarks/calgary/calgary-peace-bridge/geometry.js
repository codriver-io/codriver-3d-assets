import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { DIM, YAW, ringPoint, strandInset, strandAngle, planeU, roofCells } from './calgary-peace-bridge-site.js';

const V3 = (a) => new THREE.Vector3(a[0], a[1], a[2]);

/**
 * Peace Bridge, Calgary (Santiago Calatrava, 2012): a single 126 m tube-girder span over the Bow River with
 * no pier in the water, 130.6 m out to out. A red-painted steel double helix, six right-handed and six
 * left-handed strands that braid into diamonds 6.3 m long, wraps a 7.3 x 5.85 m elliptical ring around the deck;
 * closed hoops stand at every other node plane, silver bars bisect the diamonds of the glazed roof, and the
 * roof panels are the pale glow material. The deck between the rails is 6.2 m: a 2.5 m two-way cycleway in
 * the middle, 1.85 m of pedestrian way each side. Concrete abutments take the end rings on both banks.
 *
 * Authored in the bridge's own frame (u along the axis toward the south-east, y up from the footway grade,
 * v across, to the right when facing +u) and turned once onto the mapped bearing. The walking surface is
 * 5 cm over y = 0 so it never fights the provider's footway; nothing is below -2.9 m.
 */
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const put = (g, mat) => { g.rotateY(YAW); b.put(g, mat, 0); };
  const { deckY, slab } = DIM;
  const deckTop = deckY, slabBottom = deckY - slab;

  // ---- primitives -------------------------------------------------------------------------------------
  const box = (mat, [u0, u1], [y0, y1], [v0, v1]) => {
    const g = new THREE.BoxGeometry(u1 - u0, y1 - y0, v1 - v0);
    g.translate((u0 + u1) / 2, (y0 + y1) / 2, (v0 + v1) / 2); put(g, mat);
  };
  // Triangle (or quad as two) wound so its normal points along `out`.
  const polys = [];
  const flat = (mat, pts, out) => {
    const P = pts.map(V3), pos = [], nor = [], idx = [];
    for (let i = 1; i < P.length - 1; i++) {
      const n = new THREE.Vector3().crossVectors(P[i].clone().sub(P[0]), P[i + 1].clone().sub(P[0]));
      const tri = n.dot(V3(out)) >= 0 ? [P[0], P[i], P[i + 1]] : [P[0], P[i + 1], P[i]];
      const f = new THREE.Vector3().crossVectors(tri[1].clone().sub(tri[0]), tri[2].clone().sub(tri[0])).normalize();
      for (const p of tri) { idx.push(pos.length / 3); pos.push(p.x, p.y, p.z); nor.push(f.x, f.y, f.z); }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); g.setIndex(idx);
    polys.push([g, mat]);
  };
  // Smooth-shaded round tube along a polyline (or a closed loop). The frame is built from `up`, and the
  // triangles are wound outward whatever way the polyline runs; open ends are not capped (they end inside a hoop or a node).
  const tube = (mat, points, radius, sides, { closed = false, up = [0, 0, 1] } = {}) => {
    const P = points.map(V3), n = P.length, U = V3(up), pos = [], nor = [], idx = [];
    for (let i = 0; i < n; i++) {
      const prev = closed ? P[(i + n - 1) % n] : P[Math.max(i - 1, 0)], next = closed ? P[(i + 1) % n] : P[Math.min(i + 1, n - 1)];
      const t = next.clone().sub(prev).normalize();
      let nn = new THREE.Vector3().crossVectors(t, U);
      if (nn.lengthSq() < 1e-8) nn = new THREE.Vector3().crossVectors(t, new THREE.Vector3(0, 1, 0));
      nn.normalize();
      const bb = new THREE.Vector3().crossVectors(t, nn);
      for (let j = 0; j < sides; j++) {
        const a = j / sides * Math.PI * 2, d = nn.clone().multiplyScalar(Math.cos(a)).addScaledVector(bb, Math.sin(a));
        const p = P[i].clone().addScaledVector(d, radius);
        pos.push(p.x, p.y, p.z); nor.push(d.x, d.y, d.z);
      }
    }
    const rows = closed ? n : n - 1;
    for (let i = 0; i < rows; i++) {
      const i1 = (i + 1) % n;
      for (let j = 0; j < sides; j++) {
        const k = (j + 1) % sides, a = i * sides + j, c = i * sides + k, d = i1 * sides + j, e = i1 * sides + k;
        idx.push(a, c, d, c, e, d);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); g.setIndex(idx);
    put(g, mat);
  };

  const half = DIM.halfCells / 2;
  const strandSides = near ? 6 : 4, hoopSides = near ? 6 : 4;
  const strandR = near ? DIM.strandR : DIM.strandRFar, inset = strandInset(strandR); // outer faces flush with the hoops'

  // ---- the double helix: 6 right-handed and 6 left-handed strands over the full 126 m ----------------------
  const steps = near ? 126 : 52;
  for (const hand of [1, -1]) for (let j = 0; j < DIM.strands; j++) {
    const pts = [];
    for (let i = 0; i <= steps; i++) {
      const u = -DIM.tubeHalf + 2 * DIM.tubeHalf * i / steps;
      pts.push(ringPoint(strandAngle(hand, j, u), u, inset));
    }
    tube('steel', pts, strandR, strandSides);
  }

  // ---- hoops: closed rings at every other node plane; the two end rings are heavier ------------------------
  const samples = near ? 56 : 20;
  for (let q = -half; q <= half; q += 2) {
    const end = Math.abs(q) === half, grow = end ? DIM.endHoopR - DIM.hoopR : 0, u = planeU(q);
    const pts = [];
    for (let k = 0; k < samples; k++) {
      const th = 2 * Math.PI * k / samples;
      pts.push([u, DIM.ringYc + (DIM.ringB - grow) * Math.sin(th), (DIM.ringA - grow) * Math.cos(th)]);
    }
    tube('steel', pts, end ? DIM.endHoopR : DIM.hoopR, hoopSides, { closed: true, up: [1, 0, 0] });
  }

  // ---- the glazed roof: a silver bar through every roof diamond and two glass panes, each double skinned -----
  // Each pane is the diamond's half (L, R, apex) shrunk about the middle of the bar by 0.78 (0.72 far): its long edge stays
  // on the silver bar, its other two edges stop a hand's width short of the red strands.
  const shrink = near ? 0.78 : 0.72, skin = 0.03; // the fatter the strands, the further the panes stop short of them
  for (const { c, phi } of roofCells()) {
    const L = ringPoint(phi, planeU(c - 1), inset), R = ringPoint(phi, planeU(c + 1), inset);
    const T = ringPoint(phi + Math.PI / DIM.strands, planeU(c), inset), B = ringPoint(phi - Math.PI / DIM.strands, planeU(c), inset);
    tube('rail', [L, R], near ? 0.055 : 0.07, near ? 5 : 3, { up: [0, 0, 1] });
    const M = V3(L).add(V3(R)).multiplyScalar(0.5);
    for (const apex of [T, B]) {
      const small = [L, R, apex].map((p) => M.clone().add(V3(p).sub(M).multiplyScalar(shrink)));
      const centre = small[0].clone().add(small[1]).add(small[2]).divideScalar(3), out = centre.clone().sub(V3([centre.x, DIM.ringYc, 0])).normalize();
      const faceN = new THREE.Vector3().crossVectors(small[1].clone().sub(small[0]), small[2].clone().sub(small[0])).normalize();
      const n = faceN.dot(out) >= 0 ? faceN : faceN.clone().negate();
      flat('glow', small.map((p) => p.clone().addScaledVector(n, skin).toArray()), n.toArray());
      if (near) flat('glow', small.map((p) => p.clone().addScaledVector(n, -skin).toArray()), n.clone().negate().toArray());
    }
  }

  // ---- deck: slab, red steel girder below it, markings, rails ----------------------------------------------
  const L0 = DIM.halfOverall;
  box('deck', [-L0, L0], [slabBottom, deckTop], [-DIM.deckHalf, DIM.deckHalf]);
  box('steel', [-DIM.abutIn - 0.3, DIM.abutIn + 0.3], [-0.82, slabBottom + 0.06], [-2.0, 2.0]); // ends run 0.3 m into the abutments
  if (near) { // paint stands 4 cm proud of the walking surface, sunk 2 cm into it
    const y0 = deckTop - 0.02, y1 = deckTop + 0.04, w = 0.05;
    for (const v of [-1.25, 1.25]) box('marking', [-L0 + 0.4, L0 - 0.4], [y0, y1], [v - w, v + w]); // cycleway edge lines
    for (let u = -L0 + 1.0; u < L0 - 2.0; u += 3.0) box('marking', [u, u + 1.5], [y0, y1], [-w, w]); // dashed centre line
  }
  const railY = deckTop + 1.1, railV = DIM.deckHalf - 0.12;
  for (const s of [-1, 1]) {
    box('rail', [-DIM.tubeHalf + 0.5, DIM.tubeHalf - 0.5], [railY, railY + 0.07], [s * railV - 0.06, s * railV + 0.06]); // top rail
    if (near) {
      for (let q = -half + 1; q < half; q++) box('rail', [planeU(q) - 0.025, planeU(q) + 0.025], [deckTop - 0.02, railY + 0.03], [s * railV - 0.025, s * railV + 0.025]); // posts at each node plane
      box('rail', [-DIM.tubeHalf + 0.5, DIM.tubeHalf - 0.5], [deckTop + 0.5, deckTop + 0.55], [s * railV - 0.02, s * railV + 0.02]); // mid rail
    }
  }

  // ---- abutments and landings ------------------------------------------------------------------------------
  for (const e of [-1, 1]) {
    const U = (a, c) => (e > 0 ? [a, c] : [-c, -a]);
    box('concrete', U(DIM.abutIn, L0 - 0.05), [DIM.abutDepth, -0.3], [-DIM.abutHalf, DIM.abutHalf]); // abutment mass, top inside the slab
    for (const s of [-1, 1]) box('concrete', U(DIM.tubeHalf + 0.45, L0), [-0.5, 0.95], s > 0 ? [DIM.deckHalf + 0.05, DIM.deckHalf + 0.45] : [-DIM.deckHalf - 0.45, -DIM.deckHalf - 0.05]); // landing parapets
  }

  for (const [g, mat] of polys) put(g, mat);
  const root = b.finish();
  root.traverse((o) => { if (o.isMesh) o.geometry.deleteAttribute('bridgeLift'); }); // free-standing: no road datum to fit
  root.userData.elevationDatum = 'Walking surface 5 cm over local grade y=0 (the provider footway); tube ring from -1.9 m to +4.05 m, abutments to -2.9 m.';
  return root;
}
