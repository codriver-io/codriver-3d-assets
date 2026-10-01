import { HALL_C, HALL_RADII, HALL, HALL_MONITOR, HALL_ENDS } from './palace-of-fine-arts-site.js';

// The curved exhibition hall behind the rotunda: a plain steel-framed shed, 12 m to the eaves, a low gable to
// 15 m (OSM part 1550664400), a central monitor to ~17 m (part 1550664399) and two radial end blocks at 17 m
// (parts 1550664397 / 1550664401). It is a sector of a ring about HALL_C; each station gives the inner
// (concave, lagoon-facing) and outer wall radius at one polar angle.
export function buildHall(b, kit, near) {
  const { block, faces, sweep, prism } = kit;
  const rows = near ? HALL_RADII : HALL_RADII.filter((_, i) => i % 3 === 0 || i === HALL_RADII.length - 1);
  const st = rows.map(([deg, rIn, rOut]) => {
    const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
    return {
      i: [HALL_C[0] + rIn * c, HALL_C[1] + rIn * s], o: [HALL_C[0] + rOut * c, HALL_C[1] + rOut * s],
      m: [HALL_C[0] + ((rIn + rOut) / 2) * c, HALL_C[1] + ((rIn + rOut) / 2) * s], n: [c, s],
    };
  });
  const { eaves, ridge } = HALL;
  const out = [];
  for (let k = 0; k + 1 < st.length; k++) {
    const p = st[k], q = st[k + 1];
    // outer wall (faces away from the arc centre), inner wall (faces the centre / the lagoon)
    out.push([[[p.o[0], 0, p.o[1]], [q.o[0], 0, q.o[1]], [q.o[0], eaves, q.o[1]], [p.o[0], eaves, p.o[1]]], [p.n[0], 0, p.n[1]]]);
    out.push([[[p.i[0], 0, p.i[1]], [q.i[0], 0, q.i[1]], [q.i[0], eaves, q.i[1]], [p.i[0], eaves, p.i[1]]], [-p.n[0], 0, -p.n[1]]]);
  }
  faces('hall', out);
  const roof = [];
  for (let k = 0; k + 1 < st.length; k++) {
    const p = st[k], q = st[k + 1];
    roof.push([[[p.o[0], eaves, p.o[1]], [q.o[0], eaves, q.o[1]], [q.m[0], ridge, q.m[1]], [p.m[0], ridge, p.m[1]]], [p.n[0] * 0.2, 1, p.n[1] * 0.2]]);
    roof.push([[[p.m[0], ridge, p.m[1]], [q.m[0], ridge, q.m[1]], [q.i[0], eaves, q.i[1]], [p.i[0], eaves, p.i[1]]], [-p.n[0] * 0.2, 1, -p.n[1] * 0.2]]);
  }
  faces('roof', roof);

  // eaves cornice on both walls
  const off = (pt, n, d) => [pt[0] + n[0] * d, pt[1] + n[1] * d];
  if (near) {
    sweep('hall', st.map((p) => off(p.o, p.n, 0.5)), 0.5, eaves - 0.9, eaves);
    sweep('hall', st.map((p) => off(p.i, p.n, -0.5)), 0.5, eaves - 0.9, eaves);
  }

  // central monitor along the ridge
  prism('hall', 'roof', HALL_MONITOR, 13.0, HALL.monitorTop - 0.4);

  // radial end blocks
  for (const e of HALL_ENDS) {
    const yaw = -(e.deg * Math.PI) / 180; // the rectangle's thin axis points (cos deg, sin deg) in (x, z); block yaw maps local x to (cos, -sin)
    block('hall', e.c[0], e.c[1], 0, HALL.endBlock, e.thin, e.long, yaw);
    block('roof', e.c[0], e.c[1], HALL.endBlock, HALL.endBlock + 0.3, e.thin + 0.5, e.long + 0.5, yaw);
  }
}
