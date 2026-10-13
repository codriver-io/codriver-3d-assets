import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { roofIds, roofStations, roofPoint, ringOf, oval, tierHeight, structure, memberGeometry } from './estadio-nacional-costa-rica-parts.js';

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near', b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const face = (mat, pts, normal) => {
    const positions = pts.flat(), indices = [];
    for (let i = 1; i < pts.length - 1; i++) {
      const a = new THREE.Vector3(...pts[0]), c = new THREE.Vector3(...pts[i]), d = new THREE.Vector3(...pts[i + 1]);
      const n = c.clone().sub(a).cross(d.clone().sub(a));
      if (n.lengthSq() < 1e-10) continue;
      if (normal && n.dot(new THREE.Vector3(...normal)) < 0) indices.push(0, i + 1, i);
      else indices.push(0, i, i + 1);
    }
    if (!indices.length) return;
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); g.setIndex(indices); g.computeVertexNormals(); b.put(g, mat);
  };

  // A stepped annulus remains hollow. Blue upper tiers, red lower tiers, concrete
  // aisle sectors: actual open rows, not a colour texture or a closed roof disk.
  const sectors = near ? 96 : 48, rows = near ? 24 : 5;
  for (let i = 0; i < sectors; i++) {
    const t0 = i * 2 * Math.PI / sectors, t1 = (i + 1) * 2 * Math.PI / sectors;
    const n = [Math.cos((t0 + t1) / 2), 0, Math.sin((t0 + t1) / 2)];
    for (let row = 0; row < rows; row++) {
      const f0 = row / rows, f1 = (row + 1) / rows;
      const y0 = t => 1.1 + tierHeight(t) * f0, y1 = t => 1.1 + tierHeight(t) * f1;
      const a = oval(t0, f0, y1(t0)), c = oval(t1, f0, y1(t1)), d = oval(t1, f1, y1(t1)), e = oval(t0, f1, y1(t0));
      const aisle = i % (near ? 12 : 6) === 0;
      // Split each tread: concrete riser and rear margin meet the seat ribbon
      // without a backing face under a parallel seat surface.
      const fm = f0 + (f1 - f0) * 0.18;
      const m0 = oval(t0, fm, y1(t0)), m1 = oval(t1, fm, y1(t1));
      face('concrete', [oval(t0, f0, y0(t0)), oval(t1, f0, y0(t1)), c, a], n.map(v => -v));
      face('concrete', [a, c, m1, m0], [0, 1, 0]);
      face(aisle || row === Math.floor(rows * 0.43) ? 'concrete' : row < rows * 0.43 ? 'red' : 'blue', [m0, m1, d, e], [0, 1, 0]);
    }
    // Plinth, inset concourse glazing and white structural fascia. Bands are
    // disjoint in height; louvres stand 1.8 m outside the recessed dark skin.
    const high0 = 1.1 + tierHeight(t0), high1 = 1.1 + tierHeight(t1);
    const wallPoint = (t, y, relief = -1.8) => { const p = oval(t, 1, y); p[0] += relief * Math.cos(t); p[2] += relief * Math.sin(t); return p; };
    for (const [y0, y1, mat] of [[0, 2.4, 'concrete'], [2.4, 6.3, i % (near ? 4 : 2) === 0 ? 'concrete' : 'glass'], [6.3, 7.6, 'white']]) {
      face(mat, [wallPoint(t0, y0), wallPoint(t1, y0), wallPoint(t1, y1), wallPoint(t0, y1)], n);
    }
    face('glass', [wallPoint(t0, 7.6), wallPoint(t1, 7.6), wallPoint(t1, high1 - 1.2), wallPoint(t0, high0 - 1.2)], n);
    face('white', [wallPoint(t0, high0 - 1.2), wallPoint(t1, high1 - 1.2), wallPoint(t1, high1), wallPoint(t0, high0)], n);
    face('concrete', [wallPoint(t0, high0), wallPoint(t1, high1), oval(t1, 1, high1), oval(t0, 1, high0)], [0, 1, 0]);
    // Near keeps six louvre rows, far four broader rows. These are the white
    // wrapper's main identity, with actual open shadows between blades.
    const fins = near ? 6 : 4, blade = near ? 1.25 : 1.65;
    for (let row = 0; row < fins; row++) {
      const y0 = 8 + (high0 - 10.2) * row / fins, y1 = 8 + (high1 - 10.2) * row / fins;
      const pts = [wallPoint(t0, y0, 0.1), wallPoint(t1, y1, 0.1), wallPoint(t1, y1 + blade, 0.1), wallPoint(t0, y0 + blade, 0.1)];
      face('white', pts, n);
      face('white', [wallPoint(t0, y0 + blade, -1.8), wallPoint(t1, y1 + blade, -1.8), pts[2], pts[3]], [0, 1, 0]);
      face('white', [wallPoint(t0, y0, -1.8), wallPoint(t1, y1, -1.8), pts[1], pts[0]], [0, -1, 0]);
    }
    // Radial white pilasters link the bands. Coarser cadence survives far.
    if (i % (near ? 3 : 2) === 0) {
      const p = oval((t0 + t1) / 2, 1, high0 / 2);
      b.box('white', p, [0.9, high0, 1.0], -(t0 + t1) / 2);
    }
    // Inside retaining wall closes the underside of the seating shell.
    face('concrete', [oval(t0, 0, 0), oval(t1, 0, 0), oval(t1, 0, 1.1), oval(t0, 0, 1.1)], n.map(v => -v));
  }

  // Turf and eight-lane track use disjoint planar regions; oval footprint of
  // the green apron matches the lower bowl. A standard capsule athletic oval.
  const trackN = near ? 64 : 32, trackRing = [];
  for (let side = 0; side < 2; side++) for (let i = 0; i <= trackN / 2; i++) {
    const t = side * Math.PI + i * Math.PI / (trackN / 2);
    const sin = Math.sin(t); trackRing.push([Math.cos(t), sin, side === 0 ? 42 : -42]);
  }
  const cp = (r, p, y = 0.12) => [r * p[0], y, r * p[1] + p[2]];
  const field = trackRing.map(p => cp(38, p));
  for (let i = 0; i < trackRing.length; i++) {
    const j = (i + 1) % trackRing.length, a = trackRing[i], c = trackRing[j];
    face('track', [cp(38, a), cp(38, c), cp(48, c), cp(48, a)], [0, 1, 0]);
    const theta0 = Math.atan2(cp(48, a)[2] / 98, cp(48, a)[0] / 62), theta1 = Math.atan2(cp(48, c)[2] / 98, cp(48, c)[0] / 62);
    face('grass', [cp(48, a), cp(48, c), oval(theta1, 0, 0.12), oval(theta0, 0, 0.12)], [0, 1, 0]);
  }
  face('grass', field, [0, 1, 0]);
  // Geometric field markings, 0.6 m above the turf (far depth precision); no
  // image or lettering is retained. One line material joins the white shell.
  const line = (x0, z0, x1, z1) => {
    const dx = x1 - x0, dz = z1 - z0, k = 0.12 / Math.hypot(dx, dz);
    face('white', [[x0 - dz * k, 0.72, z0 + dx * k], [x1 - dz * k, 0.72, z1 + dx * k], [x1 + dz * k, 0.72, z1 - dx * k], [x0 + dz * k, 0.72, z0 - dx * k]], [0, 1, 0]);
  };
  for (const x of [-34, 34]) line(x, -52.5, x, 52.5);
  for (const z of [-52.5, 0, 52.5]) line(-34, z, 34, z);
  for (const sign of [-1, 1]) {
    line(-20.16, sign * 52.5, -20.16, sign * 36); line(20.16, sign * 52.5, 20.16, sign * 36);
    line(-20.16, sign * 36, 20.16, sign * 36);
  }
  for (let i = 0, n = near ? 32 : 16; i < n; i++) line(9.15 * Math.cos(i * 2 * Math.PI / n), 9.15 * Math.sin(i * 2 * Math.PI / n), 9.15 * Math.cos((i + 1) * 2 * Math.PI / n), 9.15 * Math.sin((i + 1) * 2 * Math.PI / n));

  // Roof shells share all cuts with their fascia and soffit: no T-junctions,
  // exact OSM sawtooth plan and the same open central aperture in both LODs.
  for (const id of roofIds) {
    const zs = roofStations(id, detail), strips = near ? 4 : 2;
    for (let i = 0; i < zs.length - 1; i++) for (let j = 0; j < strips; j++) {
      const a = j / strips, c = (j + 1) / strips;
      face('white', [roofPoint(id, zs[i], a), roofPoint(id, zs[i + 1], a), roofPoint(id, zs[i + 1], c), roofPoint(id, zs[i], c)], [0, 1, 0]);
      face('white', [roofPoint(id, zs[i], a, true), roofPoint(id, zs[i + 1], a, true), roofPoint(id, zs[i + 1], c, true), roofPoint(id, zs[i], c, true)], [0, -1, 0]);
    }
    for (let i = 0; i < zs.length - 1; i++) for (const side of [0, 1]) {
      const a = roofPoint(id, zs[i], side), c = roofPoint(id, zs[i + 1], side);
      face('white', [a, c, roofPoint(id, zs[i + 1], side, true), roofPoint(id, zs[i], side, true)], [Math.sign(a[0]) * (side ? 1 : -1), 0, 0]);
    }
  }

  // Mapped north/south entrance blocks, four angled concourse connectors,
  // and four independent arch thrust foundations are retained, not generic boxes.
  function mappedSolid(id, h, mat = 'concrete', pyramid = false) {
    const pts = ringOf(id), center = pts.reduce((s, p) => [s[0] + p[0] / pts.length, s[1] + p[1] / pts.length], [0, 0]);
    const shape = pts.map(([x, z]) => new THREE.Vector2(x, z)), indices = THREE.ShapeUtils.triangulateShape(shape, []);
    for (const tri of indices) face(mat, tri.map(i => [pts[i][0], h, pts[i][1]]), [0, 1, 0]);
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], c = pts[(i + 1) % pts.length], n = [(a[0] + c[0]) / 2 - center[0], 0, (a[1] + c[1]) / 2 - center[1]];
      face(mat, [[a[0], 0, a[1]], [c[0], 0, c[1]], [c[0], h, c[1]], [a[0], h, a[1]]], n);
      if (pyramid) face(mat, [[a[0], h, a[1]], [c[0], h, c[1]], [center[0], h + 1.5, center[1]]], [n[0], 1, n[2]]);
    }
  }
  for (const id of [656611538, 657432492]) mappedSolid(id, 10, 'white');
  for (const id of [656611752, 656611753, 656611754, 656611755]) mappedSolid(id, 5);
  for (const id of [656371094, 656371095, 656371096, 656371097]) mappedSolid(id, 3.5, 'concrete', true);
  // Narrow axial access stairs are mapped appendages. Their tops descend
  // continuously to grade; they are outside the track, not a site-wide slab.
  for (const id of [656612381, 657432493]) {
    const ring = ringOf(id), xs = ring.map(p => p[0]), zs = ring.map(p => p[1]);
    const x = (Math.min(...xs) + Math.max(...xs)) / 2, z0 = Math.min(...zs), z1 = Math.max(...zs), w = Math.max(...xs) - Math.min(...xs);
    const steps = near ? 12 : 6;
    for (let i = 0; i < steps; i++) {
      const h = 4 * (id === 656612381 ? (steps - i) / steps : (i + 1) / steps);
      b.box('concrete', [x, h / 2, z0 + (z1 - z0) * (i + 0.5) / steps], [w, h, (z1 - z0) / steps]);
    }
  }

  const assembly = structure(detail);
  for (const s of assembly.supports) {
    b.put(s.geometry, s.material);
    if (s.name.startsWith('column-base-')) {
      const pedestal = new THREE.BoxGeometry(2.4, s.at[1], 2.4); pedestal.translate(s.at[0], s.at[1] / 2, s.at[2]);
      b.put(pedestal, 'concrete');
    }
  }
  for (const m of assembly.members) b.put(memberGeometry(m), 'steel');
  // North/south video boards: uprights root at grade and disappear into a
  // white frame, with a dark screen inset into a real opening (no backing pane).
  for (const sign of [-1, 1]) {
    const z = sign * 127;
    b.box('white', [0, 19, z], [22, 1, 1.8]); b.box('white', [0, 29, z], [22, 1, 1.8]);
    for (const x of [-10.5, 10.5]) b.box('white', [x, 24, z], [1, 9, 1.8]);
    b.box('glass', [0, 24, z], [20, 9, 1.1]);
    for (const x of [-7, 7]) b.box('white', [x, 9.3, z], [1.4, 18.6, 1.5]);
  }
  const root = b.finish();
  Object.defineProperty(root.userData, 'assembly', { value: assembly });
  return root;
}
