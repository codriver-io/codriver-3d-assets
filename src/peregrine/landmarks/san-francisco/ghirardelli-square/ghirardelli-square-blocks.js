import { RECT, H, GAZEBO } from './ghirardelli-square-plan.js';

// The brick factory blocks and the infill around the plaza. One generic mass builder: brick walls, a
// parapet band (optionally crenellated, as the Mustard and Cocoa buildings are), string courses and
// window rows on the sides that face the open air. Windows are quads, not boxes: a white stone frame
// 0.15 m off the wall and a dark (or, at night, lit) pane 0.08 m in front of it, so a facade of
// hundreds of windows costs two triangles each.
const rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const SIDE = {
  N: (r) => ({ p: [r[0], r[2]], d: [1, 0], n: [0, -1], L: r[1] - r[0] }),
  S: (r) => ({ p: [r[0], r[3]], d: [1, 0], n: [0, 1], L: r[1] - r[0] }),
  E: (r) => ({ p: [r[1], r[2]], d: [0, 1], n: [1, 0], L: r[3] - r[2] }),
  W: (r) => ({ p: [r[0], r[2]], d: [0, 1], n: [-1, 0], L: r[3] - r[2] }),
};

let serial = 0;
// Place a row of identical window quads along one side of a rectangle.
//   row: { y0, h, w, pitch, margin, frame, lit, mat, range:[t0,t1], arch }
export function windowRow(F, rect, side, row, detail) {
  const s = SIDE[side](rect), { y0, h, w, pitch } = row, margin = row.margin ?? 1.6, fw = row.frame ?? 0.4;
  const t0 = row.range?.[0] ?? 0, t1 = row.range?.[1] ?? s.L;
  const usable = t1 - t0 - 2 * margin, n = Math.max(0, Math.floor(usable / pitch) + 1);
  if (!n) return;
  const first = t0 + (t1 - t0 - (n - 1) * pitch) / 2;
  for (let k = 0; k < n; k++) {
    const t = first + k * pitch, cu = s.p[0] + s.d[0] * t, cv = s.p[1] + s.d[1] * t;
    const lit = detail === 'near' && rnd(serial++) < (row.lit ?? 0.26);
    const mat = lit ? 'light' : (row.mat ?? 'glass');
    if (row.arch) {
      const head = Math.min(w / 2, h * 0.4), seg = detail === 'near' ? 6 : 3;
      const outline = (hw, y0_, y1_) => {
        const pts = [[-hw, y0_], [hw, y0_]];
        for (let i = 0; i <= seg; i++) { const a = (Math.PI * i) / seg; pts.push([hw * Math.cos(a), y1_ - head + Math.sin(a) * head]); }
        return pts;
      };
      if (fw > 0 && detail === 'near') F.wallPoly('trim', cu + s.n[0] * 0.15, cv + s.n[1] * 0.15, s.n, outline(w / 2 + fw * 0.6, y0 - 0.0, y0 + h + fw * 0.5));
      F.wallPoly(mat, cu + s.n[0] * 0.23, cv + s.n[1] * 0.23, s.n, outline(w / 2, y0, y0 + h));
    } else {
      if (fw > 0 && detail === 'near') F.wallQuad('trim', cu + s.n[0] * 0.15, cv + s.n[1] * 0.15, s.n, w + fw * 2, y0 - fw * 0.5, y0 + h + fw);
      F.wallQuad(mat, cu + s.n[0] * 0.23, cv + s.n[1] * 0.23, s.n, w, y0, y0 + h);
    }
  }
}

// A horizontal string course (trim) round the given sides at height y.
function belt(F, r, sides, y, hgt, p = 0.12) {
  const [u0, u1, v0, v1] = r;
  if (sides.includes('N')) F.box('trim', u0 - p, u1 + p, y, y + hgt, v0 - p, v0, 'bottom');
  if (sides.includes('S')) F.box('trim', u0 - p, u1 + p, y, y + hgt, v1, v1 + p, 'bottom');
  if (sides.includes('E')) F.box('trim', u1, u1 + p, y, y + hgt, v0, v1, 'bottom');
  if (sides.includes('W')) F.box('trim', u0 - p, u0, y, y + hgt, v0, v1, 'bottom');
}

