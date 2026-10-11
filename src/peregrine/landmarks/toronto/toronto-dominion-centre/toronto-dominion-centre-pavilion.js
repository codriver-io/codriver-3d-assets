// The Banking Pavilion (55 King St W, 1968): a one-storey, double-height glass hall
// under a flat roof carried on steel I-columns at the perimeter only. Its roof is
// 45.7 m square (two 22.86 m / 75 ft structural bays; OSM outline 2 041 m2, the
// heritage description gives 22 000 sq ft), with a fascia of deep black I-beams and a
// waffle-grid luminous ceiling inside. A living roof was planted in 2009.
//
// Modelled OPEN on all four sides: the columns, the thin glazing frames and the
// ceiling grid are what you see, and the granite floor runs through, as on the
// building. Heights are estimates from a 1973 photograph (columns on a 3.048 m /
// 10 ft pitch, a 2.4 m door under a transom, 7.6 m clear to the roof beams).
import { SPEC } from './config.js';
import { rectFaces, faceToward } from './toronto-dominion-centre-kit.js';
import { GRID } from './toronto-dominion-centre-site.js';
import { tdLetters } from './toronto-dominion-centre-tower.js';

const GLAZING_SETBACK = 0.9;

export function buildPavilion(k, P, near) {
  const { panel, faceBox, slab, rectBox } = k;
  const p = SPEC.plinth, faces = rectFaces(P), { soffit, top } = P;

  // Perimeter columns on the 3.048 m pitch (16 a side, corners shared): I-sections in near.
  faces.forEach((face, fi) => {
    const bays = Math.max(1, Math.round(face.len / P.bay)), pitch = face.len / bays, stride = near ? 1 : 2;
    for (let i = 0; i <= bays; i += (i + stride > bays && i < bays ? 1 : stride)) {
      if (fi >= 2 && (i === 0 || i === bays)) continue; // the long faces own the corners
      const corner = i === 0 || i === bays, s = Math.min(face.len - 0.28, Math.max(0.28, i * pitch));
      if (corner) { slab('steel', face, s - 0.28, s + 0.28, p, top, -0.56, 0, 'flr'); continue; }
      if (near) {
        slab('steel', face, s - 0.07, s + 0.07, p, top, -0.5, 0, 'lr'); // web (its faces are between the flanges)
        slab('steel', face, s - 0.18, s + 0.18, p, top, -0.05, 0, 'flr'); // outer flange
        slab('steel', face, s - 0.18, s + 0.18, p, top, -0.5, -0.45, 'flr'); // inner flange
      } else slab('steel', face, s - 0.22, s + 0.22, p, top, -0.6, 0, 'flr');
    }
    // Fascia: the roof's deep perimeter I-beam, flush with the column faces.
    slab('steel', face, 0, face.len, soffit, top, -0.45, 0, 'fd'); // the deep fascia: its face and underside
  });

  // Roof: living roof inside a black parapet; the waffle ceiling below it is luminous.
  const roof = { ...P, L: P.L - 0.9, W: P.W - 0.9 };
  rectBox('lawn', roof, 0, top - 0.22, 0, roof.L, 0.12, roof.W);
  const ceiling = { ...P, L: P.L - 1.1, W: P.W - 1.1 }, cy = soffit + 0.6;
  rectBox('lamp', ceiling, 0, cy + 0.04, 0, ceiling.L, 0.08, ceiling.W);
  // Deep ceiling beams in both directions at every column line (the waffle grid).
  // The hall's floor is lit as well: at night the pavilion glows from above through its open sides.
  rectBox('lamp', ceiling, 0, p + 0.05, 0, ceiling.L - 1.6, 0.04, ceiling.W - 1.6);
  const nu = Math.round(P.L / P.bay), nv = Math.round(P.W / P.bay);
  if (near) {
    for (let i = 1; i < nu; i++) rectBox('steel', P, -P.L / 2 + i * P.L / nu, (soffit + cy) / 2, 0, 0.28, cy - soffit, ceiling.W);
    for (let j = 1; j < nv; j++) rectBox('steel', P, 0, (soffit + cy) / 2, -P.W / 2 + j * P.W / nv, ceiling.L, cy - soffit, 0.28);
  } else {
    for (let i = 2; i < nu; i += 4) rectBox('steel', P, -P.L / 2 + i * P.L / nu, (soffit + cy) / 2, 0, 0.3, cy - soffit, ceiling.W);
  }

  // Glazing: thin black frames set back behind the columns; no glass, so the hall reads as open.
  if (near) {
    faces.forEach((face) => {
      const q = -GLAZING_SETBACK, bays = Math.round(face.len / P.bay) * 2, pitch = face.len / bays;
      for (let i = 1; i < bays; i++) slab('steel', face, i * pitch - 0.035, i * pitch + 0.035, p, soffit, q - 0.06, q + 0.06, 'f');
      for (const y of [p + 0.12, p + 2.4]) slab('steel', face, 0, face.len, y - 0.05, y + 0.05, q - 0.06, q + 0.06, 'fu');
      slab('steel', face, 0, face.len, soffit - 0.12, soffit, q - 0.08, q + 0.08, 'fd');
    });
  }

  // TD sign on the King Street face, inside the glazing.
  const kingFace = faceToward(faces, [-GRID.across[0], -GRID.across[1]]), size = 4.6, s0 = kingFace.len * 0.3;
  panel('sign', kingFace, s0, s0 + size, p + 2.85, p + 2.85 + size, -GLAZING_SETBACK - 0.1);
  if (near) tdLetters(k, kingFace, s0, p + 2.85, -GLAZING_SETBACK - 0.06);
}
