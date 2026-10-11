import { planFrame, wallFrame } from './edifice-marie-guyart-mesh.js';
import { TOWER } from './edifice-marie-guyart-site.js';
import * as THREE from 'three';

// Rooftop plant and the mast. The penthouse stands in the middle of the roof; two radomes sit on corner piers; a square lattice mast with a thin whip
// rises from the penthouse roof to the 177 m tip (fr.wikipedia: spire 177 m). Positions and sizes are read from photographs.
export const PENTHOUSE = { u0: -11, u1: 11, v0: -7, v1: 7, h: 4.2 };
export const MAST = { u: -5, v: 0, half: 1.3, lattice: 22.2, tip: 177 };

export function buildCrown(M, near, b) {
  const { bearing, roof, capH, u0: tu0, u1: tu1, v0: tv0, v1: tv1 } = TOWER, frame = planFrame(bearing);
  const { u0, u1, v0, v1, h } = PENTHOUSE, top = roof + h, glass = M.get('glass'), concrete = M.get('concrete'), rf = M.get('roof');
  const corners = [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];
  for (let i = 0; i < 4; i++) {
    const wf = wallFrame(frame, corners[i], corners[(i + 1) % 4]);
    concrete.quad(wf.P(0, roof, 0), wf.P(wf.L, roof, 0), wf.P(wf.L, top, 0), wf.P(0, top, 0), wf.N);
    if (i % 2 === 0) glass.quad(wf.P(1.5, top - 3.1, 0.15), wf.P(wf.L - 1.5, top - 3.1, 0.15), wf.P(wf.L - 1.5, top - 1.1, 0.15), wf.P(1.5, top - 1.1, 0.15), wf.N); // louvre band
  }
  const at = ([u, v], y) => { const [x, z] = frame.xz(u, v); return [x, y, z]; };
  rf.quad(at([u0, v0], top), at([u1, v0], top), at([u1, v1], top), at([u0, v1], top), [0, 1, 0]);

  // Mast: four legs and a whip; near adds square rings and one diagonal per face and panel.
  const m = MAST, y0 = top, y1 = top + m.lattice, legs = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, c]) => [m.u + a * m.half, m.v + c * m.half]);
  for (const l of legs) b.bar('metal', at(l, y0), at(l, y1), 0.2);
  b.bar('metal', at([m.u, m.v], y1), at([m.u, m.v], m.tip), 0.16);
  const panels = 6, ph = m.lattice / panels;
  const rings = near ? [...Array(panels + 1).keys()] : [panels];
  for (const k of rings) for (let i = 0; i < 4; i++) b.bar('metal', at(legs[i], y0 + k * ph), at(legs[(i + 1) % 4], y0 + k * ph), 0.1);
  if (near) for (let k = 0; k < panels; k++) for (let i = 0; i < 4; i++) b.bar('metal', at(legs[i], y0 + k * ph), at(legs[(i + 1) % 4], y0 + (k + 1) * ph), 0.09);

  if (!near) return;
  // Radomes on two corner piers, a small unit on the roof and a dish on the penthouse.
  const sphere = (c, y, r) => { const g = new THREE.SphereGeometry(r, 8, 6); g.translate(...at(c, y)); b.put(g, 'concrete'); };
  sphere([tu1 - 3.0, tv0 + 3.0], roof + capH + 1.05, 1.3);
  sphere([tu0 + 3.0, tv1 - 3.0], roof + capH + 1.05, 1.3);
  const unit = (c, sx, sy, sz) => b.box('concrete', at(c, roof + sy / 2), [sx, sy, sz], frame.angle);
  unit([13.5, -13], 5, 2, 3);
  unit([-13.5, 12], 4, 2, 3);
}
