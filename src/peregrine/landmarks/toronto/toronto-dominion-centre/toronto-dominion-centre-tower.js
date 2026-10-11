// One Mies-vocabulary tower of the Toronto-Dominion Centre.
//
// Read from the building's own technical specification and photographs:
//   - a 1.524 m (5 ft) module: black-painted steel I-beam mullions every module,
//     standing proud of bronze glass 1.52 m wide x 2.74 m high (floor-to-floor 3.66 m);
//   - a 0.92 m black spandrel at every floor;
//   - a two-storey glass lobby set back behind a colonnade, carried under a deep
//     transfer beam; columns on the 9.14 m (30 ft) structural grid;
//   - windowless louvered mechanical floors (bands) and a louvered crown, with the
//     green TD sign at the top of the tallest faces.
// The tower is an oriented rectangle fitted to its mapped footprint, measured from
// street grade; the plaza plinth (SPEC.plinth) is what the lobby stands on.
import { SPEC } from './config.js';
import { rectFaces, faceToward, facePoint, hash4 } from './toronto-dominion-centre-kit.js';
import { GRID } from './toronto-dominion-centre-site.js';

const SPANDREL = 0.92, GLASS_Q = -0.30, COLUMN = 0.9, RECESS = 3.05, GRID_COL = 9.144;
const LOGO = 4.6;

/** Sections of the shell from the lobby roof up: glazed floors, windowless bands, the crown. */
export function towerSections(t) {
  const f = SPEC.floorToFloor, out = [];
  let y = t.lobby;
  for (const [floors, bandH] of t.bands) {
    out.push({ kind: 'glass', y0: y, y1: y + floors * f, floors }); y += floors * f;
    out.push({ kind: 'band', y0: y, y1: y + bandH }); y += bandH;
  }
  out.push({ kind: 'glass', y0: y, y1: y + t.topFloors * f, floors: t.topFloors }); y += t.topFloors * f;
  out.push({ kind: 'band', y0: y, y1: t.H, crown: true });
  return out;
}

