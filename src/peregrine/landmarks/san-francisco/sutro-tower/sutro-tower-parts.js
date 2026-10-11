// Sutro Tower: the things a driver reads from the road, each a function of the builder.
// legs() the three inward-then-outward leaning triangular legs in orange and white bands, plates() the solid
// triangular decks of Levels 2 to 4, crossbars() the white Level 5 triangle and the three orange Level 6
// crossarms, masts() the three top masts, cables() the stays and the X bracing, lamps() the aviation lights.
// Numbers live in sutro-tower-shape.js. `near` adds lattice posts, cables and finer cylinders.
import {
  at, RAD, LEG_BEARINGS, LEG_KINKS, LEG_TOP, legRadius, legSide, legDepth, BANDS, PLATES, LEVEL5, LEVEL6, PLATE_INSET, MAST, HEIGHT,
} from './sutro-tower-shape.js';
import { polys, loft, cylinder, axisCylinder } from './sutro-tower-mesh.js';

const unit = (bearing) => [Math.sin(bearing * RAD), 0, -Math.cos(bearing * RAD)];
const tang = (bearing) => [Math.cos(bearing * RAD), 0, Math.sin(bearing * RAD)];

/** The equilateral triangular section of a leg at height h: flat face toward the axis, apex outward. */
export function legSection(bearing, h) {
  const R = legRadius(h), s = legSide(h), H = legDepth(h), u = unit(bearing), t = tang(bearing);
  const c = [u[0] * R, h, u[2] * R];
  return {
    centre: c,
    inner: [c[0] - u[0] * H / 3, h, c[2] - u[2] * H / 3], // middle of the flat face
    ring: [
      [c[0] + u[0] * H * 2 / 3, h, c[2] + u[2] * H * 2 / 3],
      [c[0] - u[0] * H / 3 + t[0] * s / 2, h, c[2] - u[2] * H / 3 + t[2] * s / 2],
      [c[0] - u[0] * H / 3 - t[0] * s / 2, h, c[2] - u[2] * H / 3 - t[2] * s / 2],
    ],
  };
}

/** The three legs: one prism per paint band (split where the leg changes direction: the Level 4 waist and the top of the flare). */
export function legs(b) {
  for (const bearing of LEG_BEARINGS) {
    for (const [h0, h1, material] of BANDS) {
      const stops = [h0, ...LEG_KINKS.filter((k) => k > h0 && k < h1), h1];
      for (let i = 0; i < stops.length - 1; i++) {
        const lo = legSection(bearing, stops[i]).ring, hi = legSection(bearing, stops[i + 1]).ring;
        loft(b, material, lo, hi, { top: stops[i + 1] === LEG_TOP });
      }
    }
  }
}

/** Levels 2, 3 and 4: solid triangular plates whose corners sit on the legs (the mapped slabs are 4 m deep). */
export function plates(b) {
  for (const { y0, y1 } of PLATES) {
    const ym = (y0 + y1) / 2, r = legRadius(ym) + legDepth(ym) * 2 / 3 - PLATE_INSET;
    const lo = LEG_BEARINGS.map((br) => at(br, r, y0));
    loft(b, 'orange', lo, LEG_BEARINGS.map((br) => at(br, r, y1)), { top: true });
    polys(b, 'soffit', [[...lo, [0, -1, 0]]]); // the underside is pale brown in the photographs, not the deck colour
  }
}

/**
 * A rectangular lattice beam along the plan line A -> B (x, z points): four chords, a Warren zig-zag and (near)
 * vertical posts on both side faces. Chords are square bars, members round.
 */
