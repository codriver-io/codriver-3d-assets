// Union Station, 65 Front Street West, Toronto: the 1927 Beaux-Arts headhouse of
// Ross & Macdonald (with the CPR's Hugh Jones and John M. Lyle), the train sheds behind it
// and the 2010s glass atrium. See docs/3d-toronto-union-station.md for sources, the
// dimension table and what is estimated.
export const SPEC = {
  id: 'union-station', name: 'Union Station', kind: 'building',
  ready: true, // near/far GLBs exported, verified and catalogued
  // Anchor: the middle of the 228 m headhouse along Front Street (pavilion end to pavilion
  // end, measured from OSM parts 290168044 / 290168047) and 8 m behind the pavilion fronts.
  origin: [-79.3806289, 43.645219],
  // Highest point: the ridge of the Great Hall's hipped copper roof, OSM way 290168042
  // (height 32.5, roof:height 6). Local grade y = 0 is Front Street's pavement.
  height: 32.5,
  // Disc round the origin that Full 3D world flattens to the datum: the whole complex runs
  // 355 m along the rail corridor and 155 m deep, so the farthest corner (the east shed) is
  // ~215 m out.
  padM: 215,
  // Bearing the colonnaded front faces (north-north-west, toward Front Street and the Royal York).
  frontageBearing: 343.65,
  // Bearing of the facade's long axis (Front Street, +u), measured from the long edges of the OSM
  // outline (73.25-73.9 degrees). Toronto's grid is ~16 degrees off true north.
  axisBearing: 73.65,
};

// Same keys in light and dark. Dark is the night look: dimmer stone, warmer lit glass.
// `glow` is drawn unshaded by the layer (the Great Hall's arched windows and clerestory lights).
export const PALETTES = {
  light: {
    stone: '#e4d6bc', base: '#a89f90', copper: '#527f76', roof: '#a3a29b', glass: '#4b585a',
    bronze: '#66a493', metal: '#3a3c3b', glow: '#566466', brick: '#8d7262', shed: '#c9c9c2', atrium: '#93b4b9',
  },
  dark: {
    stone: '#9a9a9c', base: '#60646a', copper: '#38574f', roof: '#5b5f63', glass: '#2b373c',
    bronze: '#40706a', metal: '#2a2d30', glow: '#ffd58a', brick: '#524646', shed: '#6c7176', atrium: '#41626b',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 is Front Street pavement on the flat Peregrine basemap; no absolute altitude. The train sheds stand at the same y=0 datum although the real platforms lie a few metres below Front Street.',
  attribution: 'Original procedural mesh. Mapped footprint and building parts © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Headhouse heights (columns 12 m, entablature 19 m, wings and pavilions 17 m, Great Hall walls 26.5 m, copper hip to 32.5 m) and plan come from the mapped OSM building parts; window rows, bay counts, arch sizes, cornice profiles, the moat parapet and everything behind the headhouse (rear range, shed and atrium heights) are estimates from photographs. No interior.',
};
