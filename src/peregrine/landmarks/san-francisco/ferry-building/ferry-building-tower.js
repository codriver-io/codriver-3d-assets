import * as THREE from 'three';

// The clock tower, 75 m to the flagpole tip (245 ft; OSM maps the first stage as 12.3 x 11.3 m). Stage heights are
// the proportions of the photographed tower (front elevation, King of Hearts 2013 / JaGa) scaled to 75 m;
// OSM's own stage tops (43.5, 50.5, 54.2, 60.5, 64.5, 68.2, 70 m) agree below the belfry and run 1-3 m higher above it.
export const TOWER_STAGES = {
  base: 13.0,        // buried in the pavilion roof (16.1 m) and the nave block
  shaft: 41.6,       // plain shaft with the four clocks, frieze with its row of small windows at the top
  cornice: 42.5,     // main cornice
  belfry: 47.6,      // open loggia: corner piers and four columns a side
  belfryCornice: 49.4,
  steps: 53.4,       // two stepped stages with corner finials
  upper: 57.4,       // second loggia
  upperCornice: 58.6,
  drum: 62.4,        // round lantern, eight colonnettes
  ring: 63.7,        // balustrade ring
  lantern: 65.8,     // upper lantern, six colonnettes
  cap: 66.3,
  dome: 67.5,        // copper cupola
  pole: 75.0,
  clockY: 34.2,      // centre of each of the four dials
  clockR: 3.35,      // 22 ft dials (6.7 m)
};

