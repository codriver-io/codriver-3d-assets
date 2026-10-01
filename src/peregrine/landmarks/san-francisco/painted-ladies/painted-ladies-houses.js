// The seven houses of Postcard Row, each built in its own local frame (x across the front to the
// viewer's right, y up, z outward toward Steiner Street, z = 0 on the wall plane) by houseKit.
// Heights are metres above the house's own street level (yb); y = 0 is the lowest foundation.
import { houseKit, outset, shell } from './painted-ladies-parts.js';
import { halfWidth } from './painted-ladies-site.js';

// Storey levels shared by the six gabled houses (photographs: garage door 2.2 m, storeys ~3 m,
// eave ~9 m, ridge 12.5 m above the sidewalk; OSM gives height = 12 for each).
export const LEVEL = { f1: 2.7, f2: 5.65, eave: 8.9, ridge: 12.5, slab: 0.15, frieze: 0.5 };
const BAY_P = 0.95; // projection of a canted bay
const FRONT = 8.33 - 7.2; // mapped front line, measured from the wall plane of a gabled house

// What differs from house to house (read from photographs): the two-storey canted bay or the
// columned porch with balcony, and the paint scheme. `accent` is the contrasting trim colour of the
// cornice, brackets, mouldings, window hoods and sills; `panel` the gable wall; `corner` the two
// panels under the rake. All of them are materials the model already has (a neighbour's body paint,
// the roof's dark), so the scheme adds no draw call; window frames, columns, rails and the rake stay white.
export const STYLES = {
  720: { type: 'bay', accent: 'roof', panel: 'sage', corner: 'rose', lit: 3 },
  718: { type: 'balcony', accent: 'rose', panel: 'cream', corner: 'sage', lit: 1 },
  716: { type: 'bay', accent: 'brick', panel: 'yellow', corner: 'brick', lit: 2 },
  714: { type: 'balcony', accent: 'cream', panel: 'rose', corner: 'cream', lit: 0, roof: 'brick' },
  712: { type: 'balcony', accent: 'navy', panel: 'blue', corner: 'cream', lit: 2 },
  710: { type: 'bay', accent: 'sage', panel: 'cream', corner: 'sage', lit: 1 },
};
export const ACCENT_722 = 'blue';

const hash = (a, b, c) => ((Math.imul(a + 1, 73856093) ^ Math.imul(b + 1, 19349663) ^ Math.imul(c + 1, 83492791)) >>> 0);

/**
 * A window on a wall face: a trim frame with a recessed pane (glass, or glow when lit), a mullion and a
 * transom bar, and a sill and hood in the accent colour. Built from the visible faces only (no backs,
 * no hidden pane box): about 50 triangles instead of 72.
 */
