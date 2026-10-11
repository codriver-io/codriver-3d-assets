// Canadian Museum of History / Musée canadien de l'histoire, 100 rue Laurier, Gatineau, Québec: Douglas Cardinal (opened
// 1989 as the Canadian Museum of Civilization), 75,000 m2. Two wings on the Ottawa River facing Parliament Hill: the southern
// public wing (the glass-fronted Grand Hall behind a colonnade of flared stone piers, copper-green domes) and the northern
// curatorial wing (a cascade of stepped, curving stone terraces). Both are layered, wave-like bands of buff Tyndall-type
// limestone under verdigris copper roofs. See docs/3d-quebec-canadian-museum-of-history.md for sources and what is estimated.
import { FOOTPRINTS } from './footprint.js';

export const SPEC = {
  id: 'canadian-museum-of-history', name: "Musée canadien de l'histoire", kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  // Area-weighted centroid of the two mapped wings (OSM ways 68588595 and 68588601), in the gap between them. Local grade
  // y = 0 is the museum's perimeter/plaza level; the river bank slope and the lawns are not modelled.
  origin: [-75.7089431, 45.4296195],
  // Highest point: the crown of the west dome of the public wing, 27 m (OSM height=27 on the way, and the dome part's top).
  height: 27,
  // The two wings are 320 m apart end to end (curatorial NW end 195 m from the origin); Full 3D world uses terrainPad.
  padM: 200,
  // The Grand Hall's glazed colonnade looks east-north-east over the river towards the Alexandra Bridge and Parliament Hill:
  // outward normal bearing 38 to 65 degrees along the arc; rotation is baked in (the plan is the mapped outline).
  frontageBearing: 52,
  // The site slopes to the Ottawa River and the two wings stand at different ground levels, so the default disc (which takes
  // the lowest DEM sample under 200 m) would sink the building. Hold both footprints at their median ground instead.
  terrainPad: { rings: FOOTPRINTS, datum: 'median', featherM: 14 }, // Full 3D world only; Cityscape is flat and ignores it
};

// Same keys in light and dark. Light is day, dark is night. `glow` is drawn unshaded: the Grand Hall's glass wall (a dark
// blue-grey glass by day, a warm lit hall at night, as in the evening photographs).
export const PALETTES = {
  light: {
    stone: '#c8ba9a', stoneLight: '#d6caae', stoneDark: '#b8a987', roof: '#8e8a81',
    copper: '#495f4a', copperDark: '#344c38', glass: '#415b67', glow: '#4b6674', frame: '#39444a',
  },
  dark: {
    stone: '#9c9381', stoneLight: '#ada492', stoneDark: '#887f6e', roof: '#55534f',
    copper: '#2f4533', copperDark: '#25382a', glass: '#141f26', glow: '#f0b362', frame: '#1c2327',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap (the museum perimeter and plaza level, about 55 to 60 m above sea level on the public DEM); no absolute altitude. The river bank, the lawns and the site slope are not modelled. Tops: Grand Hall roof 14 m, west dome 27 m, curatorial terraces 4.5 to 15 m. Full 3D world uses an explicit terrain pad (terrainPad) under both mapped outlines.',
  attribution: 'Original procedural mesh. Mapped outlines and building:part heights © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Both wing outlines (OSM ways 68588595 and 68588601) and the 17 building:part plans and heights that tile them are mapped; the 27 m overall height is OSM. The colonnade pier pitch and flare, the glass wall inset, the cornice layering and its waves, the dome skirt and rise split, the copper roofs of the curatorial top terrace and every window position are estimated from photographs. No landscaping, river wall, interior, sculpture or signage.',
};