function beam(b, near, material, A, B, y0, y1, width, { pitch, chord = 0.3, member = 0.09 }) {
  const dx = B[0] - A[0], dz = B[1] - A[1], L = Math.hypot(dx, dz), e = [dx / L, dz / L], s = [-e[1], e[0]];
  const angle = Math.atan2(-e[1], e[0]), cx = (A[0] + B[0]) / 2, cz = (A[1] + B[1]) / 2;
  const yb = y0 + chord / 2, yt = y1 - chord / 2, off = width / 2 - chord / 2;
  if (!near) {
    // far: an I-beam (two flanges and a solid web) so the bar reads as a bold truss at 1-3 km instead of four hairlines
    const flange = 0.8;
    for (const y of [y0 + flange / 2, y1 - flange / 2]) b.box(material, [cx, y, cz], [L, flange, width], angle);
    b.box(material, [cx, (y0 + y1) / 2, cz], [L - 0.2, y1 - y0 - 2 * flange + 0.2, 0.5], angle);
    return;
  }
  for (const side of [-1, 1]) for (const y of [yb, yt]) b.box(material, [cx + s[0] * side * off, y, cz + s[1] * side * off], [L, chord, chord], angle);
  const n = Math.max(2, Math.round(L / pitch));
  const node = (i, side, y) => [A[0] + e[0] * L * i / n + s[0] * side * off, y, A[1] + e[1] * L * i / n + s[1] * side * off];
  for (const side of [-1, 1]) {
    for (let i = 0; i < n; i++) {
      const up = i % 2 === 0;
      b.bar(material, node(i, side, up ? yb : yt), node(i + 1, side, up ? yt : yb), member, member, 0, true);
    }
    if (near) for (let i = 0; i <= n; i++) b.bar(material, node(i, side, yb), node(i, side, yt), member, member, 0, true);
  }
}

const planPoint = (bearing, r) => { const p = at(bearing, r, 0); return [p[0], p[2]]; };

/** Level 5 (white triangle through the three leg axes) and Level 6 (three orange crossarms past the legs). */
export function crossbars(b, { near }) {
  const pairs = LEG_BEARINGS.map((br, i) => [br, LEG_BEARINGS[(i + 1) % 3]]);
  const r5 = legRadius((LEVEL5.y0 + LEVEL5.y1) / 2);
  for (const [a, c] of pairs) beam(b, near, 'white', planPoint(a, r5), planPoint(c, r5), LEVEL5.y0, LEVEL5.y1, LEVEL5.width, { pitch: near ? 2.6 : 8, chord: 0.28, member: 0.08 });
  pairs.forEach(([a, c], i) => {
    const A = planPoint(a, LEVEL6.radius), B = planPoint(c, LEVEL6.radius), L = Math.hypot(B[0] - A[0], B[1] - A[1]);
    const e = [(B[0] - A[0]) / L, (B[1] - A[1]) / L], ex = LEVEL6.extend;
    const y0 = LEVEL6.y0 + i * LEVEL6.stagger, y1 = LEVEL6.y1 + i * LEVEL6.stagger;
    beam(b, near, 'orange', [A[0] - e[0] * ex, A[1] - e[1] * ex], [B[0] + e[0] * ex, B[1] + e[1] * ex], y0, y1, LEVEL6.width, { pitch: near ? 3 : 9, chord: 0.34, member: 0.1 });
  });
}

/** Where the mast of leg k stands and the plan frame of its square lattice. */
const mastFrame = (k) => {
  const bearing = LEG_BEARINGS[k], p = at(bearing, MAST.radius, 0);
  return { x: p[0], z: p[2], u: unit(bearing), t: tang(bearing), top: MAST.latticeTop[k] };
};
const mastWidth = (y) => MAST.wide + (MAST.narrow - MAST.wide) * Math.min(1, (y - MAST.base) / (MAST.latticeTop[0] - MAST.base));

