// Rheinturm: shaft, two-level pod, Lichtzeitpegel and stepped mast.
// Numbers live in rheinturm-shape.js. `near` selects the detail.
import { lathe, beams, lamp, porthole, at, tangent } from './rheinturm-mesh.js';
import {
  SHAFT, shaftRadius, PLINTH, POD, MAST, CLOCK, lampY, lampMaterial, skinRadius, JOINTS, DOOR, TIP,
} from './rheinturm-shape.js';

const range = (n, fn) => Array.from({ length: n }, (_, i) => fn(i));

function shaftRows(n) {
  const join = shaftRadius(PLINTH.join);
  const rows = [[join + PLINTH.extra, 0], [join + PLINTH.extra, PLINTH.h], [join, PLINTH.join]];
  for (let i = 1; i <= n; i++) {
    const h = PLINTH.join + (SHAFT.hNeck - PLINTH.join) * (i / n) ** 1.15;
    rows.push([shaftRadius(h), h]);
  }
  return rows;
}

/** Tapering concrete shaft, pour joints and the east entrance. */
export function shaft(b, near) {
  const seg = near ? 64 : 24;
  lathe(b, 'concrete', shaftRows(near ? 18 : 8), seg);
  // Ground cap, so the tube is not an open shell from below.
  const foot = shaftRadius(PLINTH.join) + PLINTH.extra;
  lathe(b, 'concrete', [[foot, 0], [0.02, 0]], seg);
  const bands = near ? JOINTS : JOINTS.filter((_, i) => i % 2 === 0);
  for (const h of bands) {
    const r = shaftRadius(h);
    lathe(b, 'concrete', [[r, h - 0.16], [r + 0.12, h - 0.16], [r + 0.12, h + 0.16], [r, h + 0.16]], seg);
  }
  door(b, near);
}

function door(b, near) {
  const D = DOOR;
  const y = D.sill + D.height / 2;
  // Sit on the plinth face. The leaf is buried 4 cm into it; nothing lands outside
  // the 9.35 m inscribed foot ring (jamb outer face ≈ plinth + 0.1 m).
  const plinth = shaftRadius(PLINTH.join) + PLINTH.extra;
  b.box('glass', [plinth - 0.04 + D.thick / 2, y, 0], [D.thick, D.height, D.width]);
  const r = plinth + 0.02;
  const top = D.sill + D.height;
  const jamb = (z) => ({ from: [r, 0, z], to: [r, top, z], side: [0, 0, 1], width: 0.16, thick: 0.16 });
  beams(b, 'concrete', [
    jamb(-D.width / 2),
    jamb(D.width / 2),
    { from: [r, top, -D.width / 2], to: [r, top, D.width / 2], side: [0, 1, 0], width: 0.18, thick: 0.16 },
  ], { caps: near });
}

