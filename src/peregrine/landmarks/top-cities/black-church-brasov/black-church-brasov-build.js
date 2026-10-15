import * as THREE from 'three';
import { VC, NAVE, CHOIR, APSE, APSE_PTS, TOWER, NAVE_BAYS, BAY, CROSS, CHOIR_BAYS } from './black-church-brasov-plan.js';
import { pointed } from './black-church-brasov-parts.js';

const PI = Math.PI;
const TC = (TOWER.u0 + TOWER.u1) / 2, TV = TOWER.v; // tower centre (u, v)
const NAVE_WINDOWS = (() => {
  const w = [-26.45, -20.25, NAVE_BAYS[0] + BAY / 2]; // the west bay (two lancets; hidden by the tower on the south), then the first free bay
  for (const i of [3, 4, 5]) w.push(NAVE_BAYS[i] + BAY / 2);
  return w;
})();
export const NAVE_BUTTRESS_U = [-23.35, NAVE_BAYS[0], NAVE_BAYS[1], NAVE_BAYS[3], NAVE_BAYS[4], NAVE_BAYS[5], 20.9];
export const CROSS_U = (CROSS.u0 + CROSS.u1) / 2;
const WIN = { w: 2.5, h: 14.5, y: 4.5 };

export function build(k) {
  const near = k.near;
  const vN = VC - NAVE.half, vS = VC + NAVE.half;
  const rise = NAVE.ridge - NAVE.eave, over = 0.35;
  const yeNave = NAVE.eave - over * rise / NAVE.half;

  const pts = (w, h, x = 0, y = 0) => pointed(w, h, k.seg).map(([a, b]) => [a + x, b + y]);
  const shapeOf = (p, Type = THREE.Shape) => new Type(p.map(q => new THREE.Vector2(...q)));
  // Flat pointed panel in a wall's reveal (off < 0) or proud of its face (off > 0).
  function panel(mat, cu, cv, angle, x, y, w, h, off) {
    const g = new THREE.ShapeGeometry(shapeOf(pts(w, h, x, y)));
    g.translate(0, 0, off); g.rotateY(angle); g.translate(cu, 0, cv); k.put(g, mat);
  }
  // Moulded pointed frame round a window or portal, proud of the face, plus a second order stepped back into the
  // reveal, so each lancet reads as a deep Gothic mouth rather than a cut-out (near only).
  function frame(cu, cv, angle, x, y, w, h, border = 0.45, proud = 0.3, order = true) {
    if (!near) return;
    const ring = (wo, ho, wi, hi, yi, depth, z) => {
      const o = shapeOf(pts(wo, ho, x, y));
      o.holes.push(shapeOf(pts(wi, hi, x, yi).reverse(), THREE.Path));
      const g = new THREE.ExtrudeGeometry(o, { depth, bevelEnabled: false, curveSegments: 1 });
      g.translate(0, 0, z); g.rotateY(angle); g.translate(cu, 0, cv); k.put(g, 'stone');
    };
    ring(w + border * 2, h + border, w, h, y, proud, 0);
    if (order && w > 1.2) ring(w + 0.04, h + 0.02, w - 0.5, h - 0.3, y, 0.25, -0.45); // inner order, 0.2-0.45 m into the reveal
  }
  const SA = (a) => [Math.sin(a), Math.cos(a)]; // outward direction (u, v) of a face

  // ---------- interior darkness behind every window ----------
  k.box('glass', [(-28.6 + 21.0) / 2, 11.1, VC], [49.6, 22.2, 22.8]);
  k.box('glass', [(CHOIR.u0 + CHOIR.u1) / 2 - 0.1, 10.5, CHOIR.vc], [CHOIR.u1 - CHOIR.u0 - 0.2, 21, 15.2]);
  k.cylinder(APSE.u, APSE.v, 0, 21, 7.3, 7.3, 'glass', near ? 10 : 6);
  k.box('glass', [TC, 19.5, TV], [TOWER.u1 - TOWER.u0 - 1.4, 39, TOWER.half * 2 - 1.4]);

  // ---------- nave walls ----------
  const wc = (-28.8 + 20.8) / 2, ww = 20.8 + 28.8;
  for (const side of [-1, 1]) {
    const angle = side < 0 ? PI : 0, sx = side < 0 ? -1 : 1, cv = side < 0 ? vN : vS;
    // The tower stands in front of the south wall's west bay: no lancets, frames or buttresses there.
    const free = (u) => side < 0 || u > TOWER.u1 + 1.0;
    const wins = NAVE_WINDOWS.filter(free);
    const holes = wins.map(u => ({ ...WIN, x: sx * (u - wc) }));
    holes.push({ w: 2.6, h: 6, y: 0, x: sx * (CROSS_U - wc) }); // portal under the cross gable
    // the south wall starts behind the tower's east face (the tower carries the west bay's south face)
    const [w0, w1] = side < 0 ? [-28.8, 20.8] : [TOWER.u1 - 0.4, 20.8], wcs = (w0 + w1) / 2;
    for (const h of holes) h.x = sx * (sx * h.x + wc - wcs);
    k.wall(wcs, cv, angle, w1 - w0, NAVE.eave, holes);
    k.mullions(wcs, cv, angle, holes.slice(0, -1));
    for (const u of wins) frame(u, cv, angle, 0, WIN.y, WIN.w, WIN.h);
    const o = side < 0 ? -1 : 1; // outwards sign along v
    panel('wood', CROSS_U, cv, angle, 0, 0, 2.6, 6, -0.45);
    frame(CROSS_U, cv, angle, 0, 0, 2.6, 6, 0.4, 0.28);
    for (const u of NAVE_BUTTRESS_U.filter(free)) k.buttress(u, cv, angle);
    // cross gable over the portal, flush with the wall
    const a0 = side < 0 ? vN : vS - CROSS.depth, a1 = side < 0 ? vN + CROSS.depth : vS;
    k.prism({ axis: 'v', a0, a1, c: CROSS_U, half: (CROSS.u1 - CROSS.u0) / 2, eave: NAVE.eave, ridge: CROSS.ridge, over: 0,
      ends: side < 0 ? ['gable', 'none'] : ['none', 'gable'], bottom: false });
    if (near) panel('glass', CROSS_U, cv, angle, 0, NAVE.eave + 1.2, 2.5, 5.2, 0.12); // overlay: near only
    frame(CROSS_U, cv, angle, 0, NAVE.eave + 1.2, 2.5, 5.2, 0.32, 0.26);
    k.cone(CROSS_U, cv - o * 0.35, CROSS.ridge - 0.4, CROSS.ridge + 2.1, 0.55, 'stone', 4);
  }
  // plinth and eaves cornice along both long walls (proud of the wall face)
  for (const [cv, o] of [[vN, -1], [vS, 1]]) {
    const a = o < 0 ? -28.8 : TOWER.u1 - 0.4, len = 20.8 - a, mid = (a + 20.8) / 2;
    k.box('stone', [mid, 0.45, cv + o * 0.1], [len, 0.9, 0.5]);
    if (near) k.box('trim', [mid, NAVE.eave - 0.7, cv + o * 0.0], [len, 0.4, 0.8]);
  }
  // west and east end walls (shorter than the side walls: the gable triangle starts at the eave edge)
  // The west front's own wall only spans its free (north) part, up to just inside the tower's north face.
  const wv0 = VC - 12.4, wv1 = TV - TOWER.half + 0.3, wvc = (wv0 + wv1) / 2;
  const endHoles = [{ ...WIN, w: 2.4, x: -4.7 - wvc }];
  k.wall(NAVE.u0, wvc, -PI / 2, wv1 - wv0, yeNave, endHoles);
  k.mullions(NAVE.u0, wvc, -PI / 2, endHoles);
  frame(NAVE.u0, wvc, -PI / 2, endHoles[0].x, WIN.y, 2.4, WIN.h);
  k.wall(NAVE.u1, VC, PI / 2, 24.8, yeNave, []);

  // ---------- nave roof ----------
  k.prism({ axis: 'u', a0: NAVE.u0, a1: NAVE.u1, c: VC, half: NAVE.half, eave: NAVE.eave, ridge: NAVE.ridge, over });
  k.cone(NAVE.u1 - 0.35, VC, NAVE.ridge - 0.3, NAVE.ridge + 2.4, 0.6, 'stone', 4);
  k.cone(NAVE.u0 + 0.35, VC, NAVE.ridge - 0.3, NAVE.ridge + 2.4, 0.6, 'stone', 4); // west gable finial beside the tower

  // ---------- choir ----------
  const cvN = CHOIR.vc - CHOIR.half, cvS = CHOIR.vc + CHOIR.half;
  const cc = (CHOIR.u0 + CHOIR.u1) / 2, cw = CHOIR.u1 - CHOIR.u0;
  const CWIN = { w: 2.4, h: 13.5, y: 4.5 };
  const choirU = [0, 1, 2].map(i => (CHOIR_BAYS[i] + CHOIR_BAYS[i + 1]) / 2);
  for (const side of [-1, 1]) {
    const angle = side < 0 ? PI : 0, sx = side < 0 ? -1 : 1, cv = side < 0 ? cvN : cvS;
    const holes = choirU.map(u => ({ ...CWIN, x: sx * (u - cc) }));
    k.wall(cc, cv, angle, cw, CHOIR.eave, holes);
    k.mullions(cc, cv, angle, holes);
    for (const u of choirU) frame(u, cv, angle, 0, CWIN.y, CWIN.w, CWIN.h);
    for (const u of [CHOIR_BAYS[1], CHOIR_BAYS[2], CHOIR.u1 - 0.1]) k.buttress(u, cv, angle, { width: 1.0, depth: 0.7, h: 16, h2: 19.5, top: 20.6 });
  }
  // polygonal apse
  const R2 = APSE.r + over;
  for (let i = 0; i < APSE.faces; i++) {
    const [a, b] = [APSE_PTS[i], APSE_PTS[i + 1]];
    const t = (i + 0.5) * PI / APSE.faces, angle = Math.atan2(Math.sin(t), -Math.cos(t));
    const cu = (a[0] + b[0]) / 2, cv = (a[1] + b[1]) / 2, chord = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const holes = [{ w: 1.8, h: 13.5, y: 4.5, x: 0 }];
    k.wall(cu, cv, angle, chord + 0.6, CHOIR.eave, holes);
    k.mullions(cu, cv, angle, holes);
    frame(cu, cv, angle, 0, 4.5, 1.8, 13.5);
  }
  for (let i = 1; i < APSE.faces; i++) { // the two end vertices are the choir corner buttresses above
    const t = i * PI / APSE.faces, a = Math.atan2(Math.sin(t), -Math.cos(t));
    k.buttress(APSE_PTS[i][0], APSE_PTS[i][1], a, { width: 1.0, depth: 0.7, h: 16, h2: 19.5, top: 20.6 });
  }
  for (const [cv, o] of [[cvN, -1], [cvS, 1]]) {
    k.box('stone', [cc, 0.45, cv + o * 0.1], [cw, 0.9, 0.5]);
    if (near) k.box('trim', [cc, CHOIR.eave - 0.7, cv + o * 0.0], [cw, 0.4, 0.8]);
  }
  // choir roof: gable prism with a half-pyramid over the apse
  const cy = k.prism({ axis: 'u', a0: CHOIR.u0 - 0.6, a1: CHOIR.u1, c: CHOIR.vc, half: CHOIR.half, eave: CHOIR.eave, ridge: CHOIR.ridge, over, ends: ['none', 'none'] });
  const apex = [APSE.u, CHOIR.ridge, APSE.v], inside = [APSE.u, cy.ye + 1, APSE.v];
  const ring = APSE_PTS.map((_, i) => { const t = i * PI / APSE.faces; return [APSE.u + (APSE.r + over) * Math.sin(t), cy.ye, APSE.v - (APSE.r + over) * Math.cos(t)]; });
  for (let i = 0; i < APSE.faces; i++) k.poly('roof', [apex, ring[i], ring[i + 1]], inside);
  k.poly('stone', ring, inside);

  // ---------- roof tile courses and ridge caps (near only) ----------
  if (near) {
    const courses = (u0, u1, c, half, eave, ridge) => {
      const slope = Math.hypot(half, ridge - eave), nv = (ridge - eave) / slope, nh = half / slope; // slope normal (v, y) components
      for (const s of [-1, 1]) for (const t of [0.2, 0.4, 0.6, 0.8]) {
        const v = c + s * half * (1 - t), y = eave + (ridge - eave) * t, a = s > 0 && u0 < TOWER.u1 ? TOWER.u1 + 0.1 : u0;
        k.bar('roof', [a, y + nh * 0.03, v + s * nv * 0.03], [u1, y + nh * 0.03, v + s * nv * 0.03], 0.1, 0.1);
      }
      k.bar('stone', [u0, ridge + 0.02, c], [u1, ridge + 0.02, c], 0.5, 0.5);
    };
    courses(NAVE.u0 + 0.3, NAVE.u1 - 0.3, VC, NAVE.half, NAVE.eave, NAVE.ridge);
    courses(CHOIR.u0 + 0.3, CHOIR.u1 - 0.3, CHOIR.vc, CHOIR.half, CHOIR.eave, CHOIR.ridge);
  }

  // ---------- south-west tower ----------
  // An 11.2 m shaft at the south-west corner, 0.3 m proud of the west wall and 0.5 m of the south wall. West and south faces run to
  // the ground; the east and north faces rise out of the nave roof. Each free face has, from the bottom: small
  // slits, a little window, the square painted clock panel (two dials, west and south, about 30 m up), a string
  // course and ONE narrow upper opening, as in the photographs.
  const tw = TOWER.half * 2, tv0 = TV - TOWER.half, tv1 = TV + TOWER.half, td = TOWER.u1 - TOWER.u0;
  const CLOCK = { y: 30.8, w: 4.4, h: 5.0 }, SLIT = { w: 1.0, h: 5.0, y: 34.2 }, SMALL = { w: 1.2, h: 2.6, y: 24.8 };
  const faces = [
    // [cu, cv, angle, width, y0, holes, clock]
    [TOWER.u0, TV, -PI / 2, tw, 0, [{ w: 0.9, h: 5.5, y: 9, x: 0 }, { w: 0.9, h: 6, y: 16.5, x: 0 }, { ...SMALL, x: 0 }, { ...SLIT, x: 0 }], true],
    [TC, tv1, 0, td, 0, [{ w: 1.6, h: 7.5, y: 8, x: 0 }, { ...SMALL, x: 0 }, { ...SLIT, x: 0 }], true],
    [TOWER.u1, TV, PI / 2, tw, 20, [{ ...SLIT, y: SLIT.y - 20, x: 0 }], false],
    [TC, tv0, PI, td, 30, [], false],
  ];
  for (const [cu, cv, angle, width, y0, holes, clock] of faces) {
    k.wall(cu, cv, angle, width, TOWER.shaft - y0, holes, { y0 });
    for (const h of holes) panel('glass', cu, cv, angle, h.x, h.y + y0, h.w, h.h, -0.15);
    for (const h of holes) if (h.w >= 1) frame(cu, cv, angle, h.x, h.y + y0, h.w, h.h, 0.3, 0.2, false);
    if (!clock) continue;
    const [du, dv] = SA(angle), tu = Math.cos(angle), tvv = -Math.sin(angle);
    const at = (o, s = 0, y = CLOCK.y) => [cu + du * o + tu * s, y, cv + dv * o + tvv * s];
    const pb = new THREE.BoxGeometry(CLOCK.w, CLOCK.h, 0.3); pb.rotateY(angle);
    pb.translate(...at(0.15 - (near ? 0 : 0.0))); k.put(pb, 'roof');                 // painted red frame, 0.3 m proud
    if (near) k.bar('trim', at(0.32, -CLOCK.w / 2 + 0.25, CLOCK.y - CLOCK.h / 2 + 0.45), at(0.32, CLOCK.w / 2 - 0.25, CLOCK.y - CLOCK.h / 2 + 0.45), 0.12, 0.25); // inscription band
    k.disc(cu, cv, angle, CLOCK.y + 0.3, 1.6, 0.36, 'trim');                         // dial
    if (near) {                                                                        // hands, 0.2 m proud of the dial
      k.bar('wood', at(0.62, 0, CLOCK.y + 0.3), at(0.62, 0.35, CLOCK.y + 1.25), 0.12, 0.08);
      k.bar('wood', at(0.62, 0, CLOCK.y + 0.3), at(0.62, -0.8, CLOCK.y - 0.1), 0.14, 0.08);
    }
  }
  // short returns where the tower stands proud of the nave walls (west face, north edge; south face, east edge)
  k.box('stone', [(TOWER.u0 + NAVE.u0) / 2, 20, tv0 + 0.25], [NAVE.u0 - TOWER.u0 + 0.02, 40, 0.5]);
  k.box('stone', [TOWER.u1 - 0.25, 11.5, (vS + tv1) / 2], [0.5, 23, tv1 - vS + 0.02]);
  // string courses: over the west and south faces at the nave eave, and right round under the upper openings
  k.bar('trim', [TOWER.u0 - 0.15, 19.7, tv0 + 0.1], [TOWER.u0 - 0.15, 19.7, tv1 + 0.15], 0.3, 0.3);
  k.bar('trim', [TOWER.u0 - 0.15, 19.7, tv1 + 0.15], [TOWER.u1 - 0.1, 19.7, tv1 + 0.15], 0.3, 0.3);
  k.box('trim', [TC, 33.7, TV], [td + 0.3, 0.3, tw + 0.3]);
  k.box('stone', [TC, TOWER.shaft + 0.25, TV], [td + 0.4, 0.5, tw + 0.4]);
  for (const du of [-1, 1]) for (const dv of [-1, 1]) { // corner pinnacles of the tower head
    const pu = TC + du * (TOWER.half - 0.55), pv = TV + dv * (TOWER.half - 0.55);
    k.cylinder(pu, pv, TOWER.shaft + 0.5, TOWER.shaft + 2.3, 0.45, 0.45, 'stone', near ? 6 : 4);
    k.cone(pu, pv, TOWER.shaft + 2.3, TOWER.shaft + 5.2, 0.65, 'roof', near ? 6 : 4, 0);
  }
  // belfry roof: four-sided hip, then a dark timber drum, a flared cone and the spire
  const bh = TOWER.half + 0.2, th = 2.9, y0 = TOWER.shaft + 0.5;
  const c4 = (h, y) => [[TC - h, y, TV - h], [TC + h, y, TV - h], [TC + h, y, TV + h], [TC - h, y, TV + h]];
  const lo = c4(bh, y0), hi = c4(th, TOWER.skirt), mid = [TC, (y0 + TOWER.skirt) / 2, TV];
  for (let i = 0; i < 4; i++) k.poly('roof', [lo[i], lo[(i + 1) % 4], hi[(i + 1) % 4], hi[i]], mid);
  if (near) for (let i = 0; i < 4; i++) { // hip ridges
    const a = lo[i], b = hi[i]; k.bar('stone', [a[0], a[1] + 0.05, a[2]], [b[0], b[1] + 0.05, b[2]], 0.28, 0.28);
  }
  const drum = new THREE.CylinderGeometry(2.7, 2.7, TOWER.drum - TOWER.skirt, near ? 8 : 6, 1, true);
  drum.rotateY(PI / 8); drum.translate(TC, (TOWER.drum + TOWER.skirt) / 2, TV); k.put(drum, 'wood');
  if (near) for (const [du, dv, ang] of [[1, 0, PI / 2], [-1, 0, -PI / 2], [0, 1, 0], [0, -1, PI]]) {
    const g = new THREE.BoxGeometry(1.0, 1.7, 0.3); g.rotateY(ang); g.translate(TC + du * 2.55, TOWER.skirt + 1.8, TV + dv * 2.55); k.put(g, 'glass');
  }
  const prof = [[0, TOWER.drum - 0.2], [3.9, TOWER.drum - 0.2], [3.8, TOWER.drum + 0.3], [2.5, TOWER.drum + 2.6], [1.5, TOWER.drum + 5], [1.0, TOWER.cone], [0, TOWER.cone]];
  const lathe = new THREE.LatheGeometry(prof.map(p => new THREE.Vector2(...p)), near ? 8 : 6);
  lathe.translate(TC, 0, TV); k.put(lathe, 'roof');
  const sp = new THREE.ConeGeometry(0.85, TOWER.spire - TOWER.cone + 0.1, near ? 6 : 4);
  sp.translate(TC, (TOWER.spire + TOWER.cone - 0.1) / 2, TV); k.put(sp, 'copper');
  k.bar('trim', [TC, TOWER.spire - 0.2, TV], [TC, TOWER.top, TV], 0.14, 0.14);
  k.bar('trim', [TC - 0.4, TOWER.top - 0.45, TV], [TC + 0.4, TOWER.top - 0.45, TV], 0.14, 0.14);
}
