import { CENTRAL, WEST_WING, EAST_WING, SIDE_E, SIDE_W, PORTICO, H, inside, area } from './tarrant-county-courthouse-plan.js';

// Window levels [y, height, arched] for the granite storeys above the raised basement.
const WING_LEVELS = [[1.45, 1.5, false], [5.5, 3.7, true], [10.8, 3.2, false], [15.6, 3.0, false]];
const CENTRAL_LEVELS = [...WING_LEVELS, [21.5, 3.3, false]];
const COURSES = [H.basement - .05, 9.75, 14.8];
const JOINTS = [.75, 3.4, 19.35, 20.05]; // thin rusticated joints between the window rows

export function buildBody(k) {
  const { near, box, bar, polygon, window, column, hip, gable, pediment, cylinder } = k;
  const gap = .18;

  // Walk a ring; levelsFor(mid, len, a, b) picks the window rows (null = skip the wall).
  function facade(ring, topY, levelsFor) {
    const sgn = Math.sign(area(ring));
    for (let i = 0; i < ring.length; i++) {
      const [ax, az] = ring[i], [bx, bz] = ring[(i + 1) % ring.length];
      const dx = bx - ax, dz = bz - az, len = Math.hypot(dx, dz);
      let nx = dz / len * sgn, nz = -dx / len * sgn;
      if (!inside(ring, (ax + bx) / 2 - nx * .3, (az + bz) / 2 - nz * .3)) { nx = -nx; nz = -nz; }
      const a = Math.atan2(nx, nz), tx = Math.cos(a), tz = -Math.sin(a);
      const mid = [(ax + bx) / 2, (az + bz) / 2];
      const spec = levelsFor(mid, len, [nx, nz]);
      // Courses and the eaves cornice run on every wall that has a spec, even the narrow ones.
      if (spec && spec.courses !== false) {
        for (const y of (spec.courseYs ?? (near ? COURSES : [COURSES[1]]))) if (y < (spec.top ?? topY) - 1) bar('trim', [ax + nx * .12, y, az + nz * .12], [bx + nx * .12, y, bz + nz * .12], .5, .9);
        bar('trim', [ax + nx * .3, (spec.top ?? topY) - .5, az + nz * .3], [bx + nx * .3, (spec.top ?? topY) - .5, bz + nz * .3], 1.0, 1.7);
        if (near) bar('trim', [ax + nx * .12, (spec.top ?? topY) - 1.3, az + nz * .12], [bx + nx * .12, (spec.top ?? topY) - 1.3, bz + nz * .12], .35, .7);
      }
      if (near && spec && spec.courses !== false && len >= 3.0) { // rusticated joints and quoin strips (flat trim quads, 12 cm proud)
        const top = spec.top ?? topY;
        for (const y of JOINTS) if (y < top - 2) window('trim', mid[0] + nx * .12, y, mid[1] + nz * .12, len - 1.6, .16, a);
        for (const e of [.35 / len, 1 - .35 / len]) window('trim', ax + dx * e + nx * .12, .6, az + dz * e + nz * .12, .7, top - 2.2, a);
      }
      if (!spec || !spec.levels || len < 3.0) continue;
      const n = Math.max(1, Math.round(len / (spec.pitch ?? 3.7)));
      for (let j = 0; j < n; j++) {
        const t = (j + .5) / n, x = ax + dx * t + nx * gap, z = az + dz * t + nz * gap;
        if (spec.skip && spec.skip(x, z)) continue;
        for (const [y, h, arch] of spec.levels) {
          const w = Math.min(1.7, len / n * .5);
          if (near) {
            // Two glazing quads leave a real granite mullion between them.
            window('glass', x - tx * w * .27, y, z - tz * w * .27, w * .44, h, a, arch);
            window('glass', x + tx * w * .27, y, z + tz * w * .27, w * .44, h, a, arch);
            bar('trim', [x - tx * w * .62 + nx * .17, y - .2, z - tz * w * .62 + nz * .17], [x + tx * w * .62 + nx * .17, y - .2, z + tz * w * .62 + nz * .17], .24, .5);
            if (!arch) bar('trim', [x - tx * w * .62 + nx * .17, y + h + .18, z - tz * w * .62 + nz * .17], [x + tx * w * .62 + nx * .17, y + h + .18, z + tz * w * .62 + nz * .17], .28, .5);
          } else window('glass', x, y, z, w * .95, h, a, arch);
        }
      }
    }
  }

  const wallRule = (heights) => (mid, len, n) => {
    const [mx, mz] = mid;
    if (Math.abs(mz) > 25.2 && Math.abs(mx) < 9) return null;       // portico front, built separately
    if (len < 3.0) return { courses: false };
    return heights(mx, mz, n, len);
  };

  // Wings: four storeys under a hipped roof, the mid-height of the front pavilions.
  for (const ring of [WEST_WING, EAST_WING]) {
    polygon('stone', ring, 0, H.wing - .3);
    facade(ring, H.wing, wallRule((mx, mz, n) => (Math.abs(n[0]) > .9 && Math.abs(mx) < 20 ? null : { levels: WING_LEVELS, top: H.wing })));
    const cx = (ring[0][0] + ring[1][0]) / 2, cz = (ring[0][1] + ring[2][1]) / 2, w = Math.abs(ring[1][0] - ring[0][0]) - 1.6, d = Math.abs(ring[2][1] - ring[0][1]) - 1.6;
    hip('roof', cx, cz, w, d, H.wing - .3, 24.2, w - 7, d - 7);
    if (near) { // hip lines and crest of the roof, and a dormer under the eave on each long side
      const hx = w / 2, hz = d / 2, tx2 = (w - 7) / 2, tz2 = (d - 7) / 2, y0 = H.wing - .3;
      for (const [sx, sz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) bar('trim', [cx + sx * hx, y0 + .05, cz + sz * hz], [cx + sx * tx2, 24.25, cz + sz * tz2], .3, .3);
      for (const sz of [-1, 1]) bar('trim', [cx - tx2, 24.3, cz + sz * tz2], [cx + tx2, 24.3, cz + sz * tz2], .32, .32);
      for (const sx of [-1, 1]) bar('trim', [cx + sx * tx2, 24.3, cz - tz2], [cx + sx * tx2, 24.3, cz + tz2], .32, .32);
      for (const sx of [-1, 1]) for (const dz of [-9, -3, 3, 9]) {
        const xf = cx + sx * (hx - .1), xc = cx + sx * (hx - 1.1), z = cz + dz;
        box('stone', xc, 21.9, z, 2.0, 2.2, 1.8);
        window('glass', xf + sx * .12, 21.2, z, .9, 1.4, sx > 0 ? Math.PI / 2 : -Math.PI / 2, true);
        hip('roof', xc, z, 2.0, 1.8, 23.0, 24.0, 1.8, .2);
      }
    }
    // Front and back pavilion pediments, centred on each wing.
    for (const dir of [1, -1]) {
      const zf = dir > 0 ? ring[2][1] : ring[0][1];
      pediment(cx, zf + dir * .32, 10.2, H.wing + .1, 23.8, 2.3, dir);
    }
  }
  // The two end projections: a basement porch carrying a balcony loggia.
  for (const [ring, s] of [[SIDE_E, 1], [SIDE_W, -1]]) {
    const xo = s > 0 ? Math.max(...ring.map((p) => p[0])) : Math.min(...ring.map((p) => p[0]));
    const zs = ring.map((p) => p[1]), zc = (Math.min(...zs) + Math.max(...zs)) / 2, d = Math.max(...zs) - Math.min(...zs);
    polygon('stone', ring, 0, 11.6);
    for (let i = 0; i < 3; i++) window('glass', xo + s * gap, i ? 5.3 : 1.45, zc + (i - 1) * 0 + (i === 2 ? 2.2 : i === 1 ? -2.2 : 0), 1.3, i ? 3.2 : 1.4, s > 0 ? Math.PI / 2 : -Math.PI / 2, i > 0);
    for (const zz of [zc - d * .3, zc + d * .3]) column(xo - s * .9, zz, 11.6, 17.4, .5);
    box('trim', xo - s * 1.1, 17.9, zc, 2.4, 1, d);
    box('trim', xo - s * 1.1, 12.1, zc, 2.4, .5, d);
    if (near) for (let i = 0; i < 6; i++) box('trim', xo - s * .1, 12.75, zc - d / 2 + .5 + i * (d - 1) / 5, .22, .8, .22);
  }

  // Central block, its north and south projections and the tall storey above the wings.
  polygon('stone', CENTRAL, 0, H.central - .3);
  facade(CENTRAL, H.central, wallRule((mx, mz, n, len) => {
    if (Math.abs(n[0]) > .9 && Math.abs(mx) > 17) return { levels: [[21.5, 3.3, false]], pitch: 3.9, courseYs: [], top: H.central };
    if (Math.abs(mz) > 23 && len > 20) return { levels: CENTRAL_LEVELS, top: H.central, skip: (x) => Math.abs(x) < 8.9, courseYs: [] }; // porticos fill the middle
    return { levels: CENTRAL_LEVELS, top: H.central };
  }));
  hip('roof', 0, -.1, 33.2, 24.2, H.central - .3, 30.4, 22, 11);
  for (const dir of [1, -1]) {
    const wall = dir > 0 ? PORTICO.south.zWall : PORTICO.north.zWall, z0 = dir * 9, z1 = dir * (wall - .45);
    gable('roof', .1, 23.6, z0, z1, H.central - .3, 30.2);
    pediment(.1, dir * (wall + .3), 24.4, H.central + .1, 31, 1.5, dir);
  }
  // Pavilion chimney stacks flanking the tower.
  for (const x of [-14.5, 14.5]) {
    box('stone', x, 30.9, -4.5, 2.4, 7.8, 2.4);
    box('trim', x, 34.9, -4.5, 3.1, .6, 3.1);
  }

  // North and south porticos: raised stair, four pink columns, balcony, coupled upper order, arched loggia windows.
  for (const dir of [1, -1]) {
    const pz = dir > 0 ? PORTICO.south : PORTICO.north, zWall = pz.zWall, zFront = pz.zFront;
    const zw = dir * zWall, zf = dir * zFront, zm = (zw + zf) / 2, d = zFront - zWall, px = PORTICO.x;
    box('stone', 0, H.basement / 2, zm, px * 2, H.basement, d);                      // porch platform
    const steps = near ? 12 : 4, run = near ? 7.2 : 6;
    for (let i = 0; i < steps; i++) {
      const hh = H.basement * (steps - 1 - i) / steps + H.basement / steps * .5, dd = run / steps;
      if (hh <= .06) continue;
      box('stone', 0, hh / 2, dir * (zFront + dd * (i + .5)), 12.4 - i * .12, hh, dd);
    }
    for (const x of [-7.2, -3.2, 3.2, 7.2]) column(x, dir * 24.5, H.basement, 12.8, .62);
    box('trim', 0, 13.5, zm, px * 2 + .4, 1.4, d - .05);                              // entablature / balcony slab
    bar('trim', [-px - .1, 14.5, dir * (zFront - .3)], [px + .1, 14.5, dir * (zFront - .3)], .3, .35);
    if (near) for (let i = 0; i <= 14; i++) box('trim', -px + .2 + i * (px * 2 - .4) / 14, 14.55, dir * (zFront - .3), .24, .8, .24);
    // loggia back wall: three tall arches over the recessed door pair
    for (const x of [-5.4, 0, 5.4]) window('glass', x, 15.4, dir * (zWall + gap), 2.5, 5.4, dir > 0 ? 0 : Math.PI, true);
    for (const x of [-5.4, 0, 5.4]) window('glass', x, H.basement + .3, dir * (zWall + gap), 2.4, 6.4, dir > 0 ? 0 : Math.PI, true);
    for (const sx of [-1, 1]) for (const y of (near ? COURSES : [COURSES[1]])) bar('trim', [sx * 8.5, y, dir * (zWall + .12)], [sx * 12.45, y, dir * (zWall + .12)], .5, .9);
    for (const x of [-7.9, -3.3, 3.3, 7.9]) column(x, dir * (zWall + .85), 14.2, 20.6, .42);
    bar('trim', [-12.5, 21.4, dir * (zWall + .55)], [12.5, 21.4, dir * (zWall + .55)], 1.0, 1.2);
  }
}