// Parapet band round the roof, optional merlons on the sides in `merlons`, and the roof deck inside it.
function crown(F, r, h, o, detail) {
  const [u0, u1, v0, v1] = r, ch = o.cornice ?? 0.7, out = o.out ?? 0.3, inw = o.inward ?? 0.45, near = detail === 'near';
  const sides = o.sides ?? 'NSEW';
  const top = h - ch;
  if (sides.includes('N')) F.box('trim', u0 - out, u1 + out, top, h, v0 - out, v0 + inw);
  if (sides.includes('S')) F.box('trim', u0 - out, u1 + out, top, h, v1 - inw, v1 + out);
  if (sides.includes('E')) F.box('trim', u1 - inw, u1 + out, top, h, v0 + inw, v1 - inw, 'N,S');
  if (sides.includes('W')) F.box('trim', u0 - out, u0 + inw, top, h, v0 + inw, v1 - inw, 'N,S');
  F.deck(o.deck ?? 'roof', u0 + inw, u1 - inw, v0 + inw, v1 - inw, top + 0.02);
  if (near && o.merlons) {
    const mw = 0.7, mh = 0.9, mp = 1.75;
    for (const sd of o.merlons) {
      const s = SIDE[sd](r);
      const n = Math.floor((s.L - 0.9) / mp);
      const first = (s.L - (n - 1) * mp) / 2;
      for (let k = 0; k < n; k++) {
        const t = first + k * mp, cu = s.p[0] + s.d[0] * t, cv = s.p[1] + s.d[1] * t;
        const du = s.d[0] ? mw / 2 : 0.25, dv = s.d[1] ? mw / 2 : 0.25;
        F.box('trim', cu - du - s.n[0] * 0.05, cu + du - s.n[0] * 0.05, h, h + mh, cv - dv - s.n[1] * 0.05, cv + dv - s.n[1] * 0.05, 'bottom');
      }
    }
  }
}

// o: { h, floors:[{y0,h,w,pitch,...}], win: 'NSEW', belts:[y...], crown:{...}, range:{N:[a,b]}, minY:{E:y}, roof:false }
export function mass(F, r, o, detail) {
  const [u0, u1, v0, v1] = r, near = detail === 'near';
  const ch = o.crown === false ? 0 : (o.crown?.cornice ?? 0.7);
  F.box(o.wall ?? 'brick', u0, u1, 0, o.h - ch, v0, v1, 'bottom,top');
  if (o.crown !== false) crown(F, r, o.h, { ...(o.crown ?? {}) }, detail);
  else F.deck('roof', u0, u1, v0, v1, o.h);
  if (!near) return;
  for (const y of o.belts ?? []) belt(F, r, o.beltSides ?? 'NSEW', y, 0.3);
  for (const side of o.win ?? '') {
    for (const row of o.floors ?? []) {
      const minY = o.minY?.[side] ?? -1;
      if (row.y0 < minY) continue;
      windowRow(F, r, side, { ...row, range: o.range?.[side] ?? row.range }, detail);
    }
  }
}

// ---- the complex ------------------------------------------------------------------------------------

const factoryRows = (storeys, fh, w = 1.35, h = 2.5, pitch = 3.3, first = 1.0, shop = null) => {
  const rows = [];
  for (let i = 0; i < storeys; i++) rows.push(i === 0 && shop ? shop : { y0: first + fh * i, h, w, pitch });
  return rows;
};

