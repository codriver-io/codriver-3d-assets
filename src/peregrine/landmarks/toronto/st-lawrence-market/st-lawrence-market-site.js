// Authoring constants for the St. Lawrence Market South Market, shared by
// geometry.js and the tests. Authoring only: the runtime reads config.js.
//
// Model frame (before the single rotation applied to the exported root):
//   u  along the Front Street facade (the model's +X), v along the hall axis
//   towards The Esplanade (the model's +Z), y up. The hall is a rectangle in
//   (u, v): OSM way 24626769 fits it to a few centimetres once the frame is
//   turned 17.13 degrees (Toronto's street grid), exactly what
//   tmp/toronto/st-lawrence-market/fit.mjs reports from the mapped ring.

export const PHI_DEG = 17.13;
export const PHI = PHI_DEG * Math.PI / 180;

// Mapped rectangle (OSM, wall faces): 43.3 m wide, 106.2 m long.
export const HW = 21.66;           // half width, wall face to wall face
export const V_N = -52.9;          // Front Street facade plane
export const V_S = 53.3;           // The Esplanade end wall plane
export const LENGTH = V_S - V_N;

// Vertical stack (estimated from photographs; OSM gives 10 m walls, 19 m roof
// crown, 21 m lantern).
export const BASE_H = 3.8;         // lower storey: solid on the north half, an open colonnade under the deck on the south
export const SILL = 5.5;           // window sills, first floor of the hall
export const SPRING = 8.3;         // springing of the arched windows
export const EAVE = 10.4;          // brick wall top, roof springs here
export const CROWN = 19.6;         // crown of the arched roof at mid width
export const LANTERN_TOP = 21.2;   // ridge of the clerestory lantern
export const LANTERN_U = 7.25;     // half width of the lantern (OSM part: 14.5 m)
export const LANTERN_EAVE = 20.25; // glazing head, under the lantern cap
export const LANTERN_END_S = V_S - 7.2; // the mapped lantern stops ~7 m short of the south wall

export const WIN_RISE = 0.95;     // the long-wall windows have shallow segmental heads; the ends, wings and porches are round-headed
// Bays: one arched window between brick piers every 4.8 m; 9 across the ends.
export const MODULE = 4.8;
export const WIN_W = 3.15;
export const PAVILION_LEN = 8.0;   // corner pavilion (pedimented entrance) along the long walls
export const PAVILION_PROUD = 1.14; // beyond the wall face (OSM: 1.0-1.25 m)
export const BAY_FIRST = V_N + 8.4 + MODULE / 2; // centre of the first bay after the pavilion
export const BAYS = 20;
export const DECK_FROM = V_N + 34; // the colonnade and deck start 34 m from the Front Street end
export const DECK_OUT = 2.4;       // deck depth beyond the wall face

// The roof cross-section is a convex arch: steep at the eave, flat at the crown.
export const ARCH_P = 2.0;
export function roofY(u) {
  const t = Math.min(1, Math.abs(u) / HW);
  return EAVE + (CROWN - EAVE) * (1 - Math.pow(t, ARCH_P));
}
// Points of the arch from the eave (u = HW) to `uEnd`, n segments.
export function archPoints(n, uEnd = 0) {
  return Array.from({ length: n + 1 }, (_, i) => { const u = HW + (uEnd - HW) * i / n; return [u, roofY(u)]; });
}

// The 1845 City Hall centre block, kept in the Front Street facade.
export const REMNANT = {
  halfWidth: 7.0, proud: 0.4, baseTop: 4.3, top: 13.9,
  arches: [{ u: -5.2, w: 2.5, h: 3.5 }, { u: 0, w: 4.2, h: 3.9 }, { u: 5.2, w: 2.5, h: 3.5 }],
  pilasters: [-6.5, -3.6, 3.6, 6.5],
  windowCols: [-5.05, -1.8, 1.8, 5.05], rows: [[6.2, 8.0], [10.2, 12.0]],
  chimneys: [{ u: -2.6, top: 23.6 }, { u: 3.4, top: 22.9 }],
};

// A stroke font for the block lettering ("ST LAWRENCE MARKET"): each glyph is a
// list of strokes in a unit-height cell, [x1, y1, x2, y2]; width w.
const g = (w, ...strokes) => ({ w, strokes });
export const GLYPHS = {
  S: g(0.52, [0.06, 0.94, 0.46, 0.94], [0.06, 0.94, 0.06, 0.5], [0.06, 0.5, 0.46, 0.5], [0.46, 0.5, 0.46, 0.06], [0.06, 0.06, 0.46, 0.06]),
  T: g(0.56, [0, 0.94, 0.56, 0.94], [0.28, 0.94, 0.28, 0]),
  L: g(0.46, [0.06, 1, 0.06, 0], [0.06, 0.06, 0.46, 0.06]),
  A: g(0.62, [0, 0, 0.31, 1], [0.31, 1, 0.62, 0], [0.13, 0.36, 0.49, 0.36]),
  W: g(0.86, [0, 1, 0.2, 0], [0.2, 0, 0.43, 0.8], [0.43, 0.8, 0.66, 0], [0.66, 0, 0.86, 1]),
  R: g(0.54, [0.06, 1, 0.06, 0], [0.06, 0.94, 0.46, 0.94], [0.46, 0.94, 0.46, 0.5], [0.06, 0.5, 0.46, 0.5], [0.2, 0.5, 0.5, 0]),
  E: g(0.46, [0.06, 1, 0.06, 0], [0.06, 0.94, 0.46, 0.94], [0.06, 0.5, 0.4, 0.5], [0.06, 0.06, 0.46, 0.06]),
  N: g(0.6, [0.06, 0, 0.06, 1], [0.06, 1, 0.54, 0], [0.54, 0, 0.54, 1]),
  C: g(0.52, [0.06, 0.94, 0.5, 0.94], [0.06, 0.94, 0.06, 0.06], [0.06, 0.06, 0.5, 0.06]),
  M: g(0.78, [0.06, 0, 0.06, 1], [0.06, 1, 0.39, 0.4], [0.39, 0.4, 0.72, 1], [0.72, 1, 0.72, 0]),
  K: g(0.56, [0.06, 0, 0.06, 1], [0.5, 1, 0.06, 0.45], [0.16, 0.6, 0.54, 0]),
};
// Laid-out strokes for a string, centred on 0, in units of the letter height.
export function layoutText(text, gap = 0.2, space = 0.4) {
  const items = []; let x = 0;
  for (const ch of text) {
    if (ch === ' ') { x += space; continue; }
    const glyph = GLYPHS[ch]; if (!glyph) throw new Error(`no glyph for ${ch}`);
    items.push({ x, glyph }); x += glyph.w + gap;
  }
  const width = x - gap;
  return { width, items: items.map(({ x: gx, glyph }) => ({ glyph, x: gx - width / 2 })) };
}
