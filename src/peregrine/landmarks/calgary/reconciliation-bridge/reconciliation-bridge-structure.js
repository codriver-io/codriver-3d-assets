import { PROFILE as p, PANEL, PANELS, DEPTH, CHORD_Y, SPANS, ABUT_S, C0, TRUSS_D } from './reconciliation-bridge-profile.js';

// Structural layout shared by the geometry, the views and the tests. Everything is a function of the
// station along the mapped roadway; heights are above the road surface (y = 0 on the authored deck).
export const h = p.deckHeight;

/** Foot of the pier and abutments (attachment weight 0: they reach their own ground in Full 3D world). */
export const FOOT = -2.9;
/** Top of the pier cap and abutment bearing seats (the steel shoes stand on it). */
export const SEAT = -1.65;
/** Road slab: its top 0.2 m under the road surface (no structural face grazes the road layers). */
export const SLAB_TOP = -0.2, SLAB_BOTTOM = -0.45;
/** Floor beams under every panel point. */
export const BEAM_BOTTOM = -1.45;

/** Station of panel point i (0..8) of span k (0 = north, 1 = south). */
export const panelS = (k, i) => SPANS[k][0] + i * PANEL;
/** Height of the top chord centre line at panel point i (bottom chord at 0 and 8). */
export const chordY = (i) => CHORD_Y + DEPTH[i];
/** The two truss planes' lateral offsets. */
export const TRUSSES = [C0 - TRUSS_D, C0 + TRUSS_D];

/** A point on the end post of span k at height y: [station, y]; `end` 0 = the span's north end post. */
export function endPostAt(k, end, y) {
  const t = (y - CHORD_Y) / DEPTH[1];
  return end === 0 ? panelS(k, 0) + t * PANEL : panelS(k, PANELS) - t * PANEL;
}

/** Attachment weight of a substructure vertex: 0 at the foot (its own ground) to 1 at `top` (the deck). */
export const grip = (top) => (y) => Math.max(0, Math.min(1, (y - FOOT) / (top - FOOT)));

export { ABUT_S };
