import { BufferGeometry, Float32BufferAttribute, Vector3 } from 'three';
import { bridgeBuilder } from '../../asset-geometry.js';
import { PROFILE as p, START, END, MID, TOWERS, SADDLE, CABLE_D, cableY } from './hardanger-bridge-profile.js';

/** Original bridge geometry: tapered concrete portals, closed aerodynamic box,
 * two suspended cable planes, cycleway, and short open tunnel mouths. */
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = bridgeBuilder({ ...p, meshStep: near ? 10 : 20 }, detail);
  const ck = (s) => near ? Math.min(2, Math.floor(s / p.BRIDGE_LENGTH * 3)) : 0;
  const P = (s, d, y) => new Vector3(...b.xyz(s, d, y));
  const h = p.deckHeight;
  // A closed loft with flat normals. Outward winding is determined per face,
  // including the end caps; asymmetric local sections never reverse normals.
  function loft(rings, centres, material, chunk, lift = 1) {
    const pos = [], idx = [];
    function face(points, out) {
      if (points[1].clone().sub(points[0]).cross(points[2].clone().sub(points[0])).dot(out) < 0) points.reverse();
      const i = pos.length / 3;
      for (const v of points) pos.push(...v.toArray());
      for (let k = 1; k + 1 < points.length; k++) idx.push(i, i + k, i + k + 1);
    }
    for (let j = 0; j + 1 < rings.length; j++) for (let k = 0; k < rings[j].length; k++) {
      const n = (k + 1) % rings[j].length;
      const points = [rings[j][k], rings[j][n], rings[j + 1][n], rings[j + 1][k]];
      const mid = points.reduce((a, v) => a.add(v), new Vector3()).multiplyScalar(0.25);
      face(points, mid.sub(centres[j].clone().add(centres[j + 1]).multiplyScalar(0.5)));
    }
    face([...rings[0]], centres[0].clone().sub(centres[1]));
    face([...rings.at(-1)], centres.at(-1).clone().sub(centres.at(-2)));
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); b.put(g, material, chunk, lift);
  }
  const cuts = near ? [0, p.BRIDGE_LENGTH / 3, p.BRIDGE_LENGTH * 2 / 3, p.BRIDGE_LENGTH] : [0, p.BRIDGE_LENGTH];
  function strips(mat, a, z, dl, dr, offset = 0, thickness = 0) {
    const split = [a, ...cuts.filter(s => s > a && s < z), z];
    for (let i = 1; i < split.length; i++) b.strip(mat, split[i - 1], split[i], dl, dr, offset, thickness, ck((split[i - 1] + split[i]) / 2));
  }
  // Entire visible structural deck with a six-sided wind fairing section.
  const deckCuts = [START, ...TOWERS, ...cuts.filter(s => s > START && s < END), END].sort((a,z)=>a-z);
  for (let i = 1; i < deckCuts.length; i++) {
    const a = deckCuts[i - 1], z = deckCuts[i], n = Math.ceil((z - a) / (near ? 12 : 24));
    const stations = Array.from({ length: n + 1 }, (_, k) => a + (z - a) * k / n);
    const suspended = (a + z) / 2 > TOWERS[0] && (a + z) / 2 < TOWERS[1];
    const shape = suspended ? [[-9.15, -0.25], [9.15, -0.25], [9.15, -0.8], [5.4, -3.25], [-5.4, -3.25], [-9.15, -0.8]] : [[-9.15, -0.25], [9.15, -0.25], [9.15, -3.25], [-9.15, -3.25]];
    loft(stations.map(s => shape.map(([d, y]) => P(s, d, h(s) + y))), stations.map(s => P(s, 0, h(s) - 1.75)), suspended ? 'steel' : 'concrete', ck((a + z) / 2));
  }
  strips('asphalt', 0, p.BRIDGE_LENGTH, -4.25, 4.25, 0, 0);
  // One separate pedestrian/cycle lane on the northeast side (negative d).
  strips('concrete', START - 15, END + 15, -8.8, -5.05, 0.18, 0.4);
  strips('concrete', START, END, 4.55, 8.8, -0.02, 0.2);
  for (const [a, z] of [[0, START], [END, p.BRIDGE_LENGTH]]) strips('concrete', a, z, -5, 5, -0.1, 0.6);
  // Transparent railings retain the long, light silhouette; far keeps the top rail.
  for (const d of [-9.0, -4.9, 4.65, 9.0]) {
    for (const y of near ? [0.65, 1.25] : [1.25]) strips('steel', START, END, d - 0.06, d + 0.06, y + 0.07, 0.14);
    if (near) for (let s = START + 2; s < END; s += 4) b.box('steel', s, d, h(s) + 0.64, 0.1, 0.12, 1.28, ck(s));
  }
  if (near) {
    for (const d of [-4.0, 4.0]) strips('paint', 0, p.BRIDGE_LENGTH, d - 0.075, d + 0.075, 0.03);
    for (const d of [-0.14, 0.14]) strips('yellow', 0, p.BRIDGE_LENGTH, d - 0.055, d + 0.055, 0.035);
  }

  for (const s of TOWERS) {
    for (const o of [-1, 1]) {
      const levels = [0, 8, h(s) - 3.25, 100, 155, 194, 201.5];
      const centre = y => P(s, o * (13 - 4 * y / 201.5), y);
      const rings = levels.map(y => {
        const u = y / 201.5, along = 7.8 - 3.3 * u, across = 5.4 - 2.0 * u;
        return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, d]) => P(s + a * along / 2, o * (13 - 4 * u) + d * across / 2, y));
      });
      loft(rings, levels.map(centre), 'concrete', ck(s), y => Math.min(1, y / Math.max(1, h(s) - 3.25)));
      // A restrained horizontal construction-joint rhythm on the tower faces.
      if (near) for (let y = 10; y < 191; y += 5) {
        const u = y / 201.5, width = 5.4 - 2 * u, depth = 7.8 - 3.3 * u;
        for (const a of [-1, 1]) b.box('steel', s + a * (depth / 2 + 0.025), o * (13 - 4 * u), y, 0.06, width - 0.15, 0.055, ck(s), yy => Math.min(1, yy / (h(s) - 3.25)));
      }
      b.box('steel', s, o * CABLE_D, SADDLE - 0.3, 4.1, 1.0, 1.0, ck(s));
    }
    // Only one high crossbeam, leaving the tall signature portal opening.
    b.box('concrete', s, 0, 189.5, 4.7, 20.0, 5.5, ck(s));
    // Low transverse deck bearing, distinct from the upper portal beam.
    b.box('concrete', s, 0, h(s) - 4.35, 7.4, 25.0, 2.2, ck(s));
  }

  // Smooth tube lofts, eight sides near / five far; band stations share their
  // exact curve samples so every hanger meets the main cable in either LOD.
  for (const o of [-1, 1]) {
    const segments = near ? 160 : 80;
    const main = Array.from({ length: segments + 1 }, (_, k) => TOWERS[0] + 1310 * k / segments);
    const ranges = [[0, TOWERS[0], near ? 18 : 8], [TOWERS[1], p.BRIDGE_LENGTH, near ? 18 : 8]];
    const tube = stations => {
      const n = near ? 8 : 5;
      // Cross-section perpendicular to each cable tangent.
      const centres = stations.map(s => P(s, o * CABLE_D, cableY(s)));
      const rings = centres.map((q, i) => {
        const tangent = centres[Math.min(i + 1, centres.length - 1)].clone().sub(centres[Math.max(0, i - 1)]).normalize();
        const N = new Vector3(-p.bridgePoint(stations[i]).tz, 0, p.bridgePoint(stations[i]).tx);
        const U = tangent.clone().cross(N).normalize();
        return Array.from({ length: n }, (_, j) => q.clone().addScaledVector(N, 0.3 * Math.cos(2 * Math.PI * j / n)).addScaledVector(U, 0.3 * Math.sin(2 * Math.PI * j / n)));
      });
      loft(rings, centres, 'cable', ck(stations[Math.floor(stations.length / 2)]));
    };
    tube(main);
    for (const [a, z, n] of ranges) tube(Array.from({ length: n + 1 }, (_, k) => a + (z - a) * k / n));
    for (let k = 2; k < segments; k += near ? 2 : 2) {
      const s = main[k];
      b.beam('cable', [s, o * CABLE_D, h(s) - 0.45], [s, o * CABLE_D, cableY(s)], near ? 0.1 : 0.14, near ? 0.1 : 0.14, ck(s));
      if (near) {
        b.box('steel', s, o * CABLE_D, h(s) - 0.48, 0.55, 0.36, 0.45, ck(s));
        b.box('steel', s, o * CABLE_D, cableY(s), 0.55, 0.72, 0.72, ck(s));
      }
    }
  }

  // Concrete tunnel mouths only: an open road arch and smaller cycle arch.
  // No black end plate blocking the roadway; far retains both openings.
  for (const s of [START - 8, END + 8]) {
    for (const [d0, radius, wall, height] of [[0, 5.5, 0.65, 4.8], [-7.3, 1.85, 0.4, 2.1]]) {
      const y0 = h(s);
      for (const o of [-1, 1]) b.box('concrete', s, d0 + o * (radius + wall / 2), y0 + height / 2, 6, wall, height, ck(s));
      const n = near ? 16 : 8;
      // Quad arch annulus extruded along the road, custom loft per segment.
      for (let k = 0; k < n; k++) {
        const points = [];
        for (const r of [radius, radius + wall]) for (const j of [k, k + 1]) {
          const t = j * Math.PI / n;
          points.push([d0 + r * Math.cos(t), y0 + height + r * Math.sin(t) * 0.48]);
        }
        const ring = [points[0], points[1], points[3], points[2]];
        loft([s - 3, s + 3].map(a => ring.map(([d, y]) => P(a, d, y))), [s - 3, s + 3].map(a => P(a, ring.reduce((v, q) => v + q[0], 0) / 4, ring.reduce((v, q) => v + q[1], 0) / 4)), 'concrete', ck(s));
      }
    }
  }
  if (near) for (let s = START + 55; s < END; s += 45) {
    const d = -4.7;
    b.beam('steel', [s, d, h(s) + 0.2], [s, d, h(s) + 7.0], 0.14, 0.14, ck(s));
    b.beam('steel', [s, d, h(s) + 7], [s, d + 1.5, h(s) + 7], 0.12, 0.12, ck(s));
    b.box('lamp', s, d + 1.5, h(s) + 6.92, 0.8, 0.35, 0.2, ck(s));
  }
  return b.finish();
}