/** The three top masts: a square lattice column, a cap plate, then a radome (orange) or a white pole with an orange band. */
export function masts(b, { near }) {
  const segs = near ? 10 : 6;
  for (let k = 0; k < 3; k++) {
    const { x, z, u, t, top } = mastFrame(k);
    const corner = (su, st, y) => { const w = mastWidth(y) / 2; return [x + u[0] * su * w + t[0] * st * w, y, z + u[2] * su * w + t[2] * st * w]; };
    const yb = MAST.base - 0.3, cs = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
    if (!near) {
      // far: a solid column 2.8 m tapering to 2.4 m (the lattice is sub-pixel beyond 500 m), a cap and a fatter radome
      const ring = (y, w) => cs.map(([su, st]) => [x + u[0] * su * w / 2 + t[0] * st * w / 2, y, z + u[2] * su * w / 2 + t[2] * st * w / 2]);
      loft(b, 'steel', ring(yb, 2.8), ring(top, 2.4));
      b.box('steel', [x, top + 0.1, z], [2.6, 0.3, 2.6], Math.atan2(-t[2], t[0]));
      if (k < 2) cylinder(b, 'orange', x, z, 1.0, top, HEIGHT - 0.6, 8);
      else { cylinder(b, 'white', x, z, 0.8, top, HEIGHT - 0.6, 8); cylinder(b, 'orange', x, z, 0.86, 280, 289, 8); }
      continue;
    }
    for (const [su, st] of cs) b.bar('steel', corner(su, st, yb), corner(su, st, top), 0.11, 0.11, 0);
    const panels = Math.round((top - MAST.base) / (near ? 3.4 : 13));
    for (let f = 0; f < 4; f++) {
      const [s0, t0] = cs[f], [s1, t1] = cs[(f + 1) % 4];
      for (let i = 0; i < panels; i++) {
        const ya = MAST.base + (top - MAST.base) * i / panels, yc = MAST.base + (top - MAST.base) * (i + 1) / panels;
        const up = i % 2 === 0;
        b.bar('steel', corner(up ? s0 : s1, up ? t0 : t1, ya), corner(up ? s1 : s0, up ? t1 : t0, yc), 0.055, 0.055, 0, true);
      }
    }
    const w = mastWidth(top);
    b.box('steel', [x, top + 0.1, z], [w, 0.3, w], Math.atan2(-t[2], t[0]));
    if (k < 2) {
      // radome: a 1.6 m orange cylinder, 13 m long, with a beacon on top
      cylinder(b, 'orange', x, z, MAST.radome, top, HEIGHT - 0.6, segs);
    } else {
      // south-east mast: white pole with an orange aviation band
      cylinder(b, 'white', x, z, MAST.radome * 0.8, top, HEIGHT - 0.6, segs);
      cylinder(b, 'orange', x, z, MAST.radome * 0.8 + 0.06, 280, 289, segs);
    }
  }
}

/** Guy cables from the mast tops to the crossarm tips (far keeps one fan), and the X bracing between the legs (near only). */
export function cables(b, { near }) {
  if (!near) return; // far: the stays are sub-pixel, dropped
  const tips = [];
  LEG_BEARINGS.forEach((a, i) => {
    const c = LEG_BEARINGS[(i + 1) % 3], A = planPoint(a, LEVEL6.radius), B = planPoint(c, LEVEL6.radius), L = Math.hypot(B[0] - A[0], B[1] - A[1]);
    const e = [(B[0] - A[0]) / L, (B[1] - A[1]) / L], ex = LEVEL6.extend, top = LEVEL6.y1 + i * LEVEL6.stagger + 0.1;
    tips.push([A[0] - e[0] * ex, top, A[1] - e[1] * ex], [B[0] + e[0] * ex, top, B[1] + e[1] * ex]);
  });
  for (let k = 0; k < 3; k++) {
    const { x, z, top } = mastFrame(k);
    // two fans: from the top of the lattice and from the tip of the radome (inside it, so the cable starts on its surface)
    for (const y of near ? [Math.min(top, 284.4) - 0.2, HEIGHT - 2] : [Math.min(top, 284.4) - 0.2]) for (const tip of tips) b.bar('steel', [x, y, z], tip, near ? 0.045 : 0.09, 0.045, 0, true);
  }
  if (!near) return;
  // X bracing between the legs: every pair of legs, panel by panel, attached to the flat inner faces
  const panels = [[8, PLATES[0].y0], [PLATES[0].y1, PLATES[1].y0], [PLATES[1].y1, PLATES[2].y0], [PLATES[2].y1, LEVEL5.y0]];
  LEG_BEARINGS.forEach((a, i) => {
    const c = LEG_BEARINGS[(i + 1) % 3];
    for (const [ya, yb] of panels) {
      const a0 = legSection(a, ya).inner, a1 = legSection(a, yb).inner, c0 = legSection(c, ya).inner, c1 = legSection(c, yb).inner;
      b.bar('steel', a0, c1, 0.05, 0.05, 0, true);
      b.bar('steel', c0, a1, 0.05, 0.05, 0, true);
    }
  });
}

