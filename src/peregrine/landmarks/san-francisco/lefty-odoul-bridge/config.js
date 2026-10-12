import { BEARING } from './lefty-odoul-bridge-site.js';

// Lefty O'Doul Bridge (the Third Street Bridge, formerly the China Basin Bridge), 1933: Strauss
// heel-trunnion single-leaf bascule carrying Third Street over the Mission Creek channel beside Oracle
// Park, San Francisco. FREE-STANDING (docs/3d-san-francisco-landmarks.md, "Roads and bridges"):
// Through trusses, raised counterweights, railings, houses and an embedded fallback street slab.
// The provider retains Third Street pavement/paint; the fallback top is local y=0.
export const SPEC = {
  id: 'lefty-odoul-bridge', name: "Lefty O'Doul Bridge (Third Street Bridge)", kind: 'bridge',
  ready: true, // near/far GLBs exported, verified and catalogued
  origin: [-122.390281, 37.776798], // on the roadway centre line, 8 m from the leaf centre toward the heel end: the middle of the structure (mapped OSM bridge way 1088314479 and carriageways)
  height: 25.8, // m above the road to the top of the lamp masts on the heel frames' apex platforms
  padM: 52, // covers the 90 m long structure (houses at the south-east end, counterweight tail at the north-west end)
  frontageBearing: BEARING, // axis bearing toward the heel/tower end, from the mapped carriageways (327.4 to 327.6)
  footprintless: true, // a bridge: no building extrusion to replace except the two small operator/watchman houses (FOOTPRINTS)
};

// Same keys in both themes. steel = muted grey-green riveted steel and railings; concrete = counterweights;
// house = the operator's house in oxblood red panels; trim = verdigris-green copper roof, mullions and
// window frames; cream = the watchman's hut walls; glass = the operator's cab; lamp = bridge lamps
// (drawn unshaded: they stay lit at night).
export const PALETTES = {
  light: { steel: '#78877e', concrete: '#9b978d', house: '#7b2c30', trim: '#3f806d', cream: '#e3dbc2', glass: '#507f80', asphalt: '#636b70', lamp: '#fff1c2' },
  dark: { steel: '#82948c', concrete: '#878580', house: '#7e3340', trim: '#40786a', cream: '#aaa48f', glass: '#40686c', asphalt: '#46545f', lamp: '#ffd98a' },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 is the pavement of Third Street on the flat Peregrine basemap (the real roadway is about 5 m above the channel water). The near fallback carriageway top clears grade by 0.20 m in the interior and tapers to y=0 at both street joints; far top is inset at -0.20 m, with the slab embedded to -0.55 m; structural steel stays above grade. The hanging fenders, piers and channel are not modelled. No absolute altitude, terrain or sea level is baked in.',
  attribution: 'Original procedural mesh. Mapped placement and the two house outlines © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Free-standing closed bridge with continuous street-grade fallback carriageway (traffic open, leaf down); dedicated road fitting remains a separate integration. Sourced: 1933 Strauss heel-trunnion single-leaf bascule; 295 ft (89.9 m) overall, 143 ft (43.6 m) Pratt through-truss leaf, 71.5 ft roadway, 1 main and 5 fixed approach spans; roadway cantilevered out beyond the western truss line (HistoricBridges.org), so the two truss planes are not symmetric about the road (west plane V -6.7, east +10.2, pulled inboard so that no low steel enters the mapped westernmost lane or the cycle track); concrete counterweights on the north (ballpark) heel end; operator house and watchman hut on the south-east piers; axis bearing 327.5 deg, 44.6 m leaf and 24.5 m width from the mapped OSM bridge way, lane centre lines from the OSM carriageways. Estimated from photographs: every height above the road (top chord 8.8 m, heel knuckle 22.8 m, counterweights 6.3 to 17.6 m, tower column 18 m), the heel frame and tail-truss layout, the 8 x 10.5 x 3.6 m block size, member sizes, panel count (10), house sizes and details, railings, lamps, colours. The leaf cannot be shown raised.',
};
