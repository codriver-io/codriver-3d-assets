import * as THREE from 'three';
import { TOWER } from './old-city-hall-plan.js';
import { pyramid, openingPanel, openingFrame, wallMatrix } from './old-city-hall-solids.js';

// The clock tower, 103.64 m to the top of its finial (340 ft). Stage heights are
// read from photographs against that total; the clock is 6 m across (City of
// Toronto / Wikipedia). Stages, bottom to top:
//   rusticated base ....... 0 - 10.5     slit-windowed shaft ..... 10.5 - 62.5
//   belfry, 3 arches/face . 63.3 - 71.7  small arcade ............ 73.2 - 78.6
//   gargoyle cornice ...... 78.6 - 80.2  clock stage ............. 80.2 - 88.3
//   pyramidal spire ....... 88.3 - 101.9  finial cross to 103.64.
// The belfry cornice sits at 73.2 m = 240 ft, the height the City of Toronto gives
// for the tower before its spire; the stages above are proportioned from photographs.
export const TOWER_STAGES = {
  baseTop: 10.5, shaftTop: 62.5, belfryTop: 71.7, corniceTop: 73.2, arcadeTop: 78.6, gargoyleTop: 80.2,
  clockTop: 88.3, spireTop: 101.9, clockY: 84.2, clockRadius: 3.0,
};

