// Site frame for the Toronto-Dominion Centre: everything the geometry needs about
// WHERE the buildings stand, derived from the mapped footprints (footprint.js) so
// the model and the provider extrusions it replaces can never drift apart.
//
// Local frame (metres): +X east, +Z south, origin = SPEC.origin. Each building is
// an oriented rectangle: centre (cx, cz), `a` = angle of its LONG axis in the XZ
// plane (u = (cos a, sin a)), long side L, short side W. Toronto's grid is turned
// ~16.5 degrees from true north; every rectangle here is fitted to its own mapped
// outline, not to the grid.
import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';
import { SPEC } from './config.js';
import { FOOTPRINTS } from './footprint.js';

const stretch = mercStretch(SPEC.origin[1]);
const ox = lngToMercX(SPEC.origin[0]), oz = -latToMercY(SPEC.origin[1]);
export const local = ([lng, lat]) => [(lngToMercX(lng) - ox) / stretch, (-latToMercY(lat) - oz) / stretch];

/** Minimum-area oriented rectangle of a ring of local points. */
export function fitRect(points) {
  let best = null;
  for (let deg = 0; deg < 180; deg += 0.05) {
    const t = deg * Math.PI / 180, c = Math.cos(t), s = Math.sin(t);
    let u0 = Infinity, u1 = -Infinity, v0 = Infinity, v1 = -Infinity;
    for (const [x, z] of points) { const u = x * c + z * s, v = -x * s + z * c; u0 = Math.min(u0, u); u1 = Math.max(u1, u); v0 = Math.min(v0, v); v1 = Math.max(v1, v); }
    const area = (u1 - u0) * (v1 - v0);
    if (!best || area < best.area) best = { area, t, u0, u1, v0, v1 };
  }
  const { t, u0, u1, v0, v1 } = best, c = Math.cos(t), s = Math.sin(t);
  const cu = (u0 + u1) / 2, cv = (v0 + v1) / 2;
  let L = u1 - u0, W = v1 - v0, a = t;
  if (W > L) { [L, W] = [W, L]; a = t + Math.PI / 2; }
  return { cx: cu * c - cv * s, cz: cu * s + cv * c, a: ((a % Math.PI) + Math.PI) % Math.PI, L, W };
}

const rings = FOOTPRINTS.map((ring) => ring.map(local));
// FOOTPRINTS order (see footprint.js): bank, north, north part, pavilion, west, west part, south.
const [bankRing, northRing, , pavilionRing, westRing, , southRing] = rings;

/**
 * Tower schedule. Heights are mapped/published; the lobby and crown are
 * estimates that make every tower add up to its published height:
 *   H = lobby + typical floors x 3.66 m + mechanical bands + crown.
 * `bands` are windowless louvered mechanical floors: [floors of glazing below
 * the band, band height in m], counted from the lobby roof upward. The typical
 * floor count is what remains, so the crown height is the closing term.
 */
const LOBBY = 8.0; // two storeys of glazing behind the colonnade, to the underside of the transfer beam
const tower = (id, name, ring, H, bands, extra = {}) => {
  const rect = fitRect(ring), f = SPEC.floorToFloor;
  const bandTotal = bands.reduce((n, b) => n + b[1], 0);
  const glazedFloors = bands.reduce((n, b) => n + b[0], 0) + (extra.topFloors ?? 0);
  const crown = H - LOBBY - glazedFloors * f - bandTotal;
  return { id, name, ...rect, H, bands, topFloors: extra.topFloors ?? 0, crown, lobby: LOBBY, logos: extra.logos ?? [] };
};

export const TOWERS = [
  // TD Bank Tower: 222.86 m, 56 storeys. Three mechanical bands (storeys ~11-12, ~30-32, ~44-45)
  // and a louvered crown; positions read from photographs.
  tower('bank', 'TD Bank Tower', bankRing, 222.86, [[9, 7.32], [14, 7.32], [17, 7.32]], {
    topFloors: 9,
    logos: [{ face: 'north', at: 0.86 }, { face: 'south', at: 0.14 }],
  }),
  // TD North Tower (Royal Trust Tower): 182.88 m, 46 storeys. Plain grid, louvered crown, TD sign.
  tower('north', 'TD North Tower', northRing, 182.88, [], { topFloors: 44, logos: [{ face: 'east', at: 0.5 }] }),
  // TD West Tower: 128.02 m, 32 storeys.
  tower('west', 'TD West Tower', westRing, 128.02, [], { topFloors: 30, logos: [] }),
  // TD South Tower: 153.57 m, 39 storeys, across Wellington Street.
  tower('south', 'TD South Tower', southRing, 153.57, [], { topFloors: 37, logos: [] }),
];