/** Equipment seen from the road (near only): the row of white pods on the north-east leg, dishes and whips on the decks. */
export function equipment(b) {
  // five white pods on short arms off the north-east leg below Level 5, pointing east-north-east
  const dir = unit(70);
  for (const h of [199.3, 196.4, 193.5, 190.6, 187.7]) {
    const s = legSection(30, h), apex = s.ring[0], from = [apex[0] - dir[0] * 0.2, h, apex[2] - dir[2] * 0.2];
    b.bar('steel', from, [apex[0] + dir[0] * 1.6, h, apex[2] + dir[2] * 1.6], 0.06, 0.06, 0, true);
    axisCylinder(b, 'white', [apex[0] + dir[0] * 1.5, h, apex[2] + dir[2] * 1.5], [apex[0] + dir[0] * 2.5, h, apex[2] + dir[2] * 2.5], 0.55, 8);
  }
  // microwave dishes on posts along the east edges of the Level 2 and 3 decks (white discs facing east)
  for (const [plate, stations] of [[PLATES[0], [-12, -6, 6, 12]], [PLATES[1], [-6, 6]]]) {
    const ym = (plate.y0 + plate.y1) / 2, rv = legRadius(ym) + legDepth(ym) * 2 / 3 - PLATE_INSET, x = rv / 2 - 1.2;
    for (const z of stations) {
      b.bar('steel', [x, plate.y1 - 0.2, z], [x, plate.y1 + 1.5, z], 0.07, 0.07, 0, true);
      axisCylinder(b, 'white', [x - 0.2, plate.y1 + 1.8, z], [x + 0.2, plate.y1 + 1.8, z], 1.3, 10);
    }
  }
  // the red whip antenna on the Level 2 deck and a pair of white ones on Level 4
  const l2 = PLATES[0], l4 = PLATES[2];
  b.bar('orange', [3, l2.y1 - 0.2, 6], [3, l2.y1 + 12, 6], 0.16, 0.16, 0, true);
  b.bar('white', [-2, l4.y1 - 0.2, 0], [-2, l4.y1 + 5, 0], 0.08, 0.08, 0, true);
}

/** Aviation lights: steady red obstruction lamps on every deck corner and crossarm tip, beacons on the mast tips. */
export function lamps(b) {
  const lamp = (x, y, z, size) => b.box('lamp', [x, y, z], [size, size, size], 0);
  for (const { y1 } of PLATES) {
    const ym = y1 - 2, r = legRadius(ym) + legDepth(ym) * 2 / 3 - PLATE_INSET - 1.4;
    for (const br of LEG_BEARINGS) { const p = at(br, r, y1 + 0.2); lamp(p[0], p[1], p[2], 0.8); }
  }
  for (const br of LEG_BEARINGS) { const p = at(br, legRadius(LEVEL5.y1) + legDepth(LEVEL5.y1) * 2 / 3, LEVEL5.y1 + 0.2); lamp(p[0], p[1], p[2], 0.8); }
  LEG_BEARINGS.forEach((a, i) => {
    const c = LEG_BEARINGS[(i + 1) % 3], A = planPoint(a, LEVEL6.radius), B = planPoint(c, LEVEL6.radius), L = Math.hypot(B[0] - A[0], B[1] - A[1]);
    const e = [(B[0] - A[0]) / L, (B[1] - A[1]) / L], ex = LEVEL6.extend - 0.8, top = LEVEL6.y1 + i * LEVEL6.stagger;
    lamp(A[0] - e[0] * ex, top + 0.2, A[1] - e[1] * ex, 1.0); lamp(B[0] + e[0] * ex, top + 0.2, B[1] + e[1] * ex, 1.0);
  });
  for (let k = 0; k < 3; k++) { const p = at(LEG_BEARINGS[k], MAST.radius, HEIGHT - 0.5); lamp(p[0], p[1], p[2], 1.0); }
}