export function buildTower(k, t, near) {
  const { panel, faceBox, slab, rectBox } = k;
  const f = SPEC.floorToFloor, p = SPEC.plinth, m0 = SPEC.module, top = t.H;
  const faces = rectFaces(t), sections = towerSections(t);
  const inner = { ...t, L: t.L - 2 * -GLASS_Q, W: t.W - 2 * -GLASS_Q };
  const solid = { ...t, L: t.L - 0.04, W: t.W - 0.04 };

  // Shell: bronze glass recessed 0.3 m behind the steel, windowless steel bands.
  for (const s of sections) {
    if (s.kind === 'glass') rectBox('glass', inner, 0, (s.y0 + s.y1) / 2, 0, inner.L, s.y1 - s.y0, inner.W);
    else rectBox('steel', solid, 0, (s.y0 + s.y1) / 2, 0, solid.L, s.y1 - s.y0, solid.W);
  }
  rectBox('steel', solid, 0, top - 0.3, 0, solid.L, 0.6, solid.W); // roof cap

  // Spandrels (one black band per floor: its face and its underside) and lit-or-not window panes. A lit pane is one
  // rectangle however many neighbouring windows are lit: the mullions and spandrels in front draw the grid, so
  // adjacent lit bays and floors merge behind them.
  if (near) {
    let towerIndex = Math.round(Math.abs(t.cx * 7 + t.cz * 13));
    faces.forEach((face, fi) => {
      const bays = Math.round(face.len / m0), pitch = face.len / bays;
      for (const s of sections) {
        if (s.kind !== 'glass') continue;
        const lit = [];
        for (let floor = 0; floor < s.floors; floor++) {
          const y = s.y0 + floor * f;
          slab('steel', face, 0, face.len, y, y + SPANDREL, GLASS_Q, -0.02, 'fd');
          const bias = hash4(towerIndex, fi, Math.round(y), -1), row = [];
          for (let bay = 0; bay < bays; bay++) row.push(bay >= 1 && bay < bays - 1 && hash4(towerIndex, fi, Math.round(y), bay) < 0.16 + 0.42 * bias * bias);
          lit.push(row);
        }
        for (let floor = 0; floor < s.floors; floor++) for (let bay = 0; bay < bays; bay++) { // greedy rectangles of lit cells
          if (!lit[floor][bay]) continue;
          let b1 = bay; while (b1 + 1 < bays && lit[floor][b1 + 1]) b1++;
          let f1 = floor; while (f1 + 1 < s.floors && lit[f1 + 1].slice(bay, b1 + 1).every(Boolean)) f1++;
          for (let fl = floor; fl <= f1; fl++) for (let bb = bay; bb <= b1; bb++) lit[fl][bb] = false;
          panel('glow', face, bay * pitch + 0.09, (b1 + 1) * pitch - 0.09, s.y0 + floor * f + SPANDREL, s.y0 + f1 * f + f, GLASS_Q + 0.07);
        }
      }
    });
  } else {
    // Far: no per-floor detail (it is sub-pixel at range and would shimmer).
  }

  // Mullions: black I-beams every module on every face; a bigger column at each corner.
  faces.forEach((face) => {
    const step = near ? m0 : GRID_COL, bays = Math.max(1, Math.round(face.len / step)), pitch = face.len / bays;
    for (let i = 1; i < bays; i++) {
      if (near) { // an I-beam: a thin web standing out from the glass and a wider outer flange
        slab('steel', face, i * pitch - 0.03, i * pitch + 0.03, t.lobby, top, GLASS_Q, -0.04, 'lr'); // the web: its flanks (the flange hides its front)
        slab('steel', face, i * pitch - 0.08, i * pitch + 0.08, t.lobby, top, -0.06, 0, 'flr');   // the outer flange
      } else slab('steel', face, i * pitch - 0.14, i * pitch + 0.14, t.lobby, top, GLASS_Q, 0, 'flr');
    }
  });
  for (const [u, v] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
    rectBox('steel', t, u * (t.L / 2 - 0.3), (t.lobby + top) / 2, v * (t.W / 2 - 0.3), 0.6, top - t.lobby, 0.6);
  }

  // Louvers on the windowless bands and crown: horizontal slats in bronze between the mullions.
  if (near) {
    for (const s of sections) {
      if (s.kind !== 'band') continue;
      const pitch = 0.9, count = Math.floor((s.y1 - s.y0 - 0.5) / pitch);
      for (const face of faces) {
        for (let i = 0; i < count; i++) {
          const y = s.y0 + 0.3 + i * pitch;
          slab('glass', face, 0.6, face.len - 0.6, y, y + 0.42, -0.02, 0.05, 'fd');
        }
      }
    }
  }

  // Lobby: glazing set back one colonnade deep, a transfer beam on top, columns on the 9.14 m grid.
  const lobbyGlass = { ...t, L: t.L - 2 * RECESS, W: t.W - 2 * RECESS };
  rectBox('glow', lobbyGlass, 0, (p + t.lobby) / 2, 0, lobbyGlass.L, t.lobby - p, lobbyGlass.W);
  faces.forEach((face, fi) => {
    slab('steel', face, 0, face.len, t.lobby - 1.1, t.lobby, -0.7, 0, 'fd');
    const bays = Math.max(1, Math.round(face.len / GRID_COL)), pitch = face.len / bays;
    for (let i = 0; i <= bays; i++) {
      if (fi >= 2 && (i === 0 || i === bays)) continue; // the long faces own the corner columns
      const s = Math.min(face.len - COLUMN / 2, Math.max(COLUMN / 2, i * pitch));
      slab('steel', face, s - COLUMN / 2, s + COLUMN / 2, p, t.lobby - 1.1, -COLUMN, 0, 'flr');
    }
    if (near) { // lobby glazing frame: a mullion every module and a transom at door height
      const gq = -RECESS + 0.02, lens = face.kind === 'long' ? lobbyGlass.L : lobbyGlass.W;
      const b0 = (face.len - lens) / 2, n = Math.round(lens / m0), pt = lens / n;
      for (let i = 0; i <= n; i++) slab('steel', face, b0 + i * pt - 0.04, b0 + i * pt + 0.04, p, t.lobby - 1.1, gq - 0.04, gq + 0.06, 'f');
      slab('steel', face, b0, b0 + lens, p + 2.7, p + 2.82, gq - 0.04, gq + 0.06, 'fu');
    }
  });

  // TD signs: a green square with white lettering just below the crown.
  for (const logo of t.logos) {
    const dir = { north: [-GRID.across[0], -GRID.across[1]], south: GRID.across, east: GRID.along, west: [-GRID.along[0], -GRID.along[1]] }[logo.face];
    const face = faceToward(faces, dir), y1 = top - t.crown - 1.6, y0 = y1 - LOGO;
    const s0 = Math.min(face.len - LOGO - 3, Math.max(3, logo.at * face.len - LOGO / 2));
    panel('sign', face, s0, s0 + LOGO, y0, y1, 0.10);
    if (near) tdLetters(k, face, s0, y0, 0.14);
  }
}

/** "TD" as white geometry on the logo square (s0 and y0 are its lower-left corner, viewer's right). */
export function tdLetters(k, face, s0, y0, q) {
  const bar = (a, b, c, d) => k.panel('light', face, s0 + a, s0 + b, y0 + c, y0 + d, q);
  bar(0.5, 2.1, 3.0, 3.5); bar(1.05, 1.55, 1.1, 3.0); // T
  bar(2.35, 2.85, 1.1, 3.5); // D stem
  const cx = 2.85, cy = 2.3, ro = 1.2, ri = 0.72, n = 7; // D bowl: a half ring in short flat segments
  const pt = (r, a) => { const [x, z] = facePoint(face, s0 + cx + Math.cos(a) * r * 0.86, q); return [x, y0 + cy + Math.sin(a) * r, z]; };
  for (let i = 0; i < n; i++) {
    const a0 = -Math.PI / 2 + Math.PI * i / n, a1 = -Math.PI / 2 + Math.PI * (i + 1) / n;
    k.quad('light', pt(ri, a0), pt(ro, a0), pt(ro, a1), pt(ri, a1)); // counter-clockwise seen from outside
  }
}
