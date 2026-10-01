import alignment from './bay-bridge-west-span-alignment.js';
import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC, PALETTES } from './config.js';

// One metric frame for the West Span: station s runs west to east (San Francisco to Yerba Buena
// Island) along the structure axis, lateral d is positive to the RIGHT of eastward travel (south-east).
// The axis is the mapped westbound I-80 (OSM 8921938 and its SoMa approach and island ways) moved
// 1.4 m right, onto the centre of the mapped supports; the mapped eastbound way runs 3.4 m right of
// the westbound one, so both directions lie on it within 2 m. Geometry, the car, the route, the
// camera and the HD road all share this frame (bridge-profile.js).
//
// The bridge is a DOUBLE deck: the UPPER deck carries westbound traffic (travel toward -s), the
// LOWER deck eastbound (+s). `deckHeight(s)` is the upper road surface; `deckOffset(s, direction)`
// (the optional double-deck contract of bridge-profile.js) lowers it for eastbound travel.

const smooth = (t) => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };

// ---- Published / mapped facts (HAER CA-32, Wikipedia) -------------------------------------------
/** Side and main spans, centre to centre of the towers (1160 ft and 2310 ft). */
export const SIDE_SPAN = 353.6;
export const MAIN_SPAN = 704.1;
/** Stiffening truss: 66 ft between truss centres, 35 ft deep. */
export const TRUSS_HALF = 10.06;
export const TRUSS_DEPTH = 10.67;
/** Tower tops above low water: W2/W6 458 ft, W3/W5 502 ft. Steel base plates 40 ft above low water. */
export const TOWER_TOP = { W2: 139.6, W3: 153.0, W5: 153.0, W6: 139.6 };
export const TOWER_BASE = 12.2;
/** Two 26 in cables (about 0.73 m with wrapping), one over each truss. */
export const CABLE_R = 0.37;

// ---- Estimated deck elevations (upper road surface, metres above low water) ----------------------
// From the published 220 ft (67 m) clearance at the main spans plus the 35 ft truss (77.5 m at mid
// main span), and the 13.4 m height difference of the inner and outer towers over a 704 m span
// (a 1.9 % grade with the towers equally tall above the deck). The deck crowns at W4.
export const DECK = { W2: 70.3, W3: 83.7, W4: 88.0, W5: 83.7, W6: 70.3 };
/** Upper to lower road surface (estimate: the lower deck runs just above the bottom chords). */
export const GAP = 9.0;
/** Kerb to kerb on each deck: five lanes, 57.5 ft (17.5 m). */
export const KERB = 8.75;
/** Upper deck at the San Francisco anchorage on the flat map (see the ramp note below). */
export const DECK_SF_ANCHORAGE = 30;

/** Both carriageways' HD pavement, mapped ±1.7 m off the axis, five 3.6 m lanes each. */
export const ROAD_EDGES = [[-10.7, 10.7]];

const STATIONS = Object.fromEntries(alignment.supports.map((v) => [v.label === 'sf-anchorage' ? 'SFA' : v.label, v.centroid]));

/**
 * Flat-map ramps (docs/3d-san-francisco-bay-bridge-west-span.md). The basemap has no Rincon Hill and no
 * Yerba Buena Island relief, so the upper deck rises from the SoMa approach road ('start', 0 on the
 * flat map, the HD viaduct height in production) over the mapped viaduct to the San Francisco
 * anchorage, then on one smooth curve over W1 to tower W2, and leaves tower W6 on one smooth curve to
 * the tunnel's east portal ('end'). Between W2 and W6 it follows the estimated real profile.
 */
