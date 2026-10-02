import alignment from './reconciliation-bridge-alignment.js';
import { createBridgeProfile } from '../../bridge-profile.js';
import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';
import { SPEC, PALETTES } from './config.js';

// One metric frame for the bridge: station s runs NORTH to SOUTH along the alignment (the direction of
// travel: the truss carries southbound 4 Street NE / Edmonton Trail traffic into downtown on OSM way
// 257636719, one-way), lateral d is positive to the RIGHT of travel (west, upstream). The alignment is
// the mapped roadway plus EXT metres of the mapped approach roads beyond each abutment, so the deck,
// its abutments and the HD pavement joint are one surface. Geometry, the car, the route, the camera and
// the HD pavement share it (bridge-profile.js).

/** Panels per truss (HistoricBridges.org: "8 Panel Rivet-Connected Parker Through Truss"). */
export const PANELS = 8;
/** Panel length: the published 190 ft (57.9 m) span over 8 panels, rounded so 2 spans + pier = 116.4 m (published 116.58 m). */
export const PANEL = 7.2;
export const SPAN = PANELS * PANEL;
/** Gap between the two trusses' end bearings over the pier (estimated). */
export const PIER_GAP = 1.2;
/** How far the alignment runs out along the mapped approach roads beyond each end of the mapped bridge way. */
export const EXT = 5;

/**
 * Lateral layout (m, + = right of travel = west), from the published 14.02 m overall width and 1.5 m
 * sidewalks (City of Calgary heritage inventory) and the mapped outline (-7.7 .. +7.1 about the road way).
 * The structure is centred 0.3 m east of the mapped road way, on the mapped outline.
 */
export const C0 = -0.3;
export const HALF = 7.0;          // half the overall width (14.0 m)
export const TRUSS_D = 5.0;       // truss centre lines at C0 +/- 5.0 (10.0 m apart)
export const KERB_D = 4.1;        // kerb to kerb 8.2 m: two southbound lanes and shoulders
export const WALK_IN = 5.35, WALK_OUT = 6.85; // the 1.5 m steel sidewalks outside the trusses
export const ROAD_EDGES = [[C0 - KERB_D, C0 + KERB_D]];

/**
 * Truss depth (bottom chord to top chord centre lines) at panel points L0..L8 / U1..U7, estimated from a
 * perspective fit of a near side elevation (Commons, "Calgary, April 2016 (19)"): the Parker camelback
 * profile, hip at 0.71 of the centre depth, U2 at 0.9, U3..U5 at 0.98..1.0. Not published.
 */
export const DEPTH = [0, 7.8, 9.9, 10.8, 11.0, 10.8, 9.9, 7.8, 0];
/** Bottom chord centre line below the road surface (the floor system hangs below it). */
export const CHORD_Y = -0.15;
/** Lowest member over the roadway (portal and sway bracing) above the road surface. The signed clearance is
 * 4.2 m (OSM maxheight); the model keeps >= 5 m over the carriageway so the chase camera never clips. */
export const CLEAR = 5.0;

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
// North: 4 Street NE runs INTO the bridge's first node; walk it backwards from that node.
const north = head([...alignment.road.north].reverse(), EXT), south = head(alignment.road.south, EXT);
const centerline = [...north.slice(1).reverse(), ...bridge, ...south.slice(1)];

/** The mapped bridge way as stations on the whole alignment. */
export const STRUCTURE_START = EXT;
export const STRUCTURE_END = EXT + STRUCTURE_M;
/** The river pier, centred on the mapped bridge way (published: one pier, two equal spans). */
export const PIER_S = EXT + STRUCTURE_M / 2;
/** The two trusses' bottom-chord ends [L0, L8] in stations (north span first). */
export const SPANS = [[PIER_S - PIER_GAP / 2 - SPAN, PIER_S - PIER_GAP / 2], [PIER_S + PIER_GAP / 2, PIER_S + PIER_GAP / 2 + SPAN]];
/** Abutment bearing faces: 0.6 m behind each outer truss end. */
export const ABUT_S = [SPANS[0][0] - 0.6, SPANS[1][1] + 0.6];

export const PROFILE = createBridgeProfile({
  id: SPEC.id, name: SPEC.name, origin: SPEC.origin, modelDir: 'bridges',
  // Full 3D world: no corridor flattening (a trench along the approach streets would be a defect). The
  // deck keeps its authored offset above the line between the two approach roads' ground, never dips
  // below the DEM, and the pier and abutments reach their own ground (bridge-layer.js).
  terrainPolicy: 'absolute-deck',
  width: 2 * (HALF - C0), roadEdges: ROAD_EDGES, centerline,
  palette: PALETTES.light,
  // The real deck is at the level of the banks' streets: on the flat Cityscape map it is level with the
  // approach roads, easing from one loaded approach height to the other. No flat-map ramp.
  profile: ({ length }) => [[0, 'start'], [length, 'end']],
});

export default PROFILE;