function windowOn(k, face, u, y0, y1, w, lit, { hood = true, sill = true, acc = 'trim' } = {}) {
  const xl = u - w / 2, xr = u + w / 2, pane = lit ? 'glow' : 'glass';
  if (!k.near) { // far: one dark pane with its two flanks
    const g = shell(); g.pz(xl, xr, y0, y1, 0.14); g.px(xr, y0, y1, 0, 0.14); g.nx(xl, y0, y1, 0, 0.14); k.putFace(pane, g.geometry(), face); return;
  }
  const e = 0.1, f = 0.1, pn = 0.05, h = y1 - y0;
  const T = shell(), G = shell(), A = shell();
  // frame: four front strips, the reveal round the pane, the outer flanks
  T.pz(xl - e, xr + e, y1, y1 + e, f); T.pz(xl - e, xr + e, y0 - e, y0, f); T.pz(xl - e, xl, y0, y1, f); T.pz(xr, xr + e, y0, y1, f);
  T.ny(y1, xl, xr, pn, f); T.py(y0, xl, xr, pn, f); T.px(xl, y0, y1, pn, f); T.nx(xr, y0, y1, pn, f);
  T.nx(xl - e, y0 - e, y1 + e, 0, f); T.px(xr + e, y0 - e, y1 + e, 0, f);
  if (!hood) T.py(y1 + e, xl - e, xr + e, 0, f);
  if (!sill) T.ny(y0 - e, xl - e, xr + e, 0, f);
  G.pz(xl, xr, y0, y1, pn);
  if (w > 0.7) T.pz(u - 0.03, u + 0.03, y0, y1, pn + 0.012); // mullion
  const yt = (y0 + y1) / 2 + h * 0.18; T.pz(xl, xr, yt - 0.025, yt + 0.025, pn + 0.02); // transom bar
  if (sill) { A.pz(xl - 0.18, xr + 0.18, y0 - 0.2, y0 - 0.1, 0.24); A.py(y0 - 0.1, xl - 0.18, xr + 0.18, 0, 0.24); A.ny(y0 - 0.2, xl - 0.18, xr + 0.18, 0, 0.24); A.px(xr + 0.18, y0 - 0.2, y0 - 0.1, 0, 0.24); A.nx(xl - 0.18, y0 - 0.2, y0 - 0.1, 0, 0.24); }
  if (hood) { A.pz(xl - 0.17, xr + 0.17, y1 + 0.1, y1 + 0.23, 0.2); A.py(y1 + 0.23, xl - 0.17, xr + 0.17, 0, 0.2); A.ny(y1 + 0.1, xl - 0.17, xr + 0.17, 0, 0.2); A.px(xr + 0.17, y1 + 0.1, y1 + 0.23, 0, 0.2); A.nx(xl - 0.17, y1 + 0.1, y1 + 0.23, 0, 0.2); }
  k.putFace('trim', T.geometry(), face); k.putFace(pane, G.geometry(), face);
  if (!A.empty) k.putFace(acc, A.geometry(), face);
}

/**
 * Entry stair from the street up to a landing: two slim stringer beams carried on thin posts (the feet
 * stand on y = 0) with treads between them and open risers, so it reads light. Far: the same beams and
 * posts under one thin sloped slab.
 */
function stairs(k, x, width, zLanding, run, yb, top, steps, material = 'base') {
  const r = k.near ? top / steps : 0.25, t = run / steps, zO = zLanding + run, sw = 0.09, depth = 0.3; // r: rise of a step (far: height of the foot of the ramp)
  const beam = [[zLanding, yb + top - depth], [zO, Math.max(0, yb + r - depth)], [zO, yb + r], [zLanding, yb + top]];
  const under = (z) => yb + r - depth + (top - r) * (zO - z) / run; // the underside of the beam at z
  for (const sx of [x - width / 2, x + width / 2 - sw]) {
    k.prismX(material, beam, sx, sx + sw);
    for (const zp of [zO - 0.1, zLanding + run * 0.5]) if (under(zp) > 0.2) k.box(material, sx + 0.02, sx + sw - 0.02, 0, under(zp) + 0.05, zp - 0.06, zp + 0.06, 'd'); // posts, a little slimmer than the beam
  }
  if (!k.near) { k.prismX(material, [[zLanding, yb + top - 0.1], [zO, yb + r - 0.1], [zO, yb + r], [zLanding, yb + top]], x - width / 2 + sw, x + width / 2 - sw); return; }
  for (let i = 1; i <= steps; i++) { // tread i: its nose over the one below, 5 cm thick
    const zn = zO - (i - 1) * t, yt = yb + i * r;
    k.box(material, x - width / 2 + sw, x + width / 2 - sw, yt - 0.05, yt, zn - t - (i < steps ? 0.02 : 0), zn + 0.06, 'blr');
  }
  for (const sx of [x - width / 2 + 0.045, x + width / 2 - 0.045]) { // rail and posts on both sides
    k.bar('trim', [sx, yb + r + 0.95, zO - 0.1], [sx, yb + top + 0.95, zLanding], 0.06, 0.06);
    for (const f of [0.02, 0.5, 0.96]) k.bar('trim', [sx, yb + r + (top - r) * f, zO - run * f - 0.1 * (1 - f)], [sx, yb + r + (top - r) * f + 0.95, zO - run * f - 0.1 * (1 - f)], 0.07, 0.07);
  }
}

