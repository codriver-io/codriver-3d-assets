import { arch, archBand, archNotch, disc, shift } from './basilique-sainte-anne-de-beaupre-kit.js';
import { FLOOR, FRONT_Z, PIER_Z, WALL_X, TOWER } from './basilique-sainte-anne-de-beaupre-plan.js';

// The south-west facade: podium and stairs, the wide front block with its central gable (apex 45.6 m, the gilded statue of
// Sainte Anne on top), the great round arch with the rose window set 0.8 m back in its niche, the two pier groups, the three
// portals, and the two towers: a base block, a belfry stage with corner turrets, and an octagonal stone spire with a cross
// (tips at 91 m). The central bay is built in depth: a backing wall at z = 46.4 and a front layer (z 46.4 to 47.2) with the
// portal and the great arch cut out of it, so the reveals catch the light. Flat panels stand 0.1-0.4 m off the wall.
const B = 46.4; // backing plane of the central bay (the front layer is 0.8 m thick)

export function buildFacade(k) {
  const { near } = k, F = FRONT_Z, seg = near ? 4 : 2, segA = near ? 12 : 6;
  // ---- podium, stairs ----------------------------------------------------------
  k.box('stone', -22.5, 22.5, 0, FLOOR, F - 0.2, 50.6);
  k.stairs('stone', 17, 56.6, 12, FLOOR / 12, 0.5, 0.3);
  if (near) for (const sx of [1, -1]) k.bar('stone', [sx * 9.0, 2.95, 50.9], [sx * 9.0, 0.4, 56.5], 0.5, 0.5); // stair balustrades
  // ---- central bay: backing wall, front layer with the portal and the great arch cut out ---------
  k.box('stone', -TOWER.x0, TOWER.x0, 0, TOWER.cornice, 45.2, B);
  const portal = shift(arch(9.2, FLOOR + 7.0, FLOOR, segA), 0, FLOOR);
  k.polyZ('stone', [[-TOWER.x0, 0], [TOWER.x0, 0], [TOWER.x0, 17.0], [-TOWER.x0, 17.0]], B, F, [portal]);
  k.polyZ('stone', archNotch(-TOWER.x0, TOWER.x0, 17.0, TOWER.cornice, 7.0, 27.0, segA), B, F);
  // gable, cornice
  k.gableZ('stone', 0, 45.2, F, TOWER.cornice - 0.1, 9.0, 10.7);
  k.box('stone', -WALL_X, WALL_X, 34.3, TOWER.cornice, F - 0.1, F + 0.45);
  k.bar('stone', [-9.1, 35.1, F - 0.2], [0, 45.9, F - 0.2], 0.4, 0.5);
  k.bar('stone', [9.1, 35.1, F - 0.2], [0, 45.9, F - 0.2], 0.4, 0.5);
  // gilded statue of Sainte Anne on a pedestal at the apex
  k.box('stone', -0.8, 0.8, 45.3, 47.0, 45.5, 46.9);
  const sg = near ? 8 : 5;
  k.cyl('gold', 0, 46.2, 47.0, 49.0, 0.95, 0.6, sg, false); // robe
  k.cyl('gold', 0, 46.2, 49.0, 50.2, 0.6, 0.45, sg, false); // shoulders
  k.sphere('gold', 0, 50.65, 46.2, 0.38, sg); // head
  k.cyl('gold', 0, 46.2, 50.95, 51.35, 0.4, 0.34, sg, false); // crown
  if (near) k.box('gold', 0.2, 0.75, 48.2, 49.6, 46.0, 46.8); // the child Mary on her arm
  // small pinnacles at the shoulders of the gable
  for (const sx of [1, -1]) {
    k.cyl('stone', sx * 9.6, F - 0.8, TOWER.cornice - 0.05, 38.4, 0.55, 0.5, near ? 8 : 5, false);
    k.cone('stone', sx * 9.6, F - 0.8, 38.3, 40.8, 0.7, near ? 8 : 5);
  }
  // ---- the great arch with the rose window (on the backing wall) ---------------------------
  const RY = 26.5;
  k.panel('recess', arch(13.8, 27.0, 17.0, segA), 'F', 0, 17.0, B + 0.05);
  k.panel('glow', disc(3.0, near ? 20 : 10), 'F', 0, RY, B + 0.15);
  k.frame('stone', disc(3.75, near ? 20 : 10), disc(2.95, near ? 20 : 10), 0.35, 'F', 0, RY, B + 0.1);
  if (near) {
    k.frame('stone', archBand(6.7, 5.9, 27.0, 17.0, 10), null, 0.5, 'F', 0, 0, B + 0.1); // archivolt orders
    k.frame('stone', archBand(5.5, 4.9, 27.0, 17.0, 10), null, 0.8, 'F', 0, 0, B + 0.1);
    k.panelRing('recess', disc(1.0, 10), disc(0.35, 6), 'F', 0, RY, B + 0.3);
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; k.panel('glass', disc(0.42, 6), 'F', 1.95 * Math.cos(a), RY + 1.95 * Math.sin(a), B + 0.3); }
    for (let i = 0; i < 9; i++) k.panel('glass', arch(0.95, 21.5, 18.0, 3), 'F', -6.0 + i * 1.5, 18.0, B + 0.2); // arcade under the rose
  }
  // ---- central portal (the door set back in its cut-out) ---------------------------------
  k.panel('glass', arch(5.4, FLOOR + 4.6, FLOOR, seg), 'F', 0, FLOOR, B + 0.1);
  k.frame('stone', archBand(3.9, 3.3, FLOOR + 5.2, FLOOR, near ? 8 : 4), null, 0.5, 'F', 0, 0, B + 0.1);
  // ---- the two pier groups beside the arch ------------------------------------------
  for (const sx of [1, -1]) {
    const x0 = sx > 0 ? 7.2 : -11.8, x1 = sx > 0 ? 11.8 : -7.2;
    k.box('stone', x0, x1, 0, 24.8, F - 0.1, PIER_Z);
    k.box('stone', x0 - 0.3, x1 + 0.3, 24.8, 25.6, F - 0.1, PIER_Z + 0.2);
    if (near) {
      for (const dx of [-1.4, 0, 1.4]) { // slim shafts and dark recesses between them
        const x = sx * 9.5 + dx;
        k.box('stone', x - 0.25, x + 0.25, 4.0, 20.8, PIER_Z - 0.05, PIER_Z + 0.35);
        k.panel('glass', arch(0.75, 23.6, 21.2, 3), 'F', x, 21.2, PIER_Z + 0.1);
      }
      for (const dx of [-0.7, 0.7, -2.1, 2.1]) k.panel('recess', [[-0.2, 0], [0.2, 0], [0.2, 16.5], [-0.2, 16.5]], 'F', sx * 9.5 + dx, 4.5, PIER_Z + 0.1);
    }
  }
  // ---- the two towers ----------------------------------------------------------
  buildTower(k, 1);
  buildTower(k, -1);
  if (near) for (const sx of [1, -1]) for (let i = 0; i < 6; i++) { // small round-headed openings under the rakes of the gable
    const x = 1.1 + i * 0.95, base = 45.6 - (10.7 / 9.0) * x - 2.4;
    k.panel('glass', arch(0.62, base + 0.9, base, 3), 'F', sx * x, base, F + 0.1);
  }
}

