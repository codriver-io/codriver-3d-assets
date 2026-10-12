// A’DAM Toren, completed 1971 / renovated 2016; mapped dimensions in the dossier.
export const SPEC = {
  id: 'adam-toren', name: "A'DAM Toren", kind: 'building', ready: true,
  origin: [4.9021043, 52.3838518], height: 99, padM: 62, frontageBearing: 234,
  shaftHeight: 64, lookoutY: 75, shaftWidth: 25.2, crownWidth: 32.4,
};
export const PALETTES = {
  light: { frame: '#4d5358', glass: '#537480', concrete: '#d2d2c9', roof: '#75797b', steel: '#282c30', red: '#a6312e', glow: '#637d87' },
  dark: { frame: '#282f36', glass: '#203d49', concrete: '#89959c', roof: '#3b454d', steel: '#313b46', red: '#812826', glow: '#d8b377' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid local grade y=0, east/up/south; no sea-level, DEM or Mercator stretch baked into geometry.',
  attribution: 'Original procedural mesh for Codriver. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'OSM: 64 m shaft, 70–75 m rotated crown, 99 m mast; architectural sources: 22 m circular restaurant and 1.75 × 3 m facade elements. 100 m visitor-height descriptions are approximate. Window grouping, roof equipment and static swing pose estimated from exterior photographs. Shaft bearing 9° and crown bearing 54° are baked into exports.',
};
