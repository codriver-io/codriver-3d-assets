// Plan data for Alcatraz Island in the authoring frame (metres from the origin):
// u along the cellhouse's long axis (compass bearing 135.95, toward the Administration Block and the lighthouse),
// w at right angles toward the south-west (bearing 225.95, the front that looks at San Francisco), y up.
// The rectangles below are read off the mapped OSM outlines (ways 128245373, 24433437, 128245367); heights are estimated from photographs.
export const MASSES = [
  // id, u0, u1, w0, w1, parapet height, shared sides (touching another mass: no projecting cornice there)
  { id: 'block-x', u: [-32.4, -15.4], w: [-14.2, 24.7], H: 14.0, share: { uMax: true }, baseShare: { uMin: true, uMax: true } },
  { id: 'cellblock', u: [-15.4, 15.7], w: [-24.6, 24.7], H: 15.6, share: { uMax: true }, baseShare: { uMin: true, uMax: true } },
  { id: 'block-z', u: [15.7, 32.6], w: [-24.6, 13.6], H: 15.6, share: { uMin: true }, baseShare: { uMin: true, uMax: true } },
  { id: 'admin', u: [32.6, 47.4], w: [-24.6, 10.3], H: 12.4, share: { uMin: true }, baseShare: { uMin: true } },
  { id: 'dining', u: [-77.3, -32.4], w: [-9.0, 11.1], H: 10.8, share: { uMin: true, uMax: true }, baseShare: { uMin: true, uMax: true } },
  { id: 'dining-end', u: [-84.5, -77.3], w: [-5.6, 7.4], H: 10.8, share: { uMax: true }, baseShare: { uMax: true } },
];
// Window tiers per parapet height: [y0, y1, width, mullions]
export const TIERS = {
  15.6: { base: 3.8, tiers: [[1.2, 2.6, 1.3, 0], [4.7, 8.1, 1.5, 1], [9.3, 12.7, 1.5, 1]], band: 8.55 },
  14.0: { base: 3.5, tiers: [[1.1, 2.4, 1.3, 0], [4.3, 7.5, 1.5, 1], [8.5, 11.6, 1.5, 1]], band: 7.95 },
  12.4: { base: 3.4, tiers: [[1.1, 2.4, 1.3, 0], [4.2, 7.2, 1.5, 1], [8.2, 10.6, 1.5, 1]], band: 7.7 },
  10.8: { base: 3.1, tiers: [[1.1, 2.3, 1.3, 0], [3.8, 8.6, 2.0, 1]], band: null },
};
// Outer faces that are dressed (pilasters, windows). axis 'u': the face lies on the line w = c and spans u in [a, b]; axis 'w': u = c, w in [a, b].
// n is the outward direction (+1 / -1) along the other axis.
export const FACES = [
  // south-west front (looks at San Francisco)
  { axis: 'u', c: 24.7, a: -32.4, b: -15.4, n: 1, H: 14.0 },
  { axis: 'u', c: 24.7, a: -15.4, b: 15.7, n: 1, H: 15.6 },
  { axis: 'u', c: 13.6, a: 15.7, b: 32.6, n: 1, H: 15.6 },
  { axis: 'u', c: 10.3, a: 32.6, b: 47.4, n: 1, H: 12.4 },
  { axis: 'u', c: 11.1, a: -77.3, b: -32.4, n: 1, H: 10.8 },
  { axis: 'u', c: 7.4, a: -84.5, b: -77.3, n: 1, H: 10.8 },
  // north-east back (the dock side)
  { axis: 'u', c: -24.6, a: -15.4, b: 32.6, n: -1, H: 15.6 },
  { axis: 'u', c: -24.6, a: 32.6, b: 47.4, n: -1, H: 12.4 },
  { axis: 'u', c: -14.2, a: -32.4, b: -15.4, n: -1, H: 14.0 },
  { axis: 'u', c: -9.0, a: -77.3, b: -32.4, n: -1, H: 10.8 },
  { axis: 'u', c: -5.6, a: -84.5, b: -77.3, n: -1, H: 10.8 },
  // ends
  { axis: 'w', c: -32.4, a: 11.1, b: 24.7, n: -1, H: 14.0 },
  { axis: 'w', c: -15.4, a: -24.6, b: -14.2, n: -1, H: 15.6 },
  { axis: 'w', c: 15.7, a: 13.6, b: 24.7, n: 1, H: 15.6 },
  { axis: 'w', c: 47.4, a: -24.6, b: 10.3, n: 1, H: 12.4 },
  { axis: 'w', c: -84.5, a: -5.6, b: 7.4, n: -1, H: 10.8 },
];
// Roof monitors (skylight gables) along u: u0, u1, w0, w1, base y, rise
export const MONITORS = [
  [-11.5, 11.5, -17.5, -8.5, 15.8, 1.7], [-11.5, 11.5, 8.5, 17.5, 15.8, 1.7],
  [19.5, 29, -14, -5, 15.8, 1.7],
  [-72, -38, -4.5, 6.5, 11.0, 1.5],
];
export const LIGHTHOUSE = { u: 69.0, w: -11.1, baseTop: 8.4, shaftTop: 22.8, top: 28.8 };
// Water tower: footings 2.5 m below grade; top set to its true relation to the cellhouse roof (about 4.8 m above it), legs shortened accordingly.
export const TOWER = { u: -136.6, w: -9.7, footY: -2.5, bowlY: 8.5, top: 20.6 };
// Recreation-yard wall (OSM way 99202295) in (u, w); open polyline.
export const YARD_WALL = [[-32, 17], [-53, 16], [-59, 45], [-114, 35], [-137, 31], [-131, 0], [-97, 5], [-95, -9], [-56, -15], [-50, -16]];
export const YARD = { height: 4.6, thickness: 0.7, rail: 0.7, coping: 0.3, copingThickness: 0.95, pier: { every: 6.2, width: 1.1, out: 0.9, height: 4.3 } };
export const GUARD_TOWERS = [[-59, 44.3], [-131.5, 0.9]];
// Warden's House ruins: shell u 78.2..94.2, w -46.6..-33.6 (OSM way 27996789).
export const RUIN = { u0: 78.2, u1: 94.2, w0: -46.6, w1: -33.6, t: 0.55 };
