import { PLAN as P, L } from './hotel-de-ville-de-montreal-plan.js';

// Facade pieces in a wall frame (see the kit): a along the wall, y up, E the outward distance of the wall plane the piece stands on.
// Offsets from a wall: joints 0.15, window surrounds 0.20, glass 0.25 (surfaces over 50 m2 need 0.15 m between layers).
const RW = L.roof;

/** A dormer on the mansard's steep slope, in front of the wall plane E: stone cheeks, a lit window, a small pediment. */
function dormer(F, near, c, E) {
  F.box('stone', c - 0.8, c + 0.8, 18.4, 20.8, E - 4.4, E - 2.0);
  F.quad('light', c - 0.45, c + 0.45, 18.9, 20.4, E - 2.0 + 0.1);
  if (near) F.pediment('stone', c - 1.05, c + 1.05, 20.8, 1.0, E - 3.8, E - 1.9);
}

/**
 * One wall segment [a0, a1] on plane E: plinth, rusticated ground floor, four floors of arched windows between pilasters, the
 * cornices (belt course, the denticulated cornice, the modillion cornice, the crowning cornice), the balustrade, the dormers.
 * y0 is the lowest visible level (a terrace hides the rest at the back), q the quoin width of a pavilion, cL/cR make the cornices
 * turn the corner at an outer end.
 */
export function facade(F, near, a0, a1, E, { bay = 3.9, y0 = 0, q = 0, cL = false, cR = false, dormers = true, floors = [1, 1, 1, 1], dbay = bay } = {}) {
  const x0 = a0 - (cL ? 0.55 : 0), x1 = a1 + (cR ? 0.55 : 0);
  const w0 = a0 + q, w1 = a1 - q, n = Math.max(1, Math.round((w1 - w0) / bay)), bw = (w1 - w0) / n;
  if (y0 < 0.5) F.box('stone2', x0, x1, 0, L.plinth, E, E + 0.25); // plinth
  F.box('stone', x0, x1, L.belt[0], L.belt[1], E - 0.3, E + 0.35);
  F.box('stone', x0, x1, L.cor1[0], L.cor1[1], E - 0.3, E + 0.5);
  F.box('stone', x0, x1, L.cor2[0], L.cor2[1], E - 0.3, E + 0.6);
  F.box('stone', x0, x1, L.topCor[0], L.topCor[1], E - 0.3, E + 0.55);
  F.box('stone', x0 + (cL ? 0.2 : 0), x1 - (cR ? 0.2 : 0), L.bal[0], L.bal[1], E - 0.85, E - 0.3); // balustrade
  if (near) {
    if (y0 < 0.5) for (let y = 1.75; y < L.belt[0] - 0.4; y += 0.95) F.quad('stone2', x0 + 0.3, x1 - 0.3, y, y + 0.12, E + 0.15); // rustication joints
    for (let a = x0 + 0.7; a < x1 - 0.4; a += 1.0) F.quad('stone2', a, a + 0.35, 16.35, 16.85, E - 0.3 + 0.12); // balusters seen as slots
    for (let a = a0 + 0.5; a < a1 - 0.4; a += 0.9) { // modillions under the cornice and dentils under the first one, as dark slots on their faces
      F.quad('stone2', a, a + 0.4, 13.45, 13.75, E + 0.6 + 0.06);
      F.quad('stone2', a, a + 0.3, 9.7, 10.05, E + 0.5 + 0.06);
    }
  }
  if (q) { for (const [u0, u1] of [[a0, a0 + q], [a1 - q, a1]]) F.box('stone', u0, u1, y0 < 0.5 ? L.plinth : y0, L.wallTop, E - 0.2, E + 0.3); }
  for (let i = 0; i < n; i++) {
    const c = w0 + (i + 0.5) * bw, gw = Math.min(1.7, bw * 0.44);
    const row = (key, mat, w, sillOffset = 0) => {
      const [y, h] = L.win[key]; if (y < y0) return;
      F.arch(mat, c, y, w, h, E + 0.25);
      if (near) F.arch('stone2', c, y - 0.12 - sillOffset, w + 0.5, h + 0.42, E + 0.2);
    };
    if (floors[0]) row('ground', 'glass', gw);
    if (floors[1]) row('first', 'light', Math.min(1.8, bw * 0.46));
    if (floors[2]) row('second', 'light', Math.min(1.4, bw * 0.36));
    if (floors[3] && L.win.attic[0] >= y0) {
      F.quad('light', c - 0.45, c + 0.45, L.win.attic[0], L.win.attic[0] + L.win.attic[1], E + 0.25);
      if (near) F.quad('stone2', c - 0.7, c + 0.7, L.win.attic[0] - 0.15, L.win.attic[0] + L.win.attic[1] + 0.2, E + 0.2);
    }
    if (near && floors[1] && L.win.first[0] >= y0) F.box('stone', c - 0.16, c + 0.16, 9.2, 9.6, E + 0.12, E + 0.42); // keystone
    if (near && floors[0] && y0 < 0.5) F.box('stone', c - 0.16, c + 0.16, 4.35, 4.8, E + 0.1, E + 0.36);
  }
  if (near) for (let i = 0; i <= n; i++) { // pilasters between the bays, the upper two floors; capitals under the cornices
    const a = w0 + i * bw; if (i === 0 && q) continue; if (i === n && q) continue;
    const half = i === 0 || i === n ? 0.25 : 0.32;
    if (L.belt[1] >= y0) F.box('stone', a - half, a + half, L.belt[1], L.cor1[0], E - 0.1, E + 0.3);
    F.box('stone', a - half, a + half, L.cor1[1], L.cor2[0], E - 0.1, E + 0.3);
    F.box('stone', a - half - 0.1, a + half + 0.1, L.cor2[0] - 0.4, L.cor2[0], E - 0.1, E + 0.38);
  }
  if (dormers) {
    const m = Math.max(1, Math.round((a1 - a0 - q * 2) / dbay)), dw = (a1 - a0 - q * 2) / m;
    for (let i = 0; i < m; i++) dormer(F, near, a0 + q + (i + 0.5) * dw, E);
  }
}