/** Inverted cone, two glazed storeys, roof brim. */
export function pod(b, near) {
  const P = POD;
  const seg = near ? 72 : 28;
  const g = near ? P.groove : P.groove * 0.45;
  lathe(b, 'concrete', P.trumpet, seg, { groove: g });
  // Panel ribs on the cone, the joints a driver reads from below. The centreline sits on
  // the skin; `thick` is along the surface normal, so the outer half stands proud and the
  // inner half is buried in the concrete. Ends run into the shaft and the glass sill.
  const ribN = near ? 36 : 12;
  const ribs = [];
  for (let i = 0; i < ribN; i++) {
    const bearing = (i + 0.5) * 360 / ribN;
    for (let k = 0; k < P.trumpet.length - 1; k++) {
      const [r0, h0] = P.trumpet[k], [r1, h1] = P.trumpet[k + 1];
      ribs.push({
        from: at(bearing, r0, h0),
        to: at(bearing, r1, h1),
        side: tangent(bearing),
        width: near ? 0.26 : 0.45,
        thick: 0.32,
      });
    }
  }
  beams(b, 'concrete', ribs, { caps: false });
  lathe(b, 'glass', P.restaurant, seg);
  lathe(b, 'concrete', P.band, seg);
  lathe(b, 'glass', P.observation, seg);
  lathe(b, 'concrete', [...P.shoulder, ...P.brim.slice(1)], seg, { crease: [P.shoulder.length] });
  // Floors meet the concrete lip (outer radius is the skin at that height) and close the disc.
  for (const h of P.floors) lathe(b, 'concrete', [[skinRadius(h) - 0.15, h], [0.02, h]], seg);

  // Glazing bars stay 14 cm outside the glass. A straight bar cannot also reach the
  // cone lip, the proud deck band and the inset shoulder, so each end grows a short
  // foot that crosses that concrete. Feet are open where they enter the solid.
  const mullions = (profile, count, thick, foot) => {
    const [r0, h0] = profile[0], [r1, h1] = profile[1];
    const bars = [], feet = [];
    for (let i = 0; i < count; i++) {
      const bearing = (i + 0.5) * 360 / count;
      const side = tangent(bearing);
      const width = near ? 0.14 : 0.28;
      const a = at(bearing, r0 + 0.14, h0), c = at(bearing, r1 + 0.14, h1);
      bars.push({ from: a, to: c, side, width, thick });
      for (const to of foot(bearing)) feet.push({ from: to.anchor === 'top' ? c : a, to: to.at, side, width, thick });
    }
    beams(b, 'metal', bars, { caps: false });
    beams(b, 'metal', feet, { caps: false });
    const y = (h0 + h1) / 2, r = (r0 + r1) / 2 + 0.2;
    lathe(b, 'metal', [[r - 0.05, y - 0.05], [r + 0.06, y - 0.05], [r + 0.06, y + 0.05], [r - 0.05, y + 0.05]], seg);
  };
  const lipY = P.restaurant[0][1] - 0.04;
  // Past the cone's panel groove (0.18 near, 0.08 far) so the foot ends inside the skin.
  const lipR = skinRadius(lipY) - 0.26;
  const bandY = (P.band[0][1] + P.band[1][1]) / 2;
  const bandR = P.band[0][0] + 0.06;
  mullions(P.restaurant, near ? 48 : 16, near ? 0.18 : 0.24, (bearing) => [
    { at: at(bearing, lipR, lipY) },
    { anchor: 'top', at: at(bearing, bandR, bandY) },
  ]);
  const shoulderY = P.shoulder[0][1] + 0.08;
  const shoulderR = P.shoulder[0][0] + (P.shoulder[1][0] - P.shoulder[0][0]) * (shoulderY - P.shoulder[0][1]) / (P.shoulder[1][1] - P.shoulder[0][1]);
  mullions(P.observation, near ? 48 : 16, near ? 0.18 : 0.24, (bearing) => [
    { at: at(bearing, bandR, P.band[1][1] - 0.12) },
    { anchor: 'top', at: at(bearing, shoulderR - 0.12, shoulderY) },
  ]);

  // Railing on the brim. Posts start inside the roof slab.
  const posts = near ? 36 : 16;
  const railR = 16.7;
  beams(b, 'metal', range(posts, (i) => {
    const bearing = i * 360 / posts;
    return {
      from: at(bearing, railR, 177.35),
      to: at(bearing, railR, 178.55),
      side: tangent(bearing),
      width: 0.08,
      thick: 0.08,
    };
  }), { caps: false });
  lathe(b, 'metal', [[railR - 0.05, 178.42], [railR + 0.05, 178.42], [railR + 0.05, 178.55], [railR - 0.05, 178.55]], seg);

  if (near) {
    // Short aerials on the roof deck, each planted in the slab.
    const whips = [];
    for (let i = 0; i < 12; i++) {
      const bearing = 15 + i * 30;
      whips.push({
        from: at(bearing, 11.5, 177.75),
        to: at(bearing, 11.5, 181.4),
        side: tangent(bearing),
        width: 0.1,
        thick: 0.1,
      });
    }
    beams(b, 'metal', whips, { caps: true });
  }
}

/** The 62 portholes of the Lichtzeitpegel, on the Rhine face. */
export function clock(b, near) {
  const seg = near ? 12 : 6;
  const buckets = { glow: [], light: [], dark: [] };
  for (let n = 1; n <= CLOCK.count; n++) buckets[lampMaterial(n)].push(n);
  for (const material of ['glow', 'light', 'dark']) {
    for (const n of buckets[material]) {
      const y = lampY(n);
      porthole(b, material, y, skinRadius(y), { hole: CLOCK.radius, gap: CLOCK.gap, depth: CLOCK.depth, segments: seg });
    }
  }
}

/** Stepped mast: white stages, red top, beacon, saucer lamps. */
export function mast(b, near) {
  const seg = near ? 24 : 12;
  const M = MAST;
  lathe(b, 'white', M.neck, seg);
  lathe(b, 'white', M.platform, seg, { crease: [1, 2, 3] });
  lathe(b, 'white', M.lower, seg);
  lathe(b, 'white', M.step, seg, { crease: [1, 2] });
  lathe(b, 'white', M.mid, seg);
  lathe(b, 'red', M.red, seg);
  lathe(b, 'white', M.tip, seg);
  lathe(b, 'light', M.beacon, Math.max(8, seg / 2));
  const L = M.rimLamps;
  for (const bearing of L.bearings) lamp(b, 'light', at(bearing, L.r, L.y), L.radius);
  // The beacon's apex is the published tip. `TIP` is read so a drift fails review.
  if (M.beacon[M.beacon.length - 1][1] !== TIP) throw new Error('beacon tip');
}
