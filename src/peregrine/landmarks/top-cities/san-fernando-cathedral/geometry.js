import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { kit, pointed, gabled, round, rect, circle, hole } from './san-fernando-cathedral-parts.js';

// Authoring frame (see parts): a west along the nave from the east front on Main Plaza, y up, s north across the nave.
// Heights are photo estimates scaled from the doors (~3.7-4.4 m) and a passer-by; the plan is OSM way 80647022:
// the 22.5 m east front and both aisles to the mapped long walls (s = ±11.25), the north aisle stopping at the mapped
// north indent (a = 32.4), and the old church's sanctuary block on the mapped west end with its stepped south-west corner.
const FW = 11.15, TIN = 4.6, BIN = 4.6, BOUT = 9.85, TC = (BIN + BOUT) / 2, BEL0 = 14.4, BEL1 = 21.8, TA = 7.4;
const NAVE_S = 4.4, NAVE_EAVE = 11.8, NAVE_RIDGE = 16.2, AISLE_WALL = 7.0, AISLE_TOP = 9.6;
const OUT = 11.25, N_AISLE_END = 32.4, SANCT = 41.3, A_END = 50.82, DOME = [45.8, 0.8], DR = 4.9;
// Sanctuary block plan [a, s], the mapped ring's west end (north wall at 12.5, stepped south-west corner).
const SANCT_RING = [[SANCT, -OUT], [43.42, -OUT], [43.42, -8.34], [44.25, -8.34], [46.07, -6.51], [46.08, -4.77], [48.16, -4.77], [A_END, -2.12], [A_END, 12.5], [SANCT, 12.5]];

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near', P = near ? pointed : gabled, b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail), k = kit(b, near), seg = k.seg;
  const { box, ext, face, pyr, cross, prism } = k;
  const rng = (x0, x1, sg) => (sg > 0 ? [x0, x1] : [-x1, -x0]);

  // ---- twin towers (sg = +1 north, -1 south) ----
  for (const sg of [1, -1]) {
    const [t0, t1] = rng(TIN, FW, sg), sc = sg * TC;
    // front slab with the side portal, two lancets and the oculus cut through it
    const slab = rect((t0 + t1) / 2, 0, t1 - t0, BEL0);
    for (const sh of [P(1.7, 3.7)]) slab.holes.push(hole(shifted(sh, sc, 0), seg));
    for (const x of [TC - 1.15, TC + 1.15]) slab.holes.push(hole(shifted(P(0.8, 2.7), sg * x, 6.6), seg));
    slab.holes.push(hole(circle(0.8, sc, 12.3), seg * 2));
    ext('stone', slab, 0, 1.1);
    box('stone', 1.1, TA, 0, BEL0, t0, t1);
    // portal door (timber below a dark tympanum), lancet and oculus glazing, recessed in the cuts
    face('dark', P(1.7, 3.7), 'front', 0.8, sc, 0);
    face('wood', rect(0, 0, 1.5, 2.4), 'front', 0.7, sc, 0);
    for (const x of [TC - 1.15, TC + 1.15]) face('dark', P(0.8, 2.7), 'front', 0.8, sg * x, 6.6);
    face('dark', circle(0.8), 'front', 0.8, sc, 12.3);
    // hood moulding round the portal and a ring round the oculus
    const hood = P(2.8, 4.9); hood.holes.push(hole(shifted(P(2.0, 4.2), 0, 0), seg));
    if (near) ext('trim', translated(hood, sc), -0.2, 0);
    const oc = circle(1.25, sc, 12.3); oc.holes.push(hole(circle(0.8, sc, 12.3), seg * 2)); if (near) ext('trim', oc, -0.14, 0);
    // stepped corner buttresses to the belfry floor, capped with small pyramids
    for (const [y0, y1, p, w] of [[0, 6.2, 0.75, 1.5], [6.2, 11, 0.55, 1.25], [11, 14.9, 0.4, 1.0]]) {
      const [o0, o1] = rng(FW - w, FW + 0.05, sg), [i0, i1] = rng(TIN - 0.05, TIN + w, sg);
      box('trim', -p, 0, y0, y1, o0, o1); box('trim', -p, 0, y0, y1, i0, i1);
    }
    pyr('trim', 0.05, 14.9, sg * (FW - 0.5), 1.4, 1.5, 1.9); pyr('trim', 0.05, 14.9, sg * (TIN + 0.5), 1.4, 1.5, 1.9);
    // string courses
    box('trim', -0.15, 0, 10.1, 10.4, t0, t1); box('trim', -0.15, 0, BEL0 - 0.3, BEL0, t0, t1);
    // lancets on the outer side and back of the stair-tower base
    for (const a of [2.6, 5.2]) face('dark', P(0.75, 2.6), sg > 0 ? '+s' : '-s', sg * (FW + 0.08), a, 6.6);
    face('dark', P(0.75, 2.6), 'back', TA + 0.08, sc, 6.6);
    // belfry: twin louvred openings on every side
    const [b0, b1] = rng(BIN, BOUT, sg), bc = sg * TC;
    box('stone', 0.9, 6.9, BEL0, BEL1, b0, b1);
    for (const o of [-0.9, 0.9]) { belfry(face, near, 'front', 0.8, bc + o); belfry(face, near, 'back', 6.9 + 0.1, bc + o); }
    belfry(face, near, sg > 0 ? '+s' : '-s', sg * (BOUT + 0.1), 3.9); belfry(face, near, sg > 0 ? '-s' : '+s', sg * (BIN - 0.1), 3.9);
    if (near) {
      box('trim', 0.55, 0.9, 15.0, 19.6, bc - 0.18, bc + 0.18); box('trim', 0.45, 0.9, 19.6, 19.9, bc - 0.3, bc + 0.3);
    }
    // bracketed cornice, dark deep-eaved roof slab, low hip and the cross
    box('trim', 0.3, 7.5, BEL1, 22.7, ...rng(BIN - 0.55, BOUT + 0.55, sg));
    box('roof', -0.2, 8.0, 22.7, 23.0, ...rng(BIN - 1.05, BOUT + 1.05, sg));
    pyr('roof', 3.9, 23.0, sg * TC, 7.4, 6.05, 1.0);
    cross(3.9, 23.9, sg * TC, 1.8);
  }

  // ---- central bay: slab with the great portal, lancets and the gable; rose window; pinnacled piers ----
  const bay = new THREE.Shape([[-TIN, 0], [TIN, 0], [TIN, 15.4], [1.3, 15.4], [0, 16.8], [-1.3, 15.4], [-TIN, 15.4]].map(p => new THREE.Vector2(...p)));
  bay.holes.push(hole(P(2.2, 4.4), seg)); bay.holes.push(hole(circle(1.45, 0, 11.6), seg * 2)); // rose window, glazed deep in the wall
  for (const sg of [1, -1]) {
    bay.holes.push(hole(shifted(P(0.8, 3.4), sg * 3.5, 6.4), seg));
    bay.holes.push(hole(shifted(P(0.65, 2.3), sg * 1.2, 7.0), seg));
  }
  ext('stone', bay, 0.8, 2.0);
  face('dark', P(2.2, 4.4), 'front', 1.6, 0, 0); face('wood', rect(0, 0, 2.0, 2.8), 'front', 1.5, 0, 0);
  for (const sg of [1, -1]) { face('dark', P(0.8, 3.4), 'front', 1.6, sg * 3.5, 6.4); face('dark', P(0.65, 2.3), 'front', 1.6, sg * 1.2, 7.0); }
  const hood = P(3.7, 6.0); hood.holes.push(hole(P(2.9, 5.2), seg)); if (near) ext('trim', hood, -0.2, 0.8);
  const rose = circle(1.95, 0, 11.6); rose.holes.push(hole(circle(1.45, 0, 11.6), seg * 2)); if (near) ext('trim', rose, 0.55, 0.8);
  face('dark', circle(1.45), 'front', 1.6, 0, 11.6);
  if (near) { for (let i = 0; i < 4; i++) { const g = new THREE.BoxGeometry(0.12, 2.9, 0.09); g.rotateX(i * Math.PI / 4); g.translate(1.45, 11.6, 0); k.put(g, 'trim'); } box('trim', 1.38, 1.52, 11.35, 11.85, -0.25, 0.25); }
  box('trim', 0.55, 0.8, 5.9, 7.4, -0.28, 0.28); // statue niche
  for (const sg of [1, -1]) {
    const [p0, p1] = rng(1.95, 3.25, sg), cx = sg * 2.6;
    box('trim', -0.15, 0.8, 0, 14.6, p0, p1); box('trim', -0.25, 0.9, 14.6, 14.85, p0 - 0.1, p1 + 0.1);
    pyr('trim', 0.33, 14.85, cx, 1.0, 1.1, 3.55);
    for (const x of [3.75, 4.25]) face('dark', P(0.4, 0.95), 'front', 0.7, sg * x, 14.35);
  }
  cross(1.4, 16.7, 0, 1.4);

  if (near) { // coursed ashlar lines on the east front, skipped across the cut openings
    const cuts = [];
    for (const sg of [1, -1]) cuts.push([sg * TC, 2.9, 0, 5.0], [sg * (TC - 1.15), 1.0, 6.6, 9.4], [sg * (TC + 1.15), 1.0, 6.6, 9.4], [sg * TC, 2.7, 11.0, 13.6], [sg * 2.6, 1.5, 0, 15.2], [sg * 3.5, 1.0, 6.4, 9.9], [sg * 1.2, 0.9, 7.0, 9.4], [sg * (TC - 1.5), 3.4, 15, 21], [sg * (TC + 1.5), 3.4, 15, 21], [sg * TC, 6.6, 15, 21]);
    cuts.push([0, 3.8, 0, 6.1], [0, 4.1, 9.5, 13.6], [0, 0.8, 5.7, 7.6]);
    let row = 0;
    for (let y = 0.8; y < 21.2; y += 0.72, row++) {
      if ((y > 9.95 && y < 10.45) || (y > 13.95 && y < 14.45)) continue; // string courses
      const y1 = y + 0.04, dy = 0;
      for (const sg of [1, -1]) {
        const a0 = y < BEL0 ? TIN + 1.0 : BIN, a1 = y < BEL0 ? FW - 1.5 : BOUT - 0.1; // between the buttresses / across the belfry
        pieces(sg, a0, a1, y, y1 + dy, y < BEL0 ? -0.05 : 0.85, row, cuts);
      }
      if (y < 15.0) pieces(1, -TIN + 0.1, TIN - 0.1, y, y1, 0.75, row, cuts, true);
    }
  }
  function pieces(sg, s0, s1, y, y1, plane, row, cuts, both) {
    let s = both ? s0 : sg * s0;
    const end = both ? s1 : sg * s1, step = 1.35 + (row % 3) * 0.3;
    for (let x = Math.min(s, end); x < Math.max(s, end) - 0.05; x += step) {
      const x1 = Math.min(x + step - 0.06, Math.max(s, end));
      if (x1 - x < 0.15) continue;
      const mid = (x + x1) / 2;
      if (cuts.some(([c, w, c0, c1]) => Math.abs(mid - c) < w / 2 + (x1 - x) / 2 + 0.1 && y > c0 - 0.15 && y < c1 + 0.15)) continue;
      face('joint', rect(0, 0, x1 - x, y1 - y), 'front', plane, mid, y);
    }
  }

  // ---- nave, aisles and roofs ----
  box('stone', 2.0, SANCT + 0.3, 0, NAVE_EAVE, -NAVE_S, NAVE_S);
  ext('roof', tri(-(NAVE_S + 0.45), NAVE_EAVE - 0.1, NAVE_S + 0.45, NAVE_EAVE - 0.1, 0, NAVE_RIDGE), 1.9, SANCT + 0.1);
  aisle(+1, 7.3, N_AISLE_END); aisle(-1, 7.3, SANCT);
  function aisle(sg, a0, a1) {
    box('stone', a0, a1, 0, AISLE_WALL, ...rng(NAVE_S - 0.1, OUT, sg));
    const o = sg * (OUT + 0.3), i = sg * (NAVE_S - 0.1), dir = sg > 0 ? '+s' : '-s';
    ext('roof', new THREE.Shape([[o, AISLE_WALL - 0.15], [i, AISLE_TOP], [i, AISLE_WALL - 0.15]].map(p => new THREE.Vector2(...p))), a0, a1);
    for (let a = a0 + 2.7; a < a1 - 1.5; a += 3.6) {
      face('dark', P(0.9, 3.0), dir, sg * (OUT + 0.06), a, 3.2);
      if ((near || a > 20) && a + 1.8 < a1 - 0.8) box('stone', a + 1.8 - 0.4, a + 1.8 + 0.4, 0, 7.6, ...rng(OUT - 0.05, OUT + 0.6, sg));
    }
    for (let a = a0 + 2.3; a < a1 - 1.5; a += 3.6) face('dark', P(0.7, 1.8), dir, sg * (NAVE_S + 0.06), a, AISLE_TOP + 0.2);
  }
  // low link in the mapped north indent between the north aisle and the sanctuary block
  prism('stone', [[36.71, NAVE_S - 0.1], [36.71, 5.36], [39.51, 8.15], [SANCT, 8.15], [SANCT, NAVE_S - 0.1]], 0, 6.2);
  prism('roof', [[36.9, NAVE_S - 0.1], [36.9, 5.28], [39.6, 7.95], [SANCT - 0.1, 7.95], [SANCT - 0.1, NAVE_S - 0.1]], 6.18, 6.4);
  for (const a of [33.6, 35.4]) face('dark', P(0.7, 1.8), '+s', NAVE_S + 0.06, a, AISLE_TOP + 0.2);

  // ---- the old sanctuary at the back (west): low block on the mapped west end, round drum and the dome ----
  prism('stone', SANCT_RING, 0, 10.0);
  prism('trim', grow(SANCT_RING, 0.1).map(([a, s]) => [Math.max(a, SANCT + 0.02), s]), 9.98, 10.3); // no lip over the aisle roofs
  prism('roof', grow(SANCT_RING, -0.45).map(([a, s]) => [Math.max(a, SANCT + 0.6), s]), 9.4, 10.45); // foot buried in the block, sides >= 0.5 m inside the cornice face
  for (const s of [0.6, 4.9, 9.2]) face('dark', P(0.9, 3.2), 'back', A_END + 0.08, s, 3.5);
  for (const a of [43.0, 45.9, 48.8]) face('dark', P(0.8, 3.0), '+s', 12.58, a, 3.5);
  face('dark', P(0.8, 3.0), '-s', -(OUT + 0.08), 42.4, 3.5);
  if (near) for (const a of [44.45, 47.35]) box('trim', a - 0.4, a + 0.4, 0, 10.0, 12.45, 12.85);
  if (near) for (const s of [2.75, 7.05, 11.4]) box('trim', A_END - 0.05, A_END + 0.35, 0, 10.0, s - 0.4, s + 0.4);
  const dr = DR, dn = near ? 20 : 10;
  const drum = new THREE.CylinderGeometry(dr, dr, 2.9, dn, 1, true); drum.translate(DOME[0], 10.45 + 1.45, DOME[1]); k.put(drum, 'stone');
  const prof = []; for (let i = 0; i <= (near ? 8 : 5); i++) { const t = i / (near ? 8 : 5), r = (dr + 0.1) * Math.cos(t * Math.PI / 2 * 0.999); prof.push([r, 2.7 * Math.sin(t * Math.PI / 2)]); }
  prof[prof.length - 1][0] = 0.9; k.lathe('dome', prof, DOME[0], 13.35, DOME[1], dn);
  const lant = new THREE.CylinderGeometry(0.85, 0.95, 1.8, near ? 8 : 6); lant.translate(DOME[0], 15.95 + 0.9 - 0.15, DOME[1]); k.put(lant, 'trim');
  pyr('dome', DOME[0], 17.6, DOME[1], 1.9, 1.9, 0.9); cross(DOME[0], 18.4, DOME[1], 1.9);
  if (near) for (let i = 0; i < 8; i++) { const an = i * Math.PI / 4 + Math.PI / 8, g = new THREE.BoxGeometry(0.1, 1.5, 0.55); g.translate(dr + 0.04, 12.0, 0); g.rotateY(-an); g.translate(DOME[0], 0, DOME[1]); k.put(g, 'dark'); }

  const model = b.finish();
  model.traverse(o => { if (o.isMesh) o.geometry.deleteAttribute('bridgeLift'); });
  return model;
}

