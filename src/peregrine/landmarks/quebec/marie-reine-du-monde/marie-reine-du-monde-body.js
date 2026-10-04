import { LEVELS as L, NAVE, CROSS, TRANSEPT_END, REAR } from './marie-reine-du-monde-plan.js';

// The long body of the church (building axes, see the plan module): nave and aisle walls, the crossing's corner blocks, the transept arms and their
// three-sided ends, the choir arm and the rear block, with their copper roofs and the window rhythm of the long walls.

/** Offset a closed (x, z) polygon outward by d (mitre joins). */
function offsetPoly(pts, d) {
  const n = pts.length;
  let area = 0;
  for (let i = 0; i < n; i++) { const [ax, az] = pts[i], [bx, bz] = pts[(i + 1) % n]; area += ax * bz - bx * az; }
  const sgn = area > 0 ? 1 : -1; // outward normal of edge (e) is sgn * (ez, -ex) / |e|
  const normal = (a, b) => { const ex = b[0] - a[0], ez = b[1] - a[1], l = Math.hypot(ex, ez) || 1; return [sgn * ez / l, -sgn * ex / l]; };
  return pts.map((p, i) => {
    const a = pts[(i + n - 1) % n], b = pts[(i + 1) % n], n1 = normal(a, p), n2 = normal(p, b), dot = n1[0] * n2[0] + n1[1] * n2[1], k = d / (1 + dot);
    return [p[0] + (n1[0] + n2[0]) * k, p[1] + (n1[1] + n2[1]) * k];
  });
}

/** Prism along z: convex profile [[x, y], ...] extruded from z0 to z1; `skip` lists profile edges left open, `caps` the end faces kept ('0', '1'). */
function prismZ(k, mat, profile, z0, z1, { skip = [], caps = '01', capMat = mat } = {}) {
  const n = profile.length, cx = profile.reduce((a, p) => a + p[0], 0) / n, cy = profile.reduce((a, p) => a + p[1], 0) / n, inner = [cx, cy, (z0 + z1) / 2], tris = [];
  for (let i = 0; i < n; i++) {
    if (skip.includes(i)) continue;
    const [ax, ay] = profile[i], [bx, by] = profile[(i + 1) % n];
    tris.push([[ax, ay, z0], [bx, by, z0], [bx, by, z1]], [[ax, ay, z0], [bx, by, z1], [ax, ay, z1]]);
  }
  k.solid(mat, tris, inner);
  for (const [flag, z] of [['0', z0], ['1', z1]]) {
    if (!caps.includes(flag)) continue;
    const ct = [];
    for (let i = 1; i < n - 1; i++) ct.push([[profile[0][0], profile[0][1], z], [profile[i][0], profile[i][1], z], [profile[i + 1][0], profile[i + 1][1], z]]);
    k.solid(capMat, ct, inner);
  }
}

/** Truncated hip roof over a rectangle: base at y0, flat top at y1 inset by `inset`. */
function hipRoof(k, mat, x0, x1, z0, z1, y0, y1, inset) {
  const B = [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], T = [[x0 + inset, y1, z0 + inset], [x1 - inset, y1, z0 + inset], [x1 - inset, y1, z1 - inset], [x0 + inset, y1, z1 - inset]];
  const tris = [[T[0], T[1], T[2]], [T[0], T[2], T[3]]];
  for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; tris.push([B[i], B[j], T[j]], [B[i], T[j], T[i]]); }
  k.solid(mat, tris, [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2]);
}

/**
 * The rear block as a half-round apse: fieldstone walls (a straight run, then REAR.segments facets round the chevet) under a copper roof that is a
 * gable over the straight run and a half-cone over the apse, both rising to the same ridge/apex so they read as one roof (no flat-topped box).
 */