/** The central pavilion on rue Notre-Dame: portal, balcony (the "Vive le Quebec libre" balcony), six columns, pediment, clock frontispiece. */
export function centralPavilion(F, near) {
  const h = P.cenHalf, E = P.cenFront, ph = P.platform;
  F.box('stone', -h, h, 0, L.wallTop, P.wallF - 0.5, E);
  facade(F, near, -h, -4.8, E, { bay: 2.45, cL: true, dormers: false, floors: [1, 1, 1, 1] });
  facade(F, near, 4.8, h, E, { bay: 2.45, cR: true, dormers: false, floors: [1, 1, 1, 1] });
  F.box('stone', -4.8, 4.8, L.topCor[0], L.topCor[1], E - 0.3, E + 0.55); // crowning cornice over the middle
  // arched portal with its double doors, the stone surround and the balcony above it
  F.arch('glass', 0, ph, 3.4, 2.7, E + 0.25);
  if (near) { F.arch('stone2', 0, ph - 0.02, 4.0, 3.15, E + 0.2); F.box('stone', -0.2, 0.2, 4.55, 5.1, E + 0.1, E + 0.4); }
  F.box('stone', -4.4, 4.4, 5.3, 5.62, E - 0.3, E + 1.5); // balcony slab
  F.box('stone', -4.4, 4.4, 5.62, 6.5, E + 1.2, E + 1.5); // balustrade, front
  for (const sg of [-1, 1]) F.box('stone', sg > 0 ? 4.1 : -4.4, sg > 0 ? 4.4 : -4.1, 5.62, 6.5, E, E + 1.2); // balustrade, returns
  if (near) for (let a = -4.0; a < 4.0; a += 0.8) F.quad('stone2', a, a + 0.3, 5.75, 6.4, E + 1.5 + 0.12);
  // tall arched windows behind the colonnade, the colonnade, entablature and pediment
  for (const [c, w] of [[0, 2.3], [-2.2, 1.2], [2.2, 1.2]]) {
    F.arch('light', c, 6.1, w, 4.6, E + 0.25);
    if (near) F.arch('stone2', c, 5.95, w + 0.4, 5.0, E + 0.2);
  }
  for (const a of [-3.9, -3.1, -1.3, 1.3, 3.1, 3.9]) {
    F.col('stone', a, E + 1.0, 5.62, 10.9, 0.3, near ? 8 : 4);
    if (near) F.box('stone', a - 0.4, a + 0.4, 10.5, 10.9, E + 0.6, E + 1.4);
  }
  F.box('stone', -4.9, 4.9, 10.9, 11.8, E - 0.3, E + 1.6);
  F.pediment('stone', -5.0, 5.0, 11.8, 2.0, E - 0.3, E + 1.6);
  if (near) F.pediment('stone2', -3.9, 3.9, 12.1, 1.3, E + 1.6, E + 1.75);
  // clock frontispiece rising from the roof behind the pediment
  F.box('stone', -3.9, 3.9, L.wallTop, 21.6, 13.0, 18.9);
  F.pediment('stone', -4.3, 4.3, 21.6, 2.6, 13.0, 19.2);
  if (near) F.pediment('stone2', -3.1, 3.1, 21.95, 1.7, 19.2, 19.35);
  F.disc('stone2', 0, 18.6, 1.75, 18.9 + 0.1);
  F.disc('sign', 0, 18.6, 1.4, 18.9 + 0.16);
  if (near) for (const sg of [-1, 1]) F.arch('light', sg * 2.55, 16.4, 0.9, 1.9, 18.9 + 0.1);
  // stair: eleven risers, stone cheeks sloping down to the street
  const steps = near ? 11 : 4, dy = ph / steps, dd = (P.stairFront - E) / steps, pts = [[E, 0], [P.stairFront, 0]];
  for (let k = 0; k < steps; k++) { pts.push([P.stairFront - k * dd, (k + 1) * dy]); pts.push([P.stairFront - (k + 1) * dd, (k + 1) * dy]); }
  pts.pop(); pts.push([E, ph]);
  F.prism('stone', -P.stairHalf, P.stairHalf, pts);
  for (const sg of [-1, 1]) {
    F.prism('stone', sg > 0 ? P.stairHalf : -P.stairHalf - 0.7, sg > 0 ? P.stairHalf + 0.7 : -P.stairHalf, [[E, 0], [P.stairFront + 0.3, 0], [P.stairFront + 0.3, 0.9], [E, ph + 1.0]]);
  }
}

