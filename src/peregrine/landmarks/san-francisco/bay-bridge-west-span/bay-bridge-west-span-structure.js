import { S, h, lower, TRUSS_HALF as TH, TOWER_TOP } from './bay-bridge-west-span-profile.js';

// Structural layout shared by the geometry, the views and the tests. Everything is a function of the
// station along the mapped roadway and of the deck height profile; nothing here is a survey.

/** The stiffening truss runs from the San Francisco anchorage to the face of the island anchorage W7. */
export const T_START = S.SFA;
export const T_END = S.W7 - 18;

/** Panel points about 30 ft apart (612 cable bands on two cables over the 2.82 km of suspended spans). */
export const PANEL = 9.2;
export const truss = {
  panels(near) {
    const n = Math.round((T_END - T_START) / (near ? PANEL : 2 * PANEL));
    return Array.from({ length: n + 1 }, (_, i) => T_START + (T_END - T_START) * i / n);
  },
  // Bents A and B of the approach truss: two continuous 380 ft spans from the anchorage, closely
  // spaced bents between them (HAER CA-32), straddling Main Street.
  bents: [S.SFA + 116, S.W1 - 116],
};

export const TOWERS = [
  { id: 'W2', s: S.W2, top: TOWER_TOP.W2, fender: [26, 48] },
  { id: 'W3', s: S.W3, top: TOWER_TOP.W3, fender: [33, 57] },   // OSM "Pier B" outline
  { id: 'W5', s: S.W5, top: TOWER_TOP.W5, fender: [29, 56] },   // OSM pier "D"
  { id: 'W6', s: S.W6, top: TOWER_TOP.W6, fender: [29, 54] },   // OSM pier "E"
];

const SADDLE = 1.2;          // cable centre below the tower top
const MIDSPAN_CLEAR = 1.25;  // cable centre above the upper road at its lowest point
const SIDE_SAG = 15;         // side-span sag below the chord (same horizontal tension as the main span)
const W4_END = 26, ANCHOR_D = 11.6;

/** Parabola through (s0, y0) and (s1, y1) with sag f below the chord at mid-span. */
const parabola = (span, s) => { const u = (s - span.s0) / (span.s1 - span.s0); return span.y0 + (span.y1 - span.y0) * u - 4 * span.f * u * (1 - u); };
export const cableY = (span, s) => parabola(span, s);

/** The main-span sag that brings the cable down to MIDSPAN_CLEAR above the deck, and no lower. */
function mainSag(s0, s1, y0, y1) {
  let lo = 0, hi = 200;
  for (let it = 0; it < 50; it++) {
    const f = (lo + hi) / 2, span = { s0, s1, y0, y1, f };
    let min = Infinity;
    for (let i = 1; i < 200; i++) { const s = s0 + (s1 - s0) * i / 200; min = Math.min(min, parabola(span, s) - h(s)); }
    if (min > MIDSPAN_CLEAR) lo = f; else hi = f;
  }
  return lo;
}
const straight = () => TH;
const toAnchor = (s0, s1, flip) => (s) => {
  const u = Math.max(0, Math.min(1, (s - s0) / (s1 - s0)));
  return TH + (ANCHOR_D - TH) * (flip ? (1 - u) ** 4 : u ** 4);
};

const top = (id) => TOWER_TOP[id] - SADDLE;
function span(s0, s1, y0, y1, f, lat, hangers = true) { return { s0, s1, y0, y1, f, lat, hangers }; }
export const CABLE_SPANS = [
  // The cables pass down through the truss just west of W1 and run under the approach to the anchorage.
  // On the flat map this side span climbs more steeply than the real one, so its cable sags less.
  span(S.SFA + 20, S.W1, lower(S.SFA) - 8, h(S.W1) + 0.4, 0, straight, false),
  span(S.W1, S.W2, h(S.W1) + 0.4, top('W2'), 8, straight),
  span(S.W2, S.W3, top('W2'), top('W3'), mainSag(S.W2, S.W3, top('W2'), top('W3')), straight),
  span(S.W3, S.W4 - W4_END, top('W3'), h(S.W4) + 3.0, SIDE_SAG, toAnchor(S.W3, S.W4 - W4_END, false)),
  span(S.W4 + W4_END, S.W5, h(S.W4) + 3.0, top('W5'), SIDE_SAG, toAnchor(S.W4 + W4_END, S.W5, true)),
  span(S.W5, S.W6, top('W5'), top('W6'), mainSag(S.W5, S.W6, top('W5'), top('W6')), straight),
  span(S.W6, S.W7 - 2, top('W6'), h(S.W7) + 2.8, SIDE_SAG, toAnchor(S.W6, S.W7 - 2, false)),
];
