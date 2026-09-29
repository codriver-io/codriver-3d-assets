import alignment from './prince-edward-viaduct-alignment.js';
import { createBridgeProfile } from '../../bridge-profile.js';
import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';
import { SPEC, PALETTES } from './config.js';

// One metric frame for the viaduct: station s runs west to east along the alignment, lateral d is
// positive to the RIGHT of travel (south). The alignment is the mapped roadway (OSM way 4282643,
// 469.5 m) plus the mapped Bloor Street East (west) and Danforth Avenue (east) beyond its abutments,
// on which the flat-map ramps run out. Geometry, the car, the route, the camera and the HD pavement
// share it (bridge-profile.js).

/** Published clearance of the deck above the Don Valley floor (Wikipedia 40 m; 38 m elsewhere). */
export const DECK_H = 40;

/**
 * Flat-map convention (docs/3d-toronto-prince-edward-viaduct.md): the basemap has no valley, so the
 * deck rises from the approach roads (the 'start'/'end' datum measured from the loaded HD road) to
 * the published 40 m over RAMP metres, reaching it at the first pier and leaving it at the last, and
 * is level between. The ramps start on the mapped approach roads, not on the structure, so the
 * steepest grade is 1.5 * 40 / RAMP (35 % at 170 m). Visual choice, not survey.
 */
export const RAMP = 170;
export const RAMP_WEST = RAMP;
export const RAMP_EAST = RAMP;

/** Deck centre and half width across the roadway, from the OSM deck outline (lateral -12.0 .. +14.2). */
export const DECK_CENTER = 1.1;
export const DECK_HALF = 13.1;
/** Kerb to kerb: 3 eastbound lanes (right), 2 westbound (left), a 1.5 m bike lane each side. */
export const ROAD_EDGES = [[-9.2, 11.2]];
/** Two arch ribs at the deck centre plus/minus this. */
export const RIB_D = 6.3;

/**
 * The five steel arches use the PUBLISHED pin spans (CSCE). Piers are centred on the middle arch of
 * the mapped structure and spaced by span plus the pier's plan length at the springing; with a 7 m
 * pier they land within 2.7 m of the notches in the OSM deck outline.
 */
export const PIN_SPANS = [48.2, 73.6, 85.8, 73.6, 48.2];
export const PIER_BASE = 7.0;
const CENTRE_ON_STRUCTURE = 262.6;

// ---- The alignment: approach road, mapped bridge, approach road ---------------------------------
const K = mercStretch(SPEC.origin[1]);
const plane = ([lng, lat]) => [lngToMercX(lng) / K, latToMercY(lat) / K];
const gap = (a, b) => { const p = plane(a), q = plane(b); return Math.hypot(q[0] - p[0], q[1] - p[1]); };
const lengthOf = (line) => line.reduce((n, v, i) => n + (i ? gap(line[i - 1], v) : 0), 0);
/** The first `metres` of a polyline, cut exactly (linear in lng/lat between nodes). */
function head(line, metres) {
  const out = [line[0]]; let total = 0;
  for (let i = 1; i < line.length; i++) {
    const g = gap(line[i - 1], line[i]);
    if (total + g >= metres) { const f = (metres - total) / g; out.push(line[i - 1].map((v, k) => v + (line[i][k] - v) * f)); return out; }
    total += g; out.push(line[i]);
  }
  throw new Error(`approach road shorter than ${metres} m`);
}
const bridge = alignment.road.centerline;
export const STRUCTURE_M = lengthOf(bridge);
const centre = CENTRE_ON_STRUCTURE;
// Pier centres along the structure: outward from the middle arch.
const pierOnStructure = (() => {
  const c = PIN_SPANS.map((s) => s + PIER_BASE), mid = [centre - c[2] / 2, centre + c[2] / 2];
  const p2 = mid[0], p3 = mid[1], p1 = p2 - c[1], p0 = p1 - c[0], p4 = p3 + c[3], p5 = p4 + c[4];
  return [p0, p1, p2, p3, p4, p5];
})();
/** How far the alignment runs out beyond each abutment so that each ramp is exactly RAMP long. */
export const EXT_WEST = RAMP - pierOnStructure[0];
export const EXT_EAST = RAMP - (STRUCTURE_M - pierOnStructure[5]);
const west = head(alignment.road.west, EXT_WEST), east = head(alignment.road.east, EXT_EAST);
const centerline = [...west.slice(1).reverse(), ...bridge, ...east.slice(1)];

/** The mapped structure, and its piers, as stations on the whole alignment. */
export const STRUCTURE_START = EXT_WEST;
export const STRUCTURE_END = EXT_WEST + STRUCTURE_M;
export const PIER_S = pierOnStructure.map((s) => s + EXT_WEST);

export const PROFILE = createBridgeProfile({
  id: SPEC.id, name: SPEC.name, origin: SPEC.origin,
  // Half 14.2 covers the deck asymmetry about the mapped centreline (-12.0 .. +14.2).
  width: 2 * (DECK_HALF + DECK_CENTER), roadEdges: ROAD_EDGES, centerline,
  palette: PALETTES.light,
  // Cross streets and the Don Valley Parkway run under the deck at right angles; the default 0.8
  // heading test already refuses them.
  profile: ({ length }) => [[0, 'start'], [RAMP_WEST, DECK_H], [length - RAMP_EAST, DECK_H], [length, 'end']],
});

export default PROFILE;