function belfry(face, near, dir, plane, along) {
  const R = near ? round : gabled;
  if (near) face('trim', R(1.5, 5.8), dir, plane, along, 15.0);
  // dark glazing sits proud of its frame, on the viewer's side
  const pl = dir === 'front' ? plane - 0.1 : dir === 'back' ? plane + 0.1 : plane + (dir === '+s' ? 0.1 : -0.1);
  face('dark', R(1.1, 5.3), dir, pl, along, 15.2);
}
// Plan ring grown outward by d (inward if negative), mitred at every corner.
function grow(ring, d) {
  const n = ring.length, area = ring.reduce((t, p, i) => { const q = ring[(i + 1) % n]; return t + p[0] * q[1] - q[0] * p[1]; }, 0), sgn = area > 0 ? 1 : -1;
  const nrm = (p, q) => { const da = q[0] - p[0], ds = q[1] - p[1], l = Math.hypot(da, ds); return [sgn * ds / l, -sgn * da / l]; };
  return ring.map((p, i) => { const a = nrm(ring[(i + n - 1) % n], p), b = nrm(p, ring[(i + 1) % n]), dot = 1 + a[0] * b[0] + a[1] * b[1]; return [p[0] + d * (a[0] + b[0]) / dot, p[1] + d * (a[1] + b[1]) / dot]; });
}
function tri(x0, y0, x1, y1, x2, y2) { return new THREE.Shape([new THREE.Vector2(x0, y0), new THREE.Vector2(x1, y1), new THREE.Vector2(x2, y2)]); }
function shifted(shape, dx, dy) { return translated(shape, dx, dy); }
function translated(shape, dx, dy = 0) { const pts = shape.getPoints(24).map(p => new THREE.Vector2(p.x + dx, p.y + dy)); const s = new THREE.Shape(pts); s.holes = shape.holes.map(h => new THREE.Path(h.getPoints(24).map(p => new THREE.Vector2(p.x + dx, p.y + dy)))); return s; }