export function buildTower({ b, put, near, box, cyl, cone }) {
  const { u: uc, v: vc, baseU, baseV, half, top } = TOWER, S = TOWER_STAGES;
  const seg = near ? 32 : 16;
  const plane = (side, h) => (side === 'S' ? vc - h : side === 'N' ? vc + h : side === 'E' ? uc + h : uc - h);
  const centre = (side) => (side === 'S' ? uc : side === 'N' ? -uc : side === 'E' ? vc : -vc);
  const eachFace = (h, fn) => {
    for (const side of ['S', 'E', 'N', 'W']) {
      const M = wallMatrix(side, plane(side, h)), sc = centre(side);
      const at = (g, m) => { g.applyMatrix4(M); put(g, m); };
      const wbox = (m, sa, sb, y0, y1, d0, d1) => { const g = new THREE.BoxGeometry(sb - sa, y1 - y0, d1 - d0); g.translate((sa + sb) / 2, (y0 + y1) / 2, (d0 + d1) / 2); at(g, m); };
      fn({ side, sc, at, wbox });
    }
  };
  const stage = (m, y0, y1, h) => box(m, uc - h, uc + h, y0, y1, vc - h, vc + h);

  // base: rusticated red sandstone over the mapped 12.3 x 11.5 m block
  box('redstone', uc - baseU, uc + baseU, 0, S.baseTop, vc - baseV, vc + baseV);
  box('stone', uc - baseU - 0.35, uc + baseU + 0.35, S.baseTop - 0.6, S.baseTop, vc - baseV - 0.35, vc + baseV + 0.35);
  // rusticated courses, small windows and quoins on the four faces of the base
  for (const [side, pl, sc, hw] of [['S', vc - baseV, uc, baseU], ['N', vc + baseV, -uc, baseU], ['E', uc + baseU, vc, baseV], ['W', uc - baseU, -vc, baseV]]) {
    const M = wallMatrix(side, pl);
    const at = (g, m) => { g.applyMatrix4(M); put(g, m); };
    const wbox = (m, sa, sb, y0, y1, d0, d1) => { const g = new THREE.BoxGeometry(sb - sa, y1 - y0, d1 - d0); g.translate((sa + sb) / 2, (y0 + y1) / 2, (d0 + d1) / 2); at(g, m); };
    wbox('band', sc - hw, sc + hw, 0, 1.0, -0.02, 0.22); // plinth
    const step = near ? 1.3 : 3.2;
    for (let y = 1.6; y < S.baseTop - 0.9; y += step) wbox('band', sc - hw, sc + hw, y, y + (near ? 0.3 : 0.5), -0.02, 0.1);
    if (near) for (const k of [-1, 1]) {
      const w0 = 0.9;
      at(new THREE.PlaneGeometry(w0, 1.9).translate(sc + k * hw * 0.42, 4.6 + 0.95, 0.13), 'glass');
      wbox('band', sc + k * hw * 0.42 - w0 / 2 - 0.2, sc + k * hw * 0.42 + w0 / 2 + 0.2, 6.5, 6.9, 0.0, 0.32);
      for (let y = 1.0; y < S.baseTop - 1.0; y += 2.0) for (const e of [-1, 1]) wbox(Math.round(y / 2) % 2 ? 'stone' : 'band', sc + e * (hw - 0.55) - 0.55, sc + e * (hw - 0.55) + 0.55, y, y + 1.0, 0.0, 0.2); // quoins
    }
  }
  // shaft with corner ribs, courses and slit windows
  stage('stone', S.baseTop, S.shaftTop, half);
  for (const sx of [-1, 1]) for (const sv of [-1, 1]) box('redstone', uc + sx * (half - 0.25) - 0.5, uc + sx * (half - 0.25) + 0.5, S.baseTop, S.shaftTop, vc + sv * (half - 0.25) - 0.5, vc + sv * (half - 0.25) + 0.5);
  eachFace(half, ({ sc, at, wbox }) => {
    for (let y = 15.5; y < S.shaftTop - 3; y += near ? 6.2 : 12.4) wbox('redstone', sc - half, sc + half, y, y + 0.42, -0.02, 0.16);
    if (near) {
      for (const [y, h] of [[2.4, 2.4], [17.5, 3.4], [27.0, 3.4], [36.5, 3.4], [46.0, 3.4], [55.0, 3.4]]) for (const k of [-1, 1]) {
        at(new THREE.PlaneGeometry(0.55, h).translate(sc + k * 1.75, y + h / 2, 0.13), 'glass');
        wbox('redstone', sc + k * 1.75 - 0.5, sc + k * 1.75 + 0.5, y + h, y + h + 0.3, 0.0, 0.3);
      }
    } else for (const y of [20, 34, 48, 58]) for (const k of [-1, 1]) at(new THREE.PlaneGeometry(0.6, 3.4).translate(sc + k * 1.75, y, 0.13), 'glass');
  });
  // setback course under the belfry
  stage('redstone', S.shaftTop, S.shaftTop + 0.8, half + 0.4);
  // belfry: three tall louvred arches a side between corner piers
  const bh = 5.2;
  stage('stone', S.shaftTop + 0.8, S.belfryTop, bh);
  for (const sx of [-1, 1]) for (const sv of [-1, 1]) box('redstone', uc + sx * (bh - 0.2) - 0.5, uc + sx * (bh - 0.2) + 0.5, S.shaftTop + 0.8, S.belfryTop, vc + sv * (bh - 0.2) - 0.5, vc + sv * (bh - 0.2) + 0.5);
  eachFace(bh, ({ sc, at, wbox }) => {
    for (const k of [-1, 0, 1]) {
      at(openingPanel(sc + k * 3.3, 64.6, 2.0, 6.4, 0.14, near ? 6 : 3), 'glass');
      if (near) {
        at(openingFrame(sc + k * 3.3, 64.6, 2.0, 6.4, 0.34, 0.3, 6), 'redstone');
        for (const m of [-0.35, 0.35]) wbox('stone', sc + k * 3.3 + m - 0.05, sc + k * 3.3 + m + 0.05, 64.6, 69.5, 0.1, 0.22);
      }
    }
    if (near) for (const k of [-1, 1]) { const g = new THREE.CylinderGeometry(0.2, 0.2, 6.0, 8); g.translate(sc + k * 1.65, 67.6, 0.22); at(g, 'stone'); }
  });
  // cornice, small arcade, gargoyle cornice
  stage('redstone', S.belfryTop, S.corniceTop, bh + 0.7);
  stage('stone', S.corniceTop, S.arcadeTop, 4.9);
  eachFace(4.9, ({ sc, at }) => {
    for (const k of [-1.5, -0.5, 0.5, 1.5]) {
      at(openingPanel(sc + k * 2.2, 74.5, 1.05, 2.8, 0.12, near ? 6 : 3), 'glass');
      if (near) at(openingFrame(sc + k * 2.2, 74.5, 1.05, 2.8, 0.22, 0.24, 6), 'redstone');
    }
  });
  stage('redstone', S.arcadeTop, S.gargoyleTop, 5.5);
  for (const sx of [-1, 1]) for (const sv of [-1, 1]) { // the four bronze gargoyles at the corners
    const a = [uc + sx * 5.3, 79.4, -(vc + sv * 5.3)], c = [a[0] + sx * 0.95, 78.85, a[2] - sv * 0.95];
    b.bar('stone', a, c, near ? 0.32 : 0.4, near ? 0.32 : 0.4, 0, false, 0);
  }
  // clock stage: four 6 m dials in arched surrounds
  stage('stone', S.gargoyleTop, S.clockTop, 4.5);
  for (const sx of [-1, 1]) for (const sv of [-1, 1]) { // corner buttress pinnacles
    box('redstone', uc + sx * 4.1 - 0.42, uc + sx * 4.1 + 0.42, S.gargoyleTop, S.clockTop + 0.4, vc + sv * 4.1 - 0.42, vc + sv * 4.1 + 0.42);
    cone('roof', uc + sx * 4.1, vc + sv * 4.1, S.clockTop + 0.4, S.clockTop + 3.4, 0.62, near ? 8 : 4);
  }
  eachFace(4.5, ({ sc, at }) => {
    const cy = S.clockY, R = S.clockRadius;
    const dial = new THREE.CircleGeometry(R, seg); dial.translate(sc, cy, 0.16); at(dial, 'glow');
    const ring = new THREE.RingGeometry(R, R + 0.42, seg); ring.translate(sc, cy, 0.12); at(ring, 'redstone');
    const tick = (ang, len, wid, r0, mat, d) => {
      const g = new THREE.BoxGeometry(wid, len, 0.06); g.translate(0, r0 + len / 2, 0); g.rotateZ(-ang); g.translate(sc, cy, d); at(g, mat);
    };
    if (near) {
      for (let h = 0; h < 12; h++) tick((h * Math.PI) / 6, h % 3 ? 0.32 : 0.5, h % 3 ? 0.1 : 0.16, R - 0.62 - (h % 3 ? 0 : 0.18), 'brass', 0.19);
    } else for (let h = 0; h < 12; h += 3) tick((h * Math.PI) / 6, 0.6, 0.22, R - 0.85, 'brass', 0.19);
    tick((-60 * Math.PI) / 180, 1.5, 0.2, 0, 'brass', 0.23); // hour hand, ten past ten
    tick((60 * Math.PI) / 180, 2.35, 0.14, 0, 'brass', 0.26);
  });
  // spire, cornice and finial
  stage('redstone', S.clockTop - 0.5, S.clockTop + 0.05, 5.0);
  put(pyramid(uc, vc, 4.95, S.clockTop, S.spireTop), 'roof');
  cyl('trim', uc, vc, S.spireTop - 0.2, S.spireTop + 1.2, 0.09, 0.15, 6);
  box('trim', uc - 0.07, uc + 0.07, S.spireTop + 0.4, top, vc - 0.07, vc + 0.07);
  box('trim', uc - 0.45, uc + 0.45, top - 0.75, top - 0.61, vc - 0.07, vc + 0.07);
  void cone;
}
