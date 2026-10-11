// Centre Bell (Bell Centre), 1909 avenue des Canadiens-de-Montréal, Montréal, Québec.
// Home of the Canadiens de Montréal (NHL), opened 16 March 1996 (as the Molson Centre), about 21 000 seats,
// the largest indoor arena in Canada; architects Lemay & Associés with LeMoyne Lapointe Magne, engineers Dessau.
// Sourced: the mapped plan (OSM way 19911284, 146 m x 107 m, 15 046 m2; Wikipedia gives 107 m x 146 m,
// 15 622 m2), its orientation (long edges at bearings 41 / 131 degrees, the downtown grid), the brick lower
// volume under a dark-glass upper band, the glazed entrance front on the north-east side facing Place des
// Canadiens, the sign tower with the blue "Centre Bell" lettering 20 m in from the north corner (Rue de la Gauchetière
// and Avenue des Canadiens-de-Montréal), the silver-clad south-east end on Rue Saint-Antoine. Estimated: every
// height (nothing is published: 47 m to the sign-tower top is read from photographs), the bands, the window
// rhythm, the sign size and every colour. See docs/3d-quebec-centre-bell.md.
export const SPEC = {
  id: 'centre-bell', name: 'Centre Bell', kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  // Area centroid of the mapped arena outline (OSM way 19911284).
  origin: [-73.5692786, 45.4960583],
  height: 47, padM: 95, // flat downtown site: the pad just covers the outline (corners lie 87 m from the origin)
  // Bearing (clockwise from north) of the glazed entrance front, which faces north-east to Place des Canadiens.
  frontageBearing: 41,
};
export const PALETTES = {
  light: {
    brick: '#ab684f', clad: '#a9a18d', metal: '#aab1b4', conc: '#989a97',
    dark: '#262e2b', band: '#41524c', frame: '#5d6c66', glass: '#b9c5cb', glow: '#9fb5bf',
    sign: '#2f62d8', lamp: '#2b3243',
  },
  dark: {
    brick: '#673f32', clad: '#68645a', metal: '#6a7176', conc: '#5b5e62',
    dark: '#1b2220', band: '#26332f', frame: '#2c3835', glass: '#42535d', glow: '#ffd9a0',
    sign: '#8fb3ff', lamp: '#cfe0ff',
  },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap (the street and plaza level round the arena); no absolute altitude. The 47 m to the top of the sign tower is an estimate over this grade.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'The plan and its bearing come from OpenStreetMap (way 19911284). No height is published: the 28 m brick volume, the 10 m dark-glass band, the 47 m sign tower, the window groups and mullion rhythm, the sign size and all colours are estimates from photographs. The sign tower stands 20 m in from the north corner at the north-west end of the glazed front, with glass on both sides; that position, its 47 m height and the grouping of the windows are read from the photographs, not surveyed. The arena\'s dark upper band overhangs the south-west notch in reality; the model keeps it inside the mapped outline. The Tour des Canadiens condominium towers beside the arena are separate buildings and are not modelled.',
};