function balusters(k, x0, x1, z, yBase, height, spacing = 0.19) {
  k.box('trim', x0 + 0.04, x1 - 0.04, yBase + height - 0.06, yBase + height, z - 0.05, z + 0.05); // top rail (between the side rails)
  k.box('trim', x0 + 0.04, x1 - 0.04, yBase, yBase + 0.05, z - 0.05, z + 0.05, 'd'); // bottom rail (sits on the deck)
  if (!k.near) return;
  const n = Math.max(2, Math.round((x1 - x0) / spacing));
  for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n; k.box('trim', x - 0.025, x + 0.025, yBase + 0.05, yBase + height - 0.06, z - 0.025, z + 0.025, 'ud'); }
}

/** The side rail of a balcony: top and bottom rails with balusters running out from the wall, and a newel at the front. */
function railZ(k, x, z0, z1, yBase, height, spacing = 0.19) {
  k.box('trim', x - 0.04, x + 0.04, yBase + height - 0.06, yBase + height, z0, z1);
  k.box('trim', x - 0.04, x + 0.04, yBase, yBase + 0.05, z0, z1, 'd' + (z0 === 0 ? 'b' : ''));
  if (k.near) {
    const n = Math.max(2, Math.round((z1 - z0) / spacing));
    for (let i = 1; i < n; i++) { const z = z0 + (z1 - z0) * i / n; k.box('trim', x - 0.025, x + 0.025, yBase + 0.05, yBase + height - 0.06, z - 0.025, z + 0.025, 'ud'); }
  }
  k.box('trim', x - 0.06, x + 0.06, yBase, yBase + height + 0.08, z1 - 0.1, z1 + 0.02, 'd'); // newel post
}

