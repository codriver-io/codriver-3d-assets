import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import * as P from './scotiabank-saddledome-parts.js';

// Scotiabank Saddledome (1983): the saddle roof, a hyperbolic paraboloid rising to the north-east and south-west
// ends and dipping to the south-east and north-west, over a 70 m round arena. Under its edge ring: the grey ribbed
// wall with sixteen leaning piers, the concourse band with its ribbon of windows on a raised deck, the concrete
// portals with the "Scotiabank Saddledome" lettering, and the red-orange towers and entrance at the two high ends.
// See docs/3d-calgary-scotiabank-saddledome.md for what is sourced and what is estimated.
const RAD = Math.PI / 180;
const UP = [0, 1, 0], DOWN = [0, -1, 0];
const out = (p) => { const [x, z] = P.radial(p); return [x, 0, z]; };
const pt = (r, y) => (p) => { const [x, z] = P.plan(typeof r === 'function' ? r(p) : r, p); return [x, typeof y === 'function' ? y(p) : y, z]; };

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  // far merges the minor materials into their neighbours
  const mat = (m) => (near ? m : ({ pier: 'concrete', light: 'dark' }[m] ?? m));
  const put = (m, g) => b.put(g, mat(m));
  const N = near ? 128 : 48, J = near ? 7 : 4, phis = P.ring(N);
  const band = (m, A, B, w) => put(m, P.strip(phis, A, B, w, true));
  const tops = new Map();
  const top = (p) => { if (!tops.has(p)) tops.set(p, P.wallTop(p)); return tops.get(p); };

  // ---- the roof: the saddle surface, its edge ring (fascia lit orange, soffit under it) ----
  put('roof', P.roofSurface(N, J));
  { // eight thin darker seams along the roof's two principal directions: the eye reads the saddle, not an egg
    const height = P.shellHeight(P.roofSurface(N, J));
    for (const g of P.seams(height, { along: [-40, -14, 14, 40], across: [-46, -22, 22, 46], step: near ? 5 : 8, lift: near ? [0.1, 0.16] : [0.14, 0.2] })) put('seam', g);
    height.dispose();
  }
  band('glow', pt(P.ringR, P.ringBottom), pt(P.ringR, P.ringTop), out);
  band('pier', (p) => pt(top(p).r, top(p).y)(p), pt(P.ringR, P.ringBottom), DOWN);

  // ---- the wall: ground recess, concourse deck, concourse band, ledge and the leaning upper wall ----
  band('dark', pt(P.BASE_R, 0), pt(P.BASE_R, P.SLAB_BOTTOM), out);
  band('dark', pt(P.BASE_R, P.SLAB_BOTTOM), pt(P.DECK_R, P.SLAB_BOTTOM), DOWN);
  band('concrete', pt(P.DECK_R, P.SLAB_BOTTOM), pt(P.DECK_R, P.DECK_Y), out);
  band('pier', pt(P.DECK_R, P.DECK_Y), pt(P.BAND_R, P.DECK_Y), UP);
  band('concrete', pt(P.BAND_R, P.DECK_Y), pt(P.BAND_R, P.LEDGE_Y), out);
  band('light', pt(P.BAND_R + 0.2, 9.8), pt(P.BAND_R + 0.2, 11.6), out); // the concourse ribbon window
  band('pier', pt(P.BAND_R, P.LEDGE_Y), pt(P.WALL_R0, P.LEDGE_Y), UP);
  band('concrete', pt(P.WALL_R0, P.LEDGE_Y), (p) => pt(top(p).r, top(p).y)(p), out);
  if (near) { // dark reveal lines that follow the roof's curve across the ribbed panels
    for (const f of [0.2, 0.4, 0.6, 0.8]) {
      const y = (p, d) => P.LEDGE_Y + f * (top(p).y - P.LEDGE_Y) + d;
      band('dark', (p) => pt(P.wallR(y(p, -0.22)) + 0.15, y(p, -0.22))(p), (p) => pt(P.wallR(y(p, 0.22)) + 0.15, y(p, 0.22))(p), out);
    }
  }
  if (near) { // small windows in the tall panels of the two high ends: a row of slits and, above, a few portholes
    const slits = [], holes = [];
    for (const pe of [0, 180]) {
      for (const d of [-56.25, -33.75, -11.25, 11.25, 33.75, 56.25]) {
        const phi = pe + d, H = top(phi).y - P.LEDGE_Y, [rx, rz] = P.radial(phi), [tx, tz] = P.tangent(phi);
        const at = (y, t) => { const rr = P.wallR(y) + 0.15; return [rr * rx + t * tx, y, rr * rz + t * tz]; };
        const yc = P.LEDGE_Y + 0.3 * H;
        slits.push({ p: [at(yc - 0.45, -1.2), at(yc - 0.45, 1.2), at(yc + 0.45, 1.2), at(yc + 0.45, -1.2)], w: [rx, 0, rz] });
        if (Math.abs(d) < 40) {
          const y2 = P.LEDGE_Y + 0.7 * H;
          for (let i = 0; i < 8; i++) {
            const a0 = (2 * Math.PI * i) / 8, a1 = (2 * Math.PI * (i + 1)) / 8;
            holes.push({ p: [at(y2, 0), at(y2 + 0.7 * Math.cos(a0), 0.7 * Math.sin(a0)), at(y2 + 0.7 * Math.cos(a1), 0.7 * Math.sin(a1))], w: [rx, 0, rz] });
          }
        }
      }
    }
    put('light', P.faces(slits)); put('dark', P.faces(holes));
  }
  // sixteen leaning piers, one under each element of the edge ring; the two low-side ones are the portals
  for (let k = 0; k < 16; k++) {
    const phi = 22.5 * k;
    if (phi !== 90 && phi !== 270) put('pier', P.pier(phi, 1.8, P.LEDGE_Y));
  }
  // columns under the deck
  if (near) {
    const cols = [];
    for (let j = 0; j < 32; j++) {
      const phi = 360 * (j + 0.5) / 32;
      if (Math.abs(phi - 180) < 14) continue;
      cols.push(P.slab(phi, 66.85, 68.15, -0.65, 0.65, 0, P.SLAB_BOTTOM).wall);
    }
    for (const g of cols) put('concrete', g);
  }

  // ---- the two low-side portals: a curved concrete beam under the ring and a central pier ----
  for (const phiC of [90, 270]) {
    const span = P.span(phiC - 16.5, phiC + 16.5, near ? 12 : 6), y0 = 17.2, y1 = 20.7, rb = 66.3;
    put('concrete', P.strip(span, pt(rb, y0), pt(rb, y1), out));
    put('concrete', P.strip(span, pt(P.wallR(y0) - 0.1, y0), pt(rb, y0), DOWN));
    const ends = [phiC - 16.5, phiC + 16.5].map((phi, i) => {
      const [tx, tz] = P.tangent(phi), s = i === 0 ? -1 : 1, P3 = (r, y) => { const [x, z] = P.plan(r, phi); return [x, y, z]; };
      return { p: [P3(P.wallR(y0) - 0.1, y0), P3(rb, y0), P3(rb, y1), P3(P.wallR(y1) - 0.1, y1)], w: [s * tx, 0, s * tz] };
    });
    put('concrete', P.faces(ends));
    put('pier', P.slab(phiC, 60.9, 66.1, -1.9, 1.9, P.LEDGE_Y, 19.0).wall);
  }

  // ---- the lettering on the south-east portal, and the loop on the roof above it ----
  {
    const phiC = 90, rs = 66.55, y = 17.85, px = 0.225;
    const phiAt = (u) => phiC - (u / rs) / RAD; // reading left to right runs toward decreasing phi seen from outside
    const at = (u0) => (u, v) => { const phi = phiAt(u0 + u), [x, z] = P.plan(rs, phi); return [x, y + v, z]; };
    if (near) {
      const width = (text) => P.textFaces(text, px, () => [0, 0, 0], () => UP).width;
      for (const [text, u0] of [['Scotiabank', -(2.9 + width('Scotiabank'))], ['Saddledome', 2.9]]) {
        const t = P.textFaces(text, px, (u, v) => at(u0)(u, v), (u) => out(phiAt(u0 + u)));
        put('sign', P.faces(t.faces));
      }
    } else { // far: the two words as plain red bars on the beam's curved face
      for (const [u0, u1] of [[-17, -3], [3, 17]]) put('sign', P.strip(P.span(phiAt(u1), phiAt(u0), 3), pt(rs, y), pt(rs, y + 1.6), out));
    }
    if (near) { // the roof loop: a figure-eight ribbon (a lemniscate) laid on the roof beside the south-east edge
      const A = 15.5, centre = 56.5, M = 40, half = 0.45;
      const uw = (u, w) => P.local(w, -u, 90);                 // loop plane (u to the viewer's right, w radial) to plan
      const lin = (u, w) => { const o = uw(0, 0), q = uw(u, w); return [q[0] - o[0], q[1] - o[1]]; };
      const cl = Array.from({ length: M }, (_, i) => { const t = (2 * Math.PI * i) / M, d = 1 + Math.sin(t) ** 2; return [A * Math.cos(t) / d, centre + A * Math.sin(t) * Math.cos(t) / d, t]; });
      const edge = (i, side, drop) => {
        const p0 = cl[(i + M - 1) % M], p1 = cl[(i + 1) % M], tx = p1[0] - p0[0], tw = p1[1] - p0[1], len = Math.hypot(tx, tw) || 1;
        const u = cl[i][0] - side * half * tw / len, w = cl[i][1] + side * half * tx / len, [x, z] = uw(u, w);
        const rho = Math.hypot(x, z), phi = ((Math.atan2(x, -z) / RAD) - P.AXIS + 720) % 360;
        return [x, P.roofZ(rho, phi) + (drop ? 0 : 0.45 + 0.1 * Math.sin(cl[i][2])), z];
      };
      const norm = (i, side) => { const p0 = cl[(i + M - 1) % M], p1 = cl[(i + 1) % M], tx = p1[0] - p0[0], tw = p1[1] - p0[1], len = Math.hypot(tx, tw) || 1; const d = lin(-side * tw / len, side * tx / len); return [d[0], 0, d[1]]; };
      const idx = Array.from({ length: M }, (_, i) => i);
      put('sign', P.strip(idx, (i) => edge(i, 1, false), (i) => edge(i, -1, false), UP, true));
      put('sign', P.strip(idx, (i) => edge(i, 1, true), (i) => edge(i, 1, false), (i) => norm(i, 1), true));
      put('sign', P.strip(idx, (i) => edge(i, -1, true), (i) => edge(i, -1, false), (i) => norm(i, -1), true));
    }
  }

  // ---- the high ends ----
  const yellow = (phi, rho) => {
    // a stair tower: its rim climbs to the underside of the roof ring over it and ends 0.1 m inside it (no gap
    // under the eaves, nothing through the roof)
    const [cx, cz] = P.plan(rho, phi), h0 = P.DECK_Y, r = 2.2, seg = near ? 10 : 6;
    const angles = Array.from({ length: seg }, (_, i) => (2 * Math.PI * i) / seg);
    const foot = (a) => [cx + r * Math.sin(a), h0, cz + r * Math.cos(a)];
    const rim = (a) => { const [x, , z] = foot(a); return [x, P.soffitAt(x, z) + 0.1, z]; };
    put('yellow', P.strip(angles, foot, rim, (a) => [Math.sin(a), 0, Math.cos(a)], true));
    const hub = [cx, P.soffitAt(cx, cz) + 0.1, cz];
    put('yellow', P.faces(angles.map((a, i) => ({ p: [hub, rim(a), rim(angles[(i + 1) % seg])], w: UP }))));
  };
  const tower = (phi, a0, a1, y0, y1, rise) => {
    const s = P.slab(phi, a0, a1, -4.5, 4.5, y0, y1, rise);
    put('red', s.wall); put('roof', s.top);
  };

  // south-west end (phi 180): the west entrance. Stairs, a stadium-shaped pavilion with its dark entrance, two towers.
  {
    const pe = 180, K = near ? 10 : 5, rise = P.DECK_Y / K, run = 6.0 / K, r0 = 75.5;
    for (const side of [-1, 1]) {
      const lo = pe + (side < 0 ? -19 : 10), hi = pe + (side < 0 ? -10 : 19), sp = P.span(lo, hi, near ? 3 : 2);
      for (let k = 0; k < K; k++) {
        const ra = r0 - run * k, rb = r0 - run * (k + 1), ya = rise * k, yb = rise * (k + 1);
        put('concrete', P.strip(sp, pt(ra, ya), pt(ra, yb), out));
        put('pier', P.strip(sp, pt(rb, yb), pt(ra, yb), UP));
      }
      const sides = [];
      for (const phi of [lo, hi]) {
        const [rx, rz] = P.radial(phi), [tx, tz] = P.tangent(phi), s = phi === lo ? -1 : 1, Q = (r, y) => [r * rx, y, r * rz];
        for (let k = 0; k < K; k++) {
          const ra = r0 - run * k, rb = r0 - run * (k + 1), yb = rise * (k + 1);
          sides.push({ p: [Q(rb, 0), Q(ra, 0), Q(ra, yb), Q(rb, yb)], w: [s * tx, 0, s * tz] });
        }
      }
      put('concrete', P.faces(sides));
    }
    // the pavilion: 22 m wide, a rectangle against the concourse wall ending in a half-cylinder (to 81 m from the centre)
    const cx = 70, rad = 11, h = 13.5, M = near ? 14 : 8;
    const [rx, rz] = P.radial(pe), [tx, tz] = P.tangent(pe), Q = (a, t, y) => [a * rx + t * tx, y, a * rz + t * tz];
    const wall = [
      { p: [Q(66.2, rad, 0), Q(cx, rad, 0), Q(cx, rad, h), Q(66.2, rad, h)], w: [tx, 0, tz] },
      { p: [Q(66.2, -rad, 0), Q(cx, -rad, 0), Q(cx, -rad, h), Q(66.2, -rad, h)], w: [-tx, 0, -tz] },
    ];
    const roof = [], arc = [Q(66.2, -rad, h), Q(cx, -rad, h)];
    for (let i = 0; i < M; i++) {
      const t0 = (-90 + (180 * i) / M) * RAD, t1 = (-90 + (180 * (i + 1)) / M) * RAD, tm = (t0 + t1) / 2;
      wall.push({ p: [Q(cx + rad * Math.cos(t0), rad * Math.sin(t0), 0), Q(cx + rad * Math.cos(t1), rad * Math.sin(t1), 0), Q(cx + rad * Math.cos(t1), rad * Math.sin(t1), h), Q(cx + rad * Math.cos(t0), rad * Math.sin(t0), h)], w: [Math.cos(tm) * rx + Math.sin(tm) * tx, 0, Math.cos(tm) * rz + Math.sin(tm) * tz] });
      arc.push(Q(cx + rad * Math.cos(t1), rad * Math.sin(t1), h));
    }
    arc.push(Q(66.2, rad, h));
    const centre = Q(68, 0, h);
    for (let i = 0; i < arc.length; i++) roof.push({ p: [centre, arc[i], arc[(i + 1) % arc.length]], w: UP });
    put('red', P.faces(wall)); put('roof', P.faces(roof));
    const door = [], DM = near ? 5 : 3;
    for (let i = 0; i < DM; i++) {
      const t0 = (-17 + (34 * i) / DM) * RAD, t1 = (-17 + (34 * (i + 1)) / DM) * RAD, tm = (t0 + t1) / 2, r2 = rad + 0.1;
      door.push({ p: [Q(cx + r2 * Math.cos(t0), r2 * Math.sin(t0), 0), Q(cx + r2 * Math.cos(t1), r2 * Math.sin(t1), 0), Q(cx + r2 * Math.cos(t1), r2 * Math.sin(t1), 6.5), Q(cx + r2 * Math.cos(t0), r2 * Math.sin(t0), 6.5)], w: [Math.cos(tm) * rx + Math.sin(tm) * tx, 0, Math.cos(tm) * rz + Math.sin(tm) * tz] });
    }
    put('dark', P.faces(door));
    for (const side of [-1, 1]) tower(pe + side * 21.5, 70.2, 75.6, 0, 19, 1.5);
    yellow(pe + 16, 67);
  }
  // north-east end (phi 0): not mapped as a bulge, so the two towers, a small vestibule and the yellow stair tower
  // stand on the concourse deck inside the circle
  {
    for (const side of [-1, 1]) tower(side * 21.5, 64.5, 69.3, P.DECK_Y, 21, 1.5);
    const v = P.slab(0, 66.2, 69.2, -6, 6, P.DECK_Y, 12, 1);
    put('red', v.wall); put('roof', v.top);
    yellow(-16, 67);
  }
  return b.finish();
}