function buildTower(k, sx) {
  const { near } = k, F = FRONT_Z, cx = sx * TOWER.cx, cz = TOWER.cz, h = TOWER.half, seg = near ? 4 : 2;
  const x0 = sx > 0 ? TOWER.x0 : -WALL_X, x1 = sx > 0 ? WALL_X : -TOWER.x0;
  // base block, side buttress with a sloped cap, corner pier
  k.box('stone', x0, x1, 0, TOWER.cornice, TOWER.z0, F);
  if (sx > 0) { k.box('stone', WALL_X - 0.1, 24.8, 0, 26.4, 37.4, 44.6); k.wedge('stone', WALL_X - 0.1, 24.8, 26.3, 31.0, 27.4, 37.4, 44.6); }
  else { k.box('stone', -24.8, -WALL_X + 0.1, 0, 26.4, 37.4, 44.6); k.wedge('stone', -24.8, -WALL_X + 0.1, 26.3, 27.4, 31.0, 37.4, 44.6); }
  k.box('stone', sx > 0 ? 19.9 : -WALL_X, sx > 0 ? WALL_X : -19.9, 0, 30.0, F - 0.1, 48.3);
  // side portal and tall lancet on the front of the base
  const px = sx * 17.0;
  k.panel('recess', arch(4.6, FLOOR + 5.6, FLOOR, seg), 'F', px, FLOOR, F + 0.1);
  k.panel('glass', arch(2.8, FLOOR + 3.4, FLOOR, seg), 'F', px, FLOOR, F + 0.2);
  k.gableZ('stone', px, F - 0.1, F + 0.8, FLOOR + 8.1, 3.0, 2.4);
  k.panel('recess', arch(2.3, 25.5, 16.0, seg), 'F', px, 16.0, F + 0.1);
  k.panel('glass', arch(1.5, 25.5, 16.4, seg), 'F', px, 16.4, F + 0.2);
  if (near) {
    k.frame('stone', archBand(2.8, 2.35, FLOOR + 5.6, FLOOR, 6), null, 0.3, 'F', px, 0, F - 0.05); // portal surround
    k.frame('stone', archBand(1.45, 1.15, 25.5, 16.0, 6), null, 0.3, 'F', px, 0, F - 0.05); // lancet surround
    for (let i = 0; i < 7; i++) k.panel('glass', arch(0.75, 32.1, 30.2, 3), 'F', px + (i - 3) * 1.35, 30.2, F + 0.12); // arcature under the cornice
    for (const dx of [-3.0, 3.0]) for (let i = 0; i < 3; i++) k.panel('glass', arch(0.55, 24.4, 22.4, 3), 'F', px + dx + (i - 1) * 0.95, 22.4, F + 0.1); // window groups beside the lancet
    k.panel('recess', [[-6.5, 0], [6.5, 0], [6.5, 0.7], [-6.5, 0.7]], 'F', px, 33.5, F + 0.1); // shadow under the cornice
    for (const y of [12.9, 28.4]) k.box('stone', sx > 0 ? 12.4 : -19.9, sx > 0 ? 19.9 : -12.4, y, y + 0.3, F - 0.1, F + 0.2); // string courses
    k.box('stone', sx > 0 ? 12.3 : -13.1, sx > 0 ? 13.1 : -12.3, 0, 30.0, F - 0.1, F + 0.35); // pilaster
    k.panel('glass', arch(1.3, 14.0, 6.0, 3), sx > 0 ? 'E' : 'W', 40.0, 6.0, sx * (24.8 + 0.1)); // lancet on the side buttress
    // the back of the base block, above the aisle roofs: tall lancet, arcature and a string course
    k.panel('glass', arch(1.5, 25.5, 17.0, 3), 'B', cx, 17.0, TOWER.z0 - 0.1);
    for (let i = 0; i < 7; i++) k.panel('glass', arch(0.75, 32.1, 30.2, 3), 'B', cx + (i - 3) * 1.35, 30.2, TOWER.z0 - 0.1);
    k.box('stone', Math.min(x0, x1) + 0.3, Math.max(x0, x1) - 0.3, 28.4, 28.7, TOWER.z0 - 0.2, TOWER.z0 + 0.1);
  }
  // belfry stage and cornice
  k.box('stone', cx - h, cx + h, TOWER.cornice - 0.1, 55.2, cz - h, cz + h);
  k.box('stone', cx - 5.5, cx + 5.5, 55.0, TOWER.top, cz - 5.5, cz + 5.5);
  const faces = [['F', cx, cz + h], ['B', cx, cz - h], [sx > 0 ? 'E' : 'W', cz, cx + sx * h], [sx > 0 ? 'W' : 'E', cz, cx - sx * h]];
  for (const [side, s, wall] of faces) {
    const out = (side === 'F' || side === 'E') ? 1 : -1;
    const o = (d) => wall + out * d; // offset from the wall, outward
    if (!near && side !== 'F' && side !== (sx > 0 ? 'E' : 'W')) continue;
    k.panel('recess', arch(4.9, 47.0, 39.0, seg), side, s, 39.0, o(0.1));
    for (const dx of [-1.35, 1.35]) k.panel('glass', arch(1.55, 46.6, 39.6, seg), side, s + dx, 39.6, o(0.2));
    if (near) {
      k.frame('stone', archBand(2.75, 2.45, 47.0, 38.7, 8), null, 0.35, side, s, 0, o(-0.05)); // frame round the twin windows
      k.panel('recess', disc(1.1, 12), side, s, 52.6, o(0.1));
      k.panel('glass', disc(0.7, 10), side, s, 52.6, o(0.2));
      for (let i = 0; i < 7; i++) k.panel('glass', arch(0.7, 37.4, 36.0, 3), side, s + (i - 3) * 1.2, 36.0, o(0.1));
    }
  }
  // four corner turrets with pointed caps
  for (const tx of [-4.6, 4.6]) for (const tz of [-4.6, 4.6]) {
    k.cyl('stone', cx + tx, cz + tz, TOWER.cornice - 0.05, 45.2, 0.75, 0.7, near ? 8 : 5, false);
    k.cone('stone', cx + tx, cz + tz, 45.1, 49.4, 1.0, near ? 8 : 5);
  }
  // octagonal stone spire, edge ribs, then the cross
  k.spire('stone', cx, cz, TOWER.top - 0.1, TOWER.tip, TOWER.spireR, 8);
  k.box('glass', cx - 0.15, cx + 0.15, TOWER.tip - 0.3, TOWER.cross, cz - 0.15, cz + 0.15);
  k.box('glass', cx - 0.8, cx + 0.8, 89.4, 89.9, cz - 0.17, cz + 0.17);
  if (near) {
    const len = TOWER.tip - TOWER.top, R = TOWER.spireR;
    for (let i = 0; i < 8; i++) { // thin ribs along the eight edges
      const a = Math.PI / 8 + (i * Math.PI) / 4, f = (y) => R * (1 - (y - TOWER.top) / len) * 1.01;
      k.bar('stone', [cx + f(57) * Math.sin(a), 57, cz + f(57) * Math.cos(a)], [cx + f(84) * Math.sin(a), 84, cz + f(84) * Math.cos(a)], 0.22, 0.22);
    }
    // one small gabled lucarne on each of the four cardinal faces of the spire (the faces lean back by about 7 deg), and a
    // square pinnacle at each corner of the belfry cornice
    const a0 = R * Math.cos(Math.PI / 8), yL = 62.4, back = a0 * (1 - (yL + 1.8 - TOWER.top) / len) - 0.3, front = a0 * (1 - (yL - TOWER.top) / len) + 0.55;
    const hw = 0.55, hg = 0.75;
    k.box('stone', cx - hw, cx + hw, yL, yL + 1.8, cz + back, cz + front); k.gableZ('stone', cx, cz + back, cz + front, yL + 1.8, hg, 0.7);
    k.box('stone', cx - hw, cx + hw, yL, yL + 1.8, cz - front, cz - back); k.gableZ('stone', cx, cz - front, cz - back, yL + 1.8, hg, 0.7);
    k.box('stone', cx + back, cx + front, yL, yL + 1.8, cz - hw, cz + hw); k.gableX('stone', cx + back, cx + front, cz, yL + 1.8, hg, 0.7);
    k.box('stone', cx - front, cx - back, yL, yL + 1.8, cz - hw, cz + hw); k.gableX('stone', cx - front, cx - back, cz, yL + 1.8, hg, 0.7);
    k.panel('glass', arch(0.7, yL + 1.3, yL + 0.2, 3), 'F', cx, yL + 0.2, cz + front + 0.04);
    k.panel('glass', arch(0.7, yL + 1.3, yL + 0.2, 3), 'B', cx, yL + 0.2, cz - front - 0.04);
    k.panel('glass', arch(0.7, yL + 1.3, yL + 0.2, 3), 'E', cz, yL + 0.2, cx + front + 0.04);
    k.panel('glass', arch(0.7, yL + 1.3, yL + 0.2, 3), 'W', cz, yL + 0.2, cx - front - 0.04);
    for (const tx of [-4.5, 4.5]) for (const tz of [-4.5, 4.5]) {
      k.box('stone', cx + tx - 0.4, cx + tx + 0.4, TOWER.top - 0.1, 57.3, cz + tz - 0.4, cz + tz + 0.4);
      k.pyramid('stone', cx + tx, cz + tz, 57.2, 59.4, 0.62);
    }
  }
}
