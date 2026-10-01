import { lancet, disc } from './grace-cathedral-kit.js';
import { TOWER, ENTRY_Y } from './grace-cathedral-plan.js';

// One of the two square towers, flat-topped (the real ones carry no spire): a plain shaft behind four stepped corner
// buttresses with gablets and weathered setbacks, the open belfry (tall pointed openings through all four faces, so the
// sky shows through), a pierced parapet and four corner pinnacles reaching 53 m. `sx` is the side (+1 north, -1 south).
// Plan: shaft 6.8 x 9.4 m inside the mapped 8.2 x 10.8 m outline, whose corners the buttresses fill.
export function buildTower(k, sx) {
  const { near } = k, cx = sx * TOWER.cx, cz = (TOWER.z0 + TOWER.z1) / 2;
  const SHAFT = { hx: 3.4, hz: 4.7 }, PIER = { dx: 3.05, dz: 4.35 }; // buttress centres from the tower centre
  const BEL0 = 41.4, BEL1 = 48.6, TOP = 49.2, SPIRE = 51.8, H = TOWER.h, BEL = { dx: 3.05, dz: 4.35, h: 0.65 }; // belfry turrets sit on the buttress centres
  const fz = cz + SHAFT.hz; // shaft front face (toward Taylor Street)
  // ---- shaft and cornice ------------------------------------------------------
  k.box('stone', cx - SHAFT.hx, cx + SHAFT.hx, 0, 40.4, cz - SHAFT.hz, cz + SHAFT.hz);
  k.box('stone', cx - 3.95, cx + 3.95, 40.4, BEL0, cz - 5.25, cz + 5.25);
  // ---- stepped corner buttresses ------------------------------------------------
  for (const ox of [-1, 1]) for (const oz of [-1, 1]) {
    const px = cx + ox * PIER.dx, pz = cz + oz * PIER.dz;
    if (near) {
      k.box('stone', px - 1.05, px + 1.05, 0, 16.0, pz - 1.05, pz + 1.05);
      k.frustum('stone', px, pz, 16.0, 17.2, 1.05, 0.8);
      k.box('stone', px - 0.8, px + 0.8, 17.2, 26.5, pz - 0.8, pz + 0.8);
      k.frustum('stone', px, pz, 26.5, 27.6, 0.8, 0.65);
      k.box('stone', px - 0.65, px + 0.65, 27.6, SPIRE, pz - 0.65, pz + 0.65);
      for (const [nx, nz] of [[ox, 0], [0, oz]]) { // gablets on the two outward faces of each stage
        k.gablet('stone', px, pz, nx, nz, 1.05, 12.6, 0.62, 2.9, 0.3);
        k.gablet('stone', px, pz, nx, nz, 0.8, 23.2, 0.5, 2.7, 0.25);
      }
    } else {
      k.box('stone', px - 1.05, px + 1.05, 0, 28.0, pz - 1.05, pz + 1.05);
      k.box('stone', px - 0.65, px + 0.65, 28.0, SPIRE, pz - 0.65, pz + 0.65);
    }
    k.pyramid('stone', px, pz, SPIRE, H, 0.65);
  }
  // ---- open belfry: slabs with tall pointed openings, front/back and sides ----------
  const seg = near ? 3 : 1, hole = (c, w, h) => lancet(w, h, seg, 1.35).map(([x, y]) => [x + c, y + 0.45]);
  const front = [hole(-1.25, 1.8, 6.4), hole(1.25, 1.8, 6.4)], side = [hole(-2.5, 1.8, 6.4), hole(0, 1.8, 6.4), hole(2.5, 1.8, 6.4)];
  const fw = 2 * (BEL.dx - BEL.h) + 0.1, sw = 2 * (BEL.dz - BEL.h) + 0.1, T = 0.5, O = BEL.h - 0.05; // slabs run between the turrets, sunk 0.05 into them
  k.slab('stone', fw, BEL1 - BEL0, T, front, 'F', cx, BEL0, cz + BEL.dz + O);
  k.slab('stone', fw, BEL1 - BEL0, T, front, 'B', cx, BEL0, cz - BEL.dz - O);
  k.slab('stone', sw, BEL1 - BEL0, T, side, 'E', cz, BEL0, cx + BEL.dx + O);
  k.slab('stone', sw, BEL1 - BEL0, T, side, 'W', cz, BEL0, cx - BEL.dx - O);
  // dark liners just inside each slab, with the same openings: the unlit belfry seen through them
  const liner = (w, holes, side, s, off) => k.panelHoles('glass', w, BEL1 - BEL0, holes, side, s, BEL0, off);
  liner(fw, front, 'B', cx, cz + BEL.dz + O - T - 0.05);
  liner(fw, front, 'F', cx, cz - BEL.dz - O + T + 0.05);
  liner(sw, side, 'W', cz, cx + BEL.dx + O - T - 0.05);
  liner(sw, side, 'E', cz, cx - BEL.dx - O + T + 0.05);
  // ---- crown: belfry roof, pierced parapet --------------------------------------
  k.box('stone', cx - 3.95, cx + 3.95, BEL1, TOP, cz - 5.25, cz + 5.25);
  k.box('stone', cx - 3.95, cx + 3.95, TOP, TOP + 0.9, cz + 4.75, cz + 5.25);
  k.box('stone', cx - 3.95, cx + 3.95, TOP, TOP + 0.9, cz - 5.25, cz - 4.75);
  k.box('stone', cx + 3.45, cx + 3.95, TOP, TOP + 0.9, cz - 4.75, cz + 4.75);
  k.box('stone', cx - 3.95, cx - 3.45, TOP, TOP + 0.9, cz - 4.75, cz + 4.75);
  if (near) { // merlons: the pierced battlement
    for (let i = 0; i < 5; i++) for (const z of [cz + 5.0, cz - 5.0]) k.box('stone', cx - 2.8 + i * 1.4 - 0.3, cx - 2.8 + i * 1.4 + 0.3, TOP + 0.9, TOP + 1.5, z - 0.25, z + 0.25);
    for (let i = 0; i < 7; i++) for (const x of [cx + 3.7, cx - 3.7]) k.box('stone', x - 0.25, x + 0.25, TOP + 0.9, TOP + 1.5, cz - 4.2 + i * 1.4 - 0.3, cz - 4.2 + i * 1.4 + 0.3);
  }
  // ---- front face: doors, blind lancets, balcony -----------------------------------
  if (!near) { // far: the big blind lancets and the side doors only, as flat three-triangle panels
    for (const dx of [-1.15, 1.15]) k.panel('recess', lancet(1.8, 6.8, 1), 'F', cx + dx, 30.0, fz + 0.12);
    k.panel('glass', lancet(1.9, 4.9, 1), 'F', cx, ENTRY_Y, fz + 0.16);
    return;
  }
  k.panel('recess', lancet(2.7, 6.2, 3), 'F', cx, ENTRY_Y, fz + 0.08);
  k.panel('glass', lancet(1.9, 4.9, 3), 'F', cx, ENTRY_Y, fz + 0.16);
  for (const dx of [-1.15, 1.15]) k.panel('recess', lancet(1.8, 6.8, 3), 'F', cx + dx, 30.0, fz + 0.12);
  for (const dx of [-1.3, 1.3]) k.panel('glass', lancet(0.8, 2.3, 3), 'F', cx + dx, 37.6, fz + 0.1);
  for (const dz of [-2.4, 0, 2.4]) k.panel('recess', lancet(1.8, 6.8, 3), sx > 0 ? 'E' : 'W', cz + dz, 30.0, cx + sx * (SHAFT.hx + 0.12));
  for (const dx of [-1.15, 1.15]) k.panel('glass', disc(0.28, 8), 'F', cx + dx, 35.6, fz + 0.2); // quatrefoils in the lancet heads
  for (const dz of [-2.4, 0, 2.4]) k.panel('glass', disc(0.28, 8), sx > 0 ? 'E' : 'W', cz + dz, 35.6, cx + sx * (SHAFT.hx + 0.2));
  // balcony ledge and balusters
  k.box('stone', cx - 2.25, cx + 2.25, 28.8, 29.3, fz, fz + 0.55);
  k.box('stone', cx - 2.25, cx + 2.25, 30.1, 30.3, fz + 0.2, fz + 0.5);
  for (let i = 0; i < 8; i++) k.box('stone', cx - 1.9 + i * 0.543 - 0.08, cx - 1.9 + i * 0.543 + 0.08, 29.3, 30.1, fz + 0.28, fz + 0.42);
  const sideX = cx + sx * SHAFT.hx;
  k.box('stone', sx > 0 ? sideX : sideX - 0.55, sx > 0 ? sideX + 0.55 : sideX, 28.8, 29.3, cz - 3.55, cz + 3.55);
  k.box('stone', sx > 0 ? sideX + 0.2 : sideX - 0.5, sx > 0 ? sideX + 0.5 : sideX - 0.2, 30.1, 30.3, cz - 3.55, cz + 3.55);
  for (let i = 0; i < 12; i++) { const z = cz - 3.3 + i * 0.6, x0 = sx > 0 ? sideX + 0.28 : sideX - 0.42; k.box('stone', x0, x0 + 0.14, 29.3, 30.1, z - 0.08, z + 0.08); }
}