function rearApse(k) {
  const R = REAR.halfW, N = REAR.segments, zc = REAR.zBack + R, y0 = L.rear, apex = y0 + REAR.rise, z0 = REAR.zFront;
  const arc = Array.from({ length: N + 1 }, (_, i) => [R * Math.cos((i * Math.PI) / N), zc - R * Math.sin((i * Math.PI) / N)]); // east end (+R, zc) round to the west end (-R, zc)
  k.extrudePoly('rubble', [[-R, z0], [R, z0], ...arc], 0, y0, { top: false });
  const gable = [[[-R, y0, z0], [-R, y0, zc], [0, apex, zc]], [[-R, y0, z0], [0, apex, zc], [0, apex, z0]], [[R, y0, z0], [0, apex, z0], [0, apex, zc]], [[R, y0, z0], [0, apex, zc], [R, y0, zc]]];
  k.solid('copper', gable, [0, y0 + REAR.rise / 3, (z0 + zc) / 2]);
  const cone = arc.slice(0, N).map(([x, z], i) => [[0, apex, zc], [x, y0, z], [arc[i + 1][0], y0, arc[i + 1][1]]]);
  k.solid('copper', cone, [0, y0 + REAR.rise / 3, zc]);
  // one arched window on every facet of the apse
  const ap = R * Math.cos(Math.PI / (2 * N));
  for (let i = 0; i < N; i++) {
    const th = ((i + 0.5) * Math.PI) / N, F = k.frame(ap * Math.cos(th), zc - ap * Math.sin(th), -th);
    F.arch('glow', 0, 2.6, 1.6, 4.4, 0.15);
    if (k.near) F.box('stone', -1.1, 1.1, 7.05, 7.4, -0.05, 0.38, 'Z'); // hood
  }
}