/** The rear block of 1932-34 up to the Champ-de-Mars: a terrace slab with its parapet and a row of tall windows (rear frame: a = -s, e = -d). */
export function extension(k, F, near) {
  const { s0, s1, d0, d1, top, floor } = P.ext, par = 0.85, cap = 0.15;
  // The block stops 0.15 m under the terrace level and a dark roof membrane (the patina `roof` material) closes it between the parapets, so the
  // terrace no longer reads as a pale slab from above. The walls run down to `floor` (-2.5 m): a slope skirt, not a basement; on the flat
  // map it sits below the pavement, on a ground that falls toward the Champ-de-Mars it stands on the ground instead of floating.
  k.gbox('stone', s0, s1, floor, top - cap, d0, d1);
  k.gbox('roof', s0 + 0.45, s1 - 0.45, top - cap, top, d0 + 0.45, d1);
  k.gbox('stone', s0, s1, top - cap, top + par, d0, d0 + 0.45); // parapet walls, rear and the two ends, and their coping
  k.gbox('stone', s0, s0 + 0.45, top - cap, top + par, d0 + 0.45, d1 - 1.0);
  k.gbox('stone', s1 - 0.45, s1, top - cap, top + par, d0 + 0.45, d1 - 1.0);
  k.gbox('stone2', s0 - 0.12, s1 + 0.12, top + par, top + par + 0.3, d0 - 0.12, d0 + 0.57); // the coping strip in the darker stone tone
  k.gbox('stone2', s0 - 0.12, s0 + 0.57, top + par, top + par + 0.3, d0 + 0.57, d1 - 1.0);
  k.gbox('stone2', s1 - 0.57, s1 + 0.12, top + par, top + par + 0.3, d0 + 0.57, d1 - 1.0);
  const n = near ? 12 : 6, pitch = (s1 - s0) / n;
  for (let i = 0; i < n; i++) {
    const c = -(s0 + (i + 0.5) * pitch), w = near ? 0.9 : 1.4;
    for (const y of near ? [0.5, 2.9] : [0.6]) {
      F.quad('glass', c - w, c + w, y, y + (near ? 1.7 : 3.8), -d0 + 0.25);
      if (near) F.quad('stone2', c - w - 0.25, c + w + 0.25, y - 0.2, y + 2.0, -d0 + 0.2);
    }
  }
}

/** The campanile (the "trente pieds" lantern of the 1923-26 rebuild): a stone stage, an octagonal arched lantern, a copper dome and spire. */
export function campanile(k, near) {
  const { s, d } = P.tower, r = 2.4, ap = r * Math.cos(Math.PI / 8);
  k.gbox('stone', s - 3.1, s + 3.1, 23.9, 26.8, d - 3.1, d + 3.1);
  k.gbox('stone', s - 3.55, s + 3.55, 26.8, 27.35, d - 3.55, d + 3.55);
  for (let i = 0; i < 4; i++) { // arched openings on the four faces of the stage
    const phi = i * Math.PI / 2, F = k.frame(s + 3.1 * Math.sin(phi), d + 3.1 * Math.cos(phi), phi);
    F.arch('light', 0, 24.6, 1.5, 1.9, 0.08);
  }
  k.cyl('stone', s, d, r, 8, 27.35, 32.1, r, Math.PI / 8);
  k.cyl('stone', s, d, 2.85, 8, 32.1, 32.6, 2.85, Math.PI / 8);
  for (let i = 0; i < 8; i += near ? 1 : 2) { // lantern: eight tall arched openings
    const phi = i * Math.PI / 4, F = k.frame(s + ap * Math.sin(phi), d + ap * Math.cos(phi), phi);
    F.arch('light', 0, 28.0, 1.1, 3.6, 0.08, near ? 5 : 3);
  }
  const prof = [[2.7, 32.6], [2.78, 33.0], [2.5, 33.8], [1.9, 34.6], [1.15, 35.3], [0.55, 35.8], [0.28, 36.1], [0.2, 36.4], [0.34, 36.7], [0.16, 37.0], [0.1, 37.5], [0.03, 40.0]];
  k.lathe('roof', s, d, prof, near ? 14 : 8); // patinated copper, the same material as the mansards
}

/** Two tall Renaissance chimneys on the front roof, above the junction of each wing and end pavilion. */
export function chimneys(k, near) {
  for (const sg of [-1, 1]) {
    const c = sg * 24.1;
    k.gbox('stone', c - 1.1, c + 1.1, 21.6, 29.4, 12.3, 14.5);
    k.gbox('stone', c - 1.4, c + 1.4, 29.4, 30.1, 12.0, 14.8);
    if (near) k.gbox('stone2', c - 0.7, c + 0.7, 27.0, 28.6, 14.5, 14.6 + 0.05);
  }
}