// Pavilion heights are above street grade: floor = plinth, 7.6 m clear to the roof-beam soffit, 1.7 m deep
// perimeter fascia (both estimated from a 1973 photograph, columns on a 3.048 m / 10 ft pitch).
export const PAVILION = { ...fitRect(pavilionRing), bay: 3.048, soffit: SPEC.plinth + 7.6, fascia: 1.7, top: SPEC.plinth + 7.6 + 1.7 };

/**
 * The raised granite plaza: the convex hull of the Bank, North, West towers and the
 * Pavilion, pushed out by a per-edge margin (a few metres toward King, a wider skirt
 * toward Bay and Wellington). Margins are estimates from photographs; the streets
 * themselves are not modelled.
 */
const corners = (r) => [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([i, j]) => {
  const c = Math.cos(r.a), s = Math.sin(r.a), u = i * r.L / 2, v = j * r.W / 2;
  return [r.cx + u * c - v * s, r.cz + u * s + v * c];
});
export const rectCorners = corners;
function hull(points) {
  const p = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower = [], upper = [];
  for (const q of p) { while (lower.length > 1 && cross(lower[lower.length - 2], lower[lower.length - 1], q) <= 0) lower.pop(); lower.push(q); }
  for (const q of [...p].reverse()) { while (upper.length > 1 && cross(upper[upper.length - 2], upper[upper.length - 1], q) <= 0) upper.pop(); upper.push(q); }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}
// Street directions of the grid the towers sit on (unit vectors in X,Z).
const grid = fitRect(bankRing);
/** Offset a convex polygon (CCW in screen/XZ order as produced by hull) by a per-edge distance. */
export function offsetConvex(poly, distanceFor) {
  const n = poly.length, lines = [];
  // hull() yields counter-clockwise order in (x, z) axes, so the outward normal is (dz, -dx).
  for (let i = 0; i < n; i++) {
    const a = poly[i], b = poly[(i + 1) % n], dx = b[0] - a[0], dz = b[1] - a[1], len = Math.hypot(dx, dz);
    const nx = dz / len, nz = -dx / len, d = distanceFor([nx, nz]);
    lines.push({ p: [a[0] + nx * d, a[1] + nz * d], d: [dx / len, dz / len] });
  }
  return lines.map((l, i) => {
    const m = lines[(i + n - 1) % n], det = m.d[0] * -l.d[1] + m.d[1] * l.d[0];
    const rx = l.p[0] - m.p[0], rz = l.p[1] - m.p[1], t = (rx * -l.d[1] + rz * l.d[0]) / det;
    return [m.p[0] + m.d[0] * t, m.p[1] + m.d[1] * t];
  });
}

// Grid directions from the Bank Tower's long axis: `along` runs ENE (King Street), `across` SSE (Bay Street).
const along = [Math.cos(grid.a), Math.sin(grid.a)];
if (along[0] < 0) { along[0] *= -1; along[1] *= -1; }
const across = [-along[1], along[0]];
if (across[1] < 0) { across[0] *= -1; across[1] *= -1; }
const margin = { north: 4.5, east: 8.0, south: 8.0, west: 7.0 };
const dot = (n, v) => n[0] * v[0] + n[1] * v[1];
function plazaMargin(n) {
  const w = { north: Math.max(0, -dot(n, across)), east: Math.max(0, dot(n, along)), south: Math.max(0, dot(n, across)), west: Math.max(0, -dot(n, along)) };
  const total = w.north + w.east + w.south + w.west || 1;
  return (w.north * margin.north + w.east * margin.east + w.south * margin.south + w.west * margin.west) / total;
}
export const PLINTH = offsetConvex(hull([bankRing, northRing, pavilionRing, westRing].flatMap((ring) => corners(fitRect(ring)))), plazaMargin);
export const GRID = { along, across };

// The south tower sits on its own low platform across Wellington Street.
export const SOUTH_PLATFORM = corners({ ...TOWERS[3], L: TOWERS[3].L + 10, W: TOWERS[3].W + 10 });

// Lawns mapped in OSM (ways 177602017 and 177602018, "The Pasture"): the grass between the towers.
export const LAWNS = [
  [[-79.3820109, 43.6474863], [-79.3816792, 43.6475576], [-79.3815538, 43.6472523], [-79.3818856, 43.647181]],
  [[-79.3822402, 43.647219], [-79.3820098, 43.6472681], [-79.3821576, 43.6476317], [-79.382388, 43.6475827]],
].map((ring) => ring.map(local));

export const FOOTPRINT_RINGS_LOCAL = rings;
