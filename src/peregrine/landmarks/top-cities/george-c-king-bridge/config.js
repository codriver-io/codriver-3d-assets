import { BEARING } from './george-c-king-bridge-site.js';

// George C. King Bridge ("Skipping Stone", RFR with Halsall/WSP, opened 20 October 2014): the 182 m pedestrian
// and cycle bridge over the Bow River between East Village (south) and Bridgeland (north), touching St Patrick's
// Island in the middle. Free-standing: it carries no road, so it is drawn like a building (footprint ring replaced,
// no road layer). Three network-arch spans of 99, 31 and 52 m, a pair of inclined steel arches over each, a gently
// arched deck, and crossing hangers between arch and deck.
export const SPEC = {
  id: 'george-c-king-bridge', name: 'George C. King Bridge', kind: 'bridge',
  ready: true, // near/far GLBs exported, verified and catalogued
  origin: [-114.0468962, 51.04825375], // mid-length: the middle of the two end nodes of the mapped cycleway (OSM way 206004051)
  height: 17.5, // m above the walking surface at the abutments: top of the tall south arch
  padM: 100, // covers the 182.6 m structure; the default disc is NOT used in Full 3D world (see terrainPad)
  frontageBearing: BEARING, // bridge axis toward the north end, from the mapped cycleway's end nodes
  // Full 3D world: the river and the island are lower than both banks, so a disc would flatten the banks down to the
  // lowest sample. Instead one small ring per abutment (the abutment face to 13 m beyond it, 11 m wide) is levelled
  // to the median DEM over both rings; the deck spans the valley between them and nothing else is flattened.
  terrainPad: {
    rings: [
      [[-114.0475045, 51.0473942], [-114.0473578, 51.0473583], [-114.0472652, 51.0475102], [-114.0474119, 51.047546]], // south landing (East Village bank)
      [[-114.0465272, 51.0489973], [-114.0463805, 51.0489615], [-114.0462879, 51.0491133], [-114.0464346, 51.0491492]], // north landing (Bridgeland bank)
    ],
    datum: 'median', featherM: 12,
  },
};

// Same keys in both themes. steel = the grey painted arches, girder and struts; deck = the pale concrete walking
// surface; rail = stainless handrails, posts and wires; cable = the thin crossing hangers; concrete = abutments, skewback blocks
// and pier columns. Nothing is self-lit (the real bridge has no lit feature worth a glow material).
export const PALETTES = {
  light: { steel: '#8c959d', deck: '#bdbab2', rail: '#c9cdd0', cable: '#a3aab0', concrete: '#aaa79f' },
  dark: { steel: '#59616a', deck: '#5f656c', rail: '#838b93', cable: '#6c747c', concrete: '#656a70' },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 is the provider footway grade on the flat Peregrine basemap at both ends. The walking surface is 5 cm above it at the abutments and rises to 1.0 m over the 99 m span, 0.35 m over the 31 m span and 0.6 m over the 52 m span (the skipping-stone profile); the real deck is several metres above the river, which the flat map does not show. Concrete skewback blocks, pier columns, ramp supports and abutments reach 2.95 m below grade (buried in Full 3D world, where the bank and island sit near the deck line); nothing is lower. The skewback blocks rise 1.0 m over grade so the arch feet stand on visible concrete. The island ramp descends from 0.3 m to 0.1 m over its 78 m. No absolute altitude, terrain or sea level is baked in. Full 3D world uses an explicit terrain pad (one small ring per abutment, median datum), not a disc.',
  attribution: 'Original procedural mesh. Mapped alignment and outline © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Sourced: pedestrian bridge over the Bow River, three spans, 182 m long (WSP, Wikipedia), network arches with inclined crossing hangers (WSP), arch spans 52 m north, 31 m centre and 99 m south (8th International Conference on Arch Bridges, 2016), steel and concrete, opened 2014. Mapped (OSM ways 206004051, 1328870003, 779639382): axis bearing 21.10 deg, origin at mid-length, 182.6 m outline about 8 m wide at the piers, the island ramp leaving the deck at the middle of the centre span. Estimated from Commons photographs (no published values): arch rises (17.5 / 6.6 / 10.8 m above the walking surface), the 8.0 m foot spacing and 3.2 to 4.8 m crown spacing (the arch pairs lean inward), elliptical box sections of about 0.9 x 0.7 m, the deck width (4.4 m), the deck rise per span, hanger count and the 60 deg crossing, the handrail with posts and two wires, the skewback blocks, pier columns, V struts, abutments and the ramp\'s width, heights and supports. The island ramp (OSM way 779639382, a mapped 78 m footway bridge) IS modelled along its mapped centre line, with the east rail of the centre span open where it leaves the deck. Arch colour is the silvery grey of the photographs, not the dark steel the form is sometimes described with.',
};