export function buildBlocks(FG, FW, detail) {
  const near = detail === 'near';
  // -- the Chocolate (1911, 5 storeys) and Cocoa (1900, 5 storeys) buildings: red brick, white
  //    crenellated parapet, rows of paired sash windows.
  const tall = (shop) => factoryRows(5, 4.35, 1.35, 2.5, 3.3, 1.0, shop);
  mass(FG, RECT.chocolate, { h: H.chocolate, win: 'NWS', floors: tall(), belts: [4.2, 8.55, 12.9, 17.25], beltSides: 'NWS', crown: { merlons: 'NWS' } }, detail);
  mass(FG, RECT.cocoa, { h: H.cocoa, win: 'NSE', floors: tall({ y0: 0.7, h: 3.0, w: 2.6, pitch: 4.6, margin: 2.4 }), minY: { E: 13 }, belts: [4.2, 8.55, 12.9, 17.25], beltSides: 'NS', crown: { merlons: 'NS' } }, detail);
  mass(FG, RECT.cocoaNW, { h: H.cocoa, win: 'NE', floors: tall(), belts: [4.2, 8.55, 12.9, 17.25], beltSides: 'NE', crown: { merlons: 'NE' } }, detail);

  // -- the Mustard Building (1899-1911): three storeys, an open shop level, taller brick pier carrying
  //    the MUSTARD BUILDING board.
  mass(FG, RECT.mustard, {
    h: H.mustard, win: 'NS', crown: { merlons: 'NS' }, belts: [4.3, 8.35], beltSides: 'NS',
    floors: [{ y0: 0.7, h: 3.1, w: 2.8, pitch: 4.6, margin: 2.4 }, { y0: 5.2, h: 2.4, w: 1.3, pitch: 3.4 }, { y0: 9.0, h: 2.2, w: 1.3, pitch: 3.4 }],
  }, detail);
  mass(FG, RECT.mustardBay, { h: 14.2, win: '', crown: { sides: 'NEW', out: 0.25 }, belts: [], }, detail);
  if (near) {
    const bay = RECT.mustardBay, cu = (bay[0] + bay[1]) / 2;
    FG.wallQuad('gold', cu, bay[2] - 0.15, [0, -1], 3.8, 9.0, 12.0); // the board
    FG.wallQuad('glass', cu, bay[2] - 0.23, [0, -1], 3.0, 9.45, 11.1); // its dark lettering field
  }
  mass(FG, RECT.mustardLink, { h: H.mustard, win: '', crown: { sides: '' }, belts: [] }, detail);

  // -- the Clock Tower Building (1916): three tall storeys with large white stone window surrounds
  //    under a deep corbelled white cornice. The tower itself is ghirardelli-square-tower.js.
  mass(FG, RECT.clockWing, {
    h: H.clockWing, win: 'NEW', crown: { cornice: 1.3, out: 0.55, inward: 0.6 }, belts: [4.4, 8.8], beltSides: 'NEW',
    floors: [{ y0: 1.1, h: 2.6, w: 1.6, pitch: 3.8, frame: 0.55, margin: 2.2 }, { y0: 5.5, h: 2.6, w: 1.6, pitch: 3.8, frame: 0.55, margin: 2.2 }, { y0: 9.9, h: 2.0, w: 1.6, pitch: 3.8, frame: 0.55, margin: 2.2 }],
    range: { W: [0, 9.6] },
  }, detail);
  if (near) {
    // corbel table under the cornice: small brackets every 0.9 m on the Larkin St (east) and plaza (north) faces
    const r = RECT.clockWing, y = H.clockWing - 1.3 - 0.45;
    for (const sd of ['E', 'N']) {
      const s = SIDE[sd](r), n = Math.floor((s.L - 1.2) / 0.95), first = (s.L - (n - 1) * 0.95) / 2;
      for (let k = 0; k < n; k++) {
        const t = first + k * 0.95, cu = s.p[0] + s.d[0] * t, cv = s.p[1] + s.d[1] * t, du = s.d[0] ? 0.2 : 0.18, dv = s.d[1] ? 0.2 : 0.18;
        FG.box('trim', cu - du + s.n[0] * 0.2, cu + du + s.n[0] * 0.2, y, y + 0.45, cv - dv + s.n[1] * 0.2, cv + dv + s.n[1] * 0.2, 'top');
      }
    }
  }
  mass(FG, RECT.clockAnnex, { h: H.clockAnnex, win: 'NW', floors: [{ y0: 0.8, h: 2.2, w: 1.6, pitch: 3.0, frame: 0.3 }], crown: { cornice: 0.5, out: 0.2, inward: 0.35 } }, detail);

  // -- Apartment House (1916) and the low Carousel Building on the Larkin St side
  mass(FG, RECT.apartment, {
    h: H.apartment, win: 'ESW', crown: { cornice: 0.9, out: 0.4 }, belts: [3.8, 7.3], beltSides: 'ESW',
    floors: [{ y0: 0.9, h: 2.0, w: 1.15, pitch: 3.0, frame: 0.35 }, { y0: 4.5, h: 2.0, w: 1.15, pitch: 3.0, frame: 0.35 }, { y0: 8.0, h: 1.8, w: 1.15, pitch: 3.0, frame: 0.35 }],
  }, detail);
  const car = { h: H.carousel, crown: { cornice: 0.6, out: 0.25 }, belts: [3.9], beltSides: 'NSEW', floors: [{ y0: 0.9, h: 2.0, w: 1.3, pitch: 3.4, frame: 0.3 }, { y0: 4.7, h: 2.0, w: 1.3, pitch: 3.4, frame: 0.3 }] };
  mass(FG, RECT.carouselA, { ...car, win: 'WE', beltSides: 'WE' }, detail);
  mass(FG, RECT.carouselB, { ...car, win: 'WNE', beltSides: 'WNE' }, detail);

  // -- the plaza level: low brick pavilions with big glazed fronts
  const glazed = { floors: [{ y0: 0.6, h: 2.8, w: 2.9, pitch: 4.0, frame: 0.0, margin: 1.5 }] };
  const plaza = { h: H.plaza, crown: { cornice: 0.5, out: 0.2, inward: 0.35 }, ...glazed };
  mass(FG, RECT.plazaA, { ...plaza, win: 'SEW' }, detail);
  mass(FG, RECT.plazaB, { ...plaza, win: 'NEW' }, detail);
  mass(FG, RECT.plazaC, { ...plaza, win: 'NEW' }, detail);
  mass(FG, RECT.plazaD, { ...plaza, win: 'NEW' }, detail);
  const infill = { h: H.infill, crown: { cornice: 0.5, out: 0.2, inward: 0.35 }, ...glazed };
  mass(FG, RECT.infillA, { ...infill, win: 'SE' }, detail);
  mass(FG, RECT.infillB, { ...infill, win: 'NWE' }, detail);

  // -- a canopy over the plaza (OSM building=roof): a flat roof on four posts
  {
    const c = RECT.canopy;
    FG.box('roof', c[0], c[1], 4.1, 4.5, c[2], c[3]);
    for (const [pu, pv] of [[c[0] + 0.3, c[2] + 0.3], [c[1] - 0.3, c[2] + 0.3], [c[0] + 0.3, c[3] - 0.3], [c[1] - 0.3, c[3] - 0.3]]) FG.box('steel', pu - 0.15, pu + 0.15, 0, 4.1, pv - 0.15, pv + 0.15, 'bottom,top');
  }

  // -- the Wurster Building (1964, the new construction on Beach St): two levels under low hipped tile roofs
  const w = (r, win) => {
    const [u0, u1, v0, v1] = r;
    FG.box('brick', u0, u1, 0, H.wurster, v0, v1, 'bottom,top');
    FG.box('trim', u0 - 0.15, u1 + 0.15, H.wurster - 0.45, H.wurster, v0 - 0.15, v1 + 0.15);
    FG.hip('roofTile', u0 - 0.5, u1 + 0.5, v0 - 0.5, v1 + 0.5, H.wurster, H.wursterRise);
    if (!near) return;
    for (const side of win) {
      windowRow(FG, r, side, { y0: 0.5, h: 3.6, w: 2.9, pitch: 5.0, margin: 2.0, arch: true, frame: 0.4, lit: 0.45 }, detail);
      windowRow(FG, r, side, { y0: 4.8, h: 2.1, w: 1.4, pitch: 2.5, margin: 1.4, frame: 0.3 }, detail);
    }
  };
  w(RECT.wursterStrip, 'NSE');
  w(RECT.wursterWing, 'NWS');

  // -- Power House (1915): one tall brick volume with arched openings; flat roof inside a plain parapet
  const power = { h: H.power, crown: { cornice: 0.6, out: 0.25 }, floors: [{ y0: 0.5, h: 5.4, w: 2.3, pitch: 4.1, margin: 1.8, arch: true, frame: 0.5, lit: 0.3 }] };
  mass(FG, RECT.powerA, { ...power, win: 'NWS' }, detail);
  mass(FG, RECT.powerB, { ...power, win: 'NES' }, detail);
  mass(FG, RECT.millLink, { h: H.millLink, win: 'W', crown: { cornice: 0.5, out: 0.2 }, floors: [{ y0: 1.0, h: 2.2, w: 1.3, pitch: 3.2 }, { y0: 5.2, h: 2.2, w: 1.3, pitch: 3.2 }] }, detail);

  // -- the Pioneer Woolen Mill (1862), on its own 14-degree-rotated grid
  const mill = { h: H.woolen, crown: { cornice: 0.6, out: 0.25 }, belts: [3.9, 7.8], beltSides: 'NSEW', floors: factoryRows(3, 3.9, 1.3, 2.3, 3.2, 1.2).concat([{ y0: 12.5 - 0.6 - 3.0, h: 2.0, w: 1.3, pitch: 3.2 }]).slice(0, 3) };
  mass(FW, RECT.woolenMill, { ...mill, win: 'NSEW' }, detail);
  mass(FW, RECT.woolenBump, { ...mill, win: 'NEW' }, detail);

  // -- the octagonal gazebo in the plaza: glazed drum under a pyramid hat
  {
    const g = GAZEBO;
    FG.drum(near ? 'glass' : 'brick', g.u, g.v, g.r, 0, 3.2, 8, false);
    FG.spire('slate', g.u, g.v, g.r + 0.5, 3.2, 6.6, 8);
  }
}