export function addTower(k, near, centre) {
  const { box, cyl, ball, lathe, onFace, seg } = k;
  const T = TOWER_STAGES, { u: cu, v: cv } = centre;
  const slab = (m, w, d, y0, y1) => box(m, cu - w / 2, cu + w / 2, y0, y1, cv - d / 2, cv + d / 2);
  const DIRS = [['-v', 0, -1], ['+v', 0, 1], ['-u', -1, 0], ['+u', 1, 0]];
  const half = (dir, w, d) => (dir.endsWith('v') ? d : w) / 2;
  const faces = (w, d, build) => { // geometries authored facing +z, x to the viewer's right, placed on each face
    for (const [dir, nx, nz] of DIRS) {
      const D = half(dir, w, d);
      onFace(build.mat, dir, [cu + nx * D, 0, cv + nz * D], build.geoms(dir));
    }
  };
  const SH_W = 10.6, SH_D = 10.4;

  // ---- shaft, four clocks, frieze windows, main cornice
  slab('pale', SH_W, SH_D, T.base, T.shaft);
  slab('pale', 11.4, 11.2, T.shaft, T.shaft + 0.4);
  slab('pale', 12.2, 12.0, T.shaft + 0.4, T.cornice);

  // clock: bezel ring, numeral band, lit inner dial, hour marks and the two hands (10:10)
  const R = T.clockR, yc = T.clockY;
  const nDial = seg(24, 0.5);
  const circle = (r, z) => { const g = new THREE.CircleGeometry(r, nDial); g.translate(0, yc, z); return g; };
  const annulus = (r0, r1, z) => { const g = new THREE.RingGeometry(r0, r1, nDial, 1); g.translate(0, yc, z); return g; };
  faces(SH_W, SH_D, { mat: 'metal', geoms: () => [annulus(R + 0.02, R + 0.4, 0.06)] });
  faces(SH_W, SH_D, { mat: 'pale', geoms: () => [annulus(2.2, R, 0.1)] });
  faces(SH_W, SH_D, { mat: 'light', geoms: () => [circle(2.2, 0.13)] });
  if (near) {
    const marks = [], hands = [];
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI) / 6, g = new THREE.BoxGeometry(i % 3 === 0 ? 0.34 : 0.22, i % 3 === 0 ? 0.8 : 0.55, 0.08);
      g.rotateZ(-a); g.translate(2.78 * Math.sin(a), yc + 2.78 * Math.cos(a), 0.15); marks.push(g);
    }
    const hand = (len, w, deg, z) => { const g = new THREE.PlaneGeometry(w, len); g.translate(0, len / 2 - 0.2, 0); g.rotateZ((-deg * Math.PI) / 180); g.translate(0, yc, z); return g; };
    hands.push(hand(1.9, 0.34, 305, 0.2), hand(2.8, 0.22, 60, 0.28));
    faces(SH_W, SH_D, { mat: 'metal', geoms: () => [...marks.map((g) => g.clone()), ...hands.map((g) => g.clone())] });
    // slit windows on every face, and the frieze's row of small windows
    const slits = [[0, 19.8], [0, 28.4], [-2.8, 24.4], [2.8, 24.4]];
    faces(SH_W, SH_D, { mat: 'glass', geoms: () => slits.map(([x, y]) => { const g = new THREE.PlaneGeometry(0.5, 1.5); g.translate(x, y, 0.03); return g; }) });
    const frieze = Array.from({ length: 8 }, (_, i) => -4.0 + (8.0 * i) / 7);
    faces(SH_W, SH_D, { mat: 'glass', geoms: () => frieze.map((x) => { const g = new THREE.PlaneGeometry(0.56, 0.62); g.translate(x, T.shaft + 0.2, 0.03); return g; }) });
  }

  // ---- belfry: lit core, corner piers, low parapet, four columns a side, two-step cornice
  const BW = 10.4, BD = 10.2, PIER = 1.5;
  slab('lamp', BW - 2 * PIER + 0.4, BD - 2 * PIER + 0.4, T.cornice, T.belfry);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    box('pale', cu + sx * (BW / 2 - PIER / 2) - PIER / 2, cu + sx * (BW / 2 - PIER / 2) + PIER / 2, T.cornice, T.belfry, cv + sz * (BD / 2 - PIER / 2) - PIER / 2, cv + sz * (BD / 2 - PIER / 2) + PIER / 2);
  }
  const span = BW - 2 * PIER, spanD = BD - 2 * PIER;
  for (const sz of [-1, 1]) box('pale', cu - span / 2, cu + span / 2, T.cornice, T.cornice + 1.0, cv + sz * (BD / 2 - 0.35) - 0.25, cv + sz * (BD / 2 - 0.35) + 0.25);
  for (const sx of [-1, 1]) box('pale', cu + sx * (BW / 2 - 0.35) - 0.25, cu + sx * (BW / 2 - 0.35) + 0.25, T.cornice, T.cornice + 1.0, cv - spanD / 2, cv + spanD / 2);
  for (const off of [-2.55, -0.85, 0.85, 2.55]) {
    for (const sz of [-1, 1]) cyl('pale', cu + off * (span / 5.1), cv + sz * (BD / 2 - 0.4), 0.2, 0.2, T.cornice + 1.0, T.belfry, 6, true);
    for (const sx of [-1, 1]) cyl('pale', cu + sx * (BW / 2 - 0.4), cv + off * (spanD / 5.1), 0.2, 0.2, T.cornice + 1.0, T.belfry, 6, true);
  }
  slab('pale', 10.6, 10.4, T.belfry, T.belfry + 0.8);
  slab('pale', 11.5, 11.3, T.belfry + 0.8, T.belfryCornice);

  // ---- two stepped stages with the corner finials
  const mid = (T.belfryCornice + T.steps) / 2;
  slab('pale', 9.2, 9.0, T.belfryCornice, mid);
  slab('pale', 7.8, 7.6, mid, T.steps);
  if (near) for (const sx of [-1, 1]) for (const sz of [-1, 1]) ball('copper', cu + sx * 4.15, mid + 0.3, cv + sz * 4.05, 0.32);

  // ---- second loggia and its cornice, corner finials
  const UW = 6.4, UD = 6.2, UP = 1.1;
  slab('lamp', UW - 2 * UP + 0.4, UD - 2 * UP + 0.4, T.steps, T.upper);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const x = cu + sx * (UW / 2 - UP / 2), z = cv + sz * (UD / 2 - UP / 2);
    box('pale', x - UP / 2, x + UP / 2, T.steps, T.upper, z - UP / 2, z + UP / 2);
  }
  for (const off of [-0.85, 0.85]) {
    for (const sz of [-1, 1]) cyl('pale', cu + off, cv + sz * (UD / 2 - 0.3), 0.18, 0.18, T.steps, T.upper, 6, true);
    for (const sx of [-1, 1]) cyl('pale', cu + sx * (UW / 2 - 0.3), cv + off, 0.18, 0.18, T.steps, T.upper, 6, true);
  }
  slab('pale', 6.6, 6.4, T.upper, T.upper + 0.6);
  slab('pale', 7.3, 7.1, T.upper + 0.6, T.upperCornice);
  if (near) for (const sx of [-1, 1]) for (const sz of [-1, 1]) ball('copper', cu + sx * 3.2, T.upperCornice + 0.33, cv + sz * 3.1, 0.36);

  // ---- round lantern: lit drum with colonnettes, balustrade ring, upper lantern, cap, copper dome, pole
  cyl('pale', cu, cv, 2.15, 2.15, T.upperCornice, T.upperCornice + 0.4, 12);
  cyl('lamp', cu, cv, 1.5, 1.5, T.upperCornice + 0.4, T.drum, 10);
  for (let i = 0; i < seg(8, 0.5); i++) {
    const a = (i / seg(8, 0.5)) * Math.PI * 2;
    cyl('pale', cu + 1.75 * Math.cos(a), cv + 1.75 * Math.sin(a), 0.13, 0.13, T.upperCornice + 0.4, T.drum, 5, true);
  }
  cyl('pale', cu, cv, 2.4, 2.4, T.drum, T.ring - 0.3, 12);
  cyl('pale', cu, cv, 2.55, 2.55, T.ring - 0.3, T.ring, 12);
  cyl('lamp', cu, cv, 1.0, 1.0, T.ring, T.lantern, 8);
  for (let i = 0; i < seg(6, 0.5); i++) {
    const a = (i / seg(6, 0.5)) * Math.PI * 2;
    cyl('pale', cu + 1.25 * Math.cos(a), cv + 1.25 * Math.sin(a), 0.1, 0.1, T.ring, T.lantern, 5, true);
  }
  cyl('pale', cu, cv, 1.8, 1.8, T.lantern, T.cap, 10);
  lathe('copper', [[1.6, T.cap], [1.5, T.cap + 0.5], [1.25, T.cap + 0.95], [0.8, T.cap + 1.12], [0.35, T.dome - 0.1], [0.08, T.dome]], cu, cv, 12);
  const poleBase = T.dome - 0.05;
  cyl('pale', cu, cv, near ? 0.12 : 0.15, near ? 0.08 : 0.1, poleBase, T.pole, 3);
  if (near) ball('copper', cu, poleBase + 0.12, cv, 0.13);
}
