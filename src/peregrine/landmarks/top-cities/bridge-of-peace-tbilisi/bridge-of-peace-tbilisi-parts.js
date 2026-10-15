// Alignment and canopy law of the Bridge of Peace (Tbilisi), shared by config, footprint, geometry and tests.
// Derived data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright
// Local frame: +x east, +y up, +z south, metres, origin = middle of the mapped roof axis.
// Latitude stretch is applied once here (R and rad are the repository's Web-Mercator constants).
const R = 6378137, rad = Math.PI / 180;

// OSM way 1207561125 (building=roof, 'Bridge of Peace'): its three west and three east nodes sit within 2 m of each
// other, so the ring is a 1 m sliver along the 149 m roof axis. West/east tips are the middle node of each triple.
export const ROOF_RING = [[44.8071583, 41.6929556], [44.8071589, 41.6929463], [44.8071594, 41.6929375], [44.8089531, 41.6929992], [44.8089527, 41.6930068], [44.808952, 41.693017], [44.8071583, 41.6929556]];
const WEST_TIP = [44.8071589, 41.6929463], EAST_TIP = [44.8089527, 41.6930068];
export const ORIGIN = [(WEST_TIP[0] + EAST_TIP[0]) / 2, (WEST_TIP[1] + EAST_TIP[1]) / 2].map((v) => +v.toFixed(7));
const kx = rad * R * Math.cos(ORIGIN[1] * rad), kz = rad * R;
export const local = ([lng, lat]) => [(lng - ORIGIN[0]) * kx, (ORIGIN[1] - lat) * kz];
export const geographic = (x, z) => [ORIGIN[0] + x / kx, ORIGIN[1] - z / kz];

const A = local(WEST_TIP), B = local(EAST_TIP);
export const LENGTH = Math.hypot(B[0] - A[0], B[1] - A[1]); // 149 m mapped, 150 m published
const U = [(B[0] - A[0]) / LENGTH, (B[1] - A[1]) / LENGTH]; // unit axis, west to east
const N = [-U[1], U[0]]; // +d is to the right of travel, i.e. south
export const BEARING = +((Math.atan2(U[0], -U[1]) / rad + 360) % 360).toFixed(2); // compass bearing of the axis

// Estimated vertical law (see docs): deck level above quay grade, ramps to grade at both ends.
export const DECK_H = 5.6, RAMP_W = 46, RAMP_E = 40;
const smooth = (t) => t * t * (3 - 2 * t);
const ramp = (t) => 0.8 * t + 0.2 * smooth(t); // 80 % linear keeps the steepest grade near 13 %
export function deckY(s) {
  if (s < RAMP_W) return DECK_H * ramp(Math.max(0, s) / RAMP_W);
  if (s > LENGTH - RAMP_E) return DECK_H * ramp(Math.max(0, LENGTH - s) / RAMP_E);
  return DECK_H;
}
// Half-width of the deck: 7.6 m between the glass parapets mid-river, narrowing to the 4.4 m landings.
export const halfWidth = (s) => 2.2 + 1.6 * Math.pow(Math.sin(Math.PI * Math.min(1, Math.max(0, s / LENGTH))), 0.6);
export function point(s, d = 0, y = 0) {
  return [A[0] + U[0] * s + N[0] * d, y, A[1] + U[1] * s + N[1] * d];
}
export const toStation = (x, z) => ({ s: (x - A[0]) * U[0] + (z - A[1]) * U[1], d: (x - A[0]) * N[0] + (z - A[1]) * N[1] });

// Canopy envelope: a lens that rises from the landings, crests mid-river and lands again, leaning towards +d.
export const CANOPY_RISE = 15;
export const envelope = (s) => Math.pow(Math.sin(Math.PI * Math.min(1, Math.max(0, s / LENGTH))), 0.55);
export function canopySection(s) {
  const t = s / LENGTH, env = envelope(s);
  const b = CANOPY_RISE * env * (1 + 0.07 * Math.sin(2 * Math.PI * 1.5 * t + 0.6)); // crest height ripples
  const k = 0.38 + 0.25 * Math.cos(2 * Math.PI * 1.25 * t + 0.4); // lean: the crest rib swings across the deck like the real wave
  const a = halfWidth(s) + 0.28; // ribs stand just outside the deck fascia
  return { a, b, k, base: deckY(s) };
}
// Rib centre-line point at station s and arc parameter u in [0,1] (0 = +d foot, 0.5 = crest, 1 = -d foot).
// The arc runs a little below the deck top so each foot grips the girder fascia.
export function ribPoint(s, u) {
  const { a, b, k, base } = canopySection(s);
  const th0 = b > 0.9 ? Math.asin(Math.min(0.99, 0.7 / b)) : Math.PI / 2;
  const th = -th0 + u * (Math.PI + 2 * th0);
  const vv = a * Math.cos(th), yy = b * Math.sin(th);
  return point(s, vv + k * Math.max(yy, 0), Math.max(base + yy, 0.3)); // only the part above the deck leans // the landing tips rest on grade, never below it
}

// Stair V's of the two landings (OSM steps 77984293/1047664365 west, 77984294/1047664416 east; 48 steps each).
const stairFoot = (lng, lat) => local([lng, lat]);
export const STAIRS = [
  { id: 'west-north', apex: stairFoot(44.8080262, 41.6929767), foot: stairFoot(44.807791, 41.6931041) },
  { id: 'west-south', apex: stairFoot(44.8080262, 41.6929767), foot: stairFoot(44.8077994, 41.6928295) },
  { id: 'east-north', apex: stairFoot(44.8085259, 41.6929964), foot: stairFoot(44.8087489, 41.6931606) },
  { id: 'east-south', apex: stairFoot(44.8085259, 41.6929964), foot: stairFoot(44.8087486, 41.6928497) },
];
export const STAIR_WIDTH = 3.2;
// Deck stations of the two A-frame piers (estimated; two piers at the banks, per Wikipedia).
export const PIERS = [38, LENGTH - 37];
