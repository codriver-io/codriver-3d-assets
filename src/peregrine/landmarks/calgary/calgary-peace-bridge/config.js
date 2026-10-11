import { BEARING, DIM } from './calgary-peace-bridge-site.js';

// Peace Bridge (Santiago Calatrava, opened 24 March 2012), the pedestrian and cycle bridge over the Bow River
// between Eau Claire / downtown and Sunnyside. Free-standing: it carries no road, so the Calgary layer draws it
// like a building (footprint ring replaced, no road layer). A 126 m tube-girder span, 130.6 m out to out, with
// no pier in the river: a red double-helix steel truss wrapped around the deck, a glazed roof, reinforced-concrete
// abutments on both banks.
export const SPEC = {
  id: 'calgary-peace-bridge', name: 'Peace Bridge', kind: 'bridge',
  ready: true, // near/far GLBs exported, verified and catalogued
  origin: [-114.0789103, 51.0539135], // mid-span: the middle node of the mapped cycleway (OSM way 158753074), the centre of the mapped outline
  height: Math.round(DIM.topY * 100) / 100, // m above the walking surface's grade: top of the tubes
  padM: 75, // covers the 130.6 m structure; the default disc is NOT used in Full 3D world (see terrainPad)
  frontageBearing: BEARING, // bridge axis toward the south-east end, from the mapped cycleway's end nodes
  // Full 3D world: the river channel is lower than both banks, so a disc would flatten the banks down to the
  // lowest river sample. Instead one small ring per abutment (the landing: 62 to 80 m from mid-span, 16 m wide)
  // is levelled to the median DEM over both rings; the deck spans the valley between them and nothing else is
  // flattened. Terrain is drawn on a lattice of about 30 m, hence the 18 m length past the abutment face.
  terrainPad: {
    rings: [
      [[-114.0782312, 51.0535486], [-114.0780587, 51.0534286], [-114.0782283, 51.0533322], [-114.0784008, 51.0534522]], // south-east landing (Sunnyside bank)
      [[-114.0795923, 51.0544947], [-114.0794198, 51.0543748], [-114.0795894, 51.0542784], [-114.0797619, 51.0543984]], // north-west landing (Eau Claire bank)
    ],
    datum: 'median', featherM: 12,
  },
};

// Same keys in both themes. steel = the red-painted double helix, hoops and under-deck girder; glow = the roof
// glazing (drawn unshaded: blue-grey sky reflection by day, lit warm white at night as the real roof is); deck = the concrete
// walking surface; concrete = abutments and landing parapets; rail = stainless handrails, posts and the silver
// bars through the roof diamonds; marking = white lane lines.
export const PALETTES = {
  light: { steel: '#d0212f', glow: '#8ba4b5', deck: '#b9b6ad', concrete: '#a9a69d', rail: '#c8ccd0', marking: '#f0eee6' },
  dark: { steel: '#8f1f2c', glow: '#ffeccb', deck: '#5b6169', concrete: '#6a7077', rail: '#8a929a', marking: '#a3a9ae' },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 is the provider footway grade on the flat Peregrine basemap (both banks, and the deck: the real deck is several metres above the water, which the flat map does not show). The walking surface is 5 cm above it so the two never fight; the tube ring reaches 1.9 m below the deck and the abutments 2.9 m below grade; nothing is lower. No absolute altitude, terrain or sea level is baked in. Full 3D world uses an explicit terrain pad (one small ring per abutment, median datum), not a disc.',
  attribution: 'Original procedural mesh. Mapped alignment and outline © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Sourced (Wikipedia, Peace Bridge): single span, tube girder 126 m, 130.6 m out to out, 5.85 m total height, 6.2 m inside width (3.7 m pedestrian + 2.5 m cycleway), helical steel structure with a glass roof, no pier in the river, concrete abutments, opened 2012. Mapped (OSM ways 158753074, 1313657677 and the footways): axis bearing 137.88 deg, origin at mid-span, 7.25 m outline width, a central two-lane cycleway between two one-way footways. Estimated from Commons photographs: the elliptical ring section (7.3 x 5.85 m), tube radii (strands 0.25 m near and 0.35 m far, with their centre line set inside that of the hoops so every tube keeps the 7.25 x 5.85 m envelope; hoops 0.18 m), 6 + 6 strands with a 37.8 m pitch (diamonds 6.3 m long), hoops at every other node plane, the glazed-roof layout (the whole upper arc from 30 to 150 degrees round the ring, down to the shoulders; below the rail the sides are open), rail height, lane markings, the abutment mass and landings. The roof glass is opaque in the app (no transparency): blue-grey by day, so it does not read as a white spine. Some glass panels were replaced by steel cables from 2023; the model shows the original glazed roof.',
};