/** The six gabled houses, 710-720. */
export function gabledHouse(b, matrix, house, detail, remap) {
  const k = houseKit(b, matrix, detail, remap), near = k.near, S = STYLES[house.number];
  const hw = halfWidth(house), yb = house.yb, depth = house.wall - house.back, zB = -depth;
  const L = LEVEL, F1 = yb + L.f1, F2 = yb + L.f2, E = yb + L.eave, R = yb + L.ridge;
  const body = house.body, face0 = { o: [0, 0], a: 0 }, A = S.accent;
  const lit = (i) => (hash(house.number, i, S.lit) % 5) < 2;
  let wi = 0;
  const win = (face, u, y0, y1, w, o) => windowOn(k, face, u, y0, y1, w, lit(wi++), { acc: A, ...o });

  // ---- massing: stucco foundation and garage level, painted storeys, roof, rear and front gables ----
  if (yb > 0.01) k.box('base', -hw, hw, 0, yb, zB, 0); // the stucco terrace the house stands on
  k.box(body, -hw, hw, yb, E, zB, 0, 'd');
  const slope = (R - L.slab - E) / hw; // rise per metre across the front
  k.prismZ(S.roof ?? 'roof', [[-hw, E], [-hw, E + L.slab], [0, R], [hw, E + L.slab], [hw, E], [0, R - L.slab]], zB - 0.12, 0.2);
  k.prismZ(S.panel, [[-hw, E], [hw, E], [0, R - L.slab]], -0.2, 0); // gable wall, front
  k.prismZ(body, [[-hw, E], [hw, E], [0, R - L.slab]], zB, zB + 0.2); // gable wall, rear
  // barge boards and finial (the rake edge), eave frieze and string courses
  for (const s of [-1, 1]) k.bar('trim', [s * hw, E + 0.05, 0.25 + 0.02 * s], [0, R + 0.02, 0.25 + 0.02 * s], 0.26, 0.1);
  k.bar('trim', [0, R - 0.1, 0.18], [0, R + 0.85, 0.18], 0.1, 0.1);
  // gable window and ornament
  win(face0, 0, E + 0.85, E + 2.0, 0.85, { sill: true });
  if (near) {
    k.box(A, -hw + 0.1, hw - 0.1, E + 0.01, E + 0.2, 0, 0.12); // base of the gable
    for (const s of [-1, 1]) { // the two corner panels under the rake
      const x0 = s * (hw - 0.55), x1 = s * 1.05, yTop = E + 0.45 + Math.abs(x0 - x1) * slope * 0.9;
      k.prismZ(S.corner, [[x0, E + 0.35], [x1, E + 0.35], [x1, yTop]], 0, 0.06);
    }
  }

  // ---- front: a two-storey canted bay beside the entry, or a columned porch under a balcony ----
  const pw = 2.1; // porch width
  if (S.type === 'bay') {
    const bx0 = -hw + 0.12, bx1 = bx0 + 3.95, p = BAY_P;
    const plan = [[bx0, 0], [bx0 + p, p], [bx1 - p, p], [bx1, 0]];
    k.prismY(body, plan, F1, E - L.frieze);
    if (near) {
      k.prismY(A, outset(plan, 0.1), F1 - 0.28, F1); // base moulding
      k.prismY(A, outset(plan, 0.08), F2 - 0.15, F2 + 0.15); // belt between the storeys
    }
    k.prismY(A, outset(plan, 0.12), E - L.frieze - 0.02, E - 0.03); // frieze round the bay
    const faces = [
      { o: [(bx0 + bx1) / 2, p], a: 0, w: 1.55, us: [0] },
      { o: [bx0 + p / 2, p / 2], a: -Math.PI / 4, w: 0.5, us: [0] },
      { o: [bx1 - p / 2, p / 2], a: Math.PI / 4, w: 0.5, us: [0] },
    ];
    for (const f of faces) for (const [y0, y1] of [[F1 + 0.8, F1 + 2.35], [F2 + 0.7, F2 + 2.3]]) win(f, 0, y0, y1, f.w);
    k.box(A, bx1 + 0.12, hw, E - L.frieze, E, 0, 0.26);
    // garage under the bay
    const gx0 = bx0 + 0.45, gx1 = gx0 + 2.4;
    k.box('trim', gx0, gx1, yb + 0.02, yb + 2.25, 0, 0.07);
    if (near) k.box('glass', gx0 + 0.25, gx1 - 0.25, yb + 1.6, yb + 1.95, 0.07, 0.1);
    // entry porch on the other side
    const px0 = bx1 + 0.2, px1 = hw - 0.05, pc = (px0 + px1) / 2;
    k.box('base', px0, px1, 0, F1, 0, FRONT);
    k.box('trim', px0 - 0.04, px1 + 0.04, F1, F1 + 0.1, 0, FRONT + 0.04, 'bd'); // landing slab (trim edge)
    k.box(A, px0 - 0.1, px1 + 0.1, F2 - 0.4, F2 - 0.18, 0, FRONT + 0.1); // canopy over the entry
    for (const x of [px0 + 0.1, px1 - 0.1]) k.column('trim', x, FRONT - 0.12, F1 + 0.1, F2 - 0.4, 0.09);
    k.box('trim', pc - 0.62, pc + 0.62, F1 + 0.1, F1 + 2.65, 0, 0.05); // door surround
    k.box('glass', pc - 0.42, pc + 0.42, F1 + 0.1, F1 + 2.4, 0.05, 0.09, 'b'); // door
    win(face0, pc, F2 + 0.7, F2 + 2.3, 0.9); // window above the porch
    stairs(k, pc, 1.1, FRONT, 2.6, yb, L.f1, near ? 13 : 1);
  } else {
    // balcony type: columned porch at the left under a balustraded balcony, garage at the right
    const px0 = -hw + 0.1, px1 = px0 + 3.3, p = 1.1;
    k.box('base', px0, px1, 0, F1, 0, FRONT);
    k.box('trim', px0 - 0.04, px1 + 0.04, F1, F1 + 0.1, 0, FRONT + 0.04, 'bd');
    k.box(A, px0 - 0.1, px1 + 0.1, F2 - 0.22, F2, 0, FRONT + 0.17); // balcony deck
    for (const x of [px0 + 0.1, (px0 + px1) / 2 + 0.7, px1 - 0.1]) k.column('trim', x, FRONT - 0.12, F1 + 0.1, F2 - 0.22, 0.09);
    balusters(k, px0 - 0.05, px1 + 0.05, FRONT + 0.05, F2, 0.9);
    for (const x of [px0 - 0.05, px1 + 0.05]) railZ(k, x, 0, FRONT + 0.05, F2, 0.9);
    k.box('trim', px0 + 0.35, px0 + 1.55, F1 + 0.1, F1 + 2.65, 0, 0.05); // door surround
    k.box('glass', px0 + 0.5, px0 + 1.4, F1 + 0.1, F1 + 2.4, 0.05, 0.09, 'b');
    win(face0, px0 + 2.35, F1 + 0.8, F1 + 2.35, 0.8);
    // floor 2: three windows across the wall; floor 1 above the garage: two
    const cs = [-hw + 1.05, 0, hw - 1.05];
    cs.forEach((c, i) => win(face0, c, F2 + 0.65, F2 + 2.3, i === 1 ? 1.45 : 0.9));
    const gx0 = px1 + 0.45, gx1 = Math.min(gx0 + 2.4, hw - 0.1);
    k.box('trim', gx0, gx1, yb + 0.02, yb + 2.25, 0, 0.07);
    if (near) k.box('glass', gx0 + 0.25, gx1 - 0.25, yb + 1.6, yb + 1.95, 0.07, 0.1);
    k.box(A, -hw, hw, E - L.frieze, E, 0, 0.26);
    stairs(k, px0 + 0.95, 1.1, FRONT, 2.6, yb, L.f1, near ? 13 : 1);
    // the stairs of the garage side: none, the garage opens on the street level
  }
  if (near) {
    k.box(A, -hw, hw, F1 - 0.15, F1 - 0.02, 0, 0.1); // string course over the garage level
    for (const x of [-hw + 0.12, hw - 0.12]) k.box(A, x - 0.1, x + 0.1, E - L.frieze - 0.4, E - L.frieze + 0.02, 0, 0.2); // frieze brackets
    const bays = S.type === 'bay' ? 1 : 0, span = hw * 2 - 0.5;
    for (let i = 1; i < 12; i++) { // a row of small brackets under the frieze, skipped over the bay
      const x = -hw + 0.25 + span * i / 12;
      if (bays && x < -hw + 4.3) continue;
      k.box(A, x - 0.05, x + 0.05, E - L.frieze - 0.18, E - L.frieze + 0.02, 0, 0.14);
    }
  }

  // ---- roof furniture ----
  const cx = house.number % 2 ? 1.15 : -1.15;
  k.box('base', cx - 0.37, cx + 0.37, E + 1.0, R + 1.0, -5.4 - 0.37, -5.4 + 0.37, 'd');
  if (near) k.box('trim', cx - 0.46, cx + 0.46, R + 1.0, R + 1.12, -5.4 - 0.46, -5.4 + 0.46, 'd');

  // ---- rear elevation: three windows a floor and the rear gable window ----
  const back = { o: [0, zB], a: Math.PI };
  if (near) {
    for (const c of [-hw + 1.2, 0, hw - 1.2]) { win(back, c, F1 + 0.6, F1 + 2.2, 0.9, { hood: false }); win(back, c, F2 + 0.6, F2 + 2.2, 0.9, { hood: false }); }
    win(back, 0, E + 0.85, E + 1.9, 0.8, { hood: false });
    // the rear door and two small windows of the garden level
    k.box('trim', -0.5, 0.5, yb + 0.02, yb + 2.2, zB - 0.06, zB, 'f'); k.box('glass', -0.38, 0.38, yb + 0.1, yb + 2.1, zB - 0.09, zB - 0.06, 'f');
    for (const c of [-hw + 1.2, hw - 1.2]) win(back, c, yb + 0.9, yb + 1.9, 0.7, { hood: false });
    // 710 ends the row: its south wall is exposed
    if (house.number === 710) for (const z of [-3.5, -7.5, -11.5]) for (const [y0, y1] of [[F1 + 0.6, F1 + 2.2], [F2 + 0.6, F2 + 2.2]]) win({ o: [hw, 0], a: Math.PI / 2 }, -z, y0, y1, 0.85, { hood: false });
  }
  return k;
}