export const PROFILE = createBridgeProfile({
  id: SPEC.id, name: SPEC.name, origin: SPEC.origin,
  // Half width 12: the truss (±10.1) and both carriageways' HD pavement. Supports and fenders are wider
  // but carry no road.
  width: 24, roadEdges: ROAD_EDGES, centerline: alignment.centerline,
  palette: PALETTES.light,
  stations: STATIONS,
  // Full 3D world: authored above the bay at low water, so no corridor flattening; supports reach their
  // ground and only the 'start'/'end' ramps take the DEM at the alignment ends (bridge-layer.js).
  terrainPolicy: 'absolute-deck',
  // The provider extrudes the mapped towers (building=tower, 160 m) and W4 (building=anchorage) as
  // boxes; the bridge layer masks them while the model is drawn.
  buildingFootprints: alignment.supports.filter((v) => /^W[2-6]$/.test(v.label)).map((v) => v.ring),
  profile: ({ length, SFA, W2, W3, W4, W5, W6 }) => [[0, 'start'], [SFA, DECK_SF_ANCHORAGE], [W2, DECK.W2], [W3, DECK.W3], [W4, DECK.W4],
    [W5, DECK.W5], [W6, DECK.W6], [length, 'end']],
  deckOffset: (s, direction) => (direction > 0 ? lowerOffset(s) : 0),
  // While the followed car is on the lower deck the upper road, its paint and slab fade (bridge-layer.js).
  upperDeck: { materials: ['asphaltUpper', 'paintUpper', 'deckUpper'], pavement: 'asphaltUpper', opacity: 0.2 },
});

// Own only the deck corridor (half width + 4 m): parallel SoMa streets and the separate eastbound
// approach stay provider roads until they reach the deck (bridge-roads.js reads this off the profile).
PROFILE.ownershipMargin = 4;
export const L = PROFILE.BRIDGE_LENGTH;
export const S = PROFILE.landmarks;   // SFA, W1 .. W7: stations of the mapped supports
export const S_WEST_PORTAL = PROFILE.stationAt(alignment.westPortal);
// Full 3D world: the Yerba Buena Island tunnel runs under the island's ground (absolute-deck keeps the
// deck below the DEM there instead of lifting it over the hill).
PROFILE.CHAMPLAIN.tunnels = [[S_WEST_PORTAL, L]];
/** The upper road surface, authored (flat map, approaches at 0). */
export const h = (s) => PROFILE.deckHeight(s);

// ---- The lower (eastbound) deck --------------------------------------------------------------------
// From San Francisco the mapped eastbound I-80 runs beside the westbound viaduct (36 m south at the
// alignment start) and slides under it toward the anchorage. It is at grade on the flat map until it
// enters the deck corridor (S_EB_IN), then climbs under the upper deck to its level in the truss at
// the San Francisco anchorage. At the island end it eases to the tunnel floor with the upper deck.
const ebLocal = alignment.ebApproach.map((p) => { const q = PROFILE.bridgeLocal(...p); const r = PROFILE.projectBridge(q.x, q.z); return { s: r.s, d: r.lateral }; })
  .filter((v, i, a) => !i || v.s > a[i - 1].s + 0.5);
/** Lateral of the mapped eastbound centreline at station s (west of the anchorage). */
export function ebLateral(s) {
  if (s <= ebLocal[0].s) return ebLocal[0].d;
  for (let i = 1; i < ebLocal.length; i++) if (s <= ebLocal[i].s) {
    const a = ebLocal[i - 1], b = ebLocal[i];
    return a.d + (b.d - a.d) * (s - a.s) / (b.s - a.s);
  }
  return ebLocal.at(-1).d;
}
function stationWhereEb(lateral) {
  for (let i = 1; i < ebLocal.length; i++) {
    const a = ebLocal[i - 1], b = ebLocal[i];
    if (a.d > lateral && b.d <= lateral) return a.s + (b.s - a.s) * (a.d - lateral) / (a.d - b.d);
  }
  return ebLocal[0].s;
}
/** Where the eastbound carriageway enters the deck corridor (its centre within the road edges). */
export const S_EB_IN = stationWhereEb(ROAD_EDGES[0][1] + 0.6);
/** Where the model starts drawing the eastbound approach (inside the owned corridor). */
export const S_EB_DRAW = stationWhereEb(PROFILE.halfWidth + PROFILE.ownershipMargin);
const LOWER_AT_SFA = DECK_SF_ANCHORAGE - GAP;

/** The lower road surface, authored. */
export function lower(s) {
  if (s <= S_EB_IN) return 0;
  if (s < S.SFA) return LOWER_AT_SFA * smooth((s - S_EB_IN) / (S.SFA - S_EB_IN));
  const up = h(s);
  // Full gap where the deck is high; toward the tunnel both decks reach the floor together.
  return up - GAP * smooth(up / (2 * GAP));
}
/** Lower minus upper road surface (negative): the double-deck offset the layer applies eastbound. */
export function lowerOffset(s) { return lower(s) - h(s); }

export default PROFILE;