export function buildBody(k) {
  const { near } = k;

  // Walls: ashlar nave, fieldstone crossing, with a stone cornice just under the roofs on the nave and the crossing.
  k.extrudePoly('stone', NAVE, 0, L.eaves);
  k.extrudePoly('rubble', CROSS, 0, L.eaves);
  if (near) {
    k.band('stone', NAVE, offsetPoly(NAVE, 0.45), L.eaves - 1.4, L.eaves - 0.1);
    k.band('stone', CROSS, offsetPoly(CROSS, 0.4), L.eaves - 1.4, L.eaves - 0.1);
    k.band('stone', NAVE, offsetPoly(NAVE, 0.25), 0, 1.3); // plinth courses
    k.band('stone', CROSS, offsetPoly(CROSS, 0.25), 0, 1.3);
  }

  // Rear block (OSM 10 m), the low blocks beside the transept (15 m) and the annex left of the nave.
  rearApse(k);
  for (const sg of [-1, 1]) k.box('rubble', Math.min(sg * 24.8, sg * 28.6), Math.max(sg * 24.8, sg * 28.6), 0, L.low, 8.0, 14.6, sg > 0 ? 'YX' : 'Yx');
  k.box('stone', -29.8, -19.1, 0, 12.0, 41.6, 55.7, 'Yx');

  // Roofs. Nave: a gable whose eaves sit on the aisle lean-tos; stone gable end toward the façade block.
  const naveProfile = [[-9, L.eaves], [9, L.eaves], [9, L.naveEaves], [0, L.ridge], [-9, L.naveEaves]];
  prismZ(k, 'copper', naveProfile, 8, 56.3, { skip: [0], caps: '1', capMat: 'stone' });
  for (const sg of [-1, 1]) prismZ(k, 'copper', sg > 0 ? [[18.7, L.eaves], [9, L.eaves], [9, L.naveEaves]] : [[-9, L.naveEaves], [-9, L.eaves], [-18.7, L.eaves]], 24.2, 56.3, { skip: [0, 1], caps: '01' });

  // Corner blocks: low copper hips; the small domes (see the dome module) stand through the front ones.
  for (const sg of [-1, 1]) {
    hipRoof(k, 'copper', Math.min(sg * 9.2, sg * 24.8), Math.max(sg * 9.2, sg * 24.8), 8.4, 22.8, L.eaves, L.eaves + 2.4, 3.2);
    const xo = sg > 0 ? 24.8 : 23.6; // the left rear block is notched in the outline
    hipRoof(k, 'copper', Math.min(sg * 8.8, sg * xo), Math.max(sg * 8.8, sg * xo), -22.2, -8.4, L.eaves, L.eaves + 2.4, 3.2);
  }

  // Transept arms: gable along x with a three-faced hip over the polygonal end.
  for (const sg of [-1, 1]) {
    const X = (x) => sg * x, tri = [], r0 = [X(8), L.ridge, 0], apex = [X(26.8), L.ridge, 0];
    const end = TRANSEPT_END.map(([x, z]) => [X(x), L.eaves, z]);
    tri.push([[X(8), L.eaves, 8.0], end[0], apex], [[X(8), L.eaves, 8.0], apex, r0]); // front slope
    tri.push([[X(8), L.eaves, -8.2], r0, apex], [[X(8), L.eaves, -8.2], apex, end[3]]); // rear slope (the last edge of the end polygon closes it)
    tri.push([end[0], end[1], apex], [end[1], end[2], apex], [end[2], end[3], apex]);
    k.solid('copper', tri, [X(18), L.eaves + 2, 0]);
  }
  // Choir arm: gable along z, hipped toward the rear.
  {
    const A = [[8.4, L.eaves, -8], [8.4, L.eaves, -34], [0, L.ridge, -27], [0, L.ridge, -8]], B = [[-8.4, L.eaves, -8], [-8.4, L.eaves, -34], [0, L.ridge, -27], [0, L.ridge, -8]];
    const tri = [[A[0], A[1], A[2]], [A[0], A[2], A[3]], [B[0], B[1], B[2]], [B[0], B[2], B[3]], [[8.4, L.eaves, -34], [-8.4, L.eaves, -34], [0, L.ridge, -27]]];
    k.solid('copper', tri, [0, L.eaves + 2, -20]);
  }

  // Long-wall rhythm: pilasters (near only) and two tiers of arched windows, (the thirteen statues are on the façade).
  {
    const wallRun = (plane, zFrom, zTo, out, { y0 = 0, y1 = L.eaves - 1.4, tiers = [[3.2, 5.0, 1.8], [13.6, 4.6, 1.6]], bay = 4.6 } = {}) => {
      const len = Math.abs(zTo - zFrom), F = k.frame(out * plane, out > 0 ? Math.max(zFrom, zTo) : Math.min(zFrom, zTo), out > 0 ? 0 : Math.PI);
      const n = Math.max(1, Math.round(len / bay)), edge = 0.55, pitch = (len - 2 * edge) / n;
      if (near) for (let i = 0; i <= n; i++) {
        const c = edge + i * pitch;
        F.box('stone', c - 0.42, c + 0.42, y0, y1 - 0.9, -0.1, 0.42, y0 ? 'Z' : 'YZ'); // shaft
        F.box('stone', c - 0.62, c + 0.62, y1 - 0.9, y1, -0.1, 0.6, 'Z'); // capital
      }
      for (let i = 0; i < n; i++) for (const [wy, h, w] of tiers) if (wy + h < y1) {
        const c = edge + (i + 0.5) * pitch;
        F.arch('glow', c, wy, w, h, 0.15);
        if (near) F.box('stone', c - w / 2 - 0.3, c + w / 2 + 0.3, wy + h + 0.05, wy + h + 0.4, -0.05, 0.38, 'Z'); // hood
      }
    };
    for (const out of [-1, 1]) {
      wallRun(22.9, 37.8, 24.2, out);
      wallRun(24.8, 23.0, 15.0, out);
      wallRun(24.8, out > 0 ? -8.4 : -13.6, -22.0, out);
      wallRun(REAR.halfW, REAR.zFront - 1.0, REAR.zBack + REAR.halfW + 0.6, out, { y1: L.rear - 0.8, tiers: [[2.6, 4.4, 1.6]], bay: 5.2 }); // the straight run only; the apse facets carry their own windows
      wallRun(8.4, -25.2, -33.2, out, { y0: 12.5, y1: L.eaves - 1.4, tiers: [[14.0, 5.0, 1.7]], bay: 4.0 });
    }
    wallRun(19.1, 56.3, 37.8, 1);
    wallRun(29.8, 55.2, 42.0, -1, { y1: 11.2, tiers: [[2.6, 5.4, 1.7]], bay: 6.0 }); // annex, -x face
    // the polygonal transept ends: windows on the middle face (OSM vertices (34.1, 4.9) to (34.4, -3.6), normal 2 degrees off +x)
    const phi = Math.atan2(0.3, 8.5);
    for (const sg of [-1, 1]) {
      const F = sg > 0 ? k.frame(34.25, 0.65, phi) : k.frame(-34.25, 0.65, Math.PI - phi);
      for (const s of [-2.8, 0, 2.8]) { F.arch('glow', s, 5.0, 1.8, 5.2, 0.15); F.arch('glow', s, 14.2, 1.6, 4.4, 0.15); }
    }
  }
}