/** 722 Steiner, the corner mansion: navy, hipped roof, a square bay and a canted bay on the front. */
export function hippedHouse(b, matrix, house, detail, remap) {
  const k = houseKit(b, matrix, detail, remap), near = k.near;
  const hw = halfWidth(house), yb = house.yb, zB = -(house.wall - house.back);
  // the mapped outline is 0.85 m narrower at the south front (a side passage beside the canted bay): the body ends at xr
  const xr = 3.68, xm0 = (xr - hw) / 2;
  const H = { f1: 1.9, f2: 5.5, eave: 9.0, ridge: 13.0 };
  const F1 = yb + H.f1, F2 = yb + H.f2, E = yb + H.eave, R = yb + H.ridge;
  const body = house.body, face0 = { o: [0, 0], a: 0 }, A = ACCENT_722;
  let wi = 0;
  const win = (face, u, y0, y1, w, o) => windowOn(k, face, u, y0, y1, w, (hash(722, wi++, 1) % 5) < 2, { acc: A, ...o });

  if (yb > 0.01) k.box('base', -hw, xr, 0, yb, zB, 0);
  k.box(body, -hw, xr, yb, E, zB, 0, 'd');
  // rear wing (the mapped outline steps back 1.5 m behind the north part)
  k.box(body, -hw, 1.25, yb, E - 2.2, zB - 1.55, zB, 'd');
  if (yb > 0.01) k.box('base', -hw, 1.25, 0, yb, zB - 1.55, zB);
  k.box('roof', -hw - 0.1, 1.25 + 0.1, E - 2.2, E - 2.05, zB - 1.65, zB + 0.1, 'd');

  // hipped roof over the whole plan, 0.35 m eaves
  const o = 0.35, x0 = -hw - o, x1 = xr + o, zf = o, zb = zB - o, half = (x1 - x0) / 2, run = half;
  const rf = zf - run, rb = zb + run, rise = R - E;
  const P = { fl: [x0, E, zf], fr: [x1, E, zf], bl: [x0, E, zb], br: [x1, E, zb], rf: [xm0, R, rf], rb: [xm0, R, rb] };
  const mid = [xm0, E + rise / 3, (zf + zb) / 2];
  k.solid('roof', [[P.fl, P.fr, P.rf], [P.bl, P.fl, P.rf, P.rb], [P.fr, P.br, P.rb, P.rf], [P.br, P.bl, P.rb], [P.fl, P.fr, P.br, P.bl]], mid);
  k.bar('trim', [xm0, R - 0.05, rf + 0.05], [xm0, R - 0.05, rb - 0.05], 0.16, 0.16); // ridge cap
  k.bar('trim', [xm0, R, rf], [xm0, R + 0.9, rf], 0.08, 0.08); // finial

  // frieze and string courses round the front
  k.box(A, -hw, xr, E - 0.55, E, 0, 0.3);
  if (near) { k.box(A, -hw, xr, F2 - 0.15, F2 + 0.1, 0, 0.1); k.box(A, -hw, xr, F1 - 0.12, F1 - 0.02, 0, 0.1); }

  // square bay at the north (left) end: one storey, a balustraded roof
  const sb0 = -3.76, sb1 = -1.69, sp = 1.48;
  k.box(body, sb0, sb1, F1, F2 - 0.2, 0, sp);
  k.box(A, sb0 - 0.1, sb1 + 0.1, F2 - 0.2, F2, 0, sp + 0.16);
  k.box(A, sb0 - 0.08, sb1 + 0.08, F1 - 0.2, F1, 0, sp + 0.08);
  balusters(k, sb0 - 0.05, sb1 + 0.05, sp + 0.03, F2, 0.85);
  for (const x of [sb0 - 0.05, sb1 + 0.05]) railZ(k, x, 0, sp + 0.03, F2, 0.85);
  win({ o: [(sb0 + sb1) / 2, sp], a: 0 }, 0, F1 + 0.55, F1 + 2.4, 1.2);
  win({ o: [sb0, sp / 2], a: -Math.PI / 2 }, 0, F1 + 0.55, F1 + 2.4, 0.7, { hood: false });
  win({ o: [sb1, sp / 2], a: Math.PI / 2 }, 0, F1 + 0.55, F1 + 2.4, 0.7, { hood: false });
  // wall windows over it
  for (const c of [-3.4, -2.2]) win(face0, c, F2 + 0.55, F2 + 2.25, 0.75);

  // canted bay, two storeys
  const cb0 = -0.35, cb1 = 3.72, cp = 1.12, plan = [[cb0, 0], [cb0 + cp, cp], [cb1 - cp, cp], [cb1, 0]];
  k.prismY(body, plan, F1, E - 0.57);
  if (near) { k.prismY(A, outset(plan, 0.1), F1 - 0.25, F1); k.prismY(A, outset(plan, 0.08), F2 - 0.12, F2 + 0.16); }
  k.prismY(A, outset(plan, 0.12), E - 0.59, E - 0.03);
  for (const f of [{ o: [(cb0 + cb1) / 2, cp], a: 0, w: 1.5 }, { o: [cb0 + cp / 2, cp / 2], a: -Math.PI / 4, w: 0.55 }, { o: [cb1 - cp / 2, cp / 2], a: Math.PI / 4, w: 0.55 }]) {
    for (const [y0, y1] of [[F1 + 0.55, F1 + 2.4], [F2 + 0.6, F2 + 2.4]]) win(f, 0, y0, y1, f.w);
  }
  // entry between the bays, with its stair, and a window beside the canted bay
  const dc = -1.0;
  k.box('base', dc - 0.65, dc + 0.65, 0, F1, 0, 1.2);
  k.box('trim', dc - 0.55, dc + 0.55, F1, F1 + 0.1, 0, 1.24, 'bd');
  k.box('trim', dc - 0.5, dc + 0.5, F1 + 0.1, F1 + 2.5, 0, 0.05);
  k.box('glass', dc - 0.38, dc + 0.38, F1 + 0.1, F1 + 2.3, 0.05, 0.09, 'b');
  stairs(k, dc, 1.0, 1.2, near ? 1.6 : 1.6, yb, H.f1, near ? 8 : 1);
  // north flank (visible from Hayes Street): three windows a floor
  if (near) for (const z of [-3, -7, -11]) for (const [y0, y1] of [[F1 + 0.5, F1 + 2.3], [F2 + 0.6, F2 + 2.4]]) win({ o: [-hw, 0], a: -Math.PI / 2 }, z, y0, y1, 0.8, { hood: false });
  // two chimneys
  for (const [cx, cz, top] of [[-1.2, -3.8, R + 0.5], [-2.2, -8.4, R + 0.8]]) {
    k.box('base', cx - 0.4, cx + 0.4, E + 1.5, top + 0.7, cz - 0.4, cz + 0.4, 'd');
    if (near) k.box('trim', cx - 0.5, cx + 0.5, top + 0.7, top + 0.82, cz - 0.5, cz + 0.5, 'd');
  }
  return k;
}
