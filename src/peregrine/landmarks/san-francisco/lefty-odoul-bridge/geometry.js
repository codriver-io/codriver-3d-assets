import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { DIM } from './lefty-odoul-bridge-site.js';
import { makeKit } from './lefty-odoul-bridge-parts.js';

const STEEL = 'steel', CONC = 'concrete', HOUSE = 'house', TRIM = 'trim', CREAM = 'cream', GLASS = 'glass', LAMP = 'lamp';

/**
 * Lefty O'Doul Bridge (Third Street Bridge, 1933, Strauss heel-trunnion single-leaf bascule), closed
 * position, SUPERSTRUCTURE ONLY. Authored in bridge coordinates (B along the axis toward the NNW heel,
 * y above the road, V across toward the ENE) and turned once onto the mapped bearing (see the site file).
 *
 *  - two Pratt through trusses (143 ft leaf) flanking the carriageway, with overhead sway bracing;
 *  - the heel frame at the north-west end: on each side a laced inclined chord rising to the leaf
 *    trunnion, the tail truss carrying the raised concrete counterweight, the front leg and tower column;
 *  - two chamfered concrete counterweights, one per side, hanging from the tail knuckles;
 *  - the operator's house (oxblood panels, balcony, glazed cab, green roof) and two cream huts;
 *  - black pipe railings along both sidewalks, lamps hung from the top chords.
 * No deck, no pavement, nothing under the road: the provider draws Third Street, and every structural
 * member between the trusses stays at least DIM.roadClear metres above it.
 */
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const { cuboid, beam, knuckle, hull, frustum, prism } = makeKit(b);
  const VE = DIM.trussE, VW = DIM.trussW, L = DIM.leafHalf, RAIL = DIM.railV, TC = DIM.topChordY;
  const planes = [{ s: 1, V: VE }, { s: -1, V: VW }]; // the two truss / heel-frame planes (s = +1 on the Oracle Park side)
  const th = (v, t) => [v - t / 2, v + t / 2]; // V range of thickness t centred on v
  const rim = near ? 12 : 8; // segments of a knuckle

  // ---- leaf: Pratt through truss, 10 panels, one on each side of the roadway ------------------------
  const panels = 10, pitch = (2 * L) / panels, xs = Array.from({ length: panels + 1 }, (_, i) => -L + i * pitch);
  const yBotTop = 1.06, yChordBot = TC - 0.62, yChordTop = TC + 0.62;
  for (const { s, V } of planes) {
    cuboid(STEEL, [-L, L], [0.06, yBotTop], th(V, 0.9)); // bottom chord, flush with the curb girder line
    cuboid(STEEL, [-18.6, 30.2], [yChordBot, yChordTop], th(V, 1.04)); // top chord runs on past the heel to the front leg
    beam(STEEL, [-L, 0.5, V], [xs[1], TC, V], 0.8, 0.76); // inclined end post at the toe
    for (let i = 1; i <= panels; i++) beam(STEEL, [xs[i], yBotTop, V], [xs[i], yChordBot + 0.1, V], 0.62, 0.62); // verticals
    for (let i = 1; i <= 4; i++) beam(STEEL, [xs[i], TC - 0.4, V], [xs[i + 1], yBotTop - 0.06, V], 0.46, 0.48); // diagonals sloping down to the middle
    for (let i = 6; i <= panels; i++) beam(STEEL, [xs[i], TC - 0.4, V], [xs[i - 1], yBotTop - 0.06, V], 0.46, 0.76);
    if (near) {
      for (let i = 1; i <= panels; i++) cuboid(STEEL, [xs[i] - 0.5, xs[i] + 0.5], [TC - 1.3, TC - 0.3], th(V, 1.2)); // gusset plates, top nodes
      for (let i = 0; i <= panels; i++) cuboid(STEEL, [xs[i] - 0.5, xs[i] + 0.5], [yBotTop - 0.06, yBotTop + 1.1], th(V, 1.1)); // bottom nodes
      // Toe navigation platform on the top chord, with its railing and lamp mast.
      cuboid(STEEL, [-19.6, -17.4], [yChordTop - 0.05, yChordTop + 0.15], th(V, 1.5));
      for (const pb of [-19.5, -17.5]) for (const pv of [V - 0.62, V + 0.62]) cuboid(STEEL, [pb - 0.05, pb + 0.05], [yChordTop + 0.1, yChordTop + 1.24], [pv - 0.05, pv + 0.05]);
      for (const pv of [V - 0.62, V + 0.62]) cuboid(STEEL, [-19.5, -17.5], [yChordTop + 1.14, yChordTop + 1.22], [pv - 0.02, pv + 0.02]);
      for (const pb of [-19.5, -17.5]) cuboid(STEEL, [pb - 0.02, pb + 0.02], [yChordTop + 1.1, yChordTop + 1.18], [V - 0.62, V + 0.62]);
      cuboid(STEEL, [-18.55, -18.45], [yChordTop + 0.1, yChordTop + 2.4], [V - 0.05, V + 0.05]);
      // Lamps hung inboard of the top chord (self-lit at night).
      for (const i of [2, 4, 6, 8]) {
        beam(STEEL, [xs[i], 8.0, V - s * 0.2], [xs[i], 8.0, V - s * 1.5], 0.1, 0.1, [0, 1, 0]);
        cuboid(LAMP, [xs[i] - 0.3, xs[i] + 0.3], [7.45, 8.03], th(V - s * 1.6, 0.8));
      }
    }
  }
  // Overhead sway bracing between the two top chords (above 7.7 m: the road stays clear) and a portal frame at the toe.
  for (let i = 1; i <= panels - 1; i++) cuboid(STEEL, [xs[i] - 0.45, xs[i] + 0.45], [7.7, 8.5], [VW, VE]); // top struts
  for (let i = 1; i <= 8; i++) {
    beam(STEEL, [xs[i], 8.75, VW], [xs[i + 1], 8.75, VE], 0.30, 0.34, [0, 1, 0]);
    beam(STEEL, [xs[i], 9.12, VE], [xs[i + 1], 9.12, VW], 0.30, 0.34, [0, 1, 0]);
  }
  cuboid(STEEL, [xs[1] - 0.4, xs[1] + 0.4], [6.4, 7.4], [VW, VE]); // toe portal strut
  for (const { s, V } of planes) beam(STEEL, [xs[1], 6.9, V - s * 0.2], [xs[1], 8.2, V - s * 3.0], 0.7, 0.5, [1, 0, 0]);

  // ---- heel frame: tower, laced chord to the trunnion, tail truss and counterweight ---------------
  for (const { s, V } of planes) {
    const P = (x, y) => [x, y, V];
    // Front leg (inclined) from the heel pier up to the tower top, on a steel shoe; tower column behind it.
    beam(STEEL, P(22.9, 0.6), P(37.3, 17.2), 1.5, 1.22);
    cuboid(STEEL, [21.9, 24.3], [0.06, 1.2], th(V, 1.4));
    cuboid(STEEL, [DIM.towerB - 0.95, DIM.towerB + 0.95], [0.1, 18.0], th(V, 1.3));
    cuboid(STEEL, [29.6, 38.6], [5.6, 8.5], th(V, 2.4)); // machinery house between leg and column
    cuboid(STEEL, [31.4, 37.4], [8.5, 9.5], th(V, 1.7)); // its raised hood
    cuboid(STEEL, [31.1, 37.7], [9.5, 9.7], th(V, 2.0)); // and roof cap
    if (near) {
      for (let q = 0; q < 4; q++) { // louvres on the road side, small windows on the sidewalk side
        const f = V - s * 1.2, g = V + s * 1.2;
        cuboid(STEEL, [31.6, 36.6], [6.0 + q * 0.5, 6.18 + q * 0.5], [Math.min(f, f - s * 0.07), Math.max(f, f - s * 0.07)]);
        if (q < 2) cuboid(GLASS, [32.2 + q * 2.3, 33.4 + q * 2.3], [6.4, 7.6], [Math.min(g - s * 0.04, g + s * 0.1), Math.max(g - s * 0.04, g + s * 0.1)]);
      }
      // Riveted straps across the front leg, bands on the column, plates at the frame's joints.
      const e = [0.865, 0.502], n = [-0.502, 0.865];
      for (const q of [3, 6, 9, 12, 15]) {
        const cx = 22.9 + e[0] * q, cy = 0.6 + e[1] * q;
        beam(STEEL, P(cx - n[0] * 0.85, cy - n[1] * 0.85), P(cx + n[0] * 0.85, cy + n[1] * 0.85), 0.32, 1.36);
      }
      for (const y of [4.0, 10.0, 14.6]) cuboid(STEEL, [DIM.towerB - 1.1, DIM.towerB + 1.1], [y - 0.3, y + 0.3], th(V, 1.42));
      cuboid(STEEL, [10.2, 15.6], [TC - 0.8, TC + 0.8], th(V, 1.3)); // foot of the laced chords on the leaf's top chord
      cuboid(STEEL, [DIM.towerB - 1.9, DIM.towerB + 1.9], [15.4, 18.4], th(V, 1.66)); // tower top
      cuboid(STEEL, [42.8, 45.2], [22.9, 25.0], th(V, 1.2)); // peak of the tail truss
      cuboid(STEEL, [49.6, 52.6], [18.8, 22.4], th(V, 1.9)); // counterweight knuckle
      beam(STEEL, P(38.5, 17.6), P(38.5, 23.9), 0.7, 0.5); // extra posts in the tail truss
      beam(STEEL, P(48.0, 19.0), P(48.0, 22.8), 0.7, 0.54);
    }
    // Laced inclined chord: two flanges converging on the apex knuckle, X-laced between.
    const A1 = [10.6, TC], C1 = [25.3, DIM.apex.y + 0.15], A2 = [14.8, TC], C2 = [26.6, DIM.apex.y - 0.5];
    beam(STEEL, P(...A1), P(...C1), 1.1, 0.68);
    beam(STEEL, P(...A2), P(...C2), 1.1, 0.68);
    const at = (A, C, t) => P(A[0] + (C[0] - A[0]) * t, A[1] + (C[1] - A[1]) * t);
    if (near) {
      for (let k = 0; k < 5; k++) {
        const t0 = k / 5 + 0.04, t1 = (k + 1) / 5 - 0.02;
        beam(STEEL, at(A1, C1, t0), at(A2, C2, t1), 0.3, 0.3);
        beam(STEEL, at(A2, C2, t0), at(A1, C1, t1), 0.3, 0.22);
        if (k > 0) beam(STEEL, at(A1, C1, k / 5), at(A2, C2, k / 5), 0.3, 0.38);
      }
    }
    knuckle(STEEL, [DIM.apex.b, DIM.apex.y, V], 1.35, 1.5, rim); // leaf trunnion housing
    // Tail truss: upper chord peaking over the tower, lower chord and heavy diagonal, posts, lacing.
    beam(STEEL, P(26.0, 23.3), P(44.0, 24.7), 1.1, 0.8);
    beam(STEEL, P(44.0, 24.7), P(51.2, 21.8), 1.1, 0.94);
    beam(STEEL, P(39.0, 17.0), P(51.2, 19.8), 1.1, 0.82);
    beam(STEEL, P(26.4, 22.0), P(39.0, 17.2), 1.2, 0.98);
    beam(STEEL, P(44.0, 18.2), P(44.0, 24.4), 0.8, 0.62);
    beam(STEEL, P(33.0, 19.5), P(33.0, 23.5), 0.7, 0.58);
    if (near) {
      for (const [a, c, t] of [
        [[28.0, 22.0], [33.0, 23.3], 0.3], [[28.0, 22.9], [33.0, 19.9], 0.22],
        [[33.0, 19.9], [44.0, 24.1], 0.3], [[33.0, 23.3], [44.0, 18.7], 0.22],
        [[44.0, 18.7], [51.0, 21.1], 0.3], [[44.0, 24.1], [51.0, 20.4], 0.22],
      ]) beam(STEEL, P(...a), P(...c), 0.3, t);
    }
    knuckle(STEEL, [51.2, 20.6, V], 1.45, 1.5, rim); // counterweight trunnion housing
    // Concrete counterweight, inboard of its frame: a chamfered slab 8 m long, 10.4 m high, 3.6 m thick.
    const k = DIM.block;
    prism(CONC, [[k.b0 + 1.5, k.y0], [k.b1 - 1.5, k.y0], [k.b1, k.y0 + 1.6], [k.b1, k.y1 - 1.4], [k.b1 - 1.4, k.y1], [k.b0 + 1.2, k.y1], [k.b0, k.y1 - 1.2], [k.b0, k.y0 + 1.5]], [V - s * (0.5 + k.thick), V - s * 0.5].sort((x, y) => x - y));
    beam(STEEL, [45.4, 16.8, V - s * 0.9], [43.0, 18.1, V - s * 0.9], 0.6, 1.1); // steel ears carrying the block
    beam(STEEL, [51.4, 16.2, V - s * 0.9], [51.2, 19.6, V - s * 0.9], 0.6, 1.1);
    // Apex lamp platform and mast.
    cuboid(STEEL, [25.4, 27.4], [23.7, 23.9], th(V, 1.6));
    cuboid(STEEL, [26.35, 26.45], [23.85, DIM.apex.y + 3.0], [V - 0.05, V + 0.05]);
    if (near) {
      for (const pb of [25.5, 27.3]) for (const pv of [V - 0.62, V + 0.62]) cuboid(STEEL, [pb - 0.05, pb + 0.05], [23.85, 24.99], [pv - 0.05, pv + 0.05]);
      for (const pb of [25.5, 27.3]) cuboid(STEEL, [pb - 0.02, pb + 0.02], [24.85, 24.93], [V - 0.62, V + 0.62]);
      for (const pv of [V - 0.62, V + 0.62]) cuboid(STEEL, [25.5, 27.3], [24.89, 24.97], [pv - 0.02, pv + 0.02]);
      // Guard plate of the stair that climbs the front leg.
      const n = [-0.502, 0.865];
      beam(STEEL, P(22.9 + n[0] * 0.95, 0.6 + n[1] * 0.95), P(37.3 + n[0] * 0.95, 17.2 + n[1] * 0.95), 0.5, 0.14);
    }
  }
  // Cross girders tying the two frames over the road (all far above the carriageway).
  cuboid(STEEL, [25.2, 26.8], [21.8, 23.2], [VW, VE]); // at the trunnions
  cuboid(STEEL, [43.2, 44.8], [23.3, 24.3], [VW, VE]); // at the peak of the tail truss
  cuboid(STEEL, [50.6, 51.8], [19.4, 20.8], [VW, VE]); // at the counterweight knuckles
  cuboid(STEEL, [DIM.towerB - 0.8, DIM.towerB + 0.8], [16.4, 17.8], [VW, VE]); // tower top
  cuboid(STEEL, [DIM.towerB - 1.1, DIM.towerB + 1.1], [6.2, 7.7], [VW, VE]); // tower portal over the road, 6.2 m clear

  // ---- railings along both sidewalks and the house platform ---------------------------------------
  function rail(V, b0, b1) {
    cuboid(STEEL, [b0, b1], [1.04, 1.12], th(V, 0.08));
    if (!near) return;
    cuboid(STEEL, [b0, b1], [0.5, 0.57], th(V, 0.07));
    const count = Math.round((b1 - b0) / 2.2);
    for (let q = 0; q <= count; q++) {
      const x = b0 + ((b1 - b0) * q) / count;
      cuboid(STEEL, [x - 0.06, x + 0.06], [0.06, 1.16], th(V, 0.16));
    }
  }
  rail(-RAIL, -26.5, 38.9);
  rail(RAIL, -26.5, 33.8); // stops at the north-west hut
  if (near) {
    // Pier platform of the operator's house: rails on its two outer sides.
    cuboid(STEEL, [-35.94, -35.86], [1.04, 1.12], [RAIL + 0.1, 21.3]);
    cuboid(STEEL, [-35.9, -25.5], [1.06, 1.14], [21.26, 21.34]);
    for (let x = -35.9; x <= -25.4; x += 2.1) cuboid(STEEL, [x - 0.08, x + 0.08], [0.06, 1.16], [21.14, 21.46]);
    for (let z = RAIL + 0.1; z <= 21.2; z += 2.2) cuboid(STEEL, [-36.04, -35.76], [0.06, 1.18], [z - 0.08, z + 0.08]);
  }

  // ---- operator's house (south-east end, east side) -------------------------------------------------
  {
    const body = { b0: -34.0, b1: -27.4, v0: 13.7, v1: 19.1 };
    cuboid(HOUSE, [body.b0, body.b1], [0.06, 4.7], [body.v0, body.v1]); // oxblood panelled block
    cuboid(CONC, [body.b0 - 0.2, body.b1 + 0.2], [0.06, 0.5], [body.v0 - 0.2, body.v1 + 0.2]); // plinth
    cuboid(CONC, [-35.0, -26.4], [4.5, 5.0], [12.8, 20.0]); // cantilevered balcony slab
    cuboid(HOUSE, [-34.4, -27.0], [4.95, 6.25], [13.25, 19.55]); // cab base band
    cuboid(GLASS, [-34.3, -27.1], [6.25, 7.95], [13.4, 19.4]); // glazed control cab
    cuboid(HOUSE, [-35.4, -26.0], [7.9, 8.5], [12.4, 20.4]); // roof fascia
    frustum(TRIM, { b0: -35.52, b1: -25.88, v0: 12.28, v1: 20.52 }, 8.5, { b0: -33.4, b1: -28.0, v0: 15.0, v1: 17.8 }, 9.3); // green hip roof
    if (near) {
      // Window on a wall: trim frame proud 0.06, glass proud 0.10 (never coplanar with the wall or each other).
      const slab = (wall, o, out, inn) => (o > 0 ? [wall - inn, wall + out] : [wall - out, wall + inn]);
      const win = (axis, wall, o, along, y0, y1, w) => {
        const f = slab(wall, o, 0.06, 0.05), g = slab(wall, o, 0.1, 0.05), a = [along - w / 2 - 0.1, along + w / 2 + 0.1], c = [along - w / 2, along + w / 2];
        if (axis === 'v') { cuboid(TRIM, a, [y0 - 0.1, y1 + 0.1], f); cuboid(GLASS, c, [y0, y1], g); } else { cuboid(TRIM, f, [y0 - 0.1, y1 + 0.1], a); cuboid(GLASS, g, [y0, y1], c); }
      };
      for (const x of [-32.8, -30.6]) { win('v', body.v0, -1, x, 1.6, 2.9, 0.9); win('v', body.v1, 1, x, 1.6, 2.9, 0.9); }
      win('b', body.b0, -1, 16.4, 1.6, 2.9, 0.9); win('b', body.b1, 1, 16.4, 1.6, 2.9, 0.9);
      cuboid(TRIM, [-29.4, -28.2], [0.06, 2.3], [body.v0 - 0.07, body.v0 + 0.05]); // door, road side
      cuboid(GLASS, [-29.1, -28.5], [1.3, 2.0], [body.v0 - 0.12, body.v0 + 0.05]);
      // Mullions of the glazed cab and its balcony rail.
      for (let q = 0; q <= 5; q++) {
        const x = -34.3 + (7.2 * q) / 5;
        cuboid(TRIM, [x - 0.06, x + 0.06], [6.2, 7.9], [13.32, 13.46]);
        cuboid(TRIM, [x - 0.06, x + 0.06], [6.2, 7.9], [19.34, 19.48]);
      }
      for (let q = 1; q <= 4; q++) {
        const z = 13.4 + (6.0 * q) / 5;
        cuboid(TRIM, [-34.36, -34.22], [6.2, 7.9], [z - 0.06, z + 0.06]);
        cuboid(TRIM, [-27.18, -27.04], [6.2, 7.9], [z - 0.06, z + 0.06]);
      }
      for (const x of [-34.9, -26.5]) cuboid(TRIM, [x - 0.015, x + 0.015], [5.4, 6.0], [12.9, 19.9]);
      for (const z of [12.9, 19.9]) cuboid(TRIM, [-34.9, -26.5], [5.4, 6.0], [z - 0.015, z + 0.015]);
      for (let q = 0; q <= 4; q++) {
        const x = -34.9 + (8.4 * q) / 4;
        for (const z of [12.9, 19.9]) cuboid(TRIM, [x - 0.05, x + 0.05], [5.0, 6.05], [z - 0.05, z + 0.05]);
      }
      for (const x of [-33.0, -30.7, -28.4]) { // black corbels under the slab, on both long sides
        beam(STEEL, [x, 3.7, 13.72], [x, 4.52, 12.95], 0.35, 0.3, [0, 1, 0]);
        beam(STEEL, [x, 3.7, 19.08], [x, 4.52, 19.85], 0.35, 0.3, [0, 1, 0]);
      }
    }
  }
  // ---- cream huts with dark hip roofs: watchman's (beside the toe) and the one at the heel tower -----
  function hut(b0, b1, v0, v1) {
    cuboid(CREAM, [b0, b1], [0.06, 3.0], [v0, v1]);
    frustum(STEEL, { b0: b0 - 0.4, b1: b1 + 0.4, v0: v0 - 0.4, v1: v1 + 0.4 }, 2.95, { b0: b0 + 1.7, b1: b1 - 1.7, v0: v0 + 1.1, v1: v1 - 1.1 }, 4.05);
    if (near) {
      const mid = (b0 + b1) / 2;
      cuboid(GLASS, [mid - 1.6, mid - 0.6], [1.3, 2.3], [v0 - 0.08, v0 + 0.05]);
      cuboid(GLASS, [mid + 0.5, mid + 1.5], [1.3, 2.3], [v0 - 0.08, v0 + 0.05]);
      cuboid(GLASS, [b1 - 0.05, b1 + 0.08], [1.3, 2.3], [(v0 + v1) / 2 - 0.5, (v0 + v1) / 2 + 0.5]);
    }
  }
  hut(-25.0, -19.8, 13.6, 17.4);
  hut(34.6, 39.8, 12.2, 16.0);
  cuboid(HOUSE, [40.2, 41.4], [0.06, 2.3], [13.6, 14.8]); // red cabinet beside the heel hut

  return b.finish();
}
