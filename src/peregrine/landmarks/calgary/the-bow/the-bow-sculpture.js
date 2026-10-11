// "Wonderland" (Jaume Plensa, 2012): a 12 m head of white wire mesh in the plaza of the concave face, in profile
// facing east toward the south-east wing. Drawn as latitude rings and meridian wires of one `sculpt` material
// (near LOD only). The head, its pose and its place in the plaza are estimates from photographs.
import { Mesh, bar } from './the-bow-parts.js';

const AT = [6, 24]; // plaza position, metres from the origin (x east, z south)
const WIRE = 0.16;
// Sagittal sections, one per ring: height y, front and back extent along the facing direction (x), half-width (z).
// Neck to the jaw, mouth, nose, brow, forehead and crown; 12 m from the neck's cut to the crown.
const RINGS = [
  [0.1, 1.1, -1.6, 1.5], [2.2, 1.1, -1.7, 1.55], [3.2, 2.9, -2.3, 2.0], [4.2, 3.7, -3.3, 2.7], [5.3, 3.9, -4.1, 3.2],
  [6.3, 4.3, -4.5, 3.5], [7.5, 4.3, -4.6, 3.7], [8.7, 3.9, -4.7, 3.7], [9.9, 3.1, -4.3, 3.2], [10.9, 2.1, -3.3, 2.3], [11.9, 0.8, -1.6, 1.0],
];
const SEG = 12;
const nose = (phi, y) => 1.1 * Math.exp(-((phi / 0.24) ** 2)) * Math.exp(-(((y - 5.8) / 0.8) ** 2));

export function addWonderland(b) {
  const m = new Mesh();
  const pt = (i, k) => {
    const [y, xf, xb, w] = RINGS[i], phi = (k / SEG) * 2 * Math.PI, cx = (xf + xb) / 2, ax = (xf - xb) / 2;
    const wrapped = phi > Math.PI ? phi - 2 * Math.PI : phi;
    const x = cx + ax * Math.cos(phi) + nose(wrapped, y), z = w * Math.sin(phi);
    return { p: [AT[0] + x, y, AT[1] + z], n: [Math.cos(phi), Math.sin(phi)] };
  };
  for (let i = 0; i < RINGS.length; i++) {
    for (let k = 0; k < SEG; k++) { const a = pt(i, k), c = pt(i, (k + 1) % SEG); bar(m, a.p, c.p, a.n, c.n, WIRE, -WIRE / 2, WIRE / 2); }
  }
  for (let k = 0; k < SEG; k++) {
    for (let i = 0; i < RINGS.length - 1; i++) { const a = pt(i, k), c = pt(i + 1, k); bar(m, a.p, c.p, a.n, c.n, WIRE, -WIRE / 2, WIRE / 2); }
  }
  b.put(m.geometry(), 'sculpt');
}
